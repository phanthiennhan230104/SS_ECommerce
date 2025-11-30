export const validateEmail = (email) => {
  if (!email || email.trim() === "") 
    return "Email is required";

  const regex = /^\S+@\S+\.\S+$/;
  if (!regex.test(email)) 
    return "Please enter a valid email";

  return null;
};


export const validatePassword = (password) => {
  if (!password || password.trim() === "") 
    return "Password is required";

  if (password.length < 6)
    return "Password must be at least 6 characters";

  return null;
};

export const validateFullName = (name) => {
  if (!name || name.trim() === "") 
    return "Full name is required";

  if (name.length < 2) 
    return "Name must be at least 2 characters";

  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";

  const cleaned = phone.replace(/[- ]/g, "");
  if (!/^[0-9]{10,11}$/.test(cleaned))
    return "Please enter a valid phone number";

  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword)
    return "Please confirm your password";

  if (password !== confirmPassword)
    return "Passwords do not match";

  return null;
};