// src/components/ModalConfirmDelete.jsx

import { useState } from "react";

export default function ModalConfirmDelete({titleConfirm, messageConfirm1, messageConfirm2, name, onClickConfirm, onClickCancel}) {
  
  const [nameInput, setNameInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [messageError, setMessageError] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">{titleConfirm}</h2>
        <p className="text-red-600 mb-6">{messageConfirm1}</p>
        <p className="text-gray-600 mb-6">{messageConfirm2}</p>
        <p className="text-gray-600 font-bold mb-6">{name}</p>

{showError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-400 text-red-300 animate-fadeIn">
            {messageError}
          </div>
        )}

        <div className="px-2 w-full sm:w-full mb-2">
            <input
              type="text"
              placeholder="Nombre Negocio"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="nameInput"
              required
            />
          </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              if(nameInput === "") {
                setMessageError("Debe ingresar la información");
                setShowError(true);
                return;
              }
              if(name !== nameInput) {
                setMessageError("Los datos no coinciden")
                setShowError(true);
                return;
              }

              onClickConfirm();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>

          <button
            onClick={onClickCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}