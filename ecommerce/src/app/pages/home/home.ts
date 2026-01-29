import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { productStore } from '../../store/ProductStore';
import { AddProduct } from '../../components/add-product/add-product';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AddProduct],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  store = inject(productStore);
  
  productsState = this.store.productsState;
  products = this.store.productsState.products;
  loading = this.store.productsState.loading;
  error = this.store.productsState.error;

  getAverageRating(reviews: any[]): number {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  ngOnInit(): void {
    this.store.loadProducts();
  }
}