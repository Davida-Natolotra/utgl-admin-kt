import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RapportHopitauxDTO } from 'app/rapport-hopitaux/rapport-hopitaux.model';


@Injectable({
  providedIn: 'root',
})
export class RapportHopitauxService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/rapportHopitauxes';

  getAllRapportHopitauxes() {
    return this.http.get<RapportHopitauxDTO[]>(this.resourcePath);
  }

  getRapportHopitaux(id: string) {
    return this.http.get<RapportHopitauxDTO>(this.resourcePath + '/' + id);
  }

  createRapportHopitaux(rapportHopitauxDTO: RapportHopitauxDTO) {
    return this.http.post<string>(this.resourcePath, rapportHopitauxDTO);
  }

  updateRapportHopitaux(id: string, rapportHopitauxDTO: RapportHopitauxDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, rapportHopitauxDTO);
  }

  deleteRapportHopitaux(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getHopitalValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/hopitalValues');
  }

  getDrspValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/drspValues');
  }

}
