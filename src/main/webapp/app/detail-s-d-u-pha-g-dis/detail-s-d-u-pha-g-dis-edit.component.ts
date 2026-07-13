import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetailSDUPhaGDisService } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.service';
import { DetailSDUPhaGDisDTO } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-detail-s-d-u-pha-g-dis-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detail-s-d-u-pha-g-dis-edit.component.html'
})
export class DetailSDUPhaGDisEditComponent implements OnInit {

  detailSDUPhaGDisService = inject(DetailSDUPhaGDisService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  detailSDUValues?: Map<number,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    sdu: new FormControl(null),
    datePeremption: new FormControl(null),
    detailSDU: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@detailSDUPhaGDis.update.success:Detail SDUPha GDis was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.detailSDUPhaGDisService.getDetailSDUValues()
        .subscribe({
          next: (data) => {
            this.detailSDUValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.detailSDUPhaGDisService.getDetailSDUPhaGDis(this.currentId!)
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
    const data = new DetailSDUPhaGDisDTO(this.editForm.value);
    this.detailSDUPhaGDisService.updateDetailSDUPhaGDis(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUPhaGDiss'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
