import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  ListFilter,
  Plus,
  RotateCcw,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wine,
  X,
} from 'lucide-react';
import type {
  BudgetScope,
  BudgetTier,
  CorkageBottle,
  CourseBottleCount,
  CoursePairingMode,
  CourseServeFormat,
  Language,
  MenuAnalysisResult,
  ParsedMenuDish,
  SommelierPersona,
  UserTasteProfile,
  Venue,
  VisitTiming,
  WineCategory,
  WineItem,
  WineShop,
  WineSourceMode,
} from '../types/sommelier';
import {
  BUDGET_LABELS,
  CATEGORY_LABELS,
  TRANSLATIONS,
  formatKrw,
} from '../i18n/translations';
import { analyzeWineLabelImage } from '../services/aiService';
import { SommelierAvatar, VenueLogo } from './icons/WineVectors';
import { SlidingSwitch } from './SlidingSwitch';

export type Step1Page = 1 | 2 | 3 | 4 | 5 | 6;

interface GuestStep1Props {
  lang: Language;
  venue: Venue;
  personas: SommelierPersona[];
  selectedPersonaId: string;
  onInspectPersona: (persona: SommelierPersona) => void;
  step1Page: Step1Page;
  onStep1PageChange: (page: Step1Page) => void;
  budgetTier: BudgetTier;
  onBudgetTierChange: (tier: BudgetTier) => void;
  customBudgetManWon: string;
  onCustomBudgetManWonChange: (val: string) => void;
  budgetScope: BudgetScope;
  onBudgetScopeChange: (scope: BudgetScope) => void;
  corkageOnly: boolean;
  visitTiming: VisitTiming;
  onVisitTimingChange: (timing: VisitTiming) => void;
  wineSourceMode: WineSourceMode;
  onWineSourceModeChange: (mode: WineSourceMode) => void;
  personalCellar: WineItem[];
  onAddPersonalWine: (input: {
    name: string;
    category: WineCategory;
    vintage: number;
    price: number;
  }) => Promise<void>;
  onRemovePersonalWine: (id: string) => void;
  wineShops: WineShop[];
  selectedWineShopId: string;
  onSelectWineShopId: (id: string) => void;
  corkageWine: CorkageBottle | null;
  onCorkageWineChange: (bottle: CorkageBottle | null) => void;
  selectedRegisteredDishIds: string[];
  onToggleRegisteredDish: (dishId: string) => void;
  customDishes: ParsedMenuDish[];
  customDishInput: string;
  onCustomDishInputChange: (val: string) => void;
  onAddCustomDish: () => void;
  onRemoveCustomDish: (id: string) => void;
  menuAnalysis: MenuAnalysisResult | null;
  isAnalyzingMenu: boolean;
  onUploadMenuPhoto: (file: File) => void;
  onToggleOcrDish: (dishId: string) => void;
  onClearMenuAnalysis: () => void;
  pairingScope: 'course' | 'dishes';
  onPairingScopeChange: (scope: 'course' | 'dishes') => void;
  courseServeFormat: CourseServeFormat;
  onCourseServeFormatChange: (fmt: CourseServeFormat) => void;
  courseBottleCount: CourseBottleCount;
  onCourseBottleCountChange: (count: CourseBottleCount) => void;
  includeExtraGlass: boolean;
  onIncludeExtraGlassChange: (val: boolean) => void;
  coursePairingMode: CoursePairingMode;
  onCoursePairingModeChange: (mode: CoursePairingMode) => void;
  customSlots: WineCategory[];
  onChangeCustomSlot: (slotIdx: number, cat: WineCategory) => void;
  tasteProfile: UserTasteProfile;
  onResetTasteProfile: () => void;
  hasAnyDishSelected: boolean;
  onSubmitRecommend: () => void;
  onInstantCorkageSubmit: (bottle: CorkageBottle) => Promise<void>;
  onOpenCatalog: () => void;
}

const SLOT_CATEGORIES: WineCategory[] = [
  'sparkling',
  'white',
  'rose_orange',
  'red',
  'dessert',
];

const WIZARD_STEPS: Array<{ page: Step1Page; ko: string; en: string }> = [
  { page: 1, ko: '소믈리에', en: 'Host' },
  { page: 2, ko: '방문 시점', en: 'Timing' },
  { page: 3, ko: '요리', en: 'Dishes' },
  { page: 4, ko: '주문·예산', en: 'Budget & Size' },
  { page: 5, ko: '조합', en: 'Style' },
  { page: 6, ko: '출처·추천', en: 'Source' },
];

