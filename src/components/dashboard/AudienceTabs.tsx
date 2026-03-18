import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export type Audience = 'exec' | 'product' | 'engineering' | 'growth';

const audiences: Audience[] = ['exec', 'product', 'engineering', 'growth'];

const AudienceTabs = ({ active, onChange }: { active: Audience; onChange: (a: Audience) => void }) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-1 p-1 bg-secondary rounded-full w-fit mb-4">
      {audiences.map(a => (
        <button
          key={a}
          onClick={() => onChange(a)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
            active === a
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t(`audience_${a}`)}
        </button>
      ))}
    </div>
  );
};

export default AudienceTabs;

// Audience highlight config used by chart components
export interface AudienceHighlight {
  chartId: 'heatmap' | 'segment' | 'kpi';
  segmentTab?: string;  // which tab to highlight in segment chart
  segmentKey?: string;   // which bar to highlight
  heatmapCell?: { age: string; device: string };
  kpiIndex?: number;
  badge?: string;
  ringColor?: string;
}

export function getAudienceHighlights(audience: Audience): AudienceHighlight[] {
  switch (audience) {
    case 'exec':
      return [
        { chartId: 'heatmap', heatmapCell: { age: '>50', device: 'web' }, badge: '⚠ Critical: 0.6% conversion', ringColor: '#EF4444' },
      ];
    case 'product':
      return [
        { chartId: 'segment', segmentTab: 'age', segmentKey: '>50', badge: '🎯 Top priority: >50 onboarding cliff', ringColor: '#F59E0B' },
        { chartId: 'kpi', kpiIndex: 1, ringColor: '#0075FF' },
      ];
    case 'engineering':
      return [
        { chartId: 'segment', segmentTab: 'device', segmentKey: 'web', badge: '🔧 Web = 7× below iOS', ringColor: '#EF4444' },
        { chartId: 'kpi', kpiIndex: 3, ringColor: '#7D6CFF' },
      ];
    case 'growth':
      return [
        { chartId: 'segment', segmentTab: 'gender', segmentKey: 'non-binary', badge: '📈 Non-binary: 1.75× avg', ringColor: '#008246' },
      ];
  }
}
