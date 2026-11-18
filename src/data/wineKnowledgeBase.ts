import type {
  WineAromas,
  WineCategory,
  WineryLocation,
  WineStructure,
} from '../types/sommelier';

export type VintageRegionKey =
  | 'champagne'
  | 'burgundy'
  | 'bordeaux'
  | 'rhone'
  | 'loire_alsace'
  | 'piedmont'
  | 'tuscany'
  | 'napa'
  | 'other';

export interface AppellationProfile {
  key: string;
  aliases: string[];
  regionKo: string;
  regionEn: string;
  countryCode: string;
  vintageRegion: VintageRegionKey;
  defaultCategory: WineCategory;
  varietalsKo: string;
  varietalsEn: string;
  structure: WineStructure;
  aromas: WineAromas;
  earthSoilKo: string;
  earthSoilEn: string;
  wineryLocation: WineryLocation;
}

export interface ProducerProfile {
  key: string;
  aliases: string[];
  canonicalNameKo: string;
  canonicalNameEn: string;
  producer: string;
  appellationKey: string;
  category?: WineCategory;
  varietalsKo?: string;
  varietalsEn?: string;
  structure?: Partial<WineStructure>;
  aromas?: WineAromas;
  humanPhilosophyKo: string;
  humanPhilosophyEn: string;
  wineryLocation?: WineryLocation;
}

