import React, { useState } from "react";
import { Lock, Mail, User, Phone } from "lucide-react";

import "../../styles/RegisterPage.css";

import BackgroundAnimation from "../../components/auth/BackgroundAnimation";
import FlashSaleBadge from "../../components/auth/FlashSaleBadge";
import RegisterHeader from "../../components/auth/RegisterHeader";
import LiveUsersIndicator from "../../components/auth/LiveUsersIndicator";
import FormInput from "../../components/inputs/FormInput";
import RegisterButton from "../../components/buttons/RegisterButton";
import PasswordStrengthIndicator from "../../components/auth/PasswordStrengthIndicator";

import { Link } from "react-router-dom";

import {
  validateFullName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword
} from "../../utils/validation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const update = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleRegister = () => {
    const newErrors = {};

    let fullNameError = validateFullName(formData.fullName);
    let emailError = validateEmail(formData.email);
    let phoneError = validatePhone(formData.phone);
    let passwordError = validatePassword(formData.password);
    let confirmError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (fullNameError) newErrors.fullName = fullNameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;
    if (!agreeTerms)
      newErrors.terms = "You must agree to the terms and conditions.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("Account created successfully!");
      }, 1500);
    }
  };

  return (
    <div className="register-container">
      <BackgroundAnimation />

      <div className="register-wrapper">
        <FlashSaleBadge text="JOIN FLASH SALE" />

        <div className="register-card">
          <RegisterHeader />

          {/* Full name */}
          <label className="form-label">Full Name</label>
          <FormInput
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={update("fullName")}
            icon={User}
            error={errors.fullName}
          />

          {/* Email */}
          <label className="form-label">Email Address</label>
          <FormInput
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={update("email")}
            icon={Mail}
            error={errors.email}
          />

          {/* Phone */}
          <label className="form-label">Phone Number</label>
          <FormInput
            type="tel"
            placeholder="0123456789"
            value={formData.phone}
            onChange={update("phone")}
            icon={Phone}
            error={errors.phone}
          />

          {/* Password */}
          <label className="form-label">Password</label>
          <FormInput
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={update("password")}
            icon={Lock}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={errors.password}
          />
          <PasswordStrengthIndicator password={formData.password} />

          {/* Confirm Password */}
          <label className="form-label">Confirm Password</label>
          <FormInput
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={update("confirmPassword")}
            icon={Lock}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.confirmPassword}
          />

          {/* Terms */}
          <label className="terms-box">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>I agree to the Terms & Privacy Policy</span>
          </label>
          {errors.terms && (
            <p className="error-message">{errors.terms}</p>
          )}

          {/* Button */}
          <RegisterButton isLoading={isLoading} onClick={handleRegister} />

          {/* Login link */}
          <p className="signup-link">
            Already have an account?
            <Link to="/login" className="signup-button"> Sign in</Link>
          </p>
        </div>

        <LiveUsersIndicator count={5234} />
      </div>
    </div>
  );
}
