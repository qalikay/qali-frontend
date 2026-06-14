import { Cliente } from './cliente.model';

export interface Resena {
  id: number;
  calificacion: number;
  comentario?: string;
  tipoItem: string;
  itemId: number;
  fechaCreacion?: string;
  cliente?: Cliente;
}

export interface CrearResenaRequest {
  calificacion: number;
  comentario?: string;
  tipoItem: string;
  itemId: number;
}
