package com.store.ecommerce.controller;

import com.store.ecommerce.DTOs.Reviews.ReviewRequest;
import com.store.ecommerce.DTOs.Reviews.ReviewResponse;
import com.store.ecommerce.model.Reviews;
import com.store.ecommerce.service.ReviewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews")
public class ReviewsController {
    private final ReviewsService reviewsService;

    public ReviewsController(ReviewsService reviewsService) {
        this.reviewsService = reviewsService;
    }

    @PostMapping("/products/{productId}")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest request) {
        
        Reviews newReview = reviewsService.addReview(
                request.title, request.comment, productId, request.userId
        );
        ReviewResponse response = new ReviewResponse(newReview);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> editReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest request) {

        Reviews updatedReview = reviewsService.editReview(
                reviewId, request.title, request.comment
        );
        ReviewResponse response = new ReviewResponse(updatedReview);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long reviewId) {
        Reviews review = reviewsService.getReviewById(reviewId);
        ReviewResponse response = new ReviewResponse(review);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@PathVariable Long userId) {
        // List<Reviews> reviews = reviewsService.getUserReviews(userId);
        List<ReviewResponse> reviews = reviewsService.getUserReviews(userId).stream().map(ReviewResponse::new)
                                            .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewsService.getProductReviews(productId).stream()
                .map(ReviewResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewsService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }
}