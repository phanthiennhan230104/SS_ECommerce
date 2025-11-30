import { Eye, EyeOff } from "lucide-react";

export default function FormInput({
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword
}) {
  return (
    <div className="form-group">
      <div className="input-wrapper">
        <Icon className="input-icon" />

        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error ? "error" : ""} ${
            showPasswordToggle ? "with-toggle" : ""
          }`}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="password-toggle"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
