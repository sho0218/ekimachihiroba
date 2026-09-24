import React, { useState } from 'react';
import { LeaderboardUser, UserProfile } from '../types';
import { LEADERBOARD_USERS } from '../data/mockData';
import { Trophy, Medal, Flame, Camera, Sparkles } from 'lucide-react';

interface LeaderboardViewProps {
  user: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ user }) => {
  const [rankingType, setRankingType] = useState<'points' | 'photos' | 'streak'>('points');

  // Dynamically update user's own points in the leaderboard
  const sortedUsers: LeaderboardUser[] = LEADERBOARD_USERS.map((u) => {
    if (u.isMe) {
      return {
        ...u,
        name: `${user.name}（あなた）`,
        points: user.points,
        title: user.title,
        avatar: user.avatar,
      };
    }
    return u;
  }).sort((a, b) => {
    if (rankingType === 'points') return b.points - a.points;
    if (rankingType === 'photos') return b.postsCount - a.postsCount;
    return b.points - a.points;
  }).map((u, idx) => ({
    ...u,
    rank: idx + 1,
  }));

  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return (
      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
        {rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-yellow-200" />
            <span>今週の日南まち活バトル</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            友達と競えるランキング！
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            日南線各駅へのチェックイン、写真・口コミ投稿、クイズ正解数で毎週上位を目指そう！上位者には限定デジタル称号を付与。
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-amber-100 shadow-xs max-w-md mx-auto">
        <button
          id="ranking-tab-points"
          onClick={() => setRankingType('points')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
            rankingType === 'points'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-orange-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>まち活ポイント</span>
        </button>

        <button
          id="ranking-tab-photos"
          onClick={() => setRankingType('photos')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
            rankingType === 'photos'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-orange-600'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>フォト投稿数</span>
        </button>

        <button
          id="ranking-tab-streak"
          onClick={() => setRankingType('streak')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 ${
            rankingType === 'streak'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-orange-600'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>連続チェックイン</span>
        </button>
      </div>

      {/* Podium for Top 3 */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs">
        <h2 className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          🏆 TOP RANKERS 🏆
        </h2>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-md mx-auto mb-6">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🥈</span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-2xl shadow-xs">
                {topThree[1].avatar}
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full">
                {topThree[1].name}
              </span>
              <span className="text-[10px] text-orange-600 font-extrabold">
                {rankingType === 'points' ? `${topThree[1].points} pt` : `${topThree[1].postsCount} 投稿`}
              </span>
              <div className="w-full h-16 bg-slate-100 rounded-t-xl mt-2 flex items-center justify-center font-black text-slate-400 text-sm">
                2位
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl mb-1 animate-bounce">👑</span>
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-3xl shadow-md ring-4 ring-amber-400/20">
                {topThree[0].avatar}
              </div>
              <span className="text-xs font-black text-slate-800 mt-2 truncate w-full">
                {topThree[0].name}
              </span>
              <span className="text-xs text-amber-600 font-black">
                {rankingType === 'points' ? `${topThree[0].points} pt` : `${topThree[0].postsCount} 投稿`}
              </span>
              <div className="w-full h-24 bg-linear-to-t from-amber-400 to-amber-300 text-amber-950 font-black rounded-t-xl mt-2 flex items-center justify-center text-base shadow-xs">
                1位
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🥉</span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 border-2 border-amber-600 flex items-center justify-center text-2xl shadow-xs">
                {topThree[2].avatar}
              </div>
              <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full">
                {topThree[2].name}
              </span>
              <span className="text-[10px] text-orange-600 font-extrabold">
                {rankingType === 'points' ? `${topThree[2].points} pt` : `${topThree[2].postsCount} 投稿`}
              </span>
              <div className="w-full h-12 bg-amber-100/70 rounded-t-xl mt-2 flex items-center justify-center font-black text-amber-800 text-sm">
                3位
              </div>
            </div>
          )}
        </div>

        {/* Full List */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          {sortedUsers.map((u) => {
            const isMe = u.isMe;

            return (
              <div
                key={u.id}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                  isMe
                    ? 'bg-orange-50 border-2 border-orange-300 ring-2 ring-orange-400/20'
                    : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 text-center shrink-0">
                    {getRankBadge(u.rank)}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg border border-slate-200 shrink-0">
                    {u.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {u.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{u.title}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-orange-600 block">
                    {rankingType === 'points' ? `${u.points.toLocaleString()} pt` : `${u.postsCount} 投稿`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {rankingType === 'points' ? `${u.postsCount}件 投稿` : `${u.points} pt`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
