import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
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

const TOTAL_SLIDES = 10;

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

    <div className="mt-8 space-y-1 text-sm" style={{ color: '#66727D' }}>
      <p>{t('pres_s1_dataset')}</p>
      <div className="flex items-center gap-2">
        <p>{t('pres_s1_presented')}</p>
        <a
          href="https://www.linkedin.com/in/francisco-porta/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex hover:opacity-80 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="12" fill="#0A66C2"/>
            <path d="M8.75 10.5v5.25M8.75 8.25v.01M11.25 15.75v-3a1.5 1.5 0 1 1 3 0v3M11.25 12v-1.5M14.25 15.75v-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
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

/* ─── Slide 2 — Redesigned vertical layout ─── */
const Slide2 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const f = data.funnel;
  const worst2 = data.ageDevice.slice(0, 2);
  const kpis = data.kpis;
  const totalBase = f?.registered ?? 100000;

  const funnelBars = [
    { name: t('registered'), pct: 100, opacity: 1 },
    { name: t('onboarded'), pct: f?.pct_registered_to_onboarded ?? 63.2, opacity: 0.85 },
    { name: t('viewedProduct'), pct: f?.pct_registered_to_viewed ?? 49.2, opacity: 0.7 },
    { name: t('addedToCart'), pct: f?.pct_registered_to_cart ?? 22.0, opacity: 0.55 },
    { name: t('purchased'), pct: f?.pct_registered_to_purchased ?? 10.4, opacity: 0.4 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s2_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s2_subtitle')}</p>

      {/* TOP — 2 Most Damaging Combinations */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>{t('pres_s2_damaging')}</p>
        <div className="grid grid-cols-2 gap-6">
          {worst2.map((row: any, i: number) => {
            const n = row.n ?? row.total_users ?? 0;
            const pctBase = totalBase > 0 ? ((n / totalBase) * 100).toFixed(1) : '0.0';
            return (
              <div key={i} className="bg-[#F5F6FB] rounded-2xl py-4 px-6 text-center">
                <span className="inline-block bg-white text-base font-bold px-3 py-0.5 rounded-full mb-3" style={{ color: '#00164C' }}>
                  {row.age_group} × {(row.device ?? '').toUpperCase()}
                </span>
                <p className="font-[800]" style={{ color: '#EF4444', fontSize: '52px', lineHeight: 1 }}>{row.overall_conv}%</p>
                <p className="text-xs italic mt-2" style={{ color: '#66727D' }}>
                  n = {n.toLocaleString()} {t('pres_s2_users')} · {pctBase}% {t('pres_s2_of_base')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MIDDLE — Funnel bars */}
      <div className="mt-8">
        <p className="text-sm font-medium uppercase tracking-wide mb-3" style={{ color: '#00164C' }}>
          {t('pres_s2_funnel_title')}
        </p>
        <div className="space-y-2">
          {funnelBars.map((bar, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <span className="text-sm w-32 text-right" style={{ color: '#384550' }}>{bar.name}</span>
              <div className="flex-1">
                <div
                  className="h-7 rounded-r-lg transition-all"
                  style={{
                    width: `${bar.pct}%`,
                    backgroundColor: '#0075FF',
                    opacity: bar.opacity,
                  }}
                />
              </div>
              <span className="text-sm font-semibold w-14" style={{ color: '#00164C' }}>{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM — muted caption */}
      <p className="text-xs mt-4 text-center" style={{ color: '#66727D' }}>
        {t('pres_s2_gap_caption')}
      </p>
    </div>
  );
};

/* ─── Slide 3 — Onboarding Gap & Checkout Gap ─── */
const Slide3 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s3_title_v2')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s3_subtitle_v2')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* LEFT — Onboarding Gap */}
        <div className="bg-[#F5F6FB] rounded-2xl py-4 px-5 flex flex-col overflow-hidden">
          <span className="self-start text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#0075FF' }}>
            {t('pres_s3_kpi1_pill_v2')}
          </span>

          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="text-3xl font-extrabold" style={{ color: '#EF4444' }}>39.5%</span>
            <span className="text-xl" style={{ color: '#384550' }}>→</span>
            <span className="text-3xl font-extrabold" style={{ color: '#008246' }}>84.9%</span>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: '#66727D' }}>
            {t('pres_s3_kpi1_ages')}
          </p>

          <div className="mt-auto bg-[#EFF6FF] rounded-lg px-3 py-1.5 text-xs mt-3" style={{ color: '#0075FF' }}>
            {t('pres_s3_kpi1_target')}
          </div>
        </div>

        {/* RIGHT — Checkout Gap */}
        <div className="bg-[#F5F6FB] rounded-2xl py-4 px-5 flex flex-col overflow-hidden">
          <span className="self-start text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#EF4444' }}>
            {t('pres_s3_kpi3_pill_v2')}
          </span>

          <div className="mt-4 space-y-0">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm font-semibold" style={{ color: '#00164C' }}>{t('pres_s3_kpi3_cities')}</span>
              <span className="text-3xl font-extrabold" style={{ color: '#008246' }}>50.6%</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-t border-b border-gray-200">
              <span className="text-sm font-semibold" style={{ color: '#00164C' }}>{t('pres_s3_kpi3_other')}</span>
              <span className="text-3xl font-extrabold" style={{ color: '#EF4444' }}>31.2%</span>
            </div>
            <div className="flex justify-between items-center py-1.5 bg-[#FEF2F2] rounded-lg px-3 mt-2">
              <span className="text-xs font-semibold" style={{ color: '#EF4444' }}>{t('pres_s3_kpi3_gap_label')}</span>
              <span className="text-lg font-extrabold" style={{ color: '#EF4444' }}>−19pp</span>
            </div>
          </div>

          <div className="mt-auto bg-[#FEF2F2] rounded-lg px-3 py-1.5 text-xs mt-3" style={{ color: '#EF4444' }}>
            {t('pres_s3_kpi3_target')}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Slide 4 — KPI #2 Device Breakdown ─── */
const Slide4Device = ({ t }: { t: (k: string) => string }) => {
  const devices = [
    { name: 'iOS', share: '30.2', conv: '18.2', color: '#008246', bg: '#F0FDF4', chipBg: '#F0FDF4', chipText: '#66727D', chipLabel: t('pres_s4d_best_performer') },
    { name: 'Android', share: '49.9', conv: '8.8', color: '#0075FF', bg: '#EFF6FF', chipBg: '#FFF7ED', chipText: '#F59E0B', chipBorder: '#F59E0B', chipLabel: '2.1× below iOS' },
    { name: 'Web', share: '19.9', conv: '2.6', color: '#EF4444', bg: '#FEF2F2', chipBg: '#FEF2F2', chipText: '#EF4444', chipBorder: '#EF4444', chipLabel: '7× below iOS' },
  ];

  const steps = [
    { name: 'Reg→Onb', ios: '74.4%', android: '63.8%', web: '44.7%' },
    { name: 'Onb→View', ios: '87.6%', android: '73.3%', web: '64.9%' },
    { name: 'View→Cart', ios: '53.5%', android: '43.4%', web: '34.0%' },
    { name: 'Cart→Purch', ios: '52.1%', android: '43.4%', web: '26.7%' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s4d_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s4d_subtitle')}</p>

      <div className="grid grid-cols-3 gap-6 mt-4">
        {devices.map((d) => (
          <div key={d.name} className="rounded-2xl py-4 px-5 text-center border-2 flex flex-col" style={{ backgroundColor: d.bg, borderColor: d.color }}>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: d.color }}>{d.name}</p>
            <p className="text-xs mt-1" style={{ color: '#384550' }}>{d.share}% {t('pres_s4d_of_users')}</p>
            <p className="font-extrabold my-3" style={{ color: d.color, fontSize: '40px', lineHeight: 1 }}>{d.conv}%</p>
            <p className="text-xs" style={{ color: '#384550' }}>{t('pres_s4d_overall_conv')}</p>
            <span
              className="mt-3 text-xs rounded-full px-3 py-1 font-semibold self-center"
              style={{
                backgroundColor: d.chipBg,
                color: d.chipText,
                border: d.chipBorder ? `1px solid ${d.chipBorder}` : undefined,
              }}
            >
              {d.chipLabel}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold mb-3" style={{ color: '#00164C' }}>{t('pres_s4d_table_title')}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F5F6FB]">
              <th className="text-left py-2 px-4 font-semibold" style={{ color: '#00164C' }}>{t('pres_s4d_step_header')}</th>
              <th className="text-left py-2 px-4 font-semibold" style={{ color: '#008246' }}>iOS</th>
              <th className="text-left py-2 px-4 font-semibold" style={{ color: '#0075FF' }}>Android</th>
              <th className="text-left py-2 px-4 font-semibold" style={{ color: '#EF4444' }}>Web</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 px-4 font-medium" style={{ color: '#384550' }}>{s.name}</td>
                <td className="py-2 px-4" style={{ color: '#008246' }}>{s.ios}</td>
                <td className="py-2 px-4" style={{ color: '#0075FF' }}>{s.android}</td>
                <td className="py-2 px-4" style={{ color: '#EF4444' }}>{s.web}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-center" style={{ color: '#66727D' }}>
        {t('pres_s4d_structural_note')}
      </p>
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

  const initiativeTranslations: Record<number, { desc: { EN: string; ES: string }; rationale: { EN: string; ES: string }; whyQuarter: { EN: string; ES: string }; resource: { EN: string; ES: string } }> = {
    0: {
      desc: {
        EN: 'Redesign onboarding as short progressive steps with plain language and contextual help — targeted at users 50+',
        ES: 'Rediseñar el onboarding como pasos cortos progresivos con lenguaje claro y ayuda contextual — dirigido a usuarios 50+',
      },
      rationale: {
        EN: 'Highest confidence · 30% of user base · deployable Q2 with 1 squad · largest conversion lever in funnel',
        ES: 'Mayor confianza · 30% de la base · desplegable Q2 con 1 squad · mayor palanca de conversión del funnel',
      },
      whyQuarter: {
        EN: 'Q2 — Low engineering effort, clear hypothesis, fast to test',
        ES: 'Q2 — Bajo esfuerzo de ingeniería, hipótesis clara, rápido de testear',
      },
      resource: {
        EN: 'Resource: 1 product squad · 6 weeks',
        ES: 'Recurso: 1 squad de producto · 6 semanas',
      },
    },
    1: {
      desc: {
        EN: 'Simplify Android checkout: fewer steps, better payment UI, performance optimization',
        ES: 'Simplificar checkout en Android: menos pasos, mejor UI de pago, optimización de rendimiento',
      },
      rationale: {
        EN: '50% of user base · +4,690 purchases potential · high technical confidence',
        ES: '50% de la base · +4,690 compras potenciales · alta confianza técnica',
      },
      whyQuarter: {
        EN: 'Q3 — Higher engineering effort, needs dedicated squad',
        ES: 'Q3 — Mayor esfuerzo de ingeniería, necesita squad dedicado',
      },
      resource: {
        EN: 'Resource: 1 engineering squad · 8 weeks',
        ES: 'Recurso: 1 squad de ingeniería · 8 semanas',
      },
    },
    2: {
      desc: {
        EN: 'Add trust signals at checkout for non-major-city regions: clear delivery times, guarantees, local payment methods',
        ES: 'Agregar señales de confianza en checkout para regiones no principales: tiempos de entrega claros, garantías, métodos de pago locales',
      },
      rationale: {
        EN: '25% of user base · isolated to checkout only · needs qualitative research first',
        ES: '25% de la base · aislado al checkout · necesita investigación cualitativa primero',
      },
      whyQuarter: {
        EN: 'Q3-Q4 — Requires post-abandon research before shipping',
        ES: 'Q3-Q4 — Requiere investigación post-abandono antes de lanzar',
      },
      resource: {
        EN: 'Resource: 0.5 squad + qualitative research · 4 weeks post-research',
        ES: 'Recurso: 0.5 squad + investigación cualitativa · 4 semanas post-investigación',
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
          const rationaleShort = trans?.rationale[lang] ?? '';
          const resource = trans?.resource[lang] ?? '';
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
                  <span>{t('pres_s5_effort')}: {['M','L','S'][i] ?? 'M'}</span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: clr }}>{r.rice_score}</p>
                  <p className="text-xs text-muted-foreground">{t('pres_s5_rice')}</p>
                  <p className="text-xs italic text-muted-foreground mt-1">{rationaleShort}</p>
                </div>
                <div className="text-xs" style={{ color: '#384550' }}>
                  <p className="font-semibold">{r.current_rate}% → {r.target_rate}%</p>
                  <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 mt-1 text-xs">{r.critical_step}</span>
                  {whyQ && <p className="text-xs italic text-muted-foreground mt-2">{t('pres_s5_why_quarter')}: {whyQ}</p>}
                  {resource && <p className="text-xs mt-1" style={{ color: '#384550' }}>{resource}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#F5F6FB] border border-gray-200 rounded-xl p-4 mt-4 text-sm" style={{ color: '#384550' }}>
        ⭐ {t('pres_s5_recommendation')}
      </div>

      <p className="text-xs italic mt-2" style={{ color: '#66727D' }}>
        {t('pres_s5_sequencing_note')}
      </p>

    </div>
  );
};

/* ─── Slide 6 ─── */
const Slide6 = ({ data, t }: { data: PresentationData; t: (k: string) => string }) => {
  const exp: Record<string, string> = {};
  data.experiment.forEach((r: any) => { exp[r.key] = r.value; });

  const lang = t('pres_prev') === 'Anterior' ? 'ES' : 'EN';

  const s6Trans: Record<string, { EN: string; ES: string }> = {
    cohort: { EN: 'New users aged 50+ at the Registration step', ES: 'Nuevos usuarios de 50+ en el paso de Registro' },
    control: { EN: 'Current onboarding flow (single multi-field form)', ES: 'Flujo de onboarding actual (formulario único multi-campo)' },
    treatment: { EN: 'Progressive onboarding: 3 short screens, one action per step, contextual tooltip, progress indicator', ES: 'Onboarding progresivo: 3 pantallas cortas, una acción por paso, tooltip contextual, indicador de progreso' },
    explainer: {
      EN: 'We split users 50+ randomly into two groups. Group A sees the current onboarding. Group B sees a simplified 3-step version. After 2 weeks we check if Group B completes onboarding at a significantly higher rate.',
      ES: 'Dividimos a los usuarios de 50+ aleatoriamente en dos grupos. El Grupo A ve el onboarding actual. El Grupo B ve una versión simplificada de 3 pasos. Después de 2 semanas verificamos si el Grupo B completa el onboarding a una tasa significativamente mayor.',
    },
  };

  const specRows = [
    [t('pres_s6_type'), exp['type'] || 'A/B Test (2 arms)'],
    [t('pres_s6_cohort'), s6Trans.cohort[lang]],
    [t('pres_s6_sample'), exp['sample_size'] || '15,000 per arm (~2 weeks)'],
    [t('pres_s6_duration'), exp['min_duration'] || '2 weeks minimum'],
    [t('pres_s6_control'), s6Trans.control[lang]],
    [t('pres_s6_treatment'), s6Trans.treatment[lang]],
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>{t('pres_s6_title')}</h2>
      <p className="text-sm" style={{ color: '#384550' }}>{t('pres_s6_subtitle')}</p>

      <p className="text-sm text-muted-foreground italic">{s6Trans.explainer[lang]}</p>

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

      {/* FIX 6 — Footer line */}
      <div className="border-t border-gray-100 mt-6 pt-4">
        <p className="text-sm italic text-center" style={{ color: '#66727D' }}>
          {t('pres_s6_footer')}
        </p>
      </div>
    </div>
  );
};


/* ─── Slide 8 — The Operating Context ─── */
const Slide8 = ({ t }: { t: (k: string) => string }) => {
  const stats = [
    { value: '5M+ users · 3M MAU', label: 'Scale reached within Telecom\'s 30M+ customer ecosystem' },
    { value: 'First analytics hire', label: 'No prior infrastructure, tooling or processes — built from scratch' },
    { value: 'Top 3 FCI yield · Argentine fintech market', label: 'Competing with Mercado Pago and Ualá in a high-stakes market' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[380px]">
        {/* Left — Text */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>The Operating Context</h2>
            <p className="text-sm mt-1" style={{ color: '#66727D' }}>Part 2 — Strategic &amp; Operational Cases</p>
          </div>

          <div className="space-y-5">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-lg font-extrabold" style={{ color: '#0075FF' }}>{s.value}</p>
                <p style={{ color: '#66727D', fontSize: '14px' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <p className="pt-4 border-t border-gray-100" style={{ color: '#66727D', fontSize: '12px' }}>
            Telecom-backed fintech · Argentina · 2021–2025
          </p>
        </div>

        {/* Right — Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center w-full max-w-[280px] aspect-[4/3]" style={{ background: '#F5F6FB', padding: '32px', borderRadius: '12px' }}>
            <img
              src="https://play-lh.googleusercontent.com/rN5Sj8ZRWNRcR2bLfitHiUiJxnhLDNxEBLHBEmvhLKJJ5vH7kCOvgPbXCWJyOX_jMjE"
              alt="PersonalPay"
              style={{ maxHeight: '110px', maxWidth: '200px', objectFit: 'contain' }}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center" style={{ background: 'linear-gradient(135deg, #7B2FBE, #5B21B6)', padding: '32px', borderRadius: '12px' }}>
              <span className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Personal Pay</span>
            </div>
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: '#9CA3AF' }}>
            Digital wallet · Telecom Argentina ecosystem · 2021–2025
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Slide 9 — Case 1: Diagnosing Slow Transfers ─── */
const Slide9 = ({ t }: { t: (k: string) => string }) => {
  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-5">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>Case 1: Diagnosing Slow Transfers</h2>
      <p className="text-sm" style={{ color: '#66727D' }}>Task — Reduce transfer latency complaints at 2M daily transactions</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-4 border border-gray-100 rounded-xl overflow-hidden">
        {/* Col 1 — The Problem */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00164C' }}>The Problem</p>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#EF4444' }}>
            1% of 2M daily transfers
          </span>
          <ul className="space-y-1.5 text-xs" style={{ color: '#384550' }}>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Transfers &gt;10s = 20,000 affected/day</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Users perceive delay as fraud</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> High churn risk in competitive market</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> No clear root cause identified</li>
          </ul>
        </div>

        {/* Col 2 — The Insight */}
        <div className="p-5 space-y-3 border-x border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00164C' }}>The Insight</p>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#0075FF' }}>
            Segmentation by latency band
          </span>
          <ul className="space-y-1.5 text-xs" style={{ color: '#384550' }}>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> 8 time bands: 0–1s → 24hr+</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Critical mass: 1–10 min band</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Samsung devices disproportionately affected</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Specific time window pattern identified</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Root cause: COELSA clearinghouse behavior</li>
          </ul>
        </div>

        {/* Col 3 — The Impact */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00164C' }}>The Impact</p>
          <div className="bg-[#F5F6FB] rounded-xl py-4 px-3 text-center mt-1">
            <p className="font-[800]" style={{ color: '#0075FF', fontSize: '32px', lineHeight: 1 }}>1.0% → 0.2%</p>
            <p className="text-xs mt-2" style={{ color: '#66727D' }}>transfer failure rate</p>
          </div>
          <hr className="border-gray-100" />
          <ul className="space-y-1.5 text-xs" style={{ color: '#384550' }}>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Validated with engineering</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Negotiated fix with COELSA</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Engineering had real-time data to validate the fix</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Visibility framework reused in future latency investigations</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> At benchmark floor — no further hypothesis</li>
          </ul>
        </div>
      </div>

      <p className="text-left" style={{ fontSize: '11px', color: '#66727D' }}>Tools: BigQuery · Looker Studio · SQL</p>
    </div>
  );
};

/* ─── Slide 10 — Case 2: Redesigning Direct Debit ─── */
const Slide10 = ({ t }: { t: (k: string) => string }) => {
  return (
    <div className="max-w-3xl mx-auto px-8 py-10 space-y-5">
      <h2 className="text-2xl font-extrabold" style={{ color: '#00164C' }}>Case 2: Redesigning Direct Debit</h2>
      <p className="text-sm" style={{ color: '#66727D' }}>Task — Reduce rejection rate on a newly launched autopay feature</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-4 border border-gray-100 rounded-xl overflow-hidden">
        {/* Col 1 — The Problem */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00164C' }}>The Problem</p>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#EF4444' }}>
            40% rejection rate at launch
          </span>
          <ul className="space-y-1.5 text-xs" style={{ color: '#384550' }}>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Target: 20% rejection</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Strategic feature for Telecom billing</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> 30M+ Telecom customers in scope</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> No prior behavioral data for this flow</li>
          </ul>
        </div>

        {/* Col 2 — The Insight */}
        <div className="p-5 space-y-3 border-x border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00164C' }}>The Insight</p>
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#0075FF' }}>
            Behavioral timing analysis
          </span>
          <ul className="space-y-1.5 text-xs" style={{ color: '#384550' }}>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Analyzed pre-debit deposit behavior</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> End-of-month enrollees had no funds</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Debit fired on anniversary — wrong timing</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Problem was timing, not product</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> A/B test: enrollment date vs. 8th–13th window</li>
          </ul>
        </div>

        {/* Col 3 — The Impact */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#00164C' }}>The Impact</p>
          <div className="bg-[#F5F6FB] rounded-xl py-4 px-3 text-center mt-1">
            <div className="flex items-center justify-center gap-2">
              <div>
                <p className="font-[800]" style={{ color: '#EF4444', fontSize: '28px', lineHeight: 1 }}>40%</p>
                <p className="text-[10px] mt-1" style={{ color: '#66727D' }}>at launch</p>
              </div>
              <span className="text-lg" style={{ color: '#9CA3AF' }}>→</span>
              <div>
                <p className="font-[800]" style={{ color: '#008246', fontSize: '28px', lineHeight: 1 }}>23%</p>
                <p className="text-[10px] mt-1" style={{ color: '#66727D' }}>after redesign</p>
              </div>
            </div>
            <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-200" style={{ color: '#0075FF' }}>
              A/B tested · shipped to production
            </span>
          </div>
          <hr className="border-gray-100" />
          <ul className="space-y-1.5 text-xs" style={{ color: '#384550' }}>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Debit cycle window — new pattern</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> PO could self-serve debit performance post-launch</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Push notification in treatment arm</li>
            <li className="flex items-start gap-1.5"><span style={{ color: '#9CA3AF' }}>·</span> Timing pattern became standard — no analyst needed to re-derive it</li>
          </ul>
        </div>
      </div>

      <p className="text-left" style={{ fontSize: '11px', color: '#66727D' }}>Tools: BigQuery · Looker Studio · SQL · A/B framework</p>
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
    <Slide4Device key={3} t={t} />,
    <Slide4 key={4} t={t} />,
    <Slide5 key={5} data={data} t={t} />,
    <Slide6 key={6} data={data} t={t} />,
    <Slide8 key={7} t={t} />,
    <Slide9 key={8} t={t} />,
    <Slide10 key={9} t={t} />,
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm min-h-[520px] flex flex-col">
      <div className="flex-1 overflow-auto">
        <div
          key={fadeKey}
          className="animate-fade-in flex flex-col justify-between h-full min-h-[520px]"
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
