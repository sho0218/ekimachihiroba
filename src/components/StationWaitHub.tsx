import React, { useState, useEffect } from 'react';
import {
  StationInfo,
  StationId,
  UserProfile,
  ChatMessage,
  WaitMate,
} from '../types';
import { STATIONS, CHAT_PRESETS, STAMP_OPTIONS } from '../data/mockData';
import { getTodayDateString, loadWaitMates, saveWaitMates } from '../utils/storage';
import {
  Train,
  Clock,
  Users,
  Send,
  CheckCircle,
  MapPin,
  Smile,
  Compass,
  Sparkles,
  HelpCircle,
  UserPlus,
  Plus,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StationWaitHubProps {
  activeStation: StationInfo;
  onSelectStation: (stationId: StationId) => void;
  user: UserProfile;
  onCheckIn: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, stamp?: string) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenHelp?: () => void;
}

export const StationWaitHub: React.FC<StationWaitHubProps> = ({
  activeStation,
  onSelectStation,
  user,
  onCheckIn,
  messages,
  onSendMessage,
  onNavigateToTab,
  onOpenHelp,
}) => {
  const [inputText, setInputText] = useState('');
  const [showStampPicker, setShowStampPicker] = useState(false);
  const todayStr = getTodayDateString();
  const isCheckedInToday = user.stationCheckIns?.[activeStation.id] === todayStr;
  const [timeRemainingSecs, setTimeRemainingSecs] = useState(activeStation.nextTrainMins * 60);

  // Fellow wait-mates state for this station
  const [waitMates, setWaitMates] = useState<WaitMate[]>(() => loadWaitMates(activeStation.id));
  const [isAddMateModalOpen, setIsAddMateModalOpen] = useState(false);
  const [newMateName, setNewMateName] = useState('');
  const [newMateAvatar, setNewMateAvatar] = useState('🎒');
  const [newMateWait, setNewMateWait] = useState('あと15分');
  const [newMateStatus, setNewMateStatus] = useState('カフェ中☕');

  // Reload wait mates when active station changes
  useEffect(() => {
    setWaitMates(loadWaitMates(activeStation.id));
  }, [activeStation.id]);

  // Train countdown simulation
  useEffect(() => {
    setTimeRemainingSecs(activeStation.nextTrainMins * 60);
    const interval = setInterval(() => {
      setTimeRemainingSecs((prev) => (prev > 1 ? prev - 1 : activeStation.nextTrainMins * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeStation]);

  const mins = Math.floor(timeRemainingSecs / 60);
  const secs = timeRemainingSecs % 60;

  const handleCheckInClick = () => {
    if (isCheckedInToday) return;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f97316', '#fbbf24', '#38bdf8', '#34d399'],
    });
    onCheckIn();
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowStampPicker(false);
  };

  const handleSendPreset = (presetText: string, stamp?: string) => {
    onSendMessage(presetText, stamp);
  };

  const handleSendStamp = (emoji: string) => {
    onSendMessage('', emoji);
    setShowStampPicker(false);
  };

  const handleAddWaitMate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMateName.trim()) return;
    const newMate: WaitMate = {
      id: `wm_${Date.now()}`,
      stationId: activeStation.id,
      name: newMateName.trim(),
      avatar: newMateAvatar,
      wait: newMateWait.trim() || '列車を待機中',
      status: newMateStatus.trim() || '待合室で待機🪑',
      isCustom: true,
    };
    const updated = [newMate, ...waitMates];
    setWaitMates(updated);
    saveWaitMates(activeStation.id, updated);
    setNewMateName('');
    setIsAddMateModalOpen(false);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#38bdf8'],
    });
  };

  return (
    <div className="space-y-5">
      {/* Station Selector Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center pl-1">
            <Compass className="w-3.5 h-3.5 mr-1 text-orange-500" />
            駅を選ぶ:
          </span>
          {STATIONS.map((station) => (
            <button
              key={station.id}
              id={`station-selector-${station.id}`}
              onClick={() => onSelectStation(station.id)}
              className={`px-3.5 py-2 min-h-[40px] rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 ${
                activeStation.id === station.id
                  ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-400/40'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
              }`}
            >
              {station.name}
            </button>
          ))}
        </div>

        {onOpenHelp && (
          <button
            id="hub-help-guide-btn"
            onClick={onOpenHelp}
            className="shrink-0 flex items-center space-x-1.5 text-xs font-bold text-orange-700 bg-orange-100/90 hover:bg-orange-200 border border-orange-300/80 px-3.5 py-2 min-h-[40px] rounded-full transition-all cursor-pointer shadow-2xs active:scale-95 ml-auto"
          >
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>遊び方ガイド</span>
          </button>
        )}
      </div>

      {/* Hero Station Countdown Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 text-white p-5 sm:p-7 shadow-lg shadow-orange-500/20">
        {/* Background decorative circles & train silhouette */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-7xl opacity-10 select-none pointer-events-none">
          🚃
        </div>

        {/* 50-char catchphrase banner */}
        <div className="relative z-10 mb-3 inline-flex items-center space-x-1.5 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>待ち時間をまちの思い出に！日南線でつながる、集める、楽しむ地域コミュニティ</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-2 text-white/95">
              <span>{activeStation.line}</span>
              <span>•</span>
              <span>{activeStation.direction}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{activeStation.name}</span>
              <span className="text-xs font-normal bg-black/20 px-2 py-0.5 rounded-md text-amber-100">
                {activeStation.kana}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-amber-50/90 mt-1 max-w-lg leading-relaxed">
              {activeStation.description}
            </p>
          </div>

          {/* Countdown timer module */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center shrink-0 w-full sm:w-auto sm:min-w-[220px]">
            <div className="text-[11px] font-semibold text-amber-200 flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>次の列車まで（目安）</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white drop-shadow-xs">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <div className="text-[11px] text-white/85 mt-1 flex items-center justify-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>日南線運行中・待合室利用可能</span>
            </div>

            {/* Check-in Action Button (1 check-in per station per day) */}
            <button
              id="check-in-station-btn"
              onClick={handleCheckInClick}
              disabled={isCheckedInToday}
              className={`mt-3.5 w-full min-h-[48px] py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-md ${
                isCheckedInToday
                  ? 'bg-emerald-600/95 text-white cursor-default ring-2 ring-emerald-400/40'
                  : 'bg-white text-orange-700 hover:bg-amber-50 active:scale-95 shadow-orange-950/20 cursor-pointer'
              }`}
            >
              {isCheckedInToday ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>{activeStation.name} チェックイン済み（また明日！）</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>{activeStation.name}にチェックイン！ (+30pt / 各駅1日1回)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="relative mt-5 pt-3 border-t border-white/20">
          <div className="flex justify-between text-[11px] text-amber-100 font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <Train className="w-3.5 h-3.5" />
              宮崎・南宮崎行
            </span>
            <span>現在位置: 手前駅走行中</span>
          </div>
          <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-linear-to-r from-amber-200 to-white rounded-full transition-all duration-1000"
              style={{ width: `${Math.max(15, 100 - (timeRemainingSecs / (activeStation.nextTrainMins * 60)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Waiting Room Community: Fellow Wait-Mates & Waiting Room Talk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Fellow Wait-Mates & Quick Activities */}
        <div className="space-y-4 lg:col-span-1">
          {/* Fellow Wait-Mates Card */}
          <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    同じ待ち時間の仲間
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    {activeStation.name}で今チェックイン中
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  id="add-waitmate-btn"
                  onClick={() => setIsAddMateModalOpen(true)}
                  className="flex items-center space-x-1 text-[11px] font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  title="待ち時間の仲間を追加する"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>仲間を追加</span>
                </button>
                <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {waitMates.length + (isCheckedInToday ? 1 : 0)}人
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {isCheckedInToday && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{user.avatar}</span>
                    <div>
                      <span className="font-bold text-slate-800">{user.name}</span>
                      <span className="text-[10px] text-orange-600 ml-1 font-semibold">
                        (あなた)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-medium text-slate-600 border border-slate-200">
                    チェックイン中
                  </span>
                </div>
              )}

              {waitMates.map((mate) => (
                <div
                  key={mate.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{mate.avatar}</span>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-slate-800">{mate.name}</span>
                        {mate.isCustom && (
                          <span className="text-[9px] bg-orange-100 text-orange-700 px-1 py-0.2 rounded font-bold">
                            追加
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{mate.status}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                    {mate.wait}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Waiting-Time Actions Card */}
          <div className="bg-linear-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 border border-amber-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              待ち時間のオススメ行動
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                id="quick-action-quiz"
                onClick={() => onNavigateToTab('quests')}
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-orange-50/80 border border-amber-200 text-slate-700 font-medium transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span>🧠</span>
                  <span>日南ご当地クイズに挑戦 (+30pt)</span>
                </div>
                <span className="text-orange-500 font-bold">→</span>
              </button>
              <button
                id="quick-action-photo"
                onClick={() => onNavigateToTab('timeline')}
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-orange-50/80 border border-amber-200 text-slate-700 font-medium transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span>📸</span>
                  <span>今日の駅周辺写真を投稿 (+50pt)</span>
                </div>
                <span className="text-orange-500 font-bold">→</span>
              </button>
              <button
                id="quick-action-gacha"
                onClick={() => onNavigateToTab('cards')}
                className="w-full text-left p-2 rounded-xl bg-white hover:bg-orange-50/80 border border-amber-200 text-slate-700 font-medium transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <span>🃏</span>
                  <span>日南限定カードガチャを引く</span>
                </div>
                <span className="text-orange-500 font-bold">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Station Wait Chat (Waiting Room Talk) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-amber-100 shadow-xs flex flex-col h-[480px]">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>💬</span>
                <span>{activeStation.name} 待ち時間チャット</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                同じ待ち時間の友達と情報共有や雑談をしよう！
              </p>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              リアルタイム更新中
            </span>
          </div>

          {/* Quick presets bar */}
          <div className="py-2 flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0 border-b border-slate-50">
            <span className="text-[10px] text-slate-400 font-medium shrink-0">
              クイック送信:
            </span>
            {CHAT_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendPreset(p.text, p.stamp)}
                className="text-[11px] bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {p.stamp} {p.text}
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
            {messages.map((msg) => {
              const isMe = msg.userId === user.id || msg.isCurrentUser;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm shrink-0 border border-slate-200">
                    {msg.userAvatar}
                  </div>
                  <div className={`max-w-[80%] ${isMe ? 'items-end text-right' : ''}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-600">
                        {isMe ? 'あなた' : msg.userName}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`p-2.5 rounded-2xl text-xs leading-relaxed inline-block ${
                        isMe
                          ? 'bg-orange-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                      }`}
                    >
                      {msg.text}
                      {msg.stamp && (
                        <div className="text-xl mt-1 select-none">{msg.stamp}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stamp Picker Popover */}
          {showStampPicker && (
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 mb-2 grid grid-cols-4 sm:grid-cols-8 gap-2 shrink-0 animate-in fade-in zoom-in-95">
              {STAMP_OPTIONS.map((st, i) => (
                <button
                  key={i}
                  onClick={() => handleSendStamp(st.emoji)}
                  className="p-1.5 bg-white hover:bg-orange-100 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border border-amber-100"
                >
                  <span className="text-lg">{st.emoji}</span>
                  <span className="text-[9px] text-slate-600 truncate w-full text-center">
                    {st.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Chat Input form */}
          <form
            onSubmit={handleSend}
            className="pt-2 border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              id="open-stamp-picker-btn"
              onClick={() => setShowStampPicker(!showStampPicker)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                showStampPicker
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="スタンプを送る"
            >
              <Smile className="w-4 h-4" />
            </button>

            <input
              type="text"
              id="chat-input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="待ち時間のメッセージを入力..."
              className="flex-1 bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 px-3.5 py-2 rounded-xl text-xs text-slate-800 border border-transparent focus:border-orange-300 transition-all"
            />

            <button
              type="submit"
              id="chat-send-btn"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 disabled:hover:bg-orange-600 transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Add Fellow Wait-Mate Modal */}
      {isAddMateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setIsAddMateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                <UserPlus className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  待ち時間の仲間を追加
                </h3>
                <p className="text-[11px] text-slate-500">
                  📍 {activeStation.name} で一緒に待っている人を登録
                </p>
              </div>
            </div>

            <form onSubmit={handleAddWaitMate} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ニックネーム / 肩書
                </label>
                <input
                  type="text"
                  id="add-mate-name-input"
                  value={newMateName}
                  onChange={(e) => setNewMateName(e.target.value)}
                  placeholder="例: テスト終わりの高校生, カメラ旅人"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none"
                  required
                />
              </div>

              {/* Avatar Emoji */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  アイコン（絵文字）
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['🎒', '🧢', '🧁', '🌊', '📸', '⚾', '🌲', '🚃', '🐶', '☕', '📖', '🚲'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewMateAvatar(em)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all cursor-pointer ${
                        newMateAvatar === em
                          ? 'bg-orange-500 text-white shadow-xs scale-105'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wait Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  待ち時間・予定
                </label>
                <input
                  type="text"
                  id="add-mate-wait-input"
                  value={newMateWait}
                  onChange={(e) => setNewMateWait(e.target.value)}
                  placeholder="例: あと15分, 18:30発"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none mb-1"
                />
                <div className="flex flex-wrap gap-1">
                  {['あと10分', 'あと15分', 'あと25分', '次発列車'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNewMateWait(opt)}
                      className="text-[10px] bg-slate-100 hover:bg-orange-50 text-slate-600 px-2 py-0.5 rounded-md font-medium cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status / Activity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  今の過ごし方
                </label>
                <input
                  type="text"
                  id="add-mate-status-input"
                  value={newMateStatus}
                  onChange={(e) => setNewMateStatus(e.target.value)}
                  placeholder="例: カフェ中☕, 宿題中📖"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none mb-1"
                />
                <div className="flex flex-wrap gap-1">
                  {['カフェ中☕', '読書中📖', '駅舎ベンチ🪑', '写真撮影中📸', '宿題中✏️', '散歩中🚶'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewMateStatus(s)}
                      className="text-[10px] bg-slate-100 hover:bg-orange-50 text-slate-600 px-2 py-0.5 rounded-md font-medium cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddMateModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  id="submit-new-waitmate-btn"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>仲間に追加する</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
