import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { RapportDistrictService } from 'app/rapport-district/rapport-district.service';
import { RapportDistrictDTO } from 'app/rapport-district/rapport-district.model';


@Component({
  selector: 'app-rapport-district-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rapport-district-list.component.html'})
export class RapportDistrictListComponent implements OnInit, OnDestroy {

  rapportDistrictService = inject(RapportDistrictService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  rapportDistricts?: RapportDistrictDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@rapportDistrict.delete.success:Rapport District was removed successfully.`,
      'rapportDistrict.rapportfs.rapportDistrict.referenced': $localize`:@@rapportDistrict.rapportfs.rapportDistrict.referenced:This entity is still referenced by Rapportfs ${details?.id} via field Rapport District.`
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
    this.rapportDistrictService.getAllRapportDistricts()
        .subscribe({
          next: (data) => {
            this.rapportDistricts = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.rapportDistrictService.deleteRapportDistrict(id)
        .subscribe({
          next: () => this.router.navigate(['/rapportDistricts'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/rapportDistricts'], {
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
