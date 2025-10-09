import React from 'react';

export const Logo = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Adhikaar.ai Logo"
    >
      {/* Shield outline */}
      <path
        d="M20 2L4 8V18C4 28 12 36 20 38C28 36 36 28 36 18V8L20 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Letter A with scale of justice as crossbar */}
      <g transform="translate(12, 10)">
        {/* Left leg of A */}
        <path
          d="M2 18L8 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Right leg of A */}
        <path
          d="M14 18L8 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Crossbar as scale */}
        <g transform="translate(0, 9)">
          {/* Scale beam */}
          <line
            x1="4"
            y1="0"
            x2="12"
            y2="0"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Left pan */}
          <path
            d="M4 0L3.5 2H4.5L4 0Z"
            fill="currentColor"
          />
          {/* Right pan */}
          <path
            d="M12 0L11.5 2H12.5L12 0Z"
            fill="currentColor"
          />
        </g>
      </g>
      {/* Ashoka Chakra dot at apex */}
      <circle
        cx="20"
        cy="6"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
};
