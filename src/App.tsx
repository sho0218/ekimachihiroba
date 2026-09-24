/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  StationId,
  CommunityPost,
  Quest,
  DigitalCard,
  Coupon,
  IdeaSuggestion,
  ChatMessage,
} from './types';
import { STATIONS, DIGITAL_CARDS, INITIAL_USER, INITIAL_POSTS, INITIAL_QUESTS, COUPONS, INITIAL_IDEAS } from './data/mockData';
import {
  loadUserProfile,
  saveUserProfile,
  loadPosts,
  savePosts,
  loadQuests,
  saveQuests,
  loadDigitalCards,
  saveDigitalCards,
  loadCoupons,
  saveCoupons,
  loadIdeas,
  saveIdeas,
  loadChats,
  saveChats,
} from './utils/storage';

import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { StationWaitHub } from './components/StationWaitHub';
import { TimelineView } from './components/TimelineView';
import { QuestQuizView } from './components/QuestQuizView';
import { CardGachaView } from './components/CardGachaView';
import { CouponShopView } from './components/CouponShopView';
import { LeaderboardView } from './components/LeaderboardView';
import { IdeaBoxView } from './components/IdeaBoxView';
import { ProfileModal } from './components/ProfileModal';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('hub');
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [posts, setPosts] = useState<CommunityPost[]>(loadPosts);
  const [quests, setQuests] = useState<Quest[]>(loadQuests);
  const [cards, setCards] = useState<DigitalCard[]>(loadDigitalCards);
  const [coupons, setCoupons] = useState<Coupon[]>(loadCoupons);
  const [ideas, setIdeas] = useState<IdeaSuggestion[]>(loadIdeas);
  const [activeStationId, setActiveStationId] = useState<StationId>(user.currentStation || 'aburatsu');
  const [chats, setChats] = useState<ChatMessage[]>(() => loadChats(activeStationId));

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync station chats when station changes
  useEffect(() => {
    setChats(loadChats(activeStationId));
  }, [activeStationId]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add Points helper
  const addPoints = (amount: number, reason?: string) => {
    setUser((prev) => {
      const nextPoints = prev.points + amount;
      const nextLevel = Math.floor(nextPoints / 100) + 1;
      const updated = {
        ...prev,
        points: nextPoints,
        level: Math.max(prev.level, nextLevel),
      };
      saveUserProfile(updated);
      return updated;
    });

    if (reason) {
      showToast(`+${amount} pt 獲得！「${reason}」`);
    } else {
      showToast(`+${amount} pt 獲得！`);
    }
  };

  // Station Check-In handler
  const handleCheckIn = () => {
    addPoints(30, `${currentStation.name} にチェックイン`);
    setUser((prev) => {
      const updated = {
        ...prev,
        streakDays: prev.streakDays + 1,
        currentStation: activeStationId,
      };
      saveUserProfile(updated);
      return updated;
    });

    // Mark check-in quest as completed if active
    setQuests((prev) => {
      const next = prev.map((q) => {
        if (q.id === 'q1' && !q.completed) {
          return { ...q, progress: 1, completed: true };
        }
        return q;
      });
      saveQuests(next);
      return next;
    });
  };

  // Send Chat message
  const handleSendMessage = (text: string, stamp?: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `c_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      stationId: activeStationId,
      text,
      stamp,
      timestamp: timeStr,
      isCurrentUser: true,
    };

    const nextChats = [...chats, newMsg];
    setChats(nextChats);
    saveChats(activeStationId, nextChats);

    // Update quest if sending message for first time
    setQuests((prev) => {
      const next = prev.map((q) => {
        if (q.id === 'q5' && !q.completed) {
          addPoints(q.rewardPoints, 'チャットで挨拶ミッション');
          return { ...q, progress: 1, completed: true };
        }
        return q;
      });
      saveQuests(next);
      return next;
    });
  };

  // Add new Post
  const handleAddPost = (newPostData: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'createdAt'>) => {
    const newPost: CommunityPost = {
      ...newPostData,
      id: `p_${Date.now()}`,
      likes: 1,
      likedByMe: true,
      commentsCount: 0,
      createdAt: 'たった今',
    };

    const nextPosts = [newPost, ...posts];
    setPosts(nextPosts);
    savePosts(nextPosts);

    addPoints(50, '写真・口コミ投稿');

    // Update photo quest
    setQuests((prev) => {
      const next = prev.map((q) => {
        if (q.id === 'q2' && !q.completed) {
          return { ...q, progress: 1, completed: true };
        }
        return q;
      });
      saveQuests(next);
      return next;
    });
  };

  // Like Post
  const handleLikePost = (postId: string) => {
    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.likedByMe;
          return {
            ...p,
            likedByMe: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      });
      savePosts(next);
      return next;
    });
  };

  // Complete Quest handler
  const handleCompleteQuest = (questId: string) => {
    setQuests((prev) => {
      const target = prev.find((q) => q.id === questId);
      if (target && !target.completed) {
        addPoints(target.rewardPoints, target.title);
      }
      const next = prev.map((q) => (q.id === questId ? { ...q, completed: true, progress: q.total } : q));
      saveQuests(next);
      return next;
    });
  };

  // Pull Gacha handler
  const handlePullGacha = (): DigitalCard | null => {
    const GACHA_COST = 100;
    if (user.points < GACHA_COST) return null;

    // Deduct points
    setUser((prev) => {
      const updated = { ...prev, points: prev.points - GACHA_COST };
      saveUserProfile(updated);
      return updated;
    });

    // Random card with rarity weight
    const availableCards = [...cards];
    const pickedCard = availableCards[Math.floor(Math.random() * availableCards.length)];

    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

    // If duplicate
    if (pickedCard.acquired) {
      showToast(`「${pickedCard.title}」を重複獲得！ボーナス +20pt`);
      setUser((prev) => {
        const updated = { ...prev, points: prev.points + 20 };
        saveUserProfile(updated);
        return updated;
      });
    } else {
      showToast(`NEW CARD!「${pickedCard.title}」を手に入れた！`);
    }

    // Mark as acquired in cards list
    const updatedCards = cards.map((c) =>
      c.id === pickedCard.id ? { ...c, acquired: true, acquiredAt: dateStr } : c
    );
    setCards(updatedCards);
    saveDigitalCards(updatedCards);

    return pickedCard;
  };

  // Unlock Coupon
  const handleUnlockCoupon = (couponId: string) => {
    const target = coupons.find((c) => c.id === couponId);
    if (!target || user.points < target.costPoints) return;

    setUser((prev) => {
      const updated = { ...prev, points: prev.points - target.costPoints };
      saveUserProfile(updated);
      return updated;
    });

    const updatedCoupons = coupons.map((c) =>
      c.id === couponId ? { ...c, isUnlocked: true } : c
    );
    setCoupons(updatedCoupons);
    saveCoupons(updatedCoupons);

    showToast(`クーポン「${target.title}」を交換しました！`);
  };

  // Use Coupon
  const handleUseCoupon = (couponId: string) => {
    const updatedCoupons = coupons.map((c) =>
      c.id === couponId ? { ...c, isUsed: true, usedAt: new Date().toLocaleTimeString() } : c
    );
    setCoupons(updatedCoupons);
    saveCoupons(updatedCoupons);
    showToast('クーポンを利用済みにしました！ご利用ありがとうございました。');
  };

  // Vote on Idea
  const handleVoteIdea = (ideaId: string) => {
    setIdeas((prev) => {
      const next = prev.map((idea) => {
        if (idea.id === ideaId) {
          const hasVoted = !idea.hasVoted;
          return {
            ...idea,
            hasVoted,
            votes: hasVoted ? idea.votes + 1 : idea.votes - 1,
          };
        }
        return idea;
      });
      saveIdeas(next);
      return next;
    });
  };

  // Add new Idea
  const handleAddIdea = (newIdeaData: Omit<IdeaSuggestion, 'id' | 'votes' | 'hasVoted' | 'status'>) => {
    const newIdea: IdeaSuggestion = {
      ...newIdeaData,
      id: `idea_${Date.now()}`,
      votes: 1,
      hasVoted: true,
      status: 'reviewing',
    };
    const nextIdeas = [newIdea, ...ideas];
    setIdeas(nextIdeas);
    saveIdeas(nextIdeas);
    addPoints(20, 'アイディア提案');
  };

  // Reset demo data
  const handleResetData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setPosts(INITIAL_POSTS);
    setQuests(INITIAL_QUESTS);
    setCards(DIGITAL_CARDS);
    setCoupons(COUPONS);
    setIdeas(INITIAL_IDEAS);
    setActiveStationId('aburatsu');
    setChats(loadChats('aburatsu'));
    showToast('デモデータを初期状態にリセットしました');
  };

  const currentStation = STATIONS.find((s) => s.id === activeStationId) || STATIONS[0];
  const unclaimedQuestsCount = quests.filter((q) => !q.completed).length;

  return (
    <div className="min-h-screen bg-amber-50/30 text-slate-800 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-amber-400/40 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        user={user}
        activeStation={currentStation}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unclaimedQuestsCount={unclaimedQuestsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-4 py-5">
        {activeTab === 'hub' && (
          <StationWaitHub
            activeStation={currentStation}
            onSelectStation={setActiveStationId}
            user={user}
            onCheckIn={handleCheckIn}
            messages={chats}
            onSendMessage={handleSendMessage}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            user={user}
          />
        )}

        {activeTab === 'quests' && (
          <QuestQuizView
            quests={quests}
            onCompleteQuest={handleCompleteQuest}
            user={user}
            onAddPoints={(pts) => addPoints(pts, '日南クイズ全問正解')}
          />
        )}

        {activeTab === 'cards' && (
          <CardGachaView
            cards={cards}
            user={user}
            onPullGacha={handlePullGacha}
          />
        )}

        {activeTab === 'coupons' && (
          <CouponShopView
            coupons={coupons}
            user={user}
            onUnlockCoupon={handleUnlockCoupon}
            onUseCoupon={handleUseCoupon}
          />
        )}

        {activeTab === 'rankings' && (
          <LeaderboardView user={user} />
        )}

        {activeTab === 'ideas' && (
          <IdeaBoxView
            ideas={ideas}
            onVoteIdea={handleVoteIdea}
            onAddIdea={handleAddIdea}
            user={user}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-100/80 bg-white/60 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800">にちなん駅まち広場</span>
            <span>•</span>
            <span>日南市×JR日南線 まち活＆ご褒美コミュニティ</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('ideas')}
              className="hover:text-orange-600 font-semibold cursor-pointer"
            >
              アイディアを提案
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-orange-600 font-semibold cursor-pointer"
            >
              プロフィール設定
            </button>
            <button
              onClick={handleResetData}
              className="hover:text-red-600 cursor-pointer"
            >
              データリセット
            </button>
          </div>
        </div>
      </footer>

      {/* User Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onUpdateUser={(updated) => {
            setUser((prev) => {
              const next = { ...prev, ...updated };
              saveUserProfile(next);
              return next;
            });
            showToast('プロフィールを更新しました');
          }}
          onClose={() => setIsProfileModalOpen(false)}
          onResetData={handleResetData}
        />
      )}
    </div>
  );
}
