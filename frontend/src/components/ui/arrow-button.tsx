import React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'

type ArrowButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export default function ArrowButton({
  children,
  className = '',
  ...props
}: ArrowButtonProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} {...props}>
      <button
        aria-label="Previous month"
        onClick={() => window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "PREV" }))}
        className="p-2 rounded-full bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out"
      >
        <ChevronLeftIcon className="h-5 w-5 text-black" />
      </button>
      <button
        aria-label="Next month"
        onClick={() => window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "NEXT" }))}
        className="p-2 rounded-full bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out"
      >
        <ChevronRightIcon className="h-5 w-5 text-black" />
      </button>
      {children}
    </div>
  );
}


