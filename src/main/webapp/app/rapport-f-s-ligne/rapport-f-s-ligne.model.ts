export class RapportFSLigneDTO {

  constructor(data:Partial<RapportFSLigneDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  qteDispoDebMois?: number|null;
  qteRecMois?: number|null;
  qteDistPatient?: number|null;
  qteDistAC?: number|null;
  qtePerimeAvarieMois?: number|null;
  qteRedeplMois?: number|null;
  nbJourRupture?: number|null;
  stockTheorique?: number|null;
  sDUTotal?: number|null;
  ecart?: number|null;
  cmm?: number|null;
  msd?: number|null;
  situation?: string|null;
  produitProgrammeNiveau?: string|null;

}
