import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Building2, 
  Settings, 
  Bell, 
  Sliders, 
  LogOut, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { Venue, Review, AccessibilityPreferences } from '../types';
import { ProfileStatCard } from '../components/UIElements';
import { CompactVenueCard } from '../components/VenueCards';
import { ReviewCard } from '../components/NavigationAndStateComponents';

interface ProfileViewProps {
  venues: Venue[];
  favoriteVenues: Venue[];
  myReviews: Review[];
  preferences: AccessibilityPreferences;
  userName?: string;
  userAvatar?: string;
  userBadge?: string;
  pendingCount?: number;
  onOpenPreferences: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenGoogleForms?: () => void;
  onSelectVenue: (v: Venue) => void;
  onLogout: () => void;
  onOpenOnboarding?: () => void;
  onOpenFirstTimeSurvey?: () => void;
  onOpenAdminApproval?: () => void;
  onOpenLanding?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  venues,
  favoriteVenues,
  myReviews,
  preferences,
  userName = 'Kullanıcı',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  userBadge = 'Topluluk Üyesi',
  pendingCount = 0,
  onOpenPreferences,
  onOpenSettings,
  onOpenNotifications,
  onOpenGoogleForms,
  onSelectVenue,
  onLogout,
  onOpenOnboarding,
  onOpenFirstTimeSurvey,
  onOpenAdminApproval,
  onOpenLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'reviews' | 'my_venues'>('favorites');

