export type Rol = 'ROLE_ADMIN' | 'ROLE_CLIENTE' | 'ROLE_EXPERTO';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegistroClienteRequest {
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
}

export interface RegistroExpertoRequest {
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  especialidadId?: number;
  trayectoria?: string;
  anosExperiencia?: number;
}

/** Respuesta del backend en POST /api/authenticate */
export interface AuthResponse {
  jwt: string;
  username: string;
  roles: Rol[];
}

/** Sesion del usuario que persistimos en localStorage */
export interface SessionUser {
  username: string;
  roles: Rol[];
}

/** Perfil del cliente (GET /api/cliente/me) */
export interface ClienteResponse {
  id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  username: string;
}

/** Perfil del experto (GET /api/experto/me) */
export interface ExpertoResponse {
  id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  trayectoria?: string;
  anosExperiencia?: number;
  especialidad?: { id: number; nombre: string; descripcion?: string };
  username: string;
}
