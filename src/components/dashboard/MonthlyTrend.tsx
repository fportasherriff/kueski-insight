import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import CustomTooltip from './CustomTooltip';
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
            <Tooltip content={<CustomTooltip />} />
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
