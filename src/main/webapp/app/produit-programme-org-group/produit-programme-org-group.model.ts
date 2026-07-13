export class ProduitProgrammeOrgGroupDTO {

  constructor(data:Partial<ProduitProgrammeOrgGroupDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  produit?: number|null;
  programme?: number|null;
  orgGroup?: string|null;
  produitProgrammeNiveau?: string|null;

}
