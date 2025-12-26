import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";
import { useMediaQuery } from "../hooks/useMediaQuery";

import {
  gondolaLine,
  metroStations,
  gondolaStations,
  medvednicaGondolaStations,
  medvednicaGondolaLine,
  developmentZones,
  premetroTunnel,
  premetroStations,
  STATION_GLAVNI_KOLODVOR,
  transitPlans,
  getActiveElements,
  getActiveSegments,
  getActiveStationNames,
  metroASegments,
  metroBSegments,
  metroCSegments,
  premetroSegments,
  gondolaSegments,
  medvednicaGondolaSegments,
  type PlanType,
} from "../data/transitNetwork";
import {
  createGondolaLayer,
  type GondolaLayerControls,
} from "../layers/GondolaLayer";
import { createTramLayer, type TramLayerControls } from "../layers/TramLayer";
import {
  createMetroLayer,
  type MetroLayerControls,
} from "../layers/MetroLayer";
import { useLanguage } from "../i18n/useLanguage";

// Using a public demo token - in production you'd use your own
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface LayerVisibility {
  metroA: boolean;
  metroB: boolean;
  metroC: boolean;
  premetro: boolean;
  gondola: boolean;
  medvednicaGondola: boolean;
  stations: boolean;
  development: boolean;
  buildings3d: boolean;
}

// Helper function to get translated timeline description
function getTimelineDescription(
  year: number,
  planType: PlanType,
  t: any
): string {
  const key = `${planType}${year}Description` as keyof typeof t;
  return t[key] || "";
}

// Helper function to get translated timeline label
function getTimelineLabel(year: number, t: any): string {
  const labelMap: Record<number, keyof typeof t> = {
    2025: "presentDay",
    2030: "earlyPhase",
    2035: "midPhase",
    2040: "advanced",
    2045: "mature",
    2050: "complete",
  };
  const key = labelMap[year];
  return key ? t[key] : "";
}

