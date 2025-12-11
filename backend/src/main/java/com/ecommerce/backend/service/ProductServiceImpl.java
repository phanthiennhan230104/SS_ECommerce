package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.dto.request.product.FlashSaleRequest;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CacheService cacheService;

    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CacheService cacheService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cacheService = cacheService;
    }

    @Override
    public List<ProductDto> getAllProducts() {
        // ✅ Thử lấy từ cache trước
        List<ProductDto> cachedProducts = cacheService.getAllProductsFromCache();
        if (cachedProducts != null) {
            return cachedProducts;
        }

        // ❌ Nếu cache miss -> lấy từ DB
        List<ProductDto> products = productRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();

        // ✅ Lưu vào cache
        cacheService.setAllProductsCache(products);
        return products;
    }

    @Override
    public ProductDto createProduct(ProductDto dto) {
        Product product = new Product();

        // ✅ luôn gán seller là ADMIN có id = 1
        User seller = userRepository.findById(1L)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy admin với id = 1, hãy tạo user này trước"));
        product.setSeller(seller);

        // map DTO -> entity, đảm bảo không null cho cột bắt buộc
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());

        BigDecimal price = dto.getPrice() != null ? dto.getPrice() : BigDecimal.ZERO;
        product.setPrice(price);

        Integer stock = dto.getStock() != null ? dto.getStock() : 0;
        product.setStock(stock);

        product.setImageUrl(dto.getImageUrl());

        // map status String -> enum, default ACTIVE
        Product.Status status = Product.Status.ACTIVE;
        if (dto.getStatus() != null) {
            try {
                status = Product.Status.valueOf(dto.getStatus());
            } catch (IllegalArgumentException ignored) {
                status = Product.Status.ACTIVE;
            }
        }
        product.setStatus(status);

        // các cột flash sale: mặc định chưa bật
        product.setFlashSale(false);     // is_flash_sale = 0
        product.setFlashPrice(null);     // flash_price NULL
        product.setFlashStart(null);     // flash_start NULL
        product.setFlashEnd(null);       // flash_end NULL

        // created_at, updated_at
        LocalDateTime now = LocalDateTime.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        Product saved = productRepository.save(product);
        
        // ✅ Invalidate cache khi tạo product mới
        cacheService.invalidateAllProductCaches();

        return toDto(saved);
    }

    @Override
    public ProductDto updateProduct(Long productId, ProductDto dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        // cập nhật các trường
        if (dto.getName() != null && !dto.getName().isEmpty()) {
            product.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription());
        }
        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }
        if (dto.getStock() != null) {
            product.setStock(dto.getStock());
        }
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }
        if (dto.getStatus() != null) {
            try {
                product.setStatus(Product.Status.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException ignored) {
                // giữ nguyên status cũ nếu enum sai
            }
        }

        product.setUpdatedAt(LocalDateTime.now());
        Product saved = productRepository.save(product);
        
        // ✅ Invalidate cache khi update product
        cacheService.invalidateProductCache(productId);
        cacheService.invalidateAllProductsCache();
        
        return toDto(saved);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
        productRepository.delete(product);
        
        // ✅ Invalidate cache khi delete product
        cacheService.invalidateProductCache(productId);
        cacheService.invalidateAllProductsCache();
        cacheService.invalidateFlashSaleCache();
    }

    // ✅ HÀM MỚI: cấu hình/bật/tắt flash sale cho 1 product
    @Override
    public ProductDto updateFlashSale(Long productId, FlashSaleRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        // TẮT FLASH SALE
        if (!request.isEnabled()) {
            product.setFlashSale(false);
            product.setFlashPrice(null);
            product.setFlashStart(null);
            product.setFlashEnd(null);
            product.setUpdatedAt(LocalDateTime.now());
            Product saved = productRepository.save(product);
            
            // ✅ Invalidate cache
            cacheService.invalidateAllProductCaches();
            
            return toDto(saved);
        }

        // BẬT / CẬP NHẬT FLASH SALE
        if (request.getFlashStart() == null || request.getFlashEnd() == null) {
            throw new IllegalArgumentException("flashStart và flashEnd không được null");
        }
        if (!request.getFlashStart().isBefore(request.getFlashEnd())) {
            throw new IllegalArgumentException("flashStart phải trước flashEnd");
        }

        BigDecimal basePrice = product.getPrice();
        if (basePrice == null) {
            throw new IllegalStateException("Product price is null");
        }

        BigDecimal flashPrice = request.getFlashPrice();

        // Nếu không truyền flashPrice thì dùng % giảm
        if (flashPrice == null) {
            Integer discount = request.getDiscountPercent();
            if (discount == null) {
                throw new IllegalArgumentException("Phải truyền flashPrice hoặc discountPercent");
            }
            if (discount <= 0 || discount >= 100) {
                throw new IllegalArgumentException("discountPercent phải trong (0, 100)");
            }

            BigDecimal percent = BigDecimal.valueOf(100 - discount)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            flashPrice = basePrice.multiply(percent)
                    .setScale(0, RoundingMode.HALF_UP); // làm tròn tiền VND
        }

        // validate: flashPrice > 0 và < giá gốc
        if (flashPrice.compareTo(BigDecimal.ZERO) <= 0
                || flashPrice.compareTo(basePrice) >= 0) {
            throw new IllegalArgumentException("flashPrice phải > 0 và < price gốc");
        }

        product.setFlashSale(true);
        product.setFlashPrice(flashPrice);
        product.setFlashStart(request.getFlashStart());
        product.setFlashEnd(request.getFlashEnd());
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        
        // ✅ Invalidate cache
        cacheService.invalidateAllProductCaches();
        
        return toDto(saved);
    }

    // ✅ toDto: tính luôn giá đang hiển thị theo giờ flash sale
    private ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setSellerId(p.getSeller() != null ? p.getSeller().getId() : null);
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());

        BigDecimal basePrice = p.getPrice();
        dto.setOriginalPrice(basePrice);    // cần field originalPrice trong ProductDto

        LocalDateTime now = LocalDateTime.now();
        boolean liveFlash =
                p.isFlashSale()
                        && p.getFlashStart() != null
                        && p.getFlashEnd() != null
                        && !now.isBefore(p.getFlashStart())
                        && !now.isAfter(p.getFlashEnd())
                        && p.getFlashPrice() != null;

        if (liveFlash) {
            // đang trong khung giờ flash sale
            dto.setPrice(p.getFlashPrice());
            dto.setFlashSale(true);
        } else {
            // ngoài khung giờ → dùng giá gốc
            dto.setPrice(basePrice);
            dto.setFlashSale(false);
        }

        dto.setFlashPrice(p.getFlashPrice());
        dto.setFlashStart(p.getFlashStart());
        dto.setFlashEnd(p.getFlashEnd());

        dto.setStock(p.getStock());
        dto.setImageUrl(p.getImageUrl());
        dto.setStatus(p.getStatus() != null ? p.getStatus().name() : null);
        return dto;
    }
}
