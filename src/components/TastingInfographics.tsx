import React, { useState } from 'react';
import { Flame, Thermometer, Wine } from 'lucide-react';
import type { AromaKey, Language, ValueTier, WineItem } from '../types/sommelier';
import { AROMA_LABELS, GLASS_LABELS, TRANSLATIONS } from '../i18n/translations';
import {
  DETAILED_AROMA_CATALOG,
  deriveDetailedWheelForWine,
} from '../data/aromaWheelData';
import { AromaVectorIcon, GlassSilhouetteIcon } from './icons/WineVectors';

/* ============================================================================
   1. Dynamic Wine Liquid Color Palette (maps wine style/varietal/region -> glass color)
   ============================================================================ */
interface WineLiquidPalette {
  strong: string;
  soft: string;
  labelKo: string;
  labelEn: string;
}

export function getWineLiquidPalette(wine: WineItem): WineLiquidPalette {
  const combined = `${wine.nameKo} ${wine.nameEn} ${wine.varietalsKo} ${wine.varietalsEn}`.toLowerCase();

  if (wine.category === 'sparkling') {
    if (combined.includes('rosé') || combined.includes('rose') || combined.includes('로제')) {
      return { strong: '#C85A6E', soft: '#DF8B9A', labelKo: '로제 스파클링', labelEn: 'Rosé Sparkling' };
    }
    return { strong: '#B8943A', soft: '#D5B86A', labelKo: '샴페인 골드', labelEn: 'Champagne Gold' };
  }

  if (wine.category === 'white') {
    if (wine.structure.body >= 4 || combined.includes('meursault') || combined.includes('뫼르소')) {
      return { strong: '#C2922B', soft: '#DCB55E', labelKo: '골드 화이트', labelEn: 'Golden White' };
    }
    return { strong: '#9A9B48', soft: '#BEC078', labelKo: '페일 스트로', labelEn: 'Pale Straw' };
  }

  if (wine.category === 'rose_orange') {
    const isOrange =
      combined.includes('오렌지') ||
      combined.includes('orange') ||
      combined.includes('skin-contact') ||
      combined.includes('껍질 침용') ||
      combined.includes('암포라') ||
      combined.includes('anfora') ||
      combined.includes('라디콘') ||
      combined.includes('radikon');
    if (isOrange) {
      return { strong: '#C66A28', soft: '#DF9258', labelKo: '앰버 오렌지', labelEn: 'Amber Orange' };
    }
    return { strong: '#CF6A7A', soft: '#E597A3', labelKo: '블러시 로제', labelEn: 'Blush Rosé' };
  }

  if (wine.category === 'dessert') {
    if (wine.structure.sweetness >= 5 || combined.includes('sauternes') || combined.includes('소테른')) {
      return { strong: '#B57418', soft: '#D49B45', labelKo: '딥 앰버 골드', labelEn: 'Deep Sauternes Gold' };
    }
    return { strong: '#C89B34', soft: '#E0BC68', labelKo: '허니 골드', labelEn: 'Honey Gold' };
  }

  // Red
  if (wine.structure.body <= 2) {
    return { strong: '#942840', soft: '#B8546A', labelKo: '루비 가넷', labelEn: 'Ruby Garnet' };
  }
  return { strong: '#6B1D2F', soft: '#94354A', labelKo: '딥 버건디', labelEn: 'Deep Burgundy' };
}

/* ============================================================================
   2. 9-Glass Wine Style Spectrum Strip (SP -> DS, inspired by Reference Image 3 & 5)
   ============================================================================ */
type StyleSlot = 'SP' | 'LW' | 'FW' | 'AW' | 'RS' | 'LR' | 'MR' | 'FR' | 'DS';

function inferWineStyleSlot(wine: WineItem): StyleSlot {
  if (wine.category === 'sparkling') return 'SP';
  if (wine.category === 'dessert') return 'DS';
  if (wine.category === 'rose_orange') return 'RS';
  if (wine.category === 'white') {
    if (wine.structure.sweetness >= 2 || wine.varietalsEn.toLowerCase().includes('riesling')) return 'AW';
    return wine.structure.body >= 4 ? 'FW' : 'LW';
  }
  // red
  if (wine.structure.body <= 2) return 'LR';
  if (wine.structure.body >= 4) return 'FR';
  return 'MR';
}

