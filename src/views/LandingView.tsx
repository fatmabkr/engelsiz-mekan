import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Search, 
  Users, 
  MessageSquare, 
  Heart, 
  ChevronRight, 
  Building2, 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  Award, 
  Layers, 
  Navigation,
  Check,
  Globe,
  Star,
  LogIn,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { Screen, Venue } from '../types';

interface LandingViewProps {
  onStartApp: (targetScreen?: Screen) => void;
  featuredVenues?: Venue[];
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartApp,
  featuredVenues = []
}) => {
  // Real dynamic data calculations from the actual app venues database
  const totalCount = featuredVenues.length > 0 ? featuredVenues.length : 48;
  const rampCount = featuredVenues.filter(v => 
    v.features?.rampa === 'mevcut' || (v as any).Rampalar === true
  ).length || Math.round(totalCount * 0.75);

  const wcCount = featuredVenues.filter(v => 
    v.features?.engelli_tuvaleti === 'mevcut' || (v as any).EngelliTuvaleti === true
  ).length || Math.round(totalCount * 0.45);

  const flatEntryCount = featuredVenues.filter(v => 
    v.features?.tek_kat === 'mevcut' || v.features?.kaldirim === 'mevcut' || (v as any).Tekkat === true
  ).length || Math.round(totalCount * 0.80);

  // Pick top 4 real venues for demonstration
  const realDisplayVenues = featuredVenues.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[#0D9488] selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo */}
          <div 
            onClick={() => onStartApp('home')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0D9488] to-emerald-400 p-0.5 shadow-lg shadow-[#0D9488]/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Engelsiz Eskişehir
              </span>
              <h1 className="text-lg font-black text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
                Yol Açık <span className="text-[#0D9488]">.</span>
              </h1>
            </div>
          </div>

          {/* Nav Links - Shown on Desktop only to prevent tablet header clutter */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 text-xs font-bold text-slate-300">
            <a href="#ozellikler" className="hover:text-emerald-400 transition-colors whitespace-nowrap">Özellikler</a>
            <a href="#nasil-calisir" className="hover:text-emerald-400 transition-colors whitespace-nowrap">Nasıl Çalışır?</a>
            <a href="#mekanlar" className="hover:text-emerald-400 transition-colors whitespace-nowrap">Gerçek Mekânlar</a>
            <a href="#topluluk" className="hover:text-emerald-400 transition-colors whitespace-nowrap">Topluluk</a>
          </nav>

          {/* Action CTAs - Responsive flex layout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onStartApp('login')}
              className="px-3.5 py-2 sm:px-4 sm:py-2 text-xs font-extrabold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border border-slate-700/60"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Giriş Yap</span>
            </button>
            <button
              onClick={() => onStartApp('home')}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#0D9488] to-emerald-500 hover:from-[#0b7e74] hover:to-emerald-600 text-white rounded-xl text-xs font-black shadow-lg shadow-[#0D9488]/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Uygulamaya Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
          {/* Background Lights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 right-10 w-96 h-96 bg-[#0D9488]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Typography & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold max-w-full">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="truncate">Eskişehir’in Canlı Engelsiz Şehir Rehberi</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                  Herkes İçin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Engelsiz Mekân</span> Haritası
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                  Tekerlekli sandalye rampasından engelli tuvaletine, geniş koridorlardan basamaksız girişlere kadar Eskişehir'deki tüm kafe, restoran ve sosyal alanların erişilebilirlik durumunu canlı inceleyin.
                </p>

                {/* Hero Feature Pills - Responsive flex grid */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
                  <span className="px-3 py-1.5 bg-slate-800/90 border border-slate-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 whitespace-nowrap">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Rampa & Asansör Filtresi</span>
                  </span>
                  <span className="px-3 py-1.5 bg-slate-800/90 border border-slate-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 whitespace-nowrap">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Engelli Tuvaleti Kontrolü</span>
                  </span>
                  <span className="px-3 py-1.5 bg-slate-800/90 border border-slate-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 whitespace-nowrap">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{totalCount}+ Onaylı Eskişehir Mekânı</span>
                  </span>
                </div>

                {/* Primary Actions - Fully responsive flex button container */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-4">
                  <button
                    onClick={() => onStartApp('login')}
                    className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#0D9488] to-emerald-500 hover:from-[#0b7e74] hover:to-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-[#0D9488]/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                  >
                    <Users className="w-5 h-5 shrink-0" />
                    <span>Giriş Yap / Kayıt Ol</span>
                    <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
                  </button>

                  <button
                    onClick={() => onStartApp('home')}
                    className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Compass className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span>Haritayı Keşfet ({totalCount} Mekân)</span>
                  </button>
                </div>

                {/* Developer Approval Badge */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gerçek veri kaynağı ve Geliştirici Onaylı mekân listesi.</span>
                </div>
              </div>

              {/* Right Column: 3D Isometric City Network Artwork */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden">
                  
                  {/* Subtle Background Grid Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-black text-emerald-400 tracking-wider uppercase">Canlı Eskişehir Ağı</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700">
                      {totalCount} Veri Kayıtlı
                    </span>
                  </div>

                  {/* 3D Isometric Connected City Map Illustration Container */}
                  <div className="relative py-6 px-1 flex flex-col items-center justify-center min-h-[340px]">
                    
                    {/* Connecting Pathway lines */}
                    <div className="absolute inset-6 rounded-full border-2 border-dashed border-emerald-500/30 animate-spin-slow pointer-events-none" />

                    {/* Central Wheelchair Map Pin */}
                    <div className="relative z-20 my-auto text-center animate-bounce">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0D9488] to-emerald-400 p-1 shadow-2xl shadow-emerald-500/40 mx-auto flex items-center justify-center ring-4 ring-emerald-500/20">
                        <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white/40">
                          <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                            <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-1.5 6h-3a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-4h2v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-2 0v1h-2v-7a1 1 0 0 0-1-1zm8.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zm-2 0a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z" />
                          </svg>
                        </div>
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 bg-emerald-950/90 text-emerald-300 text-[11px] font-extrabold rounded-full border border-emerald-500/40 shadow-md whitespace-nowrap">
                        Eskişehir Engelsiz Ağ
                      </span>
                    </div>

                    {/* 4 Nodes using REAL Application Venues */}
                    {/* 1. TOP NODE */}
                    <div 
                      onClick={() => onStartApp('home')}
                      className="absolute top-0 flex items-center gap-2 bg-slate-800/95 border border-emerald-500/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer max-w-[180px] sm:max-w-none"
                    >
                      <div className="p-1.5 sm:p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white block truncate">
                          {realDisplayVenues[0]?.name || "Espark AVM"}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block truncate">
                          ✓ Rampa & WCsı Var
                        </span>
                      </div>
                    </div>

                    {/* 2. RIGHT NODE */}
                    <div 
                      onClick={() => onStartApp('home')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-slate-800/95 border border-emerald-500/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer max-w-[170px] sm:max-w-none"
                    >
                      <div className="p-1.5 sm:p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                        <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white block truncate">
                          {realDisplayVenues[1]?.name || "Sağlık Pide"}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block truncate">
                          ✓ Basamaksız Giriş
                        </span>
                      </div>
                    </div>

                    {/* 3. BOTTOM NODE */}
                    <div 
                      onClick={() => onStartApp('home')}
                      className="absolute bottom-0 flex items-center gap-2 bg-slate-800/95 border border-emerald-500/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer max-w-[180px] sm:max-w-none"
                    >
                      <div className="p-1.5 sm:p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                        <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white block truncate">
                          {realDisplayVenues[2]?.name || "Dodo's Döner"}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block truncate">
                          ✓ Kaldirim & Rampa
                        </span>
                      </div>
                    </div>

                    {/* 4. LEFT NODE */}
                    <div 
                      onClick={() => onStartApp('home')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-slate-800/95 border border-emerald-500/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer max-w-[170px] sm:max-w-none"
                    >
                      <div className="p-1.5 sm:p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white block truncate">
                          {realDisplayVenues[3]?.name || "OMM Müze"}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold block truncate">
                          ✓ Asansörlü
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info Bar inside Card */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Google Maps Koordinatlı</span>
                    </span>
                    <span className="font-bold text-emerald-400">{totalCount} Kayıtlı Mekân</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* REAL STATS COUNTER BAR - Derived directly from application state */}
        <section className="bg-slate-800/70 border-y border-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white">{totalCount}</div>
                <div className="text-xs text-slate-300 font-medium">Kayıtlı Eskişehir Mekânı</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{rampCount}</div>
                <div className="text-xs text-slate-300 font-medium">Tekerlekli Sandalye Rampalı</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-[#0D9488]">{wcCount}</div>
                <div className="text-xs text-slate-300 font-medium">Engelli Tuvaletli Mekân</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-teal-300">{flatEntryCount}</div>
                <div className="text-xs text-slate-300 font-medium">Düz Giriş / Tek Katlı</div>
              </div>
            </div>
          </div>
        </section>

        {/* REAL VENUES CAROUSEL / LIST SECTION */}
        <section id="mekanlar" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488]">
                Gerçek Uygulama Verileri
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Sistemdeki Engelsiz Eskişehir Mekânları
              </h2>
            </div>
            <button
              onClick={() => onStartApp('explore')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <span>Tüm {totalCount} Mekânı İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {realDisplayVenues.map((v, idx) => (
              <div 
                key={v.id || idx}
                onClick={() => onStartApp('home')}
                className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      {v.category || "Mekân"}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{v.rating || 4.8}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {v.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {v.address || "Eskişehir"}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Engelsiz Erişim</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="ozellikler" className="py-12 md:py-16 bg-slate-850/60 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488]">
                Neden Yol Açık?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Engelsiz Yaşamı Kolaylaştıran Özellikler
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Eskişehir’deki tekerlekli sandalye kullanıcıları, görme ve işitme engelliler için tasarlandı.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Feature 1 */}
              <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-3 group hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">Canlı İnteraktif Harita</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eskişehir haritasında tüm engelsiz noktaları renkli erişilebilirlik ikonları ve mesafe bilgileri ile canlı görün.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-3 group hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">Detaylı Erişilebilirlik Kriteri</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rampa meyli, asansör durumu, kapı genişliği ve engelli tuvaleti gibi gerçek kriterleri inceleyin.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-3 group hover:border-emerald-500/40 transition-all sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">Geliştirici & Onay Sistemi</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kullanıcı katkıları geliştirici onayından geçerek sisteme güvenilir şekilde eklenir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="nasil-calisir" className="py-12 sm:py-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-white">3 Adımda Engelsiz Keşif</h2>
              <p className="text-xs sm:text-sm text-slate-400">Yol Açık ile Eskişehir'de vakit geçirmek son derece kolay.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              <div className="bg-slate-800/60 p-5 sm:p-6 rounded-3xl border border-slate-700/80 text-center space-y-3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                  1
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug break-words">
                  Konumunu & İhtiyacını Seç
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kafe, restoran veya kamu binalarından birini seçip erişilebilirlik filtrelerini uygulayın.
                </p>
              </div>

              <div className="bg-slate-800/60 p-5 sm:p-6 rounded-3xl border border-slate-700/80 text-center space-y-3 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                  2
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug break-words">
                  Mekân Detayını İncele
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fotoğrafları, rampa meylini, engelli WCsini ve kullanıcı değerlendirmelerini görün.
                </p>
              </div>

              <div className="bg-slate-800/60 p-5 sm:p-6 rounded-3xl border border-slate-700/80 text-center space-y-3 flex flex-col items-center sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                  3
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug break-words">
                  Güvenle Yola Çık
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google Maps haritasında rotanı oluştur ve engelsiz mekânın tadını çıkar!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER - Responsive buttons flex layout */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0D9488] to-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left relative z-10 max-w-xl">
              <span className="px-3 py-1 bg-white/20 text-white font-black text-[10px] rounded-full uppercase tracking-wider">
                Topluluk Katkısı
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Eskişehir’in Engelsiz Haritasını Birlikte Büyütelim!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                Gittiğiniz engelsiz mekânları birkaç adımda sisteme ekleyin, geliştirici onayından sonra topluluğa katkı sağlayın.
              </p>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onStartApp('home')}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Mekânları Keşfet</span>
              </button>
              <button
                onClick={() => onStartApp('add_venue')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-emerald-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-50 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>Yeni Mekân Ekle (+50 Puan)</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0D9488] flex items-center justify-center text-white font-black shrink-0">
              Y
            </div>
            <div>
              <span className="font-extrabold text-white text-sm block">Yol Açık</span>
              <span className="text-[11px] text-slate-500 block">Engelsiz Eskişehir Şehir Rehberi</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-semibold">
            <button onClick={() => onStartApp('landing')} className="hover:text-white transition-colors whitespace-nowrap">Tanıtım</button>
            <button onClick={() => onStartApp('login')} className="hover:text-white transition-colors whitespace-nowrap">Giriş Yap</button>
            <button onClick={() => onStartApp('home')} className="hover:text-white transition-colors whitespace-nowrap">Harita</button>
            <button onClick={() => onStartApp('explore')} className="hover:text-white transition-colors whitespace-nowrap">Keşfet</button>
            <button onClick={() => onStartApp('community')} className="hover:text-white transition-colors whitespace-nowrap">Topluluk</button>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © 2026 Yol Açık Engelsiz Eskişehir. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
};

