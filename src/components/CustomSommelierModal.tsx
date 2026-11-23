import React, { useEffect, useState } from 'react';
import { Check, Sparkles, UserPlus, X } from 'lucide-react';
import type {
  AvatarAccessory,
  AvatarConfig,
  AvatarHairStyle,
  AvatarOutfit,
  Language,
  SommelierPersona,
} from '../types/sommelier';
import { SommelierAvatar } from './icons/WineVectors';

interface CustomSommelierModalProps {
  open: boolean;
  lang: Language;
  venueId: string;
  venueName: string;
  editingPersona: SommelierPersona | null;
  onClose: () => void;
  onSave: (persona: SommelierPersona) => void;
}

const DEFAULT_AVATAR: AvatarConfig = {
  hairStyle: 'parted',
  hairColor: '#24201F',
  skinTone: '#F3D0BF',
  outfit: 'somm_apron',
  accessory: 'none',
  bgColor: '#EFE8E6',
};

const HAIR_OPTIONS: Array<{ id: AvatarHairStyle; ko: string; en: string }> = [
  { id: 'short_neat', ko: '단정 숏컷', en: 'Short Neat' },
  { id: 'parted', ko: '가르마', en: 'Side Part' },
  { id: 'slick', ko: '올백', en: 'Slick Back' },
  { id: 'bob', ko: '단발 보브', en: 'Classic Bob' },
  { id: 'long_wave', ko: '롱 헤어', en: 'Long Hair' },
];

const HAIR_COLORS = [
  { hex: '#24201F', ko: '블랙', en: 'Black' },
  { hex: '#4A3525', ko: '다크 브라운', en: 'Dark Brown' },
  { hex: '#7A5C43', ko: '체스넛', en: 'Chestnut' },
  { hex: '#8F969E', ko: '실버 그레이', en: 'Silver' },
];

const SKIN_TONES = [
  { hex: '#F6D7C8', ko: '밝은 톤', en: 'Fair' },
  { hex: '#F3D0BF', ko: '내추럴', en: 'Light' },
  { hex: '#E5B8A2', ko: '웜 미디엄', en: 'Medium' },
  { hex: '#C99378', ko: '딥 웜', en: 'Tan' },
];

const OUTFIT_OPTIONS: Array<{ id: AvatarOutfit; ko: string; en: string }> = [
  { id: 'tuxedo', ko: '클래식 수트', en: 'Classic Suit' },
  { id: 'somm_apron', ko: '소믈리에 에이프런', en: 'Sommelier Apron' },
  { id: 'burgundy_jacket', ko: '버건디 재킷', en: 'Burgundy Jacket' },
  { id: 'knit', ko: '캐주얼 니트', en: 'Casual Knit' },
];

const ACCESSORY_OPTIONS: Array<{ id: AvatarAccessory; ko: string; en: string }> = [
  { id: 'none', ko: '없음', en: 'None' },
  { id: 'glasses', ko: '뿔테 안경', en: 'Glasses' },
  { id: 'round_glasses', ko: '라운드 안경', en: 'Round Glasses' },
  { id: 'mustache', ko: '콧수염', en: 'Mustache' },
];

const BG_COLORS = ['#EFE8E6', '#E3EAE6', '#ECE7E2', '#E8EBF2'];

