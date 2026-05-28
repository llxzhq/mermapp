import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function Dashboard() {

  const location = useLocation();

  // 🔥 rutas SIN navbar
  const noNavbarRoutes = [
    "/select-branch",
    "/mermo"
  ];

  // 🔥 ocultar navbar desde state
  const hideNavbarFromState =
    location.state?.hideNavbar === true;

  const hideNavbar =
    noNavbarRoutes.includes(location.pathname) ||
    hideNavbarFromState;

  return (

    <div className="flex min-h-screen bg-[#f6f7fb] overflow-x-hidden">

      <div className="flex-1 flex justify-center">

        <div className="w-full max-w-[1700px] flex flex-col pb-24">

          <Outlet />

        </div>

      </div>

      {!hideNavbar && <Navbar />}

    </div>

  );
}