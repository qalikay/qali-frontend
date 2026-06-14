import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CrearOrdenRequest, Orden } from '../models/orden.model';

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/cliente/ordenes`);
  }

  getOrden(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/ordenes/${id}`);
  }

  crear(datos: CrearOrdenRequest): Observable<Orden> {
    return this.http.post<Orden>(`${this.apiUrl}/ordenes`, datos);
  }
}
