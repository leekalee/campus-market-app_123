import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Database,
  GraduationCap,
  LogOut,
  MapPin,
  Plus,
  ShieldCheck,
  Thermometer,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import {
  SUPABASE_SCHEMA_SQL,
  deleteProductFromSupabase,
  fetchMeetupRequests,
  isSupabaseConfigured,
  saveUserProfile,
  supabase,
  updateMeetupStatus,
} from '../lib/supabase';
import type { Language, MeetupRequest, Product, Profile, UniversityKey } from '../types';
import { ProductVisual } from './ProductVisual';

interface ProfileViewProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  userId?: string;
  userEmail?: string;
  profile: Profile | null;
  products: Product[];
  onAuthUpdated: () => Promise<void>;
  onSelectProduct: (product: Product) => void;
  onOpenSell: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  lang,
  onChangeLang,
  userId,
  userEmail,
  profile,
  products,
  onAuthUpdated,
  onSelectProduct,
  onOpenSell,
}) => {
  const t = TRANSLATIONS[lang];

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState<Exclude<UniversityKey, 'all'>>('KNU');
  const [major, setMajor] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Profile sub-tabs
  const [activeTab, setActiveTab] = useState<'listings' | 'meetups'>('listings');
  const [meetups, setMeetups] = useState<MeetupRequest[]>([]);
  const [meetupsLoading, setMeetupsLoading] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const myListings = products.filter(
    (p) => !p.is_seed && profile?.nickname && p.seller_name === profile.nickname
  );

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;
    setMeetupsLoading(true);
    fetchMeetupRequests(userId, profile?.nickname).then(({ data }) => {
      setMeetups(data);
      setMeetupsLoading(false);
    });
  }, [userId, profile?.nickname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    if (!supabase) {
      setAuthError(t.profile.configBannerDesc);
      return;
    }

    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setAuthLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }
    await onAuthUpdated();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    if (!supabase) {
      setAuthError(t.profile.configBannerDesc);
      return;
    }

    if (!nickname.trim() || !major.trim()) {
      setAuthError(
        lang === 'ru'
          ? 'Укажите никнейм и факультет/курс.'
          : 'Please enter your nickname and major/year.'
      );
      return;
    }

    setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          nickname: nickname.trim(),
          university,
          major: major.trim(),
        },
      },
    });

    if (error) {
      setAuthLoading(false);
      setAuthError(error.message);
      return;
    }

    if (data.user) {
      const { error: profileErr } = await saveUserProfile({
        id: data.user.id,
        email: email.trim(),
        nickname: nickname.trim(),
        university,
        major: major.trim(),
        manner_temp: 98.5,
      });

      if (profileErr) {
        setAuthNotice(`${t.profile.checkEmailConfirm} (${profileErr})`);
      } else if (!data.session) {
        setAuthNotice(t.profile.checkEmailConfirm);
      }
    }

    setAuthLoading(false);
    await onAuthUpdated();
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    await onAuthUpdated();
  };

  const handleDeleteListing = async (id: string) => {
    const { error } = await deleteProductFromSupabase(id);
    if (!error) {
      await onAuthUpdated();
    }
  };

  const handleMeetupAction = async (id: string, status: 'accepted' | 'declined') => {
    const { error } = await updateMeetupStatus(id, status);
    if (!error) {
      setMeetups((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSql(true);
      window.setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col bg-[#F8FAFC] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div>
          <span className="font-display text-lg font-extrabold text-[#2563EB]">CampusMarket</span>
          <span className="ml-2 text-xs font-bold text-slate-600">{t.header.profileTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              className={`rounded-full px-2 py-0.5 ${
                lang === 'ru' ? 'bg-[#2563EB] text-white' : 'text-slate-500'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`rounded-full px-2 py-0.5 ${
                lang === 'en' ? 'bg-[#2563EB] text-white' : 'text-slate-500'
              }`}
            >
              EN
            </button>
          </div>

          {userId && (
            <button
              type="button"
              onClick={handleSignOut}
              aria-label={t.profile.signOutBtn}
              className="flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{t.profile.signOutBtn}</span>
            </button>
          )}
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        {/* Supabase Configuration Helper if env vars missing */}
        {!isSupabaseConfigured && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
              <Database className="h-4 w-4 text-amber-700" />
              <span>{t.profile.configBannerTitle}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
              {t.profile.configBannerDesc}
            </p>
          </div>
        )}

        {!userId ? (
          /* Real Supabase Auth Screen */
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-extrabold text-slate-900">
                  {t.profile.welcomeTitle}
                </h2>
                <p className="text-xs text-slate-500">{t.profile.welcomeSub}</p>
              </div>
            </div>

            {/* Login / Sign Up Switcher */}
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {t.profile.signInTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {t.profile.signUpTab}
              </button>
            </div>

            <form
              onSubmit={authMode === 'login' ? handleLogin : handleSignUp}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t.profile.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@knu.kg"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  {t.profile.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      {t.profile.nicknameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={t.profile.nicknamePlaceholder}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      {t.profile.universityLabel}
                    </label>
                    <select
                      value={university}
                      onChange={(e) =>
                        setUniversity(e.target.value as Exclude<UniversityKey, 'all'>)
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                    >
                      <option value="KNU">KNU (КНУ)</option>
                      <option value="AUCA">AUCA (АУЦА)</option>
                      <option value="Manas University">Manas University (Манас)</option>
                      <option value="KRSU">KRSU (КРСУ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      {t.profile.majorLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder={t.profile.majorPlaceholder}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {authError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {authError}
                </div>
              )}

              {authNotice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {authNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="h-12 w-full rounded-xl bg-[#2563EB] text-sm font-extrabold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {authLoading
                  ? authMode === 'login'
                    ? t.profile.signingIn
                    : t.profile.signingUp
                  : authMode === 'login'
                    ? t.profile.signInBtn
                    : t.profile.signUpBtn}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Student Profile */
          <>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1E40AF] font-display text-lg font-extrabold text-white shadow-sm">
                    {(profile?.nickname || userEmail || 'KG').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-extrabold text-slate-900">
                      {profile?.nickname || userEmail?.split('@')[0]}
                    </h2>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <GraduationCap className="h-3.5 w-3.5 text-[#2563EB]" />
                      <span>
                        {profile?.university || 'KNU'} · {profile?.major || 'Student'}
                      </span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{t.detail.verifiedStudent}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 font-display text-lg font-extrabold text-amber-600 tabular-nums">
                    <span>{profile?.manner_temp ?? 98.5}°C</span>
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    {t.detail.mannerTempLabel}
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-600" />
              </div>
            </div>

            {/* Sub-tabs: My Listings / Meetups */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  activeTab === 'listings'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {t.profile.myListingsTab} ({myListings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('meetups')}
                className={`rounded-xl py-2 text-xs font-bold transition-all ${
                  activeTab === 'meetups'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                {t.profile.meetupsTab} ({meetups.length})
              </button>
            </div>

            {activeTab === 'listings' ? (
              myListings.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                  <p className="text-xs font-semibold text-slate-600">{t.profile.noListings}</p>
                  <button
                    type="button"
                    onClick={onOpenSell}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-extrabold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t.profile.createFirstListing}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myListings.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5"
                    >
                      <div
                        onClick={() => onSelectProduct(item)}
                        className="h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-slate-100"
                      >
                        <ProductVisual
                          imageUrl={item.image_url}
                          alt={item.title}
                          category={item.category}
                          className="h-full w-full"
                        />
                      </div>
                      <div
                        onClick={() => onSelectProduct(item)}
                        className="min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="truncate text-xs font-bold text-slate-900">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-xs font-extrabold text-[#2563EB] tabular-nums">
                          {item.price.toLocaleString()} {t.feed.currency}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{item.safe_zone}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteListing(item.id)}
                        aria-label={t.profile.deleteListing}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : meetupsLoading ? (
              <div className="rounded-2xl bg-white p-6 text-center text-xs font-medium text-slate-500">
                Loading...
              </div>
            ) : meetups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-xs font-semibold text-slate-600">
                {t.profile.noMeetups}
              </div>
            ) : (
              <div className="space-y-2.5">
                {meetups.map((m) => {
                  const isSeller = profile?.nickname && m.seller_name === profile.nickname;
                  const statusBadge =
                    m.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : m.status === 'declined'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800';
                  const statusLabel =
                    m.status === 'accepted'
                      ? t.profile.statusAccepted
                      : m.status === 'declined'
                        ? t.profile.statusDeclined
                        : t.profile.statusPending;

                  return (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-xs font-extrabold text-slate-900">
                            {m.product_title}
                          </div>
                          <div className="mt-0.5 text-[11px] font-semibold text-[#2563EB] tabular-nums">
                            {m.offer_price.toLocaleString()} {t.feed.currency} · {m.payment_method}
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>
                            {m.safe_zone} · {m.proposed_time}
                          </span>
                        </div>
                        <div>
                          {isSeller
                            ? `${t.profile.buyerLabel}: ${m.buyer_name}`
                            : `${t.profile.sellerLabel}: ${m.seller_name}`}
                        </div>
                        {m.message && <p className="italic text-slate-500">"{m.message}"</p>}
                      </div>

                      {isSeller && m.status === 'pending' && m.id && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMeetupAction(m.id!, 'accepted')}
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>{t.profile.acceptBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMeetupAction(m.id!, 'declined')}
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>{t.profile.declineBtn}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Collapsible Supabase Schema Helper */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
          <button
            type="button"
            onClick={() => setShowSql((v) => !v)}
            className="flex w-full items-center justify-between text-xs font-bold text-slate-700"
          >
            <span className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#2563EB]" />
              <span>{showSql ? t.profile.hideSqlBtn : t.profile.showSqlBtn}</span>
            </span>
            <span className="text-[#2563EB]">{showSql ? '−' : '+'}</span>
          </button>

          {showSql && (
            <div className="mt-3">
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#2563EB]"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedSql ? t.profile.sqlCopied : t.profile.copySqlBtn}</span>
                </button>
              </div>
              <pre className="max-h-56 overflow-auto rounded-xl bg-slate-900 p-3 font-mono text-[10px] leading-relaxed text-slate-100">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
