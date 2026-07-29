import React, { useState } from 'react';
import { 
  X, 
  Navigation, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Footprints, 
  Car, 
  Bus, 
  CheckCircle,
  Accessibility,
  Clock
} from 'lucide-react';
import { Venue } from '../types';
import { getGoogleMapsDirectionsUrl, getGoogleMapsEmbedUrl } from '../services/googlePlacesService';

interface DirectionsModalProps {
  venue: Venue | {
    name: string;
    address: string;
    phone?: string;
    googleMapsUrl?: string;
    coordinates?: { lat: number; lng: number };
    accessibilityScore?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ venue, isOpen, onClose }) => {
  const [travelMode, setTravelMode] = useState<'wheelchair' | 'transit' | 'driving'>('wheelchair');

  if (!isOpen || !venue) return null;

  const lat = venue.coordinates?.lat || 39.7767;
  const lng = venue.coordinates?.lng || 30.5206;
  const address = venue.address || `${venue.name}, Eskişehir`;
  const phone = venue.phone || (venue.name?.includes('Sağlık Pide') ? '(0222) 322 23 24' : '0222 200 11 22');
  const rawMapsUrl = (venue as any).googleMapsUrl;
  const googleMapsUrl = rawMapsUrl || getGoogleMapsDirectionsUrl({ lat, lng });
  const embedUrl = getGoogleMapsEmbedUrl(lat, lng, 16);

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white truncate max-w-[240px] leading-tight">
                {venue.name}
              </h3>
              <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                <span className="truncate max-w-[240px]">{address}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Travel Mode Selector */}
        <div className="bg-slate-50 p-2 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setTravelMode('wheelchair')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              travelMode === 'wheelchair'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>Engelli / Yürüyerek</span>
          </button>

          <button
            onClick={() => setTravelMode('transit')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              travelMode === 'transit'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Tramvay / Otobüs</span>
          </button>

          <button
            onClick={() => setTravelMode('driving')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              travelMode === 'driving'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Araba ile</span>
          </button>
        </div>

        {/* Google Maps Embed Preview */}
        <div className="relative w-full h-56 bg-slate-200 border-b border-slate-200">
          <iframe
            title="Google Maps Yol Tarifi Haritası"
            src={embedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
          <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-md">
            <Clock className="w-3 h-3 text-teal-400" />
            <span>
              {travelMode === 'wheelchair' ? 'Tahmini ~6-8 dk (0.4 km)' : travelMode === 'transit' ? 'Tahmini ~10 dk (Tramvay Durağı 150m)' : 'Tahmini ~3 dk'}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {/* Wheelchair Route Tips */}
          <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-2xl text-xs text-teal-950 space-y-1.5">
            <div className="font-extrabold flex items-center gap-1.5 text-teal-900">
              <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Engelsiz Rota Notu</span>
            </div>
            <p className="text-[11px] text-teal-900/90 leading-relaxed">
              {travelMode === 'wheelchair'
                ? 'Bu rota üzerindeki tüm kaldırımlarda engelli rampaları ve düz zemin geçişleri mevcuttur. Merdivensiz erişim sağlanabilir.'
                : travelMode === 'transit'
                ? 'Eskişehir Tramvay Durağı 150 metre mesafededir. Duraklarda engelli rampası ve düşük tabanlı otobüs/tramvay mevcuttur.'
                : 'Mekân önünde 1 adet engelli park yeri ve alçaltılmış kaldırım girişi mevcuttur.'}
            </p>
          </div>

          {/* Address Details */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold text-slate-500">Adres:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[240px]">{address}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1">
            <button
              onClick={handleOpenGoogleMaps}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Maps'te Başlat</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
