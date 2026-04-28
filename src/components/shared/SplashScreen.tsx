'use client';
import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div 
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
    >
      <h1 className="text-4xl font-bold text-blue-600">Habit Tracker</h1>
      <div className="mt-4 animate-pulse text-gray-500">Loading...</div>
    </div>
  );
};
