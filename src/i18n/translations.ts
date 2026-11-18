import type {
  AromaKey,
  BodyPref,
  BudgetTier,
  DislikeReasonTag,
  GlassType,
  Language,
  OccasionType,
  SweetnessPref,
  WineCategory,
} from '../types/sommelier';

export interface Translations {
  brandName: string;
  brandShort: string;
  tagline: string;
  modeGuest: string;
  modeAdmin: string;
  themeIvory: string;
  themeDark: string;
  tableLabel: string;
  availableWinesPrefix: string;
  availableWinesUnit: string;
  venueSelectorLabel: string;

  // Step 1
  step1Title: string;
  step1Subtitle: string;
  sommelierSectionTitle: string;
  sommelierSectionDesc: string;
  viewProfile: string;
  selectedLabel: string;
  budgetSectionTitle: string;
  budgetPerBottle: string;
  budgetTotal: string;
  dishesSectionTitle: string;
  dishesSectionDesc: string;
  dishesRegisteredLabel: string;
  dishInputPlaceholder: string;
  addDishBtn: string;
  selectedDishesLabel: string;
  ocrCardTitle: string;
  ocrCardDesc: string;
  ocrUploadBtn: string;
  ocrAnalyzing: string;
  ocrSampleAlacarte: string;
  ocrSampleCourse: string;
  ocrResetBtn: string;
  ocrBadgeAlacarte: string;
  ocrBadgeCourse: string;
  ocrAlacarteHint: string;
  ocrCourseHint: string;
  courseBottleCountLabel: string;
  course1Bottle: string;
  course2Bottles: string;
  course3Bottles: string;
  courseModeAutoTitle: string;
  courseModeAutoDesc: string;
  courseModeCustomTitle: string;
  courseModeCustomDesc: string;
  courseSlotPrefix: string;
  courseSlotSuffix: string;

  tasteSectionTitle: string;
  bodyLabel: string;
  sweetnessLabel: string;
  occasionLabel: string;
  tasteProfileActiveBanner: string;
  tasteProfileResetBtn: string;
  ctaRecommend: string;
  ctaRecommendDisabledHint: string;

  // Step 2
  step2BackBtn: string;
  step2TitleSingle: string;
  step2TitleCourse: string;
  step2TotalCoursePrice: string;
  step2StaffRespectNote: string;
  rankBest: string;
  rankOption: string;
  bottleSeqPrefix: string;
  bottleSeqSuffix: string;
  goodValueBadgePrefix: string;
  goodValueBadgeSuffix: string;
  marketPriceLabel: string;
  venuePriceLabel: string;
  structureTitle: string;
  structureBarView: string;
  structureRadarView: string;
  bodyAxis: string;
  acidityAxis: string;
  tanninAxis: string;
  sweetnessAxis: string;
  alcoholAxis: string;
  aromaTitle: string;
  aromaTier1: string;
  aromaTier2: string;
  aromaTier3: string;
  aromaExpandBtn: string;
  aromaCollapseBtn: string;
  servingTitle: string;
  glassLabel: string;
  tempLabel: string;
  decantLabel: string;
  decantNone: string;
  decantUnit: string;
  drinkWindowLabel: string;
  chooseWineCta: string;

  // Step 3 (In-Drinking & Feedback)
  step3BackBtn: string;
  step3HeaderBadge: string;
  step3StoryTitle: string;
  terroirTitle: string;
  vinificationTitle: string;
  feedbackTitle: string;
  feedbackSubtitle: string;
  likeBtn: string;
  dislikeBtn: string;
  likeSuccessTitle: string;
  likeSuccessDesc: string;
  nextWineRecommendationsTitle: string;
  dislikePromptTitle: string;
  dislikeSubmitBtn: string;
  dislikeSavedTitle: string;
  dislikeSavedDesc: string;
  reRecommendWithProfileBtn: string;

