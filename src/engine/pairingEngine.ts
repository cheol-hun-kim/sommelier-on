import type {
  AromaKey,
  BodyPref,
  BudgetScope,
  BudgetTier,
  CorkageBottle,
  CorkageDishMatch,
  CourseBottleCount,
  CourseBottleSlotRecommendation,
  CoursePairingMode,
  CourseScenario,
  CourseServeFormat,
  DislikeReasonTag,
  MenuMode,
  OccasionType,
  PairingRecommendationBundle,
  ParsedMenuDish,
  SingleWineRecommendation,
  SommelierPersona,
  SweetnessPref,
  UserTasteProfile,
  ValueTier,
  Venue,
  WineCategory,
  WineItem,
  WineSourceMode,
} from '../types/sommelier';
import { AROMA_LABELS, CATEGORY_LABELS } from '../i18n/translations';

export interface PairingQuery {
  venue: Venue;
  wines: WineItem[];
  sourceWines?: WineItem[];
  sourceMode?: WineSourceMode;
  sourceLabelKo?: string;
  sourceLabelEn?: string;
  persona: SommelierPersona;
  budgetTier: BudgetTier;
  customBudgetWon?: number | null;
  budgetScope: BudgetScope;
  selectedDishes: ParsedMenuDish[];
  customDishText?: string;
  bodyPref: BodyPref;
  sweetnessPref: SweetnessPref;
  occasion: OccasionType;
  menuMode: MenuMode;
  courseServeFormat?: CourseServeFormat;
  courseBottleCount: CourseBottleCount;
  coursePairingMode: CoursePairingMode;
  customSlots: WineCategory[];
  includeExtraGlass?: boolean;
  corkageWine?: CorkageBottle | null;
  excludedWineIds?: string[];
  tasteProfile: UserTasteProfile;
}

const FLAVOR_KEYWORDS: Array<{ keywords: string[]; tags: string[]; intensity: number }> = [
  { keywords: ['스테이크', '안심', '채끝', '등심', '한우', '갈비', '양갈비', 'steak', 'beef', 'rib', 'lamb', 'hanwoo', 'short rib'], tags: ['steak', 'rich', 'umami'], intensity: 5 },
  { keywords: ['트러플', '버섯', '리조또', 'truffle', 'mushroom', 'risotto'], tags: ['truffle', 'cream', 'umami'], intensity: 3 },
  { keywords: ['도미', '광어', '생선', '크루도', '해산물', '랍스터', '전복', 'seafood', 'fish', 'lobster', 'abalone', 'crudo', 'bream', 'oyster'], tags: ['seafood', 'delicate', 'citrus'], intensity: 2 },
  { keywords: ['오리', '닭', '가금', '콩피', 'duck', 'chicken', 'poultry', 'confit'], tags: ['poultry', 'rich'], intensity: 4 },
  { keywords: ['크림', '버터', '치즈', '파스타', '부라타', 'cream', 'butter', 'cheese', 'pasta', 'burrata'], tags: ['cream', 'cheese', 'rich'], intensity: 3 },
  { keywords: ['매콤', '고추', '양념', '매운', '페퍼', 'spicy', 'chili', 'pepper'], tags: ['spicy', 'korean_umami'], intensity: 4 },
  { keywords: ['간장', '된장', '들기름', '육회', '어란', '한식', 'soy', 'perilla', 'tartare', 'korean'], tags: ['korean_umami', 'umami'], intensity: 3 },
  { keywords: ['케이크', '디저트', '타르트', '초콜릿', '달콤', 'dessert', 'cake', 'tart', 'sweet', 'caramel'], tags: ['dessert', 'sweet', 'cheese'], intensity: 3 },
];

export function extractTagsFromFreeText(text: string): { tags: string[]; intensity: number } {
  const lower = text.toLowerCase();
  const tagSet = new Set<string>();
  let maxIntensity = 3;

  for (const rule of FLAVOR_KEYWORDS) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      rule.tags.forEach((t) => tagSet.add(t));
      if (rule.intensity > maxIntensity) maxIntensity = rule.intensity;
    }
  }

  if (tagSet.size === 0) {
    tagSet.add('umami');
  }
  return { tags: Array.from(tagSet), intensity: maxIntensity };
}

function getBudgetWindow(
  tier: BudgetTier,
  scope: BudgetScope,
  bottleCount: number,
  customBudgetWon?: number | null
): { min: number; max: number; ideal: number } {
  const baseMap: Record<BudgetTier, { min: number; max: number; ideal: number }> = {
    under_100: { min: 0, max: 105000, ideal: 78000 },
    '100_200': { min: 98000, max: 205000, ideal: 148000 },
    '200_300': { min: 195000, max: 305000, ideal: 248000 },
    '300_400': { min: 295000, max: 420000, ideal: 348000 },
  };
  const base =
    customBudgetWon && customBudgetWon > 0
      ? {
          min: Math.round(customBudgetWon * 0.45),
          max: Math.round(customBudgetWon * 1.05),
          ideal: Math.round(customBudgetWon * 0.85),
        }
      : baseMap[tier];

  if (scope === 'total' && bottleCount > 1) {
    const effectiveMax = Math.max(45000, Math.round(base.max / bottleCount));
    const effectiveMin = Math.round(base.min / bottleCount);
    const effectiveIdeal = Math.max(40000, Math.round(base.ideal / bottleCount));
    return { min: effectiveMin, max: effectiveMax, ideal: effectiveIdeal };
  }
  return base;
}

export function computeValueTier(wine: WineItem, optIn: boolean): ValueTier {
  if (!optIn || wine.marketPrice <= 0) return null;
  const ratio = wine.venuePrice / wine.marketPrice;
  if (ratio <= 1.5) return 'great_value';
  if (ratio <= 2.0) return 'fair_dining';
  return null;
}

function scoreWineForContext(
  wine: WineItem,
  params: {
    persona: SommelierPersona;
    budgetWindow: { min: number; max: number; ideal: number };
    flavorTags: string[];
    avgIntensity: number;
    bodyPref: BodyPref;
    sweetnessPref: SweetnessPref;
    occasion: OccasionType;
    tasteProfile: UserTasteProfile;
    forcedCategory?: WineCategory;
  }
): number {
  let score = 50;
  const {
    persona,
    budgetWindow,
    flavorTags,
    avgIntensity,
    bodyPref,
    sweetnessPref,
    occasion,
    tasteProfile,
    forcedCategory,
  } = params;

  // 1. Forced Category bonus (used in course slots)
  if (forcedCategory) {
    if (wine.category === forcedCategory) score += 60;
    else score -= 45;
  }

  // 2. Budget Fit (strongly respects ceiling; softly prefers matching floor unless luxury tier)
  if (wine.venuePrice >= budgetWindow.min && wine.venuePrice <= budgetWindow.max) {
    score += 56;
    const dist = Math.abs(wine.venuePrice - budgetWindow.ideal) / Math.max(1, budgetWindow.ideal);
    score += Math.max(0, 14 - dist * 16);
  } else if (wine.venuePrice < budgetWindow.min) {
    const underRatio = (budgetWindow.min - wine.venuePrice) / Math.max(1, budgetWindow.min);
    const floorWeight =
      budgetWindow.min >= 180000 ? 75 : budgetWindow.min >= 140000 ? 55 : 8;
    score -= floorWeight + Math.min(70, underRatio * (budgetWindow.min >= 140000 ? 75 : 20));
  } else {
    const overRatio = (wine.venuePrice - budgetWindow.max) / Math.max(1, budgetWindow.max);
    score -= 105 + Math.min(120, overRatio * 145);
  }

  // 3. Dish Flavor Affinity
  const matchedTags = flavorTags.filter((tag) => wine.pairingAffinities.includes(tag));
  score += matchedTags.length * 14;

  // Intensity balance (don't let delicate dish be crushed or steak be overshadowed)
  const intensityDiff = Math.abs(wine.structure.body - avgIntensity);
  score += Math.max(-10, 12 - intensityDiff * 4);

  if (flavorTags.includes('steak')) {
    if (wine.category === 'red') {
      score += 52;
      if (wine.structure.tannin >= 3 && !tasteProfile.affinityVector.avoidTags.includes('too_tannic')) {
        score += 10;
      }
      if (tasteProfile.affinityVector.avoidTags.includes('too_tannic') && wine.structure.tannin <= 3) {
        score += 42;
      }
    } else if (!flavorTags.includes('seafood')) {
      score -= wine.pairingAffinities.includes('steak') ? 22 : 38;
    }
  }
  if (flavorTags.includes('seafood') && (wine.category === 'white' || wine.category === 'sparkling') && wine.structure.acidity >= 4) {
    score += 12;
  }
  if (flavorTags.includes('truffle') && (wine.aromas.tertiary.includes('leather_earth') || wine.pairingAffinities.includes('truffle'))) {
    score += 10;
  }
  if (flavorTags.includes('spicy') && wine.structure.sweetness >= 2 && wine.structure.tannin <= 2) {
    score += 12;
  }
  if (flavorTags.includes('dessert') && wine.category === 'dessert') {
    score += 22;
  }

  // 4. Guest Palate Preferences
  if (bodyPref === 'light') score += wine.structure.body <= 2 ? 12 : -wine.structure.body * 2;
  if (bodyPref === 'medium') score += wine.structure.body === 3 ? 12 : -Math.abs(wine.structure.body - 3) * 3;
  if (bodyPref === 'full') score += wine.structure.body >= 4 ? 12 : -(4 - wine.structure.body) * 3;

  if (sweetnessPref === 'dry') score += wine.structure.sweetness === 1 ? 10 : -wine.structure.sweetness * 4;
  if (sweetnessPref === 'off_dry') score += wine.structure.sweetness >= 2 ? 14 : -4;

  // 5. Occasion Nuances
  if (occasion === 'celebration' && wine.category === 'sparkling') score += 14;
  if (occasion === 'date' && (wine.category === 'sparkling' || wine.category === 'rose_orange' || wine.structure.tannin <= 3)) {
    score += 7;
  }
  if (occasion === 'business' && (wine.countryCode === 'FR' || wine.structure.body >= 3)) {
    score += 8;
  }

  // 6. Sommelier Persona Signature Lens (strong enough to visibly curate different bottles per persona!)
  const regionMatch = persona.preferredRegions.some((r) =>
    wine.regionEn.toLowerCase().includes(r.toLowerCase())
  );
  if (regionMatch) score += 22;
  score += (persona.preferredCategories[wine.category] ?? 0) * 1.6;

  if (persona.toneStyle === 'classic_french') {
    if (
      wine.countryCode === 'FR' &&
      (wine.regionEn.includes('Pauillac') ||
        wine.regionEn.includes('Burgundy') ||
        wine.regionEn.includes('Meursault') ||
        wine.regionEn.includes('Chablis') ||
        wine.regionEn.includes('Champagne'))
    ) {
      score += 34;
    }
    if (wine.category === 'rose_orange') score -= 12;
  }

  if (persona.toneStyle === 'new_korean') {
    if (wine.pairingAffinities.includes('korean_umami') || wine.varietalsEn.includes('Pinot Noir') || wine.varietalsEn.includes('Riesling') || wine.varietalsEn.includes('Merlot')) {
      score += 36;
    }
    if (wine.structure.tannin <= 3) score += 16;
    if (wine.structure.tannin >= 4 && wine.regionEn.includes('Bordeaux')) score -= 18;
  }

  if (persona.toneStyle === 'natural_explorer') {
    const isIndieOrBio =
      wine.category === 'rose_orange' ||
      wine.regionEn.includes('Loire') ||
      wine.regionEn.includes('Friuli') ||
      wine.producer.includes('Radikon') ||
      wine.producer.includes('Gravner') ||
      wine.producer.includes('Huet') ||
      wine.producer.includes('Pépière') ||
      wine.producer.includes('Agrapart') ||
      wine.producer.includes('Dujac');
    if (isIndieOrBio) score += 44;
    if (wine.category === 'rose_orange') score += 24;
    if (wine.regionEn.includes('Pauillac') || wine.regionEn.includes('Napa')) score -= 16;
  }

  // 7. Cumulative User Taste Profile Learning Loop
  if (tasteProfile.likedWineIds.includes(wine.id)) {
    score += 8;
  }
  const allWineAromas: AromaKey[] = [
    ...wine.aromas.primary,
    ...wine.aromas.secondary,
    ...wine.aromas.tertiary,
  ];
  for (const aroma of allWineAromas) {
    score += (tasteProfile.affinityVector.aromaWeights[aroma] ?? 0) * 3;
  }

  for (const avoid of tasteProfile.affinityVector.avoidTags) {
    if (avoid === 'too_tannic' && wine.structure.tannin >= 4) score -= 125;
    if (avoid === 'too_sour' && wine.structure.acidity >= 5) score -= 115;
    if (avoid === 'too_sweet' && wine.structure.sweetness >= 3) score -= 125;
    if (avoid === 'too_heavy' && (wine.structure.body >= 4 || wine.aromas.secondary.includes('oak_cedar'))) {
      score -= 110;
    }
    if (avoid === 'overshadowed' && wine.structure.body <= 2 && avgIntensity >= 4) {
      score -= 105;
    }
  }

  // Subtle personal delta nudges
  score += tasteProfile.affinityVector.bodyDelta * (wine.structure.body - 3) * 2;
  score -= Math.max(0, -tasteProfile.affinityVector.tanninDelta) * Math.max(0, wine.structure.tannin - 2) * 3;

  return score;
}

