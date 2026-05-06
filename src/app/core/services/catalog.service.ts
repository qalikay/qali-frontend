import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Categoria, Especialidad } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private categoriasCache$?: Observable<Categoria[]>;
  private especialidadesCache$?: Observable<Especialidad[]>;

  getCategorias(): Observable<Categoria[]> {
    if (!this.categoriasCache$) {
      this.categoriasCache$ = this.http
        .get<Categoria[]>(`${this.baseUrl}/categorias`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.categoriasCache$;
  }

  getEspecialidades(): Observable<Especialidad[]> {
    if (!this.especialidadesCache$) {
      this.especialidadesCache$ = this.http
        .get<Especialidad[]>(`${this.baseUrl}/especialidades`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.especialidadesCache$;
  }
}
