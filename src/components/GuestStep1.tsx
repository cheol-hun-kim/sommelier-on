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
  BodyPref,
  BudgetScope,
  BudgetTier,
  CourseBottleCount,
  CoursePairingMode,
  Language,
  MenuAnalysisResult,
  OccasionType,
  ParsedMenuDish,
  SommelierPersona,
  SweetnessPref,
  UserTasteProfile,
  Venue,
  WineCategory,
} from '../types/sommelier';
import {
  BODY_LABELS,
  BUDGET_LABELS,
  CATEGORY_LABELS,
  OCCASION_LABELS,
  SWEETNESS_LABELS,
  TRANSLATIONS,
} from '../i18n/translations';
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
  budgetScope: BudgetScope;
  onBudgetScopeChange: (scope: BudgetScope) => void;
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
  courseBottleCount: CourseBottleCount;
  onCourseBottleCountChange: (count: CourseBottleCount) => void;
  coursePairingMode: CoursePairingMode;
  onCoursePairingModeChange: (mode: CoursePairingMode) => void;
  customSlots: WineCategory[];
  onChangeCustomSlot: (slotIdx: number, cat: WineCategory) => void;
  onApplySlotPreset: (slots: WineCategory[]) => void;
  bodyPref: BodyPref;
  onBodyPrefChange: (pref: BodyPref) => void;
  sweetnessPref: SweetnessPref;
  onSweetnessPrefChange: (pref: SweetnessPref) => void;
  occasion: OccasionType;
  onOccasionChange: (occ: OccasionType) => void;
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
  budgetScope,
  onBudgetScopeChange,
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
  courseBottleCount,
  onCourseBottleCountChange,
  coursePairingMode,
  onCoursePairingModeChange,
  customSlots,
  onChangeCustomSlot,
  onApplySlotPreset,
  bodyPref,
  onBodyPrefChange,
  sweetnessPref,
  onSweetnessPrefChange,
  occasion,
  onOccasionChange,
  tasteProfile,
  onResetTasteProfile,
  hasAnyDishSelected,
  onSubmitRecommend,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [courseListExpanded, setCourseListExpanded] = useState(false);

  const isCourseActive =
    menuAnalysis?.mode === 'course' ||
    (venue.venueType === 'course' && pairingScope === 'course' && !menuAnalysis);
  const activeCourseDishes =
    menuAnalysis?.mode === 'course'
      ? menuAnalysis.dishes
      : venue.courseMenu ?? [];
  const isCourseMultiBottle = isCourseActive && courseBottleCount > 1;
  const hasTasteMemory =
    tasteProfile.likedWineIds.length > 0 ||
    tasteProfile.dislikedFeedbacks.length > 0;

  const quickPresets: Array<{
    label2Ko: string;
    label2En: string;
    label3Ko: string;
    label3En: string;
    slots2: WineCategory[];
    slots3: WineCategory[];
  }> = [
    {
      label2Ko: '샴레',
      label2En: 'Spk · Red',
      label3Ko: '샴화레',
      label3En: 'Spk · Wht · Red',
      slots2: ['sparkling', 'red'],
      slots3: ['sparkling', 'white', 'red'],
    },
    {
      label2Ko: '화레',
      label2En: 'Wht · Red',
      label3Ko: '화레레',
      label3En: 'Wht · Red · Red',
      slots2: ['white', 'red'],
      slots3: ['white', 'red', 'red'],
    },
    {
      label2Ko: '화화',
      label2En: 'Wht · Wht',
      label3Ko: '화화화',
      label3En: 'Wht · Wht · Wht',
      slots2: ['white', 'white'],
      slots3: ['white', 'white', 'white'],
    },
    {
      label2Ko: '샴샴',
      label2En: 'Spk · Spk',
      label3Ko: '샴샴샴',
      label3En: 'Spk · Spk · Spk',
      slots2: ['sparkling', 'sparkling'],
      slots3: ['sparkling', 'sparkling', 'sparkling'],
    },
  ];

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

        {/* 2. Budget Chips (+ Per-Bottle vs Total toggle for multi-bottle course) */}
        <div>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.budgetSectionTitle}
            </h2>
            {isCourseMultiBottle && (
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
              const active = tier === budgetTier;
              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => onBudgetTierChange(tier)}
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

              {/* 1 / 2 / 3 Bottle Count Picker */}
              <div>
                <div className="mb-2 text-[13px] font-semibold text-[var(--text-primary)]">
                  {t.courseBottleCountLabel}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { count: 1 as const, label: t.course1Bottle },
                    { count: 2 as const, label: t.course2Bottles },
                    { count: 3 as const, label: t.course3Bottles },
                  ]).map((opt) => {
                    const active = courseBottleCount === opt.count;
                    return (
                      <button
                        key={opt.count}
                        type="button"
                        onClick={() => onCourseBottleCountChange(opt.count)}
                        data-surface={active ? 'accent' : undefined}
                        className={`rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                          active
                            ? 'btn-accent'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2 or 3 Bottles -> Sommelier Curated vs Custom Slot Picker */}
              {courseBottleCount > 1 && (
                <div className="space-y-3 rounded-2xl bg-[#F5EBEF]/65 p-3.5 dark:bg-[#2E181F]/65">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => onCoursePairingModeChange('ai_auto')}
                      className={`rounded-xl p-3 text-left transition-all ${
                        coursePairingMode === 'ai_auto'
                          ? 'bg-[#6B1D2F] text-[#FFFFFF] shadow-sm'
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
                      className={`rounded-xl p-3 text-left transition-all ${
                        coursePairingMode === 'custom_slots'
                          ? 'bg-[#6B1D2F] text-[#FFFFFF] shadow-sm'
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
                    <div className="space-y-3 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {quickPresets.map((preset) => {
                          const isTwo = courseBottleCount === 2;
                          const targetArr = isTwo ? preset.slots2 : preset.slots3;
                          const label = isTwo
                            ? lang === 'ko'
                              ? preset.label2Ko
                              : preset.label2En
                            : lang === 'ko'
                              ? preset.label3Ko
                              : preset.label3En;
                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() => onApplySlotPreset(targetArr)}
                              className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-[11px] font-semibold text-[#6B1D2F] shadow-sm hover:bg-[#6B1D2F] hover:text-[#FFFFFF] dark:text-[#F4B8C6]"
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-2.5">
                        {Array.from({ length: courseBottleCount }).map((_, idx) => {
                          const chosenCat = customSlots[idx] ?? 'white';
                          return (
                            <div
                              key={idx}
                              className="rounded-xl bg-[var(--bg-secondary)] p-3 shadow-sm"
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
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Palate Preferences & Occasion */}
        <div className="space-y-5">
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
            {t.tasteSectionTitle}
          </h2>

          {/* Body */}
          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-secondary)]">
              {t.bodyLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(BODY_LABELS) as BodyPref[]).map((bp) => {
                const active = bp === bodyPref;
                return (
                  <button
                    key={bp}
                    type="button"
                    onClick={() => onBodyPrefChange(bp)}
                    data-surface={active ? 'accent' : undefined}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                      active
                        ? 'btn-accent'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    {BODY_LABELS[bp][lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sweetness */}
          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-secondary)]">
              {t.sweetnessLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SWEETNESS_LABELS) as SweetnessPref[]).map((sw) => {
                const active = sw === sweetnessPref;
                return (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => onSweetnessPrefChange(sw)}
                    data-surface={active ? 'accent' : undefined}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                      active
                        ? 'btn-accent'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    {SWEETNESS_LABELS[sw][lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <div className="mb-2 text-[13px] font-medium text-[var(--text-secondary)]">
              {t.occasionLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((occ) => {
                const active = occ === occasion;
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => onOccasionChange(occ)}
                    data-surface={active ? 'accent' : undefined}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                      active
                        ? 'btn-accent'
                        : 'somm-sub-surface text-[var(--text-primary)]'
                    }`}
                  >
                    {OCCASION_LABELS[occ][lang]}
                  </button>
                );
              })}
            </div>
          </div>
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
