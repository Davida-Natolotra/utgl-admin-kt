import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { InputErrorsComponent } from 'app/common/input-row/input-errors.component';
import { OrganisationUnitService } from 'app/organisation-unit/organisation-unit.service';
import { OrganisationUnitTreeNode } from 'app/organisation-unit/organisation-unit.model';


interface VisibleNode {
  node: OrganisationUnitTreeNode;
  depth: number;
}

interface SelectedUnit {
  id: string;
  name: string;
  matched: boolean;
}

// keep each request's ids well under the server's max request-line/header size
const ID_CHUNK_SIZE = 200;

// cap how many name-search matches get auto-expanded/highlighted in the tree at once - an
// unbounded search (e.g. a common substring matching hundreds/thousands of units) would force
// open huge swaths of the tree, making it feel flat, and fire far more expand-path requests
const MATCH_LIMIT = 50;

/**
 * Row with a lazily loaded organisation unit tree (left column, virtual scrolled)
 * where multiple units can be checked, and the current selection listed as a
 * list group (right column, also virtual scrolled). The form control holds the
 * selected ids as a string array.
 */
@Component({
  selector: 'app-organisation-unit-tree-select',
  imports: [CommonModule, ReactiveFormsModule, ScrollingModule, InputErrorsComponent],
  templateUrl: './organisation-unit-tree-select.component.html'
})
export class OrganisationUnitTreeSelectComponent implements OnInit {

  @Input({ required: true })
  group?: FormGroup;

  @Input({ required: true })
  field = '';

  @Input({ required: true })
  label = '';

