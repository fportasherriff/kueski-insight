import React from 'react';
import { TrendingUp, UserCheck, ShoppingCart, BarChart3, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DashboardKPI } from '@/hooks/useDashboardData';
import type { AudienceHighlight } from './AudienceTabs';

const signalColor = (signal: string) => {
  if (signal === 'green') return '#008246';
  if (signal === 'amber') return '#F59E0B';
  return '#EF4444';
};

interface KPICardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  subtext: string;
  color: string;
  delay: number;
  highlighted?: boolean;
  ringColor?: string;
}

const KPICard = ({ icon: Icon, value, label, subtext, color, delay, highlighted, ringColor }: KPICardProps) => (
  <div
    className={`bg-card rounded-2xl border border-border p-5 flex flex-col gap-3 animate-fade-in shadow-sm transition-all ${
      highlighted ? 'ring-2 ring-offset-1' : ''
    }`}
    style={{
      animationDelay: `${delay}ms`,
      animationFillMode: 'backwards',
      borderBottom: `3px solid ${color}`,
      ...(highlighted && ringColor ? { boxShadow: `0 0 0 2px ${ringColor}` } : {}),
    }}
  >
    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground/70 mt-0.5">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
    <div className="flex items-center gap-1.5 mt-auto">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  </div>
);

const KPICards = ({ kpis, filtered, highlights }: { kpis: DashboardKPI; filtered?: boolean; highlights?: AudienceHighlight[] }) => {
  const { t } = useLanguage();

  const kpiHighlights = highlights?.filter(h => h.chartId === 'kpi') || [];

  const cards: Omit<KPICardProps, 'delay' | 'highlighted' | 'ringColor'>[] = [
    {
      icon: TrendingUp,
      value: `${kpis.overall_conv_rate}%`,
      label: t('overallConversion'),
      subtext: `${kpis.total_purchases.toLocaleString()} ${t('kpiOverallSub')}`,
      color: signalColor(kpis.conv_signal),
    },
    {
      icon: UserCheck,
      value: `${kpis.onboarding_rate}%`,
      label: t('onboardingRate'),
      subtext: t('kpiOnboardingSub'),
      color: signalColor(kpis.onboarding_signal),
    },
    {
      icon: ShoppingCart,
      value: `${kpis.cart_to_purch_rate}%`,
      label: t('cartPurchase'),
      subtext: t('kpiCartSub'),
      color: signalColor(kpis.cart_signal),
    },
    {
      icon: BarChart3,
      value: `${kpis.best_to_worst_ratio}×`,
      label: t('bestWorstSegment'),
      subtext: `${kpis.best_segment_conv}% vs ${kpis.worst_segment_conv}%`,
      color: '#7D6CFF',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => {
        const hl = kpiHighlights.find(h => h.kpiIndex === i);
        return (
          <KPICard key={i} {...card} delay={i * 100} highlighted={!!hl} ringColor={hl?.ringColor} />
        );
      })}
    </div>
  );
};

export default KPICards;
