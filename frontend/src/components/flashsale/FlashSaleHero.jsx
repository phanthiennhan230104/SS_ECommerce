// src/components/flashsale/FlashSaleHero.jsx
import React, { useEffect, useState } from "react";
import productAPI from "../../api/productAPI";

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return { hours, minutes, seconds };
};

const calculateDiscount = (originalPrice, flashPrice) => {
  if (!originalPrice || !flashPrice) return 0;
  return Math.round(((originalPrice - flashPrice) / originalPrice) * 100);
};

const FlashSaleHero = () => {
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flashSaleInfo, setFlashSaleInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSaleInfo = async () => {
      try {
        const response = await productAPI.getAllProducts();
        
        // Lọc sản phẩm flash sale đang active
        const now = new Date();
        const activeFlashSales = response.data.filter(p => {
          if (!p.flashSale) return false;
          const startTime = new Date(p.flashStart);
          const endTime = new Date(p.flashEnd);
          return startTime <= now && now <= endTime;
        });

        // Nếu không có flash sale active, lấy flash sale sắp tới
        let flashSale = activeFlashSales[0];
        if (!flashSale) {
          const upcomingFlashSales = response.data.filter(p => {
            if (!p.flashSale) return false;
            const startTime = new Date(p.flashStart);
            return startTime > now;
          });
          flashSale = upcomingFlashSales[0];
        }

        if (flashSale) {
          const discount = calculateDiscount(flashSale.price, flashSale.flashPrice);
          setFlashSaleInfo({
            discount,
            flashStart: new Date(flashSale.flashStart),
            flashEnd: new Date(flashSale.flashEnd),
          });
          setEndTime(new Date(flashSale.flashEnd).getTime());
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin flash sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleInfo();
  }, []);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (loading || !flashSaleInfo) {
    return null;
  }

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <section className="flash-hero">
      <div className="container flash-hero__content">
        <div className="flash-hero__text">
          <div className="flash-hero__title">Flash Sale Giờ Vàng</div>
          <div className="flash-hero__subtitle">
            Giảm đến <strong>{flashSaleInfo.discount}%</strong> – Số lượng có hạn!
          </div>
        </div>

        <div className="flash-hero__timer">
          <span className="flash-hero__timer-label">Kết thúc sau</span>
          <div className="flash-hero__timer-boxes">
            <div className="flash-hero__timer-box">{hours}</div>
            <span>:</span>
            <div className="flash-hero__timer-box">{minutes}</div>
            <span>:</span>
            <div className="flash-hero__timer-box">{seconds}</div>
          </div>
        </div>

        <button className="flash-hero__cta">Mua ngay</button>
      </div>
    </section>
  );
};

export default FlashSaleHero;
