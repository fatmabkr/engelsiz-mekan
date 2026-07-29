import React from 'react';
import { 
  Home, 
  Compass, 
  Map, 
  Users, 
  User, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Bell, 
  MapPin, 
  AlertTriangle, 
  WifiOff, 
  Inbox, 
  Loader2, 
  Mic, 
  X,
  ThumbsUp,
  MessageSquare,
  Share2,
  Heart,
  Star,
  ChevronRight
} from 'lucide-react';
import { Screen, Review, CommunityPost, AppSimulatedState } from '../types';

/* -------------------------------------------------------------------------- */
/* SearchBar                                                                  */
/* -------------------------------------------------------------------------- */

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  activeFilterCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFilterClick,
  placeholder = 'Mekân, kafe veya cadde ara...',
  activeFilterCount = 0,
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1 flex items-center">
        <Search className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="touch-target w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/15 shadow-soft transition-all"
        />
        {value ? (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button className="absolute right-3 text-slate-400 hover:text-[#0D9488] p-1">
            <Mic className="w-4 h-4" />
          </button>
        )}
      </div>

      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className="touch-target relative p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-soft flex items-center justify-center transition-all cursor-pointer active:scale-95"
          aria-label="Filtrele"
        >
          <SlidersHorizontal className="w-5 h-5 text-[#0F172A]" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#0D9488] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

