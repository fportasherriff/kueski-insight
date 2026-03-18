import React, { useState } from 'react';
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

const MONTH_OPTIONS = [
  { label: 'Jan–Apr 2025', labelEs: 'Ene–Abr 2025', value: 'all' },
  { label: 'January 2025', labelEs: 'Enero 2025', value: '2025-01' },
  { label: 'February 2025', labelEs: 'Febrero 2025', value: '2025-02' },
  { label: 'March 2025', labelEs: 'Marzo 2025', value: '2025-03' },
  { label: 'April 2025', labelEs: 'Abril 2025', value: '2025-04' },
];

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const { language, t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState('all');

  const set = (key: keyof ActiveFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  const selectClass =
    'bg-card border border-border rounded-lg px-3 py-2 text-sm min-w-[140px] cursor-pointer font-semibold hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-primary/30';

  const renderSelect = (key: keyof typeof FILTER_OPTIONS, filterKey: keyof ActiveFilters) => (
    <select
      value={filters[filterKey]}
      onChange={e => set(filterKey, e.target.value)}
      className={selectClass}
      style={{ color: filters[filterKey] !== 'all' ? '#00164C' : '#384550' }}
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

      <select
        value={selectedMonth}
        onChange={e => setSelectedMonth(e.target.value)}
        className="bg-[#F5F6FB] border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-primary/30"
        style={{ color: selectedMonth !== 'all' ? '#00164C' : '#384550' }}
        aria-label="month"
      >
        {MONTH_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>
            {language === 'ES' ? o.labelEs : o.label}
          </option>
        ))}
      </select>

      <div className="ml-auto flex items-center gap-2">
        {isFiltered(filters) && (
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {t('filteredLabel')}
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
