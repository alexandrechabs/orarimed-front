import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDateLocale, useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUser } from '@/services/user/useUser';
import { Slots } from '@/components/doctors/Slots';
import { ConsultationReason } from '@/types/consultationReason';

interface LocationState {
  doctor: {
    id: string;
    fullName: string;
    speciality: string;
  };
  slot: string;
  date?: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

export default function AppointmentPage() {
  const { getReasonsClient, checkValidSelection, createRdv } = useUser();
  const { t } = useLanguage();
  const dateLocale = useDateLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const [appointmentType, setAppointmentType] = useState<ConsultationReason[]>(
    [],
  );
  const { doctor, slot, date } = location.state as LocationState;
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Ref pour accéder à la fonction load du composant Slots
  const slotsRef = useRef<{ load: (duration: number) => void }>(null);
  const [pendingDuration, setPendingDuration] = useState<number | null>(null);

  useEffect(() => {
    setSelectedSlot(slot);
    getReasonsClient(doctor.id).then((reasons) => {
      setAppointmentType(reasons);
    });
  }, []);

  // Quand le ref est prêt et qu'il y a une durée en attente, charger les créneaux
  useEffect(() => {
    if (slotsRef.current && pendingDuration !== null && currentStep === 2) {
      slotsRef.current.load(pendingDuration);
      setPendingDuration(null);
    }
  }, [slotsRef.current, pendingDuration, currentStep]);

  const handleConfirmAppointment = async () => {
    if (currentStep === 1) {
      if (!selectedType) return;
      const duration =
        appointmentType.find((type) => type.id === selectedType)?.duration ||
        15;
      setPendingDuration(duration);

      if (!slot) {
        setSelectedSlot(null);
        setCurrentStep(2);
        setIsLoadingSlots(true);
        setIsLoadingSlots(false);
      } else {
        const checkResult: { valid: boolean } = await checkValidSelection(
          doctor.id,
          selectedType,
          slot,
        );

        if (checkResult.valid) {
          setCurrentStep(3); // Aller directement à la confirmation si valide
        } else {
          // Si la sélection n'est pas valide, passer à l'étape de sélection de créneau (étape 2)
          setSelectedSlot(null);
          setCurrentStep(2);
          setIsLoadingSlots(true);
          setIsLoadingSlots(false);
        }
      }
    } else if (currentStep === 2) {
      // Après avoir sélectionné un créneau, passer à la confirmation (étape 3)
      if (!selectedSlot) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Logique de confirmation finale
      createRdv(doctor.id, selectedSlot, selectedType);

      // Naviguer vers la page de confirmation avec les données
      const appointmentTypeData = appointmentType.find(
        (t) => t.id === selectedType,
      );
      navigate('/confirmation', {
        state: {
          doctor,
          appointmentType: appointmentTypeData,
          slot: selectedSlot || slot,
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const clickSlot = async (e: React.MouseEvent, slot: string | Date) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSlot(slot as string);
  };

  // Étape 1 : Sélection du type de rendez-vous
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t.createRdv.appointmentPage.step1}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointmentType.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`p-4 border rounded-lg text-left transition-all ${
              selectedType === type.id
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{type.name}</h3>
                <p className="text-sm text-gray-500">
                  {t.createRdv.appointmentPage.duration} : {type.duration}{' '}
                  {t.createRdv.appointmentPage.minute}
                </p>
              </div>
              {selectedType === type.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Étape 2 : Sélection de créneau horaire
  const renderTimeSlotStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t.createRdv.appointmentPage.step2Title}
      </h2>
      <p className="text-gray-600">
        {t.createRdv.appointmentPage.step2Description}
      </p>
      {isLoadingSlots ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Slots doctor={doctor} clickSlot={clickSlot} ref={slotsRef} />
      )}
    </div>
  );

  // Étape 3 : Récapitulatif
  const renderFinal = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {t.createRdv.appointmentPage.step3Title}
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">
            {t.createRdv.appointmentPage.step3Doctor}
          </h3>
          <p className="text-lg">Dr {doctor.fullName}</p>
          <p className="text-gray-600">{doctor.speciality}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">
            {t.createRdv.appointmentPage.kindRdv}
          </h3>
          <p className="text-lg">
            {appointmentType.find((t) => t.id === selectedType)?.name}
          </p>
          <p className="text-gray-600">
            {t.createRdv.appointmentPage.duration} :{' '}
            {appointmentType.find((t) => t.id === selectedType)?.duration}{' '}
            {t.createRdv.appointmentPage.minute}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">
            {t.createRdv.appointmentPage.time}
          </h3>
          <p className="text-lg">
            {format(new Date(selectedSlot || slot), 'EEEE d MMMM yyyy', {
              locale: dateLocale,
            })}
          </p>
          <p className="text-lg">{`${format(
            new Date(selectedSlot || slot),
            'HH:mm',
            {
              locale: dateLocale,
            },
          )}`}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold">
          {t.createRdv.appointmentPage.title}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* Indicateur d'étapes */}
        <div className="flex justify-between items-center mb-8">
          <div
            className={`flex-1 flex items-center ${
              currentStep === 1 ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 1 ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
            >
              1
            </div>
            <span>{t.createRdv.appointmentPage.step1}</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className={`h-full ${
                currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'
              }`}
              style={{ width: currentStep >= 2 ? '100%' : '0%' }}
            ></div>
          </div>
          <div
            className={`flex-1 flex items-center ${
              currentStep === 2 ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
            >
              2
            </div>
            <span>{t.createRdv.appointmentPage.step2}</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className={`h-full ${
                currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'
              }`}
              style={{ width: currentStep >= 3 ? '100%' : '0%' }}
            ></div>
          </div>
          <div
            className={`flex-1 flex items-center ${
              currentStep === 3 ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
            >
              3
            </div>
            <span>{t.createRdv.appointmentPage.step3}</span>
          </div>
        </div>

        {currentStep === 1
          ? renderStep1()
          : currentStep === 2
            ? renderTimeSlotStep()
            : renderFinal()}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {currentStep === 1 ? t.common.cancel : t.common.return}
        </Button>
        <Button
          onClick={handleConfirmAppointment}
          className="bg-primary hover:bg-primary/90"
          disabled={
            (currentStep === 1 && !selectedType) ||
            (currentStep === 2 && !selectedSlot)
          }
        >
          {currentStep === 1
            ? t.createRdv.appointmentPage.continue
            : currentStep === 2
              ? t.createRdv.appointmentPage.validate
              : t.createRdv.appointmentPage.confirm}
        </Button>
      </div>
    </div>
  );
}
