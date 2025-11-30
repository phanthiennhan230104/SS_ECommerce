export default function LoginButton({ isLoading, onClick }) {
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
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}
