import type { WineItem } from '../types/sommelier';

export interface WineEncyclopediaEntry {
  id: 'why' | 'appellation' | 'varietal' | 'heaven' | 'earth' | 'human';
  pillarKind: 'commentary' | 'story';
  eyebrowKo: string;
  eyebrowEn: string;
  headingKo: string;
  headingEn: string;
  bodyKo: string;
  bodyEn: string;
}

interface ProducerRichDetail {
  match: string[];
  whyKo: string;
  whyEn: string;
  humanBioKo: string;
  humanBioEn: string;
  earthParcelKo?: string;
  earthParcelEn?: string;
}

const PRODUCER_DETAILS: ProducerRichDetail[] = [
  {
    match: ['pierre péters', '피에르 페테르', 'péters'],
    whyKo:
      '대형 네고시앙 샴페인 하우스가 전 세계 시장에서 일관된 맛을 내기 위해 수십 개 마을의 포도를 매입해 블렌딩하는 것과 달리, 피에르 페테르는 오직 꼬뜨 데 블랑(Côte des Blancs) 그랑 크뤼 마을의 자가 소유 밭에서 직접 수확한 샤르도네만을 사용(RM, Récoltant-Manipulant)하는 장인 하우스입니다.\n\n특히 대표 퀴베인 "퀴베 드 레제르브"에는 1988년 빈티지부터 매년 수확한 리저브 와인을 대형 오크 푸드르와 콘크리트 탱크에서 솔레라 방식으로 이어 숙성해 온 "페르페추얼 리저브(Perpetual Reserve)"가 약 40~50% 블렌딩됩니다. 이 덕분에 단일 해의 산뜻한 시트러스 생동감과 수십 년 묵은 리저브의 구운 아몬드·브리오슈·짭짤한 미네랄이 한 병 안에서 완벽히 공존합니다.',
    whyEn:
      'Unlike large négociant champagne houses that purchase fruit from dozens of villages to build scale, Pierre Péters is a pure Côte des Blancs grower-producer (RM) bottling exclusively Chardonnay from family-owned Grand Cru parcels.\n\nRoughly 40–50% of the Cuvée de Réserve draws upon their celebrated Perpetual Reserve started in 1988, seamlessly uniting bright current-vintage tension with multi-decade toasted brioche and hazelnut depth.',
    humanBioKo:
      '페테르 가문이 르 메닐 쉬르 오제(Le Mesnil-sur-Oger)에서 포도 농사를 시작한 것은 1858년이지만, 가스파르 페테르(Gaspar Péters)가 직접 자신의 이름으로 샴페인을 병입하기 시작한 것은 1919년입니다. 아들 카미유와 손자 프랑수아 페테르가 르 메닐 최고의 구획들을 매입하며 도멘의 반석을 다졌고, 2007년부터는 6대손 로돌프 페테르(Rodolphe Péters)가 하우스를 이끌고 있습니다.\n\n로돌프는 샹파뉴 아비즈(Avize) 양조 대학에서 포도재배와 양조학을 전공한 뒤, 불필요한 말로락틱(젖산) 발효 억제나 과도한 오크 사용 없이 "토양이 스스로 말하게 둔다"는 철학을 실천하고 있습니다. 그는 스테인리스 스틸 발효로 1차 과실의 순수성을 지키면서도, 리즈(죽은 효모) 위에서 최소 3년 이상 천천히 숙성한 뒤 극소량의 도사주(당분 보정, 5g/L 이하)만 더해 백악질의 진수를 전달합니다.',
    humanBioEn:
      'Though the Péters family farmed in Le Mesnil-sur-Oger since 1858, Gaspar Péters began estate bottling in 1919. Across six generations, grandson François amassed premier Grand Cru parcels before handing the reins in 2007 to his son Rodolphe Péters.\n\nTrained at the Lycée Viticole in Avize, Rodolphe ferments parcels separately in temperature-controlled vats and ages the reserve perpetually, bottling with low dosage (<5 g/L) so pure chalk salinity remains unmasked.',
    earthParcelKo:
      '르 메닐 쉬르 오제, 아비즈, 크라망, 오제 등 꼬뜨 데 블랑 최정예 4개 그랑 크뤼 마을에 걸친 19헥타르(약 5만 7천 평) 구획에서 자랍니다. 지표면 바로 아래 20~30cm 표토만 지나면 약 7천만 년 전 백악기 바다 미생물 화석이 굳어 형성된 두꺼운 "벨렘나이트(Belemnite) 백악질" 암반이 수십 미터 깊이로 이어져 있습니다.\n\n이 하얀 백악질은 폭우가 내려도 물을 빠르게 지하로 흘려보내 뿌리가 썩지 않게 하면서도, 스펀지처럼 미세 공극에 수분을 머금어 가뭄이 드는 여름에도 포도나무에 미네랄 수분을 꾸준히 공급합니다. 동향 사면이 아침 햇살을 부드럽게 받아 서늘한 산도를 유지하면서도 짭짤한 혀끝의 조개껍질 미네랄리티를 각인시킵니다.',
    earthParcelEn:
      'Spanning 19 hectares across Grand Cru Le Mesnil-sur-Oger, Oger, Cramant, and Avize, vines sink roots through shallow topsoil straight into deep Cretaceous Belemnite chalk.\n\nActing as a subterranean reservoir, this porous limestone drains sudden rains yet sustains steady moisture in dry summers, sculpting crystalline salinity and taut minerality.',
  },
  {
    match: ['billecart', '빌까르'],
    whyKo:
      '일반 샴페인이 식전주나 가벼운 해산물에만 어울린다는 고정관념을 깨기 위해 탄생한 "미식 테이블 전용" 퀴베입니다. 와인명 속 "수 부아(Sous Bois)"는 "나무(오크통) 아래에서"라는 뜻으로, 스테인리스 스틸이 보편화되기 전인 1950년대 이전의 전통 양조 방식인 100% 작은 오크 배럴 1차 발효를 부활시켰습니다.\n\n미세한 산소 접촉 덕분에 기포가 입안에서 한결 크리미하고 부드럽게 감기며, 구운 헤이즐넛·브리오슈·말린 살구와 은은한 스파이스가 층층이 피어나 트러플, 닭고기 구이, 크림 소스 심지어 송아지 요리까지 여유롭게 받아냅니다.',
    whyEn:
      'Created explicitly for fine dining rather than fleeting aperitif sipping, "Sous Bois" translates to "under wood"—reviving pre-1950s vinification 100% inside aged Burgundy oak barrels.\n\nMicro-oxygenation softens the mousse into satin texture while weaving toasted hazelnut, baked brioche, and spice around creamy sauces and roasted poultry.',
    humanBioKo:
      '1818년 니콜라 프랑수아 빌까르(Nicolas François Billecart)가 샹파뉴 명문가 출신 엘리자베트 살몽(Élisabeth Salmon)과 결혼하면서 마뢰유 쉬르 아이(Mareuil-sur-Aÿ)에 하우스를 세웠습니다. 200년이 넘는 세월 동안 거대 럭셔리 그룹에 매각되지 않고 무려 7대째 직계 가족이 독립 경영을 지켜온 드문 샹파뉴 명가입니다.\n\n1950년대 당시 장 롤랑-빌까르가 저온 침전 정제(Cold Settling)와 장기 저온 발효 기술을 도입하며 하우스 특유의 깨끗하고 순수한 과실미를 확립했고, 2019년부터 7대손 마티외 롤랑-빌까르(Mathieu Roland-Billecart)가 키를 잡아 "전통 오크 숙성과 현대적 정밀함의 공존"을 실현하고 있습니다.',
    humanBioEn:
      'Founded in 1818 upon the marriage of Nicolas François Billecart and Élisabeth Salmon in Mareuil-sur-Aÿ, the house has remained fiercely family-owned across seven unbroken generations.\n\nSince 2019, seventh-generation CEO Mathieu Roland-Billecart upholds Jean Roland-Billecart’s cold-settling precision alongside classic small-cask fermentation.',
  },
  {
    match: ['huet', '도멘 위트', '위트'],
    whyKo:
      '샹파뉴의 반값 이하 가격으로 그랑 크뤼 샴페인 못지않은 복합미와 미네랄리티, 그리고 수십 년의 숙성 잠재력을 증명해 온 프랑스 스파클링 와인의 숨은 교과서입니다. 100% 슈냉 블랑 품종을 전통 방식(2차 병발효)으로 빚어, 찌르는 듯한 산도 대신 입안을 꽉 채우는 모과·청사과·카모마일·꿀의 풍성한 여운이 일품입니다.',
    whyEn:
      'Widely regarded by sommeliers as the finest traditional-method sparkling outside Champagne, crafting 100% Chenin Blanc with soaring quince, orchard pear, chamomile, and mineral longevity.',
    humanBioKo:
      '1928년 빅토르 위트(Victor Huet)가 루아르 부브레의 유서 깊은 "르 오 리외(Le Haut-Lieu)" 밭을 매입하며 도멘이 탄생했습니다. 이어 제2차 세계대전 중 레지스탕스로 활약하고 전후 42년간 부브레 시장을 역임한 아들 가스통 위트(Gaston Huet)가 루아르 와인의 세계화를 이끌었습니다.\n\n1976년부터 양조를 맡은 사위 노엘 피게(Noël Pinguet)는 1990년대 도멘 전체를 비오디나미(Biodynamic) 농법으로 전환하며 프랑스 내추럴·비오디나미 와인의 성지로 만들었습니다. 현재는 베네딕트 데 몽베르(Bénédicte de Montvert) 팀이 화학 약품을 일절 배제하고 야생 효모와 전통 대형 오크통 양조 철학을 철저히 이어가고 있습니다.',
    humanBioEn:
      'Established in 1928 by Victor Huet at Le Haut-Lieu, brought to global prominence by Resistance hero and longtime Vouvray mayor Gaston Huet, and converted entirely to biodynamic viticulture by Noël Pinguet in 1990.',
  },
  {
    match: ['dom pérignon', '돔 페리뇽'],
    whyKo:
      '오직 포도 작황이 뛰어난 해에만 생산되는 "빈티지 온리(Vintage Only)" 원칙을 1921년 이후 단 한 번도 꺾지 않은 샴페인의 아이콘입니다. 코트 데 블랑 그랑 크뤼 샤르도네의 눈부신 빛과 몽타뉴 드 랭스 피노 누아의 심해 같은 깊이가 9~10년의 암흑 숙성 끝에 비로소 균형을 이루었을 때만 세상 밖으로 나옵니다.',
    whyEn:
      'Crafted strictly as a Vintage declaration only in years meeting extraordinary cellar standards—uniting Côte des Blancs luminosity and Montagne de Reims power after nearly a decade on the lees.',
    humanBioKo:
      '17세기 오빌레 수도원(Abbaye d’Hautvillers)의 셀러 마스터였던 피에르 페리뇽(Pierre Pérignon) 수사는 "세상에서 가장 훌륭한 와인을 만들겠다"며 지역별 포도 블렌딩, 코르크 마개 밀봉, 두꺼운 유리병 사용을 정립해 현대 샴페인의 아버지로 불립니다.\n\n현대에 들어서는 전설적 수석 셰프 드 까브 리샤르 조프루아(Richard Geoffroy)가 28년간 이끌다 2019년 수석 양조가 뱅상 샤프롱(Vincent Chaperon)에게 바통을 넘겼습니다. 뱅상은 부르고뉴와 아르헨티나, 보르도를 두루 거친 양조 경험으로 2013 빈티지처럼 산도와 짭짤함이 폭발하는 정교한 "빛과 그림자의 균형"을 조율합니다.',
    humanBioEn:
      'Honoring 17th-century monk Dom Pierre Pérignon of Hautvillers Abbey, modern stewardship passed in 2019 from 28-year Chef de Cave Richard Geoffroy to Vincent Chaperon, who brings international winemaking perspective to Dom Pérignon’s signature tension.',
  },
  {
    match: ['salon', '살롱'],
    whyKo:
      '세계에서 가장 희귀한 샴페인 중 하나로 꼽히는 이유는 단 4가지 "단일(One)" 원칙 때문입니다: ① 르 메닐 쉬르 오제 단일 그랑 크뤼 마을, ② 샤르도네 단일 품종, ③ 단일 빈티지, ④ 말로락틱(젖산) 발효 없는 단일 양조 철학. 한 세기 동안 고작 40여 번만 병입되었으며, 특히 1996년 빈티지는 경매와 컬렉터들이 가장 열광하는 전설입니다.',
    whyEn:
      'Defined by four strict singularities—one Grand Cru village (Le Mesnil-sur-Oger), one grape (Chardonnay), one vintage, and zero malolactic fermentation—releasing barely 40 vintages in an entire century.',
    humanBioKo:
      '샹파뉴 출신이 아니었던 유젠 에메 살롱(Eugène-Aimé Salon)은 파리에서 모피 무역으로 막대한 부를 쌓은 뒤 "오직 내 친구들과 파리 최고의 살롱 사교계에서만 즐길 궁극의 샴페인"을 꿈꾸며 1905년 르 메닐 쉬르 오제 중앙 "르 자르당(Le Jardin)" 1헥타르 밭을 사들였습니다.\n\n당시 모든 하우스가 피노 누아를 섞을 때 그는 과감히 100% 샤르도네만으로 블랑 드 블랑을 만들었고, 입소문이 나면서 1921년부터 정식 시판했습니다. 1988년 로랑 페리에 그룹에 인수된 뒤에도 셀러 마스터 디디에 드퐁(Didier Depond)이 1990년대 초부터 30년 넘게 독립성과 10년 이상 초장기 병숙성 원칙을 철통같이 지키고 있습니다.',
    humanBioEn:
      'Parisian fur magnate Eugène-Aimé Salon purchased a 1-hectare parcel in Le Mesnil-sur-Oger in 1905 purely to craft a pure Chardonnay champagne for close friends, later commercializing in 1921; cellar director Didier Depond guards its austere, un-malolactic aging discipline today.',
  },
  {
    match: ['sauzet', '소제', '퓔리니'],
    whyKo:
      '부르고뉴 코트 드 본의 수많은 화이트 명가 중에서도 "가장 투명하고 섬세한 미네랄리티의 기준"으로 통합니다. 오크 향이 과실을 덮지 않도록 새 오크통 비율을 엄격히 통제하여, 퓔리니 몽라쉐 프리미에 크뤼 "레 콩베뜨"가 지닌 뫼르소 페리에르의 풍만함과 퓔리니 특유의 전류 같은 긴장감을 동시에 만끽할 수 있습니다.',
    whyEn:
      'Considered an archetype of translucent Puligny-Montrachet tension, balancing oak restraint with the neighboring Meursault Perrières breadth of 1er Cru Les Combettes.',
    humanBioKo:
      '20세기 초반 에티엔 소제(Étienne Sauzet)가 불과 몇 필지의 밭을 물려받아 매입을 거듭하며 12헥타르 규모로 일궜습니다. 그의 사후 외손녀 자닌과 결혼한 사위 제라르 부도(Gérard Boudot)가 1974년 합류해 엄격한 수확량 제한과 정교한 바토나주(앙금 젓기)를 도입하며 도멘을 세계 정상급 반열에 올렸습니다.\n\n2000년대 중반부터는 외손녀 사위 브누아 리포(Benoît Riffault)와 딸 에밀리 부도가 경영을 승계했으며, 샤블리와 뉴질랜드·남아공 와이너리에서 수학하고 돌아온 브누아가 전 밭의 비오디나미 농법 전환을 완수하며 한층 순수한 에너지를 불어넣고 있습니다.',
    humanBioEn:
      'Built by Étienne Sauzet in the early 1900s and propelled to global acclaim by son-in-law Gérard Boudot after 1974; today Gérard’s daughter Émilie and son-in-law Benoît Riffault steer biodynamic viticulture across Puligny-Montrachet.',
  },
  {
    match: ['armailhac', '달마이약', 'lynch-bages', '린쉬 바주', 'gloria', '글로리아'],
    whyKo:
      '보르도 좌안 포이약과 생 쥘리앙은 전 세계 풀바디 레드 와인의 문법을 완성한 곳입니다. 특히 샤또 달마이약은 1등급 샤또 무통 로칠드의 양조팀과 셀러 기술을 공유하면서도 가격은 1/5 수준으로 합리적이며, 린쉬 바주는 "가난한 자의 무통 로칠드"라 불릴 만큼 파워풀하고 벨벳 같은 블랙커런트·흑연 풍미로 육류 요리의 품격을 극대화합니다.',
    whyEn:
      'Quintessential Left Bank Pauillac and Saint-Julien estates delivering classified-growth cassis concentration, graphite depth, and velvet tannin tailored for prime red meats.',
    humanBioKo:
      '포이약의 달마이약은 1750년 도미니크 다르마이약 형제가 포도나무를 심은 역사를 지니며, 1933년 바롱 필립 드 로칠드 남작(Baron Philippe de Rothschild)이 인수해 현 딸 필리핀 여사와 손자 세대까지 무통 로칠드 가문이 직접 관리합니다.\n\n이웃한 린쉬 바주는 18세기 아일랜드계 린쉬 가문에서 시작해 1939년 포이약 시장이자 제빵사 출신 사업가 장 샤를 카즈(Jean-Charles Cazes)가 인수했습니다. 그의 손자 장 샤를 카즈 주니어(Jean-Charles Cazes)가 현재 4대째 대표로서 정교한 광학 선별기(Optical Sorting)와 구획별 미세 양조를 도입해 현대 보르도의 정수를 쓰고 있습니다.',
    humanBioEn:
      'Stewarded by historic Bordeaux dynasties—Baron Philippe de Rothschild’s family team at Château d’Armailhac since 1933, and four generations of the Jean-Charles Cazes family at Château Lynch-Bages since 1939.',
  },
  {
    match: ['tignanello', '티냐넬로', 'antinori', '안티노리'],
    whyKo:
      '1971년 첫 빈티지가 출시되었을 때 이탈리아 와인 법규(DOC)를 정면으로 거부하며 키안티 클라시코에 허용되지 않던 프랑스 오크통 숙성과 카베르네 소비뇽 블렌딩, 그리고 청포도 배제 원칙을 세워 "슈퍼 투스칸(Super Tuscan)" 신드롬을 탄생시킨 역사적 걸작입니다.',
    whyEn:
      'The 1971 pioneer that broke rigid Tuscan DOC laws—removing white grapes, adding Cabernet Sauvignon, and aging in French barriques to ignite the Super Tuscan revolution.',
    humanBioKo:
      '피렌체 안티노리 가문은 1385년 조반니 디 피에로 안티노리(Giovanni di Piero Antinori)가 피렌체 와인 길드(Arte dei Vinattieri)에 가입한 이래 26대, 무려 640년 가까이 가업을 이어온 세계 최고(最古) 명문가입니다.\n\n1960년대 말 가업을 물려받은 피에로 안티노리(Piero Antinori) 후작은 전설적인 양조학자 자코모 타키스(Giacomo Tachis)와 의기투합해 산 카시아노 언덕의 단일 밭 티냐넬로에서 이 혁명적 와인을 빚어냈고, 오늘날에는 그의 세 딸 알비에라·알레그라·알레시아 안티노리가 가문의 혁신 정신을 계승하고 있습니다.',
    humanBioEn:
      'Crafted by the 26-generation Antinori dynasty (fl. 1385), when Marchese Piero Antinori partnered with visionary oenologist Giacomo Tachis to unleash Sangiovese and Cabernet Sauvignon on hillside Tignanello vineyards.',
  },
  {
    match: ['duckhorn', '덕혼'],
    whyKo:
      '나파 밸리 레드 와인의 뼈대를 세운 대표작 중 하나로, 흔히 블렌딩 보조 품종 취급받던 메를로를 주인공으로 내세워 카베르네 소비뇽의 구조감과 메를로의 비단결 같은 다크 플럼·초콜릿 풍미를 동시에 완성한 미국 와인의 고전입니다.',
    whyEn:
      'An iconic Napa Valley pioneer proving that pure Merlot grown across cool valley floors and hillside benches can achieve Cabernet-level structure with plush chocolate-plum grace.',
    humanBioKo:
      '1976년 댄 덕혼(Dan Duckhorn)과 마거릿 덕혼 부부가 나파 세인트 헬레나(St. Helena)로 여행을 떠난 뒤 프랑스의 포므롤(Pomerol)처럼 부드럽고 매혹적인 메를로 와인을 만들겠다며 포도 16톤, 800케이스 규모로 창립했습니다.\n\n4대 수석 양조가 르네 아리(Renée Ary)는 UC 데이비스 출신으로 2003년 덕혼 연구실 인턴으로 입사해 10년간 셀러의 구석구석을 익힌 뒤 수석 와인메이커로 발탁되었으며, 나파 전역의 다양한 미기후 밭을 조화롭게 엮어냅니다.',
    humanBioEn:
      'Founded in 1976 by Dan and Margaret Duckhorn in St. Helena inspired by Pomerol; UC Davis graduate Renée Ary rose from a 2003 lab intern to lead winemaker balancing valley floor and mountain vineyards.',
  },
  {
    match: ['bichot', '알베르 비쇼', 'boillot', '부아조', 'vacheron', '바쉐론', 'pépière', '페피에르', 'méo', '메오', 'radikon', '라디콘'],
    whyKo:
      '대량 생산 브랜드 와인과 달리, 단일 마을·단일 구획 포도밭이 지닌 고유한 지질과 미기후가 고스란히 병 속에 담기도록 야생 효모 발효와 저개입 양조를 고수한 장인 도멘의 작품입니다. 식사 초반부터 끝까지 질리지 않고 음식의 풍미를 돋워주는 정교한 산도와 미네랄 균형이 압권입니다.',
    whyEn:
      'Crafted by heritage artisan domaines committed to native yeast fermentation and parcel clarity, delivering effortless food harmony without heavy oak mask.',
    humanBioKo:
      '알베르 비쇼는 1831년 베르나르 비쇼가 몽톨리에에서 창립한 이래 6대손 알베릭 비쇼가 본과 코트 도르 전역의 100헥타르 자가 포도밭을 유기농으로 가꾸고 있으며, 루아르의 바쉐론(Vacheron)은 장-로랑과 장-도미니크 두 사촌 형제가 상세르 전체를 비오디나미의 정점으로 끌어올렸습니다.\n\n메오 카뮈제는 전설적인 부르고뉴 양조의 신 앙리 자이에(Henri Jayer)에게 직접 수업을 받은 장 니콜라 메오(Jean-Nicolas Méo)가, 이탈리아 오슬라비아의 라디콘은 스탄코 라디콘의 아들 사샤가 선대의 자연주의 양조 신념을 타협 없이 이어가고 있습니다.',
    humanBioEn:
      'Guided by legendary family stewards—from Albéric Bichot (6th gen, est. 1831) and Henri Jayer’s protégé Jean-Nicolas Méo in Burgundy, to Sancerre biodynamic pioneers Jean-Laurent & Jean-Dominique Vacheron and Saša Radikon in Friuli.',
  },
];

