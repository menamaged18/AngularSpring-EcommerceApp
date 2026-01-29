package com.store.ecommerce.service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Path;
import java.nio.file.Paths;

import com.store.ecommerce.model.Product;
import com.store.ecommerce.repository.ProductRepo;

@Service
public class ProductService {
    private final ProductRepo productRepo;

    public ProductService(ProductRepo prorep){
        this.productRepo = prorep;
    }

    public Product returnProductById(Long prodid){
        return productRepo.findById(prodid).orElseThrow(()-> new RuntimeException("Product not found!"));
    }

    public Product addProduct(Product prod){
        return productRepo.save(prod);
    }

    public ResponseEntity<Void> deleteProductByid(Long prodid){
        productRepo.deleteById(prodid);
        return ResponseEntity.noContent().build();
    }

    public List<Product> allProducts(){
        return productRepo.findAll();
    }

    public List<Product> getProductsByCategory(String category){
        return productRepo.findByCategory(category);
    }

    public List<Product> getProductsByIds(List<Long> Ids){
        List<Product> list = new ArrayList<>();
        for(Long id : Ids){
            Product product = returnProductById(id);
            list.add(product);
        }
        return list;
    }

    public Product EditProduct(Long id, Product newProduct){
        Product oldProduct = productRepo.findById(id).orElseThrow(()-> new RuntimeException("Product not found!"));
        if (newProduct.getName() != null) {
            oldProduct.setName(newProduct.getName());
        }
        if (newProduct.getCategory() != null) {
            oldProduct.setCategory(newProduct.getCategory()); 
        }
        if (newProduct.getDescription() != null) {
            oldProduct.setDescription(newProduct.getDescription()); 
        }
        if (newProduct.getQuantity() != null) {
            oldProduct.setQuantity(newProduct.getQuantity());
        }
        if (newProduct.getBrand() != null) {
            oldProduct.setBrand(newProduct.getBrand());
        }
        if (newProduct.getPrice() != null) {
            oldProduct.setPrice(newProduct.getPrice());
        }
        if (newProduct.getWeight() != null) {
            oldProduct.setWeight(newProduct.getWeight());
        }
        if (newProduct.getIs_active() != null) { 
            oldProduct.setIs_active(newProduct.getIs_active());
        }

        return productRepo.save(oldProduct);
    }

    public void updateStock(Product product, int newQuantity, int oldQuantity) {
        Long currentQuantity = product.getQuantity();

        // This calculates the *change* in quantity
        // Example 1 (Adding to cart): new=5, old=0. Change = 5
        // Example 2 (Editing cart): new=3, old=5. Change = -2 (add 2 back to stock)
        // Example 3 (Editing cart): new=8, old=5. Change = 3 (remove 3 more from stock)
        int quantityChange = newQuantity - oldQuantity;

        // add to stock case
        if (quantityChange < 0) {
            product.setQuantity(currentQuantity + Math.abs(quantityChange));
        }else{
            if (currentQuantity == null || currentQuantity < quantityChange) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Insufficient stock for product ID: " + product.getId() + 
                    ". Requested: " + newQuantity + ", Available: " + currentQuantity);
            }
            product.setQuantity(currentQuantity - quantityChange);
        }
        
        productRepo.save(product);
    }

    public String saveImage(Long productId, MultipartFile file) {
        try {
            Product product = productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));


            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/products/" + fileName);

            System.out.println("file passed: " +  fileName);


            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            String imageUrl = "http://localhost:8080/uploads/products/" + fileName;
            product.setImageUrl(imageUrl);

            productRepo.save(product);
            return imageUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
    }


    public void updateStock(Product product, int newQuantity){
        updateStock(product, newQuantity, 0);
    }
}
