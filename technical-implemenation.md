# Technical Implementation for Zagreb Future Transit Visualization

## Technical Implementation Options for Zagreb Future Transit Visualization

### Tier 1: Map Overlay Approach

#### Tech Stack

Mapbox GL JS or MapLibre (more customizable than Google Maps for this purpose)
React + TypeScript
GeoJSON for transit lines and zones

#### What You'd Build: Interactive 2D Map

An interactive 2D map where users toggle layers:

Existing infrastructure (greyed out or subtle)
New metro lines (animated dashed lines showing routes)
Gondola alignment over the Sava
Riverfront development zones (polygons with hover states)
Station locations with popup info cards

#### Nice Interactions

Timeline slider showing phased development (2025 → 2035 → 2050)
Click a station to see renders/descriptions
"Before/After" slider comparing current vs. future state
Animated "journey" mode that flies along a transit line

Effort: 1-2 weeks for a polished version
Limitations: Flat, not truly immersive, can't show building heights or the gondola experience

### Tier 2: 2.5D with Mapbox Custom Layers

#### Tech Stack

Mapbox GL JS with custom 3D layers
Three.js integration via CustomLayerInterface
React + TypeScript

Mapbox allows injecting Three.js objects into the map's WebGL context. You could:

Extrude buildings along the riverfront to show new development massing
Add 3D gondola pylons and cables
Render metro station entrances as 3D objects
Animated gondola cabins moving along the cable path

#### What This Looks Like

The base map remains Mapbox (so you get real Zagreb streets, existing buildings via their 3D building layer), but you're adding custom geometry for the speculative elements. Users can orbit and tilt the map to see things in perspective.
Effort: 2-4 weeks
Challenge: Coordinating Three.js world coordinates with Mapbox's mercator projection. There's boilerplate for this but it's fiddly.

### Tier 3: Google Maps 3D Tiles + Overlays

#### Tech Stack

Google Maps Platform Photorealistic 3D Tiles
Three.js via Google's @googlemaps/three loader or Cesium
Deck.gl for data layers

#### What You Get

Google's 3D tiles give you photorealistic existing Zagreb—actual building geometry from photogrammetry. You overlay your speculative infrastructure on top of reality.

#### The Appeal

Users see real Zagreb in 3D—recognizable buildings, actual terrain—and then your additions appear contextually. The gondola floats over the actual Sava. Metro stations appear at real intersections. The contrast between photorealistic present and stylized future is compelling.
Considerations

#### API costs (3D tiles aren't cheap at scale)

#### Visual coherence: your custom models need to either match the photorealistic style (hard) or deliberately contrast it (easier, and arguably more effective for "speculative" content)

#### Performance: photorealistic tiles are heavy

Effort: 3-6 weeks

### Tier 4: Full Three.js Experience

#### Tech Stack

Three.js as the primary renderer
React Three Fiber for component architecture
Blender for all custom assets
OpenStreetMap or other source for base geometry

#### What You'd Build: Bespoke 3D Environment

A bespoke 3D experience—not a map with overlays but a crafted virtual environment. You'd model:

Simplified Zagreb base (buildings as stylized blocks, terrain from elevation data)
Detailed hero areas (the riverfront, key interchanges, station interiors)
All new infrastructure (metro tunnels you can "enter", gondola you can "ride")
Atmospheric effects (time of day, weather, seasons)

#### Interaction Paradigms

Free camera exploration
Guided "tours" (camera follows a path while narration plays)
First-person mode walking through the riverfront park
"Ride the gondola" experience with procedural cabin movement

#### The Vision

This becomes less a planning tool and more an experience—something that makes people feel what the future Zagreb could be like. You're building a tiny video game, essentially.
Effort: 2-4 months for something polished

#### My Recommendation: Hybrid Approach

Given your skills and the project's purpose, I'd suggest a phased approach that delivers value early while building toward the ambitious vision:
Phase 1: Mapbox + Three.js Integration (2-3 weeks)
Start with Mapbox as your base, but immediately use their CustomLayerInterface to add Three.js elements. This gives you:

Real Zagreb streets and context
Easy layer toggling for different infrastructure types
3D elements where they matter (gondola, key stations, building massing)

Deliverable: A working interactive map you can share and get feedback on.
Phase 2: Hero Zones in Full 3D (2-4 weeks)
Model 2-3 key locations in Blender at higher detail:

Bundek riverfront area (beach, cultural buildings, gondola station)
A major metro interchange (Glavni kolodvor)
A typical new neighborhood block

These become "detail views" you can zoom into from the map—click on Bundek, and you transition to a detailed Three.js scene for that zone.

#### Phase 3: The Gondola Experience (1-2 weeks)

Build a dedicated "ride the gondola" mode:

