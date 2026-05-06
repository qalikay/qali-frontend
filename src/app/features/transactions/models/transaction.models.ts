export type TipoItem = 'RECETA' | 'INSUMO';
export type EstadoOrden = 'PENDIENTE' | 'PAGADA' | 'CANCELADA';
export type MetodoPago = 'TARJETA' | 'YAPE' | 'PLIN' | 'EFECTIVO';

export interface DetalleOrden {
  id?: number;
  tipoItem: TipoItem;
  itemId: number;
  descripcion?: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
}

export interface CrearOrdenRequest {
  metodoPago: MetodoPago;
  detalles: DetalleOrden[];
}

export interface Orden {
  id: number;
  fecha: string;
  total?: number;
  estado: EstadoOrden;
  metodoPago?: MetodoPago;
  cliente?: { id: number; nombres: string; apellidos: string; username?: string };
  detalles: DetalleOrden[];
}
