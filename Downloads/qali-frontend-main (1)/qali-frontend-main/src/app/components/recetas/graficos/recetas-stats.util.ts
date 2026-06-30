import {Receta} from '../../../models/receta.model';

export interface  RecetaKpiResumen{
  total: number;
  categoriasdistintas: number;
  precioPromedio: number;
  precioMaximo: number;
}

export function calcularKpiRecetas(recetas: Receta[]):RecetaKpiResumen {
  if (recetas.length === 0) {
    return { total: 0, categoriasdistintas: 0, precioPromedio: 0, precioMaximo: 0 };
  }

  const categorias = new Set(recetas.map((r) => r.categoria?.id).filter (Boolean));
  const precios = recetas.map((r) => r.precio ?? 0);
  const precioPromedio = precios.reduce((sum, p) => sum + p, 0) / recetas.length;
  const precioMaximo = Math.max(...precios);

  return {
    total: recetas.length,
    categoriasdistintas: categorias.size,
    precioPromedio,
    precioMaximo,
  };
}

