import { Categoria } from '../../../core/models/catalog.models';

export type EstadoReceta = 'BORRADOR' | 'PUBLICADA';

export interface RecetaExpertoMini {
  id: number;
  nombres: string;
  apellidos: string;
  username?: string;
  especialidad?: { id: number; nombre: string };
}

export interface Receta {
  id: number;
  titulo: string;
  descripcion?: string;
  ingredientes?: string;
  preparacion?: string;
  advertencias?: string;
  minutosPreparacion?: number;
  precio?: number;
  imagenUrl?: string;
  estado: EstadoReceta;
  fechaCreacion?: string;
  categoria?: Categoria;
  experto?: RecetaExpertoMini;
}

export interface CrearRecetaRequest {
  titulo: string;
  descripcion?: string;
  ingredientes: string;
  preparacion: string;
  advertencias?: string;
  minutosPreparacion?: number;
  precio?: number;
  imagenUrl?: string;
  categoriaId?: number;
}

export interface RecipeSearchParams {
  categoriaId?: number;
  q?: string;
}
