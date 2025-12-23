// Zagreb Future Transit Network Data - FULLY CORRECTED COORDINATES
// All coordinates verified via web search against real Zagreb geography

export const ZAGREB_CENTER = {
  lng: 15.9779,
  lat: 45.8144,
  zoom: 12,
};

// ============================================
// VERIFIED REFERENCE COORDINATES:
// ============================================
// Jelačić Square (city center): 45.8131, 15.9772
// Glavni kolodvor (main station): 45.8047, 15.9789
// Sesvete: 45.8311, 16.1164
// Airport (ZAG): 45.7429, 16.0688
// Velika Gorica: 45.7142, 16.0752
// Arena Zagreb/Lanište: 45.7717, 15.9428
// Jankomir interchange: 45.789, 15.849
// Jarun lake: 45.784, 15.925
// Črnomerec: ~45.815011574311455, 15.934303590929726
// Vrapče (center): ~45.81, 15.90
// Podsused: ~45.835, 15.875
// Dubrava: ~45.828, 16.034
// Lanište/Arena Zagreb: ~45.7717, 15.9428
// Bundek: ~45.789, 15.980

// Constants for stations
export const STATION_CRNOMEREC = {
  lng: 15.934303590929726,
  lat: 45.815011574311455,
};

// Line A
export const STATION_SESVETE = {
  lng: 16.11121065969688,
  lat: 45.82724400896643,
};
export const STATION_DUBEC = {
  lng: 16.078461577739787,
  lat: 45.82794654327185,
};
export const STATION_DUBRAVA = {
  lng: 16.056789001251932,
  lat: 45.82961714360801,
};
export const STATION_MAKSIMIRSKA = {
  lng: 16.01329803822819,
  lat: 45.81864122598845,
};
export const STATION_KVATERNIKOV_TRG = {
  lng: 15.99714431885951,
  lat: 45.814913416262755,
};
export const STATION_GLAVNI_KOLODVOR = { lng: 15.979, lat: 45.805 };
export const STATION_SAVSKI_MOST = {
  lng: 15.979295264737873,
  lat: 45.79520327807365,
};
export const STATION_SOPOT = {
  lng: 15.985381979967977,
  lat: 45.77562261296876,
};
export const STATION_SIGET = {
  lng: 15.971398264357495,
  lat: 45.77640167747302,
};
export const STATION_LANISTE = { lng: 15.947708, lat: 45.773699 };
export const STATION_BUZIN = {
  lng: 15.99668008511354,
  lat: 45.748354002995306,
};
export const STATION_AIRPORT = { lng: 16.069, lat: 45.743 };
export const STATION_VELIKA_GORICA = { lng: 16.075, lat: 45.714 };

// Line B
export const STATION_ZITNJAK = { lng: 16.055, lat: 45.803 };
export const STATION_PESCENICA = { lng: 16.03, lat: 45.808 };
export const STATION_BORONGAJ = {
  lng: 16.018887074647456,
  lat: 45.8146922960263,
};
export const STATION_TEHNICKI_MUZEJ = {
  lng: 15.963521681100124,
  lat: 45.80341005868913,
};

export const STATION_VRAPCE = {
  lng: 15.895761639086736,
  lat: 45.81204330161218,
};
export const STATION_GORNJE_VRAPCE = { lng: 15.86, lat: 45.825 };
export const STATION_PODSUSED = {
  lng: 15.835858060867077,
  lat: 45.81557583531247,
};

// Line C
export const STATION_IVANJA_REKA = {
  lng: 16.11363944779256,
  lat: 45.80022538415935,
};
export const STATION_ZITNJAK_JUG = {
  lng: 16.06030849783343,
  lat: 45.78306437797784,
};
export const STATION_BOROVJE = {
  lng: 16.007231333258012,
  lat: 45.78742138264455,
};
export const STATION_SAVA_CENTAR = {
  lng: 15.963148136080587,
  lat: 45.78547110969755,
};
export const STATION_JARUN = { lng: 15.924836076619604, lat: 45.7791467562842 };
export const STATION_PRECKO = { lng: 15.89, lat: 45.783 };
export const STATION_JANKOMIR = {
  lng: 15.858285555749031,
  lat: 45.80502426229535,
};

