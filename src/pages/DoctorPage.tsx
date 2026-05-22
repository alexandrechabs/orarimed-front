import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/services/user/useUser";
import { Map } from "@/components/Map";
import { DoctorProfile } from "@/types/doctor";

const API_URL = import.meta.env.VITE_API_URL;

export function DoctorPage() {
  const { getDoctor } = useUser();
  const { city, username } = useParams<{ city: string; username: string }>();
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
        // set seo data
        document.title =
          `${doctor.firstname} ${doctor.lastname}`.trim() +
          ` - ${
            doctor.speciality?.translations?.find((t) => t.locale === language)
              ?.name || "Doctor"
          }`;
        setDoctor(doctor);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        navigate("/404"); // Rediriger vers la page 404 si le médecin n'est pas trouvé
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
    const cleaned = phoneNumber.replace(/[^\d+]/g, "");

    // Si le numéro commence par +33 (France)
    if (cleaned.startsWith("+33")) {
      const number = cleaned.substring(3); // Enlever le +33
      const match = number.match(/^(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        return `+33 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
      }
    }
    // Si le numéro commence par +355 (Albanie)
    else if (cleaned.startsWith("+355")) {
      const number = cleaned.substring(4); // Enlever le +355
      const match = number.match(/^(\d{2})(\d{3})(\d{3,4})$/);
      if (match) {
        return `+355 ${match[1]} ${match[2]} ${match[3]}`;
      }
    }
    // Format générique pour les autres pays
    else if (cleaned.startsWith("+")) {
      const countryCode = cleaned.match(/^\+\d{1,3}/)?.[0] || "";
      const number = cleaned.substring(countryCode.length);
      // Format générique pour la partie locale
      const formattedNumber = number.replace(/(\d{2})(?=\d)/g, "$1 ");
      return `${countryCode} ${formattedNumber}`.trim();
    }

    // Si aucun format ne correspond, essayer le format français par défaut
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return match.slice(1).join(" ");
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
    "Doctor";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="items-center text-center">
                <Avatar className="h-44 w-44 mb-4">
                  <AvatarImage
                    src={
                      doctor.avatar
                        ? `${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`
                        : "/default-avatar.png"
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
                    navigate("/appointment", {
                      state: {
                        doctor: {
                          id: doctor.id,
                          fullName: `${doctor.firstname} ${doctor.lastname}`,
                          speciality: doctor.speciality.translations.find(
                            (translation) => translation.locale === language,
                          )?.name,
                        },
                        slot: null,
                      },
                    });
                  }}
                >
                  {t.doctor.takeAppointment}
                </Button>
              </CardContent>
            </Card>

            {/* Horaires d'ouverture */}
            {doctor.openingHours && doctor.openingHours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.doctor.openingHours}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
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
                      <div
                        key={dayName}
                        className={`flex justify-between px-4 py-1 ${dayHours[0]?.dayOfWeek === new Date().getDay() ? "bg-primary/10 rounded-md" : ""}`}
                      >
                        <span
                          className={`text-muted-foreground ${dayHours[0]?.dayOfWeek === new Date().getDay() ? "font-bold" : ""}`}
                        >
                          {dayName}
                        </span>
                        <div className="space-x-2">
                          {dayHours.map((hours, idx) => (
                            <span
                              className={`text-sm ${dayHours[0]?.dayOfWeek === new Date().getDay() ? "font-bold" : ""}`}
                              key={idx}
                            >
                              {hours.openTime} - {hours.closeTime}
                              {idx < dayHours.length - 1 ? ", " : ""}
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
                <CardTitle>{t.doctor.practicalInfo}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">{t.doctor.address} :</p>
                      <p className="text-accent">{doctor.address}</p>
                    </div>

                    <div>
                      <p className="font-medium">{t.doctor.phone} :</p>
                      <a
                        href={`tel:${doctor.phoneNumber.replace(/\s/g, "")}`}
                        className="text-accent"
                      >
                        {formatPhoneNumber(doctor.phoneNumber)}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* Carte OpenStreetMap */}
                    <Map
                      address={doctor.address || ""}
                      city={doctor.city || ""}
                      className="rounded-lg border h-[275px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.doctor.specialties}</CardTitle>
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
                <CardTitle>{t.doctor.centers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {doctor.centerUsers?.map((centerUser) => (
                    <Card
                      key={centerUser.id}
                      className="flex items-center hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate(
                          `/center/${centerUser.center.speciality.slug}/${centerUser.center.centerIdentifier}`,
                        );
                      }}
                    >
                      <div className="flex h-10 w-10 m-4 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={
                            centerUser.center.avatar
                              ? `${API_URL}/center/${centerUser.center.id}/avatar/${centerUser.center.avatar}`
                              : "/hopital.png"
                          }
                          alt={centerUser.center.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/hopital.png";
                          }}
                        />
                      </div>
                      <div className="grid mr-4">
                        <span className="truncate text-sm">
                          {centerUser.center.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {
                            centerUser.center.speciality!.translations?.find(
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
                <CardTitle>{t.doctor.about}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {doctor.bio || `${fullName} ${t.doctor.noBiography}`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.doctor.experience}</CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.experiences && doctor.experiences.length > 0 ? (
                  doctor.experiences?.map((experience) => (
                    <div className="mb-2">
                      <p>
                        <strong>
                          {experience.startYear} -{" "}
                          {experience.endYear || "Present"}
                        </strong>{" "}
                        {experience.company}
                      </p>
                      <p className="prose max-w-none text-muted-foreground whitespace-pre-line ml-8">
                        {experience.description || ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    {t.doctor.noExperience}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.doctor.diploma}</CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.diplomas ? (
                  doctor.diplomas.map((diploma) => (
                    <p>
                      <strong>{diploma.title}</strong> - {diploma.institution} (
                      {diploma.year}){" "}
                      {diploma.field ? `• ${diploma.field}` : ""}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground">{t.doctor.noDiploma}</p>
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
