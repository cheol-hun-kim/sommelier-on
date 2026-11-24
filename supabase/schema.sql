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

create table if not exists public.guest_members (
  id text primary key,
  nickname text not null,
  contact text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tasting_journal_entries (
  id text primary key,
  member_id text not null references public.guest_members(id) on delete cascade,
  member_nickname text not null,
  venue_id text not null references public.venues(id) on delete cascade,
  wine_id text not null,
  wine_name_ko text not null,
  wine_name_en text not null,
  vintage integer not null,
  category text not null,
  rating text not null check (rating in ('like', 'dislike')),
  dislike_reasons jsonb not null default '[]'::jsonb,
  memo text,
  dishes_summary text,
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_venue on public.tasting_journal_entries (venue_id, created_at desc);

-- Real-time stock safety view: strictly exposes only stock > 0 for guest queries
create or replace view public.guest_available_wines
with (security_invoker = true) as
select * from public.wines
where stock > 0;

-- Public venue catalog view: excludes admin_pin from unauthenticated/guest reads
create or replace view public.public_venues
with (security_invoker = true) as
select
  id,
  name_ko,
  name_en,
  cuisine_type_ko,
  cuisine_type_en,
  location_ko,
  location_en,
  logo_url,
  default_persona_id,
  price_transparency_opt_in,
  recommendation_limit,
  tables,
  registered_dishes,
  created_at
from public.venues;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & LEAST-PRIVILEGE COLUMN ACCESS
-- ============================================================================

alter table public.venues enable row level security;
alter table public.sommelier_personas enable row level security;
alter table public.wines enable row level security;
alter table public.user_taste_profiles enable row level security;
alter table public.pairing_events enable row level security;
alter table public.guest_members enable row level security;
alter table public.tasting_journal_entries enable row level security;

-- Protect admin_pin column on venues from direct anon/authenticated PostgREST reads
revoke select (admin_pin) on public.venues from anon, authenticated;

-- Public read-only catalog tables (writes restricted to service_role)
drop policy if exists "Public read venues catalog" on public.venues;
create policy "Public read venues catalog"
  on public.venues for select
  using (true);

drop policy if exists "Service role manage venues" on public.venues;
create policy "Service role manage venues"
  on public.venues for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Public read sommelier_personas" on public.sommelier_personas;
create policy "Public read sommelier_personas"
  on public.sommelier_personas for select
  using (true);

drop policy if exists "Service role manage sommelier_personas" on public.sommelier_personas;
create policy "Service role manage sommelier_personas"
  on public.sommelier_personas for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Public read wines catalog" on public.wines;
create policy "Public read wines catalog"
  on public.wines for select
  using (true);

drop policy if exists "Service role manage wines" on public.wines;
create policy "Service role manage wines"
  on public.wines for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Private PII & behavioral tables: revoke anon/authenticated access and lock to service_role
revoke all on table public.user_taste_profiles from anon, authenticated;
revoke all on table public.pairing_events from anon, authenticated;
revoke all on table public.guest_members from anon, authenticated;
revoke all on table public.tasting_journal_entries from anon, authenticated;

drop policy if exists "Service role manage user_taste_profiles" on public.user_taste_profiles;
create policy "Service role manage user_taste_profiles"
  on public.user_taste_profiles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role manage pairing_events" on public.pairing_events;
create policy "Service role manage pairing_events"
  on public.pairing_events for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role manage guest_members" on public.guest_members;
create policy "Service role manage guest_members"
  on public.guest_members for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role manage tasting_journal_entries" on public.tasting_journal_entries;
create policy "Service role manage tasting_journal_entries"
  on public.tasting_journal_entries for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

alter default privileges in schema public
revoke all on tables from anon, authenticated;