const TONE_PRESETS: Array<{
  id: SommelierPersona['toneStyle'];
  ko: string;
  en: string;
  descKo: string;
  descEn: string;
  ruleKo: string;
  ruleEn: string;
  categories: SommelierPersona['preferredCategories'];
}> = [
  {
    id: 'classic_french',
    ko: '클래식 균형파',
    en: 'Classic Structure',
    descKo: '산도·타닌 구조와 음식의 무게감 대칭',
    descEn: 'Balances acidity and tannin structure with sauce weight',
    ruleKo: '요리의 지방과 소스 질감을 와인의 산도와 구조감으로 정밀하게 대칭시킵니다.',
    ruleEn: 'Balances dish richness and sauce weight against classic acidity and tannin.',
    categories: { sparkling: 9, white: 8, red: 9, dessert: 6 },
  },
  {
    id: 'new_korean',
    ko: '다정한 감칠맛 브릿지',
    en: 'Approachable Umami',
    descKo: '쉬운 설명과 부드러운 질감 중심',
    descEn: 'Intuitive descriptions and plush textures for umami dishes',
    ruleKo: '간장·버섯·숙성 육류의 감칠맛과 충돌하지 않는 매끄러운 타닌과 아로마를 우선합니다.',
    ruleEn: 'Prioritizes plush fruit and supple tannin that harmonize with umami.',
    categories: { white: 10, rose_orange: 8, red: 8, sparkling: 7 },
  },
  {
    id: 'natural_explorer',
    ko: '내추럴 · 개성 탐험가',
    en: 'Natural & Discovery',
    descKo: '생동감 있는 산미와 새로운 산지 제안',
    descEn: 'Vibrant native acidity and expressive low-intervention bottles',
    ruleKo: '생동감 있는 자연 산미와 다채로운 허브·과실 결로 테이블의 대화를 여는 와인을 찾습니다.',
    ruleEn: 'Champions vibrant native acidity and expressive textures beyond usual labels.',
    categories: { rose_orange: 11, sparkling: 9, white: 8, red: 7 },
  },
];

const POPULAR_REGIONS = [
  'Bourgogne',
  'Champagne',
  'Bordeaux',
  'Loire',
  'Rhône',
  'Piemonte',
  'Toscana',
  'Jura',
  'Etna',
  'Mosel',
  'Oregon',
];

