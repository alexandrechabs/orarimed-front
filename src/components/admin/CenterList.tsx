import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pencil,
  Trash2,
  Plus,
  Info,
  MoreVertical,
  Eye,
  CheckCircle,
  CalendarDays,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/services/user/useUser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import OpeningHoursForm from './OpeningHoursForm';
import { FormProvider, useForm } from 'react-hook-form';
import { OpeningHour } from '@/types/openingHour';
import { Center } from '@/types/center';
import { AddCenterForm } from './AddCenterForm';
import DoctorCenterSearch from './DoctorCenterSearch';

const API_URL = import.meta.env.VITE_API_URL;

export default function CenterList() {
  const navigate = useNavigate();
  const {
    getCenters,
    updateCenter,
    getOpeningHoursCenter,
    saveOpeningHoursCenter,
  } = useUser();
  const [centers, setCenters] = useState<Center[]>([]);
  const { language } = useLanguage();
  const [isAddCenterOpen, setIsAddCenterOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [centerToUpdate, setCenterToUpdate] = useState<Center | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isOpeningHoursModalOpen, setIsOpeningHoursModalOpen] = useState(false);
  const { toast } = useToast();

  const methods = useForm({
    defaultValues: {
      openingHours: [],
    },
  });
  const { handleSubmit, setValue, watch, reset } = methods;

  const loadCenter = useCallback(async () => {
    try {
      setIsLoading(true);
      const centerData = await getCenters();
      setCenters(centerData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getCenters]);

  useEffect(() => {
    loadCenter();
  }, [loadCenter]);

  const initCenter = (center: Center) => {
    setEditingCenter(center);
  };
  const handleEditCenter = (center: Center) => {
    initCenter(center);
    setIsAddCenterOpen(true);
  };

  const handleViewCenter = (center: Center) => {
    navigate(`/center/${center.speciality.slug}/${center.centerIdentifier}`);
  };

  const handleToggleCenterStatus = async () => {
    if (!centerToUpdate) return;

    try {
      await updateCenter(centerToUpdate.id, {
        id: centerToUpdate.id,
        active: !centerToUpdate.active,
        email: centerToUpdate.email,
        name: centerToUpdate.name,
        description: centerToUpdate.description,
        address: centerToUpdate.address,
        city: centerToUpdate.city,
        country: centerToUpdate.country,
        coordinate: centerToUpdate.coordinate,
        phoneNumber: centerToUpdate.phoneNumber,
        visible: centerToUpdate.visible,
        specialityId: centerToUpdate.speciality?.id
          ? centerToUpdate.speciality.id
          : 0,
      });

      toast({
        title: 'Succès',
        description: centerToUpdate.active
          ? 'Le centre a été désactivé avec succès.'
          : 'Le centre a été réactivé avec succès.',
      });

      // Recharger la liste des utilisateurs
      await loadCenter();
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du statut du compte :',
        error,
      );
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue lors de la ${centerToUpdate?.active ? 'désactivation' : 'réactivation'} du centre.`,
        variant: 'destructive',
      });
    } finally {
      setIsUpdateDialogOpen(false);
      setCenterToUpdate(null);
    }
  };

  const handleEditOpeningHours = (center: Center) => {
    initCenter(center);
    getOpeningHoursCenter(center.id).then((openingHours) => {
      if (openingHours) {
        reset({
          openingHours: openingHours,
        });
      }
    });

    setIsOpeningHoursModalOpen(true);
  };

  const onSubmit = (formData: { openingHours: OpeningHour[] }) => {
    setIsOpeningHoursModalOpen(false);
    let openingHours = formData.openingHours;
    openingHours.forEach((openingHour) => {
      openingHour.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    saveOpeningHoursCenter(editingCenter.id, openingHours);

    toast({
      title: 'Succès',
      description: "Les heures d'ouverture ont été chargées avec succès.",
    });
  };

  const handleAddUser = () => {
    setEditingCenter(null);
    setIsAddCenterOpen(true);
  };

  const handleAddDoctor = (center: Center) => {
    initCenter(center);
    setIsAddDoctorOpen(true);
  };

  const handleSuccess = () => {
    setIsAddCenterOpen(false);
    loadCenter();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Affichez et gérez les comptes et les permissions
        </p>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold"></h2>
        <Button className="mb-2" onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="overflow-visible">
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Compte actif</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <span>Visible</span>
                  <div className="group relative">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 text-xs bg-popover text-popover-foreground rounded shadow-lg border">
                      Indique si le profil du médecin est visible par les
                      patients
                    </div>
                  </div>
                </div>
              </TableHead>
              <TableHead>Docteurs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centers
              ?.sort(
                (a: any, b: any) =>
                  new Date(a.updatedAt).getTime() -
                  new Date(b.updatedAt).getTime(),
              )
              .map((center) => (
                <TableRow key={center.id}>
                  <TableCell>
                    {/* {user.firstname} {user.lastname} */}
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img
                          src={
                            center.avatar
                              ? `${API_URL}/center/${center.id}/avatar/${center.avatar}`
                              : 'hopital.png'
                          }
                          alt={center.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                      <div className="grid">
                        <span className="truncate text-sm m-auto">
                          {center.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {
                      center.speciality.translations.filter(
                        (t) => t.locale === language,
                      )[0].name
                    }
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${center.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-gray-800'}`}
                    >
                      {center.active ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${center.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {center.visible ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {center.centerUsers?.map((centerUser) => (
                      <div
                        key={centerUser.id}
                        className="flex bg-gray-200 p-2 rounded-lg mb-2"
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-4">
                          <img
                            src={
                              centerUser.user?.avatar
                                ? `${API_URL}/user/${centerUser.user.id}/avatar/${centerUser.user.avatar}`
                                : '/default-avatar.png'
                            }
                            alt={centerUser.user?.firstname}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                        </div>
                        <div className="grid">
                          <span className="text-sm">
                            {centerUser.user?.firstname}{' '}
                            {centerUser.user?.lastname}
                          </span>
                          <span className="text-sm">
                            {centerUser.user?.email}
                          </span>
                        </div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditCenter(center)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewCenter(center)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Voir le profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddDoctor(center)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Ajouter un docteur</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditOpeningHours(center)}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Horaires d'ouverture</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            center.active
                              ? 'text-destructive focus:text-destructive'
                              : 'text-green-600 focus:text-green-700'
                          }
                          onSelect={(e) => {
                            e.preventDefault();
                            setCenterToUpdate(center);
                            setIsUpdateDialogOpen(true);
                          }}
                        >
                          {center.active ? (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Désactiver le compte</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Réactiver le compte</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isAddCenterOpen} onOpenChange={setIsAddCenterOpen}>
        <DialogContent
          className="overflow-visible"
          onInteractOutside={(e) => {
            // Empêche la fermeture de la modale lors du clic sur les suggestions
            const target = e.target as HTMLElement;
            if (target.closest('.pac-container')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingCenter
                ? `Modifier ${editingCenter.name}`
                : `Nouveau cabinet médicale`}
            </DialogTitle>
          </DialogHeader>
          <AddCenterForm
            center={editingCenter || undefined}
            onSuccess={handleSuccess}
            onClose={() => setIsAddCenterOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Ajoutez ceci à la fin du composant, avant le dernier </div> */}
      <Dialog
        open={isOpeningHoursModalOpen}
        onOpenChange={setIsOpeningHoursModalOpen}
      >
        <DialogContent className="sm:max-w-[400px] md:max-w-[600px] lg:max-w-[950px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier les horaires d'ouverture</DialogTitle>
            <DialogDescription>
              Définissez les horaires d'ouverture pour {editingCenter?.name}
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...methods}>
            <form
              id="onboarding-form-1"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <OpeningHoursForm />

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOpeningHoursModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {centerToUpdate?.active
                ? 'Confirmer la désactivation'
                : 'Confirmer la réactivation'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {centerToUpdate?.active
                ? `Êtes-vous sûr de vouloir désactiver le compte de ${centerToUpdate?.name} ?`
                : `Êtes-vous sûr de vouloir réactiver le compte de ${centerToUpdate?.name} ?`}
              <br />
              Cette action est réversible.
            </p>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant={centerToUpdate?.active ? 'destructive' : 'default'}
              onClick={handleToggleCenterStatus}
            >
              {centerToUpdate?.active ? 'Désactiver' : 'Réactiver'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Liste des docteurs rattachés au cabinet</DialogTitle>
            <DialogDescription>
              Ajoutez un docteur au cabinet {editingCenter?.name}
            </DialogDescription>
          </DialogHeader>
          <DoctorCenterSearch
            centerId={editingCenter?.id}
            centerName={editingCenter?.name}
            onSuccess={() => setIsAddDoctorOpen(false)}
            maxSelection={15}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddDoctorOpen(false)}>
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
