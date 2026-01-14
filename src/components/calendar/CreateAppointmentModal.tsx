import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PatientSearchDialog from './PatientSearchDialog';
import { useAuth } from '@/services/auth/useAuth';
import { useUser } from '@/services/user/useUser';

type RepeatType = 'none' | 'daily' | 'dailyWeek' | 'weekly';

export interface CalendarEvent {
  id?: string;
  title?: string;
  description?: string;
  daysOfWeek?: number[]; // [0,1,2,3,4,5,6] pour dimanche à samedi
  startTime?: string; // Format 'HH:MM'
  endTime?: string; // Format 'HH:MM'
  startRecur?: string; // Date de début de récurrence (YYYY-MM-DD)
  endRecur?: string; // Date de fin de récurrence (YYYY-MM-DD)
  start?: string | Date | number; // Pour les événements uniques
  end?: string | Date | number; // Pour les événements uniques
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  patientId?: string;
  doctorId?: string;
  [key: string]: any; // Pour accepter d'autres propriétés non typées
}

const COLOR_OPTIONS = [
  { value: 'hsl(var(--primary))', label: 'Bleu' },
  { value: 'hsl(var(--accent))', label: 'Violet' },
  { value: '#10B981', label: 'Vert' },
  { value: '#EF4444', label: 'Rouge' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#8B5CF6', label: 'Violet foncé' },
];

interface CreateAppointmentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialDate?: Date;
  eventToEdit?: any | null;
  onEventCreated?: (event: CalendarEvent) => void;
  onEventUpdated?: (event: CalendarEvent) => void;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  initialDate,
  eventToEdit,
  onEventCreated,
  onEventUpdated,
}) => {
  const { user } = useAuth();
  const { getPatient } = useUser();
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    addHours(new Date(), 1)
  );
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  const [isCalendarDayOpen, setIsCalendarDayOpen] = useState(false);
  const [isCalendarRepeatOpen, setIsCalendarRepeatOpen] = useState(false);
  const [repeatType, setRepeatType] = useState<RepeatType>('none');
  const [repeatEndDate, setRepeatEndDate] = useState<Date | undefined>();

  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const appointmentTitles = [
    'Consultation',
    'Contrôle',
    'Urgence',
    'Bilan de santé',
    'Suivi',
    'Autre',
  ];

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : isInternalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      externalOnOpenChange?.(value);
    } else {
      setIsInternalOpen(value);
    }
  };

  useEffect(() => {
    console.log(eventToEdit);
    const loadPatient = async (id: string) => {
      const patient = await getPatient(id);
      setSelectedPatient(patient);
    };

    setSelectedPatient(null);
    if (eventToEdit) {
      if (eventToEdit.patientId) {
        loadPatient(eventToEdit.patientId);
      }
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setStartDate(new Date(eventToEdit.start));

      if (eventToEdit.startRecur) {
        // set start date to startRecur day and month
        const newStartDate = new Date(eventToEdit.start);
        // Mettre à jour le jour et le mois avec les valeurs de startRecur
        newStartDate.setDate(new Date(eventToEdit.startRecur).getDate());
        newStartDate.setMonth(new Date(eventToEdit.startRecur).getMonth());
        setStartDate(newStartDate);
      }
      setEndDate(new Date(eventToEdit.end));
      setIsAllDay(eventToEdit.allDay || false);
      if (eventToEdit.daysOfWeek) {
        if (eventToEdit.daysOfWeek.length === 7) {
          setRepeatType('daily');
        } else if (eventToEdit.daysOfWeek.length === 5) {
          setRepeatType('dailyWeek');
        } else {
          setRepeatType('weekly');
        }
      } else {
        setRepeatType('none');
      }
      setRepeatEndDate(
        eventToEdit.endRecur ? new Date(eventToEdit.endRecur) : undefined
      );
      setSelectedColor(eventToEdit.backgroundColor || COLOR_OPTIONS[0].value);
    } else if (initialDate) {
      setStartDate(initialDate);
      const end = new Date(initialDate);
      end.setMinutes(end.getMinutes() + 30);
      setEndDate(end);
    }
  }, [initialDate, eventToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;

    const eventData: CalendarEvent = {
      id: eventToEdit?.id || `event-${Date.now()}`,
      title,
      description,
      backgroundColor: selectedColor,
      borderColor: selectedColor,
      patientId: selectedPatient?.id,
      practitionerId: user.id,
    };

    if (repeatType === 'none') {
      // Événement unique
      if (isAllDay) {
        eventData.start = new Date(
          startDate.setHours(0, 0, 0, 0)
        ).toISOString();
        if (endDate) {
          eventData.end = new Date(
            endDate.setHours(23, 59, 59, 999)
          ).toISOString();
        }
      } else {
        eventData.start = startDate.toISOString();
        eventData.end = endDate?.toISOString();
      }
      eventData.allDay = isAllDay;
    } else {
      // Événement récurrent
      if (isAllDay) {
        // Pour les événements sur toute la journée
        eventData.startRecur = new Date(startDate.setHours(23, 59, 59, 999))
          .toISOString()
          .split('T')[0];
        if (endDate) {
          eventData.endRecur = new Date(repeatEndDate.setHours(23, 59, 59, 999))
            .toISOString()
            .split('T')[0];
        }
      } else {
        // Pour les événements avec horaires
        const formatTime = (date: Date) => date.toTimeString().slice(0, 5); // Format HH:MM
        eventData.startTime = formatTime(startDate);
        if (endDate) {
          eventData.endTime = formatTime(endDate);
        }
        eventData.startRecur = startDate.toISOString().split('T')[0];
        if (repeatEndDate) {
          eventData.endRecur = repeatEndDate.toISOString().split('T')[0];
        }
      }

      // Définir les jours de la semaine pour les répétitions
      if (repeatType === 'weekly') {
        eventData.daysOfWeek = [startDate.getDay()]; // 0-6 (dimanche-samedi)
      } else if (repeatType === 'daily') {
        eventData.daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
      } else if (repeatType === 'dailyWeek') {
        eventData.daysOfWeek = [1, 2, 3, 4, 5]; // Lundi à vendredi
      }

      // Pour les événements sur toute la journée, on utilise allDay
      if (isAllDay) {
        eventData.allDay = true;
      }
    }

    if (eventToEdit) {
      onEventUpdated?.(eventData);
    } else {
      onEventCreated?.(eventData);
    }

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    const now = new Date();
    setStartDate(now);
    setEndDate(addHours(now, 1));
    setIsAllDay(false);
    setRepeatType('none');
    setRepeatEndDate(undefined);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {eventToEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Patient</Label>

            {selectedPatient ? (
              <div className="flex items-center justify-between rounded border p-2">
                <span>
                  {selectedPatient.firstname} {selectedPatient.lastname} –{' '}
                  {selectedPatient.email}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPatientDialogOpen(true)}
                >
                  Changer
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setPatientDialogOpen(true)}
              >
                Rechercher un patient
              </Button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Select onValueChange={setTitle} value={title} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de rendez-vous" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTitles.map((appointmentTitle) => (
                    <SelectItem key={appointmentTitle} value={appointmentTitle}>
                      {appointmentTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du rendez-vous"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={isAllDay}
                onCheckedChange={(checked) => setIsAllDay(checked as boolean)}
              />
              <Label htmlFor="allDay">Toute la journée</Label>
            </div>

            <div>
              <Label>Jour</Label>
              <Popover
                open={isCalendarDayOpen}
                onOpenChange={setIsCalendarDayOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'PPP', { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus issues
                >
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        const newStartDate = new Date(date);
                        if (startDate) {
                          newStartDate.setHours(
                            startDate.getHours(),
                            startDate.getMinutes()
                          );
                        }
                        setStartDate(newStartDate);

                        // Mettre à jour également la date de fin si nécessaire
                        if (endDate && startDate) {
                          const diff = endDate.getTime() - startDate.getTime();
                          const newEndDate = new Date(
                            newStartDate.getTime() + diff
                          );
                          setEndDate(newEndDate);
                        }

                        setIsCalendarDayOpen(false);
                      }
                    }}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Début</Label>
                {!isAllDay && (
                  <Input
                    type="time"
                    className="mt-2"
                    value={startDate ? format(startDate, 'HH:mm') : ''}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      if (startDate && hours && minutes) {
                        const newDate = new Date(startDate);
                        newDate.setHours(
                          parseInt(hours, 10),
                          parseInt(minutes, 10)
                        );
                        setStartDate(newDate);
                      }
                    }}
                    aria-label="Heure de début" // Add descriptive aria-label
                    onFocus={(e) => e.target.select()} // Improve UX by selecting all text on focus
                  />
                )}
              </div>

              <div>
                <Label>Fin</Label>
                {!isAllDay && (
                  <Input
                    type="time"
                    className="mt-2"
                    value={endDate ? format(endDate, 'HH:mm') : ''}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      if (endDate && hours && minutes) {
                        const newDate = new Date(endDate);
                        newDate.setHours(
                          parseInt(hours, 10),
                          parseInt(minutes, 10)
                        );
                        setEndDate(newDate);
                      }
                    }}
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Répétition</Label>
              <Select
                value={repeatType}
                onValueChange={(value: RepeatType) => setRepeatType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ne pas répéter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ne pas répéter</SelectItem>
                  <SelectItem value="daily">Tous les jours</SelectItem>
                  <SelectItem value="dailyWeek">
                    Tous les jours du lundi au vendredi
                  </SelectItem>
                  <SelectItem value="weekly">Toutes les semaines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {repeatType !== 'none' && (
              <div>
                <Label>Jusqu'au</Label>
                <Popover
                  open={isCalendarRepeatOpen}
                  onOpenChange={setIsCalendarRepeatOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !repeatEndDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {repeatEndDate ? (
                        format(repeatEndDate, 'PPP', { locale: fr })
                      ) : (
                        <span>Choisir une date de fin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={repeatEndDate}
                      onSelect={(date) => {
                        if (date) {
                          setRepeatEndDate(date);
                          setIsCalendarRepeatOpen(false);
                        }
                      }}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Sélecteur de couleurs */}
            <div className="grid gap-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110',
                      selectedColor === color.value
                        ? 'ring-2 ring-offset-2 ring-primary'
                        : ''
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  >
                    {selectedColor === color.value && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {eventToEdit
                  ? 'Modifier le rendez-vous'
                  : 'Nouveau rendez-vous'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <PatientSearchDialog
        open={patientDialogOpen}
        onOpenChange={setPatientDialogOpen}
        onSelectPatient={(patient) => setSelectedPatient(patient)}
      />
    </div>
  );
};

export default CreateAppointmentModal;