export const APPELLATION_PROFILES: AppellationProfile[] = [
  // ================= CHAMPAGNE =================
  {
    key: 'le_mesnil',
    aliases: ['르 메닐', '메닐 쉬르 오제', 'le mesnil', 'mesnil-sur-oger', 'mesnil'],
    regionKo: '프랑스 샹파뉴 르 메닐 쉬르 오제',
    regionEn: 'Le Mesnil-sur-Oger, Champagne, France',
    countryCode: 'FR',
    vintageRegion: 'champagne',
    defaultCategory: 'sparkling',
    varietalsKo: '샤르도네 100%',
    varietalsEn: '100% Chardonnay',
    structure: { body: 4, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['citrus', 'pear_apple', 'white_flower'],
      secondary: ['butter_brioche', 'mineral_stone'],
      tertiary: ['honey'],
    },
    earthSoilKo: '순수한 백악질(Belemnite Chalk) 토양이 와인에 압도적인 미네랄과 긴 여운을 부여합니다.',
    earthSoilEn: 'Pure Belemnite chalk imbues crystalline salinity and decades of aging grace.',
    wineryLocation: {
      lat: 48.9475,
      lng: 4.0218,
      placeLabelKo: '르 메닐 쉬르 오제 (Le Mesnil-sur-Oger)',
      placeLabelEn: 'Le Mesnil-sur-Oger, Champagne',
      earthQuery: 'Le Mesnil-sur-Oger Champagne',
    },
  },
  {
    key: 'avize_cramant',
    aliases: ['아비즈', '크라망', '코트 데 블랑', 'avize', 'cramant', 'cote des blancs'],
    regionKo: '프랑스 샹파뉴 꼬뜨 데 블랑',
    regionEn: 'Côte des Blancs, Champagne, France',
    countryCode: 'FR',
    vintageRegion: 'champagne',
    defaultCategory: 'sparkling',
    varietalsKo: '샤르도네 100%',
    varietalsEn: '100% Chardonnay',
    structure: { body: 3, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['citrus', 'white_flower', 'pear_apple'],
      secondary: ['mineral_stone', 'butter_brioche'],
      tertiary: ['honey'],
    },
    earthSoilKo: '꼬뜨 데 블랑의 백악질 사면이 섬세하고 정교한 블랑 드 블랑의 골격을 만듭니다.',
    earthSoilEn: 'Chalk slopes of Côte des Blancs deliver tension, lift, and chalky precision.',
    wineryLocation: {
      lat: 48.9722,
      lng: 4.0094,
      placeLabelKo: '아비즈 · 꼬뜨 데 블랑 (Avize)',
      placeLabelEn: 'Avize, Côte des Blancs',
      earthQuery: 'Avize Champagne France',
    },
  },
  {
    key: 'champagne',
    aliases: ['샹파뉴', '샴페인', 'champagne', 'reims', 'epernay', 'ay', 'bouzy', '랭스', '에페르네'],
    regionKo: '프랑스 샹파뉴',
    regionEn: 'Champagne, France',
    countryCode: 'FR',
    vintageRegion: 'champagne',
    defaultCategory: 'sparkling',
    varietalsKo: '샤르도네 · 피노 누아 블렌드',
    varietalsEn: 'Chardonnay & Pinot Noir Blend',
    structure: { body: 3, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['citrus', 'pear_apple'],
      secondary: ['butter_brioche', 'mineral_stone'],
      tertiary: ['honey'],
    },
    earthSoilKo: '해양성 화석과 백악질 토양이 맑은 산도와 크리미한 기포 질감을 형성합니다.',
    earthSoilEn: 'Fossil-rich chalk subsoil shapes vibrant acidity and fine, persistent mousse.',
    wineryLocation: {
      lat: 49.2583,
      lng: 4.0317,
      placeLabelKo: '랭스 · 샹파뉴 (Reims, Champagne)',
      placeLabelEn: 'Reims, Champagne, France',
      earthQuery: 'Reims Champagne France',
    },
  },

  // ================= BURGUNDY =================
  {
    key: 'gevrey_chambertin',
    aliases: ['제브레', '샹베르탱', 'gevrey', 'chambertin', 'clos de beze'],
    regionKo: '프랑스 부르고뉴 제브레 샹베르탱',
    regionEn: 'Gevrey-Chambertin, Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'red',
    varietalsKo: '피노 누아 100%',
    varietalsEn: '100% Pinot Noir',
    structure: { body: 4, acidity: 4, tannin: 4, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['cherry', 'blackcurrant'],
      secondary: ['oak_cedar', 'pepper_spice'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '바조시안 석회암과 철분 점토질 토양이 웅장하고 근육질인 피노 누아 구조를 만듭니다.',
    earthSoilEn: 'Bajocian limestone and iron-rich marl yield structured, noble Pinot Noir.',
    wineryLocation: {
      lat: 47.2266,
      lng: 4.9675,
      placeLabelKo: '제브레 샹베르탱 (Gevrey-Chambertin)',
      placeLabelEn: 'Gevrey-Chambertin, Côte de Nuits',
      earthQuery: 'Gevrey-Chambertin Burgundy',
    },
  },
  {
    key: 'chambolle_musigny',
    aliases: ['샹볼', '뮈지니', '본 마르', 'chambolle', 'musigny', 'bonnes mares', 'amoureuses'],
    regionKo: '프랑스 부르고뉴 샹볼 뮈지니',
    regionEn: 'Chambolle-Musigny, Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'red',
    varietalsKo: '피노 누아 100%',
    varietalsEn: '100% Pinot Noir',
    structure: { body: 3, acidity: 4, tannin: 3, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['cherry', 'white_flower'],
      secondary: ['oak_cedar', 'mineral_stone'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '얇은 표토 아래 단단한 석회암 암반이 실크처럼 섬세한 레이스 질감을 빚어냅니다.',
    earthSoilEn: 'Thin topsoil over hard limestone produces perfumed, lacy, silken Pinot Noir.',
    wineryLocation: {
      lat: 47.1856,
      lng: 4.9531,
      placeLabelKo: '샹볼 뮈지니 (Chambolle-Musigny)',
      placeLabelEn: 'Chambolle-Musigny, Côte de Nuits',
      earthQuery: 'Chambolle-Musigny Burgundy',
    },
  },
  {
    key: 'vosne_romanee',
    aliases: ['본 로마네', '로마네', '라 타슈', '리쉬부르', '에세조', 'vosne', 'romanee', 'tache', 'richebourg', 'echezeaux'],
    regionKo: '프랑스 부르고뉴 본 로마네',
    regionEn: 'Vosne-Romanée, Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'red',
    varietalsKo: '피노 누아 100%',
    varietalsEn: '100% Pinot Noir',
    structure: { body: 4, acidity: 4, tannin: 3, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['cherry', 'white_flower'],
      secondary: ['pepper_spice', 'oak_cedar'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '점토와 석회암의 황금 비율 토양이 관능적인 향신료와 벨벳 타닌을 선사합니다.',
    earthSoilEn: 'Ideal clay-limestone balance gives exotic spice and seamless velvet texture.',
    wineryLocation: {
      lat: 47.1597,
      lng: 4.9539,
      placeLabelKo: '본 로마네 (Vosne-Romanée)',
      placeLabelEn: 'Vosne-Romanée, Côte de Nuits',
      earthQuery: 'Vosne-Romanee Burgundy',
    },
  },
  {
    key: 'meursault',
    aliases: ['뫼르소', 'meursault', 'perrieres', 'charmes', 'genevrieres'],
    regionKo: '프랑스 부르고뉴 뫼르소',
    regionEn: 'Meursault, Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'white',
    varietalsKo: '샤르도네 100%',
    varietalsEn: '100% Chardonnay',
    structure: { body: 4, acidity: 4, tannin: 1, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['pear_apple', 'citrus'],
      secondary: ['butter_brioche', 'oak_cedar', 'mineral_stone'],
      tertiary: ['honey'],
    },
    earthSoilKo: '백악질 이회토(Marl)와 자갈 토양이 헤이즐넛·버터 풍미와 긴 미네랄을 줍니다.',
    earthSoilEn: 'White marl and limestone gravel deliver hazelnut richness with stony grip.',
    wineryLocation: {
      lat: 46.9786,
      lng: 4.7706,
      placeLabelKo: '뫼르소 (Meursault)',
      placeLabelEn: 'Meursault, Côte de Beaune',
      earthQuery: 'Meursault Burgundy France',
    },
  },
  {
    key: 'puligny_chassagne',
    aliases: ['퓔리니', '샤샤뉴', '몽라쉐', '바타르', '슈발리에', 'puligny', 'chassagne', 'montrachet', 'batard', 'chevalier'],
    regionKo: '프랑스 부르고뉴 몽라쉐 · 퓔리니',
    regionEn: 'Puligny-Montrachet, Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'white',
    varietalsKo: '샤르도네 100%',
    varietalsEn: '100% Chardonnay',
    structure: { body: 4, acidity: 5, tannin: 1, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['citrus', 'white_flower', 'pear_apple'],
      secondary: ['mineral_stone', 'butter_brioche', 'oak_cedar'],
      tertiary: ['honey'],
    },
    earthSoilKo: '배수가 뛰어난 석회암 모래 토양이 면도날처럼 정교한 산도와 깊이를 만듭니다.',
    earthSoilEn: 'Well-drained oolitic limestone gives laser-like purity and regal length.',
    wineryLocation: {
      lat: 46.9461,
      lng: 4.7536,
      placeLabelKo: '퓔리니 몽라쉐 (Puligny-Montrachet)',
      placeLabelEn: 'Puligny-Montrachet, Côte de Beaune',
      earthQuery: 'Puligny-Montrachet Burgundy',
    },
  },
  {
    key: 'chablis',
    aliases: ['샤블리', 'chablis', 'les clos', 'valmur', 'raveneau', 'dauvissat'],
    regionKo: '프랑스 부르고뉴 샤블리',
    regionEn: 'Chablis, Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'white',
    varietalsKo: '샤르도네 100%',
    varietalsEn: '100% Chardonnay',
    structure: { body: 3, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['citrus', 'pear_apple'],
      secondary: ['mineral_stone', 'white_flower'],
      tertiary: [],
    },
    earthSoilKo: '키메리지안(Kimmeridgian) 굴 껍질 화석 토양이 서늘한 바다 미네랄감을 빚어냅니다.',
    earthSoilEn: 'Kimmeridgian limestone rich in marine fossils imparts crisp oyster-shell salinity.',
    wineryLocation: {
      lat: 47.8153,
      lng: 3.7972,
      placeLabelKo: '샤블리 (Chablis)',
      placeLabelEn: 'Chablis, Burgundy',
      earthQuery: 'Chablis Burgundy France',
    },
  },
  {
    key: 'burgundy_general',
    aliases: ['부르고뉴', '코트 드 뉘', '코트 드 본', '포마르', '볼네', '본', 'bourgogne', 'burgundy', 'pommard', 'volnay', 'beaune', 'corton'],
    regionKo: '프랑스 부르고뉴',
    regionEn: 'Burgundy, France',
    countryCode: 'FR',
    vintageRegion: 'burgundy',
    defaultCategory: 'red',
    varietalsKo: '피노 누아 100%',
    varietalsEn: '100% Pinot Noir',
    structure: { body: 3, acidity: 4, tannin: 3, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['cherry', 'white_flower'],
      secondary: ['oak_cedar', 'mineral_stone'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '쥐라기 석회암과 점토질이 교차하는 클리마 토양이 섬세한 테루아를 표현합니다.',
    earthSoilEn: 'Jurassic limestone and marl climats express pure, transparent terroir.',
    wineryLocation: {
      lat: 47.0247,
      lng: 4.8386,
      placeLabelKo: '본 · 부르고뉴 (Beaune, Burgundy)',
      placeLabelEn: 'Beaune, Burgundy, France',
      earthQuery: 'Beaune Burgundy France',
    },
  },

  // ================= BORDEAUX =================
  {
    key: 'pauillac',
    aliases: ['뽀이약', '포이약', 'pauillac'],
    regionKo: '프랑스 보르도 뽀이약',
    regionEn: 'Pauillac, Bordeaux, France',
    countryCode: 'FR',
    vintageRegion: 'bordeaux',
    defaultCategory: 'red',
    varietalsKo: '카베르네 소비뇽 · 메를로 블렌드',
    varietalsEn: 'Cabernet Sauvignon & Merlot Blend',
    structure: { body: 5, acidity: 4, tannin: 5, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['blackcurrant', 'cherry'],
      secondary: ['oak_cedar', 'pepper_spice'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '지롱드 강가의 깊은 자갈(Gravel) 언덕이 시더·블랙커런트 풍미의 위엄 있는 구조를 만듭니다.',
    earthSoilEn: 'Deep Garonne gravel mounds over clay nurture regal, age-worthy Cabernet.',
    wineryLocation: {
      lat: 45.2003,
      lng: -0.7486,
      placeLabelKo: '뽀이약 (Pauillac, Bordeaux)',
      placeLabelEn: 'Pauillac, Médoc, Bordeaux',
      earthQuery: 'Pauillac Bordeaux France',
    },
  },
  {
    key: 'margaux',
    aliases: ['마고', 'margaux'],
    regionKo: '프랑스 보르도 마고',
    regionEn: 'Margaux, Bordeaux, France',
    countryCode: 'FR',
    vintageRegion: 'bordeaux',
    defaultCategory: 'red',
    varietalsKo: '카베르네 소비뇽 · 메를로 블렌드',
    varietalsEn: 'Cabernet Sauvignon & Merlot Blend',
    structure: { body: 4, acidity: 4, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['blackcurrant', 'white_flower', 'cherry'],
      secondary: ['oak_cedar'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '모래가 섞인 고운 자갈 토양이 마고 특유의 제비꽃 향기와 우아한 질감을 줍니다.',
    earthSoilEn: 'Fine sandy gravel yields fragrant, floral, and supremely graceful wines.',
    wineryLocation: {
      lat: 45.0419,
      lng: -0.6758,
      placeLabelKo: '마고 (Margaux, Bordeaux)',
      placeLabelEn: 'Margaux, Médoc, Bordeaux',
      earthQuery: 'Margaux Bordeaux France',
    },
  },
  {
    key: 'saint_julien_estephe',
    aliases: ['생 줄리앙', '생 테스테프', 'saint-julien', 'saint-estephe', 'st-julien', 'st-estephe'],
    regionKo: '프랑스 보르도 메독',
    regionEn: 'Médoc, Bordeaux, France',
    countryCode: 'FR',
    vintageRegion: 'bordeaux',
    defaultCategory: 'red',
    varietalsKo: '카베르네 소비뇽 · 메를로 블렌드',
    varietalsEn: 'Cabernet Sauvignon & Merlot Blend',
    structure: { body: 5, acidity: 4, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['blackcurrant'],
      secondary: ['oak_cedar', 'mineral_stone'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '자갈과 점토의 조화가 치밀한 타닌과 균형 잡힌 숙성 잠재력을 부여합니다.',
    earthSoilEn: 'Gravel terraces and clay subsoil produce harmonious, structured classics.',
    wineryLocation: {
      lat: 45.1614,
      lng: -0.7422,
      placeLabelKo: '생 줄리앙 (Saint-Julien, Bordeaux)',
      placeLabelEn: 'Saint-Julien, Bordeaux',
      earthQuery: 'Saint-Julien Bordeaux France',
    },
  },
  {
    key: 'pomerol_emilion',
    aliases: ['포므롤', '생테밀리옹', '생 테밀리옹', 'pomerol', 'saint-emilion', 'st-emilion'],
    regionKo: '프랑스 보르도 우안 (포므롤 · 생테밀리옹)',
    regionEn: 'Right Bank, Bordeaux, France',
    countryCode: 'FR',
    vintageRegion: 'bordeaux',
    defaultCategory: 'red',
    varietalsKo: '메를로 · 카베르네 프랑 블렌드',
    varietalsEn: 'Merlot & Cabernet Franc Blend',
    structure: { body: 5, acidity: 3, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['cherry', 'blackcurrant'],
      secondary: ['oak_cedar', 'pepper_spice'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '푸른 점토와 석회암 대지가 풍만하고 관능적인 메를로의 깊이를 빚어냅니다.',
    earthSoilEn: 'Blue clay and limestone plateau produce opulent, velvety Merlot.',
    wineryLocation: {
      lat: 44.9317,
      lng: -0.1972,
      placeLabelKo: '포므롤 · 생테밀리옹 (Pomerol)',
      placeLabelEn: 'Pomerol & Saint-Émilion, Bordeaux',
      earthQuery: 'Pomerol Bordeaux France',
    },
  },
  {
    key: 'sauternes',
    aliases: ['소테른', 'sauternes', 'barsac', '이켐', 'yquem'],
    regionKo: '프랑스 보르도 소테른',
    regionEn: 'Sauternes, Bordeaux, France',
    countryCode: 'FR',
    vintageRegion: 'bordeaux',
    defaultCategory: 'dessert',
    varietalsKo: '세미용 · 소비뇽 블랑',
    varietalsEn: 'Sémillon & Sauvignon Blanc',
    structure: { body: 5, acidity: 4, tannin: 1, sweetness: 5, alcohol: 4 },
    aromas: {
      primary: ['pear_apple', 'citrus'],
      secondary: ['oak_cedar', 'white_flower'],
      tertiary: ['honey'],
    },
    earthSoilKo: '시롱 강 안개가 빚은 귀부균과 자갈 토양이 꿀·살구·산도의 완벽한 균형을 만듭니다.',
    earthSoilEn: 'Ciron river mists and gravel slopes craft luscious, botrytized nectar.',
    wineryLocation: {
      lat: 44.5322,
      lng: -0.3289,
      placeLabelKo: '소테른 (Sauternes, Bordeaux)',
      placeLabelEn: 'Sauternes, Bordeaux',
      earthQuery: 'Sauternes Bordeaux France',
    },
  },
  {
    key: 'bordeaux_general',
    aliases: ['보르도', '페삭', '그라브', 'bordeaux', 'pessac', 'graves', 'medoc'],
    regionKo: '프랑스 보르도',
    regionEn: 'Bordeaux, France',
    countryCode: 'FR',
    vintageRegion: 'bordeaux',
    defaultCategory: 'red',
    varietalsKo: '카베르네 소비뇽 · 메를로 블렌드',
    varietalsEn: 'Cabernet Sauvignon & Merlot Blend',
    structure: { body: 4, acidity: 4, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['blackcurrant', 'cherry'],
      secondary: ['oak_cedar', 'pepper_spice'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '자갈과 석회질, 점토가 어우러진 대서양성 테루아가 견고한 클래식을 만듭니다.',
    earthSoilEn: 'Gravel, limestone, and clay form the classic Bordeaux structural backbone.',
    wineryLocation: {
      lat: 44.8378,
      lng: -0.5792,
      placeLabelKo: '보르도 (Bordeaux, France)',
      placeLabelEn: 'Bordeaux, France',
      earthQuery: 'Bordeaux France',
    },
  },

  // ================= RHONE / LOIRE / ALSACE =================
  {
    key: 'rhone',
    aliases: ['코트 로티', '에르미타주', '샤또뇌프', '론', 'cote-rotie', 'hermitage', 'chateauneuf', 'rhone', 'condrieu'],
    regionKo: '프랑스 론 밸리',
    regionEn: 'Rhône Valley, France',
    countryCode: 'FR',
    vintageRegion: 'rhone',
    defaultCategory: 'red',
    varietalsKo: '시라 · 그르나슈',
    varietalsEn: 'Syrah & Grenache',
    structure: { body: 5, acidity: 3, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['blackcurrant', 'cherry'],
      secondary: ['pepper_spice', 'oak_cedar'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '가파른 화강암 비탈과 둥근 자갈(Galets)이 후추·훈연·농축된 과실미를 줍니다.',
    earthSoilEn: 'Steep granite terraces and rolled galets deliver cracked pepper and dark fruit.',
    wineryLocation: {
      lat: 45.0758,
      lng: 4.8342,
      placeLabelKo: '탱 레르미타주 · 론 밸리',
      placeLabelEn: 'Tain-l’Hermitage, Rhône Valley',
      earthQuery: 'Hermitage Rhone Valley France',
    },
  },
  {
    key: 'loire_alsace',
    aliases: ['상세르', '산세르', '푸이 퓌메', '루아르', '알자스', 'sancerre', 'pouilly-fume', 'loire', 'alsace'],
    regionKo: '프랑스 루아르 · 알자스',
    regionEn: 'Loire & Alsace, France',
    countryCode: 'FR',
    vintageRegion: 'loire_alsace',
    defaultCategory: 'white',
    varietalsKo: '소비뇽 블랑 · 리슬링',
    varietalsEn: 'Sauvignon Blanc & Riesling',
    structure: { body: 2, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
    aromas: {
      primary: ['citrus', 'pear_apple'],
      secondary: ['mineral_stone', 'herbal_mint'],
      tertiary: [],
    },
    earthSoilKo: '부싯돌(Silex)과 화강암·이회토 토양이 맑고 생동감 넘치는 산미와 미네랄을 줍니다.',
    earthSoilEn: 'Flint (silex) and granite soils create razor-sharp citrus and stony lift.',
    wineryLocation: {
      lat: 47.3311,
      lng: 2.8392,
      placeLabelKo: '상세르 · 루아르 (Sancerre)',
      placeLabelEn: 'Sancerre, Loire Valley',
      earthQuery: 'Sancerre Loire France',
    },
  },

  // ================= ITALY / US / SPAIN / GERMANY =================
  {
    key: 'barolo_barbaresco',
    aliases: ['바롤로', '바르바레스코', '피에몬테', '네비올로', 'barolo', 'barbaresco', 'piedmont', 'piemonte'],
    regionKo: '이탈리아 피에몬테 (바롤로 · 바르바레스코)',
    regionEn: 'Piedmont, Italy',
    countryCode: 'IT',
    vintageRegion: 'piedmont',
    defaultCategory: 'red',
    varietalsKo: '네비올로 100%',
    varietalsEn: '100% Nebbiolo',
    structure: { body: 4, acidity: 5, tannin: 5, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['cherry', 'white_flower'],
      secondary: ['pepper_spice', 'oak_cedar'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '랑게 언덕의 석회질 이회토(Tortonian/Serravallian)가 장미·타르·견고한 타닌을 빚습니다.',
    earthSoilEn: 'Langhe calcareous marl delivers rose petal aromatics and towering Nebbiolo tannin.',
    wineryLocation: {
      lat: 44.6108,
      lng: 7.9417,
      placeLabelKo: '바롤로 · 피에몬테 (Barolo)',
      placeLabelEn: 'Barolo, Piedmont, Italy',
      earthQuery: 'Barolo Piedmont Italy',
    },
  },
  {
    key: 'tuscany',
    aliases: ['볼게리', '브루넬로', '몬탈치노', '키안티', '토스카나', '슈퍼투스칸', 'bolgheri', 'brunello', 'montalcino', 'chianti', 'tuscany'],
    regionKo: '이탈리아 토스카나',
    regionEn: 'Tuscany, Italy',
    countryCode: 'IT',
    vintageRegion: 'tuscany',
    defaultCategory: 'red',
    varietalsKo: '산지오베제 · 보르도 블렌드',
    varietalsEn: 'Sangiovese & Tuscan Blend',
    structure: { body: 4, acidity: 4, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: {
      primary: ['cherry', 'blackcurrant'],
      secondary: ['oak_cedar', 'herbal_mint'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '갈레스트로 편암과 해안 자갈 토양이 지중해 허브와 붉은 체리의 생기를 더해줍니다.',
    earthSoilEn: 'Galestro schist and coastal gravel frame wild cherry and Mediterranean herbs.',
    wineryLocation: {
      lat: 43.2319,
      lng: 10.6164,
      placeLabelKo: '볼게리 · 토스카나 (Bolgheri)',
      placeLabelEn: 'Bolgheri, Tuscany, Italy',
      earthQuery: 'Bolgheri Tuscany Italy',
    },
  },
  {
    key: 'napa_valley',
    aliases: ['나파', '오크빌', '러더포드', '소노마', 'napa', 'oakville', 'rutherford', 'sonoma'],
    regionKo: '미국 캘리포니아 나파 밸리',
    regionEn: 'Napa Valley, California, USA',
    countryCode: 'US',
    vintageRegion: 'napa',
    defaultCategory: 'red',
    varietalsKo: '카베르네 소비뇽',
    varietalsEn: 'Cabernet Sauvignon',
    structure: { body: 5, acidity: 3, tannin: 4, sweetness: 1, alcohol: 5 },
    aromas: {
      primary: ['blackcurrant', 'cherry'],
      secondary: ['oak_cedar', 'pepper_spice'],
      tertiary: ['leather_earth'],
    },
    earthSoilKo: '충적 선상지 자갈 토양과 풍부한 일조량이 농밀한 블랙커런트와 벨벳 타닌을 줍니다.',
    earthSoilEn: 'Alluvial fan gravel and warm sunshine produce plush cassis and polished tannin.',
    wineryLocation: {
      lat: 38.4369,
      lng: -122.4044,
      placeLabelKo: '오크빌 · 나파 밸리 (Oakville)',
      placeLabelEn: 'Oakville, Napa Valley, USA',
      earthQuery: 'Oakville Napa Valley California',
    },
  },
  {
    key: 'mosel_germany',
    aliases: ['모젤', '라인가우', '리슬링', 'mosel', 'rheingau', 'riesling'],
    regionKo: '독일 모젤 · 라인가우',
    regionEn: 'Mosel, Germany',
    countryCode: 'DE',
    vintageRegion: 'loire_alsace',
    defaultCategory: 'white',
    varietalsKo: '리슬링 100%',
    varietalsEn: '100% Riesling',
    structure: { body: 2, acidity: 5, tannin: 1, sweetness: 2, alcohol: 2 },
    aromas: {
      primary: ['citrus', 'pear_apple'],
      secondary: ['mineral_stone', 'white_flower'],
      tertiary: ['honey'],
    },
    earthSoilKo: '가파른 청색 점판암(Slate) 사면이 짜릿한 산미와 정교한 미네랄 여운을 선사합니다.',
    earthSoilEn: 'Steep blue slate slopes yield electric acidity and crystalline mineral purity.',
    wineryLocation: {
      lat: 49.9158,
      lng: 7.0714,
      placeLabelKo: '베른카스텔 · 모젤 (Mosel)',
      placeLabelEn: 'Bernkastel, Mosel, Germany',
      earthQuery: 'Bernkastel Mosel Germany',
    },
  },
];

export const PRODUCER_PROFILES: ProducerProfile[] = [
  // Champagne Houses & Growers
  {
    key: 'salon',
    aliases: ['살롱', 'salon'],
    canonicalNameKo: '살롱 르 메닐 블랑 드 블랑 그랑 크뤼',
    canonicalNameEn: 'Salon Le Mesnil Blanc de Blancs Grand Cru',
    producer: 'Champagne Salon',
    appellationKey: 'le_mesnil',
    humanPhilosophyKo: '1905년 유젠 에메 살롱이 오직 최상의 해에만 한 가지 퀴베를 빚기 시작했습니다.',
    humanPhilosophyEn: 'Founded in 1905 by Eugène-Aimé Salon to craft a single Grand Cru vintage cuvée.',
  },
  {
    key: 'krug',
    aliases: ['크루그', 'krug', 'clos du mesnil', 'clos d ambonnay'],
    canonicalNameKo: '크루그 그랑 퀴베',
    canonicalNameEn: 'Krug Grande Cuvée',
    producer: 'Maison Krug',
    appellationKey: 'champagne',
    structure: { body: 4, acidity: 5 },
    humanPhilosophyKo: '1843년 조셉 크루그가 설립한 이래, 120여 종의 리저브 와인을 블렌딩해 교향곡 같은 깊이를 빚습니다.',
    humanPhilosophyEn: 'House of Krug blends over 120 wines across vintages for symphonic richness and tension.',
    wineryLocation: {
      lat: 49.2478,
      lng: 4.0369,
      placeLabelKo: '크루그 메종 · 랭스 (Maison Krug)',
      placeLabelEn: 'Maison Krug, Reims',
      earthQuery: 'Maison Krug Reims France',
    },
  },
  {
    key: 'dom_perignon',
    aliases: ['돔 페리뇽', '돔페리뇽', 'dom perignon', 'dom pérignon', 'p2', 'p3'],
    canonicalNameKo: '돔 페리뇽 빈티지 브뤼',
    canonicalNameEn: 'Dom Pérignon Vintage Brut',
    producer: 'Dom Pérignon',
    appellationKey: 'champagne',
    humanPhilosophyKo: '오직 단일 빈티지로만 출시되며 장기 효모 숙성을 통해 빛과 긴장감의 조화를 추구합니다.',
    humanPhilosophyEn: 'Exclusively vintage champagne celebrating precision, mineral energy, and prolonged lees aging.',
    wineryLocation: {
      lat: 49.0422,
      lng: 3.9564,
      placeLabelKo: '에페르네 · 돔 페리뇽 (Épernay)',
      placeLabelEn: 'Épernay, Champagne',
      earthQuery: 'Dom Perignon Epernay France',
    },
  },
  {
    key: 'cristal',
    aliases: ['크리스탈', '루이 로드레', 'cristal', 'louis roederer'],
    canonicalNameKo: '루이 로드레 크리스탈 브뤼',
    canonicalNameEn: 'Louis Roederer Cristal Brut',
    producer: 'Louis Roederer',
    appellationKey: 'champagne',
    humanPhilosophyKo: '1876년 러시아 황제를 위해 탄생한 그랑 크뤼 비오디나미 샴페인으로 순수함과 실크 같은 기포를 자랑합니다.',
    humanPhilosophyEn: 'Born in 1876, farmed biodynamically on Grand Cru chalk for crystalline precision.',
  },
  {
    key: 'selosse',
    aliases: ['셀로스', '자크 셀로스', 'selosse', 'jacques selosse', 'initial', 'substance'],
    canonicalNameKo: '자크 셀로스 이니셜 블랑 드 블랑',
    canonicalNameEn: 'Jacques Selosse Initial Blanc de Blancs',
    producer: 'Domaine Jacques Selosse',
    appellationKey: 'avize_cramant',
    structure: { body: 4 },
    humanPhilosophyKo: '그로워 샴페인의 전설 안셀름 셀로스가 솔레라 숙성과 산화적 양조로 빚은 떼루아 샴페인입니다.',
    humanPhilosophyEn: 'Anselme Selosse pioneered Burgundy-inspired grower Champagne with solera complexity.',
  },
  {
    key: 'bollinger',
    aliases: ['볼랭저', '라 그랑 다네', 'bollinger', 'grande annee', 'rd'],
    canonicalNameKo: '볼랭저 라 그랑 다네',
    canonicalNameEn: 'Bollinger La Grande Année',
    producer: 'Champagne Bollinger',
    appellationKey: 'champagne',
    structure: { body: 4 },
    humanPhilosophyKo: '오크 배럴 발효와 피노 누아 중심의 힘 있는 구조감으로 미식과 완벽히 어우러집니다.',
    humanPhilosophyEn: 'Barrel-fermented Pinot Noir-driven Champagne prized for gastronomic weight.',
  },

  // Burgundy Producers
  {
    key: 'drc',
    aliases: ['로마네 콩티', 'drc', 'romanee-conti', 'la tache', '라 타슈'],
    canonicalNameKo: '도멘 드 라 로마네 콩티 (DRC)',
    canonicalNameEn: 'Domaine de la Romanée-Conti',
    producer: 'Domaine de la Romanée-Conti',
    appellationKey: 'vosne_romanee',
    humanPhilosophyKo: '부르고뉴 최고봉의 비오디나미 도멘으로, 모든 밭의 미세한 차이를 순수한 예술로 승화시킵니다.',
    humanPhilosophyEn: 'The pinnacle of biodynamic Burgundy, translating grand cru terroir into timeless grace.',
  },
  {
    key: 'armand_rousseau',
    aliases: ['아르망 루소', '루소', 'armand rousseau', 'rousseau'],
    canonicalNameKo: '도멘 아르망 루소 제브레 샹베르탱',
    canonicalNameEn: 'Domaine Armand Rousseau Gevrey-Chambertin',
    producer: 'Domaine Armand Rousseau',
    appellationKey: 'gevrey_chambertin',
    humanPhilosophyKo: '1909년부터 제브레 샹베르탱의 그랑 크뤼를 수호해 온 명가로, 절제된 오크와 순수한 기품을 보여줍니다.',
    humanPhilosophyEn: 'Iconic Gevrey estate famed for transparent, aristocratic Grand Cru Pinot Noir.',
  },
  {
    key: 'roumier',
    aliases: ['조르주 루미에', '루미에', 'roumier', 'georges roumier'],
    canonicalNameKo: '도멘 조르주 루미에 샹볼 뮈지니',
    canonicalNameEn: 'Domaine Georges Roumier Chambolle-Musigny',
    producer: 'Domaine Georges Roumier',
    appellationKey: 'chambolle_musigny',
    humanPhilosophyKo: '샹볼 뮈지니의 꽃향기와 실크 같은 순수함을 가장 정교하게 포착하는 전설적 생산자입니다.',
    humanPhilosophyEn: 'Celebrated for hauntingly floral, weightless yet intense Chambolle-Musigny.',
  },
  {
    key: 'leflaive',
    aliases: ['도멘 르플레브', '르플레브', 'leflaive'],
    canonicalNameKo: '도멘 르플레브 퓔리니 몽라쉐',
    canonicalNameEn: 'Domaine Leflaive Puligny-Montrachet',
    producer: 'Domaine Leflaive',
    appellationKey: 'puligny_chassagne',
    humanPhilosophyKo: '비오디나미 농법의 선구자로, 퓔리니 몽라쉐의 순수한 미네랄과 긴 여운을 대표합니다.',
    humanPhilosophyEn: 'Pioneer of biodynamic white Burgundy crafting benchmark, mineral-driven Chardonnay.',
  },
  {
    key: 'coche_dury',
    aliases: ['코슈 뒤리', '코쉬 뒤리', 'coche-dury', 'coche dury'],
    canonicalNameKo: '도멘 코슈 뒤리 뫼르소',
    canonicalNameEn: 'Domaine Coche-Dury Meursault',
    producer: 'Domaine Coche-Dury',
    appellationKey: 'meursault',
    humanPhilosophyKo: '장-프랑수아 코슈의 철저한 저수확과 정교한 오크 숙성이 뫼르소를 세계 최고 화이트로 끌어올렸습니다.',
    humanPhilosophyEn: 'Benchmark Meursault estate famed for flinty tension and extraordinary longevity.',
  },
  {
    key: 'roulot',
    aliases: ['도멘 룰로', '룰로', 'roulot'],
    canonicalNameKo: '도멘 룰로 뫼르소',
    canonicalNameEn: 'Domaine Roulot Meursault',
    producer: 'Domaine Roulot',
    appellationKey: 'meursault',
    humanPhilosophyKo: '전통적인 무거운 뫼르소 대신 맑고 팽팽한 산도와 정교한 밭별 개성을 개척했습니다.',
    humanPhilosophyEn: 'Jean-Marc Roulot redefined Meursault with crystalline purity and single-vineyard precision.',
  },
  {
    key: 'meo_camuzet',
    aliases: ['메오 카뮈제', '메오 까뮈제', 'meo-camuzet', 'meo camuzet'],
    canonicalNameKo: '도멘 메오 까뮈제 본 로마네',
    canonicalNameEn: 'Domaine Méo-Camuzet Vosne-Romanée',
    producer: 'Domaine Méo-Camuzet',
    appellationKey: 'vosne_romanee',
    humanPhilosophyKo: '앙리 자이에의 제자 장 니콜라 메오가 빚는 관능적이고 매끄러운 부르고뉴 레드입니다.',
    humanPhilosophyEn: 'Mentored by Henri Jayer, crafting plush, perfumed, and deeply expressive Côte de Nuits.',
  },

  // Bordeaux First & Super Seconds
  {
    key: 'lafite',
    aliases: ['라피트', '라피트 로칠드', 'lafite', 'lafite rothschild'],
    canonicalNameKo: '샤또 라피트 로칠드 뽀이약',
    canonicalNameEn: 'Château Lafite Rothschild Pauillac',
    producer: 'Château Lafite Rothschild',
    appellationKey: 'pauillac',
    humanPhilosophyKo: '보르도 1855 1등급의 상징으로, 힘보다 우아함과 수십 년을 내다보는 절제된 기품을 지닙니다.',
    humanPhilosophyEn: '1855 First Growth celebrated for understated elegance, graphite, and century-long poise.',
  },
  {
    key: 'latour',
    aliases: ['라투르', '샤또 라투르', 'latour', 'chateau latour'],
    canonicalNameKo: '샤또 라투르 뽀이약',
    canonicalNameEn: 'Château Latour Pauillac',
    producer: 'Château Latour',
    appellationKey: 'pauillac',
    humanPhilosophyKo: '강건하고 흔들림 없는 카베르네 소비뇽의 기념비적 구조감과 웅장한 스케일을 보여줍니다.',
    humanPhilosophyEn: 'Monumental Pauillac First Growth known for deep power, mineral iron, and longevity.',
  },
  {
    key: 'margaux_chateau',
    aliases: ['샤또 마고', '파비용 루즈', 'chateau margaux', 'pavillon rouge'],
    canonicalNameKo: '샤또 마고',
    canonicalNameEn: 'Château Margaux',
    producer: 'Château Margaux',
    appellationKey: 'margaux',
    humanPhilosophyKo: '실크 같은 타닌과 매혹적인 꽃향기가 어우러진 보르도 1등급의 가장 우아한 표현입니다.',
    humanPhilosophyEn: 'First Growth combining haunting floral perfume with seamless, silky authority.',
  },
  {
    key: 'mouton',
    aliases: ['무통', '무통 로칠드', 'mouton', 'mouton rothschild'],
    canonicalNameKo: '샤또 무통 로칠드 뽀이약',
    canonicalNameEn: 'Château Mouton Rothschild Pauillac',
    producer: 'Château Mouton Rothschild',
    appellationKey: 'pauillac',
    humanPhilosophyKo: '예술가 레이블과 함께 이국적이고 화려한 블랙커런트·스파이스의 풍미를 선사하는 1등급 샤또입니다.',
    humanPhilosophyEn: 'Opulent First Growth famed for artist labels and flamboyant cassis-spice depth.',
  },
  {
    key: 'haut_brion',
    aliases: ['오브리옹', '오 브리옹', 'haut-brion', 'haut brion'],
    canonicalNameKo: '샤또 오 브리옹 페삭 레오냥',
    canonicalNameEn: 'Château Haut-Brion Pessac-Léognan',
    producer: 'Château Haut-Brion',
    appellationKey: 'bordeaux_general',
    humanPhilosophyKo: '1855 등급 유일의 그라브 1등급으로, 시가 박스와 훈연 미네랄의 독보적인 개성을 지닙니다.',
    humanPhilosophyEn: 'Historic Graves First Growth celebrated for smoky mineral, cigar box, and plush warmth.',
  },
  {
    key: 'petrus',
    aliases: ['페트뤼스', 'petrus', 'pétrus'],
    canonicalNameKo: '페트뤼스 포므롤',
    canonicalNameEn: 'Pétrus Pomerol',
    producer: 'Pétrus',
    appellationKey: 'pomerol_emilion',
    varietalsKo: '메를로 100%',
    varietalsEn: '100% Merlot',
    humanPhilosophyKo: '포므롤 언덕의 특수 푸른 점토밭에서 메를로 단일 품종으로 빚어낸 세계 최고봉 레드입니다.',
    humanPhilosophyEn: '100% Merlot from Pomerol’s blue clay buttonhole, offering unmatched velvety depth.',
  },
  {
    key: 'yquem',
    aliases: ['디켐', '샤또 디켐', 'yquem', "d'yquem"],
    canonicalNameKo: '샤또 디켐 소테른',
    canonicalNameEn: 'Château d’Yquem Sauternes',
    producer: 'Château d’Yquem',
    appellationKey: 'sauternes',
    humanPhilosophyKo: '한 그루 포도나무에서 단 한 잔만 빚는다는 철학으로 탄생한 세계 최고의 황금빛 디저트 와인입니다.',
    humanPhilosophyEn: 'Premier Cru Supérieur of Sauternes, crafting liquid gold of honey, saffron, and vibrant acidity.',
  },

  // Italy & US Icons
  {
    key: 'sassicaia',
    aliases: ['사시카이아', 'sassicaia', 'tenuta san guido'],
    canonicalNameKo: '테누타 산 귀도 사시카이아 볼게리',
    canonicalNameEn: 'Tenuta San Guido Sassicaia Bolgheri',
    producer: 'Tenuta San Guido',
    appellationKey: 'tuscany',
    varietalsKo: '카베르네 소비뇽 · 카베르네 프랑',
    varietalsEn: 'Cabernet Sauvignon & Cabernet Franc',
    humanPhilosophyKo: '이탈리아 슈퍼투스칸의 효시로, 해안 자갈 토양에서 지중해의 우아한 클래식을 완성했습니다.',
    humanPhilosophyEn: 'The original Super Tuscan, uniting Bordeaux elegance with Mediterranean sea breeze.',
  },
  {
    key: 'gaja',
    aliases: ['가야', '안젤로 가야', 'gaja', 'barbaresco gaja'],
    canonicalNameKo: '가야 바르바레스코',
    canonicalNameEn: 'Gaja Barbaresco',
    producer: 'Gaja',
    appellationKey: 'barbaresco',
    humanPhilosophyKo: '피에몬테 현대화의 주역 안젤로 가야가 네비올로의 우아함과 국제적 완성도를 끌어올렸습니다.',
    humanPhilosophyEn: 'Angelo Gaja elevated Barbaresco to global icon status with purity and refined oak.',
  },
  {
    key: 'opus_one',
    aliases: ['오퍼스 원', '오퍼스원', 'opus one'],
    canonicalNameKo: '오퍼스 원 나파 밸리',
    canonicalNameEn: 'Opus One Napa Valley',
    producer: 'Opus One',
    appellationKey: 'napa_valley',
    humanPhilosophyKo: '바론 필립 드 로칠드와 로버트 몬다비의 합작으로 탄생한 나파와 보르도의 완벽한 교향곡입니다.',
    humanPhilosophyEn: 'Historic Rothschild-Mondavi collaboration marrying Napa ripeness with Bordeaux poise.',
  },
];

// Tier 3: Landmark Vintage Chronicle by Major Region
const VINTAGE_CHRONICLE: Record<
  VintageRegionKey,
  Record<number, { ko: string; en: string }>
> = {
  champagne: {
    1988: { ko: '1988년은 팽팽한 산도와 고전적인 뼈대가 돋보이는 장기 숙성형 위대한 빈티지입니다.', en: '1988 is a classic, briskly acidic vintage built for multi-decade longevity.' },
    1990: { ko: '1990년은 풍만한 과실미와 완성도 높은 구조가 어우러진 샹파뉴 황금기 빈티지입니다.', en: '1990 delivered opulent ripeness balanced by grand structural harmony.' },
    1996: { ko: '1996년은 높은 당도와 날카로운 산도가 공존한 샹파뉴 세기의 빈티지입니다.', en: '1996 delivered rare tension between ripe fruit and razor-sharp acidity.' },
    2002: { ko: '2002년은 완벽한 일조량 속에 풍요로운 아로마와 균형미가 빛난 위대한 해입니다.', en: '2002 is widely hailed for effortless balance, rich aromatics, and crystalline poise.' },
    2008: { ko: '2008년은 서늘하고 긴 생장기가 빚어낸 폭발적 산도와 미네랄의 현대적 명작 빈티지입니다.', en: '2008 is a modern benchmark defined by electric acidity and chalky precision.' },
    2012: { ko: '2012년은 극한의 기후를 이겨낸 응축된 과실과 생동감 넘치는 산도가 조화를 이룬 해입니다.', en: '2012 yielded concentrated fruit power paired with vibrant, lifted freshness.' },
    2013: { ko: '2013년은 늦은 수확이 선사한 클래식하고 섬세한 미네랄 결이 돋보이는 해입니다.', en: '2013 is a late-harvest classic showcasing delicate florals and pure chalk lift.' },
    2015: { ko: '2015년은 따뜻하고 건조한 여름 덕분에 풍만하고 접근성 좋은 매력을 지닌 해입니다.', en: '2015 brought warm-summer generosity and approachable, creamy orchard fruit.' },
  },
  burgundy: {
    1999: { ko: '1999년은 풍성한 수확량과 뛰어난 집중력이 공존한 부르고뉴 전설적 빈티지입니다.', en: '1999 combined generous ripeness with deep, silky structure across the Côte.' },
    2005: { ko: '2005년은 완벽한 기상 조건 속에서 깊은 농축미와 견고한 타닌을 얻은 세기의 해입니다.', en: '2005 is a monumental vintage of concentration, poise, and long aging potential.' },
    2010: { ko: '2010년은 서늘하고 순수한 과실미와 투명한 테루아 표현력이 돋보이는 위대한 해입니다.', en: '2010 is revered for crystalline purity, bright acidity, and transparent terroir.' },
    2015: { ko: '2015년은 햇살 가득한 여름이 선사한 풍만하고 매혹적인 과실의 해입니다.', en: '2015 delivered sun-kissed richness, velvety tannin, and immediate allure.' },
    2016: { ko: '2016년은 봄 서리를 이겨낸 소량 수확 포도가 놀라운 집중도를 보여준 해입니다.', en: '2016 overcame spring frost to yield intensely focused, aromatic classics.' },
    2019: { ko: '2019년은 따뜻한 해임에도 생생한 산도와 에너지가 살아있는 황금빛 빈티지입니다.', en: '2019 pairs lush, expressive fruit with surprising freshness and vibrant drive.' },
    2020: { ko: '2020년은 짙은 색감과 신선한 산미가 극적인 대비를 이루는 현대적 빈티지입니다.', en: '2020 offers striking depth, dark fruit intensity, and poised freshness.' },
    2021: { ko: '2021년은 서늘하고 클래식한 기후가 빚어낸 맑은 산도와 우아한 향기의 해입니다.', en: '2021 is a cool, classic vintage prized for fragrant lift and delicate balance.' },
  },
  bordeaux: {
    1982: { ko: '1982년은 현대 보르도의 역사를 새로 쓴 전설적인 풍요와 숙성력의 해입니다.', en: '1982 is the legendary modern benchmark of opulence and enduring grace.' },
    2000: { ko: '2000년은 완벽한 여름이 빚어낸 위엄 있는 구조감의 밀레니엄 대표 빈티지입니다.', en: '2000 delivered classic millennial structure, dark cassis, and noble longevity.' },
    2005: { ko: '2005년은 건조하고 일조량 높은 날씨로 타닌과 산도가 완벽히 균형 잡힌 해입니다.', en: '2005 achieved extraordinary ripeness framed by firm, aristocratic tannin.' },
    2009: { ko: '2009년은 관능적이고 풍만한 과실미와 벨벳 질감이 돋보이는 위대한 해입니다.', en: '2009 is a plush, hedonistic vintage of velvety texture and sweet dark fruit.' },
    2010: { ko: '2010년은 높은 알코올과 팽팽한 산도·타닌이 공존하는 기념비적 장기 숙성 해입니다.', en: '2010 pairs immense concentration with electric freshness and towering tannin.' },
    2016: { ko: '2016년은 초여름 비 이후 완벽한 늦여름 날씨가 빚어낸 순수하고 클래식한 명작 해입니다.', en: '2016 is a seamless modern classic combining silky tannin with cool precision.' },
    2019: { ko: '2019년은 생동감 넘치는 아로마와 부드러운 타닌이 매력적인 뛰어난 해입니다.', en: '2019 offers vibrant aromatics, supple tannin, and remarkable early-to-late appeal.' },
    2020: { ko: '2020년은 응축된 검은 과실과 촘촘한 구조감이 어우러진 힘 있는 빈티지입니다.', en: '2020 delivered concentrated dark berry depth and finely knit structural power.' },
  },
  rhone: {
    2010: { ko: '2010년은 서늘한 기운 속에서 정교한 후추 향과 탄탄한 구조가 빛난 위대한 해입니다.', en: '2010 is celebrated for classic peppery lift and crystalline Syrah structure.' },
    2015: { ko: '2015년은 따뜻하고 균일한 성숙 덕분에 힘과 균형이 완벽히 맞물린 해입니다.', en: '2015 yielded richly textured, deeply balanced wines across North and South Rhône.' },
    2019: { ko: '2019년은 농축된 어두운 과실과 생생한 산미가 공존하는 훌륭한 해입니다.', en: '2019 shows dark berry concentration uplifted by crisp herbal freshness.' },
  },
  loire_alsace: {
    2014: { ko: '2014년은 서늘한 여름이 빚어낸 짜릿한 산미와 미네랄의 모범적인 해입니다.', en: '2014 produced brisk, mineral-charged whites of remarkable precision.' },
    2019: { ko: '2019년은 잘 익은 핵과류 풍미와 청량한 산도가 조화를 이룬 뛰어난 해입니다.', en: '2019 balances ripe stone-fruit generosity with crisp, stony acidity.' },
    2021: { ko: '2021년은 가볍고 경쾌하며 맑은 시트러스 결이 살아있는 클래식한 해입니다.', en: '2021 is a crisp, low-alcohol classic glowing with bright citrus energy.' },
  },
  piedmont: {
    2010: { ko: '2010년은 클래식한 네비올로의 뼈대와 맑은 장미 향이 살아있는 위대한 해입니다.', en: '2010 is a benchmark classical vintage of lifted rose aromatics and firm structure.' },
    2016: { ko: '2016년은 완벽한 생장기 덕분에 기품과 집중력이 극대화된 세기의 피에몬테 해입니다.', en: '2016 achieved near-perfect harmony, perfume, and noble tannin integration.' },
    2019: { ko: '2019년은 전통적인 산미와 견고한 구조감이 장기 숙성을 예고하는 뛰어난 해입니다.', en: '2019 is a structured, traditional vintage with bright acidity and aging poise.' },
  },
  tuscany: {
    2015: { ko: '2015년은 따뜻한 지중해 햇살이 풍성하고 우아한 과실미를 빚어낸 해입니다.', en: '2015 delivered generous, sun-ripened fruit with polished, supple tannin.' },
    2016: { ko: '2016년은 일교차가 만들어낸 선명한 산도와 정교한 깊이가 돋보이는 명작 해입니다.', en: '2016 is revered for vibrant freshness, precision, and extraordinary balance.' },
    2019: { ko: '2019년은 야생 체리의 생기와 탄탄한 뼈대가 고루 갖춰진 클래식한 해입니다.', en: '2019 combines bright cherry energy with finely sculpted structural grip.' },
  },
  napa: {
    2013: { ko: '2013년은 건조하고 이상적인 기후로 응축미와 구조가 탁월한 나파의 대표 빈티지입니다.', en: '2013 produced deeply concentrated, structured Napa Valley classics.' },
    2016: { ko: '2016년은 온화한 생장기 덕분에 부드러운 타닌과 세련된 균형을 이룬 해입니다.', en: '2016 is prized for silky balance, fresh acidity, and effortless grace.' },
    2018: { ko: '2018년은 길고 서늘한 수확기가 선사한 우아함과 정교함이 빛나는 훌륭한 해입니다.', en: '2018’s long, mild season yielded refined, aromatic, and finely structured wines.' },
  },
  other: {},
};

export interface WineKnowledgeMatch {
  canonicalNameKo?: string;
  canonicalNameEn?: string;
  producer?: string;
  vintage: number;
  category: WineCategory;
  varietalsKo?: string;
  varietalsEn?: string;
  regionKo?: string;
  regionEn?: string;
  countryCode?: string;
  structure?: WineStructure;
  aromas?: WineAromas;
  heavenClimateKo?: string;
  heavenClimateEn?: string;
  earthSoilKo?: string;
  earthSoilEn?: string;
  humanPhilosophyKo?: string;
  humanPhilosophyEn?: string;
  wineryLocation?: WineryLocation;
}

export function lookupWineKnowledge(
  rawName: string,
  fallbackCategory: WineCategory,
  fallbackVintage?: number
): WineKnowledgeMatch {
  const lower = rawName.toLowerCase();
  const yearMatch = rawName.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  const vintage =
    (yearMatch ? Number(yearMatch[1]) : undefined) ??
    fallbackVintage ??
    new Date().getFullYear() - 3;

  const matchedProducer = PRODUCER_PROFILES.find((p) =>
    p.aliases.some((alias) => lower.includes(alias.toLowerCase()))
  );

  const matchedAppellation =
    APPELLATION_PROFILES.find((a) =>
      a.aliases.some((alias) => lower.includes(alias.toLowerCase()))
    ) ??
    (matchedProducer
      ? APPELLATION_PROFILES.find((a) => a.key === matchedProducer.appellationKey)
      : undefined);

  const category =
    matchedProducer?.category ??
    matchedAppellation?.defaultCategory ??
    fallbackCategory;

  const vintageRegion: VintageRegionKey =
    matchedAppellation?.vintageRegion ??
    (category === 'sparkling' ? 'champagne' : 'other');

  const vintageNote = VINTAGE_CHRONICLE[vintageRegion]?.[vintage];

  const baseStructure = matchedAppellation?.structure ?? {
    body: 3,
    acidity: 3,
    tannin: category === 'red' ? 3 : 1,
    sweetness: category === 'dessert' ? 4 : 1,
    alcohol: 3,
  };

  return {
    canonicalNameKo: matchedProducer?.canonicalNameKo,
    canonicalNameEn: matchedProducer?.canonicalNameEn,
    producer: matchedProducer?.producer,
    vintage,
    category,
    varietalsKo: matchedProducer?.varietalsKo ?? matchedAppellation?.varietalsKo,
    varietalsEn: matchedProducer?.varietalsEn ?? matchedAppellation?.varietalsEn,
    regionKo: matchedAppellation?.regionKo,
    regionEn: matchedAppellation?.regionEn,
    countryCode: matchedAppellation?.countryCode,
    structure: matchedProducer?.structure
      ? { ...baseStructure, ...matchedProducer.structure }
      : matchedAppellation?.structure,
    aromas: matchedProducer?.aromas ?? matchedAppellation?.aromas,
    heavenClimateKo:
      vintageNote?.ko ??
      `${vintage}년 빈티지의 자연스러운 기후 결을 간직한 보틀입니다.`,
    heavenClimateEn:
      vintageNote?.en ??
      `Expresses the natural climate character of the ${vintage} vintage.`,
    earthSoilKo: matchedAppellation?.earthSoilKo,
    earthSoilEn: matchedAppellation?.earthSoilEn,
    humanPhilosophyKo: matchedProducer?.humanPhilosophyKo,
    humanPhilosophyEn: matchedProducer?.humanPhilosophyEn,
    wineryLocation:
      matchedProducer?.wineryLocation ?? matchedAppellation?.wineryLocation,
  };
}
