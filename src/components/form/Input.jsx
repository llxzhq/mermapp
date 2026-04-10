// src/components/formInputs/Input.jsx

import { widthClasses } from "../../utils/common";

export default function Input({ widthPercent, textLabel, isRequired, type, placeholder,
  value, onChange, name, disabled = false, isFormatCOP = false }) {

  const formatoCOP = (numero) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numero);

  const handleChange = (e) => {
    let val = e.target.value;

    if (isFormatCOP) {
      const clean = val.replace(/\D/g, "");
      onChange(clean);
    } else {
      onChange(val);
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
      <input
        type={type}
        placeholder={placeholder}
        value={isFormatCOP && value ? formatoCOP(value) : value}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        name={name}
        required={isRequired}
        disabled={disabled}
      />
    </div>
  );
}