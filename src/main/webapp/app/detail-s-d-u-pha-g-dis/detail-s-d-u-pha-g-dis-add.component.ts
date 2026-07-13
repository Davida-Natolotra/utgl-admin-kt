import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { DetailSDUPhaGDisService } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.service';
import { DetailSDUPhaGDisDTO } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-detail-s-d-u-pha-g-dis-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './detail-s-d-u-pha-g-dis-add.component.html'
})
export class DetailSDUPhaGDisAddComponent implements OnInit {

  detailSDUPhaGDisService = inject(DetailSDUPhaGDisService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  detailSDUValues?: Map<number,string>;

  addForm = new FormGroup({
    sdu: new FormControl(null),
    datePeremption: new FormControl(null),
    detailSDU: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@detailSDUPhaGDis.create.success:Detail SDUPha GDis was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.detailSDUPhaGDisService.getDetailSDUValues()
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
    const data = new DetailSDUPhaGDisDTO(this.addForm.value);
    this.detailSDUPhaGDisService.createDetailSDUPhaGDis(data)
        .subscribe({
          next: () => this.router.navigate(['/detailSDUPhaGDiss'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
