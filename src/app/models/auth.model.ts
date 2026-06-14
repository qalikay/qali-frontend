/** Modelos de autenticacion (reflejan DTOs del backend) */

export type Rol = 'ROLE_ADMIN' | 'ROLE_CLIENTE' | 'ROLE_EXPERTO';

/** AuthRequestDTO */
export interface LoginRequest {
  username: string;
  password: string;
}

/** AuthResponseDTO */
export interface AuthResponse {
  jwt: string;
  username: string;
  roles: Rol[];
}

/** RegistroClienteDTO */
export interface RegistroClienteRequest {
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono: string;
}

/** RegistroExpertoDTO */
export interface RegistroExpertoRequest {
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  especialidadId: number;
  trayectoria: string;
  anosExperiencia: number;
}

/** Datos guardados en localStorage */
export interface SessionUser {
  username: string;
  roles: Rol[];
}
