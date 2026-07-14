import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { OrganisationUnitGroupService } from 'app/organisation-unit-group/organisation-unit-group.service';
import { OrganisationUnitGroupDTO } from 'app/organisation-unit-group/organisation-unit-group.model';


@Component({
  selector: 'app-organisation-unit-group-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './organisation-unit-group-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationUnitGroupListComponent implements OnInit, OnDestroy {

  organisationUnitGroupService = inject(OrganisationUnitGroupService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);

  allGroups?: OrganisationUnitGroupDTO[];
  filteredGroups: OrganisationUnitGroupDTO[] = [];
  paginatedGroups: OrganisationUnitGroupDTO[] = [];

  searchControl = new FormControl('');
  loading = false;
  currentPage = 0;
  itemsPerPage = 20;
  totalPages = 0;
  pageNumbers: number[] = [];

  readonly Math = Math;

  private navigationSubscription?: Subscription;
  private dataCache?: { data: OrganisationUnitGroupDTO[], timestamp: number };
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@organisationUnitGroup.delete.success:Organisation Unit Group was removed successfully.`,
      'organisationUnitGroup.produitProgrammeOrgGroup.orgGroup.referenced': $localize`:@@organisationUnitGroup.produitProgrammeOrgGroup.orgGroup.referenced:This entity is still referenced by Produit Programme Org Group ${details?.id} via field Org Group.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && !this.isCacheValid()) {
        this.loadData();
      }
    });
    this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          this.currentPage = 0;
          this.filterData();
          this.changeDetectorRef.markForCheck();
        });
  }

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe();
  }

  loadData() {
    if (this.isCacheValid() && this.dataCache) {
      this.allGroups = this.dataCache.data;
      this.filterData();
      return;
    }
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    this.organisationUnitGroupService.getAllOrganisationUnitGroups()
        .subscribe({
          next: (data) => {
            this.allGroups = data;
            this.dataCache = { data, timestamp: Date.now() };
            this.filterData();
            this.loading = false;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => {
            this.loading = false;
            this.errorHandler.handleServerError(error.error);
            this.changeDetectorRef.markForCheck();
          }
        });
  }

  private isCacheValid(): boolean {
    return this.dataCache !== undefined && (Date.now() - this.dataCache.timestamp) < this.CACHE_DURATION;
  }

  private filterData() {
    const query = (this.searchControl.value || '').trim().toLowerCase();
    if (!this.allGroups) {
      this.filteredGroups = [];
      this.updatePagination();
      return;
    }
    if (query.length === 0) {
      this.filteredGroups = this.allGroups;
    } else {
      this.filteredGroups = this.allGroups.filter(group =>
          group.name?.toLowerCase().includes(query) || group.id?.toLowerCase().includes(query)
      );
    }
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredGroups.length / this.itemsPerPage);
    if (this.currentPage >= this.totalPages) {
      this.currentPage = Math.max(0, this.totalPages - 1);
    }
    this.updatePageNumbers();
    this.updatePaginatedGroups();
  }

  private updatePageNumbers() {
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(0, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxButtons);
    if (end - start < maxButtons) {
      start = Math.max(0, end - maxButtons);
    }
    this.pageNumbers = Array.from({ length: end - start }, (_, i) => start + i);
  }

  private updatePaginatedGroups() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedGroups = this.filteredGroups.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePageNumbers();
      this.updatePaginatedGroups();
      this.changeDetectorRef.markForCheck();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.organisationUnitGroupService.deleteOrganisationUnitGroup(id)
        .subscribe({
          next: () => {
            this.dataCache = undefined;
            this.router.navigate(['/organisationUnitGroups'], {
              state: {
                msgInfo: this.getMessage('deleted')
              }
            });
          },
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/organisationUnitGroups'], {
                state: {
                  msgError: this.getMessage(messageParts[0], { id: messageParts[1] })
                }
              });
              return;
            }
            this.errorHandler.handleServerError(error.error)
          }
        });
  }

}
