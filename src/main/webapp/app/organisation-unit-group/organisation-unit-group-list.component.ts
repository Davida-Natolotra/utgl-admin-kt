import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { OrganisationUnitGroupService } from 'app/organisation-unit-group/organisation-unit-group.service';
import { OrganisationUnitGroupDTO } from 'app/organisation-unit-group/organisation-unit-group.model';


@Component({
  selector: 'app-organisation-unit-group-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './organisation-unit-group-list.component.html'})
export class OrganisationUnitGroupListComponent implements OnInit, OnDestroy {

  organisationUnitGroupService = inject(OrganisationUnitGroupService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  organisationUnitGroups?: OrganisationUnitGroupDTO[];
  navigationSubscription?: Subscription;

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
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.organisationUnitGroupService.getAllOrganisationUnitGroups()
        .subscribe({
          next: (data) => {
            this.organisationUnitGroups = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.organisationUnitGroupService.deleteOrganisationUnitGroup(id)
        .subscribe({
          next: () => this.router.navigate(['/organisationUnitGroups'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
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
