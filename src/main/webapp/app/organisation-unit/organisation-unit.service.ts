import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { OrganisationUnitDTO, OrganisationUnitImportResult, OrganisationUnitTreeNode } from 'app/organisation-unit/organisation-unit.model';


@Injectable({
  providedIn: 'root',
})
export class OrganisationUnitService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/organisationUnits';

  getAllOrganisationUnits() {
    return this.http.get<OrganisationUnitDTO[]>(this.resourcePath);
  }

  getTreeNodes(parentId?: string) {
    return this.http.get<OrganisationUnitTreeNode[]>(this.resourcePath + '/tree', {
      params: parentId ? { parentId } : {}
    });
  }

  getOrganisationUnit(id: string) {
    return this.http.get<OrganisationUnitDTO>(this.resourcePath + '/' + id);
  }

  createOrganisationUnit(organisationUnitDTO: OrganisationUnitDTO) {
    return this.http.post<string>(this.resourcePath, organisationUnitDTO);
  }

  updateOrganisationUnit(id: string, organisationUnitDTO: OrganisationUnitDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, organisationUnitDTO);
  }

  deleteOrganisationUnit(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  importOrganisationUnits(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<OrganisationUnitImportResult>(this.resourcePath + '/import', formData);
  }

  getParentValues(query?: string, limit?: number, level?: number) {
    return this.http.get<Record<string, string>>(this.resourcePath + '/parentValues', {
      params: {
        ...(query === undefined ? {} : { query }),
        ...(limit === undefined ? {} : { limit }),
        ...(level === undefined ? {} : { level })
      }
    });
  }

  getExpandedChildren(ids: string[]) {
    return this.http.get<Record<string, OrganisationUnitTreeNode[]>>(this.resourcePath + '/tree/expand', {
      params: { ids: ids.join(',') }
    });
  }

  getNames(ids: string[]) {
    return this.http.get<Record<string, string>>(this.resourcePath + '/names', {
      params: { ids: ids.join(',') }
    });
  }

  getLevels() {
    return this.http.get<number[]>(this.resourcePath + '/levels');
  }

}
