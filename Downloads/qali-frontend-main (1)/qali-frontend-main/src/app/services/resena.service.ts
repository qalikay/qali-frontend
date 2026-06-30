import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CrearResenaRequest, Resena } from '../models/resena.model';

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarPorItem(tipoItem: string, itemId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas`, {
      params: { tipoItem, itemId: String(itemId) },
    });
  }

  getMisResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/cliente/resenas`);
  }

  crear(datos: CrearResenaRequest): Observable<Resena> {
    return this.http.post<Resena>(`${this.apiUrl}/resenas`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/resenas/${id}`);
  }
}
