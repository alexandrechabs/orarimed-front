// src/components/AddressAutocomplete.tsx
import {
  Autocomplete as GoogleAutocomplete,
} from '@react-google-maps/api';
import { useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useGoogleMapsLoader } from '@/lib/GoogleMapsLoader';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  type: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  type = '',
  placeholder = '',
  error,
  className = '',
}: AddressAutocompleteProps) {
  const { language } = useLanguage();
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getGoogleLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      fr: 'fr',
      en: 'en',
      sq: 'sq',
    };
    return langMap[lang] || 'en';
  };

  // ✅ Chargement singleton du script Google avec la langue actuelle
  // Le singleton empêche les rechargements multiples quand la langue change
  const { isLoaded } = useGoogleMapsLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    language: getGoogleLanguageCode(language),
  });

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    [],
  );

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (place?.formatted_address) {
      onPlaceSelected?.(place);
      onChange(place.formatted_address); // 🔥 update input automatiquement
    }
  }, [onPlaceSelected, onChange]);

  return (
    <div className="relative w-full">
      {isLoaded ? (
        <GoogleAutocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: ['al', 'fr'] },
            fields: ['address_components', 'formatted_address', 'geometry'],
            types: type ? [type] : undefined,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background ${className}`}
            style={{ position: 'relative', zIndex: 1 }}
          />
        </GoogleAutocomplete>
      ) : (
        <div className={`w-full h-10 px-3 py-2 text-sm border rounded-md bg-background flex items-center ${className}`}>
          {placeholder}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}