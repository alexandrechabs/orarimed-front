import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import 'leaflet/dist/leaflet.css';
import { LanguageProvider } from './lib/i18n/LanguageContext';
import { AuthProvider } from './services/auth/auth.context';
import { UserProvider } from './services/user/user.context';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </LanguageProvider>,
);
