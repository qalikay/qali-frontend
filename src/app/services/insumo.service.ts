import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CrearInsumoRequest, Insumo } from '../models/insumo.model';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/insumos`);
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
