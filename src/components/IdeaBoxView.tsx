import React, { useState } from 'react';
import { IdeaSuggestion, UserProfile } from '../types';
import { Lightbulb, ThumbsUp, Plus, Sparkles, Filter, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface IdeaBoxViewProps {
  ideas: IdeaSuggestion[];
  onVoteIdea: (ideaId: string) => void;
  onAddIdea: (idea: Omit<IdeaSuggestion, 'id' | 'votes' | 'hasVoted' | 'status'>) => void;
  user: UserProfile;
}

export const IdeaBoxView: React.FC<IdeaBoxViewProps> = ({
  ideas,
  onVoteIdea,
  onAddIdea,
  user,
}) => {
  const [filter, setFilter] = useState<'all' | 'reward' | 'action'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formCategory, setFormCategory] = useState<'reward' | 'action'>('reward');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === 'all') return true;
    return idea.category === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    onAddIdea({
      category: formCategory,
      title: formTitle.trim(),
      description: formDescription.trim(),
      author: user.name,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setFormTitle('');
    setFormDescription('');
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: IdeaSuggestion['status']) => {
    switch (status) {
      case 'popular':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            🔥 大人気
          </span>
        );
      case 'planned':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            🚀 採用・実装予定
          </span>
        );
      case 'reviewing':
      default:
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            💡 企画検討中
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-200" />
            <span>みんなでつくる「にちなん駅まち広場」</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            みんなの「こんなご褒美・行動ほしい！」アイディア箱
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 leading-relaxed">
            「どんなご褒美があったら使いたくなる？」「どんな行動をしてほしい？」
            みんなのアイディアを投稿＆投票して、日南を一緒に盛り上げよう！
          </p>

          <button
            id="open-suggest-idea-btn"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-white text-orange-700 hover:bg-amber-50 font-extrabold text-xs px-4 py-2.5 rounded-xl inline-flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>アイディアを投稿する</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        {[
          { id: 'all', label: 'すべて' },
          { id: 'reward', label: '🎁 ご褒美・お楽しみのアイディア' },
          { id: 'action', label: '🏃‍♂️ アプリでしてほしい行動のアイディア' },
        ].map((f) => (
          <button
            key={f.id}
            id={`idea-filter-${f.id}`}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ideas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-2xl border border-amber-100 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    idea.category === 'reward'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  }`}
                >
                  {idea.category === 'reward' ? '🎁 ご褒美・お楽しみ' : '🏃‍♂️ してほしい行動'}
                </span>
                {getStatusBadge(idea.status)}
              </div>

              <h3 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                {idea.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {idea.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                提案者: <strong className="text-slate-600 font-semibold">{idea.author}</strong>
              </span>

              <button
                id={`vote-idea-btn-${idea.id}`}
                onClick={() => onVoteIdea(idea.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  idea.hasVoted
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${idea.hasVoted ? 'fill-orange-600' : ''}`} />
                <span>賛成 {idea.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Suggest Idea Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">
                  アイディアを提案する
                </h3>
                <p className="text-[11px] text-slate-500">
                  どんなご褒美や行動があればみんなが使いたくなる？
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  アイディアの分類
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormCategory('reward')}
                    className={`p-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      formCategory === 'reward'
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    🎁 ご褒美・お楽しみ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormCategory('action')}
                    className={`p-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      formCategory === 'action'
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    🏃‍♂️ してほしい行動
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  アイディアのタイトル
                </label>
                <input
                  type="text"
                  id="idea-title-input"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="例: 駅前自習スペースのドリンク無料特典"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  具体的な内容や理由
                </label>
                <textarea
                  id="idea-desc-textarea"
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="例: テスト期間中に日南駅や油津駅で待つ学生が多いので、勉強がはかどる特典や友達と教え合えるスペースがあったら最高です！"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  id="submit-idea-btn"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md active:scale-95 transition-all"
                >
                  提案を投稿する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
