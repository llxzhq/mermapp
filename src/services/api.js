import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.212.8:8080",
});

// 🔥 AGREGAR TOKEN AUTOMÁTICAMENTE
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 MANEJO GLOBAL DE ERRORES
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login"; // 🔥 fuerza logout
    }

    return Promise.reject(error);
  }
);

// const API_URL =
//   "http://192.168.212.8:8080";

// /**
//  * 🔥 Fetch base
//  */
// export async function apiFetch(
//   endpoint,
//   options = {}
// ) {

//   const token =
//     localStorage.getItem("token");

//   const response = await fetch(
//     `${API_URL}${endpoint}`,
//     {
//       ...options,

//       headers: {
//         "Content-Type": "application/json",

//         Authorization:
//           token
//             ? `Bearer ${token}`
//             : "",

//         ...options.headers,
//       },
//     }
//   );

//   // 🔥 SESIÓN EXPIRADA
//   if (response.status === 401) {

//     localStorage.clear();

//     window.location.href = "/";

//     throw new Error("Sesión expirada");
//   }

//   return response;
// }

// /**
//  * 🔥 API estilo Axios
//  */
// export const api = {

//   async get(endpoint) {

//     return apiFetch(endpoint, {
//       method: "GET",
//     });
//   },

//   async post(endpoint, data = {}) {

//     return apiFetch(endpoint, {
//       method: "POST",

//       body: JSON.stringify(data),
//     });
//   },

//   async put(endpoint, data = {}) {

//     return apiFetch(endpoint, {
//       method: "PUT",

//       body: JSON.stringify(data),
//     });
//   },

//   async delete(endpoint) {

//     return apiFetch(endpoint, {
//       method: "DELETE",
//     });
//   },
// };