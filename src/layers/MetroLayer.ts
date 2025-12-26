import * as THREE from "three";
import mapboxgl from "mapbox-gl";
import {
  metroASegments,
  metroBSegments,
  metroCSegments,
} from "../data/transitNetwork";

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

// Create a single metro car
function createMetroCar(color: number): THREE.Group {
  const group = new THREE.Group();

  // Car body (elongated box)
  const bodyGeometry = new THREE.BoxGeometry(3.5, 1, 0.7);
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
    opacity: 0.95,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  group.add(body);

  // Windows (darker sections)
  const windowGeometry = new THREE.BoxGeometry(3.3, 0.6, 0.75);
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0x1e3a5f,
    transparent: true,
    opacity: 0.8,
  });
  const windows = new THREE.Mesh(windowGeometry, windowMaterial);
  windows.position.y = 0.6;
  group.add(windows);

  // Front/rear sections (cab)
  const cabGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.65);
  const cabMaterial = new THREE.MeshPhongMaterial({ color: 0x1f2937 });

  const front = new THREE.Mesh(cabGeometry, cabMaterial);
  front.position.set(1.85, 0.5, 0);
  group.add(front);

  const rear = new THREE.Mesh(cabGeometry, cabMaterial);
  rear.position.set(-1.85, 0.5, 0);
  group.add(rear);

  // White stripe accent
  const stripeGeometry = new THREE.BoxGeometry(3.5, 0.1, 0.72);
  const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
  stripe.position.y = 0.3;
  group.add(stripe);

  // Roof
  const roofGeometry = new THREE.BoxGeometry(3.5, 0.08, 0.75);
  const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x6b7280 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 1.04;
  group.add(roof);

  // Headlights
  const headlightGeometry = new THREE.CircleGeometry(0.08, 8);
  const headlightMaterial = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.5,
  });

  const headlightLeft = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlightLeft.position.set(1.96, 0.35, 0.2);
  headlightLeft.rotation.y = Math.PI / 2;
  group.add(headlightLeft);

  const headlightRight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlightRight.position.set(1.96, 0.35, -0.2);
  headlightRight.rotation.y = Math.PI / 2;
  group.add(headlightRight);

  return group;
}

// Create a full metro train (multiple cars)
function createMetroTrain(color: number, carCount: number = 3): THREE.Group {
  const train = new THREE.Group();

  for (let i = 0; i < carCount; i++) {
    const car = createMetroCar(color);
    // Position cars along the train length with small gap
    car.position.x = (i - (carCount - 1) / 2) * 3.7;
    train.add(car);
  }

  return train;
}

export interface MetroLayerOptions {
  id: string;
  line: "A" | "B" | "C";
  trainCount?: number;
  carCount?: number;
  speed?: number;
  segmentIds?: string[]; // Which segments to animate
}

export interface MetroLayerControls {
  setSpeed: (speed: number) => void;
  setVisible: (visible: boolean) => void;
  getSpeed: () => number;
  isVisible: () => boolean;
}

export function createMetroLayer(
  map: mapboxgl.Map,
  options: MetroLayerOptions
): mapboxgl.CustomLayerInterface & { controls: MetroLayerControls } {
  const {
    id,
    line,
    trainCount = 2,
    carCount = 3,
    speed: initialSpeed = 0.0002,
    segmentIds,
  } = options;

  // Dynamic state
  let currentSpeed = initialSpeed;
  let isLayerVisible = true;

  // Color based on line
  const lineColors = {
    A: 0x2563eb, // Blue
    B: 0xdc2626, // Red
    C: 0x16a34a, // Green
  };
  const color = lineColors[line];

  // Get segment definitions
  const allSegments = {
    A: metroASegments,
    B: metroBSegments,
    C: metroCSegments,
  };
  const segments = allSegments[line];

  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  const trains: THREE.Group[] = [];
  let animationTime = 0;

  // Get coordinates for the route
  const getRouteCoordinates = (): number[][] => {
    if (segmentIds && segmentIds.length > 0) {
      // Combine coordinates from specified segments
      const coords: number[][] = [];
      segmentIds.forEach((segmentId) => {
        const segment = segments[segmentId];
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

    // Default to all segments for this line
    const coords: number[][] = [];
    Object.values(segments).forEach((segment, index) => {
      if (index === 0) {
        coords.push(...segment.coordinates);
      } else {
        // Skip first coordinate if it matches the last
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
  };

  const coords = getRouteCoordinates();

  if (coords.length === 0) {
    // Return dummy layer if no coordinates
    const dummyControls: MetroLayerControls = {
      setSpeed: () => {},
      setVisible: () => {},
      getSpeed: () => 0,
      isVisible: () => false,
    };
    return {
      id,
      type: "custom",
      renderingMode: "3d",
      onAdd() {},
      render() {},
      controls: dummyControls,
    };
  }

  // Calculate model transform based on route center
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

      // Create metro trains at different positions along the path
      for (let i = 0; i < trainCount; i++) {
        const train = createMetroTrain(color, carCount);
        trains.push(train);
        scene.add(train);
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

      // Update train positions
      trains.forEach((train, index) => {
        // Offset each train along the path
        const t = (animationTime + index / trainCount) % 1;
        const { position, rotation } = interpolatePath(coords, t);

        const [x, y] = lngLatToMercator(position[0], position[1]);

        train.position.x =
          (x - modelTransform.translateX) / modelTransform.scale;
        train.position.z =
          (y - modelTransform.translateY) / modelTransform.scale;
        train.position.y = 0.5; // At ground level

        // Rotate to face direction of travel
        train.rotation.y = rotation;
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
  const controls: MetroLayerControls = {
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
