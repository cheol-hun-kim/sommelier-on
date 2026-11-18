import { INITIAL_VENUES, INITIAL_WINES, SOMMELIER_PERSONAS } from '../data/seedData';
import type {
  DislikeReasonTag,
  GuestMember,
  PairingSessionStats,
  SommelierPersona,
  TastingJournalEntry,
  UserTasteProfile,
  Venue,
  WineItem,
} from '../types/sommelier';

const STORAGE_KEYS = {
  venues: 'sommon_venues_v6',
  wines: 'sommon_wines_v3',
  tasteProfile: 'sommon_taste_profile_v1',
  stats: 'sommon_stats_v1',
  geminiKey: 'sommon_gemini_api_key',
  activeMember: 'sommon_active_member_v1',
  members: 'sommon_members_v1',
  journal: 'sommon_journal_v1',
};

export const DEFAULT_TASTE_PROFILE: UserTasteProfile = {
  likedWineIds: [],
  dislikedFeedbacks: [],
  affinityVector: {
    bodyDelta: 0,
    acidityDelta: 0,
    tanninDelta: 0,
    sweetnessDelta: 0,
    aromaWeights: {},
    avoidTags: [],
  },
};

export const DEFAULT_STATS: PairingSessionStats = {
  totalSessions: 0,
  orderIntents: 0,
  likes: 0,
  dislikes: 0,
  topRecommendedWineIds: {},
  dislikeTagCounts: {
    too_tannic: 0,
    too_sour: 0,
    too_sweet: 0,
    too_heavy: 0,
    overshadowed: 0,
  },
};

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadVenues(): Venue[] {
  const stored = safeReadJson<Venue[] | null>(STORAGE_KEYS.venues, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    safeWriteJson(STORAGE_KEYS.venues, INITIAL_VENUES);
    return INITIAL_VENUES;
  }
  return stored;
}

export function saveVenues(venues: Venue[]): void {
  safeWriteJson(STORAGE_KEYS.venues, venues);
  void syncToSupabase('venues', venues);
}

export function loadWines(): WineItem[] {
  const stored = safeReadJson<WineItem[] | null>(STORAGE_KEYS.wines, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    safeWriteJson(STORAGE_KEYS.wines, INITIAL_WINES);
    return INITIAL_WINES;
  }
  return stored;
}

export function saveWines(wines: WineItem[]): void {
  safeWriteJson(STORAGE_KEYS.wines, wines);
  void syncToSupabase('wines', wines);
}

export function loadPersonas(): SommelierPersona[] {
  return SOMMELIER_PERSONAS;
}

export function loadTasteProfile(): UserTasteProfile {
  return safeReadJson<UserTasteProfile>(STORAGE_KEYS.tasteProfile, DEFAULT_TASTE_PROFILE);
}

export function saveTasteProfile(profile: UserTasteProfile): void {
  safeWriteJson(STORAGE_KEYS.tasteProfile, profile);
}

export function resetTasteProfile(): UserTasteProfile {
  safeWriteJson(STORAGE_KEYS.tasteProfile, DEFAULT_TASTE_PROFILE);
  return DEFAULT_TASTE_PROFILE;
}

export function loadStats(): PairingSessionStats {
  return safeReadJson<PairingSessionStats>(STORAGE_KEYS.stats, DEFAULT_STATS);
}

export function loadActiveMember(): GuestMember | null {
  return safeReadJson<GuestMember | null>(STORAGE_KEYS.activeMember, null);
}

export function saveActiveMember(member: GuestMember | null): void {
  if (!member) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.activeMember);
    } catch {
      // ignore
    }
    return;
  }
  safeWriteJson(STORAGE_KEYS.activeMember, member);
  const existing = safeReadJson<GuestMember[]>(STORAGE_KEYS.members, []);
  const next = [member, ...existing.filter((m) => m.id !== member.id)];
  safeWriteJson(STORAGE_KEYS.members, next);
}

