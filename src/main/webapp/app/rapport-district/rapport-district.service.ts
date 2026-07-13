import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { RapportDistrictDTO } from 'app/rapport-district/rapport-district.model';


@Injectable({
  providedIn: 'root',
})
export class RapportDistrictService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/rapportDistricts';

  getAllRapportDistricts() {
    return this.http.get<RapportDistrictDTO[]>(this.resourcePath);
  }

  getRapportDistrict(id: string) {
    return this.http.get<RapportDistrictDTO>(this.resourcePath + '/' + id);
  }

  createRapportDistrict(rapportDistrictDTO: RapportDistrictDTO) {
    return this.http.post<string>(this.resourcePath, rapportDistrictDTO);
  }

  updateRapportDistrict(id: string, rapportDistrictDTO: RapportDistrictDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, rapportDistrictDTO);
  }

  deleteRapportDistrict(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDrspValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/drspValues');
  }

  getSdspValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/sdspValues');
  }

  getRapportValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/rapportValues');
  }

}
