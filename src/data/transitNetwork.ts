// Zagreb Future Transit Network Data - Corrected Coordinates + Premetro Concept

export const ZAGREB_CENTER = {
  lng: 15.9779,
  lat: 45.8144,
  zoom: 12,
};

// Key reference points (verified coordinates):
// - Zagreb center (Jelačić): 45.8131, 15.9772
// - Glavni kolodvor: 45.8047, 15.9789
// - Sesvete: 45.8311, 16.1164
// - Airport (ZAG): 45.7429, 16.0688
// - Velika Gorica: 45.7142, 16.0752
// - Dubrava: 45.8280, 16.0340
// - Črnomerec: 45.8145, 15.9380
// - Jarun lake: 45.7845, 15.9245

// ============================================
// PREMETRO (Underground Tram) - Central Tunnel
// ============================================

export const premetroTunnel = {
  type: "Feature" as const,
  properties: {
    name: "Premetro Central Tunnel",
    color: "#8b5cf6", // Purple for underground
    description: "Underground tram through city center",
    isUnderground: true,
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [15.9380, 45.8145], // Črnomerec (portal)
      [15.9520, 45.8140], // Britanski trg (underground)
      [15.9650, 45.8135], // Frankopanska (underground)
      [15.9772, 45.8131], // Jelačić (underground) - major station
      [15.9789, 45.8047], // Glavni kolodvor (underground) - interchange
      [15.9756, 45.7940], // Savski most (portal south)
    ],
  },
};

// Tunnel portals (where trams enter/exit underground)
export const tunnelPortals = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Črnomerec Portal", direction: "west" },
      geometry: { type: "Point" as const, coordinates: [15.9380, 45.8145] },
    },
    {
      type: "Feature" as const,
      properties: { name: "Savski most Portal", direction: "south" },
      geometry: { type: "Point" as const, coordinates: [15.9756, 45.7940] },
    },
  ],
};

// ============================================
// METRO LINES (Full grade-separated)
// ============================================

// Metro Line A (Blue): Northeast to Southeast - Main spine
export const metroLineA = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line A",
    color: "#2563eb",
    description: "Sesvete → Airport",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [16.1164, 45.8311], // Sesvete
      [16.0850, 45.8290], // Dubec
      [16.0340, 45.8280], // Dubrava
      [16.0100, 45.8200], // Maksimirska naselja
      [15.9930, 45.8130], // Kvaternikov trg
      [15.9789, 45.8047], // Glavni kolodvor (interchange)
      [15.9756, 45.7940], // Savski most
      [15.9780, 45.7800], // Siget
      [15.9850, 45.7650], // Lanište
      [16.0200, 45.7500], // Buzin
      [16.0688, 45.7429], // Airport (ZAG)
      [16.0752, 45.7142], // Velika Gorica
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
      [16.0650, 45.8020], // Žitnjak
      [16.0400, 45.8050], // Peščenica
      [16.0200, 45.8090], // Borongaj
      [15.9930, 45.8130], // Kvaternikov trg (interchange with A)
      [15.9789, 45.8047], // Glavni kolodvor (interchange)
      [15.9650, 45.8070], // Tehnički muzej
      [15.9380, 45.8145], // Črnomerec
      [15.9100, 45.8180], // Vrapče
      [15.8750, 45.8220], // Podsused
    ],
  },
};

// Metro Line C (Green): Sava River corridor
export const metroLineC = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line C",
    color: "#16a34a",
    description: "Sava River Line: Ivanja Reka → Jankomir",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [16.1050, 45.7850], // Ivanja Reka
      [16.0500, 45.7830], // Žitnjak-jug
      [16.0050, 45.7860], // Zapruđe
      [15.9789, 45.8047], // Glavni kolodvor (interchange)
      [15.9550, 45.7920], // Sava centar
      [15.9245, 45.7845], // Jarun
      [15.8900, 45.7900], // Jankomir
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
      [15.9380, 45.8145], // Črnomerec (metro connection)
      [15.9300, 45.7950], // Jarun north
      [15.9245, 45.7845], // Jarun lake
      [15.9400, 45.7880], // Sava beach zone
      [15.9550, 45.7920], // Sava centar
      [15.9680, 45.7910], // Museum district
      [15.9800, 45.7870], // Bundek
      [15.9950, 45.7850], // Novi Zagreb hub
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
    { type: "Feature" as const, properties: { name: "Sesvete", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.1164, 45.8311] } },
    { type: "Feature" as const, properties: { name: "Dubec", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0850, 45.8290] } },
    { type: "Feature" as const, properties: { name: "Dubrava", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0340, 45.8280] } },
    { type: "Feature" as const, properties: { name: "Maksimirska naselja", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0100, 45.8200] } },
    { type: "Feature" as const, properties: { name: "Kvaternikov trg", lines: ["A", "B"], isInterchange: true }, geometry: { type: "Point" as const, coordinates: [15.9930, 45.8130] } },
    { type: "Feature" as const, properties: { name: "Glavni kolodvor", lines: ["A", "B", "C"], isInterchange: true, hasPremetro: true }, geometry: { type: "Point" as const, coordinates: [15.9789, 45.8047] } },
    { type: "Feature" as const, properties: { name: "Savski most", lines: ["A"], hasPremetro: true }, geometry: { type: "Point" as const, coordinates: [15.9756, 45.7940] } },
    { type: "Feature" as const, properties: { name: "Siget", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9780, 45.7800] } },
    { type: "Feature" as const, properties: { name: "Lanište", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9850, 45.7650] } },
    { type: "Feature" as const, properties: { name: "Buzin", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0200, 45.7500] } },
    { type: "Feature" as const, properties: { name: "Airport", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0688, 45.7429] } },
    { type: "Feature" as const, properties: { name: "Velika Gorica", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0752, 45.7142] } },

    // Line B stations (excluding shared interchanges)
    { type: "Feature" as const, properties: { name: "Žitnjak", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [16.0650, 45.8020] } },
    { type: "Feature" as const, properties: { name: "Peščenica", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [16.0400, 45.8050] } },
    { type: "Feature" as const, properties: { name: "Borongaj", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [16.0200, 45.8090] } },
    { type: "Feature" as const, properties: { name: "Tehnički muzej", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [15.9650, 45.8070] } },
    { type: "Feature" as const, properties: { name: "Črnomerec", lines: ["B"], hasGondola: true, hasPremetro: true }, geometry: { type: "Point" as const, coordinates: [15.9380, 45.8145] } },
    { type: "Feature" as const, properties: { name: "Vrapče", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [15.9100, 45.8180] } },
    { type: "Feature" as const, properties: { name: "Podsused", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [15.8750, 45.8220] } },

    // Line C stations (excluding shared interchanges)
    { type: "Feature" as const, properties: { name: "Ivanja Reka", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [16.1050, 45.7850] } },
    { type: "Feature" as const, properties: { name: "Žitnjak-jug", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [16.0500, 45.7830] } },
    { type: "Feature" as const, properties: { name: "Zapruđe", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [16.0050, 45.7860] } },
    { type: "Feature" as const, properties: { name: "Sava centar", lines: ["C"], hasGondola: true }, geometry: { type: "Point" as const, coordinates: [15.9550, 45.7920] } },
    { type: "Feature" as const, properties: { name: "Jarun", lines: ["C"], hasGondola: true }, geometry: { type: "Point" as const, coordinates: [15.9245, 45.7845] } },
    { type: "Feature" as const, properties: { name: "Jankomir", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [15.8900, 45.7900] } },
  ],
};

