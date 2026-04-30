import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterClienteRequest,
  RegisterExpertoRequest,
  RolNombre,
  UserResponse,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorageService);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly userSignal = signal<UserResponse | null>(this.storage.getUser<UserResponse>());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly roles = computed<RolNombre[]>(() => this.userSignal()?.roles ?? []);
  readonly isCliente = computed(() => this.roles().includes('CLIENTE'));
  readonly isExperto = computed(() => this.roles().includes('EXPERTO'));

  registerCliente(payload: RegisterClienteRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register/cliente`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  registerExperto(payload: RegisterExpertoRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register/experto`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.storage.getRefreshToken();
    const body: RefreshTokenRequest = { refreshToken: refreshToken ?? '' };
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/refresh`, body)
      .pipe(tap((response) => this.persistSession(response)));
  }

  logout(): void {
    this.storage.clear();
    this.userSignal.set(null);
  }

  hasRole(role: RolNombre): boolean {
    return this.roles().includes(role);
  }

  private persistSession(response: AuthResponse): void {
    this.storage.saveSession(response.accessToken, response.refreshToken, response.user);
    this.userSignal.set(response.user);
  }
}
