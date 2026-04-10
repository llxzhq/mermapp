// src/modals/ModalEditRol.jsx

import { useState } from "react";

export default function ModalEditRol({ currentName, onSave, onCancel }) {
  const [name, setName] = useState(currentName);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Editar Rol</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(name); // envía solo el string
          }}
          className="flex flex-wrap -mx-2"
        >
          <div className="px-2 w-full mb-2">
            <input
              type="text"
              placeholder="Nombre del rol"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700"
            >
              Guardar
            </button>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-3 py-2 h-10 rounded-md w-full hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
