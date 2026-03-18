import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InsightCalloutProps {
  text: string;
  variant?: 'amber' | 'red' | 'blue';
}

const borderColors = {
  amber: 'border-l-[#F59E0B]',
  red: 'border-l-[#EF4444]',
  blue: 'border-l-[hsl(var(--primary))]',
};

const bgColors = {
  amber: 'bg-[#FFF7ED]',
  red: 'bg-[#FEF2F2]',
  blue: 'bg-[hsl(var(--primary)/0.05)]',
};

const InsightCallout = ({ text, variant = 'amber' }: InsightCalloutProps) => (
  <div className={`${bgColors[variant]} border-l-4 ${borderColors[variant]} p-3 rounded-r-lg mt-4`}>
    <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: '#384550' }}>{text}</p>
  </div>
);

export default InsightCallout;
