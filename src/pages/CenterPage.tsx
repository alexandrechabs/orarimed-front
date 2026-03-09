import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/services/user/useUser';
import { Map } from '@/components/Map';
import { Center } from '@/types/center';

const API_URL = import.meta.env.VITE_API_URL;

export function CenterPage() {
  const { getCenter } = useUser();
  const { city, username } = useParams<{ city: string; username: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [center, setCenter] = useState<Center | null>(null);

  useEffect(() => {
    const fetchCenterProfile = async () => {
      try {
        setIsLoading(true);
        // Remplacez cette URL par votre endpoint API réel
        const center = await getCenter(username);
        setCenter(center);
      } catch (error) {
        console.error('Error fetching center profile:', error);
        navigate('/404'); // Rediriger vers la page 404 si le médecin n'est pas trouvé
      } finally {
        setIsLoading(false);
      }
    };

    if (username && city) {
      fetchCenterProfile();
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

  if (isLoading || !center) {
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

  const fullName = `${center.name}`.trim();
  const specialityName =
    center.speciality?.translations?.find((t) => t.locale === language)?.name ||
    'Center';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <Avatar className="h-44 w-44 mb-4">
                  <AvatarImage
                    src={
                      center.avatar
                        ? `${API_URL}/center/${center.id}/avatar/${center.avatar}`
                        : '/hopital.png'
                    }
                    alt={fullName}
                  />
                </Avatar>
                <CardTitle className="text-2xl">{fullName}</CardTitle>
                <p className="text-muted-foreground">{specialityName}</p>
              </CardHeader>

              <CardContent className="space-y-4">
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
            {center.openingHours && center.openingHours.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      center.openingHours.reduce(
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
                        {} as Record<string, typeof center.openingHours>,
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
                      <p className="text-accent">{center.address}</p>
                    </div>

                    <div>
                      <p className="font-medium">Téléphone :</p>
                      <a
                        href={`tel:${center.phoneNumber.replace(/\s/g, '')}`}
                        className="text-accent"
                      >
                        {formatPhoneNumber(center.phoneNumber)}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* Carte OpenStreetMap */}
                    <div className="mt-4">
                      <Map
                        address={center.address || ''}
                        city={center.city || ''}
                        className="rounded-lg border"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Docteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {center.centerUsers?.length === 0 &&
                    `${center.name} n'a pas de docteurs.`}
                </p>
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {center.centerUsers?.length > 0 &&
                    center.centerUsers.map((centerUser) => (
                      <Card
                        key={centerUser.id}
                        className="flex items-center hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(
                            `/doctor/${centerUser.user.speciality.slug}/${centerUser.user.doctorIdentifier}`,
                          );
                        }}
                      >
                        <div className="flex h-10 w-10 m-4 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={
                              centerUser.user.avatar
                                ? `${API_URL}/user/${centerUser.user.id}/avatar/${centerUser.user.avatar}`
                                : '/default-avatar.png'
                            }
                            alt={centerUser.user.firstname}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className="grid">
                          <span className="truncate text-sm">
                            {centerUser.user.firstname}{' '}
                            {centerUser.user.lastname}
                          </span>
                          <span className="text-xs text-gray-500">
                            {
                              centerUser.user.speciality!.translations?.find(
                                (t) => t.locale === language,
                              )?.name
                            }
                          </span>
                        </div>
                      </Card>
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
                  {center.description ||
                    `${center.name} n'a pas encore de description.`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenterPage;
