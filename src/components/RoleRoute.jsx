import { Navigate } from "react-router-dom";

export default function RoleRoute({
  children,
  allowedRoles = [],
}) {

  const rol = localStorage.getItem("rol");

  // =========================================
  // SIN ROL
  // =========================================
  if (!rol) {
    return <Navigate to="/login" replace />;
  }

  // =========================================
  // VALIDAR ROL
  // =========================================
  if (!allowedRoles.includes(Number(rol))) {

    // =========================================
    // REDIRECCIÓN SEGÚN ROL
    // =========================================
    if (Number(rol) === 2) {
      return <Navigate to="/home-gestion" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
}