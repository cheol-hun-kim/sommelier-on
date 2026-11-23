import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminConsole } from './components/AdminConsole';
import { GuestJournalModal } from './components/GuestJournalModal';
import { GuestStep1, type Step1Page } from './components/GuestStep1';
import { GuestStep2 } from './components/GuestStep2';
import { GuestStep3 } from './components/GuestStep3';
import { HeaderBar } from './components/HeaderBar';
import { PersonaModal } from './components/PersonaModal';
import { WineCatalogView } from './components/WineCatalogModal';
import { VenueLogo } from './components/icons/WineVectors';
import {
  applyDislikeToTasteProfile,
  applyLikeToTasteProfile,
  extractTagsFromFreeText,
  generateCorkageOnlyRecommendation,
  generatePairingRecommendation,
  swapSpecificWinesInBundle,
} from './engine/pairingEngine';
import { CATEGORY_LABELS, formatKrw } from './i18n/translations';
import { analyzeMenuImage, enrichCorkageBottle } from './services/aiService';
import { validateImageFile } from './utils/fileValidation';
import {
  addJournalEntry,
  addReservation,
  getGeminiApiKey,
  loadActiveMember,
  loadJournalEntries,
  loadPersonalCellar,
  loadPersonas,
  loadReservations,
  loadStats,
  loadTasteProfile,
  loadVenues,
  loadWineShops,
  loadWines,
  parseQrContextFromUrl,
  recordFeedbackStats,
  recordOrderIntentStats,
  recordRecommendationStats,
  resetTasteProfile,
  saveActiveMember,
  saveCustomPersonas,
  savePersonalCellar,
  saveTasteProfile,
  saveVenues,
  saveWines,
  signInOrRegisterMember,
  updateReservationStatus,
  updateUrlQrContext,
} from './services/storageService';
import type {
  AppMode,
  BudgetScope,
  BudgetTier,
  CorkageBottle,
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
  SpeechStyle,
  TastingJournalEntry,
  ThemeMode,
  UserTasteProfile,
  Venue,
  VisitTiming,
  WineCategory,
  WineItem,
  WineReservation,
  WineShop,
  WineSourceMode,
} from './types/sommelier';

