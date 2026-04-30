export type RolNombre = 'CLIENTE' | 'EXPERTO' | 'ADMIN';

export interface RegisterClienteRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterExpertoRequest extends RegisterClienteRequest {
  specialtyId: number;
  trajectory: string;
  biography?: string;
  yearsOfExperience: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  emailVerified?: boolean;
  roles: RolNombre[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
