import { SelectHTMLAttributes } from "react";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function SelectInput({ label, error, name, options, onChange, value, ...rest }: SelectInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
        {label}
      </label>
      <select
        name={name}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-zinc-800 dark:text-zinc-100 ${error ? "border-red-500" : "border-zinc-300"}`}
        onChange={onChange}
        value={value}
        {...rest}
      >
        <option value="">Selecione...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="text-xs text-red-500 mt-1 min-h-4 block">{error}</span>
    </div>
  );
}
