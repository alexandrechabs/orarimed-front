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
import { authService } from './services/authService';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

const queryClient = new QueryClient();

// Composant pour protéger les routes
const ProtectedRoute = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
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
              {/* Ajoutez d'autres routes protégées ici */}
              {/* <Route path="/appointments" element={<AppointmentsPage />} */}
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
