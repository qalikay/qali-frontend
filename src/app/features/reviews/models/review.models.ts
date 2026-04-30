import { TipoItem } from '../../transactions/models/transaction.models';

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  type: TipoItem;
  refId: number;
  rating: number;
  comment: string;
  clientId: number;
  clientName: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}
