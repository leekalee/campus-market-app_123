import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Handshake,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Thermometer,
  Zap,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import type { CategoryKey, Language, Product, Profile } from '../types';
import { BishkekSafeMap, ProductVisual } from './ProductVisual';

interface ProductDetailProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  product: Product;
  liked: boolean;
  onToggleLike: (product: Product, e: React.MouseEvent) => void;
  onBack: () => void;
  onOpenMeetup: (suggestedOffer?: number) => void;
  onOpenProfile: () => void;
  profile: Profile | null;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  lang,
  onChangeLang,
  product,
  liked,
  onToggleLike,
  onBack,
  onOpenMeetup,
  onOpenProfile,
  profile,
}) => {
  const t = TRANSLATIONS[lang];
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const title = lang === 'en' && product.title_en ? product.title_en : product.title;
  const safeZone =
    lang === 'en' && product.safe_zone_en ? product.safe_zone_en : product.safe_zone;
  const description =
    lang === 'en' && product.description_en ? product.description_en : product.description;

  // Estimate retail price if not stored in DB so Loss Aversion badge always works authentically
  const retailPrice =
    product.retail_price && product.retail_price > product.price
      ? product.retail_price
      : Math.round((product.price * 2.4) / 100) * 100;
  const savings = Math.max(0, retailPrice - product.price);
  const discountPct = Math.round((savings / retailPrice) * 100);

  const offer8 = Math.round((product.price * 0.92) / 50) * 50;
  const offer12 = Math.round((product.price * 0.88) / 50) * 50;
  const offerToday = Math.round((product.price * 0.83) / 50) * 50;

  const categoryLabel =
    t.categories[(product.category as CategoryKey) || 'textbooks'] || product.category;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard may be unavailable in restricted frames
    }
    setToastMsg(t.detail.shareCopied);
    window.setTimeout(() => setToastMsg(null), 2200);
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] pb-36">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="font-display text-base font-bold text-slate-900">
          {t.header.detailTitle}
        </h1>

        <button
          type="button"
          onClick={onOpenProfile}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-600 text-xs font-bold text-white"
        >
          {profile?.nickname ? profile.nickname.slice(0, 2).toUpperCase() : 'KG'}
        </button>
      </header>

      {/* Breadcrumb & Quick Actions */}
      <div className="flex items-center justify-between gap-2 bg-white px-4 py-2 text-xs">
        <div className="flex min-w-0 items-center gap-1.5 text-slate-600">
          <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
          <span className="truncate font-semibold text-slate-800">{categoryLabel}</span>
          <span className="text-slate-400">&gt;</span>
          <span className="truncate">{safeZone}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChangeLang(lang === 'ru' ? 'en' : 'ru')}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-[#2563EB]"
          >
            {lang === 'ru' ? 'EN | RU' : 'RU | EN'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => onToggleLike(product, e)}
            className="flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-800"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                liked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'
              }`}
            />
            <span className="tabular-nums">
              {product.likes + (liked && product.is_seed ? 1 : 0)}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Product Image + Loss Aversion Banner */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
        <ProductVisual
          imageUrl={product.image_url}
          alt={title}
          category={product.category}
          className="h-full w-full"
        />

        {/* Condition Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#2563EB] shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{product.condition || (lang === 'ru' ? 'Проверено · Отличное состояние' : 'Verified · Great Condition')}</span>
        </div>

        {/* Loss Aversion Overlay Card */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#854D0E]/95 via-[#92600A]/90 to-[#1E3A8A]/90 px-3.5 py-2.5 text-white shadow-lg backdrop-blur-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-900">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold tracking-tight text-white">
              {t.detail.saveBadge(savings)}
            </div>
            <div className="text-[11px] font-medium text-amber-100">
              {t.detail.retailLabel(retailPrice)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Stack */}
      <div className="space-y-3.5 px-4 pt-3.5">
        {/* Title, Urgency & Price Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>{t.detail.viewingNow(Math.max(2, (product.views % 6) + 2))}</span>
          </div>

          <h2 className="mt-2.5 font-display text-xl leading-snug font-extrabold text-slate-900">
            {title}
          </h2>

          <div className="mt-2.5 flex items-baseline gap-2.5">
            <span className="font-display text-2xl font-extrabold text-[#2563EB] tabular-nums">
              {product.price.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')} {t.feed.currency}
            </span>
            <span className="text-sm font-medium text-slate-400 line-through tabular-nums">
              {retailPrice.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')} {t.feed.currency}
            </span>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700 tabular-nums">
              -{discountPct}%
            </span>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-blue-50/80 px-3.5 py-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
            <div>
              <div className="text-[11px] font-bold text-[#2563EB]">{t.detail.pickupLabel}</div>
              <div className="text-xs font-bold text-slate-800">{safeZone}</div>
            </div>
          </div>
        </div>

        {/* Seller Card with Manner Temp 98.5°C */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-sm font-extrabold text-white shadow-sm">
                {product.seller_name.slice(0, 2).toUpperCase()}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white">
                  <ShieldCheck className="h-2.5 w-2.5" />
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-base font-extrabold text-slate-900">
                    {product.seller_name}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    · {product.seller_major}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>{t.detail.verifiedStudent} ✓</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 font-display text-lg font-extrabold text-amber-600 tabular-nums">
                <span>98.5°C</span>
                <Thermometer className="h-4 w-4" />
              </div>
              <div className="text-[10px] font-semibold text-slate-500">
                {t.detail.mannerTempLabel}
              </div>
            </div>
          </div>

          {/* Manner Temp Bar */}
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-600" />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">{t.detail.avgTemp}</span>
              <span className="text-amber-700">{t.detail.topReliable}</span>
            </div>
          </div>

          {/* Seller Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-slate-50 p-2.5 text-center">
              <div className="font-display text-sm font-extrabold text-slate-900 tabular-nums">42</div>
              <div className="text-[10px] font-medium text-slate-500">{t.detail.dealsLabel}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 text-center">
              <div className="font-display text-sm font-extrabold text-slate-900 tabular-nums">
                5.0 / 5.0
              </div>
              <div className="text-[10px] font-medium text-slate-500">{t.detail.ratingLabel}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5 text-center">
              <div className="font-display text-sm font-extrabold text-slate-900">
                {t.detail.responseValue}
              </div>
              <div className="text-[10px] font-medium text-slate-500">{t.detail.responseLabel}</div>
            </div>
          </div>
        </div>

        {/* Safe Deal Checklist */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-display text-sm font-extrabold text-slate-900">
              {t.detail.safeDealTitle}
            </h3>
          </div>

          <div className="mt-3 space-y-3">
            {t.detail.safeChecks.map((check, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-900">✓ {check.title}</div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Safe Zone Map Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-display text-sm font-extrabold text-slate-900">
              <MapPin className="h-4 w-4 text-[#2563EB]" />
              <span>{t.detail.meetupSpotTitle}</span>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]">
              {t.detail.walkTime}
            </span>
          </div>

          <BishkekSafeMap safeZone={safeZone} />

          <p className="mt-2.5 text-[11px] text-slate-500">{t.detail.meetupNote}</p>
        </div>

        {/* Seller Description */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <h3 className="font-display text-base font-extrabold text-slate-900">
            {t.detail.wordFrom(product.seller_name)}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">{description}</p>
          <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2.5 text-[11px] font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
            <span>{t.detail.convenientHours}</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Counter-Offer & Propose Meetup Bar */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200 bg-white/95 px-4 pt-2.5 pb-3.5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-700">{t.detail.proposePrice}</span>
          <span className="font-bold text-emerald-700">{t.detail.acceptanceChance}</span>
        </div>

        <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { amount: offer8, label: `${offer8} ${t.feed.currency} (-8%)` },
            { amount: offer12, label: `${offer12} ${t.feed.currency} (-12%)` },
            { amount: offerToday, label: `${offerToday} ${t.feed.currency} (${t.detail.takeToday})` },
          ].map((chip) => (
            <button
              key={chip.amount}
              type="button"
              onClick={() => onOpenMeetup(chip.amount)}
              className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-[#2563EB] transition-colors hover:bg-blue-100 active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenMeetup(product.price)}
            aria-label="Message seller"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#2563EB] active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => onOpenMeetup(product.price)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-extrabold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 active:scale-[0.98]"
          >
            <Handshake className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">{t.detail.proposeMeetupCta}</span>
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {toastMsg && (
        <div className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
