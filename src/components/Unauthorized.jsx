export default function Unauthorized() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-6">

      <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 text-center max-w-md w-full">

        <h1 className="text-3xl font-bold text-red-500">
          Acceso denegado
        </h1>

        <p className="text-gray-500 mt-4">
          No tienes permisos para acceder a esta vista.
        </p>

      </div>

    </div>
  );
}