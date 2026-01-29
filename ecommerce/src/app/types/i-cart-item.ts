import { ProductSimpleResponse } from "./i-product";

export interface CartItem {
  id: number;
  product: ProductSimpleResponse;
  quantity: number;
  added_at: string;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}