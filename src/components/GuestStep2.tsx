import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react';
import type {
  Language,
  PairingRecommendationBundle,
  ValueTier,
  WineItem,
} from '../types/sommelier';
import { CATEGORY_LABELS, TRANSLATIONS, formatKrw } from '../i18n/translations';
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
  onBack: () => void;
  onSelectWineForDrinking: (wine: WineItem) => void;
}

export const GuestStep2: React.FC<GuestStep2Props> = ({
  lang,
  bundle,
  onBack,
  onSelectWineForDrinking,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);

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

        {/* Multi-Scenario Tabs (e.g. Champagne-Led / White-Led / Red-Led) */}
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
            commentary={lang === 'ko' ? item.commentaryKo : item.commentaryEn}
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
            commentary={
              lang === 'ko' ? slot.bridgeReasonKo : slot.bridgeReasonEn
            }
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
            lang === 'ko'
              ? bundle.extraGlass.commentaryKo
              : bundle.extraGlass.commentaryEn
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
  commentary: string;
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
  commentary,
  highlights,
  onChoose,
}) => {
  const t = TRANSLATIONS[lang];
  const wineName = lang === 'ko' ? wine.nameKo : wine.nameEn;
  const varietal = lang === 'ko' ? wine.varietalsKo : wine.varietalsEn;
  const region = lang === 'ko' ? wine.regionKo : wine.regionEn;

  return (
    <article className="somm-card rounded-3xl p-5 sm:p-7">
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
              {varietal} · {region}
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

      {/* Sommelier Persona Narrative */}
      <div className="mt-5 rounded-2xl border-l-[3px] border-[#6B1D2F] bg-[var(--bg-tertiary)]/55 px-4 py-3.5">
        <p className="prose-pretty text-[15px] leading-[1.6] text-[var(--text-primary)]">
          {commentary}
        </p>
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
