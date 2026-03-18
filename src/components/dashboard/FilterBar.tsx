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

const FILTER_OPTIONS = {
  age: [
    { label: 'All Ages', labelEs: 'Todas las edades', value: 'all' },
    { label: 'Under 25', labelEs: 'Menor de 25', value: '<25' },
    { label: '26 to 50', labelEs: '26 a 50', value: '26-50' },
    { label: 'Over 50', labelEs: 'Mayor de 50', value: '>50' },
  ],
  device: [
    { label: 'All Devices', labelEs: 'Todos los dispositivos', value: 'all' },
    { label: 'iOS', labelEs: 'iOS', value: 'ios' },
    { label: 'Android', labelEs: 'Android', value: 'android' },
    { label: 'Web', labelEs: 'Web', value: 'web' },
  ],
  location: [
    { label: 'All Regions', labelEs: 'Todas las regiones', value: 'all' },
    { label: 'CDMX', labelEs: 'CDMX', value: 'CDMX' },
    { label: 'Guadalajara', labelEs: 'Guadalajara', value: 'GDL' },
    { label: 'Monterrey', labelEs: 'Monterrey', value: 'MTY' },
    { label: 'Other Regions', labelEs: 'Otras regiones', value: 'Other' },
  ],
  gender: [
    { label: 'All Genders', labelEs: 'Todos los géneros', value: 'all' },
    { label: 'Female', labelEs: 'Femenino', value: 'female' },
    { label: 'Male', labelEs: 'Masculino', value: 'male' },
    { label: 'Non-binary', labelEs: 'No binario', value: 'non-binary' },
  ],
};

const FilterBar = ({ filters, onChange, onExport }: FilterBarProps) => {
  const { language, t } = useLanguage();

  const set = (key: keyof ActiveFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  const renderSelect = (key: keyof typeof FILTER_OPTIONS, filterKey: keyof ActiveFilters) => (
    <select
      value={filters[filterKey]}
      onChange={e => set(filterKey, e.target.value)}
      className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground min-w-[140px] cursor-pointer"
      aria-label={key}
    >
      {FILTER_OPTIONS[key].map(o => (
        <option key={o.value} value={o.value}>
          {language === 'ES' ? o.labelEs : o.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border px-6 py-3 -mx-4 md:-mx-10 mb-6 flex flex-wrap items-center gap-3">
      {renderSelect('age', 'age')}
      {renderSelect('device', 'device')}
      {renderSelect('location', 'location')}
      {renderSelect('gender', 'gender')}

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
