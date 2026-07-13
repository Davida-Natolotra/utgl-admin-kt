import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetailSDUFSService } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.service';
import { DetailSDUFSDTO } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-detail-s-d-u-f-s-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detail-s-d-u-f-s-edit.component.html'
})
export class DetailSDUFSEditComponent implements OnInit {

  detailSDUFSService = inject(DetailSDUFSService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  detailSDUValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    sdu: new FormControl(null),
    datePeremption: new FormControl(null),
    detailSDU: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@detailSDUFS.update.success:Detail SDUFS was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.detailSDUFSService.getDetailSDUValues()
        .subscribe({
          next: (data) => {
            this.detailSDUValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.detailSDUFSService.getDetailSDUFS(this.currentId!)
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
    const data = new DetailSDUFSDTO(this.editForm.value);
    this.detailSDUFSService.updateDetailSDUFS(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUFSs'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
