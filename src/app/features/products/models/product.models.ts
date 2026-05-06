import { Categoria } from '../../../core/models/catalog.models';

export type TipoInsumo = 'HIERBA' | 'ACEITE' | 'EXTRACTO' | 'POLVO' | 'OTRO';
export type EstadoInsumo = 'DISPONIBLE' | 'AGOTADO';

export interface InsumoExpertoMini {
  id: number;
  nombres: string;
  apellidos: string;
  username?: string;
}

export interface Insumo {
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  unidad?: string;
  tipo?: TipoInsumo | string;
  imagenUrl?: string;
  estado?: EstadoInsumo;
  categoria?: Categoria;
  experto?: InsumoExpertoMini;
}

export interface CrearInsumoRequest {
  nombre: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  unidad?: string;
  tipo?: TipoInsumo | string;
  imagenUrl?: string;
  categoriaId?: number;
}

export interface ProductSearchParams {
  categoriaId?: number;
  tipo?: string;
  q?: string;
}

/** Tipos disponibles para los selectores del UI */
export const TIPOS_INSUMO: TipoInsumo[] = ['HIERBA', 'ACEITE', 'EXTRACTO', 'POLVO', 'OTRO'];
