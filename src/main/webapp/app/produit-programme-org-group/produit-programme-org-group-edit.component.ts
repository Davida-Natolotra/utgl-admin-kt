import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProduitProgrammeOrgGroupService } from 'app/produit-programme-org-group/produit-programme-org-group.service';
import { ProduitProgrammeOrgGroupDTO } from 'app/produit-programme-org-group/produit-programme-org-group.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-produit-programme-org-group-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './produit-programme-org-group-edit.component.html'
})
export class ProduitProgrammeOrgGroupEditComponent implements OnInit {

  produitProgrammeOrgGroupService = inject(ProduitProgrammeOrgGroupService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  produitValues?: Map<number,string>;
  programmeValues?: Map<number,string>;
  orgGroupValues?: Record<string,string>;
  produitProgrammeNiveauValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    produit: new FormControl(null),
    programme: new FormControl(null),
    orgGroup: new FormControl(null),
    produitProgrammeNiveau: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@produitProgrammeOrgGroup.update.success:Produit Programme Org Group was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.produitProgrammeOrgGroupService.getProduitValues()
        .subscribe({
          next: (data) => {
            this.produitValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.produitProgrammeOrgGroupService.getProgrammeValues()
        .subscribe({
          next: (data) => {
            this.programmeValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.produitProgrammeOrgGroupService.getOrgGroupValues()
        .subscribe({
          next: (data) => {
            this.orgGroupValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.produitProgrammeOrgGroupService.getProduitProgrammeNiveauValues()
        .subscribe({
          next: (data) => {
            this.produitProgrammeNiveauValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.produitProgrammeOrgGroupService.getProduitProgrammeOrgGroup(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new ProduitProgrammeOrgGroupDTO(this.editForm.value);
    this.produitProgrammeOrgGroupService.updateProduitProgrammeOrgGroup(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/produitProgrammeOrgGroups'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
