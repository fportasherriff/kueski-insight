import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, LabelList, CartesianGrid, Legend,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { Audience } from './AudienceTabs';
import type { SegmentRow, AgeDeviceRow } from '@/hooks/useDashboardData';

const DEVICE_COLORS: Record<string, string> = {
  ios: '#008246',
  android: '#0075FF',
  web: '#EF4444',
};

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'hsl(var(--sidebar-bg))', color: 'white', borderRadius: 8,
      padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 20px hsl(var(--sidebar-bg) / 0.28)',
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

/* ─── EXEC PANEL ─── */
const ExecPanel = ({ ageDevice }: { ageDevice: AgeDeviceRow[] }) => {
  const { language } = useLanguage();

  const data = useMemo(() => {
    const steps = ['step_reg_to_onb', 'step_onb_to_view', 'step_view_to_cart', 'step_cart_to_purch'] as const;
    const stepLabels = ['Reg→Onb', 'Onb→View', 'View→Cart', 'Cart→Purch'];

    return stepLabels.map((label, i) => {
      const stepKey = steps[i];
      const byDevice: Record<string, number[]> = { ios: [], android: [], web: [] };
      ageDevice.forEach(r => {
        if (byDevice[r.device]) byDevice[r.device].push(Number(r[stepKey]));
      });
      const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return { step: label, iOS: Math.round(avg(byDevice.ios) * 10) / 10, Android: Math.round(avg(byDevice.android) * 10) / 10, Web: Math.round(avg(byDevice.web) * 10) / 10 };
    });
  }, [ageDevice]);

  const insight = language === 'ES'
    ? 'Web está por debajo de iOS por ~7× — brecha estructural en cada paso.'
    : 'Web lags iOS by ~7× — structural gap at every step.';

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="step" tick={{ fontSize: 11, fill: '#384550' }} />
          <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#384550' }} />
          <Tooltip cursor={{ fill: 'rgba(0,22,76,0.06)' }} content={<DarkTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#384550' }} />
          <Bar dataKey="iOS" fill="#008246" radius={[3, 3, 0, 0]} barSize={18} />
          <Bar dataKey="Android" fill="#0075FF" radius={[3, 3, 0, 0]} barSize={18} />
          <Bar dataKey="Web" fill="#EF4444" radius={[3, 3, 0, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
      <InsightCallout text={insight} />
    </div>
  );
};

/* ─── PRODUCT PANEL ─── */
const ProductPanel = ({ segments }: { segments: SegmentRow[] }) => {
  const { language } = useLanguage();

  const data = useMemo(() => {
    return segments
      .filter(s => s.dimension === 'age_group')
      .map(s => ({
        segment: s.segment,
        onboarding: Number(s.step_reg_to_onb),
      }))
      .sort((a, b) => b.onboarding - a.onboarding);
  }, [segments]);

  const getBarColor = (val: number) => {
    if (val > 70) return '#008246';
    if (val >= 50) return '#0075FF';
    return '#EF4444';
  };

  const best = data[0];
  const worst = data[data.length - 1];
  const gap = best && worst ? (best.onboarding - worst.onboarding).toFixed(0) : '0';

  const insight = language === 'ES'
    ? `${gap}pp de brecha — ${worst?.segment ?? ''} se onboardea al ${worst?.onboarding.toFixed(1)}% vs ${best?.onboarding.toFixed(1)}% para ${best?.segment ?? ''}.`
    : `${gap}pp gap — ${worst?.segment ?? ''} onboards at ${worst?.onboarding.toFixed(1)}% vs ${best?.onboarding.toFixed(1)}% for ${best?.segment ?? ''}.`;

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#384550' }} />
          <YAxis type="category" dataKey="segment" width={60} tick={{ fontSize: 11, fill: '#384550' }} />
          <Tooltip cursor={{ fill: 'rgba(0,22,76,0.06)' }} content={<DarkTooltip />} />
          <Bar dataKey="onboarding" name="Onboarding Rate" radius={[0, 4, 4, 0]} barSize={22}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={getBarColor(entry.onboarding)} />
            ))}
            <LabelList dataKey="onboarding" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 11, fontWeight: 600, fill: '#384550' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <InsightCallout text={insight} />
    </div>
  );
};

