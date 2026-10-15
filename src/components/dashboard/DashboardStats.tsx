import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  Activity,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useUser } from "@/services/user/useUser";
import { format, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDateLocale, useLanguage } from "@/lib/i18n/LanguageContext";

interface DashboardStatsProps {
  selectedDoctor?: any;
}

interface AppointmentStatusCount {
  status: string;
  appointments: number;
}

interface DoctorStatsResponse {
  todayAppointments: number;
  todayAppointmentStatuses: AppointmentStatusCount[];
  weekAppointmentStatuses: AppointmentStatusCount[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ selectedDoctor }) => {
  const dateLocale = useDateLocale();
  const { events, getStatsDoctor } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  const [doctorStats, setDoctorStats] = useState<DoctorStatsResponse | null>(
    null,
  );

  useEffect(() => {
    getStatsDoctor()
      .then((data) => setDoctorStats(data as DoctorStatsResponse))
      .catch((error) =>
        console.error("Failed to load doctor statistics:", error),
      );
  }, [getStatsDoctor]);

  const stats = useMemo(() => {
    const todayStart = startOfDay(currentDate);
    const tomorrowEnd = endOfDay(
      new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
    );
    const twoDaysEvents = events.filter((event) => {
      if (!event.start) return false;
      const eventStart = new Date(event.start as string);
      return isWithinInterval(eventStart, {
        start: todayStart,
        end: tomorrowEnd,
      });
    });
    const nextAppointments = twoDaysEvents
      .filter(
        (event) =>
          event.status !== "finished" &&
          event.status !== "abort" &&
          event.status !== "abortExcused" &&
          new Date(event.start as string) > new Date(),
      )
      .sort(
        (a, b) =>
          new Date(a.start as string).getTime() -
          new Date(b.start as string).getTime(),
      );

    const countStatus = (statuses: AppointmentStatusCount[], status: string) =>
      statuses.find((item) => item.status === status)?.appointments ?? 0;
    const todayStatuses = doctorStats?.todayAppointmentStatuses ?? [];
    const weekStatuses = doctorStats?.weekAppointmentStatuses ?? [];
    const todayTotal = doctorStats?.todayAppointments ?? 0;
    const weekTotal = weekStatuses.reduce(
      (total, item) => total + item.appointments,
      0,
    );
    const todayFinished = countStatus(todayStatuses, "finished");
    const weekFinished = countStatus(weekStatuses, "finished");
    const todayAbsent =
      countStatus(todayStatuses, "abort") +
      countStatus(todayStatuses, "abortExcused");
    const weekAbsent =
      countStatus(weekStatuses, "abort") +
      countStatus(weekStatuses, "abortExcused");

    return {
      today: {
        total: todayTotal,
        completed: todayFinished,
        absent: todayAbsent,
        attendanceRate:
          todayTotal > 0 ? Math.round((todayFinished / todayTotal) * 100) : 0,
      },
      week: {
        total: weekTotal,
        completed: weekFinished,
        absent: weekAbsent,
        attendanceRate:
          weekTotal > 0 ? 100 - Math.round((weekAbsent / weekTotal) * 100) : 0,
      },
      waiting: countStatus(todayStatuses, "waiting"),
      nextAppointments,
    };
  }, [doctorStats, events, currentDate]);

  const attendanceRate = stats.today.attendanceRate;
  const cancelledRate =
    stats.today.total > 0
      ? Math.min(
          100 - attendanceRate,
          Math.round((stats.today.absent / stats.today.total) * 100),
        )
      : 0;
  const weekAttendanceRate = stats.week.attendanceRate;

  const formatTime = (date: string | Date) => {
    return format(new Date(date), "HH:mm", {
      locale: dateLocale,
    });
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {/* Carte: Rendez-vous du jour */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t.stats.today}</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.today.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>
              {stats.today.completed} {t.stats.completed}
            </span>
            <span>•</span>
            <span
              className={
                attendanceRate >= 80 ? "text-green-600" : "text-orange-600"
              }
            >
              {attendanceRate}% {t.stats.attendance}
            </span>
          </div>
          <div
            className="mt-2 flex h-2 overflow-hidden rounded-full bg-gray-200"
            role="img"
            aria-label={`${attendanceRate}% présence, ${cancelledRate}% annulés`}
          >
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${attendanceRate}%` }}
              title={`Présence : ${attendanceRate}%`}
            />
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${attendanceRate + cancelledRate}%` }}
            />
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${cancelledRate}%` }}
              title={`Rendez-vous annulés : ${cancelledRate}%`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Carte: Patients en attente */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.stats.waiting}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.waiting}</div>
          {stats.waiting > 0 && (
            <Badge variant="secondary" className="mt-2">
              Salle d'attente active
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Carte: Taux de présence */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.stats.attendance}
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <UserX className="h-3 w-3" />
            <span>
              {stats.today.absent} {t.stats.absent}
            </span>
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {t.stats.week}: {weekAttendanceRate}%
          </div>
        </CardContent>
      </Card>

      {/* Carte: Statistiques semaine */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.stats.thisWeek}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.week.total}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>
              {stats.week.completed} {t.stats.completed}
            </span>
          </div>
          <div className="text-xs text-green-600 mt-1">
            {t.stats.average}: {Math.round(stats.week.total / 7)}{" "}
            {t.stats.perDay}
          </div>
        </CardContent>
      </Card>

      {/* Carte: Prochain rendez-vous */}
      <Card className="hover:shadow-lg transition-shadow col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t.stats.nextAppointments}
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.nextAppointments.length > 0 ? (
            stats.nextAppointments.map((event) => {
              let Icon;
              if (event.status === "waiting") {
                Icon = LucideIcons["Armchair"];
              } else if (event.status === "consultation") {
                Icon = LucideIcons["Stethoscope"];
              } else if (event.status === "finished") {
                Icon = LucideIcons["Check"];
              } else if (event.status === "abortExcused") {
                Icon = LucideIcons["CalendarOff"];
              } else if (event.status === "abort") {
                Icon = LucideIcons["Ban"];
              }
              return (
                <div
                  key={event.id}
                  onClick={() => navigate("/calendar?id=" + event.id)}
                  className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-2 last:mb-0 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                  style={{
                    borderLeft: `8px solid ${event.color}`,
                    backgroundColor: `${event.color}20`,
                  }}
                >
                  <div>
                    <div className="text-base font-semibold">
                      {event.patient?.firstname} {event.patient?.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(
                        new Date(event.start as string),
                        "EEEE d MMMM yyyy",
                        {
                          locale: dateLocale,
                        },
                      )}

                      <span className="ml-4">
                        {formatTime(event.start as string)} -{" "}
                        {formatTime(event.end as string)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: `${event.color}30` }}
                    >
                      {formatTime(event.start as string)}
                    </Badge>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div>Aucun rendez-vous prévu</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
