import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import type { Language } from '../types/sommelier';

interface GlossaryEntry {
  term: string;
  ko: string;
  en: string;
}

const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  // Grape Varietals
  {
    term: '피노 누아',
    ko: '껍질이 얇고 섬세한 붉은 포도 품종. 떫은맛(타닌)이 적고 체리·라즈베리·장미 향이 나며 실크처럼 부드러워 한식이나 가금류와도 잘 어울립니다.',
    en: 'Pinot Noir — A thin-skinned red grape known for silky texture, low tannin, red cherry aromatics, and effortless versatility at the table.',
  },
  {
    term: 'Pinot Noir',
    ko: '껍질이 얇고 섬세한 붉은 포도 품종. 떫은맛(타닌)이 적고 체리·라즈베리 향이 나며 실크처럼 부드럽습니다.',
    en: 'A thin-skinned red grape celebrated for silky texture, gentle tannins, red cherry fruit, and aromatic elegance.',
  },
  {
    term: '샤르도네',
    ko: '전 세계에서 가장 사랑받는 화이트 포도 품종. 서늘한 곳에서는 상큼한 사과·미네랄 맛을, 오크통에 숙성하면 고소한 버터·크림 풍미를 보여줍니다.',
    en: 'Chardonnay — The world’s most versatile white grape, spanning crisp green apple and flinty minerality to rich toasted brioche.',
  },
  {
    term: 'Chardonnay',
    ko: '전 세계에서 가장 사랑받는 화이트 품종. 산지에 따라 상큼한 미네랄부터 고소한 버터·오크 풍미까지 다채롭게 변신합니다.',
    en: 'A benchmark white grape ranging from razor-sharp mineral precision in Chablis to creamy oak depth in Meursault.',
  },
  {
    term: '카베르네 소비뇽',
    ko: '짙은 색감과 탄탄한 떫은맛(타닌), 블랙커런트(카시스) 향을 지닌 대표적인 풀바디 레드 품종으로, 스테이크와 환상적인 궁합을 자랑합니다.',
    en: 'Cabernet Sauvignon — A structured, full-bodied red grape brimming with blackcurrant and cedar, classic beside grilled steak.',
  },
  {
    term: 'Cabernet Sauvignon',
    ko: '짙은 블랙커런트 향과 탄탄한 골격을 지녀 스테이크 등 육류 요리와 잘 어울리는 대표 레드 품종입니다.',
    en: 'A structured red grape famous for cassis fruit, firm tannin, and classic affinity with marbled beef.',
  },
  {
    term: '네비올로',
    ko: '이탈리아 피에몬테를 대표하는 고급 적포도. 색은 맑지만 말린 장미 향과 강한 타닌, 높은 산도를 지녀 오래 숙성할수록 깊어집니다.',
    en: 'Nebbiolo — Piedmont’s noble red grape pairing pale ruby color with dried rose perfume and firm, cellar-worthy grip.',
  },
  {
    term: '리슬링',
    ko: '상쾌한 산도와 복숭아·유자·꿀 같은 향긋함이 특징인 화이트 품종. 드라이한 스타일부터 매콤한 요리를 감싸는 살짝 단 스타일 모두 뛰어납니다.',
    en: 'Riesling — An aromatic white grape prized for electric acidity, orchard fruit, and remarkable balance from bone-dry to off-dry.',
  },
  {
    term: 'Riesling',
    ko: '맑은 산도와 향긋한 과실미가 돋보이는 화이트 품종으로 해산물부터 양념 요리까지 폭넓게 어울립니다.',
    en: 'An aromatic white grape prized for crystalline acidity and stone-fruit purity.',
  },
  {
    term: '슈냉 블랑',
    ko: '프랑스 루아르 밸리의 대표 청포도. 청사과·모과·흰 꽃 향기와 생동감 넘치는 산도가 매력적입니다.',
    en: 'Chenin Blanc — A vibrant Loire white grape offering quince, orchard pear, honeyed blossom, and lively acidity.',
  },
  {
    term: '모스카토',
    ko: '청포도·복숭아·아카시아 꽃 향기가 풍부하고 도수가 낮아, 와인 입문자나 디저트 타임에 기분 좋게 즐기기 좋은 품종입니다.',
    en: 'Moscato — Fragrant Muscat grape celebrated for sweet peach blossom aromatics and featherlight alcohol.',
  },
  {
    term: '메를로',
    ko: '카베르네 소비뇽보다 타닌이 둥글고 부드러워 블랙 플럼과 코코아 같은 벨벳 질감을 즐기기 좋은 레드 품종입니다.',
    en: 'Merlot — Plush, velvety red grape with supple tannins, ripe plum, and cocoa warmth.',
  },
  {
    term: 'Merlot',
    ko: '부드러운 질감과 잘 익은 자두·코코아 풍미가 매력적인 레드 품종입니다.',
    en: 'A supple, velvety red grape offering ripe plum and cocoa softness.',
  },
  // Regions
  {
    term: '부르고뉴',
    ko: '프랑스 중동부의 대표 와인 산지. 단일 품종(피노 누아·샤르도네)만으로 밭(테루아)의 미세한 개성을 가장 섬세하게 표현하는 지역입니다.',
    en: 'Burgundy — France’s storied region dedicated to single-vineyard expressions of Pinot Noir and Chardonnay.',
  },
  {
    term: 'Burgundy',
    ko: '피노 누아와 샤르도네로 밭마다 다른 섬세한 개성을 빚어내는 프랑스의 대표 와인 산지입니다.',
    en: 'France’s iconic region crafting nuanced, terroir-driven Pinot Noir and Chardonnay.',
  },
  {
    term: '샹파뉴',
    ko: '프랑스 북부 지역으로, 오직 이곳에서 전통 방식으로 만든 스파클링 와인만 "샴페인"이라 부를 수 있습니다.',
    en: 'Champagne — Northern France’s chalky appellation; only sparkling wines crafted here by traditional method earn the name Champagne.',
  },
  {
    term: 'Champagne',
    ko: '오직 프랑스 샹파뉴 지역에서 전통 병발효 방식으로 만든 스파클링 와인에만 허락되는 이름입니다.',
    en: 'The celebrated French appellation whose chalk soils yield the world’s benchmark sparkling wines.',
  },
  {
    term: '보르도',
    ko: '프랑스 남서부의 대표 산지. 여러 품종을 정교하게 블렌딩해 웅장한 구조감과 장기 숙성력을 갖춘 레드 및 소테른 디저트 와인으로 유명합니다.',
    en: 'Bordeaux — Southwest France’s benchmark for structured red blends and honeyed Sauternes.',
  },
  {
    term: 'Bordeaux',
    ko: '카베르네 소비뇽과 메를로 블렌딩 레드, 그리고 달콤한 소테른으로 유명한 프랑스 대표 산지입니다.',
    en: 'Historic French region famous for structured Cabernet-Merlot blends and golden Sauternes.',
  },
  {
    term: '샤블리',
    ko: '부르고뉴 최북단의 서늘한 화이트 산지. 고대 바다 굴 껍데기가 쌓인 토양 덕분에 오크향 없이 깨끗하고 짭짤한 미네랄이 돋보입니다.',
    en: 'Chablis — Cool northernmost Burgundy where fossilized oyster-shell limestone yields crisp, saline Chardonnay.',
  },
  {
    term: '뫼르소',
    ko: '부르고뉴에서 가장 풍만하고 고소한 헤이즐넛·버터 질감의 화이트 와인을 빚어내는 명품 마을입니다.',
    en: 'Meursault — Prized Côte de Beaune village celebrated for opulent, hazelnut-kissed Chardonnay.',
  },
  {
    term: '포이약',
    ko: '보르도 좌안의 핵심 마을로, 무통 로칠드·라피트 로칠드 같은 세계 최고 등급 그랑 크뤼 샤또들이 모여 있는 자갈 언덕입니다.',
    en: 'Pauillac — Heart of Bordeaux’s Left Bank gravel terraces, home to legendary Grand Cru Classé estates.',
  },
  {
    term: '루아르',
    ko: '프랑스에서 가장 긴 강을 따라 펼쳐진 산지로, 산뜻한 화이트와 우아한 스파클링 와인의 보고입니다.',
    en: 'Loire Valley — Scenic French river valley prized for vibrant whites, sparkling Crémant, and fresh reds.',
  },
  {
    term: '피에몬테',
    ko: '이탈리아 북서부 알프스 산기슭("산의 발치") 지역으로, 바롤로와 모스카토 다스티의 고향입니다.',
    en: 'Piedmont — Northwest Italy at the foot of the Alps, birthplace of Barolo and Moscato d’Asti.',
  },
  // Concepts
  {
    term: '테루아',
    ko: '포도가 자라는 땅의 토양, 지형, 일조량, 바람 등 자연환경 전체가 와인의 맛과 향에 스며든 고유한 개성을 뜻합니다.',
    en: 'Terroir — The complete natural environment (soil, slope, climate) giving a wine its unmistakable sense of place.',
  },
  {
    term: '타닌',
    ko: '포도 껍질·씨·오크통에서 나오는 성분으로, 입안을 조여주는 떫은감과 구조감을 만듭니다. 고기의 지방질과 만나면 부드럽게 중화됩니다.',
    en: 'Tannin — Natural grape-skin grip that creates structure on the palate and melts smoothly beside rich meat.',
  },
  {
    term: 'tannin',
    ko: '와인의 떫은감과 골격을 만드는 성분으로, 육류의 기름진 맛과 만나면 부드럽게 풀립니다.',
    en: 'Natural phenolic texture from grape skins that gives structure and pairs seamlessly with rich proteins.',
  },
  {
    term: '산도',
    ko: '입안에 침이 고이게 만드는 상큼한 산미입니다. 느끼한 음식이나 소스 뒤를 개운하게 씻어주는 핵심 역할을 합니다.',
    en: 'Acidity — Mouthwatering freshness that lifts flavors and cleanses the palate between rich bites.',
  },
  {
    term: 'acidity',
    ko: '와인에 생동감을 불어넣고 음식의 기름진 맛을 상쾌하게 정리해 주는 산미입니다.',
    en: 'Natural freshness that keeps a wine vibrant and refreshes the palate beside rich dishes.',
  },
  {
    term: '디캔팅',
    ko: '와인을 유리 디캔터에 미리 옮겨 담아 공기와 만나게 해주는 과정입니다. 잠들어 있던 향이 열리고 거친 타닌이 부드러워집니다.',
    en: 'Decanting — Pouring wine into a wide vessel before serving so aromas bloom and firm tannins soften.',
  },
  {
    term: '미네랄',
    ko: '과일 향 외에 젖은 돌, 조개껍질, 바다 바람처럼 느껴지는 서늘하고 짭조름한 뉘앙스입니다.',
    en: 'Mineral — Crisp, chalky, or saline sensations reminiscent of wet stone and sea spray.',
  },
  {
    term: '그랑 크뤼',
    ko: '프랑스에서 포도밭이나 샤또에 부여하는 최고 등급 명칭입니다.',
    en: 'Grand Cru — France’s highest vineyard classification denoting exceptional terroir.',
  },
  {
    term: '바이오다이나믹',
    ko: '화학 농약과 비료를 쓰지 않고 달의 주기와 자연 생태계에 맞춰 포도를 기르는 친환경 농법입니다.',
    en: 'Biodynamic — Holistic organic farming aligned with natural soil biodiversity and lunar cycles.',
  },
  {
    term: '비오디나미',
    ko: '화학 비료 없이 땅과 자연의 순환 리듬을 존중하며 포도를 기르는 농법입니다.',
    en: 'Holistic organic viticulture nurturing living soil without synthetic inputs.',
  },
  {
    term: '암포라',
    ko: '스테인리스나 오크통 대신 고대 방식의 점토 항아리에 와인을 발효·숙성하는 방식입니다. 깊은 감칠맛이 살아납니다.',
    en: 'Amphora — Ancient clay vessel used for fermentation and aging, yielding pure texture and savory depth.',
  },
  {
    term: '블랑 드 블랑',
    ko: '"화이트로 만든 화이트"라는 뜻으로, 청포도(주로 샤르도네 100%)만으로 빚어 산뜻하고 섬세한 샴페인을 가리킵니다.',
    en: 'Blanc de Blancs — Champagne crafted exclusively from white grapes (Chardonnay) for laser-crisp elegance.',
  },
  {
    term: '귀부',
    ko: '안개 낀 강가에서 포도 껍질에 이로운 곰팡이가 피어 수분이 증발하면서 꿀과 살구처럼 달콤한 풍미가 농축되는 현상입니다.',
    en: 'Noble Rot — Beneficial morning-mist botrytis that concentrates grape sugars into luscious honey and apricot.',
  },
  {
    term: '도자주',
    ko: '샴페인 병입 마지막 단계에서 균형을 맞추기 위해 소량의 당분을 더하는 과정입니다.',
    en: 'Dosage — The final touch of sweetness added before corking Champagne to balance brisk acidity.',
  },
];

