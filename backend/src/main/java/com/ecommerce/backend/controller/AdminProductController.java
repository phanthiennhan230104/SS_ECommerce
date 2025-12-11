package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.CacheService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.backend.dto.request.product.FlashSaleRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final ProductService productService;
    private final CacheService cacheService;

    public AdminProductController(ProductService productService, CacheService cacheService) {
        this.productService = productService;
        this.cacheService = cacheService;
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

    @PutMapping("/products/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody ProductDto dto
    ) {
        try {
            ProductDto updated = productService.updateProduct(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ex.getMessage());
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().body("Xoá sản phẩm thành công");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
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

    // ============= CACHE MANAGEMENT ENDPOINTS =============

    /**
     * ✅ Endpoint để invalidate cache tất cả products
     * GET /api/admin/cache/clear
     */
    @PostMapping("/cache/clear")
    public ResponseEntity<?> clearAllCache() {
        try {
            cacheService.invalidateAllProductCaches();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã xóa tất cả cache products");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa cache: " + ex.getMessage());
        }
    }

    /**
     * ✅ Endpoint để invalidate cache danh sách tất cả products
     * POST /api/admin/cache/clear/all-products
     */
    @PostMapping("/cache/clear/all-products")
    public ResponseEntity<?> clearAllProductsCache() {
        try {
            cacheService.invalidateAllProductsCache();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã xóa cache danh sách tất cả products");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa cache: " + ex.getMessage());
        }
    }

    /**
     * ✅ Endpoint để invalidate cache flash sale products
     * POST /api/admin/cache/clear/flash-sale
     */
    @PostMapping("/cache/clear/flash-sale")
    public ResponseEntity<?> clearFlashSaleCache() {
        try {
            cacheService.invalidateFlashSaleCache();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã xóa cache flash sale products");
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa cache: " + ex.getMessage());
        }
    }

    /**
     * ✅ Endpoint để invalidate cache của một product cụ thể
     * POST /api/admin/cache/clear/product/{productId}
     */
    @PostMapping("/cache/clear/product/{productId}")
    public ResponseEntity<?> clearProductCache(@PathVariable Long productId) {
        try {
            cacheService.invalidateProductCache(productId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đã xóa cache cho product ID: " + productId);
            response.put("productId", productId);
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi xóa cache: " + ex.getMessage());
        }
    }

    /**
     * ✅ Endpoint để kiểm tra status của cache
     * GET /api/admin/cache/status
     */
    @GetMapping("/cache/status")
    public ResponseEntity<?> getCacheStatus() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("hasAllProductsCache", cacheService.hasAllProductsCache());
            response.put("cacheTtl", cacheService.getCacheTtl());
            response.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi kiểm tra cache: " + ex.getMessage());
        }
    }
}
