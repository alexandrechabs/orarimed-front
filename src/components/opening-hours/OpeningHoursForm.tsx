import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { OpeningHour } from '@/types/openingHour';

type PeriodType = 'morning' | 'afternoon';

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
] as const;

export const PERIODS = [
  { value: 'morning', label: 'Matin' },
  { value: 'afternoon', label: 'Après-midi' },
] as const;

interface OpeningHoursFormProps {
  name?: string;
}

export default function OpeningHoursForm({
  name = 'openingHours',
}: OpeningHoursFormProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const openingHours = watch(name) || [];

  const [newHour, setNewHour] = useState<Omit<OpeningHour, 'id'>>({
    dayOfWeek: 1,
    period: 'morning',
    openTime: '09:00',
    closeTime: '12:00',
    userId: '',
  });

  const isTimeSlotTaken = (
    day: number,
    period: PeriodType,
    index: number = -1,
  ) => {
    return openingHours.some(
      (hour: OpeningHour, i: number) =>
        i !== index && hour.dayOfWeek === day && hour.period === period,
    );
  };

  const handleAddHour = () => {
    // Vérifier que l'heure de fin est après l'heure de début
    if (newHour.closeTime <= newHour.openTime) {
      alert("L'heure de fermeture doit être après l'heure d'ouverture");
      return;
    }

    // Vérifier si le créneau existe déjà
    if (isTimeSlotTaken(newHour.dayOfWeek, newHour.period)) {
      const day =
        DAYS_OF_WEEK.find((d) => d.value === newHour.dayOfWeek)?.label ||
        'ce jour';
      const period = newHour.period === 'morning' ? 'matin' : 'après-midi';
      alert(`Un créneau pour le ${day} ${period} existe déjà.`);
      return;
    }

    // Ajouter le nouvel horaire
    append({
      ...newHour,
      id: Date.now().toString(), // ID temporaire
    });

    // Réinitialiser le formulaire
    // Réinitialiser avec le même jour mais en alternant la période
    setNewHour({
      dayOfWeek: newHour.dayOfWeek,
      period: newHour.period === 'morning' ? 'afternoon' : 'morning',
      openTime: '09:00',
      closeTime: '12:00',
      userId: '',
    });
  };

  // La suppression est gérée par le bouton de suppression via remove(index)

  // Le chargement est géré par le parent

  // Vérifier les chevauchements d'horaires
  const hasTimeOverlaps = (() => {
    // Grouper par jour
    const byDay: Record<number, OpeningHour[]> = {};
    openingHours.forEach((hour: OpeningHour) => {
      if (!byDay[hour.dayOfWeek]) {
        byDay[hour.dayOfWeek] = [];
      }
      byDay[hour.dayOfWeek].push(hour);
    });

    // Vérifier les chevauchements pour chaque jour
    for (const day in byDay) {
      const dayHours = byDay[day].sort((a, b) =>
        a.openTime.localeCompare(b.openTime),
      );

      for (let i = 1; i < dayHours.length; i++) {
        if (dayHours[i].openTime < dayHours[i - 1].closeTime) {
          return true; // Chevauchement détecté
        }
      }
    }

    return false;
  })();

  return (
    <div className="space-y-6">
      {hasTimeOverlaps && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Attention : Certains créneaux se chevauchent. Veuillez vérifier vos
            horaires.
          </AlertDescription>
        </Alert>
      )}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-medium">Ajouter des horaires</h3>
        <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label>Jour</Label>
            <Select
              value={newHour.dayOfWeek.toString()}
              onValueChange={(value) =>
                setNewHour({ ...newHour, dayOfWeek: parseInt(value, 10) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un jour" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Créneau</Label>
            <Select
              value={newHour.period}
              onValueChange={(value: PeriodType) =>
                setNewHour({ ...newHour, period: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un créneau" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Heure d'ouverture</Label>
            <Input
              type="time"
              value={newHour.openTime}
              onChange={(e) =>
                setNewHour({ ...newHour, openTime: e.target.value })
              }
              className="w-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Heure de fermeture</Label>
            <Input
              type="time"
              value={newHour.closeTime}
              onChange={(e) =>
                setNewHour({ ...newHour, closeTime: e.target.value })
              }
              className="w-[120px]"
            />
          </div>

          <Button type="button" onClick={handleAddHour} className="mb-1">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Horaires configurés</h3>
        {openingHours.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aucun horaire n'a encore été configuré. Ajoutez vos horaires de
              consultation ci-dessus.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {openingHours.map((hour: OpeningHour, index: number) => (
              <div
                key={hour.id || index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {
                      DAYS_OF_WEEK.find((d) => d.value === hour.dayOfWeek)
                        ?.label
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {hour.period === 'morning' ? 'Matin' : 'Après-midi'}:{' '}
                    {hour.openTime} - {hour.closeTime}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
