'use client';

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
    window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "TODAY" }));
    if (onClick) onClick(e);
  };

  return (
    <>
      <style jsx global>{`
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        .ripple-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }
        .ripple-effect:active::after {
          width: 100px;
          height: 100px;
          transition: width 0.6s ease, height 0.6s ease;
        }
      `}</style>
      <button
        onClick={handleClick}
        className={`group flex items-center justify-center px-4 py-2 rounded-full bg-white  hover:bg-green-50 border border-green-200 dark:border-green-700 hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ripple-effect text-sm font-medium ${className}`}
        {...props}
      >
        <span className="text-green-800 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out">
          {children}
        </span>
      </button>
    </>
  )
}