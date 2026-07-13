export class ProduitDTO {

  constructor(data:Partial<ProduitDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;
  unit?: string|null;
  code?: string|null;
  edited?: string|null;

}
