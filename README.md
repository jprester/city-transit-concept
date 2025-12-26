# Zagreb 2050 - Future Transit Vision

An interactive bilingual map (EN/HR) that visualizes speculative future transit for Zagreb: metro lines A/B/C, a premetro tunnel, the Sava Skyway gondola, and an ambitious Medvednica Skyway extension.

## Quick Start

```bash
npm install
echo "VITE_MAPBOX_ACCESS_TOKEN=YOUR_TOKEN" > .env.local
npm run dev
```

Open http://localhost:5173 once Vite starts. A public demo token works but rate-limits; use your own for reliability.

## Controls at a Glance

- Plan switcher: Realistic (premetro + Metro A focus) vs Ambitious (full A/B/C + Medvednica Skyway)
- Timeline slider (2025–2050): phases drive which segments, stations, and zones are visible
- Layer status: Metro A/B/C, Premetro, Sava Skyway, Medvednica Skyway (ambitious only), Development zones
- 3D and animation: toggle 3D terrain/fog, toggle 3D building extrusions, animated vehicles on/off with speed presets
- Interactions: station popups, gondola/premetro station details, language toggle (EN/HR), reset view

## Current Features

- Animated 3D vehicles: metro trains, premetro trams, Sava and Medvednica gondolas with adjustable speed
- Interactive phasing: timeline-linked visibility and station filters per plan
- Development zones: colored polygons with outlines; opacity reflects phase
- 3D context: optional terrain, fog, and building extrusions; navigation + scale controls
- i18n: all UI labels and timelines available in English and Croatian

## Mapbox Token

Set `VITE_MAPBOX_ACCESS_TOKEN` in `.env.local`. The app reads it via `import.meta.env` inside [src/components/Map.tsx](src/components/Map.tsx).

## Project Structure

```
src/
├── components/
│   └── Map.tsx              # Main map + UI
├── data/
│   └── transitNetwork.ts    # Network geometry, segments, timeline logic
├── layers/
│   ├── GondolaLayer.ts      # Three.js gondola custom layer
│   ├── MetroLayer.ts        # Three.js metro trains
│   └── TramLayer.ts         # Three.js premetro trams
└── i18n/                    # Language context and translations
```

## Customization

- Edit `transitNetwork.ts` to tweak routes, stations, phasing, and costs
- Adjust vehicle counts/speeds in `Map.tsx` or layer files
- Extend translations in `src/i18n/translations.ts`

## Tech Stack

- React + TypeScript + Vite
- Mapbox GL JS with custom 3D layers (Three.js)
