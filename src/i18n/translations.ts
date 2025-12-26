export type Language = "hr" | "en";

export interface Translations {
  // App title
  appTitle: string;
  appSubtitle: string;

  // Control panel
  controlPanelTitle: string;
  controlPanelSubtitle: string;
  transitPlanLabel: string;
  activeElementsTitle: string;
  activeElementsChecked: string;
  activeElementsTimeline: string;
  activeElementsClickStations: string;
  resetViewButton: string;

  // Plans
  realisticPlan: string;
  ambitiousPlan: string;
  realisticPlanDescription: string;
  ambitiousPlanDescription: string;
  realisticPlanCost: string;
  ambitiousPlanCost: string;

  // Transit lines
  metroLineA: string;
  metroLineB: string;
  metroLineC: string;
  premetroTunnel: string;
  savaSkyway: string;
  developmentZones: string;
  buildings3d: string;
  mode3d: string;
  animatedTraffic: string;
  trafficSpeed: string;
  speedSlow: string;
  speedNormal: string;
  speedFast: string;

  // Construction status
  building: string;
  planning: string;

  // 3D Settings
  graphicsSettings: string;

  // Timeline
  timelineLabel: string;
  viewFullNetwork: string;
  presentDay: string;
  earlyPhase: string;
  midPhase: string;
  advanced: string;
  mature: string;
  complete: string;

  // Timeline descriptions - Realistic
  realistic2025Description: string;
  realistic2030Description: string;
  realistic2035Description: string;
  realistic2040Description: string;
  realistic2045Description: string;
  realistic2050Description: string;

  // Timeline descriptions - Ambitious
  ambitious2025Description: string;
  ambitious2030Description: string;
  ambitious2035Description: string;
  ambitious2040Description: string;
  ambitious2045Description: string;
  ambitious2050Description: string;

  // Timeline labels
  phase1: string;
  phase2: string;
  phase3: string;
  phase4: string;

  // Info panel
  infoPanelTitle: string;
  overviewTitle: string;
  overviewRealistic: string;
  overviewAmbitious: string;
  reasoningTitle: string;
  reasoningRealistic: string;
  reasoningAmbitious: string;
  timelineDetailsTitle: string;
}

