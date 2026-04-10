import { widthClasses } from "../../utils/common";


export default function RadioSiNo({ widthPercent, textLabel, isRequired, value, onChange,
  name }) {

  return (
    <div className={`px-2 w-full ${widthClasses[widthPercent]} mb-2`}>
      <label className="text-gray-900 text-sm">
        {textLabel}
        {isRequired && (
          <span className="text-red-700 font-extrabold"> *</span>
        )}
      </label>

      <div className="flex border border-gray-300 rounded-md h-10 overflow-hidden focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">

        {/* SI */}
        <label className="flex items-center justify-center w-1/2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value="1"
            checked={value === "1"}
            onChange={(e) => onChange(e.target.value)}
            className="peer hidden"
            required={isRequired}
          />
          <span className="w-full h-full flex items-center justify-center text-gray-500 peer-checked:bg-green-500 peer-checked:text-white">
            Sí
          </span>
        </label>

        {/* NO */}
        <label className="flex items-center justify-center w-1/2 cursor-pointer border-l border-gray-300">
          <input
            type="radio"
            name={name}
            value="0"
            checked={value === "0"}
            onChange={(e) => onChange(e.target.value)}
            className="peer hidden"
            required={isRequired}
          />
          <span className="w-full h-full flex items-center justify-center text-gray-500 peer-checked:bg-red-500 peer-checked:text-white">
            No
          </span>
        </label>

      </div>
    </div>
  );
}