import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  LogOut,
  Menu,
  X,
  Settings,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.png";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/services/auth/useAuth";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: number[];
};

interface AuthenticatedLayoutProps {
  children?: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL;

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const navigation: NavItem[] = [
    {
      name: t.nav.connected.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
      role: [1, 2, 3, 4],
    },
    {
      name: t.nav.connected.calendar,
      href: "/calendar",
      icon: CalendarIcon,
      role: [2, 3],
    },
    {
      name: t.nav.connected.appointments,
      href: "/appointments",
      icon: CalendarIcon,
      role: [1],
    },
    {
      name: t.nav.connected.settings,
      href: "/settings",
      icon: Settings,
      role: [1, 2, 3, 4],
    },
    {
      name: t.nav.connected.doctor,
      href: "/doctor-settings",
      icon: Settings,
      role: [2],
    },
    {
      name: t.nav.connected.cabinet,
      href: "/cabinet-settings",
      icon: Settings,
      role: [2],
    },
    {
      name: t.nav.connected.admin,
      href: "/admin-settings",
      icon: Settings,
      role: [4],
    },
    {
      name: t.nav.connected.articles,
      href: "/admin-articles",
      icon: Newspaper,
      role: [4],
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setActivePath(location.pathname);
  }, [navigate, location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
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
          "lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
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
                    ? "bg-accent/20 text-primary-600"
                    : "text-gray-700 hover:bg-accent/10 hover:text-gray-900",
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                )}
              >
                <item.icon
                  className={cn(
                    activePath === item.href
                      ? "text-primary-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0 h-5 w-5",
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-52 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4 lg:pt-5">
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
                    ? "bg-accent/20 text-primary-600"
                    : "text-gray-700 hover:bg-accent/10 hover:text-gray-900",
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                )}
              >
                <item.icon
                  className={cn(
                    activePath === item.href
                      ? "text-primary-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-5 w-5 flex-shrink-0",
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
      <div className="lg:pl-52 flex flex-col flex-1">
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
                  <div className="flex items-center text-right">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-4">
                      <img
                        src={
                          user?.avatar
                            ? `${API_URL}/user/${user.id}/avatar/${user.avatar}`
                            : "/default-avatar.png"
                        }
                        alt={user?.firstname}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {user.roleId === 2 && "Dr. "}
                        {user.firstname}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {user.lastname}
                      </p>
                    </div>
                  </div>

                  <LanguageSelector />
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">
                      {t.nav.connected.logout}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto">{children || <Outlet />}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
