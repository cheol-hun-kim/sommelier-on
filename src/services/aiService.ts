import {
  SAMPLE_LABEL_SCAN_PRESET,
  SAMPLE_MENU_ALACARTE,
  SAMPLE_MENU_COURSE,
} from '../data/seedData';
import type {
  AromaKey,
  MenuAnalysisResult,
  WineCategory,
  WineStructure,
} from '../types/sommelier';
import { extractTagsFromFreeText } from '../engine/pairingEngine';
import { getGeminiApiKey } from './storageService';

export interface ScannedWineLabelDraft {
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
  marketPrice: number;
  venuePrice: number;
  stock: number;
  structure: WineStructure;
  aromas: {
    primary: AromaKey[];
    secondary: AromaKey[];
    tertiary: AromaKey[];
  };
}

function fileToBase64(file: File): Promise<{ mimeType: string; base64: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const parts = result.split(',');
      const base64 = parts[1] ?? '';
      resolve({ mimeType: file.type || 'image/jpeg', base64 });
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

async function callGeminiVisionJson<T>(
  apiKey: string,
  mimeType: string,
  base64: string,
  prompt: string
): Promise<T | null> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;
    return JSON.parse(rawText) as T;
  } catch {
    return null;
  }
}

export async function analyzeMenuImage(file: File): Promise<MenuAnalysisResult> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    const { mimeType, base64 } = await fileToBase64(file);
    const prompt = `Analyze this restaurant menu image. Determine if it is an "alacarte" (à la carte item list) or "course" (tasting/set course progression).
Return STRICT JSON matching:
{
  "mode": "alacarte" | "course",
  "summaryKo": "concise Korean 1-sentence summary",
  "summaryEn": "concise English 1-sentence summary",
  "dishes": [
    {
      "id": "d1",
      "stageKo": "optional course stage in Korean if course",
      "stageEn": "optional course stage in English if course",
      "nameKo": "dish name in Korean",
      "nameEn": "dish name in English",
      "flavorTags": ["steak"|"seafood"|"truffle"|"cream"|"poultry"|"spicy"|"korean_umami"|"dessert"|"delicate"|"rich"|"umami"],
      "intensity": 1..5
    }
  ]
}`;
    const parsed = await callGeminiVisionJson<{
      mode: 'alacarte' | 'course';
      summaryKo: string;
      summaryEn: string;
      dishes: Array<{
        id: string;
        stageKo?: string;
        stageEn?: string;
        nameKo: string;
        nameEn: string;
        flavorTags: string[];
        intensity: number;
      }>;
    }>(apiKey, mimeType, base64, prompt);

    if (parsed && Array.isArray(parsed.dishes) && parsed.dishes.length > 0) {
      return {
        sourceLabel: file.name,
        mode: parsed.mode === 'course' ? 'course' : 'alacarte',
        summaryKo: parsed.summaryKo,
        summaryEn: parsed.summaryEn,
        dishes: parsed.dishes.map((d, idx) => ({
          ...d,
          id: d.id || `vision_d_${idx}`,
          flavorTags:
            Array.isArray(d.flavorTags) && d.flavorTags.length > 0
              ? d.flavorTags
              : extractTagsFromFreeText(`${d.nameKo} ${d.nameEn}`).tags,
          intensity: Math.min(5, Math.max(1, Math.round(d.intensity || 3))),
          selected: parsed.mode === 'course' ? true : idx < 2,
        })),
      };
    }
  }

  // Deterministic built-in Vision simulation fallback when no live key is provided
  await new Promise((r) => setTimeout(r, 750));
  const lower = file.name.toLowerCase();
  const isCourse =
    lower.includes('course') ||
    lower.includes('코스') ||
    lower.includes('tasting') ||
    lower.includes('omakase') ||
    lower.includes('오마카세');

  const template = isCourse ? SAMPLE_MENU_COURSE : SAMPLE_MENU_ALACARTE;
  return {
    ...template,
    sourceLabel: file.name,
  };
}

