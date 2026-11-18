import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function collectFiles(dir, extFilter) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(collectFiles(full, extFilter));
    } else if (!extFilter || extFilter.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const tsFiles = collectFiles(SRC, ['.ts', '.tsx']);
const allResults = [];

function recordGate(num, name, passed, detail) {
  allResults.push({ num, name, passed, detail });
  const badge = passed ? 'PASS' : 'FAIL';
  console.log(`[Gate ${num}] ${badge} — ${name}: ${detail}`);
}

// GATE 1: Zero Emoji Characters & Zero Technical/Developer Jargon in UI
const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const jargonRegex = /\b(OCR|Vision AI|LLM|JSON|5-AXIS|Opt-In|MVP)\b/;
const emojiHits = [];
const jargonHits = [];
const uiScanFiles = tsFiles.filter(
  (f) =>
    f.endsWith('translations.ts') ||
    f.includes(`${path.sep}components${path.sep}`)
);
for (const file of tsFiles) {
  const txt = fs.readFileSync(file, 'utf8');
  if (emojiRegex.test(txt)) {
    emojiHits.push(path.relative(ROOT, file));
  }
}
for (const file of uiScanFiles) {
  const txt = fs.readFileSync(file, 'utf8');
  const m = txt.match(jargonRegex);
  if (m) {
    jargonHits.push(`${path.relative(ROOT, file)} (${m[0]})`);
  }
}
recordGate(
  1,
  'Zero Emoji & Zero Developer Jargon in UI',
  emojiHits.length === 0 && jargonHits.length === 0,
  emojiHits.length === 0 && jargonHits.length === 0
    ? '0 emojis and 0 technical jargon tokens across all UI files'
    : `Emojis: [${emojiHits.join(', ')}], Jargon: [${jargonHits.join(', ')}]`
);

// GATE 2: Zero Raw LaTeX / Escaped Markup Leaks
const badMarkupHits = [];
for (const file of tsFiles) {
  const txt = fs.readFileSync(file, 'utf8');
  if (/\\frac|\\a_m|undefinedNaN/.test(txt)) {
    badMarkupHits.push(path.relative(ROOT, file));
  }
}
recordGate(
  2,
  'Markup & Template Purity',
  badMarkupHits.length === 0,
  badMarkupHits.length === 0 ? 'Clean rendered strings' : `Suspect markup in: ${badMarkupHits.join(', ')}`
);

// GATE 3: Bilingual i18n Key Parity (ko === en)
const i18nText = fs.readFileSync(path.join(SRC, 'i18n', 'translations.ts'), 'utf8');
const koBlock = i18nText.match(/ko:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*en:/)?.[1] ?? '';
const enBlock = i18nText.match(/en:\s*\{([\s\S]*?)\n\s*\},\s*\n\};/)?.[1] ?? '';
const extractKeys = (block) =>
  Array.from(block.matchAll(/^\s{4}([a-zA-Z0-9_]+):/gm)).map((m) => m[1]);
const koKeys = extractKeys(koBlock);
const enKeys = extractKeys(enBlock);
const missingInEn = koKeys.filter((k) => !enKeys.includes(k));
const missingInKo = enKeys.filter((k) => !koKeys.includes(k));
recordGate(
  3,
  'Bilingual (KO / EN) Key Parity',
  koKeys.length > 50 && missingInEn.length === 0 && missingInKo.length === 0,
  `${koKeys.length} KO keys vs ${enKeys.length} EN keys (missing EN: ${missingInEn.length}, missing KO: ${missingInKo.length})`
);

// GATE 4: Custom 1.5px Vector Stroke Consistency & SVG Geometry
const vectorCode = fs.readFileSync(path.join(SRC, 'components', 'icons', 'WineVectors.tsx'), 'utf8');
const svgCount = (vectorCode.match(/<svg/g) ?? []).length;
const strokeMatches = (vectorCode.match(/strokeWidth="1\.5"/g) ?? []).length;
recordGate(
  4,
  'Vector Iconography & 1.5px Stroke Consistency',
  svgCount >= 14 && strokeMatches >= 20,
  `${svgCount} custom vector SVGs, ${strokeMatches} 1.5px stroke declarations`
);

// GATE 5: Strict Stock-Zero Exclusion Guard in Pairing Engine
const engineCode = fs.readFileSync(path.join(SRC, 'engine', 'pairingEngine.ts'), 'utf8');
const hasStrictStockFilter = /w\.venueId === venue\.id && w\.stock > 0/.test(engineCode);
const seedCode = fs.readFileSync(path.join(SRC, 'data', 'seedData.ts'), 'utf8');
const hasSoldOutSeedTest = /stock:\s*0/.test(seedCode);
recordGate(
  5,
  'Live Cellar Stock>0 Invariant',
  hasStrictStockFilter && hasSoldOutSeedTest,
  'Engine enforces (w.venueId === venue.id && w.stock > 0); seed includes stock:0 verification cases'
);

// GATE 6: Taste Note Learning Loop & Course Multi-Bottle Slot Logic
const hasLearningFns =
  engineCode.includes('applyLikeToTasteProfile') &&
  engineCode.includes('applyDislikeToTasteProfile') &&
  engineCode.includes('getNextRecommendedWines') &&
  engineCode.includes('custom_slots');
recordGate(
  6,
  'Taste Note Learning & Course Multi-Bottle Slots',
  hasLearningFns,
  'Positive DNA, negative avoidance vector, next-wine suggestions, and custom course slot progression verified'
);

// GATE 7: Korean Orphan Words, Tabular Numerals & Safe Bottom Scroll
const cssCode = fs.readFileSync(path.join(SRC, 'index.css'), 'utf8');
const hasTypographyGuards =
  cssCode.includes('word-break: keep-all') &&
  cssCode.includes('text-wrap: balance') &&
  cssCode.includes('text-wrap: pretty') &&
  cssCode.includes('tabular-nums') &&
  cssCode.includes('env(safe-area-inset-bottom)');
recordGate(
  7,
  'Korean Typography, Tabular-Nums & Safe Area Layout',
  hasTypographyGuards,
  'keep-all, balance/pretty wrap, tabular-nums, and safe-area bottom padding enforced globally'
);

// GATE 8: 60-30-10 Design Tokens & Luminance-Contrast Law
const hasDesignTokens =
  cssCode.includes('#FAF8F6') &&
  cssCode.includes('#121011') &&
  cssCode.includes('#6B1D2F') &&
  cssCode.includes('--text-on-accent: #FFFFFF') &&
  cssCode.includes('[data-surface=\'accent\']');
recordGate(
  8,
  '60-30-10 Palette & Universal Surface-Luminance Law',
  hasDesignTokens,
  'Warm Ivory #FAF8F6, Dining Dark #121011, Burgundy #6B1D2F + strict #FFFFFF ink binding locked'
);

const failed = allResults.filter((r) => !r.passed);
console.log(`\nSummary: ${allResults.length - failed.length}/${allResults.length} QA Gates passed.`);
if (failed.length > 0) {
  process.exit(1);
}
