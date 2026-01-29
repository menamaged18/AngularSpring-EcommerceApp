import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CartWithItemsResponse } from '../../types/i-cart';
import { CartItem, CartItemRequest } from '../../types/i-cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private cartBaseUrl = environment.apiUrl + '/cart';
  private cartItemsBaseUrl = environment.apiUrl + '/cart-items';

  getCartByUserId(userId: number): Observable<CartWithItemsResponse> {
    return this.http.get<CartWithItemsResponse>(
      `${this.cartBaseUrl}/users/${userId}`
    );
  }

  getCartById(cartId: number): Observable<CartWithItemsResponse> {
    return this.http.get<CartWithItemsResponse>(`${this.cartBaseUrl}/${cartId}`);
  }

  emptyCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartBaseUrl}/${cartId}/clear`);
  }

  addItemToCart(userId: number, cartItemRequest: CartItemRequest): Observable<CartItem> {
    return this.http.post<CartItem>(
      `${this.cartItemsBaseUrl}/add/${userId}`,
      cartItemRequest
    );
  }

  editCartItem(cartId: number, cartItemRequest: CartItemRequest): Observable<CartItem> {
    return this.http.put<CartItem>(
      `${this.cartItemsBaseUrl}/cart/${cartId}`,
      cartItemRequest
    );
  }

  deleteItemFromCart(cartId: number, productId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.cartItemsBaseUrl}/cart/${cartId}/product/${productId}`
    );
  }

  deleteItemFromCartByCartItemId(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartItemsBaseUrl}/${cartItemId}`);
  }

  getCartItemById(cartItemId: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.cartItemsBaseUrl}/${cartItemId}`);
  }
}