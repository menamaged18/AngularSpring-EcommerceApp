import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { 
  OrderItem,
  AddOrderItemReq,
  UpdateOrderItemRequest
} from '../../types/i-order-items';

import { Order, OrderReq } from '../../types/i-order';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private orderBaseUrl = environment.apiUrl + '/order';
  private orderItemsBaseUrl = environment.apiUrl + '/order-items';

  // OrderController methods
  createOrderByUserAndProduct(orderCreation: OrderReq): Observable<Order> {
    return this.http.post<Order>(
      `${this.orderBaseUrl}/add`,
      orderCreation
    );
  }

  createOrderByCart(cartId: number): Observable<Order> {
    return this.http.post<Order>(
      `${this.orderBaseUrl}/add/by-Cart/${cartId}`,
      {}
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.orderBaseUrl}/getOrderById/${id}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.orderBaseUrl}/getOrders`);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.orderBaseUrl}/getUserOrders/${userId}`);
  }

  editOrder(id: number, newOrder: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.orderBaseUrl}/edit/${id}`, newOrder);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.orderBaseUrl}/delete/${id}`);
  }

  // OrderItemsController methods
  addItemToOrder(request: AddOrderItemReq): Observable<OrderItem> {
    return this.http.post<OrderItem>(
      `${this.orderItemsBaseUrl}`,
      request
    );
  }

  getOrderItemById(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.orderItemsBaseUrl}/${id}`);
  }

  updateOrderItem(id: number, request: UpdateOrderItemRequest): Observable<OrderItem> {
    return this.http.put<OrderItem>(
      `${this.orderItemsBaseUrl}/${id}`,
      request
    );
  }

  deleteOrderItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.orderItemsBaseUrl}/${id}`);
  }
}