export default function Map() {
  const { language, setLanguage, t } = useLanguage();
  const { isMobile, isTablet } = useMediaQuery();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const timelineRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [loaded, setLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("realistic");
  const [selectedYear, setSelectedYear] = useState(2050); // Default to showing everything
  const [infoPanelMinimized, setInfoPanelMinimized] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(false); // Collapsed by default on mobile
  const [mode3dEnabled, setMode3dEnabled] = useState(false); // 3D terrain/fog off by default to save memory
  const [buildings3dEnabled, setBuildings3dEnabled] = useState(true);
  const [animatedTrafficEnabled, setAnimatedTrafficEnabled] = useState(true);
  const [trafficSpeed, setTrafficSpeed] = useState<"slow" | "normal" | "fast">(
    "normal"
  );

  // Refs for layer controls
  const layerControlsRef = useRef<{
    gondola: GondolaLayerControls | null;
    medvednicaGondola: GondolaLayerControls | null;
    tram: TramLayerControls | null;
    metroA: MetroLayerControls | null;
    metroB: MetroLayerControls | null;
    metroC: MetroLayerControls | null;
  }>({
    gondola: null,
    medvednicaGondola: null,
    tram: null,
    metroA: null,
    metroB: null,
    metroC: null,
  });

  // Get current construction phase for active elements
  const activeElements = useMemo(
    () => getActiveElements(selectedYear, selectedPlan),
    [selectedYear, selectedPlan]
  );

  const visibility = useMemo<LayerVisibility>(
    () => ({
      metroA: activeElements.metroA !== "none",
      metroB: activeElements.metroB !== "none",
      metroC: activeElements.metroC !== "none",
      premetro: activeElements.premetro !== "none",
      gondola: activeElements.gondola !== "none",
      medvednicaGondola: activeElements.medvednicaGondola !== "none",
      stations:
        activeElements.metroA !== "none" ||
        activeElements.metroB !== "none" ||
        activeElements.metroC !== "none",
      development: activeElements.development !== "none",
      buildings3d: buildings3dEnabled,
    }),
    [activeElements, buildings3dEnabled]
  );

  const currentPlan = transitPlans[selectedPlan];

  // Helper function to add a line segment to the map
  const addSegmentToMap = (
    map: mapboxgl.Map,
    segmentId: string,
    coordinates: number[][],
    color: string,
    isAnimated = true
  ) => {
    const sourceId = `segment-${segmentId}`;
    const layerId = `layer-${segmentId}`;
    const animatedLayerId = `layer-${segmentId}-animated`;

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates,
        },
      },
    });

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": color,
        "line-width": 4,
        "line-opacity": 0.9,
      },
      layout: {
        visibility: "none",
      },
    });

    if (isAnimated) {
      map.addLayer({
        id: animatedLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-dasharray": [0, 4, 3],
          "line-opacity": 0.6,
        },
        layout: {
          visibility: "none",
        },
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [STATION_GLAVNI_KOLODVOR.lng, STATION_GLAVNI_KOLODVOR.lat], // Glavni kolodvor
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    map.current.on("load", () => {
      const m = map.current!;

      // Add DEM source for 3D terrain
      m.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });

      // Add development zones (polygons)
      m.addSource("development-zones", {
        type: "geojson",
        data: developmentZones,
      });

      m.addLayer({
        id: "development-zones-fill",
        type: "fill",
        source: "development-zones",
        paint: {
          "fill-color": [
            "match",
            ["get", "type"],
            "recreation",
            "#22c55e",
            "cultural",
            "#a855f7",
            "mixed",
            "#3b82f6",
            "#6b7280",
          ],
          "fill-opacity": 0.25,
        },
      });

      m.addLayer({
        id: "development-zones-outline",
        type: "line",
        source: "development-zones",
        paint: {
          "line-color": [
            "match",
            ["get", "type"],
            "recreation",
            "#22c55e",
            "cultural",
            "#a855f7",
            "mixed",
            "#3b82f6",
            "commercial",
            "#f97316",
            "#6b7280",
          ],
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });

      // Premetro stations (line segments are added later as part of the segment system)
      m.addSource("premetro-stations", {
        type: "geojson",
        data: premetroStations,
      });

      // Portal markers (diamond shape via rotation)
      m.addLayer({
        id: "premetro-portals",
        type: "circle",
        source: "premetro-stations",
        filter: ["==", ["get", "isPortal"], true],
        paint: {
          "circle-radius": 8,
          "circle-color": premetroTunnel.properties.color,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Underground stations
      m.addLayer({
        id: "premetro-underground",
        type: "circle",
        source: "premetro-stations",
        filter: ["!=", ["get", "isPortal"], true],
        paint: {
          "circle-radius": ["case", ["==", ["get", "isMajor"], true], 9, 6],
          "circle-color": premetroTunnel.properties.color,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Premetro station labels
      m.addLayer({
        id: "premetro-labels",
        type: "symbol",
        source: "premetro-stations",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#a78bfa",
          "text-halo-color": "#1f2937",
          "text-halo-width": 1.5,
        },
      });

      // Add Metro Line A Segments
      Object.values(metroASegments).forEach((segment) => {
        addSegmentToMap(m, segment.id, segment.coordinates, "#2563eb");
      });

      // Add Metro Line B Segments
      Object.values(metroBSegments).forEach((segment) => {
        addSegmentToMap(m, segment.id, segment.coordinates, "#dc2626");
      });

      // Add Metro Line C Segments
      Object.values(metroCSegments).forEach((segment) => {
        addSegmentToMap(m, segment.id, segment.coordinates, "#16a34a");
      });

      // Add Premetro Segments
      Object.values(premetroSegments).forEach((segment) => {
        addSegmentToMap(m, segment.id, segment.coordinates, "#8b5cf6");
      });

      // Add Gondola Segments
      Object.values(gondolaSegments).forEach((segment) => {
        addSegmentToMap(m, segment.id, segment.coordinates, "#f59e0b", false);
      });

      // Add Medvednica Gondola Segments
      Object.values(medvednicaGondolaSegments).forEach((segment) => {
        addSegmentToMap(m, segment.id, segment.coordinates, "#10b981", false);
      });

      // Add Metro Stations
      m.addSource("metro-stations", {
        type: "geojson",
        data: metroStations,
      });

      // Outer ring for interchange stations
      m.addLayer({
        id: "metro-stations-interchange-outer",
        type: "circle",
        source: "metro-stations",
        filter: ["==", ["get", "isInterchange"], true],
        paint: {
          "circle-radius": 10,
          "circle-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#1f2937",
        },
      });

      // Regular station markers
      m.addLayer({
        id: "metro-stations-regular",
        type: "circle",
        source: "metro-stations",
        filter: ["!=", ["get", "isInterchange"], true],
        paint: {
          "circle-radius": 6,
          "circle-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#374151",
        },
      });

      // Add Gondola Stations
      m.addSource("gondola-stations", {
        type: "geojson",
        data: gondolaStations,
      });

      m.addLayer({
        id: "gondola-stations",
        type: "circle",
        source: "gondola-stations",
        paint: {
          "circle-radius": 7,
          "circle-color": gondolaLine.properties.color,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Gondola station labels
      m.addLayer({
        id: "gondola-labels",
        type: "symbol",
        source: "gondola-stations",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#fbbf24",
          "text-halo-color": "#1f2937",
          "text-halo-width": 1.5,
        },
      });

      // Add Medvednica Gondola Stations
      m.addSource("medvednica-gondola-stations", {
        type: "geojson",
        data: medvednicaGondolaStations,
      });

      m.addLayer({
        id: "medvednica-gondola-stations",
        type: "circle",
        source: "medvednica-gondola-stations",
        paint: {
          "circle-radius": 7,
          "circle-color": medvednicaGondolaLine.properties.color,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Medvednica Gondola station labels
      m.addLayer({
        id: "medvednica-gondola-labels",
        type: "symbol",
        source: "medvednica-gondola-stations",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#10b981",
          "text-halo-color": "#1f2937",
          "text-halo-width": 1.5,
        },
      });
      // Station labels
      m.addLayer({
        id: "station-labels",
        type: "symbol",
        source: "metro-stations",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#1f2937",
          "text-halo-width": 1.5,
        },
      });

      // Add 3D Gondola Layer
      const gondolaLayer = createGondolaLayer(m, {
        id: "gondola-3d",
        line: gondolaLine,
        cabinCount: 5,
        speed: 0.0002,
      });
      m.addLayer(gondolaLayer);
      layerControlsRef.current.gondola = gondolaLayer.controls;

      // Add 3D Medvednica Gondola Layer
      const medvednicaGondolaLayer = createGondolaLayer(m, {
        id: "medvednica-gondola-3d",
        line: medvednicaGondolaLine,
        cabinCount: 4,
        speed: 0.00015,
      });
      m.addLayer(medvednicaGondolaLayer);
      layerControlsRef.current.medvednicaGondola =
        medvednicaGondolaLayer.controls;

      // Add 3D Premetro Tram Layer
      const tramLayer = createTramLayer(m, {
        id: "premetro-tram-3d",
        tramCount: 2,
        speed: 0.0003,
      });
      m.addLayer(tramLayer);
      layerControlsRef.current.tram = tramLayer.controls;

      // Add 3D Metro Train Layers
      const metroALayer = createMetroLayer(m, {
        id: "metro-a-train-3d",
        line: "A",
        trainCount: 3,
        carCount: 3,
        speed: 0.00025,
      });
      m.addLayer(metroALayer);
      layerControlsRef.current.metroA = metroALayer.controls;

      const metroBLayer = createMetroLayer(m, {
        id: "metro-b-train-3d",
        line: "B",
        trainCount: 3,
        carCount: 3,
        speed: 0.00025,
      });
      m.addLayer(metroBLayer);
      layerControlsRef.current.metroB = metroBLayer.controls;

      const metroCLayer = createMetroLayer(m, {
        id: "metro-c-train-3d",
        line: "C",
        trainCount: 3,
        carCount: 3,
        speed: 0.00025,
      });
      m.addLayer(metroCLayer);
      layerControlsRef.current.metroC = metroCLayer.controls;

      // Animate the metro line dashes
      let dashOffset = 0;
      function animateDash() {
        dashOffset -= 0.5;

        // Create moving dash effect by updating dasharray
        const offset = Math.abs(dashOffset % 7);

        // Animate all metro and premetro segment layers
        const allSegmentIds = [
          ...Object.keys(metroASegments),
          ...Object.keys(metroBSegments),
          ...Object.keys(metroCSegments),
          ...Object.keys(premetroSegments),
        ];

        allSegmentIds.forEach((segmentId) => {
          const layerId = `layer-${segmentId}-animated`;
          if (m.getLayer(layerId)) {
            m.setPaintProperty(layerId, "line-dasharray", [offset, 4, 3]);
          }
        });

        requestAnimationFrame(animateDash);
      }
      animateDash();

      // Add popups for stations
      m.on("click", "metro-stations-regular", (e) => {
        if (!e.features?.[0]?.properties) return;
        const props = e.features[0].properties;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;

        new mapboxgl.Popup()
          .setLngLat(coords as [number, number])
          .setHTML(
            `
            <div style="color: #1f2937; padding: 4px;">
              <strong>${props.name || "Station"}</strong><br/>
              <span style="color: #6b7280;">Metro Line ${
                props.lines || ""
              }</span>
            </div>
          `
          )
          .addTo(m);
      });

      m.on("click", "metro-stations-interchange-outer", (e) => {
        if (!e.features?.[0]?.properties) return;
        const props = e.features[0].properties;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;
        const lines = JSON.parse(props.lines || "[]");

        new mapboxgl.Popup()
          .setLngLat(coords as [number, number])
          .setHTML(
            `
            <div style="color: #1f2937; padding: 4px;">
              <strong>${props.name || "Interchange"}</strong><br/>
              <span style="color: #6b7280;">Interchange: Lines ${lines.join(
                ", "
              )}</span>
            </div>
          `
          )
          .addTo(m);
      });

      m.on("click", "gondola-stations", (e) => {
        if (!e.features?.[0]?.properties) return;
        const props = e.features[0].properties;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;

        new mapboxgl.Popup()
          .setLngLat(coords as [number, number])
          .setHTML(
            `
            <div style="color: #1f2937; padding: 4px;">
              <strong>🚡 ${props.name || "Gondola Station"}</strong><br/>
              <span style="color: #6b7280;">${props.description || ""}</span>
            </div>
          `
          )
          .addTo(m);
      });

      m.on("click", "premetro-portals", (e) => {
        if (!e.features?.[0]?.properties) return;
        const props = e.features[0].properties;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;

        new mapboxgl.Popup()
          .setLngLat(coords as [number, number])
          .setHTML(
            `
            <div style="color: #1f2937; padding: 4px;">
              <strong>🚇 ${props.name || "Premetro Portal"}</strong><br/>
              <span style="color: #6b7280;">${
                props.description || "Portal station"
              }</span>
            </div>
          `
          )
          .addTo(m);
      });

      m.on("click", "premetro-underground", (e) => {
        if (!e.features?.[0]?.properties) return;
        const props = e.features[0].properties;
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates;

        new mapboxgl.Popup()
          .setLngLat(coords as [number, number])
          .setHTML(
            `
            <div style="color: #1f2937; padding: 4px;">
              <strong>🚇 ${props.name || "Premetro Station"}</strong><br/>
              <span style="color: #6b7280;">${
                props.description || "Underground station"
              }</span>
            </div>
          `
          )
          .addTo(m);
      });

      // Change cursor on hover
      m.on("mouseenter", "metro-stations-regular", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "metro-stations-regular", () => {
        m.getCanvas().style.cursor = "";
      });
      m.on("mouseenter", "metro-stations-interchange-outer", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "metro-stations-interchange-outer", () => {
        m.getCanvas().style.cursor = "";
      });
      m.on("mouseenter", "gondola-stations", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "gondola-stations", () => {
        m.getCanvas().style.cursor = "";
      });
      m.on("mouseenter", "premetro-portals", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "premetro-portals", () => {
        m.getCanvas().style.cursor = "";
      });
      m.on("mouseenter", "premetro-underground", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "premetro-underground", () => {
        m.getCanvas().style.cursor = "";
      });

      // Add 3D buildings layer (terrain and fog are controlled by toggle)
      const layers = m.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      m.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 13,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "height"],
              0,
              "#6b7280",
              50,
              "#9ca3af",
              100,
              "#d1d5db",
            ],
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              13,
              0,
              13.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              13,
              0,
              13.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.7,
          },
        },
        labelLayerId
      );

      // Add navigation controls
      m.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        "bottom-right"
      );

      // Add scale control
      m.addControl(new mapboxgl.ScaleControl(), "bottom-left");

      setLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update layer opacity based on construction phase
  useEffect(() => {
    if (map.current && loaded) {
      const m = map.current;

      // Development zones opacity (only thing that still uses opacity for partial state)
      const devOpacity = activeElements.development === "partial" ? 0.15 : 0.25;
      if (m.getLayer("development-zones-fill")) {
        m.setPaintProperty(
          "development-zones-fill",
          "fill-opacity",
          devOpacity
        );
      }
    }
  }, [activeElements, loaded]);

  // Handle 3D mode (terrain + fog)
  useEffect(() => {
    if (!map.current || !loaded) return;
    const m = map.current;

    if (mode3dEnabled) {
      // Enable 3D terrain
      m.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      });

      // Enable fog/atmosphere
      m.setFog({
        color: "rgb(186, 210, 235)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(11, 11, 25)",
        "star-intensity": 0.6,
      });
    } else {
      // Disable 3D terrain
      m.setTerrain(null);

      // Disable fog/atmosphere
      m.setFog(null);
    }
  }, [mode3dEnabled, loaded]);

  // Handle 3D buildings visibility
  useEffect(() => {
    if (!map.current || !loaded) return;
    const m = map.current;

    if (m.getLayer("3d-buildings")) {
      m.setLayoutProperty(
        "3d-buildings",
        "visibility",
        visibility.buildings3d ? "visible" : "none"
      );
    }
  }, [visibility.buildings3d, loaded]);

  // Handle animated traffic visibility and speed
  useEffect(() => {
    if (!loaded) return;

    const controls = layerControlsRef.current;

    // Set visibility for all traffic layers
    controls.gondola?.setVisible(animatedTrafficEnabled);
    controls.medvednicaGondola?.setVisible(animatedTrafficEnabled);
    controls.tram?.setVisible(animatedTrafficEnabled);
    controls.metroA?.setVisible(animatedTrafficEnabled);
    controls.metroB?.setVisible(animatedTrafficEnabled);
    controls.metroC?.setVisible(animatedTrafficEnabled);

    // Set speed based on selection
    const speedMultiplier =
      trafficSpeed === "slow" ? 0.5 : trafficSpeed === "fast" ? 2 : 1;

    controls.gondola?.setSpeed(0.0002 * speedMultiplier);
    controls.medvednicaGondola?.setSpeed(0.00015 * speedMultiplier);
    controls.tram?.setSpeed(0.0003 * speedMultiplier);
    controls.metroA?.setSpeed(0.00025 * speedMultiplier);
    controls.metroB?.setSpeed(0.00025 * speedMultiplier);
    controls.metroC?.setSpeed(0.00025 * speedMultiplier);
  }, [animatedTrafficEnabled, trafficSpeed, loaded]);

  // Handle segment visibility based on timeline
  useEffect(() => {
    if (!map.current || !loaded) return;
    const m = map.current;

    const setVis = (layerId: string, visible: boolean) => {
      if (m.getLayer(layerId)) {
        m.setLayoutProperty(
          layerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    };

    // Get active segments for current timeline
    const activeSegments = getActiveSegments(selectedYear, selectedPlan);

    // Metro A segments
    Object.keys(metroASegments).forEach((segmentId) => {
      const isActive = activeSegments?.metroA?.includes(segmentId) || false;
      setVis(`layer-${segmentId}`, isActive);
      setVis(`layer-${segmentId}-animated`, isActive);
    });

    // Metro B segments
    Object.keys(metroBSegments).forEach((segmentId) => {
      const isActive = activeSegments?.metroB?.includes(segmentId) || false;
      setVis(`layer-${segmentId}`, isActive);
      setVis(`layer-${segmentId}-animated`, isActive);
    });

    // Metro C segments
    Object.keys(metroCSegments).forEach((segmentId) => {
      const isActive = activeSegments?.metroC?.includes(segmentId) || false;
      setVis(`layer-${segmentId}`, isActive);
      setVis(`layer-${segmentId}-animated`, isActive);
    });

    // Premetro segments
    Object.keys(premetroSegments).forEach((segmentId) => {
      const isActive = activeSegments?.premetro?.includes(segmentId) || false;
      setVis(`layer-${segmentId}`, isActive);
      setVis(`layer-${segmentId}-animated`, isActive);
    });

    // Gondola segments
    Object.keys(gondolaSegments).forEach((segmentId) => {
      const isActive = activeSegments?.gondola?.includes(segmentId) || false;
      setVis(`layer-${segmentId}`, isActive);
    });

    // Medvednica Gondola segments (only visible in ambitious plan)
    const isAmbitiousPlan = selectedPlan === "ambitious";
    Object.keys(medvednicaGondolaSegments).forEach((segmentId) => {
      const isActive =
        isAmbitiousPlan &&
        (activeSegments?.medvednicaGondola?.includes(segmentId) || false);
      setVis(`layer-${segmentId}`, isActive);
    });

    // Other layers (gondola 3D, stations, development zones)
    setVis("gondola-3d", visibility.gondola);
    setVis("gondola-stations", visibility.gondola);
    setVis("gondola-labels", visibility.gondola);
    // Medvednica gondola only visible in ambitious plan
    const medvednicaVisible = visibility.medvednicaGondola && isAmbitiousPlan;
    setVis("medvednica-gondola-3d", medvednicaVisible);
    setVis("medvednica-gondola-stations", medvednicaVisible);
    setVis("medvednica-gondola-labels", medvednicaVisible);
    setVis("premetro-portals", visibility.premetro);
    setVis("premetro-underground", visibility.premetro);
    setVis("premetro-labels", visibility.premetro);
    setVis("premetro-tram-3d", visibility.premetro);
    setVis("metro-a-train-3d", visibility.metroA);
    setVis("metro-b-train-3d", visibility.metroB);
    setVis("metro-c-train-3d", visibility.metroC);
    setVis("development-zones-fill", visibility.development);
    setVis("development-zones-outline", visibility.development);

    // Build filter for metro stations based on active segments
    // Only show stations that are part of currently active segments
    const activeStationNames = getActiveStationNames(
      selectedYear,
      selectedPlan
    );

    // Create filter: show station if its name is in the active stations list
    const stationFilter: mapboxgl.FilterSpecification =
      activeStationNames.length > 0
        ? ["in", ["get", "name"], ["literal", activeStationNames]]
        : ["==", "1", "0"]; // Always false filter when no stations active

    // Apply filters and visibility to metro station layers
    if (m.getLayer("metro-stations-regular")) {
      m.setLayoutProperty(
        "metro-stations-regular",
        "visibility",
        visibility.stations ? "visible" : "none"
      );
      m.setFilter("metro-stations-regular", [
        "all",
        ["!=", ["get", "isInterchange"], true],
        stationFilter,
      ]);
    }

    if (m.getLayer("metro-stations-interchange-outer")) {
      m.setLayoutProperty(
        "metro-stations-interchange-outer",
        "visibility",
        visibility.stations ? "visible" : "none"
      );
      m.setFilter("metro-stations-interchange-outer", [
        "all",
        ["==", ["get", "isInterchange"], true],
        stationFilter,
      ]);
    }

    if (m.getLayer("station-labels")) {
      m.setLayoutProperty(
        "station-labels",
        "visibility",
        visibility.stations ? "visible" : "none"
      );
      m.setFilter("station-labels", stationFilter);
    }

    // Apply same logic to premetro stations
    if (m.getLayer("premetro-portals")) {
      m.setLayoutProperty(
        "premetro-portals",
        "visibility",
        visibility.premetro ? "visible" : "none"
      );
      m.setFilter("premetro-portals", stationFilter);
    }

    if (m.getLayer("premetro-underground")) {
      m.setLayoutProperty(
        "premetro-underground",
        "visibility",
        visibility.premetro ? "visible" : "none"
      );
      m.setFilter("premetro-underground", stationFilter);
    }

    if (m.getLayer("premetro-labels")) {
      m.setLayoutProperty(
        "premetro-labels",
        "visibility",
        visibility.premetro ? "visible" : "none"
      );
      m.setFilter("premetro-labels", stationFilter);
    }

    // Apply same logic to gondola stations
    if (m.getLayer("gondola-stations")) {
      m.setLayoutProperty(
        "gondola-stations",
        "visibility",
        visibility.gondola ? "visible" : "none"
      );
      m.setFilter("gondola-stations", stationFilter);
    }

    if (m.getLayer("gondola-labels")) {
      m.setLayoutProperty(
        "gondola-labels",
        "visibility",
        visibility.gondola ? "visible" : "none"
      );
      m.setFilter("gondola-labels", stationFilter);
    }
  }, [visibility, loaded, selectedYear, selectedPlan]);

  const resetView = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [15.979, 45.805], // Glavni kolodvor
      zoom: 11.5,
      pitch: 0,
      bearing: 0,
      duration: 1500,
    });
  };

  const scrollToTimelineSection = (year: number) => {
    const element = timelineRefs.current[year];
    if (element && infoPanelRef.current) {
      const container = infoPanelRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elementTop - 20, // 20px offset for padding
        behavior: "smooth",
      });
    }
  };

  // Auto-close control panel on mobile when tapping outside
  const handleOverlayClick = () => {
    if (isMobile || isTablet) {
      setControlPanelOpen(false);
    }
  };

  return (
    <div
      className={`map-container ${isMobile ? "is-mobile" : ""} ${
        isTablet ? "is-tablet" : ""
      }`}>
      <div ref={mapContainer} className="map-canvas" />

      {/* Mobile Menu Toggle Button */}
      {(isMobile || isTablet) && (
        <button
          className={`mobile-menu-toggle ${controlPanelOpen ? "active" : ""}`}
          onClick={() => setControlPanelOpen(!controlPanelOpen)}
          aria-label={controlPanelOpen ? "Close menu" : "Open menu"}>
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      {/* Mobile Overlay */}
      {(isMobile || isTablet) && controlPanelOpen && (
        <div className="mobile-overlay" onClick={handleOverlayClick} />
      )}

      {/* Control Panel */}
      <div
        className={`control-panel ${
          isMobile || isTablet ? (controlPanelOpen ? "open" : "closed") : ""
        }`}>
        <div className="control-panel-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
            <div>
              <h2 className="control-panel-title">{t.controlPanelTitle}</h2>
              <p className="control-panel-subtitle">{t.controlPanelSubtitle}</p>
            </div>
            <button
              onClick={() => setLanguage(language === "hr" ? "en" : "hr")}
              className="language-selector">
              {language === "hr" ? "EN" : "HR"}
            </button>
          </div>
        </div>

        <div className="control-panel-content">
          {/* Plan Switcher */}
          <div className="plan-switcher-container">
            <p className="plan-switcher-label">{t.transitPlanLabel}</p>
            <div className="plan-switcher-buttons">
              <button
                onClick={() => {
                  setSelectedPlan("realistic");
                  setSelectedYear(2050);
                }}
                className={`plan-button realistic ${
                  selectedPlan === "realistic" ? "active" : ""
                }`}>
                {t.realisticPlan}
              </button>
              <button
                onClick={() => {
                  setSelectedPlan("ambitious");
                  setSelectedYear(2050);
                }}
                className={`plan-button ambitious ${
                  selectedPlan === "ambitious" ? "active" : ""
                }`}>
                {t.ambitiousPlan}
              </button>
            </div>
            <p className="plan-description">
              {selectedPlan === "realistic"
                ? t.realisticPlanDescription
                : t.ambitiousPlanDescription}
            </p>
            <p className="plan-cost">
              {selectedPlan === "realistic"
                ? t.realisticPlanCost
                : t.ambitiousPlanCost}
            </p>
          </div>

          <div className="layer-list">
            <div
              className={`layer-item ${visibility.metroA ? "" : "inactive"}`}>
              <span
                className={`layer-status-indicator metro-a ${activeElements.metroA}`}>
                {activeElements.metroA === "partial"
                  ? "🚧"
                  : activeElements.metroA === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.metroLineA}
                {activeElements.metroA === "partial" && (
                  <span className="layer-status"> ({t.building})</span>
                )}
              </span>
            </div>

            <div
              className={`layer-item ${visibility.metroB ? "" : "inactive"}`}>
              <span
                className={`layer-status-indicator metro-b ${activeElements.metroB}`}>
                {activeElements.metroB === "partial"
                  ? "🚧"
                  : activeElements.metroB === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.metroLineB}
                {activeElements.metroB === "partial" && (
                  <span className="layer-status"> ({t.building})</span>
                )}
              </span>
            </div>

            <div
              className={`layer-item ${visibility.metroC ? "" : "inactive"}`}>
              <span
                className={`layer-status-indicator metro-c ${activeElements.metroC}`}>
                {activeElements.metroC === "partial"
                  ? "🚧"
                  : activeElements.metroC === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.metroLineC}
                {activeElements.metroC === "partial" && (
                  <span className="layer-status"> ({t.building})</span>
                )}
              </span>
            </div>

            <div
              className={`layer-item ${visibility.premetro ? "" : "inactive"}`}>
              <span
                className={`layer-status-indicator premetro ${activeElements.premetro}`}>
                {activeElements.premetro === "partial"
                  ? "🚧"
                  : activeElements.premetro === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.premetroTunnel}
                {activeElements.premetro === "partial" && (
                  <span className="layer-status"> ({t.building})</span>
                )}
              </span>
            </div>

            <div
              className={`layer-item ${visibility.gondola ? "" : "inactive"}`}>
              <span
                className={`layer-status-indicator gondola ${activeElements.gondola}`}>
                {activeElements.gondola === "partial"
                  ? "🚧"
                  : activeElements.gondola === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.savaSkyway}
                {activeElements.gondola === "partial" && (
                  <span className="layer-status"> ({t.building})</span>
                )}
              </span>
            </div>

            <div
              className={`layer-item ${
                selectedPlan !== "ambitious"
                  ? "disabled"
                  : visibility.medvednicaGondola
                  ? ""
                  : "inactive"
              }`}>
              <span
                className={`layer-status-indicator medvednica-gondola ${
                  selectedPlan !== "ambitious"
                    ? "none"
                    : activeElements.medvednicaGondola
                }`}>
                {selectedPlan !== "ambitious"
                  ? "○"
                  : activeElements.medvednicaGondola === "partial"
                  ? "🚧"
                  : activeElements.medvednicaGondola === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.medvednicaSkyway}
                {selectedPlan === "ambitious" &&
                  activeElements.medvednicaGondola === "partial" && (
                    <span className="layer-status"> ({t.building})</span>
                  )}
              </span>
            </div>

            <div
              className={`layer-item ${
                visibility.development ? "" : "inactive"
              }`}>
              <span
                className={`layer-status-indicator development ${activeElements.development}`}>
                {activeElements.development === "partial"
                  ? "🚧"
                  : activeElements.development === "full"
                  ? "●"
                  : "○"}
              </span>
              <span className="layer-name">
                {t.developmentZones}
                {activeElements.development === "partial" && (
                  <span className="layer-status"> ({t.planning})</span>
                )}
              </span>
            </div>
          </div>

          {/* 3D Graphics Settings */}
          <div className="graphics-settings">
            <p className="graphics-settings-label">{t.graphicsSettings}</p>
            <div className="graphics-settings-list">
              <div
                className={`layer-item clickable ${
                  visibility.buildings3d ? "" : "inactive"
                }`}
                onClick={() => setBuildings3dEnabled(!buildings3dEnabled)}>
                <div
                  className={`layer-checkbox ${
                    visibility.buildings3d ? "active development" : ""
                  }`}>
                  {visibility.buildings3d && (
                    <span className="layer-checkbox-icon">✓</span>
                  )}
                </div>
                <span className="layer-name">{t.buildings3d}</span>
              </div>

              <div
                className={`layer-item clickable ${
                  mode3dEnabled ? "" : "inactive"
                }`}
                onClick={() => setMode3dEnabled(!mode3dEnabled)}>
                <div
                  className={`layer-checkbox ${
                    mode3dEnabled ? "active development" : ""
                  }`}>
                  {mode3dEnabled && (
                    <span className="layer-checkbox-icon">✓</span>
                  )}
                </div>
                <span className="layer-name">{t.mode3d}</span>
              </div>

              <div
                className={`layer-item clickable ${
                  animatedTrafficEnabled ? "" : "inactive"
                }`}
                onClick={() =>
                  setAnimatedTrafficEnabled(!animatedTrafficEnabled)
                }>
                <div
                  className={`layer-checkbox ${
                    animatedTrafficEnabled ? "active development" : ""
                  }`}>
                  {animatedTrafficEnabled && (
                    <span className="layer-checkbox-icon">✓</span>
                  )}
                </div>
                <span className="layer-name">{t.animatedTraffic}</span>
              </div>

              {animatedTrafficEnabled && (
                <div className="speed-control">
                  <span className="speed-label">{t.trafficSpeed}</span>
                  <div className="speed-buttons">
                    <button
                      className={`speed-button ${
                        trafficSpeed === "slow" ? "active" : ""
                      }`}
                      onClick={() => setTrafficSpeed("slow")}>
                      {t.speedSlow}
                    </button>
                    <button
                      className={`speed-button ${
                        trafficSpeed === "normal" ? "active" : ""
                      }`}
                      onClick={() => setTrafficSpeed("normal")}>
                      {t.speedNormal}
                    </button>
                    <button
                      className={`speed-button ${
                        trafficSpeed === "fast" ? "active" : ""
                      }`}
                      onClick={() => setTrafficSpeed("fast")}>
                      {t.speedFast}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="legend">
            <p className="legend-title">
              <strong>{t.activeElementsTitle}</strong>
            </p>
            <p>{t.activeElementsChecked}</p>
            <p>{t.activeElementsTimeline}</p>
            <p>{t.activeElementsClickStations}</p>
          </div>

          <button onClick={resetView} className="reset-button">
            {t.resetViewButton}
          </button>
        </div>
      </div>

      {/* Timeline Control */}
      <div className={`timeline-control ${isMobile ? "mobile" : ""}`}>
        <div className="timeline-header">
          <div className="timeline-info">
            <h3>
              {isMobile ? selectedYear : `${t.timelineLabel} ${selectedYear}`}
            </h3>
            {!isMobile && (
              <p>{getTimelineDescription(selectedYear, selectedPlan, t)}</p>
            )}
          </div>
          <button
            onClick={() => setSelectedYear(2050)}
            className="timeline-full-network-button">
            {isMobile ? "2050" : t.viewFullNetwork}
          </button>
        </div>

        <div className="timeline-slider-container">
          <div className="timeline-track" />
          <div
            className="timeline-progress"
            style={{
              width: `calc(${
                ((selectedYear - 2025) / (2050 - 2025)) * 100
              }% - 7px)`,
            }}
          />

          <div className="timeline-markers">
            {currentPlan.timeline.map((phase) => (
              <div
                key={phase.year}
                className="timeline-marker"
                onClick={() => {
                  setSelectedYear(phase.year);
                  scrollToTimelineSection(phase.year);
                }}>
                <div
                  className={`timeline-marker-dot ${
                    selectedYear >= phase.year ? "active" : ""
                  } ${selectedYear === phase.year ? "selected" : ""}`}
                />
                <span
                  className={`timeline-marker-year ${
                    selectedYear === phase.year ? "selected" : ""
                  }`}>
                  {phase.year}
                </span>
                {!isMobile && (
                  <span className="timeline-marker-label">
                    {getTimelineLabel(phase.year, t)}
                  </span>
                )}
              </div>
            ))}
          </div>

          <input
            type="range"
            min="2025"
            max="2050"
            step="5"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="timeline-slider-input"
          />
        </div>
      </div>

      {/* Title overlay */}
      {/* <div className="title-overlay">
        <div>
          <h1>{t.appTitle}</h1>
          <p>{t.appSubtitle}</p>
        </div>
      </div> */}

      {/* Info Panel - hide when control panel is open on mobile */}
      {!(isMobile && controlPanelOpen && infoPanelMinimized) && (
        <div
          className={`info-panel ${infoPanelMinimized ? "minimized" : ""} ${
            isMobile ? "mobile" : ""
          }`}>
          <button
            className="info-panel-toggle"
            onClick={() => setInfoPanelMinimized(!infoPanelMinimized)}
            title={infoPanelMinimized ? "Show info panel" : "Hide info panel"}>
            {infoPanelMinimized ? "📖" : "✕"}
          </button>

          {!infoPanelMinimized && (
            <div ref={infoPanelRef} className="info-panel-content">
              <h2 className="info-panel-title">{t.infoPanelTitle}</h2>

              <section className="info-section">
                <h3>{t.overviewTitle}</h3>
              <p>
                {selectedPlan === "realistic"
                  ? t.overviewRealistic
                  : t.overviewAmbitious}
              </p>
            </section>

            <section className="info-section">
              <h3>{t.reasoningTitle}</h3>
              <p>
                {selectedPlan === "realistic"
                  ? t.reasoningRealistic
                  : t.reasoningAmbitious}
              </p>
            </section>

            <section className="info-section">
              <h3>{t.timelineDetailsTitle}</h3>

              {currentPlan.timeline.map((phase) => (
                <div
                  key={phase.year}
                  ref={(el) => {
                    timelineRefs.current[phase.year] = el;
                  }}
                  className={`timeline-detail-section ${
                    selectedYear === phase.year ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedYear(phase.year);
                  }}>
                  <h4>
                    {phase.year} - {getTimelineLabel(phase.year, t)}
                  </h4>
                  <p>{getTimelineDescription(phase.year, selectedPlan, t)}</p>
                </div>
              ))}
            </section>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
