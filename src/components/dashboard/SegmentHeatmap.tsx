import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { AgeDeviceRow } from '@/hooks/useDashboardData';

const getCellColor = (conv: number) => {
  if (conv >= 15) return { bg: '#008246', text: 'white' };
  if (conv >= 10) return { bg: '#34d399', text: 'white' };
  if (conv >= 5) return { bg: '#fbbf24', text: '#141C22' };
  if (conv >= 2) return { bg: '#f97316', text: 'white' };
  return { bg: '#EF4444', text: 'white' };
};

const ageOrder = ['<25', '26-50', '>50'];
const deviceOrder = ['ios', 'android', 'web'];
const deviceLabels: Record<string, string> = { ios: 'iOS', android: 'Android', web: 'Web' };

const SegmentHeatmap = ({ ageDevice }: { ageDevice: AgeDeviceRow[] }) => {
  const { t } = useLanguage();

  const grid: Record<string, Record<string, AgeDeviceRow>> = {};
  let bestVal = -1, worstVal = Infinity;
  let bestKey = '', worstKey = '';

  ageDevice.forEach(row => {
    if (!grid[row.age_group]) grid[row.age_group] = {};
    grid[row.age_group][row.device] = row;
    if (row.overall_conv > bestVal) { bestVal = row.overall_conv; bestKey = `${row.age_group}-${row.device}`; }
    if (row.overall_conv < worstVal) { worstVal = row.overall_conv; worstKey = `${row.age_group}-${row.device}`; }
  });

  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold text-foreground">{t('heatmapTitle')}</h2>
      <p className="text-xs text-muted-foreground mb-5">{t('heatmapSubtitle')}</p>

      {/* Column headers */}
      <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 mb-2">
        <div />
        {deviceOrder.map(d => (
          <p key={d} className="text-xs font-semibold text-muted-foreground text-center">{deviceLabels[d]}</p>
        ))}
      </div>

      {/* Grid rows */}
      {ageOrder.map(age => (
        <div key={age} className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 mb-2">
          <div className="flex items-center">
            <span className="text-xs font-semibold text-muted-foreground">{age}</span>
          </div>
          {deviceOrder.map(device => {
            const cell = grid[age]?.[device];
            if (!cell) return <div key={device} className="rounded-[10px] bg-muted min-h-[80px]" />;
            const colors = getCellColor(cell.overall_conv);
            const key = `${age}-${device}`;
            const isBest = key === bestKey;
            const isWorst = key === worstKey;

            return (
              <div
                key={device}
                className={`relative rounded-[10px] p-4 min-h-[80px] flex flex-col items-center justify-center ${
                  isWorst ? 'ring-2 ring-white' : ''
                } ${isBest ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {isWorst && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
                    ⚠ {t('worst')}
                  </span>
                )}
                {isBest && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
                    ★ {t('best')}
                  </span>
                )}
                <span className="text-xl font-bold">{cell.overall_conv}%</span>
                <span className="text-xs opacity-80 mt-1">n={cell.n?.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      ))}

      <InsightCallout text={t('heatmapInsight')} variant="red" />
    </div>
  );
};

export default SegmentHeatmap;
