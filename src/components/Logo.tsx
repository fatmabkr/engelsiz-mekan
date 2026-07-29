import React from 'react';

interface LogoProps {
  size?: number | string;
  className?: string;
  showDetails?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 80,
  className = '',
  showDetails = true,
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shadow-md select-none shrink-0 ${className}`}
      aria-label="Yol Açık - Hayata Açılan Engelsiz Yollar Logosu"
    >
      <defs>
        {/* Golden Gradient Background */}
        <radialGradient
          id="goldGrad"
          cx="50%"
          cy="45%"
          r="55%"
          fx="45%"
          fy="35%"
        >
          <stop offset="0%" stopColor="#FDE384" />
          <stop offset="45%" stopColor="#F7BC3A" />
          <stop offset="85%" stopColor="#E39618" />
          <stop offset="100%" stopColor="#BF730B" />
        </radialGradient>

        {/* Bronze Metallic Ring Gradient */}
        <linearGradient id="bronzeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5A3210" />
          <stop offset="50%" stopColor="#2A1303" />
          <stop offset="100%" stopColor="#4A260B" />
        </linearGradient>

        {/* Değişim Liderleri D Gradient */}
        <linearGradient id="dLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="50%" stopColor="#ED1C24" />
          <stop offset="100%" stopColor="#FFF200" />
        </linearGradient>

        {/* Arc Path Top for "YOL AÇIK" */}
        <path
          id="topArcPath"
          d="M 75 250 A 175 175 0 0 1 425 250"
          fill="none"
        />

        {/* Arc Path Bottom for "HAYATA AÇILAN ENGELSİZ YOLLAR" */}
        <path
          id="bottomArcPath"
          d="M 420 250 A 170 170 0 0 1 80 250"
          fill="none"
        />
      </defs>

      {/* Outer Golden Circle */}
      <circle cx="250" cy="250" r="240" fill="url(#goldGrad)" />

      {/* Outer Border Rings */}
      <circle cx="250" cy="250" r="240" stroke="url(#bronzeBorder)" strokeWidth="10" fill="none" />
      <circle cx="250" cy="250" r="230" stroke="#3D1F08" strokeWidth="2.5" fill="none" />
      <circle cx="250" cy="250" r="222" stroke="#3D1F08" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
      <circle cx="250" cy="250" r="215" stroke="#3D1F08" strokeWidth="2" fill="none" />

      {/* Top Text: YOL AÇIK */}
      <text fill="#261405" fontFamily="sans-serif" fontWeight="900" fontSize="48" letterSpacing="6">
        <textPath href="#topArcPath" startOffset="50%" textAnchor="middle">
          YOL AÇIK
        </textPath>
      </text>

      {/* Bottom Text: HAYATA AÇILAN ENGELSİZ YOLLAR */}
      <text fill="#261405" fontFamily="sans-serif" fontWeight="800" fontSize="22" letterSpacing="2">
        <textPath href="#bottomArcPath" startOffset="50%" textAnchor="middle">
          • HAYATA AÇILAN ENGELSİZ YOLLAR •
        </textPath>
      </text>

      {/* CENTER EMBLEM: Archway, Winged Wheelchair, and Road */}
      <g transform="translate(0, -10)">
        {/* Archway (Door) */}
        <path
          d="M 250 115 C 298 115 346 142 346 220 L 346 225 L 250 225 Z"
          fill="none"
          stroke="#2A1404"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 250 115 C 202 115 154 142 154 220 L 154 225 L 250 225 Z"
          fill="none"
          stroke="#2A1404"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Curving Pathway/Road */}
        <path
          d="M 346 225 C 385 227 388 280 250 335 L 225 350 L 390 270 C 375 235 346 225 346 225 Z"
          fill="#2A1404"
        />
        <path
          d="M 270 225 C 290 240 310 270 235 328 L 220 312 C 280 262 265 240 250 225 Z"
          fill="#2A1404"
        />

        {/* Winged Wheelchair Emblem */}
        {/* Wheel Outer Ring */}
        <circle cx="180" cy="270" r="48" fill="none" stroke="#2A1404" strokeWidth="15" />
        {/* Wheel Hub */}
        <circle cx="180" cy="265" r="9" fill="#2A1404" />
        {/* Wheel Spokes */}
        <line x1="180" y1="222" x2="180" y2="310" stroke="#2A1404" strokeWidth="4" />
        <line x1="138" y1="265" x2="222" y2="265" stroke="#2A1404" strokeWidth="4" />

        {/* Wing Feathers on Left of Wheel */}
        <path
          d="M 180 265 C 150 240 100 170 100 110 C 120 130 140 160 170 190 C 130 160 105 130 102 145 C 130 185 160 215 185 230 C 140 200 115 180 110 195 C 135 225 165 245 180 265 Z"
          fill="#2A1404"
        />

        {/* Seated Figure / Wheelchair User Body */}
        <path
          d="M 215 240 L 240 280 L 270 285 L 245 320 L 220 310 L 228 275 Z"
          fill="#2A1404"
        />
      </g>

      {/* Horizontal Divider 1 with Dots */}
      <line x1="90" y1="375" x2="410" y2="375" stroke="#2A1404" strokeWidth="1.5" />
      <circle cx="90" cy="375" r="3.5" fill="#2A1404" />
      <circle cx="410" cy="375" r="3.5" fill="#2A1404" />

      {/* STEM Leadership Text */}
      <text
        x="250"
        y="392"
        fill="#2A1404"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="12.5"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        STEM PROJESİNDE LEADERSHIP KAPSAMINDA
      </text>
      <text
        x="250"
        y="407"
        fill="#2A1404"
        fontFamily="sans-serif"
        fontWeight="800"
        fontSize="12.5"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        GELİŞTİRİLMİŞTİR.
      </text>

      {/* Horizontal Divider 2 with Dots */}
      <line x1="120" y1="416" x2="380" y2="416" stroke="#2A1404" strokeWidth="1.2" />
      <circle cx="120" cy="416" r="3" fill="#2A1404" />
      <circle cx="380" cy="416" r="3" fill="#2A1404" />

      {/* SPONSOR LOGOS FOOTER AREA */}
      {/* Center Divider Line */}
      <line x1="250" y1="422" x2="250" y2="458" stroke="#2A1404" strokeWidth="1.5" />
      <circle cx="250" cy="440" r="2.5" fill="#2A1404" />

      {/* Left Sponsor: Ford Otosan */}
      <g transform="translate(160, 422)">
        {/* Ford Oval */}
        <ellipse cx="32" cy="12" rx="28" ry="11" fill="#0B2B68" stroke="#FFFFFF" strokeWidth="1" />
        <text x="32" y="16" fill="#FFFFFF" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="11" textAnchor="middle">
          Ford
        </text>
        <text x="32" y="32" fill="#2A1404" fontFamily="sans-serif" fontWeight="900" fontSize="8" textAnchor="middle" letterSpacing="0.5">
          FORD OTOSAN
        </text>
      </g>

      {/* Right Sponsor: Değişim Liderleri Derneği */}
      <g transform="translate(268, 423)">
        {/* D Logo */}
        <path
          d="M 4 2 L 14 2 C 22 2 28 7 28 14 C 28 21 22 26 14 26 L 4 26 Z"
          fill="url(#dLogoGrad)"
        />
        <path
          d="M 10 7 L 14 7 C 18 7 22 10 22 14 C 22 18 18 21 14 21 L 10 21 Z"
          fill="#F7BC3A"
        />
        <text x="34" y="12" fill="#0A3C72" fontFamily="sans-serif" fontWeight="800" fontSize="8.5">
          Değişim
        </text>
        <text x="34" y="20" fill="#0A3C72" fontFamily="sans-serif" fontWeight="800" fontSize="8.5">
          Liderleri
        </text>
        <text x="34" y="28" fill="#0A3C72" fontFamily="sans-serif" fontWeight="800" fontSize="8.5">
          Derneği
        </text>
      </g>
    </svg>
  );
};
