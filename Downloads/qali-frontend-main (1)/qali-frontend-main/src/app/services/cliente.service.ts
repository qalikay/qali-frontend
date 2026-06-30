import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ActualizarClienteRequest, Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMiPerfil(): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/cliente/me`);
  }

  actualizarMiPerfil(datos: ActualizarClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/cliente/me`, datos);
  }
}