// Premetro & Center
export const STATION_SVETI_DUH = {
  lng: 15.942084381100686,
  lat: 45.81345255456036,
};
export const STATION_SLOVENSKA = {
  lng: 15.95155792014553,
  lat: 45.81245215504815,
};
export const STATION_TRG_FRANJO_TUDJMAN = {
  lng: 15.956261656984662,
  lat: 45.813094833415924,
};
export const STATION_BRITANSKI_TRG = {
  lng: 15.964882294975398,
  lat: 45.81279759969399,
};
export const STATION_FRANKOPANSKA = {
  lng: 15.969594172030535,
  lat: 45.81295532699301,
};
export const STATION_JELACIC = { lng: 15.977, lat: 45.813 };

// Gondola & Extra
export const STATION_JARUN_NORTH = {
  lng: 15.918408648979602,
  lat: 45.786333823698136,
};
export const STATION_SAVA_BEACH = {
  lng: 15.946221828657468,
  lat: 45.781019398391265,
};
export const STATION_MUSEUM_DISTRICT = {
  lng: 15.982912519059154,
  lat: 45.77935915513046,
};
export const STATION_BUNDEK = {
  lng: 15.985509730506863,
  lat: 45.78628814538623,
};
export const STATION_NOVI_ZAGREB_HUB = {
  lng: 15.979295264737873,
  lat: 45.79520327807365,
};

// ============================================
// PREMETRO (Underground Tram) - Central Tunnel
// ============================================

export const premetroTunnel = {
  type: "Feature" as const,
  properties: {
    name: "Premetro Central Tunnel",
    color: "#8b5cf6",
    description: "Underground tram through city center",
    isUnderground: true,
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [STATION_CRNOMEREC.lng, STATION_CRNOMEREC.lat], // Črnomerec (western portal)
      [STATION_SVETI_DUH.lng, STATION_SVETI_DUH.lat],
      [STATION_SLOVENSKA.lng, STATION_SLOVENSKA.lat],
      [STATION_TRG_FRANJO_TUDJMAN.lng, STATION_TRG_FRANJO_TUDJMAN.lat],
      [STATION_BRITANSKI_TRG.lng, STATION_BRITANSKI_TRG.lat],
      [STATION_FRANKOPANSKA.lng, STATION_FRANKOPANSKA.lat],
      [STATION_JELACIC.lng, STATION_JELACIC.lat],
      [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat],
      [STATION_SAVSKI_MOST.lng, STATION_SAVSKI_MOST.lat],
    ],
  },
};

// ============================================
// METRO LINES (Full grade-separated)
// ============================================

// Metro Line A (Blue): Northeast to Southeast spine
export const metroLineA = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line A",
    color: "#2563eb",
    description: "Sesvete → Velika Gorica",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [STATION_SESVETE.lng, STATION_SESVETE.lat],
      [STATION_DUBEC.lng, STATION_DUBEC.lat],
      [STATION_DUBRAVA.lng, STATION_DUBRAVA.lat],
      [STATION_MAKSIMIRSKA.lng, STATION_MAKSIMIRSKA.lat],
      [STATION_KVATERNIKOV_TRG.lng, STATION_KVATERNIKOV_TRG.lat],
      [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat],
      [STATION_SAVSKI_MOST.lng, STATION_SAVSKI_MOST.lat],
      [STATION_SOPOT.lng, STATION_SOPOT.lat],
      [STATION_SIGET.lng, STATION_SIGET.lat],
      [STATION_LANISTE.lng, STATION_LANISTE.lat],
      [STATION_BUZIN.lng, STATION_BUZIN.lat],
      [STATION_AIRPORT.lng, STATION_AIRPORT.lat],
      [STATION_VELIKA_GORICA.lng, STATION_VELIKA_GORICA.lat],
    ],
  },
};

// Metro Line B (Red): East-West crosstown
export const metroLineB = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line B",
    color: "#dc2626",
    description: "Žitnjak → Podsused",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [STATION_ZITNJAK.lng, STATION_ZITNJAK.lat],
      [STATION_PESCENICA.lng, STATION_PESCENICA.lat],
      [STATION_BORONGAJ.lng, STATION_BORONGAJ.lat],
      [STATION_KVATERNIKOV_TRG.lng, STATION_KVATERNIKOV_TRG.lat],
      [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat],
      [STATION_TEHNICKI_MUZEJ.lng, STATION_TEHNICKI_MUZEJ.lat],
      [STATION_CRNOMEREC.lng, STATION_CRNOMEREC.lat],
      [STATION_VRAPCE.lng, STATION_VRAPCE.lat],
      [STATION_GORNJE_VRAPCE.lng, STATION_GORNJE_VRAPCE.lat],
      [STATION_PODSUSED.lng, STATION_PODSUSED.lat],
    ],
  },
};