  // Admin Mode
  adminPinTitle: string;
  adminPinDesc: string;
  adminPinPlaceholder: string;
  adminPinUnlockBtn: string;
  adminPinHint: string;
  adminPinError: string;
  adminTotalWines: string;
  adminAvailableWines: string;
  adminSoldOutWines: string;
  adminPriceOptInLabel: string;
  adminPriceOptInDesc: string;
  adminPrintListBtn: string;
  adminQrPreviewBtn: string;
  adminAiKeyBtn: string;
  adminOnboardTitle: string;
  adminOnboardDesc: string;
  adminLabelUploadBtn: string;
  adminLabelSampleBtn: string;
  adminLabelAnalyzing: string;
  adminLabelName: string;
  adminLabelCategory: string;
  adminLabelVarietal: string;
  adminLabelRegion: string;
  adminLabelMarketPrice: string;
  adminLabelVenuePrice: string;
  adminLabelStock: string;
  adminAddWineBtn: string;
  adminInventoryTitle: string;
  adminSoldOutBadge: string;
  adminInStockBadge: string;
  adminTableQrTitle: string;
  adminTableQrDesc: string;
  adminOpenGuestTableBtn: string;
  adminAiModalTitle: string;
  adminAiModalDesc: string;
  adminAiKeyLabel: string;
  adminAiSaveBtn: string;
  adminAiClearBtn: string;
  adminAiStatusLive: string;
  adminAiStatusSim: string;

