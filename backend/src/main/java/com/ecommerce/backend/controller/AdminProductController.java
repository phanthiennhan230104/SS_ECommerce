package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.backend.dto.request.product.FlashSaleRequest;


import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public List<ProductDto> getAll() {
        return productService.getAllProducts();
    }

    @PostMapping("/products")
    public ResponseEntity<?> create(@RequestBody ProductDto dto) {
        try {
            ProductDto created = productService.createProduct(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception ex) {
            ex.printStackTrace();   // ✅ in full stack trace ra console backend
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

        @PostMapping("/products/{id}/flash-sale")
    public ResponseEntity<?> configureFlashSale(
            @PathVariable Long id,
            @RequestBody FlashSaleRequest request
    ) {
        try {
            ProductDto updated = productService.updateFlashSale(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            // lỗi validate (giờ sai, giá flash >= giá gốc, không truyền flashPrice/discount,...)
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

}
