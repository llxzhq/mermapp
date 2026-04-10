export default function MermaDetalle() {
  return (
    <div className="min-h-screen bg-[#F6F2ED] p-4">
      <h1 className="text-xl font-bold mb-4">Iced Latte</h1>

      <div className="bg-white rounded-xl p-4 shadow">
        <p>Producto: Iced Latte</p>
        <p>Cantidad: 1</p>
        <p>Motivo: Expirado</p>
      </div>

      <button className="mt-6 w-full bg-black text-white p-3 rounded-xl">
        Editar
      </button>
    </div>
  );
}