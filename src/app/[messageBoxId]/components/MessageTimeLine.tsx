'use client';

import React from 'react';

export const MessageTimeLine: React.FC = () => {
  return (
    <div className="flex flex-shrink-0 flex-col items-center">
      <div className="line flex-grow-1"></div>
      <div className="icon-wrapper flex h-7 w-7 items-center justify-center rounded-full bg-gray-200">
        <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </div>
      <div className="line flex-grow-1"></div>
    </div>
  );
};
