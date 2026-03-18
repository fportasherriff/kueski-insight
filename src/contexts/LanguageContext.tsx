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
  bestWorstSegment: { EN: 'Best vs Worst Segment', ES: 'Mejor vs Peor Segmento' },
  funnelOverview: { EN: 'Funnel Overview', ES: 'Resumen del Funnel' },
  monthlyTrends: { EN: 'Monthly Trends', ES: 'Tendencias Mensuales' },
  segmentBreakdown: { EN: 'Segment Breakdown', ES: 'Desglose por Segmento' },
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
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('EN');
  const t = (key: string) => translations[key]?.[language] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
