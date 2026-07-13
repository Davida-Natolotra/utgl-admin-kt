import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetailSDUHopitalService } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.service';
import { DetailSDUHopitalDTO } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-detail-s-d-u-hopital-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detail-s-d-u-hopital-edit.component.html'
})
export class DetailSDUHopitalEditComponent implements OnInit {

  detailSDUHopitalService = inject(DetailSDUHopitalService);
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
      updated: $localize`:@@detailSDUHopital.update.success:Detail SDUHopital was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.detailSDUHopitalService.getDetailSDUValues()
        .subscribe({
          next: (data) => {
            this.detailSDUValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.detailSDUHopitalService.getDetailSDUHopital(this.currentId!)
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
    const data = new DetailSDUHopitalDTO(this.editForm.value);
    this.detailSDUHopitalService.updateDetailSDUHopital(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUHopitals'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
