import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportHopitauxService } from 'app/rapport-hopitaux/rapport-hopitaux.service';
import { RapportHopitauxDTO } from 'app/rapport-hopitaux/rapport-hopitaux.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-rapport-hopitaux-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-hopitaux-add.component.html'
})
export class RapportHopitauxAddComponent implements OnInit {

  rapportHopitauxService = inject(RapportHopitauxService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  hopitalValues?: Record<string,string>;
  drspValues?: Record<string,string>;

  addForm = new FormGroup({
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
      created: $localize`:@@rapportHopitaux.create.success:Rapport Hopitaux was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new RapportHopitauxDTO(this.addForm.value);
    this.rapportHopitauxService.createRapportHopitaux(data)
        .subscribe({
          next: () => this.router.navigate(['/rapportHopitauxes'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