  // Helpers / Modals
  closeBtn: string;
  personaExpUnit: string;
  personaPreferredRegions: string;
  personaPhilosophyLabel: string;
  personaRuleLabel: string;
  selectThisSommelierBtn: string;
  currencyUnit: string;
  stockUnit: string;
  noStockTitle: string;
  noStockDesc: string;
  stockFallbackNotice: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ko: {
    brandName: '소믈리에온',
    brandShort: 'SommOn',
    tagline: '지금 이 테이블의 셀러에서 가장 완벽한 한 병을 깨웁니다',
    modeGuest: '손님 화면',
    modeAdmin: '업장 관리',
    themeIvory: '아이보리',
    themeDark: '다이닝 다크',
    tableLabel: '테이블',
    availableWinesPrefix: '추천 가능 와인',
    availableWinesUnit: '종',
    venueSelectorLabel: '업장 전환',

    step1Title: '오늘의 페어링 설계',
    step1Subtitle: '함께하실 요리와 예산, 그리고 선호하시는 소믈리에의 시선을 선택해 주세요.',
    sommelierSectionTitle: '오늘의 소믈리에 선택',
    sommelierSectionDesc: '페르소나마다 산지 해석과 페어링 기준, 설명의 어조가 달라집니다.',
    viewProfile: '프로필 보기',
    selectedLabel: '선택됨',
    budgetSectionTitle: '예산 범위',
    budgetPerBottle: '1병 기준',
    budgetTotal: '전체 합산 기준',
    dishesSectionTitle: '함께 드실 요리',
    dishesSectionDesc: '업장 대표 메뉴를 고르거나 직접 입력하고, 종이 메뉴판 사진으로 단품·코스를 한 번에 분석할 수 있습니다.',
    dishesRegisteredLabel: '업장 주요 메뉴',
    dishInputPlaceholder: '예: 트러플 크림 리조또, 전복 구이',
    addDishBtn: '요리 추가',
    selectedDishesLabel: '선택된 요리',
    ocrCardTitle: '스마트 메뉴판 사진 분석 (OCR)',
    ocrCardDesc: '메뉴판 사진을 올리면 Vision AI가 단품 목록인지 코스 흐름인지 자동으로 판별해 페어링 구조를 설계합니다.',
    ocrUploadBtn: '메뉴판 사진 올리기',
    ocrAnalyzing: '메뉴판 구성을 정밀 분석하는 중입니다...',
    ocrSampleAlacarte: '샘플: 아브르(HAVRE) 단품',
    ocrSampleCourse: '샘플: 프레르(FRÈRE) 코스',
    ocrResetBtn: '초기화',
    ocrBadgeAlacarte: '단품(À la carte) 메뉴 인식됨',
    ocrBadgeCourse: '코스(Course) 메뉴 인식됨',
    ocrAlacarteHint: '주문하실 요리를 여러 개 체크하시면 풍미의 공통분모를 계산해 추천합니다.',
    ocrCourseHint: '전채부터 메인까지 코스 흐름에 맞춰 1~3병 페어링 구성을 선택해 주세요.',
    courseBottleCountLabel: '코스 와인 병 수 선택',
    course1Bottle: '1병 (전체 관통)',
    course2Bottles: '2병 구성',
    course3Bottles: '3병 구성',
    courseModeAutoTitle: 'AI 소믈리에 알아서 추천',
    courseModeAutoDesc: '코스 강도 곡선에 맞춰 가장 이상적인 주종 시퀀스를 자동 설계합니다.',
    courseModeCustomTitle: '원하는 조합 직접 선택',
    courseModeCustomDesc: '화화화, 샴화레 등 원하시는 주종 슬롯을 직접 지정해 조합합니다.',
    courseSlotPrefix: '병',
    courseSlotSuffix: '주종 선택',

    tasteSectionTitle: '취향 및 자리 성격',
    bodyLabel: '입안에서 느껴지는 무게감',
    sweetnessLabel: '단맛 선호도',
    occasionLabel: '오늘 자리의 성격',
    tasteProfileActiveBanner: '누적된 취향노트가 반영되어 선호 아로마와 기피 요소를 자동 조정합니다.',
    tasteProfileResetBtn: '취향노트 초기화',
    ctaRecommend: '소믈리에 추천받기',
    ctaRecommendDisabledHint: '요리를 최소 1가지 이상 선택하거나 입력해 주세요.',

    step2BackBtn: '조건 다시 설정',
    step2TitleSingle: '오늘 테이블에 올릴 최적의 추천',
    step2TitleCourse: '코스 흐름을 완성하는 다병 페어링 시퀀스',
    step2TotalCoursePrice: '코스 구성 총합',
    step2StaffRespectNote: '본 추천은 데이터 기반 가이드이며, 현장 서버·셰프의 실시간 컨디션 조언과 함께하실 때 가장 정확합니다.',
    rankBest: '1순위 추천',
    rankOption: '대안 추천',
    bottleSeqPrefix: '제',
    bottleSeqSuffix: '병',
    goodValueBadgePrefix: '착한 가격 · 시중가의',
    goodValueBadgeSuffix: '배',
    marketPriceLabel: '국내 시중가 참고',
    venuePriceLabel: '업장 리스팅가',
    structureTitle: '5대 구조 밸런스',
    structureBarView: '게이지',
    structureRadarView: '레이더',
    bodyAxis: '바디감',
    acidityAxis: '산도',
    tanninAxis: '타닌',
    sweetnessAxis: '당도',
    alcoholAxis: '알코올',
    aromaTitle: '테이스팅 아로마 스펙트럼',
    aromaTier1: '1차 향 (과실·꽃)',
    aromaTier2: '2차 향 (양조·오크)',
    aromaTier3: '3차 향 (숙성·테루아)',
    aromaExpandBtn: '1·2·3차 향 펼치기',
    aromaCollapseBtn: '핵심 향만 보기',
    servingTitle: '소믈리에 서빙 가이드',
    glassLabel: '권장 글라스',
    tempLabel: '적정 음용 온도',
    decantLabel: '브리딩·디캔팅',
    decantNone: '오픈 직후 바로 시음',
    decantUnit: '분 이상 권장',
    drinkWindowLabel: '시음 적기',
    chooseWineCta: '이 와인 마시면서 가이드 보기',

    step3BackBtn: '추천 목록으로 돌아가기',
    step3HeaderBadge: '시음 중 인터랙티브 가이드',
    step3StoryTitle: '이 병에 담긴 테루아와 양조 이야기',
    terroirTitle: '어디서 자랐는가 · 산지와 기후',
    vinificationTitle: '어떻게 빚었는가 · 양조와 숙성',
    feedbackTitle: '지금 드시는 와인, 어떠신가요?',
    feedbackSubtitle: '남겨주신 감각은 손님 취향노트에 저장되어 다음 추천을 한층 정교하게 만듭니다.',
    likeBtn: '마음에 들어요',
    dislikeBtn: '조금 아쉬워요',
    likeSuccessTitle: '취향노트에 긍정 DNA가 기록되었습니다',
    likeSuccessDesc: '이 와인의 산도·바디감 결이 다음 추천 시 우선 가중치로 반영됩니다.',
    nextWineRecommendationsTitle: '이 와인이 마음에 드셨다면, 다음에는 이런 와인도 추천해요',
    dislikePromptTitle: '어떤 점이 조금 부담스러우셨나요? (복수 선택 가능)',
    dislikeSubmitBtn: '취향노트에 반영하기',
    dislikeSavedTitle: '아쉬웠던 요소가 취향노트에 반영되었습니다',
    dislikeSavedDesc: '체크하신 감각 요소는 이후 모든 업장 추천에서 자동으로 걸러지거나 완화됩니다.',
    reRecommendWithProfileBtn: '새 취향 반영해 다시 추천받기',

    adminPinTitle: '업장 관리자 인증',
    adminPinDesc: '재고 수량 및 리스팅 가격 보호를 위해 관리자 PIN을 입력해 주세요.',
    adminPinPlaceholder: 'PIN 4자리 입력',
    adminPinUnlockBtn: '관리자 모드 열기',
    adminPinHint: '파일럿 기본 PIN: 1234',
    adminPinError: 'PIN 번호가 일치하지 않습니다. (기본값 1234)',
    adminTotalWines: '등록 와인 수',
    adminAvailableWines: '추천 가능 (재고 보유)',
    adminSoldOutWines: '품절 (자동 제외)',
    adminPriceOptInLabel: '가격 투명성(착한 가격 뱃지) 노출',
    adminPriceOptInDesc: '시중가 대비 합리적 리스팅일 때 손님 화면에 Muted Gold 뱃지를 표시합니다.',
    adminPrintListBtn: '인쇄용 주류 리스트',
    adminQrPreviewBtn: '테이블 QR 링크',
    adminAiKeyBtn: 'AI 엔진 설정',
    adminOnboardTitle: '와인 입고 및 AI 라벨 스캔 등록',
    adminOnboardDesc: '라벨 사진을 올리면 Vision AI가 품종·산지·시중가·테이스팅 구조를 자동 입력합니다.',
    adminLabelUploadBtn: '와인 라벨 사진 올리기',
    adminLabelSampleBtn: '샘플 라벨 스캔 체험',
    adminLabelAnalyzing: '와인 라벨의 빈티지와 산지를 판독하는 중...',
    adminLabelName: '와인명 (국문)',
    adminLabelCategory: '주종',
    adminLabelVarietal: '품종',
    adminLabelRegion: '산지',
    adminLabelMarketPrice: '참고 시중가 (원)',
    adminLabelVenuePrice: '업장 판매가 (원)',
    adminLabelStock: '초기 재고 (병)',
    adminAddWineBtn: '셀러 재고에 즉시 입고',
    adminInventoryTitle: '실시간 셀러 재고 관리',
    adminSoldOutBadge: '품절',
    adminInStockBadge: '보유',
    adminTableQrTitle: '테이블 QR 진입 URL 시뮬레이터',
    adminTableQrDesc: '아래 링크로 접속하면 해당 업장 재고만 연동된 테이블 전용 추천 화면이 열립니다.',
    adminOpenGuestTableBtn: '해당 테이블 손님 화면 열기',
    adminAiModalTitle: 'Vision AI · LLM 엔진 연동 설정',
    adminAiModalDesc: 'Gemini API Key를 입력하면 업로드한 실제 메뉴판·와인 라벨 사진에 실시간 Vision 분석이 적용됩니다. 키가 없어도 내장 파일럿 엔진으로 모든 기능을 테스트할 수 있습니다.',
    adminAiKeyLabel: 'Gemini API Key (선택 사항)',
    adminAiSaveBtn: '설정 저장',
    adminAiClearBtn: '기본 엔진으로 복귀',
    adminAiStatusLive: '실시간 Vision API 연결됨',
    adminAiStatusSim: '내장 파일럿 엔진 활성',

    closeBtn: '닫기',
    personaExpUnit: '년 경력',
    personaPreferredRegions: '주력 산지 및 페어링 키워드',
    personaPhilosophyLabel: '페어링 철학',
    personaRuleLabel: '시그니처 추천 원칙',
    selectThisSommelierBtn: '이 소믈리에로 선택하기',
    currencyUnit: '원',
    stockUnit: '병',
    noStockTitle: '현재 업장 내 보유 재고가 충분하지 않습니다',
    noStockDesc: '업장 관리 화면에서 재고를 보충하거나 예산·주종 조건을 넓혀 다시 확인해 주세요.',
    stockFallbackNotice: '선택하신 주종 슬롯 중 현재 셀러 재고가 소진된 항목이 있어, 코스 흐름이 이어지는 인접 주종으로 매끄럽게 보완했습니다.',
  },
  en: {
    brandName: 'Sommelier On',
    brandShort: 'SommOn',
    tagline: 'Awakening the right bottle from this table’s cellar',
    modeGuest: 'Guest View',
    modeAdmin: 'Venue Admin',
    themeIvory: 'Warm Ivory',
    themeDark: 'Dining Dark',
    tableLabel: 'Table',
    availableWinesPrefix: 'Available Wines',
    availableWinesUnit: 'labels',
    venueSelectorLabel: 'Switch Venue',

    step1Title: 'Compose Tonight’s Pairing',
    step1Subtitle: 'Choose your sommelier persona, budget range, and the dishes arriving at your table.',
    sommelierSectionTitle: 'Select Today’s Sommelier',
    sommelierSectionDesc: 'Each verified sommelier brings a distinct regional lens, pairing rule, and voice.',
    viewProfile: 'View Profile',
    selectedLabel: 'Selected',
    budgetSectionTitle: 'Budget Range',
    budgetPerBottle: 'Per Bottle',
    budgetTotal: 'Total Budget',
    dishesSectionTitle: 'Dishes at Your Table',
    dishesSectionDesc: 'Pick house signature dishes, type your own, or scan a printed menu to detect à la carte vs. course pairing.',
    dishesRegisteredLabel: 'House Signature Dishes',
    dishInputPlaceholder: 'e.g., Truffle Risotto, Grilled Abalone',
    addDishBtn: 'Add Dish',
    selectedDishesLabel: 'Selected Dishes',
    ocrCardTitle: 'Smart Menu Photo Analysis (OCR)',
    ocrCardDesc: 'Upload a menu photo and Vision AI detects À la carte checklists or multi-stage Course progressions automatically.',
    ocrUploadBtn: 'Upload Menu Photo',
    ocrAnalyzing: 'Reading menu structure and flavor intensity...',
    ocrSampleAlacarte: 'Sample: HAVRE À la Carte',
    ocrSampleCourse: 'Sample: FRÈRE Course',
    ocrResetBtn: 'Clear Scan',
    ocrBadgeAlacarte: 'À la Carte Menu Detected',
    ocrBadgeCourse: 'Course Progression Detected',
    ocrAlacarteHint: 'Check multiple dishes you plan to share; we balance their shared flavor bridge.',
    ocrCourseHint: 'Choose 1 to 3 bottles across the tasting arc from starter to finale.',
    courseBottleCountLabel: 'Number of Bottles for Course',
    course1Bottle: '1 Bottle (Full Arc)',
    course2Bottles: '2-Bottle Flow',
    course3Bottles: '3-Bottle Flow',
    courseModeAutoTitle: 'AI Sommelier Curated Sequence',
    courseModeAutoDesc: 'Designs the ideal progression of styles matched to the rising flavor intensity.',
    courseModeCustomTitle: 'Custom Bottle Sequence',
    courseModeCustomDesc: 'Lock each bottle slot yourself (e.g., W-W-W, Ch-Ch-Ch, Ch-W-R, W-R-R).',
    courseSlotPrefix: 'Bottle',
    courseSlotSuffix: 'Style',

    tasteSectionTitle: 'Palate & Occasion',
    bodyLabel: 'Preferred Weight on Palate',
    sweetnessLabel: 'Sweetness Preference',
    occasionLabel: 'Tonight’s Occasion',
    tasteProfileActiveBanner: 'Your cumulative Taste Note is active — preferred aromas and sensitivities are weighted.',
    tasteProfileResetBtn: 'Reset Taste Note',
    ctaRecommend: 'Get Sommelier Pairing',
    ctaRecommendDisabledHint: 'Please select or enter at least one dish to tailor the pairing.',

    step2BackBtn: 'Adjust Preferences',
    step2TitleSingle: 'Curated Selections From This Cellar',
    step2TitleCourse: 'Multi-Bottle Course Pairing Sequence',
    step2TotalCoursePrice: 'Course Sequence Total',
    step2StaffRespectNote: 'Data-assisted sommelier guidance — feel free to confirm bottle condition or pouring pace with your dining host.',
    rankBest: 'Top Match',
    rankOption: 'Alternative',
    bottleSeqPrefix: 'Bottle',
    bottleSeqSuffix: '',
    goodValueBadgePrefix: 'Fair Listing ·',
    goodValueBadgeSuffix: 'x Retail',
    marketPriceLabel: 'Reference Retail',
    venuePriceLabel: 'Cellar List Price',
    structureTitle: '5-Axis Structural Balance',
    structureBarView: 'Gauge',
    structureRadarView: 'Radar',
    bodyAxis: 'Body',
    acidityAxis: 'Acidity',
    tanninAxis: 'Tannin',
    sweetnessAxis: 'Sweetness',
    alcoholAxis: 'Alcohol',
    aromaTitle: 'Aroma Spectrum',
    aromaTier1: 'Primary (Fruit & Floral)',
    aromaTier2: 'Secondary (Fermentation & Oak)',
    aromaTier3: 'Tertiary (Aging & Terroir)',
    aromaExpandBtn: 'Expand 1st · 2nd · 3rd Tiers',
    aromaCollapseBtn: 'Show Core Aromas',
    servingTitle: 'Sommelier Service Guide',
    glassLabel: 'Stemware',
    tempLabel: 'Service Temp',
    decantLabel: 'Aeration',
    decantNone: 'Pour immediately',
    decantUnit: 'min+ decant',
    drinkWindowLabel: 'Drinking Window',
    chooseWineCta: 'Enjoy This Bottle & Open Guide',

    step3BackBtn: 'Back to Recommendations',
    step3HeaderBadge: 'In-Drinking Interactive Guide',
    step3StoryTitle: 'Terroir & Craft Inside the Glass',
    terroirTitle: 'Where It Grows · Region & Climate',
    vinificationTitle: 'How It Is Made · Winemaking & Aging',
    feedbackTitle: 'How is this bottle tasting tonight?',
    feedbackSubtitle: 'Your palate note persists across visits to refine every future recommendation.',
    likeBtn: 'Love This Style',
    dislikeBtn: 'Slightly Off for Me',
    likeSuccessTitle: 'Positive style DNA saved to your Taste Note',
    likeSuccessDesc: 'Similar freshness, texture, and aromatic families will be prioritized next time.',
    nextWineRecommendationsTitle: 'Since you enjoyed this, consider these next discoveries',
    dislikePromptTitle: 'What felt slightly uncomfortable? (Select all that apply)',
    dislikeSubmitBtn: 'Save to Taste Profile',
    dislikeSavedTitle: 'Your palate sensitivities are now calibrated',
    dislikeSavedDesc: 'Future pairings will filter or soften the characteristics you marked.',
    reRecommendWithProfileBtn: 'Refresh Recommendations With Updated Profile',

    adminPinTitle: 'Venue Manager Access',
    adminPinDesc: 'Enter the venue PIN to adjust cellar inventory and listing transparency.',
    adminPinPlaceholder: '4-digit PIN',
    adminPinUnlockBtn: 'Unlock Admin Console',
    adminPinHint: 'Pilot default PIN: 1234',
    adminPinError: 'Incorrect PIN. (Pilot default: 1234)',
    adminTotalWines: 'Total Cellar Labels',
    adminAvailableWines: 'Active In Stock',
    adminSoldOutWines: 'Sold Out (Excluded)',
    adminPriceOptInLabel: 'Price Transparency Opt-In',
    adminPriceOptInDesc: 'Show the Muted Gold fair-value badge when cellar markup is modest.',
    adminPrintListBtn: 'Printable Wine List',
    adminQrPreviewBtn: 'Table QR Links',
    adminAiKeyBtn: 'AI Engine Setup',
    adminOnboardTitle: 'Wine Intake & AI Label Scan',
    adminOnboardDesc: 'Upload a bottle label photo to auto-fill varietal, region, retail benchmark, and 5-axis structure.',
    adminLabelUploadBtn: 'Upload Bottle Label',
    adminLabelSampleBtn: 'Try Sample Label Scan',
    adminLabelAnalyzing: 'Reading vintage, appellation, and producer...',
    adminLabelName: 'Wine Name',
    adminLabelCategory: 'Style',
    adminLabelVarietal: 'Varietal',
    adminLabelRegion: 'Region',
    adminLabelMarketPrice: 'Reference Retail (KRW)',
    adminLabelVenuePrice: 'Venue List Price (KRW)',
    adminLabelStock: 'Initial Stock (btl)',
    adminAddWineBtn: 'Add to Live Cellar Pool',
    adminInventoryTitle: 'Real-Time Cellar Inventory',
    adminSoldOutBadge: 'Sold Out',
    adminInStockBadge: 'In Stock',
    adminTableQrTitle: 'Table QR Entry Simulator',
    adminTableQrDesc: 'Scanning a table URL scopes the guest recommendation engine strictly to this venue’s live stock.',
    adminOpenGuestTableBtn: 'Launch Guest View for Table',
    adminAiModalTitle: 'Vision AI & LLM Integration',
    adminAiModalDesc: 'Add a Gemini API key for live Vision analysis on uploaded menus and bottle labels. Without a key, the built-in pilot engine runs locally.',
    adminAiKeyLabel: 'Gemini API Key (Optional)',
    adminAiSaveBtn: 'Save Configuration',
    adminAiClearBtn: 'Use Built-In Pilot Engine',
    adminAiStatusLive: 'Live Vision API Connected',
    adminAiStatusSim: 'Built-In Pilot Engine Active',

    closeBtn: 'Close',
    personaExpUnit: 'yrs exp',
    personaPreferredRegions: 'Signature Regions & Pairing Focus',
    personaPhilosophyLabel: 'Pairing Philosophy',
    personaRuleLabel: 'Core Recommendation Rule',
    selectThisSommelierBtn: 'Select This Sommelier',
    currencyUnit: 'KRW',
    stockUnit: 'btl',
    noStockTitle: 'No matching in-stock bottles found for these filters',
    noStockDesc: 'Adjust budget or style filters, or replenish bottles in the Venue Admin console.',
    stockFallbackNotice: 'One requested slot style was sold out in this cellar, so we substituted the closest in-stock style to keep the course arc balanced.',
  },
};

