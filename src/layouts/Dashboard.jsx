// src/layouts/Dashboard.jsx

import { Menu, LogOut } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Dashboard() {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    console.log('Logout');
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="flex min-h-screen bg-pr-100 overflow-x-hidden">

        {/* Botón hamburguesa solo en móvil */}
        <button
          className="lg:hidden absolute bg-[#47351A] top-4 left-4 z-50 p-2 rounded-md text-white"
          onClick={() => setOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* Contenido principal */}
        <main className="flex-1 p-8 pt-16 h-screen overflow-y-auto relative max-w-full overflow-x-hidden">

          {/* Botón de cerrar sesión discreto */}
          <button
            onClick={handleLogout}
            className="fixed top-4 right-4 p-2 rounded-full bg-[#47351A] hover:bg-[#604927] text-white transition z-50"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>

          <div className="mx-auto h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </>
  );
}
