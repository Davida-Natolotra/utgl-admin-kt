export class RapportPhaGDisDTO {

  constructor(data:Partial<RapportPhaGDisDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  name?: string|null;
  created?: string|null;
  exportedDate?: string|null;

}
