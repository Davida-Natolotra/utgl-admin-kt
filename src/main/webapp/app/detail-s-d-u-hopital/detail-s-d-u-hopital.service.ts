import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DetailSDUHopitalDTO } from 'app/detail-s-d-u-hopital/detail-s-d-u-hopital.model';


@Injectable({
  providedIn: 'root',
})
export class DetailSDUHopitalService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/detailSDUHopitals';

  getAllDetailSDUHopitals() {
    return this.http.get<DetailSDUHopitalDTO[]>(this.resourcePath);
  }

  getDetailSDUHopital(id: string) {
    return this.http.get<DetailSDUHopitalDTO>(this.resourcePath + '/' + id);
  }

  createDetailSDUHopital(detailSDUHopitalDTO: DetailSDUHopitalDTO) {
    return this.http.post<string>(this.resourcePath, detailSDUHopitalDTO);
  }

  updateDetailSDUHopital(id: string, detailSDUHopitalDTO: DetailSDUHopitalDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, detailSDUHopitalDTO);
  }

  deleteDetailSDUHopital(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDetailSDUValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/detailSDUValues');
  }

}
