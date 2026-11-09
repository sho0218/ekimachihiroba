import React, { useState } from 'react';
import { CommunityPost, PostCategory, UserProfile } from '../types';
import {
  Heart,
  MessageCircle,
  Camera,
  Plus,
  Filter,
  MapPin,
  Sparkles,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimelineViewProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'createdAt'>) => void;
  onLikePost: (postId: string) => void;
  user: UserProfile;
}

const PRESET_IMAGES = [
  {
    label: '日南海岸・波と水平線',
    url: '/images/cards/card_nichinan_coast.jpg',
  },
  {
    label: '飫肥名物・揚げたておび天',
    url: '/images/cards/card_obiten.jpg',
  },
  {
    label: '油津駅・カープ赤駅舎',
    url: '/images/cards/card_aburatsu_station.jpg',
  },
  {
    label: '鵜戸神宮・本殿と奇岩霊場',
    url: '/images/cards/card_udo_shrine.jpg',
  },
  {
    label: '飫肥城大手門・城下町',
    url: '/images/cards/card_obi_castle.jpg',
  },
  {
    label: '堀川運河・石橋と歴史の風情',
    url: '/images/cards/card_horikawa_canal.jpg',
  },
  {
    label: '日南海岸フェニックスロード',
    url: '/images/cards/card_nichinan_palms.jpg',
  },
  {
    label: '坂元棚田・日本の棚田百選',
    url: '/images/cards/card_sakamoto_tanada.jpg',
  },
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  posts,
  onAddPost,
  onLikePost,
  user,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [formCategory, setFormCategory] = useState<PostCategory>('photo');
  const [formStation, setFormStation] = useState('油津駅');
  const [formLocation, setFormLocation] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isCustomImage, setIsCustomImage] = useState(false);

  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'photo', label: '📸 駅周辺の写真' },
    { id: 'review', label: '📝 おすすめ口コミ' },
    { id: 'miyazaki_dog', label: '🐶 今日のみやざき犬' },
    { id: 'sunset', label: '🌅 夕暮れの景色' },
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;

    let catLabel = '駅周辺の写真';
    if (formCategory === 'review') catLabel = 'おすすめ口コミ';
    if (formCategory === 'miyazaki_dog') catLabel = 'みやざき犬発見';
    if (formCategory === 'sunset') catLabel = '夕暮れの景色';
    if (formCategory === 'daily') catLabel = '今日のできごと';

    onAddPost({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userTitle: user.title,
      category: formCategory,
      categoryLabel: catLabel,
      station: formStation,
      locationName: formLocation || formStation,
      content: formContent.trim(),
      imageUrl: formImageUrl,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    // Reset & close
    setFormContent('');
    setFormLocation('');
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
        setIsCustomImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Post Trigger */}
      <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-orange-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>みんなの投稿でポイントGET</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-800">
            駅周辺の景色や今日のできごとをシェアしよう！
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            夕暮れの空、みやざき犬、カフェの口コミを投稿すると毎回
            <span className="font-bold text-orange-600"> +50pt </span>
            もらえます。
          </p>
        </div>

        <button
          id="open-create-post-btn"
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 w-full sm:w-auto bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-orange-600/20 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>写真・口コミを投稿する</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-category-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            {/* Header */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-base border border-orange-200 shrink-0">
                  {post.userAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">
                      {post.userName}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md font-medium">
                      {post.userTitle}
                    </span>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-400 gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span className="font-semibold text-slate-600">
                      {post.station}
                    </span>
                    {post.locationName !== post.station && (
                      <span>({post.locationName})</span>
                    )}
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {post.categoryLabel}
              </span>
            </div>

            {/* Post Image (if any) */}
            {post.imageUrl && (
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <img
                  src={post.imageUrl}
                  alt={post.content}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Content text */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-700 leading-relaxed">
                {post.content}
              </p>

              {/* Actions: Likes & Comments */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-3">
                  <button
                    id={`like-post-btn-${post.id}`}
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center space-x-1 cursor-pointer transition-colors ${
                      post.likedByMe
                        ? 'text-red-500 font-bold'
                        : 'hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.likedByMe ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center space-x-1 text-slate-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>

                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                  +50pt 獲得済
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">
                  日南の駅まち写真・口コミを投稿
                </h3>
                <p className="text-[11px] text-slate-500">
                  投稿完了で +50pt プレゼント！
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  カテゴリー
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'photo', label: '📸 駅周辺の写真' },
                    { id: 'review', label: '📝 おすすめ口コミ' },
                    { id: 'miyazaki_dog', label: '🐶 みやざき犬' },
                    { id: 'sunset', label: '🌅 夕暮れの景色' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormCategory(cat.id as PostCategory)}
                      className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        formCategory === cat.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Station & Spot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    関連する駅
                  </label>
                  <select
                    id="post-station-select"
                    value={formStation}
                    onChange={(e) => setFormStation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none"
                  >
                    <option value="油津駅">油津駅</option>
                    <option value="日南駅">日南駅</option>
                    <option value="飫肥駅">飫肥駅</option>
                    <option value="南郷駅">南郷駅</option>
                    <option value="北郷駅">北郷駅</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    具体的なスポット名（任意）
                  </label>
                  <input
                    type="text"
                    id="post-location-input"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="例: 油津商店街、駅前ベンチ、赤レンガ館"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none"
                  />
                </div>
              </div>

              {/* Content / Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  できごと・おすすめの口コミ
                </label>
                <textarea
                  id="post-content-textarea"
                  rows={3}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="駅での待ち時間のこと、見つけた景色、美味しかったカフェのメニューなど自由に書いてね！"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-orange-500/50 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Image Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    写真を選択（プリセット or 自前の写真）
                  </label>
                  <label className="text-[11px] text-orange-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>ファイルから選択</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Thumbnails */}
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        setFormImageUrl(img.url);
                        setIsCustomImage(false);
                      }}
                      className={`relative aspect-16/10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formImageUrl === img.url && !isCustomImage
                          ? 'border-orange-500 ring-2 ring-orange-400/40'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  id="submit-new-post-btn"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-md shadow-orange-600/20 active:scale-95"
                >
                  投稿して +50pt GET！
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Mobile Floating Action Button (FAB) for quick photo posting */}
      <button
        id="mobile-fab-create-post"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 sm:hidden z-30 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white p-3.5 rounded-full shadow-xl shadow-orange-600/35 border-2 border-white flex items-center justify-center cursor-pointer transition-all"
        title="写真・口コミを投稿"
        aria-label="写真・口コミを投稿する"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
