const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = ({ username, email, password }) => {
  const errors = [];

  if (!username?.trim()) errors.push("Username is required");
  else if (username.trim().length < 3 || username.trim().length > 30) {
    errors.push("Username must be between 3 and 30 characters");
  }

  if (!email?.trim()) errors.push("Email is required");
  else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    errors.push("Please enter a valid email address");
  }

  if (!password) errors.push("Password is required");
  else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
};

export const validateLoginInput = ({ email, password }) => {
  const errors = [];

  if (!email?.trim()) errors.push("Email is required");
  else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    errors.push("Please enter a valid email address");
  }

  if (!password) errors.push("Password is required");

  return errors;
};

export const validateForgotPasswordInput = ({ email }) => {
  const errors = [];

  if (!email?.trim()) errors.push("Email is required");
  else if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    errors.push("Please enter a valid email address");
  }

  return errors;
};

export const validateResetPasswordInput = ({ token, password }) => {
  const errors = [];

  if (!token?.trim()) errors.push("Reset token is required");
  if (!password) errors.push("New password is required");
  else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
};
