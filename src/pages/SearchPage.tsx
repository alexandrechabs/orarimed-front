import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorProfile } from "@/types/doctor";
import { SearchDoctor } from "@/components/search";
import { useUser } from "@/services/user/useUser";
import Navigation from "@/components/Navigation";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { searchDoctors } = useUser();

  const [selectedCity, setSelectedCity] = useState({
    address: "",
    lat: "",
    lng: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [doctors, setDoctors] = useState<{
    meta: {
      total: number;
      currentPage: number;
      firstPage: number;
      lastPage: number;
    };
    data: DoctorProfile[];
  }>({
    meta: { total: 0, currentPage: 0, firstPage: 0, lastPage: 0 },
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le terme de recherche depuis l'URL
  useEffect(() => {
    const query = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const lat = searchParams.get("lat") || "";
    const lng = searchParams.get("lng") || "";
    const page = searchParams.get("page") || undefined;
    setSelectedCity({ address: city, lat: lat, lng: lng });
    setSelectedDoctor(query);
    if (query || city) {
      searchDoctorsList(
        undefined,
        { address: city, lat, lng },
        query,
        page ? parseInt(page) : undefined,
      );
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const searchDoctorsList = async (
    e?: React.FormEvent,
    cityParams = selectedCity,
    doctorParams = selectedDoctor,
    page?: number,
  ) => {
    e?.preventDefault(); // Empêche le rechargement de la page
    setIsLoading(true);
    try {
      // chaange url to include page parameter if defined
      const url = new URL(window.location.href);
      url.searchParams.set("q", doctorParams);
      url.searchParams.set("city", cityParams.address);
      url.searchParams.set("lat", cityParams.lat);
      url.searchParams.set("lng", cityParams.lng);
      if (page) {
        url.searchParams.set("page", page.toString());
      } else {
        url.searchParams.delete("page");
      }
      window.history.replaceState({}, "", url);

      const doctors = await searchDoctors(
        cityParams.address,
        cityParams.lat,
        cityParams.lng,
        language,
        doctorParams,
        page,
      );

      setDoctors(doctors);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la recherche des médecins:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-20">
        {/* Barre de recherche */}
        <SearchDoctor
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          search={searchDoctorsList}
        />

        <p className="mt-4">
          {doctors.meta.total} {t.createRdv.searchPage.results}
        </p>
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
          ) : doctors.data.length > 0 ? (
            <div className="space-y-4 mt-4">
              {doctors.data.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
              {/* pagination */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() =>
                    searchDoctorsList(
                      undefined,
                      selectedCity,
                      selectedDoctor,
                      doctors.meta.currentPage - 1,
                    )
                  }
                  disabled={doctors.meta.currentPage <= 1}
                  className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="mx-4">
                  {doctors.meta.currentPage} / {doctors.meta.lastPage}
                </span>
                <button
                  onClick={() =>
                    searchDoctorsList(
                      undefined,
                      selectedCity,
                      selectedDoctor,
                      doctors.meta.currentPage + 1,
                    )
                  }
                  disabled={doctors.meta.currentPage >= doctors.meta.lastPage}
                  className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.hero.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
