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
import SpecialtyPage from './pages/SpecialtyPage';
import AktualitetePage from './pages/AktualitetePage';
import KontaktPage from './pages/KontaktPage';
import NotFound from './pages/NotFound';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CalendarPage from './pages/calendar/CalendarPage';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import OnboardingClientPage from './pages/onboarding/OnboardingClientPage';
import { useAuth } from './services/auth/useAuth';

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
    !location.pathname.startsWith('/onboardingClient')
  ) {
    return <Navigate to="/onboardingClient" replace />;
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Index />} />
          <Route path="/specialitete" element={<SpecialitiesListPage />} />
          <Route path="/specialitete/:slug" element={<SpecialtyPage />} />
          <Route path="/aktualitete" element={<AktualitetePage />} />
          <Route path="/kontakt" element={<KontaktPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/onboardingClient"
            element={
              <ProtectedRouteOnboarding>
                <OnboardingClientPage />
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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendrier" element={<CalendarPage />} />
            </Route>
          </Route>
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
