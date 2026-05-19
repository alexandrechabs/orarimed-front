import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AddressAutocomplete from "./Autocomplete";
import { DoctorAutocomplete } from "./DoctorAutocomplete";

interface MapProps {
  selectedCity: any;
  setSelectedCity: any;
  selectedDoctor: any;
  setSelectedDoctor: any;
  search: any;
}

export function SearchDoctor({
  selectedCity,
  setSelectedCity,
  selectedDoctor,
  setSelectedDoctor,
  search,
}: MapProps) {
  const { t } = useLanguage();

  return (
    <form className="space-y-4" onSubmit={search}>
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="relative col-span-2">
          <DoctorAutocomplete
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            onDoctorSelect={(doctor) => {
              setSelectedDoctor(doctor.name);
            }}
            placeholder={t.hero.doctorPlaceholder || "Nom, spécialité"}
            className="rounded-none rounded-l-md rounded-r-md md:rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="relative col-span-2">
          <AddressAutocomplete
            type="(regions)"
            value={selectedCity.address}
            onChange={(value) => {
              setSelectedCity((prev: any) => ({ ...prev, address: value }));
            }}
            placeholder={t.hero.cityPlaceholder || "Ville"}
            className="pl-10 h-12 text-base rounded-md md:rounded-none my-2 md:my-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onPlaceSelected={(place) => {
              setSelectedCity({
                address: place.formatted_address,
                lat: place.geometry?.location.lat(),
                lng: place.geometry?.location.lng(),
              });
            }}
          />
        </div>
        <div className="relative col-span-1">
          <Button
            size="xl"
            variant="accent"
            onClick={search}
            className="w-full md:px-4 h-12 text-base rounded-none rounded-r-md rounded-l-md md:rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Search className="w-5 h-5 mr-2" />
            {t.hero.searchDoctor}
          </Button>
        </div>
      </div>
    </form>
  );
}
