import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SegmentRow } from '@/hooks/useDashboardData';

const DashboardHeader = ({ segments, filtered }: { segments: SegmentRow[]; filtered?: boolean }) => {
  const { t } = useLanguage();

  const handleExport = () => {
    if (!segments.length) return;
    const headers = ['Dimension','Segment','Users','Onboarded','Viewed','Added to Cart',
                     'Purchased','Reg→Onb %','Onb→View %','View→Cart %','Cart→Purch %','Overall Conv %'];
    const rows = segments.map(d => [
      d.dimension, d.segment, d.n, d.onboarded, d.viewed_product, d.added_to_cart,
      d.purchased, d.step_reg_to_onb, d.step_onb_to_view, d.step_view_to_cart,
      d.step_cart_to_purch, d.overall_conv
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kueski-funnel-segments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-[32px] font-extrabold text-foreground">{t('dashboard')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('dashboardSubtitle')}</p>
      </div>
      <div className="flex items-center gap-3">
        {filtered && (
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            {t('filteredView')}
          </span>
        )}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          <Download size={16} />
          {t('exportCsv')}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
