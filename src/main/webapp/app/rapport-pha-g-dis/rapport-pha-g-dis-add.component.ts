import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportPhaGDisService } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.service';
import { RapportPhaGDisDTO } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-rapport-pha-g-dis-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-pha-g-dis-add.component.html'
})
export class RapportPhaGDisAddComponent {

  rapportPhaGDisService = inject(RapportPhaGDisService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.maxLength(255)]),
    created: new FormControl(null),
    exportedDate: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@rapportPhaGDis.create.success:Rapport Pha GDis was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new RapportPhaGDisDTO(this.addForm.value);
    this.rapportPhaGDisService.createRapportPhaGDis(data)
        .subscribe({
          next: () => this.router.navigate(['/rapportPhaGDiss'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
