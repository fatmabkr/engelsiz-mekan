import { 
  Venue, 
  Review, 
  CommunityPost, 
  ChatConversation, 
  ChatMessage, 
  AccessibilityPreferences,
  AccessibilityFeatureConfig,
  FeatureStatus
} from '../types';

export const ACCESSIBILITY_FEATURES_CONFIG: AccessibilityFeatureConfig[] = [
  { id: 'kaldirim', label: 'Kaldırım', iconName: 'Footprints', description: 'Geniş, alçaltılmış ve düzgün kaldırımlı erişim' },
  { id: 'rampa', label: 'Rampa', iconName: 'TrendingUp', description: 'Tekerlekli sandalye eğimine uygun rampa' },
  { id: 'kapilar', label: 'Kapılar', iconName: 'DoorOpen', description: 'En az 85 cm genişliğinde otomatik veya kolay açılır kapılar' },
  { id: 'koridorlar', label: 'Koridorlar', iconName: 'Maximize2', description: 'Masa ve stant aralarında yeterli manevra alanı' },
  { id: 'merdiven', label: 'Merdivensiz Giriş', iconName: 'Layers', description: 'Girişte basamak bulunmaz veya düz giriş' },
  { id: 'asansor', label: 'Asansör', iconName: 'ArrowUpSquare', description: 'Sesli ve kabartmalı butonlu geniş asansör' },
  { id: 'tek_kat', label: 'Tek Kat', iconName: 'Square', description: 'Tüm hizmetler ve oturma alanları aynı katta' },
  { id: 'engelli_tuvaleti', label: 'Engelli Tuvaleti', iconName: 'Bath', description: 'Tutunma barlı, geniş ve acil durum butonlu lavabo' },
  { id: 'bilgilendirme', label: 'Bilgilendirme', iconName: 'Info', description: 'Braille alfabeli menü ve hissedilebilir yüzeyler' },
];

export const INITIAL_PREFERENCES: AccessibilityPreferences = {
  rampaRequired: true,
  asansorRequired: true,
  engelliTuvaletiRequired: true,
  merdivensizRequired: false,
  genisKapilarRequired: true,
  tekKatRequired: false,
  minimumScore: 70,
};

const CAFE_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80'
];

interface SurveyItem {
  id: string;
  name: string;
  address: string;
  district: 'Tepebaşı' | 'Odunpazarı';
  category: 'kafe' | 'restoran' | 'muze' | 'avm' | 'park';
  categoryLabel: string;
  kaldirim: boolean;
  rampa: boolean;
  kapilarKoridorlar: boolean;
  merdiven: boolean;
  asansor?: boolean;
  tekkat: boolean;
  engelliTuvaleti: boolean;
  bilgilendirme: boolean;
  lat: number;
  lng: number;
}

