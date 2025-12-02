package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private ProductDto toDto(Product p) {
    ProductDto dto = new ProductDto();
    dto.setId(p.getId());
    dto.setSellerId(p.getSeller() != null ? p.getSeller().getId() : null);
    dto.setName(p.getName());
    dto.setDescription(p.getDescription());
    dto.setPrice(p.getPrice());
    dto.setStock(p.getStock());
    dto.setImageUrl(p.getImageUrl());
    dto.setStatus(p.getStatus() != null ? p.getStatus().name() : null);
    return dto;
}

}
