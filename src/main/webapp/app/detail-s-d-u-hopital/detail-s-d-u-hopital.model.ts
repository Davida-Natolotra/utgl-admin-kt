export class DetailSDUHopitalDTO {

  constructor(data:Partial<DetailSDUHopitalDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  sdu?: number|null;
  datePeremption?: string|null;
  detailSDU?: string|null;

}
