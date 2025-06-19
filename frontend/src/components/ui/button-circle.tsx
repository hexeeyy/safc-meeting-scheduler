import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function ButtonCircle({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "TODAY" }))}
      className={`text-sm px-4 py-2 ml-7 rounded-[2rem] border border-gray-600 bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
