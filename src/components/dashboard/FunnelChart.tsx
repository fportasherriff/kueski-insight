import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import InsightCallout from './InsightCallout';
import type { FunnelStep } from '@/hooks/useDashboardData';

const stepBadge = (rate: number): { emoji: string; label: string } => {
  if (rate >= 70) return { emoji: '✅', label: '' };
  if (rate >= 45) return { emoji: '🟡', label: 'Watch' };
  return { emoji: '🔴', label: 'Biggest drop' };
};

const FunnelChart = ({ funnel }: { funnel: FunnelStep[] }) => {
  const { t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!funnel.length) return null;

  const maxWidth = 760;
  const stepHeight = 60;
  const gapHeight = 28;
  const totalHeight = funnel.length * stepHeight + (funnel.length - 1) * gapHeight;
  const widths = [1.0, 0.78, 0.60, 0.42, 0.28];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      className="bg-card rounded-2xl shadow-sm p-6 mb-6 animate-fade-in"
      style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
    >
      <h2 className="text-lg font-bold text-foreground">{t('conversionFunnel')}</h2>
      <p className="text-xs text-muted-foreground mb-5">{t('funnelSubtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Funnel SVG — 3/5 width */}
        <div className="lg:col-span-3 relative">
          <svg
            viewBox={`0 0 800 ${totalHeight}`}
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0075FF" />
                <stop offset="100%" stopColor="#3F58EA" />
              </linearGradient>
            </defs>
            {funnel.map((step, i) => {
              const topW = widths[i] * maxWidth;
              const botW = i < funnel.length - 1 ? widths[i + 1] * maxWidth : widths[i] * maxWidth * 0.9;
              const y = i * (stepHeight + gapHeight);
              const cx = 400;
              const topLeft = cx - topW / 2, topRight = cx + topW / 2;
              const botLeft = cx - botW / 2, botRight = cx + botW / 2;
              const points = `${topLeft},${y} ${topRight},${y} ${botRight},${y + stepHeight} ${botLeft},${y + stepHeight}`;

              return (
                <g
                  key={step.name}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                >
                  <polygon
                    points={points}
                    fill="url(#funnelGrad)"
                    className="transition-opacity"
                    style={{ opacity: hoveredIdx === i ? 1 : 1.0 - i * 0.15 }}
                  />
                  <text x={cx} y={y + stepHeight / 2 - 10} textAnchor="middle" fill="white"
                    fontSize="13" fontWeight="600">{step.name}</text>
                  <text x={cx} y={y + stepHeight / 2 + 10} textAnchor="middle" fill="white"
                    fontSize="20" fontWeight="800">{step.users.toLocaleString()}</text>
                  <text x={cx} y={y + stepHeight / 2 + 26} textAnchor="middle" fill="rgba(255,255,255,0.8)"
                    fontSize="11" fontWeight="400">
                    {i === 0 ? '100% of users' : `→ ${step.rate}% continued`}
                  </text>
                  {i < funnel.length - 1 && funnel[i + 1].drop > 0 && (
                    <text
                      x={cx + botW / 2 + 12}
                      y={y + stepHeight + gapHeight / 2 + 4}
                      fill="#EF4444" fontSize="11" fontWeight="500"
                    >
                      ▼ {funnel[i + 1].drop.toLocaleString()} (−{(100 - funnel[i + 1].rate).toFixed(1)}%)
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredIdx !== null && funnel[hoveredIdx] && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: mousePos.x + 16,
                top: mousePos.y - 10,
              }}
            >
              <div style={{
                background: '#141C22', color: 'white', borderRadius: 8,
                padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                minWidth: 200, whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontWeight: 700, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 6, fontSize: 13 }}>
                  {funnel[hoveredIdx].name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Users:</span>
                  <span style={{ fontWeight: 600 }}>{funnel[hoveredIdx].users.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>From start:</span>
                  <span style={{ fontWeight: 600 }}>{funnel[hoveredIdx].dropPct}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Step rate:</span>
                  <span style={{ fontWeight: 600 }}>{funnel[hoveredIdx].rate}% continued</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Dropped here:</span>
                  <span style={{ fontWeight: 600, color: '#EF4444' }}>{funnel[hoveredIdx].drop.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side panel — 2/5 width */}
        <div className="lg:col-span-2 bg-secondary/30 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-4">{t('keyMetrics')}</h3>
            <div className="space-y-3">
              {funnel.map((step, i) => {
                const badge = i === 0 ? { emoji: '✅', label: '' } : stepBadge(step.rate);
                return (
                  <div key={step.name} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-foreground font-medium truncate">{step.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {i === 0 ? '100%' : `${step.rate}%`}
                      </span>
                      {badge.label && (
                        <span className="text-xs whitespace-nowrap">
                          {badge.emoji} {badge.label}
                        </span>
                      )}
                      {!badge.label && <span className="text-xs">{badge.emoji}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <InsightCallout text={t('funnelInsight')} variant="amber" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
