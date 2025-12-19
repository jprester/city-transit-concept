// Zagreb Future Transit Network Data

export const ZAGREB_CENTER = {
  lng: 15.9819,
  lat: 45.815,
  zoom: 12.5,
};

// Metro Line A (Blue): Northeast to Southwest spine
export const metroLineA = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line A",
    color: "#2563eb",
    description: "Main spine: Sesvete → Airport",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [16.1132, 45.8283], // Sesvete
      [16.0823, 45.8234], // Dubec
      [16.0456, 45.8198], // Dubrava
      [16.0178, 45.8145], // Kvaternikov trg
      [15.9785, 45.8047], // Glavni kolodvor
      [15.9712, 45.7923], // Savski most
      [15.9634, 45.7812], // Siget
      [15.9523, 45.7687], // Lanište
      [15.9456, 45.7534], // Airport area
      [15.9378, 45.7412], // Velika Gorica
    ],
  },
};

// Metro Line B (Red): East-West crosstown
export const metroLineB = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line B",
    color: "#dc2626",
    description: "Crosstown: Žitnjak → Podsused",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [16.0567, 45.8023], // Žitnjak
      [16.0312, 45.8089], // Borongaj
      [16.0178, 45.8145], // Kvaternikov trg (interchange)
      [15.9785, 45.8047], // Glavni kolodvor (interchange)
      [15.9623, 45.8078], // Tehnički muzej
      [15.9378, 45.8123], // Črnomerec
      [15.9123, 45.8156], // Vrapče
      [15.8834, 45.8189], // Podsused
    ],
  },
};

// Metro Line C (Green): River line
export const metroLineC = {
  type: "Feature" as const,
  properties: {
    name: "Metro Line C",
    color: "#16a34a",
    description: "Sava corridor: East → Jankomir",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [16.0712, 45.7823], // Ivanja Reka
      [16.0312, 45.7856], // Žitnjak-jug
      [15.9978, 45.7878], // Zapruđe
      [15.9756, 45.7912], // Bundek
      [15.9785, 45.8047], // Glavni kolodvor (interchange)
      [15.9534, 45.7934], // Sava centar
      [15.9234, 45.7878], // Jarun
      [15.8912, 45.7912], // Jankomir
    ],
  },
};

// Gondola line along the Sava river
export const gondolaLine = {
  type: "Feature" as const,
  properties: {
    name: "Sava Skyway",
    color: "#f59e0b",
    description: "Scenic gondola: Črnomerec → Novi Zagreb",
  },
  geometry: {
    type: "LineString" as const,
    coordinates: [
      [15.9378, 45.8123], // Črnomerec (metro connection)
      [15.9312, 45.7989], // Jarun lake
      [15.9423, 45.7934], // Sava beach zone
      [15.9534, 45.7934], // Sava centar
      [15.9656, 45.7923], // Museum district
      [15.9756, 45.7912], // Bundek
      [15.9834, 45.7878], // Novi Zagreb hub
    ],
  },
};

