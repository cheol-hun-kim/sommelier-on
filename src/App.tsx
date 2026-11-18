import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminConsole } from './components/AdminConsole';
import { GuestJournalModal } from './components/GuestJournalModal';
import { GuestStep1 } from './components/GuestStep1';
import { GuestStep2 } from './components/GuestStep2';
import { GuestStep3 } from './components/GuestStep3';
import { HeaderBar } from './components/HeaderBar';
import { PersonaModal } from './components/PersonaModal';
import { VenueLogo } from './components/icons/WineVectors';
import {
  applyDislikeToTasteProfile,
  applyLikeToTasteProfile,
  extractTagsFromFreeText,
  generatePairingRecommendation,
} from './engine/pairingEngine';
import { CATEGORY_LABELS, formatKrw } from './i18n/translations';
import { analyzeMenuImage } from './services/aiService';
import {
  addJournalEntry,
  getGeminiApiKey,
  loadActiveMember,
  loadJournalEntries,
  loadPersonas,
  loadStats,
  loadTasteProfile,
  loadVenues,
  loadWines,
  parseQrContextFromUrl,
  recordFeedbackStats,
  recordOrderIntentStats,
  recordRecommendationStats,
  resetTasteProfile,
  saveActiveMember,
  saveTasteProfile,
  saveVenues,
  saveWines,
  signInOrRegisterMember,
  updateUrlQrContext,
} from './services/storageService';
import type {
  AppMode,
  BudgetScope,
  BudgetTier,
  CourseBottleCount,
  CoursePairingMode,
  CourseServeFormat,
  DislikeReasonTag,
  GuestMember,
  Language,
  MenuAnalysisResult,
  PairingRecommendationBundle,
  PairingSessionStats,
  ParsedMenuDish,
  SommelierPersona,
  TastingJournalEntry,
  ThemeMode,
  UserTasteProfile,
  Venue,
  WineCategory,
  WineItem,
} from './types/sommelier';

