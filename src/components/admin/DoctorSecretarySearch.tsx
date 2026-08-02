import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, X, Plus, User, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useUser } from "@/services/user/useUser";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/roles";

const API_URL = import.meta.env.VITE_API_URL;

interface DoctorSearchResult {
  id: string;
  firstname: string;
  lastname: string;
  speciality: {
    id: string;
    slug: string;
    translations: Array<{
      id: string;
      name: string;
      locale: string;
    }>;
  };
  city: string;
  avatar?: string;
  doctorIdentifier: string;
}

interface DoctorWithRights extends DoctorSearchResult {}

interface DoctorSecretarySearchProps {
  secretaryId: string;
  secretaryName: string;
  onSuccess?: () => void;
  maxSelection?: number;
}

export function DoctorSecretarySearch({
  secretaryId,
  secretaryName,
  onSuccess,
  maxSelection = 10,
}: DoctorSecretarySearchProps) {
  const { getUsersAdmin, addDoctorsToSecretary, getSecretaryDoctors } =
    useUser();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const addDoctor = t.adminSettings.secretary.addDoctor;

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DoctorSearchResult[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<DoctorWithRights[]>(
    [],
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions quand on clique en dehors
  useEffect(() => {
    getSecretaryDoctors(secretaryId).then((doctors) => {
      setSelectedDoctors(doctors);
    });

    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Appel API pour les suggestions de docteurs
  const fetchDoctorSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const doctors = await getUsersAdmin(UserRole.DOCTOR, query);
      setSuggestions(doctors);
    } catch (error) {
      console.error("Error fetching doctor suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchDoctorSuggestions(value);
    setIsOpen(true);
  };

  const handleSelectDoctor = (doctor: DoctorSearchResult) => {
    // Vérifier si le docteur n'est pas déjà sélectionné
    if (!selectedDoctors.find((d) => d.id === doctor.id)) {
      if (selectedDoctors.length >= maxSelection) {
        toast({
          title: addDoctor.limit,
          description: addDoctor.limitDescription.replace(
            "{max}",
            maxSelection.toString(),
          ),
          variant: "destructive",
        });
        return;
      }
      setSelectedDoctors([...selectedDoctors, doctor]);
    }
    setSearchQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleRemoveDoctor = (doctorId: string) => {
    setSelectedDoctors(selectedDoctors.filter((d) => d.id !== doctorId));
  };

  const handleAddDoctorsToSecretary = async () => {
    try {
      setIsAdding(true);
      console.log(selectedDoctors);

      const doctorsWithRights = selectedDoctors.map((doctor) => doctor.id);

      await addDoctorsToSecretary(secretaryId, doctorsWithRights);

      let description = addDoctor.addSuccess
        .replace("{nbDoctors}", selectedDoctors.length.toString())
        .replace("{secretaryName}", secretaryName);

      toast({
        title: t.common.success,
        description,
      });

      setSelectedDoctors([]);
      onSuccess?.();
    } catch (error) {
      toast({
        title: t.common.error,
        description: error.message || addDoctor.addSuccess,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleAdminRightsChange = (doctorId: string, isAdmin: boolean) => {
    setSelectedDoctors(
      selectedDoctors.map((doctor) =>
        doctor.id === doctorId ? { ...doctor, isAdmin } : doctor,
      ),
    );
  };

  const getDoctorName = (doctor: DoctorSearchResult) => {
    return `Dr ${doctor.firstname} ${doctor.lastname}`;
  };

  const getSpecialityName = (doctor: DoctorSearchResult) => {
    return (
      doctor.speciality.translations.find((t) => t.locale === language)?.name ||
      doctor.speciality.slug
    );
  };

  return (
    <>
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={addDoctor.search}
            className="pl-10"
          />
        </div>

        {/* Suggestions de recherche */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-10 max-h-60 overflow-auto">
            {suggestions.map((doctor) => {
              const isSelected = selectedDoctors.find(
                (d) => d.id === doctor.id,
              );
              return (
                <div
                  key={doctor.id}
                  className={`px-4 py-3 text-sm cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                    isSelected ? "bg-gray-100 opacity-60" : ""
                  }`}
                  onClick={() => !isSelected && handleSelectDoctor(doctor)}
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    {doctor.avatar ? (
                      <img
                        src={`${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`}
                        alt={getDoctorName(doctor)}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-300">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">
                      {getDoctorName(doctor)}
                      {isSelected && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {addDoctor.alreadySelected}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {getSpecialityName(doctor)} • {doctor.city}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Docteurs sélectionnés */}
      {selectedDoctors.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">
            {addDoctor.selected} ({selectedDoctors.length}/{maxSelection}):
          </div>
          <div className="space-y-2">
            {selectedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                    {doctor.avatar ? (
                      <img
                        src={`${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`}
                        alt={getDoctorName(doctor)}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-300">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{getDoctorName(doctor)}</div>
                    <div className="text-xs text-gray-500">
                      {getSpecialityName(doctor)} • {doctor.city}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveDoctor(doctor.id)}
                    className="hover:bg-gray-200 rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton d'ajout */}
      <Button
        onClick={handleAddDoctorsToSecretary}
        disabled={selectedDoctors.length === 0 || isAdding}
        className="w-full"
      >
        {isAdding ? (
          <>{t.common.saving}</>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            {addDoctor.add.replace(
              "{nbDoctors}",
              selectedDoctors.length.toString(),
            )}
          </>
        )}
      </Button>
    </>
  );
}

export default DoctorSecretarySearch;
