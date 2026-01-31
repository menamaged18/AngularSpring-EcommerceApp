// stores/order.store.ts
import { inject, Injectable } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { OrderService } from '../services/order/order-service';
import { Order, OrderReq } from '../types/i-order';
import {OrderItem, AddOrderItemReq, UpdateOrderItemRequest } from '../types/i-order-items';

interface OrderState {
  orders: Order[];
  userOrders: Order[];
  currentOrder: Order | null;
  orderItems: OrderItem[];
  selectedOrderItem: OrderItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  orderItems: [],
  selectedOrderItem: null,
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class OrderStore extends signalStore(
  { protectedState: false },
  withState<OrderState>(initialState),
  withMethods((store, orderService = inject(OrderService)) => {
    
    const setLoading = (loading: boolean) => patchState(store, { loading, error: null });
    const setError = (error: string) => patchState(store, { error, loading: false });

    return {
      // Order methods
      createOrderByUserAndProduct: rxMethod<OrderReq>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((orderCreation) =>
            orderService.createOrderByUserAndProduct(orderCreation).pipe(
              tapResponse({
                next: (order) => {
                  patchState(store, (state) => ({
                    orders: [...state.orders, order],
                    currentOrder: order,
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      createOrderByCart: rxMethod<number>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((cartId) =>
            orderService.createOrderByCart(cartId).pipe(
              tapResponse({
                next: (order) => {
                  patchState(store, (state) => ({
                    orders: [...state.orders, order],
                    currentOrder: order,
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      loadOrderById: rxMethod<number>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((id) =>
            orderService.getOrderById(id).pipe(
              tapResponse({
                next: (order) => {
                  patchState(store, { 
                    currentOrder: order, 
                    loading: false 
                  });
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      loadAllOrders: rxMethod<void>(
        pipe(
          tap(() => setLoading(true)),
          switchMap(() =>
            orderService.getAllOrders().pipe(
              tapResponse({
                next: (orders) => {
                  patchState(store, { 
                    orders, 
                    loading: false 
                  });
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      loadUserOrders: rxMethod<number>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((userId) =>
            orderService.getUserOrders(userId).pipe(
              tapResponse({
                next: (orders) => {
                  patchState(store, { 
                    userOrders: orders, 
                    loading: false 
                  });
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      editOrder: rxMethod<{ id: number; newOrder: Partial<Order> }>(
        pipe(
          tap(() => setLoading(true)),
          switchMap(({ id, newOrder }) =>
            orderService.editOrder(id, newOrder).pipe(
              tapResponse({
                next: (updatedOrder) => {
                  patchState(store, (state) => ({
                    orders: state.orders.map(order => 
                      order.id === id ? updatedOrder : order
                    ),
                    userOrders: state.userOrders.map(order =>
                      order.id === id ? updatedOrder : order
                    ),
                    currentOrder: state.currentOrder?.id === id 
                      ? updatedOrder 
                      : state.currentOrder,
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      deleteOrder: rxMethod<number>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((id) =>
            orderService.deleteOrder(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    orders: state.orders.filter(order => order.id !== id),
                    userOrders: state.userOrders.filter(order => order.id !== id),
                    currentOrder: state.currentOrder?.id === id 
                      ? null 
                      : state.currentOrder,
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      // Order Items methods
      addItemToOrder: rxMethod<AddOrderItemReq>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((request) =>
            orderService.addItemToOrder(request).pipe(
              tapResponse({
                next: (orderItem) => {
                  patchState(store, (state) => ({
                    orderItems: [...state.orderItems, orderItem],
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      loadOrderItemById: rxMethod<number>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((id) =>
            orderService.getOrderItemById(id).pipe(
              tapResponse({
                next: (orderItem) => {
                  patchState(store, { 
                    selectedOrderItem: orderItem, 
                    loading: false 
                  });
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      updateOrderItem: rxMethod<{ id: number; request: UpdateOrderItemRequest }>(
        pipe(
          tap(() => setLoading(true)),
          switchMap(({ id, request }) =>
            orderService.updateOrderItem(id, request).pipe(
              tapResponse({
                next: (updatedOrderItem) => {
                  patchState(store, (state) => ({
                    orderItems: state.orderItems.map(item =>
                      item.id === id ? updatedOrderItem : item
                    ),
                    selectedOrderItem: state.selectedOrderItem?.id === id
                      ? updatedOrderItem
                      : state.selectedOrderItem,
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      deleteOrderItem: rxMethod<number>(
        pipe(
          tap(() => setLoading(true)),
          switchMap((id) =>
            orderService.deleteOrderItem(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => ({
                    orderItems: state.orderItems.filter(item => item.id !== id),
                    selectedOrderItem: state.selectedOrderItem?.id === id
                      ? null
                      : state.selectedOrderItem,
                    loading: false,
                  }));
                },
                error: (error: Error) => setError(error.message),
              })
            )
          )
        )
      ),

      // Helper methods
      selectOrder: (order: Order) => {
        patchState(store, { currentOrder: order });
      },

      selectOrderItem: (orderItem: OrderItem) => {
        patchState(store, { selectedOrderItem: orderItem });
      },

      clearCurrentOrder: () => {
        patchState(store, { currentOrder: null });
      },

      clearSelectedOrderItem: () => {
        patchState(store, { selectedOrderItem: null });
      },

      clearError: () => {
        patchState(store, { error: null });
      },

    };
  }),
) {}