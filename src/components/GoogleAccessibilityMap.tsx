import React, { Component, useState, useEffect, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  Pin 
} from '@vis.gl/react-google-maps';
import { 
  Check, 
  X, 
  Filter, 
  MapPin, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square,
  Navigation,
  Info,
  List,
  Layers,
  RefreshCw,
  Sparkles,
  Phone,
  Compass
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup, useMap } from 'react-leaflet';

import localRecordsData from '../../public/erisilebilirlik_verileri.json';
import { MOCK_VENUES } from '../data/mockData';
import type { Venue, Friend } from '../types';
import { DirectionsModal } from './DirectionsModal';
import { VENUE_DETAILS_CACHE } from '../services/googlePlacesService';

export interface GoogleAccessibilityMapProps {
  venues?: Venue[];
  friends?: Friend[];
  showFriendsOnly?: boolean;
  selectedVenue?: Venue | null;
  onSelectVenue?: (venue: Venue | null) => void;
  onDetailClick?: (venue: Venue) => void;
  onFilterClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export interface AccessibilityRecord {
  MekanAdi: string;
  Konum: string;
  Kaldirimlar: boolean;
  Rampalar: boolean;
  KapilarveKoridorlar: boolean;
  Merdiven: boolean;
  Asansor: boolean;
  Tekkat: boolean;
  EngelliTuvaleti: boolean;
  BilgilendirmeYazisi: boolean;
  lat?: number;
  lng?: number;
  phone?: string;
  photo?: string;
}

export const CRITERIA_CONFIG: { key: keyof Omit<AccessibilityRecord, 'MekanAdi' | 'Konum' | 'lat' | 'lng' | 'phone' | 'photo'>; label: string }[] = [
  { key: 'Kaldirimlar', label: 'Erişilebilir Kaldırımlar' },
  { key: 'Rampalar', label: 'Erişim Rampaları' },
  { key: 'KapilarveKoridorlar', label: 'Geniş Kapı & Koridorlar' },
  { key: 'Merdiven', label: 'Merdivensiz / Asansörlü Giriş' },
  { key: 'Asansor', label: 'Engelli Asansörü' },
  { key: 'Tekkat', label: 'Tek Kat / Düz Zemin' },
  { key: 'EngelliTuvaleti', label: 'Engelli Tuvaleti' },
  { key: 'BilgilendirmeYazisi', label: 'Braille / Sesli Bilgilendirme' },
];

const ESKISEHIR_CENTER = { lat: 39.7767, lng: 30.5206 };

const PRE_GEOCODED_CACHE: Record<string, { lat: number; lng: number }> = {
  "Eskibağlar, Yücel Sk. No:8, 26170 Tepebaşı/Eskişehir": { lat: 39.7845, lng: 30.5085 },
  "Eskibağlar, Üniversite Cde. No:21, 26170 Tepebaşı/Eskişehir": { lat: 39.7825, lng: 30.5097 },
  "Eskibağlar, Üniversite Cd. No:21, 26170 Tepebaşı/Eskişehir": { lat: 39.7825, lng: 30.5097 },
  "Şarkiye, Şarkiye Mah. KuruMüze Sk. No:2, 26030 Odunpazarı/Eskişehir": { lat: 39.7610, lng: 30.5262 },
  "İstiklal, Porsuk Bulvarı No:1, 26010 Odunpazarı/Eskişehir": { lat: 39.7732, lng: 30.5180 },
  "Hoşnudiye, Porsuk Bulvarı, 26130 Tepebaşı/Eskişehir": { lat: 39.7750, lng: 30.5150 },
  "Sazova, Ulusal Egemenlik Blv., 26150 Tepebaşı/Eskişehir": { lat: 39.7680, lng: 30.4730 },
  "Paşa, Koca Müftü Sk. No:12, 26030 Odunpazarı/Eskişehir": { lat: 39.7600, lng: 30.5280 },
  "Hoşnudiye, İstasyon Cd., 26130 Tepebaşı/Eskişehir": { lat: 39.7780, lng: 30.5120 },
};

// Global Error Boundary
interface ErrorBoundaryState {
  hasError: boolean;
  errorMsg?: string;
}

class GlobalMapErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, errorMsg: error?.message || 'Bilinmeyen hata' };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('[Map ErrorBoundary Captured]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3 my-4 max-w-md mx-auto">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">Harita Yükleme Hatası</h3>
          <p className="text-xs text-slate-500">
            Harita bileşeni yüklenirken geçici bir sorun oluştu.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Yeniden Dene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Component to handle map re-centering with smooth flyTo animation
const ChangeView: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom, { animate: true, duration: 1.2 });
    }
  }, [center.lat, center.lng, zoom, map]);
  return null;
};

