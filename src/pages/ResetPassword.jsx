import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import LogoMermas from "../assets/images/logotipo_mermas.png";

export default function ResetPassword() {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenState, setTokenState] = useState("valid"); 
  // valid | invalid | expired (simulado frontend)

  const strengthScore = password.length;

  // 🔐 VALIDACIÓN INICIAL DEL TOKEN (simulada frontend UX)
  useEffect(() => {
    if (!token) {
      setTokenState("invalid");
    }

    // UX enterprise: feedback inmediato
    if (token && token.length < 10) {
      setTokenState("expired");
    }
  }, [token]);

  const notify = (msg, type = "error") => {
    type === "error" ? toast.error(msg) : toast.success(msg);
  };

  const handleReset = async () => {

    if (!password) {
      return notify("Ingresa una nueva contraseña");
    }

    if (password.length < 6) {
      return notify("Mínimo 6 caracteres");
    }

    try {
      setLoading(true);

      const res = await fetch("http://192.168.212.69:4443/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!res.ok) {
        throw new Error("RESET_FAILED");
      }

      setSuccess(true);
      notify("Contraseña actualizada correctamente", "success");

      // UX enterprise: delay antes de redirigir
      setTimeout(() => {
        navigate("/");
      }, 2500);

    } catch (err) {
      notify("No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 BLOQUEO POR TOKEN INVÁLIDO
  if (tokenState !== "valid") {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-6">

        <Toaster position="top-center" />

        <div className="text-center max-w-sm">

          <img src={LogoMermas} className="w-44 mx-auto mb-6" />

          <h1 className="text-lg font-bold mb-2">
            Link no válido
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Este enlace de recuperación es inválido o ha expirado.
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Volver al inicio
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-6">

      <Toaster position="top-center" />

      <motion.div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src={LogoMermas} className="w-44" />
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
        >

          <h2 className="text-xl font-bold text-center">
            Restablecer contraseña
          </h2>

          <p className="text-sm text-gray-400 text-center mt-1 mb-6">
            Crea una nueva contraseña segura para tu cuenta
          </p>

          <AnimatePresence>

            {!success ? (

              <>
                {/* INPUT */}
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-300 transition"
                />

                {/* 🔐 STRENGTH INDICATOR */}
                {password && (
                  <div className="mt-2 text-xs text-gray-500">
                    Seguridad:{" "}
                    <span
                      className={
                        strengthScore < 6
                          ? "text-red-500"
                          : strengthScore < 10
                          ? "text-yellow-500"
                          : "text-green-600"
                      }
                    >
                      {strengthScore < 6
                        ? "Débil"
                        : strengthScore < 10
                        ? "Media"
                        : "Fuerte"}
                    </span>
                  </div>
                )}

                {/* BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  disabled={loading}
                  className={`w-full mt-5 py-3 rounded-xl font-semibold transition
                    ${
                      loading
                        ? "bg-gray-300 text-gray-500"
                        : "bg-gray-800 text-white hover:bg-black"
                    }
                  `}
                >
                  {loading ? "Actualizando..." : "Confirmar nueva contraseña"}
                </motion.button>
              </>

            ) : (

              // 🎉 SUCCESS STATE ENTERPRISE
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  Contraseña actualizada
                </h3>

                <p className="text-sm text-gray-500">
                  Serás redirigido automáticamente al inicio de sesión
                </p>
              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>

      </motion.div>
    </div>
  );
}