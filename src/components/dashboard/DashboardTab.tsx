import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardHeader from './DashboardHeader';
import KPICards from './KPICards';
import FunnelChart from './FunnelChart';
import SegmentBreakdown from './SegmentBreakdown';
import MonthlyTrend from './MonthlyTrend';
import SegmentHeatmap from './SegmentHeatmap';
import ErrorBanner from './ErrorBanner';
import { DashboardSkeleton } from './DashboardSkeleton';

const DashboardTab = () => {
  const { kpis, funnel, segments, monthly, ageDevice, loading, errors } = useDashboardData();

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <DashboardHeader segments={segments} />

      {errors.kpis && <ErrorBanner message={errors.kpis} />}
      {kpis && <KPICards kpis={kpis} />}

      {errors.funnel && <ErrorBanner message={errors.funnel} />}
      {funnel.length > 0 && <FunnelChart funnel={funnel} />}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {errors.segments && <ErrorBanner message={errors.segments} />}
          {segments.length > 0 && <SegmentBreakdown segments={segments} />}
        </div>
        <div className="lg:col-span-2">
          {errors.monthly && <ErrorBanner message={errors.monthly} />}
          {monthly.length > 0 && <MonthlyTrend monthly={monthly} />}
        </div>
      </div>

      {errors.ageDevice && <ErrorBanner message={errors.ageDevice} />}
      {ageDevice.length > 0 && <SegmentHeatmap ageDevice={ageDevice} />}
    </div>
  );
};

export default DashboardTab;
