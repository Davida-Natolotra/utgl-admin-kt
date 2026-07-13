import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { OrganisationUnitGroupDTO } from 'app/organisation-unit-group/organisation-unit-group.model';


@Injectable({
  providedIn: 'root',
})
export class OrganisationUnitGroupService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/organisationUnitGroups';

  getAllOrganisationUnitGroups() {
    return this.http.get<OrganisationUnitGroupDTO[]>(this.resourcePath);
  }

  getOrganisationUnitGroup(id: string) {
    return this.http.get<OrganisationUnitGroupDTO>(this.resourcePath + '/' + id);
  }

  createOrganisationUnitGroup(organisationUnitGroupDTO: OrganisationUnitGroupDTO) {
    return this.http.post<string>(this.resourcePath, organisationUnitGroupDTO);
  }

  updateOrganisationUnitGroup(id: string, organisationUnitGroupDTO: OrganisationUnitGroupDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, organisationUnitGroupDTO);
  }

  deleteOrganisationUnitGroup(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getOrganisationUnitsValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/organisationUnitsValues');
  }

}
