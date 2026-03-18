import React, { useState, useMemo } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardHeader from './DashboardHeader';
import FilterBar, { DashboardFilters, defaultFilters, isFiltered } from './FilterBar';
import AudienceTabs from './AudienceTabs';
import KPICards from './KPICards';
import FunnelChart from './FunnelChart';
import SegmentBreakdown from './SegmentBreakdown';
import MonthlyTrend from './MonthlyTrend';
import SegmentHeatmap from './SegmentHeatmap';
import ErrorBanner from './ErrorBanner';
import { DashboardSkeleton } from './DashboardSkeleton';

const DashboardTab = () => {
  const { kpis, funnel, segments, monthly, ageDevice, loading, errors } = useDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const filtered = isFiltered(filters);

  // Filter segments by active filters
  const filteredSegments = useMemo(() => {
    if (!filtered) return segments;
    return segments.filter(s => {
      if (filters.age.length > 0 && s.dimension === 'age_group' && !filters.age.includes(s.segment)) return false;
      if (filters.device.length > 0 && s.dimension === 'device') {
        const deviceMap: Record<string, string> = { ios: 'iOS', android: 'Android', web: 'Web' };
        if (!filters.device.includes(deviceMap[s.segment] || s.segment)) return false;
      }
      if (filters.location.length > 0 && s.dimension === 'location' && !filters.location.includes(s.segment)) return false;
      if (filters.gender.length > 0 && s.dimension === 'gender' && !filters.gender.includes(s.segment)) return false;
      return true;
    });
  }, [segments, filters, filtered]);

  // Filter heatmap by age/device
  const filteredAgeDevice = useMemo(() => {
    if (!filtered) return ageDevice;
    return ageDevice.filter(row => {
      if (filters.age.length > 0 && !filters.age.includes(row.age_group)) return false;
      if (filters.device.length > 0) {
        const deviceMap: Record<string, string> = { ios: 'iOS', android: 'Android', web: 'Web' };
        if (!filters.device.includes(deviceMap[row.device] || row.device)) return false;
      }
      return true;
    });
  }, [ageDevice, filters, filtered]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <DashboardHeader segments={segments} filtered={filtered} />
      <FilterBar filters={filters} onChange={setFilters} />

      {errors.kpis && <ErrorBanner message={errors.kpis} />}
      {kpis && <KPICards kpis={kpis} filtered={filtered} />}

      <AudienceTabs />

      {errors.funnel && <ErrorBanner message={errors.funnel} />}
      {funnel.length > 0 && <FunnelChart funnel={funnel} />}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {errors.segments && <ErrorBanner message={errors.segments} />}
          {filteredSegments.length > 0 && <SegmentBreakdown segments={filteredSegments} />}
        </div>
        <div className="lg:col-span-2">
          {errors.monthly && <ErrorBanner message={errors.monthly} />}
          {monthly.length > 0 && <MonthlyTrend monthly={monthly} />}
        </div>
      </div>

      {errors.ageDevice && <ErrorBanner message={errors.ageDevice} />}
      {filteredAgeDevice.length > 0 && <SegmentHeatmap ageDevice={filteredAgeDevice} />}
    </div>
  );
};

export default DashboardTab;
