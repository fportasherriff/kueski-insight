import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { MonthlyRow } from '@/hooks/useDashboardData';

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};
  return (
    <div style={{
      background: '#141C22', color: 'white', borderRadius: 8,
      padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      minWidth: 200, border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.15)', fontSize: 13 }}>
        {label ?? d.cohort_label ?? ''}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
          <span style={{ color: p.color ?? '#60A5FA', fontWeight: 500 }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}</span>
        </div>
      ))}
      {d.step_reg_to_onb !== undefined && (
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            ['Reg→Onb', d.step_reg_to_onb],
            ['Onb→View', d.step_onb_to_view],
            ['View→Cart', d.step_view_to_cart],
            ['Cart→Purch', d.step_cart_to_purch],
          ].map(([k, v]) => (
            <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{k}:</span>
              <span style={{ fontWeight: 500, fontSize: 11 }}>{Number(v).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MonthlyTrend = ({ monthly }: { monthly: MonthlyRow[] }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in flex flex-col h-full" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold mb-4" style={{ color: '#141C22' }}>{t('monthlyTrends')}</h2>

      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <XAxis dataKey="cohort_label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip content={<DarkTooltip />} />
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
