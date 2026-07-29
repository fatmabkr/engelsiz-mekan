# ♿ Engelsiz Mekân

Engelsiz Mekân, engelli bireyler ve özel gereksinimi olan tüm kullanıcılar için fiziksel ve sosyal alanların erişilebilirlik durumunu harita üzerinde listeleyen, değerlendiren ve topluluk destekli bir platformdur. Kullanıcılar mekânlar hakkında bilgi ekleyebilir, fotoğraf ve puanlama bırakabilir, ayrıca kişisel erişilebilirlik tercihlerine göre mekânları filtreleyip rota oluşturabilirler.

---

## 🚀 Öne Çıkan Özellikler

* 📍 **Etkileşimli Erişilebilirlik Haritası:** Mekânların tekerlekli sandalye rampası, engelli tuvaleti, asansör, işitme/görme engelli uygunluğu gibi detaylı erişilebilirlik bilgilerini görüntüleyin.
* 🔍 **Detaylı Filtreleme & Arama:** Rampalar, geniş kapılar, Braille alfabesi, sesli rehber gibi kriterlere göre mekânları filtreleyin.
* ➕ **Mekân & Değerlendirme Ekleme:** Yeni erişilebilir mekânlar ekleyin veya mevcut mekânlara fotoğraf ve puanlama ile geri bildirim bırakın.
* 🤝 **Topluluk & Sosyal Etkileşim:** Erişilebilirlik deneyimlerinizi paylaşın ve toplulukla etkileşime geçin.
* 🤖 **Yapay Zeka Destekli Erişilebilirlik Asistanı:** Gemini API entegrasyonu ile mekânlar ve erişilebilirlik tavsiyeleri hakkında akıllı yanıtlar alın.
* 🗺️ **Yol Tarifi & Yol Arkadaşı:** Seçilen mekânlara erişilebilir rotalar oluşturun.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 19, TypeScript, Vite
- **Stil:** Tailwind CSS, Lucide React ikonları, Framer Motion
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
- `npm run build`: Prodüksiyon için derler.
- `npm run preview`: Derlenmiş (production) sürümü yerelde önizler.
- `npm run lint`: Kod stil ve tip kontrollerini gerçekleştirir.

---

## 🤝 Katkıda Bulunma

Hata bildirimleri, yeni özellik istekleri ve pull request'ler her zaman memnuniyetle karşılanır. Katkıda bulunmak için:

1. Repoyu fork edin.
2. Yeni bir branch oluşturun: `git checkout -b feature/islem`.
3. Değişikliklerinizi yapın, test edin ve commit edin.
4. Pull request açın.

---

## Lisans

Proje lisansı hakkında bilgi burada yer almalıdır (ör. MIT). Eğer lisans eklenmemişse, repo sahibinin tercih ettiği lisansı ekleyin.
