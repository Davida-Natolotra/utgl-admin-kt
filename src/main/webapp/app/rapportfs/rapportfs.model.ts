export class RapportfsDTO {

  constructor(data:Partial<RapportfsDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  name?: string|null;
  created?: string|null;
  exportedDate?: string|null;
  fs?: string|null;
  rapportDistrict?: string|null;

}
