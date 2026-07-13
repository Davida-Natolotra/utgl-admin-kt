import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProduitService } from 'app/produit/produit.service';
import { ProduitDTO } from 'app/produit/produit.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-produit-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './produit-add.component.html'
})
export class ProduitAddComponent {

  produitService = inject(ProduitService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.maxLength(200)]),
    unit: new FormControl(null, [Validators.maxLength(200)]),
    code: new FormControl(null, [Validators.maxLength(200)]),
    edited: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@produit.create.success:Produit was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ProduitDTO(this.addForm.value);
    this.produitService.createProduit(data)
        .subscribe({
          next: () => this.router.navigate(['/produits'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
