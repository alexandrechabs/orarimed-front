import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Trash2,
  Plus,
  Info,
  MoreVertical,
  Eye,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/services/user/useUser";
import { UserRole } from "@/types/roles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddDoctorForm } from "@/components/admin/AddDoctorForm";
import { DoctorProfile } from "@/types/doctor";
import { Diploma } from "@/types/diploma";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import OpeningHoursForm from "./OpeningHoursForm";
import { FormProvider, useForm } from "react-hook-form";
import { OpeningHour } from "@/types/openingHour";
import ConsultationReasons from "./ConsultationReasons";
import { ConsultationReason } from "@/types/consultationReason";
import { AddSecretaryForm } from "./AddSecretaryForm";
import DoctorSecretarySearch from "./DoctorSecretarySearch";
import { Experience } from "@/types/experience";
import { userService } from "@/services/user/user.service";
import { Textarea } from "../ui/textarea";

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

type DiplomaForm = {
  title: string;
  institution: string;
  year: number;
  field: string;
};

type ExperienceForm = {
  company: string;
  startYear: string;
  endYear?: string;
  description?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export default function UserList({ type }: { type: string }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<DoctorProfile[]>([]);
  const { language } = useLanguage();
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [isAddSecretaryOpen, setIsAddSecretaryOpen] = useState(false);
  const [isAddDoctorToSecretaryOpen, setIsAddDoctorToSecretaryOpen] =
    useState(false);
  const [editingUser, setEditingUser] = useState<EditUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState<DoctorProfile | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isOpeningHoursModalOpen, setIsOpeningHoursModalOpen] = useState(false);
  const [isConsultationReasonModalOpen, setIsConsultationReasonModalOpen] =
    useState(false);
  const [isDiplomasModalOpen, setIsDiplomasModalOpen] = useState(false);
  const [selectedDiplomasUser, setSelectedDiplomasUser] =
    useState<DoctorProfile | null>(null);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);
  const [diplomaForm, setDiplomaForm] = useState<DiplomaForm>({
    title: "",
    institution: "",
    year: new Date().getFullYear(),
    field: "",
  });
  const [isExperiencesModalOpen, setIsExperiencesModalOpen] = useState(false);
  const [selectedExperiencesUser, setSelectedExperiencesUser] =
    useState<DoctorProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({
    company: "",
    startYear: "",
    endYear: "",
    description: "",
  });
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
      const usersData = await userService.getUsersAdmin(
        type === "doctor" ? UserRole.DOCTOR : UserRole.SECRETARY,
      );
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userService.getUsersAdmin, type]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const initUser = (user: DoctorProfile) => {
    const userToEdit: EditUser = {
      id: user.id ? user.id : "",
      email: user.email || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      address: user.address || "",
      city: user.city || "",
      zipCode: user.zipCode || "",
      country: user.country || "",
      coordinate: {
        x: user.coordinate?.y || 0,
        y: user.coordinate?.x || 0,
      },
      phoneNumber: user.phoneNumber || "",
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

  const handleEditSecretary = (user: DoctorProfile) => {
    initUser(user);
    setIsAddSecretaryOpen(true);
  };

  const handleViewUser = (user: DoctorProfile) => {
    navigate(`/doctor/${user.speciality.slug}/${user.doctorIdentifier}`);
  };

  const handleToggleUserStatus = async () => {
    if (!userToUpdate) return;

    try {
      await userService.updateUser(userToUpdate.id, {
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
        title: "Succès",
        description: userToUpdate.active
          ? "Le compte a été désactivé avec succès."
          : "Le compte a été réactivé avec succès.",
      });

      // Recharger la liste des utilisateurs
      await loadUsers();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut du compte :",
        error,
      );
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la ${userToUpdate?.active ? "désactivation" : "réactivation"} du compte.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdateDialogOpen(false);
      setUserToUpdate(null);
    }
  };

  const handleEditOpeningHours = (user: DoctorProfile) => {
    initUser(user);
    userService.getOpeningHours(user.id).then((openingHours) => {
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
    userService.getReasons(user.id).then((reasons) => {
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

  const handleEditDiplomas = async (user: DoctorProfile) => {
    setSelectedDiplomasUser(user);
    setEditingDiploma(null);
    setDiplomaForm({
      title: "",
      institution: "",
      year: new Date().getFullYear(),
      field: "",
    });

    try {
      const diplomasData = await userService.getDiplomas(user.id);
      setDiplomas(diplomasData);
      setIsDiplomasModalOpen(true);
    } catch (error) {
      console.error("Erreur lors du chargement des diplômes :", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les diplômes.",
        variant: "destructive",
      });
    }
  };

  const resetDiplomaForm = () => {
    setEditingDiploma(null);
    setDiplomaForm({
      title: "",
      institution: "",
      year: new Date().getFullYear(),
      field: "",
    });
  };

  const handleDiplomaEdit = (diploma: Diploma) => {
    setEditingDiploma(diploma);
    setDiplomaForm({
      title: diploma.title,
      institution: diploma.institution,
      year: diploma.year,
      field: diploma.field || "",
    });
  };

  const handleDiplomaFormChange = (
    field: keyof DiplomaForm,
    value: string | number,
  ) => {
    setDiplomaForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveDiploma = async () => {
    if (!selectedDiplomasUser) return;

    try {
      if (editingDiploma) {
        const updated = await userService.updateDiploma(
          selectedDiplomasUser.id,
          editingDiploma.id,
          {
            title: diplomaForm.title,
            institution: diplomaForm.institution,
            year: diplomaForm.year,
            field: diplomaForm.field || null,
          },
        );
        setDiplomas((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d)),
        );
        toast({
          title: "Succès",
          description: "Diplôme mis à jour.",
        });
      } else {
        const created = await userService.createDiploma(
          selectedDiplomasUser.id,
          {
            title: diplomaForm.title,
            institution: diplomaForm.institution,
            year: diplomaForm.year,
            field: diplomaForm.field || null,
          },
        );
        setDiplomas((prev) => [...prev, created]);
        toast({
          title: "Succès",
          description: "Diplôme ajouté.",
        });
      }

      resetDiplomaForm();
    } catch (error) {
      console.error("Erreur lors de l’enregistrement du diplôme :", error);
      toast({
        title: "Erreur",
        description: "Impossible d’enregistrer le diplôme.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDiploma = async (diplomaId: number) => {
    if (!selectedDiplomasUser) return;

    try {
      await userService.deleteDiploma(selectedDiplomasUser.id, diplomaId);
      setDiplomas((prev) => prev.filter((d) => d.id !== diplomaId));
      toast({
        title: "Succès",
        description: "Diplôme supprimé.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du diplôme :", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le diplôme.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDiplomasModal = () => {
    setIsDiplomasModalOpen(false);
    setSelectedDiplomasUser(null);
    resetDiplomaForm();
  };

  const handleEditExperiences = async (user: DoctorProfile) => {
    setSelectedExperiencesUser(user);
    setEditingExperience(null);
    setExperienceForm({
      company: "",
      startYear: "",
      endYear: "",
      description: "",
    });

    try {
      const experiencesData = await userService.getExperiences(user.id);
      setExperiences(experiencesData);
      setIsExperiencesModalOpen(true);
    } catch (error) {
      console.error("Erreur lors du chargement des expériences :", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les expériences.",
        variant: "destructive",
      });
    }
  };

  const resetExperienceForm = () => {
    setEditingExperience(null);
    setExperienceForm({
      company: "",
      startYear: "",
      endYear: "",
      description: "",
    });
  };

  const handleExperienceEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setExperienceForm({
      company: experience.company,
      startYear: experience.startYear,
      endYear: experience.endYear || "",
      description: experience.description || "",
    });
  };

  const handleExperienceFormChange = (
    field: keyof ExperienceForm,
    value: string | number,
  ) => {
    setExperienceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveExperience = async () => {
    if (!selectedExperiencesUser) return;

    try {
      if (editingExperience) {
        const updated = await userService.updateExperience(
          selectedExperiencesUser.id,
          editingExperience.id,
          {
            company: experienceForm.company,
            startYear: experienceForm.startYear,
            endYear: experienceForm.endYear || null,
            description: experienceForm.description || null,
          },
        );
        setExperiences((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e)),
        );
        toast({
          title: "Succès",
          description: "Expérience mise à jour.",
        });
      } else {
        const created = await userService.createExperience(
          selectedExperiencesUser.id,
          {
            company: experienceForm.company,
            startYear: experienceForm.startYear,
            endYear: experienceForm.endYear || null,
            description: experienceForm.description || null,
          },
        );
        setExperiences((prev) => [...prev, created]);
        toast({
          title: "Succès",
          description: "Expérience ajoutée.",
        });
      }

      resetExperienceForm();
    } catch (error) {
      console.error("Erreur lors de l’enregistrement de l’expérience :", error);
      toast({
        title: "Erreur",
        description: "Impossible d’enregistrer l’expérience.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExperience = async (experienceId: number) => {
    if (!selectedExperiencesUser) return;

    try {
      await userService.deleteExperience(
        selectedExperiencesUser.id,
        experienceId,
      );
      setExperiences((prev) => prev.filter((e) => e.id !== experienceId));
      toast({
        title: "Succès",
        description: "Expérience supprimée.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l’expérience :", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l’expérience.",
        variant: "destructive",
      });
    }
  };

  const handleCloseExperiencesModal = () => {
    setIsExperiencesModalOpen(false);
    setSelectedExperiencesUser(null);
    resetExperienceForm();
  };

  const handleEditDoctorList = (user: DoctorProfile) => {
    initUser(user);
    setIsAddDoctorToSecretaryOpen(true);
  };

  const onSubmit = (formData: { openingHours: OpeningHour[] }) => {
    setIsOpeningHoursModalOpen(false);
    let openingHours = formData.openingHours;
    openingHours.forEach((openingHour) => {
      openingHour.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
    userService.saveOpeningHours(editingUser.id, openingHours);

    toast({
      title: "Succès",
      description: "Les heures d'ouverture ont été chargées avec succès.",
    });
  };

  const onConsultationReasonsSubmit = (formData: {
    consultationReasons: ConsultationReason[];
  }) => {
    setIsConsultationReasonModalOpen(false);
    let consultationReasons = formData.consultationReasons;
    userService.saveReasons(editingUser.id, consultationReasons);

    toast({
      title: "Succès",
      description:
        "Les motifs de consultation ont été enregistrés avec succès.",
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    if (type === "doctor") {
      setIsAddDoctorOpen(true);
    } else {
      setIsAddSecretaryOpen(true);
    }
  };

  const handleSuccess = () => {
    setIsAddDoctorOpen(false);
    setIsAddSecretaryOpen(false);
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
                              : "default-avatar.png"
                          }
                          alt={user.firstname}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/default-avatar.png";
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
                    {type === "doctor"
                      ? user.speciality.translations.filter(
                          (t) => t.locale === language,
                        )[0].name
                      : ""}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-gray-800"}`}
                    >
                      {user.active ? "Oui" : "Non"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.visible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {user.visible ? "Oui" : "Non"}
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
                        {type === "doctor" && (
                          <DropdownMenuItem
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Voir le profil</span>
                          </DropdownMenuItem>
                        )}
                        {type === "doctor" && (
                          <DropdownMenuItem
                            onClick={() => handleEditOpeningHours(user)}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <span>Horaires d'ouverture</span>
                          </DropdownMenuItem>
                        )}
                        {type === "doctor" && (
                          <DropdownMenuItem
                            onClick={() => handleEditConsultationReasons(user)}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <span>Motifs de consultation</span>
                          </DropdownMenuItem>
                        )}
                        {type === "doctor" && (
                          <DropdownMenuItem
                            onClick={() => handleEditDiplomas(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Diplômes</span>
                          </DropdownMenuItem>
                        )}
                        {type === "doctor" && (
                          <DropdownMenuItem
                            onClick={() => handleEditExperiences(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Expériences</span>
                          </DropdownMenuItem>
                        )}
                        {type !== "doctor" && (
                          <DropdownMenuItem
                            onClick={() => handleEditDoctorList(user)}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <span>Accès docteur</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className={
                            user.active
                              ? "text-destructive focus:text-destructive"
                              : "text-green-600 focus:text-green-700"
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
            if (target.closest(".pac-container")) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingUser
                ? `Modifier ${editingUser.firstname} ${editingUser.lastname}`
                : `Nouveau compte docteur`}
            </DialogTitle>
          </DialogHeader>
          <AddDoctorForm
            user={editingUser || undefined}
            onSuccess={handleSuccess}
            onClose={() => setIsAddDoctorOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSecretaryOpen} onOpenChange={setIsAddSecretaryOpen}>
        <DialogContent
          className="overflow-visible max-h-[90vh] overflow-y-auto"
          onInteractOutside={(e) => {
            // Empêche la fermeture de la modale lors du clic sur les suggestions
            const target = e.target as HTMLElement;
            if (target.closest(".pac-container")) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {editingUser
                ? `Modifier ${editingUser.firstname} ${editingUser.lastname}`
                : `Nouveau compte Secrétaire`}
            </DialogTitle>
          </DialogHeader>
          <AddSecretaryForm
            user={editingUser || undefined}
            onSuccess={handleSuccess}
            onClose={() => setIsAddSecretaryOpen(false)}
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
              Définissez les horaires d'ouverture pour {editingUser?.firstname}{" "}
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
              Définissez les raisons de consultation pour{" "}
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
                ? "Confirmer la désactivation"
                : "Confirmer la réactivation"}
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
              variant={userToUpdate?.active ? "destructive" : "default"}
              onClick={handleToggleUserStatus}
            >
              {userToUpdate?.active ? "Désactiver" : "Réactiver"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAddDoctorToSecretaryOpen}
        onOpenChange={setIsAddDoctorToSecretaryOpen}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              Liste des docteurs accessible pour la secrétaire
            </DialogTitle>
            <DialogDescription>
              Ajoutez un accès entre docteur et la secrétaire{" "}
              {editingUser?.firstname}
            </DialogDescription>
          </DialogHeader>
          <DoctorSecretarySearch
            secretaryId={editingUser?.id}
            secretaryName={editingUser?.firstname}
            onSuccess={() => setIsAddDoctorToSecretaryOpen(false)}
            maxSelection={50}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddDoctorToSecretaryOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDiplomasModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDiplomasModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gérer les diplômes</DialogTitle>
            <DialogDescription>
              {selectedDiplomasUser
                ? `${selectedDiplomasUser.firstname} ${selectedDiplomasUser.lastname}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diploma-title">Diplôme</Label>
                  <Input
                    id="diploma-title"
                    value={diplomaForm.title}
                    onChange={(e) =>
                      handleDiplomaFormChange("title", e.target.value)
                    }
                    placeholder="Ex : Doctorat en médecine"
                  />
                </div>
                <div>
                  <Label htmlFor="diploma-institution">Institution</Label>
                  <Input
                    id="diploma-institution"
                    value={diplomaForm.institution}
                    onChange={(e) =>
                      handleDiplomaFormChange("institution", e.target.value)
                    }
                    placeholder="Ex : Université de Paris"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diploma-year">Année</Label>
                  <Input
                    id="diploma-year"
                    type="number"
                    value={diplomaForm.year}
                    onChange={(e) =>
                      handleDiplomaFormChange(
                        "year",
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="diploma-field">Domaine</Label>
                  <Input
                    id="diploma-field"
                    value={diplomaForm.field}
                    onChange={(e) =>
                      handleDiplomaFormChange("field", e.target.value)
                    }
                    placeholder="Ex : Chirurgie"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={handleSaveDiploma}>
                  {editingDiploma ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Diplômes existants</h3>
              {diplomas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun diplôme trouvé.
                </p>
              ) : (
                <div className="space-y-3">
                  {diplomas.map((diploma) => (
                    <div
                      key={diploma.id}
                      className="rounded-lg border p-4 grid gap-3 sm:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <div className="font-semibold">{diploma.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {diploma.institution} — {diploma.year}
                          {diploma.field ? ` • ${diploma.field}` : ""}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDiplomaEdit(diploma)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDiploma(diploma.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDiplomasModal}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isExperiencesModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseExperiencesModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gérer les expériences</DialogTitle>
            <DialogDescription>
              {selectedExperiencesUser
                ? `${selectedExperiencesUser.firstname} ${selectedExperiencesUser.lastname}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="experience-company">Entreprise</Label>
                  <Input
                    id="experience-company"
                    value={experienceForm.company}
                    onChange={(e) =>
                      handleExperienceFormChange("company", e.target.value)
                    }
                    placeholder="Ex : Hôpital"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience-startYear">Année de début</Label>
                  <Input
                    id="experience-startYear"
                    type="number"
                    value={experienceForm.startYear}
                    onChange={(e) =>
                      handleExperienceFormChange("startYear", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="experience-endYear">Année de fin</Label>
                  <Input
                    id="experience-endYear"
                    type="number"
                    value={experienceForm.endYear}
                    onChange={(e) =>
                      handleExperienceFormChange("endYear", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="experience-description">Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder={"description"}
                    value={experienceForm.description}
                    onChange={(e) =>
                      handleExperienceFormChange("description", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={handleSaveExperience}>
                  {editingExperience ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Experiences existants</h3>
              {experiences.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune expérience trouvée.
                </p>
              ) : (
                <div className="space-y-3">
                  {experiences.map((experience) => (
                    <div
                      key={experience.id}
                      className="rounded-lg border p-4 grid gap-3 sm:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <div>
                          <span className="font-semibold">
                            {experience.startYear} -{" "}
                            {experience.endYear || "Present"}
                          </span>{" "}
                          {experience.company}
                        </div>
                        {experience.description !== "" && (
                          <div className="text-sm text-muted-foreground whitespace-pre-line">
                            {experience.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExperienceEdit(experience)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteExperience(experience.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseExperiencesModal}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
