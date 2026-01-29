package com.store.ecommerce.DTOs.Product;

import com.store.ecommerce.model.Product;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SimpleProductResponse {
    private Long id;
    private String name;
    private Double price;
    private String category;
    private String description;
    private String brand;
    private Double weight;
    private Boolean is_active;
    private String imageUrl;

    public SimpleProductResponse(Product product){
        this.id = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.category = product.getCategory();
        this.description = product.getDescription();
        this.brand = product.getBrand();
        this.weight = product.getWeight();
        this.is_active = product.getIs_active();
        this.imageUrl = product.getImageUrl();
    }
}
