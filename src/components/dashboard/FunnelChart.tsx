import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import type { FunnelStep } from '@/hooks/useDashboardData';
import type { ActiveFilters } from './FilterBar';

const getFunnelInsight = (steps: FunnelStep[], filters: ActiveFilters | undefined, lang: string) => {
  if (!steps?.length || steps.length < 5) return '';
  const drops = [
    { step: steps[1].name, drop: steps[0].users - steps[1].users, pct: 100 - steps[1].rate },
    { step: steps[2].name, drop: steps[1].users - steps[2].users, pct: 100 - steps[2].rate },
    { step: steps[3].name, drop: steps[2].users - steps[3].users, pct: 100 - steps[3].rate },
    { step: steps[4].name, drop: steps[3].users - steps[4].users, pct: 100 - steps[4].rate },
  ];
  const biggestDrop = drops.reduce((a, b) => a.drop > b.drop ? a : b);
  const overallConv = steps[4].rate.toFixed(1);
  const totalUsers = steps[0].users.toLocaleString();
  const dropUsers = biggestDrop.drop.toLocaleString();
  const dropPct = biggestDrop.pct.toFixed(1);

  const filterParts: string[] = [];
  if (filters) {
    if (filters.age !== 'all') filterParts.push(
      filters.age === '<25' ? (lang === 'es' ? 'menores de 25' : 'under-25s') :
      filters.age === '>50' ? (lang === 'es' ? 'mayores de 50' : 'over-50s') : '26-50'
    );
    if (filters.device !== 'all') filterParts.push(filters.device.toUpperCase());
    if (filters.location !== 'all') filterParts.push(filters.location);
    if (filters.gender !== 'all') filterParts.push(
      filters.gender === 'non-binary' ? (lang === 'es' ? 'no binario' : 'non-binary') :
      lang === 'es' ? (filters.gender === 'female' ? 'mujeres' : 'hombres') :
      (filters.gender === 'female' ? 'female' : 'male')
    );
  }
  const context = filterParts.length > 0 ? ` (${filterParts.join(', ')})` : '';

  if (lang === 'es') {
    return `De ${totalUsers} usuarios${context}, la mayor caída ocurre en ${biggestDrop.step} — ${dropUsers} usuarios (${dropPct}%) no continúan. Conversión total: ${overallConv}%.`;
  }
  return `Of ${totalUsers} users${context}, the biggest drop is at ${biggestDrop.step} — ${dropUsers} users (${dropPct}%) don't continue. Overall conversion: ${overallConv}%.`;
};

const DEVICE_ORDER = ['Android', 'iOS', 'Web'] as const;

const dotColors: Record<string, string> = { iOS: '#008246', Android: '#F59E0B', Web: '#EF4444' };
const badgeStyles: Record<string, string> = {
  iOS: 'bg-[#F0FDF4] text-[#008246]',
  Android: 'bg-[#FFF7ED] text-[#F59E0B]',
  Web: 'bg-[#FEF2F2] text-[#EF4444]',
};

const FunnelChart = ({ funnel, filters }: { funnel: FunnelStep[]; filters?: ActiveFilters }) => {
  const { language, t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [deviceData, setDeviceData] = useState<any[]>([]);

  const isEs = language === 'ES';
  const lang = isEs ? 'es' : 'en';

  useEffect(() => {
    supabase
      .from('vw_device_distribution')
      .select('device_label, total_users, pct_of_parque, conv_rate, purchases_gap_vs_ios')
      .then(({ data }) => { if (data) setDeviceData(data); });
  }, []);

  const insightText = getFunnelInsight(funnel, filters, lang);

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

  const orderedDevices = DEVICE_ORDER.map(label => deviceData.find(d => d.device_label === label)).filter(Boolean);

  return (
    <div
      className="bg-card rounded-2xl shadow-sm p-6 mb-6 animate-fade-in"
      style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}
    >
      <h2 className="text-lg font-bold" style={{ color: '#00164C' }}>{t('conversionFunnel')}</h2>
      <p className="text-xs mb-5" style={{ color: '#384550' }}>{t('funnelSubtitle')}</p>

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
              style={{ left: mousePos.x + 16, top: mousePos.y - 10 }}
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

        {/* Side panel — Device Distribution */}
        <div className="lg:col-span-2 bg-secondary/30 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#00164C' }}>
              {isEs ? 'Distribución por Dispositivo' : 'Device Distribution'}
            </h3>
            <p className="text-xs mb-3" style={{ color: '#66727D' }}>
              {isEs ? 'Distribución del parque vs tasa de conversión' : 'Share of user base vs conversion rate'}
            </p>

            {orderedDevices.length === 0 ? (
              <div className="space-y-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                    <div className="h-5 w-12 rounded-full bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div>
                  {orderedDevices.map((d: any, i: number) => (
                    <div
                      key={d.device_label}
                      className={`flex items-center justify-between py-2 ${i < orderedDevices.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block rounded-full"
                          style={{ width: 10, height: 10, backgroundColor: dotColors[d.device_label] }}
                        />
                        <span className="text-sm font-semibold" style={{ color: '#00164C' }}>{d.device_label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Number(d.pct_of_parque).toFixed(1)}% {isEs ? 'de usuarios' : 'of users'}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeStyles[d.device_label]}`}>
                        {Number(d.conv_rate).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stacked bar */}
                <div className="flex h-2 rounded-full overflow-hidden mt-3">
                  {orderedDevices.map((d: any) => (
                    <div
                      key={d.device_label}
                      style={{
                        width: `${Number(d.pct_of_parque)}%`,
                        backgroundColor: dotColors[d.device_label],
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {orderedDevices.map((d: any) => (
                    <span key={d.device_label}>{d.device_label} {Number(d.pct_of_parque).toFixed(0)}%</span>
                  ))}
                </div>

                {/* Gap hints for Android & Web */}
                {orderedDevices
                  .filter((d: any) => d.device_label !== 'iOS' && Number(d.purchases_gap_vs_ios) > 0)
                  .map((d: any) => (
                    <p key={d.device_label} className="text-xs text-muted-foreground italic mt-2">
                      {d.device_label}: +{Number(d.purchases_gap_vs_ios).toLocaleString()}{' '}
                      {isEs ? 'compras potenciales vs tasa iOS' : 'purchases potential vs iOS rate'}
                    </p>
                  ))}
              </>
            )}
          </div>

          <div className="mt-4">
            {insightText && (
              <div className="bg-[#FFF7ED] border-l-4 border-[#F59E0B] p-3 rounded-r-lg text-sm text-foreground">
                💡 {insightText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
