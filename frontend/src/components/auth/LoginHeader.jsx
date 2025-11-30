import { ShoppingBag } from "lucide-react";

export default function LoginHeader() {
  return (
    <div className="login-header">
      <div className="logo-container">
        <ShoppingBag size={32} color="white" />
      </div>
      <h1 className="login-title">Welcome Back</h1>
      <p className="login-subtitle">Sign in to access exclusive flash sales</p>
    </div>
  );
}
