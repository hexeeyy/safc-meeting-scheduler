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
        className={`group flex items-center justify-center px-4 py-2 bg-white/80 dark:bg-gray-700/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ripple-effect text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-white rounded-full ${className}`}
        {...props}
      >
        <span className="transition-transform duration-300 ease-in-out">
          {children}
        </span>
      </button>
    </>
  );
}