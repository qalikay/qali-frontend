import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Lista publica de recetas (datos del import.sql al levantar el backend) */
  getRecetas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recetas`);
  }

  getReceta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recetas/${id}`);
  }
}
