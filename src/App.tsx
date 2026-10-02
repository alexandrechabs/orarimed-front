// Dans App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Index from "./pages/Index";
import SpecialitiesListPage from "./pages/SpecialitiesListPage";
import SpecialityPage from "./pages/SpecialtyPage";

import Actualities from "./pages/Actualities";
import ArticleDetail from "./pages/ArticleDetail";
import KontaktPage from "./pages/KontaktPage";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import OnboardingClientPage from "./pages/onboarding/OnboardingClientPage";
import SettingsPage from "./pages/settings/SettingsPage";
import { useAuth } from "./services/auth/useAuth";
import ProfessionalPage from "./pages/ProfessionalPage";
import { ProfessionalRegisterPage } from "./pages/auth/ProfessionalRegisterPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { EmailConfirmationPage } from "./pages/auth/EmailConfirmationPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { ProfessionalOnboardingPage } from "./pages/onboarding/ProfessionalOnboardingPage";
import AdminOfficeSettingsPage from "./pages/admin/AdminOfficeSettingsPage";
import AdminDoctorSettingsPage from "./pages/admin/AdminDoctorSettingsPage";
import AdminSecretarySettingsPage from "./pages/admin/AdminSecretarySettingsPage";
import AdminSpecialitiesSettingsPage from "./pages/admin/AdminSpecialitiesSettingsPage";
import AdminArticlesPage from "./pages/admin/ArticlePage";
import DoctorPage from "./pages/DoctorPage";
import SearchPage from "./pages/SearchPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import DoctorSettingsPage from "./pages/settings/DoctorSettingsPage";
import AppointmentPage from "./pages/AppointmentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import CenterPage from "./pages/CenterPage";
import SelectDoctorPage from "./pages/SelectDoctorPage";
import CabinetSettingsPage from "./pages/settings/CabinetSettingsPage";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

// Composant pour protéger les routes d'authentification (rediriger si déjà connecté)
const ProtectedAuthRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
};

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

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (
    user &&
    !user.birthDate &&
    user.roleId === 1 &&
    !location.pathname.startsWith("/onboardingClient")
  ) {
    return <Navigate to="/onboardingClient" replace />;
  }
  if (
    user &&
    !user.birthDate &&
    user.roleId === 2 &&
    !location.pathname.startsWith("/onboardingDoctor")
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

  if (!user.emailVerified && !location.pathname.startsWith("/verify-email")) {
    return <Navigate to="/verify-email" replace />;
  }

  // Rediriger vers l'onboarding si non complété
  if (user.emailVerified && user.birthDate) {
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
    // Préserver l'état existant s'il y en a un, sinon ajouter la page d'origine
    const existingState = location.state || {};
    const navigationState = {
      ...existingState,
      from: location.pathname,
    };
    return <Navigate to="/login" state={navigationState} replace />;
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
        <ScrollToTop />
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/specialities" element={<SpecialitiesListPage />} />
          <Route path="/specialities/:slug" element={<SpecialityPage />} />
          <Route path="/actualities" element={<Actualities />} />
          <Route
            path="/actualities/:locale/:slug"
            element={<ArticleDetail />}
          />
          <Route path="/contact" element={<KontaktPage />} />
          <Route path="/professionals" element={<ProfessionalPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/login"
            element={
              <ProtectedAuthRoute>
                <LoginPage />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedAuthRoute>
                <RegisterPage />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedAuthRoute>
                <ForgotPasswordPage />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedAuthRoute>
                <ResetPasswordPage />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="/register-professional"
            element={
              <ProtectedAuthRoute>
                <ProfessionalRegisterPage />
              </ProtectedAuthRoute>
            }
          />
          <Route
            path="/appointment"
            element={
              <ProtectedRouteByRole allowedRoles={[1, 2, 3, 4]}>
                <AppointmentPage />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ProtectedRouteByRole allowedRoles={[1, 2, 3, 4]}>
                <ConfirmationPage />
              </ProtectedRouteByRole>
            }
          />

          <Route
            path="/verify-email"
            element={
              <ProtectedRouteOnboarding>
                <EmailConfirmationPage />
              </ProtectedRouteOnboarding>
            }
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
                  <ProtectedRouteByRole allowedRoles={[1, 2, 3, 4]}>
                    <DashboardPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRouteByRole allowedRoles={[2, 3]}>
                    <CalendarPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRouteByRole allowedRoles={[1]}>
                    <AppointmentsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRouteByRole allowedRoles={[1, 2, 3, 4]}>
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
                path="/cabinet-settings"
                element={
                  <ProtectedRouteByRole allowedRoles={[2]}>
                    <CabinetSettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/admin-offices"
                element={
                  <ProtectedRouteByRole allowedRoles={[4]}>
                    <AdminOfficeSettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/admin-doctors"
                element={
                  <ProtectedRouteByRole allowedRoles={[4]}>
                    <AdminDoctorSettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/admin-secretaries"
                element={
                  <ProtectedRouteByRole allowedRoles={[4]}>
                    <AdminSecretarySettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/admin-specialities"
                element={
                  <ProtectedRouteByRole allowedRoles={[4]}>
                    <AdminSpecialitiesSettingsPage />
                  </ProtectedRouteByRole>
                }
              />
              <Route
                path="/admin-articles"
                element={
                  <ProtectedRouteByRole allowedRoles={[4]}>
                    <AdminArticlesPage />
                  </ProtectedRouteByRole>
                }
              />
            </Route>
          </Route>
          <Route path="/doctor/:city/:username" element={<DoctorPage />} />
          <Route path="/center/:city/:username" element={<CenterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route
            path="/center/:centerId/select-doctor"
            element={<SelectDoctorPage />}
          />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
