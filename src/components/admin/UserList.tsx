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
import { UserRole } from '@/types/roles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddDoctorForm } from '@/components/admin/AddDoctorForm';
import { DoctorProfile } from '@/types/doctor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import OpeningHoursForm from './OpeningHoursForm';
import { FormProvider, useForm } from 'react-hook-form';
import { OpeningHour } from '@/types/openingHour';
import ConsultationReasons from './ConsultationReasons';
import { ConsultationReason } from '@/types/consultationReason';

interface EditUser {
  id?: string;
  email: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  coordinate: {
    x: number;
    y: number;
  };
  phoneNumber: string;
  specialityId: number;
  visible: boolean;
  active: boolean;
  doctorIdentifier?: string;
  avatar?: string;
  bio?: string;
  description?: string;
  subSpecialityId?: number[];
  language: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function UserList({ type }: { type: string }) {
  const navigate = useNavigate();
  const {
    getUsersAdmin,
    updateUser,
    getOpeningHours,
    saveOpeningHours,
    getReasons,
    saveReasons,
  } = useUser();
  const [users, setUsers] = useState<DoctorProfile[]>([]);
  const { language } = useLanguage();
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState<DoctorProfile | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isOpeningHoursModalOpen, setIsOpeningHoursModalOpen] = useState(false);
  const [isConsultationReasonModalOpen, setIsConsultationReasonModalOpen] =
    useState(false);
  const { toast } = useToast();

