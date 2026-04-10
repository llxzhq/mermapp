// src/components/SpinnerLouder.jsx

//h-full h-screen

export default function SpinnerLouder({height}) {
  return (
    <div className={`flex justify-center items-center ${height}`}>
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}