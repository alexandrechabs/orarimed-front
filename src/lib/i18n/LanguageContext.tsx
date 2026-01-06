import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, languages } from './translations';
import { fr, enUS, sq } from 'date-fns/locale';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['sq'];
  languages: typeof languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('orariMedLang');
    return (saved as Language) || 'sq';
  });

  useEffect(() => {
    localStorage.setItem('orariMedLang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const getDateLocale = () => {
  const { language } = useLanguage();
  switch (language) {
    case 'fr':
      return fr;
    case 'sq':
      return sq;
    default:
      return enUS;
  }
};