export function App() {
  const [lang, setLang] = useState<Language>('ko');
  const [theme, setTheme] = useState<ThemeMode>('ivory');
  const [appMode, setAppMode] = useState<AppMode>('guest');

  const [venues, setVenues] = useState<Venue[]>(() => loadVenues());
  const [wines, setWines] = useState<WineItem[]>(() => loadWines());
  const [personas, setPersonas] = useState<SommelierPersona[]>(() => loadPersonas());
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
  const [step1Page, setStep1Page] = useState<Step1Page>(1);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(
    activeVenue.defaultPersonaId
  );
  const [speechStyle, setSpeechStyle] = useState<SpeechStyle>('friendly');
  const [inspectedPersona, setInspectedPersona] =
    useState<SommelierPersona | null>(null);

  const [budgetTier, setBudgetTier] = useState<BudgetTier>('100_200');
  const [customBudgetManWon, setCustomBudgetManWon] = useState('');
  const [budgetScope, setBudgetScope] = useState<BudgetScope>('per_bottle');
  const [visitTiming, setVisitTiming] = useState<VisitTiming>('on_site');
  const [wineSourceMode, setWineSourceMode] = useState<WineSourceMode>('venue_cellar');
  const [personalCellar, setPersonalCellar] = useState<WineItem[]>(() =>
    loadPersonalCellar()
  );
  const [wineShops] = useState<WineShop[]>(() => loadWineShops());
  const [selectedWineShopId, setSelectedWineShopId] = useState<string>(
    () => loadWineShops()[0]?.id ?? 'shop_hannam'
  );
  const [reservations, setReservations] = useState<WineReservation[]>(() =>
    loadReservations()
  );
  const [corkageOnly, setCorkageOnly] = useState(false);
  const [corkageWine, setCorkageWine] = useState<CorkageBottle | null>(null);

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
  const [menuUploadError, setMenuUploadError] = useState<string | null>(null);
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
  const [swappedExcludedIds, setSwappedExcludedIds] = useState<string[]>([]);
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
    const check = validateImageFile(file, 10 * 1024 * 1024);
    if (!check.valid) {
      setMenuUploadError(check.error ?? '허용되지 않는 이미지 파일입니다.');
      return;
    }
    setMenuUploadError(null);
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

  const selectedWineShop = useMemo(
    () => wineShops.find((s) => s.id === selectedWineShopId) ?? wineShops[0],
    [wineShops, selectedWineShopId]
  );

  const buildPairingQuery = (
    overridePersonaId?: string,
    overrideProfile?: UserTasteProfile,
    overrideExcluded?: string[]
  ) => {
    const pId = overridePersonaId ?? selectedPersonaId;
    const persona = personas.find((p) => p.id === pId) ?? personas[0];
    const parsedManWon = Number(customBudgetManWon);
    const customBudgetWon =
      !Number.isNaN(parsedManWon) && parsedManWon > 0
        ? parsedManWon * 10000
        : null;
    const effectiveCorkage =
      corkageWine && corkageWine.name.trim().length > 0 ? corkageWine : null;

    const sourceWines =
      wineSourceMode === 'my_cellar'
        ? personalCellar
        : wineSourceMode === 'wine_shop'
          ? selectedWineShop?.wines ?? []
          : undefined;

    const sourceLabelKo =
      wineSourceMode === 'my_cellar'
        ? '내 셀러 보유 와인'
        : wineSourceMode === 'wine_shop'
          ? selectedWineShop?.nameKo ?? '와인샵'
          : undefined;
    const sourceLabelEn =
      wineSourceMode === 'my_cellar'
        ? 'My Home Cellar'
        : wineSourceMode === 'wine_shop'
          ? selectedWineShop?.nameEn ?? 'Wine Shop'
          : undefined;

    return {
      venue: activeVenue,
      wines,
      sourceWines,
      sourceMode: wineSourceMode,
      sourceLabelKo,
      sourceLabelEn,
      persona,
      budgetTier,
      customBudgetWon,
      budgetScope,
      selectedDishes: collectedDishes,
      customDishText: customDishInput.trim(),
      bodyPref: 'any' as const,
      sweetnessPref: 'any' as const,
      occasion: 'date' as const,
      menuMode: isCourseFlow ? ('course' as const) : ('alacarte' as const),
      courseServeFormat,
      courseBottleCount,
      coursePairingMode,
      customSlots,
      includeExtraGlass,
      corkageWine: effectiveCorkage,
      excludedWineIds: overrideExcluded ?? swappedExcludedIds,
      tasteProfile: overrideProfile ?? tasteProfile,
    };
  };

  const runRecommendation = async (
    overrideProfile?: UserTasteProfile,
    overridePersonaId?: string,
    keepStep = false
  ) => {
    const pId = overridePersonaId ?? selectedPersonaId;
    const persona = personas.find((p) => p.id === pId) ?? personas[0];

    let bundle: PairingRecommendationBundle;
    if (
      wineSourceMode === 'corkage_direct' &&
      corkageWine &&
      corkageWine.name.trim().length > 0
    ) {
      const enriched = await enrichCorkageBottle(corkageWine);
      setCorkageWine(enriched);
      bundle = generateCorkageOnlyRecommendation({
        venue: activeVenue,
        persona,
        corkage: enriched,
        tasteProfile: overrideProfile ?? tasteProfile,
      });
    } else {
      bundle = generatePairingRecommendation(
        buildPairingQuery(overridePersonaId, overrideProfile, [])
      );
    }
    setSwappedExcludedIds([]);

    const recIds =
      bundle.kind === 'course_sequence'
        ? bundle.courseSequence?.map((s) => s.wine.id) ?? []
        : bundle.singleItems?.map((i) => i.wine.id) ?? [];
    setStats(
      recordRecommendationStats(
        recIds,
        overridePersonaId ?? selectedPersonaId
      )
    );
    setRecommendationBundle(bundle);
    if (!keepStep) {
      setGuestStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const runInstantCorkage = async (bottle: CorkageBottle) => {
    const pId = activeVenue.defaultPersonaId || selectedPersonaId;
    const persona = personas.find((p) => p.id === pId) ?? personas[0];
    setWineSourceMode('corkage_direct');
    setCorkageOnly(true);
    const enriched = await enrichCorkageBottle(bottle);
    setCorkageWine(enriched);
    const bundle = generateCorkageOnlyRecommendation({
      venue: activeVenue,
      persona,
      corkage: enriched,
      tasteProfile,
    });
    setSwappedExcludedIds([]);
    setStats(recordRecommendationStats([], pId));
    setRecommendationBundle(bundle);
    setGuestStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwapWinesInStep2 = (
    activeScenarioIdx: number,
    wineIdsToSwap: string[]
  ) => {
    if (!recommendationBundle || wineIdsToSwap.length === 0) return;
    const nextBundle = swapSpecificWinesInBundle(
      recommendationBundle,
      activeScenarioIdx,
      wineIdsToSwap,
      swappedExcludedIds,
      buildPairingQuery()
    );
    setSwappedExcludedIds((prev) => Array.from(new Set([...prev, ...wineIdsToSwap])));
    setRecommendationBundle(nextBundle);
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
    recordOrderIntentStats(selectedPersonaId);
    setStats(recordFeedbackStats('like', [], selectedPersonaId));
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
    setStats(recordFeedbackStats('dislike', reasons, selectedPersonaId));
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

  const handleSelectDefaultPersona = (venueId: string, personaId: string) => {
    setVenues((prev) => {
      const next = prev.map((v) =>
        v.id === venueId ? { ...v, defaultPersonaId: personaId } : v
      );
      saveVenues(next);
      return next;
    });
    if (venueId === activeVenue.id) {
      setSelectedPersonaId(personaId);
    }
  };

  const handleSaveCustomPersona = (persona: SommelierPersona) => {
    setPersonas((prev) => {
      const exists = prev.some((p) => p.id === persona.id);
      const next = exists
        ? prev.map((p) => (p.id === persona.id ? persona : p))
        : [...prev, persona];
      saveCustomPersonas(next.filter((p) => p.isCustom));
      return next;
    });
    handleSelectDefaultPersona(activeVenue.id, persona.id);
  };

  const handleDeleteCustomPersona = (personaId: string) => {
    setPersonas((prev) => {
      const next = prev.filter((p) => p.id !== personaId);
      saveCustomPersonas(next.filter((p) => p.isCustom));
      if (activeVenue.defaultPersonaId === personaId && next.length > 0) {
        handleSelectDefaultPersona(activeVenue.id, next[0].id);
      }
      return next;
    });
  };

  const handleTogglePreVisitVenueList = (venueId: string, allow: boolean) => {
    setVenues((prev) => {
      const next = prev.map((v) =>
        v.id === venueId ? { ...v, allowPreVisitVenueList: allow } : v
      );
      saveVenues(next);
      return next;
    });
    if (!allow && visitTiming === 'pre_visit' && wineSourceMode === 'venue_cellar') {
      setWineSourceMode('my_cellar');
    }
  };

  const handleVisitTimingChange = (nextTiming: VisitTiming) => {
    setVisitTiming(nextTiming);
    if (nextTiming === 'pre_visit') {
      if (wineSourceMode === 'corkage_direct') {
        setWineSourceMode(
          activeVenue.allowPreVisitVenueList === false ? 'my_cellar' : 'venue_cellar'
        );
      } else if (
        wineSourceMode === 'venue_cellar' &&
        activeVenue.allowPreVisitVenueList === false
      ) {
        setWineSourceMode('my_cellar');
      }
      setCorkageOnly(false);
    } else {
      if (wineSourceMode === 'my_cellar' || wineSourceMode === 'wine_shop') {
        setWineSourceMode('venue_cellar');
        setCorkageOnly(false);
      }
    }
  };

  const handleWineSourceModeChange = (nextMode: WineSourceMode) => {
    setWineSourceMode(nextMode);
    setCorkageOnly(nextMode === 'corkage_direct');
    if (nextMode === 'my_cellar' || nextMode === 'wine_shop') {
      setCourseServeFormat('bottle');
      setIncludeExtraGlass(false);
    }
    if (nextMode === 'corkage_direct' && !corkageWine) {
      setCorkageWine({
        name: '',
        category: 'red',
        body: 3,
        slotPosition: 'late',
      });
    }
  };

  const handleAddPersonalWine = async (input: {
    name: string;
    category: WineCategory;
    vintage: number;
    price: number;
  }) => {
    const enriched = await enrichCorkageBottle({
      name: input.name,
      category: input.category,
      vintage: input.vintage,
      body: input.category === 'sparkling' ? 2 : input.category === 'red' ? 4 : 3,
      slotPosition: 'late',
    });
    const newWine: WineItem = {
      id: `mycellar_${Date.now()}`,
      venueId: 'my_cellar',
      nameKo: enriched.name || input.name,
      nameEn: enriched.nameEn || enriched.name || input.name,
      producer: enriched.producer || 'Personal Cellar',
      vintage: enriched.vintage || input.vintage || new Date().getFullYear() - 3,
      category: enriched.category,
      varietalsKo: enriched.varietalsKo || '소장 와인',
      varietalsEn: enriched.varietalsEn || 'Cellar Bottle',
      regionKo: enriched.regionKo || '개인 셀러',
      regionEn: enriched.regionEn || 'Private Cellar',
      countryCode: enriched.countryCode || 'FR',
      venuePrice: input.price > 0 ? input.price : 120000,
      marketPrice: input.price > 0 ? input.price : 120000,
      stock: 1,
      structure: enriched.structure ?? {
        body: enriched.body,
        acidity: 3,
        tannin: enriched.category === 'red' ? 3 : 1,
        sweetness: enriched.category === 'dessert' ? 4 : 1,
        alcohol: 3,
      },
      aromas: enriched.aromas ?? {
        primary: ['cherry', 'citrus'],
        secondary: ['oak_cedar'],
        tertiary: ['leather_earth'],
      },
      serving: {
        glassType:
          enriched.category === 'sparkling'
            ? 'flute'
            : enriched.category === 'white'
              ? 'white'
              : 'bordeaux',
        tempMin: enriched.category === 'red' ? 16 : 9,
        tempMax: enriched.category === 'red' ? 18 : 11,
        decantMinutes: enriched.category === 'red' ? 30 : 0,
        drinkWindowStart: 2020,
        drinkWindowEnd: 2035,
        statusKo: '시음 적기',
        statusEn: 'Ready to Drink',
      },
      storytelling: {
        terroirKo: enriched.earthSoilKo || '개인 셀러 소장 빈티지',
        terroirEn: enriched.earthSoilEn || 'Private cellar selection',
        vinificationKo: enriched.humanPhilosophyKo || '셀러 보관 숙성',
        vinificationEn: enriched.humanPhilosophyEn || 'Cellar aged',
        heavenClimateKo:
          enriched.heavenClimateKo || '해당 빈티지의 자연스러운 기후 결을 간직한 와인입니다.',
        heavenClimateEn:
          enriched.heavenClimateEn || 'Expresses the natural vintage character.',
        earthSoilKo:
          enriched.earthSoilKo || '산지 고유의 토양과 미네랄이 조화를 이룹니다.',
        earthSoilEn:
          enriched.earthSoilEn || 'Balanced terroir expression and mineral finish.',
        humanPhilosophyKo:
          enriched.humanPhilosophyKo || '소장하신 와인의 가치를 오늘 식탁의 요리와 연결해 드립니다.',
        humanPhilosophyEn:
          enriched.humanPhilosophyEn || 'Curated from your home cellar for tonight’s menu.',
        wineryLocation: enriched.wineryLocation ?? {
          lat: 47.0247,
          lng: 4.8386,
          placeLabelKo: enriched.regionKo || '프랑스 주요 산지',
          placeLabelEn: enriched.regionEn || 'Classic Wine Region',
          earthQuery: enriched.name || input.name,
        },
      },
      pairingAffinities:
        enriched.category === 'sparkling'
          ? ['seafood', 'cream', 'delicate']
          : enriched.category === 'white'
            ? ['seafood', 'cream', 'truffle']
            : enriched.category === 'red'
              ? ['steak', 'poultry', 'umami']
              : ['dessert', 'cheese', 'sweet'],
    };
    setPersonalCellar((prev) => {
      const next = [newWine, ...prev];
      savePersonalCellar(next);
      return next;
    });
  };

  const handleRemovePersonalWine = (id: string) => {
    setPersonalCellar((prev) => {
      const next = prev.filter((w) => w.id !== id);
      savePersonalCellar(next);
      return next;
    });
  };

  const handleCreateReservation = (input: {
    guestName: string;
    guestContact: string;
    visitDate: string;
    note?: string;
    selectedWines: WineItem[];
  }) => {
    const newRes: WineReservation = {
      id: `res_${Date.now()}`,
      venueId: activeVenue.id,
      venueNameKo: activeVenue.nameKo,
      venueNameEn: activeVenue.nameEn,
      guestName: input.guestName,
      guestContact: input.guestContact,
      visitDate: input.visitDate,
      wineIds: input.selectedWines.map((w) => w.id),
      wineNamesKo: input.selectedWines.map((w) => `${w.nameKo} (${w.vintage})`),
      wineNamesEn: input.selectedWines.map((w) => `${w.nameEn} (${w.vintage})`),
      totalPrice: input.selectedWines.reduce((sum, w) => sum + w.venuePrice, 0),
      note: input.note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReservations(addReservation(newRes));
  };

  const handleUpdateReservationStatus = (
    id: string,
    status: WineReservation['status']
  ) => {
    setReservations(updateReservationStatus(id, status));
  };

  return (
    <div className="min-h-dvh">
      <HeaderBar
        lang={lang}
        onLangChange={setLang}
        theme={theme}
        onThemeChange={setTheme}
        appMode={appMode}
        onAppModeChange={(m) => {
          setAppMode(m);
          if (m !== 'guest') setCatalogOpen(false);
        }}
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
        catalogOpen={catalogOpen}
        onToggleCatalog={() => setCatalogOpen((prev) => !prev)}
      />

      {/* Tablet-First Side Edge Page Navigation Arrows */}
      {appMode === 'guest' && !catalogOpen && (
        <>
          {(guestStep > 1 || (guestStep === 1 && step1Page > 1)) && (
            <button
              type="button"
              onClick={() => {
                if (guestStep === 1) {
                  setStep1Page((prev) => Math.max(1, prev - 1) as Step1Page);
                } else {
                  setGuestStep((prev) => (prev === 3 ? 2 : 1));
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label={lang === 'ko' ? '이전 페이지' : 'Previous step'}
              className="no-print somm-card fixed left-2.5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-primary)] shadow-md transition-transform hover:scale-105 active:scale-95 sm:left-4 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
          )}
          {((guestStep === 1 && (step1Page < 6 || Boolean(recommendationBundle))) ||
            (guestStep === 2 && Boolean(activeDrinkingWine))) && (
            <button
              type="button"
              onClick={() => {
                if (guestStep === 1) {
                  if (step1Page < 6) {
                    setStep1Page((prev) => Math.min(6, prev + 1) as Step1Page);
                  } else if (recommendationBundle) {
                    setGuestStep(2);
                  }
                } else {
                  setGuestStep(3);
                }
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
        {menuUploadError && (
          <div className="mb-4 rounded-2xl border border-[#E07A5F]/40 bg-[#FFF5F2] px-4 py-3 text-[13px] font-medium text-[#9B2C2C] dark:border-[#E07A5F]/35 dark:bg-[#2A1618] dark:text-[#FCA5A5]">
            {menuUploadError}
          </div>
        )}
        {appMode === 'guest' && catalogOpen && (
          <WineCatalogView
            lang={lang}
            venue={activeVenue}
            inStockWines={availableVenueWines}
            onClose={() => setCatalogOpen(false)}
          />
        )}
        {appMode === 'guest' && !catalogOpen && guestStep === 1 && (
          <GuestStep1
            lang={lang}
            venue={activeVenue}
            personas={personas}
            selectedPersonaId={selectedPersonaId}
            onInspectPersona={setInspectedPersona}
            step1Page={step1Page}
            onStep1PageChange={setStep1Page}
            budgetTier={budgetTier}
            onBudgetTierChange={setBudgetTier}
            customBudgetManWon={customBudgetManWon}
            onCustomBudgetManWonChange={setCustomBudgetManWon}
            budgetScope={budgetScope}
            onBudgetScopeChange={setBudgetScope}
            corkageOnly={corkageOnly}
            visitTiming={visitTiming}
            onVisitTimingChange={handleVisitTimingChange}
            wineSourceMode={wineSourceMode}
            onWineSourceModeChange={handleWineSourceModeChange}
            personalCellar={personalCellar}
            onAddPersonalWine={handleAddPersonalWine}
            onRemovePersonalWine={handleRemovePersonalWine}
            wineShops={wineShops}
            selectedWineShopId={selectedWineShopId}
            onSelectWineShopId={setSelectedWineShopId}
            corkageWine={corkageWine}
            onCorkageWineChange={setCorkageWine}
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
            onInstantCorkageSubmit={runInstantCorkage}
            onOpenCatalog={() => {
              setCatalogOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {appMode === 'guest' && !catalogOpen && guestStep === 2 && recommendationBundle && (
          <GuestStep2
            lang={lang}
            venue={activeVenue}
            allWines={wines}
            visitTiming={visitTiming}
            bundle={recommendationBundle}
            speechStyle={speechStyle}
            onSpeechStyleChange={setSpeechStyle}
            onBack={() => {
              setGuestStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLikeWine={handleLikeWine}
            onDislikeWine={handleDislikeWine}
            onReRecommend={() => {
              const latest = loadTasteProfile();
              setTasteProfile(latest);
              runRecommendation(latest);
            }}
            onSwapWines={handleSwapWinesInStep2}
            onCreateReservation={handleCreateReservation}
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
            personas={personas}
            stats={stats}
            venueJournalEntries={journalEntries.filter(
              (e) => e.venueId === activeVenue.id
            )}
            isUnlocked={adminUnlocked}
            onUnlock={() => setAdminUnlocked(true)}
            onUpdateStock={handleUpdateStock}
            onAddWine={handleAddWine}
            onTogglePriceTransparency={handleTogglePriceTransparency}
            onTogglePreVisitVenueList={handleTogglePreVisitVenueList}
            reservations={reservations.filter((r) => r.venueId === activeVenue.id)}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onUpdateRecommendationLimit={handleUpdateRecommendationLimit}
            onSelectDefaultPersona={handleSelectDefaultPersona}
            onSaveCustomPersona={handleSaveCustomPersona}
            onDeleteCustomPersona={handleDeleteCustomPersona}
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

      {/* Minimalist Footer: Brand Tagline + Subtle Admin Entry */}
      <footer className="no-print mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] px-4 py-5 text-[11px] text-[var(--text-secondary)] sm:px-6">
        <span>
          {lang === 'ko'
            ? '소믈리에온 SOMMON · 모두의 테이블이 전담 소믈리에의 안목을 누립니다'
            : 'SOMMON · Every table deserves a dedicated sommelier'}
        </span>
        <button
          type="button"
          onClick={() => {
            setAppMode(appMode === 'guest' ? 'admin' : 'guest');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-medium text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline"
        >
          {appMode === 'guest'
            ? lang === 'ko'
              ? '업장 관리'
              : 'Venue Admin'
            : lang === 'ko'
              ? '손님 화면'
              : 'Guest View'}
        </button>
      </footer>

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
