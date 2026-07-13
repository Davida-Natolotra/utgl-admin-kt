import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetailSDUFSService } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.service';
import { DetailSDUFSDTO } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-detail-s-d-u-f-s-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detail-s-d-u-f-s-add.component.html'
})
export class DetailSDUFSAddComponent implements OnInit {

  detailSDUFSService = inject(DetailSDUFSService);
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
      created: $localize`:@@detailSDUFS.create.success:Detail SDUFS was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.detailSDUFSService.getDetailSDUValues()
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
    const data = new DetailSDUFSDTO(this.addForm.value);
    this.detailSDUFSService.createDetailSDUFS(data)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUFSs'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
