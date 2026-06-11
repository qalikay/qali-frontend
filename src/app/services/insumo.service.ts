import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Lista publica de insumos (datos del import.sql al levantar el backend) */
  getInsumos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/insumos`);
  }

  getInsumo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/insumos/${id}`);
  }
}
