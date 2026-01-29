import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { WishlistItem } from '../../types/i-wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/wishlist';

  addItemToWishlist(userId: number, productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(
      `${this.baseUrl}/users/${userId}/product/${productId}`,
      {} // Empty body as per your Java controller
    );
  }

  deleteItemFromWishlist(userId: number, productId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/users/${userId}/product/${productId}`
    );
  }

  getWishlistItemById(wishlistItemId: number): Observable<WishlistItem> {
    return this.http.get<WishlistItem>(`${this.baseUrl}/${wishlistItemId}`);
  }
}