export const WineStyleSpectrumStrip: React.FC<{ wine: WineItem; lang: Language }> = ({
  wine,
  lang,
}) => {
  const activeSlot = inferWineStyleSlot(wine);
  const slots: Array<{ code: StyleSlot; ko: string; en: string }> = [
    { code: 'SP', ko: '스파클링', en: 'Sparkling' },
    { code: 'LW', ko: '라이트 화이트', en: 'Light White' },
    { code: 'FW', ko: '풀 화이트', en: 'Full White' },
    { code: 'AW', ko: '아로마틱 화이트', en: 'Aromatic' },
    { code: 'RS', ko: '로제·오렌지', en: 'Rosé/Orange' },
    { code: 'LR', ko: '라이트 레드', en: 'Light Red' },
    { code: 'MR', ko: '미디엄 레드', en: 'Medium Red' },
    { code: 'FR', ko: '풀 바디 레드', en: 'Full Red' },
    { code: 'DS', ko: '디저트', en: 'Dessert' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {slots.map((slot) => {
        const isActive = slot.code === activeSlot;
        return (
          <div
            key={slot.code}
            title={lang === 'ko' ? slot.ko : slot.en}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-tight tabular-nums transition-colors ${
              isActive
                ? 'bg-[#6B1D2F] text-[#FFFFFF]'
                : 'somm-sub-surface text-[var(--text-secondary)] opacity-70'
            }`}
          >
            <Wine className="h-3 w-3" strokeWidth={1.5} />
            <span>{slot.code}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================================
   2. 5-Axis Radial Segmented Donut Chart (inspired by Reference Image 3 & 5)
      + Segmented Horizontal Bar Gauge Toggle
   ============================================================================ */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createDonutSegmentPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number
): string {
  const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
  const p2 = polarToCartesian(cx, cy, rOuter, endAngle);
  const p3 = polarToCartesian(cx, cy, rInner, endAngle);
  const p4 = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export const StructureBalanceChart: React.FC<{
  wine: WineItem;
  lang: Language;
}> = ({ wine, lang }) => {
  const t = TRANSLATIONS[lang];
  const [viewMode, setViewMode] = useState<'radial' | 'bars'>('radial');
  const liquid = getWineLiquidPalette(wine);

  const axes = [
    { key: 'body', label: t.bodyAxis, val: wine.structure.body },
    { key: 'sweetness', label: t.sweetnessAxis, val: wine.structure.sweetness },
    { key: 'tannin', label: t.tanninAxis, val: wine.structure.tannin },
    { key: 'acidity', label: t.acidityAxis, val: wine.structure.acidity },
    { key: 'alcohol', label: t.alcoholAxis, val: wine.structure.alcohol },
  ];

  const cx = 110;
  const cy = 110;
  const baseRadius = 20;
  const ringStep = 13;
  const ringGap = 2.5;
  const wedgeSpan = 64; // 360/5 = 72deg, leaving 8deg clean radial divider

  return (
    <div className="somm-sub-surface rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: liquid.strong }}
            aria-hidden="true"
          />
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">
            {t.structureTitle}
          </span>
        </div>
        <div className="inline-flex rounded-full bg-[var(--bg-secondary)] p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('radial')}
            style={viewMode === 'radial' ? { backgroundColor: liquid.strong, color: '#FFFFFF' } : undefined}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              viewMode === 'radial'
                ? 'shadow-xs'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {t.structureRadarView}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('bars')}
            style={viewMode === 'bars' ? { backgroundColor: liquid.strong, color: '#FFFFFF' } : undefined}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              viewMode === 'bars'
                ? 'shadow-xs'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {t.structureBarView}
          </button>
        </div>
      </div>

      {viewMode === 'radial' ? (
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-5">
          <svg
            viewBox="0 0 220 220"
            className="h-44 w-44 shrink-0"
            role="img"
            aria-label={t.structureTitle}
          >
            <circle cx={cx} cy={cy} r={14} fill="var(--bg-secondary)" />
            <circle cx={cx} cy={cy} r={5} fill={liquid.strong} opacity="0.85" />

            {axes.map((axis, idx) => {
              const centerAngle = idx * 72;
              const startAngle = centerAngle - wedgeSpan / 2;
              const endAngle = centerAngle + wedgeSpan / 2;
              const labelPos = polarToCartesian(cx, cy, baseRadius + 5 * ringStep + 14, centerAngle);

              return (
                <g key={axis.key}>
                  {[1, 2, 3, 4, 5].map((step) => {
                    const rIn = baseRadius + (step - 1) * ringStep;
                    const rOut = rIn + ringStep - ringGap;
                    const filled = step <= axis.val;
                    const d = createDonutSegmentPath(cx, cy, rIn, rOut, startAngle, endAngle);
                    return (
                      <path
                        key={step}
                        d={d}
                        fill={
                          filled
                            ? step >= 4
                              ? liquid.strong
                              : liquid.soft
                            : 'var(--bg-secondary)'
                        }
                        opacity={filled ? 1 : 0.8}
                        stroke="var(--bg-tertiary)"
                        strokeWidth="0.6"
                      />
                    );
                  })}
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 3}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="600"
                    fill="var(--text-primary)"
                    fontFamily="Pretendard, Plus Jakarta Sans, sans-serif"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 grid w-full grid-cols-2 gap-x-4 gap-y-1.5 sm:mt-0 sm:grid-cols-1">
            {axes.map((axis) => (
              <div key={axis.key} className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--text-secondary)]">{axis.label}</span>
                <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                  {axis.val} / 5
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {axes.map((axis) => (
            <div key={axis.key} className="grid grid-cols-[68px_1fr_34px] items-center gap-2.5">
              <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                {axis.label}
              </span>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    style={step <= axis.val ? { backgroundColor: step >= 4 ? liquid.strong : liquid.soft } : undefined}
                    className={`h-2 rounded-full transition-colors ${
                      step <= axis.val
                        ? ''
                        : 'bg-[var(--bg-secondary)]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-right text-[12px] font-semibold tabular-nums text-[var(--text-primary)]">
                {axis.val}/5
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   3. Compact 5-Icon Aroma Strip (Always Visible on Card Header)
      + Full 34-Descriptor Concentric Aroma Wheel (Reference Image 3 Right Page)
   ============================================================================ */
export const CompactAromaIconRow: React.FC<{
  wine: WineItem;
  lang: Language;
}> = ({ wine, lang }) => {
  const coreAromas: AromaKey[] = Array.from(
    new Set([...wine.aromas.primary, ...wine.aromas.secondary, ...wine.aromas.tertiary])
  ).slice(0, 5);

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
      {coreAromas.map((aromaKey) => (
        <div
          key={aromaKey}
          className="somm-sub-surface flex flex-col items-center justify-center rounded-xl px-1.5 py-2 text-center"
        >
          <AromaVectorIcon aroma={aromaKey} size={26} />
          <span className="mt-1 line-clamp-2 text-[10px] font-medium leading-tight text-[var(--text-primary)]">
            {AROMA_LABELS[aromaKey][lang]}
          </span>
        </div>
      ))}
    </div>
  );
};

export const AromaSpectrumCard: React.FC<{
  wine: WineItem;
  lang: Language;
  defaultExpanded?: boolean;
}> = ({ wine, lang, defaultExpanded = true }) => {
  const t = TRANSLATIONS[lang];
  const [expanded, setExpanded] = useState(defaultExpanded);
  const wheel = deriveDetailedWheelForWine(wine);

  const tierBlocks = [
    {
      id: 'primary',
      title: lang === 'ko' ? '1차향 · 과일 · 꽃 · 허브' : '1st Tier · Primary Fruit & Floral',
      color: '#6B1D2F',
      bgClass: 'bg-[#F5EBEF] dark:bg-[#2E181F]',
      items: wheel.primaryActive,
    },
    {
      id: 'secondary',
      title: lang === 'ko' ? '2차향 · 오크 · 효모 · 발효' : '2nd Tier · Oak & Fermentation',
      color: '#B8762E',
      bgClass: 'bg-[#FBF4E8] dark:bg-[#2B2214]',
      items: wheel.secondaryActive,
    },
    {
      id: 'tertiary',
      title: lang === 'ko' ? '3차향 · 숙성 · 토양 · 미네랄' : '3rd Tier · Aging & Terroir',
      color: '#586468',
      bgClass: 'somm-sub-surface',
      items: wheel.tertiaryActive,
    },
  ];

  const totalSlices = DETAILED_AROMA_CATALOG.length;
  const cx = 180;
  const cy = 180;

  return (
    <div className="somm-sub-surface rounded-2xl p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">
            {lang === 'ko'
              ? `상세 시음 노트 · 아로마 휠 (${totalSlices}종 스펙트럼)`
              : `Detailed Aroma Wheel (${totalSlices} Descriptors)`}
          </span>
          <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
            {lang === 'ko'
              ? '1차(원재료) · 2차(양조/오크) · 3차(숙성/떼루아) 향이 겹치지 않게 구분되어 있습니다.'
              : 'Primary, secondary fermentation/oak, and tertiary aging notes separated cleanly.'}
          </p>
        </div>
        {!defaultExpanded && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[12px] font-semibold text-[#6B1D2F] underline underline-offset-4 dark:text-[#E59BAE]"
          >
            {expanded ? t.aromaCollapseBtn : t.aromaExpandBtn}
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:items-center">
          {/* Concentric 34-Slice Sommelier Aroma Wheel SVG (Image 3 Right Page Style) */}
          <div className="mx-auto w-full max-w-[300px]">
            <svg
              viewBox="0 0 360 360"
              className="h-auto w-full"
              role="img"
              aria-label={t.aromaTitle}
            >
              {/* Subtle base ring guides */}
              <circle cx={cx} cy={cy} r={162} fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r={104} fill="none" stroke="var(--border-subtle)" strokeWidth="1" />

              {DETAILED_AROMA_CATALOG.map((item, idx) => {
                const sliceAngle = 360 / totalSlices;
                const a0 = idx * sliceAngle;
                const a1 = a0 + sliceAngle - 0.8;
                const midAngle = a0 + sliceAngle / 2;
                const isActive = wheel.activeIds.has(item.id);
                const rInner = item.tier === 'primary' ? 56 : item.tier === 'secondary' ? 68 : 80;
                const rOuter = 112;
                const segPath = createDonutSegmentPath(cx, cy, rInner, rOuter, a0, a1);
                const dotPos = polarToCartesian(cx, cy, 118, midAngle);
                const labelPos = polarToCartesian(cx, cy, 124, midAngle);
                const flipText = midAngle > 180;
                const textRot = flipText ? midAngle + 90 : midAngle - 90;

                return (
                  <g key={item.id}>
                    <path
                      d={segPath}
                      fill={item.color}
                      opacity={isActive ? 0.92 : 0.14}
                    />
                    {isActive && (
                      <circle cx={dotPos.x} cy={dotPos.y} r="2.2" fill={item.color} />
                    )}
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor={flipText ? 'end' : 'start'}
                      dominantBaseline="middle"
                      fontSize={isActive ? '7.2' : '6.1'}
                      fontWeight={isActive ? '700' : '400'}
                      fill={isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      opacity={isActive ? 1 : 0.55}
                      transform={`rotate(${textRot}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {lang === 'ko' ? item.labelKo : item.labelEn}
                    </text>
                  </g>
                );
              })}

              {/* Center Hub */}
              <circle cx={cx} cy={cy} r="48" fill="var(--bg-secondary)" stroke="var(--border-subtle)" strokeWidth="1" />
              <text
                x={cx}
                y={cy - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="var(--text-primary)"
              >
                {lang === 'ko' ? '아로마 휠' : 'AROMA WHEEL'}
              </text>
              <text
                x={cx}
                y={cy + 9}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--text-secondary)"
              >
                {`${wheel.activeIds.size} / ${totalSlices}`}
              </text>
            </svg>
          </div>

          {/* 3 Non-overlapping Tier Breakdown Panels */}
          <div className="space-y-2.5">
            {tierBlocks.map((tier) => (
              <div key={tier.id} className={`rounded-xl px-3.5 py-2.5 ${tier.bgClass}`}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="text-[12px] font-bold text-[var(--text-primary)]">
                      {tier.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tabular-nums text-[var(--text-secondary)]">
                    {tier.items.length}
                    {lang === 'ko' ? '종' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tier.items.map((desc) => (
                    <span
                      key={desc.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-secondary)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-primary)] shadow-xs"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: desc.color }}
                      />
                      <span>{lang === 'ko' ? desc.labelKo : desc.labelEn}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   4. 5-Column Serving Guide Pictogram Strip (inspired by Reference Image 3 & 5)
   ============================================================================ */
export const ServingGuideStrip: React.FC<{
  wine: WineItem;
  lang: Language;
  valueTier: ValueTier;
}> = ({ wine, lang, valueTier }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="somm-sub-surface rounded-2xl p-4">
      <div className="mb-3 text-[13px] font-semibold text-[var(--text-primary)]">
        {t.servingTitle}
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {/* 1. Stemware */}
        <div className="flex flex-col items-center rounded-xl bg-[var(--bg-secondary)] p-2.5 text-center shadow-sm">
          <div className="flex items-center gap-0.5">
            {(['flute', 'white', 'burgundy', 'bordeaux', 'dessert'] as const).map((g) => (
              <GlassSilhouetteIcon
                key={g}
                type={g}
                active={g === wine.serving.glassType}
                size={g === wine.serving.glassType ? 24 : 16}
              />
            ))}
          </div>
          <span className="mt-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
            {GLASS_LABELS[wine.serving.glassType][lang]}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">{t.glassLabel}</span>
        </div>

        {/* 2. Temperature */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--bg-secondary)] p-2.5 text-center shadow-sm">
          <Thermometer className="h-5 w-5 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.5} />
          <span className="mt-1.5 text-[12px] font-bold tabular-nums text-[var(--text-primary)]">
            {wine.serving.tempMin}–{wine.serving.tempMax}℃
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">{t.tempLabel}</span>
        </div>

        {/* 3. Decanting */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--bg-secondary)] p-2.5 text-center shadow-sm">
          {/* Custom 1.5px Decanter Carafe SVG */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#6B1D2F] dark:text-[#E59BAE]"
            aria-hidden="true"
          >
            <path
              d="M9 3H15L14 9.5C14 10.5 19 13 19 17.5C19 20.5 16 21.5 12 21.5C8 21.5 5 20.5 5 17.5C5 13 10 10.5 10 9.5L9 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M7.5 17.5C9.5 16.8 14.5 16.8 16.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="mt-1.5 text-[11px] font-semibold tabular-nums text-[var(--text-primary)]">
            {wine.serving.decantMinutes > 0
              ? `${wine.serving.decantMinutes}\u00A0${t.decantUnit}`
              : t.decantNone}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">{t.decantLabel}</span>
        </div>

        {/* 4. Drinking Window & Value Status */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-[var(--bg-secondary)] p-2.5 text-center shadow-sm">
          <Flame className="h-5 w-5 text-[#B8863B]" strokeWidth={1.5} />
          <span className="mt-1.5 text-[11px] font-bold tabular-nums text-[var(--text-primary)]">
            {wine.serving.drinkWindowStart}–{wine.serving.drinkWindowEnd}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)]">
            {valueTier === 'great_value'
              ? t.badgeGreatValue
              : lang === 'ko'
                ? wine.serving.statusKo
                : wine.serving.statusEn}
          </span>
        </div>
      </div>
    </div>
  );
};
