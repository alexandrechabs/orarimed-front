import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDateLocale } from '@/lib/i18n/LanguageContext';
import { format } from 'date-fns';
import { Calendar, Clock, User, Filter, Search, Plus, X } from 'lucide-react';
import { useUser } from '@/services/user/useUser';

const API_URL = import.meta.env.VITE_API_URL;
type FilterType = 'all' | 'upcoming' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
  const { t, language } = useLanguage();
  const dateLocale = useDateLocale();
  const navigate = useNavigate();
  const { getEvents, updateEvent } = useUser();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, activeFilter, searchQuery]);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      let dateRange = {
        start: new Date('2026-01-01').toISOString(),
        end: new Date(
          new Date().setFullYear(new Date().getFullYear() + 5),
        ).toISOString(),
      };
      const events = await getEvents(dateRange);
      setAppointments(events);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filtrer par statut
    if (activeFilter === 'upcoming')
      filtered = filtered.filter(
        (apt) =>
          new Date(apt.start) > new Date() &&
          !['abort', 'abortExcused'].includes(apt.status),
      );
    if (activeFilter === 'completed')
      filtered = filtered.filter((apt) => new Date(apt.start) < new Date());
    if (activeFilter === 'cancelled')
      filtered = filtered.filter((apt) =>
        ['abort', 'abortExcused'].includes(apt.status),
      );

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (apt) =>
          apt.practitioner.lastname
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          apt.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Trier par date (les plus récents d'abord)
    filtered.sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
    );

    setFilteredAppointments(filtered);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
    setCancelDialogOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    setCancellingId(appointmentToCancel);
    try {
      // Simuler l'annulation API
      // En réalité, vous appellerez une API d'annulation ici

      // get apppointment
      let currentAppointment = appointments.find(
        (apt) => apt.id === appointmentToCancel,
      );
      updateEvent({
        id: currentAppointment.id,
        status: 'abortExcused',
        title: currentAppointment.title,
        practitionerId: currentAppointment.practitionerId,
        contactId: currentAppointment.contactId,
        type: currentAppointment.type,
        start: currentAppointment.start,
      }).then((reasons) => {
        // Mettre à jour le statut localement
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentToCancel
              ? { ...apt, status: 'abortExcused' }
              : apt,
          ),
        );
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setCancellingId(null);
      setCancelDialogOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setAppointmentToCancel(null);
  };

  const getStatusBadge = (status: string, startDate: string) => {
    const statusConfig = {
      upcoming: {
        label: t.appointments?.status?.upcoming || 'À venir',
        variant: 'default' as const,
      },
      completed: {
        label: t.appointments?.status?.completed || 'Terminé',
        variant: 'secondary' as const,
      },
      cancelled: {
        label: t.appointments?.status?.cancelled || 'Annulé',
        variant: 'destructive' as const,
      },
    };

    let config;
    if (status === 'abortExcused' || status === 'abort') {
      config = statusConfig.cancelled;
    } else if (new Date(startDate) < new Date()) {
      config = statusConfig.completed;
    } else {
      config = statusConfig.upcoming;
    }

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') return appointments.length;
    if (filter === 'upcoming')
      return appointments.filter(
        (apt) =>
          new Date(apt.start) > new Date() &&
          !['abort', 'abortExcused'].includes(apt.status),
      ).length;
    if (filter === 'completed')
      return appointments.filter((apt) => new Date(apt.start) < new Date())
        .length;
    if (filter === 'cancelled')
      return appointments.filter((apt) =>
        ['abort', 'abortExcused'].includes(apt.status),
      ).length;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="block md:flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t.appointments?.title}
            </h1>
            <Button onClick={() => navigate('/search')}>
              <Plus className="w-4 h-4 mr-2" />
              {t.appointments?.newAppointment}
            </Button>
          </div>
          <p className="text-gray-600">{t.appointments?.description}</p>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={
                    t.appointments?.searchPlaceholder ||
                    'Rechercher un rendez-vous...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtres */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
                {(
                  ['all', 'upcoming', 'completed', 'cancelled'] as FilterType[]
                ).map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Filter className="w-3 h-3" />
                    {t.appointments?.filters?.[filter] || filter}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {getFilterCount(filter)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t.appointments?.noAppointments || 'Aucun rendez-vous trouvé'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.appointments?.noAppointmentsDescription ||
                    'Commencez par prendre un nouveau rendez-vous'}
                </p>
                <Button onClick={() => navigate('/search')}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.appointments?.newAppointment || 'Nouveau rendez-vous'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* En-tête du rendez-vous */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            key={appointment.id}
                            className="flex p-2 bg-gray-100 rounded-lg mb-2"
                          >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-4">
                              <img
                                src={
                                  appointment.practitioner?.avatar
                                    ? `${API_URL}/user/${appointment.practitioner.id}/avatar/${appointment.practitioner.avatar}`
                                    : '/default-avatar.png'
                                }
                                alt={appointment.practitioner?.firstname}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/default-avatar.png';
                                }}
                              />
                            </div>
                            <div className="grid">
                              <span className="text-sm">
                                {appointment.practitioner?.firstname}{' '}
                                {appointment.practitioner?.lastname}
                              </span>
                              <span className="text-sm">
                                {
                                  appointment.practitioner?.speciality?.translations?.find(
                                    (t) => t.locale === language,
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(
                            appointment.status,
                            appointment.start,
                          )}
                        </div>
                      </div>

                      {/* Détails du rendez-vous */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              {appointment.patient.firstname}
                              {appointment.patient.lastname}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(
                                new Date(appointment.start),
                                'EEEE d MMMM yyyy',
                                {
                                  locale: dateLocale,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {format(new Date(appointment.start), 'HH:mm', {
                                locale: dateLocale,
                              })}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {t.appointments?.duration || 'Durée'} :{' '}
                            {(new Date(appointment.end).getTime() -
                              new Date(appointment.start).getTime()) /
                              60000}{' '}
                            {t.appointments?.minute || 'min'}
                          </div>
                        </div>
                      </div>

                      {/* Type de rendez-vous */}
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-sm font-medium text-gray-700">
                          {appointment.title}
                        </span>
                      </div>

                      {/* Bouton d'annulation pour les rendez-vous à venir */}
                      {new Date(appointment.start) > new Date() &&
                        !['abort', 'abortExcused'].includes(
                          appointment.status,
                        ) && (
                          <div className="mt-4 pt-4 border-t flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelAppointment(appointment.id);
                              }}
                              disabled={cancellingId === appointment.id}
                              className="w-full sm:w-auto"
                            >
                              <X className="w-4 h-4 mr-2" />
                              {cancellingId === appointment.id
                                ? 'Annulation...'
                                : t.appointments.cancel}
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination si nécessaire */}
        {filteredAppointments.length > 10 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog de confirmation d'annulation */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.appointments.cancelConfirmTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{t.appointments.cancelConfirm}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCancelDialog}
              disabled={cancellingId !== null}
            >
              Non
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelAppointment}
              disabled={cancellingId !== null}
            >
              {t.common.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
