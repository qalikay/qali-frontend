import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegistroClienteRequest,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/authenticate`, credenciales);
  }

  registerCliente(datos: RegistroClienteRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/registro/cliente`, datos, { responseType: 'text' });
  }

  guardarSesion(resp: AuthResponse): void {
    localStorage.setItem('token', resp.jwt);
    localStorage.setItem('username', resp.username);
    localStorage.setItem('roles', JSON.stringify(resp.roles ?? []));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  estaLogueado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    if (token) {
      return { Authorization: 'Bearer ' + token };
    }
    return {};
  }
}
