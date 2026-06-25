"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Send,
  Settings,
} from "lucide-react";

// ─── Static mock data (no Math.random / Date.now) ───

const STATS = [
  {
    id: "users",
    labelEn: "Users",
    labelEs: "Usuarios",
    value: "2,847",
    change: "+12.5%",
    positive: true,
    icon: Users,
    gradient: "from-primary to-accent-blue",
  },
  {
    id: "sessions",
    labelEn: "Sessions",
    labelEs: "Sesiones",
    value: "18,432",
    change: "+8.2%",
    positive: true,
    icon: Activity,
    gradient: "from-accent-pink to-primary",
  },
  {
    id: "conversions",
    labelEn: "Conversions",
    labelEs: "Conversiones",
    value: "1,247",
    change: "+24.1%",
    positive: true,
    icon: TrendingUp,
    gradient: "from-accent-warm to-accent-pink",
  },
  {
    id: "revenue",
    labelEn: "Revenue",
    labelEs: "Ingresos",
    value: "$84,520",
    change: "-3.1%",
    positive: false,
    icon: DollarSign,
    gradient: "from-accent-blue to-primary",
  },
];

// Line chart data points (7 days, values 0-100)
const LINE_DATA = [35, 60, 45, 70, 55, 80, 65];
const LINE_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LINE_LABELS_ES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Bar chart data (5 categories, values 0-100)
const BAR_DATA = [65, 45, 80, 55, 70];
const BAR_LABELS_EN = ["Direct", "Social", "Email", "Organic", "Referral"];
const BAR_LABELS_ES = ["Directo", "Social", "Email", "Orgánico", "Referido"];

// Activity timeline
const ACTIVITIES = [
  {
    id: "a1",
    userEn: "Sarah Chen",
    userEs: "Sarah Chen",
    initials: "SC",
    actionEn: "created a new campaign",
    actionEs: "creó una nueva campaña",
    time: "10:42 AM",
    gradient: "from-primary to-accent-pink",
  },
  {
    id: "a2",
    userEn: "Marcus Rivera",
    userEs: "Marcus Rivera",
    initials: "MR",
    actionEn: "updated the billing settings",
    actionEs: "actualizó la configuración de facturación",
    time: "09:15 AM",
    gradient: "from-accent-pink to-accent-warm",
  },
  {
    id: "a3",
    userEn: "Elena Volkov",
    userEs: "Elena Volkov",
    initials: "EV",
    actionEn: "exported the monthly report",
    actionEs: "exportó el informe mensual",
    time: "Yesterday",
    gradient: "from-accent-blue to-primary",
  },
  {
    id: "a4",
    userEn: "James Park",
    userEs: "James Park",
    initials: "JP",
    actionEn: "invited 3 new team members",
    actionEs: "invitó a 3 nuevos miembros del equipo",
    time: "Yesterday",
    gradient: "from-accent-warm to-accent-pink",
  },
  {
    id: "a5",
    userEn: "Aisha Patel",
    userEs: "Aisha Patel",
    initials: "AP",
    actionEn: "deployed version 2.4.1",
    actionEs: "desplegó la versión 2.4.1",
    time: "2 days ago",
    gradient: "from-primary to-accent-blue",
  },
];

