import React from 'react';
import { Map, Layers, Calendar, Home, Sparkles, Clock } from 'lucide-react';
import { ApiKeySettings } from './ApiKeySettings';
import { AccountSettings } from './AccountSettings';

export type TabType = 'home' | 'bodymap' | 'solutions' | 'plan';

interface NavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onQuick3Min: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  onQuick3Min
}) => {
  const navItems = [
    { id: 'home' as TabType, label: '首页', icon: Home },
    { id: 'bodymap' as TabType, label: '身体地图', icon: Map, badge: '核心' },
    { id: 'solutions' as TabType, label: '办公室方案', icon: Layers },
    { id: 'plan' as TabType, label: '我的方案 & 统计', icon: Calendar }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onChangeTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center font-black shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform relative">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span className="absolute -top-1 -right-1 text-[10px]">🌱</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">
                MeloStretch
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                🌱 舒缓助手
              </span>
            </div>
            <p className="text-[10px] text-emerald-600/80 font-medium hidden sm:block">
              办公室肌肉排查 · 极速放松
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-emerald-50/70 p-1 rounded-2xl border border-emerald-100/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-100/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center gap-2">
          <AccountSettings />
          <ApiKeySettings />
          <button
            onClick={onQuick3Min}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3分钟极速</span>舒缓
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-emerald-100 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-emerald-700 font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
