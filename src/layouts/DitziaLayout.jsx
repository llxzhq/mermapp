import { Outlet } from "react-router-dom";

import NavbarDitzia from "../components/NavbarDitzia";

export default function DitziaLayout() {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      {/* CONTENIDO */}
      <Outlet />

      {/* NAVBAR */}
      <NavbarDitzia />
    </div>
  );
}