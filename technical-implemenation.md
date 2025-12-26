# Technical Implementation (current state)

## Stack and Rendering

- React + TypeScript + Vite, Mapbox GL JS as the base map
- Custom Mapbox `CustomLayerInterface` layers using Three.js for animated vehicles: metro trains, premetro trams, Sava/Medvednica gondolas
- Mapbox sources/layers for static data: lines, stations, development zones, 3D buildings
- Optional 3D terrain + atmospheric fog controlled via UI toggle

## Data Model

- Single source of truth in [src/data/transitNetwork.ts](src/data/transitNetwork.ts)
	- Geometry for metro lines A/B/C, premetro tunnel, Sava Skyway, Medvednica Skyway
	- Station collections (with interchange flags) and development zones
	- Segmented lines keyed for phased activation
	- `transitPlans` with timelines for Realistic and Ambitious scenarios (costs, labels, and active segments per year)
	- Helpers: `getActiveElements`, `getActiveSegments`, `getActiveStationNames`

## UI and Interaction Flow

- Plan switcher and timeline slider drive layer visibility and station filters
- Layer list shows per-element status (none/partial/full) based on the active phase
- Graphics settings: toggle 3D buildings, 3D terrain/fog, and animated traffic with speed presets
- Popups on stations (metro, premetro, gondola); info panel reflects the selected plan’s narrative
- Language toggle (EN/HR) backed by `useLanguage` and `translations.ts`

## Animation Control

- Animated layers expose controls via refs; speed and visibility respond to UI state
- Dash animations on 2D line layers simulate construction activity

## Dev Notes

- Set `VITE_MAPBOX_ACCESS_TOKEN` in `.env.local`
- `Map.tsx` is the orchestration layer: initializes Mapbox, wires data sources, attaches Three.js layers, and binds UI state to map state
- 3D building extrusions come from the Mapbox composite source; terrain uses `mapbox.mapbox-terrain-dem-v1`
