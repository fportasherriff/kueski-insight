import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface DashboardKPI {
  overall_conv_rate: number;
  conv_signal: string;
  onboarding_rate: number;
  onboarding_signal: string;
  cart_to_purch_rate: number;
  cart_signal: string;
  best_to_worst_ratio: number;
}

export interface FunnelStep {
  step_order: number;
  step_name: string;
  users: number;
  step_rate: number;
  cum_rate: number;
}

export interface SegmentRow {
  dimension: string;
  segment: string;
  total_users: number;
  overall_conv: number;
  step_reg_to_onb: number;
  step_onb_to_view: number;
  step_view_to_cart: number;
  step_cart_to_purch: number;
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
  overall_conv: number;
  total_users: number;
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
        supabase.from('vw_funnel_global').select('*').order('step_order'),
        supabase.from('vw_funnel_by_segment').select('*'),
        supabase.from('vw_funnel_by_month').select('*'),
        supabase.from('vw_funnel_age_x_device').select('*'),
      ]);

      if (kpiRes.error) errs.kpis = kpiRes.error.message;
      else setKpis(kpiRes.data);

      if (funnelRes.error) errs.funnel = funnelRes.error.message;
      else setFunnel(funnelRes.data || []);

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
