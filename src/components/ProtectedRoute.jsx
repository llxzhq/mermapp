import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {

  //const { user, loading } = useAuth();
  const user = localStorage.getItem("usuario");

  // =========================================
  // LOADING
  // =========================================
  // if (loading) {
  //   return null;
  // }

  // =========================================
  // SIN LOGIN
  // =========================================
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // =========================================
  // ROL USUARIO
  // =========================================
  const rol = Number(
    localStorage.getItem("rol")
  );

  // =========================================
  // VALIDAR ROL
  // =========================================
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(rol)
  ) {

    // =========================================
    // REDIRECCIÓN SEGÚN ROL
    // =========================================
    if (rol === 2) {
      return (
        <Navigate
          to="/home-gestion"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/select-branch"
        replace
      />
    );
  }

  return children;
}