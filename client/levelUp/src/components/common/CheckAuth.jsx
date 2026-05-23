import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, children }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname.includes("/signin") ||
    location.pathname.includes("/signup");

  // 1. Not logged in + trying to access a protected page → send to /signin
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2. Already logged in + trying to visit /signin or /signup → send to dashboard
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Everything is fine → render the page
  return <>{children}</>;
};

export default CheckAuth;
