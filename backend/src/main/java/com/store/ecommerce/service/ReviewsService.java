package com.store.ecommerce.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.store.ecommerce.model.CustomUser;
import com.store.ecommerce.model.Product;
import com.store.ecommerce.model.Reviews;
import com.store.ecommerce.repository.ReviewsRepo;

@Service
public class ReviewsService {
    ReviewsRepo reviewsRepo;
    UserService userService;
    ProductService productService;

    public ReviewsService(ReviewsRepo _ReviewsRepo, UserService _userService, ProductService _productService){
        this.reviewsRepo = _ReviewsRepo;
        this.userService = _userService;
        this.productService = _productService;
    }

    public Reviews addReview(String title, String comment, Long productId, Long userId){
        CustomUser user = userService.ReturnCustomUserById(userId);
        Product product = productService.returnProductById(productId);

        Reviews review = new Reviews();
        review.setProduct(product);
        review.setUser(user);
        review.setTitle(title);
        review.setComment(comment);

        return reviewsRepo.save(review);
    }

    public void deleteReview(Long reviewId){
        reviewsRepo.deleteById(reviewId);
    }

    public Reviews getReviewById(long reviewId){
        return reviewsRepo.findById(reviewId).orElseThrow(() -> new RuntimeException("Review not Found!"));
    }

    public List<Reviews> getUserReviews(Long userId){
        CustomUser user = userService.ReturnCustomUserById(userId);
        return reviewsRepo.findByUser(user);
    }

    public List<Reviews> getProductReviews(Long productId) {
        // Implement this method to fetch reviews by product ID
        return reviewsRepo.findByProductId(productId); // Assuming you have this method in repository
    }

    public Reviews editReview(Long reviewId, String title, String text){
        Reviews review = getReviewById(reviewId);
        review.setTitle(title);
        review.setComment(text);
        review.setUpdated_at(LocalDateTime.now());
        return reviewsRepo.save(review);
    }

}
