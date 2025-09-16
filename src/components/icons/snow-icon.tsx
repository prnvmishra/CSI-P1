import React from 'react';

export function SnowIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.5 6L18 7.5L13.5 9L12 13L10.5 9L6 7.5L10.5 6L12 2Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M6 12L7.5 16L12 17.5L7.5 19L6 23L4.5 19L0 17.5L4.5 16L6 12Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M18 12L19.5 16L24 17.5L19.5 19L18 23L16.5 19L12 17.5L16.5 16L18 12Z"
        fill="currentColor"
        opacity="0.6"
      />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="6" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="18" cy="6" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="6" cy="18" r="0.5" fill="currentColor" opacity="0.3" />
      <circle cx="18" cy="18" r="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
