export type StationId = 'nichinan' | 'aburatsu' | 'obi' | 'nango' | 'kitago';

export interface StationInfo {
  id: StationId;
  name: string;
  kana: string;
  line: string;
  description: string;
  nextTrainMins: number;
  direction: string;
  waitingCount: number;
  bgGradient: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  titlePart1?: string;
  titlePart2?: string;
  avatar: string;
  points: number;
  level: number;
  streakDays: number;
  lastCheckInDate?: string;
  stationCheckIns?: Partial<Record<StationId, string>>;
  currentStation: StationId;
}

export interface WaitMate {
  id: string;
  stationId: StationId;
  name: string;
  avatar: string;
  wait: string;
  status: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  stationId: StationId;
  text: string;
  stamp?: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

export type PostCategory = 'photo' | 'review' | 'miyazaki_dog' | 'sunset' | 'daily';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userTitle: string;
  category: PostCategory;
  categoryLabel: string;
  station: string;
  locationName: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedByMe?: boolean;
  commentsCount: number;
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  spot: string;
  rewardPoints: number;
  bonusCardId?: string;
  progress: number;
  total: number;
  completed: boolean;
  category: 'station' | 'gourmet' | 'history' | 'photo';
  iconName: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pointsReward: number;
}

export type CardRarity = 'R' | 'SR' | 'SSR' | 'UR';

export interface DigitalCard {
  id: string;
  title: string;
  subtitle: string;
  rarity: CardRarity;
  cardNumber: string;
  imageUrl: string;
  flavorText: string;
  category: 'spot' | 'train' | 'gourmet' | 'character' | 'nature';
  acquired: boolean;
  acquiredAt?: string;
  photoCredit?: string;
  photoSourceUrl?: string;
  fallbackUrl?: string;
}

export interface Coupon {
  id: string;
  storeName: string;
  area: string;
  title: string;
  discountText: string;
  costPoints: number;
  category: 'cafe' | 'gourmet' | 'shop' | 'activity';
  expiresInDays: number;
  imageUrl: string;
  barcode: string;
  isUnlocked: boolean;
  isUsed: boolean;
  usedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  title: string;
  avatar: string;
  points: number;
  postsCount: number;
  isMe?: boolean;
}
