import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PageResponse } from '../../../core/models/api.models';
import {
  RecipeRequest,
  RecipeResponse,
  RecipeSearchParams,
  RecipeSummary,
} from '../models/recipe.models';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/recipes`;

  list(params: RecipeSearchParams = {}): Observable<PageResponse<RecipeSummary>> {
    let httpParams = new HttpParams();
    if (params.categoryId !== undefined)
      httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.minPrice !== undefined) httpParams = httpParams.set('minPrice', params.minPrice);
    if (params.maxPrice !== undefined) httpParams = httpParams.set('maxPrice', params.maxPrice);
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    return this.http.get<PageResponse<RecipeSummary>>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${this.baseUrl}/${id}`);
  }

  getOwn(id: number): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${this.baseUrl}/me/${id}`);
  }

  listMine(params: { page?: number; size?: number; sort?: string } = {}): Observable<
    PageResponse<RecipeSummary>
  > {
    let httpParams = new HttpParams();
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    return this.http.get<PageResponse<RecipeSummary>>(`${environment.apiUrl}/me/recipes`, {
      params: httpParams,
    });
  }

  create(payload: RecipeRequest): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: RecipeRequest): Observable<RecipeResponse> {
    return this.http.put<RecipeResponse>(`${this.baseUrl}/${id}`, payload);
  }

  publish(id: number): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(`${this.baseUrl}/${id}/publish`, {});
  }

  archive(id: number): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(`${this.baseUrl}/${id}/archive`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
