import type { WineItem } from '../types/sommelier';

export interface WineEncyclopediaEntry {
  id: string;
  eyebrowKo: string;
  eyebrowEn: string;
  headingKo: string;
  headingEn: string;
  bodyKo: string;
  bodyEn: string;
}

interface ProducerBio {
  match: string[];
  whyKo: string;
  whyEn: string;
  bioKo: string;
  bioEn: string;
}

const PRODUCER_BIOS: ProducerBio[] = [
  {
    match: ['pierre péters', '피에르 페테르', 'péters'],
    whyKo:
      '대형 상업 샴페인 하우스가 아닌, 오직 꼬뜨 데 블랑 그랑 크뤼 마을의 순수 샤르도네만을 직접 재배·양조하는(RM) 장인의 결정체를 찾는 테이블에 완벽합니다.',
    whyEn:
      'Crafted for guests seeking pure Grand Cru Côte des Blancs grower Champagne rather than commercial blend house volume.',
    bioKo:
      '1919년 가스파르 페테르가 르 메닐 쉬르 오제(Le Mesnil-sur-Oger)에서 자체 병입을 시작한 이래 6대째 가족 경영을 이어오고 있습니다. 현재 책임자인 로돌프 페테르(Rodolphe Péters)는 아비즈 양조 학교를 거쳐 2007년 부친 프랑수아의 뒤를 이었으며, 1988년부터 매년 수확한 리저브 와인을 솔레라처럼 이어가는 "페르페추얼 리저브" 저장고를 관리하며 날카로운 백악질 산도 속에 깊은 복합미를 새겨 넣습니다.',
    bioEn:
      'Founded in 1919 by Gaspar Péters in Grand Cru Le Mesnil-sur-Oger and family-run across six generations. Sixth-generation winemaker Rodolphe Péters, trained in Avize and taking full stewardship in 2007, maintains a famed perpetual reserve dating back to 1988.',
  },
  {
    match: ['billecart', '빌까르'],
    whyKo:
      '산뜻한 식전 샴페인을 넘어, 크림 소스나 육류 요리까지 힘 있게 받쳐줄 오크 발효 샴페인의 깊이를 원하실 때 최적입니다.',
    whyEn:
      'Delivers the rare structural breadth of 100% small oak fermentation capable of carrying rich cream sauces and poultry.',
    bioKo:
      '1818년 니콜라 프랑수아 빌까르와 엘리자베트 살몽의 결혼으로 마뢰유 쉬르 아이(Mareuil-sur-Aÿ)에 설립되어 7대째 가족 소유를 지켜온 명가입니다. 현 세대 마티외 롤랑-빌까르(Mathieu Roland-Billecart)는 과거 부르고뉴 작은 오크통(Sous Bois)에서 1차 발효하던 하우스의 전통 양조법을 복원해, 저온 장기 발효의 섬세한 기포와 토스티한 깊이를 동시에 끌어올렸습니다.',
    bioEn:
      'Established in 1818 in Mareuil-sur-Aÿ by Nicolas François Billecart and Élisabeth Salmon, remaining independent for seven generations. Seventh-generation head Mathieu Roland-Billecart champions classical vinification wholly in aged Burgundy barrels.',
  },
  {
    match: ['huet', '도멘 위트', '위트'],
    whyKo:
      '화학 비료나 인위적 보정 없이 루아르 강가 석회암 언덕의 순수한 생명력을 느끼고 싶은 미식가에게 가장 정직한 선택입니다.',
    whyEn:
      'The gold standard for zero-compromise biodynamic Loire sparkling that preserves crystalline chalk minerality.',
    bioKo:
      '1928년 빅토르 위트(Victor Huet)가 부브레 오-리외(Haut-Lieu) 포도밭을 매입하며 시작해, 레지스탕스 영웅이자 40년 넘게 부브레 시장을 역임한 아들 가스통 위트가 세계적 명성을 다졌습니다. 이후 사위 노엘 피게(Noël Pinguet)가 1990년대 프랑스 루아르 비오디나미 농법의 선구자로 토착 효모와 자연 발효 철학을 완성했습니다.',
    bioEn:
      'Founded in 1928 by Victor Huet at Le Haut-Lieu, expanded by iconic son Gaston Huet and transformed into a beacon of French biodynamic viticulture by Noël Pinguet in the 1990s.',
  },
  {
    match: ['dom pérignon', '돔 페리뇽'],
    whyKo:
      '가장 빛나는 기념일이나 격조 있는 자리에서 17개 그랑 크뤼 마을의 블렌딩과 10년 가까운 병숙성이 빚은 조화를 경험하실 수 있습니다.',
    whyEn:
      'Reserved exclusively for declared vintage years uniting 17 Grand Cru sites and nearly a decade on the lees.',
    bioKo:
      '17세기 오빌레 수도원(Abbaye d’Hautvillers)의 셀러 마스터 피에르 페리뇽 수사가 이룩한 블렌딩과 2차 발효 기술에서 유래했습니다. 수석 양조 책임자 뱅상 샤프롱(Vincent Chaperon)은 2019년 전임자 리샤르 조프루아(Richard Geoffroy)로부터 셀러의 키를 이어받아, 오직 최상의 작황이 허락된 해에만 빈티지를 선언하며 샤르도네의 광채와 피노 누아의 깊이 사이의 긴장감을 조율합니다.',
    bioEn:
      'Named after 17th-century Benedictine monk Dom Pierre Pérignon of Hautvillers Abbey. Chef de Cave Vincent Chaperon succeeded Richard Geoffroy in 2019, orchestrating Grand Cru parcels solely in exceptional vintage declarations.',
  },
  {
    match: ['salon', '살롱'],
    whyKo:
      '단 하나의 마을, 단 하나의 품종, 오직 위대한 해에만 생산되는 샴페인 역사상 가장 희귀한 블랑 드 블랑을 만나는 순간입니다.',
    whyEn:
      'A singular icon crafted from one village, one grape, and released only in the finest Champagne vintages.',
    bioKo:
      '모피 사업으로 부를 일군 유젠 에메 살롱(Eugène-Aimé Salon)이 파리 최고의 사교계와 친구들을 위해 1905년 르 메닐 쉬르 오제 1헥타르 포도밭에서 시작했습니다. 1921년 정식 상업 출시 이후 한 세기 동안 고작 40여 개 빈티지만 세상에 내놓았으며, 1988년 로랑 페리에 그룹 합류 이후에도 셀러 마스터 미셸 포코네와 디디에 드퐁이 말로락틱 발효를 배제한 장기 숙성 전통을 고수합니다.',
    bioEn:
      'Created in 1905 by Eugène-Aimé Salon from a single 1-hectare parcel in Le Mesnil-sur-Oger originally for private circle friends, producing just over 40 vintages in a century without malolactic fermentation.',
  },
  {
    match: ['sauzet', '소제', '퓔리니'],
    whyKo:
      '코트 드 본 화이트 와인의 정점인 퓔리니 몽라쉐 프리미에 크뤼가 선사하는 눈부신 부싯돌 미네랄과 헤이즐넛 질감을 보여줍니다.',
    whyEn:
      'Shows the razor-sharp flint minerality and satin intensity of Premier Cru Puligny-Montrachet at its most pure.',
    bioKo:
      '20세기 초 에티엔 소제(Étienne Sauzet)가 몇 헥타르의 밭으로 시작해 손녀 자닌과 사위 제라르 부도(Gérard Boudot)를 거치며 퓔리니 최고의 도멘으로 도약했습니다. 현재는 딸 에밀리와 사위 브누아 리포(Benoît Riffault)가 부르고뉴 5대 화이트 가문의 양조 노하우와 비오디나미 경작을 접목해 오크에 가리지 않는 순수한 떼루아 표현을 이끌고 있습니다.',
    bioEn:
      'Founded by Étienne Sauzet in the early 20th century, elevated to international renown by Gerard Boudot and now guided by Benoît Riffault and Émilie Boudot using biodynamic farming.',
  },
  {
    match: ['armailhac', '달마이약', 'lynch-bages', '린쉬 바주', 'gloria', '글로리아'],
    whyKo:
      '오랜 세월 검증된 보르도 좌안 메독 그랑 크뤼 가문의 정통 블렌딩으로, 육류의 마블링과 소스를 품격 있게 감싸 안습니다.',
    whyEn:
      'Classic Left Bank Médoc craftsmanship balancing dark cassis depth, cedar complexity, and structured tannin.',
    bioKo:
      '달마이약은 1750년 무통 로칠드와 이웃한 포이약 포도밭에서 출발해 1933년 바롱 필립 드 로칠드 남작이 인수한 뒤 무통 로칠드의 양조팀이 함께 관리하는 그랑 크뤼 클라세 5등급 샤또입니다. 린쉬 바주 역시 1939년 장 샤를 카즈(Jean-Charles Cazes)가 매입해 손자 장 샤를 카즈 주니어까지 4대째 포이약 바주 언덕의 깊은 자갈층에서 응축미 넘치는 클래식을 이어가고 있습니다.',
    bioEn:
      'Neighboring Mouton Rothschild in Pauillac since the 18th century, these family-stewarded Left Bank estates combine deep Garonne gravel terroir with multi-generational Bordeaux cellar mastery.',
  },
  {
    match: ['bichot', '알베르 비쇼', 'boillot', '부아조', 'vacheron', '바쉐론', 'pépière', '페피에르', 'méo', '메오'],
    whyKo:
      '구획별 미세한 지질 차이를 가장 섬세하게 유리잔에 옮겨 담는 정통 프랑스 가족 도멘의 정직한 떼루아 와인입니다.',
    whyEn:
      'Site-specific French domaine winemaking focused on parcel transparency rather than heavy oak extraction.',
    bioKo:
      '1831년 베르나르 비쇼가 몽톨리에에서 창립해 6대째 알베릭 비쇼가 이끄는 본(Beaune)의 명가 비쇼부터, 샹볼 뮈지니와 볼네의 앙리 부아조, 그리고 상세르에서 루아르 비오디나미를 개척한 장-로랑·장-도미니크 바쉐론 형제까지 모두 선대로부터 물려받은 구획의 생물 다양성과 토착 효모 발효를 통해 땅의 목소리를 순수하게 전하는 가문들입니다.',
    bioEn:
      'Historic French family domaines—spanning Albert Bichot (est. 1831), Henri Boillot, and Sancerre biodynamic trailblazer Domaine Vacheron—dedicated to low-intervention parcel precision.',
  },
  {
    match: ['tignanello', '티냐넬로', 'antinori', '안티노리'],
    whyKo:
      '이탈리아 와인의 역사를 바꾼 슈퍼 투스칸의 원조로, 26대 가문이 이어온 토스카나 산지오베제와 보르도 품종의 황금 비율을 선사합니다.',
    whyEn:
      'The groundbreaking Super Tuscan pioneer blending hillside Sangiovese brilliance with sculpted Cabernet structure.',
    bioKo:
      '1385년 조반니 디 피에로 안티노리가 피렌체 길드에 가입한 이래 무려 26대, 630년 넘게 와인을 빚어온 안티노리 가문의 혁명작입니다. 1971년 피에로 안티노리(Piero Antinori) 후작이 전설적 양조가 자코모 타키스(Giacomo Tachis)와 손잡고 키안티 클라시코 최초로 청포도를 빼고 카베르네 소비뇽과 프렌치 바리크 숙성을 도입하며 이탈리아 고급 와인의 새 지평을 열었습니다.',
    bioEn:
      'Created in 1971 by Marchese Piero Antinori alongside legendary oenologist Giacomo Tachis, marking the 26-generation Antinori family’s bold departure from rigid Chianti blending laws.',
  },
  {
    match: ['radikon', '라디콘'],
    whyKo:
      '인위적인 청징·여과와 이산화황 첨가를 거부하고 껍질과 긴 시간 호흡시켜 빚어낸 오렌지 와인의 살아있는 고전입니다.',
    whyEn:
      'A benchmark of long skin-contact maceration without chemical manipulation, bringing savory amber complexity.',
    bioKo:
      '이탈리아 동북단 슬로베니아 국경 마을 오슬라비아(Oslavia)에서 스탄코 라디콘(Stanko Radikon)이 1979년 아버지의 밭을 물려받으며 시작했습니다. 스탄코는 1995년 껍질을 며칠~수주간 함께 침용해 발효하는 조상들의 방식을 부활시켰고, 현재 아들 사샤 라디콘(Saša Radikon)이 슬라보니아 대형 오크통 장기 숙성과 이산화황 무첨가 철학을 이어가고 있습니다.',
    bioEn:
      'Pioneered by Stanko Radikon in Oslavia (Friuli) starting in 1979 and carried forward by his son Saša, fermenting white grapes on their skins in open vats and aging in large Slavonian oak botti.',
  },
  {
    match: ['duckhorn', '덕혼'],
    whyKo:
      '카베르네 소비뇽의 그늘에 가려졌던 메를로를 나파 밸리 최상급 싱글 품종 와인으로 끌어올린 미국 럭셔리 와인의 상징입니다.',
    whyEn:
      'The historic Napa estate that elevated Merlot into an icon of plush, structured California fine wine.',
    bioKo:
      '1976년 댄 덕혼과 마거릿 덕혼 부부가 세인트 헬레나의 빅터 호(Victor Ho) 농가와 손잡고 "부드럽고 매혹적인 메를로도 위대한 레드 와인이 될 수 있다"는 신념으로 단 800케이스로 출발했습니다. 수석 양조가 르네 아리(Renée Ary)는 세인트 헬레나에서 루더포드까지 나파 Valley 여러 미기후 밭을 블렌딩해 비단 같은 질감과 생동감 있는 블랙 체리 풍미를 조율합니다.',
    bioEn:
      'Founded in 1976 by Dan and Margaret Duckhorn in St. Helena with just 800 cases of Merlot; today head winemaker Renée Ary crafts plush yet poised Napa Valley benchmarks.',
  },
];

