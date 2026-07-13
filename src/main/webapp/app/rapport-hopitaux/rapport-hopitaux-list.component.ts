import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { RapportHopitauxService } from 'app/rapport-hopitaux/rapport-hopitaux.service';
import { RapportHopitauxDTO } from 'app/rapport-hopitaux/rapport-hopitaux.model';


@Component({
  selector: 'app-rapport-hopitaux-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rapport-hopitaux-list.component.html'})
export class RapportHopitauxListComponent implements OnInit, OnDestroy {

  rapportHopitauxService = inject(RapportHopitauxService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  rapportHopitauxes?: RapportHopitauxDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@rapportHopitaux.delete.success:Rapport Hopitaux was removed successfully.`,
      'rapportHopitaux.rapportHopitalLigne.rapportHopitaux.referenced': $localize`:@@rapportHopitaux.rapportHopitalLigne.rapportHopitaux.referenced:This entity is still referenced by Rapport Hopital Ligne ${details?.id} via field Rapport Hopitaux.`
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
    this.rapportHopitauxService.getAllRapportHopitauxes()
        .subscribe({
          next: (data) => {
            this.rapportHopitauxes = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.rapportHopitauxService.deleteRapportHopitaux(id)
        .subscribe({
          next: () => this.router.navigate(['/rapportHopitauxes'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/rapportHopitauxes'], {
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