function findProducerDetail(wine: WineItem): ProducerRichDetail | undefined {
  const hay = `${wine.nameKo} ${wine.nameEn} ${wine.producer}`.toLowerCase();
  return PRODUCER_DETAILS.find((p) => p.match.some((m) => hay.includes(m)));
}

function getAppellationSection(wine: WineItem): {
  headingKo: string;
  headingEn: string;
  bodyKo: string;
  bodyEn: string;
} {
  const hay = `${wine.regionKo} ${wine.regionEn} ${wine.nameKo} ${wine.nameEn}`.toLowerCase();

  if (hay.includes('champagne') || hay.includes('샹파뉴') || hay.includes('mesnil') || hay.includes('aÿ')) {
    return {
      headingKo: 'Champagne AOC · 역사적 지역성과 원산지 법규',
      headingEn: 'Champagne AOC · History & Strict Appellation Law',
      bodyKo:
        '샹파뉴는 라틴어 "캠파니아(Campania, 열린 들판)"에서 유래한 프랑스 최북단 고급 산지이자, 엄격한 AOC 원산지 보호 규정이 1936년 가장 먼저 자리 잡은 곳입니다. 그 이전 1905년부터 포도밭 경계를 둘러싸고 1911년 농민 봉기가 일어날 만큼 오랜 진통 끝에 오늘날의 17개 그랑 크뤼·42개 프리미에 크뤼 등급이 확정되었습니다.\n\n법규상 기계 수확을 전면 금지하고 100% 손 수확만 허용하며, 압착 시 4,000kg 포도에서 최대 2,550리터까지만 즙을 짜내도록 제한합니다. 논빈티지는 최소 15개월, 빈티지 샴페인은 최소 36개월 이상 병 속 효모 앙금과 함께 숙성해야 비로소 "Champagne AOC" 이름을 달 수 있습니다.',
      bodyEn:
        'Champagne—named for Latin campania—codified its strict AOC in 1936 after historic delimitation battles in 1905–1911. Today 17 Grand Cru and 42 Premier Cru villages preserve elite quality.\n\nBy strict law, 100% hand harvesting is mandatory, pressing yields are capped (2,550L per 4,000kg), and bottles must age sur lattes for 15+ months (NV) or 36+ months (Vintage).',
    };
  }

  if (hay.includes('bordeaux') || hay.includes('보르도') || hay.includes('pauillac') || hay.includes('포이약') || hay.includes('sauternes') || hay.includes('소테른') || hay.includes('saint-julien')) {
    return {
      headingKo: 'Bordeaux AOC · 1855 그랑 크뤼 클라세 & 좌안 전통',
      headingEn: 'Bordeaux AOC · 1855 Classification & Left Bank Tradition',
      bodyKo:
        '보르도 좌안 메독 지역은 1855년 나폴레옹 3세 파리 만국박람회를 계기로 당시 시장 거래 가격과 명성을 기준으로 1~5등급(Grand Cru Classé) 체계가 제정되어 170년 가까이 전 세계 컬렉터의 나침반 역할을 하고 있습니다.\n\n지롱드 강 하구의 온화한 해양성 기후와 랑드(Landes) 소나무 숲이 대서양의 매서운 바람과 서리를 막아주며, 포이약과 생 쥘리앙 AOC는 카베르네 소비뇽 중심의 장기 숙성용 블렌딩(마스터 블렌딩)과 엄격한 에이징·수확 밀도 규정을 통해 견고한 구조감을 보장합니다.',
      bodyEn:
        'Left Bank Médoc estates anchor the landmark 1855 Classification created for Napoleon III’s Exposition Universelle, serving as an enduring global benchmark for classified red and Sauternes estates.\n\nProtected from Atlantic gales by Landes pine forests, Pauillac and Saint-Julien AOC enforce strict planting density and blending yields tailored for multi-decade structure.',
    };
  }

  if (hay.includes('bourgogne') || hay.includes('부르고뉴') || hay.includes('burgundy') || hay.includes('meursault') || hay.includes('puligny') || hay.includes('chablis')) {
    return {
      headingKo: 'Bourgogne AOC · 유네스코 클리마(Climat) & 4단계 등급',
      headingEn: 'Bourgogne AOC · UNESCO Climats & Parcel Hierarchy',
      bodyKo:
        '부르고뉴는 중세 시토회(Cistercian) 수도사들이 12~14세기에 걸쳐 한 뼘 단위 포도밭마다 돌담(Clos)을 두르고 미세한 맛의 차이를 기록하면서 "클리마(Climat)" 문화를 정립한 곳으로, 2015년 유네스코 세계문화유산에 등재되었습니다.\n\n프랑스 AOC 법규 중 가장 엄격한 단일 품종 원칙(화이트=샤르도네, 레드=피노 누아) 아래 [레지오날 → 빌라주(마을명) → 프리미에 크뤼(1er Cru) → 그랑 크뤼(Grand Cru)] 4단계로 수확량 상한(hectoliter/ha)을 법으로 통제하여, 밭의 지명만으로도 품질과 집중도를 가늠할 수 있습니다.',
      bodyEn:
        'Charted stone by stone by medieval Cistercian monks, Bourgogne’s UNESCO-listed Climats enforce single-varietal purity across a strict four-tier pyramid (Régionale → Village → 1er Cru → Grand Cru).\n\nTighter maximum yields apply at every higher tier, ensuring each bottle transparently channels its exact vineyard aspect and limestone seam.',
    };
  }

  if (hay.includes('loire') || hay.includes('루아르') || hay.includes('sancerre') || hay.includes('상세르') || hay.includes('vouvray') || hay.includes('부브레')) {
    return {
      headingKo: 'Val de Loire AOC · 정교한 미식 산지 법규',
      headingEn: 'Loire Valley AOC · River-Moderated Gastronomic Rules',
      bodyKo:
        '프랑스에서 가장 긴 1,000km 루아르 강을 따라 서부 낭트(Muscadet Sèvre et Maine)의 아틀란틱 화이트부터 중부 투렌·부브레(Vouvray)의 슈냉 블랑, 동부 내륙 상세르(Sancerre)의 소비뇽 블랑까지 뚜렷한 AOC별 정체성을 지닙니다.\n\n상세르 AOC는 1936년 화이트 와인 최초로 AOC 지정을 받은 지역 중 하나이며, 부브레는 오직 슈냉 블랑 100%만으로 스틸(드라이~스위트)과 2차 병발효 스파클링(Pétillant / Mousseux)을 모두 빚는 독특한 유연성과 정통성을 함께 규율합니다.',
      bodyEn:
        'Stretching from Atlantic Muscadet through Vouvray to inland Sancerre (one of France’s founding 1936 AOCs), each appellation rigorously codifies its signature single varietal and river microclimate.',
    };
  }

  return {
    headingKo: `${wine.regionKo} · 산지 역사와 원산지 등급 체계`,
    headingEn: `${wine.regionEn} · Appellation Heritage`,
    bodyKo:
      `${wine.regionKo} 지역은 오랜 재배 역사 속에서 해당 기후와 지질에 가장 잘 적응한 토착 및 클래식 품종만 재배하도록 엄격한 산지 규정(AOC/DOCG/AVA 등)을 발전시켜 왔습니다.\n\n헥타르당 최대 수확량 제한, 포도나무 최소 식재 밀도, 최소 오크·병 숙성 기간 규정을 엄수함으로써 매년 일관된 산지 고유의 아로마와 균형 잡힌 산도·타닌 구조를 지켜냅니다.`,
    bodyEn:
      `${wine.regionEn} regulates varietal selection, vine density, maximum yields, and cellar aging to guarantee authentic regional character in every release.`,
  };
}

