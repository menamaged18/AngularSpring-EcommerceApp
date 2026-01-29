package com.store.ecommerce.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.store.ecommerce.model.Cart;
import com.store.ecommerce.model.CartItem;
import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.model.Order;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.repository.OrderRepo;
import com.store.ecommerce.types.OrderStatus;
import com.store.ecommerce.types.PaymentType;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final OrderItemsService orderItemsService;
    private final UserService userServ;
    private final ProductService productService;
    private final CartService cartService;

    public OrderService(OrderRepo or, UserService userServ, 
                        OrderItemsService _orderItemsService, ProductService _ProductService,
                        CartService _CartService){
        this.orderRepo = or;
        this.userServ = userServ;
        this.orderItemsService = _orderItemsService;
        this.productService = _ProductService;
        this.cartService = _CartService;
    }

    public Order returnOrderById(Long id){
        return orderRepo.findById(id).orElseThrow(()-> new RuntimeException("Order not found!"));
    }

    public Order makeOrderByProductId(Long userId, Long ProductId, int quantity, 
                                       String orderAddress, PaymentType paymentType){
        CustomUser user = userServ.ReturnCustomUserById(userId);
        Order ord = new Order();
        ord.setUser(user);
        ord.setShipping_address(orderAddress);
        ord.setPayment_Type(paymentType);
        ord.setOrder_Status(OrderStatus.pending);

        // i need to save the order first to get the id
        ord = orderRepo.save(ord);

        Product product = productService.returnProductById(ProductId);
        orderItemsService.addItemToOrder(ord, product, quantity);
        return orderRepo.save(ord);
    }

    public Order makeOrderByCart(Long cartId){
        Cart cart = cartService.getCardById(cartId);
        // before fetching anything i want to make sure that the cart is not empty and contains items to make an order
        if (cart.getCart_Items().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, 
                "Cannot create an order from an empty cart. Please add items before placing an order."
            );
        }
        
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrder_Status(OrderStatus.pending);

        // i need to save the order first to get the id
        order = orderRepo.save(order);

        for (CartItem item : cart.getCart_Items()) {
            orderItemsService.addItemToOrder(order, item.getProduct(), item.getProductQuantity());
        }

        // empty the cart now
        cartService.emptyCartByCartId(cartId);
        return orderRepo.save(order);
    }

    public void deleteOrder(Long id){
        orderRepo.deleteById(id);
    }

    // Admin use
    public List<Order> getAllOrders(){
        return orderRepo.findAll();
    }

    public Order getOrderById(Long id){
        return orderRepo.findById(id).orElseThrow(()-> new RuntimeException("Order not found")); 
    }

    public List<Order> getAllUserOrders(Long userId){
        return orderRepo.findByUser_id(userId);
    }

    public Order EditOrder(Long orderId, Order newOrder){
        Order oldOrder = returnOrderById(orderId);
        if (newOrder.getUser() != null) {
            oldOrder.setUser(newOrder.getUser());
        }

        if (newOrder.getOrder_Items() != null) {
            oldOrder.setOrder_Items(newOrder.getOrder_Items());
        }

        if (newOrder.getPayment_Type() != null) {
            oldOrder.setPayment_Type(newOrder.getPayment_Type());
        }

        if (newOrder.getShipping_address() != null) {
            oldOrder.setShipping_address(newOrder.getShipping_address());
        }

        if (newOrder.getOrder_Items() != null) {
            // instead of uisng this method directly
            // oldOrder.setOrder_Items(newOrder.getOrder_Items());
            // i will use manual way because of stock update calculations
            orderItemsService.replaceOrderItems(oldOrder, newOrder);
        }

        oldOrder.setUpdated_at(LocalDateTime.now());

        return orderRepo.save(oldOrder);
    }

}
