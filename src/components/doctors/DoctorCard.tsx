import { useState, useRef } from 'react';
import { DoctorProfile } from '@/types/doctor';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Slots } from './Slots';

const API_URL = import.meta.env.VITE_API_URL;

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const clickSlot = async (e: React.MouseEvent, slot: string | Date) => {
    e.preventDefault();
    e.stopPropagation();

    navigate('/appointment', {
      state: {
        doctor: {
          id: doctor.id,
          fullName: `${doctor.firstname} ${doctor.lastname}`,
          speciality: doctor.speciality.translations.find(
            (translation) => translation.locale === language,
          )?.name,
        },
        slot: slot,
      },
    });
  };

  return (
    <Card
      key={doctor.id}
      onClick={() =>
        navigate(`/doctor/${doctor.speciality.slug}/${doctor.doctorIdentifier}`)
      }
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
                      (translation) => translation.locale === language,
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
          {doctor.slots && doctor.slots.length > 0 ? (
            <Slots slots={doctor.slots} clickSlot={clickSlot} />
          ) : (
            <div className="md:col-span-4 m-auto  ">
              <p className="text-sm text-muted-foreground">
                Aucun créneau disponible pour les 4 prochains jours
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
