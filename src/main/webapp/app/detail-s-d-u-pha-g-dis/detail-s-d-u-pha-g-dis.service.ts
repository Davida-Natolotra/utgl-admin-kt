import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { DetailSDUPhaGDisDTO } from 'app/detail-s-d-u-pha-g-dis/detail-s-d-u-pha-g-dis.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class DetailSDUPhaGDisService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/detailSDUPhaGDiss';

  getAllDetailSDUPhaGDises() {
    return this.http.get<DetailSDUPhaGDisDTO[]>(this.resourcePath);
  }

  getDetailSDUPhaGDis(id: string) {
    return this.http.get<DetailSDUPhaGDisDTO>(this.resourcePath + '/' + id);
  }

  createDetailSDUPhaGDis(detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO) {
    return this.http.post<string>(this.resourcePath, detailSDUPhaGDisDTO);
  }

  updateDetailSDUPhaGDis(id: string, detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO) {
    return this.http.put<string>(this.resourcePath + '/' + id, detailSDUPhaGDisDTO);
  }

  deleteDetailSDUPhaGDis(id: string) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getDetailSDUValues() {
    return this.http.get<Record<string, number>>(this.resourcePath + '/detailSDUValues')
        .pipe(map(transformRecordToMap));
  }

}
