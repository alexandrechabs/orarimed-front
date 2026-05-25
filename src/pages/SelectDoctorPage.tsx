import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/services/user/useUser";
import { DoctorProfile } from "@/types/doctor";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { get } from "react-hook-form";
import { Center } from "@/types/center";

const API_URL = import.meta.env.VITE_API_URL;

export default function SelectDoctorPage() {
  const { getCenterDoctors, getCenter } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { centerId } = useParams<{ centerId: string }>();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [center, setCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      if (!centerId) {
        setError("Centre introuvable.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getCenterDoctors(centerId);
        setDoctors(data);
        const center = await getCenter(centerId);
        setCenter(center);
      } catch (err) {
        console.error("Error loading center doctors:", err);
        setError("Impossible de récupérer les médecins du centre.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, [centerId, getCenterDoctors]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto mt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-20">
            <div>
              <h1 className="text-3xl font-semibold">{center?.name}</h1>
              <p className="mt-2 text-sm text-gray-600">
                {t.center.centerDoctors}
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              {t.common.return}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          ) : doctors.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-700">
              Aucun médecin n'est disponible pour ce centre.
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {doctors.map((doctor) => {
                return <DoctorCard key={doctor.id} doctor={doctor} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
