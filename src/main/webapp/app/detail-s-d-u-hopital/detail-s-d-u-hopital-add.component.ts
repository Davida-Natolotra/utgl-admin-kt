import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetailSDUHopitalService } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.service';
import { DetailSDUHopitalDTO } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-detail-s-d-u-hopital-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detail-s-d-u-hopital-add.component.html'
})
export class DetailSDUHopitalAddComponent implements OnInit {

  detailSDUHopitalService = inject(DetailSDUHopitalService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  detailSDUValues?: Record<string,string>;

  addForm = new FormGroup({
    sdu: new FormControl(null),
    datePeremption: new FormControl(null),
    detailSDU: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@detailSDUHopital.create.success:Detail SDUHopital was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.detailSDUHopitalService.getDetailSDUValues()
        .subscribe({
          next: (data) => {
            this.detailSDUValues = data;
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
    const data = new DetailSDUHopitalDTO(this.addForm.value);
    this.detailSDUHopitalService.createDetailSDUHopital(data)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUHopitals'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
