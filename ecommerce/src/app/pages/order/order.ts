import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../store/OrderStore';
import { OrderItem, UpdateOrderItemRequest } from '../../types/i-order-items';
import { OrderStatus } from '../../types/i-order';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class Order implements OnInit {
  readonly store = inject(OrderStore);

  // Computed signal to calculate total amount dynamically based on the items in the store
  // This ensures the total updates immediately when quantity changes, 
  totalAmount: Signal<number> = computed(() => {
    const items = this.store.orderItems();
    // Fallback to currentOrder items if the separate orderItems state is empty
    const itemsToCalc = items.length > 0 ? items : (this.store.currentOrder()?.orderItems || []);
    
    return itemsToCalc.reduce((sum, item) => {
      return sum + (item.productPrice * item.quantity);
    }, 0);
  });

  // to get the displayable items
  displayItems: Signal<OrderItem[]> = computed(() => {
     const items = this.store.orderItems();
     return items.length > 0 ? items : (this.store.currentOrder()?.orderItems || []);
  });

  ngOnInit(): void {
    // TODO: Get order id 
    const demoOrderId = 1; 
    
    // Load the order context
    this.store.loadOrderById(demoOrderId);
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      const request: UpdateOrderItemRequest = {
        orderItemId: item.id,
        productId: item.productId,
        productQuantity: item.quantity - 1
      };
      
      this.store.updateOrderItem({ id: item.id, request });
    } else {
      // TODO: Confirm removal if quantity is 1
      this.removeItem(item.id);
    }
  }

  increaseQuantity(item: OrderItem): void {
    const request: UpdateOrderItemRequest = {
      orderItemId: item.id,
      productId: item.productId,
      productQuantity: item.quantity + 1
    };
    
    this.store.updateOrderItem({ id: item.id, request });
  }

  removeItem(itemId: number): void {
    if(confirm('Are you sure you want to remove this item?')) {
      this.store.deleteOrderItem(itemId);
    }
  }

  checkout(): void {
    const currentOrder = this.store.currentOrder();
    if (!currentOrder) return;

    // TODO: when adding payment methods in the backend i will fix this
    // simulate an edit to change status or navigate to payment gateway.
    
    const checkoutUpdate = {
      id: currentOrder.id,
      newOrder: {
        order_Status: OrderStatus.PROCESSING
      }
    };

    this.store.editOrder(checkoutUpdate);
    alert(`Checkout processed for $${this.totalAmount().toFixed(2)}!`);
  }
}