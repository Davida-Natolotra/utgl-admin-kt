import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProduitListComponent } from './produit/produit-list.component';
import { ProduitAddComponent } from './produit/produit-add.component';
import { ProduitEditComponent } from './produit/produit-edit.component';
import { OrganisationUnitListComponent } from './organisation-unit/organisation-unit-list.component';
import { OrganisationUnitAddComponent } from './organisation-unit/organisation-unit-add.component';
import { OrganisationUnitEditComponent } from './organisation-unit/organisation-unit-edit.component';
import { OrganisationUnitGroupListComponent } from './organisation-unit-group/organisation-unit-group-list.component';
import { OrganisationUnitGroupAddComponent } from './organisation-unit-group/organisation-unit-group-add.component';
import { OrganisationUnitGroupEditComponent } from './organisation-unit-group/organisation-unit-group-edit.component';
import { ProgrammeListComponent } from './programme/programme-list.component';
import { ProgrammeAddComponent } from './programme/programme-add.component';
import { ProgrammeEditComponent } from './programme/programme-edit.component';
import { ProduitProgrammeOrgGroupListComponent } from './produit-programme-org-group/produit-programme-org-group-list.component';
import { ProduitProgrammeOrgGroupAddComponent } from './produit-programme-org-group/produit-programme-org-group-add.component';
import { ProduitProgrammeOrgGroupEditComponent } from './produit-programme-org-group/produit-programme-org-group-edit.component';
import { RapportDistrictListComponent } from './rapport-district/rapport-district-list.component';
import { RapportDistrictAddComponent } from './rapport-district/rapport-district-add.component';
import { RapportDistrictEditComponent } from './rapport-district/rapport-district-edit.component';
import { DetailSDUFSListComponent } from './detail-s-d-u-f-s/detail-s-d-u-f-s-list.component';
import { DetailSDUFSAddComponent } from './detail-s-d-u-f-s/detail-s-d-u-f-s-add.component';
import { DetailSDUFSEditComponent } from './detail-s-d-u-f-s/detail-s-d-u-f-s-edit.component';
import { RapportfsListComponent } from './rapportfs/rapportfs-list.component';
import { RapportfsAddComponent } from './rapportfs/rapportfs-add.component';
import { RapportfsEditComponent } from './rapportfs/rapportfs-edit.component';
import { RapportPhaGDisListComponent } from './rapport-pha-g-dis/rapport-pha-g-dis-list.component';
import { RapportPhaGDisAddComponent } from './rapport-pha-g-dis/rapport-pha-g-dis-add.component';
import { RapportPhaGDisEditComponent } from './rapport-pha-g-dis/rapport-pha-g-dis-edit.component';
import { RapportFSLigneListComponent } from './rapport-f-s-ligne/rapport-f-s-ligne-list.component';
import { RapportFSLigneAddComponent } from './rapport-f-s-ligne/rapport-f-s-ligne-add.component';
import { RapportFSLigneEditComponent } from './rapport-f-s-ligne/rapport-f-s-ligne-edit.component';
import { DetailSDUPhaGDisListComponent } from './detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis-list.component';
import { DetailSDUPhaGDisAddComponent } from './detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis-add.component';
import { DetailSDUPhaGDisEditComponent } from './detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis-edit.component';
import { RapportHopitauxListComponent } from './rapport-hopitaux/rapport-hopitaux-list.component';
import { RapportHopitauxAddComponent } from './rapport-hopitaux/rapport-hopitaux-add.component';
import { RapportHopitauxEditComponent } from './rapport-hopitaux/rapport-hopitaux-edit.component';
import { DetailSDUHopitalListComponent } from './detail-s-d-u-hopital/detail-s-d-u-hopital-list.component';
import { DetailSDUHopitalAddComponent } from './detail-s-d-u-hopital/detail-s-d-u-hopital-add.component';
import { DetailSDUHopitalEditComponent } from './detail-s-d-u-hopital/detail-s-d-u-hopital-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'produits',
    component: ProduitListComponent,
    title: $localize`:@@produit.list.headline:Produits`
  },
  {
    path: 'produits/add',
    component: ProduitAddComponent,
    title: $localize`:@@produit.add.headline:Add Produit`
  },
  {
    path: 'produits/edit/:id',
    component: ProduitEditComponent,
    title: $localize`:@@produit.edit.headline:Edit Produit`
  },
  {
    path: 'organisationUnits',
    component: OrganisationUnitListComponent,
    title: $localize`:@@organisationUnit.list.headline:Organisation Units`
  },
  {
    path: 'organisationUnits/add',
    component: OrganisationUnitAddComponent,
    title: $localize`:@@organisationUnit.add.headline:Import Organisation Units`
  },
  {
    path: 'organisationUnits/edit/:id',
    component: OrganisationUnitEditComponent,
    title: $localize`:@@organisationUnit.edit.headline:Edit Organisation Unit`
  },
  {
    path: 'organisationUnitGroups',
    component: OrganisationUnitGroupListComponent,
    title: $localize`:@@organisationUnitGroup.list.headline:Organisation Unit Groups`
  },
  {
    path: 'organisationUnitGroups/add',
    component: OrganisationUnitGroupAddComponent,
    title: $localize`:@@organisationUnitGroup.add.headline:Add Organisation Unit Group`
  },
  {
    path: 'organisationUnitGroups/edit/:id',
    component: OrganisationUnitGroupEditComponent,
    title: $localize`:@@organisationUnitGroup.edit.headline:Edit Organisation Unit Group`
  },
  {
    path: 'programmes',
    component: ProgrammeListComponent,
    title: $localize`:@@programme.list.headline:Programmes`
  },
  {
    path: 'programmes/add',
    component: ProgrammeAddComponent,
    title: $localize`:@@programme.add.headline:Add Programme`
  },
  {
    path: 'programmes/edit/:id',
    component: ProgrammeEditComponent,
    title: $localize`:@@programme.edit.headline:Edit Programme`
  },
  {
    path: 'produitProgrammeOrgGroups',
    component: ProduitProgrammeOrgGroupListComponent,
    title: $localize`:@@produitProgrammeOrgGroup.list.headline:Produit Programme Org Groups`
  },
  {
    path: 'produitProgrammeOrgGroups/add',
    component: ProduitProgrammeOrgGroupAddComponent,
    title: $localize`:@@produitProgrammeOrgGroup.add.headline:Add Produit Programme Org Group`
  },
  {
    path: 'produitProgrammeOrgGroups/edit/:id',
    component: ProduitProgrammeOrgGroupEditComponent,
    title: $localize`:@@produitProgrammeOrgGroup.edit.headline:Edit Produit Programme Org Group`
  },
  {
    path: 'rapportDistricts',
    component: RapportDistrictListComponent,
    title: $localize`:@@rapportDistrict.list.headline:Rapport Districts`
  },
  {
    path: 'rapportDistricts/add',
    component: RapportDistrictAddComponent,
    title: $localize`:@@rapportDistrict.add.headline:Add Rapport District`
  },
  {
    path: 'rapportDistricts/edit/:id',
    component: RapportDistrictEditComponent,
    title: $localize`:@@rapportDistrict.edit.headline:Edit Rapport District`
  },
  {
    path: 'detailSDUFSs',
    component: DetailSDUFSListComponent,
    title: $localize`:@@detailSDUFS.list.headline:Detail SDUFSs`
  },
  {
    path: 'detailSDUFSs/add',
    component: DetailSDUFSAddComponent,
    title: $localize`:@@detailSDUFS.add.headline:Add Detail SDUFS`
  },
  {
    path: 'detailSDUFSs/edit/:id',
    component: DetailSDUFSEditComponent,
    title: $localize`:@@detailSDUFS.edit.headline:Edit Detail SDUFS`
  },
  {
    path: 'rapportfss',
    component: RapportfsListComponent,
    title: $localize`:@@rapportfs.list.headline:Rapportfses`
  },
  {
    path: 'rapportfss/add',
    component: RapportfsAddComponent,
    title: $localize`:@@rapportfs.add.headline:Add Rapportfs`
  },
  {
    path: 'rapportfss/edit/:id',
    component: RapportfsEditComponent,
    title: $localize`:@@rapportfs.edit.headline:Edit Rapportfs`
  },
  {
    path: 'rapportPhaGDiss',
    component: RapportPhaGDisListComponent,
    title: $localize`:@@rapportPhaGDis.list.headline:Rapport Pha GDises`
  },
  {
    path: 'rapportPhaGDiss/add',
    component: RapportPhaGDisAddComponent,
    title: $localize`:@@rapportPhaGDis.add.headline:Add Rapport Pha GDis`
  },
  {
    path: 'rapportPhaGDiss/edit/:id',
    component: RapportPhaGDisEditComponent,
    title: $localize`:@@rapportPhaGDis.edit.headline:Edit Rapport Pha GDis`
  },
  {
    path: 'rapportFSLignes',
    component: RapportFSLigneListComponent,
    title: $localize`:@@rapportFSLigne.list.headline:Rapport FSLignes`
  },
  {
    path: 'rapportFSLignes/add',
    component: RapportFSLigneAddComponent,
    title: $localize`:@@rapportFSLigne.add.headline:Add Rapport FSLigne`
  },
  {
    path: 'rapportFSLignes/edit/:id',
    component: RapportFSLigneEditComponent,
    title: $localize`:@@rapportFSLigne.edit.headline:Edit Rapport FSLigne`
  },
  {
    path: 'detailSDUPhaGDiss',
    component: DetailSDUPhaGDisListComponent,
    title: $localize`:@@detailSDUPhaGDis.list.headline:Detail SDUPha GDises`
  },
  {
    path: 'detailSDUPhaGDiss/add',
    component: DetailSDUPhaGDisAddComponent,
    title: $localize`:@@detailSDUPhaGDis.add.headline:Add Detail SDUPha GDis`
  },
  {
    path: 'detailSDUPhaGDiss/edit/:id',
    component: DetailSDUPhaGDisEditComponent,
    title: $localize`:@@detailSDUPhaGDis.edit.headline:Edit Detail SDUPha GDis`
  },
  {
    path: 'rapportHopitauxes',
    component: RapportHopitauxListComponent,
    title: $localize`:@@rapportHopitaux.list.headline:Rapport Hopitauxes`
  },
  {
    path: 'rapportHopitauxes/add',
    component: RapportHopitauxAddComponent,
    title: $localize`:@@rapportHopitaux.add.headline:Add Rapport Hopitaux`
  },
  {
    path: 'rapportHopitauxes/edit/:id',
    component: RapportHopitauxEditComponent,
    title: $localize`:@@rapportHopitaux.edit.headline:Edit Rapport Hopitaux`
  },
  {
    path: 'detailSDUHopitals',
    component: DetailSDUHopitalListComponent,
    title: $localize`:@@detailSDUHopital.list.headline:Detail SDUHopitals`
  },
  {
    path: 'detailSDUHopitals/add',
    component: DetailSDUHopitalAddComponent,
    title: $localize`:@@detailSDUHopital.add.headline:Add Detail SDUHopital`
  },
  {
    path: 'detailSDUHopitals/edit/:id',
    component: DetailSDUHopitalEditComponent,
    title: $localize`:@@detailSDUHopital.edit.headline:Edit Detail SDUHopital`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.page.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
