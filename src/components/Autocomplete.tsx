// src/components/AddressAutocomplete.tsx
import {
  LoadScript,
  Autocomplete as GoogleAutocomplete,
} from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

const LIBRARIES = ['places'] as const;

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = '',
  error,
  className = '',
}: AddressAutocompleteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Empêche le comportement par défaut du clic
  useEffect(() => {}, []);

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    [],
  );

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        onPlaceSelected?.(place);
      }
    }
  }, [onPlaceSelected]);

  return (
    <div className="relative w-full">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
        onLoad={() => setIsLoading(false)}
      >
        {!isLoading && (
          <GoogleAutocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
              componentRestrictions: { country: ['al', 'fr'] },
              fields: ['address_components', 'formatted_address', 'geometry'],
              types: ['address'],
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
        )}
      </LoadScript>
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
