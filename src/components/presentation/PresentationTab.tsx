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
  const worst2 = data.ageDevice.slice(0, 2);
  const kpis = data.kpis;
  const totalBase = f?.registered ?? 100000;

  const funnelBars = [
    { name: t('registered'), pct: 100 },
    { name: t('onboarded'), pct: f?.pct_registered_to_onboarded ?? 63.2 },
    { name: t('viewedProduct'), pct: f?.pct_registered_to_viewed ?? 49.2 },
    { name: t('addedToCart'), pct: f?.pct_registered_to_cart ?? 22.0 },
    { name: t('purchased'), pct: f?.pct_registered_to_purchased ?? 10.4 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s2_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s2_subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Left – 2 Worst Combinations */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>{t('pres_s2_damaging')}</p>
          <div className="space-y-4">
            {worst2.map((row: any, i: number) => {
              const n = row.n ?? row.total_users ?? 0;
              const pctBase = totalBase > 0 ? ((n / totalBase) * 100).toFixed(1) : '0.0';
              return (
                <div key={i} className="bg-[#F5F6FB] rounded-xl p-4 text-center">
                  <span className="inline-block bg-white text-xs font-bold px-2 py-1 rounded-full mb-2" style={{ color: '#00164C' }}>
                    {row.age_group} × {(row.device ?? '').toUpperCase()}
                  </span>
                  <p className="text-4xl font-extrabold" style={{ color: '#EF4444' }}>{row.overall_conv}%</p>
                  <p className="text-xs text-muted-foreground">{t('pres_s2_overall_conv')}</p>
                  {row.delta_vs_best != null && (
                    <p className="text-xs mt-1" style={{ color: '#384550' }}>{Math.abs(row.delta_vs_best)}pp {t('pres_s2_below_best')}</p>
                  )}
                  <p className="text-xs text-muted-foreground italic mt-2">
                    n = {n.toLocaleString()} {t('pres_s2_users')} · {pctBase}% {t('pres_s2_of_base')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right – Gap + Funnel bars */}
        <div>
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>{t('pres_s2_gap')}</p>
            <p className="text-5xl font-extrabold" style={{ color: '#0075FF' }}>{kpis?.best_to_worst_ratio ?? '37.7'}×</p>
            <p className="text-xs text-muted-foreground mt-2">{t('pres_s2_gap_label')}</p>
            <div className="flex flex-col gap-2 mt-3">
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-50" style={{ color: '#008246' }}>
                {t('pres_s2_best_label')}: {kpis?.best_segment_conv ?? '22.6'}% (iOS 26-50)
              </span>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-red-50" style={{ color: '#EF4444' }}>
                {t('pres_s2_worst_label')}: {kpis?.worst_segment_conv ?? '0.6'}% (Web &gt;50)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {funnelBars.map((bar, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium w-24 text-right" style={{ color: '#384550' }}>{bar.name}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${bar.pct}%`,
                      backgroundColor: `hsl(212, 100%, ${30 + i * 10}%)`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-12" style={{ color: '#00164C' }}>{bar.pct}%</span>
              </div>
            ))}
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
  const other = findSeg('location', 'Other');

  // All 3 devices for KPI #2
  const deviceSegs = data.segments.filter((s: any) => s.dimension === 'device');
  const iosSeg = deviceSegs.find((s: any) => s.segment_value === 'ios');
  const androidSeg = deviceSegs.find((s: any) => s.segment_value === 'android');
  const webSeg = deviceSegs.find((s: any) => s.segment_value === 'web');

  const deviceRows = [
    { name: 'iOS', parque: '30.2%', seg: iosSeg },
    { name: 'Android', parque: '49.9%', seg: androidSeg },
    { name: 'Web', parque: '19.9%', seg: webSeg },
  ];

  // KPI #3 step-by-step table
  const cdmx = findSeg('location', 'CDMX');
  const gdl = findSeg('location', 'GDL');
  const mty = findSeg('location', 'MTY');

  const avgStep = (field: string) => {
    const vals = [cdmx, gdl, mty].filter(Boolean).map((s: any) => s[field] ?? 0);
    return vals.length > 0 ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : '—';
  };

  const kpi3Steps = [
    { step: 'Reg→Onb', citiesAvg: avgStep('step_reg_to_onb'), otherVal: other?.step_reg_to_onb },
    { step: 'Onb→View', citiesAvg: avgStep('step_onb_to_view'), otherVal: other?.step_onb_to_view },
    { step: 'View→Cart', citiesAvg: avgStep('step_view_to_cart'), otherVal: other?.step_view_to_cart },
    { step: 'Cart→Purch', citiesAvg: avgStep('step_cart_to_purch'), otherVal: other?.step_cart_to_purch },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s3_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s3_subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

        {/* KPI #1 */}
        <div className="bg-[#F5F6FB] rounded-xl p-5 border-t-4" style={{ borderColor: '#0075FF' }}>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#0075FF' }}>KPI #1</span>
          <p className="font-bold text-sm mt-3" style={{ color: '#00164C' }}>{t('pres_s3_k1_name')}</p>
          <p className="text-sm font-semibold mt-2" style={{ color: '#0075FF' }}>
            &gt;50: {age50?.step_reg_to_onb ?? '39.5'}% vs &lt;25: {age25?.step_reg_to_onb ?? '84.9'}%
          </p>
          <p className="text-xs text-muted-foreground italic mt-1">{t('pres_s3_k1_clarify')}</p>
          <p className="text-xs mt-3" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_why')}:</span> {t('pres_s3_k1_why')}</p>
          <p className="text-xs mt-2" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_watch')}:</span> {t('pres_s3_k1_watch')}</p>
          <p className="text-xs text-muted-foreground italic mt-2">{t('pres_s3_k1_parque')}</p>
        </div>

        {/* KPI #2 — All 3 devices */}
        <div className="bg-[#F5F6FB] rounded-xl p-5 border-t-4" style={{ borderColor: '#008246' }}>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#008246' }}>KPI #2</span>
          <p className="font-bold text-sm mt-3" style={{ color: '#00164C' }}>{t('pres_s3_k2_name')}</p>

          <table className="w-full text-xs mt-2 border-collapse">
            <thead>
              <tr className="text-left" style={{ color: '#00164C' }}>
                <th className="py-1 font-semibold">{t('device')}</th>
                <th className="py-1 font-semibold">% {t('pres_s3_k2_users')}</th>
                <th className="py-1 font-semibold">{t('pres_s3_k2_conv')}</th>
              </tr>
            </thead>
            <tbody>
              {deviceRows.map((d, i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-white/50' : ''} style={{ color: '#384550' }}>
                  <td className="py-1 font-medium">{d.name}</td>
                  <td className="py-1">{d.parque}</td>
                  <td className="py-1 font-semibold" style={{ color: d.name === 'Web' ? '#EF4444' : '#008246' }}>{d.seg?.overall_conv ?? '—'}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs mt-3" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_why')}:</span> {t('pres_s3_k2_why')}</p>
          <p className="text-xs text-muted-foreground italic mt-2">{t('pres_s3_k2_insight')}</p>
        </div>

        {/* KPI #3 — Step-by-step table */}
        <div className="bg-[#F5F6FB] rounded-xl p-5 border-t-4" style={{ borderColor: '#EF4444' }}>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#EF4444' }}>KPI #3</span>
          <p className="font-bold text-sm mt-3" style={{ color: '#00164C' }}>{t('pres_s3_k3_name')}</p>

          <table className="w-full text-xs mt-2 border-collapse">
            <thead>
              <tr className="text-left" style={{ color: '#00164C' }}>
                <th className="py-1 font-semibold">{t('pres_s3_k3_step')}</th>
                <th className="py-1 font-semibold">{t('pres_s3_k3_cities')}</th>
                <th className="py-1 font-semibold">{t('pres_s3_k3_other')}</th>
                <th className="py-1 font-semibold">{t('pres_s3_k3_gap')}</th>
              </tr>
            </thead>
            <tbody>
              {kpi3Steps.map((row, i) => {
                const cityVal = parseFloat(String(row.citiesAvg));
                const otherVal = row.otherVal ?? 0;
                const gap = (otherVal - cityVal).toFixed(0);
                const gapNum = parseInt(gap);
                const isOk = Math.abs(gapNum) <= 2;
                return (
                  <tr key={i} className={i % 2 === 1 ? 'bg-white/50' : ''} style={{ color: '#384550' }}>
                    <td className="py-1 font-medium">{row.step}</td>
                    <td className="py-1">~{row.citiesAvg}%</td>
                    <td className="py-1">{otherVal}%</td>
                    <td className="py-1 font-semibold" style={{ color: isOk ? '#008246' : '#EF4444' }}>
                      {gapNum > 0 ? '+' : ''}{gap}pp {isOk ? '✅' : '🔴'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="text-xs mt-3" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_why')}:</span> {t('pres_s3_k3_why_v2')}</p>
          <p className="text-xs mt-2" style={{ color: '#384550' }}><span className="font-semibold">{t('pres_s3_watch')}:</span> {t('pres_s3_k3_watch')}</p>
        </div>
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

/* ─── Slide 5 — English-translated RICE roadmap ─── */
const Slide5 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const priorityColors = ['#EF4444', '#F59E0B', '#008246'];
  const rows = data.roadmap.slice(0, 3);

  // Hardcoded EN/ES translations for DB fields that are in Spanish
  const initiativeTranslations: Record<number, { desc: { EN: string; ES: string }; rationale: { EN: string; ES: string }; whyQuarter: { EN: string; ES: string } }> = {
    0: {
      desc: {
        EN: 'Redesign onboarding into short steps with contextual help and plain language for users over 50',
        ES: 'Rediseñar el onboarding en pasos cortos con ayuda contextual y lenguaje claro para usuarios mayores de 50',
      },
      rationale: {
        EN: 'GREENLIGHT — Highest confidence + 30% of user base + deployable Q2 with 1 squad. Largest single conversion lever in the funnel.',
        ES: 'LUZ VERDE — Mayor confianza + 30% de la base de usuarios + desplegable en Q2 con 1 squad. La mayor palanca de conversión del funnel.',
      },
      whyQuarter: {
        EN: 'Highest confidence, lowest effort — ship with 1 squad in Q2.',
        ES: 'Mayor confianza, menor esfuerzo — entregar con 1 squad en Q2.',
      },
    },
    1: {
      desc: {
        EN: 'Simplify checkout flow on Android: reduce steps, improve payment UI, optimize performance',
        ES: 'Simplificar el flujo de checkout en Android: reducir pasos, mejorar UI de pago, optimizar rendimiento',
      },
      rationale: {
        EN: 'Highest reach (50% of users) + high technical confidence. Requires more engineering effort → Q3.',
        ES: 'Mayor alcance (50% de usuarios) + alta confianza técnica. Requiere más esfuerzo de ingeniería → Q3.',
      },
      whyQuarter: {
        EN: 'Largest user base but needs more eng effort — plan for Q3.',
        ES: 'Mayor base de usuarios pero necesita más esfuerzo de ing — planificar para Q3.',
      },
    },
    2: {
      desc: {
        EN: 'Add trust signals at checkout for non-tier-1 regions: clear delivery times, guarantees, local payment methods',
        ES: 'Agregar señales de confianza en checkout para regiones no tier-1: tiempos de entrega claros, garantías, métodos de pago locales',
      },
      rationale: {
        EN: 'Quick win with low effort, but lower confidence — requires qualitative research before shipping. Q3-Q4.',
        ES: 'Ganancia rápida con poco esfuerzo, pero menor confianza — requiere investigación cualitativa antes de lanzar. Q3-Q4.',
      },
      whyQuarter: {
        EN: 'Low effort but needs qualitative validation first — Q3-Q4.',
        ES: 'Bajo esfuerzo pero necesita validación cualitativa primero — Q3-Q4.',
      },
    },
  };

  const lang = t('pres_prev') === 'Anterior' ? 'ES' : 'EN';

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s5_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s5_subtitle')}</p>

      <div className="space-y-3 mt-4">
        {rows.map((r: any, i: number) => {
          const clr = priorityColors[i] ?? '#384550';
          const trans = initiativeTranslations[i];
          const desc = trans?.desc[lang] ?? r.description ?? '';
          const whyQ = trans?.whyQuarter[lang] ?? '';
          return (
            <div key={i} className="rounded-xl p-5 border-l-4 bg-white border border-gray-100" style={{ borderLeftColor: clr }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold" style={{ backgroundColor: clr }}>
                    #{r.priority_rank}
                  </span>
                  <p className="font-bold text-sm mt-1" style={{ color: '#00164C' }}>{r.initiative_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
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
                  {whyQ && <p className="text-xs italic text-muted-foreground mt-1">{t('pres_s5_why_quarter')}: {whyQ}</p>}
                </div>
                <div className="text-xs" style={{ color: '#384550' }}>
                  <p className="font-semibold">{r.current_rate}% → {r.target_rate}%</p>
                  <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 mt-1 text-xs">{r.critical_step}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rows[0] && (
        <div className="bg-[#F0FDF4] border border-[#008246] rounded-xl p-4 mt-4 text-sm" style={{ color: '#384550' }}>
          ✅ <span className="font-semibold">{t('pres_s5_greenlight')}:</span> {initiativeTranslations[0]?.rationale[lang] ?? rows[0].rationale}
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

/* ─── Slide 7 — Compact audiences + dashboard capabilities ─── */
const Slide7 = ({ t }: { t: (k: string) => string }) => {
  const audiences = [
    { icon: '👔', title: t('pres_s7_exec'), metric: t('pres_s7_exec_metric'), action: t('pres_s7_exec_action'), border: '#00164C' },
    { icon: '🎯', title: t('pres_s7_product'), metric: t('pres_s7_product_metric'), action: t('pres_s7_product_action'), border: '#0075FF' },
    { icon: '🔧', title: t('pres_s7_engineering'), metric: t('pres_s7_eng_metric'), action: t('pres_s7_eng_action'), border: '#EF4444' },
    { icon: '📈', title: t('pres_s7_growth'), metric: t('pres_s7_growth_metric'), action: t('pres_s7_growth_action'), border: '#008246' },
  ];

  const capabilities = [
    t('pres_s7_cap1'),
    t('pres_s7_cap2'),
    t('pres_s7_cap3'),
    t('pres_s7_cap4'),
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s7_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s7_subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Left — compact audience cards */}
        <div className="space-y-3">
          {audiences.map((a, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm border-l-4" style={{ borderLeftColor: a.border }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{a.icon}</span>
                <span className="font-bold text-sm" style={{ color: '#00164C' }}>{a.title}</span>
              </div>
              <p className="text-xs font-semibold mt-1" style={{ color: a.border }}>{a.metric}</p>
              <p className="text-xs mt-1" style={{ color: '#384550' }}>{a.action}</p>
            </div>
          ))}
        </div>

        {/* Right — dashboard capabilities */}
        <div className="bg-[#F5F6FB] rounded-xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide mb-4" style={{ color: '#00164C' }}>{t('pres_s7_enables_title')}</p>
          <div className="space-y-3">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#384550' }}>
                <span style={{ color: '#0075FF' }}>●</span>
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic text-center mt-4">{t('pres_s7_footer_v2')}</p>
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
      <div className="flex-1 overflow-auto">
        <div
          key={fadeKey}
          className="animate-fade-in"
          style={{ animationDuration: '200ms' }}
        >
          {slideContent[slide]}
        </div>
      </div>

      <div className="border-t border-gray-100 px-8 py-4 flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slide ? 'bg-[#0075FF]' : 'bg-gray-200 hover:bg-gray-300'}`}
            />
          ))}
        </div>

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
