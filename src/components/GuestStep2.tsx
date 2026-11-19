import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Sparkles,
  Wine,
  X,
} from 'lucide-react';
import type {
  Language,
  PairingRecommendationBundle,
  SpeechStyle,
  ValueTier,
  Venue,
  VisitTiming,
  WineItem,
} from '../types/sommelier';
import { CATEGORY_LABELS, TRANSLATIONS, formatKrw } from '../i18n/translations';
import { GlossaryText } from './GlossaryText';
import { SlidingSwitch } from './SlidingSwitch';
import {
  CountryFlagBadge,
  SommelierAvatar,
  WineBottleIllustration,
} from './icons/WineVectors';
import {
  AromaSpectrumCard,
  CompactAromaIconRow,
  ServingGuideStrip,
  StructureBalanceChart,
} from './TastingInfographics';

interface GuestStep2Props {
  lang: Language;
  venue: Venue;
  visitTiming: VisitTiming;
  bundle: PairingRecommendationBundle;
  speechStyle: SpeechStyle;
  onSpeechStyleChange: (style: SpeechStyle) => void;
  onBack: () => void;
  onSelectWineForDrinking: (wine: WineItem) => void;
  onSwapWines: (activeScenarioIdx: number, wineIdsToSwap: string[]) => void;
  onCreateReservation: (input: {
    guestName: string;
    guestContact: string;
    visitDate: string;
    note?: string;
    selectedWines: WineItem[];
  }) => void;
}

