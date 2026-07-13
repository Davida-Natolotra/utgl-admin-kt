export class OrganisationUnitGroupDTO {

  constructor(data:Partial<OrganisationUnitGroupDTO>) {
    Object.assign(this, data);
  }

  id?: string|null;
  name?: string|null;
  organisationUnits?: string[]|null;

}
