import React, { useState } from 'react';
import { LayoutDashboard, Presentation, Bot, Map, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardTab from '@/components/dashboard/DashboardTab';

const NavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg transition-all duration-150
      ${active
        ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary-foreground))] font-semibold shadow-lg shadow-blue-900/20'
        : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
      }`}
  >
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </button>
);

const PlaceholderCard = ({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-card rounded-[12px] shadow-[var(--card-shadow)] outline outline-1 outline-black/5">
      <div className="p-4 bg-primary/10 rounded-full mb-6">
        <Icon size={48} className="text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{subtitle}</p>
      <span className="text-xs uppercase tracking-widest text-muted-foreground/50 font-semibold">
        {t('comingSoon')}
      </span>
    </div>
  );
};

const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) => {
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'presentation', icon: Presentation, label: t('presentation') },
    { id: 'ask', icon: Bot, label: t('askData') },
    { id: 'roadmap', icon: Map, label: t('roadmap') },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-[hsl(var(--sidebar-bg))] z-50">
      <div className="p-6 mb-4">
        <img
          src="https://cdn.prod.website-files.com/642533e2943fc871d1dc670d/642d4d9f4b2a5abd56c16739_Logo.svg"
          alt="Kueski"
          className="h-7 brightness-0 invert"
        />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-white/10">
        <p className="text-[10px] uppercase font-bold text-white/50 mb-3 tracking-wider">
          {t('langLabel')}
        </p>
        <div className="flex bg-black/20 p-1 rounded-full">
          {(['EN', 'ES'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
                language === lang
                  ? 'bg-white text-[hsl(var(--sidebar-bg))]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

const MobileNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'presentation', icon: Presentation },
    { id: 'ask', icon: Bot },
    { id: 'roadmap', icon: Map },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--sidebar-bg))] h-16 flex items-center justify-around px-4 z-50 border-t border-white/10">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`p-2 rounded-lg transition-colors ${
            activeTab === item.id ? 'text-primary' : 'text-white/50'
          }`}
        >
          <item.icon size={24} />
        </button>
      ))}
    </nav>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'presentation':
        return <PlaceholderCard icon={Presentation} title={t('presentation')} subtitle="7 slides · Tasks 1–4 · Live data from Supabase" />;
      case 'ask':
        return <PlaceholderCard icon={Bot} title={t('askData')} subtitle="AI-powered analytics · Claude API · Supabase Edge Function" />;
      case 'roadmap':
        return <PlaceholderCard icon={Map} title={t('roadmap')} subtitle="RICE-prioritized initiatives · Q2–Q4 2026" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="md:ml-[240px] p-4 md:p-10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default Index;
