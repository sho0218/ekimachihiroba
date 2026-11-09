import React, { useState } from 'react';
import {
  Train,
  Camera,
  Award,
  Sparkles,
  Ticket,
  Trophy,
  Menu,
  X,
  HelpCircle,
  User,
  ChevronRight,
} from 'lucide-react';

export type NavTab = 'hub' | 'timeline' | 'quests' | 'cards' | 'coupons' | 'rankings';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unclaimedQuestsCount?: number;
  onOpenHelpModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  unclaimedQuestsCount = 0,
  onOpenHelpModal,
  onOpenProfileModal,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Full tab list for desktop bar
  const allTabs = [
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
  ];

  // Mobile Bottom Tab Bar items (Primary 4 + 1 Menu/Dynamic Tab)
  const isSecondaryActive = activeTab === 'coupons' || activeTab === 'rankings';

  const handleMobileTabClick = (tabId: NavTab) => {
    setIsMenuOpen(false);
    onTabChange(tabId);
  };

  const getSecondaryTabInfo = () => {
    if (activeTab === 'coupons') {
      return { label: 'クーポン', icon: Ticket };
    }
    if (activeTab === 'rankings') {
      return { label: 'ランキング', icon: Trophy };
    }
    return { label: 'メニュー', icon: Menu };
  };

  const secondaryInfo = getSecondaryTabInfo();
  const SecondaryIcon = secondaryInfo.icon;

  return (
    <>
      {/* 1. Desktop & Tablet Top Navigation (hidden on small mobile screens to keep view clean) */}
      <div className="hidden md:block bg-white border-b border-amber-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex space-x-2 py-2 overflow-x-auto scrollbar-none">
            {allTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-desktop-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/70'
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

      {/* 2. Mobile-First Bottom Navigation Bar (Fixed to bottom, ergonomic thumb zone) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/70 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] pb-safe transition-all">
        <div className="max-w-md mx-auto px-2">
          <div className="grid grid-cols-5 items-center h-15">
            {/* Tab 1: Hub (駅待ち) */}
            <button
              id="mobile-nav-hub"
              onClick={() => handleMobileTabClick('hub')}
              className={`flex flex-col items-center justify-center h-full w-full cursor-pointer transition-all active:scale-95 ${
                activeTab === 'hub' ? 'text-orange-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${activeTab === 'hub' ? 'bg-orange-100/80 text-orange-600' : ''}`}>
                <Train className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">駅待ち</span>
            </button>

            {/* Tab 2: Timeline (広場) */}
            <button
              id="mobile-nav-timeline"
              onClick={() => handleMobileTabClick('timeline')}
              className={`flex flex-col items-center justify-center h-full w-full cursor-pointer transition-all active:scale-95 ${
                activeTab === 'timeline' ? 'text-orange-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${activeTab === 'timeline' ? 'bg-orange-100/80 text-orange-600' : ''}`}>
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">広場写真</span>
            </button>

            {/* Tab 3: Quests (クイズ) */}
            <button
              id="mobile-nav-quests"
              onClick={() => handleMobileTabClick('quests')}
              className={`relative flex flex-col items-center justify-center h-full w-full cursor-pointer transition-all active:scale-95 ${
                activeTab === 'quests' ? 'text-orange-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${activeTab === 'quests' ? 'bg-orange-100/80 text-orange-600' : ''}`}>
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">クイズ</span>
              {unclaimedQuestsCount > 0 && (
                <span className="absolute top-1.5 right-3 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                  {unclaimedQuestsCount}
                </span>
              )}
            </button>

            {/* Tab 4: Cards (カード) */}
            <button
              id="mobile-nav-cards"
              onClick={() => handleMobileTabClick('cards')}
              className={`relative flex flex-col items-center justify-center h-full w-full cursor-pointer transition-all active:scale-95 ${
                activeTab === 'cards' ? 'text-orange-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${activeTab === 'cards' ? 'bg-orange-100/80 text-orange-600' : ''}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">カード</span>
              <span className="absolute top-1 right-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black px-1 rounded-full scale-90">
                ガチャ
              </span>
            </button>

            {/* Tab 5: Menu / Secondary Features */}
            <button
              id="mobile-nav-menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`relative flex flex-col items-center justify-center h-full w-full cursor-pointer transition-all active:scale-95 ${
                isSecondaryActive || isMenuOpen ? 'text-orange-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isSecondaryActive || isMenuOpen ? 'bg-orange-100/80 text-orange-600' : ''}`}>
                <SecondaryIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">
                {isSecondaryActive ? secondaryInfo.label : 'メニュー'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Bottom Action Sheet Drawer (when "メニュー" is tapped) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop dismiss */}
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />

          {/* Sheet Container */}
          <div className="bg-white rounded-t-3xl border-t border-amber-200 shadow-2xl p-5 pb-safe max-w-lg mx-auto w-full animate-in slide-in-from-bottom-5 duration-250">
            {/* Grab handle affordance */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  日南まち活メニュー
                </h3>
                <p className="text-xs text-slate-500">
                  駅待ちをもっと楽しむ便利機能
                </p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="space-y-2 mb-4">
              {/* Coupon item */}
              <button
                id="menu-sheet-coupons"
                onClick={() => handleMobileTabClick('coupons')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                  activeTab === 'coupons'
                    ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-800 hover:bg-orange-50/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold">地元クーポン</span>
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.2 rounded-full font-bold">
                        お得
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      日南のカフェや売店で使える割引券
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              {/* Leaderboard item */}
              <button
                id="menu-sheet-rankings"
                onClick={() => handleMobileTabClick('rankings')}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                  activeTab === 'rankings'
                    ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-800 hover:bg-orange-50/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold">まち活ランキング</span>
                    <p className="text-xs text-slate-500">
                      友達や市民とポイントやレベルを競おう
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Quick Actions (Help & Profile) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {onOpenHelpModal && (
                <button
                  id="menu-sheet-help"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenHelpModal();
                  }}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                  <span>使い方ガイド</span>
                </button>
              )}

              {onOpenProfileModal && (
                <button
                  id="menu-sheet-profile"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfileModal();
                  }}
                  className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-amber-600" />
                  <span>プロフィール</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
