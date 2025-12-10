import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartAPI from "../../api/cartAPI";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import CheckoutModal from "../../components/CheckoutModal";
import "../../styles/CartPage.css";
import "../../styles/global.css";


export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vui lòng đăng nhập để xem giỏ hàng!");
      navigate("/login");
      return;
    }

    cartAPI
      .getCart()
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Lỗi tải giỏ hàng:", err);
        if (err.response?.status === 401) {
          alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("token");
          navigate("/login");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.updateItem(productId, newQuantity);
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("❌ Không thể cập nhật số lượng!");
    }
  };

  const handleRemove = async (productId) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      console.log("🗑️ Đang xóa sản phẩm ID:", productId);
      const response = await cartAPI.removeItem(productId);
      console.log("✅ Xóa thành công:", response);
      
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      alert("✅ Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa:", error);
      console.error("❌ Response:", error.response);
      alert(`❌ Không thể xóa sản phẩm! ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCheckoutClick = () => {
    if (!cart || cart.items.length === 0) {
      alert("❌ Giỏ hàng trống! Vui lòng thêm sản phẩm.");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (formData) => {
    setIsCheckingOut(true);
    try {
      // Prepare order data from cart
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totalAmount: cart.totalAmount,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        customerPhone: formData.customerPhone
      };

      console.log("📦 Dữ liệu checkout:", orderData);

      // Call checkout API
      const response = await cartAPI.checkout(orderData);
      
      if (response.data) {
        alert("✅ Đặt hàng thành công!");
        setShowCheckoutModal(false);
        // Refresh cart
        fetchCart();
        // Redirect to orders page
        navigate("/orders");
      }
    } catch (error) {
      console.error("❌ Lỗi khi đặt hàng:", error);
      const errorMsg = error.response?.data?.message || error.message;
      alert(`❌ Có lỗi xảy ra! ${errorMsg}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Header />
        <div className="cart-loading">Đang tải giỏ hàng...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="main">
        <div className="container">
          <div className="cart-page">
            <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>

            {cart?.items?.length > 0 ? (
              <div className="cart-content">
                {/* Danh sách sản phẩm */}
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item__image">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      </div>

                      <div className="cart-item__info">
                        <h3 className="cart-item__name">{item.product.name}</h3>
                        <p className="cart-item__price">
                          {item.unitPrice?.toLocaleString("vi-VN")} đ
                        </p>
                      </div>

                      <div className="cart-item__quantity">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <span className="quantity-value">{item.quantity}</span>

                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item__total">
                        {item.lineTotal?.toLocaleString("vi-VN")} đ
                      </div>

                      <button
                        className="cart-item__remove"
                        onClick={() => handleRemove(item.product.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tổng quan đơn hàng */}
                <div className="cart-summary">
                  <h2 className="cart-summary__title">Tổng đơn hàng</h2>

                  <div className="cart-summary__row">
                    <span>Tạm tính:</span>
                    <span>
                      {cart.totalAmount?.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="cart-summary__row">
                    <span>Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>

                  <div className="cart-summary__divider"></div>

                  <div className="cart-summary__total">
                    <span>Tổng cộng:</span>
                    <span className="cart-summary__total-price">
                      {cart.totalAmount?.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <button 
                    className="cart-summary__checkout"
                    onClick={handleCheckoutClick}
                  >
                    Tiến hành thanh toán
                  </button>

                  <button
                    className="cart-summary__continue"
                    onClick={() => navigate("/home")}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            ) : (
              <div className="cart-empty">
                <div className="cart-empty__icon">🛒</div>
                <h2>Giỏ hàng trống</h2>
                <p>Hãy thêm sản phẩm để bắt đầu mua sắm!</p>
                <button
                  className="cart-empty__button"
                  onClick={() => navigate("/home")}
                >
                  Khám phá sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          onClose={() => !isCheckingOut && setShowCheckoutModal(false)}
          onSubmit={handleCheckoutSubmit}
          isLoading={isCheckingOut}
        />
      )}
    </div>
  );
}
