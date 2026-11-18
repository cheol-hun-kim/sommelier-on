import assert from 'node:assert/strict';
import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const testSource = `
import { INITIAL_VENUES, INITIAL_WINES, SOMMELIER_PERSONAS, SAMPLE_MENU_COURSE } from './src/data/seedData.ts';
import {
  generatePairingRecommendation,
  swapSpecificWinesInBundle,
  applyLikeToTasteProfile,
  applyDislikeToTasteProfile,
  getNextRecommendedWines,
} from './src/engine/pairingEngine.ts';
import { DEFAULT_TASTE_PROFILE } from './src/services/storageService.ts';

const v1 = INITIAL_VENUES[0];
const v2 = INITIAL_VENUES[1];
const p1 = SOMMELIER_PERSONAS[0];

// 1. Single recommendation excludes stock===0 and other venues
const single = generatePairingRecommendation({
  venue: v1,
  wines: INITIAL_WINES,
  persona: p1,
  budgetTier: '100_150',
  budgetScope: 'per_bottle',
  selectedDishes: [
    { id: 'd1', nameKo: '스테이크', nameEn: 'Steak', flavorTags: ['steak', 'rich'], intensity: 5, selected: true },
  ],
  bodyPref: 'full',
  sweetnessPref: 'dry',
  occasion: 'date',
  menuMode: 'alacarte',
  courseBottleCount: 1,
  coursePairingMode: 'ai_auto',
  customSlots: ['sparkling', 'white', 'red'],
  tasteProfile: DEFAULT_TASTE_PROFILE,
});
if (single.singleItems.length !== 3) throw new Error('Expected 3 single items');
if (!single.singleItems.every((x) => x.wine.stock > 0 && x.wine.venueId === 'pilot_01')) {
  throw new Error('Stock=0 or cross-venue wine leaked into single recommendations');
}

// 2. Course 3-bottle AI auto
const courseAuto = generatePairingRecommendation({
  venue: v1,
  wines: INITIAL_WINES,
  persona: p1,
  budgetTier: '100_150',
  budgetScope: 'per_bottle',
  selectedDishes: SAMPLE_MENU_COURSE.dishes,
  bodyPref: 'any',
  sweetnessPref: 'any',
  occasion: 'celebration',
  menuMode: 'course',
  courseBottleCount: 3,
  coursePairingMode: 'ai_auto',
  customSlots: ['sparkling', 'white', 'red'],
  tasteProfile: DEFAULT_TASTE_PROFILE,
});
if (courseAuto.courseSequence.length !== 3) throw new Error('Expected 3 bottles in courseAuto');
if (new Set(courseAuto.courseSequence.map((s) => s.wine.id)).size !== 3) {
  throw new Error('Duplicate bottles in courseAuto');
}

// 3. Course 3-bottle Custom 화화화 (White-White-White ascending body)
const white3 = generatePairingRecommendation({
  venue: v1,
  wines: INITIAL_WINES,
  persona: SOMMELIER_PERSONAS[1],
  budgetTier: '50_100',
  budgetScope: 'per_bottle',
  selectedDishes: SAMPLE_MENU_COURSE.dishes,
  bodyPref: 'any',
  sweetnessPref: 'any',
  occasion: 'date',
  menuMode: 'course',
  courseBottleCount: 3,
  coursePairingMode: 'custom_slots',
  customSlots: ['white', 'white', 'white'],
  tasteProfile: DEFAULT_TASTE_PROFILE,
});
if (!white3.courseSequence.every((s) => s.wine.category === 'white')) {
  throw new Error('Not all slots white in white3');
}
if (new Set(white3.courseSequence.map((s) => s.wine.id)).size !== 3) {
  throw new Error('Expected 3 distinct whites in 화화화');
}
if (
  white3.courseSequence[0].wine.structure.body > white3.courseSequence[1].wine.structure.body ||
  white3.courseSequence[1].wine.structure.body > white3.courseSequence[2].wine.structure.body
) {
  throw new Error('White sequence must monotonically ascend in body weight');
}

// 4. Course 3-bottle Custom 샴샴샴
const spk3 = generatePairingRecommendation({
  venue: v1,
  wines: INITIAL_WINES,
  persona: p1,
  budgetTier: '100_150',
  budgetScope: 'per_bottle',
  selectedDishes: SAMPLE_MENU_COURSE.dishes,
  bodyPref: 'any',
  sweetnessPref: 'any',
  occasion: 'celebration',
  menuMode: 'course',
  courseBottleCount: 3,
  coursePairingMode: 'custom_slots',
  customSlots: ['sparkling', 'sparkling', 'sparkling'],
  tasteProfile: DEFAULT_TASTE_PROFILE,
});
if (!spk3.courseSequence.every((s) => s.wine.category === 'sparkling')) {
  throw new Error('Not all slots sparkling in spk3');
}
if (new Set(spk3.courseSequence.map((s) => s.wine.id)).size !== 3) {
  throw new Error('Expected 3 distinct sparkling wines in 샴샴샴');
}
if (
  spk3.courseSequence[0].wine.structure.body > spk3.courseSequence[1].wine.structure.body ||
  spk3.courseSequence[1].wine.structure.body > spk3.courseSequence[2].wine.structure.body
) {
  throw new Error('Sparkling sequence must monotonically ascend in body weight');
}

// 5. Venue 2 isolation
const v2Rec = generatePairingRecommendation({
  venue: v2,
  wines: INITIAL_WINES,
  persona: SOMMELIER_PERSONAS[1],
  budgetTier: '100_150',
  budgetScope: 'per_bottle',
  selectedDishes: [
    { id: 'h1', nameKo: '한우 갈비', nameEn: 'Galbi', flavorTags: ['steak', 'korean_umami'], intensity: 5, selected: true },
  ],
  bodyPref: 'any',
  sweetnessPref: 'any',
  occasion: 'business',
  menuMode: 'alacarte',
  courseBottleCount: 1,
  coursePairingMode: 'ai_auto',
  customSlots: ['sparkling', 'white', 'red'],
  tasteProfile: DEFAULT_TASTE_PROFILE,
});
if (!v2Rec.singleItems.every((x) => x.wine.venueId === 'pilot_02' && x.wine.stock > 0)) {
  throw new Error('Venue 2 isolation failed');
}

// 6. Feedback Loop (Like + Dislike aversion)
const heavyRed = INITIAL_WINES.find((w) => w.id === 'w_p1_red_3');
const liked = applyLikeToTasteProfile(DEFAULT_TASTE_PROFILE, heavyRed);
const nextWines = getNextRecommendedWines(heavyRed, INITIAL_WINES, 'pilot_01');
if (nextWines.length !== 2 || !nextWines.every((w) => w.stock > 0 && w.id !== heavyRed.id)) {
  throw new Error('Next recommended wines failed');
}

const disliked = applyDislikeToTasteProfile(DEFAULT_TASTE_PROFILE, heavyRed, ['too_tannic'], 'ko');
const reRec = generatePairingRecommendation({
  venue: v1,
  wines: INITIAL_WINES,
  persona: p1,
  budgetTier: '100_150',
  budgetScope: 'per_bottle',
  selectedDishes: [
    { id: 'd1', nameKo: '스테이크', nameEn: 'Steak', flavorTags: ['steak'], intensity: 5, selected: true },
  ],
  bodyPref: 'any',
  sweetnessPref: 'any',
  occasion: 'date',
  menuMode: 'alacarte',
  courseBottleCount: 1,
  coursePairingMode: 'ai_auto',
  customSlots: ['sparkling', 'white', 'red'],
  tasteProfile: disliked,
});
if (reRec.singleItems[0].wine.id === heavyRed.id) {
  throw new Error('Expected top recommendation to avoid overly tannic bottle after dislike');
}
if (reRec.singleItems[0].wine.category !== 'red' || reRec.singleItems[0].wine.structure.tannin > 3) {
  throw new Error('Expected top steak recommendation after too_tannic to pivot to silky low-tannin red');
}

// 7. Selective Bottle Swap preserves unchecked bottles and replaces checked bottle
const swappedCourse = swapSpecificWinesInBundle(
  courseAuto,
  0,
  [courseAuto.courseSequence[1].wine.id],
  [],
  {
    venue: v1,
    wines: INITIAL_WINES,
    persona: p1,
    budgetTier: '100_150',
    budgetScope: 'per_bottle',
    selectedDishes: SAMPLE_MENU_COURSE.dishes,
    bodyPref: 'any',
    sweetnessPref: 'any',
    occasion: 'celebration',
    menuMode: 'course',
    courseBottleCount: 3,
    coursePairingMode: 'ai_auto',
    customSlots: ['sparkling', 'white', 'red'],
    tasteProfile: DEFAULT_TASTE_PROFILE,
  }
);
if (
  swappedCourse.courseSequence[0].wine.id !== courseAuto.courseSequence[0].wine.id ||
  swappedCourse.courseSequence[2].wine.id !== courseAuto.courseSequence[2].wine.id ||
  swappedCourse.courseSequence[1].wine.id === courseAuto.courseSequence[1].wine.id
) {
  throw new Error('Selective swap must keep unchecked bottles and replace checked bottle');
}

// 8. Different Sommelier Personas must curate genuinely different wine recommendations
const personaPicks = SOMMELIER_PERSONAS.map((pers) =>
  generatePairingRecommendation({
    venue: v1,
    wines: INITIAL_WINES,
    persona: pers,
    budgetTier: '100_150',
    budgetScope: 'per_bottle',
    selectedDishes: [
      { id: 'd1', nameKo: '채끝 스테이크 & 버섯 리조또', nameEn: 'Steak & Risotto', flavorTags: ['steak', 'truffle', 'umami'], intensity: 4, selected: true },
    ],
    bodyPref: 'any',
    sweetnessPref: 'any',
    occasion: 'date',
    menuMode: 'alacarte',
    courseBottleCount: 1,
    coursePairingMode: 'ai_auto',
    customSlots: ['sparkling', 'white', 'red'],
    tasteProfile: DEFAULT_TASTE_PROFILE,
  }).singleItems[0].wine.nameKo
);
if (new Set(personaPicks).size < 2) {
  throw new Error('Different sommeliers must produce distinct top recommendations: ' + personaPicks.join(', '));
}

export const testSummary = {
  singleTop: single.singleItems[0].wine.nameKo,
  courseAutoSeq: courseAuto.courseSequence.map((s) => s.wine.nameKo),
  white3Seq: white3.courseSequence.map((s) => s.wine.nameKo + ' (body ' + s.wine.structure.body + ')'),
  spk3Seq: spk3.courseSequence.map((s) => s.wine.nameKo),
  venue2Top: v2Rec.singleItems[0].wine.nameKo,
  reRecTopAfterTooTannic: reRec.singleItems[0].wine.nameKo,
  nextSimilarAfterLike: nextWines.map((w) => w.nameKo),
  personaTopPicks: personaPicks,
};
`;

const result = await build({
  stdin: { contents: testSource, resolveDir: ROOT, loader: 'ts' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});

const dataUrl =
  'data:text/javascript;base64,' +
  Buffer.from(result.outputFiles[0].text).toString('base64');
try {
  const { testSummary } = await import(dataUrl);
  assert.ok(testSummary.courseAutoSeq.length === 3);
  console.log('ALL BEHAVIORAL ENGINE TESTS PASSED:');
  console.log(JSON.stringify(testSummary, null, 2));
} catch (err) {
  console.error('BEHAVIORAL TEST FAILED:', err instanceof Error ? err.message : err);
  process.exit(1);
}
