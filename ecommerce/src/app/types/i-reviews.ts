export interface ReviewItem {
  id: number;
  title: string;
  comment: string;
  created_at: string;
  productId: number;
  userId: number;
  username: string;
  userEmail: string;
}

export interface ReviewRequest {
  title: string;
  comment: string;
  userId: number;
}