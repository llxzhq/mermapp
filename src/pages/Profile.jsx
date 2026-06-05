import { useNavigate } from "react-router-dom";

import {
  LogOut,
  Store,
  User,
  Lock,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useMsal,
} from "@azure/msal-react";

import LogoMermas from "../assets/images/logotipo_mermas.png";

import LogoMermo from "../assets/images/logotipo_mermo.png";

import { api } from "../services/api";

export default function Profile() {

  // =========================================
  // NAVIGATION
  // =========================================
  const navigate =
    useNavigate();

  // =========================================
  // MSAL
  // =========================================
  const { instance } =
    useMsal();

  // =========================================
  // STORAGE
  // =========================================
  const username =
    localStorage.getItem("usuario") || "";

  const branch =
    JSON.parse(
      localStorage.getItem("branch") || "{}"
    );

  // =========================================
  // USER INFO
  // =========================================
  const email = username
    ? `${username}@epa.com.pa`
    : "Sin correo";

  const displayName = username
    ? username.charAt(0).toUpperCase() +
      username.slice(1)
    : "Usuario";

  // =========================================
  // STATES
  // =========================================
  // const [showPassword, setShowPassword] =
  //   useState(false);

  // const [saving, setSaving] =
  //   useState(false);

  // const [passwords, setPasswords] =
  //   useState({
  //     actual: "",
  //     nueva: "",
  //     confirm: "",
  //   });

  // =========================================
  // LOGOUT
  // =========================================
  const handleLogout = async () => {

    try {

      // =========================================
      // LIMPIAR STORAGE
      // =========================================
      localStorage.clear();

      sessionStorage.clear();

      // =========================================
      // LOGOUT MICROSOFT
      // =========================================
      await instance.logoutRedirect({

        postLogoutRedirectUri:
          `${import.meta.env.VITE_BASE_URL}/login`
      });

    } catch (error) {

      console.error(
        "LOGOUT ERROR:",
        error
      );
    }
  };

  // =========================================
  // CAMBIAR SUCURSAL
  // =========================================
  const handleChangeBranch = () => {

    localStorage.removeItem("branch");

    localStorage.removeItem("idTienda");

    navigate("/select-branch");
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================
  // const handleChangePassword = async () => {

  //   if (
  //     passwords.nueva !== passwords.confirm
  //   ) {

  //     alert(
  //       "Las contraseñas no coinciden"
  //     );

  //     return;
  //   }

  //   try {

  //     setSaving(true);

  //     await api.post(
  //       "/auth/change-password",
  //       {
  //         currentPassword:
  //           passwords.actual,

  //         newPassword:
  //           passwords.nueva,
  //       }
  //     );

  //     alert(
  //       "Contraseña actualizada ✅"
  //     );

  //     setShowPassword(false);

  //   } catch (err) {

  //     alert(
  //       "Error al cambiar contraseña"
  //     );

  //   } finally {

  //     setSaving(false);
  //   }
  // };

  return (

    <div className="min-h-screen bg-[#f6f7fb] flex justify-center px-3 pt-10">

      <div className="w-full max-w-sm flex flex-col">

        {/* =========================================
        LOGO
        ========================================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: -10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="flex justify-center mb-8"
        >

          <img
            src={LogoMermas}
            className="w-36"
          />

        </motion.div>

        {/* =========================================
        CONTENIDO
        ========================================= */}

        <div className="space-y-5 pb-28">

          {/* =========================================
          PERFIL
          ========================================= */}

          <motion.div

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            whileHover={{
              scale: 1.01,
            }}

            className="
              p-4
              rounded-2xl
              bg-white
              border
              border-gray-100
              shadow-sm
              flex
              items-center
              gap-3
            "
          >

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">

              <User
                size={18}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-sm font-semibold text-gray-800">

                {displayName}

              </p>

              <p className="text-xs text-gray-500">

                {email}

              </p>

            </div>

          </motion.div>

          {/* =========================================
          SUCURSAL
          ========================================= */}

          <motion.div

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.05,
            }}

            whileHover={{
              scale: 1.01,
            }}

            className="
              p-4
              rounded-2xl
              bg-white
              border
              border-gray-100
              shadow-sm
              flex
              items-center
              gap-3
            "
          >

            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">

              <Store
                size={18}
                className="text-green-600"
              />

            </div>

            <div>

              <p className="text-sm font-semibold text-gray-800">

                {branch?.tienda ||
                  "Sin sucursal"}

              </p>

              <p className="text-xs text-gray-500">

                ID:
                {" "}
                {branch?.idTienda || "-"}

              </p>

            </div>

          </motion.div>

          {/* =========================================
          ACCIONES
          ========================================= */}

          <div className="space-y-2">

            <motion.button

              whileTap={{
                scale: 0.97,
              }}

              className="
                w-full
                py-3
                rounded-xl
                bg-white
                border
                border-gray-200
                text-sm
                font-medium
                text-gray-700
                shadow-sm
                hover:bg-gray-50
                transition
              "

              onClick={
                handleChangeBranch
              }
            >

              Cambiar sucursal

            </motion.button>

            {/* =========================================
            CHANGE PASSWORD
            ========================================= */}

            {/* <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
                w-full
                py-3
                rounded-xl
                bg-white
                border
                border-gray-200
                text-sm
                font-medium
                flex
                items-center
                justify-center
                gap-2
                text-gray-700
                shadow-sm
                hover:bg-gray-50
                transition
              "
            >

              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">

                <Lock
                  size={14}
                  className="text-purple-600"
                />

              </div>

              Cambiar contraseña

            </motion.button> */}

          </div>

          {/* =========================================
          PASSWORD FORM
          ========================================= */}

          {/* <AnimatePresence>

            {showPassword && (

              <motion.div

                initial={{
                  opacity: 0,
                  height: 0,
                }}

                animate={{
                  opacity: 1,
                  height: "auto",
                }}

                exit={{
                  opacity: 0,
                  height: 0,
                }}

                className="
                  p-4
                  rounded-2xl
                  bg-white
                  border
                  border-gray-100
                  shadow-sm
                  space-y-3
                  overflow-hidden
                "
              >

                <input
                  type="password"
                  placeholder="Contraseña actual"
                  className="
                    w-full
                    p-3
                    rounded-xl
                    bg-gray-50
                    border
                    border-gray-200
                    focus:ring-2
                    focus:ring-gray-200
                    outline-none
                  "
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      actual:
                        e.target.value,
                    })
                  }
                />

              </motion.div>
            )}

          </AnimatePresence> */}

          {/* =========================================
          ACCIONES INFERIORES
          ========================================= */}

          <div className="pt-4 space-y-4">

            {/* =========================================
            MERMO AI
            ========================================= */}

            <motion.button

              whileTap={{
                scale: 0.97,
              }}

              onClick={() =>
                navigate("/mermo", {
                  state: {
                    from: "/profile",
                  },
                })
              }

              className="
                w-full
                p-5
                rounded-[28px]
                bg-gradient-to-r
                from-[#d73c26]
                to-[#bf331f]
                text-white
                shadow-xl
                shadow-[#d73c26]/20
                border
                border-[#d73c26]/20
                flex
                items-center
                gap-4
                hover:scale-[1.01]
                transition-all
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                  overflow-hidden
                  shrink-0
                "
              >

                <img
                  src={LogoMermo}
                  alt="Mermo AI"
                  className="w-9 h-9 object-contain"
                />

              </div>

              <div className="flex flex-col items-start min-w-0">

                <span className="font-bold text-base">

                  Mermo AI

                </span>

                <span className="text-sm text-white/80 text-left">

                  Asistente inteligente de mermas

                </span>

              </div>

            </motion.button>

            {/* =========================================
            LOGOUT
            ========================================= */}

            <motion.button

              whileTap={{
                scale: 0.97,
              }}

              onClick={handleLogout}

              className="
                w-full
                py-4
                rounded-2xl
                bg-white
                border
                border-red-100
                text-red-600
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                shadow-sm
                hover:bg-red-50
                transition-all
              "
            >

              <LogOut size={18} />

              Cerrar sesión

            </motion.button>

          </div>

        </div>

      </div>

    </div>
  );
}