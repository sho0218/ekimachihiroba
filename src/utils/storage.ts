import {
  UserProfile,
  CommunityPost,
  Quest,
  DigitalCard,
  Coupon,
  IdeaSuggestion,
  ChatMessage,
  StationId,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_POSTS,
  INITIAL_QUESTS,
  DIGITAL_CARDS,
  COUPONS,
  INITIAL_IDEAS,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'nichinan_user_profile',
  POSTS: 'nichinan_posts',
  QUESTS: 'nichinan_quests',
  CARDS: 'nichinan_cards',
  COUPONS: 'nichinan_coupons',
  IDEAS: 'nichinan_ideas',
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

export function loadPosts(): CommunityPost[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (data) return JSON.parse(data);
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
    if (data) return JSON.parse(data);
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

export function loadIdeas(): IdeaSuggestion[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_IDEAS;
}

export function saveIdeas(ideas: IdeaSuggestion[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
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
