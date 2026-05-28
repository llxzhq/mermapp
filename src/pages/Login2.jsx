// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
// import LogoMermas from "../assets/images/logotipo_mermas.png";
// import { loginAdapter } from "../adapters/auth/authAdapter";
// import { motion, AnimatePresence } from "framer-motion";
// import { Eye, EyeOff, AlertTriangle } from "lucide-react";

// export default function Login() {
//   const [form, setForm] = useState({
//     Usuario: "",
//     Password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [errorMsg, setErrorMsg] = useState("");
//   const [shake, setShake] = useState(false);

//   const [showLoader, setShowLoader] = useState(false);
//   const [slowConnection, setSlowConnection] = useState(false);

//   const [attempts, setAttempts] = useState(
//     Number(localStorage.getItem("loginAttempts")) || 0
//   );

//   const [lockUntil, setLockUntil] = useState(
//     Number(localStorage.getItem("lockUntil")) || null
//   );

//   const [remainingTime, setRemainingTime] = useState(0);

//   const navigate = useNavigate();

//   const isLocked = lockUntil && Date.now() < lockUntil;

//   // ⏳ COUNTDOWN LOCK
//   useEffect(() => {
//     if (!lockUntil) return;

//     const interval = setInterval(() => {
//       const diff = lockUntil - Date.now();

//       if (diff <= 0) {
//         setLockUntil(null);
//         setAttempts(0);
//         setRemainingTime(0);

//         localStorage.removeItem("lockUntil");
//         localStorage.removeItem("loginAttempts");
//         setErrorMsg("");

//         clearInterval(interval);
//       } else {
//         setRemainingTime(diff);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [lockUntil]);

//   const formatTime = (ms) => {
//     const s = Math.floor(ms / 1000);
//     const m = Math.floor(s / 60);
//     const sec = s % 60;
//     return `${m}:${sec.toString().padStart(2, "0")}`;
//   };

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const triggerError = (msg) => {
//     setErrorMsg(msg);
//     setShake(true);
//     setTimeout(() => setShake(false), 400);
//   };

//   // 🔥 LOGIN
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isLocked) {
//       triggerError("Demasiados intentos. Espera un momento.");
//       return;
//     }

//     if (!form.Usuario || !form.Password) {
//       triggerError("Completa todos los campos");
//       return;
//     }

//     let loaderTimer;
//     let slowTimer;

//     try {
//       setLoading(true);

//       loaderTimer = setTimeout(() => setShowLoader(true), 400);
//       slowTimer = setTimeout(() => setSlowConnection(true), 2500);

//       const res = await loginAdapter(form);

//       clearTimeout(loaderTimer);
//       clearTimeout(slowTimer);

//       if (!res || res.status !== "OK" || !res.data?.length) {
//         throw new Error("INVALID_CREDENTIALS");
//       }

//       const user = res.data[0];

//       localStorage.setItem("token", user.token);
//       localStorage.setItem("ruta", user.ruta);
//       localStorage.setItem("usuario", form.Usuario.toLowerCase().trim());
//       localStorage.setItem("nombre", user.nombre);
//       localStorage.setItem("rol", user.rol);

//       setAttempts(0);
//       setErrorMsg("");

//       localStorage.removeItem("loginAttempts");
//       localStorage.removeItem("lockUntil");

//       navigate("/select-branch");

//     } catch (error) {
//       const newAttempts = attempts + 1;
//       setAttempts(newAttempts);
//       localStorage.setItem("loginAttempts", newAttempts);

//       if (newAttempts >= 5) {
//         const lockTime = Date.now() + 3 * 60 * 1000;
//         setLockUntil(lockTime);
//         localStorage.setItem("lockUntil", lockTime);

//         triggerError("Demasiados intentos. Intenta en unos minutos.");
//         return;
//       }

//       if (error.message === "INVALID_CREDENTIALS") {
//         triggerError("Usuario o contraseña incorrectos");
//       } else {
//         triggerError("No pudimos conectarnos. Verifica tu internet.");
//       }
//     } finally {
//       clearTimeout(loaderTimer);
//       clearTimeout(slowTimer);

//       setLoading(false);
//       setShowLoader(false);
//       setSlowConnection(false);
//     }
//   };

//   // 🔐 FORGOT PASSWORD
//   const handleForgotPassword = async () => {
//     const email = form.Usuario?.trim();

//     if (!email) {
//       triggerError("Ingresa tu correo primero");
//       return;
//     }

//     // validación simple
//     if (!email.includes("@")) {
//       triggerError("Ingresa un correo válido");
//       return;
//     }

//     try {
//       setForgotLoading(true);

//       await fetch("http://192.168.212.8:8080/auth/forgot-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           Email: email,
//         }),
//       });

//       triggerError("Te enviamos un correo de recuperación");
//     } catch (err) {
//       triggerError("No se pudo enviar el correo");
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f6f7fb] flex flex-col justify-between">

