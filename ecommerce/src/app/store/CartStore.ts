import { inject, Injectable } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withHooks, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CartService } from '../services/cart/cart-service';
import { CartWithItemsResponse } from '../types/i-cart';
import { CartItem, CartItemRequest } from '../types/i-cart-item';
import { computed } from '@angular/core';

interface CartState {
  cart: CartWithItemsResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  lastUpdated: null
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  withComputed((store) => ({
    // Computed signals derived from cart
    cartItems: computed(() => store.cart()?.items || []),
    totalItems: computed(() => 
      store.cart()?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
    ),
    totalPrice: computed(() =>
      store.cart()?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
    ),
    isEmpty: computed(() => !store.cart()?.items?.length),
    cartId: computed(() => store.cart()?.id),
    userId: computed(() => store.cart()?.userId)
  })),
  
  withMethods((store, cartService = inject(CartService)) => ({
    // Load cart by user ID
    loadCartByUserId: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) =>
          cartService.getCartByUserId(userId).pipe(
            tapResponse({
              next: (cart) => patchState(store, { 
                cart, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Load cart by cart ID
    loadCartById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((cartId) =>
          cartService.getCartById(cartId).pipe(
            tapResponse({
              next: (cart) => patchState(store, { 
                cart, 
                loading: false,
                lastUpdated: new Date()
              }),
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Empty cart
    emptyCart: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((cartId) =>
          cartService.emptyCart(cartId).pipe(
            tapResponse({
              next: () => {
                const currentCart = store.cart();
                if (currentCart) {
                  patchState(store, { 
                    cart: {
                      ...currentCart,
                      items: []
                    },
                    loading: false,
                    lastUpdated: new Date()
                  });
                } else {
                  patchState(store, { loading: false });
                }
              },
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Add item to cart
    addItemToCart: rxMethod<{ userId: number; cartItemRequest: CartItemRequest }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ userId, cartItemRequest }) =>
          cartService.addItemToCart(userId, cartItemRequest).pipe(
            tapResponse({
              next: (newItem) => {
                const currentCart = store.cart();
                if (!currentCart) {
                  // If no cart exists yet, we might need to load it first
                  patchState(store, { loading: false });
                  return;
                }

                const currentItems = currentCart.items || [];
                const existingIndex = currentItems.findIndex(
                  item => item.product.id === newItem.product.id
                );

                let updatedItems: CartItem[];
                if (existingIndex > -1) {
                  // Update existing item
                  updatedItems = [...currentItems];
                  updatedItems[existingIndex] = newItem;
                } else {
                  // Add new item
                  updatedItems = [...currentItems, newItem];
                }

                patchState(store, { 
                  cart: {
                    ...currentCart,
                    items: updatedItems
                  },
                  loading: false,
                  lastUpdated: new Date()
                });
              },
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Edit cart item
    editCartItem: rxMethod<{ cartId: number; cartItemRequest: CartItemRequest }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ cartId, cartItemRequest }) =>
          cartService.editCartItem(cartId, cartItemRequest).pipe(
            tapResponse({
              next: (updatedItem) => {
                const currentCart = store.cart();
                if (!currentCart) {
                  patchState(store, { loading: false });
                  return;
                }

                const updatedItems = currentCart.items.map(item =>
                  item.product.id === updatedItem.product.id ? updatedItem : item
                );

                patchState(store, { 
                  cart: {
                    ...currentCart,
                    items: updatedItems
                  },
                  loading: false,
                  lastUpdated: new Date()
                });
              },
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Delete item from cart by product ID
    deleteItemByProductId: rxMethod<{ cartId: number; productId: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ cartId, productId }) =>
          cartService.deleteItemFromCart(cartId, productId).pipe(
            tapResponse({
              next: () => {
                const currentCart = store.cart();
                if (!currentCart) {
                  patchState(store, { loading: false });
                  return;
                }

                const updatedItems = currentCart.items.filter(
                  item => item.product.id !== productId
                );

                patchState(store, { 
                  cart: {
                    ...currentCart,
                    items: updatedItems
                  },
                  loading: false,
                  lastUpdated: new Date()
                });
              },
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Delete item from cart by cart item ID
    deleteItemByCartItemId: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((cartItemId) =>
          cartService.deleteItemFromCartByCartItemId(cartItemId).pipe(
            tapResponse({
              next: () => {
                const currentCart = store.cart();
                if (!currentCart) {
                  patchState(store, { loading: false });
                  return;
                }

                const updatedItems = currentCart.items.filter(
                  item => item.id !== cartItemId
                );

                patchState(store, { 
                  cart: {
                    ...currentCart,
                    items: updatedItems
                  },
                  loading: false,
                  lastUpdated: new Date()
                });
              },
              error: (error: Error) => patchState(store, { 
                error: error.message, 
                loading: false 
              })
            })
          )
        )
      )
    ),

    // Get cart item by ID 
    getCartItemById: rxMethod<number>(
      pipe(
        switchMap((cartItemId) => cartService.getCartItemById(cartItemId))
      )
    ),

    // Helper methods that don't make API calls
    getCartItemByProductId(productId: number): CartItem | undefined {
      return store.cart()?.items?.find(item => item.product.id === productId);
    },

    getCartItemQuantity(productId: number): number {
      return store.cart()?.items?.find(item => item.product.id === productId)?.quantity || 0;
    },

    // State management helpers
    updateCartItemQuantity(productId: number, quantity: number): void {
      const currentCart = store.cart();
      if (!currentCart) return;

      const updatedItems = currentCart.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      patchState(store, { 
        cart: {
          ...currentCart,
          items: updatedItems
        }
      });
    },

    // Clear error
    clearError(): void {
      patchState(store, { error: null });
    },

    // Reset store to initial state
    reset(): void {
      patchState(store, initialState);
    }
  })),
);