export const GuestStep1: React.FC<GuestStep1Props> = ({
  lang,
  venue,
  personas,
  selectedPersonaId,
  onInspectPersona,
  step1Page,
  onStep1PageChange,
  budgetTier,
  onBudgetTierChange,
  customBudgetManWon,
  onCustomBudgetManWonChange,
  budgetScope,
  onBudgetScopeChange,
  corkageOnly,
  visitTiming,
  onVisitTimingChange,
  wineSourceMode,
  onWineSourceModeChange,
  personalCellar,
  onAddPersonalWine,
  onRemovePersonalWine,
  wineShops,
  selectedWineShopId,
  onSelectWineShopId,
  corkageWine,
  onCorkageWineChange,
  selectedRegisteredDishIds,
  onToggleRegisteredDish,
  customDishes,
  customDishInput,
  onCustomDishInputChange,
  onAddCustomDish,
  onRemoveCustomDish,
  menuAnalysis,
  isAnalyzingMenu,
  onUploadMenuPhoto,
  onToggleOcrDish,
  onClearMenuAnalysis,
  pairingScope,
  onPairingScopeChange,
  courseServeFormat,
  onCourseServeFormatChange,
  courseBottleCount,
  onCourseBottleCountChange,
  includeExtraGlass,
  onIncludeExtraGlassChange,
  coursePairingMode,
  onCoursePairingModeChange,
  customSlots,
  onChangeCustomSlot,
  tasteProfile,
  onResetTasteProfile,
  hasAnyDishSelected,
  onSubmitRecommend,
  onInstantCorkageSubmit,
  onOpenCatalog,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const corkageFileRef = useRef<HTMLInputElement | null>(null);
  const instantCorkageFileRef = useRef<HTMLInputElement | null>(null);

  const [courseListExpanded, setCourseListExpanded] = useState(false);
  const [isScanningCorkage, setIsScanningCorkage] = useState(false);
  const [newCellarName, setNewCellarName] = useState('');
  const [newCellarCat, setNewCellarCat] = useState<WineCategory>('red');
  const [newCellarVintage, setNewCellarVintage] = useState('2020');
  const [isAddingCellar, setIsAddingCellar] = useState(false);

  // Instant Corkage-Only Popup Modal (triggered directly from Page 1)
  const [corkageModalOpen, setCorkageModalOpen] = useState(false);
  const [instantBottle, setInstantBottle] = useState<CorkageBottle>({
    name: '',
    category: 'red',
    body: 3,
    slotPosition: 'late',
  });
  const [isScanningInstant, setIsScanningInstant] = useState(false);
  const [isSubmittingInstant, setIsSubmittingInstant] = useState(false);

  const activePersona =
    personas.find((p) => p.id === (venue.defaultPersonaId || selectedPersonaId)) ??
    personas[0];

  const customBudgetNum = Number(customBudgetManWon);
  const hasCustomBudget = !Number.isNaN(customBudgetNum) && customBudgetNum > 0;

  const isCourseActive =
    menuAnalysis?.mode === 'course' ||
    (venue.venueType === 'course' && pairingScope === 'course' && !menuAnalysis);
  const activeCourseDishes =
    menuAnalysis?.mode === 'course' ? menuAnalysis.dishes : venue.courseMenu ?? [];
  const hasTasteMemory =
    tasteProfile.likedWineIds.length > 0 || tasteProfile.dislikedFeedbacks.length > 0;

  const goPage = (p: Step1Page) => {
    onStep1PageChange(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 safe-bottom-scroll sm:px-6">
      {/* Page Title + Connected Venue Crest */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)] sm:text-[24px]">
            {t.step1Title}
          </h1>
          <p className="prose-pretty mt-0.5 text-[14px] leading-[1.5] text-[var(--text-secondary)]">
            {t.step1Subtitle}
          </p>
        </div>
        <div className="somm-card rounded-2xl px-3.5 py-2">
          <VenueLogo
            venueId={venue.id}
            logoUrl={venue.logoUrl}
            venueName={lang === 'ko' ? venue.nameKo : venue.nameEn}
            size="md"
          />
        </div>
      </div>

      {/* Active Taste Note Banner */}
      {hasTasteMemory && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F5EBEF] px-4 py-3 text-[13px] text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{t.tasteProfileActiveBanner}</span>
          </div>
          <button
            type="button"
            onClick={onResetTasteProfile}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[12px] font-semibold text-[var(--text-primary)] shadow-sm"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
            <span>{t.tasteProfileResetBtn}</span>
          </button>
        </div>
      )}

      {/* 6-Step Wizard Progress Strip */}
      <nav
        aria-label={lang === 'ko' ? '추천 진행 단계' : 'Wizard steps'}
        className="somm-card flex items-center gap-1.5 overflow-x-auto rounded-2xl p-2"
      >
        {WIZARD_STEPS.map((st) => {
          const isCurrent = step1Page === st.page;
          const isDone = step1Page > st.page;
          return (
            <button
              key={st.page}
              type="button"
              onClick={() => goPage(st.page)}
              data-surface={isCurrent ? 'accent' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-all ${
                isCurrent
                  ? 'btn-accent shadow-sm'
                  : isDone
                    ? 'bg-[#F5EBEF] text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span className="tabular-nums">{st.page}.</span>
              <span>{lang === 'ko' ? st.ko : st.en}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Single-Page Step Card */}
      <section className="somm-card flex min-h-[380px] flex-col justify-between rounded-3xl p-6 sm:p-8">
        <div>
          {/* ============================================================
              PAGE 1: Dedicated Sommelier Self-Introduction + Quick Corkage Entry
             ============================================================ */}
          {step1Page === 1 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EBEF] px-3 py-1 text-[12px] font-semibold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
                  <Award className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>
                    {lang === 'ko'
                      ? `${venue.nameKo} 전담 소믈리에`
                      : `Dedicated Sommelier for ${venue.nameEn}`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onInspectPersona(activePersona)}
                  className="text-[12px] font-semibold text-[#6B1D2F] underline underline-offset-4 dark:text-[#E59BAE]"
                >
                  {lang === 'ko' ? '전체 이력 자세히 보기' : 'Full Bio & Credentials'}
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
                <div className="shrink-0 rounded-3xl bg-[#F5EBEF]/70 p-4 dark:bg-[#2E181F]/70">
                  <SommelierAvatar personaId={activePersona.id} size={96} />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                      {lang === 'ko' ? activePersona.titleKo : activePersona.titleEn}
                    </div>
                    <h2 className="mt-1 text-[24px] font-bold tracking-tight text-[var(--text-primary)]">
                      {lang === 'ko' ? activePersona.nameKo : activePersona.nameEn}
                    </h2>
                    <p className="mt-1 text-[13px] font-medium text-[var(--text-secondary)]">
                      {lang === 'ko'
                        ? `${activePersona.credentialsKo} · 경력 ${activePersona.yearsExp}년`
                        : `${activePersona.credentialsEn} · ${activePersona.yearsExp} Years Exp`}
                    </p>
                  </div>

                  {/* Warm First-Person Hospitality Greeting */}
                  <div className="rounded-2xl border-l-[3px] border-[#6B1D2F] bg-[var(--bg-tertiary)]/65 p-4 text-left">
                    <p className="prose-pretty text-[15px] leading-[1.68] text-[var(--text-primary)]">
                      “
                      {lang === 'ko'
                        ? activePersona.greetingKo ?? activePersona.philosophyKo
                        : activePersona.greetingEn ?? activePersona.philosophyEn}
                      ”
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
                      {lang === 'ko' ? '주요 해석 산지:' : 'Signature Regions:'}
                    </span>
                    {activePersona.preferredRegions.map((reg) => (
                      <span
                        key={reg}
                        className="somm-sub-surface rounded-full px-3 py-1 text-[12px] font-medium text-[var(--text-primary)]"
                      >
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              PAGE 2: Visit Timing (Pre-Visit vs On-Site)
             ============================================================ */}
          {step1Page === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold text-[var(--text-primary)]">
                  {lang === 'ko'
                    ? '언제 즐기실 와인을 찾고 계신가요?'
                    : 'When Are You Planning to Enjoy Your Wine?'}
                </h2>
                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                  {lang === 'ko'
                    ? '방문 전 미리 준비하시거나, 매장에 앉아 계신 자리에서 바로 추천받으실 수 있습니다.'
                    : 'Plan ahead before arriving or pair directly at your dining table.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    onVisitTimingChange('pre_visit');
                    goPage(3);
                  }}
                  data-surface={visitTiming === 'pre_visit' ? 'accent' : undefined}
                  className={`flex min-h-[180px] flex-col justify-between rounded-3xl p-6 text-left transition-all ${
                    visitTiming === 'pre_visit'
                      ? 'btn-accent shadow-md'
                      : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        visitTiming === 'pre_visit'
                          ? 'bg-white/20 text-[#FFFFFF]'
                          : 'bg-[var(--bg-secondary)] text-[#6B1D2F] dark:text-[#E59BAE]'
                      }`}
                    >
                      {lang === 'ko' ? '사전 플래닝' : 'Pre-Visit Planning'}
                    </span>
                    <Store className="h-6 w-6 opacity-85" strokeWidth={1.5} />
                  </div>

                  <div className="mt-4">
                    <div className="text-[20px] font-bold leading-snug">
                      {lang === 'ko' ? '업장 방문 전 미리 준비' : 'Planning Before My Visit'}
                    </div>
                    <p
                      className={`mt-2 text-[13px] leading-relaxed ${
                        visitTiming === 'pre_visit'
                          ? 'text-white/90'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {lang === 'ko'
                        ? '방문 전 업장 와인을 예약하거나, 내 셀러 · 방문 예정 와인샵에서 가져갈 와인을 고릅니다.'
                        : 'Reserve venue bottles ahead, or pick the right bottle from your home cellar or a wine shop.'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onVisitTimingChange('on_site');
                    goPage(3);
                  }}
                  data-surface={visitTiming === 'on_site' ? 'accent' : undefined}
                  className={`flex min-h-[180px] flex-col justify-between rounded-3xl p-6 text-left transition-all ${
                    visitTiming === 'on_site'
                      ? 'btn-accent shadow-md'
                      : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        visitTiming === 'on_site'
                          ? 'bg-white/20 text-[#FFFFFF]'
                          : 'bg-[var(--bg-secondary)] text-[#6B1D2F] dark:text-[#E59BAE]'
                      }`}
                    >
                      {lang === 'ko' ? '실시간 테이블 안내' : 'At Your Table'}
                    </span>
                    <Wine className="h-6 w-6 opacity-85" strokeWidth={1.5} />
                  </div>

                  <div className="mt-4">
                    <div className="text-[20px] font-bold leading-snug">
                      {lang === 'ko' ? '지금 업장에서 추천받기' : 'At the Restaurant Now'}
                    </div>
                    <p
                      className={`mt-2 text-[13px] leading-relaxed ${
                        visitTiming === 'on_site'
                          ? 'text-white/90'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {lang === 'ko'
                        ? '오늘 드실 요리에 맞춰 업장 셀러에서 바로 즐길 최적의 와인을 추천받습니다.'
                        : 'Pair live in-stock venue wines tuned to the dishes at your table tonight.'}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              PAGE 3: Dishes First! (Moved Before Budget & Bottle Count)
             ============================================================ */}
          {step1Page === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-[22px] font-bold text-[var(--text-primary)]">
                  {t.dishesSectionTitle}
                </h2>
                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                  {t.dishesSectionDesc}
                </p>
              </div>

              {venue.venueType === 'course' &&
                venue.courseMenu &&
                venue.courseMenu.length > 0 &&
                !menuAnalysis && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => onPairingScopeChange('course')}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        pairingScope === 'course'
                          ? 'somm-card-selected'
                          : 'somm-sub-surface hover:opacity-90'
                      }`}
                    >
                      <div className="text-[15px] font-bold text-[var(--text-primary)]">
                        {t.pairingScopeCourseTitle}
                      </div>
                      <p className="prose-pretty mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                        {t.pairingScopeCourseDesc}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPairingScopeChange('dishes')}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        pairingScope === 'dishes'
                          ? 'somm-card-selected'
                          : 'somm-sub-surface hover:opacity-90'
                      }`}
                    >
                      <div className="text-[15px] font-bold text-[var(--text-primary)]">
                        {t.pairingScopeDishTitle}
                      </div>
                      <p className="prose-pretty mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                        {t.pairingScopeDishDesc}
                      </p>
                    </button>
                  </div>
                )}

              {isCourseActive && !isAnalyzingMenu && (
                <div className="somm-sub-surface space-y-3 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {lang === 'ko'
                        ? `오늘의 코스 요리 (${activeCourseDishes.length}가지) 흐름이 자동 반영됩니다.`
                        : `${activeCourseDishes.length} tasting course plates will be paired cleanly.`}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCourseListExpanded((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]"
                      >
                        <span>
                          {courseListExpanded ? t.courseHideListBtn : t.courseShowListBtn}
                        </span>
                        {courseListExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </button>
                      {menuAnalysis && (
                        <button
                          type="button"
                          onClick={onClearMenuAnalysis}
                          className="text-[12px] font-semibold text-[var(--text-secondary)] underline underline-offset-4"
                        >
                          {t.ocrResetBtn}
                        </button>
                      )}
                    </div>
                  </div>

                  {courseListExpanded && (
                    <div className="space-y-1.5">
                      {activeCourseDishes.map((dish, idx) => (
                        <div
                          key={dish.id}
                          className="flex items-center gap-2.5 rounded-xl bg-[var(--bg-secondary)] px-3 py-2 text-[13px]"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F] text-[11px] font-bold tabular-nums text-[#FFFFFF]">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                            {lang === 'ko' ? dish.stageKo : dish.stageEn}
                          </span>
                          <span className="font-medium text-[var(--text-primary)]">
                            {lang === 'ko' ? dish.nameKo : dish.nameEn}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(!isCourseActive || pairingScope === 'dishes') && (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-[12px] font-semibold text-[var(--text-secondary)]">
                      {t.dishesRegisteredLabel}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {venue.registeredDishes.map((dish) => {
                        const active = selectedRegisteredDishIds.includes(dish.id);
                        return (
                          <button
                            key={dish.id}
                            type="button"
                            onClick={() => onToggleRegisteredDish(dish.id)}
                            data-surface={active ? 'accent' : undefined}
                            className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                              active
                                ? 'btn-accent'
                                : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                            }`}
                          >
                            {lang === 'ko' ? dish.nameKo : dish.nameEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-1 gap-2">
                      <input
                        type="text"
                        value={customDishInput}
                        onChange={(e) => onCustomDishInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            onAddCustomDish();
                          }
                        }}
                        placeholder={t.dishInputPlaceholder}
                        className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                      />
                      <button
                        type="button"
                        onClick={onAddCustomDish}
                        disabled={customDishInput.trim().length === 0}
                        className="inline-flex shrink-0 items-center gap-1 rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-[13px] font-semibold text-[var(--text-primary)] transition-colors hover:opacity-85 disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                        <span>{t.addDishBtn}</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadMenuPhoto(file);
                        e.target.value = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzingMenu}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6B1D2F]/50 bg-[#F5EBEF]/55 px-4 py-3 text-[14px] font-semibold text-[#6B1D2F] transition-colors hover:bg-[#F5EBEF] dark:border-[#E59BAE]/40 dark:bg-[#2E181F]/60 dark:text-[#F4B8C6]"
                    >
                      <Camera className="h-4 w-4" strokeWidth={1.5} />
                      <span>{t.ocrUploadBtn}</span>
                    </button>
                  </div>

                  {customDishes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customDishes.map((cd) => (
                        <span
                          key={cd.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-3.5 py-1.5 text-[13px] font-semibold text-[#FFFFFF]"
                        >
                          <span>{lang === 'ko' ? cd.nameKo : cd.nameEn}</span>
                          <button
                            type="button"
                            onClick={() => onRemoveCustomDish(cd.id)}
                            aria-label="Remove dish"
                            className="rounded-full p-0.5 hover:bg-white/20"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {menuAnalysis && menuAnalysis.mode === 'alacarte' && !isAnalyzingMenu && (
                    <div className="somm-sub-surface space-y-2.5 rounded-2xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-[#6B1D2F] px-3 py-1 text-[11px] font-semibold text-[#FFFFFF]">
                          {t.ocrBadgeAlacarte}
                        </span>
                        <button
                          type="button"
                          onClick={onClearMenuAnalysis}
                          className="text-[12px] font-semibold text-[var(--text-secondary)] underline underline-offset-4"
                        >
                          {t.ocrResetBtn}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {menuAnalysis.dishes.map((dish) => (
                          <button
                            key={dish.id}
                            type="button"
                            onClick={() => onToggleOcrDish(dish.id)}
                            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium ${
                              dish.selected
                                ? 'bg-[#F5EBEF] text-[#6B1D2F] ring-1 ring-[#6B1D2F]/40 dark:bg-[#2E181F] dark:text-[#F4B8C6]'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                            }`}
                          >
                            <span>{lang === 'ko' ? dish.nameKo : dish.nameEn}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAnalyzingMenu && (
                <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-[13px] font-medium text-[#6B1D2F] dark:text-[#E59BAE]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#6B1D2F]" />
                  <span>{t.ocrAnalyzing}</span>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              PAGE 4: Merged Bottle Count / Format + Budget Range
             ============================================================ */}
          {step1Page === 4 && (
            <div className="space-y-7">
              {/* Part A: Format & Bottle Count */}
              <div className="space-y-3.5">
                <div>
                  <h2 className="text-[20px] font-bold text-[var(--text-primary)]">
                    {lang === 'ko'
                      ? '와인 수량 및 예산 한 번에 설정하기'
                      : 'Bottle Count & Budget'}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                    {lang === 'ko'
                      ? '드실 병 수와 원하시는 예산 범위를 함께 정해 주세요.'
                      : 'Set how many bottles to pair and your target price range.'}
                  </p>
                </div>

                {isCourseActive ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => onCourseServeFormatChange('glass')}
                        data-surface={courseServeFormat === 'glass' ? 'accent' : undefined}
                        className={`rounded-2xl p-3.5 text-left transition-all ${
                          courseServeFormat === 'glass'
                            ? 'btn-accent shadow-sm'
                            : 'somm-sub-surface text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="text-[14px] font-bold">{t.courseFormatGlassTitle}</div>
                        <div
                          className={`mt-0.5 text-[11px] leading-snug ${
                            courseServeFormat === 'glass'
                              ? 'text-white/90'
                              : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {t.courseFormatGlassDesc}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => onCourseServeFormatChange('bottle')}
                        data-surface={courseServeFormat === 'bottle' ? 'accent' : undefined}
                        className={`rounded-2xl p-3.5 text-left transition-all ${
                          courseServeFormat === 'bottle'
                            ? 'btn-accent shadow-sm'
                            : 'somm-sub-surface text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="text-[14px] font-bold">{t.courseFormatBottleTitle}</div>
                        <div
                          className={`mt-0.5 text-[11px] leading-snug ${
                            courseServeFormat === 'bottle'
                              ? 'text-white/90'
                              : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          {t.courseFormatBottleDesc}
                        </div>
                      </button>
                    </div>

                    {courseServeFormat === 'bottle' && (
                      <div className="somm-sub-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="mr-1 text-[13px] font-semibold text-[var(--text-primary)]">
                            {t.courseBottleCountLabel}:
                          </span>
                          {([1, 2, 3, 4] as CourseBottleCount[]).map((num) => {
                            const active = courseBottleCount === num;
                            return (
                              <button
                                key={num}
                                type="button"
                                onClick={() => onCourseBottleCountChange(num)}
                                data-surface={active ? 'accent' : undefined}
                                className={`rounded-xl px-3.5 py-2 text-[13px] font-bold tabular-nums transition-all ${
                                  active
                                    ? 'btn-accent shadow-sm'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                                }`}
                              >
                                {num}
                                {lang === 'ko' ? t.courseBottleUnit : ` ${t.courseBottleUnit}`}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => onIncludeExtraGlassChange(!includeExtraGlass)}
                          data-surface={includeExtraGlass ? 'accent' : undefined}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                            includeExtraGlass
                              ? 'btn-accent'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                          }`}
                        >
                          {includeExtraGlass && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                          <span>{t.courseExtraGlassToggle}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="somm-sub-surface rounded-2xl px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                    {lang === 'ko'
                      ? '선택하신 단품 요리에 맞춘 바틀 추천으로 진행됩니다.'
                      : 'Curated single-bottle options matched to your selected dishes.'}
                  </div>
                )}
              </div>

              {/* Part B: Budget Range (10만원 이하 / 10~20만원 / 20~30만원 / 30~40만원 + 직접입력) */}
              <div className="space-y-3 border-t border-[var(--border-subtle)] pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[15px] font-bold text-[var(--text-primary)]">
                    {t.budgetSectionTitle}
                  </span>
                  <SlidingSwitch
                    size="sm"
                    value={budgetScope}
                    options={[
                      { value: 'per_bottle', label: t.budgetPerBottle },
                      { value: 'total', label: t.budgetTotal },
                    ]}
                    onChange={onBudgetScopeChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {(Object.keys(BUDGET_LABELS) as BudgetTier[]).map((tier) => {
                    const active = !hasCustomBudget && tier === budgetTier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          onCustomBudgetManWonChange('');
                          onBudgetTierChange(tier);
                        }}
                        data-surface={active ? 'accent' : undefined}
                        className={`rounded-2xl px-3.5 py-3.5 text-[14px] font-bold tabular-nums transition-all ${
                          active
                            ? 'btn-accent shadow-sm'
                            : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                        }`}
                      >
                        {BUDGET_LABELS[tier][lang]}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5">
                    <span className="text-[13px] font-semibold text-[var(--text-secondary)]">
                      {lang === 'ko' ? '직접 입력' : 'Custom'}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customBudgetManWon}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
                        onCustomBudgetManWonChange(digitsOnly);
                      }}
                      placeholder={lang === 'ko' ? '예: 25' : 'e.g. 25'}
                      className="w-16 bg-transparent text-right text-[15px] font-bold tabular-nums text-[var(--text-primary)] placeholder:font-normal placeholder:text-[var(--text-muted)] focus:outline-none"
                    />
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {lang === 'ko' ? '만 원' : '× ₩10K'}
                    </span>
                    {hasCustomBudget && (
                      <button
                        type="button"
                        onClick={() => onCustomBudgetManWonChange('')}
                        aria-label="Clear custom budget"
                        className="rounded-full p-0.5 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>

                  {hasCustomBudget && (
                    <span className="text-[13px] font-semibold tabular-nums text-[#6B1D2F] dark:text-[#E59BAE]">
                      {formatKrw(customBudgetNum * 10000, lang)}{' '}
                      {budgetScope === 'total'
                        ? lang === 'ko'
                          ? '(전체 합산 기준)'
                          : '(Total)'
                        : lang === 'ko'
                          ? '(1병 기준)'
                          : '(Per Bottle)'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              PAGE 5: Recommended vs Custom Combination
             ============================================================ */}
          {step1Page === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold text-[var(--text-primary)]">
                  {lang === 'ko'
                    ? '와인 주종 구성 방식 선택'
                    : 'Choose Bottle Style Progression'}
                </h2>
                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                  {lang === 'ko'
                    ? '음식 흐름에 맞춘 추천 조합을 받아보시거나, 원하시는 주종 순서를 직접 정하실 수 있습니다.'
                    : 'Let our pairing engine curate the optimal sequence or specify each bottle slot yourself.'}
                </p>
              </div>

              {isCourseActive && courseServeFormat === 'bottle' && courseBottleCount > 1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => onCoursePairingModeChange('ai_auto')}
                      data-surface={coursePairingMode === 'ai_auto' ? 'accent' : undefined}
                      className={`rounded-2xl p-5 text-left transition-all ${
                        coursePairingMode === 'ai_auto'
                          ? 'btn-accent shadow-sm'
                          : 'somm-sub-surface text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="text-[16px] font-bold">{t.courseModeAutoTitle}</div>
                      <div
                        className={`mt-1.5 text-[12px] leading-snug ${
                          coursePairingMode === 'ai_auto'
                            ? 'text-white/90'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {t.courseModeAutoDesc}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onCoursePairingModeChange('custom_slots')}
                      data-surface={coursePairingMode === 'custom_slots' ? 'accent' : undefined}
                      className={`rounded-2xl p-5 text-left transition-all ${
                        coursePairingMode === 'custom_slots'
                          ? 'btn-accent shadow-sm'
                          : 'somm-sub-surface text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="text-[16px] font-bold">{t.courseModeCustomTitle}</div>
                      <div
                        className={`mt-1.5 text-[12px] leading-snug ${
                          coursePairingMode === 'custom_slots'
                            ? 'text-white/90'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {t.courseModeCustomDesc}
                      </div>
                    </button>
                  </div>

                  {coursePairingMode === 'custom_slots' && (
                    <div className="space-y-2.5">
                      {Array.from({ length: courseBottleCount }).map((_, idx) => {
                        const chosenCat = customSlots[idx] ?? 'white';
                        return (
                          <div key={idx} className="somm-sub-surface rounded-2xl p-4">
                            <div className="mb-2 text-[13px] font-semibold text-[var(--text-primary)]">
                              {idx + 1}
                              {lang === 'ko'
                                ? `번째 ${t.courseSlotPrefix} ${t.courseSlotSuffix}`
                                : ` · ${t.courseSlotPrefix} ${t.courseSlotSuffix}`}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {SLOT_CATEGORIES.map((cat) => {
                                const isCatActive = chosenCat === cat;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onChangeCustomSlot(idx, cat)}
                                    data-surface={isCatActive ? 'accent' : undefined}
                                    className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                                      isCatActive
                                        ? 'btn-accent'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                                    }`}
                                  >
                                    {CATEGORY_LABELS[cat][lang === 'ko' ? 'shortKo' : 'shortEn']}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="somm-sub-surface rounded-2xl p-5">
                  <div className="text-[15px] font-bold text-[var(--text-primary)]">
                    {lang === 'ko'
                      ? '요리 풍미에 맞춘 최적의 조합으로 자동 구성됩니다'
                      : 'Balanced single-pour / glass sequence ready'}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                    {lang === 'ko'
                      ? '2병 이상 코스 바틀을 선택하실 경우, 여기서 병별 주종(예: 샴페인→화이트→레드)을 직접 지정하실 수 있습니다.'
                      : 'When ordering 2+ course bottles, custom slot selection is available right here.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              PAGE 6: Clean Wine Source / Corkage Step + Final CTA ("와인 추천 받기")
             ============================================================ */}
          {step1Page === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold text-[var(--text-primary)]">
                  {visitTiming === 'pre_visit'
                    ? lang === 'ko'
                      ? '어디에서 와인을 고르시겠어요?'
                      : 'Choose Where to Select Your Wines'
                    : lang === 'ko'
                      ? '업장 와인 및 콜키지 여부'
                      : 'Cellar Selection & Corkage Option'}
                </h2>
                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                  {visitTiming === 'pre_visit'
                    ? lang === 'ko'
                      ? '업장 와인을 미리 예약하시거나, 콜키지로 가져가실 와인을 내 셀러 · 방문 와인샵 중에서 고르실 수 있습니다.'
                      : 'Reserve venue bottles ahead, or pick a BYOB bottle from your home cellar or partner wine shop.'
                    : lang === 'ko'
                      ? '업장 셀러 와인만 추천받으시거나, 가져오신 콜키지 와인을 함께 반영하실 수 있습니다.'
                      : 'Recommend purely from the venue cellar or harmonize with a corkage bottle you brought.'}
                </p>
              </div>

              {visitTiming === 'pre_visit' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(() => {
                      const allowed = venue.allowPreVisitVenueList !== false;
                      const active = allowed && wineSourceMode === 'venue_cellar';
                      return (
                        <button
                          type="button"
                          disabled={!allowed}
                          onClick={() => allowed && onWineSourceModeChange('venue_cellar')}
                          data-surface={active ? 'accent' : undefined}
                          className={`rounded-2xl p-4 text-left transition-all ${
                            !allowed
                              ? 'somm-sub-surface cursor-not-allowed opacity-60'
                              : active
                                ? 'btn-accent shadow-sm'
                                : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[14px] font-bold">
                              {lang === 'ko' ? '업장 와인 추천 · 예약' : 'Venue Wine & Hold'}
                            </span>
                            {!allowed && (
                              <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                                {lang === 'ko' ? '사전 비공개' : 'On-Site Only'}
                              </span>
                            )}
                          </div>
                          <p
                            className={`mt-1 text-[11px] leading-snug ${
                              active ? 'text-white/90' : 'text-[var(--text-secondary)]'
                            }`}
                          >
                            {allowed
                              ? lang === 'ko'
                                ? '방문 전 업장 와인을 추천받고 예약 신청합니다.'
                                : 'Preview and reserve venue bottles.'
                              : lang === 'ko'
                                ? '이 업장은 방문 전 리스트 노출을 제한합니다.'
                                : 'Pre-visit preview disabled by venue.'}
                          </p>
                        </button>
                      );
                    })()}

                    <button
                      type="button"
                      onClick={() => {
                        onWineSourceModeChange('my_cellar');
                        onCorkageWineChange(null);
                      }}
                      data-surface={wineSourceMode === 'my_cellar' ? 'accent' : undefined}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        wineSourceMode === 'my_cellar'
                          ? 'btn-accent shadow-sm'
                          : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                      }`}
                    >
                      <div className="text-[14px] font-bold">
                        {lang === 'ko' ? '내 셀러에서 추천 (콜키지)' : 'From My Cellar (BYOB)'}
                      </div>
                      <p
                        className={`mt-1 text-[11px] leading-snug ${
                          wineSourceMode === 'my_cellar'
                            ? 'text-white/90'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {lang === 'ko'
                          ? `집 셀러(${personalCellar.length}병)에서 가져갈 최적의 와인을 추천합니다.`
                          : `Pick the best BYOB bottle from your ${personalCellar.length} cellar wines.`}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onWineSourceModeChange('wine_shop');
                        onCorkageWineChange(null);
                      }}
                      data-surface={wineSourceMode === 'wine_shop' ? 'accent' : undefined}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        wineSourceMode === 'wine_shop'
                          ? 'btn-accent shadow-sm'
                          : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                      }`}
                    >
                      <div className="text-[14px] font-bold">
                        {lang === 'ko' ? '와인샵에서 구매 (콜키지)' : 'Partner Wine Shop (BYOB)'}
                      </div>
                      <p
                        className={`mt-1 text-[11px] leading-snug ${
                          wineSourceMode === 'wine_shop'
                            ? 'text-white/90'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {lang === 'ko'
                          ? '들르실 와인샵 재고에서 업장 음식에 맞는 와인을 고릅니다.'
                          : 'Choose a BYOB bottle directly from a partner shop’s stock.'}
                      </p>
                    </button>
                  </div>

                  {/* My Cellar Manager */}
                  {wineSourceMode === 'my_cellar' && (
                    <div className="somm-sub-surface space-y-3 rounded-2xl p-4">
                      <div className="text-[14px] font-bold text-[var(--text-primary)]">
                        {lang === 'ko'
                          ? `내 셀러 보관 리스트 (${personalCellar.length}병)`
                          : `My Cellar Inventory (${personalCellar.length})`}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {personalCellar.map((w) => (
                          <div
                            key={w.id}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[12px]"
                          >
                            <span className="font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                              {CATEGORY_LABELS[w.category].shortKo}
                            </span>
                            <span className="font-medium text-[var(--text-primary)]">
                              {lang === 'ko' ? w.nameKo : w.nameEn}
                            </span>
                            <span className="tabular-nums text-[var(--text-secondary)]">
                              {w.vintage}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemovePersonalWine(w.id)}
                              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              aria-label="Remove cellar wine"
                            >
                              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-12">
                        <input
                          type="text"
                          value={newCellarName}
                          onChange={(e) => setNewCellarName(e.target.value)}
                          placeholder={
                            lang === 'ko'
                              ? '보유 와인 추가 (예: 크루그 그랑 퀴베)'
                              : 'Add bottle name...'
                          }
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[12px] text-[var(--text-primary)] sm:col-span-5"
                        />
                        <select
                          value={newCellarCat}
                          onChange={(e) => setNewCellarCat(e.target.value as WineCategory)}
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-2 text-[12px] text-[var(--text-primary)] sm:col-span-2"
                        >
                          {SLOT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {CATEGORY_LABELS[c][lang]}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={newCellarVintage}
                          onChange={(e) => setNewCellarVintage(e.target.value)}
                          placeholder="2020"
                          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-2 text-[12px] tabular-nums text-[var(--text-primary)] sm:col-span-2"
                        />
                        <button
                          type="button"
                          disabled={isAddingCellar || !newCellarName.trim()}
                          onClick={async () => {
                            if (!newCellarName.trim()) return;
                            setIsAddingCellar(true);
                            try {
                              await onAddPersonalWine({
                                name: newCellarName.trim(),
                                category: newCellarCat,
                                vintage: Number(newCellarVintage) || 2020,
                                price: 120000,
                              });
                              setNewCellarName('');
                            } finally {
                              setIsAddingCellar(false);
                            }
                          }}
                          data-surface="accent"
                          className="btn-accent inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-[12px] font-semibold disabled:opacity-50 sm:col-span-3"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                          <span>{lang === 'ko' ? '셀러에 추가' : 'Add Bottle'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Partner Wine Shop Picker */}
                  {wineSourceMode === 'wine_shop' && (
                    <div className="somm-sub-surface space-y-3 rounded-2xl p-4">
                      <div className="text-[14px] font-bold text-[var(--text-primary)]">
                        {lang === 'ko' ? '방문(예정) 와인샵 선택' : 'Select Partner Wine Shop'}
                      </div>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {wineShops.map((shop) => {
                          const active = shop.id === selectedWineShopId;
                          return (
                            <button
                              key={shop.id}
                              type="button"
                              onClick={() => onSelectWineShopId(shop.id)}
                              data-surface={active ? 'accent' : undefined}
                              className={`rounded-xl p-3 text-left transition-all ${
                                active
                                  ? 'btn-accent shadow-sm'
                                  : 'border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[13px] font-bold">
                                  {lang === 'ko' ? shop.nameKo : shop.nameEn}
                                </span>
                                <span
                                  className={`text-[11px] tabular-nums ${
                                    active ? 'text-white/90' : 'text-[var(--text-secondary)]'
                                  }`}
                                >
                                  {shop.wines.length}
                                  {lang === 'ko' ? '병' : ''}
                                </span>
                              </div>
                              <div
                                className={`mt-0.5 text-[11px] ${
                                  active ? 'text-white/85' : 'text-[var(--text-secondary)]'
                                }`}
                              >
                                {lang === 'ko' ? shop.neighborhoodKo : shop.neighborhoodEn}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onWineSourceModeChange('venue_cellar')}
                    data-surface={!corkageOnly ? 'accent' : undefined}
                    className={`rounded-2xl p-4 text-left transition-all ${
                      !corkageOnly
                        ? 'btn-accent shadow-sm'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="text-[15px] font-bold">
                      {lang === 'ko' ? '업장 와인 추천받기' : 'Pair From Venue Cellar'}
                    </div>
                    <p
                      className={`mt-1 text-[12px] leading-snug ${
                        !corkageOnly ? 'text-white/90' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {lang === 'ko'
                        ? '업장 셀러 와인으로 추천받거나 지참 콜키지 1병을 함께 반영합니다.'
                        : 'Curated venue bottles, optionally paired alongside 1 corkage bottle.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onWineSourceModeChange('corkage_direct')}
                    data-surface={corkageOnly ? 'accent' : undefined}
                    className={`rounded-2xl p-4 text-left transition-all ${
                      corkageOnly
                        ? 'btn-accent shadow-sm'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="text-[15px] font-bold">
                      {lang === 'ko' ? '콜키지 와인만 즐길게요' : 'Corkage Wine Only'}
                    </div>
                    <p
                      className={`mt-1 text-[12px] leading-snug ${
                        corkageOnly ? 'text-white/90' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {lang === 'ko'
                        ? '지참하신 와인의 상세 테이스팅 노트와 어울리는 요리를 안내받습니다.'
                        : 'Full tasting notes & dish matches for the bottle you brought.'}
                    </p>
                  </button>
                </div>
              )}

              {/* Corkage Bottle Input ONLY when Venue Cellar is active ON-SITE (not in Pre-Visit My Cellar / Wine Shop!) */}
              {(corkageOnly ||
                (wineSourceMode === 'venue_cellar' && visitTiming === 'on_site')) && (
                <div className="somm-sub-surface space-y-3 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[14px] font-bold text-[var(--text-primary)]">
                      {corkageOnly
                        ? lang === 'ko'
                          ? '가져오신 콜키지 와인 정보 입력'
                          : 'Your Corkage Bottle Details'
                        : lang === 'ko'
                          ? '가져오신 콜키지 와인도 함께 맞추시겠어요? (선택)'
                          : 'Factor in a Corkage Bottle Too? (Optional)'}
                    </div>

                    {!corkageOnly && (
                      <button
                        type="button"
                        onClick={() => {
                          if (corkageWine) {
                            onCorkageWineChange(null);
                          } else {
                            onCorkageWineChange({
                              name: '',
                              category: 'red',
                              body: 4,
                              slotPosition: 'late',
                            });
                          }
                        }}
                        data-surface={corkageWine ? 'accent' : undefined}
                        className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                          corkageWine
                            ? 'btn-accent'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                        }`}
                      >
                        {corkageWine
                          ? lang === 'ko'
                            ? '콜키지 사용 안 함'
                            : 'Remove Corkage'
                          : lang === 'ko'
                            ? '+ 콜키지 와인 추가'
                            : '+ Add Corkage'}
                      </button>
                    )}
                  </div>

                  {corkageWine && (
                    <div className="space-y-3 border-t border-[var(--border-subtle)] pt-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={corkageWine.name}
                          onChange={(e) =>
                            onCorkageWineChange({ ...corkageWine, name: e.target.value })
                          }
                          placeholder={
                            lang === 'ko'
                              ? '와인 이름 입력 (예: 살롱 1996, 메오 까뮈제)'
                              : 'Wine name (e.g., Salon 1996)'
                          }
                          className="flex-1 rounded-xl bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                        />
                        <input
                          ref={corkageFileRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = '';
                            if (!file) return;
                            setIsScanningCorkage(true);
                            try {
                              const scanned = await analyzeWineLabelImage(file);
                              onCorkageWineChange({
                                name: lang === 'ko' ? scanned.nameKo : scanned.nameEn,
                                nameEn: scanned.nameEn,
                                producer: scanned.producer,
                                vintage: scanned.vintage,
                                varietalsKo: scanned.varietalsKo,
                                varietalsEn: scanned.varietalsEn,
                                regionKo: scanned.regionKo,
                                regionEn: scanned.regionEn,
                                countryCode: scanned.countryCode,
                                category: scanned.category,
                                body: scanned.structure.body,
                                structure: scanned.structure,
                                aromas: scanned.aromas,
                                slotPosition:
                                  scanned.category === 'sparkling'
                                    ? 'early'
                                    : scanned.category === 'white'
                                      ? 'middle'
                                      : 'late',
                              });
                            } finally {
                              setIsScanningCorkage(false);
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={isScanningCorkage}
                          onClick={() => corkageFileRef.current?.click()}
                          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#6B1D2F]/50 bg-[#F5EBEF]/60 px-4 py-2.5 text-[13px] font-semibold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]"
                        >
                          <Camera className="h-4 w-4" strokeWidth={1.5} />
                          <span>
                            {isScanningCorkage
                              ? lang === 'ko'
                                ? '라벨 읽는 중...'
                                : 'Scanning...'
                              : lang === 'ko'
                                ? '와인 라벨 사진 올리기'
                                : 'Scan Bottle Label'}
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
                          {lang === 'ko' ? '주종:' : 'Style:'}
                        </span>
                        {SLOT_CATEGORIES.map((cat) => {
                          const active = corkageWine.category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() =>
                                onCorkageWineChange({ ...corkageWine, category: cat })
                              }
                              data-surface={active ? 'accent' : undefined}
                              className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                                active
                                  ? 'btn-accent'
                                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                              }`}
                            >
                              {CATEGORY_LABELS[cat][lang === 'ko' ? 'shortKo' : 'shortEn']}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Final Recommendation CTA */}
              {!hasAnyDishSelected && !corkageOnly && (
                <p className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
                  <UtensilsCrossed className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>{t.ctaRecommendDisabledHint}</span>
                </p>
              )}

              <button
                type="button"
                onClick={onSubmitRecommend}
                disabled={
                  corkageOnly
                    ? !corkageWine || corkageWine.name.trim().length === 0
                    : !hasAnyDishSelected
                }
                data-surface="accent"
                className="btn-accent w-full rounded-2xl px-6 py-4 text-[16px] font-bold tracking-tight shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-45"
              >
                {corkageOnly
                  ? lang === 'ko'
                    ? '내 콜키지 와인 노트 · 어울리는 요리 보기'
                    : 'View Corkage Notes & Dish Pairings'
                  : t.ctaRecommend}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Wizard Navigation Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5">
          {step1Page > 1 ? (
            <button
              type="button"
              onClick={() => goPage((step1Page - 1) as Step1Page)}
              className="somm-sub-surface inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)] hover:opacity-85"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              <span>{lang === 'ko' ? '이전 단계' : 'Previous'}</span>
            </button>
          ) : (
            <div className="text-[12px] font-semibold tabular-nums text-[var(--text-secondary)]">
              1 / 6
            </div>
          )}

          {step1Page > 1 && (
            <div className="text-[12px] font-semibold tabular-nums text-[var(--text-secondary)]">
              {`${step1Page} / 6`}
            </div>
          )}

          {step1Page === 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenCatalog}
                className="somm-sub-surface inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-semibold text-[var(--text-primary)] hover:opacity-85"
              >
                <ListFilter className="h-4 w-4 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.75} />
                <span>{lang === 'ko' ? '전체 와인 리스트' : 'Full Wine List'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCorkageModalOpen(true)}
                className="somm-sub-surface inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold text-[#6B1D2F] hover:opacity-85 dark:text-[#F4B8C6]"
              >
                <Camera className="h-4 w-4" strokeWidth={1.75} />
                <span>{lang === 'ko' ? '콜키지만 즐길게요' : 'Corkage Only'}</span>
              </button>

              <button
                type="button"
                onClick={() => goPage(2)}
                data-surface="accent"
                className="btn-accent inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-bold shadow-sm"
              >
                <span>{lang === 'ko' ? '와인 추천받기' : 'Recommend Wine'}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          ) : step1Page < 6 ? (
            <button
              type="button"
              onClick={() => goPage((step1Page + 1) as Step1Page)}
              data-surface="accent"
              className="btn-accent inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-bold shadow-sm"
            >
              <span>{lang === 'ko' ? '다음 단계' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </section>

      {/* Instant Corkage-Only Analysis Popup (Triggered from Page 1 "콜키지만 즐길게요") */}
      {corkageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          onClick={() => setCorkageModalOpen(false)}
        >
          <div
            className="somm-card w-full max-w-lg space-y-4 rounded-3xl p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5">
              <div>
                <div className="text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                  {lang === 'ko' ? '콜키지 와인 바로 분석' : 'Instant Corkage Analysis'}
                </div>
                <h3 className="mt-0.5 text-[19px] font-bold text-[var(--text-primary)]">
                  {lang === 'ko'
                    ? '가져오신 와인 라벨을 찍거나 입력해 주세요'
                    : 'Snap or Enter Your Corkage Bottle'}
                </h3>
                <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
                  {lang === 'ko'
                    ? '와인 정보를 확인한 즉시 테이스팅 노트, 포도밭 스토리, 가장 잘 어울리는 이 업장의 요리를 바로 안내해 드립니다.'
                    : 'Immediately reveals full tasting notes, vineyard map, and best matching dishes at this restaurant.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCorkageModalOpen(false)}
                aria-label="Close modal"
                className="somm-sub-surface rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="text"
                value={instantBottle.name}
                onChange={(e) =>
                  setInstantBottle({ ...instantBottle, name: e.target.value })
                }
                placeholder={
                  lang === 'ko'
                    ? '와인 이름 입력 (예: 살롱 1996, 오퍼스 원)'
                    : 'Wine name (e.g., Salon 1996)'
                }
                className="flex-1 rounded-xl bg-[var(--bg-tertiary)] px-3.5 py-3 text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
              />
              <input
                ref={instantCorkageFileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  setIsScanningInstant(true);
                  try {
                    const scanned = await analyzeWineLabelImage(file);
                    const nextBottle: CorkageBottle = {
                      name: lang === 'ko' ? scanned.nameKo : scanned.nameEn,
                      nameEn: scanned.nameEn,
                      producer: scanned.producer,
                      vintage: scanned.vintage,
                      varietalsKo: scanned.varietalsKo,
                      varietalsEn: scanned.varietalsEn,
                      regionKo: scanned.regionKo,
                      regionEn: scanned.regionEn,
                      countryCode: scanned.countryCode,
                      category: scanned.category,
                      body: scanned.structure.body,
                      structure: scanned.structure,
                      aromas: scanned.aromas,
                      slotPosition:
                        scanned.category === 'sparkling'
                          ? 'early'
                          : scanned.category === 'white'
                            ? 'middle'
                            : 'late',
                    };
                    setInstantBottle(nextBottle);
                    setIsSubmittingInstant(true);
                    await onInstantCorkageSubmit(nextBottle);
                    setCorkageModalOpen(false);
                  } finally {
                    setIsScanningInstant(false);
                    setIsSubmittingInstant(false);
                  }
                }}
              />
              <button
                type="button"
                disabled={isScanningInstant || isSubmittingInstant}
                onClick={() => instantCorkageFileRef.current?.click()}
                data-surface="accent"
                className="btn-accent inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-[13px] font-bold shadow-xs"
              >
                <Camera className="h-4 w-4" strokeWidth={1.75} />
                <span>
                  {isScanningInstant
                    ? lang === 'ko'
                      ? '라벨 인식 중...'
                      : 'Scanning...'
                    : lang === 'ko'
                      ? '사진 찍어 바로 분석'
                      : 'Snap Label & Analyze'}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
                {lang === 'ko' ? '주종:' : 'Style:'}
              </span>
              {SLOT_CATEGORIES.map((cat) => {
                const active = instantBottle.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setInstantBottle({ ...instantBottle, category: cat })}
                    data-surface={active ? 'accent' : undefined}
                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                      active
                        ? 'btn-accent'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    {CATEGORY_LABELS[cat][lang === 'ko' ? 'shortKo' : 'shortEn']}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[var(--border-subtle)] pt-4">
              <button
                type="button"
                onClick={() => setCorkageModalOpen(false)}
                className="somm-sub-surface rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)]"
              >
                {t.closeBtn}
              </button>
              <button
                type="button"
                disabled={!instantBottle.name.trim() || isSubmittingInstant}
                onClick={async () => {
                  if (!instantBottle.name.trim()) return;
                  setIsSubmittingInstant(true);
                  try {
                    await onInstantCorkageSubmit(instantBottle);
                    setCorkageModalOpen(false);
                  } finally {
                    setIsSubmittingInstant(false);
                  }
                }}
                data-surface="accent"
                className="btn-accent rounded-xl px-5 py-2.5 text-[13px] font-bold disabled:opacity-45"
              >
                {isSubmittingInstant
                  ? lang === 'ko'
                    ? '분석 중...'
                    : 'Analyzing...'
                  : lang === 'ko'
                    ? '와인 설명 · 궁합 바로 보기'
                    : 'View Wine Notes & Dish Matches'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
