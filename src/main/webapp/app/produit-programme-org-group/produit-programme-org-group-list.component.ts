import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProduitProgrammeOrgGroupService } from 'app/produit-programme-org-group/produit-programme-org-group.service';
import { ProduitProgrammeOrgGroupDTO } from 'app/produit-programme-org-group/produit-programme-org-group.model';


@Component({
  selector: 'app-produit-programme-org-group-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './produit-programme-org-group-list.component.html'})
export class ProduitProgrammeOrgGroupListComponent implements OnInit, OnDestroy {

  produitProgrammeOrgGroupService = inject(ProduitProgrammeOrgGroupService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  produitProgrammeOrgGroups?: ProduitProgrammeOrgGroupDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@produitProgrammeOrgGroup.delete.success:Produit Programme Org Group was removed successfully.`,
      'produitProgrammeOrgGroup.rapportPhaGDisLigne.produitProgrammeNiveau.referenced': $localize`:@@produitProgrammeOrgGroup.rapportPhaGDisLigne.produitProgrammeNiveau.referenced:This entity is still referenced by Rapport Pha GDis Ligne ${details?.id} via field Produit Programme Niveau.`,
      'produitProgrammeOrgGroup.rapportFSLigne.produitProgrammeNiveau.referenced': $localize`:@@produitProgrammeOrgGroup.rapportFSLigne.produitProgrammeNiveau.referenced:This entity is still referenced by Rapport FSLigne ${details?.id} via field Produit Programme Niveau.`,
      'produitProgrammeOrgGroup.rapportHopitalLigne.produitProgrammeNiveau.referenced': $localize`:@@produitProgrammeOrgGroup.rapportHopitalLigne.produitProgrammeNiveau.referenced:This entity is still referenced by Rapport Hopital Ligne ${details?.id} via field Produit Programme Niveau.`
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
    this.produitProgrammeOrgGroupService.getAllProduitProgrammeOrgGroups()
        .subscribe({
          next: (data) => {
            this.produitProgrammeOrgGroups = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.produitProgrammeOrgGroupService.deleteProduitProgrammeOrgGroup(id)
        .subscribe({
          next: () => this.router.navigate(['/produitProgrammeOrgGroups'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/produitProgrammeOrgGroups'], {
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
