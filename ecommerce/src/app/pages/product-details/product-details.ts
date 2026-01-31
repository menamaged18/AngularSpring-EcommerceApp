import { Component, inject, OnInit, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { productStore } from '../../store/ProductStore';
import { CartStore } from '../../store/CartStore';
import { UserStore } from '../../store/UserStore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {

  // private route = inject(ActivatedRoute);
  // private router = inject(Router);
  readonly productStore = inject(productStore);
  readonly cartStore = inject(CartStore);
  readonly userStore = inject(UserStore);
  productId = input<string>();
  // productId!: input<string>();
  quantity: number = 1;
  loading = computed(() => this.productStore.productState().loading);
  product = computed(() => this.productStore.productState().product);
  error = computed(() => this.productStore.productState().error);
  isAuthenticated = computed(() => this.userStore.isAuthenticated());
  currentUser = computed(() => this.userStore.currentUser());

  // Check if product is in cart
  isInCart = computed(() => {
    const product = this.product();
    if (!product) return false;
    return !!this.cartStore.getCartItemByProductId(product.id);
  });

  // Get cart item quantity for this product
  cartQuantity = computed(() => {
    const product = this.product();
    if (!product) return 0;
    return this.cartStore.getCartItemQuantity(product.id);
  });

  // Reviews for the product
  reviews = computed(() => this.product()?.reviews || []);

  // Average rating
  // averageRating = computed(() => {
  //   const reviews = this.reviews();
  //   if (reviews.length === 0) return 0;
  //   const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  //   return sum / reviews.length;
  // });

  ngOnInit(): void {
    // this.route.params.subscribe(params => {
    //   this.productId = +params['id'];
    //   this.loadProduct();
    // });
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.productId());
    this.productStore.loadProduct(id);
  }

  addToCart(): void {
    const product = this.product();
    const userId = this.currentUser()?.id;
    
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    if (!product.is_active) {
      alert('This product is out of stock');
      return;
    }

    this.cartStore.addItemToCart({
      userId: userId,
      cartItemRequest: {
        productId: product.id,
        quantity: this.quantity
      }
    });
  }

  removeFromCart(): void {
    const product = this.product();
    const cartId = this.cartStore.cartId();
    
    if (!product || !cartId) {
      alert('Cannot remove item from cart');
      return;
    }

    this.cartStore.deleteItemByProductId({
      cartId: cartId,
      productId: product.id
    });
  }

  updateQuantityInCart(): void {
    const product = this.product();
    if (!product) return;
    
    this.cartStore.updateCartItemQuantity(product.id, this.quantity);
  }

  increaseQuantity(): void {
    if (this.quantity < 10) { // Limit to 10 for demo
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // goBack(): void {
  //   this.router.navigate(['/home']);
  // }

  // getStars(rating: number): number[] {
  //   const stars = Math.round(rating);
  //   return Array(stars).fill(0);
  // }

  // getEmptyStars(rating: number): number[] {
  //   const emptyStars = 5 - Math.round(rating);
  //   return emptyStars > 0 ? Array(emptyStars).fill(0) : [];
  // }
}