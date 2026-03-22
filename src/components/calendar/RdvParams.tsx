import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Armchair, Stethoscope, Ban, CalendarOff, Check } from 'lucide-react';
import { CalendarEvent } from '@/types/CalendarEvent';
import { useUser } from '@/services/user/useUser';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '../ui/separator';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { useState } from 'react';
import { Card } from '../ui/card';
import { format, parseISO } from 'date-fns';
import * as LucideIcons from 'lucide-react';
import { useLanguage, useDateLocale } from '@/lib/i18n/LanguageContext';

interface Props {
  eventToEdit: CalendarEvent;
}

/* ----------------------------------------
   COMPONENT
----------------------------------------- */
export default function RdvParams({ eventToEdit }: Props) {
  const { updateEvent, getRdvHistoryDoctor, getRdvNotificationsDoctor } =
    useUser();
  const { t } = useLanguage();
  const dateLocale = useDateLocale();
  const [isDrawerHistoryOpen, setIsDrawerHistoryOpen] = useState(false);
  const [isDrawerNotificationsOpen, setIsDrawerNotificationsOpen] =
    useState(false);
  const [historyEvents, setHistoryEvents] = useState<any[]>([]);
  const [notifiactionsEvents, setNotificationsEvents] = useState<any[]>([]);
  const changeStatus = async (status: string) => {
    eventToEdit.status = status;
    await updateEvent(eventToEdit);
    toast({
      title: 'Statut du rendez-vous modifié',
      description: 'Le statut du rendez-vous a été modifié avec succès',
    });
  };
  const formatDate = (isoDate: string) => {
    return format(parseISO(isoDate), 'PPPPp', {
      locale: dateLocale,
    });
  };

  const getHistory = async () => {
    setHistoryEvents(await getRdvHistoryDoctor(eventToEdit.patient.id));
  };

  const getNotifications = async () => {
    setNotificationsEvents(await getRdvNotificationsDoctor(eventToEdit.id));
  };

  return (
    <>
      {eventToEdit && (
        <div>
          <Label className="mb-2">Statut du Rendez-vous</Label>
          <Button
            type="button"
            onClick={() => changeStatus('waiting')}
            variant={eventToEdit.status === 'waiting' ? 'default' : 'outline'}
            className="my-2 p-2 w-full justify-start text-xs"
          >
            <Armchair />
            {t.event.status.waiting}
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('consultation')}
            variant={
              eventToEdit.status === 'consultation' ? 'default' : 'outline'
            }
            className="my-1 p-2 w-full justify-start text-xs"
          >
            <Stethoscope />
            {t.event.status.consultation}
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('finished')}
            variant={eventToEdit.status === 'finished' ? 'finished' : 'outline'}
            className="my-1 p-2 w-full justify-start text-xs"
          >
            <Check />
            {t.event.status.finished}
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('abortExcused')}
            variant={
              eventToEdit.status === 'abortExcused' ? 'destructive' : 'outline'
            }
            className="my-1 p-2 w-full justify-start text-xs"
          >
            <CalendarOff />
            {t.event.status.abortExcused}
          </Button>
          <Button
            type="button"
            onClick={() => changeStatus('abort')}
            variant={eventToEdit.status === 'abort' ? 'destructive' : 'outline'}
            className="my-1 p-2 w-full justify-start text-xs"
          >
            <Ban />
            {t.event.status.abort}
          </Button>

          <Separator className="my-10" />
          <Button
            type="button"
            onClick={() => {
              setIsDrawerHistoryOpen(true);
              getHistory();
            }}
            variant="outline"
            className="my-1 p-2 w-full justify-start text-xs"
          >
            Historique des rendez-vous
          </Button>
          <Button
            type="button"
            onClick={() => {
              setIsDrawerNotificationsOpen(true);
              getNotifications();
            }}
            variant="outline"
            className="my-1 p-2 w-full justify-start text-xs"
          >
            Historique des notifications
          </Button>
        </div>
      )}
      <Drawer
        open={isDrawerHistoryOpen}
        onOpenChange={setIsDrawerHistoryOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-[300px] ml-auto overflow-x-hidden overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Historique des rendez-vous</DrawerTitle>
          </DrawerHeader>
          {historyEvents &&
            historyEvents
              .sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime(),
              )
              .map((event) => {
                let Icon;
                if (event.status === 'waiting') {
                  Icon = LucideIcons['Armchair'];
                } else if (event.status === 'consultation') {
                  Icon = LucideIcons['Stethoscope'];
                } else if (event.status === 'finished') {
                  Icon = LucideIcons['Check'];
                } else if (event.status === 'abortExcused') {
                  Icon = LucideIcons['CalendarOff'];
                } else if (event.status === 'abort') {
                  Icon = LucideIcons['Ban'];
                }
                return (
                  <Card
                    className={`m-2 p-2 border-l-8`}
                    style={{ borderLeftColor: event.color }}
                    key={event.id}
                  >
                    <div>
                      <p className="text-sm">{event.title}</p>
                      <p className="text-xs">{formatDate(event.start)}</p>
                      <p className="text-xs flex">
                        status : {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        {t.event.status[event.status]}
                      </p>
                    </div>
                  </Card>
                );
              })}
        </DrawerContent>
      </Drawer>
      <Drawer
        open={isDrawerNotificationsOpen}
        onOpenChange={setIsDrawerNotificationsOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-[300px] ml-auto overflow-x-hidden overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Historique des notifications</DrawerTitle>
          </DrawerHeader>
          {notifiactionsEvents &&
            notifiactionsEvents
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((notification) => {
                return (
                  <Card className={`m-2 p-2`} key={notification.id}>
                    <div>
                      <p className="text-sm">
                        {t.event.type[notification.type]}
                      </p>
                      <p className="text-xs">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </Card>
                );
              })}
        </DrawerContent>
      </Drawer>
    </>
  );
}
