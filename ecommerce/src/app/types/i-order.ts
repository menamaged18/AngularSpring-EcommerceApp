import { OrderItem } from "./i-order-items";
import { user } from "./i-user";

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentType {
//   CREDIT_CARD = 'CREDIT_CARD',
//   DEBIT_CARD = 'DEBIT_CARD',
//   PAYPAL = 'PAYPAL',
  CASH = 'CASH'
}

export interface Order {
  id: number;
  userResponse: user;
  created_at: string; 
  updated_at: string; 
  total_amount: number;
  shipping_address: string;
  order_Status: OrderStatus;
  payment_Type: PaymentType;
  orderItems: OrderItem[];
}

export interface OrderReq {
  userId: number;
  productId: number;
  productQuantity: number;
  shipping_address: string;
  payment_Type: PaymentType;
}

export interface WithoutUserOrderResponse {
  id: number;
  created_at: string;
  updated_at: string;
  total_amount: number;
  shipping_address: string;
  order_Status: OrderStatus;
  payment_Type: PaymentType;
  orderItems: OrderItem[];
}