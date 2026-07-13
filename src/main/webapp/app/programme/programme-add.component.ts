import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ProgrammeService } from 'app/programme/programme.service';
import { ProgrammeDTO } from 'app/programme/programme.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-programme-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './programme-add.component.html'
})
export class ProgrammeAddComponent {

  programmeService = inject(ProgrammeService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@programme.create.success:Programme was created successfully.`,
      PROGRAMME_NAME_UNIQUE: $localize`:@@Exists.programme.name:This Name is already taken.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ProgrammeDTO(this.addForm.value);
    this.programmeService.createProgramme(data)
        .subscribe({
          next: () => this.router.navigate(['/programmes'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
