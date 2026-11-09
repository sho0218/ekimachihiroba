import {
  UserProfile,
  CommunityPost,
  Quest,
  DigitalCard,
  Coupon,
  ChatMessage,
  StationId,
  WaitMate,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_POSTS,
  INITIAL_QUESTS,
  DIGITAL_CARDS,
  COUPONS,
  INITIAL_WAIT_MATES,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'nichinan_user_profile',
  POSTS: 'nichinan_posts',
  QUESTS: 'nichinan_quests',
  CARDS: 'nichinan_cards_v2',
  COUPONS: 'nichinan_coupons',
  WAIT_MATES: 'nichinan_waitmates',
  CHATS: 'nichinan_chats',
};

export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_USER;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadPosts(): CommunityPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (data) {
      const parsed: CommunityPost[] = JSON.parse(data);
      return parsed.map((post) => {
        const initial = INITIAL_POSTS.find((p) => p.id === post.id);
        if (initial && post.imageUrl?.includes('unsplash.com')) {
          return { ...post, imageUrl: initial.imageUrl, content: initial.content };
        }
        return post;
      });
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_POSTS;
}

export function savePosts(posts: CommunityPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error(e);
  }
}

export function loadQuests(): Quest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_QUESTS;
}

export function saveQuests(quests: Quest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch (e) {
    console.error(e);
  }
}

export function loadDigitalCards(): DigitalCard[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (data) {
      const parsed: DigitalCard[] = JSON.parse(data);
      // Merge with latest authentic Nichinan card definitions (images, titles, credits)
      return DIGITAL_CARDS.map((masterCard) => {
        const saved = parsed.find((p) => p.id === masterCard.id);
        if (saved) {
          return {
            ...masterCard,
            acquired: saved.acquired,
            acquiredAt: saved.acquiredAt,
          };
        }
        return masterCard;
      });
    }
  } catch (e) {
    console.error(e);
  }
  return DIGITAL_CARDS;
}

export function saveDigitalCards(cards: DigitalCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  } catch (e) {
    console.error(e);
  }
}

export function loadCoupons(): Coupon[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return COUPONS;
}

export function saveCoupons(coupons: Coupon[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  } catch (e) {
    console.error(e);
  }
}

export function loadWaitMates(stationId: StationId): WaitMate[] {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.WAIT_MATES}_${stationId}`);
    if (data) {
      const parsed: WaitMate[] = JSON.parse(data);
      // Ensure defaults for this station are present
      const initialForStation = INITIAL_WAIT_MATES.filter((m) => m.stationId === stationId);
      const customOnes = parsed.filter((p) => p.isCustom);
      return [...initialForStation, ...customOnes];
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_WAIT_MATES.filter((m) => m.stationId === stationId);
}

export function saveWaitMates(stationId: StationId, mates: WaitMate[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.WAIT_MATES}_${stationId}`, JSON.stringify(mates));
  } catch (e) {
    console.error(e);
  }
}

export function loadChats(stationId: StationId): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CHATS}_${stationId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Default mock chat
  return [
    {
      id: 'c1',
      userId: 'u_mai',
      userName: 'まい（高2）',
      userAvatar: '🎒',
      stationId,
      text: '待合室のエアコン効いてて涼しい〜！次の列車まであとちょっと🚃',
      timestamp: '17:15',
    },
    {
      id: 'c2',
      userId: 'u_ken',
      userName: 'けんた',
      userAvatar: '🧢',
      stationId,
      text: '駅前カフェのソフトクリーム食べてる🍦誰か一緒に乗る人いる？',
      stamp: '👋',
      timestamp: '17:21',
    },
  ];
}

export function saveChats(stationId: StationId, chats: ChatMessage[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CHATS}_${stationId}`, JSON.stringify(chats));
  } catch (e) {
    console.error(e);
  }
}
