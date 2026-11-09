import React from 'react';
import { UserProfile, StationInfo } from '../types';
import { Sparkles, Award, Flame, MapPin, HelpCircle } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  activeStation: StationInfo;
  onOpenProfileModal?: () => void;
  onOpenHelpModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeStation,
  onOpenProfileModal,
  onOpenHelpModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* App Title & Brand */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-linear-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 text-base sm:text-lg shrink-0">
            🚃
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 truncate">
                にちなん駅まち広場
              </span>
            </div>
            <div className="flex items-center text-[11px] text-slate-500 space-x-1.5">
              <span className="flex items-center font-bold text-orange-600 truncate">
                <MapPin className="w-3 h-3 mr-0.5 shrink-0" />
                {activeStation.name}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 truncate">
                あと約{activeStation.nextTrainMins}分
              </span>
            </div>
          </div>
        </div>

        {/* User Stats, Badges & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Streak (compact on mobile) */}
          <div 
            title={`${user.streakDays}日連続チェックイン中！`}
            className="flex items-center space-x-0.5 bg-orange-50 border border-orange-200/80 px-2 py-1 rounded-full text-[11px] text-orange-700 font-bold"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
            <span>{user.streakDays}日</span>
          </div>

          {/* Points Chip */}
          <button
            id="user-points-badge"
            onClick={onOpenProfileModal}
            className="flex items-center space-x-1 bg-linear-to-r from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 border border-amber-300/80 px-2.5 py-1 rounded-full text-xs font-bold text-amber-900 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="所持ポイント（タップで詳細）"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
            <span className="tabular-nums">{user.points.toLocaleString()} pt</span>
          </button>

          {/* Avatar & Profile Button */}
          <button
            id="user-profile-button"
            onClick={onOpenProfileModal}
            className="flex items-center space-x-1.5 pl-0.5 pr-2 py-0.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60 active:scale-95"
            title="プロフィール設定・ステータス"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-amber-200 to-orange-200 flex items-center justify-center text-sm shadow-2xs border border-white shrink-0">
              {user.avatar}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-bold text-slate-700 leading-tight truncate max-w-[80px]">
                {user.name}
              </p>
              <p className="text-[9px] text-orange-600 font-medium leading-none">
                Lv.{user.level} {user.title}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
