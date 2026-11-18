import React from 'react';
import { Award, X } from 'lucide-react';
import type { Language, SommelierPersona } from '../types/sommelier';
import { TRANSLATIONS } from '../i18n/translations';
import { SommelierAvatar } from './icons/WineVectors';

interface PersonaModalProps {
  persona: SommelierPersona | null;
  lang: Language;
  onClose: () => void;
  onSelect: (personaId: string) => void;
}

export const PersonaModal: React.FC<PersonaModalProps> = ({
  persona,
  lang,
  onClose,
  onSelect,
}) => {
  // Unmount completely when closed -> Zero invisible click-blocking overlays!
  if (!persona) return null;

  const t = TRANSLATIONS[lang];
  const name = lang === 'ko' ? persona.nameKo : persona.nameEn;
  const genre = lang === 'ko' ? persona.genreKo : persona.genreEn;
  const credentials = lang === 'ko' ? persona.credentialsKo : persona.credentialsEn;
  const philosophy = lang === 'ko' ? persona.philosophyKo : persona.philosophyEn;
  const rule = lang === 'ko' ? persona.signatureRuleKo : persona.signatureRuleEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="persona-modal-title"
      onClick={onClose}
    >
      <div
        className="somm-card relative w-full max-w-lg rounded-3xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeBtn}
          className="absolute right-5 top-5 rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        {/* Top Identity Row (matching Reference Image 1) */}
        <div className="flex items-center gap-4">
          <SommelierAvatar personaId={persona.id} size={72} />
          <div>
            <h3
              id="persona-modal-title"
              className="text-[20px] font-bold text-[var(--text-primary)]"
            >
              {name}
            </h3>
            <p className="text-[14px] font-medium text-[var(--text-secondary)]">{genre}</p>
            <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
              <Award className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="tabular-nums">
                {persona.yearsExp}&nbsp;{t.personaExpUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Left Burgundy Quote Bar (matching Reference Image 1) */}
        <blockquote className="mt-5 border-l-[3px] border-[#6B1D2F] pl-3.5 text-[15px] font-semibold leading-relaxed text-[var(--text-primary)]">
          {rule}
        </blockquote>

        {/* Structured Details */}
        <dl className="mt-5 space-y-3 text-[14px]">
          <div className="grid grid-cols-[96px_1fr] gap-3">
            <dt className="font-medium text-[var(--text-secondary)]">{t.personaPreferredRegions}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {persona.preferredRegions.map((reg) => (
                <span
                  key={reg}
                  className="rounded-full bg-[#F5EBEF] px-2.5 py-0.5 text-[12px] font-semibold text-[#6B1D2F] dark:bg-[#2E181F] dark:text-[#F4B8C6]"
                >
                  {reg}
                </span>
              ))}
            </dd>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-3">
            <dt className="font-medium text-[var(--text-secondary)]">Credentials</dt>
            <dd className="text-[var(--text-primary)]">{credentials}</dd>
          </div>

          <div className="grid grid-cols-[96px_1fr] gap-3">
            <dt className="font-medium text-[var(--text-secondary)]">{t.personaPhilosophyLabel}</dt>
            <dd className="prose-pretty leading-[1.6] text-[var(--text-primary)]">{philosophy}</dd>
          </div>
        </dl>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-[var(--bg-tertiary)] px-4 py-3 text-[14px] font-semibold text-[var(--text-primary)] transition-colors hover:opacity-90"
          >
            {t.closeBtn}
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(persona.id);
              onClose();
            }}
            data-surface="accent"
            className="btn-accent rounded-2xl px-4 py-3 text-[14px] font-semibold transition-colors"
          >
            {t.selectThisSommelierBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
