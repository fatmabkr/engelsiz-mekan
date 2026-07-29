export type FeatureStatus = 'mevcut' | 'mevcut_degil' | 'bilgi_yok';

export type AccessibilityFeatureId = 
  | 'kaldirim' 
  | 'rampa' 
  | 'kapilar' 
  | 'koridorlar' 
  | 'merdiven' 
  | 'asansor' 
  | 'tek_kat' 
  | 'engelli_tuvaleti' 
  | 'bilgilendirme';

export interface AccessibilityFeatureConfig {
  id: AccessibilityFeatureId;
  label: string;
  iconName: string;
  description: string;
}

export type VenueCategory = 'kafe' | 'restoran' | 'muze' | 'avm' | 'park' | 'kultur_sanat' | 'kamu' | 'oteller' | 'saglik';

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  categoryLabel: string;
  address: string;
  district: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  accessibilityScore: number; // 0-100
  accessibilityLevel: 'high' | 'medium' | 'low';
  isVerified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  isFavorite: boolean;
  coverImage: string;
  images: string[];
  phone: string;
  openingHours: string;
  googleMapsUrl?: string;
  websiteUrl?: string;
  userReportCount?: number;
  coordinates: { lat: number; lng: number };
  features: Record<AccessibilityFeatureId, FeatureStatus>;
  featureNotes?: Partial<Record<AccessibilityFeatureId, string>>;
  description: string;
  tags: string[];
}

export interface Review {
  id: string;
  venueId: string;
  userName: string;
  userAvatar: string;
  userBadge: string;
  rating: number;
  accessibilityRating: number;
  date: string;
  content: string;
  photos?: string[];
  helpfulCount: number;
  isHelpful?: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: string;
  isVerifiedContributor?: boolean;
  date: string;
  content: string;
  venueId?: string;
  venueName?: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  locationName?: string;
  locationSharingEnabled?: boolean;
  accessibilityTags?: string[];
  statusBadge?: string;
  categoryTag?: 'tumu' | 'yeni' | 'dogrulanan' | 'sorular' | 'yardim' | 'etkinlikler';
  commentPreview?: {
    userName: string;
    text: string;
    time: string;
    userAvatar?: string;
  };
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatConversation {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  partnerRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  onlineStatus: boolean;
  venueTopic?: string;
}

export interface AccessibilityPreferences {
  rampaRequired: boolean;
  asansorRequired: boolean;
  engelliTuvaletiRequired: boolean;
  merdivensizRequired: boolean;
  genisKapilarRequired: boolean;
  tekKatRequired: boolean;
  minimumScore: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  locationName: string;
  distance: string;
  lat: number;
  lng: number;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  accessibilityFilter: string; // 'all' | 'high' | 'rampa' | 'engelli_tuvaleti' | 'asansor'
  minScore: number;
  maxDistanceKm: number;
  onlyVerified: boolean;
  onlyFavorites: boolean;
  sortBy: 'distance' | 'score' | 'rating' | 'newest';
  viewMode: 'list' | 'grid';
}

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'login' 
  | 'register' 
  | 'forgot_password' 
  | 'home' 
  | 'explore' 
  | 'search'
  | 'map' 
  | 'venue_detail' 
  | 'add_venue' 
  | 'community' 
  | 'chat_list' 
  | 'chat_detail' 
  | 'profile' 
  | 'accessibility_preferences' 
  | 'settings' 
  | 'notifications' 
  | 'favorites'
  | 'google_forms';

export type AppSimulatedState = 'normal' | 'loading' | 'empty' | 'error' | 'no_internet';
