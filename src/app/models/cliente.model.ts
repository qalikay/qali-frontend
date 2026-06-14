/** Modelo que refleja ClienteDTO del backend */
export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  username?: string;
}

export interface ActualizarClienteRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
}
