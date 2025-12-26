# 3D Features (status)

Implemented in `Map.tsx` and custom Three.js layers:

- 3D terrain + fog toggle (Mapbox DEM, 1.5x exaggeration)
- 3D building extrusions with height-based gradient and 70% opacity
- Navigation + scale controls for orbit/tilt/zoom
- Animated 3D vehicles: metro trains, premetro trams, Sava and Medvednica gondolas; toggleable traffic with speed presets

Usage tips:

- Enable "3D mode" for terrain/fog, and "3D buildings" for extrusions
- Rotate with the compass, tilt with pitch control or right-click drag
- Use the timeline slider to see how 3D layers follow construction phases
