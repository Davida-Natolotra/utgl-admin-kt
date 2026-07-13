export interface OrganisationUnitImportResult {
  imported: number;
  skipped: number;
}

export interface OrganisationUnitTreeNode {
  id: string;
  name: string;
  level: number;
  childCount: number;
  // client-side state
  children?: OrganisationUnitTreeNode[];
  expanded?: boolean;
  loading?: boolean;
}

export class OrganisationUnitDTO {

  constructor(data:Partial<OrganisationUnitDTO>) {
    Object.assign(this, data);
    if (data.geometry) {
      this.geometry = JSON.parse(data.geometry);
    }
    if (data.translations) {
      this.translations = JSON.parse(data.translations);
    }
    if (data.attributeValues) {
      this.attributeValues = JSON.parse(data.attributeValues);
    }
    if (data.createdBy) {
      this.createdBy = JSON.parse(data.createdBy);
    }
    if (data.lastUpdatedBy) {
      this.lastUpdatedBy = JSON.parse(data.lastUpdatedBy);
    }
  }

  id?: string|null;
  code?: string|null;
  name?: string|null;
  shortName?: string|null;
  displayName?: string|null;
  level?: number|null;
  path?: string|null;
  openingDate?: string|null;
  closeDate?: string|null;
  geometry?: any|null;
  address?: string|null;
  description?: string|null;
  email?: string|null;
  phoneNumber?: string|null;
  contactPerson?: string|null;
  comment?: string|null;
  translations?: any|null;
  attributeValues?: any|null;
  createdBy?: any|null;
  lastUpdatedBy?: any|null;
  created?: string|null;
  parent?: string|null;

}