  organisationUnitService = inject(OrganisationUnitService);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);
  elRef = inject(ElementRef);
  readonly matchLimit = MATCH_LIMIT;

  control?: AbstractControl;
  roots?: OrganisationUnitTreeNode[];
  visibleNodes: VisibleNode[] = [];
  selected = new Set<string>();
  selectedList: SelectedUnit[] = [];
  names = new Map<string, string>();
  searchControl = new FormControl('');
  matchedIds = new Set<string>();
  levels?: number[];
  selectedLevel: number|null = null;
  levelMenuOpen = false;
  selectedSearchControl = new FormControl('');
  private selectedSearchQuery = '';
  private filterTrigger = new Subject<void>();

  // id -> node registry, shared across lazy toggling and batch path expansion so
  // both mechanisms reuse (and never clobber) the same node instances
  private nodeById = new Map<string, OrganisationUnitTreeNode>();
  private rootsReady = false;
  private pendingExpandIds: string[]|null = null;

  ngOnInit() {
    this.control = this.group!.get(this.field)!;
    this.selected = new Set(this.control.value || []);
    this.refreshSelectedList();
    this.resolveMissingNames();
    this.expandSelectedPaths();
    this.filterTrigger
        .pipe(
          switchMap(() => {
            // a level alone (no name text) would match thousands of units and force-expand
            // huge swaths of the tree at once, so require a name query to trigger a search
            const query = (this.searchControl.value || '').trim();
            if (query.length < 2) {
              return of(undefined);
            }
            return this.organisationUnitService.getParentValues(query, MATCH_LIMIT,
                    this.selectedLevel === null ? undefined : this.selectedLevel).pipe(
              catchError((error) => {
                this.errorHandler.handleServerError(error.error);
                return of(undefined);
              })
            );
          })
        )
        .subscribe((data) => {
          if (data === undefined) {
            this.matchedIds = new Set();
          } else {
            const ids = Object.keys(data);
            this.matchedIds = new Set(ids);
            for (const [id, name] of Object.entries(data)) {
              this.names.set(id, name);
            }
            this.refreshSelectedList();
            // reveal every match inside the tree itself (same mechanism used to reveal a
            // saved selection) instead of replacing the tree with an unindented flat list
            this.expandPaths(ids);
          }
          this.changeDetectorRef.markForCheck();
        });
    this.searchControl.valueChanges
        .pipe(debounceTime(250), distinctUntilChanged())
        .subscribe(() => this.filterTrigger.next());
    this.selectedSearchControl.valueChanges
        .pipe(debounceTime(250), distinctUntilChanged())
        .subscribe((value) => {
          this.selectedSearchQuery = (value || '').trim().toLowerCase();
          this.refreshSelectedList();
          this.changeDetectorRef.markForCheck();
        });
    this.organisationUnitService.getLevels()
        .subscribe({
          next: (data) => {
            this.levels = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.control.valueChanges.subscribe((value: string[]|null) => {
      this.selected = new Set(value || []);
      this.refreshSelectedList();
      this.resolveMissingNames();
      this.expandSelectedPaths();
      this.changeDetectorRef.markForCheck();
    });
    this.organisationUnitService.getTreeNodes()
        .subscribe({
          next: (data) => {
            this.roots = data.map((node) => this.getOrCreateNode(node));
            this.rootsReady = true;
            if (this.pendingExpandIds) {
              const ids = this.pendingExpandIds;
              this.pendingExpandIds = null;
              this.expandPaths(ids);
            }
            this.refreshVisibleNodes();
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  private getOrCreateNode(source: OrganisationUnitTreeNode): OrganisationUnitTreeNode {
    let node = this.nodeById.get(source.id);
    if (!node) {
      node = { id: source.id, name: source.name, level: source.level, childCount: source.childCount };
      this.nodeById.set(node.id, node);
    } else {
      node.name = source.name;
      node.level = source.level;
      node.childCount = source.childCount;
    }
    this.names.set(node.id, node.name);
    return node;
  }

  private registerNodes(nodes: OrganisationUnitTreeNode[]) {
    for (const node of nodes) {
      this.getOrCreateNode(node);
    }
  }

  private resolveMissingNames() {
    const missing = Array.from(this.selected).filter((id) => !this.names.has(id));
    for (let i = 0; i < missing.length; i += ID_CHUNK_SIZE) {
      const chunk = missing.slice(i, i + ID_CHUNK_SIZE);
      this.organisationUnitService.getNames(chunk)
          .subscribe({
            next: (data) => {
              for (const [id, name] of Object.entries(data)) {
                this.names.set(id, name);
              }
              this.refreshSelectedList();
              this.changeDetectorRef.markForCheck();
            },
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

  // Reveal every currently selected unit by expanding all of its ancestors (each with its
  // full, correct child list - never a partial one), so an edit form immediately shows the
  // saved selection checked instead of requiring the user to manually navigate to it.
  private expandSelectedPaths() {
    const ids = Array.from(this.selected);
    if (ids.length === 0) {
      return;
    }
    if (!this.rootsReady) {
      this.pendingExpandIds = ids;
      return;
    }
    this.expandPaths(ids);
  }

  private expandPaths(ids: string[]) {
    for (let i = 0; i < ids.length; i += ID_CHUNK_SIZE) {
      const chunk = ids.slice(i, i + ID_CHUNK_SIZE);
      this.organisationUnitService.getExpandedChildren(chunk)
          .subscribe({
            next: (data) => this.mergeExpandedChildren(data),
            error: (error) => this.errorHandler.handleServerError(error.error)
          });
    }
  }

  private mergeExpandedChildren(data: Record<string, OrganisationUnitTreeNode[]>) {
    // first pass: register every returned child with correct data
    for (const children of Object.values(data)) {
      this.registerNodes(children);
    }
    // second pass: attach as (fully loaded) children of their already-registered parent
    for (const [parentId, children] of Object.entries(data)) {
      const parent = this.nodeById.get(parentId);
      if (!parent) {
        continue;
      }
      parent.children = children.map((child) => this.nodeById.get(child.id)!);
      parent.expanded = true;
    }
    this.refreshVisibleNodes();
    this.changeDetectorRef.markForCheck();
  }

  private refreshSelectedList() {
    const list = Array.from(this.selected)
        .map((id) => ({ id, name: this.names.get(id) || id }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    const query = this.selectedSearchQuery;
    if (!query) {
      this.selectedList = list.map((unit) => ({ ...unit, matched: false }));
      return;
    }
    const matched: SelectedUnit[] = [];
    const unmatched: SelectedUnit[] = [];
    for (const unit of list) {
      (unit.name.toLowerCase().includes(query) ? matched : unmatched)
          .push({ ...unit, matched: unit.name.toLowerCase().includes(query) });
    }
    this.selectedList = [...matched, ...unmatched];
  }

  private refreshVisibleNodes() {
    this.visibleNodes = this.flattenNodes(this.roots || [], 0);
  }

  private flattenNodes(nodes: OrganisationUnitTreeNode[], depth: number): VisibleNode[] {
    const result: VisibleNode[] = [];
    for (const node of nodes) {
      result.push({ node, depth });
      if (node.expanded && node.children) {
        result.push(...this.flattenNodes(node.children, depth + 1));
      }
    }
    return result;
  }

  toggle(node: OrganisationUnitTreeNode) {
    if (node.expanded) {
      node.expanded = false;
      this.refreshVisibleNodes();
      this.changeDetectorRef.markForCheck();
      return;
    }
    if (node.children) {
      node.expanded = true;
      this.refreshVisibleNodes();
      this.changeDetectorRef.markForCheck();
      return;
    }
    node.loading = true;
    this.organisationUnitService.getTreeNodes(node.id)
        .subscribe({
          next: (children) => {
            node.children = children.map((child) => this.getOrCreateNode(child));
            node.expanded = true;
            node.loading = false;
            this.refreshVisibleNodes();
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => {
            node.loading = false;
            this.changeDetectorRef.markForCheck();
            this.errorHandler.handleServerError(error.error);
          }
        });
  }

  isSelected(node: OrganisationUnitTreeNode) {
    return this.selected.has(node.id);
  }

  // A node is indeterminate when it isn't itself selected but a (loaded) descendant is -
  // purely a visual hint, checking it never cascades to its children.
  isIndeterminate(node: OrganisationUnitTreeNode) {
    return !this.isSelected(node) && this.hasSelectedDescendant(node);
  }

  private hasSelectedDescendant(node: OrganisationUnitTreeNode): boolean {
    if (!node.children) {
      return false;
    }
    for (const child of node.children) {
      if (this.selected.has(child.id) || this.hasSelectedDescendant(child)) {
        return true;
      }
    }
    return false;
  }

  toggleSelectionById(id: string) {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
    this.refreshSelectedList();
    this.control!.setValue(Array.from(this.selected));
    this.control!.markAsDirty();
  }

  selectAllMatched() {
    for (const id of this.matchedIds) {
      this.selected.add(id);
    }
    this.refreshSelectedList();
    this.control!.setValue(Array.from(this.selected));
    this.control!.markAsDirty();
  }

  isMatched(node: OrganisationUnitTreeNode) {
    return this.matchedIds.has(node.id);
  }

  setLevel(level: number|null) {
    this.selectedLevel = level;
    this.levelMenuOpen = false;
    this.filterTrigger.next();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.levelMenuOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.levelMenuOpen = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  toggleSelection(node: OrganisationUnitTreeNode) {
    this.toggleSelectionById(node.id);
  }

  trackByNode(_index: number, item: VisibleNode) {
    return item.node.id;
  }

  trackById(_index: number, item: { id: string }) {
    return item.id;
  }

  isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  hasErrors() {
    return !!(this.control?.invalid && (this.control.dirty || this.control.touched));
  }

}
