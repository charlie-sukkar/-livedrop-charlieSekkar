import React from "react";

interface IconProps {
  className?: string;
  d: string;
}

export const Icon: React.FC<IconProps> = ({ className, d }) => {
  return (
         <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={d}
        />
      </svg>
  );
};