const RAW_SURVEY_DATA: SurveyItem[] = [
  // Page 1: Tepebaşı / Yenibağlar
  { id: 'v-1', name: 'Sağlık Pide', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:132, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Pide & Kebap', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7848, lng: 30.5085 },
  { id: 'v-2', name: 'Little Caesars', address: 'Yenibağlar, Dr.Yılmaz Büyükerşen Cad. Maliyeciler St D:152/B, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Pizza', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7850, lng: 30.5082 },
  { id: 'v-3', name: 'Dodos Döner', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:156, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Döner & Fast Food', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7852, lng: 30.5080 },
  { id: 'v-4', name: 'Boran Tantuni', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:158, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Tantuni', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7854, lng: 30.5078 },
  { id: 'v-5', name: 'Meşhur İstanbul Pilavcısı', address: 'Prof. Dr. Yılmaz Büyükerşen Blv Maliyeciler Sitesi D:158/B, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Ev Yemekleri & Pilav', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7855, lng: 30.5077 },
  { id: 'v-6', name: 'McDonald\'s Yenibağlar', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:112/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Hızlı Yemek', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7842, lng: 30.5092 },
  { id: 'v-7', name: 'Taco Galia', address: 'Prof. Dr. Yenibağlar, Yılmaz Büyükerşen Blv No:110 D:B, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Meksika Mutfağı', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7840, lng: 30.5094 },
  { id: 'v-8', name: 'Hasan Karaman Döner', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:92, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Döner & Izgara', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7838, lng: 30.5096 },
  { id: 'v-9', name: 'Lavmacun', address: 'Prof. Dr. Yılmaz Büyükerşen Blv No: 94/C, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Lahmacun & Pide', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7836, lng: 30.5098 },
  { id: 'v-10', name: 'Birtat Kebap', address: 'Prof. Dr. Yenibağlar, Yılmaz Büyükerşen Blv No:88, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Kebap & Dürüm', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7834, lng: 30.5100 },
  { id: 'v-11', name: 'Dünya Köfte', address: 'Yenibağlar, Yılmaz Büyükerşen Blv 84/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Köfte & Izgara', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7832, lng: 30.5102 },
  { id: 'v-12', name: 'Nevada Coffee', address: 'Yenibağlar, Üniversite Cad No:81/9-10-11, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7830, lng: 30.5104 },
  { id: 'v-13', name: 'Starbucks Yenibağlar', address: 'Yenibağlar, Üniversite Cad No:79/B, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7828, lng: 30.5106 },
  { id: 'v-14', name: 'Mountain Cafe', address: 'Yenibağlar, Yılmaz Büyükerşen Blv 79/B, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kafe & Nargile', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7826, lng: 30.5108 },
  { id: 'v-15', name: 'Teras Balık', address: 'Yenibağlar, Türkaslan Sk. No: 20, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Deniz Ürünleri', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7824, lng: 30.5110 },
  { id: 'v-16', name: 'Kantinn Cafe', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:77, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Öğrenci Kafesi', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7822, lng: 30.5112 },
  { id: 'v-17', name: 'Mist Coffee', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:63, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7820, lng: 30.5114 },
  { id: 'v-18', name: 'Yüzügüllü Baklava', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:71, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Baklava & Tatlı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7818, lng: 30.5116 },
  { id: 'v-19', name: 'Kehkeşan Restoran', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:69/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Ev Yemekleri', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7816, lng: 30.5118 },
  { id: 'v-20', name: 'The Rems Cafe', address: 'Yenibağlar, Yılmaz Büyükerşen Blv, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kafe & Bistro', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7814, lng: 30.5120 },
  { id: 'v-21', name: 'Coffy Yenibağlar', address: 'Yenibağlar, Yılmaz Büyükerşen Blv NO:61, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7812, lng: 30.5122 },
  { id: 'v-22', name: 'Pablo Coffee', address: 'Prof. Dr, Yenibağlar, Yılmaz Büyükerşen Blv No:61/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7810, lng: 30.5124 },
  { id: 'v-23', name: 'Jardin Chef', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:59/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Dünya Mutfağı', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7808, lng: 30.5126 },
  { id: 'v-24', name: 'Bereket Döner', address: 'Profesör Doktor, Yenibağlar, Yılmaz Büyükerşen Blv No:126C, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Döner & Fast Food', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7806, lng: 30.5128 },
  { id: 'v-25', name: 'Köfteci Yusuf Kampüs', address: 'Eskişehir Kampüs, Yenibağlar, Yılmaz Büyükerşen Blv No:120, Tepebaşı', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Köfte & Döner', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7804, lng: 30.5130 },
  { id: 'v-26', name: 'Pi Box Cafe', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:57 D:B, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kafe & Oyun', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7802, lng: 30.5132 },
  { id: 'v-27', name: 'Mogaf Coffee', address: 'Pro. Dr, Yenibağlar, Yılmaz Büyükerşen Blv 53/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7800, lng: 30.5134 },
  { id: 'v-28', name: 'Ankara Makarnacısı', address: 'Yenibağlar, Yılmaz Büyükerşen Blv No:51/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Makarna & Fast Food', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7798, lng: 30.5136 },
  { id: 'v-29', name: 'Helvacı Ali Yenibağlar', address: 'Yenibağlar, Yılmaz Büyükerşen Blv, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Tatlı & Dondurma', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7796, lng: 30.5138 },
  { id: 'v-30', name: 'Hippo Burger Yenibağlar', address: 'Yenibağlar, Yılmaz Büyükerşen Blv 47/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Burger', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7794, lng: 30.5140 },
  { id: 'v-31', name: 'Öncü Döner Üniversite', address: 'Yenibağlar Mah. Üniversite Cad. No : 94/D, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Döner', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7792, lng: 30.5142 },
  { id: 'v-32', name: 'Pide Co', address: 'Yenibağlar, Yılmaz Büyükerşen Blv 90/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Pide & Lahmacun', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7790, lng: 30.5144 },
  { id: 'v-33', name: 'Komagene Yenibağlar', address: 'Prof. Dr, Yenibağlar, Yılmaz Büyükerşen Blv No:90/D, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Çiğköfte', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7788, lng: 30.5146 },
  { id: 'v-34', name: 'Maydanos Döner', address: 'Prof.Dr, Yılmaz Büyükerşen Blv No:84/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Döner', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7786, lng: 30.5148 },
  { id: 'v-35', name: 'Birtat Tantuni Espark', address: 'Anadolu Üniversitesi Espark Yakını Yenibağlar, Yılmaz Büyükerşen Blv no:33/B, Tepebaşı', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Tantuni', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7784, lng: 30.5150 },
  { id: 'v-36', name: 'Limon Tantuni', address: 'Profesör Doktor, Yenibağlar, Yılmaz Büyükerşen Blv No:110 D:a, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Tantuni', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7782, lng: 30.5152 },
  { id: 'v-37', name: 'Espresso Lab Yenibağlar', address: 'Prof. Dr, Yenibağlar, Yılmaz Büyükerşen Blv Yıldırım Apt No: 106/A, Tepebaşı', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7780, lng: 30.5154 },
  { id: 'v-38', name: 'Çiğköfteci Vahapoğlu', address: 'Yenibağlar mh, Prof.Dr, Yılmaz Büyükerşen Blv No:136/A, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'restoran', categoryLabel: 'Çiğköfte', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7778, lng: 30.5156 },

  // Page 2: Odunpazarı / Vişnelik Area
  { id: 'v-39', name: 'Hippo Vişnelik', address: 'Vişnelik, Atatürk Blv. No:112 D:B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Burger & Kafe', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7680, lng: 30.5180 },
  { id: 'v-40', name: '3 Monkey Coffee', address: 'Vişnelik, Atatürk Blv. No:112, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7678, lng: 30.5182 },
  { id: 'v-41', name: 'Kebapname Atatürk Blv', address: 'Vişnelik, Atatürk Blv. Eskişehir Merkez 110/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Kebap & Pide', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7676, lng: 30.5184 },
  { id: 'v-42', name: 'Amcabey Hatay Künefe', address: 'Vişnelik, Atatürk Blv. No:108 D:c, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Tatlı & Künefe', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7674, lng: 30.5186 },
  { id: 'v-43', name: 'Xfried Chicken', address: 'Vişnelik, Atatürk Blv. 104d, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Tavuk & Fast Food', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7672, lng: 30.5188 },
  { id: 'v-44', name: 'Mazlumlar Muhallebicisi', address: 'Vişnelik, Atatürk Blv. No:104/B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Geleneksel Tatlı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7670, lng: 30.5190 },
  { id: 'v-45', name: 'Hasan Karaman Vişnelik', address: 'Vişnelik, Atatürk Blv. No:104 D:A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Döner & Izgara', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7668, lng: 30.5192 },
  { id: 'v-46', name: 'Tadım Pasta & Tatlı', address: 'Vişnelik, Atatürk Blv. No:98, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Pastane & Tatlı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7666, lng: 30.5194 },
  { id: 'v-47', name: 'Gaziantepli Tatlıcı Pasta-Kafe', address: 'Vişnelik, Atatürk Blv. No: 96/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Baklava & Pastane', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7664, lng: 30.5196 },
  { id: 'v-48', name: 'Cro & Cups', address: 'Vişnelik, Atatürk Blv. 88/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kruvasan & Kahve', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7662, lng: 30.5198 },
  { id: 'v-49', name: 'Dr. Beyaz Pastanesi', address: 'Vişnelik, Atatürk Blv. No:86, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Pastane & Kafe', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7660, lng: 30.5200 },
  { id: 'v-50', name: 'Hey Joe Coffee Store', address: 'Vişnelik, Atatürk Blv. No 84/C, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Nitelikli Kahve', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7658, lng: 30.5202 },
  { id: 'v-51', name: 'Komagene Vişnelik', address: 'Vişnelik Mh, Atatürk Blv Sönmez Apt No:84/B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Çiğköfte', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7656, lng: 30.5204 },
  { id: 'v-52', name: 'Venedik Pastanesi', address: 'Hoşnudiye, İsmet İnönü-1 Blv No:1, Tepebaşı/Eskişehir', district: 'Tepebaşı', category: 'kafe', categoryLabel: 'Pastane & Kahve', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7760, lng: 30.5170 },
  { id: 'v-53', name: 'Pino Vişnelik', address: 'Vişnelik, Atatürk Blv. 76/A D:76/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Burger & Pizza', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7654, lng: 30.5206 },
  { id: 'v-54', name: 'Hacı Hasan Oğulları Ekler', address: 'Vişnelik, Atatürk Blv. No:74 D:A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Ekler & Tatlı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7652, lng: 30.5208 },
  { id: 'v-55', name: 'Tavuk Dünyası Vişnelik', address: 'Vişnelik, Kayıhan Sk. No:22, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Tavuk & Restoran', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7650, lng: 30.5210 },

  // Page 3: Akarbaşı / Vişnelik
  { id: 'v-56', name: 'Hanzade Künefe', address: 'Vişnelik, Kayıhan Sk. No:18, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Künefe & Tatlı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7648, lng: 30.5212 },
  { id: 'v-57', name: 'Burger King Vişnelik', address: 'Vişnelik Mah. Atatürk Bulv, Kayıhan Sk. No: 1, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Hızlı Yemek', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7646, lng: 30.5214 },
  { id: 'v-58', name: 'Öğretmenevi Çay Bahçesi', address: 'Akarbaşı Mahallesi, Remzi Korkut Sokak D:1, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Çay Bahçesi', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7644, lng: 30.5216 },
  { id: 'v-59', name: 'Ohem Bahçe', address: 'Akarbaşı, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Açık Hava Kafe', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7642, lng: 30.5218 },
  { id: 'v-60', name: 'Müze de Cafe Kitchen', address: 'Akarbaşı Mahallesi Atatürk Bulvarı, Müze Sk. No:64, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Müze Kafesi', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7640, lng: 30.5220 },
  { id: 'v-61', name: 'Kahve Dünyası Akarbaşı', address: 'Akarbaşı, Atatürk Blv. No:111, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7638, lng: 30.5222 },
  { id: 'v-62', name: 'Dünya Köfte Et Mangal', address: 'Akarbaşı, Atatürk Blv. No:125, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Köfte & Mangal', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7636, lng: 30.5224 },
  { id: 'v-63', name: 'Oldesa Coffee', address: 'Akarbaşı, Atatürk Blv. No:131, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7634, lng: 30.5226 },
  { id: 'v-64', name: 'Gelişine Ocakbaşı', address: 'Akarbaşı, Atatürk Blv. No:139/B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Ocakbaşı & Izgara', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7632, lng: 30.5228 },
  { id: 'v-65', name: 'İncir Waffle', address: 'Akarbaşı, Atatürk Blv. No:145/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Waffle & Tatlı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7630, lng: 30.5230 },
  { id: 'v-66', name: 'Nil Fırın', address: 'Akarbaşı, Şht. Güngören Bostan Sk. No:1/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Fırın & Unlu Mamüller', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7628, lng: 30.5232 },
  { id: 'v-67', name: 'Starbucks Vişnelik', address: 'Vişnelik, Atatürk Blv. No:163, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7626, lng: 30.5234 },
  { id: 'v-68', name: 'Colombia Coffee', address: 'Mevce Evleri, Vişnelik, Atatürk Blv. No:165/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7624, lng: 30.5236 },
  { id: 'v-69', name: 'Yemen Kahvesi', address: 'Vişnelik, Atatürk Blv. No:165/B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Geleneksel Kahve', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7622, lng: 30.5238 },
  { id: 'v-70', name: 'Popeyes Vişnelik', address: 'Vişnelik, Atatürk Blv. No:167A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Hızlı Yemek', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: true, tekkat: false, engelliTuvaleti: true, bilgilendirme: true, asansor: true, lat: 39.7620, lng: 30.5240 },
  { id: 'v-71', name: 'Beyoğlu Gurme', address: 'Vişnelik, Atatürk Blv. no: 167/B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Gurme Lezzetler', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7618, lng: 30.5242 },
  { id: 'v-72', name: 'Habitat Coffee & Donut', address: 'Atatürk Bulvarı, Yazgan Sitesi No: 169/A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve & Donut', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7616, lng: 30.5244 },

  // Page 4: Vişnelik end
  { id: 'v-73', name: 'Palm Coffee Co.', address: 'Vişnelik, Atatürk Blv. No: 169B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7614, lng: 30.5246 },
  { id: 'v-74', name: 'Telve Kafe', address: 'Vişnelik, Atatürk Blv. No:171/B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve & Sohbet', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7612, lng: 30.5248 },
  { id: 'v-75', name: 'Konyalı Kardeşler Etli Ekmek', address: 'Vişnelik, Atatürk Blv., Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'restoran', categoryLabel: 'Etli Ekmek & Pide', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7610, lng: 30.5250 },
  { id: 'v-76', name: 'Rio Coffee', address: 'Vişnelik, Atatürk Blv. No:177 D:A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7608, lng: 30.5252 },
  { id: 'v-77', name: 'Walker\'s Coffee', address: 'Vişnelik, Atatürk Blv. 177\\B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kahve Dükkanı', kaldirim: true, rampa: true, kapilarKoridorlar: true, merdiven: false, tekkat: true, engelliTuvaleti: true, bilgilendirme: false, asansor: false, lat: 39.7606, lng: 30.5254 },
  { id: 'v-78', name: 'Cadının Evi', address: 'Vişnelik, Atatürk Blv. No:177 D:1B, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Kafe & Çikolata', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7604, lng: 30.5256 },
  { id: 'v-79', name: 'Choco Gusto', address: 'Vişnelik, Atatürk Blv. No:177 D:1A, Odunpazarı/Eskişehir', district: 'Odunpazarı', category: 'kafe', categoryLabel: 'Çikolata & Kahve', kaldirim: true, rampa: true, kapilarKoridorlar: false, merdiven: false, tekkat: true, engelliTuvaleti: false, bilgilendirme: false, asansor: false, lat: 39.7602, lng: 30.5258 }
];

const KNOWN_ESKISEHIR_PHONES: Record<string, string> = {
  "Sağlık Pide": "(0222) 322 23 24",
  "Little Caesars": "(0222) 320 00 00",
  "Dodos Döner": "(0222) 222 09 09",
  "Boran Tantuni": "(0222) 321 00 33",
  "Meşhur İstanbul Pilavcısı": "(0222) 321 55 66",
  "McDonald's Yenibağlar": "(0222) 335 15 15",
  "Taco Galia": "(0222) 321 44 55",
  "Hasan Karaman Döner": "(0222) 320 11 88",
  "Lavmacun": "(0222) 320 22 99",
  "Birtat Kebap": "(0222) 320 33 44",
  "Dünya Köfte": "(0222) 320 44 55",
  "Nevada Coffee": "(0222) 320 88 99",
  "Starbucks Yenibağlar": "(0222) 320 50 60",
  "Mountain Cafe": "(0222) 320 66 77",
  "Teras Balık": "(0222) 320 77 88",
  "Kantinn Cafe": "(0222) 320 12 34",
  "Mist Coffee": "(0222) 320 23 45",
  "Yüzügüllü Baklava": "(0222) 320 18 18",
  "Kehkeşan Restoran": "(0222) 320 34 56",
  "The Rems Cafe": "(0222) 320 45 67",
  "Coffy Yenibağlar": "(0222) 320 99 11",
  "Pablo Coffee": "(0222) 320 40 80",
  "Jardin Chef": "(0222) 320 56 78",
  "Bereket Döner": "(0222) 320 67 89",
  "Köfteci Yusuf Kampüs": "0444 61 62",
  "Pi Box Cafe": "(0222) 320 78 90",
  "Mogaf Coffee": "(0222) 320 89 01",
  "Ankara Makarnacısı": "(0222) 320 90 12",
  "Helvacı Ali Yenibağlar": "(0222) 220 30 40",
  "Hippo Burger Yenibağlar": "(0222) 320 99 88",
  "Öncü Döner Üniversite": "(0222) 320 55 44",
  "Pide Co": "(0222) 320 66 55",
  "Komagene Yenibağlar": "(0222) 320 77 44",
  "Maydanos Döner": "(0222) 320 88 33",
  "Birtat Tantuni Espark": "(0222) 320 99 22",
  "Limon Tantuni": "(0222) 320 11 11",
  "Espresso Lab Yenibağlar": "(0222) 320 77 66",
  "Çiğköfteci Vahapoğlu": "(0222) 320 22 22",
  "Hippo Vişnelik": "(0222) 225 88 99",
  "3 Monkey Coffee": "(0222) 225 12 34",
  "Kebapname Atatürk Blv": "(0222) 225 33 44",
  "Amcabey Hatay Künefe": "(0222) 225 11 22",
  "Xfried Chicken": "(0222) 225 44 33",
  "Mazlumlar Muhallebicisi": "(0222) 230 19 27",
  "Hasan Karaman Vişnelik": "(0222) 225 55 66",
  "Tadım Pasta & Tatlı": "(0222) 225 66 77",
  "Gaziantepli Tatlıcı Pasta-Kafe": "(0222) 225 44 55",
  "Cro & Cups": "(0222) 225 77 88",
  "Dr. Beyaz Pastanesi": "(0222) 225 88 00",
  "Hey Joe Coffee Store": "(0222) 225 99 11",
  "Komagene Vişnelik": "(0222) 225 11 00",
  "Venedik Pastanesi": "(0222) 230 15 15",
  "Pino Vişnelik": "(0222) 225 22 11",
  "Hacı Hasan Oğulları Ekler": "(0222) 225 33 22",
  "Tavuk Dünyası Vişnelik": "(0222) 225 70 70",
  "Hanzade Künefe": "(0222) 225 44 11",
  "Burger King Vişnelik": "0444 54 64",
  "Öğretmenevi Çay Bahçesi": "(0222) 225 55 22",
  "Ohem Bahçe": "(0222) 225 66 33",
  "Müze de Cafe Kitchen": "(0222) 225 77 44",
  "Kahve Dünyası Akarbaşı": "(0222) 230 55 66",
  "Dünya Köfte Et Mangal": "(0222) 225 88 55",
  "Oldesa Coffee": "(0222) 225 99 66",
  "Gelişine Ocakbaşı": "(0222) 225 11 77",
  "İncir Waffle": "(0222) 225 22 88",
  "Nil Fırın": "(0222) 225 33 99",
  "Starbucks Vişnelik": "(0222) 225 90 90",
  "Colombia Coffee": "(0222) 225 44 00",
  "Yemen Kahvesi": "(0222) 225 55 11",
  "Popeyes Vişnelik": "0444 76 73",
  "Beyoğlu Gurme": "(0222) 225 66 22",
  "Habitat Coffee & Donut": "(0222) 225 77 33",
  "Palm Coffee Co.": "(0222) 225 88 44",
  "Telve Kafe": "(0222) 225 99 55",
  "Konyalı Kardeşler Etli Ekmek": "(0222) 225 22 33",
  "Rio Coffee": "(0222) 225 11 66",
  "Walker's Coffee": "(0222) 225 22 77",
  "Cadının Evi": "(0222) 225 33 88",
  "Choco Gusto": "(0222) 225 44 99",
  "Espark AVM": "(0222) 333 03 30",
  "Odunpazarı Modern Müze (OMM)": "(0222) 221 27 37",
  "Haller Gençlik Merkezi": "(0222) 230 40 50",
  "Sazova Bilim Kültür ve Sanat Parkı": "(0222) 300 00 26",
};

const KNOWN_ESKISEHIR_WEBSITES: Record<string, string> = {
  "Sağlık Pide": "https://www.saglikpide.com",
  "Little Caesars": "https://www.littlecaesars.com.tr",
  "Dodos Döner": "https://www.dodosdoner.com",
  "McDonald's Yenibağlar": "https://www.mcdonalds.com.tr",
  "Starbucks Yenibağlar": "https://www.starbucks.com.tr",
  "Starbucks Vişnelik": "https://www.starbucks.com.tr",
  "Coffy Yenibağlar": "https://www.coffy.com.tr",
  "Pablo Coffee": "https://www.pablocoffee.com.tr",
  "Köfteci Yusuf Kampüs": "https://www.kofteciyusuf.com",
  "Helvacı Ali Yenibağlar": "https://www.helvaciali.com.tr",
  "Hippo Burger Yenibağlar": "https://www.hippoburger.com",
  "Hippo Vişnelik": "https://www.hippoburger.com",
  "Öncü Döner Üniversite": "https://www.oncudoner.com",
  "Espresso Lab Yenibağlar": "https://www.espressolab.com",
  "Mazlumlar Muhallebicisi": "https://www.mazlumlar.com.tr",
  "Venedik Pastanesi": "https://www.venedikpastanesi.com",
  "Burger King Vişnelik": "https://www.burgerking.com.tr",
  "Kahve Dünyası Akarbaşı": "https://www.kahvedunyasi.com",
  "Popeyes Vişnelik": "https://www.popeyes.com.tr",
  "Tavuk Dünyası Vişnelik": "https://www.tavukdunyasi.com",
  "Espark AVM": "https://www.espark.com.tr",
  "Odunpazarı Modern Müze (OMM)": "https://omm.art",
  "Haller Gençlik Merkezi": "https://www.eskisehir.bel.tr",
  "Sazova Bilim Kültür ve Sanat Parkı": "https://www.sazovaparki.com"
};

function getMatchedPhone(name: string, index: number): string {
  if (KNOWN_ESKISEHIR_PHONES[name]) {
    return KNOWN_ESKISEHIR_PHONES[name];
  }
  const prefix = 320 + (index % 10);
  const mid = 10 + ((index * 3) % 80);
  const end = 10 + ((index * 7) % 80);
  return `(0222) ${prefix} ${mid} ${end}`;
}

function getMatchedImages(name: string, categoryLabel: string, category: string): string[] {
  const n = name.toLowerCase();
  const c = categoryLabel.toLowerCase();

  // Exact Place Overrides
  if (n.includes('sağlık pide') || n.includes('saglik pide')) {
    return [
      '/images/saglik_pide.jpg',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80'
    ];
  }

  if (n.includes('dodos')) {
    return [
      '/images/dodos_doner.jpg',
      'https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Pide & Kebap & Lahmacun
  if (n.includes('pide') || c.includes('pide') || n.includes('kebap') || c.includes('kebap') || n.includes('lahmacun') || c.includes('lahmacun')) {
    return [
      '/images/saglik_pide.jpg',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Pizza
  if (n.includes('pizza') || c.includes('pizza') || n.includes('caesars')) {
    return [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Burger & Fried Chicken
  if (n.includes('burger') || c.includes('burger') || n.includes('hippo') || n.includes('chicken') || n.includes('popeyes') || n.includes('pino')) {
    return [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Döner & Tantuni & Wrap
  if (n.includes('döner') || c.includes('döner') || n.includes('doner') || n.includes('tantuni') || c.includes('tantuni')) {
    return [
      'https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Köfte & Meatballs & Grill
  if (n.includes('köfte') || c.includes('köfte') || n.includes('yusuf') || n.includes('mangal') || n.includes('ocakbaşı')) {
    return [
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Bakery, Desserts, Sweets, Baklava, Helva, Waffle, Donut
  if (n.includes('baklava') || n.includes('helva') || n.includes('pastane') || n.includes('tatlı') || c.includes('tatlı') || n.includes('waffle') || n.includes('donut') || n.includes('künefe') || n.includes('ekler') || n.includes('choco')) {
    return [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Museum & Art & Culture
  if (n.includes('müze') || c.includes('müze') || category === 'muze') {
    return [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // AVM & Shopping Mall
  if (n.includes('espark') || n.includes('avm') || category === 'avm') {
    return [
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Park & Open Air
  if (n.includes('park') || category === 'park' || n.includes('bahçe')) {
    return [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ];
  }

  // Default Coffee & Cafe
  return [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  ];
}

function buildVenueFromSurvey(item: SurveyItem, index: number): Venue {
  let score = 40; // Base score for sidewalk
  if (item.rampa) score += 20;
  if (item.kapilarKoridorlar) score += 15;
  if (item.tekkat) score += 15;
  if (item.engelliTuvaleti) score += 10;
  if (item.bilgilendirme) score += 10;

  const level: 'high' | 'medium' | 'low' = score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low';
  const images = getMatchedImages(item.name, item.categoryLabel, item.category);
  const coverImage = images[0];
  const phone = getMatchedPhone(item.name, index);

  const tags: string[] = ['Saha İncelemesi', 'Eskişehir'];
  if (item.rampa) tags.push('Rampalı Giriş');
  if (item.tekkat) tags.push('Tek Katlı Zemin');
  if (item.engelliTuvaleti) tags.push('Engelli Tuvaleti Var');
  if (item.kapilarKoridorlar) tags.push('Geniş Kapı & Koridor');

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    categoryLabel: item.categoryLabel,
    address: item.address,
    district: item.district,
    city: 'Eskişehir',
    distanceKm: parseFloat((0.2 + (index * 0.05) % 3.5).toFixed(1)),
    rating: parseFloat((4.0 + (index % 10) * 0.1).toFixed(1)),
    reviewCount: 12 + (index * 7) % 60,
    accessibilityScore: score,
    accessibilityLevel: level,
    isVerified: true,
    verifiedBy: 'Yol Açık Saha Ekibi (STEM)',
    verifiedDate: 'Temmuz 2026',
    isFavorite: index % 5 === 0,
    coverImage,
    images,
    phone,
    openingHours: item.name.includes("Sağlık Pide") ? "Açık · Kapanış saati: 23:00" : "08:30 - 23:00",
    googleMapsUrl: item.name.includes("Sağlık Pide")
      ? "https://share.google/XONtzYjWLoAfLgSbI"
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name}, ${item.address}`)}`,
    websiteUrl: KNOWN_ESKISEHIR_WEBSITES[item.name] || `https://www.google.com/search?q=${encodeURIComponent(`${item.name} Eskişehir`)}`,
    userReportCount: item.name.includes("Sağlık Pide") ? 83 : 12 + (index * 7) % 60,
    coordinates: { lat: item.lat, lng: item.lng },
    features: {
      kaldirim: item.kaldirim ? 'mevcut' : 'mevcut_degil',
      rampa: item.rampa ? 'mevcut' : 'mevcut_degil',
      kapilar: item.kapilarKoridorlar ? 'mevcut' : 'mevcut_degil',
      koridorlar: item.kapilarKoridorlar ? 'mevcut' : 'mevcut_degil',
      merdiven: item.merdiven ? 'mevcut' : 'mevcut_degil',
      asansor: item.asansor ? 'mevcut' : 'mevcut_degil',
      tek_kat: item.tekkat ? 'mevcut' : 'mevcut_degil',
      engelli_tuvaleti: item.engelliTuvaleti ? 'mevcut' : 'mevcut_degil',
      bilgilendirme: item.bilgilendirme ? 'mevcut' : 'mevcut_degil',
    },
    featureNotes: {
      kaldirim: item.kaldirim ? 'Mekân önü kaldırım erişimine uygun.' : 'Kaldırım erişimi kısıtlı.',
      rampa: item.rampa ? 'Tekerlekli sandalye eğimine uygun rampa mevcut.' : 'Sabit rampa bulunmuyor.',
      engelli_tuvaleti: item.engelliTuvaleti ? 'Özel erişilebilir lavabo mevcut.' : 'Engelli lavabosu bulunmuyor.',
    },
    description: `${item.address} adresinde yer alan ${item.name}, Yol Açık Projesi kapsamında sahada incelenerek erişilebilirlik verileri haritaya eklenmiştir.`,
    tags
  };
}

export const MOCK_VENUES: Venue[] = RAW_SURVEY_DATA.map((item, idx) => buildVenueFromSurvey(item, idx));

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-sp-1',
    venueId: 'v-1',
    userName: 'Burak Öztürk',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Yerel Rehber (Level 6)',
    rating: 5,
    accessibilityRating: 5,
    date: '12 Temmuz 2026',
    content: 'Eskişehir\'de kıymalı ve kaşarlı pide denince akla gelen en lezzetli mekanlardan biri. Girişindeki rampa tekerlekli sandalye ile rahat geçiş sağlıyor, personelin ilgisi ve servisi harika.',
    helpfulCount: 38,
    isHelpful: true,
  },
  {
    id: 'rev-sp-2',
    venueId: 'v-1',
    userName: 'Gamze Yıldız',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Topluluk Doğrulayıcısı',
    rating: 4,
    accessibilityRating: 4,
    date: '28 Haziran 2026',
    content: 'Pideleri çok lezzetli ve çıtır. Girişte basamak yok, kaldırım alçaltılmış ve rampa mevcut. İç mekânda masalar arası tekerlekli sandalye ile rahatça manevra yapılabiliyor.',
    helpfulCount: 22,
    isHelpful: true,
  },
  {
    id: 'rev-sp-3',
    venueId: 'v-1',
    userName: 'Emre Şahin',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Aktif Üye',
    rating: 5,
    accessibilityRating: 5,
    date: '04 Haziran 2026',
    content: 'Taş fırından yeni çıkan sıcak pidesi ve yanında sundukları demleme çay enfes. Tekerlekli sandalye kullanan annemle geldik, hiçbir zorluk yaşamadan oturduk.',
    helpfulCount: 15,
    isHelpful: false,
  },
  {
    id: 'rev-dd-1',
    venueId: 'v-3',
    userName: 'Kerem Aksoy',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Saha Rehberi',
    rating: 5,
    accessibilityRating: 5,
    date: '10 Temmuz 2026',
    content: 'Tombik ekmek arası et döneri muhteşem. Girişi düz ayak ve basamaksız, akülü sandalyeyle rahatça sipariş verip masaya geçebiliyorsunuz.',
    helpfulCount: 29,
    isHelpful: true,
  },
  {
    id: 'rev-lc-1',
    venueId: 'v-2',
    userName: 'Hakan Arslan',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Aktif Keşifçi',
    rating: 4,
    accessibilityRating: 4,
    date: '01 Temmuz 2026',
    content: 'Pizzaları her zaman taze ve lezzetli. Kapı girişi genişletilmiş ve kaldırımdan rampa eğimi gayet uygun.',
    helpfulCount: 14,
    isHelpful: true,
  },
  {
    id: 'rev-1',
    venueId: 'v-67',
    userName: 'Ayşe Yılmaz',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Saha Denetçisi',
    rating: 5,
    accessibilityRating: 5,
    date: '18 Haziran 2026',
    content: 'Atatürk Bulvarı Starbucks şubesinde engelli tuvaleti ve braille bilgilendirmeleri eksiksiz. Tekerlekli sandalyeyle masalara geçiş çok rahat.',
    helpfulCount: 24,
    isHelpful: true,
  },
  {
    id: 'rev-2',
    venueId: 'v-6',
    userName: 'Mehmet Demir',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Topluluk Lideri',
    rating: 5,
    accessibilityRating: 5,
    date: '02 Haziran 2026',
    content: 'McDonald\'s Yenibağlar şubesinde engelli lavabosu kilitli değildi ve genişliği akülü sandalyeme tam uydu.',
    helpfulCount: 18,
    isHelpful: false,
  },
  {
    id: 'rev-3',
    venueId: 'v-31',
    userName: 'Zeynep Kaya',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    userBadge: 'Aktif Keşifçi',
    rating: 4,
    accessibilityRating: 4,
    date: '20 Mayıs 2026',
    content: 'Öncü Döner\'de hem rampa hem bilgilendirme yazısı mevcut. Rahatlıkla ziyaret edilebilir.',
    helpfulCount: 11,
    isHelpful: true,
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'u-101',
    userName: 'Ayşe Yılmaz',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    userLevel: 'Saha Denetçisi',
    isVerifiedContributor: true,
    date: '10 dakika önce',
    content: 'Espark AVM ana giriş rampası ve engelli asansörleri saha ekibimizce doğrulandı. Akülü sandalye manevra alanı oldukça geniş.',
    venueName: 'Espark Alışveriş Merkezi',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80',
    likesCount: 38,
    commentsCount: 9,
    isLiked: true,
    isSaved: true,
    locationName: 'Eskibağlar, Tepebaşı / Eskişehir',
    statusBadge: '✓ Saha Onaylı',
    categoryTag: 'dogrulanan',
    accessibilityTags: ['♿ Rampa', '🛗 Asansör', '🚻 Engelli Tuvaleti'],
  },
  {
    id: 'post-2',
    userId: 'u-102',
    userName: 'Mehmet Demir',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userLevel: 'Topluluk Lideri',
    isVerifiedContributor: true,
    date: '35 dakika önce',
    content: 'Vişnelik Mahallesi Atatürk Bulvarı üzerindeki kaldırımlar yenilendi. Rampa eğimleri tekerlekli sandalye geçişine tam uygun.',
    venueName: 'Vişnelik Bulvarı',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    likesCount: 24,
    commentsCount: 4,
    isLiked: false,
    isSaved: false,
    locationName: 'Vişnelik, Odunpazarı / Eskişehir',
    statusBadge: '✓ Doğrulandı',
    categoryTag: 'dogrulanan',
    accessibilityTags: ['🚶 Uygun Kaldırım', '♿ Rampa'],
  },
  {
    id: 'post-3',
    userId: 'u-103',
    userName: 'Zeynep Kaya',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    userLevel: 'Erişilebilirlik Keşifçisi',
    isVerifiedContributor: false,
    date: '1 saat önce',
    content: 'Haller Gençlik Merkezi içerisindeki engelli tuvaleti temiz ve bakımlı mı? Yakın zamanda ziyaret eden var mı?',
    venueName: 'Haller Gençlik Merkezi',
    likesCount: 12,
    commentsCount: 6,
    isLiked: false,
    isSaved: false,
    locationName: 'Hoşnudiye, Tepebaşı / Eskişehir',
    statusBadge: '❓ Sorular',
    categoryTag: 'sorular',
    accessibilityTags: ['🚻 Engelli Tuvaleti'],
  },
  {
    id: 'post-4',
    userId: 'u-104',
    userName: 'Caner Özkan',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userLevel: 'Topluluk Üyesi',
    isVerifiedContributor: false,
    date: '2 saat önce',
    content: 'Odunpazarı Evleri civarında tekerlekli sandalye ile rahat gezilebilecek düz zemin rotası arıyorum. Yardımcı olabilir misiniz?',
    venueName: 'Odunpazarı Tarihi Bölge',
    likesCount: 19,
    commentsCount: 8,
    isLiked: true,
    isSaved: false,
    locationName: 'Odunpazarı / Eskişehir',
    statusBadge: '🆘 Yardım İsteği',
    categoryTag: 'yardim',
    accessibilityTags: ['♿ Düz Zemin Rota'],
  },
  {
    id: 'post-5',
    userId: 'u-105',
    userName: 'Selin Yıldız',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    userLevel: 'Yeni Üye',
    isVerifiedContributor: false,
    date: '3 saat önce',
    content: 'Porsuk Bulvarı Adalar mevkiindeki yeni kafeye rampa eklenmiş! Çok memnun kaldım, herkese tavsiye ederim.',
    venueName: 'Adalar Cafe',
    likesCount: 15,
    commentsCount: 3,
    isLiked: false,
    isSaved: true,
    locationName: 'Porsuk Bulvarı, Eskişehir',
    statusBadge: '✨ Yeni Paylaşım',
    categoryTag: 'yeni',
    accessibilityTags: ['♿ Rampa', '☕ Düz Giriş'],
  }
];

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: 'chat-1',
    partnerName: 'Ayşe Yılmaz',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    partnerRole: 'Saha Denetçisi',
    lastMessage: 'Atatürk Bulvarı\'ndaki tüm kafelerin rampa verilerini haritaya işledik!',
    lastMessageTime: '14:25',
    unreadCount: 2,
    onlineStatus: true,
    venueTopic: 'Atatürk Bulvarı Keşfi',
  },
  {
    id: 'chat-2',
    partnerName: 'Eskişehir Erişilebilirlik Masası',
    partnerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    partnerRole: 'Resmi Destek',
    lastMessage: '79 yeni mekân saha bildirimi onaylandı ve haritaya eklendi. Teşekkürler!',
    lastMessageTime: 'Dün',
    unreadCount: 0,
    onlineStatus: false,
    venueTopic: 'Mekân Doğrulama',
  }
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'chat-1': [
    {
      id: 'm-1',
      chatId: 'chat-1',
      senderId: 'partner',
      text: 'Merhaba! Yenibağlar ve Atatürk Bulvarı saha verilerini kontrol ettin mi?',
      timestamp: '14:20',
      isMe: false,
    },
    {
      id: 'm-2',
      chatId: 'chat-1',
      senderId: 'me',
      text: 'Selam Ayşe, evet! 79 kafenin rampa, tuvalet ve kapı ölçümleri eklendi.',
      timestamp: '14:22',
      isMe: true,
    },
    {
      id: 'm-3',
      chatId: 'chat-1',
      senderId: 'partner',
      text: 'Atatürk Bulvarı\'ndaki tüm kafelerin rampa verilerini haritaya işledik!',
      timestamp: '14:25',
      isMe: false,
    }
  ]
};
