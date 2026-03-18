import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SegmentRow } from '@/hooks/useDashboardData';

const DashboardHeader = ({ segments }: { segments: SegmentRow[] }) => {
  const { t } = useLanguage();

  const handleExport = () => {
    if (!segments.length) return;
    const headers = Object.keys(segments[0]);
    const csv = [
      headers.join(','),
      ...segments.map(row => headers.map(h => (row as any)[h]).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'funnel_segments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-[32px] font-extrabold text-foreground">{t('dashboard')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('dashboardSubtitle')}</p>
      </div>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
      >
        <Download size={16} />
        {t('exportCsv')}
      </button>
    </div>
  );
};

export default DashboardHeader;
