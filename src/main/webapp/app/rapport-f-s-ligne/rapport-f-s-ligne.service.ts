import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RapportFSLigneDTO } from 'app/rapport-f-s-ligne/rapport-f-s-ligne.model';


@Injectable({
  providedIn: 'root',
})
export class RapportFSLigneService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/rapportFSLignes';

  getAllRapportFSLignes() {
    return this.http.get<RapportFSLigneDTO[]>(this.resourcePath);
  }

  getRapportFSLigne(id: string) {
    return this.http.get<RapportFSLigneDTO>(this.resourcePath + '/' + id);
  }

  createRapportFSLigne(rapportFSLigneDTO: RapportFSLigneDTO) {
    return this.http.post<string>(this.resourcePath, rapportFSLigneDTO);
  }

  updateRapportFSLigne(id: string, rapportFSLigneDTO: RapportFSLigneDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, rapportFSLigneDTO);
  }

  deleteRapportFSLigne(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getProduitProgrammeNiveauValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/produitProgrammeNiveauValues');
  }

}
