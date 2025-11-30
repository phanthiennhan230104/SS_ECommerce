import React from "react";

export default function RegisterButton({ isLoading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="login-button"
    >
      {isLoading ? (
        <>
          <div className="spinner"></div>
          Creating Account...
        </>
      ) : (
        "Create Account"
      )}
    </button>
  );
}
