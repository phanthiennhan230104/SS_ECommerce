package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class CacheService {

    private final RedisTemplate<String, Object> redisObjectTemplate;

    // ✅ TTL cho cache (tính bằng giây) - mặc định 5 phút
    @Value("${app.cache.ttl:300}")
    private long cacheTtl;

    // ✅ Cache keys
    public static final String CACHE_ALL_PRODUCTS = "products:all";
    public static final String CACHE_FLASH_SALE_PRODUCTS = "products:flash-sale";
    public static final String CACHE_PRODUCT_PREFIX = "product:";

    public CacheService(RedisTemplate<String, Object> redisObjectTemplate) {
        this.redisObjectTemplate = redisObjectTemplate;
    }

    // ============= GET CACHE =============

    /**
     * Lấy danh sách tất cả products từ cache
     */
    @SuppressWarnings("unchecked")
    public List<ProductDto> getAllProductsFromCache() {
        Object cached = redisObjectTemplate.opsForValue().get(CACHE_ALL_PRODUCTS);
        return (List<ProductDto>) cached;
    }

    /**
     * Lấy danh sách flash sale products từ cache
     */
    @SuppressWarnings("unchecked")
    public List<ProductDto> getFlashSaleProductsFromCache() {
        Object cached = redisObjectTemplate.opsForValue().get(CACHE_FLASH_SALE_PRODUCTS);
        return (List<ProductDto>) cached;
    }

    /**
     * Lấy một product cụ thể từ cache
     */
    public ProductDto getProductFromCache(Long productId) {
        return (ProductDto) redisObjectTemplate.opsForValue()
                .get(CACHE_PRODUCT_PREFIX + productId);
    }

    // ============= SET CACHE =============

    /**
     * Lưu danh sách tất cả products vào cache
     */
    public void setAllProductsCache(List<ProductDto> products) {
        redisObjectTemplate.opsForValue().set(
                CACHE_ALL_PRODUCTS,
                products,
                cacheTtl,
                TimeUnit.SECONDS
        );
    }

    /**
     * Lưu danh sách flash sale products vào cache
     */
    public void setFlashSaleProductsCache(List<ProductDto> products) {
        redisObjectTemplate.opsForValue().set(
                CACHE_FLASH_SALE_PRODUCTS,
                products,
                cacheTtl,
                TimeUnit.SECONDS
        );
    }

    /**
     * Lưu một product cụ thể vào cache
     */
    public void setProductCache(Long productId, ProductDto product) {
        redisObjectTemplate.opsForValue().set(
                CACHE_PRODUCT_PREFIX + productId,
                product,
                cacheTtl,
                TimeUnit.SECONDS
        );
    }

    // ============= DELETE CACHE =============

    /**
     * Xóa cache danh sách tất cả products
     */
    public void invalidateAllProductsCache() {
        redisObjectTemplate.delete(CACHE_ALL_PRODUCTS);
    }

    /**
     * Xóa cache danh sách flash sale products
     */
    public void invalidateFlashSaleCache() {
        redisObjectTemplate.delete(CACHE_FLASH_SALE_PRODUCTS);
    }

    /**
     * Xóa cache của một product cụ thể
     */
    public void invalidateProductCache(Long productId) {
        redisObjectTemplate.delete(CACHE_PRODUCT_PREFIX + productId);
    }

    /**
     * Xóa tất cả cache liên quan đến products (toàn bộ)
     */
    public void invalidateAllProductCaches() {
        invalidateAllProductsCache();
        invalidateFlashSaleCache();
        
        // Xóa tất cả individual product caches
        String pattern = CACHE_PRODUCT_PREFIX + "*";
        redisObjectTemplate.delete(
            redisObjectTemplate.keys(pattern)
        );
    }

    /**
     * Kiểm tra xem cache có tồn tại hay không
     */
    public boolean hasAllProductsCache() {
        return Boolean.TRUE.equals(redisObjectTemplate.hasKey(CACHE_ALL_PRODUCTS));
    }

    /**
     * Lấy TTL của cache (tính bằng giây)
     */
    public long getCacheTtl() {
        Long expire = redisObjectTemplate.getExpire(CACHE_ALL_PRODUCTS, TimeUnit.SECONDS);
        return expire != null ? expire : -1;
    }
}
