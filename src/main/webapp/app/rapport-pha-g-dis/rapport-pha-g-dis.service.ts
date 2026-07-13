import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RapportPhaGDisDTO } from 'app/rapport-pha-g-dis/rapport-pha-g-dis.model';


@Injectable({
  providedIn: 'root',
})
export class RapportPhaGDisService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/rapportPhaGDiss';

  getAllRapportPhaGDises() {
    return this.http.get<RapportPhaGDisDTO[]>(this.resourcePath);
  }

  getRapportPhaGDis(id: string) {
    return this.http.get<RapportPhaGDisDTO>(this.resourcePath + '/' + id);
  }

  createRapportPhaGDis(rapportPhaGDisDTO: RapportPhaGDisDTO) {
    return this.http.post<string>(this.resourcePath, rapportPhaGDisDTO);
  }

  updateRapportPhaGDis(id: string, rapportPhaGDisDTO: RapportPhaGDisDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, rapportPhaGDisDTO);
  }

  deleteRapportPhaGDis(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
