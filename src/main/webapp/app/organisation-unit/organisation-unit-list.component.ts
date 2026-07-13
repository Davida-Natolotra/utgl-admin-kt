import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { OrganisationUnitService } from 'app/organisation-unit/organisation-unit.service';
import { OrganisationUnitTreeNode } from 'app/organisation-unit/organisation-unit.model';


@Component({
  selector: 'app-organisation-unit-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './organisation-unit-list.component.html'})
export class OrganisationUnitListComponent implements OnInit, OnDestroy {

  organisationUnitService = inject(OrganisationUnitService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  roots?: OrganisationUnitTreeNode[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@organisationUnit.delete.success:Organisation Unit was removed successfully.`,
      'organisationUnit.organisationUnit.parent.referenced': $localize`:@@organisationUnit.organisationUnit.parent.referenced:This entity is still referenced by Organisation Unit ${details?.id} via field Parent.`,
      'organisationUnit.organisationUnitGroup.organisationUnits.referenced': $localize`:@@organisationUnit.organisationUnitGroup.organisationUnits.referenced:This entity is still referenced by Organisation Unit Group ${details?.id} via field Organisation Units.`,
      'organisationUnit.rapportDistrict.drsp.referenced': $localize`:@@organisationUnit.rapportDistrict.drsp.referenced:This entity is still referenced by Rapport District ${details?.id} via field Drsp.`,
      'organisationUnit.rapportDistrict.sdsp.referenced': $localize`:@@organisationUnit.rapportDistrict.sdsp.referenced:This entity is still referenced by Rapport District ${details?.id} via field Sdsp.`,
      'organisationUnit.rapportfs.fs.referenced': $localize`:@@organisationUnit.rapportfs.fs.referenced:This entity is still referenced by Rapportfs ${details?.id} via field Fs.`,
      'organisationUnit.rapportHopitaux.hopital.referenced': $localize`:@@organisationUnit.rapportHopitaux.hopital.referenced:This entity is still referenced by Rapport Hopitaux ${details?.id} via field Hopital.`,
      'organisationUnit.rapportHopitaux.drsp.referenced': $localize`:@@organisationUnit.rapportHopitaux.drsp.referenced:This entity is still referenced by Rapport Hopitaux ${details?.id} via field Drsp.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.organisationUnitService.getTreeNodes()
        .subscribe({
          next: (data) => {
            this.roots = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  toggle(node: OrganisationUnitTreeNode) {
    if (node.expanded) {
      node.expanded = false;
      this.changeDetectorRef.markForCheck();
      return;
    }
    if (node.children) {
      node.expanded = true;
      this.changeDetectorRef.markForCheck();
      return;
    }
    node.loading = true;
    this.organisationUnitService.getTreeNodes(node.id)
        .subscribe({
          next: (children) => {
            node.children = children;
            node.expanded = true;
            node.loading = false;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => {
            node.loading = false;
            this.changeDetectorRef.markForCheck();
            this.errorHandler.handleServerError(error.error);
          }
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.organisationUnitService.deleteOrganisationUnit(id)
        .subscribe({
          next: () => this.router.navigate(['/organisationUnits'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/organisationUnits'], {
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
