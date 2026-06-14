import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ActualizarExpertoRequest, Experto } from '../models/experto.model';

@Injectable({ providedIn: 'root' })
export class ExpertoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(especialidadId?: number): Observable<Experto[]> {
    const params = especialidadId != null ? { especialidadId: String(especialidadId) } : undefined;
    return this.http.get<Experto[]>(`${this.apiUrl}/expertos`, { params });
  }

  getExperto(id: number): Observable<Experto> {
    return this.http.get<Experto>(`${this.apiUrl}/expertos/${id}`);
  }

  getMiPerfil(): Observable<Experto> {
    return this.http.get<Experto>(`${this.apiUrl}/experto/me`);
  }

  actualizarMiPerfil(datos: ActualizarExpertoRequest): Observable<Experto> {
    return this.http.put<Experto>(`${this.apiUrl}/experto/me`, datos);
  }
}
