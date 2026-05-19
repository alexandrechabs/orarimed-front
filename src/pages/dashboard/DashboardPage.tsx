import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useAuth } from "@/services/auth/useAuth";
import { useUser } from "@/services/user/useUser";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import DashboardStats from "@/components/dashboard/DashboardStats";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getEvents, getSecretaryDoctors } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.roleId === 1 || user.roleId === 2) {
      // get next rdvs
      let dateRange;
      if (user.roleId === 1) {
        dateRange = {
          start: new Date().toISOString(),
          end: new Date(
            new Date().setFullYear(new Date().getFullYear() + 5),
          ).toISOString(),
        };
      } else {
        // get event for all week (from monday to sunday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(
          today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1),
        );
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        dateRange = {
          start: monday.toISOString(),
          end: sunday.toISOString(),
        };
      }
      getEvents(dateRange).then((events) => {
        setEvents(events);
      });
    }
    if (user.roleId === 3) {
      getSecretaryDoctors(user.id).then((doctors) => {
        setDoctors(doctors);
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bienvenue */}
          <Card className="col-span-full bg-accent">
            <CardHeader>
              <CardTitle className="text-white">
                {t.dashboard.welcome},{" "}
                <span className="text-gray-200">{user?.firstname}</span> !
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.roleId === 1 && (
                <p className="text-gray-100">{t.dashboard.welcomeClient}</p>
              )}
              {user.roleId === 2 && (
                <p className="text-gray-100">{t.dashboard.welcomeDoctor}</p>
              )}
              {user.roleId === 3 && (
                <p className="text-gray-100">{t.dashboard.welcomeSecretary}</p>
              )}
            </CardContent>
          </Card>

          {/* Prendre un rendez-vous */}
          {user.roleId === 1 && (
            <Card className="md:col-span-2">
              <CardContent className="flex justify-center items-center h-full">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/search")}
                >
                  {t.dashboard.takeAnAppointment}
                </Button>
              </CardContent>
            </Card>
          )}

          {user.roleId === 2 && (
            <div className="md:col-span-full">
              <DashboardStats />
            </div>
          )}

          {/* Prochains rendez-vous */}
          {user.roleId === 1 && (
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {t.dashboard.nextAppointments}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/appointments")}
                  >
                    {t.dashboard.seeAll}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length > 0 && (
                    <>
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 bg-accent/20 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-accent" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {event.title}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(event.start).toLocaleDateString(
                                  user?.language || "en-EN",
                                  {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="text-center py-4 text-sm text-gray-500">
                        {t.dashboard.noOtherNextAppointment}
                      </div>
                    </>
                  )}
                  {events.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      {t.dashboard.noNextAppointment}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {user.roleId === 3 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t.dashboard.myDoctors}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="flex bg-gray-200 p-2 rounded-lg mb-2 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/calendar?userId=${doctor.id}`)}
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img
                          src={
                            doctor.avatar
                              ? `${API_URL}/user/${doctor.id}/avatar/${doctor.avatar}`
                              : "/default-avatar.png"
                          }
                          alt={doctor.firstname}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                      <div className="grid">
                        <span className="text-sm">
                          {doctor.firstname} {doctor.lastname}
                        </span>
                        <span className="text-sm">{doctor.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
