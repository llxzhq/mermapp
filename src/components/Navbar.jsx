// src/components/Navbar.jsx

import { Box, Coffee, House } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ onLinkClick }) {

  return (
    <div className="space-y-2">

      <Link
        to="/"
        className="flex items-center gap-2 text-sm hover:text-gray-300"
        onClick={onLinkClick}
      >
        <House size={24} />
        <span>Dashboard</span>
      </Link>

      <Link
        to="/products"
        className="flex items-center gap-2 text-sm hover:text-gray-300"
        onClick={onLinkClick}
      >
        <Box size={24} />
        <span>Products</span>
      </Link>

      <Link
        to="/"
        className="flex items-center gap-2 text-sm hover:text-gray-300"
        onClick={onLinkClick}
      >
        <Coffee size={24} />
        <span>Merma</span>
      </Link>

    </div>
  );
}
