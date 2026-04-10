import { useEffect, useState } from "react";
import { widthClasses } from "../../utils/common";


export default function ImageWithPreview({ fileInputRef, widthPercent, textLabel, isRequired,
  name, prev = null, setImageRemoved, reset, onResetDone }) {

  const [preview, setPreview] = useState(prev);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setPreview(prev);
  }, [prev]);

  useEffect(() => {
    if (reset) {
      setPreview(null);
      setFileName("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onResetDone?.();
    }
  }, [reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeLogo = () => {
    setFileName("");
    setPreview(null);

    if (setImageRemoved)
      setImageRemoved(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`px-2 w-full ${widthClasses[widthPercent]} mb-2`}>
      <label className="text-gray-900 text-sm">
        {textLabel}
        {isRequired && (
          <span className="text-red-700 font-extrabold"> *</span>
        )}
      </label>

      <div className="mt-1">
        <input
          type="file"
          onChange={handleFileChange}
          className="
          border border-gray-300 rounded-md px-3 py-1 h-12 w-full
          file:bg-[#47351A] file:text-white file:border-0 file:px-4 file:py-2
          file:rounded-md file:mr-3 file:hover:bg-green-700
          cursor-pointer text-gray-700
          "
          name={name}
          required={isRequired}
          ref={fileInputRef}
        />
      </div>

      {fileName && <p className="text-xs text-gray-700 mt-2">📎 {fileName}</p>}

      {preview && (
        <div className="mt-3 relative inline-block">
          <img src={preview} className="h-24 rounded-lg border object-contain" />
          <button
            type="button"
            onClick={removeLogo}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}