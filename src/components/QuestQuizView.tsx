import React, { useState } from 'react';
import { Quest, QuizQuestion, UserProfile } from '../types';
import { QUIZ_QUESTIONS } from '../data/mockData';
import {
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  MapPin,
  Camera,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuestQuizViewProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  user: UserProfile;
  onAddPoints: (points: number) => void;
}

export const QuestQuizView: React.FC<QuestQuizViewProps> = ({
  quests,
  onCompleteQuest,
  user,
  onAddPoints,
}) => {
  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [pointsEarnedInQuiz, setPointsEarnedInQuiz] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentQuizIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
    setIsAnswerChecked(true);

    if (idx === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
      setPointsEarnedInQuiz((prev) => prev + currentQ.pointsReward);
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Quiz finished
      setQuizFinished(true);
      if (pointsEarnedInQuiz > 0) {
        onAddPoints(pointsEarnedInQuiz);
      }
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setQuizScore(0);
    setQuizFinished(false);
    setPointsEarnedInQuiz(0);
  };

  const getQuestIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-sky-500" />;
      case 'HelpCircle':
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: NICHINAN TRIVIA QUIZ (列車待ち時間の暇つぶしクイズ) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-base font-extrabold text-slate-800">
                  日南・駅待ちご当地クイズ
                </h2>
                <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                  待ち時間3分
                </span>
              </div>
              <p className="text-xs text-slate-500">
                日南線や日南の歴史・名物を学んでポイント＆カードをゲット！
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">
              問題 {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>
        </div>

        {!quizFinished ? (
          <div className="space-y-4">
            {/* Question Text */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                QUESTION {currentQuizIndex + 1} (正解で +{currentQ.pointsReward}pt)
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-white border-slate-200 hover:border-orange-300 text-slate-700';

                if (isAnswerChecked) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-50 border-red-400 text-red-700';
                  } else {
                    btnStyle = 'opacity-50 border-slate-100 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerChecked && idx === currentQ.correctIndex && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        正解！
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {isAnswerChecked && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 animate-in fade-in">
                <div className="flex items-start space-x-2 mb-3">
                  <span className="text-base">💡</span>
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-0.5">
                      日南の豆知識：
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    id="quiz-next-btn"
                    onClick={handleNextQuiz}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>
                      {currentQuizIndex === QUIZ_QUESTIONS.length - 1
                        ? '結果を見る'
                        : '次の問題へ'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                クイズ終了！おつかれさまでした！
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                スコア: <span className="font-bold text-orange-600 text-sm">{quizScore} / {QUIZ_QUESTIONS.length} 問正解</span>
              </p>
            </div>

            <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-2xl">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-800">
                獲得ポイント: +{pointsEarnedInQuiz} pt
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {quizScore === QUIZ_QUESTIONS.length
                ? 'すごい！あなたは正真正銘の日南マスターです！🎉'
                : '日南のことをもっと知って、次の列車待ち時間も楽しもう！'}
            </p>

            <div>
              <button
                id="quiz-restart-btn"
                onClick={handleRestartQuiz}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>もう一度挑戦する</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: MACHI QUESTS (まちの秘密スポット＆探索ミッション) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                まちの秘密スポット探索クエスト
              </h2>
              <p className="text-xs text-slate-500">
                日南の駅や街なかのアクションをクリアして限定カードと大量ポイントを獲得！
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
            達成率: {quests.filter((q) => q.completed).length} / {quests.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                quest.completed
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-white border-slate-200 hover:border-orange-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      {getQuestIcon(quest.iconName)}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                        {quest.title}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        場所: {quest.spot}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                    +{quest.rewardPoints} pt
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {quest.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                    <span>進捗</span>
                    <span>{quest.progress} / {quest.total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        quest.completed ? 'bg-emerald-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(100, (quest.progress / quest.total) * 100)}%` }}
                    />
                  </div>
                </div>

                {quest.completed ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    クリア済み
                  </span>
                ) : (
                  <button
                    id={`quest-claim-btn-${quest.id}`}
                    onClick={() => {
                      onCompleteQuest(quest.id);
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.6 },
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                  >
                    達成を報告
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
