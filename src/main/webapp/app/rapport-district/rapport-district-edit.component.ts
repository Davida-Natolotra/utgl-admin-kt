import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportDistrictService } from 'app/rapport-district/rapport-district.service';
import { RapportDistrictDTO } from 'app/rapport-district/rapport-district.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-rapport-district-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-district-edit.component.html'
})
export class RapportDistrictEditComponent implements OnInit {

  rapportDistrictService = inject(RapportDistrictService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  drspValues?: Record<string,string>;
  sdspValues?: Record<string,string>;
  rapportValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    moisAnnee: new FormControl(null),
    name: new FormControl(null, [Validators.maxLength(255)]),
    exportingDate: new FormControl(null),
    importingDate: new FormControl(null),
    created: new FormControl(null),
    drsp: new FormControl(null),
    sdsp: new FormControl(null),
    rapport: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@rapportDistrict.update.success:Rapport District was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.rapportDistrictService.getDrspValues()
        .subscribe({
          next: (data) => {
            this.drspValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportDistrictService.getSdspValues()
        .subscribe({
          next: (data) => {
            this.sdspValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportDistrictService.getRapportValues()
        .subscribe({
          next: (data) => {
            this.rapportValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportDistrictService.getRapportDistrict(this.currentId!)
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
    const data = new RapportDistrictDTO(this.editForm.value);
    this.rapportDistrictService.updateRapportDistrict(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/rapportDistricts'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