//       <div className="flex-1 flex flex-col justify-center px-6">

//         {/* LOGO */}
//         <div className="flex justify-center mb-6">
//           <img src={LogoMermas} className="w-44" />
//         </div>

//         {/* CARD */}
//         <motion.div
//           animate={shake ? { x: [-6, 6, -4, 4, 0] } : {}}
//           className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-sm mx-auto w-full"
//         >
//           <h2 className="text-xl font-bold mb-1">Bienvenido</h2>
//           <p className="text-sm text-gray-400 mb-6">
//             Ingresa tus credenciales
//           </p>

//           {/* ERROR */}
//           <AnimatePresence>
//             {errorMsg && (
//               <motion.div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
//                 <AlertTriangle className="text-red-500 mt-1" />
//                 <div className="text-xs text-red-600">
//                   <p className="font-medium">{errorMsg}</p>

//                   {isLocked && remainingTime > 0 && (
//                     <p className="text-[11px] text-red-400 mt-1">
//                       Intenta en {formatTime(remainingTime)}
//                     </p>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <form onSubmit={handleSubmit} className="space-y-4">

//             <input
//               type="text"
//               name="Usuario"
//               value={form.Usuario}
//               onChange={handleChange}
//               disabled={isLocked}
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
//               placeholder="Usuario / Email"
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="Password"
//                 value={form.Password}
//                 onChange={handleChange}
//                 disabled={isLocked}
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl pr-10"
//                 placeholder="********"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-gray-400"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* 🔐 FORGOT PASSWORD */}
//             <div className="flex justify-center">
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 disabled={forgotLoading}
//                 className="text-xs text-gray-500 hover:text-black transition"
//               >
//                 {forgotLoading
//                   ? "Enviando..."
//                   : "¿Olvidaste tu contraseña?"}
//               </button>
//             </div>

//             <motion.button
//               whileTap={!isLocked ? { scale: 0.97 } : {}}
//               type="submit"
//               disabled={loading || isLocked}
//               className={`w-full py-3 rounded-xl font-semibold
//                 ${
//                   loading || isLocked
//                     ? "bg-gray-300 text-gray-500"
//                     : "bg-gray-800 text-white hover:bg-black"
//                 }`}
//             >
//               {isLocked
//                 ? `Intenta en ${formatTime(remainingTime)}`
//                 : loading
//                 ? "Ingresando..."
//                 : "Continuar"}
//             </motion.button>

//           </form>

//           {attempts > 0 && !isLocked && (
//             <p className="text-[11px] text-gray-400 mt-3 text-center">
//               Intentos fallidos: {attempts}/5
//             </p>
//           )}
//         </motion.div>
//       </div>

//       {/* FOOTER */}
//       <div className="pb-6 flex justify-center">
//         <img src={LogoCafeDuranGris} className="w-20 opacity-70" />
//       </div>

//       {/* LOADER */}
//       <AnimatePresence>
//         {showLoader && (
//           <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//             <div className="bg-white px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center">
//               <div className="w-12 h-12 border-4 border-gray-200 rounded-full relative">
//                 <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
//               </div>

//               <p className="text-sm font-semibold mt-4">
//                 Iniciando sesión...
//               </p>

//               {slowConnection && (
//                 <p className="text-xs text-gray-400 mt-1">
//                   Conectando con el servidor...
//                 </p>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }