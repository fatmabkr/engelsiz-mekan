import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Users, 
  MapPin, 
  Key, 
  Mail, 
  User, 
  CheckCircle2, 
  Bell, 
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  Link,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/UIElements';

/* -------------------------------------------------------------------------- */
/* Splash                                                                     */
/* -------------------------------------------------------------------------- */

export const SplashView: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="bg-gradient-navy-green-v min-h-screen max-w-md mx-auto flex flex-col items-center justify-between p-8 text-white text-center">
      <div className="w-full" />

      <div className="space-y-4 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-soft-lg">
          <span className="text-4xl">♿</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white">YOL AÇIK</h1>
          <p className="text-xs font-bold text-amber-300 tracking-wider uppercase">Hayata Açılan Engelsiz Yollar</p>
        </div>
        <p className="text-xs text-teal-100 max-w-xs mx-auto leading-relaxed font-medium">
          Tekerlekli sandalye kullanıcıları ve hareket kısıtlılığı olan bireyler için erişilebilir mekân keşif platformu.
        </p>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={onStart}
          className="w-full py-4 bg-white text-[#0F172A] font-black text-sm rounded-[16px] shadow-soft hover:bg-slate-50 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Keşfetmeye Başla</span>
          <ArrowRight className="w-4 h-4 text-[#0D9488]" />
        </button>
        <p className="text-[10px] text-teal-200/80">Eskişehir • Engelsiz Kent Projesi</p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ISOMETRIC ACCESSIBILITY MAP ILLUSTRATION                                   */
/* -------------------------------------------------------------------------- */

export const IsometricAccessibilityMapIllustration: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-[28px] bg-gradient-to-b from-[#E6F8F5] via-white to-[#F0FDFA] border border-[#18B8A8]/20 shadow-soft overflow-hidden flex items-center justify-center p-2">
      <svg viewBox="0 0 600 480" className="w-full h-full max-h-[320px] select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pinMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19C37D" />
            <stop offset="60%" stopColor="#18B8A8" />
            <stop offset="100%" stopColor="#108075" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1F3349" floodOpacity="0.08" />
          </filter>
          <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#108075" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* BACKGROUND MAP ROAD/BLOCK SHAPES */}
        <path d="M 120 180 Q 300 120 480 180 Q 520 280 480 380 Q 300 440 120 380 Q 80 280 120 180 Z" fill="#EAF7F5" opacity="0.6" />
        <path d="M 150 200 C 250 150 350 150 450 200 C 500 270 450 340 450 360 C 350 400 250 400 150 360 C 100 300 100 240 150 200 Z" fill="#F4FCFA" stroke="#D1F2EC" strokeWidth="2" strokeDasharray="6 6" />

        {/* CONNECTING MINT-GREEN PEDESTRIAN PATHWAYS */}
        <path
          d="M 300 120 Q 450 130 470 230 Q 480 340 300 360 Q 140 350 130 230 Q 130 130 300 120 Z"
          stroke="#52E0B6"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#softShadow)"
        />
        <path
          d="M 300 120 Q 450 130 470 230 Q 480 340 300 360 Q 140 350 130 230 Q 130 130 300 120 Z"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeDasharray="8 8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Spoke Paths connecting to Center Pin (300, 240) */}
        <line x1="300" y1="120" x2="300" y2="240" stroke="#52E0B6" strokeWidth="10" strokeLinecap="round" />
        <line x1="470" y1="230" x2="300" y2="240" stroke="#52E0B6" strokeWidth="10" strokeLinecap="round" />
        <line x1="300" y1="360" x2="300" y2="240" stroke="#52E0B6" strokeWidth="10" strokeLinecap="round" />
        <line x1="130" y1="230" x2="300" y2="240" stroke="#52E0B6" strokeWidth="10" strokeLinecap="round" />

        {/* PATHWAY INTERSECTION CIRCLE NODES */}
        {[
          { cx: 300, cy: 120 },
          { cx: 470, cy: 230 },
          { cx: 300, cy: 360 },
          { cx: 130, cy: 230 },
          { cx: 385, cy: 175 },
          { cx: 385, cy: 295 },
          { cx: 215, cy: 295 },
          { cx: 215, cy: 175 },
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.cx} cy={node.cy} r="10" fill="#18B8A8" />
            <circle cx={node.cx} cy={node.cy} r="5" fill="#FFFFFF" />
          </g>
        ))}

        {/* 1. TOP BUILDING: SHOPPING MALL (x: 300, y: 75) */}
        <g transform="translate(300, 75)" filter="url(#softShadow)">
          {/* Base platform */}
          <ellipse cx="0" cy="35" rx="75" ry="22" fill="#FFFFFF" stroke="#E2F5F0" strokeWidth="3" />
          <ellipse cx="0" cy="32" rx="70" ry="18" fill="#F8FCFC" />
          
          {/* Curved Glass Building */}
          <path d="M -50 15 C -50 -15, 50 -15, 50 15 L 50 30 C 50 40, -50 40, -50 30 Z" fill="#E3FAF4" stroke="#18B8A8" strokeWidth="2.5" />
          <path d="M -42 12 C -42 -8, 42 -8, 42 12 L 42 28 C 42 35, -42 35, -42 28 Z" fill="#18B8A8" opacity="0.15" />
          <path d="M -25 -2 L -25 28 M 0 -5 L 0 30 M 25 -2 L 25 28" stroke="#18B8A8" strokeWidth="1.5" opacity="0.4" />
          
          {/* Entrance & Ramp */}
          <rect x="-12" y="15" width="24" height="18" rx="3" fill="#FFFFFF" stroke="#18B8A8" strokeWidth="2" />
          <path d="M -8 33 L -14 42 L 14 42 L 8 33 Z" fill="#19C37D" opacity="0.8" />
          
          {/* Badge Icon on top */}
          <circle cx="0" cy="-18" r="14" fill="#18B8A8" />
          <text x="0" y="-13" textAnchor="middle" fontSize="13" fill="#FFFFFF">🛍️</text>
          
          {/* Wheelchair Ramp Badge */}
          <circle cx="20" cy="34" r="8" fill="#19C37D" />
          <text x="20" y="37" textAnchor="middle" fontSize="8" fill="#FFFFFF">♿</text>
          
          {/* Greenery */}
          <circle cx="-58" cy="22" r="10" fill="#19C37D" />
          <circle cx="58" cy="22" r="10" fill="#19C37D" />
        </g>

        {/* 2. LEFT BUILDING: COZY CAFÉ (x: 110, y: 220) */}
        <g transform="translate(110, 220)" filter="url(#softShadow)">
          {/* Base platform */}
          <ellipse cx="0" cy="35" rx="65" ry="22" fill="#FFFFFF" stroke="#E2F5F0" strokeWidth="3" />
          
          {/* Cafe structure */}
          <rect x="-40" y="-10" width="80" height="42" rx="8" fill="#FFFFFF" stroke="#18B8A8" strokeWidth="2.5" />
          {/* Striped Awning */}
          <path d="M -44 -10 L 44 -10 L 40 2 L -40 2 Z" fill="#19C37D" />
          <path d="M -30 -10 L -20 -10 L -22 2 L -32 2 Z M -10 -10 L 0 -10 L -2 2 L -12 2 Z M 10 -10 L 20 -10 L 18 2 L 8 2 Z M 30 -10 L 40 -10 L 38 2 L 28 2 Z" fill="#FFFFFF" />
          
          {/* Outdoor Seating & Table */}
          <circle cx="-25" cy="25" r="7" fill="#F0FDF4" stroke="#18B8A8" strokeWidth="1.5" />
          <circle cx="-35" cy="25" r="3" fill="#18B8A8" />
          <circle cx="-15" cy="25" r="3" fill="#18B8A8" />
          
          {/* Ramp */}
          <path d="M 5 28 L 22 38 L 36 38 L 22 28 Z" fill="#7FE8C8" />
          
          {/* Top Badge Icon */}
          <circle cx="0" cy="-24" r="14" fill="#18B8A8" />
          <text x="0" y="-19" textAnchor="middle" fontSize="13" fill="#FFFFFF">☕</text>
          
          {/* Wheelchair Badge */}
          <circle cx="32" cy="28" r="8" fill="#19C37D" />
          <text x="32" y="31" textAnchor="middle" fontSize="8" fill="#FFFFFF">♿</text>
          
          {/* Trees */}
          <circle cx="-50" cy="15" r="9" fill="#18B8A8" />
        </g>

        {/* 3. RIGHT BUILDING: NEOCLASSICAL MUSEUM (x: 490, y: 220) */}
        <g transform="translate(490, 220)" filter="url(#softShadow)">
          {/* Base platform */}
          <ellipse cx="0" cy="35" rx="68" ry="22" fill="#FFFFFF" stroke="#E2F5F0" strokeWidth="3" />
          
          {/* Museum Structure */}
          <path d="M -40 28 L -40 0 L 0 -15 L 40 0 L 40 28 Z" fill="#FFFFFF" stroke="#18B8A8" strokeWidth="2.5" />
          {/* Pediment triangle */}
          <path d="M -44 2 L 0 -18 L 44 2 Z" fill="#F0FDF4" stroke="#18B8A8" strokeWidth="2" />
          
          {/* Dome & Flag */}
          <path d="M -16 -18 C -16 -32 16 -32 16 -18 Z" fill="#18B8A8" opacity="0.25" stroke="#18B8A8" strokeWidth="2" />
          <line x1="0" y1="-32" x2="0" y2="-42" stroke="#18B8A8" strokeWidth="2" />
          <path d="M 0 -42 L 12 -38 L 0 -34 Z" fill="#19C37D" />

          {/* Pillars */}
          <rect x="-30" y="4" width="6" height="22" fill="#18B8A8" opacity="0.3" />
          <rect x="-12" y="4" width="6" height="22" fill="#18B8A8" opacity="0.3" />
          <rect x="6" y="4" width="6" height="22" fill="#18B8A8" opacity="0.3" />
          <rect x="24" y="4" width="6" height="22" fill="#18B8A8" opacity="0.3" />

          {/* Ramp */}
          <path d="M -10 26 L -25 38 L 5 38 L -2 26 Z" fill="#19C37D" opacity="0.8" />

          {/* Top Badge Icon */}
          <circle cx="0" cy="-6" r="13" fill="#18B8A8" />
          <text x="0" y="-1" textAnchor="middle" fontSize="12" fill="#FFFFFF">🏛️</text>

          {/* Wheelchair Badge */}
          <circle cx="18" cy="34" r="8" fill="#19C37D" />
          <text x="18" y="37" textAnchor="middle" fontSize="8" fill="#FFFFFF">♿</text>

          {/* Shrubs */}
          <circle cx="50" cy="20" r="9" fill="#19C37D" />
        </g>

        {/* 4. BOTTOM BUILDING: MODERN RESTAURANT (x: 300, y: 375) */}
        <g transform="translate(300, 375)" filter="url(#softShadow)">
          {/* Base platform */}
          <ellipse cx="0" cy="35" rx="72" ry="22" fill="#FFFFFF" stroke="#E2F5F0" strokeWidth="3" />
          
          {/* Restaurant Structure */}
          <rect x="-42" y="-5" width="84" height="36" rx="8" fill="#FFFFFF" stroke="#18B8A8" strokeWidth="2.5" />
          <rect x="-36" y="0" width="72" height="20" fill="#DDF8F4" stroke="#18B8A8" strokeWidth="1.5" opacity="0.6" />

          {/* Terrace Umbrella */}
          <path d="M 25 10 C 25 2, 45 2, 45 10 Z" fill="#19C37D" />
          <line x1="35" y1="10" x2="35" y2="28" stroke="#18B8A8" strokeWidth="2" />

          {/* Ramp */}
          <path d="M -12 28 L -26 40 L 4 40 L -2 28 Z" fill="#52E0B6" />

          {/* Top Badge Icon */}
          <circle cx="0" cy="-20" r="14" fill="#18B8A8" />
          <text x="0" y="-15" textAnchor="middle" fontSize="13" fill="#FFFFFF">🍴</text>

          {/* Wheelchair Badge */}
          <circle cx="16" cy="34" r="8" fill="#19C37D" />
          <text x="16" y="37" textAnchor="middle" fontSize="8" fill="#FFFFFF">♿</text>

          {/* Potted plants */}
          <circle cx="-52" cy="22" r="8" fill="#18B8A8" />
          <circle cx="52" cy="22" r="8" fill="#18B8A8" />
        </g>

        {/* 5. CENTERPIECE: GLOSSY LOCATION PIN (x: 300, y: 220) */}
        <g transform="translate(300, 220)">
          {/* Ground Rings / Base */}
          <ellipse cx="0" cy="25" rx="36" ry="12" fill="#18B8A8" opacity="0.25" />
          <ellipse cx="0" cy="25" rx="26" ry="9" fill="#FFFFFF" stroke="#18B8A8" strokeWidth="3" filter="url(#softShadow)" />
          <ellipse cx="0" cy="25" rx="16" ry="5" fill="#19C37D" />

          {/* Main Pin Teardrop Shape */}
          <g filter="url(#pinShadow)">
            <path
              d="M 0 -60 C -26 -60, -42 -40, -42 -14 C -42 16, 0 32, 0 32 C 0 32, 42 16, 42 -14 C 42 -40, 26 -60, 0 -60 Z"
              fill="url(#pinMainGrad)"
              stroke="#FFFFFF"
              strokeWidth="3"
            />
            
            {/* Glossy inner reflection highlight */}
            <path
              d="M -22 -44 C -12 -54, 12 -54, 22 -44 C 10 -48, -10 -48, -22 -44 Z"
              fill="#FFFFFF"
              opacity="0.4"
            />

            {/* Inner White Circle */}
            <circle cx="0" cy="-22" r="19" fill="#FFFFFF" />
            <circle cx="0" cy="-22" r="19" stroke="#19C37D" strokeWidth="2" opacity="0.3" />

            {/* Wheelchair Symbol Inside Pin */}
            <text x="0" y="-13" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#108075">♿</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CUSTOM IMAGE SLOT (UPLOADER & PLACEHOLDER)                                 */
