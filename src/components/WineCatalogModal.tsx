import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  ExternalLink,
  Globe,
  MapPin,
  Search,
  Wine,
  X,
} from 'lucide-react';
import type { Language, Venue, WineCategory, WineItem } from '../types/sommelier';
import { CATEGORY_LABELS, TRANSLATIONS, formatKrw } from '../i18n/translations';
import { CountryFlagBadge } from './icons/WineVectors';
import {
  AromaSpectrumCard,
  CompactAromaIconRow,
  ServingGuideStrip,
  StructureBalanceChart,
} from './TastingInfographics';
import { WineDeepEncyclopedia } from './WineDeepEncyclopedia';

interface WineCatalogViewProps {
  lang: Language;
  venue: Venue;
  inStockWines: WineItem[];
  onClose: () => void;
}

type CategoryTab = 'all' | 'btg' | WineCategory;
type SortKey = 'default' | 'price_asc' | 'price_desc' | 'name';

const COUNTRY_NAME_KO: Record<string, string> = {
  FR: '프랑스',
  IT: '이탈리아',
  US: '미국',
  ES: '스페인',
  DE: '독일',
  AT: '오스트리아',
  HU: '헝가리',
  CL: '칠레',
  AU: '호주',
  NZ: '뉴질랜드',
};

const COUNTRY_NAME_EN: Record<string, string> = {
  FR: 'France',
  IT: 'Italy',
  US: 'United States',
  ES: 'Spain',
  DE: 'Germany',
  AT: 'Austria',
  HU: 'Hungary',
  CL: 'Chile',
  AU: 'Australia',
  NZ: 'New Zealand',
};

const CATEGORY_ORDER: WineCategory[] = [
  'sparkling',
  'white',
  'rose_orange',
  'red',
  'dessert',
];

const CATEGORY_DOT_COLORS: Record<WineCategory, string> = {
  sparkling: '#9E7128',
  white: '#7E8F3E',
  rose_orange: '#C46348',
  red: '#6B1D2F',
  dessert: '#B8863B',
};