function findProducerBio(wine: WineItem): ProducerBio | undefined {
  const hay = `${wine.nameKo} ${wine.nameEn} ${wine.producer}`.toLowerCase();
  return PRODUCER_BIOS.find((p) => p.match.some((m) => hay.includes(m)));
}

function getRegionEncyclopedia(wine: WineItem): {
  regionTitleKo: string;
  regionTitleEn: string;
  regionDescKo: string;
  regionDescEn: string;
  appellationTitleKo: string;
  appellationTitleEn: string;
  appellationDescKo: string;
  appellationDescEn: string;
} {
  const hay = `${wine.regionKo} ${wine.regionEn} ${wine.nameKo} ${wine.nameEn}`.toLowerCase();

  if (hay.includes('champagne') || hay.includes('샹파뉴') || hay.includes('mesnil') || hay.includes('aÿ')) {
    return {
      regionTitleKo: 'Champagne · 샹파뉴',
      regionTitleEn: 'Champagne, Northern France',
      regionDescKo:
        '샹파뉴는 라틴어 "캠파니아(Campania, 열린 들판)"에서 유래한 프랑스 최북단 고급 와인 산지입니다. 서늘한 대륙성·해양성 교차 기후 덕분에 포도가 천천히 익으며, 수확한 스틸 베이스 와인이 2차 병발효를 거쳐 폭발적이면서도 정교한 탄산과 높은 산도를 유지하는 지구상 가장 독보적인 스파클링 산지입니다.',
      regionDescEn:
        'Champagne is France’s northernmost fine wine region, where cool temperatures preserve high natural acidity essential for traditional-method second fermentation and decades-long lees aging.',
      appellationTitleKo: 'Champagne AOC · 벨렘나이트 백악질 토양',
      appellationTitleEn: 'Champagne AOC · Belemnite Chalk Subsoil',
      appellationDescKo:
        '1936년 프랑스 원산지 통제 명칭(AOC) 지정 시 엄격한 생산량 제한, 수확 방식(전량 손 수확), 최소 병숙성 기간(논빈티지 15개월·빈티지 36개월 이상)을 법으로 못 박았습니다. 수천만 년 전 바다 생물 화석이 굳어 형성된 깊은 백악질(Chalk) 층은 배수가 탁월하면서도 가뭄 때 수분을 머금어 와인에 전류처럼 찌릿한 짠맛과 분필 미네랄을 각인시킵니다.',
      appellationDescEn:
        'Protected since 1936 with mandatory hand harvesting and extended lees aging; fossilized marine chalk subsoils regulate moisture and impart hallmark crystalline salinity.',
    };
  }

  if (hay.includes('bordeaux') || hay.includes('보르도') || hay.includes('pauillac') || hay.includes('포이약') || hay.includes('sauternes') || hay.includes('소테른') || hay.includes('saint-julien')) {
    return {
      regionTitleKo: 'Bordeaux · 보르도 지롱드 좌안',
      regionTitleEn: 'Bordeaux Left Bank & Gironde',
      regionDescKo:
        '대서양의 따뜻한 멕시코 만류와 랑드(Landes) 소나무 숲의 보호 덕분에 보르도는 온화한 해양성 기후를 누립니다. 지롱드 강을 따라 빙하기 때 알프스·피레네에서 흘러 내려온 깊은 자갈(Graves) 언덕이 태양열을 낮 동안 머금었다 밤에 방출해 만생종 카베르네 소비뇽이 완벽히 완숙하도록 돕습니다.',
      regionDescEn:
        'Sheltered by Atlantic pine forests along the Gironde estuary, deep glacial gravel terraces store daytime warmth to ripen late-harvesting Cabernet Sauvignon and Sémillon cleanly.',
      appellationTitleKo: 'Médoc / Graves AOC · 1855 그랑 크뤼 클라세',
      appellationTitleEn: 'Bordeaux AOC · 1855 Classification & Gravel',
      appellationDescKo:
        '나폴레옹 3세 파리 만국박람회를 위해 1855년 제정된 보르도 그랑 크뤼 등급 체계는 세계에서 가장 영향력 있는 품질 지표입니다. 자갈 아래 단단한 점토·석회암 기층이 자리한 구릉에서는 단단한 타닌 구조와 흑연, 삼나무 향이 돋보이며, 시론 강과 가론 강이 만나는 소테른에서는 아침 물안개와 오후 햇살이 고귀한 귀부균(Botrytis)을 피워냅니다.',
      appellationDescEn:
        'Governed by strict AOC blending traditions and the historic 1855 Classification; deep gravel topsoils yield structured cassis and cedar poise, while Sauternes morning mists foster noble rot.',
    };
  }

  if (hay.includes('bourgogne') || hay.includes('부르고뉴') || hay.includes('burgundy') || hay.includes('meursault') || hay.includes('puligny') || hay.includes('chablis')) {
    return {
      regionTitleKo: 'Bourgogne · 부르고뉴 코트 도르 & 샤블리',
      regionTitleEn: 'Bourgogne (Côte d’Or & Chablis)',
      regionDescKo:
        '부르고뉴는 "와인은 땅의 번역가"라는 명제를 탄생시킨 성지입니다. 수백 미터 간격으로 사면의 각도와 석회질 비율이 달라지며, 꼬뜨 드 뉘의 우아한 레드부터 꼬뜨 드 본(뫼르소·퓔리니 몽라쉐)의 농밀한 화이트, 북부 샤블리의 칼날 같은 미네랄까지 극도로 세분화된 떼루아 모자이크를 이룹니다.',
      regionDescEn:
        'Bourgogne epitomizes parcel-driven viticulture, where subtle shifts in limestone slope aspect separate Grand Cru intensity from Premier Cru tension and village delicacy.',
      appellationTitleKo: 'Bourgogne AOC · 클리마(Climat)와 석회질 이회토',
      appellationTitleEn: 'Bourgogne AOC · UNESCO Climats & Limestone',
      appellationDescKo:
        '2015년 유네스코 세계문화유산으로 등재된 부르고뉴의 "클리마(Climat)" 체계는 단일 포도밭 구획의 지질·미기후·양조 역사를 법적 등급(레지오날 → 빌라주 → 프리미에 크뤼 → 그랑 크뤼)으로 보호합니다. 쥐라기 시대의 키메리지안(Kimmeridgian) 해양 석회암과 이회토가 화이트에는 짭짤한 조개껍질 미네랄을, 레드에는 섬세한 붉은 과실과 비단 타닌을 선사합니다.',
      appellationDescEn:
        'UNESCO-recognized Climats enforce strict site boundaries and yields; Jurassic Kimmeridgian limestone and marl deliver crystalline minerality and silky red-fruited transparency.',
    };
  }

  if (hay.includes('loire') || hay.includes('루아르') || hay.includes('sancerre') || hay.includes('상세르') || hay.includes('vouvray') || hay.includes('부브레')) {
    return {
      regionTitleKo: 'Val de Loire · 프랑스 최장 강가의 다채로운 정원',
      regionTitleEn: 'Loire Valley, France',
      regionDescKo:
        '프랑스에서 가장 긴 루아르 강을 따라 서쪽 대서양 연안의 낭트(뮈스카데)부터 중부 투렌·부브레(슈냉 블랑), 동부 상세르(소비뇽 블랑)까지 1,000km에 걸쳐 펼쳐진 산지입니다. 서늘한 북위 경계선에서 강물이 서리를 완화해 주어 생동감 넘치는 높은 산도와 청아한 과실미가 뛰어납니다.',
      regionDescEn:
        'Stretching from the Atlantic coast at Nantes to central Vouvray and eastern Sancerre, river moderation creates energetic, high-acid wines celebrated at culinary tables worldwide.',
      appellationTitleKo: 'Loire AOC · 튀포(Tuffeau) 백악질 & 화강암',
      appellationTitleEn: 'Loire AOC · Tuffeau Chalk, Flint & Granite',
      appellationDescKo:
        '부브레와 투렌에서는 루아르의 고성들을 지은 밝은 백악질 석회암 "튀포(Tuffeau)"가 기포의 섬세함과 꿀·배 풍미를 키우며, 상세르의 "카유트(Caillottes)" 자갈과 "실렉스(Silex, 부싯돌)" 토양은 날카로운 부싯돌 스모크를, 낭트 뮈스카데의 고대 화강암 토양은 순수한 바다 내음을 만듭니다.',
      appellationDescEn:
        'Distinctive regional bedrocks—Vouvray’s luminous Tuffeau chalk, Sancerre’s flinty Silex, and Muscadet’s igneous granite—impart crisp geological precision.',
    };
  }

  if (hay.includes('toscana') || hay.includes('토스카나') || hay.includes('piemonte') || hay.includes('피에몬테') || hay.includes('friuli') || hay.includes('프리울리')) {
    return {
      regionTitleKo: 'Italia · 토스카나 · 피에몬테 · 프리울리의 장인 산지',
      regionTitleEn: 'Italian Historic Hillside Appellations',
      regionDescKo:
        '이탈리아 와인은 알프스와 아펜니노 산맥의 고도차, 그리고 지중해·아드리아 해풍이 어우러진 구릉 밭에서 태어납니다. 식사와 함께 마시며 입맛을 돋우도록 설계된 특유의 짭조름한 미네랄과 탄탄한 산도 구조가 이탈리아 와인만의 매력입니다.',
      regionDescEn:
        'Shaped by Alpine/Apennine elevation and Mediterranean breezes, classic Italian hillside appellations pair bright savory acidity directly with fine cuisine.',
      appellationTitleKo: 'IGT Toscana / DOCG · 갈레스트로 & 폰카(Ponca) 토양',
      appellationTitleEn: 'IGT & DOCG · Galestro, Marl & Ponca',
      appellationDescKo:
        '전통 DOC/DOCG 규정을 넘어 1970년대 피에로 안티노리 후작 등이 주도한 IGT 등급은 산지오베제와 국제 품종의 창의적 블렌딩을 합법화하며 "슈퍼 투스칸" 시대를 열었습니다. 부서지기 쉬운 토스카나 편암성 갈레스트로(Galestro)와 프리울리 오슬라비아의 해양 석회 사암(Ponca)은 뿌리가 깊게 파고들어 응축된 미네랄을 빚어냅니다.',
      appellationDescEn:
        'From Chianti’s friable Galestro schist to Friuli’s Ponca sandstone marl, these mineral-rich hillsides support expressive heritage varieties and modern IGT icons.',
    };
  }

  return {
    regionTitleKo: `${wine.regionKo} · 프리미엄 와인 테루아`,
    regionTitleEn: `${wine.regionEn} Terroir`,
    regionDescKo:
      `${wine.regionKo} 지역은 낮 동안의 풍부한 일조량과 밤 시간의 급격한 기온 하강(일교차)이 조화를 이루어, 포도가 향기 물질과 페놀을 충분히 성숙시키면서도 산도의 긴장감을 잃지 않는 천혜의 환경입니다.`,
    regionDescEn:
      `${wine.regionEn} pairs generous daytime sunshine with cool diurnal shifts that build concentrated aromatics while locking in poised natural freshness.`,
    appellationTitleKo: '산지 등급 체계 · 지질학적 특성',
    appellationTitleEn: 'Appellation Standards & Soil Profile',
    appellationDescKo:
      wine.storytelling.earthSoilKo ||
      '배수가 원활한 자갈·석회·화산암 계열의 척박한 토양은 포도나무의 수세를 자연스럽게 억제해 알이 작고 농축미가 뛰어난 고품질 열매를 맺게 합니다.',
    appellationDescEn:
      wine.storytelling.earthSoilEn ||
      'Well-draining, low-fertility mineral subsoils naturally restrict vigor, yielding small berries packed with structural complexity.',
  };
}

