import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Consulta, CrearConsultaRequest, Mensaje } from '../models/consulta.model';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMisConsultasCliente(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/cliente/consultas`);
  }

  getMisConsultasExperto(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/experto/consultas`);
  }

  getConsulta(id: number): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.apiUrl}/consultas/${id}`);
  }

  crear(datos: CrearConsultaRequest): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.apiUrl}/consultas`, datos);
  }

  agregarMensaje(id: number, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/consultas/${id}/mensajes`, { contenido });
  }

  cerrar(id: number): Observable<Consulta> {
    return this.http.post<Consulta>(`${this.apiUrl}/consultas/${id}/cerrar`, {});
  }
}
