import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SegmentRow } from '@/hooks/useDashboardData';
import type { ActiveFilters } from './FilterBar';

const dimensionTabs = [
  { key: 'age', dimension: 'age_group' },
  { key: 'device', dimension: 'device' },
  { key: 'location', dimension: 'location' },
  { key: 'gender', dimension: 'gender' },
];

const getSegmentInsight = (
  segments: SegmentRow[],
  activeDimension: string,
  lang: string
) => {
  const dimKey = dimensionTabs.find(d => d.key === activeDimension)?.dimension;
  if (!dimKey) return '';
  const rows = segments.filter(r => r.dimension === dimKey);
  if (!rows.length) return '';

  const best = rows.reduce((a, b) => Number(a.overall_conv) > Number(b.overall_conv) ? a : b);
  const worst = rows.reduce((a, b) => Number(a.overall_conv) < Number(b.overall_conv) ? a : b);
  const worstConv = Number(worst.overall_conv);
  const ratio = worstConv > 0 ? (Number(best.overall_conv) / worstConv).toFixed(1) : '∞';
  const bestConv = Number(best.overall_conv).toFixed(1);

  if (lang === 'es') {
    return `${best.segment} convierte al ${bestConv}% — ${ratio}× más que ${worst.segment} (${worstConv.toFixed(1)}%).`;
  }
  return `${best.segment} converts at ${bestConv}% — ${ratio}× above ${worst.segment} at ${worstConv.toFixed(1)}%.`;
};

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
        {label ?? d.segment ?? ''}
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

const SegmentBreakdown = ({ segments, filters }: {
  segments: SegmentRow[];
  filters?: ActiveFilters;
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('age');

  const currentDim = dimensionTabs.find(d => d.key === activeTab)!;

  const dimFilterMap: Record<string, string> = { age: filters?.age ?? 'all', device: filters?.device ?? 'all', location: filters?.location ?? 'all', gender: filters?.gender ?? 'all' };
  const isDimFiltered = dimFilterMap[activeTab] !== 'all';

  const data = segments
    .filter(s => s.dimension === currentDim.dimension)
    .sort((a, b) => b.overall_conv - a.overall_conv);

  const maxConv = Math.max(...data.map(d => d.overall_conv), 0);
  const minConv = Math.min(...data.map(d => d.overall_conv), 0);

  const insightText = !isDimFiltered ? getSegmentInsight(segments, activeTab, language === 'ES' ? 'es' : 'en') : '';

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in relative flex flex-col h-full" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold" style={{ color: '#00164C' }}>{t('segmentBreakdown')}</h2>
      <p className="text-xs mt-0.5 mb-4" style={{ color: '#384550' }}>{t('segmentSubtitle')}</p>

      <div className="flex gap-1 p-1 bg-secondary rounded-full mb-4">
        {dimensionTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all ${
              activeTab === tab.key
                ? 'bg-card shadow-sm'
                : 'hover:text-[#00164C]'
            }`}
            style={{ color: activeTab === tab.key ? '#00164C' : '#66727D' }}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 h-[200px]">
        {isDimFiltered ? (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: '#66727D' }}>
            {language === 'ES' ? 'Filtrado a:' : 'Filtered to:'}
            <span className="font-semibold ml-1 text-primary">
              {dimFilterMap[activeTab].toUpperCase()}
            </span>
            <span className="ml-2 text-xs" style={{ color: '#66727D' }}>
              {language === 'ES' ? '— cambia de pestaña para ver desglose' : '— switch tab to see breakdown'}
            </span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, Math.ceil(maxConv / 5) * 5 + 5]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#384550' }} />
              <YAxis type="category" dataKey="segment" width={100} tick={{ fontSize: 11, fill: '#384550' }} />
              <Tooltip cursor={{ fill: 'rgba(0,117,255,0.08)' }} content={<DarkTooltip />} />
              <Bar dataKey="overall_conv" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((entry, idx) => {
                  let fill = '#0075FF';
                  if (entry.overall_conv === maxConv) fill = '#008246';
                  if (entry.overall_conv === minConv) fill = '#EF4444';
                  return <Cell key={idx} fill={fill} />;
                })}
                <LabelList dataKey="overall_conv" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 11, fontWeight: 600, fill: '#384550' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {insightText && (
        <div className="bg-[#FFF7ED] border-l-4 border-[#F59E0B] p-3 rounded-r-lg text-sm mt-3" style={{ color: '#384550' }}>
          {insightText}
        </div>
      )}
    </div>
  );
};

export default SegmentBreakdown;
