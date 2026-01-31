import { inject, Injectable } from "@angular/core";
import { CartActions } from "./CartActions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CartService } from "../../services/cart/cart-service";
import { catchError, map, of, switchMap } from "rxjs";

@Injectable()
export class CartEffect {
    private actions$ = inject(Actions);
    private CartService = inject(CartService);

    loadCart$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CartActions.loadCart),
            // Destructure the 'id' sent in the action
            switchMap(({ id }) => 
                this.CartService.getCartByUserId(id).pipe(
                    map((cart) => CartActions.loadCartSuccess({ Cart: cart })),
                    catchError((error) => of(CartActions.loadCartFail({ error: error.message })))
                )
            )
        )
    )
}