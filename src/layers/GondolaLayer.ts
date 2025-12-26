import * as THREE from "three";
import mapboxgl from "mapbox-gl";

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

// Create a simple gondola cabin mesh
function createGondolaCabin(): THREE.Group {
  const group = new THREE.Group();

  // Cabin body (box)
  const cabinGeometry = new THREE.BoxGeometry(1, 0.8, 0.6);
  const cabinMaterial = new THREE.MeshPhongMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.9,
  });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.y = -0.2;
  group.add(cabin);

  // Windows (darker inset)
  const windowGeometry = new THREE.BoxGeometry(0.9, 0.5, 0.65);
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0x1e3a5f,
    transparent: true,
    opacity: 0.7,
  });
  const windows = new THREE.Mesh(windowGeometry, windowMaterial);
  windows.position.y = -0.1;
  group.add(windows);

  // Roof connector
  const connectorGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
  const connectorMaterial = new THREE.MeshPhongMaterial({ color: 0x374151 });
  const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
  connector.position.y = 0.35;
  group.add(connector);

  // Top attachment
  const topGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const top = new THREE.Mesh(topGeometry, connectorMaterial);
  top.position.y = 0.5;
  group.add(top);

  return group;
}

// Create pylons along the gondola route
function createPylons(
  coordinates: number[][],
  modelTransform: {
    translateX: number;
    translateY: number;
    scale: number;
  }
): THREE.Group {
  const pylonsGroup = new THREE.Group();
  const pylonMaterial = new THREE.MeshPhongMaterial({ color: 0x6b7280 });

  // Place pylons at each station
  coordinates.forEach((coord) => {
    const [x, y] = lngLatToMercator(coord[0], coord[1]);

    // Main pylon column
    const pylonGeometry = new THREE.CylinderGeometry(0.15, 0.2, 4, 8);
    const pylon = new THREE.Mesh(pylonGeometry, pylonMaterial);

    // Position in world coordinates
    pylon.position.x = (x - modelTransform.translateX) / modelTransform.scale;
    pylon.position.z = (y - modelTransform.translateY) / modelTransform.scale;
    pylon.position.y = 2;

    // Cross arm at top
    const armGeometry = new THREE.BoxGeometry(2, 0.15, 0.15);
    const arm = new THREE.Mesh(armGeometry, pylonMaterial);
    arm.position.y = 2;

    pylon.add(arm);
    pylonsGroup.add(pylon);
  });

  return pylonsGroup;
}

// Create the cable line
function createCable(
  coordinates: number[][],
  modelTransform: {
    translateX: number;
    translateY: number;
    scale: number;
  }
): THREE.Line {
  const points: THREE.Vector3[] = coordinates.map((coord) => {
    const [x, y] = lngLatToMercator(coord[0], coord[1]);
    return new THREE.Vector3(
      (x - modelTransform.translateX) / modelTransform.scale,
      4.1, // Height above ground
      (y - modelTransform.translateY) / modelTransform.scale
    );
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: 0x374151,
    linewidth: 2,
  });

  return new THREE.Line(geometry, material);
}

export interface GondolaLayerOptions {
  id: string;
  line: {
    geometry: {
      coordinates: number[][];
    };
  };
  cabinCount?: number;
  speed?: number;
}

export interface GondolaLayerControls {
  setSpeed: (speed: number) => void;
  setVisible: (visible: boolean) => void;
  getSpeed: () => number;
  isVisible: () => boolean;
}

export function createGondolaLayer(
  map: mapboxgl.Map,
  options: GondolaLayerOptions
): mapboxgl.CustomLayerInterface & { controls: GondolaLayerControls } {
  const { id, line, cabinCount = 3, speed: initialSpeed = 0.00015 } = options;

  // Dynamic state
  let currentSpeed = initialSpeed;
  let isLayerVisible = true;

  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  const cabins: THREE.Group[] = [];
  let animationTime = 0;

  // Calculate model transform based on gondola line center
  const coords = line.geometry.coordinates;
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

      // Create pylons
      const pylons = createPylons(coords, modelTransform);
      scene.add(pylons);

      // Create cable
      const cable = createCable(coords, modelTransform);
      scene.add(cable);

      // Create gondola cabins at different positions along the path
      for (let i = 0; i < cabinCount; i++) {
        const cabin = createGondolaCabin();
        cabins.push(cabin);
        scene.add(cabin);
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

      // Update cabin positions
      cabins.forEach((cabin, index) => {
        // Offset each cabin along the path
        const t = (animationTime + index / cabinCount) % 1;
        const { position, rotation } = interpolatePath(coords, t);

        const [x, y] = lngLatToMercator(position[0], position[1]);

        cabin.position.x =
          (x - modelTransform.translateX) / modelTransform.scale;
        cabin.position.z =
          (y - modelTransform.translateY) / modelTransform.scale;
        cabin.position.y = 3.8; // Hang below cable

        // Rotate to face direction of travel
        cabin.rotation.y = rotation;

        // Gentle swinging motion
        cabin.rotation.z = Math.sin(animationTime * 10 + index) * 0.02;
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
  const controls: GondolaLayerControls = {
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