// Metro Line C (Green): Sava River corridor
export const metroLineC = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line C",
    color: "#16a34a",
    description: "Sava River Line",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [STATION_IVANJA_REKA.lng, STATION_IVANJA_REKA.lat],
      [STATION_ZITNJAK_JUG.lng, STATION_ZITNJAK_JUG.lat],
      [STATION_BOROVJE.lng, STATION_BOROVJE.lat],
      [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat],
      [STATION_SAVA_CENTAR.lng, STATION_SAVA_CENTAR.lat],
      [STATION_JARUN.lng, STATION_JARUN.lat],
      [STATION_PRECKO.lng, STATION_PRECKO.lat],
      [STATION_JANKOMIR.lng, STATION_JANKOMIR.lat],
    ],
  },
};

// ============================================
// GONDOLA - Sava Skyway
// ============================================

export const gondolaLine = {
  type: "Feature" as const,
  properties: {
    name: "Sava Skyway",
    color: "#f59e0b",
    description: "Scenic gondola along Sava river",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [STATION_JARUN_NORTH.lng, STATION_JARUN_NORTH.lat],
      [STATION_JARUN.lng, STATION_JARUN.lat],
      [STATION_SAVA_BEACH.lng, STATION_SAVA_BEACH.lat],
      [STATION_SAVA_CENTAR.lng, STATION_SAVA_CENTAR.lat],
      [STATION_MUSEUM_DISTRICT.lng, STATION_MUSEUM_DISTRICT.lat],
      [STATION_BUNDEK.lng, STATION_BUNDEK.lat],
      [STATION_NOVI_ZAGREB_HUB.lng, STATION_NOVI_ZAGREB_HUB.lat],
    ],
  },
};

// ============================================
// STATIONS
// ============================================

export const metroStations = {
  type: "FeatureCollection" as const,
  features: [
    // Line A stations
    {
      type: "Feature" as const,
      properties: { name: "Sesvete", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SESVETE.lng, STATION_SESVETE.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Dubec", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_DUBEC.lng, STATION_DUBEC.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Dubrava", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_DUBRAVA.lng, STATION_DUBRAVA.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Maksimirska", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_MAKSIMIRSKA.lng, STATION_MAKSIMIRSKA.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Kvaternikov trg",
        lines: ["A", "B"],
        isInterchange: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_KVATERNIKOV_TRG.lng, STATION_KVATERNIKOV_TRG.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Glavni kolodvor",
        lines: ["A", "B", "C"],
        isInterchange: true,
        hasPremetro: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Savski most", lines: ["A"], hasPremetro: true },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SAVSKI_MOST.lng, STATION_SAVSKI_MOST.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sopot", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SOPOT.lng, STATION_SOPOT.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Siget", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SIGET.lng, STATION_SIGET.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Lanište", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_LANISTE.lng, STATION_LANISTE.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Buzin", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_BUZIN.lng, STATION_BUZIN.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Airport", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_AIRPORT.lng, STATION_AIRPORT.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Velika Gorica", lines: ["A"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_VELIKA_GORICA.lng, STATION_VELIKA_GORICA.lat],
      },
    },

    // Line B stations (excluding shared interchanges)
    {
      type: "Feature" as const,
      properties: { name: "Žitnjak", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_ZITNJAK.lng, STATION_ZITNJAK.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Peščenica", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_PESCENICA.lng, STATION_PESCENICA.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Borongaj", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_BORONGAJ.lng, STATION_BORONGAJ.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Tehnički muzej", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_TEHNICKI_MUZEJ.lng, STATION_TEHNICKI_MUZEJ.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Črnomerec",
        lines: ["B"],
        hasGondola: true,
        hasPremetro: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_CRNOMEREC.lng, STATION_CRNOMEREC.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Vrapče", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_VRAPCE.lng, STATION_VRAPCE.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Gornje Vrapče", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_GORNJE_VRAPCE.lng, STATION_GORNJE_VRAPCE.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Podsused", lines: ["B"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_PODSUSED.lng, STATION_PODSUSED.lat],
      },
    },

    // Line C stations (excluding shared interchanges)
    {
      type: "Feature" as const,
      properties: { name: "Ivanja Reka", lines: ["C"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_IVANJA_REKA.lng, STATION_IVANJA_REKA.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Žitnjak-jug", lines: ["C"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_ZITNJAK_JUG.lng, STATION_ZITNJAK_JUG.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Borovje", lines: ["C"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_BOROVJE.lng, STATION_BOROVJE.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sava centar", lines: ["C"], hasGondola: true },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SAVA_CENTAR.lng, STATION_SAVA_CENTAR.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Jarun", lines: ["C"], hasGondola: true },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_JARUN.lng, STATION_JARUN.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Prečko", lines: ["C"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_PRECKO.lng, STATION_PRECKO.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Jankomir", lines: ["C"] },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_JANKOMIR.lng, STATION_JANKOMIR.lat],
      },
    },
  ],
};

