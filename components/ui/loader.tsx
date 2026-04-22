import React from 'react';
import './loader.css';

export function Loader({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center w-full ${className || ''}`}>
      <span className="loader"></span>
    </div>
  );
}
