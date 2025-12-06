package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.dto.request.product.FlashSaleRequest;

import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();
    ProductDto createProduct(ProductDto dto);
    ProductDto updateFlashSale(Long productId, FlashSaleRequest request);
}
