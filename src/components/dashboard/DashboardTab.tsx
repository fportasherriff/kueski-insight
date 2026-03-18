import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { FunnelStep } from '@/hooks/useDashboardData';
import DashboardHeader from './DashboardHeader';
import FilterBar, { ActiveFilters, defaultFilters, isFiltered } from './FilterBar';
import AudienceTabs, { Audience, getAudienceHighlights } from './AudienceTabs';
import KPICards from './KPICards';
import FunnelChart from './FunnelChart';
import SegmentBreakdown from './SegmentBreakdown';
import MonthlyTrend from './MonthlyTrend';
import SegmentHeatmap from './SegmentHeatmap';
import ErrorBanner from './ErrorBanner';
import { DashboardSkeleton } from './DashboardSkeleton';
import { supabase } from '@/lib/supabaseClient';

const DashboardTab = () => {
  const { kpis, funnel, segments, monthly, ageDevice, loading, errors } = useDashboardData();
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  const [audience, setAudience] = useState<Audience>('exec');
  const [filteredFunnel, setFilteredFunnel] = useState<FunnelStep[] | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const filtered = isFiltered(filters);
  const highlights = useMemo(() => getAudienceHighlights(audience), [audience]);

  // Fetch filtered funnel from kueski_dataset when filters active
  useEffect(() => {
    if (!filtered) {
      setFilteredFunnel(null);
      return;
    }

    const fetchFiltered = async () => {
      setFilterLoading(true);
      let query = supabase.from('kueski_dataset').select(
        'onboarded, viewed_product, added_to_cart, purchased'
      );
      if (filters.age !== 'all') query = query.eq('age_group', filters.age);
      if (filters.device !== 'all') query = query.eq('device', filters.device);
      if (filters.location !== 'all') query = query.eq('location', filters.location);
      if (filters.gender !== 'all') query = query.eq('gender', filters.gender);

      const { data, error } = await query;
      if (error || !data) {
        setFilteredFunnel(null);
        setFilterLoading(false);
        return;
      }

      const n = data.length;
      const onboarded = data.filter((r: any) => r.onboarded === 1).length;
      const viewed = data.filter((r: any) => r.viewed_product === 1).length;
      const cart = data.filter((r: any) => r.added_to_cart === 1).length;
      const purchased = data.filter((r: any) => r.purchased === 1).length;

      setFilteredFunnel([
        { name: 'Registered', users: n, rate: 100, drop: 0, dropPct: 0 },
        { name: 'Onboarded', users: onboarded, rate: Math.round(onboarded / n * 1000) / 10, drop: n - onboarded, dropPct: Math.round((1 - onboarded / n) * 1000) / 10 },
        { name: 'Viewed Product', users: viewed, rate: Math.round(viewed / onboarded * 1000) / 10, drop: onboarded - viewed, dropPct: Math.round((1 - viewed / n) * 1000) / 10 },
        { name: 'Added to Cart', users: cart, rate: Math.round(cart / viewed * 1000) / 10, drop: viewed - cart, dropPct: Math.round((1 - cart / n) * 1000) / 10 },
        { name: 'Purchased', users: purchased, rate: Math.round(purchased / cart * 1000) / 10, drop: cart - purchased, dropPct: Math.round((1 - purchased / n) * 1000) / 10 },
      ]);
      setFilterLoading(false);
    };

    fetchFiltered();
  }, [filters, filtered]);

  // Filter segments by active filters
  const filteredSegments = useMemo(() => {
    if (!filtered) return segments;
    return segments.filter(s => {
      if (filters.age !== 'all' && s.dimension === 'age_group' && s.segment !== filters.age) return false;
      if (filters.device !== 'all' && s.dimension === 'device' && s.segment !== filters.device) return false;
      if (filters.location !== 'all' && s.dimension === 'location' && s.segment !== filters.location) return false;
      if (filters.gender !== 'all' && s.dimension === 'gender' && s.segment !== filters.gender) return false;
      return true;
    });
  }, [segments, filters, filtered]);

  // Filter heatmap
  const filteredAgeDevice = useMemo(() => {
    if (!filtered) return ageDevice;
    return ageDevice.filter(row => {
      if (filters.age !== 'all' && row.age_group !== filters.age) return false;
      if (filters.device !== 'all' && row.device !== filters.device) return false;
      return true;
    });
  }, [ageDevice, filters, filtered]);

  const handleExport = useCallback(() => {
    if (!segments.length) return;
    const headers = ['Dimension', 'Segment', 'Users', 'Onboarded', 'Viewed', 'Added to Cart',
      'Purchased', 'Reg→Onb %', 'Onb→View %', 'View→Cart %', 'Cart→Purch %', 'Overall Conv %'];
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
  }, [segments]);

  if (loading) return <DashboardSkeleton />;

  const activeFunnel = filteredFunnel || funnel;

  return (
    <div className="space-y-6">
      <DashboardHeader segments={segments} filtered={filtered} />
      <FilterBar filters={filters} onChange={setFilters} onExport={handleExport} />

      <AudienceTabs active={audience} onChange={setAudience} />

      {errors.kpis && <ErrorBanner message={errors.kpis} />}
      {kpis && <KPICards kpis={kpis} filtered={filtered} highlights={highlights} />}

      {errors.funnel && <ErrorBanner message={errors.funnel} />}
      {filterLoading ? (
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        activeFunnel.length > 0 && <FunnelChart funnel={activeFunnel} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {errors.segments && <ErrorBanner message={errors.segments} />}
          {filteredSegments.length > 0 && <SegmentBreakdown segments={filteredSegments} highlights={highlights} />}
        </div>
        <div className="lg:col-span-2">
          {errors.monthly && <ErrorBanner message={errors.monthly} />}
          {monthly.length > 0 && <MonthlyTrend monthly={monthly} />}
        </div>
      </div>

      {errors.ageDevice && <ErrorBanner message={errors.ageDevice} />}
      {filteredAgeDevice.length > 0 && <SegmentHeatmap ageDevice={filteredAgeDevice} highlights={highlights} />}
    </div>
  );
};

export default DashboardTab;
