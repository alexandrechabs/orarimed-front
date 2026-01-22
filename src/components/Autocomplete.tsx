// src/components/AddressAutocomplete.tsx
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  error?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = 'Saisissez une adresse',
  error,
}: AddressAutocompleteProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
        if (onPlaceSelected) {
          onPlaceSelected(place);
        }
      }
    }
  };

  return (
    <div className="relative">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
        onLoad={() => setIsLoading(false)}
      >
        {!isLoading && (
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            fields={['address_components', 'formatted_address', 'geometry']}
            options={{
              componentRestrictions: {
                country: ['al', 'fr'],
              },
            }}
          >
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="pr-10"
            />
          </Autocomplete>
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
