import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("token_exp");

  const isTokenValid = () => {
    return token && Date.now() < parseInt(expiration);
  };

  return isTokenValid() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