export const CustomSommelierModal: React.FC<CustomSommelierModalProps> = ({
  open,
  lang,
  venueId,
  venueName,
  editingPersona,
  onClose,
  onSave,
}) => {
  const [nameKo, setNameKo] = useState('');
  const [titleKo, setTitleKo] = useState('');
  const [yearsExp, setYearsExp] = useState('7');
  const [credentialsKo, setCredentialsKo] = useState('');
  const [greetingKo, setGreetingKo] = useState('');
  const [toneStyle, setToneStyle] = useState<SommelierPersona['toneStyle']>('new_korean');
  const [regions, setRegions] = useState<string[]>(['Bourgogne', 'Champagne', 'Loire']);
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setErrorMsg('');
    if (editingPersona) {
      setNameKo(editingPersona.nameKo);
      setTitleKo(editingPersona.titleKo);
      setYearsExp(String(editingPersona.yearsExp));
      setCredentialsKo(editingPersona.credentialsKo);
      setGreetingKo(editingPersona.greetingKo ?? editingPersona.philosophyKo);
      setToneStyle(editingPersona.toneStyle);
      setRegions(editingPersona.preferredRegions);
      setAvatar(editingPersona.avatarConfig ?? DEFAULT_AVATAR);
    } else {
      setNameKo('');
      setTitleKo('');
      setYearsExp('7');
      setCredentialsKo('');
      setGreetingKo('');
      setToneStyle('new_korean');
      setRegions(['Bourgogne', 'Champagne', 'Loire']);
      setAvatar(DEFAULT_AVATAR);
    }
  }, [open, editingPersona]);

  if (!open) return null;

  const toggleRegion = (reg: string) => {
    setRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameKo.trim();
    if (!trimmedName) {
      setErrorMsg(
        lang === 'ko' ? '소믈리에 이름을 입력해 주세요.' : 'Please enter sommelier name.'
      );
      return;
    }

    const preset = TONE_PRESETS.find((t) => t.id === toneStyle) ?? TONE_PRESETS[1];
    const trimmedTitle =
      titleKo.trim() ||
      (lang === 'ko' ? `${venueName} 헤드 소믈리에` : `${venueName} Head Sommelier`);
    const trimmedCred =
      credentialsKo.trim() ||
      (lang === 'ko' ? `${venueName} 전담 와인 큐레이터` : `Dedicated Wine Curator at ${venueName}`);
    const parsedYears = Math.max(1, Math.min(50, Number(yearsExp) || 5));
    const defaultGreeting = `안녕하세요, ${venueName} 전담 소믈리에 ${trimmedName}입니다. 오늘 테이블의 분위기와 요리에 가장 잘 어울리는 한 병을 정성껏 골라드리겠습니다.`;
    const trimmedGreeting = greetingKo.trim() || defaultGreeting;
    const monogram = trimmedName.slice(0, 2).toUpperCase();

    const persona: SommelierPersona = {
      id: editingPersona?.id ?? `custom_${Date.now()}`,
      nameKo: trimmedName,
      nameEn: trimmedName,
      titleKo: trimmedTitle,
      titleEn: trimmedTitle,
      genreKo: preset.ko,
      genreEn: preset.en,
      monogram,
      yearsExp: parsedYears,
      credentialsKo: trimmedCred,
      credentialsEn: trimmedCred,
      philosophyKo: trimmedGreeting,
      philosophyEn: trimmedGreeting,
      greetingKo: trimmedGreeting,
      greetingEn: trimmedGreeting,
      signatureRuleKo: preset.ruleKo,
      signatureRuleEn: preset.ruleEn,
      preferredRegions: regions.length > 0 ? regions : ['Bourgogne', 'Champagne'],
      preferredCategories: preset.categories,
      toneStyle,
      tierKo: lang === 'ko' ? '우리 업장 전용' : 'Custom Host',
      tierEn: 'Custom Host',
      monthlyFeeLabelKo: lang === 'ko' ? '업장 커스텀' : 'In-House',
      monthlyFeeLabelEn: 'In-House',
      avatarConfig: avatar,
      isCustom: true,
      venueId,
    };

    onSave(persona);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-somm-title"
      onClick={onClose}
    >
      <div
        className="somm-card relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === 'ko' ? '닫기' : 'Close'}
          className="absolute right-5 top-5 rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="mb-5 flex items-center gap-2.5 pr-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F5EBEF] text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]">
            <UserPlus className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div>
            <h2
              id="custom-somm-title"
              className="text-[18px] font-bold text-[var(--text-primary)]"
            >
              {editingPersona
                ? lang === 'ko'
                  ? '우리 업장 소믈리에 캐릭터 수정'
                  : 'Edit In-House Sommelier'
                : lang === 'ko'
                  ? '우리 업장 소믈리에 캐릭터 만들기'
                  : 'Create In-House Sommelier'}
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {lang === 'ko'
                ? `${venueName}의 실제 소믈리에 캐릭터와 인삿말을 직접 구성합니다.`
                : `Customize a dedicated sommelier avatar and profile for ${venueName}.`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Section: Live Preview + Avatar Parts Customizer */}
          <div className="grid grid-cols-1 gap-5 rounded-2xl bg-[var(--bg-tertiary)]/55 p-4 md:grid-cols-[200px_1fr]">
            {/* Live Preview */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-secondary)] p-4 text-center shadow-xs">
              <SommelierAvatar personaId="custom" avatarConfig={avatar} size={96} />
              <div className="mt-3 text-[14px] font-bold text-[var(--text-primary)]">
                {nameKo.trim() || (lang === 'ko' ? '소믈리에 이름' : 'Sommelier Name')}
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-[#6B1D2F] dark:text-[#E59BAE]">
                {titleKo.trim() || (lang === 'ko' ? '헤드 소믈리에' : 'Head Sommelier')}
              </div>
            </div>

            {/* Avatar Parts */}
            <div className="space-y-3 text-[12px]">
              {/* Hair Style */}
              <div>
                <div className="mb-1.5 font-semibold text-[var(--text-secondary)]">
                  {lang === 'ko' ? '헤어 스타일' : 'Hair Style'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HAIR_OPTIONS.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setAvatar((prev) => ({ ...prev, hairStyle: h.id }))}
                      className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                        avatar.hairStyle === h.id
                          ? 'bg-[#6B1D2F] text-[#FFFFFF]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-85'
                      }`}
                    >
                      {lang === 'ko' ? h.ko : h.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit */}
              <div>
                <div className="mb-1.5 font-semibold text-[var(--text-secondary)]">
                  {lang === 'ko' ? '복장' : 'Outfit'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {OUTFIT_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setAvatar((prev) => ({ ...prev, outfit: o.id }))}
                      className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                        avatar.outfit === o.id
                          ? 'bg-[#6B1D2F] text-[#FFFFFF]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-85'
                      }`}
                    >
                      {lang === 'ko' ? o.ko : o.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessory */}
              <div>
                <div className="mb-1.5 font-semibold text-[var(--text-secondary)]">
                  {lang === 'ko' ? '안경 · 포인트' : 'Accessory'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ACCESSORY_OPTIONS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAvatar((prev) => ({ ...prev, accessory: a.id }))}
                      className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                        avatar.accessory === a.id
                          ? 'bg-[#6B1D2F] text-[#FFFFFF]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-85'
                      }`}
                    >
                      {lang === 'ko' ? a.ko : a.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches Row: Hair / Skin / Background */}
              <div className="flex flex-wrap gap-5 pt-1">
                <div>
                  <div className="mb-1 font-semibold text-[var(--text-secondary)]">
                    {lang === 'ko' ? '머리색' : 'Hair'}
                  </div>
                  <div className="flex gap-1.5">
                    {HAIR_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        aria-label={c.ko}
                        onClick={() => setAvatar((prev) => ({ ...prev, hairColor: c.hex }))}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          avatar.hairColor === c.hex
                            ? 'scale-110 border-[#6B1D2F] dark:border-[#F4B8C6]'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-1 font-semibold text-[var(--text-secondary)]">
                    {lang === 'ko' ? '피부톤' : 'Skin'}
                  </div>
                  <div className="flex gap-1.5">
                    {SKIN_TONES.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        aria-label={c.ko}
                        onClick={() => setAvatar((prev) => ({ ...prev, skinTone: c.hex }))}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          avatar.skinTone === c.hex
                            ? 'scale-110 border-[#6B1D2F] dark:border-[#F4B8C6]'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-1 font-semibold text-[var(--text-secondary)]">
                    {lang === 'ko' ? '배경' : 'Backdrop'}
                  </div>
                  <div className="flex gap-1.5">
                    {BG_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        aria-label={hex}
                        onClick={() => setAvatar((prev) => ({ ...prev, bgColor: hex }))}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          avatar.bgColor === hex
                            ? 'scale-110 border-[#6B1D2F] dark:border-[#F4B8C6]'
                            : 'border-[var(--border-subtle)]'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block space-y-1 text-[13px]">
              <span className="font-semibold text-[var(--text-primary)]">
                {lang === 'ko' ? '소믈리에 이름 *' : 'Name *'}
              </span>
              <input
                type="text"
                value={nameKo}
                onChange={(e) => setNameKo(e.target.value)}
                placeholder={lang === 'ko' ? '예: 김태형 소믈리에' : 'e.g. Taehyung Kim'}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:border-[#6B1D2F] focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-[13px]">
              <span className="font-semibold text-[var(--text-primary)]">
                {lang === 'ko' ? '직함 / 전문 분야' : 'Title / Specialty'}
              </span>
              <input
                type="text"
                value={titleKo}
                onChange={(e) => setTitleKo(e.target.value)}
                placeholder={lang === 'ko' ? '예: 헤드 소믈리에 · 부르고뉴' : 'Head Sommelier'}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:border-[#6B1D2F] focus:outline-none"
              />
            </label>

            <label className="block space-y-1 text-[13px]">
              <span className="font-semibold text-[var(--text-primary)]">
                {lang === 'ko' ? '경력 (년)' : 'Years Exp'}
              </span>
              <input
                type="number"
                min={1}
                max={50}
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] tabular-nums text-[var(--text-primary)] focus:border-[#6B1D2F] focus:outline-none"
              />
            </label>
          </div>

          <label className="block space-y-1 text-[13px]">
            <span className="font-semibold text-[var(--text-primary)]">
              {lang === 'ko'
                ? '상세 경력 · 수상 이력 · 이전 근무지 (손님 화면 드롭다운에 표시)'
                : 'Career, Awards & Former Venues (Shown in dropdown)'}
            </span>
            <input
              type="text"
              value={credentialsKo}
              onChange={(e) => setCredentialsKo(e.target.value)}
              placeholder={
                lang === 'ko'
                  ? '예: 전 청담 미슐랭 1스타 소믈리에 · WSET Level 3 · 2024 코리아 소믈리에 본선'
                  : 'e.g. Former 1-Michelin Sommelier · WSET Level 3'
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:border-[#6B1D2F] focus:outline-none"
            />
          </label>

          <label className="block space-y-1 text-[13px]">
            <span className="font-semibold text-[var(--text-primary)]">
              {lang === 'ko' ? '손님 첫 인삿말' : 'Welcome Greeting'}
            </span>
            <textarea
              rows={3}
              value={greetingKo}
              onChange={(e) => setGreetingKo(e.target.value)}
              placeholder={
                lang === 'ko'
                  ? '비워두시면 업장명과 소믈리에 이름이 담긴 기본 인삿말이 자동 생성됩니다.'
                  : 'Leave blank to generate a warm default greeting automatically.'
              }
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-2 text-[13px] leading-relaxed text-[var(--text-primary)] focus:border-[#6B1D2F] focus:outline-none"
            />
          </label>

          {/* Pairing Tone Style */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-primary)]">
              <Sparkles className="h-3.5 w-3.5 text-[#6B1D2F] dark:text-[#E59BAE]" strokeWidth={1.5} />
              <span>{lang === 'ko' ? '와인 추천 성향 (엔진 연동)' : 'Pairing Style'}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {TONE_PRESETS.map((preset) => {
                const active = toneStyle === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setToneStyle(preset.id)}
                    className={`rounded-2xl p-3 text-left transition-all ${
                      active ? 'somm-card-selected' : 'somm-sub-surface hover:opacity-90'
                    }`}
                  >
                    <div className="text-[13px] font-bold text-[var(--text-primary)]">
                      {lang === 'ko' ? preset.ko : preset.en}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                      {lang === 'ko' ? preset.descKo : preset.descEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Regions */}
          <div className="space-y-2">
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">
              {lang === 'ko' ? '주요 해석 산지 (복수 선택)' : 'Signature Regions'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_REGIONS.map((reg) => {
                const selected = regions.includes(reg);
                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => toggleRegion(reg)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                      selected
                        ? 'bg-[#6B1D2F] text-[#FFFFFF]'
                        : 'somm-sub-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" strokeWidth={2} />}
                    <span>{reg}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <p className="text-[12px] font-semibold text-[#B42318] dark:text-[#FCA5A5]">
              {errorMsg}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-[var(--bg-tertiary)] px-5 py-2.5 text-[13px] font-semibold text-[var(--text-primary)] transition-colors hover:opacity-90"
            >
              {lang === 'ko' ? '취소' : 'Cancel'}
            </button>
            <button
              type="submit"
              data-surface="accent"
              className="btn-accent rounded-2xl px-6 py-2.5 text-[13px] font-semibold transition-colors"
            >
              {editingPersona
                ? lang === 'ko'
                  ? '캐릭터 수정 저장'
                  : 'Save Changes'
                : lang === 'ko'
                  ? '캐릭터 등록 및 바로 적용'
                  : 'Create & Assign Host'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
