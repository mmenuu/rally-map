import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="w-64 h-64 rounded-full relative">
        <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto">
          <div className="border-t-4 border-gray-500 rounded-full w-full h-full animate-spin"></div>
        </div>
      </div>
      <p className="text-xl font-medium text-gray-700 mt-6">Loading...</p>
    </div>
  );
};

export default Loading;
