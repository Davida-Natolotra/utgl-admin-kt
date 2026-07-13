export class DetailSDUFSDTO {

  constructor(data:Partial<DetailSDUFSDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  sdu?: number|null;
  datePeremption?: string|null;
  detailSDU?: string|null;

}
