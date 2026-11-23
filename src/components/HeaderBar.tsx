import React, { useRef } from 'react';
import { ArrowLeft, BookOpen, ListFilter, Moon, Sun } from 'lucide-react';
import type { AppMode, GuestMember, Language, ThemeMode, Venue } from '../types/sommelier';
import { TRANSLATIONS } from '../i18n/translations';
import { SommelierBrandEmblem, VenueLogo } from './icons/WineVectors';

interface HeaderBarProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  appMode: AppMode;
  onAppModeChange: (mode: AppMode) => void;
  venues: Venue[];
  activeVenue: Venue;
  onVenueChange: (venueId: string) => void;
  tableNo: string;
  onTableChange: (table: string) => void;
  availableCount: number;
  aiLiveConnected: boolean;
  activeMember: GuestMember | null;
  journalCount: number;
  onOpenJournal: () => void;
  catalogOpen: boolean;
  onToggleCatalog: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  lang,
  onLangChange,
  theme,
  onThemeChange,
  appMode,
  onAppModeChange,
  venues,
  activeVenue,
  onVenueChange,
  tableNo,
  onTableChange,
  availableCount,
  aiLiveConnected,
  activeMember,
  journalCount,
  onOpenJournal,
  catalogOpen,
  onToggleCatalog,
}) => {
  const t = TRANSLATIONS[lang];
  const venueName = lang === 'ko' ? activeVenue.nameKo : activeVenue.nameEn;
  const longPressTimerRef = useRef<number | null>(null);

  const startVenueLongPress = () => {
    if (longPressTimerRef.current) window.clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = window.setTimeout(() => {
      onAppModeChange(appMode === 'guest' ? 'admin' : 'guest');
    }, 1800);
  };

  const cancelVenueLongPress = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 sm:px-6">
        {/* Left: Compact Brand Lockup + Single Venue/Table Context */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="brand-lockup text-[20px] font-bold tracking-tight text-[#6B1D2F] dark:text-[#F0B4C2]">
            <SommelierBrandEmblem />
            <span>{t.brandName}</span>
            <span className="ml-0.5 text-[11px] font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
              {t.brandShort}
            </span>
          </div>

          <span className="hidden h-4 w-px bg-[var(--border-subtle)] sm:inline-block" aria-hidden="true" />

          {/* Single Unified Venue + Table Context Pill (Long-press or double-click logo for admin) */}
          <div
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-tertiary)]/80 py-1 pl-1.5 pr-2.5 text-[11px] font-medium text-[var(--text-secondary)]"
            onPointerDown={startVenueLongPress}
            onPointerUp={cancelVenueLongPress}
            onPointerLeave={cancelVenueLongPress}
            onDoubleClick={() => onAppModeChange(appMode === 'guest' ? 'admin' : 'guest')}
          >
            <VenueLogo
              venueId={activeVenue.id}
              logoUrl={activeVenue.logoUrl}
              venueName={venueName}
              size="sm"
            />
            <label htmlFor="venue-select" className="sr-only">
              {t.venueSelectorLabel}
            </label>
            <select
              id="venue-select"
              value={activeVenue.id}
              onChange={(e) => onVenueChange(e.target.value)}
              className="bg-transparent font-semibold text-[var(--text-primary)] focus:outline-none"
            >
              {venues.map((v) => (
                <option
                  key={v.id}
                  value={v.id}
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  {lang === 'ko' ? v.nameKo : v.nameEn}
                </option>
              ))}
            </select>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-secondary)]">{t.tableLabel}</span>
            <select
              aria-label={t.tableLabel}
              value={tableNo}
              onChange={(e) => onTableChange(e.target.value)}
              className="bg-transparent font-semibold tabular-nums text-[var(--text-primary)] focus:outline-none"
            >
              {activeVenue.tables.map((tb) => (
                <option
                  key={tb}
                  value={tb}
                  className="bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                >
                  {tb}
                </option>
              ))}
            </select>
            {aiLiveConnected && (
              <span
                className="ml-1 hidden h-1.5 w-1.5 rounded-full bg-[#2E7D52] sm:inline-block"
                title="AI Live Connected"
              />
            )}
          </div>
        </div>

        {/* Right: Primary Guest Actions + Lightweight Utilities */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {appMode === 'guest' ? (
            <>
              <button
                type="button"
                onClick={onToggleCatalog}
                data-surface={catalogOpen ? 'accent' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  catalogOpen
                    ? 'btn-accent shadow-sm'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{lang === 'ko' ? '전체 와인 리스트' : 'Wine List'}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                    catalogOpen
                      ? 'bg-white/20 text-[#FFFFFF]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D52]" />
                  <span>
                    {availableCount}
                    {t.availableWinesUnit}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenJournal}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-primary)] shadow-xs transition-colors hover:bg-[var(--bg-tertiary)]"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.5} />
                <span>
                  {activeMember
                    ? `${activeMember.nickname} (${journalCount})`
                    : lang === 'ko'
                      ? '내 미식 기록'
                      : 'Journal'}
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onAppModeChange('guest')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F5EBEF] px-3.5 py-1.5 text-[12px] font-semibold text-[#6B1D2F] transition-colors hover:opacity-90 dark:bg-[#2E181F] dark:text-[#F4B8C6]"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{lang === 'ko' ? '손님 화면으로' : 'Back to Guest'}</span>
            </button>
          )}

          {/* Subtle Divider */}
          <span className="mx-0.5 h-4 w-px bg-[var(--border-subtle)]" aria-hidden="true" />

          {/* Icon-only Theme Toggle */}
          <button
            type="button"
            onClick={() => onThemeChange(theme === 'ivory' ? 'dark' : 'ivory')}
            title={theme === 'ivory' ? t.themeDark : t.themeIvory}
            aria-label={theme === 'ivory' ? t.themeDark : t.themeIvory}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            {theme === 'ivory' ? (
              <Moon className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Sun className="h-4 w-4 text-[#ECC88D]" strokeWidth={1.5} />
            )}
          </button>

          {/* Lightweight KR / EN Text Switch */}
          <div
            className="inline-flex items-center rounded-full px-1 py-0.5 text-[11px] font-semibold"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => onLangChange('ko')}
              className={`rounded-full px-1.5 py-0.5 transition-colors ${
                lang === 'ko'
                  ? 'text-[#6B1D2F] underline decoration-2 underline-offset-4 dark:text-[#F4B8C6]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              KR
            </button>
            <span className="text-[var(--text-muted)]">/</span>
            <button
              type="button"
              onClick={() => onLangChange('en')}
              className={`rounded-full px-1.5 py-0.5 transition-colors ${
                lang === 'en'
                  ? 'text-[#6B1D2F] underline decoration-2 underline-offset-4 dark:text-[#F4B8C6]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
