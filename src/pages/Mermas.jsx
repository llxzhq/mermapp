import { Link } from "react-router-dom";

export default function Mermas() {
  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mermas
        </h1>

        <Link
          to="/mermas/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Nueva Merma
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500">
          Aquí aparecerá el historial de mermas cuando lo conectes con la API.
        </p>
      </div>

    </div>
  );
}