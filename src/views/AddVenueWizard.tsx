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
  FileText
} from 'lucide-react';
import { Venue, FeatureStatus, AccessibilityFeatureId, VenueCategory } from '../types';
import { ACCESSIBILITY_FEATURES_CONFIG } from '../data/mockData';
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
        categoryLabel: category === 'kafe' ? 'Kafe' : category === 'restoran' ? 'Restoran' : category === 'muze' ? 'Müze' : category === 'avm' ? 'Alışveriş Merkezi' : 'Diğer',
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
        coverImage: uploadedPhotos[0],
        images: uploadedPhotos,
        phone: phone || '0222 000 00 00',
        openingHours: '09:00 - 22:00',
        coordinates: { lat: 39.778, lng: 30.512 },
        features,
        featureNotes,
        description: description || 'Kullanıcı tarafından eklenen yeni erişilebilir mekan.',
        tags: ['Yeni Eklenen', 'Kullanıcı Katkısı']
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
          {step === 5 ? 'Tebrikler!' : `Yeni Mekân Ekle (${step}/4)`}
        </h1>
        <div className="w-9" />
      </div>

      {/* Progress Bar Header */}
      {step < 5 && (
        <div className="bg-white px-4 pb-3 border-b border-gray-100">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
            <span>1. Genel</span>
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
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-teal-50/80 p-3.5 rounded-2xl border border-teal-100 text-xs text-teal-900">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <Building2 className="w-4 h-4 text-[#009688]" />
                Mekân Kimlik Bilgileri
              </span>
              Topluluğumuzun yeni erişilebilir yerler keşfetmesine yardımcı olun.
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Mekân Adı *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Starbucks Doktorlar Şubesi"
                className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009688]"
              />
            </div>

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
              <label className="text-xs font-bold text-gray-800 block mb-1">Açık Adres</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Örn: İsmet İnönü-1 Cad. No:12 Doktorlar Caddesi"
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
              <p className="text-xs text-gray-500">Yüklenen Görsel Sayısı: {uploadedPhotos.length}</p>
            </div>
          </div>
        )}

        {/* STEP 5: Success Screen */}
        {step === 5 && (
          <div className="py-8 text-center space-y-5 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-[#2E7D32] mx-auto shadow-soft">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">Mekân Bildirimi Alındı!</h2>
              <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                Katkınız için teşekkürler. Mekân saha denetçileri veya topluluk doğrulaması sonrası kalıcı onay alacaktır.
              </p>
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 inline-block shadow-xs">
              <div className="flex items-center gap-2 text-[#009688] font-black text-sm">
                <Sparkles className="w-5 h-5" />
                <span>+50 Erişilebilirlik Puanı Kazandınız!</span>
              </div>
              <p className="text-[11px] text-teal-800 mt-0.5">Topluluk Seviyesi: "Erişilebilirlik Elçisi"</p>
            </div>

            <div className="pt-4">
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
            {step === 4 ? 'Mekânı Kaydet' : 'Devam Et'}
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
