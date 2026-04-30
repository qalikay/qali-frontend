export type TipoItem = 'RECETA' | 'INSUMO';

export type EstadoTransaccion = 'PENDIENTE' | 'PAGADA' | 'CANCELADA' | 'REEMBOLSADA';

export type MetodoPago = 'TARJETA' | 'YAPE' | 'PLIN' | 'EFECTIVO_TIENDA';

export interface PurchaseItem {
  type: TipoItem;
  refId: number;
  quantity: number;
}

export interface PurchaseRequest {
  items: PurchaseItem[];
  paymentMethod: MetodoPago;
}

export interface TransactionDetailResponse {
  id: number;
  type: TipoItem;
  refId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface TransactionResponse {
  id: number;
  total: number;
  status: EstadoTransaccion;
  paymentMethod: MetodoPago;
  details: TransactionDetailResponse[];
  clientId: number;
  clientName: string;
  createdAt: string;
  paidAt?: string;
}
