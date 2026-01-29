import { CartWithItemsResponse } from "./i-cart";
import { WithoutUserOrderResponse } from "./i-order";
import { WishlistItem } from "./i-wishlist";

export enum UserType {
  Admin = "Admin",
  Normal = "Normal",
  Guest = "Guest"
}

export interface user {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
    last_login: string;
    is_active: boolean;
    userType: UserType;
}

export interface userReq {
    username: string;
    email: string;
    phone: string;
    password: string;
    is_active?: boolean;
}


export interface userLoginReq {
    email: string;
    password: string;
}


export interface UserCartResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  is_active: boolean;
  cart: CartWithItemsResponse;
}

export interface UserOrderResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  is_active: boolean;
  orders: WithoutUserOrderResponse[];
}

export interface UserWishlistResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  is_active: boolean;
  WishlistItem: WishlistItem[];
}