/* -------------------------------------------------------------------------- */

interface CustomImageSlotProps {
  slideIndex: number;
}

export const CustomImageSlot: React.FC<CustomImageSlotProps> = ({ slideIndex }) => {
  const [imageUrl, setImageUrl] = useState<string>(() => {
    return localStorage.getItem(`yolacik_custom_image_${slideIndex}`) || '';
  });

  React.useEffect(() => {
    const saved = localStorage.getItem(`yolacik_custom_image_${slideIndex}`);
    setImageUrl(saved || '');
  }, [slideIndex]);

  if (imageUrl) {
    return (
      <div className="relative w-full aspect-[4/3] max-h-[280px] rounded-[28px] overflow-hidden border border-[#18B8A8]/20 shadow-soft bg-white">
        <img
          src={imageUrl}
          alt={`Onboarding Görseli ${slideIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return <IsometricAccessibilityMapIllustration />;
};

/* -------------------------------------------------------------------------- */
/* Onboarding                                                                 */
/* -------------------------------------------------------------------------- */

export const OnboardingView: React.FC<{ 
  onComplete: () => void;
  onGuestAccess: () => void;
}> = ({ onComplete, onGuestAccess }) => {
  const [slide, setSlide] = useState(0);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const slides = [
    {
      badge: '1 / 3 • Mekân Keşfi',
      headlinePrefix: 'Erişilebilir Mekânları ',
      headlineHighlight: 'Keşfedin',
      headlineSuffix: ' ✨',
      desc: 'Restoran, kafe, müze ve alışveriş merkezlerinin rampa, asansör, geniş kapı ve engelli tuvaleti durumunu gitmeden önce öğrenin.',
      features: [
        { title: 'Rampa', subtitle: 'Var mı?', icon: '♿' },
        { title: 'Asansör', subtitle: 'Geniş mi?', icon: '🛗' },
        { title: 'Geniş Kapı', subtitle: 'Uygun mu?', icon: '🚪' },
        { title: 'Engelli WC', subtitle: 'Mevcut mu?', icon: '🚻' },
      ],
    },
    {
      badge: '2 / 3 • Güvenli Filtre',
      headlinePrefix: 'İhtiyacınıza Özel ',
      headlineHighlight: 'Filtreleyin',
      headlineSuffix: ' 🎯',
      desc: 'Tekerlekli sandalye rampası, engelli tuvaleti ve basamaksız giriş gereksinimlerinize %100 uyan mekânları anında listeleyin.',
      features: [
        { title: 'Kaldırım', subtitle: 'Düzgün mü?', icon: '🛣️' },
        { title: 'Otopark', subtitle: 'Engelli Özel', icon: '🅿️' },
        { title: 'Giriş', subtitle: 'Basamaksız', icon: '🏛️' },
        { title: 'Masa Uyum', subtitle: 'Sandalye Tipi', icon: '🪑' },
      ],
    },
    {
      badge: '3 / 3 • Saha Topluluğu',
      headlinePrefix: 'Topluluk ile ',
      headlineHighlight: 'Paylaşın',
      headlineSuffix: ' 🤝',
      desc: 'Gerçek tekerlekli sandalye kullanıcılarının fotoğraflı saha deneyimlerini inceleyin, kendi erişilebilirlik notlarınızı ekleyin.',
      features: [
        { title: 'Doğrulanmış', subtitle: 'Saha Notu', icon: '✓' },
        { title: 'Fotoğraf', subtitle: 'Gerçek Açı', icon: '📷' },
        { title: 'Yorumlar', subtitle: 'Canlı Bilgi', icon: '💬' },
        { title: 'Rozetler', subtitle: 'Gönüllü Katkı', icon: '🎖️' },
      ],
    },
  ];

  const current = slides[slide];

  return (
    <div className="bg-[#FAFBFD] min-h-screen max-w-md mx-auto flex flex-col justify-between p-5 text-[#0D1B2A] relative font-sans selection:bg-[#12B886]/20">
      
      {/* 1. TOP BAR */}
      <header className="flex items-center justify-between pt-1 pb-3">
        {/* Progress Pill */}
        <div className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-extrabold text-[#0D1B2A] shadow-2xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#12B886]" />
          <span>{current.badge}</span>
        </div>

        {/* Atla Button */}
        <button
          onClick={onGuestAccess}
          className="text-xs font-bold text-[#12B886] hover:text-[#0D1B2A] transition-colors cursor-pointer flex items-center gap-1 py-1 px-2"
        >
          <span>Atla</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 2. CUSTOM IMAGE UPLOADER SLOT / PLACEHOLDER */}
      <div className="relative my-auto py-2">
        <CustomImageSlot slideIndex={slide} />
      </div>

      {/* 3. HEADLINE & DESCRIPTION */}
      <div className="text-center space-y-2 py-2">
        <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight leading-snug">
          {current.headlinePrefix}
          <span className="text-[#12B886]">{current.headlineHighlight}</span>
          {current.headlineSuffix}
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-medium">
          {current.desc}
        </p>
      </div>

      {/* 4. FEATURE CARDS (4 OUTLINE CARDS) */}
      <div className="grid grid-cols-4 gap-2 my-2">
        {current.features.map((feat, i) => (
          <div
            key={i}
            className="bg-white rounded-[20px] p-2.5 border border-slate-100 shadow-xs flex flex-col items-center text-center gap-1 transition-all hover:border-[#12B886]/40"
          >
            <span className="text-lg leading-none">{feat.icon}</span>
            <span className="text-[11px] font-extrabold text-[#0D1B2A] leading-tight truncate w-full mt-1">
              {feat.title}
            </span>
            <span className="text-[9px] text-slate-400 font-semibold truncate w-full">
              {feat.subtitle}
            </span>
          </div>
        ))}
      </div>

      {/* 5. PAGE INDICATOR */}
      <div className="flex justify-center gap-2 py-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              slide === idx ? 'w-7 bg-[#12B886]' : 'w-2 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 6. PRIMARY BUTTON & FOOTER */}
      <div className="space-y-3 pt-1">
        <button
          onClick={() => {
            if (slide < slides.length - 1) {
              setSlide(slide + 1);
            } else {
              onComplete();
            }
          }}
          className="w-full py-4 bg-gradient-to-r from-[#0D1B2A] to-[#12B886] hover:opacity-95 text-white font-black text-sm rounded-[24px] shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{slide === slides.length - 1 ? 'Keşfetmeye Başla' : 'Devam Et'}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Footer Mission & Privacy Modal Trigger */}
        <div className="text-center pb-1">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#0D1B2A] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#12B886]" />
            <span>Misyonumuz ve Gizlilik</span>
          </button>
        </div>
      </div>

      {/* PRIVACY & MISSION MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl space-y-4 animate-scale-up border border-slate-100 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#12B886]" />
                <h3 className="font-extrabold text-sm text-[#0D1B2A]">Misyonumuz ve Gizlilik</h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                <strong className="text-[#0D1B2A] font-black">Yol Açık</strong>, tekerlekli sandalye kullanıcıları ve hareket kısıtlılığı yaşayan tüm bireylerin şehir yaşamına tam ve bağımsız katılımını hedefler.
              </p>
              <p>
                Konum verileriniz ve topluluk paylaşımlarınız KVKK standartlarına uygun olarak korunur. Konum paylaşımınızı dilediğiniz an Ayarlar sekmesinden kapatabilirsiniz.
              </p>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 bg-[#8A551C] text-white font-extrabold text-xs rounded-2xl hover:bg-[#D88A12] transition-colors cursor-pointer text-center"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Login, Register, Forgot Password                                           */
/* -------------------------------------------------------------------------- */

export const LoginView: React.FC<{
  onLoginSuccess: () => void;
  onGoRegister: () => void;
  onGoForgot: () => void;
  onGuestContinue: () => void;
}> = ({ onLoginSuccess, onGoRegister, onGoForgot, onGuestContinue }) => {
  const [email, setEmail] = useState('ikra@engelsizmekan.org');
  const [password, setPassword] = useState('******');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="bg-slate-50 min-h-screen max-w-md mx-auto flex flex-col justify-between">
      {/* Top Navy-to-Green Gradient Banner */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#0F766E] to-[#059669] p-6 pb-10 text-white rounded-b-[32px] shadow-md text-center space-y-1 flex flex-col items-center">
        <h2 className="text-2xl font-black tracking-tight text-white">YOL AÇIK</h2>
        <p className="text-xs text-teal-100 font-medium">Hayata Açılan Engelsiz Yollar • Keşif Rehberi</p>
      </div>

      <div className="p-6 -mt-6">
        {/* Main Card Container */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
          {/* Guest Login Banner Option */}
          <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 shadow-2xs space-y-2 text-center">
            <p className="text-xs font-extrabold text-teal-900">Üye olmadan denemek ister misiniz?</p>
            <button
              type="button"
              onClick={onGuestContinue}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0F172A] to-[#0D9488] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <User className="w-4 h-4 text-teal-100" />
              <span>Misafir Girişi Yap (Hızlı Keşif)</span>
            </button>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                veya üye hesabıyla girin
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">E-posta Adresi</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F172A] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Şifre</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F172A] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 cursor-pointer hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onGoForgot}
                className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer"
              >
                Şifremi Unuttum
              </button>
            </div>

            <PrimaryButton type="submit" fullWidth>
              Giriş Yap
            </PrimaryButton>
          </form>

          <div className="my-3 text-center border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-500 mb-2">Hesabınız yok mu?</p>
            <SecondaryButton onClick={onGoRegister} fullWidth>
              Yeni Hesap Oluştur
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div className="text-center pb-4 pt-2">
        <p className="text-[11px] text-slate-400">Eskişehir • Engelsiz Mekân Keşif Rehberi</p>
      </div>
    </div>
  );
};

export const RegisterView: React.FC<{ onRegisterSuccess: () => void; onGoLogin: () => void }> = ({
  onRegisterSuccess,
  onGoLogin,
}) => {
  return (
    <div className="bg-slate-50 min-h-screen max-w-md mx-auto flex flex-col justify-between">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#0F766E] to-[#059669] p-6 pb-10 text-white rounded-b-[32px] shadow-md text-center space-y-1 flex flex-col items-center">
        <h2 className="text-2xl font-black text-white">YOL AÇIK — Kayıt Ol</h2>
        <p className="text-xs text-teal-100 font-medium">Engelsiz topluluğumuza katılın ve mekân katkısında bulunun</p>
      </div>

      <div className="p-6 -mt-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRegisterSuccess();
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                placeholder="Örn: Ayşe Yılmaz"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F172A] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">E-posta Adresi</label>
              <input
                type="email"
                required
                placeholder="ornek@mail.com"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F172A] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Şifre</label>
              <input
                type="password"
                required
                placeholder="En az 6 karakter"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F172A] focus:bg-white"
              />
            </div>

            <PrimaryButton type="submit" fullWidth>
              Kayıt Ol ve Katıl
            </PrimaryButton>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <button onClick={onGoLogin} className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer">
              Zaten hesabınız var mı? Giriş Yapın
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pb-4 pt-2">
        <p className="text-[11px] text-slate-400">Eskişehir • Engelsiz Mekân Keşif Rehberi</p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Settings & Notifications                                                   */
/* -------------------------------------------------------------------------- */

export const SettingsView: React.FC<{ onBack: () => void; onOpenGoogleForms?: () => void }> = ({ onBack, onOpenGoogleForms }) => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen max-w-md mx-auto space-y-4 pb-20">
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-gray-900">Uygulama Ayarları</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-4">
        {onOpenGoogleForms && (
          <div className="p-4 bg-white rounded-2xl border border-teal-200 space-y-2">
            <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Entegrasyonlar</h3>
            <button
              onClick={onOpenGoogleForms}
              className="w-full py-2.5 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                📋 Google Formlar Yöneticisi
              </span>
              <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full">Yönet</span>
            </button>
          </div>
        )}

        <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3">
          <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">Bildirimler</h3>
          <label className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Mekân Güncelleme Bildirimleri</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#009688]" />
          </label>
          <label className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Topluluk Yorum Bildirimleri</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#009688]" />
          </label>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2 text-xs text-gray-600">
          <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-1">Hakkında</h3>
          <p>Engelsiz Mekân v2.4 (Eskişehir)</p>
          <p className="text-[11px] text-gray-400">Firebase altyapısına hazır UI Mimarisi</p>
        </div>
      </div>
    </div>
  );
};

export const NotificationsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const notifications = [
    { id: 1, title: 'Mekân Doğrulandı ✓', text: 'Eklendiğiniz Jardin Coffee saha denetçileri tarafından onaylandı.', time: '10 dk önce' },
    { id: 2, title: 'Yeni Yorum Yapıldı 💬', text: 'Ayşe Yılmaz Starbucks Kanatlı hakkındaki yorumunuzu faydalı buldu.', time: '2 saat önce' },
    { id: 3, title: 'Haftalık Erişilebilirlik Raporu', text: 'Eskişehir\'de bu hafta 12 yeni engelsiz mekan eklendi.', time: 'Dün' },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen max-w-md mx-auto space-y-4 pb-20">
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-gray-900">Bildirimler</h1>
        <div className="w-9" />
      </div>

      <div className="p-4 space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-[#009688]">{n.title}</h4>
              <span className="text-[10px] text-gray-400">{n.time}</span>
            </div>
            <p className="text-xs text-gray-700">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
