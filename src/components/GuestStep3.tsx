import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Globe,
  MapPin,
  Mountain,
  RefreshCw,
  Sparkles,
  Sun,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Wine,
} from 'lucide-react';
import type { DislikeReasonTag, Language, WineItem } from '../types/sommelier';
import {
  CATEGORY_LABELS,
  DISLIKE_REASON_LABELS,
  TRANSLATIONS,
  formatKrw,
} from '../i18n/translations';
import { WineBottleIllustration } from './icons/WineVectors';
import { getNextRecommendedWines } from '../engine/pairingEngine';

interface GuestStep3Props {
  lang: Language;
  wine: WineItem;
  allWines: WineItem[];
  venueId: string;
  priceTransparencyOptIn: boolean;
  onBack: () => void;
  onLikeWine: (wine: WineItem) => void;
  onDislikeWine: (wine: WineItem, reasons: DislikeReasonTag[]) => void;
  onSwitchWine: (wine: WineItem) => void;
  onReRecommend: () => void;
}

export const GuestStep3: React.FC<GuestStep3Props> = ({
  lang,
  wine,
  allWines,
  venueId,
  onBack,
  onLikeWine,
  onDislikeWine,
  onSwitchWine,
  onReRecommend,
}) => {
  const t = TRANSLATIONS[lang];
  const [feedbackState, setFeedbackState] = useState<
    'idle' | 'liked' | 'disliking' | 'disliked_saved'
  >('idle');
  const [selectedReasons, setSelectedReasons] = useState<DislikeReasonTag[]>([]);

  const wineName = lang === 'ko' ? wine.nameKo : wine.nameEn;
  const varietal = lang === 'ko' ? wine.varietalsKo : wine.varietalsEn;
  const region = lang === 'ko' ? wine.regionKo : wine.regionEn;

  const heavenText =
    lang === 'ko'
      ? wine.storytelling.heavenClimateKo
      : wine.storytelling.heavenClimateEn;
  const earthText =
    lang === 'ko' ? wine.storytelling.earthSoilKo : wine.storytelling.earthSoilEn;
  const humanText =
    lang === 'ko'
      ? wine.storytelling.humanPhilosophyKo
      : wine.storytelling.humanPhilosophyEn;

  const loc = wine.storytelling.wineryLocation;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=13&t=k&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
  const googleEarthUrl = `https://earth.google.com/web/search/${encodeURIComponent(
    loc.earthQuery
  )}`;

  const nextSuggestions =
    feedbackState === 'liked'
      ? getNextRecommendedWines(wine, allWines, venueId)
      : [];

  const handleToggleReason = (tag: DislikeReasonTag) => {
    setSelectedReasons((prev) =>
      prev.includes(tag) ? prev.filter((r) => r !== tag) : [...prev, tag]
    );
  };

  const handleLikeClick = () => {
    onLikeWine(wine);
    setFeedbackState('liked');
  };

  const handleDislikeSubmit = () => {
    if (selectedReasons.length === 0) return;
    onDislikeWine(wine, selectedReasons);
    setFeedbackState('disliked_saved');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 safe-bottom-scroll sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-tertiary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t.step3BackBtn}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EBEF] px-3 py-1 text-[12px] font-semibold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
          <Wine className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>{t.step3HeaderBadge}</span>
        </span>
      </div>

      {/* Selected Bottle Summary + Sky · Earth · Maker Storytelling */}
      <section className="somm-card rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-tertiary)] px-3 py-2.5">
              <WineBottleIllustration
                category={wine.category}
                producer={wine.producer}
                vintage={wine.vintage}
                className="h-24 w-10"
              />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                {CATEGORY_LABELS[wine.category][lang]}
              </div>
              <h1 className="mt-1 text-[22px] font-bold leading-snug text-[var(--text-primary)]">
                {wineName}{' '}
                <span className="font-semibold tabular-nums text-[var(--text-secondary)]">
                  {wine.vintage}
                </span>
              </h1>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
                {varietal} · {region}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-[11px] font-medium text-[var(--text-secondary)]">
              {t.venuePriceLabel}
            </div>
            <div className="text-[20px] font-bold tabular-nums text-[var(--text-primary)]">
              {formatKrw(wine.venuePrice, lang)}
            </div>
          </div>
        </div>

        {/* 天 · 地 · 人 3-Pillar Storytelling Cards */}
        <div className="mt-6">
          <h2 className="mb-3.5 text-[17px] font-semibold text-[var(--text-primary)]">
            {t.step3StoryTitle}
          </h2>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {/* 天: Vintage Climate */}
            <div className="somm-sub-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                <Sun className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{t.heavenTitle}</span>
              </div>
              <p className="prose-pretty mt-2 text-[14px] leading-[1.65] text-[var(--text-primary)]">
                {heavenText}
              </p>
            </div>

            {/* 地: Soil & Geography */}
            <div className="somm-sub-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                <Mountain className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{t.earthTitle}</span>
              </div>
              <p className="prose-pretty mt-2 text-[14px] leading-[1.65] text-[var(--text-primary)]">
                {earthText}
              </p>
            </div>

            {/* 人: Maker Philosophy & Heritage */}
            <div className="somm-sub-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                <UserCheck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{t.humanTitle}</span>
              </div>
              <p className="prose-pretty mt-2 text-[14px] leading-[1.65] text-[var(--text-primary)]">
                {humanText}
              </p>
            </div>
          </div>
        </div>

        {/* Winery Satellite Map & Google Earth Explorer */}
        <div className="mt-5 somm-sub-surface overflow-hidden rounded-2xl p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin
                className="h-4 w-4 text-[#6B1D2F] dark:text-[#E59BAE]"
                strokeWidth={1.5}
              />
              <div>
                <div className="text-[13px] font-bold text-[var(--text-primary)]">
                  {t.wineryMapTitle}
                </div>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  {lang === 'ko' ? loc.placeLabelKo : loc.placeLabelEn}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={googleEarthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-3.5 py-1.5 text-[12px] font-semibold text-[#FFFFFF] transition-colors hover:bg-[#561524]"
              >
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{t.openGoogleEarthBtn}</span>
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:opacity-85"
              >
                <span>{t.openGoogleMapsBtn}</span>
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <iframe
              title={lang === 'ko' ? loc.placeLabelKo : loc.placeLabelEn}
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full border-0 sm:h-64"
            />
          </div>
        </div>
      </section>

      {/* Taste Note Cumulative Feedback Loop */}
      <section className="somm-card rounded-3xl p-5 sm:p-7">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
          {t.feedbackTitle}
        </h2>
        <p className="prose-pretty mt-1 text-[14px] text-[var(--text-secondary)]">
          {t.feedbackSubtitle}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleLikeClick}
            data-surface={feedbackState === 'liked' ? 'accent' : undefined}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[15px] font-bold transition-all ${
              feedbackState === 'liked'
                ? 'btn-accent shadow-sm'
                : 'somm-sub-surface text-[var(--text-primary)] hover:bg-[#F5EBEF] dark:hover:bg-[#2E181F]'
            }`}
          >
            <ThumbsUp className="h-4 w-4" strokeWidth={1.5} />
            <span>{t.likeBtn}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFeedbackState(
                feedbackState === 'disliking' ? 'idle' : 'disliking'
              )
            }
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[15px] font-bold transition-all ${
              feedbackState === 'disliking' || feedbackState === 'disliked_saved'
                ? 'bg-[#2B1C22] text-[#FFFFFF] dark:bg-[#3B252D]'
                : 'somm-sub-surface text-[var(--text-primary)] hover:opacity-85'
            }`}
          >
            <ThumbsDown className="h-4 w-4" strokeWidth={1.5} />
            <span>{t.dislikeBtn}</span>
          </button>
        </div>

        {/* Positive Feedback Expansion: Next Wine Suggestions */}
        {feedbackState === 'liked' && (
          <div className="mt-5 space-y-4 rounded-2xl bg-[#F5EBEF] p-4 sm:p-5 dark:bg-[#2E181F]">
            <div className="flex items-start gap-2.5 text-[#6B1D2F] dark:text-[#F4B8C6]">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-[14px] font-bold">{t.likeSuccessTitle}</div>
                <p className="mt-0.5 text-[13px] opacity-90">{t.likeSuccessDesc}</p>
              </div>
            </div>

            {nextSuggestions.length > 0 && (
              <div className="border-t border-[#6B1D2F]/15 pt-4">
                <div className="mb-3 text-[14px] font-bold text-[var(--text-primary)]">
                  {t.nextWineRecommendationsTitle}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {nextSuggestions.map((nextW) => (
                    <button
                      key={nextW.id}
                      type="button"
                      onClick={() => {
                        setFeedbackState('idle');
                        setSelectedReasons([]);
                        onSwitchWine(nextW);
                      }}
                      className="flex items-center gap-3 rounded-2xl bg-[var(--bg-secondary)] p-3.5 text-left shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      <WineBottleIllustration
                        category={nextW.category}
                        producer={nextW.producer}
                        vintage={nextW.vintage}
                        className="h-16 w-7 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                          {CATEGORY_LABELS[nextW.category][lang === 'ko' ? 'shortKo' : 'shortEn']}
                          {nextW.venueId !== venueId
                            ? lang === 'ko'
                              ? ' · 다음 방문 추천'
                              : ' · Next Visit'
                            : ''}
                        </div>
                        <div className="truncate text-[14px] font-bold text-[var(--text-primary)]">
                          {lang === 'ko' ? nextW.nameKo : nextW.nameEn}
                        </div>
                        <div className="mt-0.5 text-[12px] tabular-nums text-[var(--text-secondary)]">
                          {lang === 'ko' ? nextW.regionKo : nextW.regionEn} ·{' '}
                          {formatKrw(nextW.venuePrice, lang)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Negative Feedback Expansion: Multi-tag Diagnosis & Cumulative Filter */}
        {feedbackState === 'disliking' && (
          <div className="mt-5 space-y-4 rounded-2xl bg-[var(--bg-tertiary)] p-4 sm:p-5">
            <div className="text-[14px] font-bold text-[var(--text-primary)]">
              {t.dislikePromptTitle}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DISLIKE_REASON_LABELS) as DislikeReasonTag[]).map((tag) => {
                const active = selectedReasons.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleReason(tag)}
                    data-surface={active ? 'accent' : undefined}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                      active
                        ? 'btn-accent'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                    <span>{DISLIKE_REASON_LABELS[tag][lang]}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleDislikeSubmit}
              disabled={selectedReasons.length === 0}
              data-surface="accent"
              className="btn-accent rounded-2xl px-5 py-3 text-[14px] font-semibold disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t.dislikeSubmitBtn}
            </button>
          </div>
        )}

        {feedbackState === 'disliked_saved' && (
          <div className="mt-5 space-y-3 rounded-2xl bg-[var(--bg-tertiary)] p-4 sm:p-5">
            <div className="text-[14px] font-bold text-[var(--text-primary)]">
              {t.dislikeSavedTitle}
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">
              {t.dislikeSavedDesc}
            </p>
            <button
              type="button"
              onClick={onReRecommend}
              data-surface="accent"
              className="btn-accent inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-[14px] font-semibold"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
              <span>{t.reRecommendWithProfileBtn}</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
