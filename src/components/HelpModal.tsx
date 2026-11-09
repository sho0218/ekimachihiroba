import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Sparkles,
  Gift,
  Clock,
  MapPin,
  Camera,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tabId: any) => void;
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    q: '「にちなん駅まち広場」ってどんなアプリ？',
    a: 'JR日南線の待ち時間（列車の間隔が長い時間）を楽しく過ごしながら、日南の魅力的なスポットやお店を発見・共有し、貯めたポイントで実際のご褒美クーポンやデジタルカードがもらえる地域密着型コミュニティアプリです。',
  },
  {
    q: 'ポイントはどうやって貯めるの？',
    a: '「駅チェックイン（各駅1日1回・+30pt）」「待合室チャット（+10pt）」「写真・おすすめの口コミ投稿（+50pt）」「日南ご当地クイズ（+15〜50pt）」など、アプリを使うだけでどんどん貯まります！',
  },
  {
    q: 'クーポンはどうやって使うの？',
    a: '「クーポン」タブから欲しいお店のクーポンをポイントで交換し、店頭でスマホ画面を見せて「利用する」ボタンを押すと割引や特典が受けられます。',
  },
  {
    q: 'デジタルカードガチャとは？',
    a: '100ptで1回引けるデジタルコレクションです。「海幸山幸」や「みやざき犬」「鵜戸神宮」など日南の名所・名物が美麗カードになっています。コンプリートを目指しましょう！',
  },
  {
    q: '待ち時間の仲間や称号はどうやって設定する？',
    a: '「駅待ち」タブで同じ駅にいる仲間を自由に追加できます！またプロフィール設定から2つの一言（例:「飫肥の」×「お散歩マスター」）を組み合わせて自分だけのオリジナル称号を作れます。',
  },
];

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-linear-to-r from-amber-50 to-orange-50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-base sm:text-lg font-black text-slate-800">
                ご利用ガイド・ヘルプ
              </h2>
              <p className="text-[11px] text-slate-500">
                にちなん駅まち広場の遊び方・ポイントの貯め方
              </p>
            </div>
          </div>
          <button
            id="close-help-modal-btn"
            onClick={onClose}
            aria-label="閉じる"
            className="p-2 rounded-full hover:bg-white/80 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Quick Guide Card */}
          <div className="bg-linear-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-200 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>日南線の待ち時間を最高のご褒美タイムに！</span>
            </div>
            <p className="text-xs text-amber-50 leading-relaxed">
              電車の発車まであと数十分。「にちなん駅まち広場」なら、同じ駅にいる仲間と交流したり、クイズを解いたり、近くのお店のお得なクーポンをゲットして楽しく過ごせます。
            </p>
          </div>

          {/* Section: How to earn points */}
          <div>
            <h3 className="font-black text-sm text-slate-800 mb-2.5 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>ポイントの貯め方（まち活アクション）</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start space-x-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">駅チェックイン</span>
                    <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                      +30 pt
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    駅に着いたらチェックイン！連続日数ボーナスも。
                  </p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-xl flex items-start space-x-2.5">
                <div className="p-2 bg-cyan-500 text-white rounded-lg shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">待合室チャット</span>
                    <span className="text-[10px] font-extrabold text-cyan-700 bg-cyan-100 px-1.5 py-0.5 rounded">
                      +10 pt
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    待合室の仲間へ挨拶やスタンプを送って交流。
                  </p>
                </div>
              </div>

              <div className="p-3 bg-pink-50/70 border border-pink-200/80 rounded-xl flex items-start space-x-2.5">
                <div className="p-2 bg-pink-500 text-white rounded-lg shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">写真・口コミ投稿</span>
                    <span className="text-[10px] font-extrabold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">
                      +50 pt
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    駅前のおすすめ店や風景、みやざき犬を投稿！
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start space-x-2.5">
                <div className="p-2 bg-emerald-500 text-white rounded-lg shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">日南クイズ挑戦</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      +15~50 pt
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    海幸山幸や特産品のご当地3択クイズで知識試し！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Rewards & Enjoyment */}
          <div>
            <h3 className="font-black text-sm text-slate-800 mb-2.5 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>貯めたポイントのご褒美・使い道</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2 text-orange-600 font-bold text-xs mb-1">
                  <Gift className="w-4 h-4" />
                  <span>地元ショップのクーポン</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  カフェ割引、おび天1本プレゼント、売店割引など、駅周辺や商店街ですぐ使えるクーポンと交換できます。
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs mb-1">
                  <Layers className="w-4 h-4" />
                  <span>限定デジタルカードガチャ</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  100ptで1回ガチャが引けます。日南の特急や観光名所、グルメが美しいカードとしてアルバムに保管されます。
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div>
            <h3 className="font-black text-sm text-slate-800 mb-2.5 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>よくある質問（FAQ）</span>
            </h3>
            <div className="space-y-2">
              {FAQ_LIST.map((faq, index) => {
                const isOpenFaq = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      id={`faq-btn-${index}`}
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span className="flex items-center space-x-2 pr-2">
                        <span className="text-orange-500 font-extrabold">Q.</span>
                        <span>{faq.q}</span>
                      </span>
                      {isOpenFaq ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpenFaq && (
                      <div className="p-3 pt-0 text-xs text-slate-600 bg-slate-50/70 border-t border-slate-100 leading-relaxed">
                        <span className="font-bold text-emerald-600 mr-1">A.</span>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onNavigateToTab) onNavigateToTab('quests');
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 cursor-pointer"
          >
            🧠 日南クイズに挑戦する
          </button>
          <button
            id="help-modal-ok-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
