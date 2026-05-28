import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, History, BarChart2, Plus, User } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: Home, label: "Inicio", path: "/home" },
    { icon: History, label: "Historial", path: "/historial" },
    { icon: Plus, label: "Crear", path: "/checkout" },
    { icon: BarChart2, label: "Reportes", path: "/report" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex justify-center">

      {/* CONTENIDO */}
      <div className="w-full max-w-sm flex flex-col pb-24">
        <Outlet />
      </div>

      {/* 🔥 NAVBAR (ÚNICO) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-2xl px-2 py-2">
          
          <div className="flex justify-between items-center">

            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;

              return (
                <button
                  key={i}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center justify-center flex-1"
                >
                  <Icon
                    size={20}
                    className={`${
                      isActive ? "text-black" : "text-gray-400"
                    }`}
                  />

                  <span
                    className={`text-[10px] mt-1 ${
                      isActive ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}

          </div>
        </div>
      </div>

    </div>
  );
}