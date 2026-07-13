import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportfsService } from 'app/rapportfs/rapportfs.service';
import { RapportfsDTO } from 'app/rapportfs/rapportfs.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-rapportfs-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapportfs-edit.component.html'
})
export class RapportfsEditComponent implements OnInit {

  rapportfsService = inject(RapportfsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  fsValues?: Record<string,string>;
  rapportDistrictValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    created: new FormControl(null),
    exportedDate: new FormControl(null),
    fs: new FormControl(null),
    rapportDistrict: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@rapportfs.update.success:Rapportfs was updated successfully.`,
      RAPPORTFS_FS_UNIQUE: $localize`:@@Exists.rapportfs.FS:This Organisation Unit is already referenced by another Rapportfs.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
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
    this.rapportfsService.getRapportfs(this.currentId!)
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
    const data = new RapportfsDTO(this.editForm.value);
    this.rapportfsService.updateRapportfs(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/rapportfss'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
