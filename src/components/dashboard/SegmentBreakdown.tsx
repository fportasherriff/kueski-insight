import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { SegmentRow } from '@/hooks/useDashboardData';
import type { AudienceHighlight } from './AudienceTabs';
import type { Audience } from './AudienceTabs';

const dimensionTabs = [
  { key: 'age', dimension: 'age_group' },
  { key: 'device', dimension: 'device' },
  { key: 'location', dimension: 'location' },
  { key: 'gender', dimension: 'gender' },
];

const insightKeys: Record<string, string> = {
  age: 'insightAge',
  device: 'insightDevice',
  location: 'insightLocation',
  gender: 'insightGender',
};

const audienceDimensionMap: Record<Audience, string> = {
  exec: 'age',
  product: 'age',
  engineering: 'device',
  growth: 'gender',
};

const audienceSegmentMap: Record<Audience, string> = {
  exec: '>50',
  product: '>50',
  engineering: 'web',
  growth: 'non-binary',
};

const audienceBadges: Record<Audience, string> = {
  exec: '⚠ 0.6% — Critical',
  product: '🎯 Top priority: >50 onboarding cliff',
  engineering: '🔧 Web = 7× below iOS — structural',
  growth: '📈 Non-binary = 1.75× avg conversion',
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

const SegmentBreakdown = ({ segments, highlights, audience }: { segments: SegmentRow[]; highlights?: AudienceHighlight[]; audience?: Audience }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('age');

  // Auto-switch tab based on audience
  useEffect(() => {
    if (audience) {
      setActiveTab(audienceDimensionMap[audience]);
    }
  }, [audience]);

  const currentDim = dimensionTabs.find(d => d.key === activeTab)!;
  const data = segments
    .filter(s => s.dimension === currentDim.dimension)
    .sort((a, b) => b.overall_conv - a.overall_conv);

  const maxConv = Math.max(...data.map(d => d.overall_conv), 0);
  const minConv = Math.min(...data.map(d => d.overall_conv), 0);

  const highlightSegment = audience ? audienceSegmentMap[audience] : null;
  const showBadge = audience && audienceDimensionMap[audience] === activeTab;

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in relative flex flex-col h-full" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      {showBadge && (
        <span className="absolute top-4 right-4 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full z-10">
          {audienceBadges[audience!]}
        </span>
      )}
      <h2 className="text-lg font-bold text-foreground">{t('segmentBreakdown')}</h2>
      <p className="text-xs text-muted-foreground mt-0.5 mb-4">{t('segmentSubtitle')}</p>

      <div className="flex gap-1 p-1 bg-secondary rounded-full mb-4">
        {dimensionTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all ${
              activeTab === tab.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, Math.ceil(maxConv / 5) * 5 + 5]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="segment"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,117,255,0.08)' }}
              content={<DarkTooltip />}
            />
            <Bar dataKey="overall_conv" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, idx) => {
                let fill = 'hsl(var(--primary))';
                if (entry.overall_conv === maxConv) fill = '#008246';
                if (entry.overall_conv === minConv) fill = '#EF4444';
                // Audience highlight
                if (highlightSegment && activeTab === audienceDimensionMap[audience!] &&
                    entry.segment.toLowerCase() === highlightSegment.toLowerCase()) {
                  fill = '#F59E0B';
                }
                return <Cell key={idx} fill={fill} />;
              })}
              <LabelList dataKey="overall_conv" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 11, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <InsightCallout text={t(insightKeys[activeTab])} variant="amber" />
    </div>
  );
};

export default SegmentBreakdown;
