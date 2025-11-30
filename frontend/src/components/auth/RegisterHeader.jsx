import React from "react";
import { ShoppingBag } from "lucide-react";

export default function RegisterHeader() {
  return (
    <div className="login-header">
      <div className="logo-container">
        <ShoppingBag size={32} color="#fff" />
      </div>
      <h1 className="login-title">Create Account</h1>
      <p className="login-subtitle">Join now for exclusive flash sale deals</p>
    </div>
  );
}