function getVarietalEncyclopedia(wine: WineItem): {
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
} {
  const hay = `${wine.varietalsKo} ${wine.varietalsEn}`.toLowerCase();

  if (hay.includes('샤르도네') || hay.includes('chardonnay')) {
    return {
      titleKo: `Chardonnay · ${wine.varietalsKo}`,
      titleEn: wine.varietalsEn,
      descKo:
        '샤르도네는 양조자의 철학과 산지 토양을 가장 투명하게 비추는 "테루아의 거울" 같은 품종입니다. 서늘한 석회질 산지에서는 청사과·유자·젖은 분필의 예리한 긴장감으로 표현되고, 리즈 숙성과 프렌치 오크 터치가 더해지면 구운 브리오슈, 헤이즐넛, 크리미한 실크 질감을 겹겹이 드러내며 장기 숙성 잠재력을 발휘합니다.',
      descEn:
        'Chardonnay acts as a transparent lens of terroir and cellar craft—spanning razor-sharp citrus and wet chalk in limestone climates to toasted brioche and hazelnut cream when matured on fine lees.',
    };
  }
  if (hay.includes('피노 누아') || hay.includes('pinot noir')) {
    return {
      titleKo: `Pinot Noir · ${wine.varietalsKo}`,
      titleEn: wine.varietalsEn,
      descKo:
        '껍질이 얇고 기후 변화에 극도로 예민해 "변덕스럽지만 가장 고귀한 품종"으로 불립니다. 무거운 색소나 거친 타닌 대신 붉은 체리·산딸기·장미 꽃잎의 섬세한 아로마가 투명하게 피어나며, 병숙성을 거치면서 트러플·젖은 낙엽·부드러운 가죽의 복합적인 실키함으로 진화해 요리의 미세한 감칠맛과 충돌하지 않습니다.',
      descEn:
        'Thin-skinned and acutely sensitive to site nuance, Pinot Noir favors aromatic transparency—red cherry, wild rose, and silky tannin—evolving gracefully into forest floor and truffle.',
    };
  }
  if (hay.includes('카베르네') || hay.includes('cabernet') || hay.includes('메를로') || hay.includes('merlot')) {
    return {
      titleKo: `Bordeaux Varietals · ${wine.varietalsKo}`,
      titleEn: wine.varietalsEn,
      descKo:
        '두꺼운 껍질에서 추출되는 풍부한 안토시아닌과 단단한 타닌 골격 덕분에 장기 숙성 잠재력이 가장 뛰어난 레드 품종군입니다. 블랙커런트·검은 자두·삼나무·흑연의 선 굵은 풍미가 특징이며, 메를로가 블렌딩될 경우 자두의 벨벳 같은 감미로움이 보태져 그릴 스테이크·양갈비·한우 구이 지방과 혀끝에서 완벽한 균형을 이룹니다.',
      descEn:
        'Thick-skinned varieties offering deep cassis, graphite, and cedar structure, balanced by Merlot’s plush plum texture—crafted to slice cleanly through rich marbled meats.',
    };
  }
  if (hay.includes('슈냉') || hay.includes('chenin') || hay.includes('소비뇽') || hay.includes('sauvignon') || hay.includes('믈롱') || hay.includes('melon')) {
    return {
      titleKo: `Crisp Aromatic Whites · ${wine.varietalsKo}`,
      titleEn: wine.varietalsEn,
      descKo:
        '천연 산도가 높아 수확 후에도 활기찬 뼈대를 오랫동안 잃지 않는 화이트 품종입니다. 레몬 껍질·흰 복숭아·아카시아 꽃·신선한 허브 향이 입안을 깔끔하게 씻어주며, 효모 앙금과 함께 숙성(Sur Lie)하면 해산물·갑각류의 바다 내음을 완벽히 감싸는 짭조름한 여운이 살아납니다.',
      descEn:
        'High natural acidity gives crystal-clear lime zest, orchard pear, and herbal lift; lees contact builds savory breadth suited to delicate shellfish and coastal cuisine.',
    };
  }

  return {
    titleKo: wine.varietalsKo,
    titleEn: wine.varietalsEn,
    descKo:
      `${wine.varietalsKo} 품종은 해당 산지의 토양 성분을 충실히 흡수해 바디감(${wine.structure.body}/5)과 산도(${wine.structure.acidity}/5)의 조화를 빚어내며, 식사의 흐름에 따라 온도와 디캔팅 시간에 반응해 다층적인 향을 열어줍니다.`,
    descEn:
      `${wine.varietalsEn} expresses balanced structure (body ${wine.structure.body}/5, acidity ${wine.structure.acidity}/5), unfolding nuanced aromatics as it breathes in the glass.`,
  };
}