export const CATEGORY_LABELS: Record<WineCategory, { ko: string; en: string; shortKo: string; shortEn: string }> = {
  sparkling: { ko: '샴페인 · 스파클링', en: 'Champagne & Sparkling', shortKo: '샴페인', shortEn: 'Sparkling' },
  white: { ko: '화이트 와인', en: 'White Wine', shortKo: '화이트', shortEn: 'White' },
  rose_orange: { ko: '로제 · 오렌지', en: 'Rosé & Orange', shortKo: '로제·오렌지', shortEn: 'Rosé/Orange' },
  red: { ko: '레드 와인', en: 'Red Wine', shortKo: '레드', shortEn: 'Red' },
  dessert: { ko: '디저트 · 스위트', en: 'Dessert & Sweet', shortKo: '디저트', shortEn: 'Dessert' },
};

export const BUDGET_LABELS: Record<BudgetTier, { ko: string; en: string }> = {
  under_50: { ko: '5만 원 이하', en: 'Under ₩50K' },
  '50_100': { ko: '5~10만 원', en: '₩50K–100K' },
  '100_150': { ko: '10~15만 원', en: '₩100K–150K' },
  over_150: { ko: '15만 원 이상', en: '₩150K+' },
};

export const BODY_LABELS: Record<BodyPref, { ko: string; en: string }> = {
  any: { ko: '상관없어요', en: 'Any Weight' },
  light: { ko: '가볍고 산뜻하게', en: 'Light & Crisp' },
  medium: { ko: '균형 잡힌 중간', en: 'Balanced Medium' },
  full: { ko: '풍부하고 묵직하게', en: 'Rich & Full' },
};

