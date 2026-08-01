import React from 'react';
import { 
  Search, 
  Clock, 
  TrendingUp, 
  SlidersHorizontal, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  MapPin,
  Building2
} from 'lucide-react';
import { Venue, FilterOptions } from '../types';
import { SearchBar } from '../components/NavigationAndStateComponents';
import { CompactVenueCard } from '../components/VenueCards';
import { EmptyState } from '../components/NavigationAndStateComponents';

interface SearchViewProps {
  venues: Venue[];
  recentlyVisitedVenues: Venue[];
  onClearRecentVenues: () => void;
  onSelectVenue: (venue: Venue) => void;
  onToggleFavorite: (id: string) => void;
  onOpenFilterSheet: () => void;
  filters: FilterOptions;
  onUpdateFilters: (f: FilterOptions) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  venues,
  recentlyVisitedVenues,
  onClearRecentVenues,
  onSelectVenue,
  onToggleFavorite,
  onOpenFilterSheet,
  filters,
  onUpdateFilters,
  searchQuery,
  onSearchChange,
}) => {
  // Dynamically compute available popular tags based on current venues data
  const allPopularTags = [
    { label: '♿ Tam Rampalı', filter: 'rampa' },
    { label: '🚻 Engelli Tuvaleti', filter: 'engelli_tuvaleti' },
    { label: '🛗 Asansörlü', filter: 'asansor' },
    { label: '🌟 %80+ Skorlu', filter: 'high' },
    { label: '☕ Kafeler', category: 'kafe' },
    { label: '🍽️ Restoranlar', category: 'restoran' },
    { label: '🛍️ Alışveriş Merkezleri', category: 'avm' },
    { label: '🏥 Sağlık & Eczane', category: 'saglik' },
    { label: '🏛️ Kamu & Kültür', category: 'kamu' },
    { label: '🌳 Park & Açık Alan', category: 'park' },
  ];

  // Keep only tags that match at least one venue in current dataset
  const popularTags = allPopularTags.filter((tag) => {
    if (tag.category) {
      return venues.some((v) => v.category === tag.category);
    }
    if (tag.filter === 'rampa') return venues.some((v) => v.features.rampa === 'mevcut');
    if (tag.filter === 'engelli_tuvaleti') return venues.some((v) => v.features.engelli_tuvaleti === 'mevcut');
    if (tag.filter === 'asansor') return venues.some((v) => v.features.asansor === 'mevcut');
    if (tag.filter === 'high') return venues.some((v) => v.accessibilityScore >= 80);
    return true;
  });

  const handleTagClick = (tag: { filter?: string; category?: string }) => {
    if (tag.category) {
      onUpdateFilters({ ...filters, category: tag.category });
    } else if (tag.filter) {
      onUpdateFilters({ ...filters, accessibilityFilter: tag.filter as any });
    }
  };

  // Filter venues
  const filteredVenues = venues.filter((venue) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        venue.name.toLowerCase().includes(q) ||
        venue.address.toLowerCase().includes(q) ||
        venue.categoryLabel.toLowerCase().includes(q) ||
        venue.tags.some((t) => t.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (filters.category !== 'all' && venue.category !== filters.category) return false;
    if (venue.accessibilityScore < filters.minScore) return false;
    if (venue.distanceKm > filters.maxDistanceKm) return false;
    if (filters.onlyVerified && !venue.isVerified) return false;
    if (filters.onlyFavorites && !venue.isFavorite) return false;

    if (filters.accessibilityFilter === 'high' && venue.accessibilityScore < 80) return false;
    if (filters.accessibilityFilter === 'rampa' && venue.features.rampa !== 'mevcut') return false;
    if (filters.accessibilityFilter === 'engelli_tuvaleti' && venue.features.engelli_tuvaleti !== 'mevcut') return false;
    if (filters.accessibilityFilter === 'asansor' && venue.features.asansor !== 'mevcut') return false;

    return true;
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 max-w-md mx-auto space-y-4">
      {/* Top Search Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-30 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#009688]" />
            Arama & Filtreleme
          </h1>
          <button
            onClick={onOpenFilterSheet}
            className="px-3 py-1.5 bg-teal-50 text-[#009688] rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-teal-100 transition-colors cursor-pointer border border-teal-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtreler</span>
          </button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onFilterClick={onOpenFilterSheet}
          placeholder="Mekân adı, özellik veya mahalle ara..."
        />
      </div>

      {/* Main Search View Content */}
      {!searchQuery.trim() && filters.category === 'all' && filters.accessibilityFilter === 'all' ? (
        <div className="px-4 space-y-6">
          {/* Son Ziyaret Edilen / Açılan Mekânlar (Son Aramalar) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#009688]" />
                Son Açılan Mekânlar
              </span>
              {recentlyVisitedVenues.length > 0 && (
                <button
                  onClick={onClearRecentVenues}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer font-medium"
                >
                  Temizle
                </button>
              )}
            </div>

            {recentlyVisitedVenues.length > 0 ? (
              <div className="space-y-2">
                {recentlyVisitedVenues.map((venue) => (
                  <div
                    key={venue.id}
                    onClick={() => onSelectVenue(venue)}
                    className="p-2.5 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-between hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={venue.coverImage}
                        alt={venue.name}
                        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate group-hover:text-[#009688] transition-colors">
                          {venue.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                          <span className="truncate">{venue.categoryLabel}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-teal-700 font-semibold">
                            <MapPin className="w-3 h-3" />
                            {venue.distanceKm} km
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2 py-0.5 bg-teal-50 text-[#009688] text-[11px] font-bold rounded-lg border border-teal-100">
                        %{venue.accessibilityScore}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#009688] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-dashed border-gray-200 text-center space-y-1">
                <Building2 className="w-6 h-6 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-medium">Henüz bir mekân detayını açmadınız.</p>
                <p className="text-[11px] text-gray-400">Detayına gittiğiniz veya linkle açtığınız mekânlar burada görünecektir.</p>
              </div>
            )}
          </div>

          {/* Quick Popular Accessibility Tags */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#009688]" />
              Popüler Erişilebilirlik Filtreleri
            </span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-2 bg-white border border-gray-200 hover:border-[#009688] hover:bg-teal-50/50 text-gray-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Suggestions / All Venues Quick List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Tüm Erişilebilir Mekânlar
              </span>
              <span className="text-xs text-gray-400">{venues.length} mekân</span>
            </div>
            <div className="space-y-2.5">
              {venues.slice(0, 6).map((venue) => (
                <CompactVenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={() => onSelectVenue(venue)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Search Results List */
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              Arama Sonuçları (<strong className="text-[#009688]">{filteredVenues.length}</strong>)
            </span>
            {(filters.category !== 'all' || filters.accessibilityFilter !== 'all') && (
              <button
                onClick={() =>
                  onUpdateFilters({
                    ...filters,
                    category: 'all',
                    accessibilityFilter: 'all',
                  })
                }
                className="text-xs text-teal-600 font-bold hover:underline"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>

          {filteredVenues.length > 0 ? (
            <div className="space-y-2.5">
              {filteredVenues.map((venue) => (
                <CompactVenueCard
                  key={venue.id}
                  venue={venue}
                  onClick={() => onSelectVenue(venue)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              onAction={() => {
                onSearchChange('');
                onUpdateFilters({
                  searchQuery: '',
                  category: 'all',
                  accessibilityFilter: 'all',
                  minScore: 0,
                  maxDistanceKm: 10,
                  onlyVerified: false,
                  onlyFavorites: false,
                  sortBy: 'distance',
                  viewMode: 'grid',
                });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
