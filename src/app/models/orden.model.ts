import { Cliente } from './cliente.model';

export interface DetalleOrden {
  id?: number;
  tipoItem: string;
  itemId: number;
  descripcion?: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
}

export interface Orden {
  id: number;
  fecha?: string;
  total: number;
  estado: string;
  metodoPago: string;
  cliente?: Cliente;
  detalles?: DetalleOrden[];
}

export interface CrearOrdenRequest {
  metodoPago: string;
  detalles: DetalleOrden[];
}