export function signInOrRegisterMember(
  nickname: string,
  contact: string
): GuestMember {
  const existing = safeReadJson<GuestMember[]>(STORAGE_KEYS.members, []);
  const cleanContact = contact.trim().toLowerCase();
  const found = existing.find(
    (m) => m.contact.trim().toLowerCase() === cleanContact && cleanContact.length > 0
  );
  if (found) {
    const updated = { ...found, nickname: nickname.trim() || found.nickname };
    saveActiveMember(updated);
    return updated;
  }
  const created: GuestMember = {
    id: `member_${Date.now()}`,
    nickname: nickname.trim(),
    contact: contact.trim(),
    createdAt: new Date().toISOString(),
  };
  saveActiveMember(created);
  return created;
}

export function loadJournalEntries(): TastingJournalEntry[] {
  return safeReadJson<TastingJournalEntry[]>(STORAGE_KEYS.journal, []);
}

export function addJournalEntry(entry: TastingJournalEntry): TastingJournalEntry[] {
  const current = loadJournalEntries();
  const next = [entry, ...current].slice(0, 100);
  safeWriteJson(STORAGE_KEYS.journal, next);
  return next;
}

export function recordRecommendationStats(recommendedWineIds: string[]): PairingSessionStats {
  const current = loadStats();
  const nextCounts = { ...current.topRecommendedWineIds };
  for (const id of recommendedWineIds) {
    nextCounts[id] = (nextCounts[id] ?? 0) + 1;
  }
  const updated: PairingSessionStats = {
    ...current,
    totalSessions: current.totalSessions + 1,
    topRecommendedWineIds: nextCounts,
  };
  safeWriteJson(STORAGE_KEYS.stats, updated);
  return updated;
}

export function recordOrderIntentStats(): PairingSessionStats {
  const current = loadStats();
  const updated: PairingSessionStats = {
    ...current,
    orderIntents: current.orderIntents + 1,
  };
  safeWriteJson(STORAGE_KEYS.stats, updated);
  return updated;
}

export function recordFeedbackStats(
  type: 'like' | 'dislike',
  reasons: DislikeReasonTag[] = []
): PairingSessionStats {
  const current = loadStats();
  const dislikeTagCounts = { ...current.dislikeTagCounts };
  for (const r of reasons) {
    dislikeTagCounts[r] = (dislikeTagCounts[r] ?? 0) + 1;
  }
  const updated: PairingSessionStats = {
    ...current,
    likes: type === 'like' ? current.likes + 1 : current.likes,
    dislikes: type === 'dislike' ? current.dislikes + 1 : current.dislikes,
    dislikeTagCounts,
  };
  safeWriteJson(STORAGE_KEYS.stats, updated);
  return updated;
}

export function getGeminiApiKey(): string {
  const envKey = (import.meta.env?.VITE_GEMINI_API_KEY as string | undefined) ?? '';
  if (envKey && envKey.trim().length > 0) return envKey.trim();
  try {
    return window.localStorage.getItem(STORAGE_KEYS.geminiKey)?.trim() ?? '';
  } catch {
    return '';
  }
}

export function saveGeminiApiKey(key: string): void {
  try {
    if (key.trim().length === 0) {
      window.localStorage.removeItem(STORAGE_KEYS.geminiKey);
    } else {
      window.localStorage.setItem(STORAGE_KEYS.geminiKey, key.trim());
    }
  } catch {
    // Ignore storage issues
  }
}

export function parseQrContextFromUrl(venues: Venue[]): {
  venueId: string;
  tableNo: string;
} {
  try {
    const params = new URLSearchParams(window.location.search);
    const paramVenue = params.get('venue_id');
    const paramTable = params.get('table');
    const validVenue = venues.find((v) => v.id === paramVenue) ?? venues[0];
    const tableNo =
      paramTable && paramTable.trim().length > 0
        ? paramTable.trim()
        : validVenue.tables[0] ?? '1';
    return { venueId: validVenue.id, tableNo };
  } catch {
    return { venueId: venues[0]?.id ?? 'pilot_01', tableNo: '1' };
  }
}

export function updateUrlQrContext(venueId: string, tableNo: string): void {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('venue_id', venueId);
    url.searchParams.set('table', tableNo);
    window.history.replaceState({}, '', url.toString());
  } catch {
    // Ignore history error in restricted environments
  }
}

// Optional Supabase REST synchronization when VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are configured
async function syncToSupabase(table: 'venues' | 'wines', payload: unknown): Promise<void> {
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!supabaseUrl || !supabaseKey) return;

  try {
    // Best-effort upsert when Supabase is configured; local state remains instant source of truth
    await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking sync
  }
}
