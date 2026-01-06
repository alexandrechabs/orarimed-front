import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, User as UserIcon, Calendar, Clock } from 'lucide-react';
import { User } from '@/types/user';
import { useAuth } from '@/services/auth/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bienvenue */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Bienvenue, {user?.firstname} !</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gérer vos rendez-vous et vos informations personnelles depuis
                votre espace personnel.
              </p>
            </CardContent>
          </Card>

          {/* Prochains rendez-vous */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
                <Button variant="ghost" size="sm">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 bg-accent/20 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Consultation générale
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Demain, 14:30 - 15:00</span>
                    </div>
                  </div>
                </div>
                <div className="text-center py-4 text-sm text-gray-500">
                  Aucun autre rendez-vous à venir
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nom complet</p>
                <p className="text-gray-900">
                  {user?.firstname} {user?.lastname}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Modifier les informations
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
