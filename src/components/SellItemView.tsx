import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronDown,
  Laptop,
  Lightbulb,
  MapPin,
  Rocket,
  ShieldCheck,
  Shirt,
  Sofa,
  X,
  Zap,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import { insertProduct, isSupabaseConfigured, uploadProductImage } from '../lib/supabase';
import type { CategoryKey, Language, Product, Profile } from '../types';

interface SellItemViewProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  profile: Profile | null;
  userId?: string;
  onBack: () => void;
  onPublished: (newProduct: Product) => void;
  onOpenProfile: () => void;
}

export const SellItemView: React.FC<SellItemViewProps> = ({
  lang,
  onChangeLang,
  profile,
  userId,
  onBack,
  onPublished,
  onOpenProfile,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<CategoryKey, 'all'>>('textbooks');
  const [price, setPrice] = useState('1200');
  const [negotiable, setNegotiable] = useState(true);
  const [safeZone, setSafeZone] = useState(t.safeZones[0]);
  const [condition, setCondition] = useState(t.sell.conditions[0]);
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setErrorMsg(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle('');
    setPrice('1200');
    setDescription('');
    setErrorMsg(null);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(t.profile.configBannerDesc);
      return;
    }

    if (!userId || !profile) {
      setErrorMsg(t.sell.authRequiredDesc);
      return;
    }

    if (!selectedFile) {
      setErrorMsg(t.sell.errorMissingPhoto);
      return;
    }

    const numericPrice = parseInt(price.replace(/\D/g, ''), 10);
    if (!title.trim() || !numericPrice || !safeZone.trim()) {
      setErrorMsg(t.sell.errorMissingFields);
      return;
    }

    setSubmitting(true);

    const { publicUrl, error: uploadError } = await uploadProductImage(selectedFile, userId);
    if (uploadError || !publicUrl) {
      setSubmitting(false);
      setErrorMsg(uploadError || 'Failed to upload image to product-images bucket.');
      return;
    }

    const fullDescription = [
      description.trim() || t.detail.convenientHours,
      `[${condition}${negotiable ? (lang === 'ru' ? ' · Торг уместен' : ' · Negotiable') : ''}]`,
    ].join('\n');

    const { data, error: insertError } = await insertProduct({
      title: title.trim(),
      price: numericPrice,
      category,
      safe_zone: safeZone,
      description: fullDescription,
      image_url: publicUrl,
      seller_name: profile.nickname,
      seller_major: `${profile.university} · ${profile.major}`,
    });

    setSubmitting(false);

    if (insertError || !data) {
      setErrorMsg(insertError || 'Could not save listing to public.products.');
      return;
    }

    onPublished(data);
  };

  const categories: { key: Exclude<CategoryKey, 'all'>; icon: React.ReactNode }[] = [
    { key: 'textbooks', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: 'electronics', icon: <Laptop className="h-3.5 w-3.5" /> },
    { key: 'dorm', icon: <Sofa className="h-3.5 w-3.5" /> },
    { key: 'clothing', icon: <Shirt className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex flex-col bg-[#F8FAFC] pb-32">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-display text-base font-bold text-slate-900">
            {t.header.sellTitle}
          </span>
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-blue-600 text-xs font-bold text-white"
          >
            {profile?.nickname ? profile.nickname.slice(0, 2).toUpperCase() : 'KG'}
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="font-display text-base font-extrabold text-slate-900">
              {t.sell.title}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onChangeLang(lang === 'ru' ? 'en' : 'ru')}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]"
            >
              {lang === 'ru' ? 'RU | EN' : 'EN | RU'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-[#2563EB]"
            >
              {t.sell.reset}
            </button>
          </div>
        </div>
      </header>

      <form onSubmit={handlePublish} className="space-y-4 px-4 pt-3.5">
        {/* Fast Campus Cash Banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Lightbulb className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold tracking-wide text-emerald-700">
              {t.sell.promoBadge}
            </div>
            <p className="mt-0.5 text-xs leading-snug font-semibold text-slate-800">
              {t.sell.promoText}
            </p>
          </div>
        </div>

        {/* Auth Prompt Banner if not logged in */}
        {!profile && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-3.5">
            <div>
              <div className="text-xs font-extrabold text-slate-900">
                {t.sell.authRequiredTitle}
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600">{t.sell.authRequiredDesc}</p>
            </div>
            <button
              type="button"
              onClick={onOpenProfile}
              className="shrink-0 rounded-xl bg-[#2563EB] px-3 py-2 text-xs font-bold text-white"
            >
              {t.sell.goToLogin}
            </button>
          </div>
        )}

        {/* Photo Upload Section */}
        <section>
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-slate-900">
              {t.sell.photosLabel}{' '}
              <span className="text-[#2563EB] tabular-nums">({selectedFile ? 1 : 0}/1)</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800">
              <Zap className="h-3 w-3 fill-current" />
              {t.sell.photoTip}
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-2.5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/70 text-[#2563EB] transition-colors hover:bg-blue-100/70 active:scale-95"
            >
              <Camera className="h-6 w-6" />
              <span className="px-1 text-center text-[11px] font-bold leading-tight">
                {selectedFile ? t.sell.changePhoto : t.sell.addPhoto}
              </span>
            </button>

            {previewUrl ? (
              <div className="relative h-24 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  aria-label="Remove photo"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/75 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute inset-x-0 bottom-0 bg-slate-900/65 py-0.5 text-center text-[10px] font-bold text-white">
                  {t.sell.photoSelected}
                </span>
              </div>
            ) : (
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-500">
                <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
                <span>{t.sell.photoAdvice}</span>
              </div>
            )}
          </div>
        </section>

        {/* Title */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="sell-title" className="text-sm font-extrabold text-slate-900">
              {t.sell.titlePrompt}
            </label>
            <span className="text-xs font-medium text-slate-400 tabular-nums">
              {title.length}/80
            </span>
          </div>
          <input
            id="sell-title"
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.sell.titlePlaceholder}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        {/* Category Chips */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-slate-900">
            {t.sell.categoryLabel}
          </label>
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 no-scrollbar">
            {categories.map((cat) => {
              const active = category === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
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
        </div>

        {/* Price in KGS & Negotiable Toggle */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <label htmlFor="sell-price" className="block text-sm font-extrabold text-slate-900">
            {t.sell.priceLabel}
          </label>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-slate-100 px-3.5 py-2.5">
            <span className="font-display text-sm font-extrabold text-[#2563EB]">сом</span>
            <input
              id="sell-price"
              type="number"
              min={50}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent font-display text-xl font-extrabold text-slate-900 tabular-nums focus:outline-none"
            />
          </div>

          <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div>
              <div className="text-xs font-extrabold text-slate-900">
                {t.sell.negotiableTitle}
              </div>
              <div className="text-[11px] text-slate-500">{t.sell.negotiableSub}</div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={negotiable}
              onClick={() => setNegotiable((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                negotiable ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform ${
                  negotiable ? 'translate-x-5.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Safe Campus Meetup Location */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
            <span>{t.sell.safeZoneLabel}</span>
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#2563EB]" />
            <select
              value={safeZone}
              onChange={(e) => setSafeZone(e.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-xs font-bold text-slate-900 focus:border-[#2563EB] focus:outline-none"
            >
              {t.safeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {t.safeZones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => setSafeZone(zone)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                  safeZone === zone
                    ? 'bg-blue-100 text-[#2563EB]'
                    : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {zone.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Condition Selector */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-slate-900">
            {t.sell.conditionLabel}
          </label>
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-blue-50/80 p-1.5">
            {t.sell.conditions.map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setCondition(cond)}
                className={`rounded-xl px-1.5 py-2 text-[11px] font-bold leading-tight transition-all ${
                  condition === cond
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="sell-desc" className="mb-2 block text-sm font-extrabold text-slate-900">
            {t.sell.descLabel}
          </label>
          <textarea
            id="sell-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.sell.descPlaceholder}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
          />
        </div>

        {/* Safety Box */}
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-3.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
          <div>
            <div className="text-xs font-extrabold text-slate-900">{t.sell.safetyBoxTitle}</div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
              {t.sell.safetyBoxDesc}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Submit CTA */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 font-display text-sm font-extrabold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60"
          >
            <Rocket className="h-4.5 w-4.5" />
            <span>{submitting ? t.sell.publishing : t.sell.publishCta}</span>
          </button>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t.sell.publishFoot}</span>
          </div>
        </div>
      </form>
    </div>
  );
};
