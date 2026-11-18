import type {
  AromaKey,
  BodyPref,
  BudgetScope,
  BudgetTier,
  CorkageBottle,
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
} from '../types/sommelier';
import { AROMA_LABELS, CATEGORY_LABELS } from '../i18n/translations';

export interface PairingQuery {
  venue: Venue;
  wines: WineItem[];
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
    under_50: { min: 0, max: 55000, ideal: 45000 },
    '50_100': { min: 48000, max: 105000, ideal: 78000 },
    '100_150': { min: 98000, max: 155000, ideal: 128000 },
    over_150: { min: 145000, max: 450000, ideal: 185000 },
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

  // 2. Budget Fit
  if (wine.venuePrice >= budgetWindow.min && wine.venuePrice <= budgetWindow.max) {
    score += 24;
    const dist = Math.abs(wine.venuePrice - budgetWindow.ideal) / Math.max(1, budgetWindow.ideal);
    score += Math.max(0, 8 - dist * 10);
  } else if (wine.venuePrice < budgetWindow.min) {
    score += 10;
  } else {
    const overRatio = (wine.venuePrice - budgetWindow.max) / Math.max(1, budgetWindow.max);
    score -= Math.min(35, overRatio * 55);
  }

  // 3. Dish Flavor Affinity
  const matchedTags = flavorTags.filter((tag) => wine.pairingAffinities.includes(tag));
  score += matchedTags.length * 14;

  // Intensity balance (don't let delicate dish be crushed or steak be overshadowed)
  const intensityDiff = Math.abs(wine.structure.body - avgIntensity);
  score += Math.max(-10, 12 - intensityDiff * 4);

