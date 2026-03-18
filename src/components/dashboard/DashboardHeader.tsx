import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SegmentRow } from '@/hooks/useDashboardData';

const DashboardHeader = ({ segments, filtered }: { segments: SegmentRow[]; filtered?: boolean }) => {
  const { language, t } = useLanguage();

  const title = language === 'ES' ? 'BNPL - ANÁLISIS DE FUNNEL' : 'BNPL - FUNNEL ANALYTICS';
  const subtitle = language === 'ES' ? '100,000 usuarios · Ene–Abr 2025' : '100,000 users · Jan–Apr 2025';

  return (
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#00164C' }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: '#384550' }}>{subtitle}</p>
        </div>
        {filtered && (
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {t('filteredLabel')}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
