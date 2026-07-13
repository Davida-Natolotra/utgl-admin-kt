import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RapportfsDTO } from 'app/rapportfs/rapportfs.model';


@Injectable({
  providedIn: 'root',
})
export class RapportfsService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/rapportfss';

  getAllRapportfses() {
    return this.http.get<RapportfsDTO[]>(this.resourcePath);
  }

  getRapportfs(id: string) {
    return this.http.get<RapportfsDTO>(this.resourcePath + '/' + id);
  }

  createRapportfs(rapportfsDTO: RapportfsDTO) {
    return this.http.post<string>(this.resourcePath, rapportfsDTO);
  }

  updateRapportfs(id: string, rapportfsDTO: RapportfsDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, rapportfsDTO);
  }

  deleteRapportfs(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getFsValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/fsValues');
  }

  getRapportDistrictValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/rapportDistrictValues');
  }

}
