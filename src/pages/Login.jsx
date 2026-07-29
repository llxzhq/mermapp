import { useEffect, useState } from "react";

import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
import LogoMermas from "../assets/images/logotipo_mermas.png";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../adapters/auth/authConfig.js";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const { instance, accounts } = useMsal();

  const { setUser } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // =========================================
  // ERROR UI
  // =========================================
  const triggerError = (msg) => {

    setErrorMsg(msg);

    setShake(true);

    setTimeout(() => setShake(false), 400);
  };

  // =========================================
  // LOGIN MICROSOFT (REDIRECT CALLBACK)
  // =========================================
  useEffect(() => {

    const processLogin = async () => {

      try {

        setLoading(true);

        const response =
          await instance.handleRedirectPromise();

        if (!response) {

          setLoading(false);

          return;
        }

        console.log(
          "🔵 RESPUESTA MICROSOFT:",
          response
        );

        // =========================================
        // ID TOKEN
        // =========================================
        const idToken = response.idToken;

        console.log("🟡 ID TOKEN:", idToken);

        if (!idToken) {
          throw new Error(
            "No se recibió idToken de Microsoft"
          );
        }

        // =========================================
        // ACCESS TOKEN
        // =========================================
        let accessToken = null;

        try {

          const account =
            response.account || accounts[0];

          if (account) {

            const tokenResponse =
              await instance.acquireTokenSilent({
                account,
                scopes: ["User.Read"],
              });

            accessToken =
              tokenResponse.accessToken;

            console.log(
              "🟢 ACCESS TOKEN:",
              accessToken
            );
          }

        } catch (err) {

          console.warn(
            "⚠️ No se pudo obtener access token:",
            err
          );
        }

        // =========================================
        // LOGIN BACKEND
        // =========================================
        const backendResponse = await fetch(

           `${import.meta.env.VITE_API_URL}/auth/login-azure`,
          
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              Token: idToken,
            }),
          }
        );

        console.log(
          "STATUS BACKEND:",
          backendResponse.status
        );

        if (!backendResponse.ok) {

          throw new Error(
            `Backend respondió ${backendResponse.status}`
          );
        }

        const result =
          await backendResponse.json();

        console.log(
          "RESPUESTA BACKEND:",
          result
        );

        if (
          result.status !== "OK" ||
          !result.data?.length
        ) {

          throw new Error(
            result.message ||
            "Respuesta inválida del servidor"
          );
        }

        const user = result.data[0];

        console.log(
          "USUARIO LOGIN:",
          user
        );

        if (!user.token) {

          throw new Error(
            "El backend no devolvió JWT"
          );
        }

        // =========================================
        // LIMPIAR STORAGE
        // =========================================
        localStorage.clear();

        // =========================================
        // GUARDAR SESIÓN
        // =========================================
        localStorage.setItem(
          "token",
          user.token
        );

        localStorage.setItem(
          "usuario",
          user.usuario || ""
        );

        localStorage.setItem(
          "nombre",
          user.nombre || ""
        );

        localStorage.setItem(
          "rol",
          String(user.rol || "")
        );

        localStorage.setItem(
          "ruta",
          String(user.ruta || "")
        );

        localStorage.setItem(
          "idUsuario",
          String(user.id || "")
        );

        // =========================================
        // ACTUALIZAR CONTEXTO
        // =========================================
        setUser({
          token: user.token,
          usuario: user.usuario,
          nombre: user.nombre,
          rol: user.rol,
          ruta: user.ruta,
        });

        console.log("LOGIN EXITOSO");

        // =========================================
        // REDIRECCIÓN
        // =========================================
        if (Number(user.rol) === 2) {

          navigate("/home-gestion");

        } else {

          navigate("/select-branch");
        }

      } catch (err) {

        console.error(
          "MICROSOFT LOGIN ERROR:",
          err
        );

        triggerError(
          err.message ||
          "No pudimos iniciar sesión"
        );

        setLoading(false);

        setShowLoader(false);
      }
    };

    processLogin();

  }, [
    instance,
    accounts,
    navigate,
    setUser,
  ]);

  // =========================================
  // LOGIN BUTTON
  // =========================================
  const handleMicrosoftLogin = async () => {

    try {

      setErrorMsg("");

      setLoading(true);

      setTimeout(() => {

        setShowLoader(true);

      }, 400);

      await instance.loginRedirect({
        ...loginRequest,
        prompt: "select_account",
      });

    } catch (err) {

      console.error(
        "LOGIN REDIRECT ERROR:",
        err
      );

      triggerError(
        "No pudimos iniciar sesión con Microsoft"
      );

      setLoading(false);

      setShowLoader(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#f6f7fb] flex flex-col justify-between">

      <div className="flex-1 flex flex-col justify-center px-6">

        <div className="flex justify-center mb-8">

          <img
            src={LogoMermas}
            className="w-48"
          />

        </div>

        <motion.div
          animate={
            shake
              ? { x: [-6, 6, -4, 4, 0] }
              : {}
          }
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-sm mx-auto w-full"
        >

          <h2 className="text-xl font-bold mb-1 text-center">
            Bienvenido
          </h2>

          <p className="text-sm text-gray-400 mb-6 text-center">
            Accede con tu cuenta corporativa
          </p>

          <AnimatePresence>

            {errorMsg && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3"
              >

                <AlertTriangle
                  className="text-red-500 mt-1"
                  size={18}
                />

                <p className="text-xs text-red-600 font-medium">
                  {errorMsg}
                </p>

              </motion.div>
            )}

          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
              ${loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >

            {loading
              ? "Conectando..."
              : "Iniciar con Microsoft"}

          </motion.button>

        </motion.div>

      </div>

      <div className="pb-6 flex justify-center">

        <img
          src={LogoCafeDuranGris}
          className="w-20 opacity-70"
        />

      </div>

      <AnimatePresence>

        {showLoader && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >

            <div className="bg-white px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center">

              <div className="w-12 h-12 border-4 border-gray-200 rounded-full relative">

                <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin" />

              </div>

              <p className="text-sm font-semibold mt-4">
                Conectando con Microsoft...
              </p>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}