function getVarietalSection(wine: WineItem): {
  headingKo: string;
  headingEn: string;
  bodyKo: string;
  bodyEn: string;
} {
  const hay = `${wine.varietalsKo} ${wine.varietalsEn}`.toLowerCase();

  if (hay.includes('샤르도네') || hay.includes('chardonnay')) {
    return {
      headingKo: `Chardonnay · ${wine.varietalsKo}`,
      headingEn: wine.varietalsEn,
      bodyKo:
        '샤르도네는 전 세계에서 가장 폭넓게 사랑받지만, 그 진가는 서늘한 석회질·백악질 토양에서 양조할 때 눈부시게 드러납니다. 포도 자체의 개성이 튀기보다 밭의 토양과 양조자의 터치를 맑게 비추는 "투명한 거울" 역할을 하기 때문입니다.\n\n서늘한 해와 백악질에서는 청사과·레몬·유자 껍질과 젖은 돌의 직선적인 산도로 나타나고, 효모 앙금 위 장기 숙성(Sur Lie)과 섬세한 프렌치 오크 숙성을 거치면 구운 헤이즐넛, 크리미한 버터, 카라멜라이즈드 브리오슈가 겹겹이 쌓이며 10~20년 이상 거뜬히 숙성되는 장대한 화이트·샴페인 걸작으로 태어납니다.',
      bodyEn:
        'Chardonnay serves as winemaking’s truest mirror—expressing crystalline green apple, yuzu zest, and wet chalk in cool limestone sites before unfolding toasted hazelnut and satin brioche through extended lees aging.\n\nSupported by vibrant malic tension, top expressions evolve effortlessly for decades.',
    };
  }

  if (hay.includes('피노 누아') || hay.includes('pinot noir')) {
    return {
      headingKo: `Pinot Noir · ${wine.varietalsKo}`,
      headingEn: wine.varietalsEn,
      bodyKo:
        '포도알이 솔방울처럼 촘촘하게 매달려 붙은 이름의 피노 누아는 껍질이 매우 얇아 서리·병해·기온 변화에 극도로 예민한 "가장 까다롭지만 가장 고귀한 적포도"입니다.\n\n짙은 색소나 텁텁하게 혀를 조이는 타닌 대신 루비빛 투명함 속에 라즈베리·붉은 체리·들장미·스파이스가 정교하게 피어납니다. 특히 숙성이 진행되면서 3차향인 트러플, 젖은 낙엽, 부드러운 가죽 향이 우아하게 솟아올라 생선 구이부터 오리·한우 안심까지 요리의 섬세한 맛을 해치지 않는 최고의 미식 파트너가 됩니다.',
      bodyEn:
        'Named for pine-cone-tight clusters and paper-thin skins, Pinot Noir demands exacting vineyard precision. Instead of heavy opaque tannin, it offers translucent ruby clarity—unfolding wild cherry, rose petal, cinnamon spice, and silken forest-floor complexity that pairs seamlessly across seafood, poultry, and fine beef.',
    };
  }

  if (hay.includes('카베르네') || hay.includes('cabernet') || hay.includes('메를로') || hay.includes('merlot')) {
    return {
      headingKo: `Bordeaux Varietals · ${wine.varietalsKo}`,
      headingEn: wine.varietalsEn,
      bodyKo:
        '카베르네 소비뇽(카베르네 프랑 × 소비뇽 블랑 자연 교배종)은 두꺼운 껍질과 높은 씨앗 비율 덕분에 풍부한 폴리페놀·타닌·응축된 안토시아닌을 지녀 세계에서 가장 장기 숙성 잠재력이 뛰어난 품종입니다.\n\n짙은 블랙커런트(카시스)와 블랙베리 과실 위에 젖은 자갈·흑연(연필심)·삼나무·시가 박스·민트 노트가 층층이 쌓이며, 여기에 벨벳 같은 자두 질감의 메를로가 조화롭게 어우러져 숯불 그릴 스테이크와 양갈비의 기름진 육즙을 칼같이 정리해 주는 구조적 쾌감을 선사합니다.',
      bodyEn:
        'Thick-skinned Cabernet Sauvignon—a historic natural cross of Cabernet Franc and Sauvignon Blanc—packs monumental cassis concentration, cedar, and graphite grip.\n\nBlended or balanced with Merlot’s supple black-plum plushness, its fine tannin binds cleanly to seared steak protein and rich jus.',
    };
  }

  return {
    headingKo: wine.varietalsKo,
    headingEn: wine.varietalsEn,
    bodyKo:
      `${wine.varietalsKo} 품종은 ${wine.regionKo}의 낮과 밤 일교차 속에서 당도와 유기산을 균형 있게 축적하며 바디감(${wine.structure.body}/5)과 산도(${wine.structure.acidity}/5)의 완벽한 균형점을 찾아냅니다.\n\n수확 시기와 침용 온도, 효모 앙금 접촉(Sur Lie)을 세밀하게 조절함으로써 1차 과실의 순수한 생기와 2·3차 숙성 풍미가 물 흐르듯 이어져 오늘 식탁의 요리와 조화로운 리듬을 만들어 냅니다.`,
    bodyEn:
      `${wine.varietalsEn} translates the diurnal rhythm of ${wine.regionEn} into poised structure (body ${wine.structure.body}/5, acidity ${wine.structure.acidity}/5), harmonizing bright varietal fruit with layered culinary complexity.`,
  };
}

