import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { FunnelStep, DashboardKPI, MonthlyRow, SegmentRow } from '@/hooks/useDashboardData';
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

const buildFunnelFromGlobal = (d: any): FunnelStep[] => {
  if (!d) return [];
  return [
    { name: 'Registered',     users: d.registered,     rate: 100,                          drop: 0,                   dropPct: 0 },
    { name: 'Onboarded',      users: d.onboarded,      rate: Number(d.step_reg_to_onb),    drop: d.drop_reg_to_onb,   dropPct: Number(d.pct_registered_to_onboarded) },
    { name: 'Viewed Product', users: d.viewed_product,  rate: Number(d.step_onb_to_view),   drop: d.drop_onb_to_view,  dropPct: Number(d.pct_registered_to_viewed) },
    { name: 'Added to Cart',  users: d.added_to_cart,   rate: Number(d.step_view_to_cart),  drop: d.drop_view_to_cart,  dropPct: Number(d.pct_registered_to_cart) },
    { name: 'Purchased',      users: d.purchased,       rate: Number(d.step_cart_to_purch), drop: d.drop_cart_to_purch, dropPct: Number(d.pct_registered_to_purchased) },
  ];
};

const computeKPIsFromSteps = (steps: FunnelStep[]): Partial<DashboardKPI> | null => {
  if (!steps?.length || steps.length < 5) return null;
  const reg = steps[0].users;
  const purchased = steps[4].users;
  const cart = steps[3].users;
  return {
    overall_conv_rate: steps[4].rate,
    onboarding_rate: steps[1].rate,
    cart_to_purch_rate: cart > 0 ? Math.round(purchased / cart * 1000) / 10 : 0,
    total_users: reg,
    total_purchases: purchased,
  };
};

