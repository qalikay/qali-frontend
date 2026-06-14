import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CrearInsumoRequest, Insumo } from '../models/insumo.model';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInsumos(filtros?: { q?: string; categoriaId?: number; tipo?: string }): Observable<Insumo[]> {
    const params: Record<string, string> = {};
    if (filtros?.q?.trim()) params['q'] = filtros.q.trim();
    if (filtros?.categoriaId != null) params['categoriaId'] = String(filtros.categoriaId);
    if (filtros?.tipo?.trim()) params['tipo'] = filtros.tipo.trim();
    return this.http.get<Insumo[]>(`${this.apiUrl}/insumos`, { params });
  }

  getInsumo(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/insumos/${id}`);
  }

  getMisInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/experto/insumos`);
  }

  crear(datos: CrearInsumoRequest): Observable<Insumo> {
    return this.http.post<Insumo>(`${this.apiUrl}/experto/insumos`, datos);
  }

  actualizar(id: number, datos: CrearInsumoRequest): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/experto/insumos/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/experto/insumos/${id}`);
  }
}
