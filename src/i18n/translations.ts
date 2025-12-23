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

  // Construction status
  building: string;
  planning: string;

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

    // Construction status
    building: "u gradnji",
    planning: "u planiranju",

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
    realistic2035Description:
      "Premetro završen, južni segment Metro A otvoren",
    realistic2040Description:
      "Metro A stiže do zračne luke, gondola potpuno operativna",
    realistic2045Description:
      "Sjeverno proširenje Metro A otvoreno, razvojne zone aktivne",
    realistic2050Description:
      "Potpuna Metro A linija do Sesveta operativna",

    // Timeline descriptions - Ambitious
    ambitious2025Description:
      "Faza planiranja - Sveobuhvatni dizajn mreže",
    ambitious2030Description:
      "Gradnja Premetra i južnog segmenta Metro A",
    ambitious2035Description:
      "Metro A završen, istočno-zapadni segment Linije B otvoren",
    ambitious2040Description:
      "Metro B završen, gondola potpuno operativna",
    ambitious2045Description: "Istočni segment Metro C u gradnji",
    ambitious2050Description:
      "Potpuna mreža tri metro linije operativna",

    // Timeline labels
    phase1: "Faza 1",
    phase2: "Faza 2",
    phase3: "Faza 3",
    phase4: "Faza 4",
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

    // Construction status
    building: "building",
    planning: "planning",

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
    realistic2035Description:
      "Premetro complete, Metro A south segment opens",
    realistic2040Description:
      "Metro A reaches Airport, Gondola fully operational",
    realistic2045Description:
      "Northern Metro A extension opens, development zones active",
    realistic2050Description: "Full Metro A line to Sesvete operational",

    // Timeline descriptions - Ambitious
    ambitious2025Description:
      "Planning phase - Comprehensive network design",
    ambitious2030Description:
      "Premetro + Metro A south segment construction",
    ambitious2035Description:
      "Metro A complete, Line B east-west opens",
    ambitious2040Description:
      "Metro B complete, Gondola fully operational",
    ambitious2045Description: "Metro C east segment under construction",
    ambitious2050Description: "Full 3-line metro network operational",

    // Timeline labels
    phase1: "Phase 1",
    phase2: "Phase 2",
    phase3: "Phase 3",
    phase4: "Phase 4",
  },
};
