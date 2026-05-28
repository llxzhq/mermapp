import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
import LogoMermas from "../assets/images/logotipo_mermas.png";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setErrorMsg("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      await axios.post(
        "http://localhost:3000/api/register",
        form
      );

      // pequeño delay UX
      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Error del servidor"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col justify-between">

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col justify-center px-6">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src={LogoMermas} className="w-44" />
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-sm mx-auto w-full">

          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Crear cuenta 
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            Regístrate para comenzar a usar la app
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-xs text-gray-500">
                Correo electrónico
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@epa.com.pa"
                className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-gray-500">
                Contraseña
              </label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {errorMsg && (
              <p className="text-xs text-red-500">
                {errorMsg}
              </p>
            )}

            {/* BOTÓN */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition
                ${loading
                  ? "bg-gray-300 text-gray-500"
                  : "bg-gray-800 text-white"
                }
              `}
            >
              {loading ? "Creando cuenta..." : "Registrarme"}
            </motion.button>

          </form>

          {/* LINK LOGIN */}
          <p className="text-xs text-gray-400 text-center mt-5">
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-gray-700 font-semibold cursor-pointer"
            >
              Inicia sesión
            </span>
          </p>

        </div>

      </div>

      {/* FOOTER */}
      <div className="pb-6 flex justify-center">
        <img
          src={LogoCafeDuranGris}
          className="w-20 opacity-70"
        />
      </div>

      {/* 🔥 OVERLAY LOADING */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-800 border-t-transparent mx-auto mb-3" />
              <p className="text-sm font-semibold">
                Creando cuenta...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}