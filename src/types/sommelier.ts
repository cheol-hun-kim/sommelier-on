export type Language = 'ko' | 'en';
export type ThemeMode = 'ivory' | 'dark';
export type AppMode = 'guest' | 'admin';

export type WineCategory = 'sparkling' | 'white' | 'rose_orange' | 'red' | 'dessert';

export type AromaKey =
  | 'cherry'
  | 'blackcurrant'
  | 'citrus'
  | 'pear_apple'
  | 'white_flower'
  | 'oak_cedar'
  | 'pepper_spice'
  | 'butter_brioche'
  | 'mineral_stone'
  | 'honey'
  | 'leather_earth'
  | 'herbal_mint';

export type AromaTier = 'primary' | 'secondary' | 'tertiary';

export type GlassType = 'flute' | 'white' | 'burgundy' | 'bordeaux' | 'dessert';

export interface WineStructure {
  body: number; // 1..5
  acidity: number; // 1..5
  tannin: number; // 1..5 (0 or 1 for whites/sparkling)
  sweetness: number; // 1..5
  alcohol: number; // 1..5
}

export interface WineAromas {
  primary: AromaKey[];
  secondary: AromaKey[];
  tertiary: AromaKey[];
}

export interface ServingGuide {
  glassType: GlassType;
  tempMin: number;
  tempMax: number;
  decantMinutes: number; // 0 = immediate open
  drinkWindowStart: number;
  drinkWindowEnd: number;
  statusKo: string;
  statusEn: string;
}

export interface WineStorytelling {
  terroirKo: string;
  terroirEn: string;
  vinificationKo: string;
  vinificationEn: string;
}

export interface WineItem {
  id: string;
  venueId: string;
  nameKo: string;
  nameEn: string;
  producer: string;
  vintage: number;
  category: WineCategory;
  varietalsKo: string;
  varietalsEn: string;
  regionKo: string;
  regionEn: string;
  countryCode: string;
  venuePrice: number; // KRW
  marketPrice: number; // KRW
  glassPrice?: number;
  stock: number; // 0 = Sold Out (immediately excluded from recommendations)
  structure: WineStructure;
  aromas: WineAromas;
  serving: ServingGuide;
  storytelling: WineStorytelling;
  pairingAffinities: string[]; // flavor tags: 'steak', 'seafood', 'truffle', 'spicy', 'cream', 'poultry', 'cheese', 'dessert', 'umami', 'charcuterie'
}

export interface SommelierPersona {
  id: string;
  nameKo: string;
  nameEn: string;
  titleKo: string;
  titleEn: string;
  genreKo: string;
  genreEn: string;
  monogram: string;
  yearsExp: number;
  credentialsKo: string;
  credentialsEn: string;
  philosophyKo: string;
  philosophyEn: string;
  signatureRuleKo: string;
  signatureRuleEn: string;
  preferredRegions: string[];
  preferredCategories: Partial<Record<WineCategory, number>>;
  toneStyle: 'classic_french' | 'new_korean' | 'natural_explorer';
}

export interface RegisteredDish {
  id: string;
  nameKo: string;
  nameEn: string;
  category: 'appetizer' | 'seafood' | 'pasta_risotto' | 'meat' | 'korean_umami' | 'dessert';
  flavorTags: string[];
  intensity: number; // 1..5
}

export interface Venue {
  id: string;
  nameKo: string;
  nameEn: string;
  venueType: 'course' | 'alacarte';
  cuisineKo: string;
  cuisineEn: string;
  locationKo: string;
  locationEn: string;
  logoUrl?: string;
  defaultPersonaId: string;
  priceTransparencyOptIn: boolean;
  adminPin: string;
  tables: string[];
  registeredDishes: RegisteredDish[];
  courseMenu?: ParsedMenuDish[];
}

export type BudgetTier = 'under_50' | '50_100' | '100_150' | 'over_150';
export type BudgetScope = 'per_bottle' | 'total';
export type BodyPref = 'any' | 'light' | 'medium' | 'full';
export type SweetnessPref = 'any' | 'dry' | 'off_dry';
export type OccasionType = 'date' | 'celebration' | 'business' | 'casual';

export type MenuMode = 'alacarte' | 'course';
export type CourseBottleCount = 1 | 2 | 3;
export type CoursePairingMode = 'ai_auto' | 'custom_slots';

export interface ParsedMenuDish {
  id: string;
  nameKo: string;
  nameEn: string;
  stageKo?: string;
  stageEn?: string;
  flavorTags: string[];
  intensity: number; // 1..5
  selected: boolean;
}

export interface MenuAnalysisResult {
  sourceLabel: string;
  mode: MenuMode;
  summaryKo: string;
  summaryEn: string;
  dishes: ParsedMenuDish[];
}

export type DislikeReasonTag =
  | 'too_tannic'
  | 'too_sour'
  | 'too_sweet'
  | 'too_heavy'
  | 'overshadowed';

export interface DislikeFeedbackRecord {
  wineId: string;
  wineName: string;
  reasons: DislikeReasonTag[];
  timestamp: string;
}

export interface UserTasteProfile {
  likedWineIds: string[];
  dislikedFeedbacks: DislikeFeedbackRecord[];
  affinityVector: {
    bodyDelta: number;
    acidityDelta: number;
    tanninDelta: number;
    sweetnessDelta: number;
    aromaWeights: Partial<Record<AromaKey, number>>;
    avoidTags: DislikeReasonTag[];
  };
}

export type ValueTier = 'great_value' | 'fair_dining' | null;

export interface SingleWineRecommendation {
  wine: WineItem;
  rank: number;
  matchScore: number;
  valueTier: ValueTier;
  commentaryKo: string;
  commentaryEn: string;
  pairingPointsKo: string[];
  pairingPointsEn: string[];
}

export interface CourseBottleSlotRecommendation {
  slotIndex: number; // 0, 1, 2
  assignedCategory: WineCategory;
  courseSegmentKo: string;
  courseSegmentEn: string;
  assignedDishesKo: string[];
  assignedDishesEn: string[];
  wine: WineItem;
  valueTier: ValueTier;
  bridgeReasonKo: string;
  bridgeReasonEn: string;
}

export interface PairingRecommendationBundle {
  kind: 'single_or_alacarte' | 'course_sequence';
  persona: SommelierPersona;
  menuMode: MenuMode;
  bottleCount: CourseBottleCount;
  coursePairingMode?: CoursePairingMode;
  totalPrice: number;
  overallNoteKo: string;
  overallNoteEn: string;
  singleItems?: SingleWineRecommendation[];
  courseSequence?: CourseBottleSlotRecommendation[];
}

export interface PairingSessionStats {
  totalSessions: number;
  orderIntents: number;
  likes: number;
  dislikes: number;
  topRecommendedWineIds: Record<string, number>;
  dislikeTagCounts: Record<DislikeReasonTag, number>;
}
