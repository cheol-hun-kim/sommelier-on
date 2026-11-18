import type {
  AromaKey,
  BodyPref,
  BudgetScope,
  BudgetTier,
  CourseBottleCount,
  CourseBottleSlotRecommendation,
  CoursePairingMode,
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
  bottleCount: number
): { min: number; max: number; ideal: number } {
  const baseMap: Record<BudgetTier, { min: number; max: number; ideal: number }> = {
    under_50: { min: 0, max: 55000, ideal: 45000 },
    '50_100': { min: 48000, max: 105000, ideal: 78000 },
    '100_150': { min: 98000, max: 155000, ideal: 128000 },
    over_150: { min: 145000, max: 450000, ideal: 185000 },
  };
  const base = baseMap[tier];
  if (scope === 'total' && bottleCount > 1) {
    // Distribute total budget gracefully across multi-bottle selections
    const effectiveMax = Math.max(48000, Math.round(base.max / bottleCount));
    const effectiveMin = Math.round(base.min / bottleCount);
    const effectiveIdeal = Math.max(42000, Math.round(base.ideal / bottleCount));
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
    score += 10;
    if (wine.structure.tannin >= 3 && !tasteProfile.affinityVector.avoidTags.includes('too_tannic')) {
      score += 8;
    }
    if (tasteProfile.affinityVector.avoidTags.includes('too_tannic') && wine.structure.tannin <= 3) {
      score += 14;
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

  // 6. Sommelier Persona Signature Lens
  const regionMatch = persona.preferredRegions.some((r) =>
    wine.regionEn.toLowerCase().includes(r.toLowerCase())
  );
  if (regionMatch) score += 12;
  score += persona.preferredCategories[wine.category] ?? 0;

  if (persona.toneStyle === 'classic_french' && wine.structure.acidity >= 4 && wine.countryCode === 'FR') {
    score += 8;
  }
  if (persona.toneStyle === 'new_korean' && wine.pairingAffinities.includes('korean_umami')) {
    score += 10;
  }
  if (persona.toneStyle === 'natural_explorer' && (wine.category === 'rose_orange' || wine.regionEn.includes('Loire') || wine.regionEn.includes('Friuli'))) {
    score += 12;
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

function buildPersonaCommentary(
  wine: WineItem,
  persona: SommelierPersona,
  dishNamesKo: string[],
  dishNamesEn: string[],
  occasion: OccasionType,
  tasteProfile: UserTasteProfile
): { ko: string; en: string; pointsKo: string[]; pointsEn: string[] } {
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

  if (persona.toneStyle === 'classic_french') {
    ko = `${dishSummaryKo}의 풍미를 가장 정갈하게 받쳐줄 구조감을 찾았습니다. ${wine.regionKo} 특유의 ${topAromaKo} 결에 ${secAromaKo} 뉘앙스가 이어지며, 입안을 산뜻하게 정돈해 다음 한 점의 매력을 또렷하게 살려줍니다.`;
    en = `I selected this bottle for the poised structure it brings beside ${dishSummaryEn}. Classic ${topAromaEn} and subtle ${secAromaEn} notes cleanse the palate gracefully between each bite.`;
  } else if (persona.toneStyle === 'new_korean') {
    ko = `${dishSummaryKo}처럼 깊은 감칠맛이 살아있는 테이블에는 부드러운 결을 지닌 이 병이 참 편안합니다. 첫 모금에 퍼지는 ${topAromaKo}의 화사함이 요리의 간을 한층 입체적으로 감싸주어 처음부터 끝까지 부담 없이 즐기실 수 있어요.`;
    en = `Beside savory flavors like ${dishSummaryEn}, this wine’s supple texture feels effortlessly welcoming. Bright ${topAromaEn} lifts the umami depth without ever feeling heavy on the palate.`;
  } else {
    ko = `오늘 ${occasion === 'celebration' ? '기분 좋은 축하 자리에' : '테이블의 분위기를 산뜻하게 환기하고 싶어'} 권해드리는 발견입니다. ${wine.regionKo}에서 저개입 방식으로 빚어낸 생동감 있는 ${topAromaKo}와 ${secAromaKo} 결이 ${dishSummaryKo}와 만나 흥미로운 여운을 남깁니다.`;
    en = `A lively discovery to brighten the table beside ${dishSummaryEn}. Low-intervention energy from ${wine.regionEn} frames ${topAromaEn} and ${secAromaEn} with crisp, memorable vitality.`;
  }

  if (hasAversionRelief) {
    ko += ' 고객님의 취향노트를 반영해 부담스러운 자극 없이 편하게 넘어가도록 세심하게 골랐습니다.';
    en += ' Tailored gently to your saved Taste Note sensitivities for smooth, unforced balance.';
  }

  const pointsKo = [
    `${wine.structure.acidity >= 4 ? '생동감 있는 산도가 입안을 개운하게 정돈' : '둥글고 부드러운 질감이 요리 풍미를 감싸줌'}`,
    `${topAromaKo} · ${secAromaKo} 아로마 스펙트럼 조화`,
    `${wine.serving.tempMin}~${wine.serving.tempMax}℃ 서빙 시 가장 섬세한 표현력`,
  ];

  const pointsEn = [
    `${wine.structure.acidity >= 4 ? 'Crisp acidity refreshes the palate cleanly' : 'Supple texture cushions rich savory flavors'}`,
    `Harmonic lift of ${topAromaEn} and ${secAromaEn}`,
    `Most expressive served at ${wine.serving.tempMin}–${wine.serving.tempMax}°C`,
  ];

  return { ko, en, pointsKo, pointsEn };
}

function chooseAutoCourseSequence(
  bottleCount: CourseBottleCount,
  segments: ParsedMenuDish[][]
): WineCategory[] {
  if (bottleCount === 1) return ['white'];
  const segHas = (segIdx: number, tag: string) =>
    segments[segIdx]?.some((d) => d.flavorTags.includes(tag)) ?? false;

  if (bottleCount === 2) {
    const firstIsSeafood = segHas(0, 'seafood') || segHas(0, 'delicate');
    const secondIsMeat = segHas(1, 'steak') || segHas(1, 'rich');
    if (firstIsSeafood && secondIsMeat) return ['sparkling', 'red'];
    if (secondIsMeat) return ['white', 'red'];
    return ['sparkling', 'white'];
  }

  if (bottleCount === 4) {
    return ['sparkling', 'white', 'red', 'dessert'];
  }

  // 3 bottles
  const finaleIsDessert = segHas(2, 'dessert') && !segHas(2, 'steak');
  if (finaleIsDessert) {
    return ['sparkling', 'red', 'dessert'];
  }
  return ['sparkling', 'white', 'red'];
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
    tasteProfile,
  } = query;

  // STRICT SYSTEMIC INVARIANT: Only wines in THIS venue with stock > 0 are eligible!
  const eligiblePool = wines.filter((w) => w.venueId === venue.id && w.stock > 0);

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
  const budgetWindow = getBudgetWindow(budgetTier, budgetScope, effectiveBottleCount);

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
      pairingPointsKo: [
        top.glassPrice ? `글라스 가능 (${top.glassPrice.toLocaleString('ko-KR')}원)` : '업장 잔 와인 문의 가능',
      ],
      pairingPointsEn: [
        top.glassPrice ? `By the glass (₩${top.glassPrice.toLocaleString('ko-KR')})` : 'Ask your host for glass pour',
      ],
    };
  };

  if (!isMultiBottleCourse) {
    const scored = eligiblePool
      .map((wine) => ({
        wine,
        score: scoreWineForContext(wine, {
          persona,
          budgetWindow,
          flavorTags: allTags,
          avgIntensity,
          bodyPref,
          sweetnessPref,
          occasion,
          tasteProfile,
        }),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const dishNamesKo = workingDishes.map((d) => d.nameKo);
    const dishNamesEn = workingDishes.map((d) => d.nameEn);

    const singleItems: SingleWineRecommendation[] = scored.map((entry, idx) => {
      const commentary = buildPersonaCommentary(
        entry.wine,
        persona,
        dishNamesKo,
        dishNamesEn,
        occasion,
        tasteProfile
      );
      return {
        wine: entry.wine,
        rank: idx + 1,
        matchScore: Math.min(99, Math.max(72, Math.round(entry.score))),
        valueTier: computeValueTier(entry.wine, venue.priceTransparencyOptIn),
        commentaryKo: commentary.ko,
        commentaryEn: commentary.en,
        pairingPointsKo: commentary.pointsKo,
        pairingPointsEn: commentary.pointsEn,
      };
    });

    const overallNoteKo =
      menuMode === 'course'
        ? `${persona.nameKo}의 시선으로 전채부터 메인까지 한 병으로 매끄럽게 관통할 수 있는 균형미 뛰어난 와인을 추렸습니다.`
        : `${persona.nameKo}가 선택하신 요리들의 맛의 공통분모를 읽어, 현재 셀러에 재고가 있는 와인 중 최적의 3병을 골랐습니다.`;
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

  // MULTI-BOTTLE (OR 3-GLASS) COURSE MODE
  const segments = partitionDishesIntoSegments(workingDishes, effectiveBottleCount);
  const targetCategories: WineCategory[] = isGlassCourse
    ? ['sparkling', 'white', 'red']
    : coursePairingMode === 'custom_slots'
      ? customSlots.slice(0, effectiveBottleCount)
      : chooseAutoCourseSequence(effectiveBottleCount, segments);

  const usedIds = new Set<string>();
  const sequence: CourseBottleSlotRecommendation[] = [];
  let usedFallbackCategory = false;

  // Track category occurrence counts so repeated categories (e.g. 화화화, 샴샴샴) ascend in weight!
  const categoryOccurrences: Record<string, number> = {};
  const categoryTotals: Record<string, number> = {};
  targetCategories.forEach((cat) => {
    categoryTotals[cat] = (categoryTotals[cat] ?? 0) + 1;
  });

  for (let i = 0; i < effectiveBottleCount; i++) {
    const requestedCat = targetCategories[i] ?? 'white';
    const occIndex = categoryOccurrences[requestedCat] ?? 0;
    categoryOccurrences[requestedCat] = occIndex + 1;
    const totalInCat = categoryTotals[requestedCat] ?? 1;

    const segDishes = segments[i] ?? workingDishes;
    const segTags = Array.from(new Set(segDishes.flatMap((d) => d.flavorTags)));
    const segAvgIntensity =
      segDishes.length > 0
        ? segDishes.reduce((s, d) => s + d.intensity, 0) / segDishes.length
        : i === 0
          ? 2
          : i === 1
            ? 3
            : 4;

    // Candidate pool in exact requested category not yet used
    let candidates = eligiblePool.filter(
      (w) => w.category === requestedCat && !usedIds.has(w.id)
    );
    if (candidates.length === 0) {
      // Allow fallback across distinct in-stock wines if cellar is out of that exact category
      usedFallbackCategory = true;
      candidates = eligiblePool.filter((w) => !usedIds.has(w.id));
    }
    if (candidates.length === 0) {
      candidates = eligiblePool;
    }

    // For repeated categories (e.g. 화화화 / 샴샴샴 / 화레레), explicitly sort ascending by body weight
    // while reserving enough heavier bottles for subsequent slots of the same category.
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
      const scoredSlot = candidates
        .map((wine) => ({
          wine,
          score: scoreWineForContext(wine, {
            persona,
            budgetWindow,
            flavorTags: segTags,
            avgIntensity: segAvgIntensity,
            bodyPref,
            sweetnessPref,
            occasion,
            tasteProfile,
            forcedCategory: requestedCat,
          }),
        }))
        .sort((a, b) => b.score - a.score);
      chosen = scoredSlot[0]?.wine;
    }

    if (!chosen) continue;
    usedIds.add(chosen.id);

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

    const segDishesKo = segDishes.map((d) => d.nameKo);
    const segDishesEn = segDishes.map((d) => d.nameEn);
    const slotNote = buildPersonaCommentary(
      chosen,
      persona,
      segDishesKo,
      segDishesEn,
      occasion,
      tasteProfile
    );

    const slotPrefixKo =
      coursePairingMode === 'custom_slots'
        ? `지정하신 [${CATEGORY_LABELS[requestedCat].shortKo}] 슬롯에 맞춰 `
        : '코스 강도 변화에 맞춰 ';
    const slotPrefixEn =
      coursePairingMode === 'custom_slots'
        ? `Matched to your chosen [${CATEGORY_LABELS[requestedCat].shortEn}] slot: `
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
    });
  }

  const totalPrice = sequence.reduce((sum, s) => sum + s.wine.venuePrice, 0);
  const comboNamesKo = sequence.map((s) => CATEGORY_LABELS[s.assignedCategory].shortKo).join(' → ');
  const comboNamesEn = sequence.map((s) => CATEGORY_LABELS[s.assignedCategory].shortEn).join(' → ');

  return {
    kind: 'course_sequence',
    persona,
    menuMode: 'course',
    serveFormat: courseServeFormat,
    bottleCount: effectiveBottleCount,
    coursePairingMode,
    totalPrice,
    overallNoteKo: isGlassCourse
      ? `${persona.nameKo}가 코스 흐름에 맞춰 1잔씩 부담 없이 즐기실 수 있도록 [${comboNamesKo}] 3잔 페어링을 구성했습니다.`
      : usedFallbackCategory
        ? `[${comboNamesKo}] 흐름으로 구성했습니다. 선택하신 주종 중 일부 재고가 소진되어 인접 주종으로 매끄럽게 보완했습니다.`
        : `${persona.nameKo}가 코스의 강도 곡선을 따라 [${comboNamesKo}] 시퀀스로 한 병씩 자연스럽게 이어지도록 설계했습니다.`,
    overallNoteEn: isGlassCourse
      ? `Curated by ${persona.nameEn}: a 3-glass [${comboNamesEn}] progression paced to every course.`
      : usedFallbackCategory
        ? `Built as [${comboNamesEn}]. Where a requested cellar style was out of stock, the closest in-stock style maintains course harmony.`
        : `Structured by ${persona.nameEn} along a [${comboNamesEn}] arc so texture and intensity rise alongside every plate.`,
    courseSequence: sequence,
    extraGlass: pickExtraGlass(
      usedIds,
      sequence.map((s) => s.assignedCategory)
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
