import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Trash2,
  FileText
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logoutGoogle } from '../lib/googleAuth';
import { 
  listFormsFromDrive, 
  createGoogleForm, 
  addQuestionsToGoogleForm, 
  getFormDetails,
  getFormResponses,
  GoogleDriveFormFile,
  FormQuestionItem,
  GoogleFormDetails,
  GoogleFormResponsesResponse
} from '../services/googleFormsService';

interface GoogleFormsViewProps {
  onBack: () => void;
}

const TEMPLATES: Array<{
  id: string;
  title: string;
  description: string;
  questions: FormQuestionItem[];
}> = [
  {
    id: 'venue_report',
    title: 'Engelsiz Mekân Bildirim Formu',
    description: 'Vatandaşların eksik veya erişilebilir mekânları bildirmesi için hazır anket.',
    questions: [
      { title: 'Bildirmek istediğiniz mekânın adı nedir?', type: 'TEXT', required: true },
      { title: 'Mekânın adresi / ilçesi', type: 'TEXT', required: true },
      { title: 'Tekerlekli sandalye rampası var mı?', type: 'RADIO', options: ['Mevcut', 'Mevcut Değil', 'Kısmen / Dik Rampa'], required: true },
      { title: 'Engelli tuvaleti erişilebilir mi?', type: 'RADIO', options: ['Evet, tam erişilebilir', 'Hayır', 'Bilinmiyor'], required: true },
      { title: 'Ek Açıklamalar ve Öneriler', type: 'TEXT', required: false }
    ]
  },
  {
    id: 'feedback_survey',
    title: 'Şehir Erişilebilirlik Anket Formu',
    description: 'Bölgenizdeki kaldırım, rampa ve toplu taşıma erişilebilirliğini değerlendirin.',
    questions: [
      { title: 'Yaşadığınız veya ziyaret ettiğiniz ilçe', type: 'TEXT', required: true },
      { title: 'Kaldırımların tekerlekli sandalye için uygunluğu', type: 'RADIO', options: ['Çok İyi', 'Orta', 'Çok Kötü / Yetersiz'], required: true },
      { title: 'Hangi alanlarda en çok zorluk yaşıyorsunuz?', type: 'CHECKBOX', options: ['Rampa Eksikliği', 'Erişilemez Tuvalet', 'Yüksek Kaldırımlar', 'Asansör Arızaları'], required: true },
      { title: 'Erişilebilirlik puanınız (1 - 5)', type: 'RADIO', options: ['1 - Çok Yetersiz', '2', '3', '4', '5 - Mükemmel'], required: true }
    ]
  }
];