export async function analyzeWineLabelImage(file: File): Promise<ScannedWineLabelDraft> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    const { mimeType, base64 } = await fileToBase64(file);
    const prompt = `Extract wine details from this bottle label photo.
Return STRICT JSON:
{
  "nameKo": "Korean wine name with producer and cuvée",
  "nameEn": "English wine name",
  "producer": "Producer name",
  "vintage": 2021,
  "category": "sparkling"|"white"|"rose_orange"|"red"|"dessert",
  "varietalsKo": "Korean grape varietal",
  "varietalsEn": "English grape varietal",
  "regionKo": "Korean region",
  "regionEn": "English region",
  "countryCode": "FR"|"IT"|"US"|"NZ"|"ES"|"DE",
  "marketPrice": 85000,
  "structure": {"body": 3, "acidity": 4, "tannin": 3, "sweetness": 1, "alcohol": 3},
  "primaryAromas": ["cherry","citrus","pear_apple","white_flower","blackcurrant"],
  "secondaryAromas": ["oak_cedar","pepper_spice","butter_brioche","honey"],
  "tertiaryAromas": ["mineral_stone","leather_earth","herbal_mint"]
}`;
    const parsed = await callGeminiVisionJson<{
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
      marketPrice: number;
      structure: WineStructure;
      primaryAromas?: AromaKey[];
      secondaryAromas?: AromaKey[];
      tertiaryAromas?: AromaKey[];
    }>(apiKey, mimeType, base64, prompt);

    if (parsed && parsed.nameKo) {
      const mPrice = Math.max(20000, Math.round(parsed.marketPrice || 75000));
      return {
        nameKo: parsed.nameKo,
        nameEn: parsed.nameEn || parsed.nameKo,
        producer: parsed.producer || 'Estate Producer',
        vintage: parsed.vintage || 2021,
        category: parsed.category || 'red',
        varietalsKo: parsed.varietalsKo || '블렌드',
        varietalsEn: parsed.varietalsEn || 'Blend',
        regionKo: parsed.regionKo || '프랑스',
        regionEn: parsed.regionEn || 'France',
        countryCode: parsed.countryCode || 'FR',
        marketPrice: mPrice,
        venuePrice: Math.round((mPrice * 1.4) / 1000) * 1000,
        stock: 6,
        structure: parsed.structure || { body: 3, acidity: 4, tannin: 3, sweetness: 1, alcohol: 3 },
        aromas: {
          primary: parsed.primaryAromas?.slice(0, 3) ?? ['cherry', 'citrus'],
          secondary: parsed.secondaryAromas?.slice(0, 2) ?? ['oak_cedar'],
          tertiary: parsed.tertiaryAromas?.slice(0, 2) ?? ['mineral_stone'],
        },
      };
    }
  }

  // Pilot fallback label extraction
  await new Promise((r) => setTimeout(r, 650));
  const lower = file.name.toLowerCase();
  if (lower.includes('champ') || lower.includes('krug') || lower.includes('샴페인')) {
    return {
      nameKo: '크뤼그 그랑 퀴베 171 에디션',
      nameEn: 'Krug Grande Cuvée 171ème Édition',
      producer: 'Maison Krug',
      vintage: 2015,
      category: 'sparkling',
      varietalsKo: '피노 누아, 샤르도네, 뫼니에',
      varietalsEn: 'Pinot Noir, Chardonnay, Meunier',
      regionKo: '프랑스 샹파뉴 랭스',
      regionEn: 'Champagne, France',
      countryCode: 'FR',
      marketPrice: 330000,
      venuePrice: 430000,
      stock: 3,
      structure: { body: 4, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
      aromas: {
        primary: ['citrus', 'pear_apple'],
        secondary: ['butter_brioche', 'honey'],
        tertiary: ['mineral_stone'],
      },
    };
  }
  if (lower.includes('chablis') || lower.includes('샤블리') || lower.includes('white')) {
    return {
      nameKo: '윌리엄 페브르 샤블리 그랑 크뤼 레 클로',
      nameEn: 'William Fèvre Chablis Grand Cru Les Clos',
      producer: 'Domaine William Fèvre',
      vintage: 2021,
      category: 'white',
      varietalsKo: '샤르도네 100%',
      varietalsEn: '100% Chardonnay',
      regionKo: '프랑스 부르고뉴 샤블리',
      regionEn: 'Chablis Grand Cru, France',
      countryCode: 'FR',
      marketPrice: 175000,
      venuePrice: 235000,
      stock: 4,
      structure: { body: 4, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
      aromas: {
        primary: ['citrus', 'white_flower'],
        secondary: ['butter_brioche'],
        tertiary: ['mineral_stone'],
      },
    };
  }

  return {
    ...SAMPLE_LABEL_SCAN_PRESET,
    aromas: {
      primary: [...SAMPLE_LABEL_SCAN_PRESET.aromas.primary],
      secondary: [...SAMPLE_LABEL_SCAN_PRESET.aromas.secondary],
      tertiary: [...SAMPLE_LABEL_SCAN_PRESET.aromas.tertiary],
    },
  };
}
