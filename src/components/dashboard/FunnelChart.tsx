import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { FunnelStep } from '@/hooks/useDashboardData';

const stepKeys = ['registered', 'onboarded', 'viewedProduct', 'addedToCart', 'purchased'];
const barWidths = [100, 86, 72, 52, 36];
const barOpacities = [1.0, 0.85, 0.7, 0.55, 0.4];

const fmt = (n: number) => n >= 1000 ? n.toLocaleString('en-US') : String(n);

const FunnelChart = ({ funnel }: { funnel: FunnelStep[] }) => {
  const { t } = useLanguage();

  if (!funnel.length) return null;

  return (
    <div
      className="bg-card rounded-2xl shadow-sm p-6 mb-6 animate-fade-in"
      style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
    >
      <h2 className="text-lg font-bold text-foreground">{t('conversionFunnel')}</h2>
      <p className="text-xs text-muted-foreground mb-5">{t('funnelSubtitle')}</p>

      <div className="space-y-1">
        {funnel.map((step, i) => {
          const drop = i > 0 ? funnel[i - 1].users - step.users : 0;
          const dropPct = i > 0 ? ((drop / funnel[i - 1].users) * 100).toFixed(1) : '0';

          return (
            <div key={step.step_order}>
              {i > 0 && (
                <div className="pl-[160px] py-0.5">
                  <span className="text-[11px] italic text-destructive">
                    ▼ {fmt(drop)} {t('usersDropped')} (−{dropPct}%)
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="w-[160px] text-[13px] font-medium text-foreground shrink-0 text-right pr-2">
                  {t(stepKeys[i])}
                </span>
                <div className="flex-1 relative">
                  <div
                    className="h-[52px] rounded-r-md flex items-center justify-end pr-4 transition-all duration-500"
                    style={{
                      width: `${barWidths[i]}%`,
                      backgroundColor: `hsl(var(--primary) / ${barOpacities[i]})`,
                    }}
                  >
                    <span className="text-sm font-bold text-white">
                      {fmt(step.users)} <span className="opacity-70 font-normal ml-1">|</span>{' '}
                      <span className="font-semibold">{step.step_rate != null ? `${step.step_rate}%` : `${step.cum_rate}%`}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <InsightCallout text={t('funnelInsight')} variant="amber" />
    </div>
  );
};

export default FunnelChart;
