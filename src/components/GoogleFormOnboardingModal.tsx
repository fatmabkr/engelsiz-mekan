import React, { useState, useEffect } from 'react';
import { CheckCircle2, FileText, Send, Sparkles, X, ChevronRight, HelpCircle, BarChart3, ListFilter, Mail, Check, Edit3, Calendar, Clock, RefreshCw } from 'lucide-react';

export interface SavedFormResponse {
  id: string;
  date: string;
  formType: 'form1' | 'form2';
  answers: Record<number, string>;
}

interface GoogleFormOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: Record<number, string>) => void;
}

// Form 1: Ön Değerlendirme Formu (İlk Kullanım Anketi)
export const FORM_1_QUESTIONS = [
  {
    id: 1,
    question: 'Yeni bir yere gitmeden önce erişilebilirlik durumunu (rampa, asansör vb.) kontrol ederim.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
  {
    id: 2,
    question: 'Mevcut harita uygulamalarında filtreleme özelliklerini (rampa, asansör vb.) net ve güncel buluyorum.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
  {
    id: 3,
    question: "Sadece 'erişilebilir' denmesi yetmez; kapı, rampa ve tuvalet gibi detayları tek tek görmek isterim.",
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
  {
    id: 4,
    question: 'Kullanıcıların fotoğraf ve yorumları, mekan hakkındaki bilgilere olan güvenimi pekiştirir.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
];

// Form 2: 1 Hafta Sonraki Değerlendirme Formu (Son Değerlendirme Formu)
export const FORM_2_QUESTIONS = [
  {
    id: 1,
    question: 'Uygulama üzerinden mekân araması yapmak, dışarı çıkış planlarımı kolaylaştırdı.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
  {
    id: 2,
    question: 'Mekân detaylarında sunulan fotoğraflar ve ölçütler (rampa, kapı, tuvalet vb.) gerçek durumla örtüşüyordu.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
  {
    id: 3,
    question: 'Topluluğun paylaştığı fotoğraf ve yorumlar, mekanlara gitme kararıma yardımcı oldu.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
  {
    id: 4,
    question: 'Uygulamanın harita arayüzü ve navigasyonu, aradığım erişilebilir mekânları harita üzerinde rahatça bulmamı sağladı.',
    options: [
      'Kesinlikle Katılıyorum',
      'Katılıyorum',
      'Kararsızım',
      'Katılmıyorum',
      'Kesinlikle Katılmıyorum',
    ],
  },
];

export const GoogleFormOnboardingModal: React.FC<GoogleFormOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [activeFormType, setActiveFormType] = useState<'form1' | 'form2'>('form1');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'form' | 'responses'>('form');
  const [allResponses, setAllResponses] = useState<SavedFormResponse[]>([]);

  const [targetEmail, setTargetEmail] = useState<string>(() => {
    return localStorage.getItem('google_form_target_email') || 'stempower26@gmail.com';
  });
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Check 1-week status
  const [firstUseDate, setFirstUseDate] = useState<number>(() => {
    const saved = localStorage.getItem('user_first_app_use_timestamp');
    if (saved) return Number(saved);
    const now = Date.now();
    localStorage.setItem('user_first_app_use_timestamp', String(now));
    return now;
  });

  const daysSinceFirstUse = Math.floor((Date.now() - firstUseDate) / (1000 * 60 * 60 * 24));
  const isOneWeekElapsed = daysSinceFirstUse >= 7 || localStorage.getItem('simulate_one_week') === 'true';

  useEffect(() => {
    if (isOpen) {
      loadSavedResponses();
      setSubmitted(false);
      setViewTab('form');
      setAnswers({});
      setErrorMsg(null);
      setEmailSuccessMsg(null);

      // Default to Form 2 if 1 week has passed or simulated
      if (isOneWeekElapsed) {
        setActiveFormType('form2');
      } else {
        setActiveFormType('form1');
      }
    }
  }, [isOpen]);

  const currentQuestions = activeFormType === 'form2' ? FORM_2_QUESTIONS : FORM_1_QUESTIONS;

  const toggleSimulateOneWeek = () => {
    const currentSim = localStorage.getItem('simulate_one_week') === 'true';
    if (currentSim) {
      localStorage.removeItem('simulate_one_week');
      setActiveFormType('form1');
    } else {
      localStorage.setItem('simulate_one_week', 'true');
      setActiveFormType('form2');
    }
  };

  const handleSaveEmail = (newEmail: string) => {
    setTargetEmail(newEmail);
    localStorage.setItem('google_form_target_email', newEmail);
    setIsEditingEmail(false);
  };

  const handleSendEmailReport = (customEmail?: string) => {
    const recipient = customEmail || targetEmail;

    localStorage.setItem('google_form_target_email', recipient);

    const filteredResponses = allResponses.filter((r) => r.formType === activeFormType || !r.formType);
    const totalCount = filteredResponses.length;

    const formTitleText = activeFormType === 'form2' 
      ? '1 Hafta Sonraki Değerlendirme Formu (Son Değerlendirme)' 
      : 'Ön Değerlendirme Formu (İlk Giriş Anketi)';

    let bodyText = `Yol Açık - Google Form Erişilebilirlik Anket Raporu\n`;
    bodyText += `Form Tipi: ${formTitleText}\n`;
    bodyText += `--------------------------------------------------\n`;
    bodyText += `Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}\n`;
    bodyText += `Hedef Alıcı E-Posta: ${recipient}\n`;
    bodyText += `Toplam Toplanan Yanıt Sayısı: ${totalCount}\n\n`;

    currentQuestions.forEach((q) => {
      bodyText += `Soru ${q.id}: ${q.question}\n`;
      q.options.forEach((opt) => {
        const count = filteredResponses.filter((r) => r.answers[q.id] === opt).length;
        const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        bodyText += `  - ${opt}: ${count} kişi (%${pct})\n`;
      });
      bodyText += `\n`;
    });

    bodyText += `\nDetaylı bilgi için Yol Açık uygulamasını ziyaret edebilirsiniz.`;

    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
      `Yol Açık - ${formTitleText} Yanıt Raporu`
    )}&body=${encodeURIComponent(bodyText)}`;

    window.open(mailtoUrl, '_blank');

    setEmailSuccessMsg(`Anket yanıtları ve özet raporu "${recipient}" adresine e-posta olarak hazırlandı ve iletildi.`);
    setTimeout(() => {
      setEmailSuccessMsg(null);
    }, 6000);
  };

  const loadSavedResponses = () => {
    try {
      const stored = localStorage.getItem('google_form_survey_responses');
      if (stored) {
        setAllResponses(JSON.parse(stored));
      } else {
        const sample: SavedFormResponse[] = [
          {
            id: 'resp-demo-1',
            date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            formType: 'form1',
            answers: {
              1: 'Kesinlikle Katılıyorum',
              2: 'Katılmıyorum',
              3: 'Kesinlikle Katılıyorum',
              4: 'Kesinlikle Katılıyorum',
            },
          },
          {
            id: 'resp-demo-2',
            date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            formType: 'form2',
            answers: {
              1: 'Kesinlikle Katılıyorum',
              2: 'Katılıyorum',
              3: 'Kesinlikle Katılıyorum',
              4: 'Katılıyorum',
            },
          },
        ];
        setAllResponses(sample);
      }
    } catch {
      setAllResponses([]);
    }
  };

  if (!isOpen) return null;

  const handleSelectOption = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = currentQuestions.filter((q) => !answers[q.id]);
    if (missing.length > 0) {
      setErrorMsg(`Lütfen tüm soruları yanıtlayın. (${missing.length} yanıtlanmamış soru)`);
      return;
    }

    const newRecord: SavedFormResponse = {
      id: 'resp-' + Date.now(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      formType: activeFormType,
      answers,
    };

    const updated = [newRecord, ...allResponses];
    setAllResponses(updated);
    localStorage.setItem('google_form_survey_responses', JSON.stringify(updated));
    localStorage.setItem('hasCompletedGoogleFormSurvey', 'true');

    setSubmitted(true);
  };

  const handleFinish = () => {
    localStorage.setItem('hasCompletedGoogleFormSurvey', 'true');
    onComplete(answers);
    onClose();
  };

  const responsesForActiveForm = allResponses.filter((r) => r.formType === activeFormType || !r.formType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="w-full max-w-md bg-[#F0EBF8] rounded-2xl shadow-2xl overflow-hidden border border-purple-200/80 my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Google Forms Purple Top Header Bar */}
        <div className="bg-[#673AB7] text-white px-5 py-3.5 relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-purple-200">
                <span>Google Formları</span>
                <span>•</span>
                <span>{activeFormType === 'form2' ? '1 Hafta Sonraki Form' : 'İlk Kullanım Formu'}</span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                {activeFormType === 'form2' ? 'Son Değerlendirme Formu' : 'Ön Değerlendirme Formu'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-purple-100 hover:text-white cursor-pointer"
            title="Formu Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Tab Switcher: Sorular / Yanıtlar */}
        <div className="bg-white border-b border-purple-100 px-4 flex items-center justify-between text-xs font-bold text-slate-600 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewTab('form')}
              className={`py-2.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                viewTab === 'form'
                  ? 'border-[#673AB7] text-[#673AB7]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sorular</span>
            </button>
            <button
              onClick={() => setViewTab('responses')}
              className={`py-2.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                viewTab === 'responses'
                  ? 'border-[#673AB7] text-[#673AB7]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Yanıtlar ({responsesForActiveForm.length})</span>
            </button>
          </div>

          <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            {activeFormType === 'form2' ? '1 Hafta Değerlendirmesi' : 'Ön Anket'}
          </span>
        </div>

        {/* Form Body Scrollable Area */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">

          {viewTab === 'responses' ? (
            /* Responses Summary & Data Table */
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#673AB7]" />
                    {activeFormType === 'form2' ? '1 Hafta Sonraki Form Yanıtları' : 'Ön Değerlendirme Form Yanıtları'}
                  </h3>
                  <span className="px-2.5 py-1 bg-purple-50 text-[#673AB7] text-xs font-bold rounded-full border border-purple-100">
                    Toplam {responsesForActiveForm.length} Yanıt
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Form yanıtları veritabanında saklanır ve belirlenen e-posta adresine özet rapor olarak gönderilir.
                </p>
              </div>

              {/* Email Recipient & Share Card */}
              <div className="bg-white rounded-xl border border-purple-100 p-3.5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg text-[#673AB7]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">E-posta Bildirim Alıcısı</h4>
                      <p className="text-[10px] text-slate-500">Raporlar bu e-posta adresine gönderilir</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                    className="text-xs font-semibold text-[#673AB7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingEmail ? 'Kapat' : 'Düzenle'}</span>
                  </button>
                </div>

                {isEditingEmail ? (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="email"
                      value={targetEmail}
                      onChange={(e) => setTargetEmail(e.target.value)}
                      placeholder="Örn: stempower26@gmail.com"
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-purple-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleSaveEmail(targetEmail)}
                      className="px-3 py-1.5 bg-[#673AB7] text-white text-xs font-bold rounded-lg hover:bg-[#5e35b1] transition-colors cursor-pointer"
                    >
                      Kaydet
                    </button>
                  </div>
                ) : (
                  <div className="p-2 bg-purple-50/60 rounded-lg flex items-center justify-between text-xs border border-purple-100">
                    <span className="font-semibold text-purple-950 truncate">{targetEmail}</span>
                    <span className="text-[10px] text-purple-700 font-medium bg-purple-100/70 px-2 py-0.5 rounded-md shrink-0 ml-2">Hedef E-posta</span>
                  </div>
                )}

                <button
                  onClick={() => handleSendEmailReport()}
                  className="w-full py-2 bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yanıtları E-posta ile Gönder</span>
                </button>

                {emailSuccessMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{emailSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Question Summaries */}
              {currentQuestions.map((q) => {
                const countMap: Record<string, number> = {};
                q.options.forEach((opt) => (countMap[opt] = 0));
                responsesForActiveForm.forEach((r) => {
                  const val = r.answers[q.id];
                  if (val && countMap[val] !== undefined) {
                    countMap[val] += 1;
                  }
                });

                return (
                  <div key={q.id} className="bg-white rounded-xl border border-purple-100 p-4 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {q.id}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const count = countMap[opt] || 0;
                        const pct = responsesForActiveForm.length > 0 ? Math.round((count / responsesForActiveForm.length) * 100) : 0;
                        return (
                          <div key={opt} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-medium text-slate-700">
                              <span>{opt}</span>
                              <span className="font-bold text-purple-900">{count} yanıt (%{pct})</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#673AB7] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Individual Submitted Records */}
              <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ListFilter className="w-4 h-4 text-purple-600" />
                  Son Gönderilen Kayıtlar ({activeFormType === 'form2' ? '1 Hafta Formu' : 'Ön Form'})
                </h4>
                {responsesForActiveForm.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Henüz kayıtlı yanıt bulunmuyor.</p>
                ) : (
                  <div className="space-y-2">
                    {responsesForActiveForm.map((resp, idx) => (
                      <div key={resp.id} className="p-2.5 bg-purple-50/50 rounded-lg text-xs space-y-1 border border-purple-100">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-purple-950">Yanıt #{responsesForActiveForm.length - idx}</span>
                          <span className="text-slate-400">{resp.date}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                          {currentQuestions.map((q) => (
                            <p key={q.id}><strong>{q.id}. Soru:</strong> {resp.answers[q.id] || '-'}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <span>Uygulamaya Devam Et</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : submitted ? (
            /* Submitted Success Screen */
            <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 text-center space-y-4 my-4">
              <div className="w-14 h-14 bg-purple-50 text-[#673AB7] rounded-full flex items-center justify-center mx-auto border border-purple-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {activeFormType === 'form2' ? '1 Hafta Sonraki Değerlendirmeniz Alındı' : 'Yanıtınız Kaydedildi'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeFormType === 'form2'
                    ? '1 haftalık deneyiminiz hakkındaki değerli görüşleriniz için teşekkür ederiz. İyileştirme önerileriniz rehberimize katkı sağlayacaktır.'
                    : 'Erişilebilirlik beklentilerinizi bizimle paylaştığınız için teşekkür ederiz.'}
                </p>
              </div>

              <div className="p-3 bg-purple-50/70 rounded-lg text-left text-xs space-y-1.5 border border-purple-100">
                <p className="font-semibold text-purple-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Görüşleriniz Başarıyla Alındı
                </p>
                <p className="text-slate-600 text-[11px]">
                  Yanıtlarınız kaydedildi. Yanıtları e-posta adresinize gönderebilir veya tüm sonuçları grafiksel olarak inceleyebilirsiniz.
                </p>
              </div>

              {/* Email Send Button on Success */}
              <button
                onClick={() => handleSendEmailReport()}
                className="w-full py-2.5 bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Yanıtları E-Posta ile Gönder ({targetEmail})</span>
              </button>

              {emailSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-semibold flex items-center gap-2 text-left">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{emailSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setViewTab('responses')}
                  className="w-full py-2.5 bg-purple-100 hover:bg-purple-200 text-[#673AB7] font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Sonuçları ve Tüm Yanıtları Gör</span>
                </button>

                <button
                  onClick={handleFinish}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <span>Uygulamaya Başla</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Top Description Card */}
              <div className="bg-white rounded-xl border-t-[8px] border-t-[#673AB7] border-x border-b border-purple-100 p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-[#673AB7] text-[10px] font-bold rounded-full">
                    {activeFormType === 'form2' ? '2. Değerlendirme (1 Hafta Kullanım)' : '1. Değerlendirme (İlk Giriş)'}
                  </span>
                  {isOneWeekElapsed && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 1 Hafta Doldu
                    </span>
                  )}
                </div>

                <h1 className="text-base font-bold text-slate-900">
                  {activeFormType === 'form2'
                    ? '1 Hafta Sonraki Değerlendirme Formu'
                    : 'Hoş Geldiniz! İlk Kullanım Anket Formu'}
                </h1>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeFormType === 'form2'
                    ? 'Uygulamayı 1 hafta boyunca kullandıktan sonraki mekân aramaları, fotoğraflar ve harita navigasyonu deneyiminizi değerlendirin.'
                    : 'Yol Açık platformuna hoş geldiniz. Uygulama deneyiminizi kişiselleştirmek ve şehir içi erişilebilirliği iyileştirmek için lütfen aşağıdaki soruları yanıtlayın.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-red-600 font-medium">
                  <span>* Gerekli alanları belirtir</span>
                  <span className="text-purple-700 font-semibold">{Object.keys(answers).length} / {currentQuestions.length} Tamamlandı</span>
                </div>
              </div>

              {/* Validation Error Notice */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Question Cards */}
              {currentQuestions.map((q) => {
                const isAnswered = Boolean(answers[q.id]);
                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                      errorMsg && !isAnswered
                        ? 'border-red-300 ring-1 ring-red-200'
                        : isAnswered
                        ? 'border-purple-200'
                        : 'border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start gap-1.5 mb-3">
                      <span className="text-sm font-bold text-purple-700">{q.id}.</span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {q.question} <span className="text-red-500 font-bold">*</span>
                      </p>
                    </div>

                    <div className="space-y-2 pl-4">
                      {q.options.map((option) => {
                        const isSelected = answers[q.id] === option;
                        return (
                          <label
                            key={option}
                            onClick={() => handleSelectOption(q.id, option)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs font-medium ${
                              isSelected
                                ? 'bg-purple-50 text-purple-950 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? 'border-[#673AB7] bg-[#673AB7]'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Submit Button Row */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Daha Sonra Doldur
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#673AB7] hover:bg-[#5e35b1] text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yanıtları Gönder</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Footer Branding */}
        <div className="bg-purple-100/60 border-t border-purple-200/60 px-4 py-2 text-center shrink-0">
          <p className="text-[10px] text-purple-900/80 font-medium">
            Bu içerik Google Formlar altyapısı ile oluşturulmuştur • Yol Açık Engelsiz Kent Rehberi
          </p>
        </div>

      </div>
    </div>
  );
};

