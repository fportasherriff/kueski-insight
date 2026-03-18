import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { SegmentRow } from '@/hooks/useDashboardData';

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#141C22', color: 'white', borderRadius: 8,
      padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      minWidth: 180, border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.15)', fontSize: 13 }}>
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
          <span style={{ color: p.color ?? '#60A5FA', fontWeight: 500 }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const DeviceStepCard = ({ segments }: { segments: SegmentRow[] }) => {
  const { language } = useLanguage();
  const isEs = language === 'ES';

  const data = useMemo(() => {
    const deviceRows = segments.filter(s => s.dimension === 'device');
    const steps = ['step_reg_to_onb', 'step_onb_to_view', 'step_view_to_cart', 'step_cart_to_purch'] as const;
    const stepLabels = ['Reg→Onb', 'Onb→View', 'View→Cart', 'Cart→Purch'];

    return stepLabels.map((label, i) => {
      const stepKey = steps[i];
      const row: Record<string, any> = { step: label };
      for (const d of deviceRows) {
        const key = d.segment === 'ios' ? 'iOS' : d.segment === 'android' ? 'Android' : 'Web';
        row[key] = Number(d[stepKey]);
      }
      return row;
    });
  }, [segments]);

  const insight = isEs
    ? 'Web está por debajo de iOS por ~7× en cada paso — esto es estructural, no aislado.'
    : 'Web lags iOS by ~7× at every step — this is structural, not isolated.';

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 mb-6 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold text-foreground">
        {isEs ? 'Rendimiento por Dispositivo — Paso a Paso' : 'Device Performance — Step by Step'}
      </h2>
      <p className="text-xs text-muted-foreground mb-4">
        {isEs ? 'Tasa de conversión en cada paso del funnel · iOS vs Android vs Web' : 'Conversion rate at each funnel step · iOS vs Android vs Web'}
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="step" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
          <Tooltip content={<DarkTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="iOS" fill="#008246" radius={[3, 3, 0, 0]} barSize={20} />
          <Bar dataKey="Android" fill="#0075FF" radius={[3, 3, 0, 0]} barSize={20} />
          <Bar dataKey="Web" fill="#EF4444" radius={[3, 3, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>

      <InsightCallout text={insight} variant="red" />
    </div>
  );
};

export default DeviceStepCard;