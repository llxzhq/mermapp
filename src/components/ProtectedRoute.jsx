// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";



export default function ProtectedRoute({ children }) {

  if (!isTokenValid()) {
    // Redirige al login si no hay token
    return <Navigate to="/login" replace />;
  }
  return children;
}
