import React from 'react';
import { Moon, Store, Sun, Utensils } from 'lucide-react';
import type { AppMode, Language, ThemeMode, Venue } from '../types/sommelier';
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
}) => {
  const t = TRANSLATIONS[lang];
  const venueName = lang === 'ko' ? activeVenue.nameKo : activeVenue.nameEn;

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        {/* Top Meta Bar: Venue QR Context + Live In-Stock Counter + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--text-secondary)]">
          <div className="flex flex-wrap items-center gap-2.5">
            <VenueLogo
              venueId={activeVenue.id}
              logoUrl={activeVenue.logoUrl}
              venueName={venueName}
              size="sm"
            />
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <span aria-hidden="true">·</span>
              <span>{venueName}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {t.tableLabel}&nbsp;{tableNo}
              </span>
            </span>

            {/* Quick Venue / Table Switcher for Multi-Venue Pilot Testing */}
            <div className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-tertiary)] px-2 py-0.5">
              <label htmlFor="venue-select" className="sr-only">
                {t.venueSelectorLabel}
              </label>
              <select
                id="venue-select"
                value={activeVenue.id}
                onChange={(e) => onVenueChange(e.target.value)}
                className="bg-transparent text-[11px] font-medium text-[var(--text-secondary)] focus:outline-none"
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {lang === 'ko' ? v.nameKo : v.nameEn}
                  </option>
                ))}
              </select>
              <span className="text-[var(--text-muted)]">/</span>
              <select
                aria-label={t.tableLabel}
                value={tableNo}
                onChange={(e) => onTableChange(e.target.value)}
                className="bg-transparent text-[11px] font-medium tabular-nums text-[var(--text-secondary)] focus:outline-none"
              >
                {activeVenue.tables.map((tb) => (
                  <option key={tb} value={tb} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {tb}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-tertiary)] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D52]" />
              <span>
                {t.availableWinesPrefix} {availableCount}
                {t.availableWinesUnit}
              </span>
            </span>
            {aiLiveConnected && (
              <span className="hidden rounded-full bg-[#FBF4E8] px-2 py-0.5 text-[10px] font-semibold text-[#7A541C] dark:bg-[#2B2214] dark:text-[#ECC88D] sm:inline-flex">
                Vision AI
              </span>
            )}
          </div>
        </div>

        {/* Main Brand Row: Brand Lockup + Bilingual Toggle + Theme Toggle + Mode Switcher */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="brand-lockup text-[24px] font-bold tracking-tight text-[#6B1D2F] dark:text-[#F0B4C2]">
              <SommelierBrandEmblem />
              <span>{t.brandName}</span>
              <span className="ml-1 text-[12px] font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                {t.brandShort}
              </span>
            </div>
            <p className="mt-0.5 hidden text-[12px] text-[var(--text-secondary)] sm:block">
              {t.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Dark / Warm Ivory Mode Toggle */}
            <button
              type="button"
              onClick={() => onThemeChange(theme === 'ivory' ? 'dark' : 'ivory')}
              title={theme === 'ivory' ? t.themeDark : t.themeIvory}
              aria-label={theme === 'ivory' ? t.themeDark : t.themeIvory}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-tertiary)]"
            >
              {theme === 'ivory' ? (
                <Moon className="h-3.5 w-3.5" strokeWidth={1.5} />
              ) : (
                <Sun className="h-3.5 w-3.5 text-[#ECC88D]" strokeWidth={1.5} />
              )}
              <span className="hidden sm:inline">
                {theme === 'ivory' ? t.themeDark : t.themeIvory}
              </span>
            </button>

            {/* [한국어 | EN] Segmented Toggle */}
            <div
              className="inline-flex rounded-full bg-[var(--bg-secondary)] p-0.5 shadow-sm"
              role="group"
              aria-label="Language switch"
            >
              <button
                type="button"
                onClick={() => onLangChange('ko')}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                  lang === 'ko'
                    ? 'btn-accent'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                한국어
              </button>
              <button
                type="button"
                onClick={() => onLangChange('en')}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                  lang === 'en'
                    ? 'btn-accent'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                EN
              </button>
            </div>

            {/* [손님 화면 | 업장 관리] Segmented Switcher */}
            <div
              className="inline-flex rounded-full bg-[var(--bg-secondary)] p-0.5 shadow-sm"
              role="tablist"
              aria-label="Workspace mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={appMode === 'guest'}
                onClick={() => onAppModeChange('guest')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  appMode === 'guest'
                    ? 'bg-[#F5EBEF] text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Utensils className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{t.modeGuest}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={appMode === 'admin'}
                onClick={() => onAppModeChange('admin')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  appMode === 'admin'
                    ? 'bg-[#F5EBEF] text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Store className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{t.modeAdmin}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
