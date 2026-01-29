export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface AddOrderItemReq {
  orderId: number;
  productId: number;
  productQuantity: number;
}

export interface UpdateOrderItemRequest {
  orderItemId: number;
  productId: number;
  productQuantity: number;
}