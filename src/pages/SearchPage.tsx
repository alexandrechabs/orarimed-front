import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock } from 'lucide-react';
import { DoctorProfile } from '@/types/doctor';
import { SearchDoctor } from '@/components/search';
import { useUser } from '@/services/user/useUser';
import Navigation from '@/components/Navigation';

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const clickSlot = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('plop');
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
                  onClick={() => navigate(`/doctor/${doctor.doctorIdentifier}`)}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      {/* Colonne 1 : Photo et informations du médecin */}
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={`${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`}
                              alt={`${doctor.firstname} ${doctor.lastname}`}
                            />
                            <AvatarFallback>
                              {doctor.firstname[0]}
                              {doctor.lastname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base">
                              Dr. {doctor.firstname} {doctor.lastname}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {
                                doctor.speciality.translations.find(
                                  (translation) =>
                                    translation.locale === language,
                                )?.name
                              }
                            </p>
                            <div className="mt-4 text-sm flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{doctor.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Section des créneaux par jour */}
                      <div className="md:col-span-4">
                        {doctor.slots && doctor.slots.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {(() => {
                              // Grouper les créneaux par jour
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              const days = [];
                              for (let i = 0; i < 4; i++) {
                                const day = new Date(today);
                                day.setDate(today.getDate() + i);

                                // Formater le nom du jour
                                const dayName = day.toLocaleDateString(
                                  'fr-FR',
                                  { weekday: 'long' },
                                );
                                const dayNumber = day.getDate();
                                const month = day.toLocaleDateString('fr-FR', {
                                  month: 'short',
                                });

                                // Filtrer les créneaux pour ce jour
                                const daySlots = doctor.slots
                                  .filter((slot) => {
                                    if (typeof slot === 'string') return false;
                                    const slotDate = new Date(slot.start);
                                    return (
                                      slotDate.getDate() === day.getDate() &&
                                      slotDate.getMonth() === day.getMonth() &&
                                      slotDate.getFullYear() ===
                                        day.getFullYear()
                                    );
                                  })
                                  .slice(0, 4); // Limiter à 3 créneaux par jour

                                days.push(
                                  <div
                                    key={i}
                                    className="border rounded-lg p-2"
                                  >
                                    <div className="font-medium text-center text-sm mb-2">
                                      {dayName.charAt(0).toUpperCase() +
                                        dayName.slice(1)}{' '}
                                      {dayNumber} {month}
                                    </div>
                                    <div className="space-y-1">
                                      {daySlots.length > 0 ? (
                                        daySlots.map((slot, slotIndex) => {
                                          const startTime = new Date(
                                            slot.start,
                                          ).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          });
                                          const endTime = new Date(
                                            slot.end,
                                          ).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          });

                                          return (
                                            <div
                                              key={slotIndex}
                                              onClick={clickSlot}
                                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded text-center font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                                            >
                                              {startTime}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <p className="text-xs text-muted-foreground text-center">
                                          Pas de créneau
                                        </p>
                                      )}
                                    </div>
                                  </div>,
                                );
                              }

                              return days;
                            })()}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Aucun créneau disponible pour les 4 prochains jours
                          </p>
                        )}
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
