import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DashboardFilters {
  dateStart: string;
  dateEnd: string;
  age: string[];
  device: string[];
  location: string[];
  gender: string[];
}

export const defaultFilters: DashboardFilters = {
  dateStart: '2025-01',
  dateEnd: '2025-04',
  age: [],
  device: [],
  location: [],
  gender: [],
};

export const isFiltered = (filters: DashboardFilters) =>
  filters.age.length > 0 || filters.device.length > 0 || filters.location.length > 0 || filters.gender.length > 0;

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (f: DashboardFilters) => void;
}

const PillGroup = ({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) => {
  const allSelected = selected.length === 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{label}</span>
      <button
        onClick={() => onToggle('__ALL__')}
        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
          allSelected
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-card border-border text-muted-foreground hover:border-primary/40'
        }`}
      >
        All
      </button>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const { t } = useLanguage();

  const toggle = (key: keyof Pick<DashboardFilters, 'age' | 'device' | 'location' | 'gender'>, val: string) => {
    if (val === '__ALL__') {
      onChange({ ...filters, [key]: [] });
      return;
    }
    const cur = filters[key];
    const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border px-8 py-3 -mx-4 md:-mx-10 mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-2 group relative">
        <span className="text-xs font-semibold text-muted-foreground">{t('period')}</span>
        <input
          type="month"
          value={filters.dateStart}
          onChange={e => onChange({ ...filters, dateStart: e.target.value })}
          className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground"
        />
        <span className="text-xs text-muted-foreground">–</span>
        <input
          type="month"
          value={filters.dateEnd}
          onChange={e => onChange({ ...filters, dateEnd: e.target.value })}
          className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground"
        />
        <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-foreground text-background text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
          {t('datasetCovers')}
        </div>
      </div>

      <div className="h-6 w-px bg-border" />

      <PillGroup label={t('age')} options={['<25', '26-50', '>50']} selected={filters.age} onToggle={v => toggle('age', v)} />
      <PillGroup label={t('device')} options={['iOS', 'Android', 'Web']} selected={filters.device} onToggle={v => toggle('device', v)} />
      <PillGroup label={t('location')} options={['CDMX', 'Guadalajara', 'Monterrey', 'Other']} selected={filters.location} onToggle={v => toggle('location', v)} />
      <PillGroup label={t('gender')} options={['Female', 'Male', 'Non-binary']} selected={filters.gender} onToggle={v => toggle('gender', v)} />
    </div>
  );
};

export default FilterBar;
