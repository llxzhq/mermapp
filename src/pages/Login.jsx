// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
import LogoMermas from "../assets/images/logotipo_mermas.png";
import axios from "axios";
import userLogued from "../data/data"
import { loginAdapter, pingAdapter } from "../adapters/auth/authAdapter.js";

export default  function Login() {
  const [form, setForm] = useState({
    Usuario: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  // Maneja cambios en inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar formulario
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setErrorMsg("");

    if (!form.Usuario || !form.Password) {
      debugger;
      // alert("Debe ingresar correo y contraseña");
      //setErrorMsg("Debe ingresar correo y contraseña");
      return;
    }

    try {
      setLoading(true);

      //const resPing = await pingAdapter();

      // alert(resPing);

      const res = await loginAdapter(form);

      // LLAMADA REAL AL BACKEND
      // const response = await axios.post(
      //   "http://localhost:3000/api/login",
      //   form,
      // );

      if(!res.ok){
        // alert(res.message);
        return res.message;
      }

      localStorage.setItem("token", JSON.stringify(res));      

      console.log(res);

      navigate("/");
    } catch (error) {
      setErrorMsg("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex flex-col justify-between bg-white">

    {/* CONTENIDO PRINCIPAL */}
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">

      <img 
        src={LogoMermas} 
        alt="Mermas" 
        className="w-56 mt-50"
      />

      <h3 className=" font-semibold tracking-tight leading-tight text-black mt-15 text-xl">
        Inicio de sesión 
      </h3>

      <p className="text-center text-sm text-black leading-snug mb-8 mt-1">
        Ingresa tu e-mail y contraseña <br /> 
        para entrar en la app
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">

        <div>
          <label className="text-sm text-gray-700">Usuario</label>
          <input
            type="text"
            name="Usuario"
            value={form.Usuario}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg"
            placeholder="ovelez"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700">Contraseña</label>
          <input
            type="password"
            name="Password"
            value={form.Password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg placeholder-gray-400"
            placeholder="********" 
          />
        </div>

        <button
          type="submit"
          // disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg mt-4"
        >
          {loading ? "Ingresando..." : "Continuar"}
        </button>

      </form>
    </div>

    {/* LINEA SEPARADORA */}
    <div className="w-full h-px bg-gray-100 mt-35"></div>

    {/* FOOTER */}
    <div className="flex justify-center">
      <img 
        src={LogoCafeDuranGris} 
        alt="Cafe Duran" 
        className="w-22 h-auto oapacity-80 mb-5 mt-5"
      />
    </div>

  </div>
);
}

//src/pages/Login.jsx

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
// import LogoMermas from "../assets/images/logotipo_mermas.png";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     if (!form.email || !form.password) {
//       setErrorMsg("Debe ingresar correo y contraseña");
//       return;
//     }

//     // Validación correo corporativo
//     if (!form.email.endsWith("@epa.com.pa")) {
//       setErrorMsg("Debe usar correo corporativo");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:3000/api/login",
//         form
//       );

//       localStorage.setItem("TOKEN", response.data.token);

//       navigate("/dashboard");

//     } catch (error) {
//       setErrorMsg(
//         error.response?.data?.message || "Error del servidor"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">
//       <div className="w-full max-w-sm mx-auto flex flex-col items-center">
//         <img src={LogoMermas} alt="Mermas" className="w-56 mt-20" />

//         <h3 className="font-semibold text-black mt-10 text-xl">
//           Inicio de sesión
//         </h3>

//         <form onSubmit={handleSubmit} className="w-full space-y-4 mt-6">
//           <div>
//             <label className="text-sm text-gray-700">E-mail</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg"
//               placeholder="email@epa.com.pa"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-700">Contraseña</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg"
//               placeholder="********"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-3 rounded-lg"
//           >
//             {loading ? "Ingresando..." : "Continuar"}
//           </button>

//           {errorMsg && (
//             <p className="text-red-500 text-sm text-center">
//               {errorMsg}
//             </p>
//           )}
//         </form>
//       </div>

//       <div className="w-full h-px bg-gray-100 mt-10"></div>

//       <div className="flex justify-center">
//         <img
//           src={LogoCafeDuranGris}
//           alt="Cafe Duran"
//           className="w-20 opacity-80 mb-5 mt-5"
//         />
//       </div>
//     </div>
//   );
// }

// src/pages/Login.jsx

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AudioLines } from "lucide-react";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value.trim() });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     if (!form.email || !form.password) {
//       return setErrorMsg("Todos los campos son obligatorios");
//     }

//     if (!form.email.endsWith("@epa.com.pa")) {
//       return setErrorMsg("Debe usar correo corporativo");
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:3000/api/login",
//         form,
//         { withCredentials: true }
//       );

//       localStorage.setItem("TOKEN", response.data.token);

//       navigate("/dashboard");

//     } catch (error) {
//       setErrorMsg(
//         error.response?.data?.message || "Error del servidor"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-lg w-96"
//       >
//         <h2 className="text-xl font-semibold mb-6 text-center">
//           Inicio de sesión
//         </h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="email@epa.com.pa"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full mb-4 p-3 border rounded-lg"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="********"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full mb-4 p-3 border rounded-lg"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white py-3 rounded-lg"
//         >
//           {loading ? "Ingresando..." : "Continuar"}
//         </button>

//         {errorMsg && (
//           <p className="text-red-500 text-sm mt-4 text-center">
//             {errorMsg}
//           </p>
//         )}
//       </form>
//     </div>
//   ); 
// }

