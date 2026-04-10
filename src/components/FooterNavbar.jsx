// src/components/FooterNavbar.jsx

export default function FooterNavbar() {

  const year = new Date().getFullYear();

  return (
    <footer className="text-xs border-t border-gray-700 pt-3">
      <span className="flex items-center justify-between text-white">
        © {year} MermaApp
        <span className="ml-2">v1.0.0</span>
      </span>
    </footer>
  );
}