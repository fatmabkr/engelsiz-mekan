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
import { SearchView } from './views/SearchView';
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
  dbSavePost,
  dbRegisterUser,
  dbLoginUser,
  dbLogoutUser,
  dbResetPassword,
  subscribeToAuth,
  formatFirebaseAuthError,
  UserProfile
} from './lib/firebaseSync';
import { 
  SplashView, 
  OnboardingView, 
  LoginView, 
  RegisterView, 
  ForgotPasswordView,
  SettingsView, 
  NotificationsView 
} from './views/AuthAndInfoViews';

export default function App() {
  // Navigation State - Defaults to 'landing' so app opens on landing introduction page
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mapSelectedVenue, setMapSelectedVenue] = useState<Venue | null>(null);
  const [isFirstTimeSurveyOpen, setIsFirstTimeSurveyOpen] = useState(false);

  // Global Toast Notification State (Success / Error / Info)
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  }, []);

  // ── Back Button Navigation History ──
  const screenHistoryRef = useRef<Screen[]>(['home']);
  const isPopstateNavRef = useRef(false);
  const lastBackPressTimeRef = useRef<number>(0);

  // Safe navigate function — pushes screen to internal history stack
  const navigateTo = useCallback((screen: Screen) => {
    if (!isPopstateNavRef.current) {
      const history = screenHistoryRef.current;
      // Don't push duplicate if already on the same screen
      if (history[history.length - 1] !== screen) {
        history.push(screen);
        try {
          window.history.pushState({ screen }, '', '');
        } catch (_) { /* ignore */ }
      }
    }
    isPopstateNavRef.current = false;
    setCurrentScreen(screen);
  }, []);

  // Handle back navigation logic (shared for browser popstate and Capacitor native back button)
  const handleGoBack = useCallback(() => {
    const history = screenHistoryRef.current;
    
    // Filter out any auth/landing screens from history
    while (history.length > 0 && ['landing', 'login', 'register', 'onboarding', 'splash'].includes(history[history.length - 1])) {
      history.pop();
    }

    if (history.length > 1) {
      // Pop current screen and navigate to previous screen in history
      history.pop();
      let previousScreen = history[history.length - 1];
      if (['landing', 'login', 'register', 'onboarding', 'splash'].includes(previousScreen)) {
        previousScreen = 'home';
        screenHistoryRef.current = ['home'];
      }
      isPopstateNavRef.current = true;
      setCurrentScreen(previousScreen);
      try {
        window.history.pushState({ screen: previousScreen }, '', '');
      } catch (_) { /* ignore */ }
    } else {
      // On root screen (Home) — Double-tap back button to exit app
      const now = Date.now();
      if (now - lastBackPressTimeRef.current < 2000) {
        // Second press within 2 seconds: exit app natively
        import('@capacitor/app').then(({ App: CapApp }) => {
          CapApp.exitApp();
        }).catch(() => {});
      } else {
        // First press: store timestamp & push state to prevent browser exit
        lastBackPressTimeRef.current = now;
        try {
          window.history.pushState({ screen: 'home' }, '', '');
        } catch (_) { /* ignore */ }
      }
    }
  }, []);

  // Listen for hardware/browser back button (popstate + Capacitor native back button)
  useEffect(() => {
    try {
      window.history.pushState({ screen: 'home' }, '', '');
    } catch (_) { /* ignore */ }

    const handlePopState = () => {
      handleGoBack();
    };

    window.addEventListener('popstate', handlePopState);

    // Native Android Hardware Back Button Handler via Capacitor
    let backButtonListener: { remove: () => void } | null = null;
    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.addListener('backButton', () => {
        handleGoBack();
      }).then(l => { backButtonListener = l; }).catch(() => {});
    }).catch(() => {});

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [handleGoBack]);

  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [activeSurveyFormType, setActiveSurveyFormType] = useState<'form1' | 'form2'>('form1');
  const [visitedVenuesCount, setVisitedVenuesCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('visited_venues_count') || '0', 10);
  });

  // Track venue visits and check 1 week elapsed survey popup
  useEffect(() => {
    const installDate = localStorage.getItem('app_first_install_date');
    if (!installDate) {
      localStorage.setItem('app_first_install_date', Date.now().toString());
    } else {
      const elapsedDays = (Date.now() - parseInt(installDate, 10)) / (1000 * 60 * 60 * 24);
      const hasCompletedForm2 = localStorage.getItem('hasCompletedForm2Survey') === 'true';
      if (elapsedDays >= 7 && !hasCompletedForm2) {
        setActiveSurveyFormType('form2');
        setIsSurveyModalOpen(true);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    // Reset history stack to 'home' so back button stops at home and doesn't go back to auth/landing screens
    screenHistoryRef.current = ['home'];
    navigateTo('home');
    
    // Show Form 1 (Ön Değerlendirme Formu) on initial login if not completed yet
    const hasCompletedForm1 = localStorage.getItem('hasCompletedForm1Survey') === 'true';
    if (!hasCompletedForm1) {
      setActiveSurveyFormType('form1');
      setIsSurveyModalOpen(true);
    }
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

  // Active User Profile State (Firebase Auth & Firestore Users collection)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // User profile photo (stored locally per user)
  const [userPhotoURL, setUserPhotoURL] = useState<string>('');
  
  React.useEffect(() => {
    if (currentUser?.uid) {
      const saved = localStorage.getItem(`yol_acik_photo_${currentUser.uid}`);
      if (saved) setUserPhotoURL(saved);
      else setUserPhotoURL('');
    }
  }, [currentUser?.uid]);

  const handlePhotoUpload = (photoDataURL: string) => {
    setUserPhotoURL(photoDataURL);
    if (currentUser?.uid) {
      localStorage.setItem(`yol_acik_photo_${currentUser.uid}`, photoDataURL);
    }
  };

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
    const unsubAuth = subscribeToAuth((userProfile) => {
      setCurrentUser(userProfile);
    });

    return () => {
      unsubVenues();
      unsubPending();
      unsubReviews();
      unsubPosts();
      unsubAuth();
    };
  }, []);

  // Firebase Auth Handlers
  const handleRegisterUser = async (fullName: string, email: string, pass: string) => {
    try {
      const profile = await dbRegisterUser(fullName, email, pass);
      setCurrentUser(profile);
      showToast(`✓ Kayıt başarılı! Hoş geldiniz, ${profile.displayName}`, 'success');
      navigateTo('home');
    } catch (err: any) {
      const readableError = formatFirebaseAuthError(err);
      showToast(`❌ Kayıt Hatası: ${readableError}`, 'error');
      throw new Error(readableError);
    }
  };

  const handleLoginUser = async (email?: string, pass?: string) => {
    if (!email || !pass) {
      // Guest Login
      navigateTo('home');
      return;
    }
    try {
      const profile = await dbLoginUser(email, pass);
      setCurrentUser(profile);
      showToast(`✓ Giriş yapıldı! Hoş geldiniz, ${profile.displayName}`, 'success');
      navigateTo('home');
    } catch (err: any) {
      const readableError = formatFirebaseAuthError(err);
      showToast(`❌ Giriş Hatası: ${readableError}`, 'error');
      throw new Error(readableError);
    }
  };

  const handleLogoutUser = async () => {
    try {
      await dbLogoutUser();
      setCurrentUser(null);
      showToast('Oturum kapatıldı.', 'info');
      navigateTo('login');
    } catch (err: any) {
      console.error('Logout Error:', err);
      navigateTo('login');
    }
  };

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
  const handleAddReview = async (newReview: Partial<Review>) => {
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
    setReviews((prev) => [rev, ...prev]);

    try {
      await dbSaveReview(rev);
      showToast('✓ Yorumunuz başarıyla Firestore reviews koleksiyonuna kaydedildi!', 'success');
    } catch (err: any) {
      console.error('Firestore yorum kayıt hatası:', err);
      showToast(`❌ Firestore Hatası: Yorum kaydedilemedi. (${err?.message || 'İzin reddedildi veya bağlantı hatası'})`, 'error');
    }
  };

  // Add Venue Handler - Requires Developer/Admin Approval
  const handleAddVenue = async (newVenue: Partial<Venue>) => {
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

    try {
      await dbSavePendingVenue(created);
      showToast('✓ Mekân başvurunuz alındı ve Firestore pending_venues koleksiyonuna kaydedildi!', 'success');
    } catch (err: any) {
      console.error('Firestore mekan kayıt hatası:', err);
      showToast(`❌ Firestore Hatası: Mekân kaydedilemedi. (${err?.message || 'İzin reddedildi veya yetki eksikliği'})`, 'error');
    }
  };

  // Developer Approve Venue Handler
  const handleApproveVenue = async (venueId: string) => {
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

    try {
      await dbApproveVenue(approved);
      showToast('✓ Mekân onaylandı ve Firestore "venues" (yayında) koleksiyonuna taşındı!', 'success');
    } catch (err: any) {
      console.error('Firestore mekan onaylama hatası:', err);
      showToast(`❌ Firestore Hatası: Mekân onaylanamadı. (${err?.message || 'Yetki hatası'})`, 'error');
    }
  };

  // Developer Reject Venue Handler
  const handleRejectVenue = async (venueId: string, reason?: string) => {
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

    try {
      await dbRejectVenue(venueId);
      showToast('✓ Mekân başvurusu reddedildi ve pending_venues koleksiyonundan kaldırıldı.', 'success');
    } catch (err: any) {
      console.error('Firestore mekan reddetme hatası:', err);
      showToast(`❌ Firestore Hatası: Mekân reddedilemedi. (${err?.message || 'Yetki hatası'})`, 'error');
    }
  };

  // Add Post Handler
  const handleAddPost = async (newPost: Partial<CommunityPost>) => {
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
    setPosts((prev) => [post, ...prev]);

    try {
      await dbSavePost(post);
      showToast('✓ Gönderiniz başarıyla Firestore community_posts koleksiyonuna kaydedildi!', 'success');
    } catch (err: any) {
      console.error('Firestore gönderi kayıt hatası:', err);
      showToast(`❌ Firestore Hatası: Gönderi kaydedilemedi. (${err?.message || 'İzin hatası'})`, 'error');
    }
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

  // Track recent visited/opened venues
  const [recentlyVisitedVenues, setRecentlyVisitedVenues] = useState<Venue[]>(() => {
    try {
      const saved = localStorage.getItem('yol_acik_recently_visited_venues');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Open Venue Detail & Track Venue Visit Count for Form 2 Trigger
  const handleOpenDetail = (venue: Venue) => {
    setSelectedVenue(venue);
    navigateTo('venue_detail');

    // Add to recently visited venues list (unique by ID, max 6 items)
    setRecentlyVisitedVenues((prev) => {
      const updated = [venue, ...prev.filter((v) => v.id !== venue.id)].slice(0, 6);
      localStorage.setItem('yol_acik_recently_visited_venues', JSON.stringify(updated));
      return updated;
    });

    // Increment venue visit counter
    const nextCount = visitedVenuesCount + 1;
    setVisitedVenuesCount(nextCount);
    localStorage.setItem('visited_venues_count', nextCount.toString());

    // Trigger Form 2 (Son Değerlendirme Formu) after 5 venue visits if not completed yet
    const hasCompletedForm2 = localStorage.getItem('hasCompletedForm2Survey') === 'true';
    if (nextCount >= 5 && !hasCompletedForm2) {
      setActiveSurveyFormType('form2');
      setIsSurveyModalOpen(true);
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

    // Admin check
    const adminEmails = ['fatmabakir895@gmail.com', 'stempower26@gmail.com'];
    const isAdminUser = currentUser?.email ? adminEmails.includes(currentUser.email.toLowerCase()) : false;

    // Derived user display name and photo
    const displayName = currentUser?.displayName || 'Kullanıcı';
    const displayPhoto = userPhotoURL || currentUser?.userAvatar || '';

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
            onGuestAccess={() => handleLoginUser()}
          />
        );

      case 'login':
        return (
          <LoginView
            onLoginSuccess={handleLoginUser}
            onGoRegister={() => navigateTo('register')}
            onGoForgot={() => navigateTo('forgot_password')}
            onGuestContinue={() => handleLoginUser()}
            onGoLanding={() => navigateTo('landing')}
          />
        );

      case 'register':
        return (
          <RegisterView
            onRegisterSuccess={handleRegisterUser}
            onGoLogin={() => navigateTo('login')}
            onGoLanding={() => navigateTo('landing')}
          />
        );

      case 'forgot_password':
        return (
          <ForgotPasswordView
            onResetSuccess={async (email) => {
              try {
                await dbResetPassword(email);
                showToast('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.', 'success');
              } catch (err: any) {
                const formatted = formatFirebaseAuthError(err);
                showToast(formatted, 'error');
                throw new Error(formatted);
              }
            }}
            onGoLogin={() => navigateTo('login')}
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
            userName={displayName}
            userPhotoURL={displayPhoto}
          />
        );

      case 'search':
        return (
          <SearchView
            venues={venues}
            recentlyVisitedVenues={recentlyVisitedVenues}
            onClearRecentVenues={() => {
              setRecentlyVisitedVenues([]);
              localStorage.removeItem('yol_acik_recently_visited_venues');
            }}
            onSelectVenue={handleOpenDetail}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilterSheet={() => setIsFilterSheetOpen(true)}
            filters={filters}
            onUpdateFilters={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );

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
            userName={displayName}
            userPhotoURL={displayPhoto}
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
            userName={displayName}
            userAvatar={displayPhoto}
            userBadge={currentUser?.userBadge}
            pendingCount={pendingVenues.length}
            isAdmin={isAdminUser}
            onOpenPreferences={() => navigateTo('accessibility_preferences')}
            onOpenSettings={() => navigateTo('settings')}
            onOpenNotifications={() => navigateTo('notifications')}
            onOpenGoogleForms={() => navigateTo('google_forms')}
            onSelectVenue={handleOpenDetail}
            onLogout={handleLogoutUser}
            onOpenOnboarding={() => navigateTo('onboarding')}
            onOpenFirstTimeSurvey={() => setIsFirstTimeSurveyOpen(true)}
            onOpenAdminApproval={() => setIsAdminApprovalOpen(true)}
            onOpenLanding={() => navigateTo('landing')}
            onPhotoUpload={handlePhotoUpload}
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
        return <SettingsView onBack={() => navigateTo('profile')} onOpenGoogleForms={() => navigateTo('google_forms')} isAdmin={isAdminUser} />;

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
            userName={displayName}
            userPhotoURL={displayPhoto}
          />
        );
    }
  };

  const showBottomNav = ['home', 'explore', 'search', 'map', 'community', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 sm:bg-[#0B1329] font-sans text-slate-900 flex flex-col items-center justify-center p-0 sm:p-4 antialiased selection:bg-teal-500 selection:text-white">
      {/* Main Responsive Container: Full screen on mobile devices, sleek mobile frame mockup on desktop/tablets */}
      <div className="w-full sm:max-w-[430px] h-screen sm:h-[880px] sm:max-h-[94vh] bg-[#FAFAFA] relative shadow-2xl flex flex-col overflow-hidden rounded-none sm:rounded-[36px] border-0 sm:border-[6px] sm:border-slate-800">
        
        {/* Global Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] p-3.5 rounded-2xl shadow-xl border text-xs font-bold transition-all duration-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/40 shadow-emerald-950/30'
                : toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-600/60 shadow-rose-950/40'
                : 'bg-slate-900 text-teal-300 border-teal-500/40 shadow-slate-950/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm shrink-0">
                {toastMessage.type === 'success' ? '✅' : toastMessage.type === 'error' ? '⚠️' : 'ℹ️'}
              </span>
              <p className="leading-snug text-[11px] font-semibold">{toastMessage.text}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white shrink-0 cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable View Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full relative pt-safe">
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

        {/* Global Google Form Evaluation Modal (Form 1: İlk Giriş Ön Değerlendirme / Form 2: 1 Hafta veya 5 Mekân Sonrası) */}
        <GoogleFormOnboardingModal
          isOpen={isSurveyModalOpen && currentScreen !== 'landing'}
          formType={activeSurveyFormType}
          onClose={() => setIsSurveyModalOpen(false)}
          onComplete={(answers) => {
            console.log('Google Form survey answers submitted:', activeSurveyFormType, answers);
            if (activeSurveyFormType === 'form1') {
              localStorage.setItem('hasCompletedForm1Survey', 'true');
            } else {
              localStorage.setItem('hasCompletedForm2Survey', 'true');
            }
            setIsSurveyModalOpen(false);
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