function getVintageEncyclopedia(wine: WineItem): {
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
} {
  const y = wine.vintage || 2021;
  let climateDetailKo =
    '봄의 알맞은 수분 공급과 여름·수확기의 안정적인 일교차가 맞물려 과실의 당도와 산도가 균형을 이룬 건강한 작황입니다.';
  let climateDetailEn =
    'Balanced spring moisture and steady late-summer warmth yielded harmonious ripeness and crisp natural acidity.';

  if (y === 1996) {
    climateDetailKo =
      '1996년은 와인 역사상 "높은 당도와 극도로 날카로운 산도가 한 해에 공존한 기적의 빈티지"로 손꼽힙니다. 9월의 차갑고 건조한 북동풍이 수확 직전 포도 산도를 끌어올려, 25년 이상 흐른 지금도 놀라운 활력과 장기 숙성력을 과시합니다.';
    climateDetailEn =
      'Revered as a legendary tension vintage uniting lofty sugar levels with bracing malic acidity, giving unmatched longevity even decades past harvest.';
  } else if (y === 2013 || y === 2014) {
    climateDetailKo =
      `${y}년은 늦은 개화와 서늘했던 여름 끝에 9월~10월의 화창하고 건조한 가을 햇살이 반전을 일궈낸 "클래식 레이트 하베스트" 빈티지입니다. 무작정 묵직하기보다 선이 가늘고 정교한 산미와 짭짤한 미네랄리티가 돋보여 미식가들의 극찬을 받습니다.`;
    climateDetailEn =
      `${y} stands as a classic late-harvest vintage saved by a dry, golden autumn—celebrated by critics for taut precision, mineral clarity, and graceful aging.`;
  } else if (y === 2015 || y === 2016 || y === 2018) {
    climateDetailKo =
      `${y}년은 풍성하고 따뜻한 여름 햇살이 포도의 폴리페놀과 과실 당도를 완벽하게 성숙시킨 "위대한 풍요의 해"입니다. 수확 시 껍질이 단단하고 과즙이 응축되어, 처음 오픈했을 때부터 벨벳처럼 매끄러운 질감과 웅장한 스케일을 보여주며 동시에 장기 보관도 뛰어난 수작입니다.`;
    climateDetailEn =
      `${y} delivered generous summer sunshine and full phenolic maturity, producing plush fruit concentration, supple tannin, and impressive cellar potential.`;
  } else if (y === 2019 || y === 2020) {
    climateDetailKo =
      `${y}년은 기록적인 여름 온기 속에서도 서늘한 밤 기온과 석회·자갈 토양의 보수력 덕분에 알코올이 튀지 않고 농축미와 신선함이 절묘하게 교차한 현대적 명품 빈티지입니다. 집중력 있는 구조와 맑은 과실미가 훌륭히 어우러집니다.`;
    climateDetailEn =
      `${y} combines sunny concentration with unexpected freshness and structural tension—widely praised as a modern benchmark balance vintage.`;
  } else if (y >= 2021) {
    climateDetailKo =
      `${y}년은 과거 클래식한 유럽 기후를 연상시키는 선선하고 우아한 해로, 지나치게 높지 않은 알코올과 생동감 넘치는 산도·투명한 아로마가 돋보입니다. 음식과 곁들였을 때 입안을 개운하게 정돈해 주는 가벼우면서도 깊은 미식 친화적 빈티지입니다.`;
    climateDetailEn =
      `${y} echoes a cooler, classically proportioned European harvest—moderate alcohol, vivid aromatic lift, and crisp gastronomic acidity.`;
  }

  return {
    titleKo: `${y} Vintage · ${wine.regionKo}`,
    titleEn: `${y} Vintage · ${wine.regionEn}`,
    descKo: `${wine.storytelling.heavenClimateKo} ${climateDetailKo}`,
    descEn: `${wine.storytelling.heavenClimateEn} ${climateDetailEn}`,
  };
}

