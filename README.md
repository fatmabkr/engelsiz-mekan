# ♿ Engelsiz Mekân

Engelsiz Mekân, engelli bireyler ve özel gereksinimi olan tüm kullanıcılar için fiziksel ve sosyal alanların erişilebilirlik durumunu harita üzerinde listeleyen, değerlendiren ve topluluk desteği sağlayan modern bir web uygulamasıdır.

---

## 🚀 Öne Çıkan Özellikler

* 📍 **Etkileşimli Erişilebilirlik Haritası:** Mekânların tekerlekli sandalye rampası, engelli tuvaleti, asansör, işitme/görme engelli uygunluğu gibi detaylı erişilebilirlik durumlarını inceleyin.
* 🔍 **Detaylı Filtreleme & Arama:** Kendi erişilebilirlik tercihlerinize göre (rampalar, geniş kapılar, Braille alfabesi, sesli rehber vb.) uygun mekânları kolayca filtreleyin.
* ➕ **Mekân & Değerlendirme Ekleme:** Topluluğa katkıda bulunmak için yeni erişilebilir mekânlar ekleyin veya mevcut mekânlara fotoğraf ve puanlama ile yorum bırakın.
* 🤝 **Topluluk & Sosyal Etkileşim:** Erişilebilirlik deneyimlerini ve önerileri paylaşın, harita üzerinde arkadaşlarınızla etkileşime geçin.
* 🤖 **Yapay Zeka Destekli Erişilebilirlik Asistanı:** Gemini API entegrasyonu ile mekânlar ve erişilebilirlik tavsiyeleri hakkında akıllı yanıtlar alın.
* 🗺️ **Yol Tarifi & Yol Arkadaşı:** Seçilen mekânlara erişilebilir yollardan rota oluşturun.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 19, TypeScript, Vite
- **Stilleme:** Tailwind CSS, Lucide React Icon Seti, Motion (Framer Motion)
- **Harita Servisleri:** Leaflet, React Leaflet, Google Maps API (`@vis.gl/react-google-maps`)
- **Yapay Zeka & Backend:** `@google/genai` (Gemini API), Express, Firebase

---

## 💻 Kurulum ve Yerel Çalıştırma

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri önerilir)
- npm veya yarn

### Adımlar

1. **Repoyu Klonlayın veya İndirin:**
   ```bash
   git clone https://github.com/fatmabkr/engelsiz-mekan.git
   cd engelsiz-mekan
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevre Değişkenlerini Oluşturun:**
   Proje kök dizininde bir `.env.local` dosyası oluşturun ve gerekli API anahtarlarınızı ekleyin:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Uygulamayı Başlatın:**
   ```bash
   npm run dev
   ```
   Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

---

## 📜 Komutlar

- `npm run dev`: Geliştirici sunucusunu başlatır.
- `npm run build`: Projeyi canlıya hazırlamak için derler.
- `npm run preview`: Derlenmiş (production) sürümü yerelde önizler.
- `npm run lint`: TypeScript tip kontrollerini gerçekleştirir.

---

## 🤝 Katkıda Bulunma

Hata bildirimleri, yeni özellik istekleri ve pull request'ler her zaman memnuniyetle karşılanır.
