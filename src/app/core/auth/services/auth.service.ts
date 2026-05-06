import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import {
  AuthResponse,
  LoginRequest,
  RegistroClienteRequest,
  RegistroExpertoRequest,
  Rol,
  SessionUser,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(TokenStorageService);

  private readonly baseUrl = environment.apiUrl;

  private readonly userSignal = signal<SessionUser | null>(this.storage.getUser<SessionUser>());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly roles = computed<Rol[]>(() => this.userSignal()?.roles ?? []);
  readonly isCliente = computed(() => this.roles().includes('ROLE_CLIENTE'));
  readonly isExperto = computed(() => this.roles().includes('ROLE_EXPERTO'));
  readonly isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/authenticate`, payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  /** Registra el cliente y deja la sesion iniciada (login automatico). */
  registerCliente(payload: RegistroClienteRequest): Observable<AuthResponse> {
    return new Observable<AuthResponse>((subscriber) => {
      this.http
        .post(`${this.baseUrl}/registro/cliente`, payload, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.login({ username: payload.username, password: payload.password }).subscribe({
              next: (resp) => {
                subscriber.next(resp);
                subscriber.complete();
              },
              error: (err) => subscriber.error(err),
            });
          },
          error: (err) => subscriber.error(err),
        });
    });
  }

  /** Registra el experto y deja la sesion iniciada. */
  registerExperto(payload: RegistroExpertoRequest): Observable<AuthResponse> {
    return new Observable<AuthResponse>((subscriber) => {
      this.http
        .post(`${this.baseUrl}/registro/experto`, payload, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.login({ username: payload.username, password: payload.password }).subscribe({
              next: (resp) => {
                subscriber.next(resp);
                subscriber.complete();
              },
              error: (err) => subscriber.error(err),
            });
          },
          error: (err) => subscriber.error(err),
        });
    });
  }

  logout(): void {
    this.storage.clear();
    this.userSignal.set(null);
  }

  hasRole(role: Rol): boolean {
    return this.roles().includes(role);
  }

  private persistSession(response: AuthResponse): void {
    const user: SessionUser = { username: response.username, roles: response.roles };
    this.storage.saveSession(response.jwt, user);
    this.userSignal.set(user);
  }
}