export const GoogleFormsView: React.FC<GoogleFormsViewProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Forms state
  const [forms, setForms] = useState<GoogleDriveFormFile[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_forms' | 'templates' | 'custom'>('my_forms');

  // Custom Form Builder state
  const [customTitle, setCustomTitle] = useState('');
  const [customQuestions, setCustomQuestions] = useState<FormQuestionItem[]>([
    { title: 'Mekân Adı', type: 'TEXT', required: true },
    { title: 'Erişilebilirlik Durumu', type: 'RADIO', options: ['Tam Erişilebilir', 'Kısmen', 'Erişilemez'], required: true }
  ]);

  // Modal / Confirm state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormToCreate, setPendingFormToCreate] = useState<{
    title: string;
    questions: FormQuestionItem[];
  } | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [createdFormSuccess, setCreatedFormSuccess] = useState<GoogleFormDetails | null>(null);

  // Selected Form Details & Responses modal
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedFormDetails, setSelectedFormDetails] = useState<GoogleFormDetails | null>(null);
  const [selectedFormResponses, setSelectedFormResponses] = useState<GoogleFormResponsesResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        loadUserForms(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        loadUserForms(res.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google ile giriş yaparken hata oluştu.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setForms([]);
  };

  const loadUserForms = async (token: string) => {
    setIsLoadingForms(true);
    try {
      const formList = await listFormsFromDrive(token);
      setForms(formList);
    } catch (err: any) {
      console.error('Form listeleme hatası:', err);
    } finally {
      setIsLoadingForms(false);
    }
  };

  const handleRequestCreateTemplate = (templateId: string) => {
    const tmpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    setPendingFormToCreate({
      title: tmpl.title,
      questions: tmpl.questions
    });
    setIsConfirmModalOpen(true);
  };

  const handleRequestCreateCustom = () => {
    if (!customTitle.trim()) {
      alert('Lütfen form başlığı giriniz.');
      return;
    }
    setPendingFormToCreate({
      title: customTitle,
      questions: customQuestions
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCreateForm = async () => {
    if (!pendingFormToCreate || !accessToken) return;

    setIsCreatingForm(true);
    try {
      // Step 1: Create empty form
      const newForm = await createGoogleForm(accessToken, pendingFormToCreate.title);
      
      // Step 2: Add questions
      if (pendingFormToCreate.questions.length > 0) {
        await addQuestionsToGoogleForm(accessToken, newForm.formId, pendingFormToCreate.questions);
      }

      setCreatedFormSuccess(newForm);
      setIsConfirmModalOpen(false);
      setPendingFormToCreate(null);
      setCustomTitle('');
      loadUserForms(accessToken);
    } catch (err: any) {
      alert(`Hata: ${err.message || 'Form oluşturulurken bir sorun yaşandı.'}`);
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleOpenFormDetails = async (formId: string) => {
    if (!accessToken) return;
    setSelectedFormId(formId);
    setIsLoadingDetails(true);
    try {
      const [details, responses] = await Promise.all([
        getFormDetails(accessToken, formId),
        getFormResponses(accessToken, formId).catch(() => ({ totalResponses: 0 }))
      ]);
      setSelectedFormDetails(details);
      setSelectedFormResponses(responses);
    } catch (err: any) {
      alert(`Form yüklenemedi: ${err.message}`);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleAddCustomQuestion = () => {
    setCustomQuestions([
      ...customQuestions,
      { title: '', type: 'TEXT', required: false }
    ]);
  };

  const handleRemoveCustomQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header Bar */}
      <header className="bg-teal-700 text-white px-4 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-teal-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal-200" />
              Google Formlar Yöneticisi
            </h1>
            <p className="text-xs text-teal-100">Engelsiz Mekân Anket ve Bildirim Servisi</p>
          </div>
        </div>

        {user && (
          <button
            onClick={handleSignOut}
            title="Çıkış Yap"
            className="p-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-teal-100 flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-md mx-auto w-full flex-1 flex flex-col gap-4">
        {/* Unauthenticated View */}
        {!user || !accessToken ? (
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col items-center text-center gap-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#009688] mb-1">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Google Form Hesabınızı Bağlayın</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Erişilebilirlik bildirim formları ve anketleri oluşturmak, mevcut Google Formlarınızı görüntülemek ve yanıtları takip etmek için giriş yapın.
              </p>
            </div>

            {authError && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Standard "Sign in with Google" Button */}
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="w-full mt-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isAuthenticating ? 'Giriş Yapılıyor...' : 'Google ile Giriş Yap'}</span>
            </button>

            <div className="text-[11px] text-slate-400 mt-2">
              * Google Drive ve Google Forms izinleri güvenle istenmektedir.
            </div>
          </div>
        ) : (
          <>
            {/* User Info Bar */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user.displayName || 'Google Kullanıcısı'}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-xs text-slate-800">{user.displayName || 'Google Kullanıcısı'}</div>
                  <div className="text-[11px] text-slate-500">{user.email}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-teal-600" /> Bağlandı
              </span>
            </div>

            {/* Success Toast / Notification */}
            {createdFormSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 flex flex-col gap-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Google Form Başarıyla Oluşturuldu!
                </div>
                <div>Form Başlığı: <strong>{createdFormSuccess.info?.title}</strong></div>
                {createdFormSuccess.responderUri && (
                  <a
                    href={createdFormSuccess.responderUri}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-teal-700 font-bold hover:underline"
                  >
                    Formu Aç ve Doldur <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setCreatedFormSuccess(null)}
                  className="text-[10px] text-emerald-600 underline text-left mt-1"
                >
                  Kapat
                </button>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 bg-slate-200/70 p-1 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('my_forms')}
                className={`py-2 rounded-xl transition-all ${activeTab === 'my_forms' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'}`}
              >
                Formlarım ({forms.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 rounded-xl transition-all ${activeTab === 'templates' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'}`}
              >
                Hazır Şablonlar
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`py-2 rounded-xl transition-all ${activeTab === 'custom' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'}`}
              >
                Özel Form
              </button>
            </div>

            {/* TAB 1: MY FORMS */}
            {activeTab === 'my_forms' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                  <span>Google Drive'ınızdaki Formlar</span>
                  <button
                    onClick={() => loadUserForms(accessToken)}
                    disabled={isLoadingForms}
                    className="flex items-center gap-1 text-teal-700 hover:text-teal-800 font-bold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForms ? 'animate-spin' : ''}`} />
                    Yenile
                  </button>
                </div>

                {isLoadingForms ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                    Formlar listeleniyor...
                  </div>
                ) : forms.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <div className="font-bold text-xs text-slate-700">Henüz Google Form Bulunmuyor</div>
                    <p className="text-[11px] text-slate-400">
                      'Hazır Şablonlar' sekmesinden hızlıca Engelsiz Mekân Bildirim Formu oluşturabilirsiniz.
                    </p>
                    <button
                      onClick={() => setActiveTab('templates')}
                      className="mt-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors"
                    >
                      Şablon Oluştur
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {forms.map((form) => (
                      <div
                        key={form.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-2.5 hover:border-teal-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-xs text-slate-800 line-clamp-1">{form.name}</h3>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {form.modifiedTime
                                ? new Date(form.modifiedTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
                                : 'Tarih yok'}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                            Google Form
                          </span>
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
                          <button
                            onClick={() => handleOpenFormDetails(form.id)}
                            className="flex-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold text-[11px] py-1.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Detay & Yanıtlar
                          </button>

                          {form.webViewLink && (
                            <a
                              href={form.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] py-1.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1"
                            >
                              Aç <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-slate-500 px-1">
                  Tek tıkla Google Formunuza hazır erişilebilirlik sorularını ekleyin.
                </div>

                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-800">{tmpl.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">{tmpl.description}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] text-slate-600 flex flex-col gap-1">
                      <div className="font-semibold text-slate-700 text-[10px] uppercase tracking-wide">Sorular ({tmpl.questions.length}):</div>
                      {tmpl.questions.map((q, idx) => (
                        <div key={idx} className="line-clamp-1">
                          • {q.title} <span className="text-[9px] text-slate-400">({q.type})</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleRequestCreateTemplate(tmpl.id)}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Google Form Olarak Oluştur
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: CUSTOM FORM BUILDER */}
            {activeTab === 'custom' && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-4">
                <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-teal-700" /> Özel Google Form Oluştur
                </h3>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">Form Başlığı *</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Örn: Eskişehir Kafe Erişilebilirlik Anketi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Form Soruları ({customQuestions.length})</span>
                    <button
                      onClick={handleAddCustomQuestion}
                      className="text-teal-700 hover:underline text-[11px] font-bold flex items-center gap-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Soru Ekle
                    </button>
                  </div>

                  {customQuestions.map((q, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-400">Soru #{idx + 1}</span>
                        {customQuestions.length > 1 && (
                          <button
                            onClick={() => handleRemoveCustomQuestion(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={q.title}
                        onChange={(e) => {
                          const updated = [...customQuestions];
                          updated[idx].title = e.target.value;
                          setCustomQuestions(updated);
                        }}
                        placeholder="Soru metnini giriniz..."
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-hidden focus:border-teal-600"
                      />

                      <div className="flex items-center gap-3">
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const updated = [...customQuestions];
                            updated[idx].type = e.target.value as any;
                            setCustomQuestions(updated);
                          }}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium"
                        >
                          <option value="TEXT">Açık Uçlu Metin</option>
                          <option value="RADIO">Tekli Seçim (Radio)</option>
                          <option value="CHECKBOX">Çoklu Seçim (Checkbox)</option>
                        </select>

                        <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={q.required || false}
                            onChange={(e) => {
                              const updated = [...customQuestions];
                              updated[idx].required = e.target.checked;
                              setCustomQuestions(updated);
                            }}
                            className="rounded text-teal-700 focus:ring-teal-600"
                          />
                          Zorunlu Soru
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRequestCreateCustom}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors mt-2"
                >
                  Google Hesabımda Formu Oluştur
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* CONFIRMATION MODAL (Mandatory for mutating Google Workspace operations) */}
      {isConfirmModalOpen && pendingFormToCreate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-teal-700">
              <div className="p-2 bg-teal-50 rounded-xl border border-teal-100">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Google Formu Oluşturulsun mu?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Google Drive hesabınızda <strong>"{pendingFormToCreate.title}"</strong> adıyla yeni bir form ve içindeki sorular oluşturulacaktır. Onaylıyor musunuz?
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              <strong>Soru Sayısı:</strong> {pendingFormToCreate.questions.length} adet soru eklenecektir.
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setPendingFormToCreate(null);
                }}
                disabled={isCreatingForm}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmCreateForm}
                disabled={isCreatingForm}
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isCreatingForm ? 'Oluşturuluyor...' : 'Evet, Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORM DETAILS & RESPONSES MODAL */}
      {selectedFormId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="font-bold text-sm text-slate-900">Form Detayları & Yanıtlar</div>
              <button
                onClick={() => {
                  setSelectedFormId(null);
                  setSelectedFormDetails(null);
                  setSelectedFormResponses(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Kapat
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="py-8 text-center text-xs text-slate-400">Yükleniyor...</div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{selectedFormDetails?.info?.title}</h3>
                  {selectedFormDetails?.responderUri && (
                    <a
                      href={selectedFormDetails.responderUri}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 text-xs font-bold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      Canlı Form Sayfasına Git <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-900">Toplam Gelen Yanıt Sayısı</span>
                  <span className="font-bold text-sm text-teal-700 bg-white px-3 py-1 rounded-lg border border-teal-200">
                    {selectedFormResponses?.responses?.length || selectedFormResponses?.totalResponses || 0} Yanıt
                  </span>
                </div>

                {/* Question Items list */}
                {selectedFormDetails?.items && selectedFormDetails.items.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-xs text-slate-700">Form Soruları</div>
                    <div className="flex flex-col gap-1.5">
                      {selectedFormDetails.items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                          <span className="font-semibold">{idx + 1}. {item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
