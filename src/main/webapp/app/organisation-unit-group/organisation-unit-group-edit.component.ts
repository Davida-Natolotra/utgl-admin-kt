import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { OrganisationUnitGroupService } from 'app/organisation-unit-group/organisation-unit-group.service';
import { OrganisationUnitGroupDTO } from 'app/organisation-unit-group/organisation-unit-group.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-organisation-unit-group-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './organisation-unit-group-edit.component.html'
})
export class OrganisationUnitGroupEditComponent implements OnInit {

  organisationUnitGroupService = inject(OrganisationUnitGroupService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  organisationUnitsValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    name: new FormControl(null, [Validators.maxLength(255)]),
    organisationUnits: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@organisationUnitGroup.update.success:Organisation Unit Group was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.organisationUnitGroupService.getOrganisationUnitsValues()
        .subscribe({
          next: (data) => {
            this.organisationUnitsValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.organisationUnitGroupService.getOrganisationUnitGroup(this.currentId!)
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
    const data = new OrganisationUnitGroupDTO(this.editForm.value);
    this.organisationUnitGroupService.updateOrganisationUnitGroup(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/organisationUnitGroups'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
