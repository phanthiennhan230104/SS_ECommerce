import React from "react";

export default function PasswordStrengthIndicator({ password }) {
  if (!password) return null;

  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { width: "33%", color: "weak", text: "Weak" };
    if (score <= 3) return { width: "66%", color: "medium", text: "Medium" };
    return { width: "100%", color: "strong", text: "Strong" };
  };

  const strength = getStrength();

  return (
    <div className="strength-box">
      <div className="strength-top">
        <span>Password Strength</span>
        <span className={`text-${strength.color}`}>{strength.text}</span>
      </div>

      <div className="strength-bar">
        <div
          className={`strength-fill ${strength.color}`}
          style={{ width: strength.width }}
        ></div>
      </div>
    </div>
  );
}