function getVintageClimateBody(wine: WineItem): {
  headingKo: string;
  headingEn: string;
  bodyKo: string;
  bodyEn: string;
} {
  const y = wine.vintage || 2021;
  let deepKo =
    '봄의 알맞은 수분과 여름철 안정적인 일교차, 그리고 건조하고 선선한 9월 수확기 덕분에 포도 껍질의 페놀 성숙과 상쾌한 천연 산도가 조화로운 이상적 작황이었습니다. 과도하게 알코올이 치솟거나 풋내가 남지 않아 지금 바로 오픈해도 훌륭한 개방감을 즐길 수 있으며 향후 5~10년간 점진적으로 복합미가 더해질 것입니다.';
  let deepEn =
    'Balanced spring moisture and cool harvest nights preserved aromatic clarity alongside ripe tannins, promising effortless approachability today and graceful cellar evolution.';

  if (y === 1996) {
    deepKo =
      '와인 평론가들과 컬렉터들이 이구동성으로 꼽는 "한 세기에 두 번 나올까 말까 한 역설과 기적의 빈티지"입니다. 통상 당도가 높으면 산도가 떨어지기 마련인데, 1996년은 온화한 8월로 높은 당분(알코올 잠재력)을 쌓은 직후 9월 초 차갑고 건조한 북동풍이 불어 닥치며 유례없는 높은 말산(사과산)을 그대로 가두었습니다.\n\n그 결과 30년이 가까운 세월이 흐른 지금도 놀라울 만큼 팽팽한 산도의 긴장감과 벌꿀·구운 아몬드·말린 살구의 깊은 3차향이 공존하며 경이로운 생명력을 과시합니다.';
    deepEn =
      'Hailed as one of the miracle tension vintages of the century: generous August ripeness collided with icy dry northeast winds in September, locking stratospheric natural acidity alongside rich sugar.\n\nEven three decades on, 1996 commands breathtaking freshness layered with honeyed brioche and mineral depth.';
  } else if (y === 2013 || y === 2014) {
    deepKo =
      `${y}년은 봄철 서늘하고 습한 날씨로 포도 개화가 늦어지며 생산자들을 애태웠으나, 다행히 9월 중순 이후 눈부시게 맑고 건조한 인디언 서머와 북풍이 불어주며 극적인 반전을 이룬 "클래식 레이트 하베스트(늦수확)" 빈티지입니다.\n\n지나치게 과숙된 더운 해의 와인보다 알코올이 도드라지지 않고 선이 가늘면서도 전류처럼 찌릿한 산미, 부싯돌·백악질 미네랄리티가 뚜렷하게 살아있어 시간이 흐를수록 전문가들의 평가가 계속 상승하는 숨은 보석 같은 해입니다.`;
    deepEn =
      `${y} saw a cool, delayed growing season rescued by a radiant, dry autumn breeze—producing a classic late-harvest profile prized for crystalline linearity, low alcohol, and piercing terroir minerality that grows more admired each year.`;
  } else if (y === 2015 || y === 2016 || y === 2018) {
    deepKo =
      `${y}년은 여름철 풍부한 일조량과 건조한 기온 덕분에 포도나무가 수세를 줄이고 알이 작고 껍질이 두꺼운 최상급 열매를 맺은 "위대한 풍요의 해"입니다. 수확기 병충해가 거의 없어 농부들이 밭마다 원하는 최적의 완숙 시점을 기다려 선별 수확할 수 있었습니다.\n\n과즙의 농축도가 매우 뛰어나고 타닌이 초기부터 벨벳처럼 매끄럽게 익어 처음 따랐을 때부터 웅장한 만족감을 주며, 단단한 산도 골격이 뒷받침되어 장기 숙성 가치가 매우 높은 해입니다.`;
    deepEn =
      `${y} delivered abundant summer sunshine and spotless harvest conditions, allowing optimal picking windows across every parcel. Concentrated berries yielded velvety tannin, plush mid-palate depth, and decades of cellar power.`;
  } else if (y === 2019 || y === 2020) {
    deepKo =
      `${y}년은 유럽 전역에 여름 열기가 강하게 찾아왔지만, 결정적 수확 직전 서늘한 밤 기온과 석회·백악·자갈 토양의 깊은 지하 수분 덕분에 포도가 시들지 않고 놀라울 만큼 생생한 산도를 유지한 해입니다.\n\n과실의 농축미와 우아한 신선함이 공존해 "현대적 균형의 정점"이라 불리며, 지금 식탁에서도 다채로운 꽃과 과일 향이 활짝 피어나는 동시에 10~20년의 숙성 여력까지 품고 있습니다.`;
    deepEn =
      `${y} stands as a triumph of modern balance—combining intense fruit concentration from sunny summer days with unexpected nocturnal coolness that preserved vibrant acidity and floral lift.`;
  } else if (y >= 2021) {
    deepKo =
      `${y}년은 최근 이어진 더운 해들과 달리 1990년대 클래식 유럽 빈티지를 떠올리게 하는 서늘하고 우아한 생장 곡선을 그렸습니다. 알코올 도수가 무겁게 오르지 않아 한 병을 마시는 내내 전혀 부담이 없으며, 감귤·청사과·붉은 베리의 투명한 아로마와 입안을 개운하게 정돈하는 상큼한 산도가 두드러집니다.\n\n파인다이닝의 섬세한 해산물, 화이트 미트, 감칠맛 나는 요리와 곁들였을 때 음식 본연의 맛을 가장 깔끔하게 받쳐주는 "미식가형 빈티지"입니다.`;
    deepEn =
      `${y} marks a refreshing return to classical, cooler proportions—moderate alcohol, transparent orchard/berry fruit, and vivid gastronomic acidity engineered for refined table pairings.`;
  }

  return {
    headingKo: `天 · ${y} 빈티지의 하늘과 기후`,
    headingEn: `Heaven · ${y} Vintage Climate`,
    bodyKo: `${wine.storytelling.heavenClimateKo}\n\n${deepKo}`,
    bodyEn: `${wine.storytelling.heavenClimateEn}\n\n${deepEn}`,
  };
}

