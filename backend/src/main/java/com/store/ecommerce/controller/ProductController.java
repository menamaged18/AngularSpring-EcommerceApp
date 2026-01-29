package com.store.ecommerce.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.store.ecommerce.DTOs.Product.ProductResponse;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.service.ProductService;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/product")
public class ProductController {
    private final ProductService prodServ;

    public ProductController(ProductService _ProductService){
        this.prodServ = _ProductService;
    }

    @PostMapping("")
    public ResponseEntity<ProductResponse> addProduct(@RequestBody Product prod) {
        Product newProduct = prodServ.addProduct(prod);
        ProductResponse response = new ProductResponse(newProduct);
        // Return a 201 Created status
        return ResponseEntity.created(
            // (Optional but Recommended) Include the location of the new resource
            URI.create("/products/" + response.getId())
        ).body(response); 
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        ProductResponse response = new ProductResponse(prodServ.returnProductById(id));
        return response;
    }

    @GetMapping("")
    public List<ProductResponse> getAllProducts() {    
        return prodServ.allProducts().stream().map(ProductResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/category/{category}")
    public List<ProductResponse> getCategoryProducts(@PathVariable String category) {    
        return prodServ.getProductsByCategory(category)
                        .stream().map(ProductResponse::new).collect(Collectors.toList());
    }

    @PostMapping("/list")
    public List<ProductResponse> getProductsByIds(@RequestBody List<Long> ids) {    
        return prodServ.getProductsByIds(ids)
                        .stream().map(ProductResponse::new).collect(Collectors.toList());
    }
    
    @PutMapping("/edit/{id}")
    public ProductResponse editProduct(@PathVariable Long id, @RequestBody Product newProduct) {
        return new ProductResponse(prodServ.EditProduct(id, newProduct));
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = prodServ.saveImage(id, file);
        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        prodServ.deleteProductByid(id);
        return ResponseEntity.noContent().build();
    }
}
