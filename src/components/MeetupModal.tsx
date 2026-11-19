import React, { useState } from 'react';
import { CalendarClock, CheckCircle2, MapPin, ShieldCheck, Wallet, X } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import { insertMeetupRequest, isSupabaseConfigured } from '../lib/supabase';
import type { Language, Product, Profile } from '../types';
import { ProductVisual } from './ProductVisual';

interface MeetupModalProps {
  lang: Language;
  product: Product;
  initialOffer?: number;
  profile: Profile | null;
  userId?: string;
  onClose: () => void;
  onGoToProfile: () => void;
}

export const MeetupModal: React.FC<MeetupModalProps> = ({
  lang,
  product,
  initialOffer,
  profile,
  userId,
  onClose,
  onGoToProfile,
}) => {
  const t = TRANSLATIONS[lang];
  const defaultZone =
    lang === 'en' && product.safe_zone_en ? product.safe_zone_en : product.safe_zone;

  const [safeZone, setSafeZone] = useState(defaultZone);
  const [proposedTime, setProposedTime] = useState(t.meetupModal.times[0]);
  const [paymentMethod, setPaymentMethod] = useState(t.meetupModal.payments[0]);
  const [offerPrice, setOfferPrice] = useState(String(initialOffer ?? product.price));
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const safeZoneChoices = Array.from(new Set([defaultZone, ...t.safeZones]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(t.profile.configBannerDesc);
      return;
    }

    if (!userId || !profile) {
      setErrorMsg(t.meetupModal.loginNeeded);
      return;
    }

    const numericOffer = parseInt(offerPrice.replace(/\D/g, ''), 10) || product.price;
    setSubmitting(true);

    const { error } = await insertMeetupRequest({
      product_id: product.id,
      product_title: lang === 'en' && product.title_en ? product.title_en : product.title,
      buyer_id: userId,
      buyer_name: profile.nickname,
      seller_name: product.seller_name,
      safe_zone: safeZone,
      proposed_time: proposedTime,
      offer_price: numericOffer,
      payment_method: paymentMethod,
      message: message.trim() || t.meetupModal.messagePlaceholder,
      status: 'pending',
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
    >
      <div className="relative max-h-[90vh] w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl font-extrabold text-slate-900">
              {t.meetupModal.successTitle}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {t.meetupModal.successDesc}
            </p>
            <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left text-xs">
              <div className="font-bold text-slate-900">{safeZone}</div>
              <div className="mt-1 text-slate-600">
                {proposedTime} · {offerPrice} {t.feed.currency} · {paymentMethod}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 h-11 w-full rounded-xl bg-[#2563EB] text-sm font-extrabold text-white shadow-md shadow-blue-600/20"
            >
              {t.meetupModal.doneBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="pr-8">
              <h3 className="font-display text-lg font-extrabold text-slate-900">
                {t.meetupModal.title}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>{t.meetupModal.subtitle}</span>
              </p>
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
              <div className="h-12 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                <ProductVisual
                  imageUrl={product.image_url}
                  alt={product.title}
                  category={product.category}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-slate-900">
                  {lang === 'en' && product.title_en ? product.title_en : product.title}
                </div>
                <div className="mt-0.5 text-xs font-extrabold text-[#2563EB] tabular-nums">
                  {product.price.toLocaleString()} {t.feed.currency} · {product.seller_name}
                </div>
              </div>
            </div>

            {/* Safe Zone Chips */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>{t.meetupModal.safeZoneLabel}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {safeZoneChoices.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSafeZone(zone)}
                    className={`rounded-xl border px-2.5 py-1.5 text-left text-[11px] font-semibold transition-colors ${
                      safeZone === zone
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CalendarClock className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>{t.meetupModal.timeLabel}</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {t.meetupModal.times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setProposedTime(time)}
                    className={`rounded-xl border px-2.5 py-2 text-[11px] font-semibold transition-colors ${
                      proposedTime === time
                        ? 'border-[#2563EB] bg-[#2563EB] text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Offer Price & Payment Method */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-800">
                  {t.meetupModal.offerLabel}
                </label>
                <input
                  type="number"
                  min={50}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-slate-900 tabular-nums focus:border-[#2563EB] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-800">
                  <Wallet className="h-3 w-3 text-[#2563EB]" />
                  <span>{t.meetupModal.paymentLabel}</span>
                </label>
                <div className="flex flex-col gap-1">
                  {t.meetupModal.payments.map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition-colors ${
                        paymentMethod === pm
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-800">
                {t.meetupModal.messageLabel}
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.meetupModal.messagePlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                <div>{errorMsg}</div>
                {!userId && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGoToProfile();
                    }}
                    className="mt-1.5 font-extrabold text-[#2563EB] underline"
                  >
                    {t.sell.goToLogin}
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-[#2563EB] text-sm font-extrabold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? t.meetupModal.submitting : t.meetupModal.submitCta}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
