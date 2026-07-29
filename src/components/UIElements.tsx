import React from 'react';
import { Star, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { FeatureStatus } from '../types';

/* -------------------------------------------------------------------------- */
/* PrimaryButton & SecondaryButton                                            */
/* -------------------------------------------------------------------------- */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-[12px]',
    md: 'px-5 py-3 text-base rounded-[14px]',
    lg: 'px-6 py-4 text-lg rounded-[16px]',
  };

  return (
    <button
      className={`touch-target inline-flex items-center justify-center gap-2 font-extrabold bg-gradient-to-r from-[#0F766E] to-[#0D9488] hover:from-[#0d6b63] hover:to-[#0b8378] active:scale-[0.98] text-white shadow-soft transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-[12px]',
    md: 'px-5 py-3 text-base rounded-[14px]',
    lg: 'px-6 py-4 text-lg rounded-[16px]',
  };

  return (
    <button
      className={`touch-target inline-flex items-center justify-center gap-2 font-bold bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-200 shadow-soft transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0 text-[#0D9488]">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* AccessibilityScore                                                         */
/* -------------------------------------------------------------------------- */

interface ScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'pill' | 'circle';
}

export const AccessibilityScore: React.FC<ScoreProps> = ({ 
  score, 
  size = 'md', 
  showLabel = true,
  variant = 'pill' 
}) => {
  let primaryColorClass = 'border-emerald-600 text-emerald-700 bg-emerald-50';
  let levelText = 'Yüksek Erişilebilirlik';
  if (score < 50) {
    primaryColorClass = 'border-rose-500 text-rose-700 bg-rose-50';
    levelText = 'Kısıtlı Erişilebilirlik';
  } else if (score < 80) {
    primaryColorClass = 'border-amber-500 text-amber-700 bg-amber-50';
    levelText = 'Orta Erişilebilirlik';
  }

  if (variant === 'circle') {
    const circleSizes = {
      sm: 'w-8 h-8 text-[11px] border-[2.5px]',
      md: 'w-10 h-10 text-xs border-[3px]',
      lg: 'w-12 h-12 text-sm border-[3.5px]',
    };

    return (
      <div className="inline-flex items-center gap-1.5">
        <div
          className={`${circleSizes[size]} ${primaryColorClass} rounded-full bg-white flex items-center justify-center font-extrabold shadow-xs shrink-0`}
        >
          {score}
        </div>
        {showLabel && size !== 'sm' && (
          <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{levelText}</span>
        )}
      </div>
    );
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-bold rounded-lg border',
    md: 'px-2.5 py-1 text-sm font-bold rounded-xl border',
    lg: 'px-3.5 py-1.5 text-base font-extrabold rounded-xl border',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`${sizes[size]} ${primaryColorClass} inline-flex items-center gap-1 shadow-xs`}>
        <span className="font-mono">%{score}</span>
      </span>
      {showLabel && size !== 'sm' && (
        <span className="text-xs font-medium text-slate-500 hidden sm:inline">{levelText}</span>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* AccessibilityBadge                                                         */
/* -------------------------------------------------------------------------- */

interface BadgeProps {
  label: string;
  status?: FeatureStatus;
  icon?: React.ReactNode;
}

export const AccessibilityBadge: React.FC<BadgeProps> = ({ label, status = 'mevcut', icon }) => {
  let statusClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let statusDot = 'bg-emerald-600';
  let statusText = label;

  if (status === 'mevcut_degil') {
    statusClasses = 'bg-rose-50 text-rose-800 border-rose-200';
    statusDot = 'bg-rose-600';
    statusText = `${label} Yok`;
  } else if (status === 'bilgi_yok') {
    statusClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    statusDot = 'bg-amber-500';
    statusText = `${label} Bilgisi Yok`;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${statusClasses}`}>
      {icon ? icon : <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />}
      <span>{statusText}</span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* VerifiedBadge                                                              */
/* -------------------------------------------------------------------------- */

export const VerifiedBadge: React.FC<{ text?: string; compact?: boolean }> = ({ text = 'Doğrulanmış', compact = false }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 rounded-md">
      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
      {!compact && <span>{text}</span>}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* RatingStars                                                                */
/* -------------------------------------------------------------------------- */

export const RatingStars: React.FC<{ rating: number; count?: number; size?: number }> = ({ rating, count, size = 16 }) => {
  return (
    <div className="inline-flex items-center gap-1">
      <Star className="fill-amber-400 text-amber-400" style={{ width: size, height: size }} />
      <span className="text-sm font-bold text-slate-800">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-xs text-slate-500">({count})</span>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CategoryChip & FilterChip                                                  */
/* -------------------------------------------------------------------------- */

interface CategoryChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, icon, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-2xs ${
        active
          ? 'bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white border-transparent shadow-sm scale-[1.02]'
          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {icon && <span className="text-sm shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

export const FilterChip: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({
  label,
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
        active
          ? 'bg-[#0D9488] text-white shadow-xs border border-[#0D9488]'
          : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
      }`}
    >
      {active && <CheckCircle className="w-3.5 h-3.5 shrink-0 text-white" />}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* SectionTitle                                                               */
/* -------------------------------------------------------------------------- */

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, actionText, onAction }) => {
  return (
    <div className="flex items-end justify-between my-3">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actionText && (
        <button
          onClick={onAction}
          className="text-xs font-bold text-[#0D9488] hover:text-[#0F766E] inline-flex items-center gap-0.5 cursor-pointer py-1"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ProfileStatCard                                                            */
/* -------------------------------------------------------------------------- */

export const ProfileStatCard: React.FC<{ icon: React.ReactNode; value: string | number; label: string; color?: string }> = ({
  icon,
  value,
  label,
  color = 'bg-[#009688]/10 text-[#009688]',
}) => {
  return (
    <div className="bg-white p-3.5 rounded-[18px] border border-gray-100 shadow-soft flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${color} flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
};
