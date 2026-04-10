
export default function ModalAlert({titleAlert, messageAlert1, messageAlert2, textButton, iconComponent, onClick}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
          {iconComponent}
          {titleAlert}
        </h2>
        <div className="text-gray-600 mb-6">
          {messageAlert1 && ( <p className="text-gray-600 mb-6">{messageAlert1}</p>)}    
          {messageAlert2 && (<p className="text-xs text-gray-600 mb-6">{messageAlert2}</p>)}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClick}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            {textButton}
          </button>
        </div>
      </div>
    </div>
  );
};