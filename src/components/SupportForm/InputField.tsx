import { memo } from "preact/compat";

export type InputFieldProps = {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange: (e: Event) => void;
    describedBy: string;
    tooltip?: string;
  };
  
  export const InputField = memo(
    ({
      id,
      label,
      type,
      placeholder,
      value,
      onChange,
      describedBy,
      tooltip,
    }: InputFieldProps) => {
      return (
        <div className="mb-4 animate-fade-in">
          <label
            htmlFor={id}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {label}
            {tooltip && (
              <span className="relative group ml-2">
                <i className="fas fa-info-circle text-gray-500 cursor-help"></i>
                <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 translate-y-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tooltip}
                </span>
              </span>
            )}
          </label>
          {type === "textarea" ? (
            <textarea
              id={id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              rows={4}
              placeholder={placeholder}
              value={value || ""}
              onChange={onChange}
              required
              aria-label={label}
              aria-describedby={describedBy}
            ></textarea>
          ) : (
            <input
              id={id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
              type={type}
              placeholder={placeholder}
              value={value || ""}
              onChange={onChange}
              required
              aria-label={label}
              aria-describedby={describedBy}
            />
          )}
        </div>
      );
    }
  );

export default InputField;