  const methods = useForm({
    defaultValues: {
      openingHours: [],
    },
  });
  const consultationReasonsMethods = useForm({
    defaultValues: {
      consultationReasons: [],
    },
  });
  const { handleSubmit, setValue, watch, reset } = methods;
  const {
    handleSubmit: consultationReasonsHandleSubmit,
    watch: consultationReasonsWatch,
    reset: consultationReasonsReset,
  } = consultationReasonsMethods;

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersData = await getUsersAdmin(
        type === 'doctor' ? UserRole.DOCTOR : UserRole.SECRETARY,
      );
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getUsersAdmin, type]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const initUser = (user: DoctorProfile) => {
    const userToEdit: EditUser = {
      id: user.id ? user.id : '',
      email: user.email || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      address: user.address || '',
      city: user.city || '',
      zipCode: user.zipCode || '',
      country: user.country || '',
      coordinate: {
        x: user.coordinate?.y || 0,
        y: user.coordinate?.x || 0,
      },
      phoneNumber: user.phoneNumber || '',
      specialityId: user.speciality?.id ? parseInt(user.speciality.id, 10) : 0,
      visible: user.visible,
      active: user.active,
      doctorIdentifier: user.doctorIdentifier,
      avatar: user.avatar,
      bio: user.bio,
      description: user.description,
      subSpecialityId: [],
      language: user.language,
    };

    setEditingUser(userToEdit);
  };
  const handleEditUser = (user: DoctorProfile) => {
    let subSpecialityId: number[] = [];
    if (user.subSpecialitiesUsers) {
      subSpecialityId = user.subSpecialitiesUsers.map(
        (sub) => sub.subSpecialityId,
      );
    }
    initUser(user);
    setIsAddDoctorOpen(true);
  };

  const handleViewUser = (user: DoctorProfile) => {
    navigate(`/doctor/${user.speciality.slug}/${user.doctorIdentifier}`);
  };

  const handleToggleUserStatus = async () => {
    if (!userToUpdate) return;

    try {
      await updateUser(userToUpdate.id, {
        active: !userToUpdate.active,
        email: userToUpdate.email,
        firstname: userToUpdate.firstname,
        lastname: userToUpdate.lastname,
        address: userToUpdate.address,
        city: userToUpdate.city,
        country: userToUpdate.country,
        coordinate: userToUpdate.coordinate,
        phoneNumber: userToUpdate.phoneNumber,
        roleId: 2,
        visible: userToUpdate.visible,
        specialityId: userToUpdate.speciality?.id
          ? parseInt(userToUpdate.speciality.id, 10)
          : 0,
      });

      toast({
        title: 'Succès',
        description: userToUpdate.active
          ? 'Le compte a été désactivé avec succès.'
          : 'Le compte a été réactivé avec succès.',
      });

      // Recharger la liste des utilisateurs
      await loadUsers();
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du statut du compte :',
        error,
      );
      toast({
        title: 'Erreur',
        description: `Une erreur est survenue lors de la ${userToUpdate?.active ? 'désactivation' : 'réactivation'} du compte.`,
        variant: 'destructive',
      });
    } finally {
      setIsUpdateDialogOpen(false);
      setUserToUpdate(null);
    }
  };

  const handleEditOpeningHours = (user: DoctorProfile) => {
    initUser(user);
    getOpeningHours(user.id).then((openingHours) => {
      if (openingHours) {
        reset({
          openingHours: openingHours,
        });
      }
    });

    setIsOpeningHoursModalOpen(true);
  };

  const handleEditConsultationReasons = (user: DoctorProfile) => {
    initUser(user);
    getReasons(user.id).then((reasons) => {
      if (reasons) {
        const reasonsWithEditing = reasons.map((reason) => ({
          ...reason,
          isEditing: false, // S'assure que isEditing est défini
          tempId: reason.id?.toString(), // Crée un tempId basé sur l'ID si nécessaire
        }));
        consultationReasonsReset({
          consultationReasons: reasons,
        });
      }
    });
    setIsConsultationReasonModalOpen(true);
  };

  const onSubmit = (formData: { openingHours: OpeningHour[] }) => {
    setIsOpeningHoursModalOpen(false);
    let openingHours = formData.openingHours;
    openingHours.forEach((openingHour) => {
      openingHour.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    saveOpeningHours(editingUser.id, openingHours);

    toast({
      title: 'Succès',
      description: "Les heures d'ouverture ont été chargées avec succès.",
    });
  };

  const onConsultationReasonsSubmit = (formData: {
    consultationReasons: ConsultationReason[];
  }) => {
    setIsConsultationReasonModalOpen(false);
    let consultationReasons = formData.consultationReasons;
    saveReasons(editingUser.id, consultationReasons);

    toast({
      title: 'Succès',
      description:
        'Les motifs de consultation ont été enregistrés avec succès.',
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddDoctorOpen(true);
  };

  const handleSuccess = () => {
    setIsAddDoctorOpen(false);
    loadUsers();
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              ?.sort(
                (a: any, b: any) =>
                  new Date(a.updatedAt).getTime() -
                  new Date(b.updatedAt).getTime(),
              )
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {/* {user.firstname} {user.lastname} */}
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img
                          src={
                            user.avatar
                              ? `${API_URL}/user/${user.id}/avatar/${user.avatar}`
                              : 'default-avatar.png'
                          }
                          alt={user.firstname}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                      <div className="grid">
                        <span className="text-sm">
                          {user.firstname} {user.lastname}
                        </span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {
                      user.speciality.translations.filter(
                        (t) => t.locale === language,
                      )[0].name
                    }
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-gray-800'}`}
                    >
                      {user.active ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {user.visible ? 'Oui' : 'Non'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Voir le profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditOpeningHours(user)}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Horaires d'ouverture</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditConsultationReasons(user)}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Motifs de consultation</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            user.active
                              ? 'text-destructive focus:text-destructive'
                              : 'text-green-600 focus:text-green-700'
                          }
                          onSelect={(e) => {
                            e.preventDefault();
                            setUserToUpdate(user);
                            setIsUpdateDialogOpen(true);
                          }}
                        >
                          {user.active ? (
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
      <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
        <DialogContent
          className="overflow-visible max-h-[90vh] overflow-y-auto"
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
              {editingUser
                ? `Modifier ${editingUser.firstname} ${editingUser.lastname}`
                : `Nouveau ${type === 'doctor' ? 'compte docteur' : 'secrétaire'}`}
            </DialogTitle>
          </DialogHeader>
          <AddDoctorForm
            user={editingUser || undefined}
            onSuccess={handleSuccess}
            onClose={() => setIsAddDoctorOpen(false)}
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
              Définissez les horaires d'ouverture pour {editingUser?.firstname}{' '}
              {editingUser?.lastname}
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

      <Dialog
        open={isConsultationReasonModalOpen}
        onOpenChange={setIsConsultationReasonModalOpen}
      >
        <DialogContent className="sm:max-w-[400px] md:max-w-[600px] lg:max-w-[950px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier les raisons de consultation</DialogTitle>
            <DialogDescription>
              Définissez les raisons de consultation pour{' '}
              {editingUser?.firstname} {editingUser?.lastname}
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...consultationReasonsMethods}>
            <form
              id="onboarding-form-2"
              onSubmit={consultationReasonsHandleSubmit(
                onConsultationReasonsSubmit,
              )}
              className="space-y-6"
            >
              <ConsultationReasons />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConsultationReasonModalOpen(false)}
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
              {userToUpdate?.active
                ? 'Confirmer la désactivation'
                : 'Confirmer la réactivation'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {userToUpdate?.active
                ? `Êtes-vous sûr de vouloir désactiver le compte de ${userToUpdate?.firstname} ${userToUpdate?.lastname} ?`
                : `Êtes-vous sûr de vouloir réactiver le compte de ${userToUpdate?.firstname} ${userToUpdate?.lastname} ?`}
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
              variant={userToUpdate?.active ? 'destructive' : 'default'}
              onClick={handleToggleUserStatus}
            >
              {userToUpdate?.active ? 'Désactiver' : 'Réactiver'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
