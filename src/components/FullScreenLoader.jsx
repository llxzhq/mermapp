// src/components/FullScreenLoader.jsx

import SpinnerLouder from "./SpinnerLouder";

export default function FullScreenLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">

      {/* Texto con animación */}
      <h1 className="text-4xl font-bold tracking-wide mb-6">
        multiapp
      </h1>

      {/* Spinner */}
      <SpinnerLouder height="h-auto" />

    </div>
  );
}