interface HeaderProps {
  currentCity?: string;
  onCityClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity = 'Eskişehir',
  onCityClick,
  onNotificationClick,
  onProfileClick,
  unreadNotificationsCount = 3,
}) => {
  return (
    <div className="bg-white px-4 py-3 border-b border-slate-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Greeting & City */}
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-black tracking-tight text-[#0F172A]">YOL AÇIK</span>
            <span className="text-[10px] text-slate-400">• Engelsiz Keşif</span>
          </div>
          <button
            onClick={onCityClick}
            className="flex items-center gap-1 font-black text-sm text-[#0D9488] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0D9488] fill-[#0D9488]/20" />
            <span>{currentCity}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-90" />
          </button>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNotificationClick}
            className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5 text-[#0F172A]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#0D9488] rounded-full ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full ring-2 ring-[#0F172A]/30 overflow-hidden cursor-pointer active:scale-95 transition-transform"
            aria-label="Profilim"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Profil"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* BottomNavigation                                                           */
/* -------------------------------------------------------------------------- */

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onAddVenueClick: () => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onAddVenueClick,
}) => {
  const tabsLeft = [
    { id: 'home' as Screen, label: 'Ana Sayfa', icon: Home },
    { id: 'explore' as Screen, label: 'Keşfet', icon: Compass },
    { id: 'search' as Screen, label: 'Arama', icon: Search },
  ];

  const tabsRight = [
    { id: 'community' as Screen, label: 'Topluluk', icon: Users },
    { id: 'map' as Screen, label: 'Harita', icon: Map },
    { id: 'profile' as Screen, label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white/95 backdrop-blur-md border-t border-x border-slate-200/80 rounded-t-2xl shadow-xl pb-safe">
      <div className="relative px-2 py-1 flex items-center justify-between">
        {tabsLeft.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                isActive ? 'text-[#12B886] font-black' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#12B886]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 truncate">{tab.label}</span>
            </button>
          );
        })}

        {/* Center Floating Action Button: Mekân Ekle */}
        <div className="relative -top-3.5 flex flex-col items-center px-1 shrink-0">
          <button
            onClick={onAddVenueClick}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0D1B2A] to-[#12B886] active:scale-95 text-white shadow-md flex items-center justify-center transition-all cursor-pointer ring-4 ring-white"
            aria-label="Mekân Ekle"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-extrabold text-[#0D1B2A] mt-0.5 whitespace-nowrap">Mekân Ekle</span>
        </div>

        {tabsRight.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                isActive ? 'text-[#12B886] font-black' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#12B886]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ReviewCard                                                                 */
/* -------------------------------------------------------------------------- */

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-2.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-gray-900">{review.userName}</h4>
              <span className="px-2 py-0.5 bg-teal-50 text-[#009688] text-[10px] font-extrabold rounded-md">
                {review.userBadge}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">{review.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
          <Star className="w-3.5 h-3.5 fill-[#FF9800] text-[#FF9800]" />
          <span className="text-xs font-bold text-amber-900">{review.rating}</span>
        </div>
      </div>

      <p className="text-xs text-gray-700 leading-relaxed font-normal">{review.content}</p>

      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mt-1">
          {review.photos.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Yorum görseli"
              className="w-16 h-16 rounded-xl object-cover border border-gray-100"
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-500">
        <button className="flex items-center gap-1.5 hover:text-[#009688] cursor-pointer">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Faydalı Buldum ({review.helpfulCount})</span>
        </button>
        <span className="text-[11px] text-gray-400">Erişilebilirlik Puanı: %{review.accessibilityRating * 20}</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CommunityPostCard                                                          */
/* -------------------------------------------------------------------------- */

export const CommunityPostCard: React.FC<{
  post: CommunityPost;
  onVenueClick?: () => void;
}> = ({ post, onVenueClick }) => {
  return (
    <div className="bg-white rounded-[18px] border border-gray-100 p-4 shadow-soft flex flex-col gap-3">
      {/* User Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#009688]/20"
          />
          <div>
            <h4 className="font-bold text-sm text-gray-900">{post.userName}</h4>
            <p className="text-[11px] font-medium text-[#009688]">{post.userLevel}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium">{post.date}</span>
      </div>

      {/* Post Text */}
      <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>

      {/* Tagged Venue Banner */}
      {post.venueName && (
        <div
          onClick={onVenueClick}
          className="p-2.5 rounded-xl bg-teal-50/70 hover:bg-teal-50 border border-teal-100/80 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#009688]" />
            <span className="text-xs font-bold text-teal-900">{post.venueName}</span>
          </div>
          <span className="text-[11px] font-bold text-[#009688]">İncele →</span>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Paylaşım görseli"
          className="w-full h-48 rounded-xl object-cover border border-gray-100"
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600">
        <button className="flex items-center gap-1.5 hover:text-red-500 cursor-pointer font-medium">
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{post.likesCount} Beğeni</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#009688] cursor-pointer font-medium">
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount} Yorum</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#009688] cursor-pointer font-medium">
          <Share2 className="w-4 h-4" />
          <span>Paylaş</span>
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Page States: Empty, Loading, Error, No Internet                            */
/* -------------------------------------------------------------------------- */

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'Mekân Bulunamadı',
  description = 'Arama kriterlerinize uygun erişilebilir mekan bulunamadı. Filtreleri değiştirmeyi deneyebilirsiniz.',
  actionText = 'Filtreleri Temizle',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[22px] border border-gray-100 my-6 shadow-xs">
      <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-[#009688] mb-4">
        <Inbox className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 max-w-xs">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2.5 bg-[#009688] text-white text-xs font-bold rounded-xl shadow-soft hover:bg-[#00796B] transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Mekânlar Yükleniyor...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center my-6">
      <Loader2 className="w-9 h-9 text-[#009688] animate-spin mb-3" />
      <p className="text-xs font-semibold text-gray-600">{message}</p>
    </div>
  );
};

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Bir hata oluştu. Veriler yüklenirken sorun yaşandı.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/60 rounded-[22px] border border-red-100 my-6">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-[#D32F2F] mb-3">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-red-900">Yükleme Hatası</h3>
      <p className="text-xs text-red-700 mt-1 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-[#D32F2F] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-red-800 transition-colors cursor-pointer"
        >
          Yeniden Dene
        </button>
      )}
    </div>
  );
};

export const NoInternetState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-amber-50/70 rounded-[22px] border border-amber-200 my-6">
      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-[#EF6C00] mb-3">
        <WifiOff className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-amber-900">İnternet Bağlantısı Yok</h3>
      <p className="text-xs text-amber-800 mt-1 max-w-xs">
        Lütfen ağ bağlantınızı kontrol edin. Çevrimdışı kaydedilen mekanlarınıza erişmeye devam edebilirsiniz.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-[#EF6C00] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-amber-700 transition-colors cursor-pointer"
        >
          Bağlantıyı Kontrol Et
        </button>
      )}
    </div>
  );
};

/* Helper for simulated app states bar */
export const PageStateBar: React.FC<{
  currentState: AppSimulatedState;
  onChangeState: (st: AppSimulatedState) => void;
}> = ({ currentState, onChangeState }) => {
  return (
    <div className="bg-slate-900 text-white px-3 py-1.5 text-[11px] flex items-center justify-between overflow-x-auto no-scrollbar gap-2 z-50">
      <span className="font-bold text-amber-400 whitespace-nowrap">🛠 Test Durumu:</span>
      <div className="flex items-center gap-1.5">
        {(['normal', 'loading', 'empty', 'error', 'no_internet'] as AppSimulatedState[]).map((st) => (
          <button
            key={st}
            onClick={() => onChangeState(st)}
            className={`px-2 py-0.5 rounded-md font-semibold transition-colors uppercase text-[10px] cursor-pointer ${
              currentState === st ? 'bg-[#009688] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};
