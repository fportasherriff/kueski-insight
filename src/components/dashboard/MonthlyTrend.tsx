import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { MonthlyRow } from '@/hooks/useDashboardData';

const MonthlyTrend = ({ monthly }: { monthly: MonthlyRow[] }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold text-foreground mb-4">{t('monthlyTrends')}</h2>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <XAxis dataKey="cohort_label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs min-w-[180px]">
                    <p className="font-semibold text-foreground mb-2 pb-1 border-b border-border">{label}</p>
                    {payload.map((p: any) => (
                      <div key={p.name} className="flex justify-between gap-4 py-0.5">
                        <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
                        <span className="font-semibold text-foreground">{Number(p.value).toFixed(1)}%</span>
                      </div>
                    ))}
                    {payload[0]?.payload && (
                      <div className="mt-1 pt-1 border-t border-border text-muted-foreground">
                        <div className="flex justify-between gap-4">
                          <span>Registered:</span>
                          <span className="font-medium text-foreground">{Number(payload[0].payload.registered).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span>Purchased:</span>
                          <span className="font-medium text-foreground">{Number(payload[0].payload.purchased).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="overall_conv" name={t('overall')} stroke="#0075FF" strokeWidth={2.5} dot={{ r: 4, fill: '#0075FF' }} />
            <Line type="monotone" dataKey="step_reg_to_onb" name={t('onboarding')} stroke="#7D6CFF" strokeWidth={2} dot={{ r: 4, fill: '#7D6CFF' }} />
            <Line type="monotone" dataKey="step_cart_to_purch" name={t('cartToPurchase')} stroke="#008246" strokeWidth={2} dot={{ r: 4, fill: '#008246' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <InsightCallout text={t('trendInsight')} variant="blue" />
    </div>
  );
};

export default MonthlyTrend;
