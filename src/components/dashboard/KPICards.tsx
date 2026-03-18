import React from 'react';
import { TrendingUp, UserCheck, ShoppingCart, BarChart3, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DashboardKPI } from '@/hooks/useDashboardData';

interface KPICardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  subtext: string;
  delay: number;
}

const KPICard = ({ icon: Icon, value, label, subtext, delay }: KPICardProps) => (
  <div
    className="bg-card rounded-2xl border border-border border-b-2 border-b-[#0075FF] p-5 flex flex-col gap-3 animate-fade-in shadow-sm"
    style={{
      animationDelay: `${delay}ms`,
      animationFillMode: 'backwards',
    }}
  >
    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0075FF]/10">
      <Icon size={20} style={{ color: '#0075FF' }} />
    </div>
    <div>
      <p className="text-3xl font-extrabold" style={{ color: '#0075FF' }}>{value}</p>
      <p className="text-sm font-medium mt-0.5" style={{ color: '#384550' }}>{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  </div>
);

const KPICards = ({ kpis, filtered }: { kpis: DashboardKPI; filtered?: boolean }) => {
  const { t } = useLanguage();

  const cards: Omit<KPICardProps, 'delay'>[] = [
    {
      icon: TrendingUp,
      value: `${kpis.overall_conv_rate}%`,
      label: t('overallConversion'),
      subtext: `${kpis.total_purchases.toLocaleString()} purchases from 100K users`,
    },
    {
      icon: UserCheck,
      value: `${kpis.onboarding_rate}%`,
      label: t('onboardingRate'),
      subtext: t('kpiOnboardingSub'),
    },
    {
      icon: ShoppingCart,
      value: `${kpis.cart_to_purch_rate}%`,
      label: t('cartPurchase'),
      subtext: t('kpiCartSub'),
    },
    {
      icon: BarChart3,
      value: `${kpis.best_to_worst_ratio}×`,
      label: t('bestWorstSegment'),
      subtext: `${kpis.best_segment_conv}% vs ${kpis.worst_segment_conv}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <KPICard key={i} {...card} delay={i * 100} />
      ))}
    </div>
  );
};

export default KPICards;
