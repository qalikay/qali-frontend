import { Categoria } from './categoria.model';
import { Experto } from './experto.model';

/** Modelo que refleja InsumoDTO del backend */
export interface Insumo {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  unidad?: string;
  tipo?: string;
  imagenUrl?: string;
  estado?: string;
  categoria?: Categoria;
  experto?: Experto;
}

export interface CrearInsumoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  unidad?: string;
  tipo?: string;
  imagenUrl?: string;
  categoriaId: number;
}
