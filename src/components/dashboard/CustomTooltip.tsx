import React from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border p-3 text-xs max-w-xs text-white" style={{ background: 'hsl(var(--sidebar-bg))', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 4px 20px hsl(var(--sidebar-bg) / 0.28)' }}>
      {label && <p className="mb-2 border-b pb-1 font-semibold text-white" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-3 py-0.5">
          <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
          <span className="font-semibold text-white">{typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}</span>
        </div>
      ))}
      {payload[0]?.payload && (
        <div className="mt-2 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
          {Object.entries(payload[0].payload)
            .filter(([k]) => !['name', 'fill', 'color'].includes(k))
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 py-0.5">
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{k}:</span>
                <span className="font-medium text-white">{String(v)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
