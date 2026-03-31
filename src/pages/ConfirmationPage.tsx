import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDateLocale } from '@/lib/i18n/LanguageContext';
import { format } from 'date-fns';
import { CheckCircle, Calendar, User, Stethoscope } from 'lucide-react';

interface LocationState {
  doctor: {
    id: string;
    fullName: string;
    speciality: string;
  };
  appointmentType: {
    id: number;
    name: string;
    duration: number;
  };
  slot: string;
  confirmationId?: string;
}

export default function ConfirmationPage() {
  const { t } = useLanguage();
  const dateLocale = useDateLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Si pas d'état, rediriger vers la page d'accueil
  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { doctor, appointmentType, slot } = state;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mt-20">
        {/* En-tête de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.createRdv.appointmentPage.confirm}
          </h1>
          <p className="text-gray-600">
            {t.createRdv.appointmentPage.confirmationMessage}
          </p>
        </div>

        {/* Carte de confirmation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {t.createRdv.appointmentPage.step3Title}{' '}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {/* Médecin */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Stethoscope className="w-5 h-5 text-blue-600 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700">
                  {t.createRdv.appointmentPage.step3Doctor}
                </h3>
                <p className="text-lg">Dr {doctor.fullName}</p>
                <p className="text-gray-600">{doctor.speciality}</p>
              </div>
            </div>
            {/* Type de rendez-vous */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <User className="w-5 h-5 text-blue-600 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700">
                  {t.createRdv.appointmentPage.kindRdv}
                </h3>
                <p className="text-lg">{appointmentType.name}</p>
                <p className="text-gray-600">
                  {t.createRdv.appointmentPage.duration} :{' '}
                  {appointmentType.duration}{' '}
                  {t.createRdv.appointmentPage.minute}
                </p>
              </div>
            </div>

            {/* Date et heure */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-700">
                  {t.createRdv.appointmentPage.time}
                </h3>
                <p className="text-lg">
                  {format(new Date(slot), 'EEEE d MMMM yyyy', {
                    locale: dateLocale,
                  })}
                </p>
                <p className="text-gray-600">
                  {format(new Date(slot), 'HH:mm', {
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              {t.createRdv.appointmentPage.goHome}
            </Button>
            <Button
              onClick={() => {
                // Ouvrir la liste des rendez-vous
                navigate('/appointments');
              }}
              className="flex-1"
            >
              {t.createRdv.appointmentPage.viewRdv}
            </Button>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            {t.createRdv.appointmentPage.importantInfo}
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t.createRdv.appointmentPage.cancelInfo}</li>
            <li>• {t.createRdv.appointmentPage.reminderInfo}</li>
            <li>• {t.createRdv.appointmentPage.lateInfo}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
