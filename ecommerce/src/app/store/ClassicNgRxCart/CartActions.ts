import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CartWithItemsResponse } from "../../types/i-cart";

export const CartActions = createActionGroup({
    source: 'CartActions',
    events: {
        'Load Cart' : props<{id: number}>(),
        'Load Cart Success' : props<{Cart: CartWithItemsResponse}>(),
        'Load Cart Fail' : props<{error: string}>(),
    }
})