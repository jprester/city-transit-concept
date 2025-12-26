import * as THREE from "three";
import mapboxgl from "mapbox-gl";
import { premetroTunnel, premetroSegments } from "../data/transitNetwork";

// Convert lng/lat to Mapbox mercator coordinates
function lngLatToMercator(lng: number, lat: number): [number, number] {
  const mercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    [lng, lat],
    0
  );
  return [mercatorCoordinate.x, mercatorCoordinate.y];
}

// Interpolate position along a path
function interpolatePath(
  coordinates: number[][],
  t: number
): { position: [number, number, number]; rotation: number } {
  const totalSegments = coordinates.length - 1;
  const segmentIndex = Math.min(
    Math.floor(t * totalSegments),
    totalSegments - 1
  );
  const segmentT = (t * totalSegments) % 1;

  const start = coordinates[segmentIndex];
  const end = coordinates[segmentIndex + 1] || start;

  const lng = start[0] + (end[0] - start[0]) * segmentT;
  const lat = start[1] + (end[1] - start[1]) * segmentT;

  // Calculate rotation using Mercator coordinates
  // Note: Mercator Y increases southward, so we negate to get correct direction
  const [startX, startY] = lngLatToMercator(start[0], start[1]);
  const [endX, endY] = lngLatToMercator(end[0], end[1]);
  const rotation = Math.atan2(-(endY - startY), endX - startX);

  return {
    position: [lng, lat, 0],
    rotation,
  };
}

// Create a tram vehicle mesh
function createTram(): THREE.Group {
  const group = new THREE.Group();

  // Tram body (elongated box)
  const bodyGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.6);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x8b5cf6, // Purple color matching premetro
    transparent: true,
    opacity: 0.95,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.4;
  group.add(body);

  // Windows (darker sections)
  const windowGeometry = new THREE.BoxGeometry(2.3, 0.5, 0.65);
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0x1e3a5f,
    transparent: true,
    opacity: 0.8,
  });
  const windows = new THREE.Mesh(windowGeometry, windowMaterial);
  windows.position.y = 0.5;
  group.add(windows);

  // Front/rear sections (slightly rounded with small boxes)
  const frontGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.55);
  const frontMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

  const front = new THREE.Mesh(frontGeometry, frontMaterial);
  front.position.set(1.3, 0.4, 0);
  group.add(front);

  const rear = new THREE.Mesh(frontGeometry, frontMaterial);
  rear.position.set(-1.3, 0.4, 0);
  group.add(rear);

  // Yellow accent stripe
  const stripeGeometry = new THREE.BoxGeometry(2.5, 0.08, 0.62);
  const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0xfbbf24 });
  const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
  stripe.position.y = 0.25;
  group.add(stripe);

  // Roof
  const roofGeometry = new THREE.BoxGeometry(2.5, 0.05, 0.65);
  const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x6b7280 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 0.825;
  group.add(roof);

  // Pantograph (current collector)
  const pantographGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.05);
  const pantographMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
  const pantograph = new THREE.Mesh(pantographGeometry, pantographMaterial);
  pantograph.position.y = 1.1;
  group.add(pantograph);

  return group;
}

export interface TramLayerOptions {
  id: string;
  tramCount?: number;
  speed?: number;
  segmentIds?: string[]; // Which premetro segments to animate
}

export interface TramLayerControls {
  setSpeed: (speed: number) => void;
  setVisible: (visible: boolean) => void;
  getSpeed: () => number;
  isVisible: () => boolean;
}

export function createTramLayer(
  map: mapboxgl.Map,
  options: TramLayerOptions
): mapboxgl.CustomLayerInterface & { controls: TramLayerControls } {
  const {
    id,
    tramCount = 2,
    speed: initialSpeed = 0.0003,
    segmentIds,
  } = options;

  // Dynamic state
  let currentSpeed = initialSpeed;
  let isLayerVisible = true;

  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  const trams: THREE.Group[] = [];
  let animationTime = 0;

  // Get coordinates for the route
  const getRouteCoordinates = (): number[][] => {
    if (segmentIds && segmentIds.length > 0) {
      // Combine coordinates from specified segments
      const coords: number[][] = [];
      segmentIds.forEach((segmentId) => {
        const segment = premetroSegments[segmentId];
        if (segment) {
          // Skip first coordinate if it matches the last coordinate of previous segment
          const segmentCoords = segment.coordinates;
          if (
            coords.length > 0 &&
            coords[coords.length - 1][0] === segmentCoords[0][0] &&
            coords[coords.length - 1][1] === segmentCoords[0][1]
          ) {
            coords.push(...segmentCoords.slice(1));
          } else {
            coords.push(...segmentCoords);
          }
        }
      });
      return coords;
    }
    // Default to full premetro tunnel
    return premetroTunnel.geometry.coordinates;
  };

  const coords = getRouteCoordinates();

  // Calculate model transform based on premetro center
  const centerLng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
  const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
  const centerMercator = mapboxgl.MercatorCoordinate.fromLngLat(
    [centerLng, centerLat],
    0
  );

  const modelTransform = {
    translateX: centerMercator.x,
    translateY: centerMercator.y,
    translateZ: 0,
    scale: centerMercator.meterInMercatorCoordinateUnits() * 2,
  };

  const customLayer: mapboxgl.CustomLayerInterface = {
    id,
    type: "custom",
    renderingMode: "3d",

    onAdd(_map: mapboxgl.Map, gl: WebGLRenderingContext) {
      // Setup Three.js scene
      scene = new THREE.Scene();
      camera = new THREE.Camera();

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 2, 1);
      scene.add(directionalLight);

      // Create tram vehicles at different positions along the path
      for (let i = 0; i < tramCount; i++) {
        const tram = createTram();
        trams.push(tram);
        scene.add(tram);
      }

      // Create renderer using the Mapbox canvas context
      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });
      renderer.autoClear = false;
    },

    render(_gl: WebGLRenderingContext, matrix: number[]) {
      // Skip rendering if not visible
      if (!isLayerVisible) {
        return;
      }

      // Update animation
      animationTime += currentSpeed;

      // Update tram positions
      trams.forEach((tram, index) => {
        // Offset each tram along the path
        const t = (animationTime + index / tramCount) % 1;
        const { position, rotation } = interpolatePath(coords, t);

        const [x, y] = lngLatToMercator(position[0], position[1]);

        tram.position.x =
          (x - modelTransform.translateX) / modelTransform.scale;
        tram.position.z =
          (y - modelTransform.translateY) / modelTransform.scale;
        tram.position.y = 0.5; // At ground level

        // Rotate to face direction of travel
        tram.rotation.y = rotation;
      });

      // Setup camera matrix from Mapbox
      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        Math.PI / 2
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX);

      camera.projectionMatrix = m.multiply(l);

      // Render
      renderer.resetState();
      renderer.render(scene, camera);

      // Request another frame
      map.triggerRepaint();
    },
  };

  // Layer controls for dynamic updates
  const controls: TramLayerControls = {
    setSpeed: (speed: number) => {
      currentSpeed = speed;
    },
    setVisible: (visible: boolean) => {
      isLayerVisible = visible;
      map.triggerRepaint();
    },
    getSpeed: () => currentSpeed,
    isVisible: () => isLayerVisible,
  };

  return { ...customLayer, controls };
}
