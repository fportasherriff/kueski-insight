import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

const DEVICE_ORDER = ['Android', 'iOS', 'Web'] as const;
const dotColors: Record<string, string> = { iOS: '#008246', Android: '#F59E0B', Web: '#EF4444' };
const badgeStyles: Record<string, string> = {
  iOS: 'bg-[#F0FDF4] text-[#008246]',
  Android: 'bg-[#FFF7ED] text-[#F59E0B]',
  Web: 'bg-[#FEF2F2] text-[#EF4444]',
};

const DeviceDistribution = () => {
  const { language } = useLanguage();
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const isEs = language === 'ES';

  useEffect(() => {
    supabase
      .from('vw_device_distribution')
      .select('device_label, total_users, pct_of_parque, conv_rate, purchases_gap_vs_ios')
      .then(({ data }) => { if (data) setDeviceData(data); });
  }, []);

  const orderedDevices = DEVICE_ORDER.map(label => deviceData.find(d => d.device_label === label)).filter(Boolean);

  return (
    <div
      className="bg-card rounded-2xl shadow-sm p-6 animate-fade-in"
      style={{ animationDelay: '450ms', animationFillMode: 'backwards' }}
    >
      <h3 className="text-sm font-semibold text-foreground">
        {isEs ? 'Distribución por Dispositivo' : 'Device Distribution'}
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
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
                  <span className="text-sm font-semibold text-foreground">{d.device_label}</span>
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
  );
};

export default DeviceDistribution;
