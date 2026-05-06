import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CrearRecetaRequest, Receta, RecipeSearchParams } from '../models/recipe.models';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /** Lista publica de recetas publicadas. */
  list(params: RecipeSearchParams = {}): Observable<Receta[]> {
    let httpParams = new HttpParams();
    if (params.categoriaId !== undefined && params.categoriaId !== null) {
      httpParams = httpParams.set('categoriaId', params.categoriaId);
    }
    if (params.q && params.q.trim()) {
      httpParams = httpParams.set('q', params.q.trim());
    }
    return this.http.get<Receta[]>(`${this.baseUrl}/recetas`, { params: httpParams });
  }

  getById(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.baseUrl}/recetas/${id}`);
  }

  // ---- ENDPOINTS DEL EXPERTO ----

  listMine(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.baseUrl}/experto/recetas`);
  }

  getOwn(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.baseUrl}/experto/recetas/${id}`);
  }

  create(payload: CrearRecetaRequest): Observable<Receta> {
    return this.http.post<Receta>(`${this.baseUrl}/experto/recetas`, payload);
  }

  update(id: number, payload: CrearRecetaRequest): Observable<Receta> {
    return this.http.put<Receta>(`${this.baseUrl}/experto/recetas/${id}`, payload);
  }

  publish(id: number): Observable<Receta> {
    return this.http.post<Receta>(`${this.baseUrl}/experto/recetas/${id}/publicar`, {});
  }

  archive(id: number): Observable<Receta> {
    return this.http.post<Receta>(`${this.baseUrl}/experto/recetas/${id}/archivar`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/experto/recetas/${id}`);
  }
}
