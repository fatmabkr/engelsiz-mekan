import React from 'react';
import { X, Check, Filter, RotateCcw } from 'lucide-react';
import { FilterOptions } from '../types';
import { PrimaryButton, SecondaryButton } from '../components/UIElements';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
}

export const FiltersBottomSheet: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'restoran', label: 'Restoran' },
    { id: 'kafe', label: 'Kafe' },
    { id: 'muze', label: 'Müze' },
    { id: 'avm', label: 'Alışveriş Merkezi' },
    { id: 'park', label: 'Park & Açık Alan' },
    { id: 'kamu', label: 'Kamu Binası' },
  ];

  const accessibilityOptions = [
    { id: 'all', label: 'Tüm Dereceler' },
    { id: 'high', label: '🟢 Yüksek (%80+)' },
    { id: 'rampa', label: '♿ Rampası Olanlar' },
    { id: 'engelli_tuvaleti', label: '🚻 Engelli Tuvaleti Var' },
    { id: 'asansor', label: '🛗 Asansörü Var' },
  ];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0 sm:p-4">
      <div 
        className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-[28px] p-5 max-h-[90vh] flex flex-col justify-between shadow-soft-lg animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#009688]" />
            <h2 className="text-lg font-extrabold text-gray-900">Erişilebilirlik Filtreleri</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Form */}
        <div className="overflow-y-auto py-4 flex-1 space-y-6 pr-1">
          {/* Minimum Accessibility Score Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-800">Minimum Erişilebilirlik Puanı</label>
              <span className="text-xs font-black px-2.5 py-1 bg-teal-50 text-[#009688] rounded-lg">
                %{localFilters.minScore}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={localFilters.minScore}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, minScore: Number(e.target.value) })
              }
              className="w-full accent-[#009688] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>%0 (Hepsi)</span>
              <span>%50 (Orta)</span>
              <span>%90 (Kapsamlı)</span>
            </div>
          </div>

          {/* Maximum Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-800">Maksimum Mesafe</label>
              <span className="text-xs font-black px-2.5 py-1 bg-amber-50 text-[#FF9800] rounded-lg">
                {localFilters.maxDistanceKm} km
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={localFilters.maxDistanceKm}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, maxDistanceKm: Number(e.target.value) })
              }
              className="w-full accent-[#FF9800] cursor-pointer"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">Kategori</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setLocalFilters({ ...localFilters, category: cat.id })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    localFilters.category === cat.id
                      ? 'bg-[#009688] text-white border-[#009688] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Feature Priority */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">Öncelikli Erişilebilirlik Özelliği</label>
            <div className="flex flex-wrap gap-1.5">
              {accessibilityOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLocalFilters({ ...localFilters, accessibilityFilter: opt.id })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    localFilters.accessibilityFilter === opt.id
                      ? 'bg-[#FF9800] text-white border-[#FF9800] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-gray-800">Sadece Doğrulanmış Mekânlar</span>
              <input
                type="checkbox"
                checked={localFilters.onlyVerified}
                onChange={(e) => setLocalFilters({ ...localFilters, onlyVerified: e.target.checked })}
                className="w-5 h-5 accent-[#009688] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-gray-800">Sadece Favorilerim</span>
              <input
                type="checkbox"
                checked={localFilters.onlyFavorites}
                onChange={(e) => setLocalFilters({ ...localFilters, onlyFavorites: e.target.checked })}
                className="w-5 h-5 accent-[#009688] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">Sıralama</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'distance', label: 'En Yakın Mekânlar' },
                { id: 'score', label: 'En Yüksek Erişilebilirlik' },
                { id: 'rating', label: 'En Yüksek Müşteri Puanı' },
                { id: 'newest', label: 'Son Eklenenler' },
              ].map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: sort.id as any })}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                    localFilters.sortBy === sort.id
                      ? 'bg-teal-50 border-[#009688] text-[#009688] font-bold'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
          <SecondaryButton
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onResetFilters}
            className="flex-1"
            size="sm"
          >
            Sıfırla
          </SecondaryButton>
          <PrimaryButton
            icon={<Check className="w-4 h-4" />}
            onClick={handleApply}
            className="flex-[2]"
            size="sm"
          >
            Filtreleri Uygula
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
