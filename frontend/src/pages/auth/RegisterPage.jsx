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

import { sendOtp, verifyOtp } from "../../api/auth";

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
  const [otpError, setOtpError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  const update = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  // -------------------------------------------
  // HANDLE SEND OTP
  // -------------------------------------------
  const handleRegister = async () => {
    const newErrors = {};

    newErrors.fullName = validateFullName(formData.fullName);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (!agreeTerms) newErrors.terms = "You must agree to the terms.";

    // Remove empty errors
    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key]
    );

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsLoading(true);
      setOtpError("");

      await sendOtp({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password
      });

      setOtpStep(true);
      setIsLoading(false);
      alert("OTP has been sent to your email!");

    } catch (err) {
      setIsLoading(false);
      alert(err.response?.data || "Failed to send OTP");
    }
  };

  // -------------------------------------------
  // HANDLE VERIFY OTP
  // -------------------------------------------
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      setOtpError("");

      await verifyOtp({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        otp: otp
      });

      alert("Registration successful!");
      window.location.href = "/login";

    } catch (err) {
      setIsLoading(false);
      setOtpError("Invalid OTP, please try again.");
    }
  };

  return (
    <div className="register-container">
      <BackgroundAnimation />

      <div className="register-wrapper">
        <FlashSaleBadge text="JOIN FLASH SALE" />

        <div className="register-card">
          <RegisterHeader />

          {/* ============ OTP STEP ============ */}
          {otpStep ? (
            <>
              <label className="form-label">Enter OTP</label>

              <FormInput
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                icon={Lock}
                error={otpError}
              />

              <RegisterButton
                isLoading={isLoading}
                onClick={handleVerifyOtp}
                text="Verify OTP"
              />

              <p className="signup-link" style={{ marginTop: "15px" }}>
                Didn't receive OTP?{" "}
                <span
                  style={{ color: "#9333ea", cursor: "pointer" }}
                  onClick={!isLoading ? handleRegister : undefined}
                >
                  Resend
                </span>
              </p>
            </>
          ) : (
            <>
              {/* ============ REGISTER FORM ============ */}

              <label className="form-label">Full Name</label>
              <FormInput
                type="text"
                value={formData.fullName}
                placeholder="John Doe"
                onChange={update("fullName")}
                icon={User}
                error={errors.fullName}
              />

              <label className="form-label">Email Address</label>
              <FormInput
                type="email"
                value={formData.email}
                placeholder="you@example.com"
                onChange={update("email")}
                icon={Mail}
                error={errors.email}
              />

              <label className="form-label">Phone Number</label>
              <FormInput
                type="tel"
                value={formData.phone}
                placeholder="0123456789"
                onChange={update("phone")}
                icon={Phone}
                error={errors.phone}
              />

              <label className="form-label">Password</label>
              <FormInput
                type="password"
                value={formData.password}
                placeholder="Create a strong password"
                onChange={update("password")}
                icon={Lock}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={errors.password}
              />

              <label className="form-label">Confirm Password</label>
              <FormInput
                type="password"
                value={formData.confirmPassword}
                placeholder="Re-enter your password"
                onChange={update("confirmPassword")}
                icon={Lock}
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                error={errors.confirmPassword}
              />

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

              <RegisterButton
                isLoading={isLoading}
                onClick={handleRegister}
                text="Create Account"
              />

              <p className="signup-link">
                Already have an account?
                <Link to="/login" className="signup-button">
                  {" "}
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <LiveUsersIndicator count={5234} />
      </div>
    </div>
  );
}
