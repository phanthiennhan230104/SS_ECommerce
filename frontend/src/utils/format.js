// src/utils/format.js

/**
 * Format currency (VND)
 * @param {number} value
 * @returns {string} "120.000 ₫"
 */
export const formatCurrency = (value) => {
  if (typeof value !== "number") return "";
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

/**
 * Format number with thousands separator
 * @param {number} n
 * @returns {string}
 */
export const formatNumber = (n) => {
  if (typeof n !== "number") return "";
  return n.toLocaleString("vi-VN");
};

/**
 * Format percentage
 * @param {number} value
 * @returns {string} "45%"
 */
export const formatPercent = (value) => `${value}%`;

/**
 * Format remaining time (ms) → { hh, mm, ss }
 */
export const formatCountdown = (ms) => {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");

  return { h, m, s };
};
