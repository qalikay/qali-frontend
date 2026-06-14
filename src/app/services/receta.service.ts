import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Receta } from '../models/receta.model';

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/recetas`);
  }

  getReceta(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/recetas/${id}`);
  }
}
