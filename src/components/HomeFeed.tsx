import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Eye,
  GraduationCap,
  Heart,
  Laptop,
  LayoutGrid,
  MapPin,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Sofa,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import type { CategoryKey, Language, Product, Profile, UniversityKey } from '../types';
import { ProductVisual } from './ProductVisual';

interface HomeFeedProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  products: Product[];
  loading: boolean;
  isShowingSeed: boolean;
  likedIds: Set<string>;
  onToggleLike: (product: Product, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  onOpenProfile: () => void;
  profile: Profile | null;
}

type SortKey = 'newest' | 'price_low' | 'popular';

export const HomeFeed: React.FC<HomeFeedProps> = ({
  lang,
  onChangeLang,
  products,
  loading,
  isShowingSeed,
  likedIds,
  onToggleLike,
  onSelectProduct,
  onOpenProfile,
  profile,
}) => {
  const t = TRANSLATIONS[lang];
  const [university, setUniversity] = useState<UniversityKey>('all');
  const [category, setCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showUniMenu, setShowUniMenu] = useState(false);

  // Promotional Carousel state
  const [slideIdx, setSlideIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % t.banners.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPaused, t.banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 36) {
      if (diff > 0) {
        setSlideIdx((prev) => (prev + 1) % t.banners.length);
      } else {
        setSlideIdx((prev) => (prev - 1 + t.banners.length) % t.banners.length);
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  const getTitle = (p: Product) => (lang === 'en' && p.title_en ? p.title_en : p.title);
  const getSafeZone = (p: Product) =>
    lang === 'en' && p.safe_zone_en ? p.safe_zone_en : p.safe_zone;

  const filteredProducts = products
    .filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (university !== 'all') {
        const hay = `${p.university || ''} ${p.seller_major || ''} ${p.safe_zone || ''}`.toLowerCase();
        const keyMap: Record<Exclude<UniversityKey, 'all'>, string[]> = {
          KNU: ['knu', 'кну'],
          AUCA: ['auca', 'ауца'],
          'Manas University': ['manas', 'манас'],
          KRSU: ['krsu', 'крсу'],
        };
        const tokens = keyMap[university];
        if (!tokens.some((tok) => hay.includes(tok))) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${p.title} ${p.title_en || ''} ${p.safe_zone} ${p.safe_zone_en || ''} ${p.seller_name} ${p.seller_major}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (verifiedOnly && !p.seller_major) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const categories: { key: CategoryKey; icon: React.ReactNode }[] = [
    { key: 'all', icon: <LayoutGrid className="h-4 w-4" /> },
    { key: 'textbooks', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'electronics', icon: <Laptop className="h-4 w-4" /> },
    { key: 'dorm', icon: <Sofa className="h-4 w-4" /> },
    { key: 'clothing', icon: <Shirt className="h-4 w-4" /> },
  ];

  const uniOptions: UniversityKey[] = ['all', 'KNU', 'AUCA', 'Manas University', 'KRSU'];

  return (
    <div className="flex flex-col pb-28">
      {/* Top App Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 pt-3 pb-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="font-display text-xl font-extrabold tracking-tight text-[#2563EB]">
              CampusMarket
            </div>
            <p className="text-[11px] font-medium text-slate-500">{t.brandSubtitle}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-slate-800">{t.header.homeTitle}</span>
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label={t.tabs.profile}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-blue-100 bg-blue-600 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
            >
              {profile?.nickname ? profile.nickname.slice(0, 2).toUpperCase() : 'KG'}
            </button>
          </div>
        </div>

        {/* University Filter + Verified Badge + RU|EN Switcher */}
        <div className="mt-3 flex items-center justify-between gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUniMenu((v) => !v)}
              className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200"
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
              <span className="max-w-[104px] truncate">{t.universities[university]}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            </button>

            {showUniMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowUniMenu(false)}
                />
                <div className="absolute left-0 top-10 z-40 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  {uniOptions.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        setUniversity(u);
                        setShowUniMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                        university === u
                          ? 'bg-blue-50 text-[#2563EB]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t.universities[u]}</span>
                      {university === u && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="whitespace-nowrap">{t.header.verifiedBadge}</span>
          </div>

          <div
            role="group"
            aria-label="Language switcher"
            className="flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-bold"
          >
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`rounded-full px-2 py-1 transition-colors ${
                lang === 'ru'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`rounded-full px-2 py-1 transition-colors ${
                lang === 'en'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Search Bar & Sort */}
        <div className="relative mt-2.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.header.searchPlaceholder}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortMenu((v) => !v)}
              aria-label="Sort products"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                sortBy !== 'newest'
                  ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 top-12 z-40 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  {(
                    [
                      ['newest', t.header.sortNewest],
                      ['price_low', t.header.sortPriceLow],
                      ['popular', t.header.sortPopular],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSortBy(key);
                        setShowSortMenu(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                        sortBy === key
                          ? 'bg-blue-50 text-[#2563EB]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="space-y-4 px-4 pt-3.5">
        {/* 3-Slide Touch-Swipeable Auto-Playing Promo Carousel */}
        <section
          aria-label="Campus promotions"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white shadow-md shadow-blue-600/20"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${slideIdx * 100}%)` }}
          >
            {t.banners.map((banner, idx) => (
              <div
                key={idx}
                className="relative w-full shrink-0 px-4 py-4 pr-20"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-400 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-slate-900">
                    {banner.badge}
                  </span>
                  <span className="text-[11px] font-medium text-blue-100">
                    • {banner.meta}
                  </span>
                </div>

                <h2 className="mt-2 font-display text-[17px] leading-snug font-extrabold text-white">
                  {banner.title}
                </h2>
                <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-blue-100">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  <span>{banner.subtitle}</span>
                </p>

                {/* Translucent Right Book/Shield Motif */}
                <BookOpen
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 top-3 h-24 w-24 text-white/15"
                />
              </div>
            ))}
          </div>

          {/* Slide Dots + 1/3 Indicator */}
          <div className="flex items-center justify-between px-4 pb-2.5">
            <div className="flex items-center gap-1.5">
              {t.banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setSlideIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    slideIdx === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <span className="rounded-full bg-slate-950/30 px-2 py-0.5 text-[10px] font-bold tabular-nums text-white">
              {slideIdx + 1}/{t.banners.length}
            </span>
          </div>
        </section>

        {/* Horizontal Scrollable Category Chips */}
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-0.5 no-scrollbar">
          {categories.map((cat) => {
            const active = category === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-600/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.icon}
                <span>{t.categories[cat.key]}</span>
              </button>
            );
          })}
        </div>

        {/* Verified Students Toggle Bar */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{t.verifiedToggle.title}</div>
              <div className="text-[11px] text-slate-500">{t.verifiedToggle.subtitle}</div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={verifiedOnly}
            onClick={() => setVerifiedOnly((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              verifiedOnly ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform ${
                verifiedOnly ? 'translate-x-5.5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Section Title */}
        <div className="flex items-baseline justify-between gap-2 pt-1">
          <h1 className="font-display text-base font-extrabold text-slate-900">
            {t.feed.sectionTitle}
          </h1>
          <span className="shrink-0 text-xs font-bold text-[#2563EB] tabular-nums">
            {t.feed.freshCount(filteredProducts.length)}
          </span>
        </div>

        {isShowingSeed && !loading && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-[11px] font-medium text-blue-800">
            {t.feed.seedNotice}
          </div>
        )}

        {/* 2-Column Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5"
              >
                <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-slate-200" />
                <div className="mt-2.5 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <Search className="h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">{t.feed.emptySearch}</p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setUniversity('all');
                setSearch('');
              }}
              className="mt-3 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white"
            >
              {t.feed.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((item) => {
              const liked = likedIds.has(item.id);
              const tagText =
                lang === 'en' && item.urgent_tag_en
                  ? item.urgent_tag_en
                  : item.urgent_tag ||
                    t.categories[(item.category as CategoryKey) || 'textbooks'] ||
                    item.category;
              const isUrgent = Boolean(item.urgent_tag?.includes('Спасай') || item.category === 'textbooks');

              return (
                <article
                  key={item.id}
                  onClick={() => onSelectProduct(item)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <ProductVisual
                      imageUrl={item.image_url}
                      alt={getTitle(item)}
                      category={item.category}
                      className="h-full w-full"
                    />
                    {/* Top Left Urgency Tag */}
                    <span
                      className={`absolute left-2 top-2 max-w-[85%] truncate rounded-md px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs ${
                        isUrgent ? 'bg-[#C81E1E]/95' : 'bg-[#92600A]/95'
                      }`}
                    >
                      {tagText}
                    </span>

                    {/* Like Button */}
                    <button
                      type="button"
                      aria-label="Like item"
                      onClick={(e) => onToggleLike(item, e)}
                      className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition-transform active:scale-90"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          liked ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-2.5">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#2563EB]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{getSafeZone(item)}</span>
                      </div>

                      <h3 className="mt-1 line-clamp-2 text-[13px] leading-snug font-bold text-slate-900">
                        {getTitle(item)}
                      </h3>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-display text-[17px] font-extrabold tracking-tight text-slate-900 tabular-nums">
                          {item.price.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}{' '}
                          <span className="text-xs font-bold">{t.feed.currency}</span>
                        </span>
                        {item.retail_price ? (
                          <span className="text-[11px] text-slate-400 line-through tabular-nums">
                            {item.retail_price.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                          </span>
                        ) : (
                          <span className="max-w-[68px] truncate rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB]">
                            {item.seller_major.split('·')[0].trim()}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[11px] font-medium text-slate-500 tabular-nums">
                        <span className="flex items-center gap-1">
                          <Heart
                            className={`h-3 w-3 ${
                              liked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'
                            }`}
                          />
                          {item.likes + (liked && item.is_seed ? 1 : 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {item.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
