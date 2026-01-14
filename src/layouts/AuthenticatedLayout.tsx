import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Stethoscope,
  FileText,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logoIcon from '@/assets/logo-icon.png';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/services/auth/useAuth';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: number[];
};

const navigation: NavItem[] = [
  {
    name: 'Tableau de bord',
    href: '/dashboard',
    icon: LayoutDashboard,
    role: [1, 2],
  },
  {
    name: 'Calendrier',
    href: '/calendrier',
    icon: CalendarIcon,
    role: [2],
  },
  {
    name: 'Rendez-vous',
    href: '/appointments',
    icon: Stethoscope,
    role: [1, 2],
  },
  {
    name: 'Médecins',
    href: '/doctors',
    icon: Stethoscope,
    role: [1, 2],
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    role: [1, 2],
  },
  {
    name: 'Profil',
    href: '/profile',
    icon: UserIcon,
    role: [1, 2],
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    role: [1, 2],
  },
];

interface AuthenticatedLayoutProps {
  children?: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActivePath(location.pathname);
  }, [navigate, location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.',
    });
  };

  const filteredNavigation = navigation.filter((item) => {
    return item.role.includes(user.roleId);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className={cn(
            'fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="font-display font-bold text-xl text-foreground">
              Orari<span className="text-accent">Med</span>
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={cn(
                  activePath === item.href
                    ? 'bg-accent/20 text-primary-600'
                    : 'text-gray-700 hover:bg-accent/10 hover:text-gray-900',
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    activePath === item.href
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4 lg:pt-5">
        <div className="flex flex-shrink-0 items-center px-6">
          <span className="font-display font-bold text-xl text-foreground">
            Orari<span className="text-accent">Med</span>
          </span>
        </div>
        <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2">
            {filteredNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
                className={cn(
                  activePath === item.href
                    ? 'bg-accent/20 text-primary-600'
                    : 'text-gray-700 hover:bg-accent/10 hover:text-gray-900',
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    activePath === item.href
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Search bar can be added here */}
            </div>
            <div className="ml-4 flex items-center lg:ml-6">
              {/* Profile dropdown */}
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
