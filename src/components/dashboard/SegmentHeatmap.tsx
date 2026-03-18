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
const ageLabels: Record<string, string> = { '<25': '<25 yrs', '26-50': '26-50 yrs', '>50': '50+ yrs' };

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
    <div className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in relative" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
      <h2 className="text-lg font-bold" style={{ color: '#00164C' }}>{t('heatmapTitle')}</h2>
      <p className="text-xs mb-5" style={{ color: '#384550' }}>{t('heatmapSubtitle')}</p>

      <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 mb-2">
        <div />
        {deviceOrder.map(d => (
          <p key={d} className="text-xs font-semibold text-center" style={{ color: '#66727D' }}>{deviceLabels[d]}</p>
        ))}
      </div>

      {ageOrder.map(age => (
        <div key={age} className="grid grid-cols-[80px_1fr_1fr_1fr] gap-2 mb-2">
          <div className="flex items-center">
            <span className="text-xs font-semibold" style={{ color: '#66727D' }}>{ageLabels[age]}</span>
          </div>
          {deviceOrder.map(device => {
            const cell = grid[age]?.[device];
            if (!cell) return <div key={device} className="rounded-[10px] bg-muted min-h-[80px]" />;
            const colors = getCellColor(cell.overall_conv);
            const key = `${age}-${device}`;
            const isBest = key === bestKey;
            const isWorst = key === worstKey;

            return (
              <div key={device} className="relative group">
                <div
                  className={`rounded-[10px] p-4 min-h-[80px] flex flex-col items-center justify-center transition-all ${
                    isWorst || isBest ? 'ring-2 ring-white' : ''
                  }`}
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                  title={`${ageLabels[age]} × ${deviceLabels[device]}\nConversion: ${cell.overall_conv}%\nUsers: ${cell.n.toLocaleString()}\nReg→Onb: ${cell.step_reg_to_onb}%\nCart→Purch: ${cell.step_cart_to_purch}%`}
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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 shadow-lg"
                  style={{ background: 'hsl(var(--sidebar-bg))', color: 'white', borderRadius: 8, padding: '8px 12px', fontSize: 12, whiteSpace: 'nowrap', boxShadow: '0 4px 20px hsl(var(--sidebar-bg) / 0.28)' }}>
                  <div>Conv: {cell.overall_conv}%</div>
                  <div>n={Number(cell.n).toLocaleString()}</div>
                  <div>Reg→Onb: {cell.step_reg_to_onb}%</div>
                  <div>View→Cart: {cell.step_view_to_cart}%</div>
                  <div>Cart→Purch: {cell.step_cart_to_purch}%</div>
                </div>
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
