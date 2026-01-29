import { CartItem } from "./i-cart-item";

export interface Cart {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  session_id?: string;
  created_at: string;
}

export interface CartWithItemsResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  session_id?: string;
  created_at: string;
  items: CartItem[];
}