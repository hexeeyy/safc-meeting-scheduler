import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-500 py-3 text-center border-t border-gray-200">
      <div className="text-xs">
        © {new Date().getFullYear()} South Asialink Finance Corporation. All rights reserved.
      </div>
      <div className="text-[10px] mt-1 text-gray-400 leading-snug px-2">
        This project was developed by{' '}
        <span className="font-semibold text-green-600">Hexilon Payno</span>, an intern at South Asialink Finance Corporation, as part of a web development initiative to improve internal tools and systems.
      </div>
    </footer>
  );
}
