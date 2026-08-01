import React from 'react';

interface LogoProps {
  size?: number | string;
  className?: string;
  showDetails?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 80,
  className = '',
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shadow-md select-none shrink-0 ${className}`}
      aria-label="Yol Açık Logosu"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" stroke="#5EEAD4" strokeWidth="2" />
      <path d="M 30 65 Q 50 35 70 65" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="38" r="6" fill="#5EEAD4" />
      <path d="M 42 52 C 45 42 55 42 58 52" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
};

