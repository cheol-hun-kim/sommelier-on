import React, { useRef, useState } from 'react';
import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
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
  WineCategory,
} from '../types/sommelier';
import {
  BUDGET_LABELS,
  CATEGORY_LABELS,
  TRANSLATIONS,
  formatKrw,
} from '../i18n/translations';
import { analyzeWineLabelImage } from '../services/aiService';
import { SommelierAvatar, VenueLogo } from './icons/WineVectors';

interface GuestStep1Props {
  lang: Language;
  venue: Venue;
  personas: SommelierPersona[];
  selectedPersonaId: string;
  onSelectPersona: (id: string) => void;
  onInspectPersona: (persona: SommelierPersona) => void;
  budgetTier: BudgetTier;
  onBudgetTierChange: (tier: BudgetTier) => void;
  customBudgetManWon: string;
  onCustomBudgetManWonChange: (val: string) => void;
  budgetScope: BudgetScope;
  onBudgetScopeChange: (scope: BudgetScope) => void;
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
}

const SLOT_CATEGORIES: WineCategory[] = [
  'sparkling',
  'white',
  'rose_orange',
  'red',
  'dessert',
];

export const GuestStep1: React.FC<GuestStep1Props> = ({
  lang,
  venue,
  personas,
  selectedPersonaId,
  onSelectPersona,
  onInspectPersona,
  budgetTier,
  onBudgetTierChange,
  customBudgetManWon,
  onCustomBudgetManWonChange,
  budgetScope,
  onBudgetScopeChange,
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
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const corkageFileRef = useRef<HTMLInputElement | null>(null);
  const [courseListExpanded, setCourseListExpanded] = useState(false);
  const [isScanningCorkage, setIsScanningCorkage] = useState(false);

  const customBudgetNum = Number(customBudgetManWon);
  const hasCustomBudget = !Number.isNaN(customBudgetNum) && customBudgetNum > 0;

  const isCourseActive =
    menuAnalysis?.mode === 'course' ||
    (venue.venueType === 'course' && pairingScope === 'course' && !menuAnalysis);
  const activeCourseDishes =
    menuAnalysis?.mode === 'course'
      ? menuAnalysis.dishes
      : venue.courseMenu ?? [];
  const isCourseMultiBottle =
    isCourseActive && courseServeFormat === 'bottle' && courseBottleCount > 1;
  const hasTasteMemory =
    tasteProfile.likedWineIds.length > 0 ||
    tasteProfile.dislikedFeedbacks.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 safe-bottom-scroll sm:px-6">
      {/* Page Title + Connected Venue Crest */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--text-primary)]">
            {t.step1Title}
          </h1>
          <p className="prose-pretty mt-1 text-[15px] leading-[1.6] text-[var(--text-secondary)]">
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

      {/* Main Input Card */}
      <section className="somm-card space-y-7 rounded-3xl p-5 sm:p-7">
        {/* 1. Sommelier Persona Selector */}
        <div>
          <div className="mb-3">
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.sommelierSectionTitle}
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              {t.sommelierSectionDesc}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {personas.map((p) => {
              const active = p.id === selectedPersonaId;
              const name = lang === 'ko' ? p.nameKo : p.nameEn;
              const genre = lang === 'ko' ? p.genreKo : p.genreEn;

              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectPersona(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPersona(p.id);
                    }
                  }}
                  className={`flex cursor-pointer flex-col items-center rounded-2xl p-4 text-center transition-all ${
                    active ? 'somm-card-selected' : 'somm-card hover:shadow-md'
                  }`}
                >
                  <SommelierAvatar personaId={p.id} size={56} />
                  <div className="mt-2.5 text-[15px] font-bold text-[var(--text-primary)]">
                    {name}
                  </div>
                  <div className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                    {genre}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectPersona(p);
                    }}
                    className="mt-2.5 text-[12px] font-semibold text-[#6B1D2F] underline underline-offset-4 dark:text-[#E59BAE]"
                  >
                    {t.viewProfile}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Budget Chips + Direct Custom Budget Input (e.g. 150만원) */}
        <div>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.budgetSectionTitle}
            </h2>
            {(isCourseMultiBottle || hasCustomBudget) && (
              <div className="inline-flex rounded-full bg-[var(--bg-tertiary)] p-0.5">
                <button
                  type="button"
                  onClick={() => onBudgetScopeChange('per_bottle')}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                    budgetScope === 'per_bottle'
                      ? 'btn-accent'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {t.budgetPerBottle}
                </button>
                <button
                  type="button"
                  onClick={() => onBudgetScopeChange('total')}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                    budgetScope === 'total'
                      ? 'btn-accent'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {t.budgetTotal}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
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
                  className={`rounded-full px-4 py-2 text-[14px] font-semibold tabular-nums transition-colors ${
                    active
                      ? 'btn-accent'
                      : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                  }`}
                >
                  {BUDGET_LABELS[tier][lang]}
                </button>
              );
            })}
          </div>

          {/* Direct Custom Budget Input (man-won unit) */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-tertiary)] px-3.5 py-2">
              <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
                {lang === 'ko' ? '직접 입력' : 'Custom'}
              </span>
              <input
                type="number"
                min={1}
                step={1}
                value={customBudgetManWon}
                onChange={(e) => onCustomBudgetManWonChange(e.target.value)}
                placeholder={lang === 'ko' ? '예: 150' : 'e.g. 150'}
                className="w-20 bg-transparent text-right text-[14px] font-bold tabular-nums text-[var(--text-primary)] placeholder:font-normal placeholder:text-[var(--text-muted)] focus:outline-none"
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
              <span className="text-[12px] font-semibold tabular-nums text-[#6B1D2F] dark:text-[#E59BAE]">
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

        {/* 3. Integrated Dish / Course Pairing Section (Zero Developer Jargon) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.dishesSectionTitle}
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              {t.dishesSectionDesc}
            </p>
          </div>

          {/* Course-first venues (e.g. FRÈRE) show explicit Full Course vs Specific Dish choice */}
          {venue.venueType === 'course' && venue.courseMenu && venue.courseMenu.length > 0 && !menuAnalysis && (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onPairingScopeChange('course')}
                className={`rounded-2xl p-4 text-left transition-all ${
                  pairingScope === 'course'
                    ? 'somm-card-selected'
                    : 'somm-sub-surface hover:opacity-90'
                }`}
              >
                <div className="text-[14px] font-bold text-[var(--text-primary)]">
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
                <div className="text-[14px] font-bold text-[var(--text-primary)]">
                  {t.pairingScopeDishTitle}
                </div>
                <p className="prose-pretty mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                  {t.pairingScopeDishDesc}
                </p>
              </button>
            </div>
          )}

          {/* Dish chips + direct input + photo upload (shown for À la carte venues or Specific Dish mode) */}
          {(!isCourseActive || pairingScope === 'dishes') && (
            <>
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
                  accept="image/*"
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
            </>
          )}

          {isAnalyzingMenu && (
            <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-[13px] font-medium text-[#6B1D2F] dark:text-[#E59BAE]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#6B1D2F]" />
              <span>{t.ocrAnalyzing}</span>
            </div>
          )}

          {/* Uploaded Photo À la carte Result */}
          {menuAnalysis && menuAnalysis.mode === 'alacarte' && !isAnalyzingMenu && (
            <div className="somm-sub-surface space-y-2.5 rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#6B1D2F] px-3 py-1 text-[11px] font-semibold text-[#FFFFFF]">
                  {t.ocrBadgeAlacarte}
                </span>
                <button
                  type="button"
                  onClick={onClearMenuAnalysis}
                  className="text-[12px] font-semibold text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
                >
                  {t.ocrResetBtn}
                </button>
              </div>
              <p className="prose-pretty text-[13px] text-[var(--text-primary)]">
                {lang === 'ko' ? menuAnalysis.summaryKo : menuAnalysis.summaryEn}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {menuAnalysis.dishes.map((dish) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => onToggleOcrDish(dish.id)}
                    className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors ${
                      dish.selected
                        ? 'bg-[#F5EBEF] text-[#6B1D2F] ring-1 ring-[#6B1D2F]/40 dark:bg-[#2E181F] dark:text-[#F4B8C6]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                          dish.selected
                            ? 'bg-[#6B1D2F] text-[#FFFFFF]'
                            : 'border border-[var(--text-muted)]'
                        }`}
                      >
                        {dish.selected && <Check className="h-3 w-3" strokeWidth={2} />}
                      </span>
                      <span>{lang === 'ko' ? dish.nameKo : dish.nameEn}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Full Course Pairing Panel (FRÈRE Built-in Course or Uploaded Course Menu) */}
          {isCourseActive && !isAnalyzingMenu && (
            <div className="somm-sub-surface space-y-4 rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  {t.ocrCourseHint}
                </p>
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
                      className="flex items-center justify-between gap-3 rounded-xl bg-[var(--bg-secondary)] px-3 py-2 text-[13px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6B1D2F] text-[11px] font-bold tabular-nums text-[#FFFFFF]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="mr-2 text-[11px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                            {lang === 'ko' ? dish.stageKo : dish.stageEn}
                          </span>
                          <span className="font-medium text-[var(--text-primary)]">
                            {lang === 'ko' ? dish.nameKo : dish.nameEn}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Serve Format: Glass vs Bottle (with 1-4 bottle dropdown + extra glass option) */}
              <div>
                <div className="mb-2 text-[13px] font-semibold text-[var(--text-primary)]">
                  {t.courseServeFormatLabel}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onCourseServeFormatChange('glass')}
                    data-surface={courseServeFormat === 'glass' ? 'accent' : undefined}
                    className={`rounded-2xl p-3.5 text-left transition-all ${
                      courseServeFormat === 'glass'
                        ? 'btn-accent shadow-sm'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="text-[14px] font-bold">
                      {t.courseFormatGlassTitle}
                    </div>
                    <div
                      className={`mt-1 text-[11px] leading-snug ${
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
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="text-[14px] font-bold">
                      {t.courseFormatBottleTitle}
                    </div>
                    <div
                      className={`mt-1 text-[11px] leading-snug ${
                        courseServeFormat === 'bottle'
                          ? 'text-white/90'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {t.courseFormatBottleDesc}
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottle Count Dropdown (1-4 bottles) + Optional Extra Glass */}
              {courseServeFormat === 'bottle' && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--bg-secondary)] px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <label
                      htmlFor="course-bottle-select"
                      className="text-[13px] font-semibold text-[var(--text-primary)]"
                    >
                      {t.courseBottleCountLabel}
                    </label>
                    <select
                      id="course-bottle-select"
                      value={courseBottleCount}
                      onChange={(e) =>
                        onCourseBottleCountChange(Number(e.target.value) as CourseBottleCount)
                      }
                      className="rounded-xl bg-[var(--bg-tertiary)] px-3 py-1.5 text-[13px] font-bold tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num}
                          {lang === 'ko' ? t.courseBottleUnit : ` ${t.courseBottleUnit}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => onIncludeExtraGlassChange(!includeExtraGlass)}
                    data-surface={includeExtraGlass ? 'accent' : undefined}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                      includeExtraGlass
                        ? 'btn-accent'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    {includeExtraGlass && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                    <span>{t.courseExtraGlassToggle}</span>
                  </button>
                </div>
              )}

              {/* 2–4 Bottles -> Full-width aligned Sommelier Curated vs Custom Slot Picker */}
              {courseServeFormat === 'bottle' && courseBottleCount > 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onCoursePairingModeChange('ai_auto')}
                      data-surface={coursePairingMode === 'ai_auto' ? 'accent' : undefined}
                      className={`rounded-2xl p-3.5 text-left transition-all ${
                        coursePairingMode === 'ai_auto'
                          ? 'btn-accent shadow-sm'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="text-[13px] font-bold">
                        {t.courseModeAutoTitle}
                      </div>
                      <div
                        className={`mt-1 text-[11px] leading-snug ${
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
                      className={`rounded-2xl p-3.5 text-left transition-all ${
                        coursePairingMode === 'custom_slots'
                          ? 'btn-accent shadow-sm'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="text-[13px] font-bold">
                        {t.courseModeCustomTitle}
                      </div>
                      <div
                        className={`mt-1 text-[11px] leading-snug ${
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
                          <div
                            key={idx}
                            className="rounded-2xl bg-[var(--bg-secondary)] p-3.5 shadow-sm"
                          >
                            <div className="mb-2 text-[12px] font-semibold text-[var(--text-primary)]">
                              {idx + 1}
                              {lang === 'ko'
                                ? `번째 ${t.courseSlotPrefix} ${t.courseSlotSuffix}`
                                : ` · ${t.courseSlotPrefix} ${t.courseSlotSuffix}`}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {SLOT_CATEGORIES.map((cat) => {
                                const isCatActive = chosenCat === cat;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => onChangeCustomSlot(idx, cat)}
                                    data-surface={isCatActive ? 'accent' : undefined}
                                    className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                                      isCatActive
                                        ? 'btn-accent'
                                        : 'somm-sub-surface text-[var(--text-primary)]'
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
              )}
            </div>
          )}
        </div>

        {/* 4. Optional BYOB / Corkage Bottle Context */}
        <div className="somm-sub-surface rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[14px] font-bold text-[var(--text-primary)]">
                {lang === 'ko'
                  ? '가져오신 와인(콜키지)이 있으신가요?'
                  : 'Bringing a Corkage Bottle (BYOB)?'}
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                {lang === 'ko'
                  ? '지참하신 와인 라벨을 올리거나 입력하시면, 그 와인을 중심으로 나머지 바틀을 맞춰드립니다.'
                  : 'Add or scan your corkage bottle so remaining cellar picks harmonize around it.'}
              </p>
            </div>

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
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                corkageWine
                  ? 'btn-accent'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
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
          </div>

          {corkageWine && (
            <div className="mt-3.5 space-y-3 border-t border-[var(--border-subtle)] pt-3.5">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={corkageWine.name}
                  onChange={(e) =>
                    onCorkageWineChange({ ...corkageWine, name: e.target.value })
                  }
                  placeholder={
                    lang === 'ko'
                      ? '가져오신 와인 이름 (예: 나파 카베르네 소비뇽)'
                      : 'Bottle name (e.g., Napa Cabernet)'
                  }
                  className="flex-1 rounded-xl bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
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
                        category: scanned.category,
                        body: scanned.structure.body,
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
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#6B1D2F]/50 bg-[#F5EBEF]/60 px-3.5 py-2.5 text-[13px] font-semibold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]"
                >
                  <Camera className="h-4 w-4" strokeWidth={1.5} />
                  <span>
                    {isScanningCorkage
                      ? lang === 'ko'
                        ? '라벨 읽는 중...'
                        : 'Scanning...'
                      : lang === 'ko'
                        ? '콜키지 라벨 사진 올리기'
                        : 'Scan Corkage Label'}
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

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
                  {lang === 'ko' ? '마실 순서:' : 'Course Timing:'}
                </span>
                {(
                  [
                    { id: 'early' as const, ko: '초반 (식전·전채)', en: 'Early / Starter' },
                    { id: 'middle' as const, ko: '중간 (온요리)', en: 'Middle Course' },
                    { id: 'late' as const, ko: '후반 (메인)', en: 'Main Course' },
                  ]
                ).map((pos) => {
                  const active = corkageWine.slotPosition === pos.id;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() =>
                        onCorkageWineChange({
                          ...corkageWine,
                          slotPosition: pos.id,
                        })
                      }
                      data-surface={active ? 'accent' : undefined}
                      className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                        active
                          ? 'btn-accent'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                      }`}
                    >
                      {pos[lang]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Single Authoritative Full-Width Burgundy CTA */}
        <div className="pt-2">
          {!hasAnyDishSelected && (
            <p className="mb-2 flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
              <UtensilsCrossed className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{t.ctaRecommendDisabledHint}</span>
            </p>
          )}
          <button
            type="button"
            onClick={onSubmitRecommend}
            disabled={!hasAnyDishSelected}
            data-surface="accent"
            className="btn-accent w-full rounded-2xl px-6 py-4 text-[15px] font-bold tracking-tight shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-45"
          >
            {t.ctaRecommend}
          </button>
        </div>
      </section>
    </div>
  );
};
