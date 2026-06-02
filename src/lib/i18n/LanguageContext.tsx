import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, languages } from "./translations";
import { fr, enUS, sq } from "date-fns/locale";

type LanguageContextType = {
  language: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)["sq"];
  languages: typeof languages;
  changeLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getDefaultLanguage = (): Language => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("language") : null;
    if (saved === "sq" || saved === "en" || saved === "fr") {
      return saved;
    }

    if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.toLowerCase();
      const code = browserLang.split("-")[0];
      if (code === "fr" || code === "en" || code === "sq") {
        return code;
      }
    }

    return "sq";
  };

  const [language, setLanguage] = useState<Language>(() =>
    getDefaultLanguage(),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        languages,
        changeLanguage: setLanguage,
        currentLanguage: language,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const useDateLocale = () => {
  const { language } = useLanguage();

  switch (language) {
    case "fr":
      return fr;
    case "sq":
      return sq;
    default:
      return enUS;
  }
};