export const WineCatalogView: React.FC<WineCatalogViewProps> = ({
  lang,
  venue,
  inStockWines,
  onClose,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('default');
  const [selectedWine, setSelectedWine] = useState<WineItem | null>(null);
  const [showChartInModal, setShowChartInModal] = useState(false);

  const btgCount = useMemo(
    () => inStockWines.filter((w) => typeof w.glassPrice === 'number' && w.glassPrice > 0).length,
    [inStockWines]
  );

  const countries = useMemo(
    () => Array.from(new Set(inStockWines.map((w) => w.countryCode))),
    [inStockWines]
  );

  const filteredWines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = inStockWines.filter((w) => {
      if (activeTab === 'btg' && !(w.glassPrice && w.glassPrice > 0)) return false;
      if (activeTab !== 'all' && activeTab !== 'btg' && w.category !== activeTab) return false;
      if (countryFilter !== 'ALL' && w.countryCode !== countryFilter) return false;
      if (q.length > 0) {
        const hay = `${w.nameKo} ${w.nameEn} ${w.producer} ${w.varietalsKo} ${w.varietalsEn} ${w.regionKo} ${w.regionEn}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price_asc') {
      return [...list].sort((a, b) => a.venuePrice - b.venuePrice);
    }
    if (sortBy === 'price_desc') {
      return [...list].sort((a, b) => b.venuePrice - a.venuePrice);
    }
    if (sortBy === 'name') {
      return [...list].sort((a, b) =>
        (lang === 'ko' ? a.nameKo : a.nameEn).localeCompare(lang === 'ko' ? b.nameKo : b.nameEn)
      );
    }
    return list;
  }, [inStockWines, activeTab, countryFilter, searchQuery, sortBy, lang]);

  const groupedSections = useMemo(() => {
    const catsToShow =
      activeTab === 'all' || activeTab === 'btg' ? CATEGORY_ORDER : [activeTab];

    return catsToShow
      .map((cat) => {
        const catWines = filteredWines.filter((w) => w.category === cat);
        if (catWines.length === 0) return null;

        const countryMap = new Map<string, WineItem[]>();
        for (const w of catWines) {
          const arr = countryMap.get(w.countryCode) ?? [];
          arr.push(w);
          countryMap.set(w.countryCode, arr);
        }
        return {
          category: cat,
          count: catWines.length,
          countries: Array.from(countryMap.entries()),
        };
      })
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [filteredWines, activeTab]);

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 safe-bottom-scroll sm:px-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3.5 py-2 text-[13px] font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-tertiary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>{lang === 'ko' ? '맞춤 추천으로 돌아가기' : 'Back to Pairing Guide'}</span>
        </button>

        <div className="text-right">
          <div className="text-[11px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
            {lang === 'ko' ? venue.nameKo : venue.nameEn}
          </div>
          <h1 className="text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
            {lang === 'ko' ? `전체 와인 리스트 (${inStockWines.length}종)` : `Full Cellar List (${inStockWines.length})`}
          </h1>
        </div>
      </div>

      {/* Category Tabs Bar (Kairos Benchmark Style) */}
      <div className="somm-card sticky top-[68px] z-20 rounded-2xl p-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            data-surface={activeTab === 'all' ? 'accent' : undefined}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-bold transition-colors ${
              activeTab === 'all'
                ? 'btn-accent shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <span>{lang === 'ko' ? '전체' : 'All'}</span>
            <span className="tabular-nums opacity-85">{inStockWines.length}</span>
          </button>

          {btgCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('btg')}
              data-surface={activeTab === 'btg' ? 'accent' : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-bold transition-colors ${
                activeTab === 'btg'
                  ? 'btn-accent shadow-xs'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span>{lang === 'ko' ? '글라스 주문' : 'By the Glass'}</span>
              <span className="tabular-nums opacity-85">{btgCount}</span>
            </button>
          )}

          {CATEGORY_ORDER.map((cat) => {
            const cnt = inStockWines.filter((w) => w.category === cat).length;
            if (cnt === 0) return null;
            const active = activeTab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                data-surface={active ? 'accent' : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-bold transition-colors ${
                  active
                    ? 'btn-accent shadow-xs'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: active ? '#FFFFFF' : CATEGORY_DOT_COLORS[cat] }}
                />
                <span>{CATEGORY_LABELS[cat][lang === 'ko' ? 'shortKo' : 'shortEn']}</span>
                <span className="tabular-nums opacity-85">{cnt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle BTG Notice Banner when Glass options exist */}
      {btgCount > 0 && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2.5 text-center text-[12px] font-medium text-[var(--text-secondary)]">
          {lang === 'ko'
            ? `글라스 주문 가능 와인 ${btgCount}종이 준비되어 있습니다. 와인을 누르시면 상세 백과사전과 아로마 노트를 보실 수 있습니다.`
            : `${btgCount} selections are available by the glass. Tap any bottle for deep producer, terroir & vintage notes.`}
        </div>
      )}

      {/* Search + Country Filter + Sort Strip */}
      <div className="somm-card space-y-3 rounded-2xl p-3.5 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ko'
                  ? '와인명, 품종, 산지 검색 (예: 샹파뉴, 피노 누아)'
                  : 'Search wine, producer, grape, or region...'
              }
              className="w-full rounded-xl bg-[var(--bg-tertiary)] py-2.5 pl-10 pr-4 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--bg-tertiary)] px-3 py-2 text-[12px] font-semibold text-[var(--text-primary)]">
            <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.75} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent focus:outline-none"
            >
              <option value="default" className="bg-[var(--bg-secondary)]">
                {lang === 'ko' ? '기본 정렬' : 'Curated Order'}
              </option>
              <option value="price_asc" className="bg-[var(--bg-secondary)]">
                {lang === 'ko' ? '가격 낮은순' : 'Price: Low to High'}
              </option>
              <option value="price_desc" className="bg-[var(--bg-secondary)]">
                {lang === 'ko' ? '가격 높은순' : 'Price: High to Low'}
              </option>
              <option value="name" className="bg-[var(--bg-secondary)]">
                {lang === 'ko' ? '이름순' : 'Name A–Z'}
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCountryFilter('ALL')}
            data-surface={countryFilter === 'ALL' ? 'accent' : undefined}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              countryFilter === 'ALL'
                ? 'btn-accent'
                : 'somm-sub-surface text-[var(--text-secondary)]'
            }`}
          >
            {lang === 'ko' ? '전체 국가' : 'All Countries'}
          </button>
          {countries.map((code) => {
            const active = countryFilter === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setCountryFilter(code)}
                data-surface={active ? 'accent' : undefined}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  active
                    ? 'btn-accent'
                    : 'somm-sub-surface text-[var(--text-secondary)]'
                }`}
              >
                {lang === 'ko'
                  ? COUNTRY_NAME_KO[code] ?? code
                  : COUNTRY_NAME_EN[code] ?? code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Wine List Rows (Editorial List Layout) */}
      {groupedSections.length === 0 ? (
        <div className="somm-card rounded-3xl p-8 text-center text-[14px] text-[var(--text-secondary)]">
          {lang === 'ko'
            ? '조건에 맞는 와인이 없습니다. 검색어나 필터를 조정해 주세요.'
            : 'No wines match the selected filter.'}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSections.map((sec) => (
            <section key={sec.category} className="somm-card rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_DOT_COLORS[sec.category] }}
                  />
                  <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
                    {CATEGORY_LABELS[sec.category][lang]}
                  </h2>
                </div>
                <span className="text-[13px] font-bold tabular-nums text-[var(--text-secondary)]">
                  {sec.count}
                </span>
              </div>

              <div className="space-y-5">
                {sec.countries.map(([countryCode, list]) => (
                  <div key={countryCode}>
                    <div className="mb-2 border-b border-[var(--border-subtle)] pb-1.5 text-[12px] font-bold text-[var(--text-secondary)]">
                      {lang === 'ko'
                        ? COUNTRY_NAME_KO[countryCode] ?? countryCode
                        : COUNTRY_NAME_EN[countryCode] ?? countryCode}
                    </div>

                    <div className="divide-y divide-[var(--border-subtle)]">
                      {list.map((wine) => (
                        <button
                          key={wine.id}
                          type="button"
                          onClick={() => {
                            setSelectedWine(wine);
                            setShowChartInModal(false);
                          }}
                          className="flex w-full items-start justify-between gap-4 py-3.5 text-left transition-colors hover:bg-[var(--bg-tertiary)]/40"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[15px] font-bold leading-snug text-[#6B1D2F] dark:text-[#E59BAE]">
                              {lang === 'ko' ? wine.nameKo : wine.nameEn}{' '}
                              <span className="font-medium tabular-nums text-[var(--text-secondary)]">
                                {wine.vintage}
                              </span>
                            </div>
                            <div className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                              {lang === 'ko' ? wine.regionKo : wine.regionEn} ·{' '}
                              {lang === 'ko' ? wine.varietalsKo : wine.varietalsEn}
                            </div>
                            {wine.glassPrice && wine.glassPrice > 0 && (
                              <span className="mt-1.5 inline-block rounded-full bg-[#EFE6E4] px-2.5 py-0.5 text-[10px] font-bold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
                                {lang === 'ko' ? '글라스 주문 가능' : 'Available by Glass'}
                              </span>
                            )}
                          </div>

                          <div className="shrink-0 text-right tabular-nums">
                            {wine.glassPrice && wine.glassPrice > 0 ? (
                              <div>
                                <div className="text-[14px] font-bold text-[var(--text-primary)]">
                                  {formatKrw(wine.glassPrice, lang)}{' '}
                                  <span className="text-[12px] font-normal text-[var(--text-secondary)]">
                                    / {formatKrw(wine.venuePrice, lang)}
                                  </span>
                                </div>
                                <div className="text-[10px] text-[var(--text-secondary)]">
                                  {lang === 'ko' ? '글라스 / 바틀' : 'Glass / Bottle'}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[15px] font-bold text-[var(--text-primary)]">
                                {formatKrw(wine.venuePrice, lang)}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Selected Wine Deep Encyclopedia Sheet Modal (Kairos Image 1 & 4 Layout) */}
      {selectedWine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          onClick={() => setSelectedWine(null)}
        >
          <div
            className="somm-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Close */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CATEGORY_DOT_COLORS[selectedWine.category] }}
                  />
                  <span>{CATEGORY_LABELS[selectedWine.category][lang]}</span>
                </div>
                <h2 className="mt-1 text-[22px] font-bold leading-snug text-[#6B1D2F] dark:text-[#FFFFFF]">
                  {lang === 'ko' ? selectedWine.nameKo : selectedWine.nameEn}{' '}
                  <span className="font-semibold tabular-nums text-[var(--text-secondary)]">
                    {selectedWine.vintage}
                  </span>
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWine(null)}
                aria-label="Close detail"
                className="somm-sub-surface rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Clean Spec Summary Grid (Region / Varietal / Vintage / Price) */}
            <dl className="mt-4 divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 text-[13px]">
              <div className="flex items-start justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-[var(--text-secondary)]">
                  {lang === 'ko' ? '산지' : 'Origin'}
                </dt>
                <dd className="text-right font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                  {lang === 'ko' ? selectedWine.regionKo : selectedWine.regionEn}
                  <span className="ml-2 inline-block align-middle">
                    <CountryFlagBadge countryCode={selectedWine.countryCode} lang={lang} />
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-[var(--text-secondary)]">
                  {lang === 'ko' ? '품종' : 'Varietal'}
                </dt>
                <dd className="text-right font-semibold text-[#1F5B3A] dark:text-[#9ED8B6]">
                  {lang === 'ko' ? selectedWine.varietalsKo : selectedWine.varietalsEn}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-[var(--text-secondary)]">
                  {lang === 'ko' ? '빈티지' : 'Vintage'}
                </dt>
                <dd className="font-bold tabular-nums text-[var(--text-primary)]">
                  {selectedWine.vintage}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-[var(--text-secondary)]">
                  {lang === 'ko' ? '가격' : 'Price'}
                </dt>
                <dd className="text-right font-bold tabular-nums text-[var(--text-primary)]">
                  {selectedWine.glassPrice && selectedWine.glassPrice > 0
                    ? `${formatKrw(selectedWine.glassPrice, lang)} (Glass) / ${formatKrw(selectedWine.venuePrice, lang)} (Bottle)`
                    : formatKrw(selectedWine.venuePrice, lang)}
                </dd>
              </div>
            </dl>

            {/* Intuitive 5-Icon Aroma Strip + Optional Full Chart Toggle */}
            <div className="mt-4 space-y-2">
              <CompactAromaIconRow wine={selectedWine} lang={lang} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowChartInModal((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#6B1D2F] underline underline-offset-4 dark:text-[#E59BAE]"
                >
                  <Wine className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>
                    {showChartInModal
                      ? lang === 'ko'
                        ? '구조 · 34종 아로마 휠 접기'
                        : 'Hide Detailed Wheel'
                      : lang === 'ko'
                        ? '구조 밸런스 · 34종 아로마 휠 보기'
                        : 'View Structure & 34-Aroma Wheel'}
                  </span>
                </button>
              </div>
              {showChartInModal && (
                <div className="space-y-3 pt-1">
                  <StructureBalanceChart wine={selectedWine} lang={lang} />
                  <AromaSpectrumCard wine={selectedWine} lang={lang} defaultExpanded={true} />
                  <ServingGuideStrip wine={selectedWine} lang={lang} valueTier={null} />
                </div>
              )}
            </div>

            {/* 6-Pillar Encyclopedia with Collapsible 3-Line Preview ("알아두기") */}
            <div className="mt-4">
              <WineDeepEncyclopedia wine={selectedWine} lang={lang} />
            </div>

            {/* Vineyard Location Link */}
            <div className="somm-sub-surface mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-[12px]">
                <MapPin className="h-4 w-4 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.5} />
                <span className="font-semibold text-[var(--text-primary)]">
                  {lang === 'ko'
                    ? selectedWine.storytelling.wineryLocation.placeLabelKo
                    : selectedWine.storytelling.wineryLocation.placeLabelEn}
                </span>
              </div>
              <a
                href={`https://earth.google.com/web/search/${encodeURIComponent(
                  selectedWine.storytelling.wineryLocation.earthQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-[#6B1D2F] px-3 py-1 text-[11px] font-semibold text-[#FFFFFF]"
              >
                <Globe className="h-3 w-3" strokeWidth={1.5} />
                <span>{t.openGoogleEarthBtn}</span>
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
