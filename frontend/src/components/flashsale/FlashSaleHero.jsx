// src/components/flashsale/FlashSaleHero.jsx
import React, { useEffect, useState } from "react";

const getRemainingTime = () => {
  // giả lập flash sale kết thúc sau 2h từ khi load
  const end = Date.now() + 2 * 60 * 60 * 1000;
  return end;
};

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return { hours, minutes, seconds };
};

const FlashSaleHero = () => {
  const [endTime] = useState(getRemainingTime);
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <section className="flash-hero">
      <div className="container flash-hero__content">
        <div className="flash-hero__text">
          <div className="flash-hero__title">Flash Sale Giờ Vàng</div>
          <div className="flash-hero__subtitle">
            Giảm đến <strong>50%</strong> – Số lượng có hạn!
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
