import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/services/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import { DoctorProfile } from '@/types/doctor';
import { SearchDoctor } from '@/components/search';
import { useUser } from '@/services/user/useUser';
import Navigation from '@/components/Navigation';

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { searchDoctors } = useUser();

  const [selectedCity, setSelectedCity] = useState({
    address: '',
    lat: '',
    lng: '',
  });
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            <div className="space-y-4">
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
                <Card
                  key={doctor.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <Avatar className="h-20 w-20 z-1">
                          <AvatarImage
                            src={
                              doctor.avatar
                                ? `${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`
                                : ''
                            }
                            alt={`${doctor.firstname} ${doctor.lastname}`}
                          />
                          <AvatarFallback>
                            {`${doctor.firstname[0]}${doctor.lastname[0]}`}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Dr. {doctor.firstname} {doctor.lastname}
                            </h3>
                            <p className="text-muted-foreground">
                              {
                                doctor.speciality.translations.find(
                                  (translation) =>
                                    translation.locale === language,
                                )?.name
                              }
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{doctor.city}</span>
                          </div>
                          {/* {doctor.availableToday && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Clock className="h-4 w-4" />
                              <span>Disponible aujourd'hui</span>
                            </div>
                          )} */}
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                          >
                            Voir le profil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
