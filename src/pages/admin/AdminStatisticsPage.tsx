import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  Building2,
  CalendarCheck2,
  PieChart as PieChartIcon,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  statisticsService,
  type AdminStatistics,
} from "@/services/admin/statistics.service";
import { useSpecialities } from "@/hooks/useSpecialities";

const emptyStats: AdminStatistics = {
  doctors: 0,
  users: 0,
  secretaries: 0,
  offices: 0,
  appointments: 0,
  upcomingAppointments: 0,
  doctorsBySpeciality: [],
  appointmentsByMonth: [],
};

const specialityGradients: Record<string, [string, string]> = {
  blue: ["#3b82f6", "#2563eb"],
  red: ["#ef4444", "#dc2626"],
  pink: ["#ec4899", "#db2777"],
  yellow: ["#eab308", "#ca8a04"],
  purple: ["#a855f7", "#9333ea"],
  orange: ["#f97316", "#ea580c"],
  indigo: ["#6366f1", "#4f46e5"],
  green: ["#22c55e", "#16a34a"],
  cyan: ["#06b6d4", "#0891b2"],
  teal: ["#14b8a6", "#0d9488"],
  sky: ["#0ea5e9", "#0284c7"],
  emerald: ["#10b981", "#059669"],
};

export default function AdminStatisticsPage() {
  const { t, language } = useLanguage();
  const { specialities, isLoading, error } = useSpecialities();
  const [stats, setStats] = useState<AdminStatistics>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [doctorBreakdownOpen, setDoctorBreakdownOpen] = useState(false);
  const closePopoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    statisticsService
      .getAdminStatistics()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {
        if (active) setHasLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const labels = t.adminSettings.statistics;
  const clearPopoverClose = () => {
    if (closePopoverTimer.current) clearTimeout(closePopoverTimer.current);
  };
  const schedulePopoverClose = () => {
    clearPopoverClose();
    closePopoverTimer.current = setTimeout(
      () => setDoctorBreakdownOpen(false),
      120,
    );
  };
  const formatMonthLabel = (value: string) => {
    const normalizedValue = value.trim();
    const yearFirst = /^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?(?:T.*)?$/.exec(
      normalizedValue,
    );
    const monthFirst = /^(\d{1,2})[-/](\d{4})$/.exec(normalizedValue);
    const year = yearFirst?.[1] ?? monthFirst?.[2];
    const month = yearFirst?.[2] ?? monthFirst?.[1];
    const monthNumber = Number(month);

    if (!year || !month || monthNumber < 1 || monthNumber > 12) {
      return value;
    }

    return new Intl.DateTimeFormat(language, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(Number(year), monthNumber - 1, 1)));
  };

  const getSpecialityName = (specialityId: number) => {
    const speciality = specialities?.find((s) => s.id === specialityId);
    if (!speciality) return `Speciality #${specialityId}`;
    const translation = speciality.translations.find(
      (t) => t.locale === language,
    );
    return translation?.name ?? speciality.slug;
  };

  const getChartColors = (specialityId: number) => {
    const speciality = specialities?.find((s) => s.id === specialityId);
    const color = speciality?.color ?? "from-blue-500 to-blue-600";
    const colorName = /from-([a-z]+)-\d{3}/.exec(color)?.[1];
    return specialityGradients[colorName ?? ""] ?? specialityGradients.blue;
  };

  const getChartGradientId = (specialityId: number) =>
    `speciality-gradient-${specialityId}`;

  const getChartGradientFill = (specialityId: number) =>
    `url(#${getChartGradientId(specialityId)})`;

  const getChartGradientStyle = (specialityId: number) => {
    const [startColor, endColor] = getChartColors(specialityId);
    return `linear-gradient(135deg, ${startColor}, ${endColor})`;
  };

  const cards = [
    { label: labels.patients, value: stats.users ?? 0, icon: Users },
    {
      label: labels.doctors,
      value: stats.doctors ?? 0,
      icon: Activity,
      showSpecialityChart: true,
    },
    { label: labels.secretaries, value: stats.secretaries ?? 0, icon: Users },
    { label: labels.offices, value: stats.offices ?? 0, icon: Building2 },
    {
      label: labels.appointmentsLastYear,
      value: stats.appointments ?? 0,
      icon: CalendarCheck2,
    },
    {
      label: labels.upcomingAppointments,
      value: stats.upcomingAppointments ?? 0,
      icon: CalendarCheck2,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{labels.title}</h1>
        <p className="mt-2 text-muted-foreground">{labels.description}</p>
      </header>

      {hasLoadError && (
        <p
          role="status"
          className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          {labels.loadError}
        </p>
      )}

      <section
        aria-label={labels.title}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {cards.map(({ label, value, icon: Icon, showSpecialityChart }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">
                  {loading ? "-" : value.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                {showSpecialityChart && (
                  <Popover
                    open={doctorBreakdownOpen}
                    onOpenChange={setDoctorBreakdownOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={labels.doctorsBySpeciality}
                        title={labels.doctorsBySpeciality}
                        className="h-8 w-8"
                        onMouseEnter={() => {
                          clearPopoverClose();
                          setDoctorBreakdownOpen(true);
                        }}
                        onMouseLeave={schedulePopoverClose}
                      >
                        <PieChartIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="start"
                      className="w-[min(22rem,calc(100vw-2rem))]"
                      onMouseEnter={clearPopoverClose}
                      onMouseLeave={schedulePopoverClose}
                    >
                      <h2 className="mb-3 text-sm font-semibold">
                        {labels.doctorsBySpeciality}
                      </h2>
                      {stats.doctorsBySpeciality.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {labels.noDoctorSpecialities}
                        </p>
                      ) : (
                        <>
                          <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <defs>
                                  {stats.doctorsBySpeciality
                                    .filter((item) => item.doctors > 0)
                                    .map((item) => {
                                      const [startColor, endColor] =
                                        getChartColors(item.specialityId);

                                      return (
                                        <linearGradient
                                          key={item.specialityId}
                                          id={getChartGradientId(
                                            item.specialityId,
                                          )}
                                          x1="0"
                                          y1="0"
                                          x2="1"
                                          y2="1"
                                        >
                                          <stop
                                            offset="0%"
                                            stopColor={startColor}
                                          />
                                          <stop
                                            offset="100%"
                                            stopColor={endColor}
                                          />
                                        </linearGradient>
                                      );
                                    })}
                                </defs>
                                <Pie
                                  data={stats.doctorsBySpeciality.filter(
                                    (item) => item.doctors > 0,
                                  )}
                                  dataKey="doctors"
                                  nameKey="name"
                                  innerRadius={42}
                                  outerRadius={68}
                                  paddingAngle={2}
                                >
                                  {stats.doctorsBySpeciality
                                    .filter((item) => item.doctors > 0)
                                    .map((item, index) => (
                                      <Cell
                                        key={item.specialityId}
                                        fill={getChartGradientFill(
                                          item.specialityId,
                                        )}
                                      />
                                    ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value, name) => [value, name]}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
                            {stats.doctorsBySpeciality.map((item, index) => (
                              <li
                                key={item.specialityId}
                                className="flex items-center justify-between gap-3"
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{
                                      backgroundImage: getChartGradientStyle(
                                        item.specialityId,
                                      ),
                                    }}
                                    aria-hidden="true"
                                  />
                                  <span className="truncate">
                                    {getSpecialityName(item.specialityId)}
                                  </span>
                                </span>
                                <span className="shrink-0 font-medium tabular-nums">
                                  {item.doctors}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{labels.appointmentsByMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="h-72 w-full"
            role="img"
            aria-label={labels.appointmentsByMonth}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {t.common.loading}
              </div>
            ) : stats.appointmentsByMonth.every(
                (month) => month.appointments === 0,
              ) ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {labels.noAppointments}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.appointmentsByMonth}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonthLabel}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="appointments"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
