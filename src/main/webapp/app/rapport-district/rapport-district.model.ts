export class RapportDistrictDTO {

  constructor(data:Partial<RapportDistrictDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  moisAnnee?: string|null;
  name?: string|null;
  exportingDate?: string|null;
  importingDate?: string|null;
  created?: string|null;
  drsp?: string|null;
  sdsp?: string|null;
  rapport?: string|null;

}
