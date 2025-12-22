import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
  const [visibility, setVisibility] = useState<LayerVisibility>({
    metroA: true,
    metroB: false,
    metroC: false,
    premetro: true,
    gondola: true,
    stations: true,
    development: true,
  });

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

  const toggleLayer = (layer: keyof LayerVisibility) => {
    setVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

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
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* Control Panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(17, 24, 39, 0.9)",
          padding: "20px",
          borderRadius: "12px",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "280px",
        }}
      >
        <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 600 }}>
          🚇 Zagreb 2050
        </h2>
        <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#9ca3af" }}>
          Future Transit Vision
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.metroA}
              onChange={() => {
                toggleLayer("metroA");
                toggleLayer("stations");
              }}
              style={{ accentColor: "#2563eb" }}
            />
            <span
              style={{
                width: "12px",
                height: "12px",
                background: "#2563eb",
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "14px" }}>Metro Line A</span>
          </label>
          {/* 
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.metroB}
              onChange={() => toggleLayer("metroB")}
              style={{ accentColor: "#dc2626" }}
            />
            <span
              style={{
                width: "12px",
                height: "12px",
                background: "#dc2626",
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "14px" }}>Metro Line B</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.metroC}
              onChange={() => toggleLayer("metroC")}
              style={{ accentColor: "#16a34a" }}
            />
            <span
              style={{
                width: "12px",
                height: "12px",
                background: "#16a34a",
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "14px" }}>Metro Line C</span>
          </label> */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.premetro}
              onChange={() => toggleLayer("premetro")}
              style={{ accentColor: "#8b5cf6" }}
            />
            <span
              style={{
                width: "12px",
                height: "12px",
                background: "#8b5cf6",
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "14px" }}>🚇 Premetro Tunnel</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.gondola}
              onChange={() => toggleLayer("gondola")}
              style={{ accentColor: "#f59e0b" }}
            />
            <span
              style={{
                width: "12px",
                height: "12px",
                background: "#f59e0b",
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "14px" }}>🚡 Sava Skyway</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.stations}
              onChange={() => toggleLayer("stations")}
            />
            <span style={{ fontSize: "14px" }}>📍 Stations</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={visibility.development}
              onChange={() => toggleLayer("development")}
            />
            <span style={{ fontSize: "14px" }}>🏗️ Development Zones</span>
          </label>
        </div>

        <div
          style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            fontSize: "11px",
            color: "#6b7280",
          }}
        >
          <p style={{ margin: "0 0 8px 0" }}>
            <strong style={{ color: "#9ca3af" }}>Legend:</strong>
          </p>
          <p style={{ margin: "0 0 4px 0" }}>⚪ Large = Interchange station</p>
          <p style={{ margin: "0 0 4px 0" }}>
            🟣 Purple = Premetro (underground tram)
          </p>
          <p style={{ margin: "0 0 4px 0" }}>🟠 Orange = Gondola stations</p>
          <p style={{ margin: "0" }}>Click stations for details</p>
        </div>

        <button
          onClick={resetView}
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "10px 16px",
            background: "rgba(59, 130, 246, 0.8)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(59, 130, 246, 1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(59, 130, 246, 0.8)")
          }
        >
          🔄 Reset View
        </button>
      </div>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          textAlign: "right",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: 700,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          ZAGREB
        </h1>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: "14px",
            opacity: 0.8,
            letterSpacing: "4px",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          FUTURE TRANSIT NETWORK
        </p>
      </div>
    </div>
  );
}
