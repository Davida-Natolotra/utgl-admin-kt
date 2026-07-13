import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProduitProgrammeOrgGroupService } from 'app/produit-programme-org-group/produit-programme-org-group.service';
import { ProduitProgrammeOrgGroupDTO } from 'app/produit-programme-org-group/produit-programme-org-group.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-produit-programme-org-group-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './produit-programme-org-group-add.component.html'
})
export class ProduitProgrammeOrgGroupAddComponent implements OnInit {

  produitProgrammeOrgGroupService = inject(ProduitProgrammeOrgGroupService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  produitValues?: Map<number,string>;
  programmeValues?: Map<number,string>;
  orgGroupValues?: Record<string,string>;
  produitProgrammeNiveauValues?: Record<string,string>;

  addForm = new FormGroup({
    produit: new FormControl(null),
    programme: new FormControl(null),
    orgGroup: new FormControl(null),
    produitProgrammeNiveau: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@produitProgrammeOrgGroup.create.success:Produit Programme Org Group was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ProduitProgrammeOrgGroupDTO(this.addForm.value);
    this.produitProgrammeOrgGroupService.createProduitProgrammeOrgGroup(data)
        .subscribe({
          next: () => this.router.navigate(['/produitProgrammeOrgGroups'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