// Sort longest term first so multi-word phrases match before substrings
const SORTED_ENTRIES = [...GLOSSARY_ENTRIES].sort(
  (a, b) => b.term.length - a.term.length
);

const ESCAPED_PATTERN = SORTED_ENTRIES.map((e) =>
  e.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
).join('|');
const TERM_REGEX = new RegExp(`(${ESCAPED_PATTERN})`, 'g');

export const GlossaryText: React.FC<{
  text: string;
  lang: Language;
  className?: string;
}> = ({ text, lang, className = '' }) => {
  const [activeEntry, setActiveEntry] = useState<GlossaryEntry | null>(null);

  const parts = text.split(TERM_REGEX);

  return (
    <>
      <span className={className}>
        {parts.map((part, idx) => {
          const matched = SORTED_ENTRIES.find((e) => e.term === part);
          if (!matched) {
            return <React.Fragment key={idx}>{part}</React.Fragment>;
          }
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveEntry(matched);
              }}
              className="inline cursor-pointer border-b border-dotted border-[#6B1D2F]/55 font-medium text-[#6B1D2F] transition-colors hover:border-[#6B1D2F] hover:opacity-80 dark:border-[#E59BAE]/55 dark:text-[#F4B8C6]"
            >
              {part}
            </button>
          );
        })}
      </span>

      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="somm-card relative w-full max-w-md rounded-3xl p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveEntry(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-2 text-[#6B1D2F] dark:text-[#E59BAE]">
              <BookOpen className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {lang === 'ko' ? '소믈리에 용어 노트' : 'Sommelier Glossary'}
              </span>
            </div>

            <h3 className="mt-2 text-[19px] font-bold text-[var(--text-primary)]">
              {activeEntry.term}
            </h3>
            <p className="prose-pretty mt-2 text-[14px] leading-[1.65] text-[var(--text-primary)]">
              {activeEntry[lang]}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