/**
 * Generates 6 structured deep-dive Sommelier Pro encyclopedia entries
 * (Producer Philosophy, Maker Biography, Region Terroir, Appellation & Soil,
 *  Varietal Character, and Vintage Climate) with rich multi-paragraph detail.
 */
export function buildWineEncyclopedia(wine: WineItem): WineEncyclopediaEntry[] {
  const bio = findProducerBio(wine);
  const reg = getRegionEncyclopedia(wine);
  const varInfo = getVarietalEncyclopedia(wine);
  const vinInfo = getVintageEncyclopedia(wine);

  const fallbackWhyKo = `${wine.producer}가 추구하는 정교한 양조 철학(${wine.serving.statusKo})을 가장 선명하게 체감할 수 있는 대표 큐베로, 오늘 주문하신 요리의 결에 완벽한 구조적 대칭을 이룹니다.`;
  const fallbackWhyEn = `A flagship expression of ${wine.producer}’s cellar style (${wine.serving.statusEn}), bringing structured precision to tonight’s cuisine.`;

  const fallbackBioKo = `${wine.producer}는 ${wine.regionKo} 구획의 고유한 미세 기후와 지질을 보존하는 데 집중해 온 하우스입니다. ${wine.storytelling.humanPhilosophyKo} ${wine.storytelling.vinificationKo} 인위적인 오크 향이나 과도한 추출을 피하고, 포도밭에서 시작된 에너지가 병 안에서 오랜 시간 우아하게 숙성되도록 꼼꼼하게 빚어냅니다.`;
  const fallbackBioEn = `${wine.producer} farms site-expressive parcels in ${wine.regionEn}. ${wine.storytelling.humanPhilosophyEn} ${wine.storytelling.vinificationEn}`;

  return [
    {
      id: 'producer_why',
      eyebrowKo: '생산자 · 왜 이 와인인가',
      eyebrowEn: 'Producer · Why This Bottle',
      headingKo: wine.producer || (wine.nameKo.split(' ')[0] ?? wine.nameKo),
      headingEn: wine.producer || wine.nameEn,
      bodyKo: bio ? bio.whyKo : fallbackWhyKo,
      bodyEn: bio ? bio.whyEn : fallbackWhyEn,
    },
    {
      id: 'producer_bio',
      eyebrowKo: '생산자의 일대기 · 양조 역사',
      eyebrowEn: 'Maker Biography & Lineage',
      headingKo: `${wine.producer} 가문과 양조 철학`,
      headingEn: `${wine.producer} Heritage`,
      bodyKo: bio ? bio.bioKo : fallbackBioKo,
      bodyEn: bio ? bio.bioEn : fallbackBioEn,
    },
    {
      id: 'region',
      eyebrowKo: '지역 특징 · 산지 테루아',
      eyebrowEn: 'Region & Climate Profile',
      headingKo: reg.regionTitleKo,
      headingEn: reg.regionTitleEn,
      bodyKo: reg.regionDescKo,
      bodyEn: reg.regionDescEn,
    },
    {
      id: 'appellation',
      eyebrowKo: '원산지 법규 · 등급 & 토양',
      eyebrowEn: 'Appellation Laws & Geology',
      headingKo: reg.appellationTitleKo,
      headingEn: reg.appellationTitleEn,
      bodyKo: `${reg.appellationDescKo} ${wine.storytelling.earthSoilKo}`,
      bodyEn: `${reg.appellationDescEn} ${wine.storytelling.earthSoilEn}`,
    },
    {
      id: 'varietal',
      eyebrowKo: '포도 품종 특징',
      eyebrowEn: 'Varietal Expression',
      headingKo: varInfo.titleKo,
      headingEn: varInfo.titleEn,
      bodyKo: varInfo.descKo,
      bodyEn: varInfo.descEn,
    },
    {
      id: 'vintage',
      eyebrowKo: '빈티지 기후 · 해의 특징',
      eyebrowEn: 'Vintage Climate & Harvest',
      headingKo: vinInfo.titleKo,
      headingEn: vinInfo.titleEn,
      bodyKo: vinInfo.descKo,
      bodyEn: vinInfo.descEn,
    },
  ];
}
