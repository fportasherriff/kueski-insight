import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'ES';

interface Translations {
  [key: string]: { EN: string; ES: string };
}

export const translations: Translations = {
  dashboard: { EN: 'Dashboard', ES: 'Tablero' },
  presentation: { EN: 'Presentation', ES: 'Presentación' },
  askData: { EN: 'Ask the Data', ES: 'Consultar Datos' },
  roadmap: { EN: 'Roadmap', ES: 'Hoja de Ruta' },
  loading: { EN: 'Loading...', ES: 'Cargando...' },
  overallConversion: { EN: 'Overall Conversion', ES: 'Conversión Total' },
  onboardingRate: { EN: 'Onboarding Rate', ES: 'Tasa de Onboarding' },
  cartPurchase: { EN: 'Cart to Purchase', ES: 'Carrito a Compra' },
  bestWorstSegment: { EN: 'Best vs Worst Segment', ES: 'Brecha de Segmentos' },
  funnelOverview: { EN: 'Funnel Overview', ES: 'Resumen del Funnel' },
  monthlyTrends: { EN: 'Monthly Trends', ES: 'Tendencias Mensuales' },
  segmentBreakdown: { EN: 'Segment Breakdown', ES: 'Desglose por Segmento' },
  segmentSubtitle: {
    EN: 'Overall conversion rate per group — bars show % of each group that purchased',
    ES: 'Tasa de conversión por grupo — las barras muestran % del grupo que compró',
  },
  hypothesisValidation: { EN: 'Hypothesis Validation', ES: 'Validación de Hipótesis' },
  actionRoadmap: { EN: 'Action Roadmap', ES: 'Hoja de Ruta de Acción' },
  experimentDesign: { EN: 'Experiment Design', ES: 'Diseño de Experimento' },
  askPlaceholder: { EN: 'Ask anything about the data...', ES: 'Pregunta sobre los datos...' },
  send: { EN: 'Send', ES: 'Enviar' },
  confirmed: { EN: 'Confirmed', ES: 'Confirmado' },
  refuted: { EN: 'Refuted', ES: 'Refutado' },
  priority: { EN: 'Priority', ES: 'Prioridad' },
  reach: { EN: 'Reach', ES: 'Alcance' },
  impact: { EN: 'Impact', ES: 'Impacto' },
  confidence: { EN: 'Confidence', ES: 'Confianza' },
  effort: { EN: 'Effort', ES: 'Esfuerzo' },
  quarter: { EN: 'Quarter', ES: 'Trimestre' },
  langLabel: { EN: 'Language / Idioma', ES: 'Language / Idioma' },
  comingSoon: { EN: 'Content coming in next iteration', ES: 'Contenido en la próxima iteración' },

  // Dashboard header
  dashboardSubtitle: { EN: 'BNPL Funnel · 100,000 users · Jan–Apr 2025', ES: 'Funnel BNPL · 100,000 usuarios · Ene–Abr 2025' },
  exportCsv: { EN: 'Export CSV', ES: 'Exportar CSV' },

  // KPI subtexts
  kpiOverallSub: { EN: '10,408 purchases from 100K users', ES: '10,408 compras de 100K usuarios' },
  kpiOnboardingSub: { EN: 'Biggest absolute drop in funnel', ES: 'Mayor caída absoluta del funnel' },
  kpiCartSub: { EN: 'Step 4 → Step 5 conversion', ES: 'Conversión paso 4 → paso 5' },
  kpiSegmentSub: { EN: '22.6% (iOS 26-50) vs 0.6% (Web >50)', ES: '22.6% (iOS 26-50) vs 0.6% (Web >50)' },

  // Funnel
  conversionFunnel: { EN: 'Conversion Funnel', ES: 'Funnel de Conversión' },
  funnelSubtitle: { EN: 'Step-by-step drop-off · 100,000 users', ES: 'Caída paso a paso · 100,000 usuarios' },
  registered: { EN: 'Registered', ES: 'Registrados' },
  onboarded: { EN: 'Onboarded', ES: 'Onboarding completado' },
  viewedProduct: { EN: 'Viewed Product', ES: 'Vieron Producto' },
  addedToCart: { EN: 'Added to Cart', ES: 'Agregaron al Carrito' },
  purchased: { EN: 'Purchased', ES: 'Compraron' },
  usersDropped: { EN: 'users dropped', ES: 'usuarios perdidos' },
  keyMetrics: { EN: 'Key Metrics', ES: 'Métricas Clave' },

  // Funnel insight
  funnelInsight: {
    EN: '💡 The biggest drop happens at Onboarding — 36,811 users (36.8%) never complete it.\n\nUsers 50+ are the main driver: only 39.5% complete onboarding vs 84.9% for under-25s.',
    ES: '💡 La mayor caída ocurre en Onboarding — 36,811 usuarios (36.8%) nunca lo completan.\n\nLos usuarios de 50+ son el principal factor: solo el 39.5% completa onboarding vs 84.9% en menores de 25.'
  },

  // Segment tabs
  age: { EN: 'Age', ES: 'Edad' },
  device: { EN: 'Device', ES: 'Dispositivo' },
  location: { EN: 'Location', ES: 'Región' },
  gender: { EN: 'Gender', ES: 'Género' },

  // Segment insights
  insightAge: {
    EN: 'Users 50+ convert at 3.8% — 3.5× below the 26-50 cohort.',
    ES: 'Los usuarios de 50+ convierten al 3.8% — 3.5× por debajo del cohorte 26-50.'
  },
  insightDevice: {
    EN: 'Web converts at 2.6% — 7× below iOS. This gap is structural across all steps.',
    ES: 'Web convierte al 2.6% — 7× por debajo de iOS. La brecha es estructural en todos los pasos.'
  },
  insightLocation: {
    EN: 'Other regions stall at checkout: Cart→Purchase is 31.2% vs 50.6% in major cities.',
    ES: 'Otras regiones se estancan en el checkout: Carrito→Compra es 31.2% vs 50.6% en ciudades principales.'
  },
  insightGender: {
    EN: 'Non-binary users convert at 17% — 1.75× above Female/Male averages.',
    ES: 'Usuarios no binarios convierten al 17% — 1.75× por encima del promedio Femenino/Masculino.'
  },

  // Monthly trend
  overall: { EN: 'Overall', ES: 'Total' },
  onboarding: { EN: 'Onboarding', ES: 'Onboarding' },
  cartToPurchase: { EN: 'Cart→Purchase', ES: 'Carrito→Compra' },
  trendInsight: {
    EN: 'Funnel performance is stable across all 4 months — no seasonal effects detected.',
    ES: 'El rendimiento del funnel es estable en los 4 meses — sin efectos estacionales detectados.'
  },

  // Heatmap
  heatmapTitle: { EN: 'Age × Device Performance Matrix', ES: 'Matriz Edad × Dispositivo' },
  heatmapSubtitle: { EN: 'Overall conversion rate by segment combination', ES: 'Tasa de conversión total por combinación de segmentos' },
  worst: { EN: 'Worst', ES: 'Peor' },
  best: { EN: 'Best', ES: 'Mejor' },
  heatmapInsight: {
    EN: '⚠ Critical: Users 50+ on Web convert at just 0.6% — 37× below the best-performing segment (iOS 26-50 at 22.6%).',
    ES: '⚠ Crítico: Los usuarios de 50+ en Web convierten al 0.6% — 37× por debajo del mejor segmento (iOS 26-50 al 22.6%).'
  },

  // Error
  errorLoadData: { EN: 'Unable to load data. Please refresh the page.', ES: 'No se pudieron cargar los datos. Por favor, recarga la página.' },

  // Filters
  period: { EN: 'Period', ES: 'Período' },
  datasetCovers: { EN: 'Dataset covers Jan–Apr 2025', ES: 'El dataset cubre Ene–Abr 2025' },
  filteredView: { EN: 'Filtered view', ES: 'Vista filtrada' },
  filteredLabel: { EN: 'Filtered', ES: 'Filtrado' },
  allSegments: { EN: 'All Segments', ES: 'Todos los segmentos' },
  allDevices: { EN: 'All Devices', ES: 'Todos los dispositivos' },
  allLocations: { EN: 'All Locations', ES: 'Todas las regiones' },
  allGenders: { EN: 'All Genders', ES: 'Todos los géneros' },

  // Audience tabs
  audience_exec: { EN: 'Exec', ES: 'Ejecutivo' },
  audience_product: { EN: 'Product', ES: 'Producto' },
  audience_engineering: { EN: 'Engineering', ES: 'Ingeniería' },
  audience_growth: { EN: 'Growth', ES: 'Crecimiento' },
  audience_exec_insight: {
    EN: '⚡ Core issue: 36.8% of users never complete onboarding. Fixing >50 onboarding alone could unlock ~$2M in annual GMV.',
    ES: '⚡ Problema central: el 36.8% de los usuarios nunca completa onboarding. Arreglar onboarding de >50 podría desbloquear ~$2M en GMV anual.'
  },
  audience_product_insight: {
    EN: '🎯 Top priority: Progressive onboarding for >50 (29,685 users, 85% confidence). Target: 39.5% → 55% Reg→Onb. Ship in Q2 with 1 squad.',
    ES: '🎯 Prioridad: Onboarding progresivo para >50 (29,685 usuarios, 85% confianza). Meta: 39.5% → 55% Reg→Onb. Entregar en Q2 con 1 squad.'
  },
  audience_engineering_insight: {
    EN: '🔧 Web platform converts at 2.6% vs iOS 18.2% — a 7× gap across ALL steps. Not a single friction point — structural performance debt.',
    ES: '🔧 Web convierte al 2.6% vs iOS 18.2% — una brecha de 7× en TODOS los pasos. No es un punto de fricción — es deuda estructural de rendimiento.'
  },
  audience_growth_insight: {
    EN: '📈 Non-binary users convert at 17% (1.75× avg). Other regions stall at checkout only (31.2% vs 50.6%). Two addressable segments, different interventions.',
    ES: '📈 Usuarios no binarios convierten al 17% (1.75× promedio). Otras regiones se estancan solo en checkout (31.2% vs 50.6%). Dos segmentos abordables, diferentes intervenciones.'
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const fallbackLanguageContext: LanguageContextType = {
  language: 'EN',
  setLanguage: () => undefined,
  t: (key: string) => translations[key]?.EN || key,
};

const LanguageContext = createContext<LanguageContextType>(fallbackLanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('EN');
  const t = (key: string) => translations[key]?.[language] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