function getEarthSoilBody(wine: WineItem, detail?: ProducerRichDetail): {
  headingKo: string;
  headingEn: string;
  bodyKo: string;
  bodyEn: string;
} {
  const hay = `${wine.regionKo} ${wine.regionEn} ${wine.nameKo}`.toLowerCase();
  let extraKo =
    '표토의 비옥도가 낮고 자갈·석회암·점토가 적층을 이룬 척박한 땅일수록 포도나무는 양분을 찾아 뿌리를 10~20미터 이상 지하 깊숙이 내립니다. 이렇게 땅속 수억 년 된 암석층에서 길어 올린 미량 미네랄이 포도알을 작고 단단하게 농축시키며 와인의 끝맛에 지워지지 않는 깊은 여운을 남깁니다.';
  let extraEn =
    'Low-fertility mineral subsoils compel roots deep into ancient bedrock, moderating yield naturally while imbuing concentrated texture and lingering geological salinity.';

  if (detail?.earthParcelKo) {
    extraKo = detail.earthParcelKo;
    extraEn = detail.earthParcelEn ?? extraEn;
  } else if (hay.includes('bordeaux') || hay.includes('포이약') || hay.includes('보르도')) {
    extraKo =
      '피레네와 마시프 상트랄 산맥에서 수만 년간 지롱드 강물을 타고 흘러내려 퇴적된 굵은 "자갈(Graves)" 구릉 위에 밭이 자리합니다. 하얀 규암과 둥근 강자갈은 낮 동안 내리쬐는 태양열을 흡수했다가 기온이 떨어지는 밤에 포도 송이 아래쪽으로 온기를 천천히 방출해 만생종 레드 품종이 10월까지 완벽히 여물게 하는 천연 보온 장치 역할을 합니다.\n\n자갈층 아래 2~3미터 깊이에 깔린 단단한 점토와 철분 석회암 반석은 여름철 가뭄에도 지하 수분을 공급하여 부드럽고 힘 있는 타닌과 특유의 흑연·삼나무 향을 완성합니다.';
    extraEn =
      'Vines root atop deep glacial Garonne gravel mounds over iron-rich clay and limestone marl—storing daytime solar warmth to ripen late Cabernet fruit fully while channeling graphite and velvet depth.';
  } else if (hay.includes('bourgogne') || hay.includes('부르고뉴') || hay.includes('chablis') || hay.includes('meursault') || hay.includes('puligny')) {
    extraKo =
      '약 1억 5천만 년 전 쥐라기 시대 이곳이 얕은 열대 바다였을 때 굴과 바다 생물 껍데기가 쌓여 만들어진 "키메리지안(Kimmeridgian)" 및 "바토니안(Bathonian)" 석회질 이회토가 사면을 따라 정교하게 노출되어 있습니다.\n\n해발 230~300미터 동남향 언덕 사면은 아침 햇살을 가장 먼저 받아 서리를 피하면서도 한낮의 뜨거운 서향 햇볕을 비켜가며, 돌 많고 배수가 뛰어난 이 석회암 토양 덕분에 다른 어떤 산지에서도 흉내 낼 수 없는 정교한 실키함과 투명한 조개껍질 미네랄리티가 탄생합니다.';
    extraEn =
      'Set on east-southeast slopes of Jurassic Kimmeridgian and Bathonian marine limestone packed with ancient fossilized shells, uniting effortless drainage with crystalline salinity and silk-like nuance.';
  }

  return {
    headingKo: `地 · ${wine.regionKo} 포도밭의 토양과 지형`,
    headingEn: `Earth · ${wine.regionEn} Geology & Terrain`,
    bodyKo: `${wine.storytelling.earthSoilKo}\n\n${extraKo}`,
    bodyEn: `${wine.storytelling.earthSoilEn}\n\n${extraEn}`,
  };
}

