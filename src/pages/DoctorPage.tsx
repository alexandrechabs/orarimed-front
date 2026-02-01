import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/services/user/useUser';
import { Map } from '@/components/Map';
import { DoctorProfile } from '@/types/doctor';

const API_URL = import.meta.env.VITE_API_URL;

export function DoctorPage() {
  const { getDoctor } = useUser();
  const { city, user: username } = useParams<{ city: string; user: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setIsLoading(true);
        // Remplacez cette URL par votre endpoint API réel
        const doctor = await getDoctor(username);
        setDoctor(doctor);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        navigate('/404'); // Rediriger vers la page 404 si le médecin n'est pas trouvé
      } finally {
        setIsLoading(false);
      }
    };

    if (username && city) {
      fetchDoctorProfile();
    }
  }, [username, city, navigate]);

  function formatPhoneNumber(phoneNumber: string): string {
    // Supprimer tous les caractères non numériques sauf le +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Si le numéro commence par +33 (France)
    if (cleaned.startsWith('+33')) {
      const number = cleaned.substring(3); // Enlever le +33
      const match = number.match(/^(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        return `+33 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
      }
    }
    // Si le numéro commence par +355 (Albanie)
    else if (cleaned.startsWith('+355')) {
      const number = cleaned.substring(4); // Enlever le +355
      const match = number.match(/^(\d{2})(\d{3})(\d{3,4})$/);
      if (match) {
        return `+355 ${match[1]} ${match[2]} ${match[3]}`;
      }
    }
    // Format générique pour les autres pays
    else if (cleaned.startsWith('+')) {
      const countryCode = cleaned.match(/^\+\d{1,3}/)?.[0] || '';
      const number = cleaned.substring(countryCode.length);
      // Format générique pour la partie locale
      const formattedNumber = number.replace(/(\d{2})(?=\d)/g, '$1 ');
      return `${countryCode} ${formattedNumber}`.trim();
    }

    // Si aucun format ne correspond, essayer le format français par défaut
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return match.slice(1).join(' ');
    }

    // Si rien ne correspond, retourner le numéro d'origine
    return phoneNumber;
  }

  if (isLoading || !doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="md:w-2/3 space-y-6">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${doctor.firstname} ${doctor.lastname}`.trim();
  const specialityName =
    doctor.speciality?.translations?.find((t) => t.locale === language)?.name ||
    'Doctor';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <Avatar className="h-52 w-52 mb-4">
                  {doctor.avatar ? (
                    <AvatarImage
                      src={`${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`}
                      alt={fullName}
                    />
                  ) : (
                    <AvatarFallback>
                      {fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-2xl">{fullName}</CardTitle>
                <p className="text-muted-foreground">{specialityName}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {doctor.phoneNumber && (
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Téléphone :</span>
                    <a
                      href={`tel:${doctor.phoneNumber.replace(/\s/g, '')}`}
                      className="hover:underline"
                    >
                      {formatPhoneNumber(doctor.phoneNumber)}
                    </a>
                  </div>
                )}

                {doctor.city && (
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Ville :</span>
                    <span>{doctor.city}</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => {
                    /* Logique de prise de rendez-vous */
                  }}
                >
                  Prendre rendez-vous
                </Button>
              </CardContent>
            </Card>

            {/* Horaires d'ouverture */}
            {doctor.openingHours && doctor.openingHours.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      doctor.openingHours.reduce(
                        (acc, hours) => {
                          const dayName =
                            t.daysOfWeek[
                              hours.dayOfWeek as keyof typeof t.daysOfWeek
                            ];
                          if (!acc[dayName]) {
                            acc[dayName] = [];
                          }
                          acc[dayName].push(hours);
                          return acc;
                        },
                        {} as Record<string, typeof doctor.openingHours>,
                      ),
                    ).map(([dayName, dayHours]) => (
                      <div key={dayName} className="flex justify-between">
                        <span className="text-muted-foreground">{dayName}</span>
                        <div className="space-x-2">
                          {dayHours.map((hours, idx) => (
                            <span className="text-sm" key={idx}>
                              {hours.openTime} - {hours.closeTime}
                              {idx < dayHours.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Adresse :</p>
                      <p className="text-accent">{doctor.address}</p>
                    </div>

                    <div>
                      <p className="font-medium">Téléphone :</p>
                      <a
                        href={`tel:${doctor.phoneNumber.replace(/\s/g, '')}`}
                        className="text-accent"
                      >
                        {formatPhoneNumber(doctor.phoneNumber)}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* Carte OpenStreetMap */}
                    <div className="mt-4">
                      <Map
                        address={doctor.address || ''}
                        city={doctor.city || ''}
                        className="rounded-lg border"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spécialités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {doctor.subSpecialitiesUsers.map((speciality) => (
                    <Badge
                      key={speciality.id}
                      variant="secondary"
                      className="text-sm bg-accent/10 text-accent"
                    >
                      {speciality.subSpeciality?.translations?.find(
                        (t) => t.locale === language,
                      )?.name || speciality.subSpeciality?.slug}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>À propos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {doctor.bio ||
                    `${fullName} n'a pas encore rédigé sa biographie.`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formation et expérience</CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.education ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: doctor.education }}
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Les informations de formation ne sont pas disponibles.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorPage;
