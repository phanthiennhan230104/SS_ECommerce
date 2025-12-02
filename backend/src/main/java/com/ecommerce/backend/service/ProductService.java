package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();
}
