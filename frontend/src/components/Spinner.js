import React from 'react';

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-gray-600 text-sm font-medium">Fetching something interesting for you...</div>
    </div>
  );
};

export default Spinner;