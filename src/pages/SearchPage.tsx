import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DoctorProfile } from '@/types/doctor';
import { SearchDoctor } from '@/components/search';
import { useUser } from '@/services/user/useUser';
import Navigation from '@/components/Navigation';
import { DoctorCard } from '@/components/doctors/DoctorCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { searchDoctors, getAvailableSlots } = useUser();

  const [selectedCity, setSelectedCity] = useState({
    address: '',
    lat: '',
    lng: '',
  });
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 272,
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -272,
        behavior: 'smooth',
      });
    }
  };

  // Récupérer le terme de recherche depuis l'URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const lat = searchParams.get('lat') || '';
    const lng = searchParams.get('lng') || '';
    setSelectedCity({ address: city, lat: lat, lng: lng });
    setSelectedDoctor(query);
    if (query || city) {
      searchDoctorsList(undefined, { address: city, lat, lng }, query);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const searchDoctorsList = async (
    e?: React.FormEvent,
    cityParams = selectedCity,
    doctorParams = selectedDoctor,
  ) => {
    e?.preventDefault(); // Empêche le rechargement de la page
    setIsLoading(true);
    try {
      const doctors = await searchDoctors(
        cityParams.address,
        cityParams.lat,
        cityParams.lng,
        language,
        doctorParams,
      );

      setDoctors(doctors);
      doctors.forEach(async (doctor) => {
        let slots = await getAvailableSlots(
          doctor.id,
          new Date().toISOString().split('T')[0],
        );
        setDoctors((prev) =>
          prev.map((d) => (d.id === doctor.id ? { ...doctor, slots } : d)),
        );
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la recherche des médecins:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      <div className="max-w-4xl mx-auto mt-20">
        {/* Barre de recherche */}
        <SearchDoctor
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          search={searchDoctorsList}
        />

        {/* Résultats */}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <div className="space-y-4 mt-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun médecin ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
