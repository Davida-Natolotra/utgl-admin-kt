import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { DetailSDUFSService } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.service';
import { DetailSDUFSDTO } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.model';


@Component({
  selector: 'app-detail-s-d-u-f-s-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-s-d-u-f-s-list.component.html'})
export class DetailSDUFSListComponent implements OnInit, OnDestroy {

  detailSDUFSService = inject(DetailSDUFSService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  detailSDUFSs?: DetailSDUFSDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@detailSDUFS.delete.success:Detail SDUFS was removed successfully.`    };
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
    this.detailSDUFSService.getAllDetailSDUFSs()
        .subscribe({
          next: (data) => {
            this.detailSDUFSs = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: string) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.detailSDUFSService.deleteDetailSDUFS(id)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUFSs'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
