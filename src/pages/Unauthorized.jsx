export default function Unauthorized() {

  return (
    <div
      className="
        min-h-screen flex flex-col
        items-center justify-center
        bg-[#f6f7fb]
      "
    >

      <h1 className="text-3xl font-bold">
        Acceso denegado
      </h1>

      <p className="text-gray-500 mt-2">
        No tienes permisos para entrar.
      </p>

    </div>
  );
}