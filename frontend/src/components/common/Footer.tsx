import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-50 text-white py-6 text-center">
      <div className="text-sm text-gray-300">
        © {new Date().getFullYear()} South Asialink Finance Corporation. All rights reserved.
      </div>
    </footer>
  );
}