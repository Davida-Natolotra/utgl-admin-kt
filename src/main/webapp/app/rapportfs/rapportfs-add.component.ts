import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportfsService } from 'app/rapportfs/rapportfs.service';
import { RapportfsDTO } from 'app/rapportfs/rapportfs.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-rapportfs-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapportfs-add.component.html'
})
export class RapportfsAddComponent implements OnInit {

  rapportfsService = inject(RapportfsService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  fsValues?: Record<string,string>;
  rapportDistrictValues?: Record<string,string>;

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    created: new FormControl(null),
    exportedDate: new FormControl(null),
    fs: new FormControl(null),
    rapportDistrict: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@rapportfs.create.success:Rapportfs was created successfully.`,
      RAPPORTFS_FS_UNIQUE: $localize`:@@Exists.rapportfs.FS:This Organisation Unit is already referenced by another Rapportfs.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.rapportfsService.getFsValues()
        .subscribe({
          next: (data) => {
            this.fsValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportfsService.getRapportDistrictValues()
        .subscribe({
          next: (data) => {
            this.rapportDistrictValues = data;
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
    const data = new RapportfsDTO(this.addForm.value);
    this.rapportfsService.createRapportfs(data)
        .subscribe({
          next: () => this.router.navigate(['/rapportfss'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
