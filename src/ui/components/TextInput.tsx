interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function TextInput({ label, name, error, value, onChange, ...rest }: TextInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
        {label}
      </label>
        <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-zinc-800 dark:text-zinc-100 ${error ? "border-red-500" : "border-zinc-300"}`}
        {...rest}
      />
      <span className="text-xs text-red-500 mt-1 min-h-4 block">{error}</span>
    </div>
  );
}
