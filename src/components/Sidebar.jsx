// src/components/Sidebar.jsx

import { X } from "lucide-react";

import FooterNavbar from "./FooterNavbar";
import Logo from '../assets/images/logo-multiApp.png';
import Navbar from "./Navbar";

export default function Sidebar({ open, setOpen }) {

  return (
    <>
      {/* OVERLAY móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-lack/5 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>

      )}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-screen
          w-64 bg-[#47351A] text-white p-5
          flex flex-col justify-between
          transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
          z-50
          lg:translate-x-0
        `}
      >

        <div>
          {/* Botón cerrar móvil */}
          <button
            className="lg:hidden mb-4 p-2 text-[#47351A] rounded-md bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
          
          <img src={Logo} alt="MultiApp" className="mb-4 mx-auto w-16 sm:w-20 lg:w-24" />          

          <Navbar onLinkClick={() => setOpen(false)} />
        </div>

        <FooterNavbar />

      </aside>

    </>
  );
}
