import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProduitProgrammeOrgGroupDTO } from 'app/produit-programme-org-group/produit-programme-org-group.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ProduitProgrammeOrgGroupService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/produitProgrammeOrgGroups';

  getAllProduitProgrammeOrgGroups() {
    return this.http.get<ProduitProgrammeOrgGroupDTO[]>(this.resourcePath);
  }

  getProduitProgrammeOrgGroup(id: string) {
    return this.http.get<ProduitProgrammeOrgGroupDTO>(this.resourcePath + '/' + id);
  }

  createProduitProgrammeOrgGroup(produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO) {
    return this.http.post<string>(this.resourcePath, produitProgrammeOrgGroupDTO);
  }

  updateProduitProgrammeOrgGroup(id: string, produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, produitProgrammeOrgGroupDTO);
  }

  deleteProduitProgrammeOrgGroup(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getProduitValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/produitValues')
        .pipe(map(transformRecordToMap));
  }

  getProgrammeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/programmeValues')
        .pipe(map(transformRecordToMap));
  }

  getOrgGroupValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/orgGroupValues');
  }

  getProduitProgrammeNiveauValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/produitProgrammeNiveauValues');
  }

}
