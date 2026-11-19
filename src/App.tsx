/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Store, User } from 'lucide-react';
import { HomeFeed } from './components/HomeFeed';
import { MeetupModal } from './components/MeetupModal';
import { ProductDetail } from './components/ProductDetail';
import { ProfileView } from './components/ProfileView';
import { SellItemView } from './components/SellItemView';
import { TRANSLATIONS } from './data/i18n';
import { SEED_PRODUCTS } from './data/seedProducts';
import {
  fetchProductsFromSupabase,
  fetchUserProfile,
  isSupabaseConfigured,
  supabase,
  updateProductCounts,
} from './lib/supabase';
import type { Language, Product, Profile, TabKey } from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [meetupState, setMeetupState] = useState<{
    open: boolean;
    offer?: number;
  }>({ open: false });

  // Auth & Profile state
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Products state
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const loadSessionAndProfile = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setUserId(undefined);
      setUserEmail(undefined);
      setProfile(null);
      return;
    }

    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) {
      setUserId(undefined);
      setUserEmail(undefined);
      setProfile(null);
      return;
    }

    setUserId(user.id);
    setUserEmail(user.email);

    const fetched = await fetchUserProfile(user.id, user.email);
    if (fetched) {
      setProfile(fetched);
    } else if (user.user_metadata) {
      setProfile({
        id: user.id,
        email: user.email || '',
        nickname: (user.user_metadata.nickname as string) || user.email?.split('@')[0] || 'Student',
        university: (user.user_metadata.university as string) || 'KNU',
        major: (user.user_metadata.major as string) || 'Student',
        manner_temp: 98.5,
      });
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    const { data } = await fetchProductsFromSupabase();
    setDbProducts(data);
    setLoadingProducts(false);
  }, []);

  useEffect(() => {
    loadSessionAndProfile();
    loadProducts();

    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSessionAndProfile();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [loadSessionAndProfile, loadProducts]);

  const isShowingSeed = dbProducts.length === 0;
  const visibleProducts = isShowingSeed ? SEED_PRODUCTS : dbProducts;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const handleSelectProduct = async (product: Product) => {
    const updatedProduct = { ...product, views: (product.views || 0) + 1 };
    setSelectedProduct(updatedProduct);

    if (!product.is_seed) {
      setDbProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, views: updatedProduct.views } : p))
      );
      await updateProductCounts(product.id, { views: updatedProduct.views });
    }
  };

  const handleToggleLike = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedIds.has(product.id);
    const nextLiked = new Set(likedIds);
    if (alreadyLiked) {
      nextLiked.delete(product.id);
    } else {
      nextLiked.add(product.id);
    }
    setLikedIds(nextLiked);

    if (!product.is_seed) {
      const nextLikes = Math.max(0, (product.likes || 0) + (alreadyLiked ? -1 : 1));
      setDbProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, likes: nextLikes } : p))
      );
      if (selectedProduct?.id === product.id) {
        setSelectedProduct((prev) => (prev ? { ...prev, likes: nextLikes } : null));
      }
      await updateProductCounts(product.id, { likes: nextLikes });
    }
  };

  const handlePublished = (newProduct: Product) => {
    setDbProducts((prev) => [newProduct, ...prev]);
    setSelectedProduct(null);
    setActiveTab('home');
    showToast(t.sell.publishSuccess);
  };

  const handleAuthUpdated = async () => {
    await loadSessionAndProfile();
    await loadProducts();
  };

  return (
    <div className="min-h-screen w-full bg-slate-100">
      {/* Centered Mobile-First Viewport Frame (max-w-430px on desktop, full width on mobile) */}
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F8FAFC] shadow-[0_0_40px_rgba(15,23,42,0.08)]">
        {selectedProduct ? (
          <ProductDetail
            lang={lang}
            onChangeLang={setLang}
            product={selectedProduct}
            liked={likedIds.has(selectedProduct.id)}
            onToggleLike={handleToggleLike}
            onBack={() => setSelectedProduct(null)}
            onOpenMeetup={(offer) => setMeetupState({ open: true, offer })}
            onOpenProfile={() => {
              setSelectedProduct(null);
              setActiveTab('profile');
            }}
            profile={profile}
          />
        ) : activeTab === 'home' ? (
          <HomeFeed
            lang={lang}
            onChangeLang={setLang}
            products={visibleProducts}
            loading={loadingProducts}
            isShowingSeed={isShowingSeed}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
            onSelectProduct={handleSelectProduct}
            onOpenProfile={() => setActiveTab('profile')}
            profile={profile}
          />
        ) : activeTab === 'sell' ? (
          <SellItemView
            lang={lang}
            onChangeLang={setLang}
            profile={profile}
            userId={userId}
            onBack={() => setActiveTab('home')}
            onPublished={handlePublished}
            onOpenProfile={() => setActiveTab('profile')}
          />
        ) : (
          <ProfileView
            lang={lang}
            onChangeLang={setLang}
            userId={userId}
            userEmail={userEmail}
            profile={profile}
            products={dbProducts}
            onAuthUpdated={handleAuthUpdated}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onOpenSell={() => setActiveTab('sell')}
          />
        )}

        {/* Fixed 3-Tab Bottom Navigation Bar (hidden when inside ProductDetail sticky CTA bar) */}
        {!selectedProduct && (
          <nav
            aria-label="Primary navigation"
            className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200/90 bg-white/95 px-6 pt-2 pb-3 shadow-[0_-4px_20px_rgba(15,23,42,0.05)] backdrop-blur-md"
          >
            <div className="grid grid-cols-3 items-end">
              {/* Tab 1: Home / Главная */}
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                  activeTab === 'home' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Store className="h-5 w-5" />
                <span className="text-[11px] font-bold tracking-tight">{t.tabs.home}</span>
              </button>

              {/* Center Floating "+" Button: Sell / Продать */}
              <div className="flex flex-col items-center justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('sell')}
                  aria-label={t.tabs.sell}
                  className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] text-white shadow-lg shadow-blue-600/35 transition-transform hover:bg-blue-700 active:scale-95"
                >
                  <Plus className="h-7 w-7 stroke-[2.75]" />
                </button>
                <span
                  className={`mt-1 text-[11px] font-extrabold tracking-tight ${
                    activeTab === 'sell' ? 'text-[#2563EB]' : 'text-slate-700'
                  }`}
                >
                  {t.tabs.sell}
                </span>
              </div>

              {/* Tab 3: My Page / Профиль */}
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center gap-1 py-1 transition-colors ${
                  activeTab === 'profile' ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="text-[11px] font-bold tracking-tight">{t.tabs.profile}</span>
              </button>
            </div>
          </nav>
        )}

        {/* Screen 4: Centered Dimmed Meetup Modal Overlay */}
        {meetupState.open && selectedProduct && (
          <MeetupModal
            lang={lang}
            product={selectedProduct}
            initialOffer={meetupState.offer}
            profile={profile}
            userId={userId}
            onClose={() => setMeetupState({ open: false })}
            onGoToProfile={() => {
              setMeetupState({ open: false });
              setSelectedProduct(null);
              setActiveTab('profile');
            }}
          />
        )}

        {/* Global Toast */}
        {toast && (
          <div className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