function buildTastingTip(
  wine: WineItem,
  dishTags: string[],
  dishNamesKo: string[],
  dishNamesEn: string[]
): { tipKo: string; tipEn: string } {
  const dishKo = dishNamesKo[0] || '요리';
  const dishEn = dishNamesEn[0] || 'the dish';

  if (wine.category === 'dessert' || dishTags.includes('dessert')) {
    return {
      tipKo: `${dishKo} 한 스푼을 먼저 드셔 입안에 부드러운 단맛이 감돌 때 차가운 와인을 한 모금 곁들이시면, 과하지 않고 산뜻하게 마무리됩니다.`,
      tipEn: `Take a spoonful of ${dishEn} first, then follow with a chilled sip so the bright acidity lifts the sweetness cleanly.`,
    };
  }
  if (wine.category === 'red' && (dishTags.includes('steak') || dishTags.includes('rich'))) {
    return {
      tipKo: `${dishKo} 한 점을 먼저 씹어 고소한 육즙이 입안에 돌 때 와인을 마셔보세요. 와인의 구조감이 기름기를 감싸며 고기 풍미가 훨씬 깊어집니다.`,
      tipEn: `Chew a bite of ${dishEn} first so the savory juices coat your palate, then sip — the wine’s structure melts into the marbling seamlessly.`,
    };
  }
  if (wine.category === 'sparkling' || wine.category === 'white') {
    if (dishTags.includes('truffle') || dishTags.includes('cream')) {
      return {
        tipKo: `와인을 아주 작은 모금 먼저 머금어 입안을 적신 뒤 ${dishKo}를 드셔보세요. 버터·트러플의 고소한 향이 입안에서 훨씬 입체적으로 피어납니다.`,
        tipEn: `Take a small sip first to awaken your palate, then taste ${dishEn} — creamy truffle and orchard aromas expand dramatically together.`,
      };
    }
    return {
      tipKo: `${dishKo}와 소스를 먼저 한 입 드신 뒤 곧바로 차가운 와인을 마시면, 비린내나 느끼함은 싹 가시고 재료 본연의 감칠맛만 깨끗하게 남습니다.`,
      tipEn: `Enjoy a bite of ${dishEn} first and follow right away with a cool sip — crisp freshness clears the palate and highlights pure umami.`,
    };
  }
  return {
    tipKo: `음식을 한 점 드신 직후 와인을 천천히 머금어 보세요. 허브와 과실의 은은한 여운이 입안의 감칠맛을 기분 좋게 이어줍니다.`,
    tipEn: `Take a bite first and let a slow sip follow — subtle fruit and savory herbs extend the finish gracefully.`,
  };
}

