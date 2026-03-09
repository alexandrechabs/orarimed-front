import { useRef, useState } from 'react';
import { DoctorProfile } from '@/types/doctor';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DoctorCardProps {
  slots: any[];
  clickSlot: (e: React.MouseEvent, slot: string | Date) => void;
}

export function Slots({ slots, clickSlot }: DoctorCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedDays, setExpandedDays] = useState<boolean>(false);
  let maxSlots = 0;

  const scrollLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -272,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 272,
        behavior: 'smooth',
      });
    }
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
          // Grouper les créneaux par jour
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const days = [];
          for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);

            // Formater le nom du jour
            const dayName = day.toLocaleDateString('fr-FR', {
              weekday: 'long',
            });
            const dayNumber = day.getDate();
            const month = day.toLocaleDateString('fr-FR', {
              month: 'short',
            });

            // Filtrer les créneaux pour ce jour
            const daySlots = slots.filter((slot) => {
              if (typeof slot === 'string') return false;
              const slotDate = new Date(slot.start);
              return (
                slotDate.getDate() === day.getDate() &&
                slotDate.getMonth() === day.getMonth() &&
                slotDate.getFullYear() === day.getFullYear()
              );
            });

            maxSlots = Math.max(maxSlots, daySlots.length);

            days.push(
              <div key={i} className="min-w-[120px]">
                <div className="font-medium text-center text-sm mb-2">
                  {dayName.charAt(0).toUpperCase() + dayName.slice(1)}{' '}
                  {dayNumber} {month}
                </div>
                <div className="border rounded-lg p-2">
                  <div className="space-y-1 m-a">
                    {daySlots.length > 0 ? (
                      <div>
                        {(expandedDays ? daySlots : daySlots.slice(0, 4)).map(
                          (slot, slotIndex) => {
                            // {daySlots.map((slot, slotIndex) => {
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
                        Pas de créneau
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
          {expandedDays ? 'Voir moins' : 'Voir plus de créneaux'}
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
}
