import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { ProduitService } from 'app/produit/produit.service';
import { ProduitDTO } from 'app/produit/produit.model';


@Component({
  selector: 'app-produit-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './produit-list.component.html'})
export class ProduitListComponent implements OnInit, OnDestroy {

  produitService = inject(ProduitService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  produits?: ProduitDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@produit.delete.success:Produit was removed successfully.`,
      'produit.produitProgrammeOrgGroup.produit.referenced': $localize`:@@produit.produitProgrammeOrgGroup.produit.referenced:This entity is still referenced by Produit Programme Org Group ${details?.id} via field Produit.`
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
    this.produitService.getAllProduits()
        .subscribe({
          next: (data) => {
            this.produits = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.produitService.deleteProduit(id)
        .subscribe({
          next: () => this.router.navigate(['/produits'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => {
            if (error.error?.code === 'REFERENCED') {
              const messageParts = error.error.message.split(',');
              this.router.navigate(['/produits'], {
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
