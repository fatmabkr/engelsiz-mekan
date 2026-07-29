import React, { useState } from 'react';
import { 
  Building2, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  Coffee,
  Utensils,
  ShoppingBag,
  Trees,
  Landmark,
  Building
} from 'lucide-react';
import { Venue, AccessibilityPreferences } from '../types';
import { SearchBar, Header } from '../components/NavigationAndStateComponents';
import { SectionTitle, CategoryChip, FilterChip } from '../components/UIElements';
import { VenueCard } from '../components/VenueCards';

interface HomeViewProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
  onToggleFavorite: (id: string) => void;
  onOpenFilterSheet: () => void;
  onNavigateTab: (tab: 'explore' | 'map' | 'community' | 'profile') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  preferences: AccessibilityPreferences;
  onOpenPreferences: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  venues,
  onSelectVenue,
  onToggleFavorite,
  onOpenFilterSheet,
  onNavigateTab,
  searchQuery,
  onSearchChange,
  preferences,
  onOpenPreferences,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tüm Mekânlar', icon: <Building2 className="w-4 h-4" /> },
    { id: 'restoran', label: 'Restoran', icon: <Utensils className="w-4 h-4" /> },
    { id: 'kafe', label: 'Kafe', icon: <Coffee className="w-4 h-4" /> },
    { id: 'muze', label: 'Müze', icon: <Landmark className="w-4 h-4" /> },
    { id: 'avm', label: 'Alışveriş Merkezi', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'park', label: 'Park & Açık Alan', icon: <Trees className="w-4 h-4" /> },
    { id: 'kamu', label: 'Kamu Binası', icon: <Building className="w-4 h-4" /> },
  ];

  // Filter venues based on active category & quick accessibility filter
  const displayVenues = venues.filter((v) => {
    if (activeCategory !== 'all' && v.category !== activeCategory) return false;
    if (activeQuickFilter === 'rampa' && v.features.rampa !== 'mevcut') return false;
    if (activeQuickFilter === 'tuvalet' && v.features.engelli_tuvaleti !== 'mevcut') return false;
    if (activeQuickFilter === 'asansor' && v.features.asansor !== 'mevcut') return false;
    if (activeQuickFilter === 'high' && v.accessibilityScore < 80) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const nearbyVenues = displayVenues.filter((v) => v.distanceKm <= 1.5);
  const topRatedVenues = [...displayVenues].sort((a, b) => b.accessibilityScore - a.accessibilityScore);
  const verifiedVenues = displayVenues.filter((v) => v.isVerified);
  const fullyAccessible = displayVenues.filter((v) => v.accessibilityScore >= 90);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 max-w-md mx-auto space-y-4">
      {/* Top Header */}
      <Header
        currentCity="Eskişehir"
        onCityClick={() => alert('Şu an aktif şehir: Eskişehir. Diğer şehirler yakında eklenecektir.')}
        onNotificationClick={onOpenNotifications}
        onProfileClick={onOpenProfile}
      />

      {/* Search Bar */}
      <div className="px-4">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onFilterClick={onOpenFilterSheet}
          placeholder="Eskişehir'de rampa, kafe veya AVM ara..."
        />
      </div>

      {/* Personal Preferences Match Banner */}
      <div className="px-4">
        <div
          onClick={onOpenPreferences}
          className="p-3.5 bg-gradient-to-r from-[#0F172A] via-[#0F766E] to-[#059669] text-white rounded-[20px] flex items-center justify-between cursor-pointer shadow-soft hover:opacity-95 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 backdrop-blur-md text-teal-200 rounded-xl border border-white/20 shadow-2xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Kişisel Tercihlerinize Özel Öneriler</p>
              <p className="text-[10px] text-teal-100 font-medium">
                Min %{preferences.minimumScore} skor & Rampa/Tuvalet kriterleriniz aktif.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-teal-200" />
        </div>
      </div>

      {/* Quick Categories Bar */}
      <div className="space-y-1.5">
        <div className="px-4 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800">Kategoriler</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-1">
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Accessibility Filters */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <FilterChip
            label="Tümü"
            active={activeQuickFilter === 'all'}
            onClick={() => setActiveQuickFilter('all')}
          />
          <FilterChip
            label="♿ Rampa Şart"
            active={activeQuickFilter === 'rampa'}
            onClick={() => setActiveQuickFilter(activeQuickFilter === 'rampa' ? 'all' : 'rampa')}
          />
          <FilterChip
            label="🚻 Engelli Tuvaleti Var"
            active={activeQuickFilter === 'tuvalet'}
            onClick={() => setActiveQuickFilter(activeQuickFilter === 'tuvalet' ? 'all' : 'tuvalet')}
          />
          <FilterChip
            label="🛗 Asansörlü"
            active={activeQuickFilter === 'asansor'}
            onClick={() => setActiveQuickFilter(activeQuickFilter === 'asansor' ? 'all' : 'asansor')}
          />
          <FilterChip
            label="🟢 Tam Uyumlu (%80+)"
            active={activeQuickFilter === 'high'}
            onClick={() => setActiveQuickFilter(activeQuickFilter === 'high' ? 'all' : 'high')}
          />
        </div>
      </div>

      {/* SECTION 1: Yakındaki Mekânlar */}
      <div className="px-4 space-y-2 pt-2">
        {displayVenues.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 my-4">
            <p className="text-xs font-bold text-slate-700">Seçtiğiniz filtrelere uygun mekân bulunamadı.</p>
            <p className="text-[11px] text-slate-400">Kategoriyi veya erişilebilirlik filtresini değiştirerek tekrar deneyebilirsiniz.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveQuickFilter('all');
                onSearchChange('');
              }}
              className="px-4 py-2 bg-[#0F172A] text-white font-extrabold text-xs rounded-full shadow-xs hover:bg-slate-800 cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <>
            <SectionTitle
              title="Yakındaki Erişilebilir Mekânlar"
              subtitle="Eskişehir merkezine 1.5 km mesafede"
              actionText="Tümünü Gör"
              onAction={() => onNavigateTab('explore')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(nearbyVenues.length > 0 ? nearbyVenues : displayVenues).slice(0, 2).map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={() => onSelectVenue(venue)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(venue.id);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* SECTION 2: En Yüksek Puanlılar */}
      <div className="px-4 space-y-2 pt-2">
        <SectionTitle
          title="En Yüksek Erişilebilirlik Puanlılar"
          subtitle="Topluluk denetçilerince en yüksek puan alanlar"
          actionText="Tümünü Gör"
          onAction={() => onNavigateTab('explore')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topRatedVenues.slice(0, 2).map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={() => onSelectVenue(venue)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(venue.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* SECTION 3: Son Doğrulanan Mekânlar */}
      <div className="px-4 space-y-2 pt-2">
        <SectionTitle
          title="Son Doğrulanan Mekânlar"
          subtitle="Saha ekipleri tarafından onaylı yerler"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {verifiedVenues.slice(0, 2).map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={() => onSelectVenue(venue)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(venue.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* SECTION 4: Tam Erişilebilir Mekânlar */}
      <div className="px-4 space-y-2 pt-2 pb-6">
        <SectionTitle
          title="Tam Erişilebilir Mekânlar (%90+)"
          subtitle="Tüm 9 fiziki kritere sahip engelsiz noktalar"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fullyAccessible.slice(0, 2).map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={() => onSelectVenue(venue)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(venue.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
