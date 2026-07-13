import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProduitDTO } from 'app/produit/produit.model';


@Injectable({
  providedIn: 'root',
})
export class ProduitService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/produits';

  getAllProduits() {
    return this.http.get<ProduitDTO[]>(this.resourcePath);
  }

  getProduit(id: number) {
    return this.http.get<ProduitDTO>(this.resourcePath + '/' + id);
  }

  createProduit(produitDTO: ProduitDTO) {
    return this.http.post<number>(this.resourcePath, produitDTO);
  }

  updateProduit(id: number, produitDTO: ProduitDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, produitDTO);
  }

  deleteProduit(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
