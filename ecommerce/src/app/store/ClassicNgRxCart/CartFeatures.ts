import { createFeature, createReducer, on, State } from "@ngrx/store";
import { CartWithItemsResponse } from "../../types/i-cart";
import { CartActions } from "./CartActions";

interface CartState {
    cart: CartWithItemsResponse | null,
    loading: boolean,
    error: string | null;
}

const intialState : CartState = {
    cart: null,
    loading: false,
    error: null,
}


export const CartFeature = createFeature({
    name: 'cart',
    reducer: createReducer(
        intialState, 
        on(CartActions.loadCart, (state) => ({
            ...state,
            loading: true
        })),
        on(CartActions.loadCartSuccess, (state, { Cart }) => ({
            ...state,
            loading: false, 
            cart: Cart
        })),
        on(CartActions.loadCartFail, (state, {error}) => ({
            ...state,
            loading: false,
            error: error
        }))
    )
})