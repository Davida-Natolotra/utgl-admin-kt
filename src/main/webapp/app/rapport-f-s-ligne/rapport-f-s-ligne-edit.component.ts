import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportFSLigneService } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.service';
import { RapportFSLigneDTO } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validDouble } from 'app/common/utils';


@Component({
  selector: 'app-rapport-f-s-ligne-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-f-s-ligne-edit.component.html'
})
export class RapportFSLigneEditComponent implements OnInit {

  rapportFSLigneService = inject(RapportFSLigneService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  produitProgrammeNiveauValues?: Record<string,string>;
  currentId?: string;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    qteDispoDebMois: new FormControl(null),
    qteRecMois: new FormControl(null),
    qteDistPatient: new FormControl(null),
    qteDistAC: new FormControl(null),
    qtePerimeAvarieMois: new FormControl(null),
    qteRedeplMois: new FormControl(null),
    nbJourRupture: new FormControl(null),
    stockTheorique: new FormControl(null),
    sDUTotal: new FormControl(null),
    ecart: new FormControl(null),
    cmm: new FormControl(null),
    msd: new FormControl(null, [validDouble]),
    situation: new FormControl(null, [Validators.maxLength(255)]),
    produitProgrammeNiveau: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@rapportFSLigne.update.success:Rapport FSLigne was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.params['id'];
    this.rapportFSLigneService.getProduitProgrammeNiveauValues()
        .subscribe({
          next: (data) => {
            this.produitProgrammeNiveauValues = data;
            this.changeDetectorRef.markForCheck();
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.rapportFSLigneService.getRapportFSLigne(this.currentId!)
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
    const data = new RapportFSLigneDTO(this.editForm.value);
    this.rapportFSLigneService.updateRapportFSLigne(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/rapportFSLignes'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
