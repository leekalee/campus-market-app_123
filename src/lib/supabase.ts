import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { MeetupRequest, Product, Profile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const SUPABASE_SCHEMA_SQL = `-- Run this SQL in your Supabase SQL Editor
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null,
  university text not null,
  major text not null,
  manner_temp numeric default 98.5,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price integer not null,
  category text not null,
  safe_zone text not null,
  description text not null,
  image_url text not null,
  seller_name text not null,
  seller_major text not null,
  likes integer default 0,
  views integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.meetup_requests (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_title text not null,
  buyer_id uuid references auth.users(id) on delete set null,
  buyer_name text not null,
  seller_name text not null,
  safe_zone text not null,
  proposed_time text not null,
  offer_price integer not null,
  payment_method text not null,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS & open policies for campus marketplace demo
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.meetup_requests enable row level security;

create policy "Public profiles read" on public.profiles for select using (true);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Public products read" on public.products for select using (true);
create policy "Authenticated insert products" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Public update product stats" on public.products for update using (true);
create policy "Authenticated delete products" on public.products for delete using (auth.role() = 'authenticated');

create policy "Authenticated read meetups" on public.meetup_requests for select using (auth.role() = 'authenticated');
create policy "Authenticated insert meetups" on public.meetup_requests for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update meetups" on public.meetup_requests for update using (auth.role() = 'authenticated');

-- Create public storage bucket for product-images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;
create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Authenticated upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
`;

export async function fetchProductsFromSupabase(): Promise<{
  data: Product[];
  error: string | null;
}> {
  if (!supabase) {
    return { data: [], error: null };
  }
  const { data, error } = await supabase
    .from('products')
    .select('id, title, price, category, safe_zone, description, image_url, seller_name, seller_major, likes, views, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }
  return { data: (data as Product[]) || [], error: null };
}

export async function uploadProductImage(
  file: File,
  userId: string
): Promise<{ publicUrl: string | null; error: string | null }> {
  if (!supabase) {
    return { publicUrl: null, error: 'Supabase is not configured.' };
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return { publicUrl: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return { publicUrl: data.publicUrl, error: null };
}

export async function insertProduct(payload: {
  title: string;
  price: number;
  category: string;
  safe_zone: string;
  description: string;
  image_url: string;
  seller_name: string;
  seller_major: string;
}): Promise<{ data: Product | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: 'Supabase is not configured.' };
  }
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        title: payload.title,
        price: payload.price,
        category: payload.category,
        safe_zone: payload.safe_zone,
        description: payload.description,
        image_url: payload.image_url,
        seller_name: payload.seller_name,
        seller_major: payload.seller_major,
        likes: 0,
        views: 1,
      },
    ])
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as Product, error: null };
}

export async function updateProductCounts(
  productId: string,
  fields: { likes?: number; views?: number }
): Promise<void> {
  if (!supabase) return;
  await supabase.from('products').update(fields).eq('id', productId);
}

export async function deleteProductFromSupabase(
  productId: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { error } = await supabase.from('products').delete().eq('id', productId);
  return { error: error ? error.message : null };
}

export async function fetchUserProfile(userId: string, email?: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data: byId } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (byId) return byId as Profile;

  if (email) {
    const { data: byEmail } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (byEmail) return byEmail as Profile;
  }
  return null;
}

export async function saveUserProfile(profile: Profile): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const row: Record<string, unknown> = {
    email: profile.email,
    nickname: profile.nickname,
    university: profile.university,
    major: profile.major,
    manner_temp: profile.manner_temp ?? 98.5,
  };
  if (profile.id) {
    row.id = profile.id;
  }
  const { error } = await supabase.from('profiles').upsert(row);
  return { error: error ? error.message : null };
}

export async function insertMeetupRequest(
  request: Omit<MeetupRequest, 'id' | 'created_at'>
): Promise<{ data: MeetupRequest | null; error: string | null }> {
  if (!supabase) return { data: null, error: 'Supabase is not configured.' };
  const { data, error } = await supabase
    .from('meetup_requests')
    .insert([request])
    .select()
    .single();
  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as MeetupRequest, error: null };
}

export async function fetchMeetupRequests(
  userId?: string,
  nickname?: string
): Promise<{ data: MeetupRequest[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('meetup_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }
  const all = (data as MeetupRequest[]) || [];
  if (!userId && !nickname) return { data: all, error: null };
  const filtered = all.filter(
    (m) => m.buyer_id === userId || m.buyer_name === nickname || m.seller_name === nickname
  );
  return { data: filtered, error: null };
}

export async function updateMeetupStatus(
  id: string,
  status: 'accepted' | 'declined'
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };
  const { error } = await supabase.from('meetup_requests').update({ status }).eq('id', id);
  return { error: error ? error.message : null };
}