function buildPersonaCommentary(
  wine: WineItem,
  persona: SommelierPersona,
  dishNamesKo: string[],
  dishNamesEn: string[],
  occasion: OccasionType,
  tasteProfile: UserTasteProfile,
  dishTags: string[] = []
): {
  ko: string;
  en: string;
  expertKo: string;
  expertEn: string;
  tipKo: string;
  tipEn: string;
  pointsKo: string[];
  pointsEn: string[];
} {
  const dishSummaryKo = dishNamesKo.slice(0, 2).join(', ') || '오늘 주문하신 요리';
  const dishSummaryEn = dishNamesEn.slice(0, 2).join(', ') || 'tonight’s dishes';
  const topAromaKey = wine.aromas.primary[0] ?? 'citrus';
  const secAromaKey = wine.aromas.secondary[0] ?? wine.aromas.tertiary[0] ?? 'mineral_stone';
  const topAromaKo = AROMA_LABELS[topAromaKey].ko;
  const topAromaEn = AROMA_LABELS[topAromaKey].en;
  const secAromaKo = AROMA_LABELS[secAromaKey].ko;
  const secAromaEn = AROMA_LABELS[secAromaKey].en;

  const hasAversionRelief = tasteProfile.affinityVector.avoidTags.length > 0;

  let ko = '';
  let en = '';
  let expertKo = '';
  let expertEn = '';

  const acidityDescKo =
    wine.structure.acidity >= 4
      ? `날카롭고 맑은 직선적 산도(${wine.structure.acidity}/5)`
      : `원만하고 균형 잡힌 산도(${wine.structure.acidity}/5)`;
  const tanninDescKo =
    wine.structure.tannin >= 4
      ? `밀도 높은 벨벳 타닌(${wine.structure.tannin}/5)`
      : wine.structure.tannin >= 2
        ? `입안에 부드럽게 녹아드는 매끄러운 타닌(${wine.structure.tannin}/5)`
        : '타닌 부담 없이 깨끗한 질감';
  const decantNoteKo =
    wine.serving.decantMinutes > 0
      ? `글라스에 따른 뒤 약 ${wine.serving.decantMinutes}분 전후로 산소와 만나면 갇혀 있던 ${secAromaKo} 결이 활짝 피어나며 입안의 질감이 한결 부드러워집니다.`
      : `별도의 긴 디캔팅 없이 첫 잔부터 ${topAromaKo} 아로마가 선명히 열리며, ${wine.serving.tempMin}~${wine.serving.tempMax}℃에서 한 모금씩 온도가 올라갈수록 ${secAromaKo} 여운이 깊게 이어집니다.`;
  const pairingMechKo =
    wine.category === 'red' && (dishTags.includes('steak') || dishTags.includes('rich'))
      ? `고기 근섬유와 마블링의 지방이 와인의 타닌 및 폴리페놀과 구강 내에서 결합하면서 떫은 수렴감은 즉시 누그러지고, 반대로 고기의 기름기는 산도와 구조감이 깔끔하게 절단해 주어 다음 한 점의 감칠맛을 극대화합니다.`
      : wine.category === 'sparkling'
        ? `수백만 개의 미세 기포와 높은 산도가 혀 위의 유분과 크림·버터 막을 물리적으로 씻어내는 "팔레트 클렌징" 효과를 발휘해, ${dishSummaryKo}의 섬세한 단맛과 풍미를 첫 입처럼 또렷하게 되살립니다.`
        : `와인의 산도·바디감(${wine.structure.body}/5) 곡선이 ${dishSummaryKo} 소스의 농도와 정확히 평형을 이루어, 어느 한쪽이 맛을 덮어버리지 않고 재료 본연의 아미노산 감칠맛과 ${topAromaKo} 향이 겹쳐지는 상승작용을 빚어냅니다.`;

  if (persona.toneStyle === 'classic_french') {
    ko = `어렵게 생각하실 필요 없이 ${dishSummaryKo}의 맛을 제일 기분 좋게 살려주는 편한 와인이에요. 상큼한 ${topAromaKo} 향이 입안을 깔끔하게 씻어주어서, 마지막 한 입까지 전혀 느끼하지 않고 맛있게 즐기실 수 있습니다.`;
    en = `An easygoing, bright match for ${dishSummaryEn}—fresh ${topAromaEn} notes keep every bite light and delicious right to the end.`;
    expertKo = `[맛과 질감 프로파일] ${acidityDescKo}와 ${tanninDescKo}, 그리고 바디감(${wine.structure.body}/5)이 정밀한 삼각형 구도를 그립니다. 혀끝에 닿는 첫인상은 ${topAromaKo}의 선명한 과실·시트러스 결로 시작해, 중반부로 넘어가면서 밀도 높은 ${secAromaKo} 텍스처가 팔레트를 촘촘히 채우고 긴 여운을 남깁니다.\n\n[음식과의 궁합 메커니즘] ${pairingMechKo}\n\n[시음 호흡 & 온도 변화] ${decantNoteKo}`;
    expertEn = `[Palate Structure & Texture] Linear acidity (${wine.structure.acidity}/5), poise in phenolic grip (tannin ${wine.structure.tannin}/5), and medium-to-rich weight (body ${wine.structure.body}/5) open with crisp ${topAromaEn} before folding into layered ${secAromaEn} length.\n\n[Culinary Pairing Mechanics] Perfectly counterbalances lipid richness and sauce viscosity in ${dishSummaryEn}, cleansing the mid-palate cleanly so savory umami resonates without fatigue.\n\n[Glass Evolution] Most expressive poured at ${wine.serving.tempMin}–${wine.serving.tempMax}°C; progressive aeration unlocks deeper secondary harmony.`;
  } else if (persona.toneStyle === 'new_korean') {
    ko = `${dishSummaryKo}처럼 감칠맛이 짙은 요리랑 정말 잘 어울리는 부드러운 스타일이에요. 첫 모금에 포근한 ${topAromaKo} 향이 퍼지고 목 넘김이 순해서, 와인을 자주 안 드시는 분도 첫 잔부터 부담 없이 좋아하실 거예요.`;
    en = `Warm and silky beside savory ${dishSummaryEn}, with gentle ${topAromaEn} fruit and a smooth finish anyone can enjoy immediately.`;
    expertKo = `[미각 밸런스 & 질감] 거친 각을 깎아낸 듯 매끄러운 질감(${tanninDescKo})과 포근한 바디감(${wine.structure.body}/5) 위에 ${acidityDescKo}가 기둥을 세워 줍니다. ${topAromaKo}의 화사한 첫 향 뒤로 ${secAromaKo}의 고소하고 둥근 여운이 길게 남아 미각에 편안한 리듬을 만듭니다.\n\n[음식과의 감칠맛 시너지] ${pairingMechKo} 특히 숙성·구이·발효 소스에서 우러나는 깊은 감칠맛과 금속성 잡미 없이 매끄럽게 결속됩니다.\n\n[시음 호흡 & 온도 가이드] ${decantNoteKo}`;
    expertEn = `[Palate & Mouthfeel] Supple phenolic texture (tannin ${wine.structure.tannin}/5, body ${wine.structure.body}/5) carries radiant ${topAromaEn} aromatics layered over creamy ${secAromaEn} warmth.\n\n[Umami & Sauce Harmony] Harmonizes effortlessly with caramelized reductions, fermented umami, and slow-cooked flavors in ${dishSummaryEn} with zero astringent clash.\n\n[Service Pace] Ideal between ${wine.serving.tempMin}–${wine.serving.tempMax}°C as gentle warmth lifts mid-palate silkiness.`;
  } else {
    ko = `${occasion === 'celebration' ? '오늘 기분 좋은 축하 자리에' : '식탁 분위기를 산뜻하게 띄우고 싶어'} 골라본 개성 있는 와인이에요. 싱그러운 ${topAromaKo}와 고소한 ${secAromaKo} 향이 살아있어 ${dishSummaryKo}와 한 잔 곁들이시면 대화가 훨씬 즐거워집니다.`;
    en = `A lively, approachable bottle for ${dishSummaryEn}, bursting with fresh ${topAromaEn} and ${secAromaEn} charm to spark the table.`;
    expertKo = `[맛의 생동감 & 아로마 구조] 인위적으로 다듬기보다 살아있는 ${acidityDescKo}와 혀끝을 스치는 짭짤한 미네랄 텍스처가 압권입니다. 한 모금 머금자마자 생동감 넘치는 ${topAromaKo}와 은은한 ${secAromaKo}가 입안 가득 입체적으로 퍼지며 지루할 틈 없는 에너지를 전달합니다.\n\n[음식과의 풍미 대비] ${pairingMechKo}\n\n[글라스 호흡 변화] ${decantNoteKo}`;
    expertEn = `[Palate Vitality & Tension] Vivid acidity (${wine.structure.acidity}/5) and energetic mineral grip drive bright ${topAromaEn} fruit beside nuanced ${secAromaEn} complexity without heavy oak weight.\n\n[Culinary Contrast] Cuts cleanly across rich textures in ${dishSummaryEn}, lifting aromatics on the finish.\n\n[Evolution in Glass] Pour at ${wine.serving.tempMin}–${wine.serving.tempMax}°C; subtle aeration sharpens its vibrant savory edge.`;
  }

  if (hasAversionRelief) {
    ko += ' 남겨주신 취향 메모를 반영해 부담스러운 자극 없이 편하게 넘어가도록 세심하게 골랐습니다.';
    en += ' Tailored gently to your saved Taste Note sensitivities for smooth, unforced balance.';
    expertKo += ' 저장된 취향 프로필의 기피 속성을 감안해 구조적 자극을 완화했습니다.';
    expertEn += ' Calibrated against your saved palate sensitivity thresholds.';
  }

  const { tipKo, tipEn } = buildTastingTip(wine, dishTags, dishNamesKo, dishNamesEn);

  const pointsKo = [
    `${wine.structure.acidity >= 4 ? '생동감 있는 산도가 입안을 개운하게 정돈' : '둥글고 부드러운 질감이 요리 풍미를 감싸줌'}`,
    `${topAromaKo} · ${secAromaKo} 아로마 조화`,
    `${wine.serving.tempMin}~${wine.serving.tempMax}℃ 서빙 시 가장 섬세한 표현력`,
  ];

  const pointsEn = [
    `${wine.structure.acidity >= 4 ? 'Crisp acidity refreshes the palate cleanly' : 'Supple texture cushions rich savory flavors'}`,
    `Harmonic lift of ${topAromaEn} and ${secAromaEn}`,
    `Most expressive served at ${wine.serving.tempMin}–${wine.serving.tempMax}°C`,
  ];

  return { ko, en, expertKo, expertEn, tipKo, tipEn, pointsKo, pointsEn };
}

function partitionDishesIntoSegments(
  dishes: ParsedMenuDish[],
  count: CourseBottleCount
): ParsedMenuDish[][] {
  if (dishes.length === 0) return Array.from({ length: count }, () => []);
  if (count === 1) return [dishes];
  if (count === 2) {
    const mid = Math.max(1, Math.ceil(dishes.length / 2));
    return [dishes.slice(0, mid), dishes.slice(mid).length > 0 ? dishes.slice(mid) : [dishes[dishes.length - 1]]];
  }
  // 3 or 4 segments
  const result: ParsedMenuDish[][] = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor((i * dishes.length) / count);
    const end = Math.max(start + 1, Math.floor(((i + 1) * dishes.length) / count));
    result.push(dishes.slice(start, end));
  }
  return result;
}

