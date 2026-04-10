// src/components/formInputs/Select.jsx

import { AlertCircle } from "lucide-react";
import { widthClasses } from "../../utils/common";

export default function Select({ widthPercent, textLabel, isRequired, value, onChange,
  name, textFirstOption, options, louding = false, showAlert = false }) {

  return (
    <div className={`px-2 w-full ${widthClasses[widthPercent]} mb-2`}>
      <label className="text-gray-900 text-sm">
        {textLabel}
        {isRequired && (
          <span className="text-red-700 font-extrabold"> *</span>
        )}
        {louding &&
          <div className="inline-block ml-2 w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>}

        {showAlert && (
          <span className="ml-2 top-0 right-6 inline-flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span>Ocurrió un problema</span>
          </span>
        )}
      </label>
      <select
        className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        required={isRequired}
      >
        {textFirstOption && (
          <option value="">{textFirstOption}</option>
        )}

        {options.map((option, index) => {
          return <option key={index} value={option.value}>{option.text}</option>
        })}
      </select>
    </div>
  );
}