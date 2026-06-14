import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Insumo } from '../models/insumo.model';

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
}
