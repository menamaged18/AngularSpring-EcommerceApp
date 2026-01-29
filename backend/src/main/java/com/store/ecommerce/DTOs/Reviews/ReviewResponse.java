package com.store.ecommerce.DTOs.Reviews;

import java.time.LocalDateTime;

import com.store.ecommerce.model.Reviews;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReviewResponse {
    private Long ReviewId;
    private String title;
    private String comment;
    private LocalDateTime created_at;
    // private Long productId;
    private Long userId;
    private String UserName;
    private String userEmail;

    public ReviewResponse(Reviews review){
        this.ReviewId = review.getId();
        this.title = review.getTitle();
        this.comment = review.getComment();
        this.created_at = review.getCreated_at();
        this.userId = review.getUser().getId();
        this.UserName = review.getUser().getName();
        this.userEmail = review.getUser().getEmail();
        // this.productId = review.getProduct().getId();
    }
}
