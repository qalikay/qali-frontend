import { Categoria } from './categoria.model';
import { Experto } from './experto.model';

/** Modelo que refleja RecetaDTO del backend */
export interface Receta {
  id: number;
  titulo: string;
  descripcion?: string;
  ingredientes?: string;
  preparacion?: string;
  advertencias?: string;
  minutosPreparacion?: number;
  precio: number;
  imagenUrl?: string;
  estado?: string;
  fechaCreacion?: string;
  categoria?: Categoria;
  experto?: Experto;
}

/** CrearRecetaDTO del backend */
export interface CrearRecetaRequest {
  titulo: string;
  descripcion?: string;
  ingredientes?: string;
  preparacion?: string;
  advertencias?: string;
  minutosPreparacion?: number;
  precio?: number;
  imagenUrl?: string;
  categoriaId?: number;
}