export const SWEETNESS_LABELS: Record<SweetnessPref, { ko: string; en: string }> = {
  any: { ko: '상관없어요', en: 'Any Sweetness' },
  dry: { ko: '달지 않게 (드라이)', en: 'Crisp Dry' },
  off_dry: { ko: '살짝 달콤하게', en: 'Hint of Sweetness' },
};

export const OCCASION_LABELS: Record<OccasionType, { ko: string; en: string }> = {
  date: { ko: '로맨틱 데이트', en: 'Date Night' },
  celebration: { ko: '축하 · 기념일', en: 'Celebration' },
  business: { ko: '접대 · 비즈니스', en: 'Business Dining' },
  casual: { ko: '편안한 모임', en: 'Casual Gathering' },
};

export const AROMA_LABELS: Record<AromaKey, { ko: string; en: string }> = {
  cherry: { ko: '붉은 체리', en: 'Red Cherry' },
  blackcurrant: { ko: '블랙커런트', en: 'Blackcurrant' },
  citrus: { ko: '레몬 · 유자 시트러스', en: 'Citrus Zest' },
  pear_apple: { ko: '서양배 · 청사과', en: 'Orchard Pear & Apple' },
  white_flower: { ko: '흰 꽃 · 아카시아', en: 'White Blossom' },
  oak_cedar: { ko: '오크 · 삼나무', en: 'Toasted Oak & Cedar' },
  pepper_spice: { ko: '흑후추 · 향신료', en: 'Cracked Pepper' },
  butter_brioche: { ko: '브리오슈 · 버터', en: 'Brioche & Cream' },
  mineral_stone: { ko: '젖은 돌 · 미네랄', en: 'Wet Stone & Flint' },
  honey: { ko: '아카시아 꿀 · 배꿀', en: 'Wildflower Honey' },
  leather_earth: { ko: '가죽 · 젖은 숲흙', en: 'Leather & Forest Floor' },
  herbal_mint: { ko: '허브 · 민트', en: 'Fresh Herb & Mint' },
};

