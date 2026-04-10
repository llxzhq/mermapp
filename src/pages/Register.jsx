// // src/pages/Register.jsx

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
// import LogoMermas from "../assets/images/logotipo_mermas.png";
// import axios from "axios";

// export default function Register() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();

//   // Maneja cambios en inputs
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Enviar formulario
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");

//     if (!form.email || !form.password) {
//       setErrorMsg("Debe ingresar correo y contraseña");
//       return;
//     }

//     try {
//       setLoading(true);

//       // LLAMADA REAL AL BACKEND
//       const response = await axios.post(
//         "http://localhost:3000/api/register",
//         form,
//       );

//       // Guardar token
//       localStorage.setItem("TOKEN", response.data.token);

//       navigate("/");
//     } catch (error) {
//       setErrorMsg("Correo o contraseña incorrectos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//   <div className="min-h-screen flex flex-col justify-between bg-white">

//     {/* CONTENIDO PRINCIPAL */}
//     <div className="w-full max-w-sm mx-auto flex flex-col items-center">

//       <img 
//         src={LogoMermas} 
//         alt="Mermas" 
//         className="w-56 mt-50"
//       />

//       <h3 className=" font-semibold tracking-tight leading-tight text-black mt-15 text-xl">
//         Crea tu cuenta 
//       </h3>

//       <p className="text-center text-sm text-black leading-snug mb-8 mt-1">
//         Introduce tu e-mail y una contraseña <br /> 
//         para registrarte en la app
//       </p>

//       <form onSubmit={handleSubmit} className="w-full space-y-4">

//         <div>
//           <label className="text-sm text-gray-700">E-mail</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg"
//             placeholder="email@epa.com.pa"
//           />
//         </div>

//         <div>
//           <label className="text-sm text-gray-700">Contraseña</label>
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg placeholder-gray-400"
//             placeholder="********" 
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white py-3 rounded-lg mt-4"
//         >
//           {loading ? "Ingresando..." : "Continuar"}
//         </button>

//       </form>
//     </div>

//     {/* LINEA SEPARADORA */}
//     <div className="w-full h-px bg-gray-100 mt-35"></div>

//     {/* FOOTER */}
//     <div className="flex justify-center">
//       <img 
//         src={LogoCafeDuranGris} 
//         alt="Cafe Duran" 
//         className="w-22 h-auto oapacity-80 mb-5 mt-5"
//       />
//     </div>

//   </div>
// );
// }

// src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.email || !form.password) {
      setErrorMsg("Debe ingresar correo y contraseña");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:3000/api/register",
        form
      );

      navigate("/login");

    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Error del servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-xl mb-4">Crear Cuenta</h2>

        <input
          type="email"
          name="email"
          placeholder="usuario@duran.com.pa"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creando..." : "Registrarse"}
        </button>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-2">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
}