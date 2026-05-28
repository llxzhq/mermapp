import { useAuth } from "./context/AuthContext";

export default function HeaderUser() {

  const { user, logout } = useAuth();

  return (
    <div
      className="
        w-full bg-white border-b
        px-6 py-4 flex items-center
        justify-between
      "
    >

      <div>
        <h2 className="font-bold text-lg">
          {user?.nombre}
        </h2>

        <p className="text-sm text-gray-500">
          {user?.usuario}
        </p>
      </div>

      <button
        onClick={logout}
        className="
          px-4 py-2 rounded-xl
          bg-black text-white
        "
      >
        Cerrar sesión
      </button>

    </div>
  );
}