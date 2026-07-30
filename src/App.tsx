import React, { useState, useEffect } from 'react';
import { 
  Screen, 
  Venue, 
  Review, 
  CommunityPost, 
  FilterOptions, 
  AccessibilityPreferences,
  AppSimulatedState,
  Friend
} from './types';
import { 
  MOCK_VENUES, 
  MOCK_REVIEWS, 
  MOCK_COMMUNITY_POSTS, 
  INITIAL_PREFERENCES 
} from './data/mockData';

// Reusable Components
import { BottomNavigation } from './components/NavigationAndStateComponents';
import { InteractiveMap } from './components/InteractiveMap';
import { 
  EmptyState, 
  LoadingState, 
  ErrorState, 
  NoInternetState 
} from './components/NavigationAndStateComponents';

// Views
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { VenueDetailView } from './views/VenueDetailView';
import { AddVenueWizard } from './views/AddVenueWizard';
import { FiltersBottomSheet } from './views/FiltersBottomSheet';
import { CommunityView } from './views/CommunityView';
import { ChatView } from './views/ChatView';
import { ProfileView } from './views/ProfileView';
import { GoogleFormsView } from './views/GoogleFormsView';
import { AccessibilityPreferencesView } from './views/AccessibilityPreferencesView';
import { 
  SplashView, 
  OnboardingView, 
  LoginView, 
  RegisterView, 
  SettingsView, 
  NotificationsView 
} from './views/AuthAndInfoViews';

