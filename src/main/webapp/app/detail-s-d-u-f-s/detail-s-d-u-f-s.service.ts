import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DetailSDUFSDTO } from 'app/detail-s-d-u-f-s/detail-s-d-u-f-s.model';


@Injectable({
  providedIn: 'root',
})
export class DetailSDUFSService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/detailSDUFSs';

  getAllDetailSDUFSs() {
    return this.http.get<DetailSDUFSDTO[]>(this.resourcePath);
  }

  getDetailSDUFS(id: string) {
    return this.http.get<DetailSDUFSDTO>(this.resourcePath + '/' + id);
  }

  createDetailSDUFS(detailSDUFSDTO: DetailSDUFSDTO) {
    return this.http.post<string>(this.resourcePath, detailSDUFSDTO);
  }

  updateDetailSDUFS(id: string, detailSDUFSDTO: DetailSDUFSDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, detailSDUFSDTO);
  }

  deleteDetailSDUFS(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDetailSDUValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/detailSDUValues');
  }

}
