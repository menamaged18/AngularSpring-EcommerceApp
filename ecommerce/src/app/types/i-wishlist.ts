import { ProductSimpleResponse } from "./i-product";
import { user } from "./i-user";

export interface WishlistItem {
  id: number;
  product: ProductSimpleResponse;
  user?: user;
  added_at: string;
}

export interface WishlistRequest {
  userId: number;
  productId: number;
}