import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface PresentationData {
  funnel: any;
  segments: any[];
  ageDevice: any[];
  hypotheses: any[];
  roadmap: any[];
  experiment: any[];
  kpis: any;
}

const TOTAL_SLIDES = 7;

/* ─── Slide 1 ─── */
const Slide1 = ({ t }: { t: (k: string) => string }) => (
  <div className="text-left space-y-6 max-w-3xl mx-auto px-8 py-10">
    <img
      src="https://cdn.prod.website-files.com/642533e2943fc871d1dc670d/642d4d9f4b2a5abd56c16739_Logo.svg"
      alt="Kueski"
      className="h-8"
    />
    <hr className="border-gray-200" />
    <h1 className="text-3xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s1_title')}</h1>
    <p className="text-lg mt-2" style={{ color: '#384550' }}>{t('pres_s1_subtitle')}</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8 text-sm" style={{ color: '#384550' }}>
      <span>{t('pres_s1_dataset')}</span>
      <span>{t('pres_s1_presented')}</span>
    </div>

    <hr className="border-gray-200" />

    <div className="bg-[#F5F6FB] rounded-xl p-6 mt-6">
      <p className="font-bold" style={{ color: '#00164C' }}>{t('pres_s1_problem_title')}</p>
      <p className="text-sm mt-2" style={{ color: '#384550' }}>{t('pres_s1_problem_text')}</p>
    </div>

    <div className="flex flex-wrap gap-8 mt-6 text-sm text-muted-foreground">
      <span>{t('pres_s1_steps')}</span>
      <span>{t('pres_s1_dims')}</span>
      <span>{t('pres_s1_initiatives')}</span>
      <span>{t('pres_s1_experiment')}</span>
    </div>
  </div>
);

