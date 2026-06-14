import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  crear(datos: Omit<Categoria, 'id'>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/categoria`, datos);
  }

  actualizar(datos: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/categoria`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categoria/${id}`);
  }
}
