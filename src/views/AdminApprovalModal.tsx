import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Building2, 
  X, 
  Check, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { Venue } from '../types';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingVenues: Venue[];
  approvedVenues: Venue[];
  rejectedVenues: Venue[];
  onApproveVenue: (venueId: string) => void;
  onRejectVenue: (venueId: string, reason?: string) => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  pendingVenues,
  approvedVenues,
  rejectedVenues,
  onApproveVenue,
  onRejectVenue,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  if (!isOpen) return null;

  const handleConfirmReject = (venueId: string) => {
    onRejectVenue(venueId, rejectionReasonInput || 'Geliştirici onayı alamadı.');
    setRejectingId(null);
    setRejectionReasonInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#0F172A] text-white px-5 py-4 relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                <span>Geliştirici / Yönetici Modu</span>
                <span>•</span>
                <span>Mekân Onay Paneli</span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                Mekân Başvuru Onayları
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 text-xs text-slate-700 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Kullanıcılar tarafından eklenen mekânlar onayınız olmadan ana harita ve keşfet listesinde <strong>yayınlanmaz</strong>.
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white px-3 shrink-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'border-[#0D9488] text-[#0D9488]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Bekleyenler ({pendingVenues.length})</span>
            {pendingVenues.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'approved'
                ? 'border-[#0D9488] text-[#0D9488]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Onaylananlar ({approvedVenues.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'rejected'
                ? 'border-[#0D9488] text-[#0D9488]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Reddedilenler ({rejectedVenues.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'pending' && (
            <>
              {pendingVenues.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Onay Bekleyen Başvuru Yok</h3>
                  <p className="text-xs text-slate-500">
                    Tüm yeni mekân ekleme talepleri incelendi ve işlem yapıldı.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="bg-white rounded-2xl border-2 border-amber-200/90 shadow-sm p-4 space-y-3 hover:border-amber-400 transition-all"
                    >
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-950 text-[10px] font-extrabold rounded-full inline-block mb-1">
                            ⏳ Onay Bekliyor
                          </span>
                          <h3 className="font-extrabold text-base text-slate-900">{venue.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{venue.address || `${venue.district}, Eskişehir`}</span>
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shrink-0">
                          {venue.categoryLabel || venue.category}
                        </span>
                      </div>

                      {/* Google Maps Coordinates Status */}
                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Google Maps Koordinatları:</span>
                          <span className="font-bold">
                            {venue.coordinates?.lat.toFixed(4)}, {venue.coordinates?.lng.toFixed(4)}
                          </span>
                        </div>
                        {venue.googleMapsUrl && (
                          <a
                            href={venue.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                          >
                            <span>Haritada Aç</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Accessibility Features Summary */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                          Erişilebilirlik Özellikleri:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(venue.features || {}).map(([key, val]) => {
                            if (val === 'mevcut') {
                              return (
                                <span key={key} className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded-md text-[10px]">
                                  ✓ {key}
                                </span>
                              );
                            }
                            return null;
                          })}
                          {Object.values(venue.features || {}).filter(v => v === 'mevcut').length === 0 && (
                            <span className="text-slate-400 text-[11px]">Belirtilmedi</span>
                          )}
                        </div>
                      </div>

                      {/* Submitter Description */}
                      {venue.description && (
                        <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 italic">
                          "{venue.description}"
                        </p>
                      )}

                      {/* Rejecting Form Overlay or Buttons */}
                      {rejectingId === venue.id ? (
                        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 space-y-2 animate-in fade-in">
                          <label className="text-xs font-bold text-rose-900 block">
                            Mekânı Reddetme Nedeni:
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Yetersiz adres veya gerçek dışı konum beyanı"
                            value={rejectionReasonInput}
                            onChange={(e) => setRejectionReasonInput(e.target.value)}
                            className="w-full p-2 text-xs bg-white border border-rose-300 rounded-lg focus:outline-none"
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setRejectingId(null)}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={() => handleConfirmReject(venue.id)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Reddi Onayla
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                          <button
                            onClick={() => setRejectingId(venue.id)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reddet</span>
                          </button>

                          <button
                            onClick={() => onApproveVenue(venue.id)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>✓ Onayla ve Yayına Al</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'approved' && (
            <div className="space-y-3">
              {approvedVenues.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Henüz onaylanmış mekân başvurusu bulunmuyor.</p>
              ) : (
                approvedVenues.map((v) => (
                  <div key={v.id} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900">{v.name}</span>
                      <p className="text-[11px] text-slate-500">{v.address}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">
                      YAYINDA
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rejected' && (
            <div className="space-y-3">
              {rejectedVenues.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Reddedilen mekân başvurusu bulunmuyor.</p>
              ) : (
                rejectedVenues.map((v) => (
                  <div key={v.id} className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-slate-900">{v.name}</span>
                      <p className="text-[11px] text-slate-500">Neden: {v.rejectionReason || 'Onay verilmedi'}</p>
                    </div>
                    <span className="px-2 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px]">
                      REDDEDİLDİ
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>Geliştirici modundasınız. Değişiklikler anında kaydedilir.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-800"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
