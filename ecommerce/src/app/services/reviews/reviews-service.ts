import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewItem, ReviewRequest } from '../../types/i-reviews';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/reviews';

  getUserReviews(userId: number): Observable<ReviewItem[]> {
    return this.http.get<ReviewItem[]>(`${this.baseUrl}/users/${userId}`);
  }

  getProductReviews(productId: number): Observable<ReviewItem[]> {
    return this.http.get<ReviewItem[]>(`${this.baseUrl}/products/${productId}`);
  }

  getReviewById(reviewId: number): Observable<ReviewItem> {
    return this.http.get<ReviewItem>(`${this.baseUrl}/${reviewId}`);
  }

  addReview(productId: number, reviewRequest: ReviewRequest): Observable<ReviewItem> {
    return this.http.post<ReviewItem>(
      `${this.baseUrl}/products/${productId}`,
      reviewRequest
    );
  }

  editReview(reviewId: number, reviewRequest: Partial<ReviewRequest>): Observable<ReviewItem> {
    return this.http.put<ReviewItem>(
      `${this.baseUrl}/${reviewId}`,
      reviewRequest
    );
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`);
  }
}