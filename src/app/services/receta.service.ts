import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CrearRecetaRequest, Receta } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/recetas`);
  }

  getReceta(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/recetas/${id}`);
  }

  getMisRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/experto/recetas`);
  }

  getMiReceta(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/experto/recetas/${id}`);
  }

  crear(datos: CrearRecetaRequest): Observable<Receta> {
    return this.http.post<Receta>(`${this.apiUrl}/experto/recetas`, datos);
  }

  actualizar(id: number, datos: CrearRecetaRequest): Observable<Receta> {
    return this.http.put<Receta>(`${this.apiUrl}/experto/recetas/${id}`, datos);
  }

  publicar(id: number): Observable<Receta> {
    return this.http.post<Receta>(`${this.apiUrl}/experto/recetas/${id}/publicar`, {});
  }

  archivar(id: number): Observable<Receta> {
    return this.http.post<Receta>(`${this.apiUrl}/experto/recetas/${id}/archivar`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/experto/recetas/${id}`);
  }
}
