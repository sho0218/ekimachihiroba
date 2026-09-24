import React from 'react';
import {
  Train,
  Camera,
  Award,
  Sparkles,
  Ticket,
  Trophy,
  Lightbulb,
} from 'lucide-react';

export type NavTab = 'hub' | 'timeline' | 'quests' | 'cards' | 'coupons' | 'rankings' | 'ideas';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unclaimedQuestsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  unclaimedQuestsCount = 0,
}) => {
  const tabs = [
    {
      id: 'hub' as NavTab,
      label: '駅待ち',
      icon: Train,
      badge: null,
      sublabel: 'チェックイン&チャット',
    },
    {
      id: 'timeline' as NavTab,
      label: 'タイムライン',
      icon: Camera,
      badge: null,
      sublabel: '写真&口コミ',
    },
    {
      id: 'quests' as NavTab,
      label: 'クエスト/クイズ',
      icon: Award,
      badge: unclaimedQuestsCount > 0 ? unclaimedQuestsCount : null,
      sublabel: 'ミッション&知識',
    },
    {
      id: 'cards' as NavTab,
      label: '限定カード',
      icon: Sparkles,
      badge: 'ガチャ',
      sublabel: '日南コレクション',
    },
    {
      id: 'coupons' as NavTab,
      label: 'クーポン',
      icon: Ticket,
      badge: null,
      sublabel: 'カフェ&売店',
    },
    {
      id: 'rankings' as NavTab,
      label: 'ランキング',
      icon: Trophy,
      badge: null,
      sublabel: '友達と競う',
    },
    {
      id: 'ideas' as NavTab,
      label: 'アイディア箱',
      icon: Lightbulb,
      badge: '提案',
      sublabel: 'みんなの要望',
    },
  ];

  return (
    <div className="bg-white border-b border-amber-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`relative shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                      isActive
                        ? 'bg-white text-orange-600'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
