import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Product, ProductReq, ProductSimpleResponse } from '../../types/i-product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/product';

  addProduct(product: ProductReq): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, product);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${category}`);
  }

  getProductsByIds(ids: number[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.baseUrl}/list`, ids);
  }

  editProduct(id: number, newProduct: ProductReq): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/edit/${id}`, newProduct);
  }

  uploadProductImage(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(
      `${this.baseUrl}/${id}/image`,
      formData,
      { responseType: 'text' } // Expecting string response (image URL)
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}