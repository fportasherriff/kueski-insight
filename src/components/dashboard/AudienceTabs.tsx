import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const audiences = ['exec', 'product', 'engineering', 'growth'] as const;

const AudienceTabs = () => {
  const [active, setActive] = useState<string>('exec');
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-secondary rounded-full w-fit">
        {audiences.map(a => (
          <button
            key={a}
            onClick={() => setActive(a)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              active === a
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t(`audience_${a}`)}
          </button>
        ))}
      </div>

      <div className="bg-[hsl(210_100%_97%)] border-l-4 border-primary p-3 rounded-r-lg">
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {t(`audience_${active}_insight`)}
        </p>
      </div>
    </div>
  );
};

export default AudienceTabs;
