import React, { useState } from 'react';
import { 
  LayoutGrid, 
  List, 
  Map, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X, 
  Building2 
} from 'lucide-react';
import { Venue, FilterOptions } from '../types';
import { SearchBar } from '../components/NavigationAndStateComponents';
import { VenueCard, CompactVenueCard } from '../components/VenueCards';
import { EmptyState } from '../components/NavigationAndStateComponents';

interface ExploreViewProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
  onToggleFavorite: (id: string) => void;
  onOpenFilterSheet: () => void;
  onOpenMapView: () => void;
  filters: FilterOptions;
  onUpdateFilters: (f: FilterOptions) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  venues,
  onSelectVenue,
  onToggleFavorite,
  onOpenFilterSheet,
  onOpenMapView,
  filters,
  onUpdateFilters,
  searchQuery,
  onSearchChange,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // Apply search & filters
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

  // Sort
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (filters.sortBy === 'score') return b.accessibilityScore - a.accessibilityScore;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 max-w-md mx-auto space-y-4">
      {/* Top Sticky Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-30 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="font-extrabold text-base text-gray-900">Erişilebilir Mekân Keşfi</h1>
          <button
            onClick={onOpenMapView}
            className="p-2 bg-[#009688] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#00796B] transition-colors cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span>Harita Modu</span>
          </button>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onFilterClick={onOpenFilterSheet}
          placeholder="Eskişehir'de rampa, kafe veya AVM ara..."
        />
      </div>

      {/* Result Count & View Switch Controls */}
      <div className="px-4 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700">
          <strong className="text-[#009688]">{sortedVenues.length}</strong> Erişilebilir Mekân Bulundu
        </span>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#009688] text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Izgara Görünümü"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-[#009688] text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Liste Görünümü"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      <div className="px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {filters.minScore > 0 && (
          <span className="px-2.5 py-1 bg-teal-50 text-[#009688] border border-teal-200 text-xs font-bold rounded-full flex items-center gap-1">
            Min %{filters.minScore} Skor
          </span>
        )}
        {filters.category !== 'all' && (
          <span className="px-2.5 py-1 bg-teal-50 text-[#009688] border border-teal-200 text-xs font-bold rounded-full flex items-center gap-1 capitalize">
            {filters.category}
          </span>
        )}
        {filters.onlyVerified && (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
            Doğrulanmış
          </span>
        )}
      </div>

      {/* Venues Content Grid/List */}
      <div className="px-4">
        {sortedVenues.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedVenues.map((venue) => (
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
          ) : (
            <div className="space-y-2">
              {sortedVenues.map((venue) => (
                <CompactVenueCard key={venue.id} venue={venue} onClick={() => onSelectVenue(venue)} />
              ))}
            </div>
          )
        ) : (
          <EmptyState
            onAction={() =>
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
              })
            }
          />
        )}
      </div>
    </div>
  );
};
