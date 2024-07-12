import { h, FunctionalComponent } from 'preact';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: Event) => void;
  describedBy: string;
  tooltip?: string; // Optional tooltip prop
}

const InputField: FunctionalComponent<InputFieldProps> = ({ id, label, type, placeholder, value, onChange, describedBy, tooltip }) => {
  return (
    <div className="mb-4 fade-in">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
        {tooltip && (
          <span className="tooltip ml-2">
            <i className="fas fa-info-circle text-gray-500 cursor-help"></i>
            <span className="tooltiptext">{tooltip}</span>
          </span>
        )}
      </label>
      {type === 'textarea' ? (
        <textarea id={id} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out" rows="4" placeholder={placeholder} value={value} onInput={onChange} required aria-label={label} aria-describedby={describedBy}></textarea>
      ) : (
        <input id={id} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300 ease-in-out" type={type} placeholder={placeholder} value={value} onInput={onChange} required aria-label={label} aria-describedby={describedBy} />
      )}
    </div>
  );
};

export default InputField;