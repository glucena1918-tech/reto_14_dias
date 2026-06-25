"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/components/ui/ToastProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Zap,
  Crown,
  Rocket,
  Check,
  X as XIcon,
  ChevronDown,
  CreditCard,
  Users,
  AppWindow,
  Headphones,
  Shield,
  Globe,
  HardDrive,
  RefreshCw,
} from "lucide-react";

// ── Tipos ──
type PlanId = "basic" | "intermediate" | "pro";

interface Plan {
  id: PlanId;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
  priceMonthly: number;
  priceYearly: number;
  icon: typeof Zap;
  color: string;
  glowClass: string;
  featuresEn: string[];
  featuresEs: string[];
  popular?: boolean;
  premium?: boolean;
  appsLimit: number | null; // null = ilimitado
  usersLimit: number | null;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    nameEn: "Basic",
    nameEs: "Básico",
    descEn: "Perfect for getting started with micro-apps",
    descEs: "Perfecto para empezar con micro-apps",
    priceMonthly: 9,
    priceYearly: 7,
    icon: Zap,
    color: "text-accent-blue",
    glowClass: "border-accent-blue/20 hover:border-accent-blue/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]",
    featuresEn: ["5 micro-apps", "1 user", "Standard support", "5 GB storage", "Basic analytics"],
    featuresEs: ["5 micro-apps", "1 usuario", "Soporte estándar", "5 GB almacenamiento", "Analíticas básicas"],
    appsLimit: 5,
    usersLimit: 1,
  },
  {
    id: "intermediate",
    nameEn: "Intermediate",
    nameEs: "Intermedio",
    descEn: "For growing teams that need more power",
    descEs: "Para equipos en crecimiento que necesitan más poder",
    priceMonthly: 19,
    priceYearly: 15,
    icon: Crown,
    color: "text-primary",
    glowClass: "border-primary/20 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]",
    featuresEn: ["10 micro-apps", "5 users", "Priority support", "25 GB storage", "Advanced analytics", "API access"],
    featuresEs: ["10 micro-apps", "5 usuarios", "Soporte prioritario", "25 GB almacenamiento", "Analíticas avanzadas", "Acceso a API"],
    popular: true,
    appsLimit: 10,
    usersLimit: 5,
  },
  {
    id: "pro",
    nameEn: "Pro",
    nameEs: "Pro",
    descEn: "Unlimited power for professional teams",
    descEs: "Poder ilimitado para equipos profesionales",
    priceMonthly: 49,
    priceYearly: 39,
    icon: Rocket,
    color: "text-accent-pink",
    glowClass: "border-accent-pink/20 hover:border-accent-pink/40 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]",
    featuresEn: [
      "Unlimited micro-apps",
      "Unlimited users",
      "24/7 dedicated support",
      "Unlimited storage",
      "Custom analytics",
      "Full API access",
      "Custom integrations",
    ],
    featuresEs: [
      "Micro-apps ilimitadas",
      "Usuarios ilimitados",
      "Soporte dedicado 24/7",
      "Almacenamiento ilimitado",
      "Analíticas personalizadas",
      "Acceso completo a API",
      "Integraciones personalizadas",
    ],
    premium: true,
    appsLimit: null,
    usersLimit: null,
  },
];

// ── Tabla de comparación ──
interface ComparisonRow {
  featureEn: string;
  featureEs: string;
  icon: typeof Zap;
  basic: string | boolean;
  intermediate: string | boolean;
  pro: string | boolean;
}

const COMPARISON: ComparisonRow[] = [
  { featureEn: "Micro-apps", featureEs: "Micro-apps", icon: AppWindow, basic: "5", intermediate: "10", pro: "∞" },
  { featureEn: "Team members", featureEs: "Miembros del equipo", icon: Users, basic: "1", intermediate: "5", pro: "∞" },
  { featureEn: "Storage", featureEs: "Almacenamiento", icon: HardDrive, basic: "5 GB", intermediate: "25 GB", pro: "∞" },
  { featureEn: "API access", featureEs: "Acceso a API", icon: Globe, basic: false, intermediate: true, pro: true },
  { featureEn: "Priority support", featureEs: "Soporte prioritario", icon: Headphones, basic: false, intermediate: true, pro: true },
  { featureEn: "Custom integrations", featureEs: "Integraciones personalizadas", icon: RefreshCw, basic: false, intermediate: false, pro: true },
  { featureEn: "Advanced security", featureEs: "Seguridad avanzada", icon: Shield, basic: false, intermediate: true, pro: true },
];

