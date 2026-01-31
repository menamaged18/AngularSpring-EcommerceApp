import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { productStore } from '../../store/ProductStore';
import { CartStore } from '../../store/CartStore'; 
import { OrderStore } from '../../store/OrderStore'; 
import { AddProduct } from '../../components/add-product/add-product';
import { OrderService } from '../../services/order/order-service';
import { UserStore } from '../../store/UserStore';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AddProduct, RouterLink], 
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  readonly productStore = inject(productStore);
  readonly cartStore = inject(CartStore);
  readonly orderStore = inject(OrderStore);
  readonly orderService = inject(OrderService);
  readonly userStore = inject(UserStore);
  
  products = this.productStore.productsState.products;
  loading = this.productStore.productsState.loading;
  error = this.productStore.productsState.error;

  readonly CURRENT_USER_ID = computed(() => this.userStore.currentUser()?.id);


  ngOnInit(): void {
    this.productStore.loadProducts();
  }

  // Add to Cart Handler
  onAddToCart(product: any, event: Event): void {
    event.stopPropagation();
    
    const userId = this.CURRENT_USER_ID();
    // Check if user is logged in
    if (!userId) {
      console.warn('User not logged in. Please log in to add items to cart.');
      window.alert("you need to log in first");
      return;
    }
    
    this.cartStore.addItemToCart({
      userId: userId,
      cartItemRequest: {
        productId: product.id,
        quantity: 1
      }
    });
  }

  onAddToOrder(product: any, event: Event): void {
    event.stopPropagation();
    
    const userId = this.CURRENT_USER_ID();
    if (!userId) {
      console.warn('User not logged in. Please log in to add item to order.');
      window.alert("you need to log in first");
      return;
    }

    // getting the last order made to add to it.
    // we will stuck on a problem where if the order already finished 
    // --> but because it's a demo and i have no way of confirming delevring the app i will do it later
    this.orderService.lastOrderIdByUser(userId).subscribe({
      next: (orderId) => {
        this.orderStore.addItemToOrder({
          orderId: orderId, 
          productId: product.id,
          productQuantity: 1,
        });
      },
      error: (err) => console.error('Error fetching order', err)
    });

  }
}