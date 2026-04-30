export type TipoInsumo =
  | 'HOJAS'
  | 'RAIZ'
  | 'FLOR'
  | 'FRUTO'
  | 'SEMILLA'
  | 'CORTEZA'
  | 'ACEITE'
  | 'MIEL'
  | 'EXTRACTO'
  | 'POLVO'
  | 'OTRO';

export type EstadoInsumo = 'DISPONIBLE' | 'AGOTADO' | 'DESCONTINUADO';

export interface ProductRequest {
  name: string;
  shortDescription: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stock: number;
  unit?: string;
  type: TipoInsumo;
  categoryId: number;
}

export interface ProductSellerDto {
  id: number;
  firstName: string;
  lastName: string;
  specialty?: string;
}

export interface ProductCategoryDto {
  id: number;
  name: string;
  icon?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  shortDescription: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stock: number;
  unit?: string;
  type: TipoInsumo;
  status: EstadoInsumo;
  createdAt: string;
  updatedAt: string;
  seller: ProductSellerDto;
  category: ProductCategoryDto;
}

export interface ProductSummary {
  id: number;
  name: string;
  shortDescription: string;
  imageUrl?: string;
  price: number;
  stock: number;
  type: TipoInsumo;
  unit?: string;
  categoryName: string;
  sellerFullName: string;
}

export interface ProductSearchParams {
  categoryId?: number;
  type?: TipoInsumo;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}