// ── FAQs ──
interface FAQ {
  questionEn: string;
  questionEs: string;
  answerEn: string;
  answerEs: string;
}

const FAQS: FAQ[] = [
  {
    questionEn: "Can I change my plan at any time?",
    questionEs: "¿Puedo cambiar mi plan en cualquier momento?",
    answerEn: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and your billing will be prorated.",
    answerEs: "¡Sí! Puedes subir o bajar de plan en cualquier momento. Los cambios se aplican de inmediato y la facturación se prorratea.",
  },
  {
    questionEn: "What is your refund policy?",
    questionEs: "¿Cuál es su política de reembolso?",
    answerEn: "We offer a 30-day money-back guarantee for all plans. If you're not satisfied, contact our support team for a full refund.",
    answerEs: "Ofrecemos una garantía de devolución de dinero de 30 días para todos los planes. Si no estás satisfecho, contacta a nuestro equipo de soporte para un reembolso completo.",
  },
  {
    questionEn: "Do you offer self-hosting options?",
    questionEs: "¿Ofrecen opciones de auto-alojamiento (self-hosting)?",
    answerEn: "Yes, our Pro plan includes the option for self-hosting. Contact our sales team for more information about on-premise deployment.",
    answerEs: "Sí, nuestro plan Pro incluye la opción de auto-alojamiento. Contacta a nuestro equipo de ventas para más información sobre despliegue on-premise.",
  },
  {
    questionEn: "What happens when I reach my app limit?",
    questionEs: "¿Qué sucede cuando alcanzo mi límite de apps?",
    answerEn: "You'll receive a notification when you're close to your limit. You can upgrade your plan to unlock more micro-apps instantly.",
    answerEs: "Recibirás una notificación cuando estés cerca de tu límite. Puedes actualizar tu plan para desbloquear más micro-apps al instante.",
  },
  {
    questionEn: "Do you have custom plans for larger organizations?",
    questionEs: "¿Tienen planes personalizados para organizaciones grandes?",
    answerEn: "Absolutely! Contact us at enterprise@microapps.com for custom pricing and tailored solutions for your organization's needs.",
    answerEs: "¡Por supuesto! Contáctanos en enterprise@microapps.com para precios personalizados y soluciones a medida para las necesidades de tu organización.",
  },
];

const STORAGE_KEY = "selectedPlan";

