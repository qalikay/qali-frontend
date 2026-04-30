import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CategoryResponse, Especialidad, Rol } from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/catalogs`;

  private categoriesCache$?: Observable<CategoryResponse[]>;
  private specialtiesCache$?: Observable<Especialidad[]>;

  getCategories(): Observable<CategoryResponse[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.http
        .get<CategoryResponse[]>(`${this.baseUrl}/categories`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.categoriesCache$;
  }

  getSpecialties(): Observable<Especialidad[]> {
    if (!this.specialtiesCache$) {
      this.specialtiesCache$ = this.http
        .get<Especialidad[]>(`${this.baseUrl}/especialidades`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.specialtiesCache$;
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.baseUrl}/roles`);
  }
}
