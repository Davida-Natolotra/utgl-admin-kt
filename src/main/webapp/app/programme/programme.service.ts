import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProgrammeDTO } from 'app/programme/programme.model';


@Injectable({
  providedIn: 'root',
})
export class ProgrammeService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/programmes';

  getAllProgrammes() {
    return this.http.get<ProgrammeDTO[]>(this.resourcePath);
  }

  getProgramme(id: number) {
    return this.http.get<ProgrammeDTO>(this.resourcePath + '/' + id);
  }

  createProgramme(programmeDTO: ProgrammeDTO) {
    return this.http.post<number>(this.resourcePath, programmeDTO);
  }

  updateProgramme(id: number, programmeDTO: ProgrammeDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, programmeDTO);
  }

  deleteProgramme(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