import { logEventSafe } from './firebase';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mapSelectedVenue, setMapSelectedVenue] = useState<Venue | null>(null);

  // App Data State
  const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(INITIAL_PREFERENCES);

  useEffect(() => {
    setPosts(MOCK_COMMUNITY_POSTS);
    setVenues(MOCK_VENUES);
  }, []);

  // Track page_view whenever the current screen or selected venue changes
  useEffect(() => {
    (async () => {
      try {
        await logEventSafe('page_view', { page: currentScreen, venueId: selectedVenue?.id ?? null });
      } catch (e) {
        // ignore analytics errors
      }
    })();
  }, [currentScreen, selectedVenue]);

  // ESKİŞEHİR KNOWN LOCATIONS DICTIONARY
  const getEskisehirCoords = (locationStr: string) => {
    const norm = (locationStr || '').toLowerCase().trim();
    if (norm.includes('espark')) return { lat: 39.7825, lng: 30.5097 };
    if (norm.includes('vişnelik') || norm.includes('visnelik')) return { lat: 39.7680, lng: 30.5120 };
    if (norm.includes('kanatlı') || norm.includes('kanatli')) return { lat: 39.7780, lng: 30.5140 };
    if (norm.includes('odunpazarı') || norm.includes('odunpazari')) return { lat: 39.7610, lng: 30.5262 };
    if (norm.includes('porsuk') || norm.includes('adalar')) return { lat: 39.7732, lng: 30.5180 };
    if (norm.includes('anadolu') || norm.includes('yunus emre')) return { lat: 39.7870, lng: 30.5020 };
    if (norm.includes('sazova')) return { lat: 39.7680, lng: 30.4730 };
    if (norm.includes('haller')) return { lat: 39.7800, lng: 30.5100 };
    if (norm.includes('tepebaşı') || norm.includes('tepebasi')) return { lat: 39.7845, lng: 30.5085 };
    if (norm.includes('eskibağlar') || norm.includes('eskibaglar')) return { lat: 39.7830, lng: 30.5090 };
    return { lat: 39.7767 + (Math.random() - 0.5) * 0.012, lng: 30.5206 + (Math.random() - 0.5) * 0.012 };
  };

  // Friend Handlers
  const handleAddFriend = (newFriend: Partial<Friend>) => {
    const loc = newFriend.locationName || 'Espark AVM';
    const coords = getEskisehirCoords(loc);
    const friend: Friend = {
      id: `friend-${Date.now()}`,
      name: newFriend.name || 'Yeni Arkadaş',
      avatar: newFriend.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      locationName: loc,
      distance: newFriend.distance || '250 m uzakta',
      lat: coords.lat,
      lng: coords.lng,
    };
    setFriends((prev) => [...prev, friend]);
  };

  const handleDeleteFriend = (friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const handleEditFriend = (friendId: string, updated: Partial<Friend>) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, ...updated } : f))
    );
  };

  // Filters State
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
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

  // Test Page State Simulation
  const [simulatedState, setSimulatedState] = useState<AppSimulatedState>('normal');

  // Favorite Handler
  const handleToggleFavorite = (venueId: string) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  // Add Review Handler
  const handleAddReview = (newReview: Partial<Review>) => {
    const rev: Review = {
      id: `rev-${Date.now()}`,
      venueId: newReview.venueId || 'venue-1',
      userName: newReview.userName || 'Kullanıcı',
      userAvatar: newReview.userAvatar || '',
      userBadge: newReview.userBadge || 'Doğrulayıcı',
      rating: newReview.rating || 5,
      accessibilityRating: newReview.accessibilityRating || 5,
      date: 'Bugün',
      content: newReview.content || '',
      helpfulCount: 0,
    };
    setReviews([rev, ...reviews]);
  };

  // Add Venue Handler
  const handleAddVenue = (newVenue: Partial<Venue>) => {
    const created: Venue = {
      id: `venue-${Date.now()}`,
      name: newVenue.name || 'Yeni Mekân',
      category: newVenue.category || 'kafe',
      categoryLabel: newVenue.categoryLabel || 'Kafe',
      address: newVenue.address || 'Eskişehir',
      district: newVenue.district || 'Tepebaşı',
      city: 'Eskişehir',
      distanceKm: 0.6,
      rating: 5.0,
      reviewCount: 1,
      accessibilityScore: newVenue.accessibilityScore || 85,
      accessibilityLevel: (newVenue.accessibilityScore || 85) >= 80 ? 'high' : 'medium',
      isVerified: false,
      isFavorite: true,
      coverImage: newVenue.coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      images: newVenue.images || [],
      phone: newVenue.phone || '0222 000 00 00',
      openingHours: '09:00 - 22:00',
      coordinates: { lat: 39.778, lng: 30.512 },
      features: newVenue.features || {
        kaldirim: 'mevcut',
        rampa: 'mevcut',
        kapilar: 'mevcut',
        koridorlar: 'mevcut',
        merdiven: 'mevcut',
        asansor: 'bilgi_yok',
        tek_kat: 'mevcut',
        engelli_tuvaleti: 'mevcut',
        bilgilendirme: 'bilgi_yok',
      },
      description: newVenue.description || 'Eskişehir engelsiz mekân.',
      tags: ['Kullanıcı Katkısı']
    };

    setVenues([created, ...venues]);
  };

  // Add Post Handler
  const handleAddPost = (newPost: Partial<CommunityPost>) => {
    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      userId: 'u-me',
      userName: newPost.userName || 'Kullanıcı',
      userAvatar: newPost.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      userLevel: newPost.userLevel || 'Erişilebilirlik Katkıcısı',
      date: 'Şimdi',
      content: newPost.content || '',
      venueName: newPost.venueName,
      image: newPost.image,
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      locationName: newPost.locationName,
      locationSharingEnabled: true,
      statusBadge: '✓ Doğrulandı',
      accessibilityTags: newPost.accessibilityTags || ['♿ Rampa', '🚻 Engelli Tuvaleti'],
    };
    setPosts([post, ...posts]);
  };

  // Delete Post Handler
  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Edit Post Handler
  const handleEditPost = (postId: string, updatedContent: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: updatedContent } : p))
    );
  };

  // Open Venue Detail
  const handleOpenDetail = (venue: Venue) => {
    setSelectedVenue(venue);
    setCurrentScreen('venue_detail');
    // log selection for analytics (non-blocking)
    try {
      logEventSafe('select_venue', { venueId: venue.id, venueName: venue.name });
    } catch (e) {
      // ignore
    }
  };

  // Open Venue Detail by ID
  const handleOpenDetailById = (venueId: string) => {
    const found = venues.find((v) => v.id === venueId);
    if (found) {
      handleOpenDetail(found);
    }
  };

  const favoriteVenues = venues.filter((v) => v.isFavorite);

  // Render Full Content or Test States
  const renderCurrentView = () => {
    // 1. Check Simulated Test States
    if (simulatedState === 'loading') {
      return <LoadingState message="Engelsiz Mekân verileri yükleniyor..." />;
    }
    if (simulatedState === 'empty') {
      return <EmptyState onAction={() => setSimulatedState('normal')} />;
    }
    if (simulatedState === 'error') {
      return <ErrorState onRetry={() => setSimulatedState('normal')} />;
    }
    if (simulatedState === 'no_internet') {
      return <NoInternetState onRetry={() => setSimulatedState('normal')} />;
    }

    // 2. Main Screen Router
    switch (currentScreen) {
      case 'splash':
        return <SplashView onStart={() => setCurrentScreen('onboarding')} />;

      case 'onboarding':
        return (
          <OnboardingView
            onComplete={() => setCurrentScreen('login')}
            onGuestAccess={() => setCurrentScreen('home')}
          />
        );

      case 'login':
        return (
          <LoginView
            onLoginSuccess={() => setCurrentScreen('home')}
            onGoRegister={() => setCurrentScreen('register')}
            onGoForgot={() => alert('Şifre sıfırlama e-postası gönderildi.')}
            onGuestContinue={() => setCurrentScreen('home')}
          />
        );

      case 'register':
        return (
          <RegisterView
            onRegisterSuccess={() => setCurrentScreen('home')}
            onGoLogin={() => setCurrentScreen('login')}
          />
        );

      case 'home':
        return (
          <HomeView
            venues={venues}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onNavigateTab={(tab) => setCurrentScreen(tab as Screen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            preferences={preferences}
            onOpenPreferences={() => setCurrentScreen('accessibility_preferences')}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            onOpenProfile={() => setCurrentScreen('profile')}
          />
        );

      case 'search':
      case 'explore':
        return (
          <ExploreView
            venues={venues}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onOpenMapView={() => setCurrentScreen('map')}
            filters={filters}
            onUpdateFilters={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );

      case 'map':
        return (
          <div className="pb-20 max-w-md mx-auto">
            <InteractiveMap
              venues={venues}
              friends={friends}
              selectedVenue={mapSelectedVenue}
              onSelectVenue={setMapSelectedVenue}
              onDetailClick={handleOpenDetail}
              onFilterClick={() => setIsFilterSheetOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        );

      case 'venue_detail':
        return selectedVenue ? (
          <VenueDetailView
            venue={selectedVenue}
            allVenues={venues}
            reviews={reviews.filter((r) => r.venueId === selectedVenue.id)}
            onBack={() => setCurrentScreen('home')}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onAddReview={handleAddReview}
          />
        ) : (
          <HomeView
            venues={venues}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onNavigateTab={(tab) => setCurrentScreen(tab as Screen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            preferences={preferences}
            onOpenPreferences={() => setCurrentScreen('accessibility_preferences')}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            onOpenProfile={() => setCurrentScreen('profile')}
          />
        );

      case 'add_venue':
        return (
          <AddVenueWizard
            onBack={() => setCurrentScreen('home')}
            onSubmitVenue={handleAddVenue}
          />
        );

      case 'community':
        return (
          <CommunityView
            posts={posts}
            friends={friends}
            onSelectVenueById={handleOpenDetailById}
            onOpenChat={() => setCurrentScreen('chat_list')}
            onOpenFriendMap={() => setCurrentScreen('map')}
            onAddPost={handleAddPost}
            onDeletePost={handleDeletePost}
            onEditPost={handleEditPost}
            onAddFriend={handleAddFriend}
            onDeleteFriend={handleDeleteFriend}
            onEditFriend={handleEditFriend}
          />
        );

      case 'chat_list':
      case 'chat_detail':
        return <ChatView onBack={() => setCurrentScreen('community')} />;

      case 'profile':
        return (
          <ProfileView
            venues={venues}
            favoriteVenues={favoriteVenues}
            myReviews={reviews}
            preferences={preferences}
            onOpenPreferences={() => setCurrentScreen('accessibility_preferences')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            onOpenGoogleForms={() => setCurrentScreen('google_forms')}
            onSelectVenue={handleOpenDetail}
            onLogout={() => setCurrentScreen('login')}
            onOpenOnboarding={() => setCurrentScreen('onboarding')}
          />
        );

      case 'accessibility_preferences':
        return (
          <AccessibilityPreferencesView
            preferences={preferences}
            onSavePreferences={setPreferences}
            onBack={() => setCurrentScreen('profile')}
          />
        );

      case 'settings':
        return <SettingsView onBack={() => setCurrentScreen('profile')} onOpenGoogleForms={() => setCurrentScreen('google_forms')} />;

      case 'notifications':
        return <NotificationsView onBack={() => setCurrentScreen('home')} />;

      case 'google_forms':
        return <GoogleFormsView onBack={() => setCurrentScreen('profile')} />;

      default:
        return (
          <HomeView
            venues={venues}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onNavigateTab={(tab) => setCurrentScreen(tab as Screen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            preferences={preferences}
            onOpenPreferences={() => setCurrentScreen('accessibility_preferences')}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            onOpenProfile={() => setCurrentScreen('profile')}
          />
        );
    }
  };

  const showBottomNav = ['home', 'explore', 'search', 'map', 'community', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-900 flex flex-col items-center justify-start antialiased py-0 sm:py-6">
      {/* Main Mobile Frame Container */}
      <div className="w-full max-w-md bg-[#FAFAFA] min-h-screen relative shadow-2xl flex flex-col overflow-x-hidden rounded-none sm:rounded-[32px]">
        {renderCurrentView()}

        {/* Global Bottom Navigation Bar */}
        {showBottomNav && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={(sc) => setCurrentScreen(sc)}
            onAddVenueClick={() => setCurrentScreen('add_venue')}
          />
        )}

        {/* Global Filters Bottom Sheet Drawer Modal */}
        <FiltersBottomSheet
          isOpen={isFilterSheetOpen}
          onClose={() => setIsFilterSheetOpen(false)}
          filters={filters}
          onApplyFilters={setFilters}
          onResetFilters={() =>
            setFilters({
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
      </div>
    </div>
  );
}