/* ─── Slide 2 ─── */
const Slide2 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const f = data.funnel;
  const steps = [
    { name: t('registered'), users: f?.registered, rate: null, drop: null },
    { name: t('onboarded'), users: f?.onboarded, rate: f?.step_reg_to_onb, drop: (f?.registered ?? 0) - (f?.onboarded ?? 0) },
    { name: t('viewedProduct'), users: f?.viewed_product, rate: f?.step_onb_to_view, drop: (f?.onboarded ?? 0) - (f?.viewed_product ?? 0) },
    { name: t('addedToCart'), users: f?.added_to_cart, rate: f?.step_view_to_cart, drop: (f?.viewed_product ?? 0) - (f?.added_to_cart ?? 0) },
    { name: t('purchased'), users: f?.purchased, rate: f?.step_cart_to_purch, drop: (f?.added_to_cart ?? 0) - (f?.purchased ?? 0) },
  ];

  const worst2 = data.ageDevice.slice(0, 2);
  const kpis = data.kpis;

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s2_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s2_subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Left – Global Drop-offs */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>{t('pres_s2_global')}</p>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm" style={{ color: '#384550' }}>
                  <span className="font-medium">{s.name}</span>
                  <span>{(s.users ?? 0).toLocaleString()}{s.rate != null ? ` · ${s.rate}%` : ''}</span>
                </div>
                {s.drop != null && s.drop > 0 && (
                  <p className="text-xs" style={{ color: '#EF4444' }}>▼ {s.drop.toLocaleString()} {t('pres_s2_dropped')}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Middle – 2 Worst */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>{t('pres_s2_damaging')}</p>
          <div className="space-y-4">
            {worst2.map((row: any, i: number) => (
              <div key={i} className="bg-[#F5F6FB] rounded-xl p-4 text-center">
                <span className="inline-block bg-white text-xs font-bold px-2 py-1 rounded-full mb-2" style={{ color: '#00164C' }}>
                  {row.age_group} × {(row.device ?? '').toUpperCase()}
                </span>
                <p className="text-4xl font-extrabold" style={{ color: '#EF4444' }}>{row.overall_conv}%</p>
                <p className="text-xs text-muted-foreground">{t('pres_s2_overall_conv')}</p>
                {row.delta_vs_best != null && (
                  <p className="text-xs mt-1" style={{ color: '#384550' }}>{Math.abs(row.delta_vs_best)}pp {t('pres_s2_below_best')}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right – Best vs Worst */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>{t('pres_s2_gap')}</p>
          <p className="text-5xl font-extrabold" style={{ color: '#0075FF' }}>{kpis?.best_to_worst_ratio ?? '37.7'}×</p>
          <p className="text-xs text-muted-foreground mt-2">{t('pres_s2_gap_label')}</p>
          <div className="flex flex-col gap-2 mt-4">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-50" style={{ color: '#008246' }}>
              {t('pres_s2_best_label')}: {kpis?.best_segment_conv ?? '22.6'}% (iOS 26-50)
            </span>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-50" style={{ color: '#EF4444' }}>
              {t('pres_s2_worst_label')}: {kpis?.worst_segment_conv ?? '0.6'}% (Web &gt;50)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Slide 3 ─── */
const Slide3 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const findSeg = (dim: string, val: string) => data.segments.find((s: any) => s.dimension === dim && s.segment_value === val);
  const age50 = findSeg('age_group', '>50');
  const age25 = findSeg('age_group', '<25');
  const ios = findSeg('device', 'ios');
  const web = findSeg('device', 'web');
  const other = findSeg('location', 'Other');

  const cards = [
    {
      border: '#0075FF', badge: 'KPI #1', name: t('pres_s3_k1_name'),
      metric: `>50: ${age50?.step_reg_to_onb ?? '39.5'}% vs <25: ${age25?.step_reg_to_onb ?? '84.9'}%`,
      why: t('pres_s3_k1_why'), watch: t('pres_s3_k1_watch'),
    },
    {
      border: '#008246', badge: 'KPI #2', name: t('pres_s3_k2_name'),
      metric: `iOS: ${ios?.overall_conv ?? '18.2'}% vs Web: ${web?.overall_conv ?? '2.6'}%`,
      why: t('pres_s3_k2_why'), watch: t('pres_s3_k2_watch'),
    },
    {
      border: '#EF4444', badge: 'KPI #3', name: t('pres_s3_k3_name'),
      metric: `Other: ${other?.step_cart_to_purch ?? '31.2'}% vs Cities avg: ~50.6%`,
      why: t('pres_s3_k3_why'), watch: t('pres_s3_k3_watch'),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s3_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s3_subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-[#F5F6FB] rounded-xl p-5 border-t-4" style={{ borderColor: c.border }}>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: c.border }}>{c.badge}</span>
            <p className="font-bold text-sm mt-3" style={{ color: '#00164C' }}>{c.name}</p>
            <p className="text-sm font-semibold mt-2" style={{ color: c.border }}>{c.metric}</p>
            <p className="text-xs mt-3" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_why')}:</span> {c.why}</p>
            <p className="text-xs mt-2" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_watch')}:</span> {c.watch}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Slide 4 ─── */
const Slide4 = ({ t }: { t: (k: string) => string }) => {
  const hyps = [
    { color: '#0075FF', num: 'H1', title: t('pres_s4_h1_title'), evidence: t('pres_s4_h1_evidence'), validate: t('pres_s4_h1_validate') },
    { color: '#008246', num: 'H2', title: t('pres_s4_h2_title'), evidence: t('pres_s4_h2_evidence'), validate: t('pres_s4_h2_validate') },
    { color: '#7D6CFF', num: 'H3', title: t('pres_s4_h3_title'), evidence: t('pres_s4_h3_evidence'), validate: t('pres_s4_h3_validate') },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s4_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s4_subtitle')}</p>
      <div className="space-y-4 mt-4">
        {hyps.map((h, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: h.color }}>
              {h.num}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: '#00164C' }}>{h.title}</p>
              <p className="text-xs mt-2" style={{ color: '#384550' }}>
                <span className="font-semibold">{t('pres_s4_evidence')}:</span> {h.evidence}
              </p>
              <p className="text-xs mt-2" style={{ color: '#384550' }}>
                <span className="font-semibold">{t('pres_s4_validate')}:</span> {h.validate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Slide 5 ─── */
const Slide5 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const priorityColors = ['#EF4444', '#F59E0B', '#008246'];
  const rows = data.roadmap.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s5_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s5_subtitle')}</p>

      <div className="space-y-3 mt-4">
        {rows.map((r: any, i: number) => {
          const clr = priorityColors[i] ?? '#384550';
          return (
            <div key={i} className="rounded-xl p-5 border-l-4 bg-white border border-gray-100" style={{ borderLeftColor: clr }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold" style={{ backgroundColor: clr }}>
                    #{r.priority_rank}
                  </span>
                  <p className="font-bold text-sm mt-1" style={{ color: '#00164C' }}>{r.initiative_name}</p>
                  <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 mt-1 inline-block">{r.target_quarter}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: '#384550' }}>
                  <span>{t('pres_s5_reach')}: {(r.reach ?? 0).toLocaleString()}</span>
                  <span>{t('pres_s5_impact')}: {r.impact_score}</span>
                  <span>{t('pres_s5_conf')}: {r.confidence_pct}%</span>
                  <span>{t('pres_s5_effort')}: {r.effort_weeks}w</span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: clr }}>{r.rice_score}</p>
                  <p className="text-xs text-muted-foreground">{t('pres_s5_rice')}</p>
                </div>
                <div className="text-xs" style={{ color: '#384550' }}>
                  <p className="font-semibold">{r.current_rate}% → {r.target_rate}%</p>
                  <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 mt-1 text-xs">{r.critical_step}</span>
                  <p className="italic mt-1">{(r.rationale ?? '').slice(0, 60)}…</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rows[0]?.rationale && (
        <div className="bg-[#F0FDF4] border border-[#008246] rounded-xl p-4 mt-4 text-sm" style={{ color: '#384550' }}>
          ✅ <span className="font-semibold">{t('pres_s5_greenlight')}:</span> {rows[0].rationale}
        </div>
      )}
    </div>
  );
};

/* ─── Slide 6 ─── */
const Slide6 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const exp: Record<string, string> = {};
  data.experiment.forEach((r: any) => { exp[r.key] = r.value; });

  const specRows = [
    [t('pres_s6_type'), exp['type'] || 'A/B Test (2 arms)'],
    [t('pres_s6_cohort'), exp['target_cohort'] || 'Users >50 at Registration step'],
    [t('pres_s6_sample'), exp['sample_size'] || '15,000 per arm (~2 weeks)'],
    [t('pres_s6_duration'), exp['min_duration'] || '2 weeks minimum'],
    [t('pres_s6_control'), exp['control_arm'] || 'Current onboarding flow'],
    [t('pres_s6_treatment'), exp['treatment_arm'] || 'Progressive 3-step onboarding'],
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s6_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s6_subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-[#F5F6FB] rounded-xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: '#00164C' }}>{t('pres_s6_spec')}</p>
          <div className="space-y-3">
            {specRows.map(([label, val], i) => (
              <div key={i} className="text-sm">
                <span style={{ color: '#384550' }}>{label}: </span>
                <span className="font-medium" style={{ color: '#00164C' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F6FB] rounded-xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: '#00164C' }}>{t('pres_s6_success')}</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-[#0075FF]">{t('pres_s6_primary')}</span>
              <span className="text-sm" style={{ color: '#00164C' }}>{exp['primary_kpi'] || 'Onboarding completion rate: 39.5% → 55%'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-[#EF4444]">{t('pres_s6_guardrail')}</span>
              <span className="text-sm" style={{ color: '#00164C' }}>{exp['guardrail_kpi'] || 'No increase in support ticket volume'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{t('pres_s6_secondary')}</span>
              <span className="text-sm" style={{ color: '#00164C' }}>{exp['secondary_kpi'] || 'Product view rate, 30-day overall conversion'}</span>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          <p className="font-bold text-sm mb-3" style={{ color: '#00164C' }}>{t('pres_s6_iteration')}</p>
          <div className="space-y-2 text-sm" style={{ color: '#384550' }}>
            <div className="flex items-center gap-2"><ArrowRight size={14} className="text-green-600" /> {t('pres_s6_if_10')}</div>
            <div className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500" /> {t('pres_s6_if_5_10')}</div>
            <div className="flex items-center gap-2"><ArrowRight size={14} className="text-red-500" /> {t('pres_s6_if_lt5')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Slide 7 ─── */
const Slide7 = ({ t }: { t: (k: string) => string }) => {
  const audiences = [
    { icon: '👔', title: t('pres_s7_exec'), insight: t('pres_s7_exec_insight'), metric: t('pres_s7_exec_metric'), border: '#00164C' },
    { icon: '🎯', title: t('pres_s7_product'), insight: t('pres_s7_product_insight'), metric: t('pres_s7_product_metric'), border: '#0075FF' },
    { icon: '🔧', title: t('pres_s7_engineering'), insight: t('pres_s7_eng_insight'), metric: t('pres_s7_eng_metric'), border: '#EF4444' },
    { icon: '📈', title: t('pres_s7_growth'), insight: t('pres_s7_growth_insight'), metric: t('pres_s7_growth_metric'), border: '#008246' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s7_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s7_subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {audiences.map((a, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm border-t-4" style={{ borderTopColor: a.border }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{a.icon}</span>
              <span className="font-bold text-sm" style={{ color: '#00164C' }}>{a.title}</span>
            </div>
            <p className="text-xs mb-1 font-semibold" style={{ color: '#384550' }}>{t('pres_s7_insight30')}:</p>
            <p className="text-xs" style={{ color: '#384550' }}>{a.insight}</p>
            <p className="text-xs mt-2 font-semibold" style={{ color: a.border }}>{t('pres_s7_key_metric')}: {a.metric}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground italic text-center mt-4">{t('pres_s7_footer')}</p>
    </div>
  );
};

/* ─── Main Component ─── */
const PresentationTab = () => {
  const { t } = useLanguage();
  const [slide, setSlide] = useState(0);
  const [data, setData] = useState<PresentationData | null>(null);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from('vw_funnel_global').select('*').single(),
      supabase.from('vw_funnel_by_segment').select('*'),
      supabase.from('vw_funnel_age_x_device').select('*').order('overall_conv', { ascending: true }),
      supabase.from('vw_hypothesis_validation').select('*'),
      supabase.from('vw_rice_roadmap').select('*').order('priority_rank'),
      supabase.from('vw_experiment_design').select('*'),
      supabase.from('vw_dashboard_kpis').select('*').single(),
    ]).then(([funnel, segments, ageDevice, hypotheses, roadmap, experiment, kpis]) => {
      setData({
        funnel: funnel.data,
        segments: segments.data ?? [],
        ageDevice: ageDevice.data ?? [],
        hypotheses: hypotheses.data ?? [],
        roadmap: roadmap.data ?? [],
        experiment: experiment.data ?? [],
        kpis: kpis.data,
      });
    });
  }, []);

  const goTo = (n: number) => {
    setSlide(n);
    setFadeKey(prev => prev + 1);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[520px] bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#0075FF] border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">{t('pres_loading')}</p>
        </div>
      </div>
    );
  }

  const slideContent = [
    <Slide1 key={0} t={t} />,
    <Slide2 key={1} data={data} t={t} />,
    <Slide3 key={2} data={data} t={t} />,
    <Slide4 key={3} t={t} />,
    <Slide5 key={4} data={data} t={t} />,
    <Slide6 key={5} data={data} t={t} />,
    <Slide7 key={6} t={t} />,
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm min-h-[520px] flex flex-col">
      {/* Slide content with fade */}
      <div className="flex-1 overflow-auto">
        <div
          key={fadeKey}
          className="animate-fade-in"
          style={{ animationDuration: '200ms' }}
        >
          {slideContent[slide]}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-100 px-8 py-4 flex flex-col items-center gap-3">
        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slide ? 'bg-[#0075FF]' : 'bg-gray-200 hover:bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Prev / Counter / Next */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => goTo(Math.max(0, slide - 1))}
            disabled={slide === 0}
            className="flex items-center gap-1 text-sm font-medium disabled:opacity-30 transition-opacity"
            style={{ color: '#00164C' }}
          >
            <ChevronLeft size={16} /> {t('pres_prev')}
          </button>
          <span className="text-sm text-muted-foreground">
            {t('pres_slideOf')} {slide + 1} {t('pres_of')} {TOTAL_SLIDES}
          </span>
          <button
            onClick={() => goTo(Math.min(TOTAL_SLIDES - 1, slide + 1))}
            disabled={slide === TOTAL_SLIDES - 1}
            className="flex items-center gap-1 text-sm font-medium disabled:opacity-30 transition-opacity"
            style={{ color: '#00164C' }}
          >
            {t('pres_next')} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationTab;
