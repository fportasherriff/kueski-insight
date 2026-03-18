import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { SegmentRow } from '@/hooks/useDashboardData';
import type { AudienceHighlight } from './AudienceTabs';

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

const SegmentBreakdown = ({ segments, highlights }: { segments: SegmentRow[]; highlights?: AudienceHighlight[] }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('age');

  // Auto-switch tab if audience highlight targets a specific tab
  const segHighlight = highlights?.find(h => h.chartId === 'segment');
  useEffect(() => {
    if (segHighlight?.segmentTab) setActiveTab(segHighlight.segmentTab);
  }, [segHighlight?.segmentTab]);

  const currentDim = dimensionTabs.find(d => d.key === activeTab)!;
  const data = segments
    .filter(s => s.dimension === currentDim.dimension)
    .sort((a, b) => b.overall_conv - a.overall_conv);

  const maxConv = Math.max(...data.map(d => d.overall_conv), 0);
  const minConv = Math.min(...data.map(d => d.overall_conv), 0);

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in relative" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      {segHighlight?.badge && activeTab === segHighlight.segmentTab && (
        <span className="absolute top-4 right-4 text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full z-10">
          {segHighlight.badge}
        </span>
      )}
      <h2 className="text-lg font-bold text-foreground mb-4">{t('segmentBreakdown')}</h2>

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

      <div className="h-[200px]">
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
              content={(props) => {
                const { active, payload, label } = props;
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{
                    background: '#141C22', color: 'white', borderRadius: 8,
                    padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    minWidth: 180
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4 }}>
                      {label || d.segment}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Overall conv:</span>
                      <span style={{ fontWeight: 600, color: '#60A5FA' }}>{d.overall_conv}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Reg→Onb:</span>
                      <span style={{ fontWeight: 500 }}>{d.step_reg_to_onb}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Onb→View:</span>
                      <span style={{ fontWeight: 500 }}>{d.step_onb_to_view}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>View→Cart:</span>
                      <span style={{ fontWeight: 500 }}>{d.step_view_to_cart}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cart→Purch:</span>
                      <span style={{ fontWeight: 500 }}>{d.step_cart_to_purch}%</span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="overall_conv" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, idx) => {
                let fill = 'hsl(var(--primary))';
                if (entry.overall_conv === maxConv) fill = '#008246';
                if (entry.overall_conv === minConv) fill = '#EF4444';
                // Audience highlight ring effect via brighter fill
                if (segHighlight?.segmentKey && entry.segment.toLowerCase() === segHighlight.segmentKey.toLowerCase() && activeTab === segHighlight.segmentTab) {
                  fill = segHighlight.ringColor || fill;
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
