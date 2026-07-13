import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportPhaGDisService } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.service';
import { RapportPhaGDisDTO } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-rapport-pha-g-dis-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-pha-g-dis-edit.component.html'
})
export class RapportPhaGDisEditComponent implements OnInit {

  rapportPhaGDisService = inject(RapportPhaGDisService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    name: new FormControl(null, [Validators.maxLength(255)]),
    created: new FormControl(null),
    exportedDate: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@rapportPhaGDis.update.success:Rapport Pha GDis was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.rapportPhaGDisService.getRapportPhaGDis(this.currentId!)
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
    const data = new RapportPhaGDisDTO(this.editForm.value);
    this.rapportPhaGDisService.updateRapportPhaGDis(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/rapportPhaGDiss'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
