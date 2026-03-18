import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ActiveFilters {
  age: string;
  device: string;
  location: string;
  gender: string;
}

export const defaultFilters: ActiveFilters = {
  age: 'all',
  device: 'all',
  location: 'all',
  gender: 'all',
};

export const isFiltered = (f: ActiveFilters) =>
  f.age !== 'all' || f.device !== 'all' || f.location !== 'all' || f.gender !== 'all';

interface FilterBarProps {
  filters: ActiveFilters;
  onChange: (f: ActiveFilters) => void;
  onExport: () => void;
}

const FilterSelect = ({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground min-w-[140px] cursor-pointer"
    aria-label={label}
  >
    {options.map(o => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

const FilterBar = ({ filters, onChange, onExport }: FilterBarProps) => {
  const { t } = useLanguage();

  const set = (key: keyof ActiveFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-3 -mx-4 md:-mx-10 mb-6 flex flex-wrap items-center gap-3">
      <FilterSelect
        label={t('age')}
        value={filters.age}
        options={[
          { value: 'all', label: t('allSegments') },
          { value: '<25', label: '<25' },
          { value: '26-50', label: '26-50' },
          { value: '>50', label: '>50' },
        ]}
        onChange={v => set('age', v)}
      />
      <FilterSelect
        label={t('device')}
        value={filters.device}
        options={[
          { value: 'all', label: t('allDevices') },
          { value: 'ios', label: 'iOS' },
          { value: 'android', label: 'Android' },
          { value: 'web', label: 'Web' },
        ]}
        onChange={v => set('device', v)}
      />
      <FilterSelect
        label={t('location')}
        value={filters.location}
        options={[
          { value: 'all', label: t('allLocations') },
          { value: 'CDMX', label: 'CDMX' },
          { value: 'Guadalajara', label: 'Guadalajara' },
          { value: 'Monterrey', label: 'Monterrey' },
          { value: 'Other', label: 'Other' },
        ]}
        onChange={v => set('location', v)}
      />
      <FilterSelect
        label={t('gender')}
        value={filters.gender}
        options={[
          { value: 'all', label: t('allGenders') },
          { value: 'female', label: 'Female' },
          { value: 'male', label: 'Male' },
          { value: 'non-binary', label: 'Non-binary' },
        ]}
        onChange={v => set('gender', v)}
      />

      <span className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm select-none">
        Jan–Apr 2025
      </span>

      <div className="ml-auto flex items-center gap-2">
        {isFiltered(filters) && (
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {t('filteredLabel')}
          </span>
        )}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
        >
          {t('exportCsv')}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
