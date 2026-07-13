import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { RapportPhaGDisService } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.service';
import { RapportPhaGDisDTO } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.model';


@Component({
  selector: 'app-rapport-pha-g-dis-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rapport-pha-g-dis-list.component.html'})
export class RapportPhaGDisListComponent implements OnInit, OnDestroy {

  rapportPhaGDisService = inject(RapportPhaGDisService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  rapportPhaGDises?: RapportPhaGDisDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@rapportPhaGDis.delete.success:Rapport Pha GDis was removed successfully.`,
      'rapportPhaGDis.rapportDistrict.rapport.referenced': $localize`:@@rapportPhaGDis.rapportDistrict.rapport.referenced:This entity is still referenced by Rapport District ${details?.id} via field Rapport.`,
      'rapportPhaGDis.rapportPhaGDisLigne.rapportPhaGDis.referenced': $localize`:@@rapportPhaGDis.rapportPhaGDisLigne.rapportPhaGDis.referenced:This entity is still referenced by Rapport Pha GDis Ligne ${details?.id} via field Rapport Pha GDis.`
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
    this.rapportPhaGDisService.getAllRapportPhaGDises()
        .subscribe({
          next: (data) => {
            this.rapportPhaGDises = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.rapportPhaGDisService.deleteRapportPhaGDis(id)
        .subscribe({
          next: () => this.router.navigate(['/rapportPhaGDiss'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/rapportPhaGDiss'], {
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
