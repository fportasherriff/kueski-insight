import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface DashboardKPI {
  total_users: number;
  onboarding_rate: number;
  overall_conv_rate: number;
  cart_to_purch_rate: number;
  total_purchases: number;
  biggest_drop_pct: number;
  best_segment_conv: number;
  worst_segment_conv: number;
  best_to_worst_ratio: number;
  onboarding_signal: string;
  conv_signal: string;
  cart_signal: string;
}

export interface FunnelStep {
  name: string;
  users: number;
  rate: number;
  drop: number;
  dropPct: number;
}

export interface SegmentRow {
  dimension: string;
  segment: string;
  n: number;
  onboarded: number;
  viewed_product: number;
  added_to_cart: number;
  purchased: number;
  step_reg_to_onb: number;
  step_onb_to_view: number;
  step_view_to_cart: number;
  step_cart_to_purch: number;
  overall_conv: number;
}

export interface MonthlyRow {
  cohort_label: string;
  overall_conv: number;
  step_reg_to_onb: number;
  step_onb_to_view: number;
  step_view_to_cart: number;
  step_cart_to_purch: number;
}

export interface AgeDeviceRow {
  age_group: string;
  device: string;
  n: number;
  overall_conv: number;
  delta_vs_best: number;
  users_below_best: number;
  step_reg_to_onb: number;
  step_onb_to_view: number;
  step_view_to_cart: number;
  step_cart_to_purch: number;
}

interface DashboardData {
  kpis: DashboardKPI | null;
  funnel: FunnelStep[];
  segments: SegmentRow[];
  monthly: MonthlyRow[];
  ageDevice: AgeDeviceRow[];
  loading: boolean;
  errors: Record<string, string>;
}

export function useDashboardData(): DashboardData {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [segments, setSegments] = useState<SegmentRow[]>([]);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);
  const [ageDevice, setAgeDevice] = useState<AgeDeviceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchAll() {
      const errs: Record<string, string> = {};

      const [kpiRes, funnelRes, segRes, monthRes, adRes] = await Promise.all([
        supabase.from('vw_dashboard_kpis').select('*').single(),
        supabase.from('vw_funnel_global').select('*').single(),
        supabase.from('vw_funnel_by_segment').select('*'),
        supabase.from('vw_funnel_by_month').select('*'),
        supabase.from('vw_funnel_age_x_device').select('*'),
      ]);

      if (kpiRes.error) errs.kpis = kpiRes.error.message;
      else setKpis(kpiRes.data);

      if (funnelRes.error) {
        errs.funnel = funnelRes.error.message;
      } else if (funnelRes.data) {
        const d = funnelRes.data;
        setFunnel([
          { name: 'Registered',     users: d.registered,     rate: 100,                          drop: 0,                   dropPct: 0 },
          { name: 'Onboarded',      users: d.onboarded,      rate: Number(d.step_reg_to_onb),    drop: d.drop_reg_to_onb,   dropPct: Number(d.pct_registered_to_onboarded) },
          { name: 'Viewed Product', users: d.viewed_product,  rate: Number(d.step_onb_to_view),   drop: d.drop_onb_to_view,  dropPct: Number(d.pct_registered_to_viewed) },
          { name: 'Added to Cart',  users: d.added_to_cart,   rate: Number(d.step_view_to_cart),  drop: d.drop_view_to_cart, dropPct: Number(d.pct_registered_to_cart) },
          { name: 'Purchased',      users: d.purchased,       rate: Number(d.step_cart_to_purch), drop: d.drop_cart_to_purch, dropPct: Number(d.pct_registered_to_purchased) },
        ]);
      }

      if (segRes.error) errs.segments = segRes.error.message;
      else setSegments(segRes.data || []);

      if (monthRes.error) errs.monthly = monthRes.error.message;
      else setMonthly(monthRes.data || []);

      if (adRes.error) errs.ageDevice = adRes.error.message;
      else setAgeDevice(adRes.data || []);

      setErrors(errs);
      setLoading(false);
    }

    fetchAll();
  }, []);

  return { kpis, funnel, segments, monthly, ageDevice, loading, errors };
}
