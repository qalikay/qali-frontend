export type TipoItemResena = 'RECETA' | 'INSUMO' | 'EXPERTO';

export interface CrearResenaRequest {
  calificacion: number;
  comentario?: string;
  tipoItem: TipoItemResena;
  itemId: number;
}

export interface Resena {
  id: number;
  calificacion: number;
  comentario?: string;
  tipoItem: TipoItemResena;
  itemId: number;
  fechaCreacion?: string;
  cliente?: { id: number; nombres: string; apellidos: string; username?: string };
}
