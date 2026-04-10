export default function Checkout() {
  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-lg font-semibold">Detalles</h1>

      <div className="mt-4 space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Sucursal" />
        <input className="w-full border p-2 rounded" placeholder="Producto" />
        <input className="w-full border p-2 rounded" placeholder="Cantidad" />
        <input className="w-full border p-2 rounded" placeholder="Motivo" />
      </div>

      <button className="mt-6 w-full bg-black text-white p-3 rounded-xl">
        Guardar
      </button>
    </div>
  );
}