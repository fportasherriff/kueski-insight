import React from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs max-w-xs">
      {label && <p className="font-semibold text-[#141C22] mb-2 border-b pb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-3 py-0.5">
          <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
          <span className="font-semibold text-[#141C22]">{typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}</span>
        </div>
      ))}
      {payload[0]?.payload && (
        <div className="mt-2 pt-1 border-t text-[#384550]">
          {Object.entries(payload[0].payload)
            .filter(([k]) => !['name', 'fill', 'color'].includes(k))
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2 py-0.5">
                <span className="text-[#384550]">{k}:</span>
                <span className="font-medium text-[#141C22]">{String(v)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
