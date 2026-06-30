import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente.model';
import { Orden } from '../models/orden.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
  }

  listarOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/admin/ordenes`);
  }
}
