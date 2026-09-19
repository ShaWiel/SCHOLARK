import http from 'node:http';

const VERSION='20260918-school-suriname-taxonomy-v5';
const previousEmit=http.Server.prototype.emit;
const safeFetch=globalThis.fetch.bind(globalThis);
const OVERPASS=[
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];
const SR_OFFICIAL_URL='https://gov.sr/wp-content/uploads/2022/10/Lijst-met-Scholen-Suriname-1.xlsx';
const COUNTRY_CODES={
  suriname:'SR',netherlands:'NL',nederland:'NL','united states':'US',usa:'US','united kingdom':'GB',uk:'GB',
  germany:'DE',duitsland:'DE',france:'FR',frankrijk:'FR',spain:'ES',spanje:'ES',portugal:'PT',italy:'IT',
  italië:'IT',italie:'IT',brazil:'BR',brazilië:'BR',brazilie:'BR',canada:'CA',australia:'AU',australië:'AU',
  india:'IN','south africa':'ZA','zuid-afrika':'ZA',guyana:'GY','trinidad & tobago':'TT','trinidad and tobago':'TT',
  jamaica:'JM',belgium:'BE',belgië:'BE',belgie:'BE'
};
let officialCache=null;
let officialPromise=null;
const SRC_POLANEN='https://gov.sr/priority-social-projects-program-renovation-of-schools-phase-1/';
const SRC_TVET='https://gov.sr/beroepsonderwijs/scholen/';
const SRC_NUFFIC='https://www.nuffic.nl/onderwijssystemen/suriname/onderwijsinstellingen-en-opleidingen';
const SRC_NOVA='https://novasur.org/accreditatie-register/';
const SRC_HOEKSTEEN='https://hoeksteen.sr/';
const SURINAME_CURATED_RAW=[
  // Basisonderwijs / current supplements not reliably exposed by the 2022 workbook.
  {name:'J.H.N. Polanenschool',exact:['primary'],description:'Commewijnestraat 27 · Paramaribo · Basisonderwijs / GLO',city:'Paramaribo',district:'Paramaribo',phone:'+597 499108',source:'GOV.SR 2026 school project + current directory',sourceUrl:SRC_POLANEN,aliases:'O.S. Polanen 1; Polanenschool; Kweek-A'},
  {name:'De Hoeksteen Basisschool',exact:['primary'],description:'Paramaribo · Basisschool',city:'Paramaribo',district:'Paramaribo',website:'https://hoeksteen.sr/',source:'School website',sourceUrl:SRC_HOEKSTEEN},
  {name:'Kangoeroe Community School',exact:['kindergarten','primary'],description:'Edmundstraat 3-5 · Paramaribo · kinderopvang / basisonderwijs',city:'Paramaribo',district:'Paramaribo',website:'https://kangoeroeschool.com/',phone:'+597 430870',source:'Kangoeroe Community School official website',sourceUrl:'https://kangoeroeschool.com/over-ons/',aliases:'Kangaroo Community School; Kangoeroe School; KCS'},
  {name:'Nederlandse Basisschool Het Kleurenorkest',exact:['primary'],description:'Veldhuizenlaan 63 · Paramaribo · basisschool',city:'Paramaribo',district:'Paramaribo',phone:'+597 432120',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Nederlandse+Basisschool+Het+Kleurenorkest+Suriname'},
  {name:'Prinses Amalia Nederlandse Basisschool',exact:['primary'],description:'Wonglaan 35 · Paramaribo · basisschool',city:'Paramaribo',district:'Paramaribo',phone:'+597 430090',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Prinses+Amalia+Nederlandse+Basisschool+Suriname'},
  {name:'Basisschool De Cederboom',exact:['primary'],description:'Gravenberchstraat 2 · Paramaribo · basisschool',city:'Paramaribo',district:'Paramaribo',phone:'+597 493030',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Basisschool+De+Cederboom+Suriname'},

  // VOJ / MULO supplements and current names.
  {name:'MULO Waaldijkschool 1',exact:['mulo'],description:'Walterbursideweg · Paramaribo',city:'Paramaribo',district:'Paramaribo',source:'GOV.SR 2026 school project',sourceUrl:SRC_POLANEN},
  {name:'MULO Waaldijkschool 2',exact:['mulo'],description:'Walterbursideweg · Paramaribo',city:'Paramaribo',district:'Paramaribo',source:'GOV.SR 2026 school project',sourceUrl:SRC_POLANEN},
  {name:'MULO Hendrik Sylvesterschool',exact:['mulo'],description:'Henkielaan · Paramaribo',city:'Paramaribo',district:'Paramaribo',source:'GOV.SR 2026 school project',sourceUrl:SRC_POLANEN,aliases:'H.G. Sylvester; Hendrik Sylvester MULO'},
  {name:'L. Schützschool',exact:['mulo'],description:'Paramaribo · VO / voormalige MULO-school',city:'Paramaribo',district:'Paramaribo',phone:'+597 474966',source:'Current school listing',sourceUrl:'https://www.schoolandcollegelistings.com/SR/Paramaribo/393104554120180/L.-Sch%C3%BCtzschool'},
  {name:'MULO Botromankiweg',exact:['mulo'],description:'Botromankiweg 57 · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 483113',source:'Current school listing',sourceUrl:'https://www.schoolandcollegelistings.com/SR/Paramaribo/106243045669029/Mulo-Botromankiweg'},
  {name:'Salvator V.O. School',exact:['mulo'],description:'Paramaribo · voormalig Salvator MULO',city:'Paramaribo',district:'Paramaribo',phone:'+597 459977',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Salvator+VO+school+Suriname',aliases:'Salvator MULO School'},
  {name:'Caprino Alendy M.U.L.O. School',exact:['mulo'],description:'Paramaribo · MULO / VOJ',city:'Paramaribo',district:'Paramaribo',phone:'+597 483130',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Caprino+Alendy+MULO+School+Suriname'},
  {name:'MULO Kerklaan',exact:['mulo'],description:'Kerklaan · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 531222',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Kerklaan+Suriname'},
  {name:'Openbare MULO Geyersvlijt',exact:['mulo'],description:'Amistraat · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 453840',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Geyersvlijt+Suriname'},
  {name:'Anton Resida MULO School',exact:['mulo'],description:'Commissaris Weytinghweg · Wanica',city:'',district:'Wanica',phone:'+597 338237',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Anton+Resida+MULO+School+Suriname'},
  {name:'Johannes Vrolijk School MULO',exact:['mulo'],description:'Lelydorp · Wanica',city:'Lelydorp',district:'Wanica',phone:'+597 366156',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Johannes+Vrolijk+School+MULO+Suriname'},
  {name:'MULO Schotelweg',exact:['mulo'],description:'Schotelweg · Wanica',city:'',district:'Wanica',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Schotelweg+Suriname'},
  {name:'MULO Kwatta',exact:['mulo'],description:'Kwatta / Sunny Point · Wanica',city:'Kwatta',district:'Wanica',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Kwatta+Suriname'},
  {name:'MULO Domburg',exact:['mulo'],description:'Domburg · Wanica',city:'Domburg',district:'Wanica',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Domburg+Suriname'},
  {name:'Wim Bos Verschuur MULO School',exact:['mulo'],description:'Boulangerstraat · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 464272',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Wim+Bos+Verschuur+MULO+School+Suriname'},
  {name:'MULO Hockey',exact:['mulo'],description:'Santoweg · Paramaribo',city:'Paramaribo',district:'Paramaribo',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Hockey+Suriname'},
  {name:'MULO Paranam',exact:['mulo'],description:'Paranam · Para',city:'Paranam',district:'Para',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Paranam+Suriname'},
  {name:'Savitrischool MULO',exact:['mulo'],description:'Suriname · Sanatan Dharm Bijzonder Onderwijs',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Savitrischool+MULO+Suriname'},
  {name:'MULO Mathoora',exact:['mulo'],description:'Sidodadiweg · Groningen · Saramacca',city:'Groningen',district:'Saramacca',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=MULO+Mathoora+Suriname'},
  {name:'Openbaar MULO Meerzorg',exact:['mulo'],description:'Meerzorg · Commewijne',city:'Meerzorg',district:'Commewijne',source:'Current public school directory',sourceUrl:'https://www.google.com/maps/search/?api=1&query=Openbaar+MULO+Meerzorg+Suriname'},

  // Current government TVET LBO/MBO directory.
  {name:'Selectaschool',exact:['lbo'],description:'Verlengde Weidestraat 23a · Centrum · LBO',city:'Paramaribo',district:'Paramaribo',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'LBO Swami Shradhanand',exact:['lbo'],description:'Nieuw Amsterdam · Commewijne',city:'Nieuw Amsterdam',district:'Commewijne',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'Oedayraisingh Varmaschool',exact:['lbo'],description:'Achillesstraat 2 · Rainville · LBO',city:'Paramaribo',district:'Paramaribo',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'LBO Ramdjanee',exact:['lbo'],description:'Bataviastraat 65 · Nickerie',city:'Nieuw Nickerie',district:'Nickerie',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'LBO Latour',exact:['lbo'],description:'Frigiterestraat · Latour · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 480090',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'LBO Atjoni',exact:['lbo'],description:'Atjoni · Sipaliwini',city:'Atjoni',district:'Sipaliwini',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'Surinaamse Technische School 1 (STS-1)',exact:['lbo'],description:'Passiebloemstraat 2 · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 401027',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'LBO Meerzorg',exact:['lbo'],description:'Commissaris Thurkowweg · Meerzorg · Commewijne',city:'Meerzorg',district:'Commewijne',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'H.J. Heilbronschool',exact:['lbo'],description:'Lotjessteeg 11c · Rainville · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 478393',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'Kaykoesyschool',exact:['lbo'],description:'Tjamelielaan 2 · Lelydorp · Wanica',city:'Lelydorp',district:'Wanica',phone:'+597 366026',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'LBO Albina',exact:['lbo'],description:'Albina · Marowijne',city:'Albina',district:'Marowijne',source:'GOV.SR 2026 school project',sourceUrl:SRC_POLANEN},
  {name:'LBO Hendrik Sylvesterschool',exact:['lbo'],description:'Henkielaan · Paramaribo',city:'Paramaribo',district:'Paramaribo',source:'GOV.SR 2026 school project',sourceUrl:SRC_POLANEN},

  {name:'AMTO Lelydorp',exact:['mbo'],description:'Tjammielaan · Lelydorp · MBO',city:'Lelydorp',district:'Wanica',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'Dep. IMEAO SGT',exact:['mbo'],description:'Mandoerweg · Tamanredjo · MBO',city:'Tamanredjo',district:'Commewijne',phone:'+597 356700',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'AMTO Saramacca',exact:['mbo'],description:'Von Freyburg km 55 · Saramacca · MBO',district:'Saramacca',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'AMTO Paramaribo',exact:['mbo'],description:'Mr. Jaggernath Lachmonstraat · Paramaribo · MBO',city:'Paramaribo',district:'Paramaribo',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'IMEAO 2',exact:['mbo'],description:'Metaalstraat 2 · Beekhuizen · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 403113',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'AMTO Moengo',exact:['mbo'],description:'Lijnweg · Moengo · Marowijne',city:'Moengo',district:'Marowijne',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'IMEAO 5',exact:['mbo'],description:'Magentaweg · Koewarasan · Wanica',city:'Koewarasan',district:'Wanica',phone:'+597 348200',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},
  {name:'NATIN Paramaribo',exact:['mbo'],description:'J. Lachmonstraat 180-182 · Tammenga · Paramaribo',city:'Paramaribo',district:'Paramaribo',phone:'+597 490579',source:'MinOWC Directoraat Beroepsonderwijs',sourceUrl:SRC_TVET},

  // Current HAVO/VWO accreditation list published by Nuffic.
  {name:'Ad Fontes Lyceum',exact:['havo','vwo'],description:'Paramaribo · geaccrediteerd HAVO/VWO',city:'Paramaribo',district:'Paramaribo',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC,aliases:'Adfontes Lyceum; Ad Fontes; Advontis; Advantis'},
  {name:'Avond Havo/Vwo Lelydorp',exact:['havo','vwo'],description:'Lelydorp · Wanica',city:'Lelydorp',district:'Wanica',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Avond Havo/Vwo Nickerie',exact:['havo','vwo'],description:'Nieuw Nickerie · Nickerie',city:'Nieuw Nickerie',district:'Nickerie',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Avond Havo/Vwo Paramaribo',exact:['havo','vwo'],description:'Paramaribo',city:'Paramaribo',district:'Paramaribo',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Avond Havo Zuid-west',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Christelijk HAVO',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'H.A.V.O. III',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'HAVO-IV',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Henri Dahlbergschool',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Openbaar Atheneum',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Openbaar 3-jarig HAVO Talenprofiel',exact:['havo'],description:'Suriname · geaccrediteerd HAVO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Algemene Middelbare School (AMS)',exact:['vwo'],description:'Paramaribo · geaccrediteerd VWO',city:'Paramaribo',district:'Paramaribo',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Arthur Alex Hogendoorn Atheneum (AAHA)',exact:['vwo'],description:'Paramaribo · Particulier · geaccrediteerd VWO',city:'Paramaribo',district:'Paramaribo',source:'Nuffic + MinOWC 2026 exam results',sourceUrl:SRC_NUFFIC,aliases:'A.H.A. Atheneum; AHA Atheneum; A.A. Hoogendoorn Atheneum; A.A. Hoogedoorn Atheneum; Arthur Alex Hogendoorn Atheneum',metrics:{schoolYear:'2025-2026',directPassRate:93.5,directPassed:72,candidates:77,rejected:0,metricLabel:'Voorlopig VWO-eindexamenresultaat 2026',metricSource:'https://sun.sr/nieuws/lokaal/currie-resultaten-vwo-en-havo-examens-beter-dan-vorig-jaar?id=44345'}},
  {name:'E.P. Meyer Lyceum',exact:['vwo'],description:'Suriname · geaccrediteerd VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Kangoeroe High',exact:['vwo'],description:'Marinus van Doornstraat 6 · Paramaribo · geaccrediteerd VWO',city:'Paramaribo',district:'Paramaribo',website:'https://kangoeroeschool.com/kangoeroe-high/',phone:'+597 534147',source:'Nuffic + Kangoeroe High official website',sourceUrl:SRC_NUFFIC,aliases:'Kangaroo High; Kangoeroe middelbare school; KH'},
  {name:'Mr. Dr. J.C. de Miranda Lyceum',exact:['vwo'],description:'Passiebloemstraat 1 · Paramaribo · geaccrediteerd VWO',city:'Paramaribo',district:'Paramaribo',phone:'+597 401048',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Nassy Brouwer College',exact:['vwo'],description:'Paramaribo · geaccrediteerd VWO',city:'Paramaribo',district:'Paramaribo',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Hanover',exact:['havo','vwo'],description:'Suriname · geaccrediteerd HAVO/VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Henry Hassankhan',exact:['havo','vwo'],description:'Suriname · geaccrediteerd HAVO/VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Kwatta',exact:['havo','vwo'],description:'Kwatta · Wanica · geaccrediteerd HAVO/VWO',city:'Kwatta',district:'Wanica',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Maho',exact:['havo','vwo'],description:'Saramacca · geaccrediteerd HAVO/VWO',district:'Saramacca',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Moengotapoe',exact:['havo','vwo'],description:'Moengotapoe · Marowijne · geaccrediteerd HAVO/VWO',city:'Moengotapoe',district:'Marowijne',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Nickerie',exact:['havo','vwo'],description:'Nickerie · geaccrediteerd HAVO/VWO',district:'Nickerie',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Sanatan Dharm',exact:['havo','vwo'],description:'Suriname · geaccrediteerd HAVO/VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap Tamanredjo',exact:['havo','vwo'],description:'Tamanredjo · Commewijne · geaccrediteerd HAVO/VWO',city:'Tamanredjo',district:'Commewijne',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'Scholengemeenschap VOS Welgedacht C',exact:['havo','vwo'],description:'Welgedacht C · Wanica · geaccrediteerd HAVO/VWO',city:'Welgedacht C',district:'Wanica',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'V.W.O. 4',exact:['vwo'],description:'Suriname · geaccrediteerd VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'VWO4 - Dependence',exact:['vwo'],description:'Suriname · geaccrediteerd VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'VWO-Gitaarstraat',exact:['vwo'],description:'Gitaarstraat · Suriname · geaccrediteerd VWO',source:'Nuffic current accreditation overview',sourceUrl:SRC_NUFFIC},
  {name:'De Hoeksteen College',exact:['havo','vwo'],description:'Paramaribo · HAVO/VWO',city:'Paramaribo',district:'Paramaribo',website:'https://hoeksteen.sr/',source:'School website',sourceUrl:SRC_HOEKSTEEN},

  // Hoger onderwijs: institutions explicitly listed by Nuffic/NOVA as current higher-education providers.
  {name:'Anton de Kom Universiteit van Suriname (AdeKUS)',exact:['hbo','wo'],description:'Leysweg 86 · Paramaribo · HBO/WO',city:'Paramaribo',district:'Paramaribo',website:'https://www.uvs.edu/',source:'Nuffic + NOVA',sourceUrl:SRC_NUFFIC},
  {name:'Academie voor Hoger Kunst en Cultuuronderwijs (AHKCO)',exact:['hbo'],description:'Paramaribo · HBO',city:'Paramaribo',district:'Paramaribo',source:'Nuffic higher-education overview',sourceUrl:SRC_NUFFIC},
  {name:'Conservatorium van Suriname',exact:['hbo'],description:'Suriname · HBO muziek',source:'Nuffic higher-education overview',sourceUrl:SRC_NUFFIC},
  {name:'FHR Institute for Higher Education',exact:['hbo'],description:'Paramaribo · HBO / graduate education',city:'Paramaribo',district:'Paramaribo',website:'https://www.fhrinstitute.sr/',phone:'+597 425101',source:'Nuffic + NOVA',sourceUrl:SRC_NOVA},
  {name:'Instituut voor de Opleiding van Leraren (IOL)',exact:['hbo'],description:'Leysweg 86 · Paramaribo · HBO lerarenopleiding',city:'Paramaribo',district:'Paramaribo',source:'Nuffic + NOVA',sourceUrl:SRC_NOVA},
  {name:'Lerarenopleiding Beroepsonderwijs (LOBO)',exact:['hbo'],description:'Suriname · HBO lerarenopleiding',website:'https://lobo.sr/',source:'Nuffic higher-education overview',sourceUrl:SRC_NUFFIC},
  {name:'Polytechnic College Suriname (PTC)',exact:['hbo'],description:'Paramaribo · HBO / University of Applied Sciences',city:'Paramaribo',district:'Paramaribo',website:'https://www.ptc.edu.sr/',phone:'+597 402509',source:'Nuffic + NOVA',sourceUrl:SRC_NOVA},
  {name:'Elsje Finck-Sanichar College (COVAB)',exact:['hbo'],description:'Suriname · HBO gezondheidszorg',website:'https://covab.sr/',source:'Nuffic + NOVA',sourceUrl:SRC_NOVA},
  {name:'Stichting Jeugdtandverzorging (JTV)',exact:['hbo'],description:'Suriname · HBO Oral Health Therapist',website:'https://jtvsuriname.com/',source:'Nuffic higher-education overview',sourceUrl:SRC_NUFFIC},
  {name:'University of Applied Science and Technology Suriname (UNASAT)',exact:['hbo'],description:'Suriname · geaccrediteerde HBO-opleidingen',source:'NOVA accreditation register',sourceUrl:SRC_NOVA},
  {name:'Institute of Management & Information Technology (IMIT)',exact:['hbo'],description:'Suriname · geaccrediteerde HBO-opleiding',source:'NOVA accreditation register',sourceUrl:SRC_NOVA},
  {name:'Hogeschool ABC',exact:['hbo'],description:'Suriname · geaccrediteerde HBO-opleidingen',source:'NOVA accreditation register',sourceUrl:SRC_NOVA},
  {name:'Netherlands Business Academy (NBA)',exact:['hbo'],description:'Suriname · geaccrediteerde bacheloropleiding',source:'NOVA accreditation register',sourceUrl:SRC_NOVA},
  {name:'Vanguard Community College',exact:['hbo'],description:'Suriname · geaccrediteerde bacheloropleidingen',source:'NOVA accreditation register',sourceUrl:SRC_NOVA},
  {name:'Janssen University of Applied Sciences',exact:['hbo'],description:'Suriname · geaccrediteerde bacheloropleidingen',source:'NOVA accreditation register',sourceUrl:SRC_NOVA}
];

const clean=v=>String(v??'').replace(/\u0000/g,'').replace(/\s+/g,' ').trim();
const low=v=>clean(v).toLowerCase();
const key=v=>low(v).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const json=(res,status,body)=>{if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body))};
const readJson=req=>new Promise((resolve,reject)=>{let raw='',size=0;req.setEncoding('utf8');req.on('data',c=>{size+=Buffer.byteLength(c);if(size>200000){reject(new Error('Payload too large'));req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch(e){reject(e)}});req.on('error',reject)});
const rad=x=>x*Math.PI/180;
function distance(a,b,c,d){const R=6371,p=rad(c-a),q=rad(d-b),z=Math.sin(p/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(q/2)**2;return 2*R*Math.asin(Math.sqrt(z))}
function expectedCode(country){return COUNTRY_CODES[low(country)]||''}
function sameCode(a,b){return clean(a).toUpperCase()&&clean(a).toUpperCase()===clean(b).toUpperCase()}

async function timedFetch(url,init={},ms=22000){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),ms);try{return await safeFetch(url,{...init,signal:ctrl.signal})}finally{clearTimeout(timer)}}
async function geocode(country,city=''){
  const q=[city,country].filter(Boolean).join(', '),u=new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');u.searchParams.set('limit','1');u.searchParams.set('q',q);
  const r=await timedFetch(u,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 strict-school-search'}},9000);
  if(!r.ok)throw new Error('Geocoder HTTP '+r.status);
  const d=await r.json().catch(()=>null),row=d?.[0];if(!row)throw new Error('Place not found in selected country');
  const code=clean(row.address?.country_code).toUpperCase(),expected=expectedCode(country);
  if(expected&&code&&!sameCode(expected,code))throw new Error('The selected city/area is not in '+country);
  return{lat:Number(row.lat),lon:Number(row.lon),country:clean(row.address?.country||country),countryCode:code||expected,display:clean(row.display_name||q)};
}
async function resolveCenter(body,country,city){
  if(city)return geocode(country,city);
  const lat=Number(body.lat),lon=Number(body.lon),provided=clean(body.countryCode).toUpperCase(),expected=expectedCode(country);
  if(Number.isFinite(lat)&&Number.isFinite(lon)&&provided&&(!expected||sameCode(provided,expected))){return{lat,lon,country,countryCode:provided,display:country}}
  return geocode(country,'');
}

function levelSet(tags={},extra=''){
  const a=low(tags.amenity),n=low(tags.name||tags['name:en']||tags.operator),i=low(tags['isced:level']||tags.isced),sheet=low(tags.sheet),text=[n,low(extra),low(tags.education),low(tags.description),sheet].join(' '),out=new Set();
  const digits=new Set((i.match(/[0-8]/g)||[]));
  const vwoLike=/\bvwo\b|atheneum|gymnasium|voorbereidend wetenschappelijk|pre[- ]?university|preuniversit/.test(text);
  const kindergartenLike=a==='kindergarten'||digits.has('0')||/preschool|pre-school|nursery|kindergarten|kleuterschool|kleuteronderwijs|kleuter|peuter|voorschool|early childhood|maternelle|infantil/.test(text);
  if(kindergartenLike){out.add('early');out.add('kindergarten')}
  if(digits.has('1')||/primary|elementary|basisschool|lagere school|\bglo\b|grundschule|école primaire|primaria/.test(text))out.add('primary');
  if(/\bmulo\b/.test(text)){out.add('lower_secondary');out.add('mulo')}
  if(/\blbo\b/.test(text)){out.add('lower_secondary');out.add('vocational');out.add('lbo')}
  if(digits.has('2')||/lower secondary|junior secondary|middle school|junior high|sekundarstufe i|collège|secondaria di i|\bvoj\b|secundair i|secondary i|senior phase/.test(text))out.add('lower_secondary');
  if(/\bhavo\b/.test(text)){out.add('upper_secondary');out.add('havo')}
  if(vwoLike){out.add('upper_secondary');out.add('vwo')}
  if(/\bnatin\b|\bimeao\b|kweekschool|\bmbo\b/.test(text)){out.add('upper_secondary');out.add('vocational');out.add('mbo')}
  if(digits.has('3')||digits.has('4')||/upper secondary|senior secondary|high school|sixth form|sekundarstufe ii|lycée|secondaria di ii|\bvos\b|grades? 9|grades? 10|grades? 11|grades? 12|fet\b/.test(text))out.add('upper_secondary');
  if(/technical|vocational|trade school|trade college|beroeps|technisch|polytechnic|\btvet\b|\bamto\b|ausbildung|profissional|professional institute/.test(text))out.add('vocational');
  if(/\bhbo\b|hogeschool|university of applied sciences/.test(text)){out.add('higher');out.add('hbo')}
  if(/\badekus\b|anton de kom|a?dekus|university|universiteit|université|universität|universidad|università|faculty|faculteit/.test(text)){out.add('higher');out.add('wo')}
  if(digits.has('5')||digits.has('6')||digits.has('7')||digits.has('8')||/higher education|tertiary education|college of|institute of higher/.test(text))out.add('higher');
  if(a==='college'&&!out.has('upper_secondary'))out.add('higher');
  if(a==='language_school'||/adult education|adult learning|continuing education|training centre|training center|professional learning/.test(text))out.add('adult');
  if(a==='school'&&!out.size)out.add('school');
  return[...out];
}
function matchesLevel(levels,wanted){
  if(wanted==='all')return true;
  const set=new Set(levels||[]);
  if(wanted==='secondary'||wanted==='lower_secondary')return set.has('lower_secondary');
  if(wanted==='upper_secondary')return set.has('upper_secondary');
  if(wanted==='vocational')return set.has('upper_secondary')||(set.has('vocational')&&!set.has('lower_secondary'));
  if(wanted==='higher')return set.has('higher');
  if(wanted==='adult')return set.has('adult');
  if(wanted==='primary')return set.has('primary');
  if(wanted==='early'||wanted==='kindergarten')return set.has('kindergarten')||set.has('early');
  if(['mulo','lbo','havo','vwo','mbo','hbo','wo'].includes(wanted))return set.has(wanted);
  return set.has(wanted);
}
function publicLevel(levels){
  const s=new Set(levels||[]);
  if(s.has('wo'))return'wo';
  if(s.has('hbo'))return'hbo';
  if(s.has('mbo'))return'mbo';
  if(s.has('vwo'))return'vwo';
  if(s.has('havo'))return'havo';
  if(s.has('lbo'))return'lbo';
  if(s.has('mulo'))return'mulo';
  if(s.has('kindergarten'))return'kindergarten';
  if(s.has('higher'))return'higher';
  if(s.has('upper_secondary'))return'upper_secondary';
  if(s.has('lower_secondary'))return'secondary';
  if(s.has('vocational'))return'vocational';
  if(s.has('primary'))return'primary';
  if(s.has('early'))return'early';
  if(s.has('adult'))return'adult';
  return'school';
}
function curatedLevels(exact=[]){
  const out=new Set(exact);
  if(out.has('mulo'))out.add('lower_secondary');
  if(out.has('lbo')){out.add('lower_secondary');out.add('vocational')}
  if(out.has('havo')||out.has('vwo'))out.add('upper_secondary');
  if(out.has('mbo')){out.add('upper_secondary');out.add('vocational')}
  if(out.has('hbo')||out.has('wo'))out.add('higher');
  return[...out];
}
function curatedSurinameSchools(){
  return SURINAME_CURATED_RAW.map(row=>{
    const levels=curatedLevels(row.exact||[]);
    return{
      name:row.name,description:row.description||'',lat:null,lon:null,distance:null,
      website:row.website||'',phone:row.phone||'',email:row.email||'',
      source:row.source||'SCHOLARK verified Suriname supplement',sourceUrl:row.sourceUrl||'',
      level:publicLevel(levels),levels,levelDetail:levels.join(','),official:false,
      tags:{city:row.city||'',district:row.district||'',aliases:row.aliases||'',curated:'true','addr:country':'SR'},
      metrics:row.metrics||null,verifiedCurrent:true
    };
  });
}
function schoolNameMatch(row,query){
  const terms=key(query).split(' ').filter(Boolean);if(!terms.length)return true;
  const hay=key([row?.name,row?.description,row?.tags?.aliases,row?.tags?.schoolcode].filter(Boolean).join(' '));
  return terms.every(term=>hay.includes(term));
}

function canonicalSchoolIdentity(row){
  const hay=key([row?.name,row?.tags?.aliases].filter(Boolean).join(' '));
  if(/(^| )a h a atheneum( |$)/.test(hay)||/(arthur alex )?hog?endoorn atheneum/.test(hay)||/hoog?edoorn atheneum/.test(hay)){
    return {key:'arthur alex hogendoorn atheneum',name:'Arthur Alex Hogendoorn Atheneum (AAHA)'};
  }
  return {key:key(row?.name),name:clean(row?.name)};
}
const SURINAME_TAXONOMY={version:VERSION,kindergarten:'kleuteronderwijs_leerjaar_1_2',primary:'lagere_school_basisschool_leerjaar_3_8',mulo:'voj_mulo',lbo:'voj_lbo',havo:'vos_havo',vwo:'vos_vwo',mbo:'vos_mbo_natin_imeao_kweekschool',hbo:'higher_professional_hbo',wo:'university_wo_adekus',secondary:'lower_secondary',lower_secondary:'lower_secondary',upper_secondary:'upper_secondary',vocational:'vocational_generic',higher:'higher_generic',genericSchoolMatchesSpecific:false};

function normalized(e,pos){
  const t=e.tags||{},lat=Number(e.lat??e.center?.lat),lon=Number(e.lon??e.center?.lon),name=clean(t.name||t['name:en']||t.operator||t.ref);
  if(!name||!Number.isFinite(lat)||!Number.isFinite(lon))return null;
  const description=[t.description,t.operator,t['addr:street'],t['addr:housenumber'],t['addr:city']||t['addr:town']||t['addr:village']].filter(Boolean).map(clean).join(' · '),levels=levelSet({...t,name},description);
  return{name,description,lat,lon,distance:distance(pos.lat,pos.lon,lat,lon),website:clean(t.website||t['contact:website']),phone:clean(t.phone||t['contact:phone']),email:clean(t.email||t['contact:email']),source:'OpenStreetMap',level:publicLevel(levels),levels,levelDetail:levels.join(','),tags:{...t}};
}

function decodeHtml(s=''){return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x2F;/g,'/').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function cellCol(ref=''){const letters=String(ref).match(/^[A-Z]+/i)?.[0]?.toUpperCase()||'';let n=0;for(const ch of letters)n=n*26+(ch.charCodeAt(0)-64);return Math.max(0,n-1)}
function normHeader(v){return key(v)}
function xmlValue(raw){return decodeHtml(String(raw||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1'))}
function sharedStringsFrom(xml){return[...String(xml||'').matchAll(/<si\b[\s\S]*?<\/si>/gi)].map(m=>clean([...m[0].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi)].map(x=>xmlValue(x[1])).join('')))}
function rowCells(rowXml,shared){const out=[];for(const m of String(rowXml||'').matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/gi)){const attrs=m[1]||'',body=m[2]||'',ref=(attrs.match(/\br="([^"]+)"/i)||[])[1]||'',type=(attrs.match(/\bt="([^"]+)"/i)||[])[1]||'';let value='';if(type==='inlineStr')value=[...body.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi)].map(x=>xmlValue(x[1])).join(' ');else{const raw=(body.match(/<v>([\s\S]*?)<\/v>/i)||[])[1]??'';value=type==='s'?shared[Number(raw)]??'':xmlValue(raw)}out[cellCol(ref)]=clean(value)}return out}
async function officialSurinameSchools(){
  if(officialCache&&Date.now()-officialCache.at<6*60*60*1000)return officialCache.rows;
  if(officialPromise)return officialPromise;
  officialPromise=(async()=>{
    try{
      const response=await timedFetch(SR_OFFICIAL_URL,{headers:{accept:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','user-agent':'SCHOLARK/1.0 strict-school-roster'}},16000);
      if(!response.ok)throw new Error('Official school roster HTTP '+response.status);
      const buffer=Buffer.from(await response.arrayBuffer());if(buffer.length<1000||buffer.length>20*1024*1024)throw new Error('Official school roster returned an unexpected file size');
      const mod=await import('jszip'),JSZip=mod.default||mod,zip=await JSZip.loadAsync(buffer,{checkCRC32:false});
      const sharedXml=await zip.file('xl/sharedStrings.xml')?.async('string').catch(()=>''),shared=sharedStringsFrom(sharedXml||''),workbook=await zip.file('xl/workbook.xml')?.async('string'),rels=await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
      if(!workbook||!rels)throw new Error('Official school workbook structure is incomplete');
      const targets={};for(const m of rels.matchAll(/<Relationship\b([^>]*)\/?>(?:<\/Relationship>)?/gi)){const attrs=m[1]||'',id=(attrs.match(/\bId="([^"]+)"/i)||[])[1],target=(attrs.match(/\bTarget="([^"]+)"/i)||[])[1];if(id&&target)targets[id]=target.replace(/^\//,'')}
      const sheets=[];for(const m of workbook.matchAll(/<sheet\b([^>]*)\/?>(?:<\/sheet>)?/gi)){const attrs=m[1]||'',name=xmlValue((attrs.match(/\bname="([^"]+)"/i)||[])[1]||''),rid=(attrs.match(/\br:id="([^"]+)"/i)||[])[1];let target=targets[rid]||'';if(target&&!target.startsWith('xl/'))target='xl/'+target.replace(/^\.\//,'');if(name&&target)sheets.push({name,target})}
      const rows=[];
      for(const sheet of sheets){
        const xml=await zip.file(sheet.target)?.async('string');if(!xml)continue;
        const parsed=[...xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/gi)].map(m=>rowCells(m[1],shared));let headerIndex=-1,header=[];
        for(let i=0;i<Math.min(parsed.length,25);i++){const normalized=parsed[i].map(normHeader);if(normalized.some(x=>/schoolnaam|school name|naam school/.test(x))||(normalized.some(x=>x==='schoolcode')&&normalized.some(x=>/adres|address/.test(x)))){headerIndex=i;header=normalized;break}}
        if(headerIndex<0)continue;
        const find=patterns=>header.findIndex(h=>patterns.some(p=>p.test(h))),nameCol=find([/^schoolnaam$/,/^school name$/,/^naam school$/]),codeCol=find([/schoolcode/,/^code$/]),addressCol=find([/^adres$/,/address/]),districtCol=find([/district/]),phoneCol=find([/telefoon/,/contactnummer/,/phone/]),denomCol=find([/denominatie/,/religie/,/denomination/]);
        if(nameCol<0)continue;let lastDistrict='';
        for(let i=headerIndex+1;i<parsed.length;i++){
          const row=parsed[i],name=clean(row[nameCol]);if(!name||/^totaal|^total/i.test(name))continue;
          const district=clean(districtCol>=0?row[districtCol]:'')||lastDistrict;if(district)lastDistrict=district;
          const address=clean(addressCol>=0?row[addressCol]:''),phone=clean(phoneCol>=0?row[phoneCol]:''),denomination=clean(denomCol>=0?row[denomCol]:''),code=clean(codeCol>=0?row[codeCol]:'');
          const description=[address,district,denomination,code?'Schoolcode '+code:''].filter(Boolean).join(' · '),tags={district,sheet:sheet.name,schoolcode:code,denomination},levels=levelSet({...tags,name},description);
          rows.push({name,description,lat:null,lon:null,distance:null,website:'',phone,email:'',source:'MinOWC official school list',sourceUrl:SR_OFFICIAL_URL,level:publicLevel(levels),levels,levelDetail:levels.join(','),official:true,tags});
        }
      }
      const cleanRows=mergeRows(rows);if(!cleanRows.length)throw new Error('Official school workbook contained no readable school rows');
      officialCache={at:Date.now(),rows:cleanRows};console.log('[SCHOLARK] Strict school official Suriname roster ready · '+cleanRows.length+' records');return cleanRows;
    }catch(e){console.warn('[SCHOLARK] Strict school official roster unavailable: '+clean(e?.message||e));return[]}
    finally{officialPromise=null}
  })();
  return officialPromise;
}
function officialLocationMatch(row,city){
  if(!city)return true;const c=key(city),district=key(row.tags?.district),hay=key([row.name,row.description,row.tags?.district].filter(Boolean).join(' '));
  if(!c)return true;if(district===c)return true;if(hay.includes(c))return true;if(c.length>=5&&district&&(c.includes(district)||district.includes(c)))return true;return false;
}
function mergeRows(rows){
  const map=new Map();
  for(const raw of rows){
    const identity=canonicalSchoolIdentity(raw),k=identity.key;if(!k)continue;
    const row={...raw,name:identity.name||raw.name};
    const prev=map.get(k);
    if(!prev){map.set(k,{...row,levels:[...new Set(row.levels||[])]});continue}
    const levels=[...new Set([...(prev.levels||[]),...(row.levels||[])])],lat=Number.isFinite(Number(prev.lat))?prev.lat:row.lat,lon=Number.isFinite(Number(prev.lon))?prev.lon:row.lon,d=prev.distance!=null?prev.distance:row.distance;
    const officialDescription=prev.official?prev.description:(row.official?row.description:'');
    map.set(k,{...prev,...row,name:identity.name||prev.name||row.name,lat,lon,distance:d,website:prev.website||row.website||'',phone:prev.phone||row.phone||'',email:prev.email||row.email||'',description:row.verifiedCurrent?(row.description||prev.description):(officialDescription||prev.description||row.description),source:[prev.source,row.source].filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).join(' + '),official:!!(prev.official||row.official),verifiedCurrent:!!(prev.verifiedCurrent||row.verifiedCurrent),metrics:row.metrics||prev.metrics||null,tags:{...(prev.tags||{}),...(row.tags||{})},levels,level:publicLevel(levels),levelDetail:levels.join(',')});
  }
  return[...map.values()];
}

async function overpass(query){
  const failures=[];
  for(const endpoint of OVERPASS){
    try{const r=await timedFetch(endpoint,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded;charset=UTF-8',accept:'application/json','user-agent':'SCHOLARK/1.0 strict-school-search'},body:'data='+encodeURIComponent(query)},18000);if(!r.ok){failures.push(endpoint+' HTTP '+r.status);continue}const d=await r.json().catch(()=>null);if(Array.isArray(d?.elements))return{elements:d.elements,endpoint};failures.push(endpoint+' invalid JSON')}catch(e){failures.push(endpoint+' '+clean(e?.name==='AbortError'?'timeout':e?.message||e))}
  }
  const e=new Error('Strict country school sources unavailable');e.failures=failures;throw e;
}
function countryAreaQuery(country,countryCode,pos,radius,national){
  const iso=clean(countryCode).toUpperCase().replace(/[^A-Z]/g,'').slice(0,2),safeName=clean(country).replace(/["\\]/g,''),scope=national?'(area.country)':`(area.country)(around:${Math.round(radius*1000)},${pos.lat},${pos.lon})`;
  const area=iso?`area["ISO3166-1"="${iso}"]["admin_level"="2"]->.country;`:`area["name"="${safeName}"]["boundary"="administrative"]["admin_level"="2"]->.country;`;
  return`[out:json][timeout:18];${area}(nwr["amenity"~"kindergarten|school|college|university|language_school"]${scope};nwr["building"="school"]${scope};nwr["office"="educational_institution"]${scope};);out center tags 1800;`;
}

async function discover(body){
  const country=clean(body.country||'Suriname')||'Suriname',city=clean(body.city),level=clean(body.level||'all').toLowerCase(),nameQuery=clean(body.name),radius=Math.max(1,Math.min(700,Number(body.radius)||50)),center=await resolveCenter(body,country,city);
  if(!Number.isFinite(center.lat)||!Number.isFinite(center.lon))throw new Error('Selected place could not be resolved');
  const countryCode=center.countryCode||expectedCode(country),national=/^suriname$/i.test(country)&&!city,query=countryAreaQuery(country,countryCode,center,radius,national),sourceStatus=[];
  if(/^suriname$/i.test(country)&&nameQuery){
    const curatedFast=curatedSurinameSchools()
      .filter(x=>officialLocationMatch(x,city)&&matchesLevel(x.levels,level)&&schoolNameMatch(x,nameQuery));
    if(curatedFast.length){
      curatedFast.sort((a,b)=>a.name.localeCompare(b.name));
      return{ok:true,strictCountry:true,country,city,level,name:nameQuery,radius,national,center:{lat:center.lat,lon:center.lon,countryCode,display:center.display},provider:'SCHOLARK verified current Suriname supplement',sourceStatus:[{source:'SCHOLARK verified current Suriname supplement',ok:true,count:curatedFast.length}],count:curatedFast.length,schools:curatedFast.slice(0,1500),taxonomy:SURINAME_TAXONOMY};
    }
  }
  const officialPromiseForRequest=/^suriname$/i.test(country)?officialSurinameSchools():Promise.resolve([]);
  let rows=[],provider='OpenStreetMap country-boundary search';
  try{const o=await overpass(query);sourceStatus.push({source:o.endpoint,ok:true,count:o.elements.length});rows=o.elements.map(e=>normalized(e,center)).filter(Boolean)}catch(e){sourceStatus.push(...(e.failures||[]).map(source=>({source,ok:false})));rows=[]}
  if(!national)rows=rows.filter(x=>x.distance<=radius+1);
  const officialAll=await officialPromiseForRequest,official=officialAll.filter(x=>officialLocationMatch(x,city));
  if(official.length){rows=mergeRows([...official,...rows]);provider='MinOWC official school list + '+provider;sourceStatus.unshift({source:'MinOWC official school list',ok:true,count:official.length})}else rows=mergeRows(rows);
  if(/^suriname$/i.test(country)){
    const curated=curatedSurinameSchools().filter(x=>officialLocationMatch(x,city));
    rows=mergeRows([...curated,...rows]);
    if(curated.length)sourceStatus.unshift({source:'SCHOLARK verified current Suriname supplement',ok:true,count:curated.length});
  }
  rows=rows.filter(x=>matchesLevel(x.levels,level));
  if(nameQuery)rows=rows.filter(x=>schoolNameMatch(x,nameQuery));
  rows.sort((a,b)=>(a.distance??9999)-(b.distance??9999)||a.name.localeCompare(b.name));
  console.log(`[SCHOLARK] Strict school search ${country}${city?', '+city:''} · level ${level}${nameQuery?' · name '+nameQuery:''} · ${rows.length} matches · country ${countryCode||'unknown'} · official ${official.length}`);
  return{ok:true,strictCountry:true,country,city,level,name:nameQuery,radius,national,center:{lat:center.lat,lon:center.lon,countryCode,display:center.display},provider,sourceStatus,count:rows.length,schools:rows.slice(0,1500),taxonomy:SURINAME_TAXONOMY};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const[req,res]=args;let pathname='';try{pathname=new URL(req.url||'/','http://localhost').pathname}catch{return previousEmit.call(this,type,...args)}
  if(req.method==='GET'&&pathname==='/api/schools/health'){
    json(res,200,{ok:true,strictCountry:true,version:VERSION,providers:['OpenStreetMap country-boundary search','MinOWC official Suriname school list','SCHOLARK verified current Suriname supplement','Photon geocoder fallback'],levels:{kindergarten:'Kleuterschool / Kleuteronderwijs · Leerjaar 1–2 · 4–6 jaar',primary:'Lagere school / Basisschool · Leerjaar 3–8 · 6–12 jaar',mulo:'VOJ · MULO · 12–16 jaar',lbo:'VOJ · LBO · 12–16 jaar',havo:'VOS · HAVO · 16–18 jaar',vwo:'VOS · VWO · 16–19 jaar',mbo:'VOS · MBO · NATIN / IMEAO / Kweekschool · 16–20+ jaar',hbo:'Hoger Onderwijs · HBO · 18/19+ jaar',wo:'Hoger Onderwijs · WO / Universiteit · AdeKUS · 19+ jaar',early:'ISCED 0 / early childhood',secondary:'lower secondary / VOJ',upper_secondary:'upper secondary / VOS',vocational:'vocational generic',higher:'higher education generic',adult:'adult/professional learning'},officialRoster:{configured:true,cached:!!officialCache,count:officialCache?.rows?.length||0},curatedSupplement:{count:SURINAME_CURATED_RAW.length,includesPolanen:SURINAME_CURATED_RAW.some(x=>/J\.H\.N\. Polanenschool/i.test(x.name)),includesAAHA:SURINAME_CURATED_RAW.some(x=>/Arthur Alex Hogendoorn Atheneum/i.test(x.name)),includesKangoeroe:SURINAME_CURATED_RAW.some(x=>/Kangoeroe High/i.test(x.name)),includesAdFontes:SURINAME_CURATED_RAW.some(x=>/Ad Fontes Lyceum/i.test(x.name))}});return true;
  }
  if(req.method==='GET'&&pathname==='/api/schools/vwo-health'){
    officialSurinameSchools().then(rows=>{
      const vwo=rows.filter(x=>matchesLevel(x.levels,'vwo'));
      const hogendoorn=vwo.filter(x=>/hogendoorn\s+atheneum/i.test(clean(x.name))||/arthur.*hogendoorn/i.test(clean(x.name)));
      json(res,200,{ok:true,version:VERSION,vwoEnabled:true,vwoCount:vwo.length,hogendoornDetected:hogendoorn.length>0,hogendoorn:hogendoorn.slice(0,5).map(x=>({name:x.name,levels:x.levels,source:x.source}))});
    }).catch(e=>json(res,503,{ok:false,vwoEnabled:true,error:clean(e?.message||e),version:VERSION}));return true;
  }
  if(req.method==='POST'&&pathname==='/api/schools/search'){
    readJson(req).then(discover).then(x=>json(res,200,x)).catch(e=>json(res,400,{ok:false,strictCountry:true,error:clean(e?.message||e),version:VERSION}));return true;
  }
  return previousEmit.call(this,type,...args);
};

setTimeout(()=>officialSurinameSchools().catch(()=>{}),2200);
console.log('[SCHOLARK] Strict school country + level search '+VERSION+' ready');