'use client';

import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';

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
    <div
      className={`flex items-center gap-3 transition-all duration-500 ease-in-out ${className}`}
      {...props}
    >
      <AnimatedNavButton direction="PREV" Icon={ChevronLeftIcon} />
      <AnimatedNavButton direction="NEXT" Icon={ChevronRightIcon} />
      {children}
    </div>
  );
}

type AnimatedNavButtonProps = {
  direction: 'PREV' | 'NEXT';
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function AnimatedNavButton({ direction, Icon }: AnimatedNavButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('calendar:navigate', { detail: direction }));
  };

  return (
    <button
      aria-label={`${direction === 'PREV' ? 'Previous' : 'Next'} month`}
      onClick={handleClick}
      className="group p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      <Icon className="h-5 w-5 text-green-900 dark:text-gray-100 group-hover:text-white transition-transform duration-300 ease-in-out" />
    </button>
  );
}