export const GuestStep2: React.FC<GuestStep2Props> = ({
  lang,
  venue,
  visitTiming,
  bundle,
  speechStyle,
  onSpeechStyleChange,
  onBack,
  onSelectWineForDrinking,
  onSwapWines,
  onCreateReservation,
}) => {
  const t = TRANSLATIONS[lang];
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [reserveContact, setReserveContact] = useState('');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveNote, setReserveNote] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState(false);
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

  const contextCtaLabel =
    visitTiming === 'pre_visit'
      ? lang === 'ko'
        ? '이 와인의 스토리 · 포도밭 미리 살펴보기'
        : 'Preview Wine Story & Vineyard'
      : t.chooseWineCta;

  const contextPriceLabel =
    bundle.sourceMode === 'my_cellar'
      ? lang === 'ko'
        ? '셀러 추정가'
        : 'Cellar Est.'
      : bundle.sourceMode === 'wine_shop'
        ? lang === 'ko'
          ? '와인샵 예상가'
          : 'Shop Price'
        : undefined;

  const isEmpty =
    (bundle.kind === 'single_or_alacarte' &&
      (!bundle.singleItems || bundle.singleItems.length === 0)) ||
    (bundle.kind === 'corkage_only' &&
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
            : bundle.kind === 'corkage_only'
              ? lang === 'ko'
                ? '가져오신 와인 테이스팅 · 페어링 가이드'
                : 'Your Corkage Bottle & Venue Dish Guide'
              : t.step2TitleSingle}
        </h1>
      </div>

      {/* Sommelier Persona Overall Rationale & Multi-Scenario Switcher */}
      <div className="somm-card rounded-3xl p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <SommelierAvatar personaId={bundle.persona.id} size={48} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                    {personaName}
                  </span>
                  {(visitTiming === 'pre_visit' ||
                    (bundle.sourceMode && bundle.sourceMode !== 'venue_cellar')) && (
                    <span className="rounded-full bg-[#F5EBEF] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
                      {visitTiming === 'pre_visit'
                        ? lang === 'ko'
                          ? '방문 전 준비'
                          : 'Pre-Visit'
                        : ''}
                      {bundle.sourceLabelKo
                        ? ` · ${lang === 'ko' ? bundle.sourceLabelKo : bundle.sourceLabelEn}`
                        : ''}
                    </span>
                  )}
                </div>
                {!isEmpty && bundle.kind !== 'corkage_only' && (
                  <SlidingSwitch
                    size="sm"
                    value={speechStyle}
                    options={[
                      {
                        value: 'friendly',
                        label: lang === 'ko' ? '친근한 설명' : 'Friendly',
                      },
                      {
                        value: 'expert',
                        label: lang === 'ko' ? '전문적인 설명' : 'Sommelier Pro',
                      },
                    ]}
                    onChange={onSpeechStyleChange}
                  />
                )}
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

        {/* Registered Venue Sommelier Credential + Selective Bottle Swap Trigger */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
          <div className="text-[12px] text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {lang === 'ko' ? bundle.persona.titleKo : bundle.persona.titleEn}
            </span>
            <span className="mx-1.5">·</span>
            <span>
              {lang === 'ko'
                ? bundle.persona.credentialsKo
                : bundle.persona.credentialsEn}
            </span>
          </div>

          {!isEmpty && bundle.kind !== 'corkage_only' && (
            <div className="flex flex-wrap items-center gap-2">
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

        {/* Pre-Visit Venue Wine Reservation (Hold) Banner */}
        {visitTiming === 'pre_visit' &&
          bundle.sourceMode === 'venue_cellar' &&
          venue.allowPreVisitVenueList !== false &&
          !isEmpty && (
            <div className="mt-4 rounded-2xl border border-[#6B1D2F]/20 bg-[#F5EBEF]/60 p-4 dark:border-[#E59BAE]/25 dark:bg-[#2E181F]/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[14px] font-bold text-[var(--text-primary)]">
                    {lang === 'ko'
                      ? '방문 전 업장 와인 예약(홀딩) 신청'
                      : 'Reserve Recommended Wines Before Visit'}
                  </div>
                  <div className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                    {lang === 'ko'
                      ? '추천받은 와인이 품절되지 않도록 방문 전 업장 셀러에 미리 예약을 걸어둘 수 있습니다.'
                      : 'Place a pre-visit hold so your curated bottles are chilled and ready upon arrival.'}
                  </div>
                </div>
                {!reserveSuccess && (
                  <button
                    type="button"
                    onClick={() => setReserveOpen((prev) => !prev)}
                    data-surface="accent"
                    className="btn-accent rounded-full px-4 py-2 text-[12px] font-semibold shadow-sm"
                  >
                    {reserveOpen
                      ? lang === 'ko'
                        ? '입력 닫기'
                        : 'Close'
                      : lang === 'ko'
                        ? '와인 예약 신청하기'
                        : 'Request Wine Hold'}
                  </button>
                )}
              </div>

              {reserveSuccess && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] font-semibold text-[#6B1D2F] dark:text-[#F4B8C6]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span>
                    {lang === 'ko'
                      ? '방문 전 와인 예약 요청이 업장에 접수되었습니다. 방문 시 성함을 말씀해 주세요.'
                      : 'Your pre-visit wine reservation has been submitted to the venue.'}
                  </span>
                </div>
              )}

              {reserveOpen && !reserveSuccess && (
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <input
                    type="text"
                    value={reserveName}
                    onChange={(e) => setReserveName(e.target.value)}
                    placeholder={lang === 'ko' ? '예약자 성함' : 'Guest Name'}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)]"
                  />
                  <input
                    type="text"
                    value={reserveContact}
                    onChange={(e) => setReserveContact(e.target.value)}
                    placeholder={lang === 'ko' ? '연락처 (010-...)' : 'Phone / Contact'}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)]"
                  />
                  <input
                    type="text"
                    value={reserveDate}
                    onChange={(e) => setReserveDate(e.target.value)}
                    placeholder={
                      lang === 'ko' ? '방문 일시 (예: 11/22 19:00)' : 'Visit Date & Time'
                    }
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)]"
                  />
                  <input
                    type="text"
                    value={reserveNote}
                    onChange={(e) => setReserveNote(e.target.value)}
                    placeholder={
                      lang === 'ko'
                        ? '요청 메모 (선택, 예: 칠링 부탁)'
                        : 'Optional note (e.g., chill before arrival)'
                    }
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)] sm:col-span-2"
                  />
                  <button
                    type="button"
                    disabled={!reserveName.trim() || !reserveContact.trim() || !reserveDate.trim()}
                    onClick={() => {
                      const winesToHold: WineItem[] =
                        bundle.kind === 'course_sequence'
                          ? activeSequence.map((s) => s.wine)
                          : (bundle.singleItems ?? []).slice(0, 1).map((i) => i.wine);
                      onCreateReservation({
                        guestName: reserveName.trim(),
                        guestContact: reserveContact.trim(),
                        visitDate: reserveDate.trim(),
                        note: reserveNote.trim() || undefined,
                        selectedWines: winesToHold,
                      });
                      setReserveSuccess(true);
                      setReserveOpen(false);
                    }}
                    data-surface="accent"
                    className="btn-accent rounded-xl px-4 py-2 text-[13px] font-bold disabled:opacity-50"
                  >
                    {lang === 'ko' ? '예약 확정 요청' : 'Confirm Wine Hold'}
                  </button>
                </div>
              )}
            </div>
          )}

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

      {/* Corkage-Only Dish & Course Stage Recommendations */}
      {bundle.kind === 'corkage_only' &&
        bundle.corkageDishMatches &&
        bundle.corkageDishMatches.length > 0 && (
          <section className="somm-card rounded-3xl p-5 sm:p-6">
            <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
              {bundle.menuMode === 'course'
                ? lang === 'ko'
                  ? '코스 중 가져오신 와인이 가장 빛나는 요리 구간'
                  : 'Best Course Moments for Your Corkage Bottle'
                : lang === 'ko'
                  ? '가져오신 와인과 가장 잘 어울리는 이 업장 추천 메뉴'
                  : 'Best Matching Dishes From This Menu'}
            </h2>
            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {bundle.corkageDishMatches.map((dm, idx) => (
                <div
                  key={idx}
                  className="somm-sub-surface rounded-2xl p-4"
                >
                  {dm.stageKo && (
                    <div className="text-[11px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                      {lang === 'ko' ? dm.stageKo : dm.stageEn}
                    </div>
                  )}
                  <div className="mt-1 text-[14px] font-bold text-[var(--text-primary)]">
                    {lang === 'ko' ? dm.dishNameKo : dm.dishNameEn}
                  </div>
                  <p className="prose-pretty mt-1.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                    {lang === 'ko' ? dm.reasonKo : dm.reasonEn}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* Corkage-Only Bottle Full Tasting Card */}
      {bundle.kind === 'corkage_only' &&
        bundle.singleItems?.map((item) => (
          <WineDetailRecommendationCard
            key={item.wine.id}
            lang={lang}
            wine={item.wine}
            badgeLabel={
              lang === 'ko'
                ? `고객 지참 (콜키지) · ${CATEGORY_LABELS[item.wine.category].shortKo}`
                : `Guest Corkage · ${CATEGORY_LABELS[item.wine.category].shortEn}`
            }
            isCorkage={true}
            valueTier={null}
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
            ctaLabel={contextCtaLabel}
            priceLabel={contextPriceLabel}
            onChoose={() => onSelectWineForDrinking(item.wine)}
          />
        ))}

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
            ctaLabel={contextCtaLabel}
            priceLabel={contextPriceLabel}
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
              slot.isCorkage
                ? lang === 'ko'
                  ? `고객 지참 (콜키지) · ${CATEGORY_LABELS[slot.assignedCategory].shortKo}`
                  : `Guest Corkage · ${CATEGORY_LABELS[slot.assignedCategory].shortEn}`
                : bundle.serveFormat === 'glass'
                  ? lang === 'ko'
                    ? `제 ${slot.slotIndex + 1}잔 · ${CATEGORY_LABELS[slot.assignedCategory].shortKo}`
                    : `Glass ${slot.slotIndex + 1} · ${CATEGORY_LABELS[slot.assignedCategory].shortEn}`
                  : lang === 'ko'
                    ? `${t.bottleSeqPrefix} ${slot.slotIndex + 1}${t.bottleSeqSuffix} · ${CATEGORY_LABELS[slot.assignedCategory].shortKo}`
                    : `${t.bottleSeqPrefix} ${slot.slotIndex + 1} · ${CATEGORY_LABELS[slot.assignedCategory].shortEn}`
            }
            isCorkage={slot.isCorkage}
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
            ctaLabel={contextCtaLabel}
            priceLabel={contextPriceLabel}
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
          ctaLabel={contextCtaLabel}
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
  isCorkage?: boolean;
  swapMode?: boolean;
  isSwapChecked?: boolean;
  onToggleSwap?: () => void;
  commentary: string;
  tastingTip?: string;
  highlights?: string[];
  ctaLabel?: string;
  priceLabel?: string;
  onChoose: () => void;
}

const WineDetailRecommendationCard: React.FC<WineCardProps> = ({
  lang,
  wine,
  badgeLabel,
  courseSegmentTitle,
  courseDishes,
  valueTier,
  isCorkage = false,
  swapMode = false,
  isSwapChecked = false,
  onToggleSwap,
  commentary,
  tastingTip,
  highlights,
  ctaLabel,
  priceLabel,
  onChoose,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeModal, setActiveModal] = useState<'notes' | 'commentary' | null>(null);
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
              {isCorkage
                ? lang === 'ko'
                  ? '지참 와인'
                  : 'BYOB'
                : priceLabel ?? t.venuePriceLabel}
            </div>
            <div className="text-[22px] font-bold tabular-nums text-[var(--text-primary)]">
              {isCorkage
                ? lang === 'ko'
                  ? '고객 지참'
                  : 'Corkage'
                : formatKrw(wine.venuePrice, lang)}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Compact Action Buttons Directly Above 5-Aroma Icons */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border-subtle)] pt-4">
        <button
          type="button"
          onClick={() => setActiveModal('notes')}
          className="somm-sub-surface flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[12px] font-bold text-[var(--text-primary)] transition-colors hover:opacity-85"
        >
          <Wine className="h-3.5 w-3.5 shrink-0 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.75} />
          <span>{lang === 'ko' ? '테이스팅 노트' : 'Tasting Notes'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('commentary')}
          className="somm-sub-surface flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[12px] font-bold text-[var(--text-primary)] transition-colors hover:opacity-85"
        >
          <MessageSquareText className="h-3.5 w-3.5 shrink-0 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.75} />
          <span>{lang === 'ko' ? '소믈리에 설명' : 'Rationale'}</span>
        </button>

        <button
          type="button"
          onClick={onChoose}
          data-surface="accent"
          className="btn-accent flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[12px] font-bold shadow-xs transition-colors"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          <span>{lang === 'ko' ? '스토리 · 포도밭' : 'Story & Map'}</span>
        </button>
      </div>

      {/* Always-Visible Intuitive 5-Icon Aroma Strip */}
      <div className="mt-3">
        <CompactAromaIconRow wine={wine} lang={lang} />
      </div>

      {/* Clean Modal Popups for Tasting Notes / Sommelier Commentary */}
      {activeModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="somm-card max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-5 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                  {activeModal === 'notes'
                    ? lang === 'ko'
                      ? '테이스팅 노트 · 구조 밸런스 & 34종 아로마 휠'
                      : 'Tasting Notes · Structure & 34-Aroma Wheel'
                    : lang === 'ko'
                      ? '소믈리에 추천 이유 & 음식 시음 팁'
                      : 'Sommelier Rationale & Tasting Tip'}
                </div>
                <h3 className="mt-1 text-[19px] font-bold text-[var(--text-primary)]">
                  {wineName}{' '}
                  <span className="font-semibold tabular-nums text-[var(--text-secondary)]">
                    {wine.vintage}
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="somm-sub-surface rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            {activeModal === 'notes' ? (
              <div className="space-y-4">
                <StructureBalanceChart wine={wine} lang={lang} />
                <AromaSpectrumCard wine={wine} lang={lang} defaultExpanded={true} />
                <ServingGuideStrip wine={wine} lang={lang} valueTier={valueTier} />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="prose-pretty border-l-[3px] border-[#6B1D2F] pl-4 text-[15px] leading-[1.65] text-[var(--text-primary)]">
                  <GlossaryText text={commentary} lang={lang} />
                </p>

                {tastingTip && (
                  <div className="rounded-xl bg-[#FBF4E8]/85 px-4 py-3 text-[13px] leading-relaxed text-[#5C3D12] dark:bg-[#2B2214] dark:text-[#ECC88D]">
                    <span className="mr-1.5 font-bold">
                      {lang === 'ko' ? '시음 팁 ·' : 'Tasting Tip ·'}
                    </span>
                    <GlossaryText text={tastingTip} lang={lang} />
                  </div>
                )}

                {highlights && highlights.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
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
            )}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5 border-t border-[var(--border-subtle)] pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="somm-sub-surface rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)]"
              >
                {t.closeBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  onChoose();
                }}
                data-surface="accent"
                className="btn-accent rounded-xl px-5 py-2.5 text-[13px] font-bold"
              >
                {ctaLabel ?? t.chooseWineCta}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