export default function BillingPage() {
  const { language } = useTranslation();
  const { toast } = useToast();
  const isEn = language === "en";

  const [yearly, setYearly] = useState(false);
  const [activePlan, setActivePlan] = useState<PlanId>("basic");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Leer plan seleccionado del localStorage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "basic" || stored === "intermediate" || stored === "pro") {
      setActivePlan(stored);
    }
  }, []);

  const handleSelectPlan = (planId: PlanId) => {
    setActivePlan(planId);
    localStorage.setItem(STORAGE_KEY, planId);
    const plan = PLANS.find((p) => p.id === planId)!;
    toast({
      title: isEn
        ? `Switched to ${plan.nameEn} plan!`
        : `¡Cambiaste al plan ${plan.nameEs}!`,
      type: "success",
    });
  };

  const currentPlan = PLANS.find((p) => p.id === activePlan)!;
  const CurrentIcon = currentPlan.icon;

  // Datos de simulación
  const appsUsed = 3;
  const renewalDate = isEn ? "July 25, 2026" : "25 de julio de 2026";

  if (!mounted) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 pb-16">
      {/* ── Título ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
          {isEn ? "Plans & Billing" : "Planes y Facturación"}
        </h1>
        <p className="text-base-content/40 text-sm mt-1">
          {isEn
            ? "Manage your subscription and billing preferences"
            : "Administra tu suscripción y preferencias de facturación"}
        </p>
      </div>

      {/* ── Tarjeta de Plan Actual ── */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="relative p-6 sm:p-8">
          {/* Fondo gradiente sutil */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.08) 50%, rgba(56,189,248,0.05) 100%)",
            }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Izquierda */}
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  activePlan === "pro"
                    ? "bg-accent-pink/15"
                    : activePlan === "intermediate"
                      ? "bg-primary/15"
                      : "bg-accent-blue/15"
                }`}
              >
                <CurrentIcon
                  size={28}
                  className={currentPlan.color}
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-base-content/30 mb-0.5">
                  {isEn ? "Current Plan" : "Plan Actual"}
                </p>
                <h2 className="text-xl font-bold text-base-content">
                  {isEn ? currentPlan.nameEn : currentPlan.nameEs}
                </h2>
                <p className="text-sm text-base-content/40 mt-0.5">
                  {isEn ? "Renews on" : "Se renueva el"} {renewalDate}
                </p>
              </div>
            </div>

            {/* Derecha — uso de apps */}
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-base-content/50">
                  {isEn ? "Apps used" : "Apps usadas"}
                </span>
                <span className="text-xs font-semibold text-base-content/70">
                  {appsUsed} / {currentPlan.appsLimit ?? "∞"}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: currentPlan.appsLimit
                      ? `${Math.min((appsUsed / currentPlan.appsLimit) * 100, 100)}%`
                      : "15%",
                    background: "linear-gradient(90deg, #7C3AED, #EC4899)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Toggle Mensual / Anual ── */}
      <div className="flex items-center justify-center gap-4">
        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            !yearly ? "text-base-content" : "text-base-content/40"
          }`}
        >
          {isEn ? "Monthly" : "Mensual"}
        </span>

        <button
          onClick={() => setYearly(!yearly)}
          className="relative w-14 h-7 rounded-full bg-white/5 border border-white/10 transition-colors duration-300 cursor-pointer"
          aria-label={isEn ? "Toggle billing period" : "Cambiar período de facturación"}
        >
          <div
            className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 ${
              yearly
                ? "left-[calc(100%-1.625rem)] bg-primary shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                : "left-0.5 bg-base-content/60"
            }`}
          />
        </button>

        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            yearly ? "text-base-content" : "text-base-content/40"
          }`}
        >
          {isEn ? "Yearly" : "Anual"}
        </span>

        {/* Badge de descuento */}
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-300 ${
            yearly
              ? "bg-primary/15 text-primary border border-primary/20"
              : "bg-white/5 text-base-content/30 border border-white/5"
          }`}
        >
          {isEn ? "20% OFF" : "20% DESC."}
        </span>
      </div>

      {/* ── Cuadrícula de Planes ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isActive = activePlan === plan.id;
          const price = yearly ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border transition-all duration-500 ${
                plan.premium
                  ? "bg-gradient-to-br from-accent-pink/5 via-primary/5 to-transparent"
                  : ""
              } ${plan.glowClass} ${
                isActive
                  ? "ring-2 ring-primary/50 shadow-[0_0_40px_rgba(124,58,237,0.15)]"
                  : "border-white/8"
              }`}
              style={{
                background: plan.premium
                  ? undefined
                  : "rgba(255,255,255,0.02)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Etiqueta "Más Popular" */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                    {isEn ? "Most Popular" : "Más Popular"}
                  </span>
                </div>
              )}

              {/* Etiqueta "Plan Actual" */}
              {isActive && (
                <div className="absolute -top-3 right-4 z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                    {isEn ? "Active" : "Activo"}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Cabecera del plan */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.id === "pro"
                        ? "bg-accent-pink/15"
                        : plan.id === "intermediate"
                          ? "bg-primary/15"
                          : "bg-accent-blue/15"
                    }`}
                  >
                    <Icon size={20} className={plan.color} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-base-content">
                      {isEn ? plan.nameEn : plan.nameEs}
                    </h3>
                    <p className="text-xs text-base-content/40">
                      {isEn ? plan.descEn : plan.descEs}
                    </p>
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-base-content">
                      ${price}
                    </span>
                    <span className="text-sm text-base-content/40 mb-1">
                      / {isEn ? "mo" : "mes"}
                    </span>
                  </div>
                  {yearly && (
                    <p className="text-xs text-base-content/30 mt-1">
                      {isEn
                        ? `$${price * 12}/year — save $${(plan.priceMonthly - plan.priceYearly) * 12}/yr`
                        : `$${price * 12}/año — ahorras $${(plan.priceMonthly - plan.priceYearly) * 12}/año`}
                    </p>
                  )}
                </div>

                {/* Lista de features */}
                <ul className="space-y-3 mb-8">
                  {(isEn ? plan.featuresEn : plan.featuresEs).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-base-content/70">
                      <Check size={15} className={plan.color + " shrink-0"} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Botón */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isActive}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${
                    isActive
                      ? "bg-white/5 text-base-content/30 border border-white/5"
                      : plan.premium
                        ? "bg-linear-to-r from-primary via-accent-pink to-accent-warm text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                        : plan.popular
                          ? "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-white/5 border border-white/10 text-base-content hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isActive
                    ? isEn
                      ? "Current Plan"
                      : "Plan Actual"
                    : isEn
                      ? "Choose Plan"
                      : "Elegir Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabla de Comparación ── */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-base-content">
            {isEn ? "Feature Comparison" : "Comparación de Características"}
          </h2>
          <p className="text-xs text-base-content/40 mt-1">
            {isEn
              ? "See what each plan includes"
              : "Mira lo que incluye cada plan"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 sm:px-8 py-4 text-xs font-semibold text-base-content/40 uppercase tracking-wider">
                  {isEn ? "Feature" : "Característica"}
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    className="px-4 py-4 text-center text-xs font-semibold text-base-content/40 uppercase tracking-wider"
                  >
                    {isEn ? plan.nameEn : plan.nameEs}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => {
                const RowIcon = row.icon;
                return (
                  <tr
                    key={i}
                    className="border-b border-white/3 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 sm:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <RowIcon size={15} className="text-base-content/30 shrink-0" />
                        <span className="text-sm text-base-content/70">
                          {isEn ? row.featureEn : row.featureEs}
                        </span>
                      </div>
                    </td>
                    {(["basic", "intermediate", "pro"] as const).map((planId) => {
                      const val = row[planId];
                      return (
                        <td key={planId} className="px-4 py-4 text-center">
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check size={16} className="text-green-400 mx-auto" />
                            ) : (
                              <XIcon size={16} className="text-base-content/15 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-base-content/60">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Preguntas Frecuentes (FAQs) ── */}
      <div>
        <h2 className="text-lg font-bold text-base-content mb-1">
          {isEn ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
        </h2>
        <p className="text-xs text-base-content/40 mb-6">
          {isEn
            ? "Have questions? We've got answers."
            : "¿Tienes preguntas? Tenemos respuestas."}
        </p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="glass-card !rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left cursor-pointer group"
                >
                  <span className="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors pr-4">
                    {isEn ? faq.questionEn : faq.questionEs}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-base-content/30 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 sm:px-6 pb-5 text-sm text-base-content/50 leading-relaxed">
                    {isEn ? faq.answerEn : faq.answerEs}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTA de contacto ── */}
      <GlassCard className="p-6 sm:p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <CreditCard size={20} className="text-primary" />
          <h3 className="text-base font-bold text-base-content">
            {isEn ? "Need a custom plan?" : "¿Necesitas un plan personalizado?"}
          </h3>
        </div>
        <p className="text-sm text-base-content/40 max-w-md mx-auto mb-5">
          {isEn
            ? "Contact our sales team for enterprise pricing and custom solutions tailored to your organization."
            : "Contacta a nuestro equipo de ventas para precios empresariales y soluciones personalizadas para tu organización."}
        </p>
        <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-base-content hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
          {isEn ? "Contact Sales" : "Contactar Ventas"}
        </button>
      </GlassCard>
    </div>
  );
}
