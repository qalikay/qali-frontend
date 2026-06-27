import { Insumo } from '../../../models/insumo.model';

/** Item generico para graficos de barras con Angular Material */
export interface InsumoStatItem {
  etiqueta: string;
  cantidad: number;
  porcentaje: number;
}

export interface InsumoKpiResumen {
  total: number;
  disponibles: number;
  agotados: number;
  precioPromedio: number;
  stockTotal: number;
}

/** Agrupa insumos por una propiedad y devuelve items ordenados por cantidad */
export function agruparInsumos(
  insumos: Insumo[],
  obtenerEtiqueta: (insumo: Insumo) => string,
): InsumoStatItem[] {
  const mapa = new Map<string, number>();

  for (const insumo of insumos) {
    const etiqueta = obtenerEtiqueta(insumo) || 'Sin dato';
    mapa.set(etiqueta, (mapa.get(etiqueta) ?? 0) + 1);
  }

  const total = insumos.length || 1;
  return [...mapa.entries()]
    .map(([etiqueta, cantidad]) => ({
      etiqueta,
      cantidad,
      porcentaje: Math.round((cantidad / total) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

export function calcularKpiInsumos(insumos: Insumo[]): InsumoKpiResumen {
  const disponibles = insumos.filter((i) => i.estado === 'DISPONIBLE').length;
  const agotados = insumos.filter((i) => i.estado === 'AGOTADO').length;
  const precioPromedio =
    insumos.length > 0
      ? insumos.reduce((sum, i) => sum + (i.precio ?? 0), 0) / insumos.length
      : 0;
  const stockTotal = insumos.reduce((sum, i) => sum + (i.stock ?? 0), 0);

  return {
    total: insumos.length,
    disponibles,
    agotados,
    precioPromedio,
    stockTotal,
  };
}