export function App() {
  const [lang, setLang] = useState<Language>('ko');
  const [theme, setTheme] = useState<ThemeMode>('ivory');
  const [appMode, setAppMode] = useState<AppMode>('guest');

  const [venues, setVenues] = useState<Venue[]>(() => loadVenues());
  const [wines, setWines] = useState<WineItem[]>(() => loadWines());
  const personas = useMemo(() => loadPersonas(), []);
  const [tasteProfile, setTasteProfile] = useState<UserTasteProfile>(() =>
    loadTasteProfile()
  );
  const [stats, setStats] = useState<PairingSessionStats>(() => loadStats());

  const initialQr = useMemo(() => parseQrContextFromUrl(venues), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [activeVenueId, setActiveVenueId] = useState<string>(initialQr.venueId);
  const [tableNo, setTableNo] = useState<string>(initialQr.tableNo);

  const activeVenue = useMemo(
    () => venues.find((v) => v.id === activeVenueId) ?? venues[0],
    [venues, activeVenueId]
  );

  const venueWines = useMemo(
    () => wines.filter((w) => w.venueId === activeVenue.id),
    [wines, activeVenue.id]
  );
  const availableVenueWines = useMemo(
    () => venueWines.filter((w) => w.stock > 0),
    [venueWines]
  );

  // Guest Flow State
  const [guestStep, setGuestStep] = useState<1 | 2 | 3>(1);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    activeVenue.defaultPersonaId
  );
  const [inspectedPersona, setInspectedPersona] =
    useState<SommelierPersona | null>(null);

  const [budgetTier, setBudgetTier] = useState<BudgetTier>('50_100');
  const [budgetScope, setBudgetScope] = useState<BudgetScope>('per_bottle');

  const [selectedRegisteredDishIds, setSelectedRegisteredDishIds] = useState<
    string[]
  >(() =>
    activeVenue.registeredDishes[0] ? [activeVenue.registeredDishes[0].id] : []
  );
  const [customDishes, setCustomDishes] = useState<ParsedMenuDish[]>([]);
  const [customDishInput, setCustomDishInput] = useState('');

  const [menuAnalysis, setMenuAnalysis] = useState<MenuAnalysisResult | null>(
    null
  );
  const [isAnalyzingMenu, setIsAnalyzingMenu] = useState(false);
  const [pairingScope, setPairingScope] = useState<'course' | 'dishes'>(() =>
    activeVenue.venueType === 'course' ? 'course' : 'dishes'
  );

  const [courseServeFormat, setCourseServeFormat] =
    useState<CourseServeFormat>('bottle');
  const [courseBottleCount, setCourseBottleCount] =
    useState<CourseBottleCount>(2);
  const [includeExtraGlass, setIncludeExtraGlass] = useState(false);
  const [coursePairingMode, setCoursePairingMode] =
    useState<CoursePairingMode>('ai_auto');
  const [customSlots, setCustomSlots] = useState<WineCategory[]>([
    'sparkling',
    'white',
    'red',
    'dessert',
  ]);

  const [recommendationBundle, setRecommendationBundle] =
    useState<PairingRecommendationBundle | null>(null);
  const [activeDrinkingWine, setActiveDrinkingWine] =
    useState<WineItem | null>(null);

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [aiLiveConnected, setAiLiveConnected] = useState(
    () => getGeminiApiKey().length > 0
  );
  const [activeMember, setActiveMember] = useState<GuestMember | null>(() =>
    loadActiveMember()
  );
  const [journalEntries, setJournalEntries] = useState<TastingJournalEntry[]>(
    () => loadJournalEntries()
  );
  const [journalModalOpen, setJournalModalOpen] = useState(false);

  // Sync HTML theme and lang attributes
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [lang, theme]);

  // Cross-tab real-time sync when Admin updates stock in another tab
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sommon_wines_v3') setWines(loadWines());
      if (e.key === 'sommon_venues_v6') setVenues(loadVenues());
      if (e.key === 'sommon_taste_profile_v1')
        setTasteProfile(loadTasteProfile());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleVenueChange = (newVenueId: string) => {
    const target = venues.find((v) => v.id === newVenueId);
    if (!target) return;
    setActiveVenueId(target.id);
    const nextTable = target.tables[0] ?? '1';
    setTableNo(nextTable);
    setSelectedPersonaId(target.defaultPersonaId);
    setPairingScope(target.venueType === 'course' ? 'course' : 'dishes');
    setSelectedRegisteredDishIds(
      target.registeredDishes[0] ? [target.registeredDishes[0].id] : []
    );
    setMenuAnalysis(null);
    setGuestStep(1);
    updateUrlQrContext(target.id, nextTable);
  };

  const handleTableChange = (nextTable: string) => {
    setTableNo(nextTable);
    updateUrlQrContext(activeVenue.id, nextTable);
  };

  const handleToggleRegisteredDish = (dishId: string) => {
    setSelectedRegisteredDishIds((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const handleAddCustomDish = () => {
    const trimmed = customDishInput.trim();
    if (!trimmed) return;
    const parsed = extractTagsFromFreeText(trimmed);
    setCustomDishes((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        nameKo: trimmed,
        nameEn: trimmed,
        flavorTags: parsed.tags,
        intensity: parsed.intensity,
        selected: true,
      },
    ]);
    setCustomDishInput('');
  };

  const handleUploadMenuPhoto = async (file: File) => {
    setIsAnalyzingMenu(true);
    try {
      const result = await analyzeMenuImage(file);
      setMenuAnalysis(result);
    } finally {
      setIsAnalyzingMenu(false);
    }
  };

  const handleToggleOcrDish = (dishId: string) => {
    setMenuAnalysis((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        dishes: prev.dishes.map((d) =>
          d.id === dishId ? { ...d, selected: !d.selected } : d
        ),
      };
    });
  };

  const isCourseFlow =
    menuAnalysis?.mode === 'course' ||
    (activeVenue.venueType === 'course' && pairingScope === 'course' && !menuAnalysis);

  const collectedDishes = useMemo<ParsedMenuDish[]>(() => {
    const regDishes: ParsedMenuDish[] = activeVenue.registeredDishes
      .filter((d) => selectedRegisteredDishIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        nameKo: d.nameKo,
        nameEn: d.nameEn,
        flavorTags: d.flavorTags,
        intensity: d.intensity,
        selected: true,
      }));

    if (menuAnalysis?.mode === 'course') {
      return [...menuAnalysis.dishes, ...customDishes];
    }

    if (activeVenue.venueType === 'course' && pairingScope === 'course' && activeVenue.courseMenu) {
      return [...activeVenue.courseMenu, ...customDishes];
    }

    if (menuAnalysis?.mode === 'alacarte') {
      const checkedOcr = menuAnalysis.dishes.filter((d) => d.selected);
      return [...checkedOcr, ...regDishes, ...customDishes];
    }

    return [...regDishes, ...customDishes];
  }, [activeVenue, pairingScope, selectedRegisteredDishIds, menuAnalysis, customDishes]);

  const hasAnyDishSelected =
    isCourseFlow || collectedDishes.length > 0 || customDishInput.trim().length > 0;

  const runRecommendation = (overrideProfile?: UserTasteProfile) => {
    const persona =
      personas.find((p) => p.id === selectedPersonaId) ?? personas[0];
    const effectiveProfile = overrideProfile ?? tasteProfile;
    const bundle = generatePairingRecommendation({
      venue: activeVenue,
      wines,
      persona,
      budgetTier,
      budgetScope,
      selectedDishes: collectedDishes,
      customDishText: customDishInput.trim(),
      bodyPref: 'any',
      sweetnessPref: 'any',
      occasion: 'date',
      menuMode: isCourseFlow ? 'course' : 'alacarte',
      courseServeFormat,
      courseBottleCount,
      coursePairingMode,
      customSlots,
      includeExtraGlass,
      tasteProfile: effectiveProfile,
    });

    const recIds =
      bundle.kind === 'course_sequence'
        ? bundle.courseSequence?.map((s) => s.wine.id) ?? []
        : bundle.singleItems?.map((i) => i.wine.id) ?? [];
    setStats(recordRecommendationStats(recIds));
    setRecommendationBundle(bundle);
    setGuestStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWineForDrinking = (wine: WineItem) => {
    setStats(recordOrderIntentStats());
    setActiveDrinkingWine(wine);
    setGuestStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logJournalFeedback = (
    wine: WineItem,
    rating: 'like' | 'dislike',
    reasons?: DislikeReasonTag[],
    memo?: string
  ) => {
    const dishesText = collectedDishes
      .slice(0, 3)
      .map((d) => (lang === 'ko' ? d.nameKo : d.nameEn))
      .join(', ');
    const entry: TastingJournalEntry = {
      id: `journal_${Date.now()}`,
      memberId: activeMember?.id ?? 'guest_anonymous',
      memberNickname:
        activeMember?.nickname ??
        (lang === 'ko' ? `테이블 ${tableNo} 손님` : `Table ${tableNo} Guest`),
      venueId: activeVenue.id,
      venueNameKo: activeVenue.nameKo,
      venueNameEn: activeVenue.nameEn,
      wineId: wine.id,
      wineNameKo: wine.nameKo,
      wineNameEn: wine.nameEn,
      vintage: wine.vintage,
      category: wine.category,
      rating,
      dislikeReasons: reasons,
      memo,
      dishesSummary: dishesText || undefined,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries(addJournalEntry(entry));
  };

  const handleLikeWine = (wine: WineItem, memo?: string) => {
    const nextProfile = applyLikeToTasteProfile(tasteProfile, wine);
    setTasteProfile(nextProfile);
    saveTasteProfile(nextProfile);
    setStats(recordFeedbackStats('like'));
    logJournalFeedback(wine, 'like', undefined, memo);
  };

  const handleDislikeWine = (
    wine: WineItem,
    reasons: DislikeReasonTag[],
    memo?: string
  ) => {
    const nextProfile = applyDislikeToTasteProfile(
      tasteProfile,
      wine,
      reasons,
      lang
    );
    setTasteProfile(nextProfile);
    saveTasteProfile(nextProfile);
    setStats(recordFeedbackStats('dislike', reasons));
    logJournalFeedback(wine, 'dislike', reasons, memo);
  };

  const handleUpdateStock = (wineId: string, delta: number) => {
    setWines((prev) => {
      const next = prev.map((w) =>
        w.id === wineId ? { ...w, stock: Math.max(0, w.stock + delta) } : w
      );
      saveWines(next);
      return next;
    });
  };

  const handleAddWine = (newWine: WineItem) => {
    setWines((prev) => {
      const next = [newWine, ...prev];
      saveWines(next);
      return next;
    });
  };

  const handleTogglePriceTransparency = (venueId: string, optIn: boolean) => {
    setVenues((prev) => {
      const next = prev.map((v) =>
        v.id === venueId ? { ...v, priceTransparencyOptIn: optIn } : v
      );
      saveVenues(next);
      return next;
    });
  };

  const handleUpdateRecommendationLimit = (venueId: string, limit: number) => {
    setVenues((prev) => {
      const next = prev.map((v) =>
        v.id === venueId ? { ...v, recommendationLimit: limit } : v
      );
      saveVenues(next);
      return next;
    });
  };

  const handleUpdateVenueLogo = (venueId: string, logoUrl: string | undefined) => {
    setVenues((prev) => {
      const next = prev.map((v) =>
        v.id === venueId ? { ...v, logoUrl } : v
      );
      saveVenues(next);
      return next;
    });
  };

  return (
    <div className="min-h-dvh">
      <HeaderBar
        lang={lang}
        onLangChange={setLang}
        theme={theme}
        onThemeChange={setTheme}
        appMode={appMode}
        onAppModeChange={setAppMode}
        venues={venues}
        activeVenue={activeVenue}
        onVenueChange={handleVenueChange}
        tableNo={tableNo}
        onTableChange={handleTableChange}
        availableCount={availableVenueWines.length}
        aiLiveConnected={aiLiveConnected}
        activeMember={activeMember}
        journalCount={journalEntries.length}
        onOpenJournal={() => setJournalModalOpen(true)}
      />

      {/* Tablet-First Side Edge Page Navigation Arrows */}
      {appMode === 'guest' && (
        <>
          {guestStep > 1 && (
            <button
              type="button"
              onClick={() => {
                setGuestStep((prev) => (prev === 3 ? 2 : 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label={lang === 'ko' ? '이전 페이지' : 'Previous step'}
              className="no-print somm-card fixed left-2.5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-primary)] shadow-md transition-transform hover:scale-105 active:scale-95 sm:left-4 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}
          {((guestStep === 1 && recommendationBundle) ||
            (guestStep === 2 && activeDrinkingWine)) && (
            <button
              type="button"
              onClick={() => {
                setGuestStep((prev) => (prev === 1 ? 2 : 3));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label={lang === 'ko' ? '다음 페이지' : 'Next step'}
              className="no-print somm-card fixed right-2.5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-primary)] shadow-md transition-transform hover:scale-105 active:scale-95 sm:right-4 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}
        </>
      )}

      <main className="no-print">
        {appMode === 'guest' && guestStep === 1 && (
          <GuestStep1
            lang={lang}
            venue={activeVenue}
            personas={personas}
            selectedPersonaId={selectedPersonaId}
            onSelectPersona={setSelectedPersonaId}
            onInspectPersona={setInspectedPersona}
            budgetTier={budgetTier}
            onBudgetTierChange={setBudgetTier}
            budgetScope={budgetScope}
            onBudgetScopeChange={setBudgetScope}
            selectedRegisteredDishIds={selectedRegisteredDishIds}
            onToggleRegisteredDish={handleToggleRegisteredDish}
            customDishes={customDishes}
            customDishInput={customDishInput}
            onCustomDishInputChange={setCustomDishInput}
            onAddCustomDish={handleAddCustomDish}
            onRemoveCustomDish={(id) =>
              setCustomDishes((prev) => prev.filter((c) => c.id !== id))
            }
            menuAnalysis={menuAnalysis}
            isAnalyzingMenu={isAnalyzingMenu}
            onUploadMenuPhoto={handleUploadMenuPhoto}
            onToggleOcrDish={handleToggleOcrDish}
            onClearMenuAnalysis={() => setMenuAnalysis(null)}
            pairingScope={pairingScope}
            onPairingScopeChange={setPairingScope}
            courseServeFormat={courseServeFormat}
            onCourseServeFormatChange={setCourseServeFormat}
            courseBottleCount={courseBottleCount}
            onCourseBottleCountChange={(c) => {
              setCourseBottleCount(c);
            }}
            includeExtraGlass={includeExtraGlass}
            onIncludeExtraGlassChange={setIncludeExtraGlass}
            coursePairingMode={coursePairingMode}
            onCoursePairingModeChange={setCoursePairingMode}
            customSlots={customSlots}
            onChangeCustomSlot={(slotIdx, cat) =>
              setCustomSlots((prev) => {
                const copy = [...prev];
                copy[slotIdx] = cat;
                return copy;
              })
            }
            tasteProfile={tasteProfile}
            onResetTasteProfile={() => setTasteProfile(resetTasteProfile())}
            hasAnyDishSelected={hasAnyDishSelected}
            onSubmitRecommend={() => runRecommendation()}
          />
        )}

        {appMode === 'guest' && guestStep === 2 && recommendationBundle && (
          <GuestStep2
            lang={lang}
            bundle={recommendationBundle}
            onBack={() => {
              setGuestStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectWineForDrinking={handleSelectWineForDrinking}
          />
        )}

        {appMode === 'guest' && guestStep === 3 && activeDrinkingWine && (
          <GuestStep3
            lang={lang}
            wine={activeDrinkingWine}
            allWines={wines}
            venueId={activeVenue.id}
            priceTransparencyOptIn={activeVenue.priceTransparencyOptIn}
            onBack={() => {
              setGuestStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLikeWine={handleLikeWine}
            onDislikeWine={handleDislikeWine}
            onSwitchWine={(nextW) => {
              setActiveDrinkingWine(nextW);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReRecommend={() => {
              const latest = loadTasteProfile();
              setTasteProfile(latest);
              runRecommendation(latest);
            }}
          />
        )}

        {appMode === 'admin' && (
          <AdminConsole
            lang={lang}
            venue={activeVenue}
            venueWines={venueWines}
            stats={stats}
            venueJournalEntries={journalEntries.filter(
              (e) => e.venueId === activeVenue.id
            )}
            isUnlocked={adminUnlocked}
            onUnlock={() => setAdminUnlocked(true)}
            onUpdateStock={handleUpdateStock}
            onAddWine={handleAddWine}
            onTogglePriceTransparency={handleTogglePriceTransparency}
            onUpdateRecommendationLimit={handleUpdateRecommendationLimit}
            onUpdateVenueLogo={handleUpdateVenueLogo}
            onOpenGuestTable={(vId, tb) => {
              handleVenueChange(vId);
              handleTableChange(tb);
              setAppMode('guest');
              setGuestStep(1);
            }}
            onAiKeyUpdated={() =>
              setAiLiveConnected(getGeminiApiKey().length > 0)
            }
          />
        )}
      </main>

      {/* Clean Printable Cellar Wine List (Triggered by Admin "인쇄용 주류 리스트") */}
      <section className="hidden print-only p-8 text-[#1C191A]">
        <div className="flex items-center justify-between border-b-2 border-[#6B1D2F] pb-3">
          <div>
            <h1 className="text-2xl font-bold">
              {lang === 'ko' ? activeVenue.nameKo : activeVenue.nameEn} · Wine Cellar List
            </h1>
            <p className="mt-1 text-sm text-[#6E6568]">
              Curated by Sommelier On · Active In-Stock Bottles Only ({availableVenueWines.length})
            </p>
          </div>
          <VenueLogo
            venueId={activeVenue.id}
            logoUrl={activeVenue.logoUrl}
            venueName={lang === 'ko' ? activeVenue.nameKo : activeVenue.nameEn}
            size="md"
          />
        </div>

        <div className="mt-6 space-y-6">
          {(['sparkling', 'white', 'rose_orange', 'red', 'dessert'] as WineCategory[]).map(
            (cat) => {
              const items = availableVenueWines.filter((w) => w.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat}>
                  <h2 className="border-b border-[#E5E0DC] pb-1 text-base font-bold text-[#6B1D2F]">
                    {CATEGORY_LABELS[cat][lang]}
                  </h2>
                  <div className="mt-2 space-y-2">
                    {items.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-baseline justify-between text-sm"
                      >
                        <div>
                          <span className="font-semibold">
                            {lang === 'ko' ? w.nameKo : w.nameEn}
                          </span>{' '}
                          <span className="tabular-nums text-[#6E6568]">
                            {w.vintage}
                          </span>
                          <span className="ml-2 text-xs text-[#6E6568]">
                            ({lang === 'ko' ? w.varietalsKo : w.varietalsEn} ·{' '}
                            {lang === 'ko' ? w.regionKo : w.regionEn})
                          </span>
                        </div>
                        <div className="font-bold tabular-nums">
                          {formatKrw(w.venuePrice, lang)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      <PersonaModal
        persona={inspectedPersona}
        lang={lang}
        onClose={() => setInspectedPersona(null)}
        onSelect={(id) => setSelectedPersonaId(id)}
      />

      <GuestJournalModal
        isOpen={journalModalOpen}
        lang={lang}
        activeMember={activeMember}
        journalEntries={journalEntries}
        onClose={() => setJournalModalOpen(false)}
        onSignIn={(nick, contact) => {
          const member = signInOrRegisterMember(nick, contact);
          setActiveMember(member);
        }}
        onSignOut={() => {
          saveActiveMember(null);
          setActiveMember(null);
        }}
      />
    </div>
  );
}

export default App;
