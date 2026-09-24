import React, { useState } from 'react';
import { DigitalCard, CardRarity, UserProfile } from '../types';
import {
  Sparkles,
  Award,
  Lock,
  Eye,
  X,
  Share2,
  Check,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CardGachaViewProps {
  cards: DigitalCard[];
  user: UserProfile;
  onPullGacha: () => DigitalCard | null;
}

export const CardGachaView: React.FC<CardGachaViewProps> = ({
  cards,
  user,
  onPullGacha,
}) => {
  const [selectedCard, setSelectedCard] = useState<DigitalCard | null>(null);
  const [pulledCard, setPulledCard] = useState<DigitalCard | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const acquiredCount = cards.filter((c) => c.acquired).length;
  const completionRate = Math.round((acquiredCount / cards.length) * 100);

  const GACHA_COST = 100;

  const handlePullClick = () => {
    if (user.points < GACHA_COST) {
      alert('ポイントが足りません！駅へのチェックインやクイズ、写真投稿でポイントをためてね。');
      return;
    }

    setIsPulling(true);
    setPulledCard(null);

    setTimeout(() => {
      const card = onPullGacha();
      if (card) {
        setPulledCard(card);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
        });
      }
      setIsPulling(false);
    }, 1200);
  };

  const getRarityBadge = (rarity: CardRarity) => {
    switch (rarity) {
      case 'UR':
        return (
          <span className="bg-linear-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs ring-1 ring-white/50">
            UR [ウルトラレア]
          </span>
        );
      case 'SSR':
        return (
          <span className="bg-linear-to-r from-amber-500 to-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
            SSR [スーパーレア]
          </span>
        );
      case 'SR':
        return (
          <span className="bg-linear-to-r from-blue-500 to-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
            SR [レア]
          </span>
        );
      case 'R':
      default:
        return (
          <span className="bg-slate-700 text-slate-100 font-semibold text-[10px] px-2 py-0.5 rounded-full">
            R [ノーマル]
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Gacha Pull Machine */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-5 sm:p-7 shadow-xl">
        {/* Background cosmic glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>日南限定デジタルカード ガチャ第1弾</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              日南の魅力が詰まった限定カードを集めよう！
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-lg">
              日南海岸の絶景、観光列車「海幸山幸」、飫肥城下町、みやざき犬など全{cards.length}種類の限定コレクション。
            </p>
          </div>

          {/* Gacha Pull Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 w-full sm:w-64">
            <div className="text-xs text-amber-200 font-medium mb-1">
              あなたの所持ポイント: <span className="font-bold text-white text-sm">{user.points} pt</span>
            </div>

            <button
              id="gacha-pull-button"
              disabled={isPulling || user.points < GACHA_COST}
              onClick={handlePullClick}
              className={`w-full py-3 px-4 rounded-xl font-black text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center space-x-2 ${
                isPulling
                  ? 'bg-purple-700 text-purple-200 animate-pulse'
                  : user.points >= GACHA_COST
                  ? 'bg-linear-to-r from-amber-400 via-orange-500 to-pink-500 hover:brightness-110 text-white active:scale-95 shadow-orange-500/30'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isPulling ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>カードを開封中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ガチャを引く ({GACHA_COST}pt)</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-white/60 mt-1.5">
              ※カードが重複した場合は+20ptボーナス
            </p>
          </div>
        </div>

        {/* Collection Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-purple-200 font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              コンプリート率: {acquiredCount} / {cards.length}枚 ({completionRate}%)
            </span>
          </div>

          <div className="w-full sm:w-64 h-2 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-linear-to-r from-amber-400 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gacha Result Display Modal */}
      {pulledCard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl max-w-sm w-full p-6 border border-amber-400/40 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-widest animate-pulse">
              ★ NEW CARD GET ★
            </div>

            {/* Card Preview in Modal */}
            <div className="relative aspect-3/4 w-56 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl ring-4 ring-amber-400/20">
              <img
                src={pulledCard.imageUrl}
                alt={pulledCard.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2">
                {getRarityBadge(pulledCard.rarity)}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-3 text-left">
                <span className="text-[10px] text-amber-300 font-mono">
                  {pulledCard.cardNumber}
                </span>
                <h4 className="text-sm font-black text-white leading-tight">
                  {pulledCard.title}
                </h4>
                <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">
                  {pulledCard.subtitle}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-amber-200">
                「{pulledCard.title}」
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed px-2">
                {pulledCard.flavorText}
              </p>
            </div>

            <button
              id="close-gacha-result-btn"
              onClick={() => setPulledCard(null)}
              className="w-full py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 font-bold text-xs text-slate-950 hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              コレクションに加える
            </button>
          </div>
        </div>
      )}

      {/* Card Collection Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-800">
              日南デジタルカードアルバム
            </h2>
            <p className="text-xs text-slate-500">
              カードをタップすると拡大表示や詳細な解説が見られます
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {acquiredCount}枚 獲得済み
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const isUnlocked = card.acquired;

            return (
              <div
                key={card.id}
                onClick={() => isUnlocked && setSelectedCard(card)}
                className={`relative rounded-2xl overflow-hidden border transition-all flex flex-col ${
                  isUnlocked
                    ? 'border-amber-200 hover:border-orange-400 shadow-xs hover:shadow-md cursor-pointer group hover:-translate-y-1'
                    : 'border-slate-200 bg-slate-100 opacity-60'
                }`}
              >
                {/* Card Visual */}
                <div className="relative aspect-3/4 w-full bg-slate-200 overflow-hidden">
                  {isUnlocked ? (
                    <>
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1.5 right-1.5">
                        {getRarityBadge(card.rarity)}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-[9px] text-amber-200 font-mono px-1.5 py-0.5 rounded">
                        {card.cardNumber}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <Lock className="w-6 h-6 mb-1 text-slate-400" />
                      <span className="text-[10px] font-bold">??? (未所持)</span>
                      <span className="text-[9px] text-slate-400 mt-1">
                        {card.rarity}カード
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info footer */}
                <div className="p-2.5 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`text-xs font-bold truncate ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                      {isUnlocked ? card.title : '未開放カード'}
                    </h3>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {isUnlocked ? card.subtitle : 'ガチャやクエストで獲得可能'}
                    </p>
                  </div>

                  {isUnlocked && (
                    <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                      <span>入手: {card.acquiredAt || '2026/09'}</span>
                      <span className="text-orange-500 font-bold group-hover:underline flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        詳細
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              {/* Card visual frame with foil shimmer effect */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-lg border border-amber-200">
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  {getRarityBadge(selectedCard.rarity)}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-xs font-mono">
                  {selectedCard.cardNumber}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-orange-600">
                  {selectedCard.subtitle}
                </span>
                <h3 className="text-lg font-black text-slate-800">
                  {selectedCard.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  {selectedCard.flavorText}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>獲得日: {selectedCard.acquiredAt || '2026/09/01'}</span>
                <button
                  onClick={() => {
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>リンクをコピーしました</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>友達に自慢する</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
