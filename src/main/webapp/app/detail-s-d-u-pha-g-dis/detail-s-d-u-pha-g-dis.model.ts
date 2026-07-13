export class DetailSDUPhaGDisDTO {

  constructor(data:Partial<DetailSDUPhaGDisDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  sdu?: number|null;
  datePeremption?: string|null;
  detailSDU?: number|null;

}
