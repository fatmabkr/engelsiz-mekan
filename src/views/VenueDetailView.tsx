import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  Edit3, 
  AlertCircle, 
  MessageSquare, 
  Star,
  X,
  CheckCircle2,
  Send,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Venue, Review, AccessibilityFeatureId } from '../types';
import { ACCESSIBILITY_FEATURES_CONFIG } from '../data/mockData';
import { AccessibilityFeatureRow, CompactVenueCard } from '../components/VenueCards';
import { RatingStars, VerifiedBadge, PrimaryButton, SecondaryButton } from '../components/UIElements';
import { ReviewCard } from '../components/NavigationAndStateComponents';
import { DirectionsModal } from '../components/DirectionsModal';
import { getGoogleMapsDirectionsUrl } from '../services/googlePlacesService';

interface VenueDetailViewProps {
  venue: Venue;
  allVenues: Venue[];
  reviews: Review[];
  onBack: () => void;
  onSelectVenue: (venue: Venue) => void;
  onToggleFavorite: (id: string) => void;
  onAddReview: (review: Partial<Review>) => void;
}

export const VenueDetailView: React.FC<VenueDetailViewProps> = ({
  venue,
  allVenues,
  reviews,
  onBack,
  onSelectVenue,
  onToggleFavorite,
  onAddReview,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'features' | 'reviews' | 'gallery'>('features');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review Form State
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [galleryImages, setGalleryImages] = useState<string[]>(venue.images || []);

  React.useEffect(() => {
    setGalleryImages(venue.images || []);
  }, [venue.images]);

  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setGalleryImages((prev) => [...prev, result]);
          venue.images = [...(venue.images || []), result];
          showToast('Fotoğraf başarıyla eklendi!');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const relatedVenues = allVenues
    .filter((v) => v.id !== venue.id && v.category === venue.category)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `${venue.name} erişilebilirlik detayı Engelsiz Mekân uygulamasında!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Bağlantı panoya kopyalandı!');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    onAddReview({
      venueId: venue.id,
      userName: 'Sen (Kullanıcı)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      userBadge: 'Yeni Doğrulayıcı',
      rating: newRating,
      accessibilityRating: newRating,
      date: 'Bugün',
      content: newReviewText,
      helpfulCount: 0,
    });

    setNewReviewText('');
    setShowReviewModal(false);
    showToast('Değerlendirmeniz başarıyla yayınlandı!');
  };

  const venueReviews = reviews.length > 0 
    ? reviews 
    : [
        {
          id: `rev-${venue.id}-1`,
          venueId: venue.id,
          userName: 'Burak Öztürk',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          userBadge: 'Yerel Rehber (Level 6)',
          rating: 5,
          accessibilityRating: 5,
          date: '12 Temmuz 2026',
          content: `${venue.name} için lezzet ve hizmet harika. Girişteki rampa tekerlekli sandalye ile geçişi son derece kolaylaştırıyor. Personel ilgili ve güleryüzlü.`,
          helpfulCount: 38,
          isHelpful: true,
        },
        {
          id: `rev-${venue.id}-2`,
          venueId: venue.id,
          userName: 'Gamze Yıldız',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          userBadge: 'Saha Denetçisi',
          rating: 4,
          accessibilityRating: 4,
          date: '28 Haziran 2026',
          content: `Mekânın basamaksız girişi, düz zemini ve geniş kapıları tekerlekli sandalye erişimine tam uygun. İç mekânda masalar arası rahatça hareket edilebiliyor.`,
          helpfulCount: 22,
          isHelpful: true,
        },
        {
          id: `rev-${venue.id}-3`,
          venueId: venue.id,
          userName: 'Emre Şahin',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          userBadge: 'Aktif Üye',
          rating: 5,
          accessibilityRating: 5,
          date: '04 Haziran 2026',
          content: `Saha ekibi tarafından incelenmiş kaliteli erişilebilir mekân. Engelsiz ulaşımı desteklediğiniz için teşekkürler.`,
          helpfulCount: 15,
          isHelpful: false,
        }
      ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 max-w-md mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-soft flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#009688]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          aria-label="Geri Dön"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="font-extrabold text-base text-gray-900 truncate max-w-[200px]">
          {venue.name}
        </h1>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
            aria-label="Paylaş"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleFavorite(venue.id)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
            aria-label="Favori"
          >
            <Heart className={`w-5 h-5 ${venue.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image Gallery Header Carousel */}
      <div className="relative h-64 bg-gray-900 overflow-hidden">
        <img
          src={venue.images[activeImageIndex] || venue.coverImage}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Category & Verified Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 font-extrabold text-xs rounded-full">
            {venue.categoryLabel}
          </span>
          {venue.isVerified && <VerifiedBadge text="Saha Onaylı" />}
        </div>

        {/* Thumbnails Navigator */}
        {venue.images.length > 1 && (
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-center gap-2">
            {venue.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'w-6 bg-[#009688]' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Venue Overview Info */}
      <div className="p-4 bg-white border-b border-gray-100 shadow-xs space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-xl font-black text-gray-900">{venue.name}</h2>
            <div className="flex items-center gap-1.5 shrink-0">
              {venue.googleMapsUrl && (
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-extrabold rounded-xl flex items-center gap-1 transition-colors no-underline"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                  <span>Google Maps'te Aç</span>
                </a>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#009688]" />
            <span>{venue.address}</span>
          </p>
        </div>

        {/* Ratings & Accessibility Progress Indicator */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wide block">
              Erişilebilirlik Skoru
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#009688]">%{venue.accessibilityScore}</span>
              <span className="text-xs font-semibold text-teal-700">
                {venue.accessibilityScore >= 80
                  ? 'Tam Uyumlu'
                  : venue.accessibilityScore >= 50
                  ? 'Kısmen Uyumlu'
                  : 'Geliştirilmeli'}
              </span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-36 h-2 bg-teal-200/60 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#009688] rounded-full transition-all duration-500"
                style={{ width: `${venue.accessibilityScore}%` }}
              />
            </div>
          </div>

          <div className="text-right border-l border-teal-100 pl-4 space-y-1">
            <RatingStars rating={venue.rating} count={venue.reviewCount} size={18} />
            <p className="text-[11px] text-gray-500 font-medium">{venue.distanceKm} km uzakta</p>
            {venue.userReportCount && (
              <span className="inline-block text-[10px] text-teal-800 font-bold bg-teal-100/80 px-2 py-0.5 rounded-lg border border-teal-200">
                {venue.userReportCount} bildirim
              </span>
            )}
          </div>
        </div>

        {/* Quick Contact & Directions Action Buttons */}
        <div className="pt-1">
          <PrimaryButton
            icon={<Navigation className="w-4 h-4" />}
            onClick={() => setShowDirectionsModal(true)}
            size="md"
            className="w-full"
          >
            Yol Tarifi Al
          </PrimaryButton>
        </div>
      </div>

      {/* Directions Interactive Modal */}
      <DirectionsModal
        venue={venue}
        isOpen={showDirectionsModal}
        onClose={() => setShowDirectionsModal(false)}
      />

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 bg-white sticky top-14 z-20">
        <button
          onClick={() => setActiveTab('features')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'features'
              ? 'border-[#009688] text-[#009688]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Erişilebilirlik (9/9)
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-[#009688] text-[#009688]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Değerlendirmeler ({venueReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'gallery'
              ? 'border-[#009688] text-[#009688]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Fotoğraflar ({venue.images.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="p-4 space-y-6">
        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-[#FF9800]" />
                Topluluk Doğrulama Notu
              </p>
              <p className="text-amber-900/90 leading-relaxed font-normal">
                Bu bilgiler tekerlekli sandalye kullanıcıları ve saha ekiplerince yerinde kontrol edilmiştir.
              </p>
            </div>

            {/* Feature Rows */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-extrabold text-gray-900 mb-2">
                Fiziksel Erişilebilirlik Özellikleri
              </h3>
              {ACCESSIBILITY_FEATURES_CONFIG.map((feat) => {
                const status = venue.features[feat.id as AccessibilityFeatureId] || 'bilgi_yok';
                const note = venue.featureNotes?.[feat.id as AccessibilityFeatureId];
                return (
                  <AccessibilityFeatureRow
                    key={feat.id}
                    featureId={feat.id}
                    label={feat.label}
                    status={status}
                    note={note}
                  />
                );
              })}
            </div>

            {/* Address Detail */}
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                Adres Bilgisi
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#009688] mt-0.5" />
                  <span>Adres: <strong className="text-gray-800">{venue.address}</strong></span>
                </div>
              </div>
            </div>

            {/* Report or Update Information Actions */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowUpdateModal(true)}
                className="py-3 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#009688]" />
                <span>Bilgileri Güncelle</span>
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="py-3 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Hatalı Bilgi Bildir</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Kullanıcı Değerlendirmeleri</h3>
                <p className="text-xs text-gray-500">Engelsiz topluluk deneyimleri</p>
              </div>
              <PrimaryButton
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={() => setShowReviewModal(true)}
                size="sm"
              >
                Yorum Yaz
              </PrimaryButton>
            </div>

            <div className="space-y-3">
              {venueReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-3">
            <input
              type="file"
              id={`venue-detail-gallery-upload-${venue.id}`}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddGalleryImage}
            />
            <div className="grid grid-cols-2 gap-2.5">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${venue.name} fotoğraf ${idx + 1}`}
                  className="w-full h-36 rounded-2xl object-cover border border-gray-100 shadow-xs"
                />
              ))}

              <label
                htmlFor={`venue-detail-gallery-upload-${venue.id}`}
                className="h-36 rounded-2xl border-2 border-dashed border-[#009688]/40 hover:border-[#009688] bg-teal-50/50 hover:bg-teal-50 text-[#009688] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                <span className="text-xs font-bold">Fotoğraf Ekle</span>
                <span className="text-[10px] text-gray-500">Cihazından yükle</span>
              </label>
            </div>
          </div>
        )}

        {/* Related Venues Section */}
        {relatedVenues.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-extrabold text-gray-900 mb-3">Benzer Erişilebilir Mekânlar</h3>
            <div className="space-y-2">
              {relatedVenues.map((rel) => (
                <CompactVenueCard key={rel.id} venue={rel} onClick={() => onSelectVenue(rel)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* UPDATE INFORMATION MODAL */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-5 w-full max-w-sm shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-base text-gray-900">Mekân Bilgilerini Güncelle</h3>
              <button onClick={() => setShowUpdateModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Mekândaki güncel değişiklikleri (rampa yapılması, tuvalet yenilenmesi vb.) bildirin.
            </p>
            <textarea
              rows={3}
              placeholder="Güncellenen erişilebilirlik detayını yazınız..."
              className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
            />
            <PrimaryButton
              fullWidth
              size="sm"
              onClick={() => {
                setShowUpdateModal(false);
                showToast('Güncelleme talebiniz incelenmek üzere alındı.');
              }}
            >
              Gönder
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* REPORT INCORRECT INFORMATION MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-5 w-full max-w-sm shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-base text-rose-900">Hatalı Bilgi Bildir</h3>
              <button onClick={() => setShowReportModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Bu mekânla ilgili yanlış veya eksik durum tespiti bildirin.
            </p>
            <select className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl">
              <option>Rampa mevcut değil/kullanılamıyor</option>
              <option>Engelli tuvaleti kilitli/kullanılamıyor</option>
              <option>Basamak ve eşik var</option>
              <option>Mekân kapandı/taşındı</option>
            </select>
            <textarea
              rows={2}
              placeholder="Açıklama (opsiyonel)..."
              className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-600"
            />
            <button
              onClick={() => {
                setShowReportModal(false);
                showToast('Bildiriminiz denetim ekibimize iletildi.');
              }}
              className="w-full py-3 bg-[#D32F2F] text-white text-xs font-bold rounded-xl shadow-soft hover:bg-red-800 transition-colors"
            >
              Bildirimi Gönder
            </button>
          </div>
        </div>
      )}

      {/* ADD REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-[24px] p-5 w-full max-w-sm shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-base text-gray-900">Değerlendirme Yaz</h3>
              <button type="button" onClick={() => setShowReviewModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Puanınız</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? 'fill-[#FF9800] text-[#FF9800]' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Yorumunuz</label>
              <textarea
                required
                rows={3}
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Mekânın tekerlekli sandalye erişimi, giriş genişliği, tuvalet durumu vb. hakkındaki deneyiminiz..."
                className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              />
            </div>

            <PrimaryButton type="submit" fullWidth icon={<Send className="w-4 h-4" />}>
              Yayınla
            </PrimaryButton>
          </form>
        </div>
      )}
    </div>
  );
};
