import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  UploadCloud, 
  Building2, 
  MapPin, 
  Phone, 
  Sparkles, 
  Check, 
  X, 
  Plus,
  HelpCircle,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Venue, FeatureStatus, AccessibilityFeatureId, VenueCategory } from '../types';
import { ACCESSIBILITY_FEATURES_CONFIG } from '../data/mockData';
import { searchGoogleMapsPlaces, GoogleMapsPlaceSuggestion } from '../data/googleMapsPlaces';
import { PrimaryButton, SecondaryButton } from '../components/UIElements';

interface AddVenueWizardProps {
  onBack: () => void;
  onSubmitVenue: (venue: Partial<Venue>) => void;
}

export const AddVenueWizard: React.FC<AddVenueWizardProps> = ({ onBack, onSubmitVenue }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VenueCategory>('kafe');
  const [district, setDistrict] = useState('Tepebaşı');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 39.778, lng: 30.512 });
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>('');
  const [verifiedFromMaps, setVerifiedFromMaps] = useState<boolean>(false);

  // Google Maps Suggestions State
  const [mapsSuggestions, setMapsSuggestions] = useState<GoogleMapsPlaceSuggestion[]>([]);
  const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim().length >= 1) {
      const results = searchGoogleMapsPlaces(val);
      setMapsSuggestions(results);
      setIsShowingSuggestions(true);
    } else {
      setMapsSuggestions([]);
      setIsShowingSuggestions(false);
    }
  };

  const handleSelectMapsSuggestion = (sug: GoogleMapsPlaceSuggestion) => {
    setName(sug.name);
    setCategory(sug.category);
    setDistrict(sug.district);
    setAddress(sug.address);
    setPhone(sug.phone);
    setCoordinates({ lat: sug.lat, lng: sug.lng });
    setGoogleMapsUrl(sug.googleMapsUrl);
    setVerifiedFromMaps(true);
    setIsShowingSuggestions(false);
  };

  // Features checklist state
  const [features, setFeatures] = useState<Record<AccessibilityFeatureId, FeatureStatus>>({
    kaldirim: 'mevcut',
    rampa: 'mevcut',
    kapilar: 'mevcut',
    koridorlar: 'mevcut',
    merdiven: 'mevcut',
    asansor: 'bilgi_yok',
    tek_kat: 'mevcut',
    engelli_tuvaleti: 'mevcut',
    bilgilendirme: 'bilgi_yok',
  });

  const [featureNotes, setFeatureNotes] = useState<Partial<Record<AccessibilityFeatureId, string>>>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setUploadedPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNextStep = () => {
    if (step === 1 && !name.trim()) {
      alert('Lütfen mekân adını giriniz.');
      return;
    }
    if (step < 4) {
      setStep((s) => (s + 1) as any);
    } else if (step === 4) {
      // Complete & Show Success
      const countMevcut = Object.values(features).filter((v) => v === 'mevcut').length;
      const computedScore = Math.round((countMevcut / 9) * 100);

      onSubmitVenue({
        name,
        category,
        categoryLabel: category === 'kafe' ? 'Kafe' : category === 'restoran' ? 'Restoran' : category === 'muze' ? 'Müze' : category === 'avm' ? 'Alışveriş Merkezi' : category === 'saglik' ? 'Sağlık Kuruluşu' : category === 'oteller' ? 'Otel' : 'Diğer',
        address: address || 'Eskişehir',
        district,
        city: 'Eskişehir',
        distanceKm: 0.5,
        rating: 5.0,
        reviewCount: 1,
        accessibilityScore: Math.max(50, computedScore),
        accessibilityLevel: computedScore >= 80 ? 'high' : 'medium',
        isVerified: false,
        isFavorite: false,
        lastUpdatedDate: '30 Temmuz 2026',
        coverImage: uploadedPhotos[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        images: uploadedPhotos,
        phone: phone || '0222 000 00 00',
        openingHours: '09:00 - 22:00',
        coordinates: coordinates,
        googleMapsUrl: googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' Eskişehir')}`,
        features,
        featureNotes,
        description: description || 'Kullanıcı tarafından eklenen yeni erişilebilir mekan.',
        tags: ['Kullanıcı Katkısı', 'Harita Doğrulanmış'],
        approvalStatus: 'pending',
        isApproved: false,
        submittedAt: '30 Temmuz 2026',
        submittedBy: 'Mevcut Kullanıcı'
      });

      setStep(5); // Success step
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 max-w-md mx-auto flex flex-col">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <button
          onClick={step === 5 ? onBack : () => (step > 1 ? setStep((s) => (s - 1) as any) : onBack())}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-black text-base text-gray-900">
          {step === 5 ? 'Başvuru Alındı' : `Yeni Mekân Ekle (${step}/4)`}
        </h1>
        <div className="w-9" />
      </div>

      {/* Progress Bar Header */}
      {step < 5 && (
        <div className="bg-white px-4 pb-3 border-b border-gray-100">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
            <span>1. Genel & Maps</span>
            <span>2. Erişilebilirlik</span>
            <span>3. Görsel</span>
            <span>4. Detay</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#009688] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP CONTENT */}
      <div className="p-4 flex-1 space-y-5">
        {/* STEP 1: Basic Info with Google Maps Autocomplete */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-[#0F172A] p-4 rounded-2xl text-white shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Google Maps Destekli Mekân Arama</span>
              </div>
              <p className="text-xs text-slate-300">
                Mekân adını yazmaya başladığınızda haritalardan öneriler çıkacaktır. Öneri seçtiğinizde adres ve harita konumu otomatik tanımlanır.
              </p>
            </div>

            {/* Venue Name Input with Autocomplete */}
            <div className="relative">
              <label className="text-xs font-bold text-gray-800 flex items-center justify-between mb-1">
                <span>Mekân Adı (Google Maps Arama) *</span>
                <span className="text-[10px] text-[#0D9488] font-semibold flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" />
                  Haritadan Öneriler
                </span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() => {
                    if (name.trim().length >= 1) {
                      setMapsSuggestions(searchGoogleMapsPlaces(name));
                      setIsShowingSuggestions(true);
                    }
                  }}
                  placeholder="Örn: Starbucks Doktorlar, OMM, Espark..."
                  className="w-full pl-10 pr-9 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/15 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                {name && (
                  <button
                    onClick={() => {
                      setName('');
                      setIsShowingSuggestions(false);
                      setVerifiedFromMaps(false);
                    }}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {isShowingSuggestions && mapsSuggestions.length > 0 && (
                <div className="absolute z-40 left-0 right-0 mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
                  <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>🗺️ Google Maps Eskişehir Konum Önerileri</span>
                    <button onClick={() => setIsShowingSuggestions(false)} className="text-slate-400 hover:text-slate-700">Kapat</button>
                  </div>

                  {mapsSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      onClick={() => handleSelectMapsSuggestion(sug)}
                      className="p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors flex items-start gap-2.5"
                    >
                      <div className="p-2 rounded-xl bg-slate-100 text-[#009688] shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-slate-900 truncate">{sug.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold shrink-0">
                            {sug.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{sug.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Google Maps Verification Badge */}
            {verifiedFromMaps && (
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-extrabold block">Google Maps Konumu Doğrulandı</span>
                    <span className="text-[11px] text-emerald-700">
                      Koordinat: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                    title="Google Maps'te Aç"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VenueCategory)}
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              >
                <option value="restoran">Restoran</option>
                <option value="kafe">Kafe</option>
                <option value="muze">Müze</option>
                <option value="avm">Alışveriş Merkezi (AVM)</option>
                <option value="park">Park & Açık Alan</option>
                <option value="kultur_sanat">Kültür & Sanat</option>
                <option value="saglik">Sağlık Kuruluşu / Hastane</option>
                <option value="oteller">Otel & Konaklama</option>
                <option value="kamu">Kamu Binası</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">İlçe</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              >
                <option value="Tepebaşı">Tepebaşı (Eskişehir)</option>
                <option value="Odunpazarı">Odunpazarı (Eskişehir)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Açık Adres (Google Maps)</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Örn: İsmet İnönü-1 Cad. No:12 Doktorlar Caddesi, Tepebaşı / Eskişehir"
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">İletişim Telefonu</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: 0222 230 11 22"
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Accessibility Features Checklist */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs font-bold text-gray-700">
              Lütfen mekânda gözlemlediğiniz erişilebilirlik durumunu seçiniz:
            </p>

            <div className="space-y-3">
              {ACCESSIBILITY_FEATURES_CONFIG.map((feat) => {
                const currentStatus = features[feat.id];
                return (
                  <div key={feat.id} className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">{feat.label}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFeatures({ ...features, [feat.id]: 'mevcut' })}
                        className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                          currentStatus === 'mevcut'
                            ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        ✓ Mevcut
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeatures({ ...features, [feat.id]: 'mevcut_degil' })}
                        className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                          currentStatus === 'mevcut_degil'
                            ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        ✗ Yok
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeatures({ ...features, [feat.id]: 'bilgi_yok' })}
                        className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                          currentStatus === 'bilgi_yok'
                            ? 'bg-[#EF6C00] text-white border-[#EF6C00]'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        ? Bilgi Yok
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Not ekleyin (örn: Eğim 5 derece, kapı genişliği 90 cm)..."
                      value={featureNotes[feat.id] || ''}
                      onChange={(e) => setFeatureNotes({ ...featureNotes, [feat.id]: e.target.value })}
                      className="w-full mt-1 p-2 text-[11px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Photos */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-0.5">💡 Görsel İpucu</span>
              Giriş kapısı, rampa ve tuvalet fotoğrafları diğer tekerlekli sandalye kullanıcıları için hayatidir.
            </div>

            <input
              type="file"
              id="venue-wizard-photo-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="grid grid-cols-2 gap-3">
              {uploadedPhotos.map((url, idx) => (
                <div key={idx} className="relative h-32 rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
                  <img src={url} alt="Mekan" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label
                htmlFor="venue-wizard-photo-upload"
                className="h-32 rounded-2xl border-2 border-dashed border-[#009688]/40 hover:border-[#009688] bg-teal-50/50 hover:bg-teal-50 text-[#009688] flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-bold">Fotoğraf Yükle</span>
                <span className="text-[10px] text-gray-500">Cihazınızdan Seçin</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Description */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Mekân Açıklaması & Deneyiminiz</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Garsonlar çok ilgili, masa araları geniş. Zemin katta basamak yok, tuvalet tertemiz ve geniş..."
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              />
            </div>

            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Eklenen Mekân Özeti</h4>
              <p className="text-sm font-extrabold text-[#009688]">{name || 'İsimsiz Mekân'}</p>
              <p className="text-xs text-gray-600">{address || 'Eskişehir'}</p>
              <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Koordinatı: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
              </p>
              <p className="text-xs text-amber-700 font-semibold">
                ⏳ Başvuru durumu: Geliştirici (Yönetici) Onayı Bekleyecek
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Success Screen with Admin Approval Notice */}
        {step === 5 && (
          <div className="py-6 text-center space-y-5 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mx-auto shadow-soft">
              <ShieldCheck className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">Mekân Başvurusu Alındı!</h2>
              <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                Mekân ekleme talebiniz <strong>Geliştirici (Yönetici) Onay Paneli</strong>'ne iletildi. Uygulama geliştiricisi onayladıktan sonra haritada ve listede tüm kullanıcılar için yayına alınacaktır.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Firestore & Onay Süreci Bilgisi</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                • <strong>İki Aşamalı Onay:</strong> Mekân talebiniz doğrudan yayınlanan <code>venues</code> koleksiyonuna değil, onay bekleyen <code>pending_venues</code> koleksiyonuna kaydedildi.<br />
                • <strong>Firebase Console Kontrolü:</strong> Verinizi Firebase Console'da <code>pending_venues</code> koleksiyonu altında bulabilirsiniz.<br />
                • Profilinizdeki <strong>"Geliştirici Onay Paneli"</strong> üzerinden başvuruyu onayladığınızda mekân yayına (<code>venues</code>) alınacaktır.
              </p>
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 inline-block shadow-xs">
              <div className="flex items-center gap-2 text-[#009688] font-black text-sm">
                <Sparkles className="w-5 h-5" />
                <span>+50 Taslak Erişilebilirlik Puanı Kazandınız!</span>
              </div>
              <p className="text-[11px] text-teal-800 mt-0.5">Onaylandıktan sonra puan hesabınıza tanımlanır.</p>
            </div>

            <div className="pt-2">
              <PrimaryButton onClick={onBack} fullWidth>
                Ana Sayfaya Dön
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      {step < 5 && (
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
          <SecondaryButton
            onClick={() => (step > 1 ? setStep((s) => (s - 1) as any) : onBack())}
            size="md"
          >
            {step === 1 ? 'İptal' : 'Geri'}
          </SecondaryButton>

          <PrimaryButton
            onClick={handleNextStep}
            icon={<ArrowRight className="w-4 h-4" />}
            size="md"
          >
            {step === 4 ? 'Geliştirici Onayına Gönder' : 'Devam Et'}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

