import React from 'react';

export function LogoMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-10 h-10';

  return (
    <img
      src="/assets/original-logo.png"
      alt="Modern Pet Care & Stylish Fish Palace logo"
      className={`${dimensions} object-contain rounded-full bg-white`}
    />
  );
}
