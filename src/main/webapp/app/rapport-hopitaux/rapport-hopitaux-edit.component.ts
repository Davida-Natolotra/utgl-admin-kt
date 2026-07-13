import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportHopitauxService } from 'app/rapport-hopitaux/rapport-hopitaux.service';
import { RapportHopitauxDTO } from 'app/rapport-hopitaux/rapport-hopitaux.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-rapport-hopitaux-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-hopitaux-edit.component.html'
})
export class RapportHopitauxEditComponent implements OnInit {

  rapportHopitauxService = inject(RapportHopitauxService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  hopitalValues?: Record<string,string>;
  drspValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    moisAnnee: new FormControl(null),
    name: new FormControl(null, [Validators.maxLength(255)]),
    created: new FormControl(null),
    exportingDate: new FormControl(null),
    importingDate: new FormControl(null),
    hopital: new FormControl(null),
    drsp: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@rapportHopitaux.update.success:Rapport Hopitaux was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.rapportHopitauxService.getHopitalValues()
        .subscribe({
          next: (data) => {
            this.hopitalValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportHopitauxService.getDrspValues()
        .subscribe({
          next: (data) => {
            this.drspValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportHopitauxService.getRapportHopitaux(this.currentId!)
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
    const data = new RapportHopitauxDTO(this.editForm.value);
    this.rapportHopitauxService.updateRapportHopitaux(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/rapportHopitauxes'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
