import { AuthProvider } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

import Splash from "./pages/Splash";
import Dashboard from "./layouts/Dashboard";
import DitziaLayout from "./layouts/DitziaLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import SelectBranch from "./pages/SelectBranch";
import Checkout from "./pages/Checkout";
import Historial from "./pages/Historial";
import MermaDetalle from "./pages/MermaDetalle";
import Reports from "./pages/Reports";
import Mermo from "./pages/Mermo";
import HomeGestion from "./pages/Ditzia/homeGestion";
import GestorMermas from "./pages/Ditzia/GestorMermas";
import GestorDetails from "./pages/Ditzia/GestorDetails";
import GestorReports from "./pages/Ditzia/GestorReports";
import Login2 from "./pages/Login2";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* =========================================
        🔓 RUTAS PÚBLICAS
        ========================================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/logs" element={<Logs />} />

        {/* =========================================
        🔒 MERMO DITZIA SIN NAVBAR
        ========================================= */}
        <Route
          path="/gestion-mermo"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <Mermo />
            </ProtectedRoute>
          }
        />

        {/* =========================================
        🔒 RUTAS DITZIA
        ========================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <DitziaLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home-gestion" element={<HomeGestion />} />
          <Route path="/gestion-mermas" element={<GestorMermas />} />
          <Route path="/gestion-reportes" element={<GestorReports />} />
          <Route path="/gestion-detalles/:id" element={<GestorDetails />} />
        </Route>

        {/* =========================================
        🔒 RUTAS SUPERVISORES
        ========================================= */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/select-branch" element={<SelectBranch />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/mermas/detalle/:id" element={<MermaDetalle />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/mermo" element={<Mermo />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* =========================================
        🚫 DEFAULT
        ========================================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