export function generatePairingRecommendation(query: PairingQuery): PairingRecommendationBundle {
  const {
    venue,
    wines,
    persona,
    budgetTier,
    customBudgetWon,
    budgetScope,
    selectedDishes,
    customDishText,
    bodyPref,
    sweetnessPref,
    occasion,
    menuMode,
    courseServeFormat = 'bottle',
    courseBottleCount,
    coursePairingMode,
    customSlots,
    includeExtraGlass = false,
    corkageWine = null,
    excludedWineIds = [],
    tasteProfile,
  } = query;

  // STRICT SYSTEMIC INVARIANT: Only wines in THIS venue with stock > 0 are eligible!
  const allInStockVenueWines = wines.filter((w) => w.venueId === venue.id && w.stock > 0);
  const activePool =
    query.sourceWines && query.sourceWines.length > 0
      ? query.sourceWines.filter((w) => w.stock > 0)
      : allInStockVenueWines;
  const nonExcluded = activePool.filter((w) => !excludedWineIds.includes(w.id));
  const eligiblePool = nonExcluded.length > 0 ? nonExcluded : activePool;

  // Merge selected dishes + optional free text dish
  const workingDishes: ParsedMenuDish[] = [...selectedDishes];
  if (customDishText && customDishText.trim().length > 0) {
    const parsed = extractTagsFromFreeText(customDishText.trim());
    workingDishes.push({
      id: 'custom_dish_input',
      nameKo: customDishText.trim(),
      nameEn: customDishText.trim(),
      flavorTags: parsed.tags,
      intensity: parsed.intensity,
      selected: true,
    });
  }

  const allTags = Array.from(new Set(workingDishes.flatMap((d) => d.flavorTags)));
  const avgIntensity =
    workingDishes.length > 0
      ? workingDishes.reduce((sum, d) => sum + d.intensity, 0) / workingDishes.length
      : 3;

  const isGlassCourse = menuMode === 'course' && courseServeFormat === 'glass';
  const isMultiBottleCourse =
    menuMode === 'course' && (isGlassCourse || courseBottleCount > 1);
  const effectiveBottleCount: CourseBottleCount = isGlassCourse
    ? 3
    : isMultiBottleCourse
      ? courseBottleCount
      : 1;
  // When a corkage bottle occupies 1 slot in a multi-bottle course, split total budget across the remaining restaurant bottles!
  const restaurantBottleCount =
    isMultiBottleCourse && corkageWine ? Math.max(1, effectiveBottleCount - 1) : effectiveBottleCount;
  const budgetWindow = getBudgetWindow(
    budgetTier,
    budgetScope,
    restaurantBottleCount,
    customBudgetWon
  );

  const pickExtraGlass = (excludedIds: Set<string>, usedCats: WineCategory[]): SingleWineRecommendation | undefined => {
    if (!includeExtraGlass || isGlassCourse) return undefined;
    const desiredCat: WineCategory = !usedCats.includes('sparkling')
      ? 'sparkling'
      : !usedCats.includes('dessert')
        ? 'dessert'
        : 'white';
    const glassPool = eligiblePool.filter((w) => !excludedIds.has(w.id));
    const scoredGlass = (glassPool.length > 0 ? glassPool : eligiblePool)
      .map((wine) => ({
        wine,
        score:
          scoreWineForContext(wine, {
            persona,
            budgetWindow: { min: 0, max: 140000, ideal: 70000 },
            flavorTags: desiredCat === 'dessert' ? ['dessert', 'sweet'] : ['seafood', 'delicate'],
            avgIntensity: desiredCat === 'dessert' ? 3 : 2,
            bodyPref,
            sweetnessPref,
            occasion,
            tasteProfile,
            forcedCategory: desiredCat,
          }) + (wine.glassPrice ? 18 : 0),
      }))
      .sort((a, b) => b.score - a.score);
    const top = scoredGlass[0]?.wine;
    if (!top) return undefined;
    return {
      wine: top,
      rank: 1,
      matchScore: 95,
      valueTier: computeValueTier(top, venue.priceTransparencyOptIn),
      commentaryKo:
        desiredCat === 'sparkling'
          ? `메인 바틀을 여시기 전, 입맛을 산뜻하게 열어줄 식전 글라스 한 잔으로 ${top.nameKo}를 함께 곁들이시면 코스의 시작이 훨씬 경쾌해집니다.`
          : `바틀 페어링 후 식사의 여운을 부드럽게 마무리할 글라스 와인으로 ${top.nameKo}를 제안드립니다.`,
      commentaryEn:
        desiredCat === 'sparkling'
          ? `Before opening your main bottle, a crisp glass of ${top.nameEn} awakens the palate for the opening bites.`
          : `To close your bottle progression gracefully, enjoy a finishing glass of ${top.nameEn}.`,
      expertCommentaryKo:
        desiredCat === 'sparkling'
          ? `아페리티프 단계에서 ${top.regionKo} 특유의 미네랄 산미로 미각 수용체를 환기하는 글라스 페어링입니다.`
          : `디제스티프 단계에서 복합적인 잔당과 산도의 균형으로 코스 전체의 여운을 정돈하는 글라스입니다.`,
      expertCommentaryEn:
        desiredCat === 'sparkling'
          ? `An aperitif glass from ${top.regionEn} whose mineral acidity primes the palate for the opening course.`
          : `A digestif pour balancing residual sweetness and fresh acidity to close the progression.`,
      tastingTipKo:
        desiredCat === 'sparkling'
          ? '첫 요리가 나오기 전 차가운 상태로 한 모금 먼저 드시면 입안이 상쾌하게 깨어납니다.'
          : '디저트를 한 스푼 먼저 드신 뒤 달콤한 와인을 곁들여 보세요.',
      tastingTipEn:
        desiredCat === 'sparkling'
          ? 'Take a chilled sip before the first dish arrives to awaken your palate.'
          : 'Take a bite of dessert first, then follow with a cool sip.',
      pairingPointsKo: [
        top.glassPrice ? `글라스 가능 (${top.glassPrice.toLocaleString('ko-KR')}원)` : '업장 잔 와인 문의 가능',
      ],
      pairingPointsEn: [
        top.glassPrice ? `By the glass (₩${top.glassPrice.toLocaleString('ko-KR')})` : 'Ask your host for glass pour',
      ],
    };
  };

  if (!isMultiBottleCourse) {
    const limit = Math.min(4, Math.max(1, venue.recommendationLimit || 3));
    const effectiveBudgetWindow =
      query.sourceMode === 'my_cellar'
        ? { min: 0, max: 100000000, ideal: 250000 }
        : budgetWindow;
    const scored = eligiblePool
      .map((wine) => {
        let s = scoreWineForContext(wine, {
          persona,
          budgetWindow: effectiveBudgetWindow,
          flavorTags: allTags,
          avgIntensity,
          bodyPref,
          sweetnessPref,
          occasion,
          tasteProfile,
        });
        // If guest brought a corkage bottle, favor complementary contrasting styles!
        if (corkageWine) {
          if (wine.category === corkageWine.category) s -= 26;
          else s += 20;
        }
        return { wine, score: s };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const dishNamesKo = workingDishes.map((d) => d.nameKo);
    const dishNamesEn = workingDishes.map((d) => d.nameEn);

    const singleItems: SingleWineRecommendation[] = scored.map((entry, idx) => {
      const commentary = buildPersonaCommentary(
        entry.wine,
        persona,
        dishNamesKo,
        dishNamesEn,
        occasion,
        tasteProfile,
        allTags
      );
      return {
        wine: entry.wine,
        rank: idx + 1,
        matchScore: Math.min(99, Math.max(72, Math.round(entry.score))),
        valueTier: computeValueTier(entry.wine, venue.priceTransparencyOptIn),
        commentaryKo: commentary.ko,
        commentaryEn: commentary.en,
        expertCommentaryKo: commentary.expertKo,
        expertCommentaryEn: commentary.expertEn,
        tastingTipKo: commentary.tipKo,
        tastingTipEn: commentary.tipEn,
        pairingPointsKo: commentary.pointsKo,
        pairingPointsEn: commentary.pointsEn,
      };
    });

    const overallNoteKo =
      corkageWine
        ? `${persona.nameKo}가 가져오신 [${corkageWine.name}]과 자연스럽게 어울리도록 편하고 맛있게 즐기기 좋은 와인을 추렸습니다.`
        : menuMode === 'course'
          ? `${persona.nameKo}가 전채부터 메인까지 한 병으로 편하고 균형 있게 즐기실 수 있는 와인을 골랐습니다.`
          : `${persona.nameKo}가 고르신 요리의 맛에 맞춰 부담 없이 즐기시기 좋은 와인을 선별했습니다.`;
    const overallNoteEn =
      menuMode === 'course'
        ? `Curated by ${persona.nameEn}: versatile, easy-to-enjoy selections that carry every course comfortably.`
        : `Curated by ${persona.nameEn}: approachable in-stock picks tuned to the dishes on your table.`;
    const expertOverallNoteKo =
      corkageWine
        ? `[소믈리에 큐레이션] 지참하신 [${corkageWine.name}]의 산도·바디 커브와 대비·보완 구조를 이루는 셀러 보틀을 예산 범위 내에서 선별했습니다.`
        : menuMode === 'course'
          ? `[구조·페어링 분석] 코스 전반의 풍미 강도 상승 곡선과 선택 예산 대역을 동시에 충족하는 단일 바틀 포트폴리오입니다.`
          : `[미각·예산 정밀 매칭] 선택 요리의 핵심 향미 태그와 단백질/지방 밀도에 대응하는 최적 구조감을 설정 예산 내에서 선별했습니다.`;
    const expertOverallNoteEn =
      menuMode === 'course'
        ? `[Structural Curation] Single-bottle candidates calibrated to rising course intensity within your target budget window.`
        : `[Precision Pairing] In-stock cuvées matched to dish lipid density, aromatic bridges, and selected price tier.`;

    return {
      kind: 'single_or_alacarte',
      sourceMode: query.sourceMode ?? 'venue_cellar',
      sourceLabelKo: query.sourceLabelKo,
      sourceLabelEn: query.sourceLabelEn,
      persona,
      menuMode,
      serveFormat: courseServeFormat,
      bottleCount: 1,
      totalPrice: singleItems[0]?.wine.venuePrice ?? 0,
      overallNoteKo,
      overallNoteEn,
      expertOverallNoteKo,
      expertOverallNoteEn,
      singleItems,
      extraGlass: pickExtraGlass(
        new Set(singleItems[0] ? [singleItems[0].wine.id] : []),
        singleItems[0] ? [singleItems[0].wine.category] : []
      ),
    };
  }

  // MULTI-BOTTLE (OR 3-GLASS) COURSE MODE WITH BUDGET/QUALITY FOCUS SCENARIOS
  const segments = partitionDishesIntoSegments(workingDishes, effectiveBottleCount);

  const chooseFoodMatchedSequence = (): WineCategory[] => {
    if (isGlassCourse) return ['sparkling', 'white', 'red'];
    if (coursePairingMode === 'custom_slots') return customSlots.slice(0, effectiveBottleCount);

    const segHas = (segIdx: number, tag: string) =>
      segments[segIdx]?.some((d) => d.flavorTags.includes(tag)) ?? false;

    if (effectiveBottleCount === 2) {
      const firstIsSeafood = segHas(0, 'seafood') || segHas(0, 'delicate');
      const secondIsMeat = segHas(1, 'steak') || segHas(1, 'rich');
      if (persona.toneStyle === 'natural_explorer' && eligiblePool.some((w) => w.category === 'rose_orange')) {
        return secondIsMeat ? ['rose_orange', 'red'] : ['sparkling', 'rose_orange'];
      }
      if (firstIsSeafood && secondIsMeat) return ['sparkling', 'red'];
      if (secondIsMeat) return ['white', 'red'];
      return ['sparkling', 'white'];
    }
    if (effectiveBottleCount === 4) {
      return persona.toneStyle === 'natural_explorer' && eligiblePool.some((w) => w.category === 'rose_orange')
        ? ['sparkling', 'white', 'rose_orange', 'red']
        : ['sparkling', 'white', 'red', 'dessert'];
    }
    const finaleIsDessert = segHas(2, 'dessert') && !segHas(2, 'steak');
    if (persona.toneStyle === 'natural_explorer' && eligiblePool.some((w) => w.category === 'rose_orange')) {
      return ['sparkling', 'rose_orange', 'red'];
    }
    return finaleIsDessert ? ['sparkling', 'red', 'dessert'] : ['sparkling', 'white', 'red'];
  };

  const baseCategories = chooseFoodMatchedSequence();

  const buildSequenceWithQualityFocus = (
    targetCats: WineCategory[],
    focusSlotIdx: number | null // which bottle slot receives the highest budget/quality weight; null = balanced
  ): { sequence: CourseBottleSlotRecommendation[]; usedFallbackCategory: boolean } => {
    const usedIds = new Set<string>();
    const sequence: CourseBottleSlotRecommendation[] = [];
    let usedFallbackCategory = false;

    const categoryOccurrences: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    targetCats.forEach((cat) => {
      categoryTotals[cat] = (categoryTotals[cat] ?? 0) + 1;
    });

    const corkageSlotIdx = corkageWine
      ? corkageWine.slotPosition === 'early'
        ? 0
        : corkageWine.slotPosition === 'middle'
          ? Math.min(1, effectiveBottleCount - 1)
          : effectiveBottleCount - 1
      : -1;

    for (let i = 0; i < effectiveBottleCount; i++) {
      const segDishes = segments[i] ?? workingDishes;
      const segDishesKo = segDishes.map((d) => d.nameKo);
      const segDishesEn = segDishes.map((d) => d.nameEn);
      const segLabelsKo =
        effectiveBottleCount === 2
          ? ['전반부 코스 (전채 · 에피타이저)', '후반부 코스 (메인 · 마무리)']
          : effectiveBottleCount === 4
            ? ['1구간 (아뮤즈 · 전채)', '2구간 (해산물 · 온요리)', '3구간 (육류 메인)', '4구간 (디저트 · 마무리)']
            : ['전반부 코스 (아뮤즈 · 전채)', '중반부 코스 (온요리 · 중간요리)', '후반부 코스 (메인 · 피날레)'];
      const segLabelsEn =
        effectiveBottleCount === 2
          ? ['Opening Arc (Starters & Light Plates)', 'Closing Arc (Main & Finale)']
          : effectiveBottleCount === 4
            ? ['Act I (Amuse & Starter)', 'Act II (Seafood & Warm)', 'Act III (Main Course)', 'Act IV (Dessert & Finale)']
            : ['Opening Arc (Amuse & Starter)', 'Middle Arc (Warm & Mid Course)', 'Climax Arc (Main & Finale)'];

      if (corkageWine && i === corkageSlotIdx) {
        const corkageVirtualWine: WineItem = {
          id: 'corkage_byob',
          venueId: venue.id,
          nameKo: corkageWine.name,
          nameEn: corkageWine.name,
          producer: 'BYOB',
          vintage: new Date().getFullYear(),
          category: corkageWine.category,
          varietalsKo: '지참 와인 (콜키지)',
          varietalsEn: 'Guest Corkage Bottle',
          regionKo: '고객 지참',
          regionEn: 'Guest Cellar',
          countryCode: 'FR',
          venuePrice: 0,
          marketPrice: 0,
          stock: 1,
          structure: { body: corkageWine.body, acidity: 3, tannin: corkageWine.category === 'red' ? 3 : 1, sweetness: 1, alcohol: 3 },
          aromas: { primary: ['cherry', 'citrus'], secondary: ['oak_cedar'], tertiary: ['mineral_stone'] },
          serving: {
            glassType: corkageWine.category === 'sparkling' ? 'flute' : corkageWine.category === 'red' ? 'bordeaux' : 'white',
            tempMin: corkageWine.category === 'red' ? 16 : 9,
            tempMax: corkageWine.category === 'red' ? 18 : 11,
            decantMinutes: corkageWine.category === 'red' ? 30 : 0,
            drinkWindowStart: 2024,
            drinkWindowEnd: 2030,
            statusKo: '고객 지참 콜키지',
            statusEn: 'Guest Corkage',
          },
          storytelling: {
            terroirKo: '고객님이 직접 준비해 오신 소중한 와인입니다.',
            terroirEn: 'Brought personally by the guest.',
            vinificationKo: '코스의 흐름에 맞춰 서빙 온도만 확인해 주세요.',
            vinificationEn: 'Confirm serving temperature with your host.',
            heavenClimateKo: '고객님이 직접 지참하신 와인입니다.',
            heavenClimateEn: 'Guest-provided corkage bottle.',
            earthSoilKo: '지참하신 와인의 개성을 중심으로 앞뒤 코스를 연결했습니다.',
            earthSoilEn: 'Remaining cellar bottles were curated around this corkage bottle.',
            humanPhilosophyKo: '가져오신 와인과 업장 와인이 자연스럽게 이어지도록 배치했습니다.',
            humanPhilosophyEn: 'Positioned to harmonize seamlessly with the restaurant cellar.',
            wineryLocation: { lat: 47.0247, lng: 4.8386, placeLabelKo: '고객 지참 와인', placeLabelEn: 'Guest Corkage', earthQuery: corkageWine.name },
          },
          pairingAffinities: ['steak', 'umami'],
        };
        sequence.push({
          slotIndex: i,
          assignedCategory: corkageWine.category,
          courseSegmentKo: segLabelsKo[i] ?? `코스 ${i + 1}구간`,
          courseSegmentEn: segLabelsEn[i] ?? `Stage ${i + 1}`,
          assignedDishesKo: segDishesKo,
          assignedDishesEn: segDishesEn,
          wine: corkageVirtualWine,
          isCorkage: true,
          valueTier: null,
          bridgeReasonKo: `직접 가져오신 [${corkageWine.name}]을 이 구간에 배치하고, 앞뒤 코스에 맞는 나머지 바틀을 업장 셀러에서 골랐습니다.`,
          bridgeReasonEn: `Your corkage bottle [${corkageWine.name}] anchors this course stage while remaining slots are paired from the cellar.`,
          expertBridgeReasonKo: `지참하신 [${corkageWine.name}]의 바디와 주종(${CATEGORY_LABELS[corkageWine.category].shortKo})을 축으로 앞뒤 바틀의 산도와 질감을 맞췄습니다.`,
          expertBridgeReasonEn: `Anchored around your [${corkageWine.name}] (${CATEGORY_LABELS[corkageWine.category].shortEn}) to balance acidity and weight across adjacent courses.`,
          tastingTipKo: '지참하신 와인은 서빙 30분 전에 미리 오픈해 상태를 확인하시는 것을 권해드립니다.',
          tastingTipEn: 'Consider opening your corkage bottle 30 minutes ahead to check its condition.',
        });
        continue;
      }

      const requestedCat = targetCats[i] ?? 'white';
      const occIndex = categoryOccurrences[requestedCat] ?? 0;
      categoryOccurrences[requestedCat] = occIndex + 1;
      const totalInCat = categoryTotals[requestedCat] ?? 1;

      const segTags = Array.from(new Set(segDishes.flatMap((d) => d.flavorTags)));
      const segAvgIntensity =
        segDishes.length > 0
          ? segDishes.reduce((s, d) => s + d.intensity, 0) / segDishes.length
          : i === 0
            ? 2
            : i === 1
              ? 3
              : 4;

      let candidates = eligiblePool.filter(
        (w) => w.category === requestedCat && !usedIds.has(w.id)
      );
      if (candidates.length === 0) {
        usedFallbackCategory = true;
        candidates = eligiblePool.filter((w) => !usedIds.has(w.id));
      }
      if (candidates.length === 0) {
        candidates = eligiblePool;
      }

      let chosen: WineItem | undefined;
      const remainingSlotsInCat = totalInCat - occIndex;
      if (totalInCat > 1 && candidates.length > 1) {
        const byWeight = [...candidates].sort(
          (a, b) =>
            a.structure.body * 10 + a.venuePrice / 50000 -
            (b.structure.body * 10 + b.venuePrice / 50000)
        );
        const maxValidIdx = Math.max(0, byWeight.length - remainingSlotsInCat);
        const ratio = totalInCat <= 1 ? 0 : occIndex / (totalInCat - 1);
        const targetPos =
          remainingSlotsInCat === 1
            ? byWeight.length - 1
            : Math.min(maxValidIdx, Math.round(ratio * maxValidIdx));
        chosen = byWeight[targetPos];
      } else {
        // Budget-aware Quality Allocation Focus (respects selected budget ceiling while shifting relative investment)
        const slotBudgetWindow =
          focusSlotIdx === null
            ? budgetWindow
            : i === focusSlotIdx
              ? {
                  min: Math.round(budgetWindow.ideal * 0.9),
                  max: Math.round(budgetWindow.max * 1.15),
                  ideal: budgetWindow.max,
                }
              : {
                  min: Math.round(budgetWindow.min * 0.75),
                  max: Math.max(50000, budgetWindow.ideal),
                  ideal: Math.max(40000, Math.round((budgetWindow.min + budgetWindow.ideal) / 2)),
                };

        const scoredSlot = candidates
          .map((wine) => {
            const s = scoreWineForContext(wine, {
              persona,
              budgetWindow: slotBudgetWindow,
              flavorTags: segTags,
              avgIntensity: segAvgIntensity,
              bodyPref,
              sweetnessPref,
              occasion,
              tasteProfile,
              forcedCategory: requestedCat,
            });
            return { wine, score: s };
          })
          .sort((a, b) => b.score - a.score);
        chosen = scoredSlot[0]?.wine;
      }

      if (!chosen) continue;
      usedIds.add(chosen.id);

      const slotNote = buildPersonaCommentary(
        chosen,
        persona,
        segDishesKo,
        segDishesEn,
        occasion,
        tasteProfile,
        segTags
      );

      const slotPrefixKo =
        coursePairingMode === 'custom_slots'
          ? `지정하신 [${CATEGORY_LABELS[requestedCat].shortKo}] 슬롯에 맞춰 `
          : focusSlotIdx === i
            ? `이번 구성에서 예산과 비중을 가장 크게 실은 핵심 바틀로, `
            : '코스 강도 변화에 맞춰 ';
      const slotPrefixEn =
        coursePairingMode === 'custom_slots'
          ? `Matched to your chosen [${CATEGORY_LABELS[requestedCat].shortEn}] slot: `
          : focusSlotIdx === i
            ? `Designated as the centerpiece bottle of this lineup: `
            : 'Paced to the course arc: ';

      sequence.push({
        slotIndex: i,
        assignedCategory: chosen.category,
        courseSegmentKo: segLabelsKo[i] ?? `코스 ${i + 1}구간`,
        courseSegmentEn: segLabelsEn[i] ?? `Stage ${i + 1}`,
        assignedDishesKo: segDishesKo,
        assignedDishesEn: segDishesEn,
        wine: chosen,
        valueTier: computeValueTier(chosen, venue.priceTransparencyOptIn),
        bridgeReasonKo: `${slotPrefixKo}${slotNote.ko}`,
        bridgeReasonEn: `${slotPrefixEn}${slotNote.en}`,
        expertBridgeReasonKo: `${slotPrefixKo}${slotNote.expertKo}`,
        expertBridgeReasonEn: `${slotPrefixEn}${slotNote.expertEn}`,
        tastingTipKo: slotNote.tipKo,
        tastingTipEn: slotNote.tipEn,
      });
    }

    return { sequence, usedFallbackCategory };
  };

  const scenarioLimit = Math.min(3, Math.max(1, venue.recommendationLimit || 3));
  const courseScenarios: CourseScenario[] = [];

  if (isGlassCourse) {
    const { sequence } = buildSequenceWithQualityFocus(baseCategories, null);
    courseScenarios.push({
      id: 'glass_flow',
      labelKo: '코스 글라스 구성',
      labelEn: 'Course Glass Flow',
      focusDescKo: '스파클링 · 화이트 · 레드 3잔으로 가볍게 이어집니다.',
      focusDescEn: 'Three light pours across sparkling, white, and red.',
      totalPrice: sequence.reduce((s, x) => s + (x.wine.glassPrice ?? Math.round(x.wine.venuePrice / 5)), 0),
      sequence,
    });
  } else {
    // Build Quality / Budget Allocation Scenarios within the food-matched bottle categories!
    const focusSlots: Array<number | null> =
      effectiveBottleCount === 2
        ? [0, 1, null]
        : [0, 1, 2];

    for (let idx = 0; idx < Math.min(scenarioLimit, focusSlots.length); idx++) {
      const fSlot = focusSlots[idx];
      const { sequence } = buildSequenceWithQualityFocus(baseCategories, fSlot);
      const focusedCat = fSlot !== null ? baseCategories[fSlot] : null;
      const focusedCatKo = focusedCat ? CATEGORY_LABELS[focusedCat].shortKo : '';
      const focusedCatEn = focusedCat ? CATEGORY_LABELS[focusedCat].shortEn : '';

      const labelKo =
        fSlot === null
          ? '균형 배분 구성'
          : `${fSlot + 1}번 병(${focusedCatKo}) 집중`;
      const labelEn =
        fSlot === null
          ? 'Balanced Allocation'
          : `Bottle ${fSlot + 1} (${focusedCatEn}) Focus`;

      const descKo =
        fSlot === null
          ? '모든 병에 예산을 고르게 배분해 처음부터 끝까지 편하고 안정적인 만족감을 드리는 구성입니다.'
          : `${fSlot + 1}번째 ${focusedCatKo}에 비중을 실어 포인트를 주고, 나머지 병은 편하게 곁들이기 좋은 라인업으로 맞췄습니다.`;
      const descEn =
        fSlot === null
          ? 'Even budget allocation across every bottle in the course.'
          : `Highlights Bottle ${fSlot + 1} (${focusedCatEn}) as the centerpiece while keeping the rest balanced.`;
      const expertDescKo =
        fSlot === null
          ? `[균등 구조 설계] 설정하신 예산 대역 내에서 전채-중반-메인의 산도·타닌 곡선을 균일한 급간으로 배분했습니다.`
          : `[포트폴리오 집중 설계] ${fSlot + 1}번 슬롯(${focusedCatKo})에 설정 예산 내 최상위 떼루아·숙성 잠재력 바틀을 배치하고, 인접 구간은 산도·질감 호환성 위주로 최적화했습니다.`;
      const expertDescEn =
        fSlot === null
          ? `[Balanced Architecture] Distributes target budget evenly across the ascending intensity curve of all course stages.`
          : `[Weighted Portfolio] Allocates peak terroir concentration to Bottle ${fSlot + 1} (${focusedCatEn}) within budget while balancing adjacent acid-tannin bridges.`;

      courseScenarios.push({
        id: `focus_slot_${fSlot ?? 'balanced'}`,
        labelKo,
        labelEn,
        focusDescKo: descKo,
        focusDescEn: descEn,
        expertFocusDescKo: expertDescKo,
        expertFocusDescEn: expertDescEn,
        totalPrice: sequence.reduce((s, x) => s + x.wine.venuePrice, 0),
        sequence,
      });
    }
  }

  const primarySequence = courseScenarios[0]?.sequence ?? [];
  const totalPrice = courseScenarios[0]?.totalPrice ?? 0;
  const comboNamesKo = primarySequence.map((s) => CATEGORY_LABELS[s.assignedCategory].shortKo).join(' → ');
  const comboNamesEn = primarySequence.map((s) => CATEGORY_LABELS[s.assignedCategory].shortEn).join(' → ');

  const usedIds = new Set(primarySequence.map((s) => s.wine.id));

  return {
    kind: 'course_sequence',
    sourceMode: query.sourceMode ?? 'venue_cellar',
    sourceLabelKo: query.sourceLabelKo,
    sourceLabelEn: query.sourceLabelEn,
    persona,
    menuMode: 'course',
    serveFormat: courseServeFormat,
    bottleCount: effectiveBottleCount,
    coursePairingMode,
    totalPrice,
    overallNoteKo: isGlassCourse
      ? `${persona.nameKo}가 코스 흐름에 맞춰 1잔씩 부담 없이 즐기실 수 있도록 [${comboNamesKo}] 3잔 구성을 마련했습니다.`
      : `${persona.nameKo}가 코스의 흐름에 맞춰 편하게 비교해 보실 수 있도록 예산별 맞춤 와인 구성을 준비했습니다.`,
    overallNoteEn: isGlassCourse
      ? `Curated by ${persona.nameEn}: a 3-glass [${comboNamesEn}] progression paced gently to every course.`
      : `Curated by ${persona.nameEn}: compare weight-focused lineups tuned to your budget.`,
    expertOverallNoteKo: isGlassCourse
      ? `[코스 글라스 아키텍처] 아페리티프부터 메인 구간까지 [${comboNamesKo}] 순으로 산도·페놀 밀도가 점진 상승하도록 설계한 3잔 페어링입니다.`
      : `[코스 다병 페어링 설계] 각 코스 구간의 조리법·지방 밀도에 맞춰 [${comboNamesKo}] 슬롯별 산도·타닌 밸런스를 설정 예산 범위 안에서 조율했습니다.`,
    expertOverallNoteEn: isGlassCourse
      ? `[By-the-Glass Progression] Designed across [${comboNamesEn}] for rising acidity-to-phenolic density.`
      : `[Multi-Bottle Architecture] Calibrated [${comboNamesEn}] phenolic and aromatic progressions strictly aligned to your budget ceiling.`,
    courseSequence: primarySequence,
    courseScenarios,
    extraGlass: pickExtraGlass(
      usedIds,
      primarySequence.map((s) => s.assignedCategory)
    ),
  };
}

export function applyLikeToTasteProfile(
  profile: UserTasteProfile,
  wine: WineItem
): UserTasteProfile {
  const likedWineIds = profile.likedWineIds.includes(wine.id)
    ? profile.likedWineIds
    : [...profile.likedWineIds, wine.id];

  const aromaWeights = { ...profile.affinityVector.aromaWeights };
  const allAromas = [...wine.aromas.primary, ...wine.aromas.secondary, ...wine.aromas.tertiary];
  for (const a of allAromas) {
    aromaWeights[a] = (aromaWeights[a] ?? 0) + 1;
  }

  const bodyNudge = wine.structure.body >= 4 ? 0.4 : wine.structure.body <= 2 ? -0.4 : 0;

  return {
    ...profile,
    likedWineIds,
    affinityVector: {
      ...profile.affinityVector,
      bodyDelta: Number((profile.affinityVector.bodyDelta + bodyNudge).toFixed(2)),
      aromaWeights,
    },
  };
}

export function applyDislikeToTasteProfile(
  profile: UserTasteProfile,
  wine: WineItem,
  reasons: DislikeReasonTag[],
  lang: 'ko' | 'en'
): UserTasteProfile {
  const avoidSet = new Set<DislikeReasonTag>(profile.affinityVector.avoidTags);
  reasons.forEach((r) => avoidSet.add(r));

  let tanninDelta = profile.affinityVector.tanninDelta;
  let acidityDelta = profile.affinityVector.acidityDelta;
  let sweetnessDelta = profile.affinityVector.sweetnessDelta;
  let bodyDelta = profile.affinityVector.bodyDelta;

  if (reasons.includes('too_tannic')) tanninDelta -= 1;
  if (reasons.includes('too_sour')) acidityDelta -= 1;
  if (reasons.includes('too_sweet')) sweetnessDelta -= 1;
  if (reasons.includes('too_heavy')) bodyDelta -= 1;
  if (reasons.includes('overshadowed')) bodyDelta += 0.8;

  const newRecord = {
    wineId: wine.id,
    wineName: lang === 'ko' ? wine.nameKo : wine.nameEn,
    reasons,
    timestamp: new Date().toISOString(),
  };

  return {
    ...profile,
    dislikedFeedbacks: [newRecord, ...profile.dislikedFeedbacks].slice(0, 12),
    affinityVector: {
      ...profile.affinityVector,
      bodyDelta: Number(bodyDelta.toFixed(2)),
      acidityDelta: Number(acidityDelta.toFixed(2)),
      tanninDelta: Number(tanninDelta.toFixed(2)),
      sweetnessDelta: Number(sweetnessDelta.toFixed(2)),
      avoidTags: Array.from(avoidSet),
    },
  };
}

export function getNextRecommendedWines(
  likedWine: WineItem,
  allWines: WineItem[],
  venueId: string
): WineItem[] {
  const pool = allWines.filter((w) => w.id !== likedWine.id && w.stock > 0);
  const scored = pool.map((candidate) => {
    let sim = 0;
    if (candidate.venueId === venueId) sim += 20; // prioritize same cellar first so guest can order now
    if (candidate.category === likedWine.category) sim += 18;
    sim += Math.max(0, 10 - Math.abs(candidate.structure.body - likedWine.structure.body) * 3);
    sim += Math.max(0, 10 - Math.abs(candidate.structure.acidity - likedWine.structure.acidity) * 3);
    const sharedAromas = candidate.aromas.primary.filter((a) =>
      likedWine.aromas.primary.includes(a)
    );
    sim += sharedAromas.length * 8;
    return { candidate, sim };
  });

  return scored
    .sort((a, b) => b.sim - a.sim)
    .slice(0, 2)
    .map((x) => x.candidate);
}

export function generateCorkageOnlyRecommendation(params: {
  venue: Venue;
  persona: SommelierPersona;
  corkage: CorkageBottle;
  tasteProfile: UserTasteProfile;
}): PairingRecommendationBundle {
  const { venue, persona, corkage, tasteProfile } = params;

  const defaultStructure = corkage.structure ?? {
    body: corkage.body || 3,
    acidity: corkage.category === 'sparkling' || corkage.category === 'white' ? 4 : 3,
    tannin: corkage.category === 'red' ? 3 : 1,
    sweetness: corkage.category === 'dessert' ? 4 : 1,
    alcohol: corkage.body >= 4 ? 4 : 3,
  };

  const defaultAromas = corkage.aromas ?? {
    primary:
      corkage.category === 'red'
        ? ['cherry', 'blackcurrant']
        : corkage.category === 'dessert'
          ? ['honey', 'pear_apple']
          : ['citrus', 'pear_apple', 'white_flower'],
    secondary:
      corkage.category === 'red'
        ? ['oak_cedar', 'pepper_spice']
        : ['butter_brioche'],
    tertiary: ['mineral_stone'],
  };

  const yearInName = corkage.name.match(/\b(19\d{2}|20\d{2})\b/);
  const effectiveVintage = corkage.vintage ?? (yearInName ? Number(yearInName[1]) : new Date().getFullYear() - 3);

  const corkageWineItem: WineItem = {
    id: `corkage_${Date.now()}`,
    venueId: venue.id,
    nameKo: corkage.name,
    nameEn: corkage.nameEn || corkage.name,
    producer: corkage.producer || 'Guest Cellar',
    vintage: effectiveVintage,
    category: corkage.category,
    varietalsKo:
      corkage.varietalsKo ||
      (corkage.category === 'red'
        ? '레드 블렌드'
        : corkage.category === 'sparkling'
          ? '스파클링 블렌드'
          : '화이트 품종'),
    varietalsEn:
      corkage.varietalsEn ||
      (corkage.category === 'red' ? 'Red Blend' : 'White / Sparkling'),
    regionKo: corkage.regionKo || '고객 지참 셀러',
    regionEn: corkage.regionEn || 'Guest Personal Cellar',
    countryCode: corkage.countryCode || 'FR',
    venuePrice: 0,
    marketPrice: 0,
    stock: 1,
    structure: defaultStructure,
    aromas: defaultAromas,
    serving: {
      glassType:
        corkage.category === 'sparkling'
          ? 'flute'
          : corkage.category === 'white'
            ? 'white'
            : corkage.category === 'dessert'
              ? 'dessert'
              : corkage.body <= 3
                ? 'burgundy'
                : 'bordeaux',
      tempMin: corkage.category === 'red' ? 15 : 8,
      tempMax: corkage.category === 'red' ? 17 : 10,
      decantMinutes: corkage.category === 'red' && corkage.body >= 4 ? 45 : 0,
      drinkWindowStart: 2023,
      drinkWindowEnd: 2032,
      statusKo: '지참 와인 · 상태 확인 후 서빙',
      statusEn: 'BYOB · Check temperature before pouring',
    },
    storytelling: {
      terroirKo: `${corkage.regionKo || '산지'}의 개성을 담아 고객님이 직접 준비해 오신 와인입니다.`,
      terroirEn: `Personal selection from ${corkage.regionEn || 'your cellar'}.`,
      vinificationKo: '매장의 권장 글라스와 음용 온도에 맞춰 즐기시면 풍미가 한층 살아납니다.',
      vinificationEn: 'Served at its ideal temperature and stemware to unlock full aromatics.',
      heavenClimateKo:
        corkage.heavenClimateKo ||
        `${effectiveVintage}년 빈티지의 자연스러운 기후 결을 간직한 보틀입니다.`,
      heavenClimateEn:
        corkage.heavenClimateEn ||
        `Expressing the natural vintage character of ${effectiveVintage}.`,
      earthSoilKo:
        corkage.earthSoilKo ||
        `${corkage.regionKo || '산지'} 특유의 지질과 미네랄이 와인의 구조와 여운을 형성합니다.`,
      earthSoilEn:
        corkage.earthSoilEn ||
        `Mineral structure shaped by ${corkage.regionEn || 'its origin soils'}.`,
      humanPhilosophyKo:
        corkage.humanPhilosophyKo ||
        '고객님이 직접 소장해 오신 보틀이 오늘 식탁의 요리와 가장 빛나는 순간을 연결해 드립니다.',
      humanPhilosophyEn:
        corkage.humanPhilosophyEn ||
        'Paired thoughtfully with tonight’s dishes to let your bottle shine.',
      wineryLocation: corkage.wineryLocation ?? {
        lat: 47.0247,
        lng: 4.8386,
        placeLabelKo: corkage.regionKo || corkage.name,
        placeLabelEn: corkage.regionEn || corkage.name,
        earthQuery: `${corkage.producer || corkage.name} ${corkage.regionEn || ''}`.trim(),
      },
    },
    pairingAffinities:
      corkage.category === 'red'
        ? ['steak', 'rich', 'poultry', 'umami']
        : corkage.category === 'dessert'
          ? ['dessert', 'cheese', 'sweet']
          : ['seafood', 'delicate', 'cream', 'truffle', 'umami'],
  };

  // Match best dishes / course stages from THIS venue!
  const candidateDishes =
    venue.venueType === 'course' && venue.courseMenu && venue.courseMenu.length > 0
      ? venue.courseMenu.map((d) => ({
          nameKo: d.nameKo,
          nameEn: d.nameEn,
          stageKo: d.stageKo,
          stageEn: d.stageEn,
          flavorTags: d.flavorTags,
          intensity: d.intensity,
        }))
      : venue.registeredDishes.map((d) => ({
          nameKo: d.nameKo,
          nameEn: d.nameEn,
          stageKo: undefined,
          stageEn: undefined,
          flavorTags: d.flavorTags,
          intensity: d.intensity,
        }));

  const scoredDishes = candidateDishes
    .map((dish) => {
      let match = 40;
      const tagMatches = dish.flavorTags.filter((t) =>
        corkageWineItem.pairingAffinities.includes(t)
      );
      match += tagMatches.length * 16;
      match += Math.max(-10, 12 - Math.abs(corkageWineItem.structure.body - dish.intensity) * 4);
      if (corkage.category === 'red' && dish.flavorTags.includes('steak')) match += 15;
      if ((corkage.category === 'white' || corkage.category === 'sparkling') && dish.flavorTags.includes('seafood')) match += 15;
      if (corkage.category === 'dessert' && dish.flavorTags.includes('dessert')) match += 25;
      return { dish, match };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  const corkageDishMatches: CorkageDishMatch[] = scoredDishes.map(({ dish }) => ({
    dishNameKo: dish.nameKo,
    dishNameEn: dish.nameEn,
    stageKo: dish.stageKo,
    stageEn: dish.stageEn,
    reasonKo:
      corkage.category === 'red'
        ? '이 요리의 고소한 육즙과 진한 풍미가 가져오신 레드 와인의 타닌·바디와 가장 멋지게 맞물립니다.'
        : corkage.category === 'dessert'
          ? '디저트의 부드러운 단맛과 와인의 달콤한 여운이 조화롭게 이어지는 구간입니다.'
          : '가져오신 와인의 산뜻한 산도와 미네랄이 재료 본연의 감칠맛을 가장 깔끔하게 살려주는 요리입니다.',
    reasonEn:
      corkage.category === 'red'
        ? 'The rich savory depth of this plate meets your red wine’s structure harmoniously.'
        : 'Bright natural freshness lifts the delicate umami and texture of this dish.',
  }));

  const topDishNamesKo = scoredDishes.map((x) => x.dish.nameKo);
  const topDishNamesEn = scoredDishes.map((x) => x.dish.nameEn);
  const topTags = Array.from(new Set(scoredDishes.flatMap((x) => x.dish.flavorTags)));

  const commentary = buildPersonaCommentary(
    corkageWineItem,
    persona,
    topDishNamesKo,
    topDishNamesEn,
    'date',
    tasteProfile,
    topTags
  );

  const singleItem: SingleWineRecommendation = {
    wine: corkageWineItem,
    rank: 1,
    matchScore: 96,
    valueTier: null,
    commentaryKo: commentary.ko,
    commentaryEn: commentary.en,
    expertCommentaryKo: commentary.expertKo,
    expertCommentaryEn: commentary.expertEn,
    tastingTipKo: commentary.tipKo,
    tastingTipEn: commentary.tipEn,
    pairingPointsKo: commentary.pointsKo,
    pairingPointsEn: commentary.pointsEn,
  };

  return {
    kind: 'corkage_only',
    persona,
    menuMode: venue.venueType,
    bottleCount: 1,
    totalPrice: 0,
    overallNoteKo:
      venue.venueType === 'course'
        ? `가져오신 [${corkage.name}]의 테이스팅 노트와 함께, ${venue.nameKo} 코스 중 가장 빛나는 요리 구간을 짚어드렸습니다.`
        : `가져오신 [${corkage.name}]의 테이스팅 노트와 함께, ${venue.nameKo}에서 가장 잘 어울리는 추천 요리를 골랐습니다.`,
    overallNoteEn:
      venue.venueType === 'course'
        ? `Tasting notes for your [${corkage.name}] plus the ideal course moments at ${venue.nameEn}.`
        : `Tasting notes for your [${corkage.name}] plus the best-matching dishes at ${venue.nameEn}.`,
    singleItems: [singleItem],
    corkageDishMatches,
  };
}

export function swapSpecificWinesInBundle(
  bundle: PairingRecommendationBundle,
  activeScenarioIdx: number,
  wineIdsToReplace: string[],
  excludedHistoryIds: string[],
  query: PairingQuery
): PairingRecommendationBundle {
  const { venue, wines, persona, budgetTier, budgetScope, occasion, tasteProfile } = query;
  const replaceSet = new Set(wineIdsToReplace);
  const allExcluded = new Set([...excludedHistoryIds, ...wineIdsToReplace]);
  const rawPool = wines.filter((w) => w.venueId === venue.id && w.stock > 0);
  const inStockVenueWines =
    query.sourceWines && query.sourceWines.length > 0
      ? query.sourceWines.filter((w) => w.stock > 0)
      : rawPool;

  if (bundle.kind === 'single_or_alacarte' && bundle.singleItems) {
    const keptIds = new Set(
      bundle.singleItems
        .filter((item) => !replaceSet.has(item.wine.id))
        .map((item) => item.wine.id)
    );
    const budgetWindow = getBudgetWindow(budgetTier, budgetScope, 1);
    const allTags = Array.from(new Set(query.selectedDishes.flatMap((d) => d.flavorTags)));
    const avgIntensity =
      query.selectedDishes.length > 0
        ? query.selectedDishes.reduce((s, d) => s + d.intensity, 0) / query.selectedDishes.length
        : 3;

    const updatedItems = bundle.singleItems.map((item) => {
      if (!replaceSet.has(item.wine.id)) return item;

      let pool = inStockVenueWines.filter((w) => !keptIds.has(w.id) && !allExcluded.has(w.id));
      if (pool.length === 0) {
        pool = inStockVenueWines.filter((w) => !keptIds.has(w.id) && w.id !== item.wine.id);
      }
      if (pool.length === 0) return item;

      const scored = pool
        .map((wine) => ({
          wine,
          score: scoreWineForContext(wine, {
            persona,
            budgetWindow,
            flavorTags: allTags,
            avgIntensity,
            bodyPref: query.bodyPref,
            sweetnessPref: query.sweetnessPref,
            occasion,
            tasteProfile,
          }),
        }))
        .sort((a, b) => b.score - a.score);

      const replacement = scored[0]?.wine;
      if (!replacement) return item;
      keptIds.add(replacement.id);

      const commentary = buildPersonaCommentary(
        replacement,
        persona,
        query.selectedDishes.map((d) => d.nameKo),
        query.selectedDishes.map((d) => d.nameEn),
        occasion,
        tasteProfile,
        allTags
      );

      return {
        ...item,
        wine: replacement,
        valueTier: computeValueTier(replacement, venue.priceTransparencyOptIn),
        commentaryKo: commentary.ko,
        commentaryEn: commentary.en,
        expertCommentaryKo: commentary.expertKo,
        expertCommentaryEn: commentary.expertEn,
        tastingTipKo: commentary.tipKo,
        tastingTipEn: commentary.tipEn,
        pairingPointsKo: commentary.pointsKo,
        pairingPointsEn: commentary.pointsEn,
      };
    });

    return {
      ...bundle,
      singleItems: updatedItems,
      totalPrice: updatedItems[0]?.wine.venuePrice ?? bundle.totalPrice,
    };
  }

  // Course Multi-Bottle Scenario Swap (locks unchecked bottles, replaces only checked slots)
  if (bundle.kind === 'course_sequence' && bundle.courseScenarios) {
    const budgetWindow = getBudgetWindow(budgetTier, budgetScope, bundle.bottleCount);
    const updatedScenarios = bundle.courseScenarios.map((sc, sIdx) => {
      if (sIdx !== activeScenarioIdx) return sc;

      const keptIds = new Set(
        sc.sequence
          .filter((slot) => !replaceSet.has(slot.wine.id))
          .map((slot) => slot.wine.id)
      );

      const updatedSeq = sc.sequence.map((slot) => {
        if (!replaceSet.has(slot.wine.id)) return slot;

        // Prefer same category not yet kept or excluded; fallback to any distinct in-stock bottle
        let pool = inStockVenueWines.filter(
          (w) =>
            w.category === slot.assignedCategory &&
            !keptIds.has(w.id) &&
            !allExcluded.has(w.id)
        );
        if (pool.length === 0) {
          pool = inStockVenueWines.filter(
            (w) => !keptIds.has(w.id) && !allExcluded.has(w.id)
          );
        }
        if (pool.length === 0) {
          pool = inStockVenueWines.filter(
            (w) => !keptIds.has(w.id) && w.id !== slot.wine.id
          );
        }
        if (pool.length === 0) return slot;

        const scored = pool
          .map((wine) => ({
            wine,
            score: scoreWineForContext(wine, {
              persona,
              budgetWindow,
              flavorTags: ['umami'],
              avgIntensity: 3,
              bodyPref: query.bodyPref,
              sweetnessPref: query.sweetnessPref,
              occasion,
              tasteProfile,
              forcedCategory: slot.assignedCategory,
            }),
          }))
          .sort((a, b) => b.score - a.score);

        const replacement = scored[0]?.wine;
        if (!replacement) return slot;
        keptIds.add(replacement.id);

        const note = buildPersonaCommentary(
          replacement,
          persona,
          slot.assignedDishesKo,
          slot.assignedDishesEn,
          occasion,
          tasteProfile
        );

        return {
          ...slot,
          assignedCategory: replacement.category,
          wine: replacement,
          valueTier: computeValueTier(replacement, venue.priceTransparencyOptIn),
          bridgeReasonKo: `새롭게 교체 추천드리는 바틀입니다. ${note.ko}`,
          bridgeReasonEn: `Fresh replacement selection: ${note.en}`,
          expertBridgeReasonKo: `대체 페어링 바틀: ${note.expertKo}`,
          expertBridgeReasonEn: `Fresh replacement pairing: ${note.expertEn}`,
          tastingTipKo: note.tipKo,
          tastingTipEn: note.tipEn,
        };
      });

      return {
        ...sc,
        sequence: updatedSeq,
        totalPrice: updatedSeq.reduce((sum, x) => sum + x.wine.venuePrice, 0),
      };
    });

    const activeSc = updatedScenarios[activeScenarioIdx] ?? updatedScenarios[0];
    return {
      ...bundle,
      courseScenarios: updatedScenarios,
      courseSequence: activeSc?.sequence ?? bundle.courseSequence,
      totalPrice: activeSc?.totalPrice ?? bundle.totalPrice,
    };
  }

  return bundle;
}