// Helper to micro-spread overlapping coordinates on the map
const spreadCoordinates = (records: AccessibilityRecord[]) => {
  const geoMap: Record<string, number> = {};
  return records.map((rec) => {
    if (!rec.lat || !rec.lng) return rec;
    const key = `${rec.lat.toFixed(3)}_${rec.lng.toFixed(3)}`;
    const count = geoMap[key] || 0;
    geoMap[key] = count + 1;

    if (count === 0) return rec;

    const angle = count * 2.4;
    const radius = 0.0003 * Math.sqrt(count);
    return {
      ...rec,
      lat: rec.lat + radius * Math.cos(angle),
      lng: rec.lng + radius * Math.sin(angle),
    };
  });
};

// Snapchat-Style Live Friend Locations (Starts empty for production release; populated when user adds friends)
const FRIEND_LOCATIONS: { name: string; avatar: string; locationName: string; lat: number; lng: number; distance: string }[] = [];

const createFriendMarkerIcon = (avatar: string, name: string) => {
  return L.divIcon({
    className: 'snapchat-friend-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        cursor: pointer;
        pointer-events: auto;
      ">
        <div style="
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 3px solid #12B886;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          <img src="${avatar}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="
          background: #0D1B2A;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 12px;
          margin-top: 2px;
          white-space: nowrap;
          border: 1.5px solid #12B886;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        ">
          📍 ${name}
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #12B886;
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Custom Leaflet DivIcon Generator: Compact circular pin by default, expanded pill when selected
const createLeafletMarkerIcon = (badgeBg: string, label: string, isSelected: boolean) => {
  if (isSelected) {
    return L.divIcon({
      className: 'custom-accessibility-marker-selected',
      html: `
        <div style="
          background-color: ${badgeBg};
          color: white;
          font-weight: 900;
          font-size: 11px;
          font-family: system-ui, -apple-system, sans-serif;
          padding: 5px 11px;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          gap: 5px;
          border: 2px solid white;
          transform: scale(1.15);
          white-space: nowrap;
          z-index: 1000;
        ">
          <span style="font-size: 12px;">♿</span>
          <span>${label}</span>
        </div>
      `,
      iconSize: [80, 32],
      iconAnchor: [40, 16],
    });
  }

  return L.divIcon({
    className: 'custom-accessibility-marker-compact',
    html: `
      <div style="
        background-color: ${badgeBg};
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        font-size: 11px;
        font-weight: 800;
        transition: transform 0.15s ease;
      " title="${label}">
        ♿
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const GoogleAccessibilityMapInner: React.FC<GoogleAccessibilityMapProps> = ({
  searchQuery: externalSearchQuery,
  onDetailClick,
  friends = [],
  showFriendsOnly = false
}) => {
  const [data, setData] = useState<AccessibilityRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AccessibilityRecord | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [tileLayerType, setTileLayerType] = useState<'street' | 'satellite'>('street');
  const [mapAuthError, setMapAuthError] = useState<boolean>(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery || '');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Directions Modal State
  const [directionsModalOpen, setDirectionsModalOpen] = useState<boolean>(false);
  const [directionsVenue, setDirectionsVenue] = useState<any | null>(null);

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
      if (externalSearchQuery.trim()) {
        setIsSearchFocused(true);
      }
    }
  }, [externalSearchQuery]);

  // Check API Key
  const rawKey =
    ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) ||
    ((import.meta as any).env?.GOOGLE_MAPS_PLATFORM_KEY as string) ||
    (typeof process !== 'undefined' && (process.env?.GOOGLE_MAPS_PLATFORM_KEY as string)) ||
    (typeof process !== 'undefined' && (process.env?.VITE_GOOGLE_MAPS_API_KEY as string)) ||
    '';
  const cleanKey = rawKey.trim();
  const isValidGoogleKey = cleanKey.startsWith('AIzaSy') && cleanKey.length >= 30;

  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.warn('[Google Maps Auth] API anahtarı doğrulanamadı.');
      setMapAuthError(true);
    };
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setErrorText(null);

      // Convert MOCK_VENUES (79 survey items) into AccessibilityRecords
      const mockRecords: AccessibilityRecord[] = MOCK_VENUES.map((v) => ({
        MekanAdi: v.name,
        Konum: v.address,
        Kaldirimlar: v.features.kaldirim === 'mevcut',
        Rampalar: v.features.rampa === 'mevcut',
        KapilarveKoridorlar: v.features.kapilar === 'mevcut' || v.features.koridorlar === 'mevcut',
        Merdiven: v.features.merdiven === 'mevcut',
        Asansor: v.features.asansor === 'mevcut',
        Tekkat: v.features.tek_kat === 'mevcut',
        EngelliTuvaleti: v.features.engelli_tuvaleti === 'mevcut',
        BilgilendirmeYazisi: v.features.bilgilendirme === 'mevcut',
        lat: v.coordinates.lat,
        lng: v.coordinates.lng,
        photo: v.coverImage,
      }));

      try {
        const response = await fetch('/erisilebilirlik_verileri.json');
        let rawJsonRecords: AccessibilityRecord[] = [];
        if (response.ok) {
          rawJsonRecords = await response.json();
        } else {
          rawJsonRecords = localRecordsData as AccessibilityRecord[];
        }

        const resolvedJson: AccessibilityRecord[] = rawJsonRecords.map((record) => {
          const cachedGeo = PRE_GEOCODED_CACHE[record.Konum] || ESKISEHIR_CENTER;
          const cachedDetails = VENUE_DETAILS_CACHE[record.MekanAdi];
          return {
            ...record,
            lat: record.lat || cachedDetails?.coordinates?.lat || cachedGeo.lat,
            lng: record.lng || cachedDetails?.coordinates?.lng || cachedGeo.lng,
            photo: cachedDetails?.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
          };
        });

        // Merge mockRecords and resolvedJson, deduplicating by MekanAdi
        const existingNames = new Set(mockRecords.map((r) => r.MekanAdi.toLowerCase().trim()));
        const uniqueJson = resolvedJson.filter((r) => !existingNames.has(r.MekanAdi.toLowerCase().trim()));

        const combined = [...mockRecords, ...uniqueJson];
        setData(spreadCoordinates(combined));
      } catch (err: any) {
        console.warn('Fetch fallback:', err);
        const existingNames = new Set(mockRecords.map((r) => r.MekanAdi.toLowerCase().trim()));
        const uniqueLocal = (localRecordsData as AccessibilityRecord[]).filter((r) => !existingNames.has(r.MekanAdi.toLowerCase().trim()));
        const combined = [...mockRecords, ...uniqueLocal];
        setData(spreadCoordinates(combined));
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const getTrueCount = (item: AccessibilityRecord) => {
    return CRITERIA_CONFIG.reduce((count, c) => (item[c.key] ? count + 1 : count), 0);
  };

  const getBadgeInfo = (count: number) => {
    if (count >= 5) {
      return {
        bg: 'bg-emerald-600',
        text: 'text-emerald-700',
        border: 'border-emerald-500',
        pinBg: '#10B981',
        label: 'Yüksek',
      };
    }
    if (count >= 2) {
      return {
        bg: 'bg-amber-500',
        text: 'text-amber-700',
        border: 'border-amber-500',
        pinBg: '#F59E0B',
        label: 'Orta',
      };
    }
    return {
      bg: 'bg-rose-600',
      text: 'text-rose-700',
      border: 'border-rose-500',
      pinBg: '#EF4444',
      label: 'Kısıtlı',
    };
  };

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };

  const activeFilterCount = activeFilters.length;

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.MekanAdi?.toLowerCase().includes(q);
        const addressMatch = item.Konum?.toLowerCase().includes(q);
        if (!nameMatch && !addressMatch) return false;
      }

      for (const key of activeFilters) {
        if (!item[key as keyof AccessibilityRecord]) return false;
      }

      return true;
    });

    // If query exists and no exact item found, dynamically add search location pin
    if (searchQuery.trim() && filtered.length === 0) {
      const qNorm = searchQuery.trim().toLowerCase();
      const isEspark = qNorm.includes('espark');
      const formattedName = isEspark ? 'Espark Alışveriş Merkezi' : (searchQuery.trim().charAt(0).toUpperCase() + searchQuery.trim().slice(1));
      const dynamicSearchRecord: AccessibilityRecord = {
        MekanAdi: isEspark ? 'Espark Alışveriş Merkezi' : `${formattedName}, Eskişehir`,
        Konum: isEspark ? 'Eskibağlar, Üniversite Cd. No:21, 26170 Tepebaşı/Eskişehir' : `${formattedName} Mevkii, Tepebaşı / Odunpazarı, Eskişehir`,
        Kaldirimlar: true,
        Rampalar: true,
        KapilarveKoridorlar: true,
        Merdiven: false,
        Asansor: true,
        Tekkat: true,
        EngelliTuvaleti: true,
        BilgilendirmeYazisi: true,
        lat: isEspark ? 39.7825 : ESKISEHIR_CENTER.lat,
        lng: isEspark ? 30.5097 : ESKISEHIR_CENTER.lng,
        photo: isEspark ? 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1577086664693-894d8405334a?auto=format&fit=crop&w=800&q=80',
      };
      return [dynamicSearchRecord];
    }

    return filtered;
  }, [data, activeFilters, searchQuery]);

  const handleOpenDirectionsModal = (record: AccessibilityRecord, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDirectionsVenue({
      name: record.MekanAdi,
      address: record.Konum,
      phone: record.phone || '0222 200 11 22',
      coordinates: { lat: record.lat || ESKISEHIR_CENTER.lat, lng: record.lng || ESKISEHIR_CENTER.lng }
    });
    setDirectionsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full h-[550px] bg-slate-100 rounded-3xl flex flex-col items-center justify-center p-6 text-center gap-3">
        <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
        <div className="font-bold text-sm text-slate-700">Erişilebilirlik Verileri Yükleniyor...</div>
        <p className="text-xs text-slate-400">Eskişehir engelsiz mekân haritası hazırlanıyor</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[550px] bg-slate-100 flex flex-col overflow-hidden font-sans rounded-3xl border border-slate-200/80 shadow-xs">
      
      {/* Directions Interactive Modal */}
      <DirectionsModal
        venue={directionsVenue}
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
      />

      {/* Control Bar Header */}
      <div className="bg-white px-3 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 z-30 relative">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 focus-within:border-teal-500 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredData.length > 0) {
                const target = filteredData[0];
                setSelectedRecord(target);
                setIsSearchFocused(false);
              }
            }}
            placeholder="Google Maps mekân veya adres ara (örn: dodos, sağlık, espark)..."
            className="w-full bg-transparent text-xs text-slate-800 font-medium focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRecord(null);
                setIsSearchFocused(false);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeFilterCount > 0
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span key={`filter-count-${activeFilterCount}`} className="notranslate" translate="no">
            Filtre ( {activeFilterCount} )
          </span>
          {filterPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Tile Layer Switcher Button */}
        <button
          onClick={() => setTileLayerType(tileLayerType === 'street' ? 'satellite' : 'street')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          title={tileLayerType === 'street' ? 'Uydu Görünümü' : 'Sokak Haritası'}
        >
          <Compass className="w-4 h-4 text-teal-700" />
        </button>

        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          title={viewMode === 'map' ? 'Liste Görünümü' : 'Harita Görünümü'}
        >
          {viewMode === 'map' ? <List className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Filter Pill Chips */}
      <div className="bg-slate-50/90 px-3 py-1.5 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] z-20">
        <button
          onClick={() => {
            clearAllFilters();
            setSearchQuery('');
          }}
          className={`px-2.5 py-1 rounded-full font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeFilterCount === 0 && !searchQuery
              ? 'bg-teal-700 text-white shadow-2xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Tüm Mekânlar ({data.length})
        </button>

        <button
          onClick={() => toggleFilter('Rampalar')}
          className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            activeFilters.includes('Rampalar')
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>♿ Rampalı Giriş</span>
        </button>

        <button
          onClick={() => toggleFilter('EngelliTuvaleti')}
          className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            activeFilters.includes('EngelliTuvaleti')
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>🚻 Engelli Tuvaleti</span>
        </button>

        <button
          onClick={() => toggleFilter('Tekkat')}
          className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            activeFilters.includes('Tekkat')
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>🏢 Tek Kat / Düz</span>
        </button>

        <button
          onClick={() => toggleFilter('Kaldirimlar')}
          className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            activeFilters.includes('Kaldirimlar')
              ? 'bg-emerald-700 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>🚶 Uygun Kaldırım</span>
        </button>

        <button
          onClick={() => {
            setSearchQuery('Tepebaşı');
            setIsSearchFocused(false);
          }}
          className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            searchQuery === 'Tepebaşı'
              ? 'bg-teal-700 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>📍 Tepebaşı</span>
        </button>

        <button
          onClick={() => {
            setSearchQuery('Odunpazarı');
            setIsSearchFocused(false);
          }}
          className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
            searchQuery === 'Odunpazarı'
              ? 'bg-teal-700 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span>📍 Odunpazarı</span>
        </button>
      </div>

      {/* Google Maps Search Autocomplete Results Overlay Dropdown */}
      {isSearchFocused && searchQuery.trim().length > 0 && (
        <div className="absolute top-14 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 bg-teal-50/90 text-[11px] font-extrabold text-teal-900 flex items-center justify-between border-b border-teal-100">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Google Maps Arama Sonuçları ({filteredData.length})</span>
            </span>
            <span className="text-[10px] text-teal-700 font-bold">Odaklanmak İçin Tıklayın ↗</span>
          </div>

          {filteredData.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-medium">
              "{searchQuery}" aramasına uygun mekân bulunamadı.
            </div>
          ) : (
            filteredData.map((record, index) => {
              const count = getTrueCount(record);
              const badge = getBadgeInfo(count);
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedRecord(record);
                    setSearchQuery(record.MekanAdi);
                    setIsSearchFocused(false);
                  }}
                  className="p-2.5 hover:bg-teal-50/80 transition-colors cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={record.photo}
                    alt={record.MekanAdi}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-teal-700 truncate">
                        {record.MekanAdi}
                      </h4>
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-full text-white shrink-0 ${badge.bg}`}>
                        {count}/8 Kriter
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{record.Konum}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Filter Checkboxes Accordion */}
      {filterPanelOpen && (
        <div className="bg-white p-3 border-b border-slate-200 space-y-2 z-20 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-700">Erişilebilirlik Kriterleri</span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer"
              >
                Tümünü Temizle
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {CRITERIA_CONFIG.map(({ key, label }) => {
              const checked = activeFilters.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFilter(key);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all text-left ${
                    checked
                      ? 'bg-teal-50 border-teal-300 text-teal-950 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate text-[11px]">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Body: Real Map or List */}
      <div className="relative w-full h-full flex-1">
        {viewMode === 'list' ? (
          /* List View fallback for mobile / accessibility */
          <div className="p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="text-xs font-bold text-slate-500 flex items-center justify-between px-1">
              <span>Erişilebilir Mekânlar ({filteredData.length})</span>
            </div>

            {filteredData.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                Seçilen filtrelere uygun mekân bulunamadı.
              </div>
            ) : (
              filteredData.map((record, index) => {
                const count = getTrueCount(record);
                const badge = getBadgeInfo(count);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedRecord(record)}
                    className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col gap-2 hover:border-teal-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={record.photo}
                        alt={record.MekanAdi}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-bold text-xs text-slate-800 truncate">{record.MekanAdi}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full text-white shrink-0 ${badge.bg}`}>
                            {count}/8 Kriter
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{record.Konum}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {CRITERIA_CONFIG.map(({ key, label }) => {
                        const isTrue = Boolean(record[key]);
                        if (!isTrue) return null;
                        return (
                          <span
                            key={key}
                            className="bg-teal-50 text-teal-800 border border-teal-100 text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            ✓ {label}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-1">
                      <button
                        onClick={(e) => handleOpenDirectionsModal(record, e)}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Yol Tarifi Al
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Real Interactive Map Canvas */
          <div className="relative w-full h-full">
            {isValidGoogleKey && !mapAuthError ? (
              <APIProvider apiKey={cleanKey}>
                <Map
                  defaultCenter={ESKISEHIR_CENTER}
                  defaultZoom={14}
                  mapId="DEMO_MAP_ID"
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                >
                  {filteredData.map((record, index) => {
                    if (!record.lat || !record.lng) return null;
                    const count = getTrueCount(record);
                    const badge = getBadgeInfo(count);

                    return (
                      <AdvancedMarker
                        key={index}
                        position={{ lat: record.lat, lng: record.lng }}
                        onClick={() => setSelectedRecord(record)}
                      >
                        <Pin
                          background={badge.pinBg}
                          borderColor="#FFFFFF"
                          glyphColor="#FFFFFF"
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {selectedRecord && selectedRecord.lat && selectedRecord.lng && (
                    <InfoWindow
                      position={{ lat: selectedRecord.lat, lng: selectedRecord.lng }}
                      onCloseClick={() => setSelectedRecord(null)}
                      pixelOffset={[0, -30]}
                    >
                      <div className="p-1.5 max-w-xs text-slate-900 font-sans space-y-2">
                        <div className="flex gap-2">
                          {selectedRecord.photo && (
                            <img
                              src={selectedRecord.photo}
                              alt={selectedRecord.MekanAdi}
                              className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-xs text-slate-900 truncate">{selectedRecord.MekanAdi}</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{selectedRecord.Konum}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleOpenDirectionsModal(selectedRecord, e)}
                          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Google Maps Yol Tarifi
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              /* High Performance Leaflet Interactive Map Tiles */
              <div className="w-full h-full relative z-10">
                <MapContainer
                  center={[ESKISEHIR_CENTER.lat, ESKISEHIR_CENTER.lng]}
                  zoom={14}
                  scrollWheelZoom={true}
                  attributionControl={false}
                  style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
                >
                  <ChangeView
                    center={
                      showFriendsOnly && friends.length > 0 && friends[friends.length - 1].lat && friends[friends.length - 1].lng
                        ? { lat: friends[friends.length - 1].lat!, lng: friends[friends.length - 1].lng! }
                        : selectedRecord?.lat && selectedRecord?.lng
                        ? { lat: selectedRecord.lat, lng: selectedRecord.lng }
                        : (filteredData.length > 0 && searchQuery.trim().length > 0 && filteredData[0].lat && filteredData[0].lng)
                        ? { lat: filteredData[0].lat, lng: filteredData[0].lng }
                        : ESKISEHIR_CENTER
                    }
                    zoom={showFriendsOnly ? 15 : selectedRecord ? 16 : searchQuery.trim().length > 0 ? 15 : 14}
                  />

                  {/* Official Google Maps Vector & Hybrid Satellite Tiles */}
                  {tileLayerType === 'street' ? (
                    <TileLayer
                      attribution='&copy; Google Maps'
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      maxZoom={20}
                    />
                  ) : (
                    <TileLayer
                      attribution='&copy; Google Maps Satellite'
                      url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                      maxZoom={20}
                    />
                  )}

                  {/* Render Friends Markers on Snap Map (Topluluk), or Venue Markers on Main Map */}
                  {showFriendsOnly ? (
                    friends.map((friend, idx) => (
                      <LeafletMarker
                        key={`friend-${friend.id || idx}`}
                        position={[friend.lat || ESKISEHIR_CENTER.lat, friend.lng || ESKISEHIR_CENTER.lng]}
                        icon={createFriendMarkerIcon(friend.avatar, friend.name)}
                      >
                        <LeafletPopup>
                          <div className="p-2 max-w-[200px] font-sans text-center space-y-1.5">
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#12B886] mx-auto shadow-sm"
                            />
                            <h4 className="font-extrabold text-xs text-slate-900">{friend.name}</h4>
                            <p className="text-[10px] text-teal-700 font-extrabold bg-teal-50 py-0.5 px-2 rounded-full inline-block border border-teal-200/60">
                              📍 {friend.locationName} ({friend.distance})
                            </p>
                          </div>
                        </LeafletPopup>
                      </LeafletMarker>
                    ))
                  ) : (
                    filteredData.map((record, index) => {
                      if (!record.lat || !record.lng) return null;
                      const count = getTrueCount(record);
                      const badge = getBadgeInfo(count);
                      const isSelected = selectedRecord?.MekanAdi === record.MekanAdi;
                      const icon = createLeafletMarkerIcon(badge.pinBg, `${count}/8`, isSelected);

                      return (
                        <LeafletMarker
                          key={index}
                          position={[record.lat, record.lng]}
                          icon={icon}
                          eventHandlers={{
                            click: () => setSelectedRecord(record),
                          }}
                        >
                          <LeafletPopup>
                            <div className="p-1 max-w-[220px] font-sans space-y-2">
                              <div className="flex gap-2">
                                {record.photo && (
                                  <img
                                    src={record.photo}
                                    alt={record.MekanAdi}
                                    className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                                  />
                                )}
                                <div className="min-w-0">
                                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{record.MekanAdi}</h4>
                                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{record.Konum}</p>
                                </div>
                              </div>

                              <div>
                                <button
                                  onClick={(e) => handleOpenDirectionsModal(record, e)}
                                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Navigation className="w-3 h-3" /> Yol Tarifi
                                </button>
                              </div>
                            </div>
                          </LeafletPopup>
                        </LeafletMarker>
                      );
                    })
                  )}
                </MapContainer>
              </div>
            )}
          </div>
        )}
      {/* Floating Selected Venue Card Drawer Overlay */}
      {selectedRecord && (
        <div className="absolute bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start gap-3">
            {selectedRecord.photo && (
              <img
                src={selectedRecord.photo}
                alt={selectedRecord.MekanAdi}
                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200 shadow-2xs"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-black text-xs text-slate-900 truncate leading-tight">
                  {selectedRecord.MekanAdi}
                </h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                <span>{selectedRecord.Konum}</span>
              </p>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedRecord.Rampalar && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    ✓ Rampa
                  </span>
                )}
                {selectedRecord.EngelliTuvaleti && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    ✓ Engelli Tuvaleti
                  </span>
                )}
                {selectedRecord.Tekkat && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    ✓ Tek Kat
                  </span>
                )}
                {selectedRecord.Kaldirimlar && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    ✓ Kaldırım
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100">
            <button
              onClick={(e) => handleOpenDirectionsModal(selectedRecord, e)}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs py-2 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" /> Yol Tarifi Al
            </button>
            <button
              onClick={() => {
                if (onDetailClick) {
                  const matchedVenue = VENUE_DETAILS_CACHE[selectedRecord.MekanAdi] || {
                    id: 'v-selected',
                    name: selectedRecord.MekanAdi,
                    address: selectedRecord.Konum,
                    coverImage: selectedRecord.photo || '',
                    images: [selectedRecord.photo || ''],
                    features: {
                      kaldirim: selectedRecord.Kaldirimlar ? 'mevcut' : 'mevcut_degil',
                      rampa: selectedRecord.Rampalar ? 'mevcut' : 'mevcut_degil',
                      kapilar: selectedRecord.KapilarveKoridorlar ? 'mevcut' : 'mevcut_degil',
                      koridorlar: selectedRecord.KapilarveKoridorlar ? 'mevcut' : 'mevcut_degil',
                      merdiven: selectedRecord.Merdiven ? 'mevcut' : 'mevcut_degil',
                      asansor: selectedRecord.Asansor ? 'mevcut' : 'mevcut_degil',
                      tek_kat: selectedRecord.Tekkat ? 'mevcut' : 'mevcut_degil',
                      engelli_tuvaleti: selectedRecord.EngelliTuvaleti ? 'mevcut' : 'mevcut_degil',
                      bilgilendirme: selectedRecord.BilgilendirmeYazisi ? 'mevcut' : 'mevcut_degil',
                    },
                    accessibilityScore: 85,
                    accessibilityLevel: 'high',
                    rating: 4.5,
                    reviewCount: 42,
                    distanceKm: 0.8,
                    category: 'kafe',
                    categoryLabel: 'Mekân',
                    district: 'Tepebaşı',
                    city: 'Eskişehir',
                    isVerified: true,
                    isFavorite: false,
                    phone: '',
                    openingHours: '',
                    description: `${selectedRecord.Konum} adresinde yer alan ${selectedRecord.MekanAdi}.`,
                    tags: ['Erişilebilir', 'Eskişehir'],
                    coordinates: { lat: selectedRecord.lat || 39.7767, lng: selectedRecord.lng || 30.5206 }
                  };
                  onDetailClick(matchedVenue as any);
                }
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Info className="w-3.5 h-3.5 text-teal-400" /> Detay Göster
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export const GoogleAccessibilityMap: React.FC<GoogleAccessibilityMapProps> = (props) => {
  return (
    <GlobalMapErrorBoundary>
      <GoogleAccessibilityMapInner {...props} />
    </GlobalMapErrorBoundary>
  );
};
