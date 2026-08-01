import React from 'react';
import { 
  Heart, 
  MapPin, 
  Check, 
  X, 
  HelpCircle, 
  Footprints, 
  TrendingUp, 
  DoorOpen, 
  Maximize2, 
  Layers, 
  ArrowUpSquare, 
  Square, 
  Bath, 
  Info,
  Navigation,
  Phone,
  Clock,
  Calendar
} from 'lucide-react';
import { Venue, FeatureStatus, AccessibilityFeatureId } from '../types';
import { AccessibilityScore, VerifiedBadge, RatingStars } from './UIElements';

/* -------------------------------------------------------------------------- */
/* VenueCard                                                                  */
/* -------------------------------------------------------------------------- */

interface VenueCardProps {
  venue: Venue;
  onClick: () => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick, onToggleFavorite }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-soft-lg hover:border-teal-200 transition-all duration-200 cursor-pointer group flex flex-col h-full"
    >
      {/* Cover Image & Overlays */}
      <div className="relative h-28 sm:h-36 w-full bg-slate-100 overflow-hidden">
        <img
          src={venue.coverImage}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {venue.isVerified ? (
            <span className="bg-gradient-to-r from-[#0F172A] to-[#0D9488] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              ✓ Doğrulandı
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {venue.categoryLabel}
            </span>
          )}

          <button
            onClick={onToggleFavorite}
            className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-500 shadow-xs transition-transform active:scale-90 cursor-pointer"
            aria-label="Favorilere ekle"
          >
            <Heart className={`w-3.5 h-3.5 ${venue.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          {/* Title & Circle Score Header */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#0D9488] transition-colors truncate">
                {venue.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                {venue.categoryLabel} • {venue.distanceKm} km
              </p>
            </div>
            <AccessibilityScore score={venue.accessibilityScore} size="sm" variant="circle" showLabel={false} />
          </div>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1.5">
            <RatingStars rating={venue.rating} count={venue.reviewCount} size={12} />
          </div>
        </div>

        {/* Feature Tags Row & Last Updated Date */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px] flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {venue.features.rampa === 'mevcut' && (
              <span className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded font-semibold flex items-center gap-0.5">
                ♿ Rampa
              </span>
            )}
            {venue.features.engelli_tuvaleti === 'mevcut' && (
              <span className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded font-semibold flex items-center gap-0.5">
                🚻 Tuvalet
              </span>
            )}
            {venue.features.asansor === 'mevcut' && (
              <span className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded font-semibold flex items-center gap-0.5">
                🛗 Asansör
              </span>
            )}
          </div>
          {(venue.lastUpdatedDate || venue.verifiedDate) && (
            <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5 ml-auto">
              <Calendar className="w-2.5 h-2.5 text-slate-400" />
              <span>Günd: {venue.lastUpdatedDate || venue.verifiedDate}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CompactVenueCard                                                           */
/* -------------------------------------------------------------------------- */

export const CompactVenueCard: React.FC<{ venue: Venue; onClick: () => void }> = ({ venue, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[16px] border border-gray-100 p-3 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer flex items-center gap-3"
    >
      <img
        src={venue.coverImage}
        alt={venue.name}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#009688]">
            {venue.categoryLabel}
          </span>
          <AccessibilityScore score={venue.accessibilityScore} size="sm" showLabel={false} />
        </div>
        <h4 className="font-bold text-sm text-gray-900 truncate mt-0.5">{venue.name}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <RatingStars rating={venue.rating} size={12} />
          <span>•</span>
          <span className="font-medium text-gray-600">{venue.distanceKm} km</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* AccessibilityFeatureRow                                                    */
/* -------------------------------------------------------------------------- */

const FEATURE_ICONS: Record<AccessibilityFeatureId, React.ReactNode> = {
  kaldirim: <Footprints className="w-5 h-5" />,
  rampa: <TrendingUp className="w-5 h-5" />,
  kapilar: <DoorOpen className="w-5 h-5" />,
  koridorlar: <Maximize2 className="w-5 h-5" />,
  merdiven: <Layers className="w-5 h-5" />,
  asansor: <ArrowUpSquare className="w-5 h-5" />,
  tek_kat: <Square className="w-5 h-5" />,
  engelli_tuvaleti: <Bath className="w-5 h-5" />,
  bilgilendirme: <Info className="w-5 h-5" />,
};

interface FeatureRowProps {
  featureId: AccessibilityFeatureId;
  label: string;
  status: FeatureStatus;
  note?: string;
}

export const AccessibilityFeatureRow: React.FC<FeatureRowProps> = ({
  featureId,
  label,
  status,
  note,
}) => {
  let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let statusIcon = <Check className="w-4 h-4 text-emerald-600" />;
  let statusText = 'Mevcut';

  if (status === 'mevcut_degil') {
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
    statusIcon = <X className="w-4 h-4 text-rose-600" />;
    statusText = 'Mevcut Değil';
  } else if (status === 'bilgi_yok') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    statusIcon = <HelpCircle className="w-4 h-4 text-amber-600" />;
    statusText = 'Bilgi Bulunamadı';
  }

  return (
    <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-[#009688]">
            {FEATURE_ICONS[featureId] || <Info className="w-5 h-5" />}
          </div>
          <span className="font-bold text-sm text-gray-900">{label}</span>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${badgeStyle}`}>
          {statusIcon}
          <span>{statusText}</span>
        </span>
      </div>

      {note && (
        <p className="text-xs text-gray-600 pl-11 font-normal bg-gray-50/80 p-2 rounded-xl border border-gray-100 mt-1">
          💡 <span className="font-semibold text-gray-700">Not:</span> {note}
        </p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MapVenuePreview                                                            */
/* -------------------------------------------------------------------------- */

export const MapVenuePreview: React.FC<{
  venue: Venue;
  onDetailClick: () => void;
  onDirectionsClick: () => void;
  onClose: () => void;
}> = ({ venue, onDetailClick, onDirectionsClick, onClose }) => {
  return (
    <div className="bg-white rounded-[22px] p-4 shadow-soft-lg border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#009688] uppercase tracking-wide">
                {venue.categoryLabel}
              </span>
              {venue.isVerified && <VerifiedBadge text="Doğrulandı" compact />}
            </div>
            <h3 className="font-extrabold text-base text-gray-900 line-clamp-1">{venue.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{venue.address}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl text-xs">
        <RatingStars rating={venue.rating} count={venue.reviewCount} size={14} />
        <AccessibilityScore score={venue.accessibilityScore} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onDirectionsClick}
          className="py-2.5 px-3 rounded-xl bg-[#009688] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 hover:bg-[#00796B] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>Yol Tarifi Al</span>
        </button>
        <button
          onClick={onDetailClick}
          className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>İncele & Detay</span>
        </button>
      </div>
    </div>
  );
};
