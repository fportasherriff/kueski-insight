import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ErrorBanner = ({ message }: { message?: string }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-[#FEF2F2] border border-destructive rounded-lg p-3">
      <p className="text-xs text-destructive font-medium">{message || t('errorLoadData')}</p>
    </div>
  );
};

export default ErrorBanner;