// All metro stations
export const metroStations = {
  type: "FeatureCollection" as const,
  features: [
    // Line A stations
    { type: "Feature" as const, properties: { name: "Sesvete", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.1132, 45.8283] } },
    { type: "Feature" as const, properties: { name: "Dubec", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0823, 45.8234] } },
    { type: "Feature" as const, properties: { name: "Dubrava", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [16.0456, 45.8198] } },
    { type: "Feature" as const, properties: { name: "Kvaternikov trg", lines: ["A", "B"], isInterchange: true }, geometry: { type: "Point" as const, coordinates: [16.0178, 45.8145] } },
    { type: "Feature" as const, properties: { name: "Glavni kolodvor", lines: ["A", "B", "C"], isInterchange: true }, geometry: { type: "Point" as const, coordinates: [15.9785, 45.8047] } },
    { type: "Feature" as const, properties: { name: "Savski most", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9712, 45.7923] } },
    { type: "Feature" as const, properties: { name: "Siget", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9634, 45.7812] } },
    { type: "Feature" as const, properties: { name: "Lanište", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9523, 45.7687] } },
    { type: "Feature" as const, properties: { name: "Airport", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9456, 45.7534] } },
    { type: "Feature" as const, properties: { name: "Velika Gorica", lines: ["A"] }, geometry: { type: "Point" as const, coordinates: [15.9378, 45.7412] } },
    
    // Line B stations (excluding interchanges already listed)
    { type: "Feature" as const, properties: { name: "Žitnjak", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [16.0567, 45.8023] } },
    { type: "Feature" as const, properties: { name: "Borongaj", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [16.0312, 45.8089] } },
    { type: "Feature" as const, properties: { name: "Tehnički muzej", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [15.9623, 45.8078] } },
    { type: "Feature" as const, properties: { name: "Črnomerec", lines: ["B"], hasGondola: true }, geometry: { type: "Point" as const, coordinates: [15.9378, 45.8123] } },
    { type: "Feature" as const, properties: { name: "Vrapče", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [15.9123, 45.8156] } },
    { type: "Feature" as const, properties: { name: "Podsused", lines: ["B"] }, geometry: { type: "Point" as const, coordinates: [15.8834, 45.8189] } },
    
    // Line C stations (excluding interchanges already listed)
    { type: "Feature" as const, properties: { name: "Ivanja Reka", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [16.0712, 45.7823] } },
    { type: "Feature" as const, properties: { name: "Žitnjak-jug", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [16.0312, 45.7856] } },
    { type: "Feature" as const, properties: { name: "Zapruđe", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [15.9978, 45.7878] } },
    { type: "Feature" as const, properties: { name: "Bundek", lines: ["C"], hasGondola: true }, geometry: { type: "Point" as const, coordinates: [15.9756, 45.7912] } },
    { type: "Feature" as const, properties: { name: "Sava centar", lines: ["C"], hasGondola: true }, geometry: { type: "Point" as const, coordinates: [15.9534, 45.7934] } },
    { type: "Feature" as const, properties: { name: "Jarun", lines: ["C"], hasGondola: true }, geometry: { type: "Point" as const, coordinates: [15.9234, 45.7878] } },
    { type: "Feature" as const, properties: { name: "Jankomir", lines: ["C"] }, geometry: { type: "Point" as const, coordinates: [15.8912, 45.7912] } },
  ],
};

// Gondola stations
export const gondolaStations = {
  type: "FeatureCollection" as const,
  features: [
    { type: "Feature" as const, properties: { name: "Črnomerec Terminal", description: "Metro Line B connection" }, geometry: { type: "Point" as const, coordinates: [15.9378, 45.8123] } },
    { type: "Feature" as const, properties: { name: "Jarun Lake", description: "Sports & recreation zone" }, geometry: { type: "Point" as const, coordinates: [15.9312, 45.7989] } },
    { type: "Feature" as const, properties: { name: "Sava Beach", description: "Beach & swimming area" }, geometry: { type: "Point" as const, coordinates: [15.9423, 45.7934] } },
    { type: "Feature" as const, properties: { name: "Sava Centar", description: "Cultural & conference center" }, geometry: { type: "Point" as const, coordinates: [15.9534, 45.7934] } },
    { type: "Feature" as const, properties: { name: "Museum District", description: "New cultural quarter" }, geometry: { type: "Point" as const, coordinates: [15.9656, 45.7923] } },
    { type: "Feature" as const, properties: { name: "Bundek", description: "Park & entertainment zone" }, geometry: { type: "Point" as const, coordinates: [15.9756, 45.7912] } },
    { type: "Feature" as const, properties: { name: "Novi Zagreb Hub", description: "Metro Line C connection" }, geometry: { type: "Point" as const, coordinates: [15.9834, 45.7878] } },
  ],
};

// Development zones along the riverfront
export const developmentZones = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Jarun Sports District", type: "recreation" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [15.9212, 45.7934],
          [15.9345, 45.7934],
          [15.9345, 45.8012],
          [15.9212, 45.8012],
          [15.9212, 45.7934],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Sava Cultural Quarter", type: "cultural" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [15.9489, 45.7889],
          [15.9623, 45.7889],
          [15.9623, 45.7956],
          [15.9489, 45.7956],
          [15.9489, 45.7889],
        ]],
      },
    },
    {
      type: "Feature" as const,
      properties: { name: "Bundek Entertainment Zone", type: "mixed" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [15.9689, 45.7867],
          [15.9823, 45.7867],
          [15.9823, 45.7934],
          [15.9689, 45.7934],
          [15.9689, 45.7867],
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