First-person camera in a gondola cabin
Path follows the alignment along the river
Look around freely as you glide over beaches, parks, buildings
Hotspots trigger information overlays

This is the emotional hook—the thing that makes people share the project.
Phase 4: Full Environment (Ongoing)
Gradually expand the detailed 3D coverage until the whole system is navigable in the immersive mode. The Mapbox version remains as an overview/navigation layer.

## Technical Architecture Sketch

src/
├── components/
│ ├── MapView/ # Mapbox-based overview
│ │ ├── MapContainer.tsx
│ │ ├── TransitLayers.tsx
│ │ ├── ThreeOverlay.tsx # Custom layer bridge
│ │ └── layers/
│ │ ├── MetroLines.tsx
│ │ ├── GondolaPath.tsx
│ │ └── DevelopmentZones.tsx
│ │
│ ├── DetailView/ # Full Three.js scenes
│ │ ├── SceneContainer.tsx
│ │ ├── locations/
│ │ │ ├── Bundek.tsx
│ │ │ ├── GlavniKolodvor.tsx
│ │ │ └── SavaCentar.tsx
│ │ └── shared/
│ │ ├── Buildings.tsx
│ │ ├── Vegetation.tsx
│ │ └── Water.tsx
│ │
│ ├── GondolaRide/ # Immersive experience
│ │ ├── GondolaCabin.tsx
│ │ ├── PathController.tsx
│ │ └── Annotations.tsx
│ │
│ └── UI/
│ ├── LayerControls.tsx
│ ├── Timeline.tsx
│ ├── InfoPanel.tsx
│ └── Navigation.tsx
│
├── data/
│ ├── metro-lines.geojson
│ ├── gondola-path.geojson
│ ├── stations.json
│ └── development-zones.geojson
│
├── models/ # Blender exports
│ ├── gondola-cabin.glb
│ ├── metro-station.glb
│ ├── buildings/
│ └── infrastructure/
│
└── utils/
├── coordinates.ts # Mercator ↔ Three.js conversion
├── animations.ts
└── camera-paths.ts

Blender Workflow Considerations
Since you know Blender, some thoughts on asset creation:
Style Decision
You need to choose a visual language:

Photorealistic: High effort, risks uncanny valley next to real map tiles
Stylized/Low-poly: Faster to produce, clearly "speculative", distinctive
Architectural white model: Clean, professional, focuses on massing and form
Illustrated/Painterly: Unique but requires consistent art direction

I'd lean toward stylized or white-model—it signals "this is a proposal" rather than "this is what we're building," and it's more forgiving of imperfect details.
Asset Strategy
Build a kit of parts rather than modeling everything bespoke:

Generic building modules (residential block, office tower, cultural pavilion)
Infrastructure elements (metro entrance type A/B, gondola pylon, station platform)
Landscape elements (trees, benches, water features)

Assemble scenes from the kit, adding hero details only where needed.
LOD (Level of Detail)
For Three.js performance, you'll want multiple detail levels:

LOD0: Full detail for close-up
LOD1: Simplified for medium distance
LOD2: Basic shape for far distance / map view

Blender's decimate modifier or manual retopology for each level.
Export Settings
GLB/GLTF for Three.js. Bake textures where possible—especially for the map overlay version where you want things lightweight. Draco compression for geometry.

Data Sources for Zagreb
You'll need base data:

OpenStreetMap: Building footprints, streets, landuse. Export via Overpass or use osm2world for 3D
Zagreb GIS portal: The city has some open data, worth checking for official building heights, zoning
SRTM/ASTER: Elevation data for terrain
Satellite imagery: For texture reference (not direct use due to licensing)

For the speculative elements, you're inventing the data—draw metro alignments in QGIS, export as GeoJSON, etc.

Inspirations to Look At
Similar Projects

Sidewalk Labs' Generative Design tool for Toronto Quayside (before it was cancelled)
HERE XYZ Studio for data visualization on maps
Various city "digital twin" projects (Singapore, Helsinki)

Three.js References

Low-poly city generators for style reference
Bruno Simon's work for interactive 3D web experiences
Anything by the folks at Active Theory

Mapping + 3D

Mapbox examples gallery has good CustomLayerInterface demos
Deck.gl's TripsLayer for animated transit paths

Quick Prototype Idea
If you want to validate the concept before committing to full development, here's a weekend prototype:

Mapbox map centered on Zagreb
Draw the metro lines as GeoJSON, render as animated dashed lines
Single Three.js gondola cabin model, animate it along a path over the river using CustomLayerInterface
Basic UI: checkboxes for layers, info panel on click

This would take maybe 8-12 hours and would immediately tell you whether the concept is exciting enough to pursue further.
