// src/components/layout/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <div className="footer__col">
          <div className="footer__logo">
            <span className="footer__logo-icon">⚡</span>
            <span>FlashMart</span>
          </div>
          <p className="footer__text">
            Hệ sinh thái mua sắm trực tuyến hàng đầu dành riêng cho những
            tín đồ công nghệ.
          </p>
        </div>

        <div className="footer__col">
          <div className="footer__title">Về chúng tôi</div>
          <ul className="footer__list">
            <li>Giới thiệu công ty</li>
            <li>Hệ thống cửa hàng</li>
            <li>Tuyển dụng</li>
          </ul>
        </div>

        <div className="footer__col">
          <div className="footer__title">Chính sách</div>
          <ul className="footer__list">
            <li>Bảo hành</li>
            <li>Đổi trả</li>
            <li>Bảo mật thông tin</li>
          </ul>
        </div>

        <div className="footer__col">
          <div className="footer__title">Hỗ trợ</div>
          <ul className="footer__list">
            <li>Trung tâm CSKH</li>
            <li>Tra cứu đơn hàng</li>
            <li>Góp ý, khiếu nại</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-content">
          <span>© {new Date().getFullYear()} FlashMart. All rights reserved.</span>
          <span>Made with ❤️ for Architecture Project</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
