import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { SegmentRow } from '@/hooks/useDashboardData';

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

const SegmentBreakdown = ({ segments }: { segments: SegmentRow[] }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('age');

  const currentDim = dimensionTabs.find(d => d.key === activeTab)!;
  const data = segments
    .filter(s => s.dimension === currentDim.dimension)
    .sort((a, b) => b.overall_conv - a.overall_conv)
    .map(s => ({ ...s, label: `${s.segment} (n=${s.n.toLocaleString()})` }));

  const maxConv = Math.max(...data.map(d => d.overall_conv), 0);
  const minConv = Math.min(...data.map(d => d.overall_conv), 0);

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
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
              dataKey="label"
              width={140}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs min-w-[200px]">
                    <p className="font-semibold text-foreground mb-2 pb-1 border-b border-border">
                      {label}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Overall Conv:</span>
                        <span className="font-semibold text-primary">{d?.overall_conv}%</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Reg→Onb:</span>
                        <span className="font-semibold text-foreground">{d?.step_reg_to_onb}%</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Onb→View:</span>
                        <span className="font-semibold text-foreground">{d?.step_onb_to_view}%</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">View→Cart:</span>
                        <span className="font-semibold text-foreground">{d?.step_view_to_cart}%</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Cart→Purch:</span>
                        <span className="font-semibold text-foreground">{d?.step_cart_to_purch}%</span>
                      </div>
                      <div className="flex justify-between gap-4 pt-1 border-t border-border">
                        <span className="text-muted-foreground">Users (n):</span>
                        <span className="font-semibold text-foreground">{Number(d?.n).toLocaleString()}</span>
                      </div>
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