const DashboardTab = () => {
  const { kpis, funnel, segments, monthly, ageDevice, loading, errors } = useDashboardData();
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);
  const [audience, setAudience] = useState<Audience>('exec');
  const [filteredFunnel, setFilteredFunnel] = useState<FunnelStep[] | null>(null);
  const [filteredMonthly, setFilteredMonthly] = useState<MonthlyRow[] | null>(null);
  const [filteredSegments, setFilteredSegments] = useState<SegmentRow[] | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const filtered = isFiltered(filters);
  const highlights = useMemo(() => getAudienceHighlights(audience), [audience]);

  // Fetch filtered funnel from vw_funnel_filterable
  useEffect(() => {
    if (!filtered) {
      setFilteredFunnel(null);
      return;
    }

    const fetchFiltered = async () => {
      setFilterLoading(true);

      let query = supabase
        .from('vw_funnel_filterable')
        .select('registered,onboarded,viewed_product,added_to_cart,purchased');

      if (filters.age !== 'all') query = query.eq('age_group', filters.age);
      if (filters.device !== 'all') query = query.eq('device', filters.device);
      if (filters.location !== 'all') query = query.eq('location', filters.location);
      if (filters.gender !== 'all') query = query.eq('gender', filters.gender);

      const { data, error } = await query;
      if (error || !data?.length) {
        setFilteredFunnel(null);
        setFilterLoading(false);
        return;
      }

      const agg = data.reduce((acc, row) => ({
        registered:     acc.registered     + Number(row.registered),
        onboarded:      acc.onboarded      + Number(row.onboarded),
        viewed_product: acc.viewed_product + Number(row.viewed_product),
        added_to_cart:  acc.added_to_cart  + Number(row.added_to_cart),
        purchased:      acc.purchased      + Number(row.purchased),
      }), { registered: 0, onboarded: 0, viewed_product: 0, added_to_cart: 0, purchased: 0 });

      const s = (a: number, b: number) => b > 0 ? Math.round(a / b * 1000) / 10 : 0;

      setFilteredFunnel([
        { name: 'Registered',     users: agg.registered,     rate: 100,                                           drop: agg.registered - agg.onboarded,          dropPct: s(agg.registered - agg.onboarded, agg.registered) },
        { name: 'Onboarded',      users: agg.onboarded,      rate: s(agg.onboarded, agg.registered),              drop: agg.onboarded - agg.viewed_product,      dropPct: s(agg.onboarded - agg.viewed_product, agg.onboarded) },
        { name: 'Viewed Product', users: agg.viewed_product,  rate: s(agg.viewed_product, agg.onboarded),          drop: agg.viewed_product - agg.added_to_cart,  dropPct: s(agg.viewed_product - agg.added_to_cart, agg.viewed_product) },
        { name: 'Added to Cart',  users: agg.added_to_cart,   rate: s(agg.added_to_cart, agg.viewed_product),      drop: agg.added_to_cart - agg.purchased,       dropPct: s(agg.added_to_cart - agg.purchased, agg.added_to_cart) },
        { name: 'Purchased',      users: agg.purchased,       rate: s(agg.purchased, agg.added_to_cart),           drop: 0, dropPct: 0 },
      ]);
      setFilterLoading(false);
    };

    fetchFiltered();
  }, [filters, filtered]);

  // Fetch filtered monthly trends
  useEffect(() => {
    if (!filtered) {
      setFilteredMonthly(null);
      return;
    }

    const fetchMonthlyFiltered = async () => {
      let query = supabase
        .from('vw_funnel_by_month_filterable')
        .select('cohort_month, cohort_label, registered, onboarded, viewed_product, added_to_cart, purchased');

      if (filters.age !== 'all') query = query.eq('age_group', filters.age);
      if (filters.device !== 'all') query = query.eq('device', filters.device);
      if (filters.location !== 'all') query = query.eq('location', filters.location);
      if (filters.gender !== 'all') query = query.eq('gender', filters.gender);

      const { data, error } = await query;
      if (error || !data?.length) {
        setFilteredMonthly(null);
        return;
      }

      const grouped: Record<string, {
        cohort_label: string;
        registered: number;
        onboarded: number;
        viewed_product: number;
        added_to_cart: number;
        purchased: number;
      }> = {};

      data.forEach(row => {
        const key = row.cohort_month;
        if (!grouped[key]) {
          grouped[key] = {
            cohort_label: row.cohort_label,
            registered: 0, onboarded: 0,
            viewed_product: 0, added_to_cart: 0, purchased: 0,
          };
        }
        grouped[key].registered += Number(row.registered);
        grouped[key].onboarded += Number(row.onboarded);
        grouped[key].viewed_product += Number(row.viewed_product);
        grouped[key].added_to_cart += Number(row.added_to_cart);
        grouped[key].purchased += Number(row.purchased);
      });

      const pct = (a: number, b: number) => b > 0 ? Math.round(a / b * 1000) / 10 : 0;

      setFilteredMonthly(
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, g]) => ({
            cohort_label: g.cohort_label,
            overall_conv: pct(g.purchased, g.registered),
            step_reg_to_onb: pct(g.onboarded, g.registered),
            step_onb_to_view: pct(g.viewed_product, g.onboarded),
            step_view_to_cart: pct(g.added_to_cart, g.viewed_product),
            step_cart_to_purch: pct(g.purchased, g.added_to_cart),
          }))
      );
    };

    fetchMonthlyFiltered();
  }, [filters, filtered]);

  // Fetch filtered segment breakdown
  useEffect(() => {
    if (!filtered) {
      setFilteredSegments(null);
      return;
    }

    const fetchSegments = async () => {
      let query = supabase
        .from('vw_segment_breakdown_filterable')
        .select('age_group, device, location, gender, n, onboarded, viewed_product, added_to_cart, purchased');

      if (filters.age !== 'all') query = query.eq('age_group', filters.age);
      if (filters.device !== 'all') query = query.eq('device', filters.device);
      if (filters.location !== 'all') query = query.eq('location', filters.location);
      if (filters.gender !== 'all') query = query.eq('gender', filters.gender);

      const { data, error } = await query;
      if (error || !data?.length) {
        setFilteredSegments(null);
        return;
      }

      const pct = (a: number, b: number) => b > 0 ? Math.round(a / b * 1000) / 10 : 0;

      const aggregate = (rows: typeof data, dimKey: string, dimValue: string) => {
        const filtered = rows.filter(r => (r as any)[dimKey] === dimValue);
        if (!filtered.length) return null;
        const totals = filtered.reduce((acc, r) => ({
          n: acc.n + Number(r.n),
          onboarded: acc.onboarded + Number(r.onboarded),
          viewed_product: acc.viewed_product + Number(r.viewed_product),
          added_to_cart: acc.added_to_cart + Number(r.added_to_cart),
          purchased: acc.purchased + Number(r.purchased),
        }), { n: 0, onboarded: 0, viewed_product: 0, added_to_cart: 0, purchased: 0 });
        return {
          n: totals.n,
          onboarded: totals.onboarded,
          viewed_product: totals.viewed_product,
          added_to_cart: totals.added_to_cart,
          purchased: totals.purchased,
          step_reg_to_onb: pct(totals.onboarded, totals.n),
          step_onb_to_view: pct(totals.viewed_product, totals.onboarded),
          step_view_to_cart: pct(totals.added_to_cart, totals.viewed_product),
          step_cart_to_purch: pct(totals.purchased, totals.added_to_cart),
          overall_conv: pct(totals.purchased, totals.n),
        };
      };

      const result: SegmentRow[] = [];

      if (filters.age === 'all') {
        for (const seg of ['<25', '26-50', '>50']) {
          const agg = aggregate(data, 'age_group', seg);
          if (agg) result.push({ dimension: 'age_group', segment: seg, ...agg });
        }
      }
      if (filters.device === 'all') {
        for (const seg of ['ios', 'android', 'web']) {
          const agg = aggregate(data, 'device', seg);
          if (agg) result.push({ dimension: 'device', segment: seg, ...agg });
        }
      }
      if (filters.location === 'all') {
        for (const seg of ['CDMX', 'GDL', 'MTY', 'Other']) {
          const agg = aggregate(data, 'location', seg);
          if (agg) result.push({ dimension: 'location', segment: seg, ...agg });
        }
      }
      if (filters.gender === 'all') {
        for (const seg of ['female', 'male', 'non-binary']) {
          const agg = aggregate(data, 'gender', seg);
          if (agg) result.push({ dimension: 'gender', segment: seg, ...agg });
        }
      }

      setFilteredSegments(result);
    };

    fetchSegments();
  }, [filters, filtered]);

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

  const activeSegments = filteredSegments || segments;
  const activeFunnel = filteredFunnel || funnel;

  // Compute KPIs from filtered funnel when filters active
  const computedKpis = filtered && filteredFunnel ? computeKPIsFromSteps(filteredFunnel) : null;
  const activeKpis = computedKpis && kpis
    ? {
        ...kpis,
        overall_conv_rate: computedKpis.overall_conv_rate!,
        onboarding_rate: computedKpis.onboarding_rate!,
        cart_to_purch_rate: computedKpis.cart_to_purch_rate!,
        total_users: computedKpis.total_users!,
        total_purchases: computedKpis.total_purchases!,
      }
    : kpis;

  return (
    <div className="space-y-6">
      <DashboardHeader segments={segments} filtered={filtered} />
      <FilterBar filters={filters} onChange={setFilters} onExport={handleExport} />

      <AudienceTabs active={audience} onChange={setAudience} />

      {errors.kpis && <ErrorBanner message={errors.kpis} />}
      {activeKpis && <KPICards kpis={activeKpis} filtered={filtered} highlights={highlights} />}

      {errors.funnel && <ErrorBanner message={errors.funnel} />}
      {filterLoading ? (
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        activeFunnel.length > 0 && <FunnelChart funnel={activeFunnel} filters={filters} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3 flex flex-col">
          {errors.segments && <ErrorBanner message={errors.segments} />}
          {(activeSegments).length > 0 && <SegmentBreakdown segments={activeSegments} highlights={highlights} audience={audience} filters={filters} />}
        </div>
        <div className="lg:col-span-2 flex flex-col">
          {errors.monthly && <ErrorBanner message={errors.monthly} />}
          {(filteredMonthly || monthly).length > 0 && <MonthlyTrend monthly={filteredMonthly || monthly} />}
        </div>
      </div>

      {errors.ageDevice && <ErrorBanner message={errors.ageDevice} />}
      {filteredAgeDevice.length > 0 && <SegmentHeatmap ageDevice={filteredAgeDevice} highlights={highlights} />}
    </div>
  );
};

export default DashboardTab;
