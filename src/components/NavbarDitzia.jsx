import {
  LayoutDashboard,
  ClipboardList,
  History,
  User,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import { motion } from "framer-motion";

export default function NavbarDitzia() {

  const navigate = useNavigate();

  const location = useLocation();

  const tabs = [
    {
      icon: LayoutDashboard,
      path: "/home-gestion"
    },

    {
      icon: ClipboardList,
      path: "/gestion-mermas"
    },

    {
      icon: History,
      path: "/gestion-reportes"
    },

  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">

      <div
        className="
          relative
          flex items-center justify-between
          w-[92%] max-w-md
          px-4 py-3
          rounded-[28px]

          backdrop-blur-2xl
          bg-white/75
          border border-white/40

          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        "
      >

        {tabs.map((tab, i) => {

          const Icon = tab.icon;

          const isActive =
            location.pathname === tab.path;

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(tab.path)}
              className="
                relative
                flex-1
                flex
                flex-col
                items-center
                justify-center
                gap-1
                py-1
              "
            >

              {/* ACTIVE BG */}
              {isActive && (
                <motion.div
                  layoutId="ditzia-active-pill"
                  className="
                    absolute
                    inset-0
                    mx-1
                    rounded-2xl
                    bg-black
                    shadow-lg
                  "
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}

              {/* ICON */}
              <Icon
                size={20}
                className={`
                  z-10 transition-all duration-300
                  ${
                    isActive
                      ? "text-white scale-110"
                      : "text-gray-500"
                  }
                `}
              />

              {/* LABEL */}
              <span
                className={`
                  z-10 text-[10px] font-medium transition-all duration-300
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-400"
                  }
                `}
              >
                {tab.label}
              </span>

            </motion.button>
          );
        })}

      </div>

    </div>
  );
}