import en from './locales/en';
import fr from './locales/fr';
import sq from './locales/sq';
import { TranslationKey } from './types';

export type Language = 'sq' | 'en' | 'fr';

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const translations: Record<Language, TranslationKey> = {
  sq: sq,
  en: en,
  fr: fr,
};
