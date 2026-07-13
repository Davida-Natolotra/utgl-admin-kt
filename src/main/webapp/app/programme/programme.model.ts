export class ProgrammeDTO {

  constructor(data:Partial<ProgrammeDTO>) {
    Object.assign(this, data);
  }

  id?: number|null;
  name?: string|null;

}
