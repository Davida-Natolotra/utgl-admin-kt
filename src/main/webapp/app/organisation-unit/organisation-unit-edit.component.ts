import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { OrganisationUnitService } from 'app/organisation-unit/organisation-unit.service';
import { OrganisationUnitDTO } from 'app/organisation-unit/organisation-unit.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validJson } from 'app/common/utils';


@Component({
  selector: 'app-organisation-unit-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './organisation-unit-edit.component.html'
})
export class OrganisationUnitEditComponent implements OnInit {

  organisationUnitService = inject(OrganisationUnitService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  parentValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    code: new FormControl(null, [Validators.maxLength(255)]),
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    shortName: new FormControl(null, [Validators.maxLength(255)]),
    level: new FormControl(null, [Validators.required]),
    openingDate: new FormControl(null),
    closeDate: new FormControl(null),
    geometry: new FormControl(null, [validJson]),
    address: new FormControl(null, [Validators.maxLength(255)]),
    description: new FormControl(null),
    email: new FormControl(null, [Validators.maxLength(255)]),
    phoneNumber: new FormControl(null, [Validators.maxLength(255)]),
    contactPerson: new FormControl(null, [Validators.maxLength(255)]),
    comment: new FormControl(null),
    translations: new FormControl(null, [validJson]),
    attributeValues: new FormControl(null, [validJson]),
    createdBy: new FormControl(null, [validJson]),
    lastUpdatedBy: new FormControl(null, [validJson]),
    created: new FormControl(null),
    parent: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@organisationUnit.update.success:Organisation Unit was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.organisationUnitService.getParentValues()
        .subscribe({
          next: (data) => {
            this.parentValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.organisationUnitService.getOrganisationUnit(this.currentId!)
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
    const data = new OrganisationUnitDTO(this.editForm.value);
    this.organisationUnitService.updateOrganisationUnit(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/organisationUnits'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
