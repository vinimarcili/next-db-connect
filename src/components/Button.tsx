import { ButtonHTMLAttributes } from "react";
import Loader from "./Loader";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({ loading, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={
        "w-full py-3 rounded-lg bg-linear-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 " +
        (rest.className || "")
      }
      disabled={loading || rest.disabled}
    >
      {loading && <Loader />}
      {children}
    </button>
  );
}
