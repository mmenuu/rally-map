import React from "react";

export default function DialogLayout({ children }) {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50" style={{ zIndex: 25 }}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>ß
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
