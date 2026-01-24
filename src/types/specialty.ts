export type Locale = 'fr' | 'en' | 'al';

export interface Translation {
  id?: number;
  locale: Locale;
  name: string;
}

export interface SubSpeciality {
  id?: number;
  slug: string;
  translations: Translation[];
}

export interface Speciality {
  id?: number;
  slug: string;
  translations: Translation[];
  subSpecialities: SubSpeciality[];
  icon?: string;
  color?: string;
  position: number;
}
