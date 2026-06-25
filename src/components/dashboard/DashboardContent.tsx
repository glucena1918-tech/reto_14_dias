"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserProfile } from "@/context/UserProfileContext";
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
  X,
  CheckCircle,
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
            className="stroke-base-content/5"
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
              className="fill-base-content/30"
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
            <div className="w-full relative rounded-t-lg overflow-hidden bg-base-content/[0.03]" style={{ height: "120px" }}>
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
  const { profile } = useUserProfile();

  // State variables for quick actions and activity stream
  const [activeModal, setActiveModal] = useState<"campaign" | "export" | "invitations" | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [activities, setActivities] = useState(ACTIVITIES);

  // Form states
  const [campaignName, setCampaignName] = useState("");
  const [campaignChannel, setCampaignChannel] = useState("Email");
  const [campaignAudience, setCampaignAudience] = useState("Todos");
  const [isSubmittingCampaign, setIsSubmittingCampaign] = useState(false);

  const [exportRange, setExportRange] = useState("7days");
  const [exportType, setExportType] = useState("general");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("Miembro");
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
            <GlassCard key={stat.id} className="p-5 sm:p-6 group hover:border-base-content/10 transition-all duration-300">
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
            <GlowButton
              onClick={() => setActiveModal("campaign")}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Plus size={15} />
              {language === "en" ? "New Campaign" : "Nueva Campaña"}
            </GlowButton>
            <GlowButton
              variant="ghost"
              onClick={() => setActiveModal("export")}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Download size={15} />
              {language === "en" ? "Export Report" : "Exportar Informe"}
            </GlowButton>
            <GlowButton
              variant="ghost"
              onClick={() => setActiveModal("invitations")}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs"
            >
              <Send size={15} />
              {language === "en" ? "Send Invitations" : "Enviar Invitaciones"}
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
            {activities.map((activity, idx) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 py-3 border-b border-base-content/5 last:border-0"
              >
                {/* Timeline indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-linear-to-br ${activity.gradient} flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {activity.initials}
                  </div>
                  {idx < activities.length - 1 && (
                    <div className="w-px h-6 bg-base-content/5 mt-1" />
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 shadow-2xl bg-base-300/80 backdrop-blur-xl animate-fade-in animate-pulse-glow">
          <CheckCircle className="text-green-400 w-5 h-5 shrink-0" />
          <span className="text-sm font-medium text-base-content">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-base-content/40 hover:text-base-content/75 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ─── Modals ─── */}
      {activeModal === "campaign" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 sm:p-8 relative animate-fade-in">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-base-content/40 hover:text-base-content/70 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold gradient-text mb-6">
              {language === "en" ? "Create New Campaign" : "Crear Nueva Campaña"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!campaignName.trim()) return;
                setIsSubmittingCampaign(true);
                setTimeout(() => {
                  const newAct = {
                    id: `a-${Date.now()}`,
                    userEn: profile.userName || "Admin",
                    userEs: profile.userName || "Admin",
                    initials: profile.userInitials || "AD",
                    actionEn: `created campaign "${campaignName}" (${campaignChannel})`,
                    actionEs: `creó la campaña "${campaignName}" (${campaignChannel})`,
                    time: language === "en" ? "Just now" : "Ahora mismo",
                    gradient: "from-primary to-accent-pink",
                  };
                  setActivities([newAct, ...activities]);
                  setToast({
                    message: language === "en"
                      ? `Campaign "${campaignName}" created successfully!`
                      : `¡Campaña "${campaignName}" creada con éxito!`,
                    type: "success",
                  });
                  setActiveModal(null);
                  setCampaignName("");
                  setIsSubmittingCampaign(false);
                }, 1200);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                  {language === "en" ? "Campaign Name" : "Nombre de la Campaña"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === "en" ? "Summer Sale 2026..." : "Oferta de Verano 2026..."}
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-base-content placeholder-base-content/30 glass-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                    {language === "en" ? "Channel" : "Canal"}
                  </label>
                  <select
                    value={campaignChannel}
                    onChange={(e) => setCampaignChannel(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-base-content bg-base-300 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none cursor-pointer"
                  >
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Push">Push</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                    {language === "en" ? "Target Audience" : "Audiencia Objetivo"}
                  </label>
                  <select
                    value={campaignAudience}
                    onChange={(e) => setCampaignAudience(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-base-content bg-base-300 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none cursor-pointer"
                  >
                    <option value="Todos">{language === "en" ? "All Users" : "Todos los usuarios"}</option>
                    <option value="Premium">{language === "en" ? "Premium Customers" : "Clientes Premium"}</option>
                    <option value="Inactivos">{language === "en" ? "Inactive Users" : "Usuarios inactivos"}</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <GlowButton type="submit" disabled={isSubmittingCampaign} className="w-full py-3">
                  {isSubmittingCampaign
                    ? (language === "en" ? "Creating..." : "Creando...")
                    : (language === "en" ? "Create Campaign" : "Crear Campaña")}
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {activeModal === "export" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 sm:p-8 relative animate-fade-in">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-base-content/40 hover:text-base-content/70 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold gradient-text mb-6">
              {language === "en" ? "Export Performance Report" : "Exportar Informe de Rendimiento"}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsExporting(true);

                // Prepare report data
                const reportTypeName = {
                  general: language === "en" ? "General Performance" : "Rendimiento General",
                  conversions: language === "en" ? "Conversions" : "Conversiones",
                  campaigns: language === "en" ? "Campaigns" : "Campañas",
                  billing: language === "en" ? "Billing" : "Facturación",
                }[exportType as "general" | "conversions" | "campaigns" | "billing"] || "Reporte";

                const dateRangeName = {
                  "7days": language === "en" ? "Last 7 Days" : "Últimos 7 días",
                  "30days": language === "en" ? "Last 30 Days" : "Últimos 30 días",
                  "month": language === "en" ? "This Month" : "Este Mes",
                }[exportRange as "7days" | "30days" | "month"] || exportRange;

                const reportData = [
                  { Metrica: language === "en" ? "Users" : "Usuarios", Valor: "2,847", Cambio: "+12.5%" },
                  { Metrica: language === "en" ? "Sessions" : "Sesiones", Valor: "18,432", Cambio: "+8.2%" },
                  { Metrica: language === "en" ? "Conversions" : "Conversiones", Valor: "1,247", Cambio: "+24.1%" },
                  { Metrica: language === "en" ? "Revenue" : "Ingresos", Valor: "$84,520", Cambio: "-3.1%" }
                ];

                try {
                  if (exportFormat === "pdf") {
                    const { jsPDF } = await import("jspdf");
                    const doc = new jsPDF();

                    // Header styling
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(20);
                    doc.setTextColor(124, 58, 237); // Primary (#7C3AED)
                    doc.text(reportTypeName, 14, 20);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text(`${language === "en" ? "Range" : "Rango"}: ${dateRangeName}`, 14, 28);
                    doc.text(`${language === "en" ? "Generated" : "Generado"}: ${new Date().toLocaleString()}`, 14, 34);

                    doc.setDrawColor(220);
                    doc.line(14, 40, 196, 40);

                    // Table headers
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    doc.setTextColor(0);
                    doc.text(language === "en" ? "Metric" : "Métrica", 14, 50);
                    doc.text(language === "en" ? "Value" : "Valor", 100, 50);
                    doc.text(language === "en" ? "Change" : "Cambio", 160, 50);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    let y = 60;
                    reportData.forEach(row => {
                      doc.text(row.Metrica, 14, y);
                      doc.text(row.Valor, 100, y);
                      doc.text(row.Cambio, 160, y);
                      doc.line(14, y + 2, 196, y + 2);
                      y += 12;
                    });

                    doc.save(`reporte_${exportType}_${exportRange}.pdf`);
                  } else if (exportFormat === "excel") {
                    const XLSX = await import("xlsx");
                    const wsData = [
                      [language === "en" ? "Report" : "Reporte", reportTypeName],
                      [language === "en" ? "Date Range" : "Rango de Fechas", dateRangeName],
                      [language === "en" ? "Generation Date" : "Fecha de Generación", new Date().toLocaleString()],
                      [],
                      [language === "en" ? "Metric" : "Métrica", language === "en" ? "Value" : "Valor", language === "en" ? "Change" : "Cambio"],
                      ...reportData.map(r => [r.Metrica, r.Valor, r.Cambio])
                    ];
                    const ws = XLSX.utils.aoa_to_sheet(wsData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Summary");
                    XLSX.writeFile(wb, `reporte_${exportType}_${exportRange}.xlsx`);
                  } else {
                    // CSV format with UTF-8 BOM to prevent character corruption
                    const bom = "\uFEFF";
                    let csvContent = bom + `${language === "en" ? "Metric" : "Métrica"};${language === "en" ? "Value" : "Valor"};${language === "en" ? "Change" : "Cambio"}\n`;
                    reportData.forEach(row => {
                      csvContent += `${row.Metrica};${row.Valor};${row.Cambio}\n`;
                    });
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `reporte_${exportType}_${exportRange}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }

                  const newAct = {
                    id: `a-${Date.now()}`,
                    userEn: profile.userName || "Admin",
                    userEs: profile.userName || "Admin",
                    initials: profile.userInitials || "AD",
                    actionEn: `exported ${reportTypeName} report`,
                    actionEs: `exportó el informe de ${reportTypeName}`,
                    time: language === "en" ? "Just now" : "Ahora mismo",
                    gradient: "from-accent-blue to-primary",
                  };
                  setActivities([newAct, ...activities]);
                  setToast({
                    message: language === "en"
                      ? "Report generated and downloaded!"
                      : "¡Informe generado y descargado!",
                    type: "success",
                  });
                } catch (error) {
                  console.error("Export error:", error);
                  setToast({
                    message: language === "en" ? "Error exporting report" : "Error al exportar el informe",
                    type: "error",
                  });
                } finally {
                  setActiveModal(null);
                  setIsExporting(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                  {language === "en" ? "Report Type" : "Tipo de Informe"}
                </label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-full px-3 py-3 text-sm text-base-content bg-base-300 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none cursor-pointer"
                >
                  <option value="general">{language === "en" ? "General Performance" : "Rendimiento General"}</option>
                  <option value="conversions">{language === "en" ? "Conversions" : "Conversiones"}</option>
                  <option value="campaigns">{language === "en" ? "Campañas" : "Campañas"}</option>
                  <option value="billing">{language === "en" ? "Facturación y Recibos" : "Facturación y Recibos"}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                    {language === "en" ? "Date Range" : "Rango de Fechas"}
                  </label>
                  <select
                    value={exportRange}
                    onChange={(e) => setExportRange(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-base-content bg-base-300 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none cursor-pointer"
                  >
                    <option value="7days">{language === "en" ? "Last 7 Days" : "Últimos 7 días"}</option>
                    <option value="30days">{language === "en" ? "Last 30 Days" : "Últimos 30 días"}</option>
                    <option value="month">{language === "en" ? "This Month" : "Este Mes"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                    {language === "en" ? "Format" : "Formato"}
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-base-content bg-base-300 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none cursor-pointer"
                  >
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel (XLSX)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <GlowButton type="submit" disabled={isExporting} className="w-full py-3">
                  {isExporting
                    ? (language === "en" ? "Generating..." : "Generando...")
                    : (language === "en" ? "Export Report" : "Exportar Informe")}
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {activeModal === "invitations" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 sm:p-8 relative animate-scale-in">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-base-content/40 hover:text-base-content/70 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold gradient-text mb-6">
              {language === "en" ? "Invite Team Members" : "Invitar Miembros al Equipo"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inviteEmails.trim()) return;
                setIsSendingInvites(true);
                setTimeout(() => {
                  const emails = inviteEmails.split(",").map(e => e.trim()).filter(Boolean);
                  const count = emails.length || 1;

                  const newAct = {
                    id: `a-${Date.now()}`,
                    userEn: profile.userName || "Admin",
                    userEs: profile.userName || "Admin",
                    initials: profile.userInitials || "AD",
                    actionEn: `invited ${count} new member(s) as ${inviteRole}`,
                    actionEs: `invitó a ${count} nuevo(s) miembro(s) como ${inviteRole}`,
                    time: language === "en" ? "Just now" : "Ahora mismo",
                    gradient: "from-accent-warm to-accent-pink",
                  };
                  setActivities([newAct, ...activities]);
                  setToast({
                    message: language === "en"
                      ? `Sent ${count} invitation(s) successfully!`
                      : `¡Se enviaron ${count} invitación(es) con éxito!`,
                    type: "success",
                  });
                  setActiveModal(null);
                  setInviteEmails("");
                  setIsSendingInvites(false);
                }, 1200);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                  {language === "en" ? "Email Addresses" : "Correos Electrónicos"}
                </label>
                <textarea
                  required
                  placeholder={language === "en" ? "email1@example.com, email2@example.com..." : "correo1@ejemplo.com, correo2@ejemplo.com..."}
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-base-content placeholder-base-content/30 glass-input resize-none focus:outline-none"
                />
                <p className="text-[10px] text-base-content/40 mt-1">
                  {language === "en" ? "Separate multiple emails with commas" : "Separa múltiples correos con comas"}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">
                  {language === "en" ? "Role" : "Rol asignado"}
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-3 text-sm text-base-content bg-base-300 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none cursor-pointer"
                >
                  <option value="Miembro">{language === "en" ? "Member" : "Miembro"}</option>
                  <option value="Administrador">{language === "en" ? "Admin" : "Administrador"}</option>
                  <option value="Visualizador">{language === "en" ? "Viewer" : "Visualizador"}</option>
                </select>
              </div>
              <div className="pt-4">
                <GlowButton type="submit" disabled={isSendingInvites} className="w-full py-3">
                  {isSendingInvites
                    ? (language === "en" ? "Sending..." : "Enviando...")
                    : (language === "en" ? "Send Invitations" : "Enviar Invitaciones")}
                </GlowButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
