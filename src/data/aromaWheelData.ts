import type { WineItem } from '../types/sommelier';

export type AromaWheelTier = 'primary' | 'secondary' | 'tertiary';

export interface AromaDescriptor {
  id: string;
  tier: AromaWheelTier;
  subGroupKo: string;
  subGroupEn: string;
  labelKo: string;
  labelEn: string;
  color: string;
}

/**
 * 34 non-overlapping detailed tasting notes spanning Primary (1차향), Secondary (2차향), and Tertiary (3차향),
 * modeled after professional sommelier tasting wheels (Image 3 right-hand page level detail).
 */
export const DETAILED_AROMA_CATALOG: AromaDescriptor[] = [
  // === 1차향 (Primary: Fruit, Floral, Herb) — 16 items ===
  { id: 'black_cherry', tier: 'primary', subGroupKo: '검은 과일', subGroupEn: 'Black Fruit', labelKo: '블랙체리', labelEn: 'Black Cherry', color: '#5E1A32' },
  { id: 'blackcurrant', tier: 'primary', subGroupKo: '검은 과일', subGroupEn: 'Black Fruit', labelKo: '블랙커런트', labelEn: 'Blackcurrant', color: '#5E1A32' },
  { id: 'blackberry', tier: 'primary', subGroupKo: '검은 과일', subGroupEn: 'Black Fruit', labelKo: '블랙베리', labelEn: 'Blackberry', color: '#5E1A32' },
  { id: 'black_plum', tier: 'primary', subGroupKo: '검은 과일', subGroupEn: 'Black Fruit', labelKo: '검은 자두', labelEn: 'Black Plum', color: '#5E1A32' },

  { id: 'red_currant', tier: 'primary', subGroupKo: '붉은 과일', subGroupEn: 'Red Fruit', labelKo: '레드커런트', labelEn: 'Red Currant', color: '#9E2A3B' },
  { id: 'cherry', tier: 'primary', subGroupKo: '붉은 과일', subGroupEn: 'Red Fruit', labelKo: '붉은 체리', labelEn: 'Red Cherry', color: '#9E2A3B' },
  { id: 'raspberry', tier: 'primary', subGroupKo: '붉은 과일', subGroupEn: 'Red Fruit', labelKo: '산딸기', labelEn: 'Raspberry', color: '#9E2A3B' },
  { id: 'cranberry', tier: 'primary', subGroupKo: '붉은 과일', subGroupEn: 'Red Fruit', labelKo: '크랜베리', labelEn: 'Cranberry', color: '#9E2A3B' },

  { id: 'lemon_yuzu', tier: 'primary', subGroupKo: '감귤·과수', subGroupEn: 'Citrus & Orchard', labelKo: '레몬·유자', labelEn: 'Lemon & Yuzu', color: '#A38B27' },
  { id: 'green_apple_pear', tier: 'primary', subGroupKo: '감귤·과수', subGroupEn: 'Citrus & Orchard', labelKo: '청사과·서양배', labelEn: 'Green Apple & Pear', color: '#A38B27' },
  { id: 'white_peach', tier: 'primary', subGroupKo: '감귤·과수', subGroupEn: 'Citrus & Orchard', labelKo: '흰 복숭아', labelEn: 'White Peach', color: '#B37A3C' },
  { id: 'apricot_orange', tier: 'primary', subGroupKo: '감귤·과수', subGroupEn: 'Citrus & Orchard', labelKo: '살구·오렌지 껍질', labelEn: 'Apricot & Zest', color: '#B37A3C' },

  { id: 'white_blossom', tier: 'primary', subGroupKo: '꽃·허브', subGroupEn: 'Floral & Herbal', labelKo: '흰 꽃·아카시아', labelEn: 'Acacia & White Blossom', color: '#5B7C47' },
  { id: 'violet_rose', tier: 'primary', subGroupKo: '꽃·허브', subGroupEn: 'Floral & Herbal', labelKo: '바이올렛·장미', labelEn: 'Violet & Dried Rose', color: '#7D3C5C' },
  { id: 'mint_eucalyptus', tier: 'primary', subGroupKo: '꽃·허브', subGroupEn: 'Floral & Herbal', labelKo: '민트·유칼립투스', labelEn: 'Mint & Eucalyptus', color: '#4E7546' },
  { id: 'thyme_pepper', tier: 'primary', subGroupKo: '꽃·허브', subGroupEn: 'Floral & Herbal', labelKo: '타임·흑후추', labelEn: 'Thyme & Black Pepper', color: '#4E7546' },

  // === 2차향 (Secondary: Oak, Yeast, Malolactic Fermentation) — 9 items ===
  { id: 'vanilla', tier: 'secondary', subGroupKo: '오크·향신료', subGroupEn: 'Oak & Spice', labelKo: '바닐라', labelEn: 'Vanilla', color: '#B8762E' },
  { id: 'cedar', tier: 'secondary', subGroupKo: '오크·향신료', subGroupEn: 'Oak & Spice', labelKo: '삼나무', labelEn: 'Cedarwood', color: '#B8762E' },
  { id: 'mocha_cocoa', tier: 'secondary', subGroupKo: '오크·향신료', subGroupEn: 'Oak & Spice', labelKo: '모카·코코아 닙스', labelEn: 'Mocha & Cacao Nibs', color: '#9E5C26' },
  { id: 'baking_spice', tier: 'secondary', subGroupKo: '오크·향신료', subGroupEn: 'Oak & Spice', labelKo: '시나몬·제과 향신료', labelEn: 'Cinnamon & Baking Spice', color: '#B8762E' },
  { id: 'clove_nutmeg', tier: 'secondary', subGroupKo: '오크·향신료', subGroupEn: 'Oak & Spice', labelKo: '정향·넛맥', labelEn: 'Clove & Nutmeg', color: '#9E5C26' },

  { id: 'brioche', tier: 'secondary', subGroupKo: '효모·유산 발효', subGroupEn: 'Lees & Butter', labelKo: '구운 브리오슈', labelEn: 'Toasted Brioche', color: '#C49435' },
  { id: 'butter_cream', tier: 'secondary', subGroupKo: '효모·유산 발효', subGroupEn: 'Lees & Butter', labelKo: '발효 버터·크림', labelEn: 'Cultured Butter & Cream', color: '#C49435' },
  { id: 'hazelnut_almond', tier: 'secondary', subGroupKo: '효모·유산 발효', subGroupEn: 'Lees & Butter', labelKo: '구운 헤이즐넛·아몬드', labelEn: 'Roasted Hazelnut & Almond', color: '#B08434' },
  { id: 'coffee_toast', tier: 'secondary', subGroupKo: '효모·유산 발효', subGroupEn: 'Lees & Butter', labelKo: '에스프레소·오크 토스트', labelEn: 'Espresso & Oak Toast', color: '#9E5C26' },

  // === 3차향 (Tertiary: Aging, Earth, Mineral, Oxidative) — 9 items ===
  { id: 'leather', tier: 'tertiary', subGroupKo: '숙성·야성미', subGroupEn: 'Bottle Age', labelKo: '부드러운 가죽', labelEn: 'Supple Leather', color: '#6E5A4F' },
  { id: 'pipe_tobacco', tier: 'tertiary', subGroupKo: '숙성·야성미', subGroupEn: 'Bottle Age', labelKo: '파이프 담배', labelEn: 'Pipe Tobacco', color: '#6E5A4F' },
  { id: 'dried_fig', tier: 'tertiary', subGroupKo: '숙성·야성미', subGroupEn: 'Bottle Age', labelKo: '말린 무화과·건과', labelEn: 'Dried Fig & Prune', color: '#7D6048' },
  { id: 'wild_honey', tier: 'tertiary', subGroupKo: '숙성·야성미', subGroupEn: 'Bottle Age', labelKo: '야생 꿀·마멀레이드', labelEn: 'Wild Honey & Marmalade', color: '#A38338' },

  { id: 'wet_chalk', tier: 'tertiary', subGroupKo: '토양·미네랄', subGroupEn: 'Earth & Mineral', labelKo: '젖은 돌·백악질', labelEn: 'Wet Chalk & Limestone', color: '#586468' },
  { id: 'graphite', tier: 'tertiary', subGroupKo: '토양·미네랄', subGroupEn: 'Earth & Mineral', labelKo: '흑연·연필심', labelEn: 'Graphite & Pencil Lead', color: '#586468' },
  { id: 'truffle_forest', tier: 'tertiary', subGroupKo: '토양·미네랄', subGroupEn: 'Earth & Mineral', labelKo: '트러플·젖은 낙엽', labelEn: 'Truffle & Forest Floor', color: '#635B48' },
  { id: 'smoke_gravel', tier: 'tertiary', subGroupKo: '토양·미네랄', subGroupEn: 'Earth & Mineral', labelKo: '연기·젖은 자갈', labelEn: 'Smoke & Wet Gravel', color: '#586468' },
  { id: 'wax_ginger', tier: 'tertiary', subGroupKo: '토양·미네랄', subGroupEn: 'Earth & Mineral', labelKo: '밀랍·말린 생강', labelEn: 'Beeswax & Candied Ginger', color: '#8A7945' },
];

