import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CrearInsumoRequest, Insumo, ProductSearchParams } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /** Lista publica de insumos. */
  list(params: ProductSearchParams = {}): Observable<Insumo[]> {
    let httpParams = new HttpParams();
    if (params.categoriaId !== undefined && params.categoriaId !== null) {
      httpParams = httpParams.set('categoriaId', params.categoriaId);
    }
    if (params.tipo) httpParams = httpParams.set('tipo', params.tipo);
    if (params.q && params.q.trim()) httpParams = httpParams.set('q', params.q.trim());
    return this.http.get<Insumo[]>(`${this.baseUrl}/insumos`, { params: httpParams });
  }

  getById(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.baseUrl}/insumos/${id}`);
  }

  // ---- ENDPOINTS DEL EXPERTO ----

  listMine(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.baseUrl}/experto/insumos`);
  }

  create(payload: CrearInsumoRequest): Observable<Insumo> {
    return this.http.post<Insumo>(`${this.baseUrl}/experto/insumos`, payload);
  }

  update(id: number, payload: CrearInsumoRequest): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.baseUrl}/experto/insumos/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/experto/insumos/${id}`);
  }
}
