// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import { useMsal } from "@azure/msal-react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//   const { instance } = useMsal();

//   const [user, setUser] = useState(null);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     const token =
//       localStorage.getItem("token");

//     const usuario =
//       localStorage.getItem("usuario");

//     const nombre =
//       localStorage.getItem("nombre");
    
//     const rol =
//       localStorage.getItem("rol");

//     if (token) {

//       setUser({
//         token,
//         usuario,
//         nombre,
//         rol,
//       });
//     }

//     setLoading(false);

//   }, []);

//   // =========================================
//   // LOGOUT
//   // =========================================
//   const logout = async () => {

//     try {

//       localStorage.clear();

//       setUser(null);

//       await instance.logoutRedirect({
//         postLogoutRedirectUri:
//           "http://localhost:5173",
//       });

//     } catch (err) {

//       console.error(
//         "LOGOUT ERROR:",
//         err
//       );
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const usuario =
      localStorage.getItem("usuario");

    const nombre =
      localStorage.getItem("nombre");

    const rol =
      localStorage.getItem("rol");

    const ruta =
      localStorage.getItem("ruta");

    if (token) {

      setUser({
        token,
        usuario,
        nombre,
        rol,
        ruta,
      });
    }

    setLoading(false);

  }, []);

  // =========================================
  // LOGOUT
  // =========================================
  const logout = () => {

    localStorage.clear();

    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};