export interface WineDetailedWheelResult {
  activeIds: Set<string>;
  primaryActive: AromaDescriptor[];
  secondaryActive: AromaDescriptor[];
  tertiaryActive: AromaDescriptor[];
}

/**
 * Generates rich, strictly non-overlapping Primary / Secondary / Tertiary descriptors
 * tailored to each wine's varietal, category, region, vintage age, and structure.
 */
export function deriveDetailedWheelForWine(wine: WineItem): WineDetailedWheelResult {
  const txt = `${wine.nameKo} ${wine.nameEn} ${wine.varietalsKo} ${wine.varietalsEn} ${wine.regionKo} ${wine.regionEn}`.toLowerCase();
  const picked = new Set<string>();
  const age = Math.max(0, new Date().getFullYear() - (wine.vintage || 2021));

  // Primary selection by style & core aromas
  if (wine.category === 'sparkling') {
    picked.add('lemon_yuzu');
    picked.add('green_apple_pear');
    picked.add('white_blossom');
    if (txt.includes('blanc de blancs') || txt.includes('샤르도네') || txt.includes('chardonnay')) {
      picked.add('white_peach');
    }
    if (txt.includes('rosé') || txt.includes('로제') || txt.includes('pinot noir')) {
      picked.add('raspberry');
    }
    picked.add('brioche');
    picked.add('hazelnut_almond');
    picked.add('butter_cream');
    picked.add('wet_chalk');
    if (age >= 7) picked.add('wild_honey');
    picked.add('smoke_gravel');
  } else if (wine.category === 'white') {
    picked.add('lemon_yuzu');
    picked.add('green_apple_pear');
    picked.add('white_blossom');
    if (wine.structure.body >= 4 || txt.includes('chardonnay') || txt.includes('샤르도네') || txt.includes('meursault')) {
      picked.add('white_peach');
      picked.add('butter_cream');
      picked.add('hazelnut_almond');
      picked.add('vanilla');
      picked.add('wet_chalk');
      picked.add('wax_ginger');
    } else {
      picked.add('apricot_orange');
      if (wine.structure.sweetness >= 2) picked.add('white_peach');
      picked.add('wet_chalk');
      picked.add('smoke_gravel');
      picked.add('wax_ginger');
      if (wine.aromas.secondary.includes('butter_brioche')) picked.add('brioche');
      else picked.add('hazelnut_almond');
    }
  } else if (wine.category === 'rose_orange') {
    picked.add('apricot_orange');
    picked.add('cranberry');
    picked.add('white_blossom');
    picked.add('thyme_pepper');
    picked.add('hazelnut_almond');
    picked.add('baking_spice');
    picked.add('wax_ginger');
    picked.add('smoke_gravel');
    picked.add('wild_honey');
  } else if (wine.category === 'dessert') {
    picked.add('apricot_orange');
    picked.add('white_peach');
    picked.add('white_blossom');
    picked.add('vanilla');
    picked.add('baking_spice');
    picked.add('butter_cream');
    picked.add('wild_honey');
    picked.add('wax_ginger');
    picked.add('dried_fig');
  } else {
    // Red wines (differentiate Pinot/Light vs Cabernet/Syrah/Full)
    const isLightBurgundy =
      wine.structure.body <= 3 ||
      txt.includes('pinot') ||
      txt.includes('피노') ||
      txt.includes('nebbiolo') ||
      txt.includes('네비올로');

    if (isLightBurgundy) {
      picked.add('cherry');
      picked.add('raspberry');
      picked.add('red_currant');
      picked.add('cranberry');
      picked.add('violet_rose');
      picked.add('thyme_pepper');
      picked.add('clove_nutmeg');
      picked.add('cedar');
      picked.add('truffle_forest');
      picked.add('leather');
      picked.add('smoke_gravel');
    } else {
      picked.add('black_cherry');
      picked.add('blackcurrant');
      picked.add('blackberry');
      picked.add('black_plum');
      picked.add('mint_eucalyptus');
      picked.add('thyme_pepper');
      picked.add('cedar');
      picked.add('vanilla');
      picked.add('mocha_cocoa');
      picked.add('coffee_toast');
      picked.add('graphite');
      picked.add('pipe_tobacco');
      picked.add('leather');
      if (age >= 6) picked.add('dried_fig');
    }
  }

  // Also map explicit WineAromas flags safely into distinct slots
  if (wine.aromas.primary.includes('citrus')) picked.add('lemon_yuzu');
  if (wine.aromas.primary.includes('herbal_mint')) picked.add('mint_eucalyptus');
  if (wine.aromas.secondary.includes('oak_cedar')) picked.add('cedar');
  if (wine.aromas.secondary.includes('pepper_spice')) picked.add('clove_nutmeg');
  if (wine.aromas.tertiary.includes('leather_earth')) picked.add('leather');
  if (wine.aromas.tertiary.includes('mineral_stone')) picked.add('wet_chalk');
  if (wine.aromas.tertiary.includes('honey')) picked.add('wild_honey');

  return {
    activeIds: picked,
    primaryActive: DETAILED_AROMA_CATALOG.filter((d) => d.tier === 'primary' && picked.has(d.id)),
    secondaryActive: DETAILED_AROMA_CATALOG.filter((d) => d.tier === 'secondary' && picked.has(d.id)),
    tertiaryActive: DETAILED_AROMA_CATALOG.filter((d) => d.tier === 'tertiary' && picked.has(d.id)),
  };
}
