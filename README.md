# Zagreb 2050 - Future Transit Vision

An interactive map showing a speculative future transit network for Zagreb, featuring:
- 🚇 Three metro lines (A, B, C)
- 🚡 Sava Skyway gondola with animated 3D cabins
- 📍 Interactive stations with popups
- 🏗️ Development zones

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Mapbox Token

The project uses a public demo Mapbox token which has limitations. For full functionality:

1. Create a free account at https://www.mapbox.com/
2. Get your access token from the dashboard
3. Replace the token in `src/components/Map.tsx`:

```typescript
mapboxgl.accessToken = "YOUR_TOKEN_HERE";
```

## Project Structure

```
src/
├── data/
│   └── transitNetwork.ts    # GeoJSON data for all lines & stations
├── layers/
│   └── GondolaLayer.ts      # Three.js 3D gondola rendering
├── components/
│   └── Map.tsx              # Main map component
└── App.tsx
```

## Features

- **Layer toggles**: Show/hide individual metro lines, gondola, stations
- **3D gondola**: Animated cabins moving along the Sava river
- **Station popups**: Click any station for details
- **Development zones**: Colored polygons showing proposed areas

## Customization Ideas

- Edit `transitNetwork.ts` to modify routes and stations
- Adjust gondola speed/cabin count in `Map.tsx`
- Add new development zones
- Import custom 3D models in `GondolaLayer.ts`

## Tech Stack

- React + TypeScript
- Vite
- Mapbox GL JS
- Three.js