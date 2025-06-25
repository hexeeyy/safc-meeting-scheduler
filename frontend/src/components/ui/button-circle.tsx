import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function ButtonCircle({
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Dispatch custom navigation event
    window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "TODAY" }));

    // Call external handler if provided
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 ml-7 rounded-[2rem] border border-gray-600 bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
