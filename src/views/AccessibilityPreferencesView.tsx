import React, { useState } from 'react';
import { ArrowLeft, Check, Sliders, ShieldCheck } from 'lucide-react';
import { AccessibilityPreferences } from '../types';
import { PrimaryButton } from '../components/UIElements';

interface PreferencesViewProps {
  preferences: AccessibilityPreferences;
  onSavePreferences: (prefs: AccessibilityPreferences) => void;
  onBack: () => void;
}

export const AccessibilityPreferencesView: React.FC<PreferencesViewProps> = ({
  preferences,
  onSavePreferences,
  onBack,
}) => {
  const [localPrefs, setLocalPrefs] = useState<AccessibilityPreferences>(preferences);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSavePreferences(localPrefs);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onBack();
    }, 1200);
  };

  const requiredFeatures = [
    { key: 'rampaRequired', label: 'Erişilebilir Rampa', desc: 'Girişte tekerlekli sandalye eğimine uygun rampa olmalı' },
    { key: 'asansorRequired', label: 'Asansör', desc: 'Çok katlı mekanlarda geniş ve sesli asansör olmalı' },
    { key: 'engelliTuvaletiRequired', label: 'Engelli Tuvaleti', desc: 'Tutunma barlı ve acil çağrı butonlu lavabo zorunlu' },
    { key: 'merdivensizRequired', label: 'Merdivensiz / Eşiksiz Giriş', desc: 'Ana kapıda hiçbir basamak bulunmamalı' },
    { key: 'genisKapilarRequired', label: 'Geniş Kapılar (85+ cm)', desc: 'Akülü ve manuel sandalye geçişine elverişli kapılar' },
    { key: 'tekKatRequired', label: 'Tek Kat Hizmet', desc: 'Tüm sipariş ve oturma alanları zemin katta olmalı' },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-gray-900">Erişilebilirlik Tercihlerim</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-5">
        <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-100/80 text-xs text-teal-900">
          <span className="font-bold flex items-center gap-1.5 mb-1 text-[#009688]">
            <ShieldCheck className="w-4 h-4" />
            Kişiselleştirilmiş Öneri Motoru
          </span>
          Burada seçtiğiniz fiziksel gereksinimler, ana sayfa ve harita arama sonuçlarınızda önceliklendirilecektir.
        </div>

        {/* Required Features Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900">Zorunlu Mekân Özellikleri</h3>
          {requiredFeatures.map((item) => {
            const isChecked = Boolean(localPrefs[item.key as keyof AccessibilityPreferences]);
            return (
              <label
                key={item.key}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'bg-white border-[#009688] shadow-xs ring-1 ring-[#009688]/20'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900">{item.label}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    setLocalPrefs({ ...localPrefs, [item.key]: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#009688] rounded cursor-pointer flex-shrink-0"
                />
              </label>
            );
          })}
        </div>

        {/* Minimum Score Threshold Slider */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-gray-800">Minimum Uyumluluk Eşiği</label>
            <span className="text-xs font-extrabold px-2.5 py-1 bg-teal-50 text-[#009688] rounded-lg">
              %{localPrefs.minimumScore}
            </span>
          </div>

          <input
            type="range"
            min="40"
            max="95"
            step="5"
            value={localPrefs.minimumScore}
            onChange={(e) =>
              setLocalPrefs({ ...localPrefs, minimumScore: Number(e.target.value) })
            }
            className="w-full accent-[#009688] cursor-pointer"
          />
          <p className="text-[11px] text-gray-500">
            Sadece bu puanın üzerindeki mekanlar ana sayfanızda "Tam Uyumlu" olarak işaretlenecektir.
          </p>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <PrimaryButton onClick={handleSave} fullWidth icon={<Check className="w-4 h-4" />}>
            {savedSuccess ? 'Tercihler Kaydedildi! ✓' : 'Tercihlerimi Kaydet'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
