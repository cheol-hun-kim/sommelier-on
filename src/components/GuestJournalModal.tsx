import React, { useState } from 'react';
import { BookOpen, LogOut, ThumbsDown, ThumbsUp, User, X } from 'lucide-react';
import type {
  GuestMember,
  Language,
  TastingJournalEntry,
} from '../types/sommelier';
import {
  CATEGORY_LABELS,
  DISLIKE_REASON_LABELS,
} from '../i18n/translations';

interface GuestJournalModalProps {
  isOpen: boolean;
  lang: Language;
  activeMember: GuestMember | null;
  journalEntries: TastingJournalEntry[];
  onClose: () => void;
  onSignIn: (nickname: string, contact: string) => void;
  onSignOut: () => void;
}

export const GuestJournalModal: React.FC<GuestJournalModalProps> = ({
  isOpen,
  lang,
  activeMember,
  journalEntries,
  onClose,
  onSignIn,
  onSignOut,
}) => {
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');

  if (!isOpen) return null;

  const memberEntries = activeMember
    ? journalEntries.filter(
        (e) =>
          e.memberId === activeMember.id ||
          e.memberId === 'guest_anonymous'
      )
    : journalEntries;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !contact.trim()) return;
    onSignIn(nickname.trim(), contact.trim());
    setNickname('');
    setContact('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="somm-card relative max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-3xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2.5 text-[#6B1D2F] dark:text-[#E59BAE]">
          <BookOpen className="h-5 w-5" strokeWidth={1.5} />
          <h2 className="text-[20px] font-bold text-[var(--text-primary)]">
            {lang === 'ko' ? '나의 와인 미식 기록' : 'My Tasting Journal'}
          </h2>
        </div>

        {/* Member Auth Section */}
        {activeMember ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F5EBEF] px-4 py-3 dark:bg-[#2E181F]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6B1D2F] text-[#FFFFFF]">
                <User className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[var(--text-primary)]">
                  {activeMember.nickname}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)]">
                  {activeMember.contact}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-secondary)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-primary)] shadow-sm"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>{lang === 'ko' ? '로그아웃' : 'Sign Out'}</span>
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="somm-sub-surface mt-4 space-y-3 rounded-2xl p-4"
          >
            <div>
              <div className="text-[14px] font-bold text-[var(--text-primary)]">
                {lang === 'ko'
                  ? '간편 가입 · 로그인으로 미식 기록 저장'
                  : 'Sign In / Join to Save Your Wine History'}
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                {lang === 'ko'
                  ? '어느 업장에서 어떤 와인을 마셨는지 기록하고, 방문한 업장에서도 맞춤 응대를 받을 수 있습니다.'
                  : 'Keep track of every bottle across restaurants and share your palate preferences with venues.'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={lang === 'ko' ? '닉네임 (예: 김소믈)' : 'Nickname'}
                className="rounded-xl bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
              />
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={
                  lang === 'ko' ? '이메일 또는 휴대폰 번호' : 'Email or Phone'
                }
                className="rounded-xl bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#6B1D2F]"
              />
            </div>
            <button
              type="submit"
              data-surface="accent"
              className="btn-accent w-full rounded-xl px-4 py-2.5 text-[13px] font-bold"
            >
              {lang === 'ko' ? '내 미식 기록 시작하기' : 'Save & Continue'}
            </button>
          </form>
        )}

        {/* Journal Timeline */}
        <div className="mt-5 space-y-2.5">
          <div className="text-[13px] font-bold text-[var(--text-secondary)]">
            {lang === 'ko'
              ? `저장된 시음 기록 (${memberEntries.length}건)`
              : `Saved Tastings (${memberEntries.length})`}
          </div>

          {memberEntries.length === 0 ? (
            <div className="somm-sub-surface rounded-2xl p-6 text-center text-[13px] text-[var(--text-secondary)]">
              {lang === 'ko'
                ? '아직 시음 피드백을 남긴 와인이 없습니다. 와인을 선택해 마신 뒤 마음에 들었는지 남겨보세요!'
                : 'No tastings logged yet. Rate a bottle during your meal to build your journal.'}
            </div>
          ) : (
            memberEntries.map((entry) => (
              <div
                key={entry.id}
                className="somm-sub-surface rounded-2xl p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#6B1D2F] dark:text-[#E59BAE]">
                    {lang === 'ko' ? entry.venueNameKo : entry.venueNameEn} ·{' '}
                    {new Date(entry.createdAt).toLocaleDateString(
                      lang === 'ko' ? 'ko-KR' : 'en-US'
                    )}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      entry.rating === 'like'
                        ? 'bg-[#EDF5F0] text-[#1F5B3A] dark:bg-[#172B20] dark:text-[#9ED8B6]'
                        : 'bg-[#FDF0F2] text-[#8A1E33] dark:bg-[#32161D] dark:text-[#F4A5B5]'
                    }`}
                  >
                    {entry.rating === 'like' ? (
                      <ThumbsUp className="h-3 w-3" strokeWidth={1.5} />
                    ) : (
                      <ThumbsDown className="h-3 w-3" strokeWidth={1.5} />
                    )}
                    <span>
                      {entry.rating === 'like'
                        ? lang === 'ko'
                          ? '만족'
                          : 'Liked'
                        : lang === 'ko'
                          ? '아쉬움'
                          : 'Off'}
                    </span>
                  </span>
                </div>

                <div className="mt-1.5 text-[15px] font-bold text-[var(--text-primary)]">
                  {lang === 'ko' ? entry.wineNameKo : entry.wineNameEn}{' '}
                  <span className="font-semibold tabular-nums text-[var(--text-secondary)]">
                    {entry.vintage}
                  </span>
                </div>

                <div className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                  {CATEGORY_LABELS[entry.category][lang]}
                  {entry.dishesSummary ? ` · ${entry.dishesSummary}` : ''}
                </div>

                {entry.dislikeReasons && entry.dislikeReasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.dislikeReasons.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)]"
                      >
                        {DISLIKE_REASON_LABELS[r][lang]}
                      </span>
                    ))}
                  </div>
                )}

                {entry.memo && (
                  <p className="mt-2 rounded-xl bg-[var(--bg-secondary)] px-3 py-2 text-[12px] text-[var(--text-primary)]">
                    {entry.memo}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
