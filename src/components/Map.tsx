import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

import {
  metroLineA,
  metroLineB,
  metroLineC,
  gondolaLine,
  metroStations,
  gondolaStations,
  developmentZones,
  premetroTunnel,
  premetroStations,
  STATION_GLAVNI_KOLODVOR,
  transitPlans,
  getActiveElements,
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

      // Add Premetro Tunnel
      m.addSource("premetro-tunnel", {
        type: "geojson",
        data: premetroTunnel,
      });

      m.addLayer({
        id: "premetro-tunnel",
        type: "line",
        source: "premetro-tunnel",
        paint: {
          "line-color": premetroTunnel.properties.color,
          "line-width": 6,
          "line-opacity": 0.9,
        },
      });

      // Animated dash for premetro
      m.addLayer({
        id: "premetro-tunnel-animated",
        type: "line",
        source: "premetro-tunnel",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-dasharray": [2, 4],
          "line-opacity": 0.5,
        },
      });

      // Premetro stations
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

      // Add Metro Line A
      m.addSource("metro-line-a", {
        type: "geojson",
        data: metroLineA,
      });

      m.addLayer({
        id: "metro-line-a",
        type: "line",
        source: "metro-line-a",
        paint: {
          "line-color": metroLineA.properties.color,
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      // Animated dash effect for Metro A
      m.addLayer({
        id: "metro-line-a-animated",
        type: "line",
        source: "metro-line-a",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-dasharray": [0, 4, 3],
          "line-opacity": 0.6,
        },
      });

      // Add Metro Line B
      m.addSource("metro-line-b", {
        type: "geojson",
        data: metroLineB,
      });

      m.addLayer({
        id: "metro-line-b",
        type: "line",
        source: "metro-line-b",
        paint: {
          "line-color": metroLineB.properties.color,
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      m.addLayer({
        id: "metro-line-b-animated",
        type: "line",
        source: "metro-line-b",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-dasharray": [0, 4, 3],
          "line-opacity": 0.6,
        },
      });

      // Add Metro Line C
      m.addSource("metro-line-c", {
        type: "geojson",
        data: metroLineC,
      });

      m.addLayer({
        id: "metro-line-c",
        type: "line",
        source: "metro-line-c",
        paint: {
          "line-color": metroLineC.properties.color,
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      m.addLayer({
        id: "metro-line-c-animated",
        type: "line",
        source: "metro-line-c",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-dasharray": [0, 4, 3],
          "line-opacity": 0.6,
        },
      });

      // Add Gondola Line (2D representation)
      m.addSource("gondola-line", {
        type: "geojson",
        data: gondolaLine,
      });

      m.addLayer({
        id: "gondola-line",
        type: "line",
        source: "gondola-line",
        paint: {
          "line-color": gondolaLine.properties.color,
          "line-width": 3,
          "line-dasharray": [4, 2],
          "line-opacity": 0.8,
        },
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

      // Metro A opacity
      const metroAOpacity = activeElements.metroA === "partial" ? 0.5 : 0.9;
      if (m.getLayer("metro-line-a")) {
        m.setPaintProperty("metro-line-a", "line-opacity", metroAOpacity);
        m.setPaintProperty(
          "metro-line-a-animated",
          "line-opacity",
          activeElements.metroA === "partial" ? 0.3 : 0.6
        );
      }

      // Metro B opacity
      const metroBOpacity = activeElements.metroB === "partial" ? 0.5 : 0.9;
      if (m.getLayer("metro-line-b")) {
        m.setPaintProperty("metro-line-b", "line-opacity", metroBOpacity);
        m.setPaintProperty(
          "metro-line-b-animated",
          "line-opacity",
          activeElements.metroB === "partial" ? 0.3 : 0.6
        );
      }

      // Metro C opacity
      const metroCOpacity = activeElements.metroC === "partial" ? 0.5 : 0.9;
      if (m.getLayer("metro-line-c")) {
        m.setPaintProperty("metro-line-c", "line-opacity", metroCOpacity);
        m.setPaintProperty(
          "metro-line-c-animated",
          "line-opacity",
          activeElements.metroC === "partial" ? 0.3 : 0.6
        );
      }

      // Premetro opacity
      const premetroOpacity = activeElements.premetro === "partial" ? 0.5 : 0.9;
      if (m.getLayer("premetro-tunnel")) {
        m.setPaintProperty("premetro-tunnel", "line-opacity", premetroOpacity);
        m.setPaintProperty(
          "premetro-tunnel-animated",
          "line-opacity",
          activeElements.premetro === "partial" ? 0.25 : 0.5
        );
      }

      // Gondola opacity
      const gondolaOpacity = activeElements.gondola === "partial" ? 0.4 : 0.8;
      if (m.getLayer("gondola-line")) {
        m.setPaintProperty("gondola-line", "line-opacity", gondolaOpacity);
      }

      // Development zones opacity
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

  // Handle visibility changes
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

    setVis("metro-line-a", visibility.metroA);
    setVis("metro-line-a-animated", visibility.metroA);
    setVis("metro-line-b", visibility.metroB);
    setVis("metro-line-b-animated", visibility.metroB);
    setVis("metro-line-c", visibility.metroC);
    setVis("metro-line-c-animated", visibility.metroC);
    setVis("gondola-line", visibility.gondola);
    setVis("gondola-3d", visibility.gondola);
    setVis("gondola-stations", visibility.gondola);
    setVis("gondola-labels", visibility.gondola);
    setVis("premetro-tunnel", visibility.premetro);
    setVis("premetro-tunnel-animated", visibility.premetro);
    setVis("premetro-portals", visibility.premetro);
    setVis("premetro-underground", visibility.premetro);
    setVis("premetro-labels", visibility.premetro);
    setVis("development-zones-fill", visibility.development);
    setVis("development-zones-outline", visibility.development);

    // Build filter for metro stations based on visible lines
    // Stations should show if any of their lines are currently visible
    const visibleLines: string[] = [];
    if (visibility.metroA) visibleLines.push("A");
    if (visibility.metroB) visibleLines.push("B");
    if (visibility.metroC) visibleLines.push("C");

    // Create filter: show station if any of its lines is in the visible lines list
    // We check if the line letter appears in the stringified lines array
    // For interchange stations, they stay visible as long as at least one of their lines is visible
    const stationFilter: mapboxgl.FilterSpecification =
      visibleLines.length > 0
        ? [
            "any",
            ...visibleLines.map(
              (line): mapboxgl.ExpressionSpecification => [
                "in",
                line,
                ["to-string", ["get", "lines"]],
              ]
            ),
          ]
        : ["==", "1", "0"]; // Always false filter when no lines visible

    // Apply filters and visibility to station layers
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
  }, [visibility, loaded]);

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
