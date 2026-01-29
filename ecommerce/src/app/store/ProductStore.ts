import {patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop'; // For better API handling
import { Product, ProductReq } from '../types/i-product';
import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { ProductService } from '../services/product/product-service';


interface ProductsState {
  products: Product[];
  loading: boolean;
  isSaving: boolean; // Added for creation tracking
  error: string | null;
}

interface SingleProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
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

interface AppState {
  productsState: ProductsState;
  productState: SingleProductState;
}

const initialState: AppState = {
  productsState: initialProductsState,
  productState: initialProductState,
};

export const productStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store, api = inject(ProductService))=> ({

            loadProducts: rxMethod<void>(
                pipe(
                    // intial fetch put loading state = true
                    tap(() => { patchState(store, { 
                                productsState: { ...store.productsState(), loading: true, error: null } 
                                });
                    }),
                    // Start calling the api
                    switchMap(() => 
                        api.getAllProducts().pipe(
                        tapResponse({
                            next: (products: Product[]) => patchState(store, { 
                                productsState :{ products, loading: false, error:null , isSaving: false}
                            }),
                            error: (errr: any) => patchState(store, {
                                productsState: {...store.productsState(), loading: false, error: errr.message} 
                            })
                        })
                    ))
                )
            ),

            loadProduct: rxMethod<number>(
                pipe(
                    tap(()=> patchState(store, {
                        productState: {...store.productState(), loading: true}
                    })),
                    switchMap((productId) => 
                        api.getProductById(productId).pipe(
                            tapResponse({
                                next: (product: Product) => patchState(store, {
                                    productState: {product, loading: false, error: null}
                                }),
                                error: (err: any) => patchState(store, {
                                    productState: {...store.productState(), error: err.message}
                                })
                            })
                        )
                    )
                )
            ),
            
            addProduct: rxMethod<ProductReq>(
                pipe(
                tap(() => patchState(store, { 
                    productsState: { ...store.productsState(), error: null } 
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
            clearProductState: () => {
            patchState(store, { productState: initialProductState });
            },

            clearProductsState: () => {
            patchState(store, { productsState: initialProductsState });
            },
        }
    )),

)