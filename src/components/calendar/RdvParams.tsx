import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Armchair, Stethoscope, Ban, CalendarOff, Check } from 'lucide-react';
import { CalendarEvent } from '@/types/CalendarEvent';
import { useUser } from '@/services/user/useUser';

interface Props {
  eventToEdit: CalendarEvent;
}

/* ----------------------------------------
   COMPONENT
----------------------------------------- */
export default function RdvParams({ eventToEdit }: Props) {
  const { updateEvent } = useUser();
  const changeStatus = async (status: string) => {
    eventToEdit.status = status;
    await updateEvent(eventToEdit);
  };

  return (
    <>
      {eventToEdit && (
        <div>
          <Label>Statut du Rendez-vous</Label>
          <Button
            type="button"
            onClick={() => changeStatus('waiting')}
            variant={eventToEdit.status === 'waiting' ? 'default' : 'outline'}
            className="mb-1 mt-2 w-full justify-start text-xs"
          >
            <Armchair />
            En salle d'attente
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('consultation')}
            variant={
              eventToEdit.status === 'consultation' ? 'default' : 'outline'
            }
            className="my-1 w-full justify-start text-xs"
          >
            <Stethoscope />
            En consultation
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('finished')}
            variant={eventToEdit.status === 'finished' ? 'finished' : 'outline'}
            className="my-1 w-full justify-start text-xs"
          >
            <Check />
            Terminé
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('abort excused')}
            variant={
              eventToEdit.status === 'abort excused' ? 'destructive' : 'outline'
            }
            className="my-1 w-full justify-start text-xs"
          >
            <CalendarOff />
            Absent excusé
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('abort')}
            variant={eventToEdit.status === 'abort' ? 'destructive' : 'outline'}
            className="my-1 text-xs"
          >
            <Ban />
            Absent non excusé
          </Button>
        </div>
      )}
    </>
  );
}