export const translations: Record<Language, Translations> = {
  hr: {
    // App title
    appTitle: "ZAGREB",
    appSubtitle: "BUDUĆA PROMETNA MREŽA",

    // Control panel
    controlPanelTitle: "🚇 Zagreb 2050",
    controlPanelSubtitle: "Koristi vremensku crtu za istraživanje faza gradnje",
    transitPlanLabel: "PROMETNI PLAN",
    activeElementsTitle: "Aktivni elementi:",
    activeElementsChecked: "✓ Označeno = Trenutno vidljivo",
    activeElementsTimeline: "Koristi vremensku crtu za faze gradnje",
    activeElementsClickStations: "Klikni postaje za detalje",
    resetViewButton: "🔄 Vrati pogled",

    // Plans
    realisticPlan: "Realistični",
    ambitiousPlan: "Ambiciozni",
    realisticPlanDescription:
      "Ostvariv hibridni sustav - Premetro, jedna metro linija, gondola",
    ambitiousPlanDescription: "Sveobuhvatna metro mreža s tri potpune linije",
    realisticPlanCost: "3-4,5 milijardi € kroz 20 godina",
    ambitiousPlanCost: "8-12 milijardi € kroz 25 godina",

    // Transit lines
    metroLineA: "Metro linija A",
    metroLineB: "Metro linija B",
    metroLineC: "Metro linija C",
    premetroTunnel: "🚇 Premetro tunel",
    savaSkyway: "🚡 Sava Skyway",
    developmentZones: "🏗️ Razvojne zone",
    buildings3d: "🏢 3D zgrade",
    mode3d: "🌄 3D teren i atmosfera",
    animatedTraffic: "🚇 Animirani promet",
    trafficSpeed: "Brzina:",
    speedSlow: "Sporo",
    speedNormal: "Normalno",
    speedFast: "Brzo",

    // Construction status
    building: "u gradnji",
    planning: "u planiranju",

    // 3D Settings
    graphicsSettings: "Grafičke postavke",

    // Timeline
    timelineLabel: "Vremenska crta:",
    viewFullNetwork: "Prikaži punu mrežu",
    presentDay: "Sadašnjost",
    earlyPhase: "Rana faza",
    midPhase: "Srednja faza",
    advanced: "Napredna",
    mature: "Zrela",
    complete: "Završeno",

    // Timeline descriptions - Realistic
    realistic2025Description: "Faza planiranja - Početni projekti u tijeku",
    realistic2030Description: "Gradnja zapadnog premetro tunela",
    realistic2035Description: "Premetro završen, južni segment Metro A otvoren",
    realistic2040Description:
      "Metro A stiže do zračne luke, gondola potpuno operativna",
    realistic2045Description:
      "Sjeverno proširenje Metro A otvoreno, razvojne zone aktivne",
    realistic2050Description: "Potpuna Metro A linija do Sesveta operativna",

    // Timeline descriptions - Ambitious
    ambitious2025Description: "Faza planiranja - Sveobuhvatni dizajn mreže",
    ambitious2030Description: "Gradnja Premetra i južnog segmenta Metro A",
    ambitious2035Description:
      "Metro A završen, istočno-zapadni segment Linije B otvoren",
    ambitious2040Description: "Metro B završen, gondola potpuno operativna",
    ambitious2045Description: "Istočni segment Metro C u gradnji",
    ambitious2050Description: "Potpuna mreža tri metro linije operativna",

    // Timeline labels
    phase1: "Faza 1",
    phase2: "Faza 2",
    phase3: "Faza 3",
    phase4: "Faza 4",

    // Info panel
    infoPanelTitle: "O projektu",
    overviewTitle: "Pregled",
    overviewRealistic:
      "Realistični plan predstavlja uravnotežen pristup modernizaciji javnog prijevoza u Zagrebu. Kombinirajući premetro (lakši podzemni sustav), jednu kompletnu metro liniju A, te gondolu preko rijeke Save, ovaj plan omogućuje značajno poboljšanje povezanosti grada bez prekomjernih troškova. Fokus je na povezivanju ključnih točaka: centra grada, zračne luke, i južnih područja poput Velike Gorice.",
    overviewAmbitious:
      "Ambiciozni plan predviđa potpunu metro mrežu od tri linije koja bi transformirala Zagreb u grad s pravim metropolitanskim javnim prijevozom. Ovaj sustav bi pokrivao sve ključne pravce: istok-zapad (Linija B), sjever-jug (Linija A), te dodatni pravac prema Dubravi (Linija C). Gondola i premetro dopunjuju mrežu, omogućujući brzo i učinkovito kretanje kroz cijeli grad.",
    reasoningTitle: "Obrazloženje",
    reasoningRealistic:
      "Zagreb trenutno nema podzemni brzi tranzitni sustav, što dovodi do prenatrpanosti tramvajskih linija i ovisnosti o automobilima. Realistični plan odgovara na ove izazove implementacijom premetro tunela koji koristi postojeće tramvajske trase, čime se smanjuju troškovi i vrijeme gradnje. Metro linija A povezuje najfrekventnije koridore: od Sesveta kroz centar do Velike Gorice i zračne luke. Gondola preko Save nudi inovativno rješenje za brzu povezanost između južnih i zapadnih dijelova grada.",
    reasoningAmbitious:
      "Kako Zagreb raste, potreba za sveobuhvatnom metro mrežom postaje sve očitija. Ambiciozni plan temelji se na dugoročnoj viziji grada s milijun stanovnika i razvijenim javnim prijevozom. Tri metro linije stvaraju mrežni efekt gdje se linije međusobno podupiru i omogućuju brže putovanje sa presjedanjem. Ovaj sustav bi smanjio ovisnost o automobilima, potaknuo održivi urbani razvoj, i pozicionirao Zagreb kao modernu europsku metropolu. Iako skuplji, dugoročna korist opravdava investiciju kroz smanjene troškove cestovne infrastrukture i poboljšanu kvalitetu života.",
    timelineDetailsTitle: "Faze gradnje",
  },
  en: {
    // App title
    appTitle: "ZAGREB",
    appSubtitle: "FUTURE TRANSIT NETWORK",

    // Control panel
    controlPanelTitle: "🚇 Zagreb 2050",
    controlPanelSubtitle: "Use timeline to explore construction phases",
    transitPlanLabel: "TRANSIT PLAN",
    activeElementsTitle: "Active Elements:",
    activeElementsChecked: "✓ Checked = Currently visible",
    activeElementsTimeline: "Use timeline slider to see construction phases",
    activeElementsClickStations: "Click stations for details",
    resetViewButton: "🔄 Reset View",

    // Plans
    realisticPlan: "Realistic",
    ambitiousPlan: "Ambitious",
    realisticPlanDescription:
      "Achievable hybrid system - Premetro, one metro line, gondola",
    ambitiousPlanDescription:
      "Comprehensive metro network with three full lines",
    realisticPlanCost: "€3-4.5 billion over 20 years",
    ambitiousPlanCost: "€8-12 billion over 25 years",

    // Transit lines
    metroLineA: "Metro Line A",
    metroLineB: "Metro Line B",
    metroLineC: "Metro Line C",
    premetroTunnel: "🚇 Premetro Tunnel",
    savaSkyway: "🚡 Sava Skyway",
    developmentZones: "🏗️ Development Zones",
    buildings3d: "🏢 3D Buildings",
    mode3d: "🌄 3D Terrain & Atmosphere",
    animatedTraffic: "🚇 Animated Traffic",
    trafficSpeed: "Speed:",
    speedSlow: "Slow",
    speedNormal: "Normal",
    speedFast: "Fast",

    // Construction status
    building: "building",
    planning: "planning",

    // 3D Settings
    graphicsSettings: "Graphics Settings",

    // Timeline
    timelineLabel: "Timeline:",
    viewFullNetwork: "View Full Network",
    presentDay: "Present",
    earlyPhase: "Early Phase",
    midPhase: "Mid Phase",
    advanced: "Advanced",
    mature: "Mature",
    complete: "Complete",

    // Timeline descriptions - Realistic
    realistic2025Description: "Planning phase - Initial designs underway",
    realistic2030Description: "Western premetro tunnel under construction",
    realistic2035Description: "Premetro complete, Metro A south segment opens",
    realistic2040Description:
      "Metro A reaches Airport, Gondola fully operational",
    realistic2045Description:
      "Northern Metro A extension opens, development zones active",
    realistic2050Description: "Full Metro A line to Sesvete operational",

    // Timeline descriptions - Ambitious
    ambitious2025Description: "Planning phase - Comprehensive network design",
    ambitious2030Description: "Premetro + Metro A south segment construction",
    ambitious2035Description: "Metro A complete, Line B east-west opens",
    ambitious2040Description: "Metro B complete, Gondola fully operational",
    ambitious2045Description: "Metro C east segment under construction",
    ambitious2050Description: "Full 3-line metro network operational",

    // Timeline labels
    phase1: "Phase 1",
    phase2: "Phase 2",
    phase3: "Phase 3",
    phase4: "Phase 4",

    // Info panel
    infoPanelTitle: "About the Project",
    overviewTitle: "Overview",
    overviewRealistic:
      "The Realistic Plan represents a balanced approach to modernizing Zagreb's public transport. By combining premetro (light underground system), one complete metro line A, and a gondola across the Sava River, this plan enables significant improvement in city connectivity without excessive costs. The focus is on connecting key points: the city center, the airport, and southern areas like Velika Gorica.",
    overviewAmbitious:
      "The Ambitious Plan envisions a complete three-line metro network that would transform Zagreb into a city with true metropolitan public transport. This system would cover all key directions: east-west (Line B), north-south (Line A), and an additional route to Dubrava (Line C). The gondola and premetro complement the network, enabling fast and efficient movement throughout the city.",
    reasoningTitle: "Rationale",
    reasoningRealistic:
      "Zagreb currently lacks an underground rapid transit system, leading to overcrowded tram lines and car dependency. The Realistic Plan addresses these challenges by implementing a premetro tunnel that uses existing tram routes, reducing costs and construction time. Metro Line A connects the busiest corridors: from Sesvete through the center to Velika Gorica and the airport. The Sava gondola offers an innovative solution for quick connectivity between the southern and western parts of the city.",
    reasoningAmbitious:
      "As Zagreb grows, the need for a comprehensive metro network becomes increasingly evident. The Ambitious Plan is based on a long-term vision of a city with one million inhabitants and developed public transport. Three metro lines create a network effect where lines support each other and enable faster travel with transfers. This system would reduce car dependency, promote sustainable urban development, and position Zagreb as a modern European metropolis. Although more expensive, the long-term benefits justify the investment through reduced road infrastructure costs and improved quality of life.",
    timelineDetailsTitle: "Construction Phases",
  },
};
