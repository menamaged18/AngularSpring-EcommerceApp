import { ReviewItem } from "./i-reviews";

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  cost_price: number | null;
  category: string;
  description: string;
  brand: string;
  weight: number;
  created_at: string;
  updated_at: string | null;
  is_active: boolean;
  reviews?: ReviewItem[];
  imageUrl: string;
}

export interface ProductSimpleResponse{
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  brand: string;
  weight: number;
  is_active: boolean;
  imageUrl: string;
}


export interface ProductReq {
  name: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
  brand: string;
  weight: number;
  is_active: boolean;
}

export interface productEditParams {
  productId: number;
  newProduct: ProductReq;
}