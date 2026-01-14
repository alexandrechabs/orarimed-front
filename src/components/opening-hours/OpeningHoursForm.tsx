import { useState, useEffect } from 'react';
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
import { useAuth } from '@/services/auth/useAuth';
import { OpeningHour } from '@/types/openingHour';

type PeriodType = 'morning' | 'afternoon';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

const PERIODS = [
  { value: 'morning', label: 'Matin' },
  { value: 'afternoon', label: 'Après-midi' },
];

export default function OpeningHoursForm() {
  const { getOpeningHours, saveOpeningHours } = useAuth();
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newHour, setNewHour] = useState<Omit<OpeningHour, 'id'>>({
    dayOfWeek: 1,
    period: 'morning',
    openTime: '09:00',
    closeTime: '12:00',
    userId: '',
  });

  // Charger les horaires existants
  useEffect(() => {
    // TODO: Implémenter l'appel API pour charger les horaires existants
    const fetchOpeningHours = async () => {
      try {
        const data = await getOpeningHours();
        setOpeningHours(data);
      } catch (error) {
        console.error('Erreur lors du chargement des horaires:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpeningHours();
  }, []);

  const isTimeSlotTaken = (day: number, period: PeriodType) => {
    return openingHours.some(
      (hour) => hour.dayOfWeek === day && hour.period === period
    );
  };

  const handleAddHour = () => {
    // Vérifier si le créneau existe déjà
    if (isTimeSlotTaken(newHour.dayOfWeek, newHour.period)) {
      const day =
        DAYS_OF_WEEK.find((d) => d.value === newHour.dayOfWeek)?.label ||
        'ce jour';
      const period = newHour.period === 'morning' ? 'matin' : 'après-midi';

      // Afficher une alerte si le créneau existe déjà
      alert(`Un créneau pour le ${day} ${period} existe déjà.`);
      return;
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (newHour.closeTime <= newHour.openTime) {
      alert("L'heure de fermeture doit être après l'heure d'ouverture");
      return;
    }

    setOpeningHours([...openingHours, { ...newHour }]);

    // Réinitialiser le formulaire
    setNewHour({
      dayOfWeek: newHour.dayOfWeek, // Garder le même jour
      period: newHour.period === 'morning' ? 'afternoon' : 'morning', // Basculer la période
      openTime: '09:00',
      closeTime: '12:00',
    });
  };

  const handleDeleteHour = (id: number) => {
    setOpeningHours(openingHours.filter((hour) => hour.id !== id));
    // TODO: Implémenter la suppression côté serveur
  };

  const handleSave = async () => {
    try {
      console.log(openingHours);

      await saveOpeningHours(openingHours);
      // TODO: Implémenter l'enregistrement côté serveur
      // await fetch('/api/opening-hours', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(openingHours)
      // });
      alert('Horaires enregistrés avec succès');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des horaires:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    }
  };

  if (isLoading) {
    return <div>Chargement des horaires...</div>;
  }

  // Fonction pour vérifier les chevauchements d'horaires
  const checkForTimeOverlaps = (hours: OpeningHour[]) => {
    // Grouper par jour
    const byDay: Record<number, OpeningHour[]> = {};
    hours.forEach((hour) => {
      if (!byDay[hour.dayOfWeek]) {
        byDay[hour.dayOfWeek] = [];
      }
      byDay[hour.dayOfWeek].push(hour);
    });

    // Vérifier les chevauchements pour chaque jour
    for (const day in byDay) {
      const dayHours = byDay[day].sort((a, b) =>
        a.openTime.localeCompare(b.openTime)
      );

      for (let i = 1; i < dayHours.length; i++) {
        const prev = dayHours[i - 1];
        const current = dayHours[i];

        if (current.openTime < prev.closeTime) {
          return true; // Chevauchement détecté
        }
      }
    }

    return false;
  };

  // Vérifier s'il y a des chevauchements
  const hasTimeOverlaps = checkForTimeOverlaps(openingHours);

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
        <h3 className="font-medium">Ajouter des horaires</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Jour</Label>
            <Select
              value={newHour.dayOfWeek.toString()}
              onValueChange={(value) =>
                setNewHour({ ...newHour, dayOfWeek: parseInt(value) })
              }
            >
              <SelectTrigger>
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
            <Label>Période</Label>
            <Select
              value={newHour.period}
              onValueChange={(value: PeriodType) =>
                setNewHour({ ...newHour, period: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
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
            />
          </div>

          <div className="flex items-end">
            <Button type="button" onClick={handleAddHour} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Horaires configurés</h3>
          <Button onClick={handleSave} disabled={openingHours.length === 0}>
            Enregistrer
          </Button>
        </div>

        {openingHours.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun horaire configuré. Commencez par en ajouter un ci-dessus.
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3">Jour</th>
                    <th className="text-left p-3">Période</th>
                    <th className="text-left p-3">Heure d'ouverture</th>
                    <th className="text-left p-3">Heure de fermeture</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {openingHours.map((hour) => {
                    const day = DAYS_OF_WEEK.find(
                      (d) => d.value === hour.dayOfWeek
                    );
                    const period = PERIODS.find((p) => p.value === hour.period);

                    return (
                      <tr key={`${hour.dayOfWeek}-${hour.period}`}>
                        <td className="p-3">{day?.label}</td>
                        <td className="p-3">{period?.label}</td>
                        <td className="p-3">{hour.openTime}</td>
                        <td className="p-3">{hour.closeTime}</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => hour.id && handleDeleteHour(hour.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