// Premetro (Underground Tram) stations
export const premetroStations = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        name: "Črnomerec",
        description: "Western portal",
        isPortal: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_CRNOMEREC.lng, STATION_CRNOMEREC.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Sveti Duh",
        description: "Underground station",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SVETI_DUH.lng, STATION_SVETI_DUH.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Slovenska avenija",
        description: "Underground station",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SLOVENSKA.lng, STATION_SLOVENSKA.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Trg Franje Tuđmana",
        description: "Underground station",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [
          STATION_TRG_FRANJO_TUDJMAN.lng,
          STATION_TRG_FRANJO_TUDJMAN.lat,
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Britanski trg", description: "Underground station" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_BRITANSKI_TRG.lng, STATION_BRITANSKI_TRG.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Frankopanska", description: "Underground station" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_FRANKOPANSKA.lng, STATION_FRANKOPANSKA.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Trg bana Jelačića",
        description: "Central hub",
        isMajor: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_JELACIC.lng, STATION_JELACIC.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Glavni kolodvor",
        description: "Main interchange",
        isMajor: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Savski most",
        description: "Southern portal",
        isPortal: true,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SAVSKI_MOST.lng, STATION_SAVSKI_MOST.lat],
      },
    },
  ],
};

// Gondola stations
export const gondolaStations = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Jarun North", description: "Lake approach" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_JARUN_NORTH.lng, STATION_JARUN_NORTH.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Jarun Lake", description: "Sports & recreation" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_JARUN.lng, STATION_JARUN.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sava Beach", description: "Beach zone" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SAVA_BEACH.lng, STATION_SAVA_BEACH.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sava Centar", description: "Cultural center" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SAVA_CENTAR.lng, STATION_SAVA_CENTAR.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Museum District",
        description: "New cultural quarter",
      },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_MUSEUM_DISTRICT.lng, STATION_MUSEUM_DISTRICT.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bundek", description: "Park & entertainment" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_BUNDEK.lng, STATION_BUNDEK.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Novi Zagreb Hub", description: "Eastern terminus" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_NOVI_ZAGREB_HUB.lng, STATION_NOVI_ZAGREB_HUB.lat],
      },
    },
  ],
};

// ============================================
// DEVELOPMENT ZONES
// ============================================

export const developmentZones = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Jarun Sports District", type: "recreation" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [15.91, 45.778],
            [15.94, 45.778],
            [15.94, 45.795],
            [15.91, 45.795],
            [15.91, 45.778],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sava Cultural Quarter", type: "cultural" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [15.95, 45.785],
            [15.975, 45.785],
            [15.975, 45.8],
            [15.95, 45.8],
            [15.95, 45.785],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bundek Entertainment Zone", type: "mixed" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [15.975, 45.783],
            [16.005, 45.783],
            [16.005, 45.795],
            [15.975, 45.795],
            [15.975, 45.783],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Airport Business Park", type: "commercial" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [16.055, 45.735],
            [16.085, 45.735],
            [16.085, 45.755],
            [16.055, 45.755],
            [16.055, 45.735],
          ],
        ],
      },
    },
  ],
};

// Tunnel portals
export const tunnelPortals = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Črnomerec Portal", direction: "west" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_CRNOMEREC.lng, STATION_CRNOMEREC.lat],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Savski most Portal", direction: "south" },
      geometry: {
        type: "Point" as const,
        coordinates: [STATION_SAVSKI_MOST.lng, STATION_SAVSKI_MOST.lat],
      },
    },
  ],
};

// Helper to get all metro lines as a FeatureCollection
export const allMetroLines = {
  type: "FeatureCollection" as const,
  features: [metroLineA, metroLineB, metroLineC],
};

// ============================================
// TIMELINE - Construction Phases
// ============================================

