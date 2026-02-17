import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    loading,
    authChecking,
    pwdResetRequired,
  } = useAuth();

  if (loading || authChecking) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (pwdResetRequired) {
    return <Navigate to="/reset-password" replace />;
  }

  return children;
};

export default ProtectedRoute;
