import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

import {
  gondolaLine,
  metroStations,
  gondolaStations,
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
  type PlanType,
} from "../data/transitNetwork";
import { createGondolaLayer } from "../layers/GondolaLayer";

// Using a public demo token - in production you'd use your own
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface LayerVisibility {
  metroA: boolean;
  metroB: boolean;
  metroC: boolean;
  premetro: boolean;
  gondola: boolean;
  stations: boolean;
  development: boolean;
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("realistic");
  const [selectedYear, setSelectedYear] = useState(2050); // Default to showing everything
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
      stations:
        activeElements.metroA !== "none" ||
        activeElements.metroB !== "none" ||
        activeElements.metroC !== "none",
      development: activeElements.development !== "none",
    }),
    [activeElements]
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
        cabinCount: 5,
        speed: 0.0002,
      });
      m.addLayer(gondolaLayer);

      // Animate the metro line dashes
      let dashOffset = 0;
      function animateDash() {
        dashOffset -= 0.5;

        // Create moving dash effect by updating dasharray
        const offset = Math.abs(dashOffset % 7);

        m.setPaintProperty("metro-line-a-animated", "line-dasharray", [
          offset,
          4,
          3,
        ]);
        m.setPaintProperty("metro-line-b-animated", "line-dasharray", [
          offset,
          4,
          3,
        ]);
        m.setPaintProperty("metro-line-c-animated", "line-dasharray", [
          offset,
          4,
          3,
        ]);

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

    // Other layers (gondola 3D, stations, development zones)
    setVis("gondola-3d", visibility.gondola);
    setVis("gondola-stations", visibility.gondola);
    setVis("gondola-labels", visibility.gondola);
    setVis("premetro-portals", visibility.premetro);
    setVis("premetro-underground", visibility.premetro);
    setVis("premetro-labels", visibility.premetro);
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

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map-canvas" />

      {/* Control Panel */}
      <div className="control-panel">
        <h2 className="control-panel-title">🚇 Zagreb 2050</h2>
        <p className="control-panel-subtitle">
          Use timeline to explore construction phases
        </p>

        {/* Plan Switcher */}
        <div className="plan-switcher-container">
          <p className="plan-switcher-label">TRANSIT PLAN</p>
          <div className="plan-switcher-buttons">
            <button
              onClick={() => {
                setSelectedPlan("realistic");
                setSelectedYear(2050);
              }}
              className={`plan-button realistic ${
                selectedPlan === "realistic" ? "active" : ""
              }`}
            >
              Realistic
            </button>
            <button
              onClick={() => {
                setSelectedPlan("ambitious");
                setSelectedYear(2050);
              }}
              className={`plan-button ambitious ${
                selectedPlan === "ambitious" ? "active" : ""
              }`}
            >
              Ambitious
            </button>
          </div>
          <p className="plan-description">{currentPlan.description}</p>
          <p className="plan-cost">{currentPlan.cost}</p>
        </div>

        <div className="layer-list">
          <div className={`layer-item ${visibility.metroA ? "" : "inactive"}`}>
            <div
              className={`layer-checkbox ${
                visibility.metroA ? "active metro-a" : ""
              }`}
            >
              {visibility.metroA && (
                <span className="layer-checkbox-icon">
                  {activeElements.metroA === "partial" ? "🚧" : "✓"}
                </span>
              )}
            </div>
            <span
              className={`layer-color-indicator metro-a ${
                activeElements.metroA === "partial" ? "partial" : ""
              }`}
            />
            <span className="layer-name">
              Metro Line A
              {activeElements.metroA === "partial" && (
                <span className="layer-status"> (building)</span>
              )}
            </span>
          </div>

          <div className={`layer-item ${visibility.metroB ? "" : "inactive"}`}>
            <div
              className={`layer-checkbox ${
                visibility.metroB ? "active metro-b" : ""
              }`}
            >
              {visibility.metroB && (
                <span className="layer-checkbox-icon">
                  {activeElements.metroB === "partial" ? "🚧" : "✓"}
                </span>
              )}
            </div>
            <span
              className={`layer-color-indicator metro-b ${
                activeElements.metroB === "partial" ? "partial" : ""
              }`}
            />
            <span className="layer-name">
              Metro Line B
              {activeElements.metroB === "partial" && (
                <span className="layer-status"> (building)</span>
              )}
            </span>
          </div>

          <div className={`layer-item ${visibility.metroC ? "" : "inactive"}`}>
            <div
              className={`layer-checkbox ${
                visibility.metroC ? "active metro-c" : ""
              }`}
            >
              {visibility.metroC && (
                <span className="layer-checkbox-icon">
                  {activeElements.metroC === "partial" ? "🚧" : "✓"}
                </span>
              )}
            </div>
            <span
              className={`layer-color-indicator metro-c ${
                activeElements.metroC === "partial" ? "partial" : ""
              }`}
            />
            <span className="layer-name">
              Metro Line C
              {activeElements.metroC === "partial" && (
                <span className="layer-status"> (building)</span>
              )}
            </span>
          </div>

          <div
            className={`layer-item ${visibility.premetro ? "" : "inactive"}`}
          >
            <div
              className={`layer-checkbox ${
                visibility.premetro ? "active premetro" : ""
              }`}
            >
              {visibility.premetro && (
                <span className="layer-checkbox-icon">
                  {activeElements.premetro === "partial" ? "🚧" : "✓"}
                </span>
              )}
            </div>
            <span
              className={`layer-color-indicator premetro ${
                activeElements.premetro === "partial" ? "partial" : ""
              }`}
            />
            <span className="layer-name">
              🚇 Premetro Tunnel
              {activeElements.premetro === "partial" && (
                <span className="layer-status"> (building)</span>
              )}
            </span>
          </div>

          <div className={`layer-item ${visibility.gondola ? "" : "inactive"}`}>
            <div
              className={`layer-checkbox ${
                visibility.gondola ? "active gondola" : ""
              }`}
            >
              {visibility.gondola && (
                <span className="layer-checkbox-icon">
                  {activeElements.gondola === "partial" ? "🚧" : "✓"}
                </span>
              )}
            </div>
            <span
              className={`layer-color-indicator gondola ${
                activeElements.gondola === "partial" ? "partial" : ""
              }`}
            />
            <span className="layer-name">
              🚡 Sava Skyway
              {activeElements.gondola === "partial" && (
                <span className="layer-status"> (building)</span>
              )}
            </span>
          </div>

          <div
            className={`layer-item ${visibility.development ? "" : "inactive"}`}
          >
            <div
              className={`layer-checkbox ${
                visibility.development ? "active development" : ""
              }`}
            >
              {visibility.development && (
                <span className="layer-checkbox-icon">
                  {activeElements.development === "partial" ? "🚧" : "✓"}
                </span>
              )}
            </div>
            <span className="layer-name">
              🏗️ Development Zones
              {activeElements.development === "partial" && (
                <span className="layer-status"> (planning)</span>
              )}
            </span>
          </div>
        </div>

        <div className="legend">
          <p className="legend-title">
            <strong>Active Elements:</strong>
          </p>
          <p>✓ Checked = Currently visible</p>
          <p>Use timeline slider to see construction phases</p>
          <p>Click stations for details</p>
        </div>

        <button onClick={resetView} className="reset-button">
          🔄 Reset View
        </button>
      </div>

      {/* Timeline Control */}
      <div className="timeline-control">
        <div className="timeline-header">
          <div className="timeline-info">
            <h3>Timeline: {selectedYear}</h3>
            <p>
              {
                currentPlan.timeline.find((p) => p.year === selectedYear)
                  ?.description
              }
            </p>
          </div>
          <button
            onClick={() => setSelectedYear(2050)}
            className="timeline-full-network-button"
          >
            View Full Network
          </button>
        </div>

        <div className="timeline-slider-container">
          <div className="timeline-track" />
          <div
            className="timeline-progress"
            style={{
              width: `${((selectedYear - 2025) / (2050 - 2025)) * 100}%`,
            }}
          />

          <div className="timeline-markers">
            {currentPlan.timeline.map((phase) => (
              <div
                key={phase.year}
                className="timeline-marker"
                onClick={() => setSelectedYear(phase.year)}
              >
                <div
                  className={`timeline-marker-dot ${
                    selectedYear >= phase.year ? "active" : ""
                  } ${selectedYear === phase.year ? "selected" : ""}`}
                />
                <span
                  className={`timeline-marker-year ${
                    selectedYear === phase.year ? "selected" : ""
                  }`}
                >
                  {phase.year}
                </span>
                <span className="timeline-marker-label">{phase.label}</span>
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
      <div className="title-overlay">
        <h1>ZAGREB</h1>
        <p>FUTURE TRANSIT NETWORK</p>
      </div>
    </div>
  );
}
