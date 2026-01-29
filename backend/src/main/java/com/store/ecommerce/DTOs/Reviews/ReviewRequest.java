package com.store.ecommerce.DTOs.Reviews;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReviewRequest {
    public String title;
    public String comment;
    public Long userId; 
}
