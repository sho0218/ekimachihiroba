import React, { useState } from 'react';
import { Coupon, UserProfile } from '../types';
import {
  Ticket,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle,
  X,
  Store,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CouponShopViewProps {
  coupons: Coupon[];
  user: UserProfile;
  onUnlockCoupon: (couponId: string) => void;
  onUseCoupon: (couponId: string) => void;
}

export const CouponShopView: React.FC<CouponShopViewProps> = ({
  coupons,
  user,
  onUnlockCoupon,
  onUseCoupon,
}) => {
  const [activeModalCoupon, setActiveModalCoupon] = useState<Coupon | null>(null);
  const [useCountdown, setUseCountdown] = useState<number>(15 * 60); // 15 mins
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredCoupons = coupons.filter((cp) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'unlocked') return cp.isUnlocked && !cp.isUsed;
    return cp.category === filterCategory;
  });

  const handleUnlock = (coupon: Coupon) => {
    if (user.points < coupon.costPoints) {
      alert('ポイントが足りません！駅待ちクイズや写真投稿でポイントをためてね。');
      return;
    }
    onUnlockCoupon(coupon.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleOpenUseModal = (coupon: Coupon) => {
    setActiveModalCoupon(coupon);
    setUseCountdown(15 * 60);
  };

  const handleConfirmUse = (couponId: string) => {
    if (confirm('店舗スタッフの前で「利用済みにする」を押しますか？一度使用すると再利用はできません。')) {
      onUseCoupon(couponId);
      setActiveModalCoupon(null);
      confetti({
        particleCount: 40,
        spread: 50,
      });
    }
  };

  const mins = Math.floor(useCountdown / 60);
  const secs = useCountdown % 60;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>日南のお店を応援！地域連携ご褒美</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            近くのカフェや売店で使えるデジタルクーポン
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            駅でためたまち活ポイントを、放課後スイーツや売店で使えるお得な割引券に交換できます！
          </p>

          <div className="mt-4 inline-flex items-center bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/20 text-xs">
            <span className="text-emerald-200">あなたの所持ポイント:</span>
            <span className="font-black text-sm ml-1 text-white">{user.points} pt</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'すべて' },
          { id: 'unlocked', label: '✨ 所持中のクーポン' },
          { id: 'cafe', label: '☕ カフェ' },
          { id: 'gourmet', label: '🍢 ご当地グルメ' },
          { id: 'shop', label: '🛍️ 売店・グッズ' },
        ].map((f) => (
          <button
            key={f.id}
            id={`coupon-filter-${f.id}`}
            onClick={() => setFilterCategory(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === f.id
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
              coupon.isUsed
                ? 'opacity-60 border-slate-200'
                : coupon.isUnlocked
                ? 'border-emerald-300 ring-2 ring-emerald-400/20'
                : 'border-amber-100 hover:border-orange-300'
            }`}
          >
            <div>
              {/* Image & Discount Badge */}
              <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                <img
                  src={coupon.imageUrl}
                  alt={coupon.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-orange-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  {coupon.discountText}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>有効期間 {coupon.expiresInDays}日間</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center text-[11px] text-slate-500 gap-1">
                  <Store className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-semibold text-slate-700 truncate">
                    {coupon.storeName}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                  {coupon.title}
                </h3>

                <div className="flex items-center text-[10px] text-slate-400 gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{coupon.area}</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-3.5 pt-0">
              {coupon.isUsed ? (
                <div className="w-full py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl text-center">
                  利用済み
                </div>
              ) : coupon.isUnlocked ? (
                <button
                  id={`use-coupon-btn-${coupon.id}`}
                  onClick={() => handleOpenUseModal(coupon)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Ticket className="w-4 h-4" />
                  <span>今すぐ店頭で使う</span>
                </button>
              ) : (
                <button
                  id={`unlock-coupon-btn-${coupon.id}`}
                  onClick={() => handleUnlock(coupon)}
                  disabled={user.points < coupon.costPoints}
                  className={`w-full py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    user.points >= coupon.costPoints
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{coupon.costPoints} pt で交換</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* In-Store Coupon Modal */}
      {activeModalCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl relative text-center space-y-4 animate-in zoom-in-95">
            <button
              onClick={() => setActiveModalCoupon(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>クーポン提示画面</span>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                {activeModalCoupon.storeName}
              </p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">
                {activeModalCoupon.title}
              </h3>
            </div>

            {/* Barcode Simulator Frame */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-2">
              <span className="text-[10px] text-slate-400 font-semibold block">
                レジでお会計時にご提示ください
              </span>

              {/* Barcode graphic */}
              <div className="h-16 flex items-center justify-center gap-1 overflow-hidden px-4 bg-white rounded-lg border border-slate-200">
                {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 8, 2, 5, 3, 6, 2, 4, 1, 5, 3, 6, 2].map(
                  (w, i) => (
                    <div
                      key={i}
                      className="h-full bg-slate-800"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  )
                )}
              </div>

              <div className="font-mono text-xs font-bold text-slate-700 tracking-wider">
                {activeModalCoupon.barcode}
              </div>

              <div className="text-[10px] text-amber-700 font-bold bg-amber-50 p-1.5 rounded-lg flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>画面提示有効時間: {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="confirm-use-coupon-btn"
                onClick={() => handleConfirmUse(activeModalCoupon.id)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                スタッフ確認済み（使用済みにする）
              </button>
              <button
                onClick={() => setActiveModalCoupon(null)}
                className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                閉じる（あとで使う）
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
