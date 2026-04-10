// src/components/formInputs/Textarea.jsx

import { widthClasses } from "../../utils/common";

export default function Textarea({ widthPercent, textLabel, isRequired,
  value, onChange, name, minHeight = 32 }) {

  return (
    <div className={`px-2 w-full ${widthClasses[widthPercent]} mb-2`}>
      <label className="text-gray-900 text-sm">
        {textLabel}
        {isRequired && (
          <span className="text-red-700 font-extrabold"> *</span>
        )}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={isRequired}
        className={`border border-gray-300 rounded-md px-3 py-2 min-h-${minHeight} w-full resize-y`}
      ></textarea>
    </div>
  );
}