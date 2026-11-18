import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type {
  Language,
  PairingRecommendationBundle,
  SommelierPersona,
  SpeechStyle,
  ValueTier,
  WineItem,
} from '../types/sommelier';
import { CATEGORY_LABELS, TRANSLATIONS, formatKrw } from '../i18n/translations';
import { GlossaryText } from './GlossaryText';
import {
  CountryFlagBadge,
  SommelierAvatar,
  WineBottleIllustration,
} from './icons/WineVectors';
import {
  AromaSpectrumCard,
  ServingGuideStrip,
  StructureBalanceChart,
} from './TastingInfographics';

interface GuestStep2Props {
  lang: Language;
  bundle: PairingRecommendationBundle;
  personas: SommelierPersona[];
  speechStyle: SpeechStyle;
  onSpeechStyleChange: (style: SpeechStyle) => void;
  onBack: () => void;
  onSelectWineForDrinking: (wine: WineItem) => void;
  onSwitchPersona: (personaId: string) => void;
  onSwapWines: (activeScenarioIdx: number, wineIdsToSwap: string[]) => void;
}

export const GuestStep2: React.FC<GuestStep2Props> = ({
  lang,
  bundle,
  personas,
  speechStyle,
  onSpeechStyleChange,
  onBack,
  onSelectWineForDrinking,
  onSwitchPersona,
  onSwapWines,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [swapMode, setSwapMode] = useState(false);
  const [selectedSwapIds, setSelectedSwapIds] = useState<string[]>([]);

  const toggleSwapSelection = (wineId: string) => {
    setSelectedSwapIds((prev) =>
      prev.includes(wineId) ? prev.filter((id) => id !== wineId) : [...prev, wineId]
    );
  };

  const handleConfirmSwap = () => {
    if (selectedSwapIds.length === 0) return;
    onSwapWines(activeScenarioIdx, selectedSwapIds);
    setSelectedSwapIds([]);
    setSwapMode(false);
  };

  const personaName = lang === 'ko' ? bundle.persona.nameKo : bundle.persona.nameEn;
  const scenarios = bundle.courseScenarios ?? [];
  const activeScenario = scenarios[activeScenarioIdx] ?? scenarios[0];
  const activeSequence =
    activeScenario?.sequence ?? bundle.courseSequence ?? [];
  const activeTotalPrice =
    activeScenario?.totalPrice ?? bundle.totalPrice;

  const isEmpty =
    (bundle.kind === 'single_or_alacarte' &&
      (!bundle.singleItems || bundle.singleItems.length === 0)) ||
    (bundle.kind === 'course_sequence' && activeSequence.length === 0);

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 safe-bottom-scroll sm:px-6">
      {/* Top Return & Title */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-tertiary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t.step2BackBtn}</span>
        </button>

        <h1 className="mt-4 text-[24px] font-bold tracking-tight text-[var(--text-primary)]">
          {bundle.kind === 'course_sequence'
            ? t.step2TitleCourse
            : t.step2TitleSingle}
        </h1>
      </div>

      {/* Sommelier Persona Overall Rationale & Multi-Scenario Switcher */}
      <div className="somm-card rounded-3xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <SommelierAvatar personaId={bundle.persona.id} size={48} />
            <div>
              <div className="text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                {personaName}
              </div>
              <p className="prose-pretty mt-1 text-[15px] leading-[1.6] text-[var(--text-primary)]">
                {activeScenario
                  ? lang === 'ko'
                    ? activeScenario.focusDescKo
                    : activeScenario.focusDescEn
                  : lang === 'ko'
                    ? bundle.overallNoteKo
                    : bundle.overallNoteEn}
              </p>
            </div>
          </div>

          {bundle.kind === 'course_sequence' && activeSequence.length > 0 && (
            <div className="shrink-0 rounded-2xl bg-[#F5EBEF] px-4 py-3 text-right dark:bg-[#2E181F]">
              <div className="text-[11px] font-semibold text-[#6B1D2F] dark:text-[#F4B8C6]">
                {t.step2TotalCoursePrice}
              </div>
              <div className="mt-0.5 text-[20px] font-bold tabular-nums text-[#6B1D2F] dark:text-[#FFFFFF]">
                {formatKrw(activeTotalPrice, lang)}
              </div>
            </div>
          )}
        </div>

        {/* In-Place Sommelier Switcher + Selective Bottle Swap Trigger */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-semibold text-[var(--text-secondary)]">
              {lang === 'ko' ? '다른 소믈리에:' : 'Switch Sommelier:'}
            </span>
            {personas.map((p) => {
              const isCurrent = p.id === bundle.persona.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (!isCurrent) {
                      setSwapMode(false);
                      setSelectedSwapIds([]);
                      onSwitchPersona(p.id);
                    }
                  }}
                  data-surface={isCurrent ? 'accent' : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                    isCurrent
                      ? 'btn-accent'
                      : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                  }`}
                >
                  <SommelierAvatar personaId={p.id} size={18} />
                  <span>{lang === 'ko' ? p.nameKo : p.nameEn}</span>
                </button>
              );
            })}
          </div>

          {!isEmpty && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Speech Style Toggle (Friendly vs Expert) */}
              <div className="inline-flex rounded-full bg-[var(--bg-tertiary)] p-0.5">
                <button
                  type="button"
                  onClick={() => onSpeechStyleChange('friendly')}
                  data-surface={speechStyle === 'friendly' ? 'accent' : undefined}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    speechStyle === 'friendly'
                      ? 'btn-accent'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {lang === 'ko' ? '친근한 설명' : 'Friendly'}
                </button>
                <button
                  type="button"
                  onClick={() => onSpeechStyleChange('expert')}
                  data-surface={speechStyle === 'expert' ? 'accent' : undefined}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    speechStyle === 'expert'
                      ? 'btn-accent'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {lang === 'ko' ? '전문적인 설명' : 'Sommelier Pro'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSwapMode((prev) => !prev);
                  setSelectedSwapIds([]);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  swapMode
                    ? 'bg-[#2B1C22] text-[#FFFFFF]'
                    : 'bg-[#F5EBEF] text-[#6B1D2F] hover:opacity-90 dark:bg-[#2E181F] dark:text-[#F4B8C6]'
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>
                  {swapMode
                    ? lang === 'ko'
                      ? '바틀 교체 취소'
                      : 'Cancel Swap'
                    : lang === 'ko'
                      ? '특정 바틀만 바꿔서 재추천'
                      : 'Swap Specific Bottles'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Selective Swap Confirmation Bar */}
        {swapMode && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F5EBEF] px-4 py-3 dark:bg-[#2E181F]">
            <span className="text-[13px] font-medium text-[#6B1D2F] dark:text-[#F4B8C6]">
              {lang === 'ko'
                ? '이미 드셨거나 다른 스타일을 원하시는 와인만 체크한 뒤 재추천 버튼을 눌러주세요.'
                : 'Check the bottles you wish to replace, then confirm to get fresh selections.'}
            </span>
            <button
              type="button"
              onClick={handleConfirmSwap}
              disabled={selectedSwapIds.length === 0}
              data-surface="accent"
              className="btn-accent inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-bold disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>
                {lang === 'ko'
                  ? `선택한 ${selectedSwapIds.length}병 새로 추천받기`
                  : `Swap ${selectedSwapIds.length} Selected`}
              </span>
            </button>
          </div>
        )}

        {/* Multi-Scenario Tabs (e.g. Champagne Focus / White Focus / Red Focus) */}
        {bundle.kind === 'course_sequence' && scenarios.length > 1 && (
          <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {scenarios.map((sc, idx) => {
                const isSelected = idx === activeScenarioIdx;
                const comboText = sc.sequence
                  .map(
                    (s) =>
                      CATEGORY_LABELS[s.assignedCategory][
                        lang === 'ko' ? 'shortKo' : 'shortEn'
                      ]
                  )
                  .join(' · ');

                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setActiveScenarioIdx(idx)}
                    data-surface={isSelected ? 'accent' : undefined}
                    className={`rounded-2xl px-3.5 py-3 text-left transition-all ${
                      isSelected
                        ? 'btn-accent shadow-sm'
                        : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
                    }`}
                  >
                    <div className="text-[13px] font-bold">
                      {lang === 'ko' ? sc.labelKo : sc.labelEn}
                    </div>
                    <div
                      className={`mt-1 text-[11px] tabular-nums ${
                        isSelected
                          ? 'text-white/90'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {comboText} · {formatKrw(sc.totalPrice, lang)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Scenario Bottle Flow Strip */}
        {bundle.kind === 'course_sequence' && activeSequence.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3.5">
            {activeSequence.map((slot, idx) => (
              <React.Fragment key={slot.wine.id + idx}>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-tertiary)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-primary)]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6B1D2F] text-[10px] font-bold tabular-nums text-[#FFFFFF]">
                    {idx + 1}
                  </span>
                  <span>
                    {
                      CATEGORY_LABELS[slot.assignedCategory][
                        lang === 'ko' ? 'shortKo' : 'shortEn'
                      ]
                    }
                  </span>
                </div>
                {idx < activeSequence.length - 1 && (
                  <ArrowRight
                    className="h-3.5 w-3.5 text-[var(--text-secondary)]"
                    strokeWidth={1.5}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Empty Stock Guard */}
      {isEmpty && (
        <div className="somm-card rounded-3xl p-8 text-center">
          <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
            {t.noStockTitle}
          </h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            {t.noStockDesc}
          </p>
        </div>
      )}

      {/* Single / À la carte Neutral Cards */}
      {bundle.kind === 'single_or_alacarte' &&
        bundle.singleItems?.map((item, idx) => (
          <WineDetailRecommendationCard
            key={item.wine.id}
            lang={lang}
            wine={item.wine}
            badgeLabel={
              bundle.singleItems && bundle.singleItems.length > 1
                ? `${t.rankOption} ${idx + 1} · ${
                    CATEGORY_LABELS[item.wine.category][
                      lang === 'ko' ? 'shortKo' : 'shortEn'
                    ]
                  }`
                : `${t.rankOption} · ${
                    CATEGORY_LABELS[item.wine.category][
                      lang === 'ko' ? 'shortKo' : 'shortEn'
                    ]
                  }`
            }
            valueTier={item.valueTier}
            swapMode={swapMode}
            isSwapChecked={selectedSwapIds.includes(item.wine.id)}
            onToggleSwap={() => toggleSwapSelection(item.wine.id)}
            commentary={
              speechStyle === 'expert'
                ? lang === 'ko'
                  ? item.expertCommentaryKo
                  : item.expertCommentaryEn
                : lang === 'ko'
                  ? item.commentaryKo
                  : item.commentaryEn
            }
            tastingTip={lang === 'ko' ? item.tastingTipKo : item.tastingTipEn}
            highlights={
              lang === 'ko' ? item.pairingPointsKo : item.pairingPointsEn
            }
            onChoose={() => onSelectWineForDrinking(item.wine)}
          />
        ))}

      {/* Multi-Bottle Course Sequence Cards */}
      {bundle.kind === 'course_sequence' &&
        activeSequence.map((slot) => (
          <WineDetailRecommendationCard
            key={`${activeScenario?.id ?? 'sc'}-${slot.slotIndex}-${slot.wine.id}`}
            lang={lang}
            wine={slot.wine}
            badgeLabel={
              bundle.serveFormat === 'glass'
                ? lang === 'ko'
                  ? `제 ${slot.slotIndex + 1}잔 · ${CATEGORY_LABELS[slot.assignedCategory].shortKo}`
                  : `Glass ${slot.slotIndex + 1} · ${CATEGORY_LABELS[slot.assignedCategory].shortEn}`
                : lang === 'ko'
                  ? `${t.bottleSeqPrefix} ${slot.slotIndex + 1}${t.bottleSeqSuffix} · ${CATEGORY_LABELS[slot.assignedCategory].shortKo}`
                  : `${t.bottleSeqPrefix} ${slot.slotIndex + 1} · ${CATEGORY_LABELS[slot.assignedCategory].shortEn}`
            }
            courseSegmentTitle={
              lang === 'ko' ? slot.courseSegmentKo : slot.courseSegmentEn
            }
            courseDishes={
              lang === 'ko' ? slot.assignedDishesKo : slot.assignedDishesEn
            }
            valueTier={slot.valueTier}
            swapMode={swapMode}
            isSwapChecked={selectedSwapIds.includes(slot.wine.id)}
            onToggleSwap={() => toggleSwapSelection(slot.wine.id)}
            commentary={
              speechStyle === 'expert'
                ? lang === 'ko'
                  ? slot.expertBridgeReasonKo
                  : slot.expertBridgeReasonEn
                : lang === 'ko'
                  ? slot.bridgeReasonKo
                  : slot.bridgeReasonEn
            }
            tastingTip={lang === 'ko' ? slot.tastingTipKo : slot.tastingTipEn}
            onChoose={() => onSelectWineForDrinking(slot.wine)}
          />
        ))}

      {/* Optional Complementary Extra Glass Card */}
      {bundle.extraGlass && (
        <WineDetailRecommendationCard
          lang={lang}
          wine={bundle.extraGlass.wine}
          badgeLabel={
            lang === 'ko'
              ? `추가 글라스 추천 · ${CATEGORY_LABELS[bundle.extraGlass.wine.category].shortKo}`
              : `Extra Glass · ${CATEGORY_LABELS[bundle.extraGlass.wine.category].shortEn}`
          }
          valueTier={bundle.extraGlass.valueTier}
          commentary={
            speechStyle === 'expert'
              ? lang === 'ko'
                ? bundle.extraGlass.expertCommentaryKo
                : bundle.extraGlass.expertCommentaryEn
              : lang === 'ko'
                ? bundle.extraGlass.commentaryKo
                : bundle.extraGlass.commentaryEn
          }
          tastingTip={
            lang === 'ko'
              ? bundle.extraGlass.tastingTipKo
              : bundle.extraGlass.tastingTipEn
          }
          highlights={
            lang === 'ko'
              ? bundle.extraGlass.pairingPointsKo
              : bundle.extraGlass.pairingPointsEn
          }
          onChoose={() => onSelectWineForDrinking(bundle.extraGlass!.wine)}
        />
      )}

      {/* Hospitality / Staff Respect Note */}
      <div className="flex items-start gap-2 rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-[12px] text-[var(--text-secondary)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
        <p className="prose-pretty">{t.step2StaffRespectNote}</p>
      </div>
    </div>
  );
};

interface WineCardProps {
  lang: Language;
  wine: WineItem;
  badgeLabel: string;
  courseSegmentTitle?: string;
  courseDishes?: string[];
  valueTier: ValueTier;
  swapMode?: boolean;
  isSwapChecked?: boolean;
  onToggleSwap?: () => void;
  commentary: string;
  tastingTip?: string;
  highlights?: string[];
  onChoose: () => void;
}

const WineDetailRecommendationCard: React.FC<WineCardProps> = ({
  lang,
  wine,
  badgeLabel,
  courseSegmentTitle,
  courseDishes,
  valueTier,
  swapMode = false,
  isSwapChecked = false,
  onToggleSwap,
  commentary,
  tastingTip,
  highlights,
  onChoose,
}) => {
  const t = TRANSLATIONS[lang];
  const wineName = lang === 'ko' ? wine.nameKo : wine.nameEn;
  const varietal = lang === 'ko' ? wine.varietalsKo : wine.varietalsEn;
  const region = lang === 'ko' ? wine.regionKo : wine.regionEn;

  return (
    <article
      className={`rounded-3xl p-5 sm:p-7 transition-all ${
        isSwapChecked ? 'somm-card-selected' : 'somm-card'
      }`}
    >
      {/* Selective Swap Checkbox Strip */}
      {swapMode && onToggleSwap && (
        <button
          type="button"
          onClick={onToggleSwap}
          className={`mb-4 flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-[13px] font-semibold transition-colors ${
            isSwapChecked
              ? 'bg-[#6B1D2F] text-[#FFFFFF]'
              : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded ${
                isSwapChecked
                  ? 'bg-[#FFFFFF] text-[#6B1D2F]'
                  : 'border border-[var(--text-muted)]'
              }`}
            >
              {isSwapChecked && <Check className="h-3 w-3" strokeWidth={2.5} />}
            </span>
            <span>
              {lang === 'ko'
                ? isSwapChecked
                  ? '이 바틀을 새로운 와인으로 교체합니다'
                  : '이 바틀을 다른 와인으로 바꾸기'
                : isSwapChecked
                  ? 'Selected for replacement'
                  : 'Check to swap this bottle'}
            </span>
          </div>
        </button>
      )}

      {/* Course Segment Banner when in Course Mode */}
      {courseSegmentTitle && (
        <div className="mb-4 rounded-2xl bg-[#F5EBEF] px-4 py-2.5 dark:bg-[#2E181F]">
          <div className="text-[12px] font-bold text-[#6B1D2F] dark:text-[#F4B8C6]">
            {courseSegmentTitle}
          </div>
          {courseDishes && courseDishes.length > 0 && (
            <div className="mt-0.5 text-[12px] text-[var(--text-primary)]">
              {courseDishes.join(' · ')}
            </div>
          )}
        </div>
      )}

      {/* Top Identity Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-tertiary)] px-3 py-2.5">
            <WineBottleIllustration
              category={wine.category}
              producer={wine.producer}
              vintage={wine.vintage}
              className="h-28 w-11"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#6B1D2F] px-3 py-1 text-[11px] font-semibold text-[#FFFFFF]">
                {badgeLabel}
              </span>
              {valueTier === 'great_value' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FBF4E8] px-3 py-1 text-[11px] font-bold text-[#7A541C] dark:bg-[#2B2214] dark:text-[#ECC88D]">
                  <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                  <span>{t.badgeGreatValue}</span>
                </span>
              )}
              {valueTier === 'fair_dining' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
                  <span>{t.badgeFairDining}</span>
                </span>
              )}
            </div>

            <h2 className="mt-2.5 text-[20px] font-bold leading-snug text-[var(--text-primary)]">
              {wineName}{' '}
              <span className="font-semibold tabular-nums text-[var(--text-secondary)]">
                {wine.vintage}
              </span>
            </h2>

            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              <GlossaryText text={`${varietal} · ${region}`} lang={lang} />
            </p>

            <div className="mt-2.5">
              <CountryFlagBadge countryCode={wine.countryCode} lang={lang} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-baseline justify-between border-t border-[var(--border-subtle)] pt-3 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
          <div>
            <div className="text-[11px] font-medium text-[var(--text-secondary)]">
              {t.venuePriceLabel}
            </div>
            <div className="text-[22px] font-bold tabular-nums text-[var(--text-primary)]">
              {formatKrw(wine.venuePrice, lang)}
            </div>
          </div>
        </div>
      </div>

      {/* Sommelier Persona Narrative (with tappable wine glossary terms) */}
      <div className="mt-5 rounded-2xl border-l-[3px] border-[#6B1D2F] bg-[var(--bg-tertiary)]/55 px-4 py-3.5">
        <p className="prose-pretty text-[15px] leading-[1.6] text-[var(--text-primary)]">
          <GlossaryText text={commentary} lang={lang} />
        </p>

        {tastingTip && (
          <div className="mt-3 rounded-xl bg-[#FBF4E8]/85 px-3.5 py-2.5 text-[13px] leading-relaxed text-[#5C3D12] dark:bg-[#2B2214] dark:text-[#ECC88D]">
            <span className="mr-1.5 font-bold">
              {lang === 'ko' ? '시음 팁 ·' : 'Tasting Tip ·'}
            </span>
            <GlossaryText text={tastingTip} lang={lang} />
          </div>
        )}

        {highlights && highlights.length > 0 && (
          <ul className="mt-2.5 space-y-1">
            {highlights.map((pt, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]"
              >
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-[#6B1D2F] dark:text-[#E59BAE]"
                  strokeWidth={1.5}
                />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Visualized Tasting Note & Serving Guide Infographics */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StructureBalanceChart wine={wine} lang={lang} />
        <AromaSpectrumCard wine={wine} lang={lang} />
      </div>

      <div className="mt-4">
        <ServingGuideStrip wine={wine} lang={lang} valueTier={valueTier} />
      </div>

      {/* Bottle Selection / In-Drinking Guide CTA */}
      <div className="mt-5">
        <button
          type="button"
          onClick={onChoose}
          data-surface="accent"
          className="btn-accent w-full rounded-2xl px-5 py-3.5 text-[14px] font-semibold transition-colors"
        >
          {t.chooseWineCta}
        </button>
      </div>
    </article>
  );
};
