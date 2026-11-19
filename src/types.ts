export type Language = 'ru' | 'en';

export type CategoryKey = 'all' | 'textbooks' | 'electronics' | 'dorm' | 'clothing';

export type UniversityKey = 'all' | 'KNU' | 'AUCA' | 'Manas University' | 'KRSU';

export type TabKey = 'home' | 'sell' | 'profile';

export interface Product {
  id: string;
  title: string;
  title_en?: string;
  price: number;
  retail_price?: number;
  category: Exclude<CategoryKey, 'all'> | string;
  safe_zone: string;
  safe_zone_en?: string;
  description: string;
  description_en?: string;
  image_url: string;
  seller_name: string;
  seller_major: string;
  seller_id?: string;
  university?: Exclude<UniversityKey, 'all'> | string;
  condition?: string;
  negotiable?: boolean;
  urgent_tag?: string;
  urgent_tag_en?: string;
  likes: number;
  views: number;
  created_at: string;
  is_seed?: boolean;
}

export interface Profile {
  id?: string;
  email: string;
  nickname: string;
  university: Exclude<UniversityKey, 'all'> | string;
  major: string;
  manner_temp: number;
  deals_count?: number;
  rating?: number;
  created_at?: string;
}

export interface MeetupRequest {
  id?: string;
  product_id: string;
  product_title: string;
  buyer_id?: string;
  buyer_name: string;
  buyer_email?: string;
  seller_name: string;
  safe_zone: string;
  proposed_time: string;
  offer_price: number;
  payment_method: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at?: string;
}