  const mySubmittedVenues = venues.filter((v) => v.tags?.includes('Kullanıcı Katkısı'));
  const venuesCount = mySubmittedVenues.length;
  const reviewsCount = myReviews.length;
  const points = (venuesCount * 50) + (reviewsCount * 25);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 max-w-md mx-auto space-y-4">
      {/* Top Banner & Avatar Header */}
      <div className="bg-white border-b border-gray-100 p-5 shadow-xs flex flex-col items-center text-center relative">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 cursor-pointer"
            aria-label="Bildirimler"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 cursor-pointer"
            aria-label="Ayarlar"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User Image */}
        <div className="relative mt-2">
          <img
            src={userAvatar}
            alt={userName}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#0F172A]/20 shadow-soft"
          />
          <span className="absolute bottom-0 right-0 p-1 bg-[#0F172A] text-white rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
          </span>
        </div>

        <h2 className="text-xl font-black text-gray-900 mt-3 capitalize">{userName}</h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#0F172A] rounded-full text-xs font-black mt-1 border border-slate-200">
          <Award className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>{userBadge}</span>
        </div>

        <p className="text-xs text-gray-500 mt-2 max-w-xs">
          Eskişehir sokaklarında engelsiz mekânları keşfedip toplulukla paylaşıyor.
        </p>
      </div>

      {/* Katkıların (Stats Gradient Card matching Theme) */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#0F766E] to-[#059669] p-5 rounded-[18px] text-white shadow-soft">
          <h3 className="font-extrabold text-base">Katkıların</h3>
          <p className="text-xs text-teal-100 opacity-90 mt-1">
            {points > 0
              ? `Engelsiz topluluğumuza ${points} puan kazandırdınız!`
              : 'Engelsiz topluluğumuza katıldığınız için teşekkürler! Mekân ekleyerek ilk puanlarınızı kazanabilirsiniz.'}
          </p>
          <div className="flex justify-between items-end mt-4">
            <span className="text-3xl font-black">{points}</span>
            <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl font-bold">
              Topluluk Puanı
            </span>
          </div>
        </div>
      </div>

      {/* Contribution Stats Grid */}
      <div className="px-4 grid grid-cols-3 gap-2">
        <ProfileStatCard
          icon={<Building2 className="w-5 h-5" />}
          value={venuesCount}
          label="Mekân Ekledi"
          color="bg-slate-100 text-[#0F172A]"
        />
        <ProfileStatCard
          icon={<MessageSquare className="w-5 h-5" />}
          value={reviewsCount}
          label="Yorum Yazdı"
          color="bg-teal-50 text-[#0D9488]"
        />
        <ProfileStatCard
          icon={<Sparkles className="w-5 h-5" />}
          value={points}
          label="Topluluk Puanı"
          color="bg-emerald-50 text-emerald-700"
        />
      </div>

      {/* Accessibility Preferences Quick Card */}
      <div className="px-4 space-y-2">
        <div
          onClick={onOpenPreferences}
          className="p-4 bg-gradient-to-r from-[#0F172A] via-[#0F766E] to-[#059669] text-white rounded-[22px] shadow-soft flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl text-[#0D9488]">
              <Sliders className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Erişilebilirlik Tercihlerim</h3>
              <p className="text-[11px] text-teal-100 mt-0.5">
                {preferences.rampaRequired && 'Rampa • '}
                {preferences.engelliTuvaletiRequired && 'Engelli Tuvaleti • '}
                {preferences.asansorRequired && 'Asansör '}
                zorunlu filtrenizde.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-teal-200" />
        </div>
      </div>

      {/* Sub-Tabs: Favorites / Reviews / My Venues */}
      <div className="px-4">
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl px-1">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 text-[11px] font-extrabold text-center border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-[#009688] text-[#009688]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Favorilerim ({favoriteVenues.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-[11px] font-extrabold text-center border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#009688] text-[#009688]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Yorumlarım ({myReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('my_venues')}
            className={`flex-1 py-3 text-[11px] font-extrabold text-center border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'my_venues'
                ? 'border-[#009688] text-[#009688]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Eklediklerim ({mySubmittedVenues.length})
          </button>
        </div>

        <div className="p-4 bg-white rounded-b-2xl border-x border-b border-gray-200 space-y-3">
          {activeTab === 'favorites' && (
            <div className="space-y-2">
              {favoriteVenues.length > 0 ? (
                favoriteVenues.map((v) => (
                  <CompactVenueCard key={v.id} venue={v} onClick={() => onSelectVenue(v)} />
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Henüz favori mekan eklemediniz.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {myReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          )}

          {activeTab === 'my_venues' && (
            <div className="space-y-2">
              {mySubmittedVenues.map((v) => (
                <CompactVenueCard key={v.id} venue={v} onClick={() => onSelectVenue(v)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Onboarding, Admin & Logout Actions */}
      <div className="px-4 pt-2 space-y-2">
        {onOpenAdminApproval && (
          <button
            onClick={onOpenAdminApproval}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center justify-between px-4 shadow-soft transition-colors cursor-pointer border border-slate-700"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="block font-black text-xs text-white">Geliştirici Onay Paneli</span>
                <span className="block text-[10px] text-slate-300 font-medium">Mekân Başvurularını İncele & Onayla</span>
              </div>
            </div>
            {pendingCount > 0 ? (
              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-full text-[11px] font-black animate-bounce">
                {pendingCount} Bekliyor
              </span>
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}

        {onOpenFirstTimeSurvey && (
          <button
            onClick={onOpenFirstTimeSurvey}
            className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-[#673AB7] rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 border border-purple-100 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#673AB7]" />
            <span>İlk Kullanım Anketi (Google Form)</span>
          </button>
        )}

        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border border-emerald-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0D9488]" />
            <span>Uygulama Tanıtım Sayfası (Landing Page)</span>
          </button>
        )}

        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="w-full py-3 bg-teal-50 hover:bg-teal-100 text-[#009688] rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 border border-teal-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#009688]" />
            <span>Uygulama Tanıtım Turunu İzle (Onboarding)</span>
          </button>
        )}

        <button
          onClick={onLogout}
          className="w-full py-3 bg-rose-50 text-[#D32F2F] hover:bg-rose-100 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-rose-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Giriş Sayfasına Dön / Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};
