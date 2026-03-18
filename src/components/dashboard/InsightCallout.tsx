import React from 'react';

interface InsightCalloutProps {
  text: string;
  variant?: 'amber' | 'red' | 'blue';
}

const InsightCallout = ({ text }: InsightCalloutProps) => (
  <div className="bg-[#F5F6FB] border-l-4 border-[#0075FF] p-3 rounded-r-lg mt-4">
    <p className="text-sm leading-relaxed" style={{ color: '#384550' }}>{text}</p>
  </div>
);

export default InsightCallout;
