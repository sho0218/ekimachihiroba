import React from 'react';
import { UserProfile, StationInfo } from '../types';
import { Sparkles, Award, Flame, MapPin } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  activeStation: StationInfo;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeStation,
  onOpenProfileModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* App Title & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 text-lg">
            🚃
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-800">
                にちなん駅まち広場
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                日南線公認風
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500 space-x-2">
              <span className="flex items-center font-medium text-orange-600">
                <MapPin className="w-3 h-3 mr-0.5" />
                {activeStation.name}
              </span>
              <span className="text-slate-300">|</span>
              <span className="truncate max-w-[120px] sm:max-w-none text-slate-500">
                次の列車まで約{activeStation.nextTrainMins}分
              </span>
            </div>
          </div>
        </div>

        {/* User Stats & Badges */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak */}
          <div 
            title={`${user.streakDays}日連続チェックイン中！`}
            className="hidden sm:flex items-center space-x-1 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-full text-xs text-orange-700 font-bold"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{user.streakDays}日連続</span>
          </div>

          {/* Points Chip */}
          <button
            id="user-points-badge"
            onClick={onOpenProfileModal}
            className="flex items-center space-x-1.5 bg-linear-to-r from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 border border-amber-300/80 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{user.points.toLocaleString()} pt</span>
          </button>

          {/* Avatar & Level */}
          <button
            id="user-profile-button"
            onClick={onOpenProfileModal}
            className="flex items-center space-x-1.5 pl-1 pr-2.5 py-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer border border-slate-200/60"
            title="プロフィール設定・ステータス"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-amber-200 to-orange-200 flex items-center justify-center text-sm shadow-xs border border-white">
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
