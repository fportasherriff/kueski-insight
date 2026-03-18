import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SegmentRow } from '@/hooks/useDashboardData';

const DashboardHeader = ({ segments, filtered }: { segments: SegmentRow[]; filtered?: boolean }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[32px] font-extrabold" style={{ color: '#00164C' }}>{t('dashboard')}</h1>
          <p className="text-sm mt-1" style={{ color: '#66727D' }}>{t('dashboardSubtitle')}</p>
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
