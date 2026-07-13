import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { RapportFSLigneService } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.service';
import { RapportFSLigneDTO } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.model';


@Component({
  selector: 'app-rapport-f-s-ligne-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rapport-f-s-ligne-list.component.html'})
export class RapportFSLigneListComponent implements OnInit, OnDestroy {

  rapportFSLigneService = inject(RapportFSLigneService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  rapportFSLignes?: RapportFSLigneDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@rapportFSLigne.delete.success:Rapport FSLigne was removed successfully.`,
      'rapportFSLigne.produitProgrammeOrgGroup.produitProgrammeNiveau.referenced': $localize`:@@rapportFSLigne.produitProgrammeOrgGroup.produitProgrammeNiveau.referenced:This entity is still referenced by Produit Programme Org Group ${details?.id} via field Produit Programme Niveau.`,
      'rapportFSLigne.detailSDUFS.detailSDU.referenced': $localize`:@@rapportFSLigne.detailSDUFS.detailSDU.referenced:This entity is still referenced by Detail SDUFS ${details?.id} via field Detail SDU.`
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
    this.rapportFSLigneService.getAllRapportFSLignes()
        .subscribe({
          next: (data) => {
            this.rapportFSLignes = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.rapportFSLigneService.deleteRapportFSLigne(id)
        .subscribe({
          next: () => this.router.navigate(['/rapportFSLignes'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/rapportFSLignes'], {
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
