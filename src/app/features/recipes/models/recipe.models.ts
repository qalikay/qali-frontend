export type EstadoReceta = 'BORRADOR' | 'PUBLICADA' | 'ARCHIVADA';

export interface RecipeRequest {
  title: string;
  shortDescription: string;
  ingredients: string;
  preparation: string;
  usage?: string;
  warnings?: string;
  imageUrl?: string;
  price: number;
  preparationMinutes?: number;
  categoryId: number;
}

export interface RecipeAuthorDto {
  id: number;
  firstName: string;
  lastName: string;
  specialty?: string;
}

export interface RecipeCategoryDto {
  id: number;
  name: string;
  icon?: string;
}

export interface RecipeResponse {
  id: number;
  title: string;
  shortDescription: string;
  ingredients: string;
  preparation: string;
  usage?: string;
  warnings?: string;
  imageUrl?: string;
  price: number;
  preparationMinutes?: number;
  status: EstadoReceta;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: RecipeAuthorDto;
  category: RecipeCategoryDto;
}

export interface RecipeSummary {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl?: string;
  price: number;
  categoryName: string;
  authorFullName: string;
  views: number;
  status?: EstadoReceta;
}

export interface RecipeSearchParams {
  categoryId?: number;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}
