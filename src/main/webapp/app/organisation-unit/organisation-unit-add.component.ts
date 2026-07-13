import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrganisationUnitService } from 'app/organisation-unit/organisation-unit.service';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-organisation-unit-add',
  imports: [CommonModule, RouterLink],
  templateUrl: './organisation-unit-add.component.html'
})
export class OrganisationUnitAddComponent {

  organisationUnitService = inject(OrganisationUnitService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);
  changeDetectorRef = inject(ChangeDetectorRef);

  selectedFile?: File;
  importing = false;

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0];
  }

  handleImport() {
    if (!this.selectedFile) {
      return;
    }
    this.importing = true;
    this.organisationUnitService.importOrganisationUnits(this.selectedFile)
        .subscribe({
          next: (result) => this.router.navigate(['/organisationUnits'], {
            state: {
              msgSuccess: $localize`:@@organisationUnit.import.success:Imported ${result.imported} Organisation Units (${result.skipped} already existed).`
            }
          }),
          error: (error) => {
            this.importing = false;
            this.changeDetectorRef.markForCheck();
            this.errorHandler.handleServerError(error.error);
          }
        });
  }

}
