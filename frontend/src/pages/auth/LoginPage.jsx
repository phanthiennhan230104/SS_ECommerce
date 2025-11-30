import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

import "../../styles/LoginPage.css";

import FormInput from "../../components/inputs/FormInput";
import LoginButton from "../../components/buttons/LoginButton";
import FlashSaleBadge from "../../components/auth/FlashSaleBadge";
import LoginHeader from "../../components/auth/LoginHeader";
import LiveUsersIndicator from "../../components/auth/LiveUsersIndicator";
import BackgroundAnimation from "../../components/auth/BackgroundAnimation";

import { Link } from "react-router-dom";

import { validateEmail, validatePassword } from "../../utils/validation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const newErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("Login successful!");
      }, 1000);
    }
  };

  return (
    <div className="login-container">

      <BackgroundAnimation />

      <div className="login-wrapper">

        <FlashSaleBadge />

        <div className="login-card">

          <LoginHeader />

          <label className="form-label">Email Address</label>
          <FormInput
            type="email"
            value={email}
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="form-label">Password</label>
          <FormInput
            type="password"
            value={password}
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onChange={(e) => setPassword(e.target.value)}
          />

          <LoginButton isLoading={isLoading} onClick={handleLogin} />

          <p className="signup-link">
            Don’t have an account? <Link to="/register" className="signup-button"> Register now!!</Link>
          </p>

        </div>

        <LiveUsersIndicator />

      </div>
    </div>
  );
}