// Premetro (Underground Tram) stations
export const premetroStations = {
  type: "FeatureCollection" as const,
  features: [
    { type: "Feature" as const, properties: { name: "Črnomerec", description: "Western portal - surface connection", isPortal: true }, geometry: { type: "Point" as const, coordinates: [15.9380, 45.8145] } },
    { type: "Feature" as const, properties: { name: "Britanski trg", description: "Underground station" }, geometry: { type: "Point" as const, coordinates: [15.9520, 45.8140] } },
    { type: "Feature" as const, properties: { name: "Frankopanska", description: "Underground station" }, geometry: { type: "Point" as const, coordinates: [15.9650, 45.8135] } },
    { type: "Feature" as const, properties: { name: "Jelačić", description: "Central underground hub", isMajor: true }, geometry: { type: "Point" as const, coordinates: [15.9772, 45.8131] } },
    { type: "Feature" as const, properties: { name: "Glavni kolodvor", description: "Main interchange - metro connection", isMajor: true }, geometry: { type: "Point" as const, coordinates: [15.9789, 45.8047] } },
    { type: "Feature" as const, properties: { name: "Savski most", description: "Southern portal - surface connection", isPortal: true }, geometry: { type: "Point" as const, coordinates: [15.9756, 45.7940] } },
  ],
};

// Gondola stations
export const gondolaStations = {
  type: "FeatureCollection" as const,
  features: [
    { type: "Feature" as const, properties: { name: "Črnomerec Terminal", description: "Metro Line B connection" }, geometry: { type: "Point" as const, coordinates: [15.9380, 45.8145] } },
    { type: "Feature" as const, properties: { name: "Jarun North", description: "Lake access" }, geometry: { type: "Point" as const, coordinates: [15.9300, 45.7950] } },
    { type: "Feature" as const, properties: { name: "Jarun Lake", description: "Sports & recreation" }, geometry: { type: "Point" as const, coordinates: [15.9245, 45.7845] } },
    { type: "Feature" as const, properties: { name: "Sava Beach", description: "Beach & swimming" }, geometry: { type: "Point" as const, coordinates: [15.9400, 45.7880] } },
    { type: "Feature" as const, properties: { name: "Sava Centar", description: "Cultural center" }, geometry: { type: "Point" as const, coordinates: [15.9550, 45.7920] } },
    { type: "Feature" as const, properties: { name: "Museum District", description: "New cultural quarter" }, geometry: { type: "Point" as const, coordinates: [15.9680, 45.7910] } },
    { type: "Feature" as const, properties: { name: "Bundek", description: "Park & entertainment" }, geometry: { type: "Point" as const, coordinates: [15.9800, 45.7870] } },
    { type: "Feature" as const, properties: { name: "Novi Zagreb Hub", description: "Metro connection" }, geometry: { type: "Point" as const, coordinates: [15.9950, 45.7850] } },
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
        coordinates: [[
          [15.9100, 45.7780],
          [15.9350, 45.7780],
          [15.9350, 45.7920],
          [15.9100, 45.7920],
          [15.9100, 45.7780],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sava Cultural Quarter", type: "cultural" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [15.9500, 45.7860],
          [15.9720, 45.7860],
          [15.9720, 45.7960],
          [15.9500, 45.7960],
          [15.9500, 45.7860],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bundek Entertainment Zone", type: "mixed" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [15.9720, 45.7810],
          [15.9920, 45.7810],
          [15.9920, 45.7910],
          [15.9720, 45.7910],
          [15.9720, 45.7810],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Airport Business Park", type: "commercial" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [16.0550, 45.7350],
          [16.0850, 45.7350],
          [16.0850, 45.7500],
          [16.0550, 45.7500],
          [16.0550, 45.7350],
        ]],
      },
    },
  ],
};

// Helper to get all metro lines as a FeatureCollection
export const allMetroLines = {
  type: "FeatureCollection" as const,
  features: [metroLineA, metroLineB, metroLineC],
};
