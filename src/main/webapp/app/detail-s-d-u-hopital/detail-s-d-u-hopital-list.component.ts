import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DetailSDUHopitalService } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.service';
import { DetailSDUHopitalDTO } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.model';


@Component({
  selector: 'app-detail-s-d-u-hopital-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-s-d-u-hopital-list.component.html'})
export class DetailSDUHopitalListComponent implements OnInit, OnDestroy {

  detailSDUHopitalService = inject(DetailSDUHopitalService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  detailSDUHopitals?: DetailSDUHopitalDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@detailSDUHopital.delete.success:Detail SDUHopital was removed successfully.`    };
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
    this.detailSDUHopitalService.getAllDetailSDUHopitals()
        .subscribe({
          next: (data) => {
            this.detailSDUHopitals = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.detailSDUHopitalService.deleteDetailSDUHopital(id)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUHopitals'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
