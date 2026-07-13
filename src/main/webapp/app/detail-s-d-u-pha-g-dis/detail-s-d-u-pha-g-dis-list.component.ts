import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DetailSDUPhaGDisService } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.service';
import { DetailSDUPhaGDisDTO } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.model';


@Component({
  selector: 'app-detail-s-d-u-pha-g-dis-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-s-d-u-pha-g-dis-list.component.html'})
export class DetailSDUPhaGDisListComponent implements OnInit, OnDestroy {

  detailSDUPhaGDisService = inject(DetailSDUPhaGDisService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  detailSDUPhaGDises?: DetailSDUPhaGDisDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@detailSDUPhaGDis.delete.success:Detail SDUPha GDis was removed successfully.`    };
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
    this.detailSDUPhaGDisService.getAllDetailSDUPhaGDises()
        .subscribe({
          next: (data) => {
            this.detailSDUPhaGDises = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.detailSDUPhaGDisService.deleteDetailSDUPhaGDis(id)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUPhaGDiss'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
