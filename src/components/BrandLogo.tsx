import React from 'react';

export function BrandLogo({
  className = 'h-12',
}: {
  className?: string;
}) {
  return (
    <div className="flex items-center">
      {/* Light mode (white background) */}
      <img
        src="/logo-full-light.png"
        alt="TrackMyProgress Logo"
        className={`block dark:hidden ${className} w-auto object-contain drop-shadow-sm`}
      />

      {/* Dark mode (black background) */}
      <img
        src="/logo-full-dark.png"
        alt="TrackMyProgress Logo"
        className={`hidden dark:block ${className} w-auto object-contain drop-shadow-sm`}
      />
    </div>
  );
}
