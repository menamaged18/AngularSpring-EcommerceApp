import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Product, ProductReq } from '../types/i-product';
import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { ProductService } from '../services/product/product-service';

interface ProductsState {
  products: Product[];
  loading: boolean;
  isSaving: boolean;
  error: string | null;
}

interface SingleProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

interface AppState {
  productsState: ProductsState;
  productState: SingleProductState;
}

const initialProductsState: ProductsState = {
  products: [],
  loading: false,
  isSaving: false,
  error: null,
};

const initialProductState: SingleProductState = {
  product: null,
  loading: false,
  error: null,
};

const initialState: AppState = {
  productsState: initialProductsState,
  productState: initialProductState,
};

export const productStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(ProductService)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            productsState: { ...store.productsState(), loading: true, error: null }
          });
        }),
        switchMap(() =>
          api.getAllProducts().pipe(
            tapResponse({
              next: (products: Product[]) => patchState(store, {
                productsState: { products, loading: false, error: null, isSaving: false }
              }),
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), loading: false, error: err.message }
              })
            })
          )
        )
      )
    ),

    loadProduct: rxMethod<number>(
      pipe(
        tap(() => patchState(store, {
          productState: { ...store.productState(), loading: true, error: null }
        })),
        switchMap((productId) =>
          api.getProductById(productId).pipe(
            tapResponse({
              next: (product: Product) => patchState(store, {
                productState: { product, loading: false, error: null }
              }),
              error: (err: any) => patchState(store, {
                productState: { ...store.productState(), loading: false, error: err.message }
              })
            })
          )
        )
      )
    ),

    loadProductsByCategory: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {
          productsState: { ...store.productsState(), loading: true, error: null }
        })),
        switchMap((category) =>
          api.getProductsByCategory(category).pipe(
            tapResponse({
              next: (products: Product[]) => patchState(store, {
                productsState: { products, loading: false, error: null, isSaving: false }
              }),
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), loading: false, error: err.message }
              })
            })
          )
        )
      )
    ),

    loadProductsByIds: rxMethod<number[]>(
      pipe(
        tap(() => patchState(store, {
          productsState: { ...store.productsState(), loading: true, error: null }
        })),
        switchMap((ids) =>
          api.getProductsByIds(ids).pipe(
            tapResponse({
              next: (products: Product[]) => patchState(store, {
                productsState: { products, loading: false, error: null, isSaving: false }
              }),
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), loading: false, error: err.message }
              })
            })
          )
        )
      )
    ),

    addProduct: rxMethod<ProductReq>(
      pipe(
        tap(() => patchState(store, {
          productsState: { ...store.productsState(), error: null, isSaving: true }
        })),
        switchMap((newProductReq) =>
          api.addProduct(newProductReq).pipe(
            tapResponse({
              next: (newProduct) => {
                patchState(store, {
                  productsState: {
                    ...store.productsState(),
                    products: [...store.productsState().products, newProduct],
                    isSaving: false,
                  },
                });
              },
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), isSaving: false, error: err.message }
              }),
            })
          )
        )
      )
    ),

    editProduct: rxMethod<{ id: number; newProduct: ProductReq }>(
      pipe(
        tap(() => patchState(store, {
          productsState: { ...store.productsState(), error: null, isSaving: true }
        })),
        switchMap(({ id, newProduct }) =>
          api.editProduct(id, newProduct).pipe(
            tapResponse({
              next: (updatedProduct) => {
                // Update in products array
                const updatedProducts = store.productsState().products.map(p =>
                  p.id === updatedProduct.id ? updatedProduct : p
                );
                
                patchState(store, {
                  productsState: {
                    ...store.productsState(),
                    products: updatedProducts,
                    isSaving: false,
                  },
                });
                
                // Update in single product state if it's the same product
                if (store.productState().product?.id === updatedProduct.id) {
                  patchState(store, {
                    productState: { ...store.productState(), product: updatedProduct }
                  });
                }
              },
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), isSaving: false, error: err.message }
              }),
            })
          )
        )
      )
    ),

    uploadProductImage: rxMethod<{ id: number; file: File }>(
      pipe(
        tap(() => patchState(store, {
          productsState: { ...store.productsState(), error: null, isSaving: true }
        })),
        switchMap(({ id, file }) =>
          api.uploadProductImage(id, file).pipe(
            tapResponse({
              next: (imageUrl: string) => {
                // Update in products array
                const updatedProducts = store.productsState().products.map(p =>
                  p.id === id ? { ...p, imageUrl } : p
                );
                
                patchState(store, {
                  productsState: {
                    ...store.productsState(),
                    products: updatedProducts,
                    isSaving: false,
                  },
                });
                
                // Update in single product state if it's the same product
                if (store.productState().product?.id === id) {
                  patchState(store, {
                    productState: {
                      ...store.productState(),
                      product: { ...store.productState().product!, imageUrl }
                    }
                  });
                }
              },
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), isSaving: false, error: err.message }
              }),
            })
          )
        )
      )
    ),

    deleteProduct: rxMethod<number>(
      pipe(
        tap(() => patchState(store, {
          productsState: { ...store.productsState(), error: null }
        })),
        switchMap((id) =>
          api.deleteProduct(id).pipe(
            tapResponse({
              next: () => {
                // Remove from products array
                const filteredProducts = store.productsState().products.filter(p => p.id !== id);
                
                patchState(store, {
                  productsState: {
                    ...store.productsState(),
                    products: filteredProducts,
                  },
                });
                
                // Clear single product state if it's the same product
                if (store.productState().product?.id === id) {
                  patchState(store, { productState: initialProductState });
                }
              },
              error: (err: any) => patchState(store, {
                productsState: { ...store.productsState(), error: err.message }
              }),
            })
          )
        )
      )
    ),

    clearProductState: () => {
      patchState(store, { productState: initialProductState });
    },

    clearProductsState: () => {
      patchState(store, { productsState: initialProductsState });
    },
  }))
);