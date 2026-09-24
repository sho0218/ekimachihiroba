import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Award, Flame, Sparkles, Check, RotateCcw } from 'lucide-react';

interface ProfileModalProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  onResetData: () => void;
}

const AVATAR_OPTIONS = ['🌊', '🎒', '🧢', '🧁', '📸', '⚾', '🌴', '🐶', '🚃', '🌲'];
const TITLE_OPTIONS = [
  '飫肥のお散歩マスター',
  '油津カフェ通',
  '日南線トレインファン',
  '日南マスター',
  '飫肥の若武者',
  '日南海岸ナビゲーター',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onUpdateUser,
  onClose,
  onResetData,
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [title, setTitle] = useState(user.title);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim() || user.name,
      avatar,
      title,
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

          {/* Title Options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              称号・肩書
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {TITLE_OPTIONS.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTitle(t)}
                  className={`p-2 rounded-xl text-left truncate font-bold border transition-all cursor-pointer ${
                    title === t
                      ? 'bg-orange-50 border-orange-500 text-orange-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('デモデータを初期状態にリセットしますか？')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>データをリセット</span>
            </button>

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
