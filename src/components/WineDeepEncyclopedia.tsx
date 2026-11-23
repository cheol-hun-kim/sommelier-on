import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mountain, Sun, UserCheck } from 'lucide-react';
import type { Language, WineItem } from '../types/sommelier';
import { buildWineEncyclopedia } from '../data/wineEncyclopedia';
import { GlossaryText } from './GlossaryText';

interface WineDeepEncyclopediaProps {
  wine: WineItem;
  lang: Language;
  filterIds?: string[];
  titleKo?: string;
  titleEn?: string;
}

export const WineDeepEncyclopedia: React.FC<WineDeepEncyclopediaProps> = ({
  wine,
  lang,
  filterIds,
  titleKo,
  titleEn,
}) => {
  const allEntries = buildWineEncyclopedia(wine);
  const entries = filterIds
    ? allEntries.filter((e) => filterIds.includes(e.id))
    : allEntries;
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allOpen = entries.length > 0 && entries.every((e) => Boolean(expandedIds[e.id]));
  const toggleAll = () => {
    if (allOpen) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      entries.forEach((e) => {
        next[e.id] = true;
      });
      setExpandedIds(next);
    }
  };

  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          {lang === 'ko'
            ? titleKo ?? `알아두기 · 전문가 심층 백과 (${entries.length}개 항목)`
            : titleEn ?? `Deep Sommelier Encyclopedia (${entries.length} Pillars)`}
        </span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-[11px] font-semibold text-[#6B1D2F] underline underline-offset-4 hover:opacity-80 dark:text-[#E59BAE]"
        >
          {allOpen
            ? lang === 'ko'
              ? '모두 접기'
              : 'Collapse all'
            : lang === 'ko'
              ? '모두 펼치기'
              : 'Expand all'}
        </button>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {entries.map((item) => {
          const isOpen = Boolean(expandedIds[item.id]);
          const body = lang === 'ko' ? item.bodyKo : item.bodyEn;
          const IconComponent =
            item.id === 'heaven'
              ? Sun
              : item.id === 'earth'
                ? Mountain
                : item.id === 'human'
                  ? UserCheck
                  : null;
          return (
            <div key={item.id} className="py-3 first:pt-2 last:pb-1">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 text-left transition-opacity hover:opacity-85"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                    {IconComponent && (
                      <IconComponent className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    )}
                    <span>{lang === 'ko' ? item.eyebrowKo : item.eyebrowEn}</span>
                  </div>
                  <h4 className="mt-0.5 text-[15px] font-bold text-[var(--text-primary)]">
                    {lang === 'ko' ? item.headingKo : item.headingEn}
                  </h4>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--bg-tertiary)] px-2.5 py-1 text-[11px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                  <span>
                    {isOpen
                      ? lang === 'ko'
                        ? '접기'
                        : 'Hide'
                      : lang === 'ko'
                        ? '상세보기'
                        : 'Details'}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )}
                </span>
              </button>

              {isOpen && (
                <p className="prose-pretty mt-2.5 whitespace-pre-line rounded-2xl bg-[var(--bg-tertiary)]/50 p-3.5 text-[13px] leading-[1.7] text-[var(--text-primary)]">
                  <GlossaryText text={body} lang={lang} />
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
