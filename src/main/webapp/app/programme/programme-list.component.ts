import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProgrammeService } from 'app/programme/programme.service';
import { ProgrammeDTO } from 'app/programme/programme.model';


@Component({
  selector: 'app-programme-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './programme-list.component.html'})
export class ProgrammeListComponent implements OnInit, OnDestroy {

  programmeService = inject(ProgrammeService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  programmes?: ProgrammeDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@programme.delete.success:Programme was removed successfully.`,
      'programme.produitProgrammeOrgGroup.programme.referenced': $localize`:@@programme.produitProgrammeOrgGroup.programme.referenced:This entity is still referenced by Produit Programme Org Group ${details?.id} via field Programme.`
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
    this.programmeService.getAllProgrammes()
        .subscribe({
          next: (data) => {
            this.programmes = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.programmeService.deleteProgramme(id)
        .subscribe({
          next: () => this.router.navigate(['/programmes'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/programmes'], {
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
