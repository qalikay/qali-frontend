import { Orden } from '../../../models/orden.model';

export interface AdminStatItem {
  etiqueta: string;
  cantidad: number;
  porcentaje: number;
}

export interface AdminKpiResumen {
  categorias: number;
  especialidades: number;
  clientes: number;
  expertos: number;
  recetas: number;
  insumos: number;
  ordenes: number;
  ventasTotales: number;
}

export interface AdminDashboardDatos {
  categorias: number;
  especialidades: number;
  clientes: number;
  expertos: number;
  recetas: number;
  insumos: number;
  insumosDisponibles: number;
  ordenes: Orden[];
}

export function calcularKpiAdmin(datos: AdminDashboardDatos): AdminKpiResumen {
  const ventasTotales = datos.ordenes
    .filter((o) => o.estado === 'PAGADA')
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  return {
    categorias: datos.categorias,
    especialidades: datos.especialidades,
    clientes: datos.clientes,
    expertos: datos.expertos,
    recetas: datos.recetas,
    insumos: datos.insumos,
    ordenes: datos.ordenes.length,
    ventasTotales,
  };
}

export function agruparPorCampo(
  items: { etiqueta: string }[],
  total?: number,
): AdminStatItem[] {
  const mapa = new Map<string, number>();
  for (const item of items) {
    mapa.set(item.etiqueta, (mapa.get(item.etiqueta) ?? 0) + 1);
  }
  const base = total ?? (items.length || 1);
  return [...mapa.entries()]
    .map(([etiqueta, cantidad]) => ({
      etiqueta,
      cantidad,
      porcentaje: Math.round((cantidad / base) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

export function itemsPlataforma(datos: AdminDashboardDatos): AdminStatItem[] {
  const items = [
    { etiqueta: 'Categorias', cantidad: datos.categorias },
    { etiqueta: 'Especialidades', cantidad: datos.especialidades },
    { etiqueta: 'Clientes', cantidad: datos.clientes },
    { etiqueta: 'Expertos', cantidad: datos.expertos },
    { etiqueta: 'Recetas', cantidad: datos.recetas },
    { etiqueta: 'Insumos', cantidad: datos.insumos },
  ];
  const max = Math.max(...items.map((i) => i.cantidad), 1);
  return items.map((i) => ({
    ...i,
    porcentaje: Math.round((i.cantidad / max) * 100),
  }));
}

export function itemsOrdenesPorEstado(ordenes: Orden[]): AdminStatItem[] {
  return agruparPorCampo(
    ordenes.map((o) => ({ etiqueta: o.estado ?? 'SIN ESTADO' })),
    ordenes.length || 1,
  );
}
