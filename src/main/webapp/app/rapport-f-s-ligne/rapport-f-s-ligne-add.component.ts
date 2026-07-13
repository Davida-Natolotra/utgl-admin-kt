import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { RapportFSLigneService } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.service';
import { RapportFSLigneDTO } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validDouble } from 'app/common/utils';


@Component({
  selector: 'app-rapport-f-s-ligne-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './rapport-f-s-ligne-add.component.html'
})
export class RapportFSLigneAddComponent implements OnInit {

  rapportFSLigneService = inject(RapportFSLigneService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  produitProgrammeNiveauValues?: Record<string,string>;

  addForm = new FormGroup({
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
      created: $localize`:@@rapportFSLigne.create.success:Rapport FSLigne was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.rapportFSLigneService.getProduitProgrammeNiveauValues()
        .subscribe({
          next: (data) => {
            this.produitProgrammeNiveauValues = data;
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
    const data = new RapportFSLigneDTO(this.addForm.value);
    this.rapportFSLigneService.createRapportFSLigne(data)
        .subscribe({
          next: () => this.router.navigate(['/rapportFSLignes'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
