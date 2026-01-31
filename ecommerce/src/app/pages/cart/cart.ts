import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/CartStore'; 
import { CartItem } from '../../types/i-cart-item';
import { UserStore } from '../../store/UserStore';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly store = inject(CartStore);
  readonly userStore = inject(UserStore);

  constructor() {
    // This will re-run automatically whenever currentUser changes!
    effect(() => {
      const user = this.userStore.currentUser();
      if (user?.id) {
        console.log('User found, loading cart for ID:', user.id);
        this.store.loadCartByUserId(user.id);
      }
    });
  }

  // Hardcoded for demo purposes.
  readonly CURRENT_USER_ID = computed(() => this.userStore.currentUser()?.id);

  ngOnInit(): void {
    const userId = this.CURRENT_USER_ID();
    // Load the cart when component initializes
    userId && this.store.loadCartByUserId(userId);
    console.log( this.userStore.currentUser())
  }

  increaseQuantity(item: CartItem): void {
    const cartId = this.store.cartId();
    if (!cartId) return;

    this.store.editCartItem({
      cartId,
      cartItemRequest: {
        productId: item.product.id,
        quantity: item.quantity + 1
      }
    });
  }

  decreaseQuantity(item: CartItem): void {
    const cartId = this.store.cartId();
    if (!cartId) return;

    if (item.quantity > 1) {
      this.store.editCartItem({
        cartId,
        cartItemRequest: {
          productId: item.product.id,
          quantity: item.quantity - 1
        }
      });
    } else {
      // If quantity is 1 and they click minus, ask to remove
      this.removeItem(item.product.id);
    }
  }

  removeItem(productId: number): void {
    const cartId = this.store.cartId();
    if (cartId) {
      this.store.deleteItemByProductId({ cartId, productId });
    }
  }

  clearCart(): void {
    const cartId = this.store.cartId();
    if (cartId && confirm('Are you sure you want to empty your cart?')) {
      this.store.emptyCart(cartId);
    }
  }

  retryLoad(): void {
    const userId = this.CURRENT_USER_ID();
    userId && this.store.loadCartByUserId(userId);
  }
}
