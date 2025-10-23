'use client';

import React from 'react';
import '@/styles/loading.css';

interface LoadingBarProps {
  message?: string;
  className?: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  message = '読み込み中...', // Loading...
  className = '',
}) => {
  return (
    <div className={`loading-fallback loading-placeholder ${className}`} data-loading-component="true">
      <div className="mt-2 mb-4">{message}</div>
      <div className="loader mx-auto" style={{ margin: '0 100px' }}></div>
    </div>
  );
};

export default LoadingBar;
