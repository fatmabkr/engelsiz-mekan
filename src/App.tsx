import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { GoogleFormOnboardingModal } from './components/GoogleFormOnboardingModal';
import { AccessibilityPreferencesView } from './views/AccessibilityPreferencesView';
import { AdminApprovalModal } from './views/AdminApprovalModal';
import { LandingView } from './views/LandingView';
import { 
  subscribeToVenues, 
  subscribeToPendingVenues, 
  subscribeToReviews, 
  subscribeToPosts, 
  dbSavePendingVenue, 
  dbApproveVenue, 
  dbRejectVenue, 
  dbSaveReview, 
  dbSavePost 
} from './lib/firebaseSync';
import { 
  SplashView, 
  OnboardingView, 
  LoginView, 
  RegisterView, 
  SettingsView, 
  NotificationsView 
} from './views/AuthAndInfoViews';

export default function App() {
  // Navigation State - Defaults to 'landing' so app opens on landing introduction page
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mapSelectedVenue, setMapSelectedVenue] = useState<Venue | null>(null);
  const [isFirstTimeSurveyOpen, setIsFirstTimeSurveyOpen] = useState(true);

  // ── Back Button Navigation History ──
  const screenHistoryRef = useRef<Screen[]>(['landing']);
  const isPopstateNavRef = useRef(false);

  // Safe navigate function — pushes browser history so back button works
  const navigateTo = useCallback((screen: Screen) => {
    if (!isPopstateNavRef.current) {
      screenHistoryRef.current.push(screen);
      try {
        window.history.pushState({ screen }, '', '');
      } catch (_) { /* ignore */ }
    }
    isPopstateNavRef.current = false;
    setCurrentScreen(screen);
  }, []);

  // Listen for hardware/browser back button (popstate)
  useEffect(() => {
    // Push an initial history entry so we have something to pop
    try {
      window.history.pushState({ screen: 'landing' }, '', '');
    } catch (_) { /* ignore */ }

    const handlePopState = (e: PopStateEvent) => {
      const history = screenHistoryRef.current;

      // Remove the current screen from history
      if (history.length > 1) {
        history.pop();
        const previousScreen = history[history.length - 1];
        isPopstateNavRef.current = true;
        setCurrentScreen(previousScreen);
        // Re-push so there's always a history entry to pop next time
        try {
          window.history.pushState({ screen: previousScreen }, '', '');
        } catch (_) { /* ignore */ }
      } else {
        // Already on root screen — prevent app from exiting
        // Push a dummy entry back so back button doesn't close the app
        try {
          window.history.pushState({ screen: history[0] || 'home' }, '', '');
        } catch (_) { /* ignore */ }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = () => {
    navigateTo('home');
    setIsFirstTimeSurveyOpen(true);
  };

  // App Data State
  const [venues, setVenues] = useState<Venue[]>(() => 
    MOCK_VENUES.filter((v) => !v.name.toLowerCase().includes('gibi'))
  );
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(INITIAL_PREFERENCES);

  // Developer / Admin Approval State for venue submission approval workflow
  const [pendingVenues, setPendingVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem('yol_acik_pending_venues');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Initial sample pending venue for testing developer approval
    return [
      {
        id: 'venue-pending-sample-1',
        name: 'Simit Sarayı Adalar Şubesi',
        category: 'kafe',
        categoryLabel: 'Kafe',
        address: 'İsmet İnönü-1 Cad. Adalar Mevkii No:44, Tepebaşı / Eskişehir',
        district: 'Tepebaşı',
        city: 'Eskişehir',
        distanceKm: 0.4,
        rating: 4.8,
        reviewCount: 1,
        accessibilityScore: 88,
        accessibilityLevel: 'high',
        isVerified: false,
        isFavorite: false,
        coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'],
        phone: '0222 221 44 55',
        openingHours: '08:00 - 23:00',
        coordinates: { lat: 39.7765, lng: 30.5145 },
        googleMapsUrl: 'https://maps.google.com/?q=Simit+Sarayı+Adalar+Eskişehir',
        features: {
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
        description: 'Tekerlekli sandalye ile giriş rampası ve geniş masalar mevcut. Tuvalet zemin katta.',
        tags: ['Kullanıcı Katkısı', 'Harita Doğrulanmış'],
        approvalStatus: 'pending',
        isApproved: false,
        submittedAt: '30 Temmuz 2026',
        submittedBy: 'Ayşe Yılmaz'
      }
    ];
  });
  const [approvedVenues, setApprovedVenues] = useState<Venue[]>([]);
  const [rejectedVenues, setRejectedVenues] = useState<Venue[]>([]);
  const [isAdminApprovalOpen, setIsAdminApprovalOpen] = useState<boolean>(false);

  React.useEffect(() => {
    // Subscribe to Firestore collections
    const unsubVenues = subscribeToVenues((remoteVenues) => {
      setVenues(remoteVenues);
    });
    const unsubPending = subscribeToPendingVenues((remotePending) => {
      setPendingVenues(remotePending);
    });
    const unsubReviews = subscribeToReviews((remoteReviews) => {
      setReviews(remoteReviews);
    });
    const unsubPosts = subscribeToPosts((remotePosts) => {
      setPosts(remotePosts);
    });

    return () => {
      unsubVenues();
      unsubPending();
      unsubReviews();
      unsubPosts();
    };
  }, []);

  React.useEffect(() => {
    localStorage.setItem('yol_acik_pending_venues', JSON.stringify(pendingVenues));
  }, [pendingVenues]);

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
    dbSaveReview(rev).catch(console.error);
  };

  // Add Venue Handler - Requires Developer/Admin Approval
  const handleAddVenue = (newVenue: Partial<Venue>) => {
    const created: Venue = {
      id: `venue-${Date.now()}`,
      name: newVenue.name || 'Yeni Mekân',
      category: newVenue.category || 'kafe',
      categoryLabel: newVenue.categoryLabel || 'Kafe',
      address: newVenue.address || 'Eskişehir',
      district: newVenue.district || 'Tepebaşı',
      city: 'Eskişehir',
      distanceKm: newVenue.distanceKm || 0.6,
      rating: 5.0,
      reviewCount: 1,
      accessibilityScore: newVenue.accessibilityScore || 85,
      accessibilityLevel: (newVenue.accessibilityScore || 85) >= 80 ? 'high' : 'medium',
      isVerified: false,
      isFavorite: false,
      coverImage: newVenue.coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      images: newVenue.images || [],
      phone: newVenue.phone || '0222 000 00 00',
      openingHours: '09:00 - 22:00',
      coordinates: newVenue.coordinates || { lat: 39.778, lng: 30.512 },
      googleMapsUrl: newVenue.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent((newVenue.name || 'Mekan') + ' Eskişehir')}`,
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
      description: newVenue.description || 'Kullanıcı tarafından eklenen yeni erişilebilir mekan.',
      tags: ['Kullanıcı Katkısı', 'Harita Doğrulanmış'],
      approvalStatus: 'pending',
      isApproved: false,
      submittedAt: '30 Temmuz 2026',
      submittedBy: 'Mevcut Kullanıcı'
    };

    // Add to pending approval queue (persisted to Firestore & local state)
    setPendingVenues((prev) => [created, ...prev]);
    dbSavePendingVenue(created).catch(console.error);
  };

  // Developer Approve Venue Handler
  const handleApproveVenue = (venueId: string) => {
    const target = pendingVenues.find((v) => v.id === venueId);
    if (!target) return;

    const approved: Venue = {
      ...target,
      approvalStatus: 'approved',
      isApproved: true,
      isVerified: true,
      verifiedBy: 'Geliştirici (Admin)',
    };

    setPendingVenues((prev) => prev.filter((v) => v.id !== venueId));
    setApprovedVenues((prev) => [approved, ...prev]);
    setVenues((prev) => [approved, ...prev]);
    dbApproveVenue(approved).catch(console.error);
  };

  // Developer Reject Venue Handler
  const handleRejectVenue = (venueId: string, reason?: string) => {
    const target = pendingVenues.find((v) => v.id === venueId);
    if (!target) return;

    const rejected: Venue = {
      ...target,
      approvalStatus: 'rejected',
      isApproved: false,
      rejectionReason: reason || 'Geliştirici tarafından reddedildi.',
    };

    setPendingVenues((prev) => prev.filter((v) => v.id !== venueId));
    setRejectedVenues((prev) => [rejected, ...prev]);
    dbRejectVenue(venueId).catch(console.error);
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
    dbSavePost(post).catch(console.error);
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
    navigateTo('venue_detail');
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
      case 'landing':
        return (
          <LandingView 
            onStartApp={(targetScreen = 'home') => navigateTo(targetScreen)}
            featuredVenues={venues}
          />
        );

      case 'splash':
        return <SplashView onStart={() => navigateTo('onboarding')} />;

      case 'onboarding':
        return (
          <OnboardingView
            onComplete={() => navigateTo('login')}
            onGuestAccess={handleLoginSuccess}
          />
        );

      case 'login':
        return (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onGoRegister={() => navigateTo('register')}
            onGoForgot={() => alert('Şifre sıfırlama e-postası gönderildi.')}
            onGuestContinue={handleLoginSuccess}
            onGoLanding={() => navigateTo('landing')}
          />
        );

      case 'register':
        return (
          <RegisterView
            onRegisterSuccess={handleLoginSuccess}
            onGoLogin={() => navigateTo('login')}
            onGoLanding={() => navigateTo('landing')}
          />
        );

      case 'home':
        return (
          <HomeView
            venues={venues}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onNavigateTab={(tab) => navigateTo(tab as Screen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            preferences={preferences}
            onOpenPreferences={() => navigateTo('accessibility_preferences')}
            onOpenNotifications={() => navigateTo('notifications')}
            onOpenProfile={() => navigateTo('profile')}
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
            onOpenMapView={() => navigateTo('map')}
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
            onBack={() => navigateTo('home')}
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
            onNavigateTab={(tab) => navigateTo(tab as Screen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            preferences={preferences}
            onOpenPreferences={() => navigateTo('accessibility_preferences')}
            onOpenNotifications={() => navigateTo('notifications')}
            onOpenProfile={() => navigateTo('profile')}
          />
        );

      case 'add_venue':
        return (
          <AddVenueWizard
            onBack={() => navigateTo('home')}
            onSubmitVenue={handleAddVenue}
          />
        );

      case 'community':
        return (
          <CommunityView
            posts={posts}
            friends={friends}
            onSelectVenueById={handleOpenDetailById}
            onOpenChat={() => navigateTo('chat_list')}
            onOpenFriendMap={() => navigateTo('map')}
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
        return <ChatView onBack={() => navigateTo('community')} />;

      case 'profile':
        return (
          <ProfileView
            venues={venues}
            favoriteVenues={favoriteVenues}
            myReviews={reviews}
            preferences={preferences}
            pendingCount={pendingVenues.length}
            onOpenPreferences={() => navigateTo('accessibility_preferences')}
            onOpenSettings={() => navigateTo('settings')}
            onOpenNotifications={() => navigateTo('notifications')}
            onOpenGoogleForms={() => navigateTo('google_forms')}
            onSelectVenue={handleOpenDetail}
            onLogout={() => navigateTo('login')}
            onOpenOnboarding={() => navigateTo('onboarding')}
            onOpenFirstTimeSurvey={() => setIsFirstTimeSurveyOpen(true)}
            onOpenAdminApproval={() => setIsAdminApprovalOpen(true)}
            onOpenLanding={() => navigateTo('landing')}
          />
        );

      case 'accessibility_preferences':
        return (
          <AccessibilityPreferencesView
            preferences={preferences}
            onSavePreferences={setPreferences}
            onBack={() => navigateTo('profile')}
          />
        );

      case 'settings':
        return <SettingsView onBack={() => navigateTo('profile')} onOpenGoogleForms={() => navigateTo('google_forms')} />;

      case 'notifications':
        return <NotificationsView onBack={() => navigateTo('home')} />;

      case 'google_forms':
        return <GoogleFormsView onBack={() => navigateTo('profile')} />;

      default:
        return (
          <HomeView
            venues={venues}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            onNavigateTab={(tab) => navigateTo(tab as Screen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            preferences={preferences}
            onOpenPreferences={() => navigateTo('accessibility_preferences')}
            onOpenNotifications={() => navigateTo('notifications')}
            onOpenProfile={() => navigateTo('profile')}
          />
        );
    }
  };

  const showBottomNav = ['home', 'explore', 'search', 'map', 'community', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 sm:bg-[#0B1329] font-sans text-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 antialiased selection:bg-teal-500 selection:text-white">
      {/* Main Responsive Container: Full screen on mobile devices, sleek mobile frame mockup on desktop/tablets */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[880px] sm:max-h-[94vh] bg-[#FAFAFA] relative shadow-2xl flex flex-col overflow-hidden rounded-none sm:rounded-[36px] border-0 sm:border-[6px] sm:border-slate-800">
        
        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full relative">
          {renderCurrentView()}
        </div>

        {/* Global Bottom Navigation Bar */}
        {showBottomNav && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={(sc) => navigateTo(sc)}
            onAddVenueClick={() => navigateTo('add_venue')}
          />
        )}

        {/* Global Developer/Admin Approval Modal */}
        <AdminApprovalModal
          isOpen={isAdminApprovalOpen}
          onClose={() => setIsAdminApprovalOpen(false)}
          pendingVenues={pendingVenues}
          approvedVenues={approvedVenues}
          rejectedVenues={rejectedVenues}
          onApproveVenue={handleApproveVenue}
          onRejectVenue={handleRejectVenue}
        />

        {/* Global Google Form Onboarding Modal for First Time Users (Shown after leaving landing page) */}
        <GoogleFormOnboardingModal
          isOpen={isFirstTimeSurveyOpen && currentScreen !== 'landing'}
          onClose={() => setIsFirstTimeSurveyOpen(false)}
          onComplete={(answers) => {
            console.log('Google Form onboarding answers submitted:', answers);
          }}
        />

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
