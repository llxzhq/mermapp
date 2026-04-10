export default function SeleccionSucursal() {
  return (
    <div className="min-h-screen bg-[#F6F2ED] p-6">
      <h1 className="text-xl font-bold mb-6">Selecciona sucursal</h1>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white rounded-xl p-4 shadow">Multiplaza</button>
        <button className="bg-white rounded-xl p-4 shadow">Altos Mall</button>
        <button className="bg-white rounded-xl p-4 shadow">Town Center</button>
        <button className="bg-white rounded-xl p-4 shadow">Brisas</button>
      </div>
    </div>
  );
}