// ─── SVG Line Chart Component ───
function LineChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const width = 100;
  const height = 50;
  const padding = 5;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...data);
  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (val / maxVal) * chartHeight;
    return `${x},${y}`;
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M${p}` : `L${p}`))
    .join(" ");

  // Area fill path
  const areaD = `${pathD} L${padding + chartWidth},${padding + chartHeight} L${padding},${padding + chartHeight} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height + 12}`} className="w-full h-auto">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(124,58,237,0.25)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i / 3) * chartHeight}
            x2={padding + chartWidth}
            y2={padding + (i / 3) * chartHeight}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.3"
          />
        ))}

        {/* Area */}
        <path d={areaD} fill="url(#areaGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((val, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth;
          const y = padding + chartHeight - (val / maxVal) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill="#7C3AED"
              stroke="rgba(124,58,237,0.3)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* X-axis labels */}
        {labels.map((label, i) => {
          const x = padding + (i / (labels.length - 1)) * chartWidth;
          return (
            <text
              key={i}
              x={x}
              y={height + 8}
              textAnchor="middle"
              fill="rgba(232,224,255,0.3)"
              fontSize="3"
              fontFamily="inherit"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── CSS Bar Chart Component ───
function BarChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const maxVal = Math.max(...data);
  const barColors = [
    "from-primary to-accent-blue",
    "from-accent-pink to-primary",
    "from-accent-warm to-accent-pink",
    "from-accent-blue to-primary",
    "from-primary to-accent-pink",
  ];

  return (
    <div className="flex items-end gap-3 h-40 w-full px-2">
      {data.map((val, i) => {
        const heightPct = (val / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] text-base-content/40 font-medium">
              {val}%
            </span>
            <div className="w-full relative rounded-t-lg overflow-hidden bg-white/3" style={{ height: "120px" }}>
              <div
                className={`absolute bottom-0 w-full rounded-t-lg bg-linear-to-t ${barColors[i]} transition-all duration-500`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[9px] text-base-content/30 text-center leading-tight">
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard Content ───
export function DashboardContent() {
  const { language } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-12">
      {/* Page title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
          {language === "en" ? "Dashboard" : "Panel de Control"}
        </h1>
        <p className="text-base-content/40 text-sm mt-1">
          {language === "en"
            ? "Overview of your platform performance"
            : "Resumen del rendimiento de tu plataforma"}
        </p>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.id} className="p-5 sm:p-6 group hover:border-white/15 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.positive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-base-content mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-base-content/40">
                {language === "en" ? stat.labelEn : stat.labelEs}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* ─── Charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Line Chart */}
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-base-content">
                {language === "en" ? "Weekly Trend" : "Tendencia Semanal"}
              </h2>
              <p className="text-xs text-base-content/30 mt-0.5">
                {language === "en"
                  ? "User engagement over 7 days"
                  : "Engagement de usuarios en 7 días"}
              </p>
            </div>
            <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2.5 py-1 rounded-full">
              +18.2%
            </span>
          </div>
          <LineChart
            data={LINE_DATA}
            labels={language === "en" ? LINE_LABELS_EN : LINE_LABELS_ES}
          />
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-base-content">
                {language === "en"
                  ? "Traffic Sources"
                  : "Fuentes de Tráfico"}
              </h2>
              <p className="text-xs text-base-content/30 mt-0.5">
                {language === "en"
                  ? "Distribution by channel"
                  : "Distribución por canal"}
              </p>
            </div>
            <span className="text-xs text-accent-blue font-medium bg-accent-blue/10 px-2.5 py-1 rounded-full">
              5 {language === "en" ? "channels" : "canales"}
            </span>
          </div>
          <BarChart
            data={BAR_DATA}
            labels={language === "en" ? BAR_LABELS_EN : BAR_LABELS_ES}
          />
        </GlassCard>
      </div>

      {/* ─── Quick Actions + Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <GlassCard className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-base-content mb-5">
            {language === "en" ? "Quick Actions" : "Acciones Rápidas"}
          </h2>
          <div className="space-y-3">
            <GlowButton className="w-full flex items-center justify-center gap-2 py-2.5 text-xs">
              <Plus size={15} />
              {language === "en" ? "New Campaign" : "Nueva Campaña"}
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Download size={15} />
              {language === "en" ? "Export Report" : "Exportar Informe"}
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Send size={15} />
              {language === "en" ? "Send Invitations" : "Enviar Invitaciones"}
            </GlowButton>
            <GlowButton
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Settings size={15} />
              {language === "en" ? "App Settings" : "Configuración"}
            </GlowButton>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-base-content">
              {language === "en" ? "Recent Activity" : "Actividad Reciente"}
            </h2>
            <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer">
              {language === "en" ? "View All" : "Ver Todo"}
            </button>
          </div>
          <div className="space-y-1">
            {ACTIVITIES.map((activity, idx) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
              >
                {/* Timeline indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-linear-to-br ${activity.gradient} flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {activity.initials}
                  </div>
                  {idx < ACTIVITIES.length - 1 && (
                    <div className="w-px h-6 bg-white/5 mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-base-content/80">
                    <span className="font-medium text-base-content">
                      {language === "en"
                        ? activity.userEn
                        : activity.userEs}
                    </span>{" "}
                    {language === "en"
                      ? activity.actionEn
                      : activity.actionEs}
                  </p>
                  <p className="text-xs text-base-content/30 mt-0.5">
                    {language === "en"
                      ? activity.time
                      : activity.time === "Yesterday"
                        ? "Ayer"
                        : activity.time === "2 days ago"
                          ? "Hace 2 días"
                          : activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
