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

  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          {lang === 'ko'
            ? titleKo ?? `알아두기 · 전문가 심층 백과 (${entries.length}개 항목)`
            : titleEn ?? `Deep Sommelier Encyclopedia (${entries.length} Pillars)`}
        </span>
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
            <div key={item.id} className="py-3.5 first:pt-2 last:pb-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B1D2F] dark:text-[#E59BAE]">
                {IconComponent && <IconComponent className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />}
                <span>{lang === 'ko' ? item.eyebrowKo : item.eyebrowEn}</span>
              </div>
              <h4 className="mt-0.5 text-[16px] font-bold text-[var(--text-primary)]">
                {lang === 'ko' ? item.headingKo : item.headingEn}
              </h4>
              <p
                className={`prose-pretty mt-1.5 whitespace-pre-line text-[13px] leading-[1.7] text-[var(--text-primary)] ${
                  isOpen ? '' : 'line-clamp-3'
                }`}
              >
                <GlossaryText text={body} lang={lang} />
              </p>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#6B1D2F] underline underline-offset-4 hover:opacity-80 dark:text-[#E59BAE]"
              >
                <span>
                  {isOpen
                    ? lang === 'ko'
                      ? '접기'
                      : 'Show less'
                    : lang === 'ko'
                      ? '상세보기 (더보기)'
                      : 'Read full story'}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.75} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
