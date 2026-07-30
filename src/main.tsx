import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAnalytics } from './firebase';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Başlangıçta (production) Analytics'i başlat ve temel page_view gönder
if (import.meta.env.PROD) {
  initAnalytics().then((analytics) => {
    if (analytics) {
      import('firebase/analytics').then(({ logEvent }) => {
        try {
          logEvent(analytics, 'page_view', { page_path: window.location.pathname });
        } catch (e) {
          // ignore
        }
      });
      // eslint-disable-next-line no-console
      console.log('Firebase Analytics başlatıldı');
    }
  });
}
