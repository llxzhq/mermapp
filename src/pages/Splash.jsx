import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LogoMermas from "../assets/images/logotipo_mermas.png";

export default function Splash() {

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem("token");

      if (token) {
        navigate("/login");
      } else {
        navigate("/login");
      }
    }, 2200); // duración del splash
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f4f6fb] to-white">

      <div className="flex flex-col items-center">

        {/* LOGO ANIMADO */}
        <motion.img
            src={LogoMermas}
            className="w-44 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.05, 1] 
            }}
           transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
           }}
        />

        {/* TEXTO */}
        <motion.p
          className="text-sm text-gray-500 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Control de mermas Durán Coffee Store
        </motion.p>

        {/* LOADER */}
        <motion.div
          className="w-10 h-10 border-4 border-[#d6dbe6] border-t-[#6C63FF] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

      </div>

    </div>
  );
}