/* ─── ENGINEERING PANEL ─── */
const EngineeringPanel = ({ ageDevice }: { ageDevice: AgeDeviceRow[] }) => {
  const { language } = useLanguage();

  const data = useMemo(() => {
    const steps = ['step_reg_to_onb', 'step_onb_to_view', 'step_view_to_cart', 'step_cart_to_purch'] as const;
    const stepLabels = ['Reg→Onb', 'Onb→View', 'View→Cart', 'Cart→Purch'];

    return stepLabels.map((label, i) => {
      const stepKey = steps[i];
      const byDevice: Record<string, number[]> = { ios: [], android: [], web: [] };
      ageDevice.forEach(r => {
        if (byDevice[r.device]) byDevice[r.device].push(Number(r[stepKey]));
      });
      const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return { step: label, iOS: Math.round(avg(byDevice.ios) * 10) / 10, Android: Math.round(avg(byDevice.android) * 10) / 10, Web: Math.round(avg(byDevice.web) * 10) / 10 };
    });
  }, [ageDevice]);

  const insight = language === 'ES'
    ? 'La deuda de rendimiento en Web está presente en cada paso del funnel.'
    : 'Web performance debt is present at every funnel step.';

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="step" tick={{ fontSize: 11, fill: '#384550' }} />
          <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#384550' }} />
          <Tooltip cursor={{ fill: 'rgba(0,22,76,0.06)' }} content={<DarkTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#384550' }} />
          <Bar dataKey="iOS" fill="#008246" radius={[3, 3, 0, 0]} barSize={18} />
          <Bar dataKey="Android" fill="#0075FF" radius={[3, 3, 0, 0]} barSize={18} />
          <Bar dataKey="Web" fill="#EF4444" radius={[3, 3, 0, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
      <InsightCallout text={insight} />
    </div>
  );
};

/* ─── GROWTH PANEL ─── */
const GrowthPanel = ({ segments }: { segments: SegmentRow[] }) => {
  const { language } = useLanguage();

  const genderData = useMemo(() =>
    segments.filter(s => s.dimension === 'gender')
      .map(s => ({ segment: s.segment, overall_conv: Number(s.overall_conv) }))
      .sort((a, b) => b.overall_conv - a.overall_conv),
  [segments]);

  const locationData = useMemo(() =>
    segments.filter(s => s.dimension === 'location')
      .map(s => ({ segment: s.segment, overall_conv: Number(s.overall_conv) }))
      .sort((a, b) => b.overall_conv - a.overall_conv),
  [segments]);

  const genderColors: Record<string, string> = { 'non-binary': '#7D6CFF', female: '#0075FF', male: '#008246' };
  const locationColors: Record<string, string> = { GDL: '#008246', CDMX: '#0075FF', MTY: '#0075FF', Other: '#EF4444' };

  const genderInsight = language === 'ES'
    ? 'No binario convierte ~1.75× por encima del promedio.'
    : 'Non-binary converts ~1.75× above average.';

  const locationInsight = language === 'ES'
    ? 'Regiones "Other" se estancan solo en checkout.'
    : '"Other" regions stall at checkout only.';

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: '#66727D' }}>
          {language === 'ES' ? 'Conv. por Género' : 'Conv. by Gender'}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={genderData} layout="vertical" margin={{ left: 0, right: 35, top: 0, bottom: 0 }}>
            <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#384550' }} />
            <YAxis type="category" dataKey="segment" width={75} tick={{ fontSize: 10, fill: '#384550' }} />
            <Tooltip cursor={{ fill: 'rgba(0,22,76,0.06)' }} content={<DarkTooltip />} />
            <Bar dataKey="overall_conv" name="Conv %" radius={[0, 4, 4, 0]} barSize={18}>
              {genderData.map((e, i) => (
                <Cell key={i} fill={genderColors[e.segment] ?? '#0075FF'} />
              ))}
              <LabelList dataKey="overall_conv" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 10, fontWeight: 600, fill: '#384550' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <InsightCallout text={genderInsight} />
      </div>
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: '#66727D' }}>
          {language === 'ES' ? 'Conv. por Ubicación' : 'Conv. by Location'}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={locationData} layout="vertical" margin={{ left: 0, right: 35, top: 0, bottom: 0 }}>
            <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#384550' }} />
            <YAxis type="category" dataKey="segment" width={55} tick={{ fontSize: 10, fill: '#384550' }} />
            <Tooltip cursor={{ fill: 'rgba(0,22,76,0.06)' }} content={<DarkTooltip />} />
            <Bar dataKey="overall_conv" name="Conv %" radius={[0, 4, 4, 0]} barSize={18}>
              {locationData.map((e, i) => (
                <Cell key={i} fill={locationColors[e.segment] ?? '#0075FF'} />
              ))}
              <LabelList dataKey="overall_conv" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: 10, fontWeight: 600, fill: '#384550' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <InsightCallout text={locationInsight} />
      </div>
    </div>
  );
};

/* ─── MAIN PANEL ─── */
const audienceTitles: Record<string, Record<Audience, string>> = {
  en: { exec: 'Device Conversion by Step', product: 'Onboarding Rate by Age', engineering: 'Full Funnel by Device', growth: 'Conversion by Segment' },
  es: { exec: 'Conversión por Dispositivo', product: 'Tasa de Onboarding por Edad', engineering: 'Funnel Completo por Dispositivo', growth: 'Conversión por Segmento' },
};

const AudiencePanel = ({ audience, segments, ageDevice }: {
  audience: Audience;
  segments: SegmentRow[];
  ageDevice: AgeDeviceRow[];
}) => {
  const { language } = useLanguage();
  const lang = language === 'ES' ? 'es' : 'en';
  const title = audienceTitles[lang][audience];

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold mb-1" style={{ color: '#00164C' }}>{title}</h2>
      <p className="text-xs mb-4" style={{ color: '#384550' }}>
        {lang === 'es' ? 'Vista adaptada al perfil seleccionado' : 'View tailored to selected persona'}
      </p>
      {audience === 'exec' && <ExecPanel ageDevice={ageDevice} />}
      {audience === 'product' && <ProductPanel segments={segments} />}
      {audience === 'engineering' && <EngineeringPanel ageDevice={ageDevice} />}
      {audience === 'growth' && <GrowthPanel segments={segments} />}
    </div>
  );
};

export default AudiencePanel;