  if (flavorTags.includes('steak') && wine.category === 'red') {
    score += 24;
    if (wine.structure.tannin >= 3 && !tasteProfile.affinityVector.avoidTags.includes('too_tannic')) {
      score += 8;
    }
    if (tasteProfile.affinityVector.avoidTags.includes('too_tannic') && wine.structure.tannin <= 3) {
      score += 18;
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
    if (avoid === 'too_tannic' && wine.structure.tannin >= 4) score -= 35;
    if (avoid === 'too_sour' && wine.structure.acidity >= 5) score -= 30;
    if (avoid === 'too_sweet' && wine.structure.sweetness >= 3) score -= 35;
    if (avoid === 'too_heavy' && (wine.structure.body >= 4 || wine.aromas.secondary.includes('oak_cedar'))) {
      score -= 28;
    }
    if (avoid === 'overshadowed' && wine.structure.body <= 2 && avgIntensity >= 4) {
      score -= 30;
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

  if (persona.toneStyle === 'classic_french') {
    ko = `${dishSummaryKo}의 맛을 가장 깔끔하게 살려주는 한 병이에요. ${topAromaKo}처럼 기분 좋은 과실 향이 퍼진 뒤 입안을 상쾌하게 정리해 주어, 마지막 한 점까지 느끼함 없이 즐기실 수 있습니다.`;
    en = `A poised match that keeps ${dishSummaryEn} tasting bright from the first bite to the last, lifting ${topAromaEn} cleanly on the finish.`;
    expertKo = `${dishSummaryKo}의 소스 농도와 지질에 정밀하게 대칭되는 구조감을 갖췄습니다. ${wine.regionKo} 테루아에서 기인한 ${topAromaKo} 아로마와 ${secAromaKo}의 숙성 뉘앙스, 그리고 정제된 산도가 팔레트의 긴장감을 유지합니다.`;
    expertEn = `Selected for structural precision beside ${dishSummaryEn}. ${wine.regionEn} terroir imparts focused ${topAromaEn}, layered ${secAromaEn}, and disciplined acid-tannin tension.`;
  } else if (persona.toneStyle === 'new_korean') {
    ko = `${dishSummaryKo}처럼 깊은 감칠맛이 있는 요리에는 이렇게 부드럽게 감기는 와인이 참 편해요. 첫 모금에 퍼지는 ${topAromaKo} 향이 음식과 싸우지 않고 자연스럽게 어우러져서 처음 드시는 분도 부담 없이 좋아하실 거예요.`;
    en = `Beside savory plates like ${dishSummaryEn}, this gentle, velvety bottle wraps around the flavors effortlessly without ever feeling harsh.`;
    expertKo = `${dishSummaryKo}의 복합적인 감칠맛과 발효·로스팅 풍미를 포용하는 유연한 페놀 구조가 돋보입니다. ${topAromaKo}의 화사한 1차 향과 ${secAromaKo} 뉘앙스가 미각의 브릿지를 형성해 조화로운 페어링을 완성합니다.`;
    expertEn = `Plush phenolic integration bridges roasted umami and savory glazes in ${dishSummaryEn}, pairing expressive ${topAromaEn} with supple ${secAromaEn} depth.`;
  } else {
    ko = `오늘 ${occasion === 'celebration' ? '기분 좋은 자리에' : '테이블 분위기를 산뜻하게 띄우고 싶어'} 골라본 매력적인 와인입니다. 인위적인 느낌 없이 신선한 ${topAromaKo}와 ${secAromaKo} 향이 살아있어 ${dishSummaryKo}와 함께 마시면 이야기가 절로 즐거워집니다.`;
    en = `A lively, characterful bottle to brighten the table beside ${dishSummaryEn}, brimming with fresh ${topAromaEn} and ${secAromaEn} vitality.`;
    expertKo = `${wine.regionKo}의 지질과 미기후를 최소 개입 양조로 직관적으로 담아낸 큐베입니다. 인위적 뉴오크를 배제하고 토착 효모와 자연 산미로 ${topAromaKo} 및 ${secAromaKo} 스펙트럼을 선명히 끌어올려 ${dishSummaryKo}와 생동감 있는 대비를 이룹니다.`;
    expertEn = `Low-intervention cuvée from ${wine.regionEn} fermented with native energy, preserving vibrant ${topAromaEn} and ${secAromaEn} tension against ${dishSummaryEn}.`;
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
  const nonExcluded = allInStockVenueWines.filter((w) => !excludedWineIds.includes(w.id));
  const eligiblePool = nonExcluded.length > 0 ? nonExcluded : allInStockVenueWines;

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
    const scored = eligiblePool
      .map((wine) => {
        let s = scoreWineForContext(wine, {
          persona,
          budgetWindow,
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
        ? `${persona.nameKo}가 가져오신 [${corkageWine.name}]과 자연스럽게 대비·조화를 이루는 업장 와인을 우선 선정했습니다.`
        : menuMode === 'course'
          ? `${persona.nameKo}의 시선으로 전채부터 메인까지 한 병으로 매끄럽게 이어지는 균형미 뛰어난 와인을 추렸습니다.`
          : `${persona.nameKo}가 선택하신 요리들의 맛의 공통분모를 읽어, 현재 셀러에 재고가 있는 와인 중 최적의 바틀을 골랐습니다.`;
    const overallNoteEn =
      menuMode === 'course'
        ? `Curated by ${persona.nameEn}: versatile, in-stock selections capable of carrying the full tasting progression in a single bottle.`
        : `Curated by ${persona.nameEn}: top in-stock selections tuned to the shared flavor bridge of your chosen dishes.`;

    return {
      kind: 'single_or_alacarte',
      persona,
      menuMode,
      serveFormat: courseServeFormat,
      bottleCount: 1,
      totalPrice: singleItems[0]?.wine.venuePrice ?? 0,
      overallNoteKo,
      overallNoteEn,
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
        // Apply Quality / Budget Allocation Focus
        const scoredSlot = candidates
          .map((wine) => {
            let s = scoreWineForContext(wine, {
              persona,
              budgetWindow,
              flavorTags: segTags,
              avgIntensity: segAvgIntensity,
              bodyPref,
              sweetnessPref,
              occasion,
              tasteProfile,
              forcedCategory: requestedCat,
            });
            if (focusSlotIdx !== null) {
              if (i === focusSlotIdx) {
                // Elevate higher-tier bottle in the focused slot while preserving persona character
                s += wine.venuePrice / 6000;
              } else {
                // Keep non-focused slots smart, harmonious, and budget-friendly
                s -= wine.venuePrice / 7000;
              }
            }
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
          ? '모든 병에 예산을 고르게 배분해 처음부터 끝까지 안정적인 만족감을 드리는 구성입니다.'
          : `${fSlot + 1}번째 ${focusedCatKo}에 예산과 비중을 집중하고, 나머지 병은 음식과 조화로운 합리적 라인업으로 맞췄습니다.`;
      const descEn =
        fSlot === null
          ? 'Balanced budget allocation across every bottle in the course.'
          : `Invests flagship focus into Bottle ${fSlot + 1} (${focusedCatEn}) while pairing the remaining courses smartly.`;

      courseScenarios.push({
        id: `focus_slot_${fSlot ?? 'balanced'}`,
        labelKo,
        labelEn,
        focusDescKo: descKo,
        focusDescEn: descEn,
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
    persona,
    menuMode: 'course',
    serveFormat: courseServeFormat,
    bottleCount: effectiveBottleCount,
    coursePairingMode,
    totalPrice,
    overallNoteKo: isGlassCourse
      ? `${persona.nameKo}가 코스 흐름에 맞춰 1잔씩 부담 없이 즐기실 수 있도록 [${comboNamesKo}] 3잔 구성을 마련했습니다.`
      : `${persona.nameKo}가 코스의 강도 곡선을 따라 취향 비중별로 선택하실 수 있는 맞춤 페어링 구성입니다.`,
    overallNoteEn: isGlassCourse
      ? `Curated by ${persona.nameEn}: a 3-glass [${comboNamesEn}] progression paced to every course.`
      : `Curated by ${persona.nameEn}: compare weight-focused bottle lineups tailored to tonight’s course.`,
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
  const inStockVenueWines = wines.filter((w) => w.venueId === venue.id && w.stock > 0);

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

