export class RapportHopitauxDTO {

  constructor(data:Partial<RapportHopitauxDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  moisAnnee?: string|null;
  name?: string|null;
  created?: string|null;
  exportingDate?: string|null;
  importingDate?: string|null;
  hopital?: string|null;
  drsp?: string|null;

}
