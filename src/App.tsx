// Dans App.tsx
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import Index from './pages/Index';
import SpecialitiesListPage from './pages/SpecialitiesListPage';
import SpecialityPage from './pages/SpecialtyPage';

import AktualitetePage from './pages/AktualitetePage';
import KontaktPage from './pages/KontaktPage';
import NotFound from './pages/NotFound';
import DashboardPage from './pages/dashboard/DashboardPage';
import CalendarPage from './pages/calendar/CalendarPage';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import OnboardingClientPage from './pages/onboarding/OnboardingClientPage';
import SettingsPage from './pages/settings/SettingsPage';
import { useAuth } from './services/auth/useAuth';
import ProfessionalPage from './pages/ProfessionalPage';
import { ProfessionalRegisterPage } from './pages/auth/ProfessionalRegisterPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ProfessionalOnboardingPage } from './pages/onboarding/ProfessionalOnboardingPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import DoctorPage from './pages/DoctorPage';
import SearchPage from './pages/SearchPage';
import DoctorSettingsPage from './pages/settings/DoctorSettingsPage';

const queryClient = new QueryClient();

// Composant pour protéger les routes
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (
    user &&
    !user.birthDate &&
    user.roleId === 1 &&
    !location.pathname.startsWith('/onboardingClient')
  ) {
    return <Navigate to="/onboardingClient" replace />;
  }
  if (
    user &&
    !user.birthDate &&
    user.roleId === 2 &&
    !location.pathname.startsWith('/onboardingDoctor')
  ) {
    return <Navigate to="/onboardingDoctor" replace />;
  }
  return <Outlet />;
};

const ProtectedRouteOnboarding = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Rediriger vers l'onboarding si non complété
  if (user.birthDate) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

interface ProtectedRouteByRoleProps {
  children: JSX.Element;
  allowedRoles: number[];
}

const ProtectedRouteByRole = ({
  children,
  allowedRoles,
}: ProtectedRouteByRoleProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a l'ID autorisé
  if (!allowedRoles.includes(user.roleId)) {
    // Rediriger vers une page non autorisée ou le tableau de bord
    return <Navigate to="/dashboard" replace />;
    // Ou retourner null pour ne rien afficher
    // return null;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/specialities" element={<SpecialitiesListPage />} />
          <Route path="/specialities/:slug" element={<SpecialityPage />} />
          <Route path="/actualities" element={<AktualitetePage />} />
          <Route path="/contact" element={<KontaktPage />} />
          <Route path="/professionals" element={<ProfessionalPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/register-professional"
            element={<ProfessionalRegisterPage />}
          />
          <Route
            path="/onboardingClient"
            element={
              <ProtectedRouteOnboarding>
                <OnboardingClientPage />
              </ProtectedRouteOnboarding>
            }
          />
          <Route
            path="/onboardingDoctor"
            element={
              <ProtectedRouteOnboarding>
                <ProfessionalOnboardingPage />
              </ProtectedRouteOnboarding>
            }
          />
          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AuthenticatedLayout>
                  <Outlet />
                </AuthenticatedLayout>
              }
            >
              <Route
                path="/dashboard"
                element={
                  <ProtectedRouteByRole allowedRoles={[1, 2, 4]}>
                    <DashboardPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/calendrier"
                element={
                  <ProtectedRouteByRole allowedRoles={[2]}>
                    <CalendarPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRouteByRole allowedRoles={[1, 2, 4]}>
                    <SettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/doctor-settings"
                element={
                  <ProtectedRouteByRole allowedRoles={[2]}>
                    <DoctorSettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/admin-settings"
                element={
                  <ProtectedRouteByRole allowedRoles={[1, 2, 4]}>
                    <AdminSettingsPage />
                  </ProtectedRouteByRole>
                }
              />
            </Route>
          </Route>
          <Route path="/:city/:user" element={<DoctorPage />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
