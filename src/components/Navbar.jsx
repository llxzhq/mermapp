import { Home, History, Plus, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, path: "/home" },
    { icon: History, path: "/historial" },
    { icon: Plus, path: "/checkout" },
    { icon: User, path: "/profile" }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">

      <div className="
        relative
        flex items-center justify-between
        w-[92%] max-w-md
        px-6 py-3
        rounded-2xl

        backdrop-blur-xl
        bg-white/70
        border border-white/40

        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
      ">

        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="relative flex-1 flex justify-center items-center"
            >

              {/* 🔥 INDICADOR MÁS SUAVE */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="
                    absolute
                    w-11 h-11
                    bg-white/60
                    backdrop-blur-md
                    border border-white/50
                    rounded-xl
                    shadow-sm
                  "
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                />
              )}

              {/* ICONO */}
              <Icon
                size={22}
                className={`
                  z-10 transition-all duration-300
                  ${isActive
                    ? "text-black scale-110"
                    : "text-gray-500"}
                `}
              />

            </motion.button>
          );
        })}

      </div>

    </div>
  );
}