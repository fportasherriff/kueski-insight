import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "EN" | "ES";

interface Translations {
  [key: string]: { EN: string; ES: string };
}

export const translations: Translations = {
  dashboard: { EN: "Dashboard", ES: "Tablero" },
  presentation: { EN: "Presentation", ES: "Presentación" },
  askData: { EN: "Ask the Data", ES: "Consultar Datos" },
  roadmap: { EN: "Roadmap", ES: "Hoja de Ruta" },
  loading: { EN: "Loading...", ES: "Cargando..." },
  overallConversion: { EN: "Overall Conversion", ES: "Conversión Total" },
  onboardingRate: { EN: "Onboarding Rate", ES: "Tasa de Onboarding" },
  cartPurchase: { EN: "Cart to Purchase", ES: "Carrito a Compra" },
  bestWorstSegment: { EN: "Best vs Worst Segment", ES: "Brecha de Segmentos" },
  funnelOverview: { EN: "Funnel Overview", ES: "Resumen del Funnel" },
  monthlyTrends: { EN: "Monthly Trends", ES: "Tendencias Mensuales" },
  segmentBreakdown: { EN: "Segment Breakdown", ES: "Desglose por Segmento" },
  segmentSubtitle: {
    EN: "Overall conversion rate per group — bars show % of each group that purchased",
    ES: "Tasa de conversión por grupo — las barras muestran % del grupo que compró",
  },
  hypothesisValidation: { EN: "Hypothesis Validation", ES: "Validación de Hipótesis" },
  actionRoadmap: { EN: "Action Roadmap", ES: "Hoja de Ruta de Acción" },
  experimentDesign: { EN: "Experiment Design", ES: "Diseño de Experimento" },
  askPlaceholder: { EN: "Ask anything about the data...", ES: "Pregunta sobre los datos..." },
  send: { EN: "Send", ES: "Enviar" },
  confirmed: { EN: "Confirmed", ES: "Confirmado" },
  refuted: { EN: "Refuted", ES: "Refutado" },
  priority: { EN: "Priority", ES: "Prioridad" },
  reach: { EN: "Reach", ES: "Alcance" },
  impact: { EN: "Impact", ES: "Impacto" },
  confidence: { EN: "Confidence", ES: "Confianza" },
  effort: { EN: "Effort", ES: "Esfuerzo" },
  quarter: { EN: "Quarter", ES: "Trimestre" },
  langLabel: { EN: "Language / Idioma", ES: "Language / Idioma" },
  comingSoon: { EN: "Content coming in next iteration", ES: "Contenido en la próxima iteración" },

  // Dashboard header
  dashboardSubtitle: {
    EN: "BNPL Funnel · 100,000 users · Jan–Apr 2025",
    ES: "Funnel BNPL · 100,000 usuarios · Ene–Abr 2025",
  },
  exportCsv: { EN: "Export CSV", ES: "Exportar CSV" },

  // KPI subtexts
  kpiOverallSub: { EN: "10,408 purchases from 100K users", ES: "10,408 compras de 100K usuarios" },
  kpiOnboardingSub: { EN: "Biggest absolute drop in funnel", ES: "Mayor caída absoluta del funnel" },
  kpiCartSub: { EN: "Step 4 → Step 5 conversion", ES: "Conversión paso 4 → paso 5" },
  kpiSegmentSub: { EN: "22.6% (iOS 26-50) vs 0.6% (Web >50)", ES: "22.6% (iOS 26-50) vs 0.6% (Web >50)" },

  // Funnel
  conversionFunnel: { EN: "Conversion Funnel", ES: "Funnel de Conversión" },
  funnelSubtitle: { EN: "Step-by-step drop-off · 100,000 users", ES: "Caída paso a paso · 100,000 usuarios" },
  registered: { EN: "Registered", ES: "Registrados" },
  onboarded: { EN: "Onboarded", ES: "Onboarding completado" },
  viewedProduct: { EN: "Viewed Product", ES: "Vieron Producto" },
  addedToCart: { EN: "Added to Cart", ES: "Agregaron al Carrito" },
  purchased: { EN: "Purchased", ES: "Compraron" },
  usersDropped: { EN: "users dropped", ES: "usuarios perdidos" },
  keyMetrics: { EN: "Key Metrics", ES: "Métricas Clave" },

  // Funnel insight
  funnelInsight: {
    EN: "💡 The biggest drop happens at Onboarding — 36,811 users (36.8%) never complete it.\n\nUsers 50+ are the main driver: only 39.5% complete onboarding vs 84.9% for under-25s.",
    ES: "💡 La mayor caída ocurre en Onboarding — 36,811 usuarios (36.8%) nunca lo completan.\n\nLos usuarios de 50+ son el principal factor: solo el 39.5% completa onboarding vs 84.9% en menores de 25.",
  },

  // Segment tabs
  age: { EN: "Age", ES: "Edad" },
  device: { EN: "Device", ES: "Dispositivo" },
  location: { EN: "Location", ES: "Región" },
  gender: { EN: "Gender", ES: "Género" },

  // Segment insights
  insightAge: {
    EN: "Users 50+ convert at 3.8% — 3.5× below the 26-50 cohort.",
    ES: "Los usuarios de 50+ convierten al 3.8% — 3.5× por debajo del cohorte 26-50.",
  },
  insightDevice: {
    EN: "Web converts at 2.6% — 7× below iOS. This gap is structural across all steps.",
    ES: "Web convierte al 2.6% — 7× por debajo de iOS. La brecha es estructural en todos los pasos.",
  },
  insightLocation: {
    EN: "Other regions stall at checkout: Cart→Purchase is 31.2% vs 50.6% in major cities.",
    ES: "Otras regiones se estancan en el checkout: Carrito→Compra es 31.2% vs 50.6% en ciudades principales.",
  },
  insightGender: {
    EN: "Non-binary users convert at 17% — 1.75× above Female/Male averages.",
    ES: "Usuarios no binarios convierten al 17% — 1.75× por encima del promedio Femenino/Masculino.",
  },

  // Monthly trend
  overall: { EN: "Overall", ES: "Total" },
  onboarding: { EN: "Onboarding", ES: "Onboarding" },
  cartToPurchase: { EN: "Cart→Purchase", ES: "Carrito→Compra" },
  trendInsight: {
    EN: "Funnel performance is stable across all 4 months — no seasonal effects detected.",
    ES: "El rendimiento del funnel es estable en los 4 meses — sin efectos estacionales detectados.",
  },

  // Heatmap
  heatmapTitle: { EN: "Age × Device Performance Matrix", ES: "Matriz Edad × Dispositivo" },
  heatmapSubtitle: {
    EN: "Overall conversion rate by segment combination",
    ES: "Tasa de conversión total por combinación de segmentos",
  },
  worst: { EN: "Worst", ES: "Peor" },
  best: { EN: "Best", ES: "Mejor" },
  heatmapInsight: {
    EN: "⚠ Critical: Users 50+ on Web convert at just 0.6% — 37× below the best-performing segment (iOS 26-50 at 22.6%).",
    ES: "⚠ Crítico: Los usuarios de 50+ en Web convierten al 0.6% — 37× por debajo del mejor segmento (iOS 26-50 al 22.6%).",
  },

  // Error
  errorLoadData: {
    EN: "Unable to load data. Please refresh the page.",
    ES: "No se pudieron cargar los datos. Por favor, recarga la página.",
  },

  // Presentation
  pres_prev: { EN: "Previous", ES: "Anterior" },
  pres_next: { EN: "Next", ES: "Siguiente" },
  pres_slideOf: { EN: "Slide", ES: "Diapositiva" },
  pres_of: { EN: "of", ES: "de" },
  pres_loading: { EN: "Loading presentation…", ES: "Cargando presentación…" },

  // Slide 1
  pres_s1_title: { EN: "BNPL Funnel Analysis", ES: "Análisis del Funnel BNPL" },
  pres_s1_subtitle: {
    EN: "Product Analytics Lead — Case Interview",
    ES: "Líder de Analítica de Producto — Caso de Entrevista",
  },
  pres_s1_dataset: {
    EN: "Dataset: 100,000 anonymized BNPL users · Mexico · Jan–Apr 2025",
    ES: "Dataset: 100,000 usuarios BNPL anonimizados · México · Ene–Abr 2025",
  },
  pres_s1_presented: { EN: "Presented by: Francisco Porta", ES: "Presentado por: Francisco Portas Herriff" },
  pres_s1_problem_title: { EN: "The Problem", ES: "El Problema" },
  pres_s1_problem_text: {
    EN: "The checkout funnel shows uneven performance across segments — age, device, location, and gender. The goal: identify where conversion breaks down, understand why, and deliver an executable action plan for next quarter.",
    ES: "El funnel de checkout muestra un rendimiento desigual entre segmentos — edad, dispositivo, ubicación y género. El objetivo: identificar dónde falla la conversión, entender por qué, y entregar un plan de acción ejecutable para el próximo trimestre.",
  },
  pres_s1_steps: { EN: "5 funnel steps", ES: "5 pasos del funnel" },
  pres_s1_dims: { EN: "4 dimensions analyzed", ES: "4 dimensiones analizadas" },
  pres_s1_initiatives: { EN: "3 actionable initiatives", ES: "3 iniciativas accionables" },
  pres_s1_experiment: { EN: "1 experiment designed", ES: "1 experimento diseñado" },

  // Slide 2
  pres_s2_title: { EN: "Where Does the Funnel Break?", ES: "¿Dónde se Rompe el Funnel?" },
  pres_s2_subtitle: { EN: "Task 1 — Segmented Funnel Diagnosis", ES: "Tarea 1 — Diagnóstico Segmentado del Funnel" },
  pres_s2_global: { EN: "Global Drop-offs", ES: "Caídas Globales" },
  pres_s2_damaging: { EN: "2 Most Damaging Combinations", ES: "2 Combinaciones más Dañinas" },
  pres_s2_gap: { EN: "Best vs Worst Gap", ES: "Brecha Mejor vs Peor" },
  pres_s2_overall_conv: { EN: "overall conversion", ES: "conversión total" },
  pres_s2_below_best: { EN: "pp below best segment", ES: "pp por debajo del mejor segmento" },
  pres_s2_gap_label: { EN: "gap between best and worst segment", ES: "brecha entre mejor y peor segmento" },
  pres_s2_best_label: { EN: "Best", ES: "Mejor" },
  pres_s2_worst_label: { EN: "Worst", ES: "Peor" },
  pres_s2_dropped: { EN: "users dropped", ES: "usuarios perdidos" },
  pres_s2_users: { EN: "users", ES: "usuarios" },
  pres_s2_of_base: { EN: "of total base", ES: "de la base total" },

  // Slide 3
  pres_s3_title: { EN: "3 Leading Indicators", ES: "3 Indicadores Líderes" },
  pres_s3_subtitle: {
    EN: "Task 1 — Metrics that best predict funnel health",
    ES: "Tarea 1 — Métricas que mejor predicen la salud del funnel",
  },
  pres_s3_why: { EN: "Why it matters", ES: "Por qué importa" },
  pres_s3_watch: { EN: "What to watch", ES: "Qué monitorear" },

  pres_s3_k1_name: { EN: "Onboarding Completion Rate by Age", ES: "Tasa de Onboarding Completado por Edad" },
  pres_s3_k1_why: {
    EN: "Predicts 30-day purchase likelihood. The 45pp gap between >50 and <25 is the single largest conversion lever in the funnel.",
    ES: "Predice la probabilidad de compra a 30 días. La brecha de 45pp entre >50 y <25 es la mayor palanca de conversión del funnel.",
  },
  pres_s3_k1_watch: { EN: "Target: bring >50 from 39.5% → 55%", ES: "Meta: llevar >50 de 39.5% → 55%" },
  pres_s3_k1_clarify: {
    EN: "(Of every 100 users over 50 who registered, only 39 completed onboarding. For under-25s, that same number is 84.)",
    ES: "(De cada 100 usuarios mayores de 50 que se registraron, solo 39 completaron onboarding. Para menores de 25, ese número es 84.)",
  },
  pres_s3_k1_parque: {
    EN: ">50 = 29.7% of the user base (29,685 users). If this rate reaches 55%, ~4,600 additional users enter the funnel.",
    ES: ">50 = 29.7% de la base de usuarios (29,685 usuarios). Si esta tasa llega al 55%, ~4,600 usuarios adicionales entran al funnel.",
  },

  pres_s3_k2_name: { EN: "Device Performance Ratio — All Platforms", ES: "Ratio de Rendimiento por Dispositivo — Todas las Plataformas" },
  pres_s3_k2_why: {
    EN: "Structural predictor of overall conversion. A 7× gap consistent across all 4 funnel steps signals platform-level debt, not UX friction.",
    ES: "Predictor estructural de la conversión total. Una brecha de 7× consistente en los 4 pasos del funnel señala deuda a nivel de plataforma, no fricción UX.",
  },
  pres_s3_k2_users: { EN: "users", ES: "usuarios" },
  pres_s3_k2_conv: { EN: "Conv %", ES: "Conv %" },
  pres_s3_k2_insight: {
    EN: "Android holds 50% of users — twice the iOS base — but converts at half the rate across every single funnel step. This makes Android the highest-impact opportunity.",
    ES: "Android tiene el 50% de los usuarios — el doble de iOS — pero convierte a la mitad de la tasa en cada paso del funnel. Esto hace de Android la oportunidad de mayor impacto.",
  },

  pres_s3_k3_name: { EN: "Cart → Purchase Rate: Other Regions", ES: "Tasa Carrito → Compra: Otras Regiones" },
  pres_s3_k3_why_v2: {
    EN: "The problem is isolated to a single step — Cart→Purchase. Every prior step is on par with major cities. This is a surgical intervention opportunity.",
    ES: "El problema está aislado en un solo paso — Carrito→Compra. Todos los pasos previos están a la par de las ciudades principales. Es una oportunidad de intervención quirúrgica.",
  },
  pres_s3_k3_watch: {
    EN: "Target: close to 42% Cart→Purch by EOQ3",
    ES: "Meta: acercarse al 42% Carrito→Compra para fin del Q3",
  },
  pres_s3_k3_step: { EN: "Step", ES: "Paso" },
  pres_s3_k3_cities: { EN: "Cities avg", ES: "Prom. ciudades" },
  pres_s3_k3_other: { EN: "Other", ES: "Otras" },
  pres_s3_k3_gap: { EN: "Gap", ES: "Brecha" },

  // Slide 4
  pres_s4_title: { EN: "3 Evidence-Based Hypotheses", ES: "3 Hipótesis Basadas en Evidencia" },
  pres_s4_subtitle: {
    EN: "Task 2 — Why do these segments underperform?",
    ES: "Tarea 2 — ¿Por qué estos segmentos tienen bajo rendimiento?",
  },
  pres_s4_evidence: { EN: "Evidence", ES: "Evidencia" },
  pres_s4_validate: { EN: "What would validate this", ES: "Qué validaría esto" },

  pres_s4_h1_title: {
    EN: "Onboarding complexity filters out >50 before they see product value",
    ES: "La complejidad del onboarding filtra a los >50 antes de que vean el valor del producto",
  },
  pres_s4_h1_evidence: {
    EN: ">50 Reg→Onb 39.5% vs <25 84.9% — 45pp gap, largest in funnel",
    ES: ">50 Reg→Onb 39.5% vs <25 84.9% — brecha de 45pp, la más grande del funnel",
  },
  pres_s4_h1_validate: {
    EN: "Session recordings at onboarding screens by age, form field error rates by age",
    ES: "Grabaciones de sesión en pantallas de onboarding por edad, tasas de error en campos por edad",
  },

  pres_s4_h2_title: {
    EN: "Web platform has structural performance debt and lacks mobile-native trust signals",
    ES: "La plataforma web tiene deuda estructural de rendimiento y carece de señales de confianza mobile-native",
  },
  pres_s4_h2_evidence: {
    EN: "Web 2.6% overall vs iOS 18.2% (7×) — gap is consistent at ALL 4 steps",
    ES: "Web 2.6% total vs iOS 18.2% (7×) — la brecha es consistente en los 4 pasos",
  },
  pres_s4_h2_validate: {
    EN: "Page load times web vs app, checkout error rates by device, abandon surveys",
    ES: "Tiempos de carga web vs app, tasas de error en checkout por dispositivo, encuestas de abandono",
  },

  pres_s4_h3_title: {
    EN: "Other regions face trust and logistics uncertainty at final checkout",
    ES: "Otras regiones enfrentan incertidumbre de confianza y logística en el checkout final",
  },
  pres_s4_h3_evidence: {
    EN: "Other regions Reg→Onb 63.2% (equal to cities) but Cart→Purch 31.2% vs 50.6%",
    ES: "Otras regiones Reg→Onb 63.2% (igual a ciudades) pero Carrito→Compra 31.2% vs 50.6%",
  },
  pres_s4_h3_validate: {
    EN: "Support tickets by region, post-abandon survey, delivery time by region",
    ES: "Tickets de soporte por región, encuesta post-abandono, tiempo de entrega por región",
  },

  // Slide 5
  pres_s5_title: { EN: "Action Roadmap — RICE Prioritization", ES: "Hoja de Ruta — Priorización RICE" },
  pres_s5_subtitle: {
    EN: "Task 3 — 3 initiatives for next quarter",
    ES: "Tarea 3 — 3 iniciativas para el próximo trimestre",
  },
  pres_s5_rice: { EN: "RICE Score", ES: "Puntaje RICE" },
  pres_s5_reach: { EN: "Reach", ES: "Alcance" },
  pres_s5_impact: { EN: "Impact", ES: "Impacto" },
  pres_s5_conf: { EN: "Conf", ES: "Conf" },
  pres_s5_effort: { EN: "Effort", ES: "Esfuerzo" },
  pres_s5_current_target: { EN: "Current → Target", ES: "Actual → Meta" },
  pres_s5_greenlight: { EN: "Green-light decision", ES: "Decisión de luz verde" },
  pres_s5_why_quarter: { EN: "Why this quarter", ES: "Por qué este trimestre" },

  // Slide 6
  pres_s6_title: { EN: "Experiment Design — A/B Test", ES: "Diseño de Experimento — Test A/B" },
  pres_s6_subtitle: {
    EN: "Task 4 — Testing H1: Progressive Onboarding for >50",
    ES: "Tarea 4 — Probando H1: Onboarding Progresivo para >50",
  },
  pres_s6_spec: { EN: "Spec", ES: "Especificación" },
  pres_s6_success: { EN: "Success Criteria", ES: "Criterios de Éxito" },
  pres_s6_type: { EN: "Type", ES: "Tipo" },
  pres_s6_cohort: { EN: "Target cohort", ES: "Cohorte objetivo" },
  pres_s6_sample: { EN: "Sample size", ES: "Tamaño de muestra" },
  pres_s6_duration: { EN: "Duration", ES: "Duración" },
  pres_s6_control: { EN: "Control", ES: "Control" },
  pres_s6_treatment: { EN: "Treatment", ES: "Tratamiento" },
  pres_s6_primary: { EN: "Primary KPI", ES: "KPI Primario" },
  pres_s6_guardrail: { EN: "Guardrail", ES: "Guardarraíl" },
  pres_s6_secondary: { EN: "Secondary", ES: "Secundario" },
  pres_s6_iteration: { EN: "Iteration Plan", ES: "Plan de Iteración" },
  pres_s6_if_10: { EN: "If +10pp → Ship to production", ES: "Si +10pp → Lanzar a producción" },
  pres_s6_if_5_10: {
    EN: "If 5–10pp → Extend 1 week, deeper analysis",
    ES: "Si 5–10pp → Extender 1 semana, análisis más profundo",
  },
  pres_s6_if_lt5: {
    EN: "If <5pp → Pivot to copy-only experiment",
    ES: "Si <5pp → Pivotear a experimento solo de copy",
  },

  // Slide 7
  pres_s7_title: {
    EN: "Live Dashboard — Built for Every Audience",
    ES: "Dashboard en Vivo — Diseñado para Cada Audiencia",
  },
  pres_s7_subtitle: {
    EN: "Task 5 — What each stakeholder sees in <30 seconds",
    ES: "Tarea 5 — Lo que cada stakeholder ve en <30 segundos",
  },
  pres_s7_exec: { EN: "Executive", ES: "Ejecutivo" },
  pres_s7_product: { EN: "Product Manager", ES: "Product Manager" },
  pres_s7_engineering: { EN: "Engineering", ES: "Ingeniería" },
  pres_s7_growth: { EN: "Growth", ES: "Crecimiento" },
  pres_s7_exec_insight: {
    EN: "10.4% overall conversion. Biggest drop: onboarding (36.8%). Android = 50% of users, half the iOS rate. +4,690 purchases at stake.",
    ES: "10.4% conversión total. Mayor caída: onboarding (36.8%). Android = 50% de usuarios, la mitad de la tasa de iOS. +4,690 compras en juego.",
  },
  pres_s7_exec_metric: { EN: "Best vs Worst gap: 37.7×", ES: "Brecha Mejor vs Peor: 37.7×" },
  pres_s7_product_insight: {
    EN: ">50 onboards at 39.5% — 45pp below under-25s. Progressive onboarding = Q2 green-light initiative.",
    ES: ">50 completa onboarding al 39.5% — 45pp por debajo de los menores de 25. Onboarding progresivo = iniciativa luz verde Q2.",
  },
  pres_s7_product_metric: { EN: "Target: 39.5% → 55% Reg→Onb", ES: "Meta: 39.5% → 55% Reg→Onb" },
  pres_s7_eng_insight: {
    EN: "Web converts at 2.6% — 7× below iOS at EVERY funnel step. This is structural performance debt, not a single friction point.",
    ES: "Web convierte al 2.6% — 7× por debajo de iOS en CADA paso del funnel. Es deuda estructural de rendimiento, no un punto de fricción.",
  },
  pres_s7_eng_metric: { EN: "iOS: 18.2% · Android: 8.8% · Web: 2.6%", ES: "iOS: 18.2% · Android: 8.8% · Web: 2.6%" },
  pres_s7_growth_insight: {
    EN: "Non-binary converts at 17% (1.75× average). Other regions stall only at checkout (31.2% vs 50.6%). Two addressable segments.",
    ES: "No binario convierte al 17% (1.75× promedio). Otras regiones se estancan solo en checkout (31.2% vs 50.6%). Dos segmentos abordables.",
  },
  pres_s7_growth_metric: {
    EN: "Other regions Cart→Purch: 31.2% vs 50.6%",
    ES: "Otras regiones Carrito→Compra: 31.2% vs 50.6%",
  },
  pres_s7_footer: {
    EN: "Interactive dashboard available in the Dashboard tab — filters by age, device, location, gender.",
    ES: "Dashboard interactivo disponible en la pestaña Tablero — filtra por edad, dispositivo, ubicación, género.",
  },
  pres_s7_insight30: { EN: "Insight in <30s", ES: "Insight en <30s" },
  pres_s7_key_metric: { EN: "Key metric", ES: "Métrica clave" },

  // Filters
  period: { EN: "Period", ES: "Período" },
  datasetCovers: { EN: "Dataset covers Jan–Apr 2025", ES: "El dataset cubre Ene–Abr 2025" },
  filteredView: { EN: "Filtered view", ES: "Vista filtrada" },
  filteredLabel: { EN: "Filtered", ES: "Filtrado" },
  allSegments: { EN: "All Segments", ES: "Todos los segmentos" },
  allDevices: { EN: "All Devices", ES: "Todos los dispositivos" },
  allLocations: { EN: "All Locations", ES: "Todas las regiones" },
  allGenders: { EN: "All Genders", ES: "Todos los géneros" },

  // Audience tabs
  audience_exec: { EN: "Exec", ES: "Ejecutivo" },
  audience_product: { EN: "Product", ES: "Producto" },
  audience_engineering: { EN: "Engineering", ES: "Ingeniería" },
  audience_growth: { EN: "Growth", ES: "Crecimiento" },
  audience_exec_insight: {
    EN: "⚡ Core issue: 36.8% of users never complete onboarding. Fixing >50 onboarding alone could unlock ~$2M in annual GMV.",
    ES: "⚡ Problema central: el 36.8% de los usuarios nunca completa onboarding. Arreglar onboarding de >50 podría desbloquear ~$2M en GMV anual.",
  },
  audience_product_insight: {
    EN: "🎯 Top priority: Progressive onboarding for >50 (29,685 users, 85% confidence). Target: 39.5% → 55% Reg→Onb. Ship in Q2 with 1 squad.",
    ES: "🎯 Prioridad: Onboarding progresivo para >50 (29,685 usuarios, 85% confianza). Meta: 39.5% → 55% Reg→Onb. Entregar en Q2 con 1 squad.",
  },
  audience_engineering_insight: {
    EN: "🔧 Web platform converts at 2.6% vs iOS 18.2% — a 7× gap across ALL steps. Not a single friction point — structural performance debt.",
    ES: "🔧 Web convierte al 2.6% vs iOS 18.2% — una brecha de 7× en TODOS los pasos. No es un punto de fricción — es deuda estructural de rendimiento.",
  },
  audience_growth_insight: {
    EN: "📈 Non-binary users convert at 17% (1.75× avg). Other regions stall at checkout only (31.2% vs 50.6%). Two addressable segments, different interventions.",
    ES: "📈 Usuarios no binarios convierten al 17% (1.75× promedio). Otras regiones se estancan solo en checkout (31.2% vs 50.6%). Dos segmentos abordables, diferentes intervenciones.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const fallbackLanguageContext: LanguageContextType = {
  language: "EN",
  setLanguage: () => undefined,
  t: (key: string) => translations[key]?.EN || key,
};

const LanguageContext = createContext<LanguageContextType>(fallbackLanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("EN");
  const t = (key: string) => translations[key]?.[language] || key;

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
