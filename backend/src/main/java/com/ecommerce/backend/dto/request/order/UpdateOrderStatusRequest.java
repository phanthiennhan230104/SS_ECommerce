package com.ecommerce.backend.dto.request.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequest {
    private String status;
}