export const GLASS_LABELS: Record<GlassType, { ko: string; en: string }> = {
  flute: { ko: '튤립형 샴페인 플루트', en: 'Tulip Champagne Flute' },
  white: { ko: '화이트 아로마 글라스', en: 'Standard White Glass' },
  burgundy: { ko: '와이드 볼 부르고뉴', en: 'Wide-Bowl Burgundy' },
  bordeaux: { ko: '톨 볼 보르도', en: 'Tall-Bowl Bordeaux' },
  dessert: { ko: '스몰 디저트 글라스', en: 'Small Dessert Glass' },
};

export const DISLIKE_REASON_LABELS: Record<DislikeReasonTag, { ko: string; en: string }> = {
  too_tannic: { ko: '너무 떫어요 (타닌 강함)', en: 'Too astringent (Firm tannin)' },
  too_sour: { ko: '너무 셔요 (산도 높음)', en: 'Too sharp (High acidity)' },
  too_sweet: { ko: '생각보다 달콤해요', en: 'Sweeter than expected' },
  too_heavy: { ko: '향이 너무 묵직해요', en: 'Feels overly heavy or oaky' },
  overshadowed: { ko: '음식 맛에 묻혀요', en: 'Overshadowed by the food' },
};

export function formatKrw(amount: number, lang: Language): string {
  const formatted = amount.toLocaleString('ko-KR');
  return lang === 'ko' ? `${formatted}\u00A0원` : `₩${formatted}`;
}