export interface TimelinePhase {
  year: number;
  label: string;
  description: string;
  elements: {
    premetro?: "none" | "partial" | "full";
    metroA?: "none" | "partial" | "full";
    metroB?: "none" | "partial" | "full";
    metroC?: "none" | "partial" | "full";
    gondola?: "none" | "partial" | "full";
    development?: "none" | "partial" | "full";
  };
}

export type PlanType = "realistic" | "ambitious";

export interface TransitPlan {
  id: PlanType;
  name: string;
  description: string;
  cost: string;
  timeline: TimelinePhase[];
}

// Realistic Plan: Premetro + Metro A + Gondola + Development (€3-4.5B)
const realisticPlan: TransitPlan = {
  id: "realistic",
  name: "Realistic Plan",
  description: "Achievable hybrid system - Premetro, one metro line, gondola",
  cost: "€3-4.5 billion over 20 years",
  timeline: [
    {
      year: 2025,
      label: "Present",
      description: "Planning phase - Initial designs underway",
      elements: {
        premetro: "none",
        metroA: "none",
        metroB: "none",
        metroC: "none",
        gondola: "none",
        development: "none",
      },
    },
    {
      year: 2030,
      label: "Early Phase",
      description: "Premetro tunnel construction begins",
      elements: {
        premetro: "partial",
        metroA: "none",
        metroB: "none",
        metroC: "none",
        gondola: "none",
        development: "partial",
      },
    },
    {
      year: 2035,
      label: "Mid Phase",
      description: "Premetro operational, Metro A planning",
      elements: {
        premetro: "full",
        metroA: "partial",
        metroB: "none",
        metroC: "none",
        gondola: "partial",
        development: "partial",
      },
    },
    {
      year: 2040,
      label: "Advanced",
      description: "Metro A opens, Gondola operational",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "none",
        metroC: "none",
        gondola: "full",
        development: "partial",
      },
    },
    {
      year: 2045,
      label: "Mature",
      description: "Surface improvements, development zones active",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "none",
        metroC: "none",
        gondola: "full",
        development: "full",
      },
    },
    {
      year: 2050,
      label: "Complete",
      description: "Integrated hybrid transit network operational",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "none",
        metroC: "none",
        gondola: "full",
        development: "full",
      },
    },
  ],
};

// Ambitious Plan: Full 3-line Metro + Premetro + Gondola (€8-12B)
const ambitiousPlan: TransitPlan = {
  id: "ambitious",
  name: "Ambitious Plan",
  description: "Comprehensive metro network with three full lines",
  cost: "€8-12 billion over 25 years",
  timeline: [
    {
      year: 2025,
      label: "Present",
      description: "Planning phase - Comprehensive network design",
      elements: {
        premetro: "none",
        metroA: "none",
        metroB: "none",
        metroC: "none",
        gondola: "none",
        development: "none",
      },
    },
    {
      year: 2030,
      label: "Phase 1",
      description: "Premetro + Metro A construction begins",
      elements: {
        premetro: "partial",
        metroA: "partial",
        metroB: "none",
        metroC: "none",
        gondola: "none",
        development: "partial",
      },
    },
    {
      year: 2035,
      label: "Phase 2",
      description: "Metro A operational, Line B starts",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "partial",
        metroC: "none",
        gondola: "partial",
        development: "partial",
      },
    },
    {
      year: 2040,
      label: "Phase 3",
      description: "Two metro lines + gondola operational",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "full",
        metroC: "none",
        gondola: "full",
        development: "partial",
      },
    },
    {
      year: 2045,
      label: "Phase 4",
      description: "Metro Line C construction underway",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "full",
        metroC: "partial",
        gondola: "full",
        development: "full",
      },
    },
    {
      year: 2050,
      label: "Complete",
      description: "Full 3-line metro network operational",
      elements: {
        premetro: "full",
        metroA: "full",
        metroB: "full",
        metroC: "full",
        gondola: "full",
        development: "full",
      },
    },
  ],
};

export const transitPlans: Record<PlanType, TransitPlan> = {
  realistic: realisticPlan,
  ambitious: ambitiousPlan,
};

// Legacy export for backwards compatibility
export const timelinePhases = realisticPlan.timeline;

// Get the active elements for a given year and plan
export function getActiveElements(
  year: number,
  planType: PlanType = "realistic"
): TimelinePhase["elements"] {
  const plan = transitPlans[planType];
  const phase = [...plan.timeline].reverse().find((p) => p.year <= year);
  return phase?.elements || plan.timeline[0].elements;
}
