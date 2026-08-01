import React, { useState } from 'react';
import {
  Bell,
  Search,
  MapPin,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Plus,
  CheckCircle2,
  Sparkles,
  X,
  Send,
  TrendingUp,
  Check,
  Filter,
  CheckCircle,
  MoreHorizontal,
  Image as ImageIcon,
  MessageCircle,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  UserPlus,
  Pencil,
  Trash2
} from 'lucide-react';
import { CommunityPost, Friend } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';

interface CommunityViewProps {
  posts: CommunityPost[];
  friends?: Friend[];
  onSelectVenueById: (venueId: string) => void;
  onOpenChat?: (chatId?: string) => void;
  onOpenFriendMap?: () => void;
  onAddPost: (post: Partial<CommunityPost>) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (postId: string, updatedContent: string) => void;
  onAddFriend?: (friend: Partial<Friend>) => void;
  onDeleteFriend?: (friendId: string) => void;
  onEditFriend?: (friendId: string, updated: Partial<Friend>) => void;
}

type FilterChipType = 'tumu' | 'yeni' | 'dogrulanan' | 'sorular' | 'yardim' | 'etkinlikler';

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  friends = [],
  onSelectVenueById,
  onOpenChat,
  onOpenFriendMap,
  onAddPost,
  onDeletePost,
  onEditPost,
  onAddFriend,
  onDeleteFriend,
  onEditFriend,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterChipType>('tumu');
  const [feedTab, setFeedTab] = useState<'all' | 'nearby' | 'friends'>('all');
  const [locationPrivacy, setLocationPrivacy] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedSearch, setFeedSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  // Interactive Local State for Post Likes and Saves
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    posts.forEach((p) => {
      if (p.isLiked) initial[p.id] = true;
    });
    return initial;
  });

  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    posts.forEach((p) => {
      if (p.isSaved) initial[p.id] = true;
    });
    return initial;
  });

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    posts.forEach((p) => {
      initial[p.id] = p.likesCount;
    });
    return initial;
  });

  const [shareToast, setShareToast] = useState<string | null>(null);

  // Dynamic Friends handling connected to parent state
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendLocation, setNewFriendLocation] = useState('Espark AVM Yakınında');

  // Dynamic Editing post state
  const [editingPost, setEditingPost] = useState<{ id: string; content: string } | null>(null);

  const handleAddFriendSubmit = () => {
    if (!newFriendName.trim()) return;
    if (onAddFriend) {
      onAddFriend({
        name: newFriendName.trim(),
        locationName: newFriendLocation.trim() || 'Espark AVM',
        distance: '250 m uzakta',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      });
    }
    setNewFriendName('');
    setNewFriendLocation('Espark AVM');
    setShowAddFriendModal(false);
  };

  // New post form state
  const [newContent, setNewContent] = useState('');
  const [newVenueName, setNewVenueName] = useState('');
  const [newTags, setNewTags] = useState<string[]>(['♿ Rampa', '🚻 Engelli Tuvaleti']);

  const filterChips: { id: FilterChipType; label: string }[] = [
    { id: 'tumu', label: 'Tümü' },
    { id: 'yeni', label: 'Yeni' },
    { id: 'dogrulanan', label: 'Doğrulanan' },
    { id: 'sorular', label: 'Sorular' },
    { id: 'yardim', label: 'Yardım' },
  ];

  const handleToggleLike = (id: string) => {
    const isCurrentlyLiked = !!likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (isCurrentlyLiked ? -1 : 1),
    }));
  };

  const handleToggleSave = (id: string) => {
    setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (postTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Yol Açık Topluluk Paylaşımı',
        text: postTitle,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('Bağlantı panoya kopyalandı!');
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddPost({
      userName: 'Sen (Yol Açık Üyesi)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      userLevel: 'Erişilebilirlik Katkıcısı',
      isVerifiedContributor: true,
      date: 'Şimdi',
      content: newContent,
      venueName: newVenueName || 'Eskişehir Mekânı',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      isSaved: false,
      locationName: newVenueName ? `${newVenueName}, Eskişehir` : 'Eskişehir',
      statusBadge: '✓ Doğrulandı',
      categoryTag: 'dogrulanan',
      accessibilityTags: newTags.length > 0 ? newTags : ['♿ Rampa', '🚻 Engelli Tuvaleti', '🛗 Asansör', '🅿️ Engelli Otoparkı'],
    });

    setNewContent('');
    setNewVenueName('');
    setShowCreateModal(false);
  };

  // Filter posts dynamically across all category chips (Tümü, Yeni, Doğrulanan, Sorular, Yardım)
  const filteredPosts = posts.filter((p) => {
    if (activeFilter !== 'tumu') {
      if (activeFilter === 'dogrulanan') {
        const isDogrulanan = p.categoryTag === 'dogrulanan' || p.isVerifiedContributor || Boolean(p.statusBadge?.includes('Doğrulandı') || p.statusBadge?.includes('Onaylı'));
        if (!isDogrulanan) return false;
      } else if (activeFilter === 'yeni') {
        const isYeni = p.categoryTag === 'yeni' || p.date.includes('dakika') || p.date.includes('saat') || p.date.includes('Şimdi');
        if (!isYeni) return false;
      } else if (activeFilter === 'sorular') {
        const isSoru = p.categoryTag === 'sorular' || p.content.includes('?') || Boolean(p.statusBadge?.includes('Sorular'));
        if (!isSoru) return false;
      } else if (activeFilter === 'yardim') {
        const isYardim = p.categoryTag === 'yardim' || p.content.toLowerCase().includes('yardım') || Boolean(p.statusBadge?.includes('Yardım'));
        if (!isYardim) return false;
      } else if (p.categoryTag && p.categoryTag !== activeFilter) {
        return false;
      }
    }
    if (feedSearch.trim()) {
      const q = feedSearch.toLowerCase();
      return (
        p.content.toLowerCase().includes(q) ||
        p.userName.toLowerCase().includes(q) ||
        (p.venueName && p.venueName.toLowerCase().includes(q)) ||
        (p.locationName && p.locationName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Top trending 3 posts
  const trendingPosts = [...posts].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3);

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-32 max-w-md mx-auto text-[#0D1B2A] relative font-sans selection:bg-[#12B886]/20">
      {/* Toast Feedback */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md border border-white/10 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#12B886]" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* 1. TOP NAVIGATION */}
      <header className="bg-white/90 backdrop-blur-md px-5 py-4 border-b border-slate-100/80 sticky top-0 z-30 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0D1B2A]">Topluluk</h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Deneyimlerini paylaş, toplulukla buluş.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 rounded-full transition-all cursor-pointer ${searchOpen ? 'bg-[#0D1B2A] text-white' : 'bg-slate-100/80 hover:bg-slate-200/60 text-slate-700'
                }`}
              aria-label="Arama"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Search Expansion Bar */}
        {searchOpen && (
          <div className="relative animate-fade-in">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={feedSearch}
              onChange={(e) => setFeedSearch(e.target.value)}
              placeholder="Gönderilerde, mekanlarda veya kullanıcılarda ara..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-100/90 rounded-2xl text-xs font-medium text-[#0D1B2A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12B886]/30 border border-transparent"
              autoFocus
            />
            {feedSearch && (
              <button onClick={() => setFeedSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* 2. KONUM PAYLAŞIM GİZLİLİĞİ BANNER (Screenshot UI) */}
      <section className="px-5 pt-4 pb-1">
        <div className="bg-[#0D1B2A] text-white p-4 rounded-[22px] shadow-md border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#12B886]/15 border border-[#12B886]/30 flex items-center justify-center shrink-0 text-[#12B886]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-tight">Konum Paylaşım Gizliliği</h3>
              <p className="text-[11px] text-slate-300 font-medium">
                {locationPrivacy ? 'Konumunuz yakındaki arkadaşlarınızla paylaşılıyor.' : 'Konum paylaşımı kapalı.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocationPrivacy(!locationPrivacy)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${locationPrivacy ? 'bg-[#12B886]' : 'bg-slate-700'
              }`}
            role="switch"
            aria-checked={locationPrivacy}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${locationPrivacy ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </section>

      {/* 3. FEED VIEW SUB-TABS (Tüm Gönderiler / Yakındakiler / Arkadaşlar (3)) */}
      <section className="px-5 py-2">
        <div className="bg-white p-1 rounded-full border border-slate-200/70 shadow-xs flex items-center justify-between">
          <button
            onClick={() => setFeedTab('all')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${feedTab === 'all'
                ? 'bg-[#12B886] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <span>Tüm Gönderiler</span>
          </button>
          <button
            onClick={() => setFeedTab('nearby')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${feedTab === 'nearby'
                ? 'bg-[#12B886] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Yakındakiler</span>
          </button>
          <button
            onClick={() => setFeedTab('friends')}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${feedTab === 'friends'
                ? 'bg-[#12B886] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Arkadaşlar ({friends.length})</span>
          </button>
        </div>
      </section>

      {/* 4. TAB CONTENT BASED ON feedTab */}
      {feedTab === 'friends' && (
        <section className="px-5 py-2 animate-fade-in">
          <div className="bg-white rounded-[24px] p-4 border border-slate-200/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#0D1B2A]">Arkadaşlarım ({friends.length})</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Arkadaşlarınızın en son paylaştığı tecrübeler</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddFriendModal(true)}
                  className="px-3 py-1.5 rounded-full bg-teal-50 text-[#12B886] font-bold text-xs flex items-center gap-1 border border-teal-100 cursor-pointer hover:bg-teal-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Arkadaş Ekle</span>
                </button>
                {friends.length > 0 && (
                  <button
                    onClick={onOpenFriendMap}
                    className="px-3 py-1.5 rounded-full bg-[#0D1B2A] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#12B886]" />
                    <span>Harita</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Friends List */}
            {friends.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-xs font-semibold text-slate-500">Henüz eklenmiş arkadaşınız yok.</p>
                <p className="text-[11px] text-slate-400">Arkadaşlarınızı ekleyerek canlı konum takibi yapabilirsiniz.</p>
                <button
                  onClick={() => setShowAddFriendModal(true)}
                  className="mt-2 px-4 py-2 bg-[#12B886] text-white font-extrabold text-xs rounded-full shadow-xs hover:bg-[#0f9f74] cursor-pointer"
                >
                  + Arkadaş Ekle
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-1 pb-1">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex flex-col items-center gap-1.5 shrink-0 relative group">
                    <div className="relative cursor-pointer" onClick={onOpenFriendMap}>
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-13 h-13 rounded-full object-cover ring-2 ring-[#12B886] group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#12B886] rounded-full ring-2 ring-white" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 max-w-[70px] truncate text-center">{friend.name}</span>
                    <button
                      onClick={() => onDeleteFriend && onDeleteFriend(friend.id)}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
                <div onClick={() => setShowAddFriendModal(true)} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
                  <div className="w-13 h-13 rounded-full border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center hover:border-[#12B886] hover:text-[#12B886] transition-colors">
                    <Plus className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Yeni Ekle</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {feedTab === 'nearby' && (
        <section className="px-5 py-2 animate-fade-in space-y-3">
          <div className="bg-[#0D1B2A] rounded-[28px] p-4 text-white shadow-xl space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#12B886] animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-xs tracking-wider text-[#12B886] uppercase">SNAP MAP CANLI HARİTA</h3>
                  <p className="text-[10px] text-slate-300">Arkadaşlarınızın harita üzerindeki anlık konumları</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#12B886] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#0f9f74] cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Arkadaş Ekle</span>
              </button>
            </div>

            {/* Embedded Live Snapchat Snap Map */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner relative">
              <InteractiveMap friends={friends} showFriendsOnly={true} />
            </div>
          </div>
        </section>
      )}

      {/* 4. INLINE SHARE TRIGGER CARD (Screenshot UI) */}
      <section className="px-5 py-1">
        <div
          onClick={() => setShowCreateModal(true)}
          className="bg-white p-3.5 rounded-[22px] border border-slate-200/70 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:border-[#12B886]/50 transition-all group"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Profilim"
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-teal-500/20"
          />
          <p className="text-xs font-semibold text-slate-400 flex-1 line-clamp-1 group-hover:text-slate-600 transition-colors">
            Bugün hangi mekanı ziyaret ettin? Deneyimini paylaş...
          </p>
          <div className="w-9 h-9 rounded-2xl bg-teal-50 text-[#12B886] group-hover:bg-[#12B886] group-hover:text-white flex items-center justify-center transition-all shrink-0">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </section>

      {/* 2. QUICK FILTERS (HORIZONTAL CHIPS) */}
      <section className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5">
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${isActive
                    ? 'bg-[#0D1B2A] text-white shadow-md shadow-[#0D1B2A]/15'
                    : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'
                  }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING SECTION: "Bugünün En Faydalı Paylaşımları" */}
      {trendingPosts.length > 0 && (
        <section className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#12B886]/10 text-[#12B886]">
                <Sparkles className="w-4 h-4 fill-[#12B886]/20" />
              </div>
              <h2 className="text-sm font-extrabold text-[#0D1B2A] tracking-tight">Bugünün En Faydalı Paylaşımları</h2>
            </div>
            <span className="text-[11px] font-bold text-[#12B886]">Top 3</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {trendingPosts.map((post, idx) => (
              <div
                key={post.id}
                onClick={() => post.venueId && onSelectVenueById(post.venueId)}
                className="shrink-0 w-64 bg-white p-3.5 rounded-[22px] border border-slate-100 shadow-soft hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0D1B2A] text-white text-[10px] font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#0D1B2A] truncate max-w-[120px]">{post.userName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#12B886]/10 text-[#12B886] text-[10px] font-extrabold">
                    {post.likesCount} ❤️
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                  "{post.content}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                  <span className="truncate">{post.venueName || 'Eskişehir'}</span>
                  <span className="text-[#12B886]">İncele →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. COMMUNITY FEED */}
      <main className="px-5 pt-2 space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-[24px] p-8 text-center border border-slate-200/70 shadow-xs space-y-4 max-w-sm mx-auto my-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#12B886]/10 text-[#12B886] border border-[#12B886]/20 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#0D1B2A] tracking-tight">Henüz topluluk gönderisi yok</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">Topluluğumuza ilk katkıda bulunan siz olun!</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-[#12B886] hover:bg-[#0f9f74] text-white font-extrabold text-xs rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
            >
              + İlk Paylaşımı Yap
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const isSaved = !!savedPosts[post.id];
            const currentLikes = likeCounts[post.id] ?? post.likesCount;

            const tagsToDisplay = post.accessibilityTags && post.accessibilityTags.length > 0
              ? post.accessibilityTags
              : ['♿ Rampa', '🚻 Engelli Tuvaleti', '🛗 Asansör', '🅿️ Engelli Otoparkı'];

            return (
              <article
                key={post.id}
                className="bg-white rounded-[24px] border border-slate-100/90 p-4 shadow-soft flex flex-col gap-3.5 transition-all"
              >
                {/* User Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#12B886]/20 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-sm text-[#0D1B2A]">{post.userName}</h3>
                        {post.isVerifiedContributor && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#12B886]/10 text-[#12B886] text-[10px] font-black flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 fill-[#12B886] text-white" />
                            <span>Rozet</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                        <span>{post.date}</span>
                        {post.locationName && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-slate-500 font-semibold truncate">
                              <MapPin className="w-3 h-3 text-[#12B886]" />
                              {post.locationName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-100 text-[#12B886] text-[11px] font-extrabold whitespace-nowrap">
                      {post.statusBadge || '✓ Doğrulandı'}
                    </span>
                    <button
                      onClick={() => setEditingPost({ id: post.id, content: post.content })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                      title="Yorumu Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {onDeletePost && (
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Yorumu Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content Experience Text */}
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {post.content}
                </p>

                {/* Tagged Venue Link if available */}
                {post.venueName && (
                  <div
                    onClick={() => post.venueId && onSelectVenueById(post.venueId)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 className="w-4 h-4 text-[#12B886] shrink-0" />
                      <span className="text-xs font-extrabold text-[#0D1B2A] truncate">{post.venueName}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#12B886] shrink-0">Mekânı İncele →</span>
                  </div>
                )}

                {/* Large Rounded Photo */}
                {post.image && (
                  <div
                    onClick={() => setSelectedImageModal(post.image!)}
                    className="relative overflow-hidden rounded-[20px] border border-slate-100 group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt="Erişilebilirlik fotoğrafı"
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-[11px] font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                        Fotoğrafı Büyüt 🔍
                      </span>
                    </div>
                  </div>
                )}

                {/* Accessibility Tags Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {tagsToDisplay.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Interaction Buttons: Beğen, Yorum, Paylaş, Kaydet */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {/* ❤️ Beğen */}
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${isLiked ? 'text-rose-600 font-extrabold bg-rose-50' : 'hover:text-rose-500 hover:bg-slate-50 font-semibold'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{currentLikes} Beğen</span>
                  </button>

                  {/* 💬 Yorum */}
                  <button
                    onClick={() => post.venueId && onSelectVenueById(post.venueId)}
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:text-[#12B886] hover:bg-slate-50 font-semibold transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} Yorum</span>
                  </button>

                  {/* 📤 Paylaş */}
                  <button
                    onClick={() => handleShare(post.content)}
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:text-[#12B886] hover:bg-slate-50 font-semibold transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Paylaş</span>
                  </button>

                  {/* 🔖 Kaydet */}
                  <button
                    onClick={() => handleToggleSave(post.id)}
                    className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${isSaved ? 'text-[#12B886] font-extrabold bg-teal-50' : 'hover:text-[#12B886] hover:bg-slate-50 font-semibold'
                      }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#12B886] text-[#12B886]' : ''}`} />
                    <span>{isSaved ? 'Kaydedildi' : 'Kaydet'}</span>
                  </button>
                </div>

                {/* Comment Preview */}
                {post.commentPreview && (
                  <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-100 flex items-start gap-2.5 mt-1">
                    <img
                      src={post.commentPreview.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt="Yorum yapan"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-white"
                    />
                    <div className="flex-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#0D1B2A]">{post.commentPreview.userName}</span>
                        <span className="text-[10px] text-slate-400">{post.commentPreview.time}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-tight font-medium">
                        "{post.commentPreview.text}"
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </main>

      {/* 6. NEW POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePost}
            className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl space-y-4 animate-scale-up border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-[#0D1B2A]">Engelsiz Deneyim Paylaş</h3>
                <p className="text-[11px] text-slate-400">Topluluktaki engelli bireylere rehber olın</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Mekân Adı</label>
                <input
                  type="text"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  placeholder="Örn: Espark AVM, Kanatlı AVM, Kahve Dünyası..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#12B886] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Erişilebilirlik Deneyimi & Notlarınız</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Espark AVM'de yeni yapılan engelli tuvaleti oldukça kullanışlı. Rampalar girişte mevcut..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#12B886] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Erişilebilirlik Özellikleri</label>
                <div className="flex flex-wrap gap-1.5">
                  {['♿ Rampa', '🚻 Engelli Tuvaleti', '🛗 Asansör', '🅿️ Engelli Otoparkı', '🚪 Geniş Kapı'].map((tag) => {
                    const isSelected = newTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          if (isSelected) {
                            setNewTags(newTags.filter((t) => t !== tag));
                          } else {
                            setNewTags([...newTags, tag]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${isSelected
                            ? 'bg-[#12B886] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/60'
                          }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0D1B2A] hover:bg-[#12B886] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Gönderiyi Paylaş</span>
            </button>
          </form>
        </div>
      )}

      {/* 7. IMAGE LIGHTBOX MODAL */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute -top-12 right-0 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImageModal}
              alt="Detaylı fotoğraf"
              className="w-full h-auto max-h-[80vh] object-contain rounded-3xl border border-white/20 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* 8. EDIT POST MODAL */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#0D1B2A] flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#12B886]" />
                <span>Yorumu Düzenle</span>
              </h3>
              <button onClick={() => setEditingPost(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={editingPost.content}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12B886]"
              placeholder="Yorumunuzu güncelleyin..."
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onEditPost && editingPost.content.trim()) {
                    onEditPost(editingPost.id, editingPost.content.trim());
                  }
                  setEditingPost(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#12B886] text-white font-extrabold text-xs shadow-md hover:bg-[#0f9f74] transition-all"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. ADD FRIEND MODAL */}
      {showAddFriendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#0D1B2A] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#12B886]" />
                <span>Yeni Arkadaş Ekle</span>
              </h3>
              <button onClick={() => setShowAddFriendModal(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Arkadaşın Adı Soyadı</label>
                <input
                  type="text"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12B886]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Konum / Bölge (Eskişehir)</label>
                <input
                  type="text"
                  value={newFriendLocation}
                  onChange={(e) => setNewFriendLocation(e.target.value)}
                  placeholder="Örn: Espark AVM, Vişnelik, Odunpazarı..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#12B886]"
                />
                
                {/* Hızlı Konum Seçim Çipleri */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'Espark AVM',
                    'Vişnelik Starbucks',
                    'Porsuk Bulvarı',
                    'Odunpazarı Evleri',
                    'Anadolu Üniversitesi',
                    'Kanatlı AVM',
                    'Sazova Parkı'
                  ].map((locName) => (
                    <button
                      key={locName}
                      type="button"
                      onClick={() => setNewFriendLocation(locName)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
                        newFriendLocation === locName
                          ? 'bg-[#12B886] text-white border-[#12B886]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      📍 {locName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFriendModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleAddFriendSubmit}
                className="px-5 py-2 rounded-xl bg-[#12B886] text-white font-extrabold text-xs shadow-md hover:bg-[#0f9f74] transition-all"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
