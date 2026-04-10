import SpinnerLouder from "../SpinnerLouder";


export default function ModalSpinner({titleModal, messageModal, iconComponent}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
          {iconComponent}
          {titleModal}
        </h2>
        <p className="text-gray-600 mb-6">
          {messageModal}    
        </p>

        <div className="flex justify-center gap-3">
          <SpinnerLouder height="h-full" />
        </div>
      </div>
    </div>
  );
};