'use client';

import { useEffect, useState } from 'react';

function FlipUnit({ label, value }: { label: string; value: string }) {
  const [prevValue, setPrevValue] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setFlip(true);
      const timeout = setTimeout(() => setFlip(false), 600);
      setPrevValue(value);
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-10 h-11 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-inner overflow-hidden">
        <div
          className={`absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-gray-100 ${flip ? 'animate-flip' : ''}`}
        >
          {value}
        </div>
      </div>
      <span className="text-[10px] mt-1 text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  );
}

export default function FlipClock() {
  const [now, setNow] = useState<Date | null>(null); // Start with null

  useEffect(() => {
    setNow(new Date()); // Initialize after mount
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null; // Don't render on server

  const pad = (num: number) => num.toString().padStart(2, '0');
  const hoursRaw = now.getHours();
  const hours12 = hoursRaw % 12 || 12;
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const ampm = hoursRaw >= 12 ? 'PM' : 'AM';

  return (
    <div className="flex items-end gap-2">
      <FlipUnit label="HR" value={pad(hours12)} />
      <FlipUnit label="MIN" value={minutes} />
      <FlipUnit label="SEC" value={seconds} />
      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{ampm}</div>
    </div>
  );
}
