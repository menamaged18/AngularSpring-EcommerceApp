import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { user, UserCartResponse, userLoginReq, UserOrderResponse, userReq, UserWishlistResponse } from '../../types/i-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/userapi';

  getAllUsers(): Observable<user[]> {
    return this.http.get<user[]>(`${this.baseUrl}/getallUsers`);
  }

  getUserById(id: number): Observable<user> {
    return this.http.get<user>(`${this.baseUrl}/getUserById/${id}`);
  }

  getUserOrders(id: number): Observable<UserOrderResponse> {
    return this.http.get<UserOrderResponse>(`${this.baseUrl}/getUserOrders/${id}`);
  }

  getUserCart(id: number): Observable<UserCartResponse> {
    return this.http.get<UserCartResponse>(`${this.baseUrl}/getUserCart/${id}`);
  }

  getUserWishlist(id: number): Observable<UserWishlistResponse> {
    return this.http.get<UserWishlistResponse>(`${this.baseUrl}/getUserWishlist/${id}`);
  }

  registerUser(user: userReq): Observable<user> {
    return this.http.post<user>(`${this.baseUrl}/add`, user);
  }

  login(loginRequest: userLoginReq): Observable<user> {
    return this.http.post<user>(`${this.baseUrl}/login`, loginRequest);
  }

  editUser(id: number, user: userReq): Observable<user> {
    return this.http.put<user>(`${this.baseUrl}/edit/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}