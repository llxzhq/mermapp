// src/components/ModalConfirm.jsx

export default function ModalConfirm({titleConfirm, messageConfirm, onClickConfirm, onClickCancel}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">{titleConfirm}</h2>
        <p className="text-gray-600 mb-6">{messageConfirm}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClickConfirm}
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