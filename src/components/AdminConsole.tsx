import React, { useRef, useState } from 'react';
import {
  BarChart3,
  Camera,
  Check,
  ImagePlus,
  KeyRound,
  Lock,
  Minus,
  Plus,
  Printer,
  QrCode,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { VenueLogo } from './icons/WineVectors';
import type {
  Language,
  PairingSessionStats,
  Venue,
  WineCategory,
  WineItem,
} from '../types/sommelier';
import { CATEGORY_LABELS, TRANSLATIONS, formatKrw } from '../i18n/translations';
import { analyzeWineLabelImage, type ScannedWineLabelDraft } from '../services/aiService';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/storageService';
import { SAMPLE_LABEL_SCAN_PRESET } from '../data/seedData';

interface AdminConsoleProps {
  lang: Language;
  venue: Venue;
  venueWines: WineItem[];
  stats: PairingSessionStats;
  isUnlocked: boolean;
  onUnlock: () => void;
  onUpdateStock: (wineId: string, delta: number) => void;
  onAddWine: (newWine: WineItem) => void;
  onTogglePriceTransparency: (venueId: string, optIn: boolean) => void;
  onUpdateVenueLogo: (venueId: string, logoUrl: string | undefined) => void;
  onOpenGuestTable: (venueId: string, table: string) => void;
  onAiKeyUpdated: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  lang,
  venue,
  venueWines,
  stats,
  isUnlocked,
  onUnlock,
  onUpdateStock,
  onAddWine,
  onTogglePriceTransparency,
  onUpdateVenueLogo,
  onOpenGuestTable,
  onAiKeyUpdated,
}) => {
  const t = TRANSLATIONS[lang];
  const labelFileRef = useRef<HTMLInputElement | null>(null);
  const logoFileRef = useRef<HTMLInputElement | null>(null);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [isScanningLabel, setIsScanningLabel] = useState(false);
  const [draft, setDraft] = useState<ScannedWineLabelDraft>({
    nameKo: '',
    nameEn: '',
    producer: '',
    vintage: 2022,
    category: 'red',
    varietalsKo: '',
    varietalsEn: '',
    regionKo: '',
    regionEn: '',
    countryCode: 'FR',
    marketPrice: 65000,
    venuePrice: 95000,
    stock: 6,
    structure: { body: 3, acidity: 4, tannin: 3, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['cherry', 'citrus'],
      secondary: ['oak_cedar'],
      tertiary: ['mineral_stone'],
    },
  });
  const [addedToast, setAddedToast] = useState(false);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrTable, setSelectedQrTable] = useState(venue.tables[0] ?? '7');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getGeminiApiKey());

  const totalCount = venueWines.length;
  const availableCount = venueWines.filter((w) => w.stock > 0).length;
  const soldOutCount = totalCount - availableCount;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === venue.adminPin) {
      setPinError(false);
      onUnlock();
    } else {
      setPinError(true);
    }
  };

  const handleLabelUpload = async (file: File) => {
    setIsScanningLabel(true);
    try {
      const scanned = await analyzeWineLabelImage(file);
      setDraft(scanned);
    } finally {
      setIsScanningLabel(false);
    }
  };

  const handleSampleLabelScan = async () => {
    setIsScanningLabel(true);
    await new Promise((r) => setTimeout(r, 450));
    setDraft({
      ...SAMPLE_LABEL_SCAN_PRESET,
      aromas: {
        primary: [...SAMPLE_LABEL_SCAN_PRESET.aromas.primary],
        secondary: [...SAMPLE_LABEL_SCAN_PRESET.aromas.secondary],
        tertiary: [...SAMPLE_LABEL_SCAN_PRESET.aromas.tertiary],
      },
    });
    setIsScanningLabel(false);
  };

  const handleCreateWine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.nameKo.trim()) return;

    const newItem: WineItem = {
      id: `wine_${Date.now()}`,
      venueId: venue.id,
      nameKo: draft.nameKo.trim(),
      nameEn: draft.nameEn.trim() || draft.nameKo.trim(),
      producer: draft.producer || draft.nameKo.trim().split(' ')[0] || 'House Cellar',
      vintage: Number(draft.vintage) || 2022,
      category: draft.category,
      varietalsKo: draft.varietalsKo.trim() || '블렌드',
      varietalsEn: draft.varietalsEn.trim() || draft.varietalsKo.trim() || 'Blend',
      regionKo: draft.regionKo.trim() || '프랑스',
      regionEn: draft.regionEn.trim() || draft.regionKo.trim() || 'France',
      countryCode: draft.countryCode || 'FR',
      venuePrice: Math.max(10000, Number(draft.venuePrice) || 68000),
      marketPrice: Math.max(10000, Number(draft.marketPrice) || 45000),
      stock: Math.max(0, Number(draft.stock) || 0),
      structure: draft.structure,
      aromas: draft.aromas,
      serving: {
        glassType:
          draft.category === 'sparkling'
            ? 'flute'
            : draft.category === 'white'
              ? 'white'
              : draft.category === 'dessert'
                ? 'dessert'
                : 'burgundy',
        tempMin: draft.category === 'red' ? 15 : 8,
        tempMax: draft.category === 'red' ? 17 : 10,
        decantMinutes: draft.category === 'red' ? 20 : 0,
        drinkWindowStart: 2024,
        drinkWindowEnd: 2030,
        statusKo: '입고 완료 · 시음 적기',
        statusEn: 'Freshly cellared & ready',
      },
      storytelling: {
        terroirKo: `${draft.regionKo || '산지'}의 고유한 테루아와 포도밭의 미기후를 담아낸 큐베입니다.`,
        terroirEn: `Expressive cuvée highlighting the limestone and microclimate of ${draft.regionEn || 'its appellation'}.`,
        vinificationKo: '전통적인 온도 제어 발효와 정제된 숙성 과정을 거쳐 요리와 편안히 어우러집니다.',
        vinificationEn: 'Temperature-controlled fermentation and poised maturation for seamless table pairing.',
      },
      pairingAffinities:
        draft.category === 'red'
          ? ['steak', 'rich', 'umami', 'poultry']
          : draft.category === 'sparkling'
            ? ['seafood', 'delicate', 'cream']
            : ['seafood', 'cream', 'poultry', 'umami'],
    };

    onAddWine(newItem);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2600);
    setDraft((prev) => ({
      ...prev,
      nameKo: '',
      nameEn: '',
      varietalsKo: '',
      varietalsEn: '',
      regionKo: '',
      regionEn: '',
    }));
  };

  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <form onSubmit={handlePinSubmit} className="somm-card rounded-3xl p-6 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5EBEF] text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
            <Lock className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <h1 className="mt-4 text-center text-[20px] font-bold text-[var(--text-primary)]">
            {t.adminPinTitle}
          </h1>
          <p className="mt-1.5 text-center text-[13px] text-[var(--text-secondary)]">
            {t.adminPinDesc}
          </p>

          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={t.adminPinPlaceholder}
            className="mt-5 w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-center text-[18px] font-bold tracking-widest tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
          />

          {pinError && (
            <p className="mt-2 text-center text-[12px] font-semibold text-[#8A1E33] dark:text-[#F4A5B5]">
              {t.adminPinError}
            </p>
          )}

          <p className="mt-2 text-center text-[12px] text-[var(--text-secondary)]">
            {t.adminPinHint}
          </p>

          <button
            type="submit"
            data-surface="accent"
            className="btn-accent mt-5 w-full rounded-2xl px-5 py-3.5 text-[14px] font-bold"
          >
            {t.adminPinUnlockBtn}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 safe-bottom-scroll sm:px-6">
      {/* 1. Dashboard Summary Metric Cards (matching Reference Image 4) */}
      <div className="no-print grid grid-cols-3 gap-3">
        <div className="somm-card rounded-2xl p-4 sm:p-5">
          <div className="text-[26px] font-bold tabular-nums text-[var(--text-primary)]">
            {totalCount}
          </div>
          <div className="mt-1 text-[12px] font-medium text-[var(--text-secondary)]">
            {t.adminTotalWines}
          </div>
        </div>
        <div className="somm-card rounded-2xl p-4 sm:p-5">
          <div className="text-[26px] font-bold tabular-nums text-[#6B1D2F] dark:text-[#F4B8C6]">
            {availableCount}
          </div>
          <div className="mt-1 text-[12px] font-medium text-[var(--text-secondary)]">
            {t.adminAvailableWines}
          </div>
        </div>
        <div className="somm-card rounded-2xl p-4 sm:p-5">
          <div className="text-[26px] font-bold tabular-nums text-[var(--text-secondary)]">
            {soldOutCount}
          </div>
          <div className="mt-1 text-[12px] font-medium text-[var(--text-secondary)]">
            {t.adminSoldOutWines}
          </div>
        </div>
      </div>

      {/* 2. Quick Operations Bar: Price Transparency, Print List, QR Simulator, Image Scan Setup */}
      <div className="no-print somm-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[14px] font-bold text-[var(--text-primary)]">
            {t.adminPriceOptInLabel}
          </div>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
            {t.adminPriceOptInDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onTogglePriceTransparency(venue.id, !venue.priceTransparencyOptIn)
            }
            data-surface={venue.priceTransparencyOptIn ? 'accent' : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
              venue.priceTransparencyOptIn
                ? 'btn-accent'
                : 'somm-sub-surface text-[var(--text-primary)]'
            }`}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            <span>
              {venue.priceTransparencyOptIn
                ? lang === 'ko'
                  ? '노출 중'
                  : 'Visible'
                : lang === 'ko'
                  ? '비노출'
                  : 'Hidden'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-tertiary)] px-3.5 py-2 text-[12px] font-semibold text-[var(--text-primary)] hover:opacity-85"
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{t.adminPrintListBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-tertiary)] px-3.5 py-2 text-[12px] font-semibold text-[var(--text-primary)] hover:opacity-85"
          >
            <QrCode className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{t.adminQrPreviewBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-tertiary)] px-3.5 py-2 text-[12px] font-semibold text-[var(--text-primary)] hover:opacity-85"
          >
            <KeyRound className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{t.adminAiKeyBtn}</span>
          </button>
        </div>
      </div>

      {/* 2B. Venue Brand Logo Upload & Live Preview */}
      <div className="no-print somm-card flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <VenueLogo
            venueId={venue.id}
            logoUrl={venue.logoUrl}
            venueName={lang === 'ko' ? venue.nameKo : venue.nameEn}
            size="md"
          />
          <div>
            <div className="text-[14px] font-bold text-[var(--text-primary)]">
              {lang === 'ko' ? '업장 공식 로고 이미지 설정' : 'Venue Brand Logo Image'}
            </div>
            <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
              {lang === 'ko'
                ? '업장의 실제 로고(PNG·JPG·SVG)를 등록하면 손님 화면 헤더와 인쇄용 주류 리스트에 즉시 반영됩니다.'
                : 'Upload your restaurant logo to display across the Guest header and printable wine list.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={logoFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result ?? '');
                if (dataUrl) onUpdateVenueLogo(venue.id, dataUrl);
              };
              reader.readAsDataURL(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => logoFileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6B1D2F] px-4 py-2 text-[12px] font-semibold text-[#FFFFFF] hover:bg-[#561524]"
          >
            <ImagePlus className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{lang === 'ko' ? '로고 이미지 업로드' : 'Upload Logo'}</span>
          </button>

          {venue.logoUrl && (
            <button
              type="button"
              onClick={() => onUpdateVenueLogo(venue.id, undefined)}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-tertiary)] px-3.5 py-2 text-[12px] font-semibold text-[var(--text-primary)] hover:opacity-85"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{lang === 'ko' ? '기본 크레스트 사용' : 'Use Default Crest'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Wine Intake & AI Label Scan Card (matching Reference Image 4) */}
      <form
        onSubmit={handleCreateWine}
        className="no-print somm-card space-y-4 rounded-3xl p-5 sm:p-7"
      >
        <div>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
            {t.adminOnboardTitle}
          </h2>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            {t.adminOnboardDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            ref={labelFileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleLabelUpload(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => labelFileRef.current?.click()}
            disabled={isScanningLabel}
            className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-[#6B1D2F]/55 bg-[#F5EBEF]/55 px-4 py-2.5 text-[13px] font-semibold text-[#6B1D2F] hover:bg-[#F5EBEF] dark:border-[#E59BAE]/40 dark:bg-[#2E181F]/60 dark:text-[#F4B8C6]"
          >
            <Camera className="h-4 w-4" strokeWidth={1.5} />
            <span>{t.adminLabelUploadBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleSampleLabelScan}
            disabled={isScanningLabel}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-[12px] font-semibold text-[var(--text-primary)] hover:opacity-85"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#B8863B]" strokeWidth={1.5} />
            <span>{t.adminLabelSampleBtn}</span>
          </button>

          {isScanningLabel && (
            <span className="text-[12px] font-medium text-[#6B1D2F] dark:text-[#E59BAE]">
              {t.adminLabelAnalyzing}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelName}
            </label>
            <input
              type="text"
              required
              value={draft.nameKo}
              onChange={(e) => setDraft({ ...draft, nameKo: e.target.value })}
              placeholder="예: 도멘 메오 까뮈제 부르고뉴 2022"
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelCategory}
            </label>
            <select
              value={draft.category}
              onChange={(e) =>
                setDraft({ ...draft, category: e.target.value as WineCategory })
              }
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            >
              {(Object.keys(CATEGORY_LABELS) as WineCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat][lang]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelVarietal}
            </label>
            <input
              type="text"
              value={draft.varietalsKo}
              onChange={(e) =>
                setDraft({ ...draft, varietalsKo: e.target.value })
              }
              placeholder="예: 피노 누아 100%"
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelRegion}
            </label>
            <input
              type="text"
              value={draft.regionKo}
              onChange={(e) => setDraft({ ...draft, regionKo: e.target.value })}
              placeholder="예: 프랑스 부르고뉴"
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelVenuePrice}
            </label>
            <input
              type="number"
              min={10000}
              step={1000}
              value={draft.venuePrice}
              onChange={(e) =>
                setDraft({ ...draft, venuePrice: Number(e.target.value) })
              }
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelMarketPrice}
            </label>
            <input
              type="number"
              min={10000}
              step={1000}
              value={draft.marketPrice}
              onChange={(e) =>
                setDraft({ ...draft, marketPrice: Number(e.target.value) })
              }
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminLabelStock}
            </label>
            <input
              type="number"
              min={0}
              value={draft.stock}
              onChange={(e) =>
                setDraft({ ...draft, stock: Number(e.target.value) })
              }
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.bodyAxis} (1–5)
            </label>
            <select
              value={draft.structure.body}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  structure: { ...draft.structure, body: Number(e.target.value) },
                })
              }
              className="w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[14px] tabular-nums text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            >
              <option value={1}>1 (Light)</option>
              <option value={2}>2 (Light-Med)</option>
              <option value={3}>3 (Medium)</option>
              <option value={4}>4 (Med-Full)</option>
              <option value={5}>5 (Full)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          data-surface="accent"
          className="btn-accent w-full rounded-2xl px-5 py-3.5 text-[14px] font-bold"
        >
          {addedToast ? 'OK · Cellar Updated' : t.adminAddWineBtn}
        </button>
      </form>

      {/* 4. Real-Time Inventory List (matching Reference Image 4) */}
      <section className="somm-card rounded-3xl p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
              {t.adminInventoryTitle}
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
              {lang === 'ko'
                ? '수량이 0이 되면 즉시 품절 상태로 전환되어 손님 화면 추천에서 자동 제외됩니다.'
                : 'Setting stock to 0 immediately marks Sold Out and excludes the bottle from Guest recommendations.'}
            </p>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {venueWines.map((wine) => {
            const isSoldOut = wine.stock === 0;
            return (
              <div
                key={wine.id}
                className={`flex flex-wrap items-center justify-between gap-3 py-3.5 ${
                  isSoldOut ? 'opacity-60' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[15px] font-bold text-[var(--text-primary)]">
                      {lang === 'ko' ? wine.nameKo : wine.nameEn}
                    </span>
                    <span className="text-[12px] tabular-nums text-[var(--text-secondary)]">
                      {wine.vintage}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSoldOut
                          ? 'bg-[#FDF0F2] text-[#8A1E33] dark:bg-[#32161D] dark:text-[#F4A5B5]'
                          : 'bg-[#EDF5F0] text-[#1F5B3A] dark:bg-[#172B20] dark:text-[#9ED8B6]'
                      }`}
                    >
                      {isSoldOut ? t.adminSoldOutBadge : t.adminInStockBadge}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12px] tabular-nums text-[var(--text-secondary)]">
                    {CATEGORY_LABELS[wine.category][lang === 'ko' ? 'shortKo' : 'shortEn']} ·{' '}
                    {lang === 'ko' ? wine.regionKo : wine.regionEn} ·{' '}
                    {formatKrw(wine.venuePrice, lang)}
                  </div>
                </div>

                {/* [-] Stock [+] Stepper */}
                <div className="no-print flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease stock"
                    onClick={() => onUpdateStock(wine.id, -1)}
                    disabled={wine.stock === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors hover:opacity-80 disabled:opacity-35"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <span className="w-8 text-center text-[15px] font-bold tabular-nums text-[var(--text-primary)]">
                    {wine.stock}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase stock"
                    onClick={() => onUpdateStock(wine.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors hover:opacity-80"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Pairing & Feedback Analytics Summary */}
      <section className="no-print somm-card rounded-3xl p-5 sm:p-7">
        <div className="flex items-center gap-2 text-[16px] font-bold text-[var(--text-primary)]">
          <BarChart3 className="h-4 w-4 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.5} />
          <span>
            {lang === 'ko'
              ? '테이블 추천 및 손님 취향 반응 리포트'
              : 'Live Recommendation & Palate Feedback Report'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="somm-sub-surface rounded-2xl p-3.5">
            <div className="text-[20px] font-bold tabular-nums">{stats.totalSessions}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {lang === 'ko' ? '누적 추천 세션' : 'Pairing Sessions'}
            </div>
          </div>
          <div className="somm-sub-surface rounded-2xl p-3.5">
            <div className="text-[20px] font-bold tabular-nums">{stats.orderIntents}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {lang === 'ko' ? '시음 가이드 진입' : 'Bottle Guide Views'}
            </div>
          </div>
          <div className="somm-sub-surface rounded-2xl p-3.5">
            <div className="text-[20px] font-bold tabular-nums text-[#1F5B3A] dark:text-[#9ED8B6]">
              {stats.likes}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {lang === 'ko' ? '마음에 들어요' : 'Positive Ratings'}
            </div>
          </div>
          <div className="somm-sub-surface rounded-2xl p-3.5">
            <div className="text-[20px] font-bold tabular-nums text-[#8A1E33] dark:text-[#F4A5B5]">
              {stats.dislikes}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {lang === 'ko' ? '아쉬움 피드백' : 'Sensitivity Flags'}
            </div>
          </div>
        </div>
      </section>

      {/* Table QR URL Simulator Modal */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="somm-card relative w-full max-w-md rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
              {t.adminTableQrTitle}
            </h3>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              {t.adminTableQrDesc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {venue.tables.map((tb) => (
                <button
                  key={tb}
                  type="button"
                  onClick={() => setSelectedQrTable(tb)}
                  data-surface={selectedQrTable === tb ? 'accent' : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold tabular-nums ${
                    selectedQrTable === tb
                      ? 'btn-accent'
                      : 'somm-sub-surface text-[var(--text-primary)]'
                  }`}
                >
                  {t.tableLabel}&nbsp;{tb}
                </button>
              ))}
            </div>
            <div className="mt-4 break-all rounded-2xl bg-[var(--bg-tertiary)] p-3 font-mono text-[12px] text-[var(--text-primary)]">
              {`${window.location.origin}/?venue_id=${encodeURIComponent(venue.id)}&table=${encodeURIComponent(selectedQrTable)}`}
            </div>
            <button
              type="button"
              data-surface="accent"
              onClick={() => {
                setQrModalOpen(false);
                onOpenGuestTable(venue.id, selectedQrTable);
              }}
              className="btn-accent mt-4 w-full rounded-2xl px-4 py-3 text-[14px] font-semibold"
            >
              {t.adminOpenGuestTableBtn}
            </button>
          </div>
        </div>
      )}

      {/* Gemini Vision API Key Modal */}
      {aiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAiModalOpen(false)}
        >
          <div
            className="somm-card relative w-full max-w-md rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAiModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <h3 className="text-[18px] font-bold text-[var(--text-primary)]">
              {t.adminAiModalTitle}
            </h3>
            <p className="prose-pretty mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {t.adminAiModalDesc}
            </p>
            <div className="mt-3 inline-flex rounded-full bg-[var(--bg-tertiary)] px-3 py-1 text-[11px] font-semibold text-[var(--text-primary)]">
              {getGeminiApiKey() ? t.adminAiStatusLive : t.adminAiStatusSim}
            </div>
            <label className="mt-4 block text-[12px] font-semibold text-[var(--text-secondary)]">
              {t.adminAiKeyLabel}
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIza..."
              className="mt-1.5 w-full rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput('');
                  saveGeminiApiKey('');
                  onAiKeyUpdated();
                  setAiModalOpen(false);
                }}
                className="rounded-2xl bg-[var(--bg-tertiary)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)]"
              >
                {t.adminAiClearBtn}
              </button>
              <button
                type="button"
                data-surface="accent"
                onClick={() => {
                  saveGeminiApiKey(apiKeyInput);
                  onAiKeyUpdated();
                  setAiModalOpen(false);
                }}
                className="btn-accent rounded-2xl px-4 py-2.5 text-[13px] font-semibold"
              >
                {t.adminAiSaveBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
