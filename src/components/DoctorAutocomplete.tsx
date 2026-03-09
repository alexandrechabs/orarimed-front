import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useUser } from '@/services/user/useUser';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

interface DoctorAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onDoctorSelect?: (doctor: { id: string; name: string }) => void;
  placeholder?: string;
  className?: string;
}

export const DoctorAutocomplete = ({
  value,
  onChange,
  onDoctorSelect,
  placeholder,
  className = '',
}: DoctorAutocompleteProps) => {
  const { searchDoctorAutocomplete } = useUser();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<
    Array<{
      id: string;
      name: string;
      type: 'doctor' | 'center' | 'speciality' | 'subSpeciality';
      speciality?: string;
      identifier?: string;
      imageUrl?: string;
    }>
  >([]);
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Appel API pour les suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      // search
      const response = await searchDoctorAutocomplete(query, language);

      let suggestions = [];
      response.specialities.forEach((speciality) => {
        suggestions.push({
          id: 'speciality_' + speciality.id,
          name: speciality.translations.find((t) => t.locale === language)
            ?.name,
          type: 'speciality',
        });
      });
      response.subSpecialities.forEach((subSpeciality) => {
        suggestions.push({
          id: 'subSpeciality_' + subSpeciality.id,
          name: subSpeciality.translations.find((t) => t.locale === language)
            ?.name,
          type: 'subSpeciality',
        });
      });

      response.doctors.forEach((doctor) => {
        suggestions.push({
          id: 'doctor_' + doctor.id,
          name: 'Dr ' + doctor.firstname + ' ' + doctor.lastname,
          type: 'doctor',
          speciality:
            doctor.speciality.translations.find((t) => t.locale === language)
              ?.name +
            ' ' +
            doctor.city,
          specialitySlug: doctor.speciality.slug,
          identifier: doctor.doctorIdentifier,
          imageUrl: doctor.avatar
            ? `${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`
            : '/default-avatar.png',
        });
      });

      response.centers.forEach((center) => {
        suggestions.push({
          id: 'center_' + center.id,
          name: center.name,
          type: 'center',
          speciality:
            center.speciality.translations.find((t) => t.locale === language)
              ?.name +
            ' ' +
            center.city,
          specialitySlug: center.speciality.slug,
          identifier: center.centerIdentifier,
          imageUrl: center.avatar
            ? `${API_URL}/center/${center.id}/avatar/${center.avatar}`
            : '/hopital.png',
        });
      });
      setSuggestions(suggestions || []);
    } catch (error) {
      console.error('Error fetching doctor suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
    fetchSuggestions(value);
    setIsOpen(true);
  };

  const handleSelectSuggestion = (doctor: {
    id: string;
    name: string;
    type: string;
    speciality?: string;
    imageUrl?: string;
    identifier?: string;
    specialitySlug?: string;
  }) => {
    onChange(doctor.name);
    onDoctorSelect?.(doctor);
    setIsOpen(false);

    if (doctor.type === 'doctor') {
      navigate(`/doctor/${doctor.specialitySlug}/${doctor.identifier}`);
    }

    if (doctor.type === 'center') {
      navigate(`/center/${doctor.specialitySlug}/${doctor.identifier}`);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`pl-10 h-12 text-base ${className}`}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion) => {
              if (
                suggestion.type === 'doctor' ||
                suggestion.type === 'center'
              ) {
                return (
                  <li
                    key={suggestion.id}
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={suggestion.imageUrl}
                        alt={suggestion.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="grid">
                      <span className="truncate text-sm">
                        {suggestion.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {suggestion.speciality}
                      </span>
                    </div>
                  </li>
                );
              }
              // Pour les spécialités et sous-spécialités
              return (
                <li
                  key={suggestion.id}
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">
                      {suggestion.type === 'speciality' ? '🏥' : '🔍'}
                    </span>
                  </div>
                  <span className="text-sm">{suggestion.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorAutocomplete;
