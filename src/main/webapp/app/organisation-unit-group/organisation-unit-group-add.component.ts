import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { OrganisationUnitGroupService } from 'app/organisation-unit-group/organisation-unit-group.service';
import { OrganisationUnitGroupDTO } from 'app/organisation-unit-group/organisation-unit-group.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-organisation-unit-group-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './organisation-unit-group-add.component.html'
})
export class OrganisationUnitGroupAddComponent implements OnInit {

  organisationUnitGroupService = inject(OrganisationUnitGroupService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  organisationUnitsValues?: Record<string,string>;

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.maxLength(255)]),
    organisationUnits: new FormControl([])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@organisationUnitGroup.create.success:Organisation Unit Group was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.organisationUnitGroupService.getOrganisationUnitsValues()
        .subscribe({
          next: (data) => {
            this.organisationUnitsValues = data;
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
    const data = new OrganisationUnitGroupDTO(this.addForm.value);
    this.organisationUnitGroupService.createOrganisationUnitGroup(data)
        .subscribe({
          next: () => this.router.navigate(['/organisationUnitGroups'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