/**
 * Generates 6 strictly non-overlapping deep encyclopedia entries:
 * - 3 for "소믈리에 설명" ('commentary' modal in Pro mode): why, appellation, varietal
 * - 3 for "스토리 · 포도밭" ('story' modal): heaven (天), earth (地), human (人)
 * - All 6 shown together cleanly inside "전체 와인 리스트" wine sheet modal!
 */
export function buildWineEncyclopedia(wine: WineItem): WineEncyclopediaEntry[] {
  const detail = findProducerDetail(wine);
  const appInfo = getAppellationSection(wine);
  const varInfo = getVarietalSection(wine);
  const heavenInfo = getVintageClimateBody(wine);
  const earthInfo = getEarthSoilBody(wine, detail);

  const fallbackWhyKo =
    `${wine.producer}가 추구하는 정교한 양조 철학(${wine.serving.statusKo})이 가장 선명하게 응축된 대표 바틀입니다. 대량 생산된 상업 와인처럼 과도한 당분이나 인위적인 새 오크 향으로 맛을 덮지 않고, 천연 산도와 과실의 순수한 결을 살려 음식과 만났을 때 입안을 정갈하게 정리해 줍니다.\n\n특히 글라스 안에서 공기와 만날수록 1차 과일에서 2차 발효 풍미, 3차 미네랄 숙성향으로 이어지는 다층적인 변화 곡선이 뛰어나 식사의 첫 잔부터 메인 요리까지 안정적인 호흡을 이어갑니다.`;
  const fallbackWhyEn =
    `A hallmark release from ${wine.producer} (${wine.serving.statusEn}), avoiding heavy commercial oak masking in favor of natural tension, clean culinary balance, and evolving glass aromatics.`;

  const fallbackHumanKo =
    `${wine.storytelling.humanPhilosophyKo}\n\n${wine.producer}는 ${wine.regionKo} 구획이 지닌 생물 다양성과 토착 미생물 생태계를 지키기 위해 인위적인 제초제와 화학 비료를 배제하고 밭을 손으로 일굽니다. ${wine.storytelling.vinificationKo} 포도밭에서 얻은 순수한 생명력을 병 안에서 오랫동안 변치 않게 보존하기 위해 소량 배치 단위로 세심하게 온도를 관리하며 숙성을 이어가는 장인 가문입니다.`;
  const fallbackHumanEn =
    `${wine.storytelling.humanPhilosophyEn}\n\nCommitted to manual vineyard stewardship and parcel-by-parcel fermentation (${wine.storytelling.vinificationEn}), crafting authentic wines built for patient aging.`;

  return [
    // Modal 1 ("소믈리에 설명" — Expert Mode)
    {
      id: 'why',
      pillarKind: 'commentary',
      eyebrowKo: '와인 선정 포인트 · 왜 이 병인가',
      eyebrowEn: 'Why This Bottle',
      headingKo: wine.producer || (wine.nameKo.split(' ')[0] ?? wine.nameKo),
      headingEn: wine.producer || wine.nameEn,
      bodyKo: detail ? detail.whyKo : fallbackWhyKo,
      bodyEn: detail ? detail.whyEn : fallbackWhyEn,
    },
    {
      id: 'appellation',
      pillarKind: 'commentary',
      eyebrowKo: '산지 역사 · 원산지 법규(AOC/DOCG)',
      eyebrowEn: 'Regional Heritage & Appellation Law',
      headingKo: appInfo.headingKo,
      headingEn: appInfo.headingEn,
      bodyKo: appInfo.bodyKo,
      bodyEn: appInfo.bodyEn,
    },
    {
      id: 'varietal',
      pillarKind: 'commentary',
      eyebrowKo: '포도 품종 심층 탐구',
      eyebrowEn: 'Varietal Expression & Craft',
      headingKo: varInfo.headingKo,
      headingEn: varInfo.headingEn,
      bodyKo: varInfo.bodyKo,
      bodyEn: varInfo.bodyEn,
    },

    // Modal 2 ("스토리 · 포도밭" — Strictly 天 · 地 · 人 3 Pillars)
    {
      id: 'heaven',
      pillarKind: 'story',
      eyebrowKo: '하늘의 결 · 빈티지 기상과 수확 조건',
      eyebrowEn: 'Heaven · Climate & Harvest Conditions',
      headingKo: heavenInfo.headingKo,
      headingEn: heavenInfo.headingEn,
      bodyKo: heavenInfo.bodyKo,
      bodyEn: heavenInfo.bodyEn,
    },
    {
      id: 'earth',
      pillarKind: 'story',
      eyebrowKo: '땅의 뼈대 · 지질학과 밭의 지형',
      eyebrowEn: 'Earth · Soil Composition & Aspect',
      headingKo: earthInfo.headingKo,
      headingEn: earthInfo.headingEn,
      bodyKo: earthInfo.bodyKo,
      bodyEn: earthInfo.bodyEn,
    },
    {
      id: 'human',
      pillarKind: 'story',
      eyebrowKo: '사람의 철학 · 생산자 일대기와 세대 계승',
      eyebrowEn: 'Maker · Biography, Lineage & Convictions',
      headingKo: `人 · ${wine.producer} 가문과 일대기`,
      headingEn: `Maker · ${wine.producer} Story`,
      bodyKo: detail ? detail.humanBioKo : fallbackHumanKo,
      bodyEn: detail ? detail.humanBioEn : fallbackHumanEn,
    },
  ];
}
