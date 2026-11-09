import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Flame, Check, RotateCcw, Sparkles } from 'lucide-react';
import { TITLE_PREFIXES, TITLE_SUFFIXES } from '../data/mockData';

interface ProfileModalProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  onResetData: () => void;
}

const AVATAR_OPTIONS = ['🌊', '🎒', '🧢', '🧁', '📸', '⚾', '🌴', '🐶', '🚃', '🌲'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onUpdateUser,
  onClose,
  onResetData,
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [part1, setPart1] = useState(user.titlePart1 || '飫肥の');
  const [part2, setPart2] = useState(user.titlePart2 || 'お散歩マスター');
  const [savedMessage, setSavedMessage] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const combinedTitle = `${part1}${part2}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim() || user.name,
      avatar,
      title: combinedTitle,
      titlePart1: part1,
      titlePart2: part2,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md text-white">
            {avatar}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">
              プロフィール・ステータス
            </h3>
            <p className="text-[11px] text-slate-500">
              名前やアイコンを変更して駅まち仲間と交流しよう！
            </p>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="grid grid-cols-3 gap-2 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80 mb-4 text-center">
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">所持ポイント</span>
            <span className="text-sm font-black text-orange-600">
              {user.points.toLocaleString()} pt
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">レベル</span>
            <span className="text-sm font-black text-slate-800">
              Lv.{user.level}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-medium block">連続チェックイン</span>
            <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              {user.streakDays}日
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Nickname */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ニックネーム
            </label>
            <input
              type="text"
              id="profile-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none"
              required
            />
          </div>

          {/* Avatar Options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              アバター絵文字
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((em, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(em)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    avatar === em
                      ? 'bg-orange-600 text-white ring-2 ring-orange-400'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Two-word Title Combination Customizer */}
          <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2つの一言でつくるオリジナル称号</span>
              </label>
            </div>

            {/* Live Combined Preview */}
            <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-xs mb-3 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">完成した称号</span>
              <span className="text-sm font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block">
                {combinedTitle}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Part 1: Prefix */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  ① 前半の一言（まち・雰囲気）
                </span>
                <div className="flex flex-wrap gap-1">
                  {TITLE_PREFIXES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPart1(p)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        part1 === p
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Part 2: Suffix */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  ② 後半の一言（役割・キャラクター）
                </span>
                <div className="flex flex-wrap gap-1">
                  {TITLE_SUFFIXES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPart2(s)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        part2 === s
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isConfirmingReset ? (
              <div className="flex items-center space-x-1.5 bg-red-50 p-1.5 rounded-xl border border-red-200">
                <span className="text-[10px] text-red-700 font-bold">リセットしますか？</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetData();
                    onClose();
                  }}
                  className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 cursor-pointer"
                >
                  実行
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-1.5 py-0.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] hover:bg-slate-300 cursor-pointer"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingReset(true)}
                className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>データをリセット</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                キャンセル
              </button>
              <button
                type="submit"
                id="save-profile-btn"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md active:scale-95 transition-all flex items-center space-x-1"
              >
                {savedMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>保存しました！</span>
                  </>
                ) : (
                  <span>保存する</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
