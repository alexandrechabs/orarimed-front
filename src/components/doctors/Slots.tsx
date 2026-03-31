import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDateLocale, useLanguage } from '@/lib/i18n/LanguageContext';
import { useUser } from '@/services/user/useUser';
import { format } from 'date-fns';

interface DoctorCardProps {
  doctor: any;
  clickSlot: (e: React.MouseEvent, slot: string | Date) => void;
}

export const Slots = forwardRef<
  { load: (duration: number) => void },
  DoctorCardProps
>(({ doctor, clickSlot }, ref) => {
  const { t } = useLanguage();
  const dateLocale = useDateLocale();
  const { getAvailableSlots } = useUser();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedDays, setExpandedDays] = useState<boolean>(false);
  const [today, setToday] = useState<Date>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [numberOfDays, setNumberOfDays] = useState<number>(5); // Nombre de jours à afficher
  const width = 550;
  let maxSlots = 0;

  useEffect(() => {
    getSlots(today, 15);

    // set numberOfDays to 3 for mobile
    if (window.innerWidth < 768) {
      setNumberOfDays(3);
    }
  }, []);

  const load = (duration: number) => {
    if (window.innerWidth > 768) {
      setNumberOfDays(6);
    }
    setTimeout(() => {
      getSlots(today, duration);
    }, 200);
  };

  useImperativeHandle(ref, () => ({
    load,
  }));

  const scrollLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const next = new Date(today);
    next.setDate(today.getDate() - numberOfDays);
    setToday(next);
    getSlots(next, 15);
  };

  const scrollRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const next = new Date(today);
    next.setDate(today.getDate() + numberOfDays);
    setToday(next);
    getSlots(next, 15);
  };

  const getSlots = (date: Date, duration: number) => {
    // TODO: Implement logic to fetch slots
    getAvailableSlots(
      doctor.id,
      date.toISOString(),
      duration,
      numberOfDays,
    ).then((slot) => {
      setSlots(slot);
    });
  };

  const toggleDayExpansion = () => {
    setExpandedDays(!expandedDays);
  };

  return (
    <div className="md:col-span-4 relative mx-4">
      <div
        className="absolute -left-6 -top-2 z-10 p-2 cursor-pointer"
        onClick={scrollLeft}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ChevronLeft className="h-5 w-5 text-accent" />
      </div>
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {(() => {
          // Déterminer la locale à utiliser (une seule fois)
          const supportedLocales = Intl.DateTimeFormat.supportedLocalesOf([
            'sq',
            'en',
            'fr',
          ]);

          const days = [];
          maxSlots = 0;
          for (let i = 0; i < numberOfDays; i++) {
            const day = new Date(today);

            day.setDate(today.getDate() + i);

            // Formater le nom du jour
            const dayName = format(day, 'EEEE', {
              locale: dateLocale,
            });

            const dayNumber = day.getDate();
            const month = format(day, 'MMM', {
              locale: dateLocale,
            });

            // Filtrer les créneaux pour ce jour
            const daySlots = slots.filter((slot) => {
              if (new Date(slot.start) < new Date()) return false;
              if (typeof slot === 'string') return false;
              const slotDate = new Date(slot.start);
              return (
                slotDate.getDate() === day.getDate() &&
                slotDate.getMonth() === day.getMonth() &&
                slotDate.getFullYear() === day.getFullYear()
              );
            });

            maxSlots = Math.max(maxSlots, daySlots.length);

            // Calculer la largeur dynamique de chaque colonne
            const columnWidth = Math.max(94, Math.floor(width / numberOfDays)); // Minimum 94px, maximum basé sur 600px total

            days.push(
              <div
                key={i}
                className="w-[-webkit-fill-available]"
                style={{ maxWidth: `${columnWidth}px` }}
              >
                <div className="font-medium text-center text-sm mb-2">
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                  <br />
                  {dayNumber} {month}
                </div>
                <div className="border rounded-lg p-2">
                  <div className="space-y-1 m-a">
                    {daySlots.length > 0 ? (
                      <div>
                        {(expandedDays ? daySlots : daySlots.slice(0, 5)).map(
                          (slot, slotIndex) => {
                            // {daySlots.map((slot, slotIndex) => {
                            const startTime = new Date(
                              slot.start,
                            ).toLocaleTimeString('fr', {
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            return (
                              <div
                                key={slotIndex}
                                onClick={(e) => clickSlot(e, slot.start)}
                                className="px-2 py-1 m-1 bg-accent/10 text-accent text-sm rounded-md text-center font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                              >
                                {startTime}
                              </div>
                            );
                          },
                        )}
                        {!expandedDays && daySlots.length > 4 && (
                          <div
                            key={'totalSlots' + i}
                            className="px-2 py-1 m-1 text-xs text-center font-medium transition-colors"
                          >
                            +{daySlots.length - 4}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center">
                        {t.createRdv.searchPage.noSlotsShort}
                      </p>
                    )}
                  </div>
                </div>
              </div>,
            );
          }

          return days;
        })()}
      </div>
      {maxSlots > 4 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleDayExpansion();
          }}
          className="w-full mt-1 text-xs hover:underline"
        >
          {expandedDays
            ? t.createRdv.searchPage.viewLessSlots
            : t.createRdv.searchPage.viewMoreSlots}
        </button>
      )}
      <div
        className="absolute -right-6 -top-2 z-10 p-2 cursor-pointer"
        onClick={scrollRight}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ChevronRight className="h-5 w-5 text-accent" />
      </div>
    </div>
  );
});
