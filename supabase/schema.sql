-- Sommelier On (소믈리에온) PostgreSQL / Supabase Schema
-- Supports multi-venue real-time cellar inventory, verified sommelier personas,
-- cumulative guest taste profiles, and pairing analytics.

create extension if not exists "pgcrypto";

create table if not exists public.venues (
  id text primary key,
  name_ko text not null,
  name_en text not null,
  cuisine_type_ko text not null,
  cuisine_type_en text not null,
  location_ko text not null,
  location_en text not null,
  logo_url text,
  default_persona_id text not null,
  price_transparency_opt_in boolean not null default true,
  recommendation_limit integer not null default 3,
  admin_pin text not null default '1234',
  tables jsonb not null default '["1", "2", "3", "7", "VIP 1"]'::jsonb,
  registered_dishes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sommelier_personas (
  id text primary key,
  name_ko text not null,
  name_en text not null,
  title_ko text not null,
  title_en text not null,
  genre_ko text not null,
  genre_en text not null,
  years_exp integer not null,
  credentials_ko text not null,
  credentials_en text not null,
  philosophy_ko text not null,
  philosophy_en text not null,
  preferred_regions jsonb not null default '[]'::jsonb,
  style_weights jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.wines (
  id text primary key,
  venue_id text not null references public.venues(id) on delete cascade,
  name_ko text not null,
  name_en text not null,
  producer text not null,
  vintage integer not null,
  category text not null check (category in ('sparkling', 'white', 'rose_orange', 'red', 'dessert')),
  varietals_ko text not null,
  varietals_en text not null,
  region_ko text not null,
  region_en text not null,
  country_code text not null,
  venue_price integer not null check (venue_price > 0),
  market_price integer not null check (market_price > 0),
  glass_price integer,
  stock integer not null default 0 check (stock >= 0),
  structure jsonb not null, -- { body, acidity, tannin, sweetness, alcohol } (1..5)
  aromas jsonb not null,    -- { primary: [], secondary: [], tertiary: [] }
  serving jsonb not null,   -- { glassType, tempMin, tempMax, decantMinutes, drinkWindowStart, drinkWindowEnd }
  storytelling jsonb not null, -- { terroirKo, terroirEn, vinificationKo, vinificationEn }
  pairing_affinities jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists idx_wines_venue_stock on public.wines (venue_id, stock);

create table if not exists public.user_taste_profiles (
  profile_id text primary key,
  liked_wine_ids jsonb not null default '[]'::jsonb,
  disliked_feedbacks jsonb not null default '[]'::jsonb,
  affinity_vector jsonb not null default '{"bodyDelta":0,"acidityDelta":0,"tanninDelta":0,"sweetnessDelta":0,"aromaWeights":{},"avoidTags":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.pairing_events (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues(id) on delete cascade,
  table_no text,
  persona_id text references public.sommelier_personas(id),
  mode text not null, -- 'alacarte' | 'course'
  bottle_count integer not null default 1,
  recommended_wine_ids jsonb not null default '[]'::jsonb,
  selected_wine_id text,
  feedback_type text, -- 'like' | 'dislike'
  dislike_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Real-time stock safety view: strictly exposes only stock > 0 for guest queries
create or replace view public.guest_available_wines as
select * from public.wines
where stock > 0;
