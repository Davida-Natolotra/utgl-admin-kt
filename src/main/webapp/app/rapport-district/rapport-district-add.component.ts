import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportDistrictService } from 'app/rapport-district/rapport-district.service';
import { RapportDistrictDTO } from 'app/rapport-district/rapport-district.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-rapport-district-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-district-add.component.html'
})
export class RapportDistrictAddComponent implements OnInit {

  rapportDistrictService = inject(RapportDistrictService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  drspValues?: Record<string,string>;
  sdspValues?: Record<string,string>;
  rapportValues?: Record<string,string>;

  addForm = new FormGroup({
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
      created: $localize`:@@rapportDistrict.create.success:Rapport District was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new RapportDistrictDTO(this.addForm.value);
    this.rapportDistrictService.createRapportDistrict(data)
        .subscribe({
          next: () => this.router.navigate(['/rapportDistricts'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
