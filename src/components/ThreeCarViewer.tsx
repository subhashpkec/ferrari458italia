/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Authentic Ferrari 458 Italia 3D Interactive Showroom
 * Featuring:
 * - Genuine Ferrari engineering specifications & part dossiers
 * - Web Audio API Tipo F136 FB 9,000 RPM V8 engine simulator with F1 shift LEDs
 * - Manettino drive mode switch (WET, SPORT, RACE, CT OFF, CST OFF)
 * - Dynamic Headlights & Taillights toggle with real Three.js spotlight projection
 * - 6 Cinematic Camera Director viewpoints
 * - Full Exploded Assembly on double-click & detailed Part Inspector
 */

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Hotspot } from "../types";
import { HOTSPOTS, FERRARI_PARTS_DOSSIER, FerrariPartDetail } from "../data";
import { engineAudio } from "../utils/engineAudio";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Info,
  X,
  Volume2,
  VolumeX,
  Lightbulb,
  Camera,
  Gauge,
  Activity,
  ChevronRight,
  ShieldCheck,
  Disc,
  Sliders,
  Check
} from "lucide-react";

interface PartEntry {
  mesh: THREE.Mesh;
  label: string;
  originalLocalPos: THREE.Vector3;
  explodeDir: THREE.Vector3;
  currentOffset: THREE.Vector3;
  targetOffset: THREE.Vector3;
}

interface ThreeCarViewerProps {
  onHotspotSelect?: (hotspot: Hotspot) => void;
  activeHotspotId?: string | null;
}

type CameraViewMode = "orbit" | "front" | "cockpit" | "engine" | "brakes" | "top";

export default function ThreeCarViewer({ onHotspotSelect, activeHotspotId }: ThreeCarViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<PartEntry[]>([]);
  const paintMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const headlightMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const taillightMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const spotLightsRef = useRef<THREE.SpotLight[]>([]);

  // UI state
  const [paintColor, setPaintColor] = useState("#D40000"); // Rosso Corsa default
  const [isExploded, setIsExploded] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [selectedPartLabel, setSelectedPartLabel] = useState<string | null>(null);
  const [selectedPartScreen, setSelectedPartScreen] = useState({ x: 0, y: 0 });
  const [selectedPartDetail, setSelectedPartDetail] = useState<FerrariPartDetail | null>(null);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [cameraView, setCameraView] = useState<CameraViewMode>("orbit");
  const [showPartsDirectory, setShowPartsDirectory] = useState(false);

  // Engine Audio & Manettino State
  const [engineRunning, setEngineRunning] = useState(false);
  const [engineRPM, setEngineRPM] = useState(1000);
  const [isThrottling, setIsThrottling] = useState(false);
  const [manettinoMode, setManettinoMode] = useState<"WET" | "SPORT" | "RACE" | "CT_OFF" | "CST_OFF">("RACE");

  // Interaction refs
  const pinRef = useRef<HTMLDivElement>(null);
  const isExplodedRef = useRef(false);
  const selectedMeshRef = useRef<THREE.Mesh | null>(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0.12, y: 0.5 });
  const currentRot = useRef({ x: 0.12, y: 0.5 });
  const targetCamPos = useRef(new THREE.Vector3(0, 1.0, 5.0));
  const targetCamLookAt = useRef(new THREE.Vector3(0, 0.3, 0));
  const currentCamLookAt = useRef(new THREE.Vector3(0, 0.3, 0));
  const isRotatingRef = useRef(true);
  const zoomRef = useRef(1.0);
  const baseCamZ = 5.0;

  // Genuine Ferrari 458 Factory Paint Codes
  const colorOptions = [
    { name: "Rosso Corsa", hex: "#D40000", tag: "Iconic Scuderia Red" },
    { name: "Giallo Modena", hex: "#FFD000", tag: "Maranello Yellow" },
    { name: "Nero Daytona", hex: "#111113", tag: "Metallic Black" },
    { name: "Grigio Silverstone", hex: "#5C636E", tag: "Carbon Gray" },
    { name: "Blu Tour de France", hex: "#153A6B", tag: "Racing Blue" },
    { name: "Bianco Avus", hex: "#F0F2F5", tag: "Pure White" },
  ];

  // Part Label & Dossier Resolver - 100% Accurate Ferrari 458 Mesh Matching
  const resolvePartDetail = useCallback((name: string): { label: string; detail: FerrariPartDetail | null } => {
    const lower = name.toLowerCase().trim();
    // 1. Direct exact key match
    if (FERRARI_PARTS_DOSSIER[lower]) {
      return { label: FERRARI_PARTS_DOSSIER[lower].name, detail: FERRARI_PARTS_DOSSIER[lower] };
    }
    // 2. Sort keys descending by length to match longest specific substrings first
    const sortedKeys = Object.keys(FERRARI_PARTS_DOSSIER).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      if (lower.includes(key)) {
        return { label: FERRARI_PARTS_DOSSIER[key].name, detail: FERRARI_PARTS_DOSSIER[key] };
      }
    }
    // Fallback
    const formatted = name.replace(/[_\-\.]+/g, " ").replace(/\d+/g, "").trim();
    return {
      label: formatted ? `Ferrari 458 ${formatted}` : "Ferrari Component",
      detail: FERRARI_PARTS_DOSSIER.body
    };
  }, []);

  // Programmatically Select & Focus Any Part from Directory
  const selectPartByMeshKey = (meshKey: string) => {
    const found = partsRef.current.find((p) => {
      const n = (p.mesh.name || "").toLowerCase();
      return n === meshKey || n.includes(meshKey);
    });
    if (found) {
      selectedMeshRef.current = found.mesh;
      const { label, detail } = resolvePartDetail(found.mesh.name || "");
      setSelectedPartLabel(label);
      setSelectedPartDetail(detail);

      const worldPos = new THREE.Vector3();
      found.mesh.getWorldPosition(worldPos);
      targetCamLookAt.current.copy(worldPos);
      targetCamPos.current.set(worldPos.x + 1.2, worldPos.y + 0.8, worldPos.z + 1.8);
      setIsRotating(false);
      isRotatingRef.current = false;
    }
  };

  // Web Audio Hookup
  useEffect(() => {
    engineAudio.setRpmCallback((rpm) => {
      setEngineRPM(rpm);
    });
  }, []);

  const handleToggleEngine = async () => {
    if (!engineRunning) {
      const ok = await engineAudio.start();
      if (ok) {
        setEngineRunning(true);
        engineAudio.setDriveMode(manettinoMode);
      }
    } else {
      engineAudio.stop();
      setEngineRunning(false);
      setIsThrottling(false);
    }
  };

  const handleManettinoChange = (mode: "WET" | "SPORT" | "RACE" | "CT_OFF" | "CST_OFF") => {
    setManettinoMode(mode);
    engineAudio.setDriveMode(mode);
  };

  const handleThrottleStart = () => {
    if (!engineRunning) {
      handleToggleEngine().then(() => {
        setIsThrottling(true);
        engineAudio.setThrottle(true);
      });
    } else {
      setIsThrottling(true);
      engineAudio.setThrottle(true);
    }
  };

  const handleThrottleEnd = () => {
    setIsThrottling(false);
    engineAudio.setThrottle(false);
  };

  // Sync zoom
  useEffect(() => {
    zoomRef.current = zoomLevel;
    if (cameraRef.current && cameraView === "orbit") {
      targetCamPos.current.set(0, 1.0, baseCamZ / zoomLevel);
    }
  }, [zoomLevel, cameraView]);

  // Sync auto rotate
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  // ── Camera Director Presets ──────────────────────────────────────────────
  const setCameraPreset = (mode: CameraViewMode) => {
    setCameraView(mode);
    setIsRotating(false);
    isRotatingRef.current = false;

    if (!cameraRef.current) return;

    switch (mode) {
      case "front":
        targetRot.current = { x: 0.08, y: 0.35 };
        targetCamPos.current.set(0.8, 0.7, 3.4);
        targetCamLookAt.current.set(0, 0.25, 0.6);
        break;
      case "cockpit":
        targetRot.current = { x: 0.15, y: 0.1 };
        targetCamPos.current.set(-0.35, 0.85, 0.95);
        targetCamLookAt.current.set(-0.25, 0.45, 0.0);
        break;
      case "engine":
        targetRot.current = { x: 0.35, y: 3.14 };
        targetCamPos.current.set(0, 1.6, -3.2);
        targetCamLookAt.current.set(0, 0.35, -0.7);
        break;
      case "brakes":
        targetRot.current = { x: 0.05, y: 1.57 };
        targetCamPos.current.set(2.4, 0.35, 1.2);
        targetCamLookAt.current.set(0.9, 0.1, 0.9);
        break;
      case "top":
        targetRot.current = { x: 0.85, y: 0.0 };
        targetCamPos.current.set(0, 5.0, 0.5);
        targetCamLookAt.current.set(0, 0, 0);
        break;
      case "orbit":
      default:
        targetRot.current = { x: 0.12, y: 0.5 };
        targetCamPos.current.set(0, 1.0, baseCamZ / zoomRef.current);
        targetCamLookAt.current.set(0, 0.3, 0);
        setIsRotating(true);
        isRotatingRef.current = true;
        break;
    }
  };

  // ── Main Three.js Scene Setup ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050508");
    scene.fog = new THREE.FogExp2("#050508", 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 120);
    camera.position.set(0, 1.0, baseCamZ);
    camera.lookAt(0, 0.3, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Environment Lighting Map
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color("#181828");
    scene.environment = pmrem.fromScene(envScene).texture;
    pmrem.dispose();

    // Studio Ground Plane with dynamic reflections
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#07070b",
      roughness: 0.14,
      metalness: 0.88,
      envMapIntensity: 1.4,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.14;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle studio grid
    const grid = new THREE.GridHelper(30, 60, "#d4af3726", "#14141c");
    grid.position.y = -0.138;
    scene.add(grid);

    // Multi-Point Studio Lighting
    scene.add(new THREE.AmbientLight("#222230", 2.2));

    const key = new THREE.DirectionalLight("#fffbf2", 4.8);
    key.position.set(-6, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 30;
    key.shadow.camera.left = -5; key.shadow.camera.right = 5;
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -5;
    key.shadow.bias = -0.001;
    scene.add(key);

    const fill = new THREE.DirectionalLight("#5a8ad0", 2.0);
    fill.position.set(8, 4, -3);
    scene.add(fill);

    const rim = new THREE.SpotLight("#d4af37", 32, 20, Math.PI / 5, 0.4, 1.5);
    rim.position.set(0, 7, -7);
    scene.add(rim);

    const bounce = new THREE.PointLight("#ff7733", 2.0, 7);
    bounce.position.set(0, -0.05, 0);
    scene.add(bounce);

    // Dynamic Headlight Projectors (Cast beams on ground in front of Ferrari)
    const leftHeadlight = new THREE.SpotLight("#f8faff", 45, 16, Math.PI / 6.5, 0.5, 1.2);
    leftHeadlight.position.set(-0.62, 0.42, 1.85);
    leftHeadlight.target.position.set(-0.7, 0, 8.5);
    scene.add(leftHeadlight);
    scene.add(leftHeadlight.target);

    const rightHeadlight = new THREE.SpotLight("#f8faff", 45, 16, Math.PI / 6.5, 0.5, 1.2);
    rightHeadlight.position.set(0.62, 0.42, 1.85);
    rightHeadlight.target.position.set(0.7, 0, 8.5);
    scene.add(rightHeadlight);
    scene.add(rightHeadlight.target);

    spotLightsRef.current = [leftHeadlight, rightHeadlight];

    // Master Car Rotation Group
    const masterGroup = new THREE.Group();
    carGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // ── Load Ferrari 458 Italia GLB ─────────────────────────────────────────
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(draco);

    const parts: PartEntry[] = [];
    partsRef.current = parts;
    paintMatsRef.current = [];
    headlightMatsRef.current = [];
    taillightMatsRef.current = [];

    loader.load("/ferrari.glb", (gltf) => {
      const model = gltf.scene;

      // Center and normalize scale
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = 2.6 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.copy(center.multiplyScalar(-scale));
      model.position.y -= 0.08;

      masterGroup.add(model);

      const modelCenter = new THREE.Vector3(0, 0.3, 0);

      // Upgrade materials and register explodable parts
      model.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.castShadow = true;
        obj.receiveShadow = true;

        const n = (obj.name || "").toLowerCase();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];

        mats.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) return;

          // Paint Body Panels (Ferrari Rosso Corsa Clearcoat)
          if (n.includes("body") || n.includes("hood") || n.includes("door") ||
              n.includes("fender") || n.includes("bumper") || n.includes("roof") ||
              n.includes("panel") || n.includes("shell") || n.includes("bonnet") ||
              n.includes("trunk") || n === "main") {
            mat.color.set(paintColor);
            mat.roughness = 0.07;
            mat.metalness = 0.88;
            mat.envMapIntensity = 2.4;
            paintMatsRef.current.push(mat);
          }
          // Cockpit & Window Glass
          else if (n.includes("glass") || n.includes("windshield") || n.includes("window")) {
            mat.color.set("#0a141f");
            mat.roughness = 0.0;
            mat.metalness = 0.95;
            mat.transparent = true;
            mat.opacity = 0.72;
            mat.envMapIntensity = 3.2;
          }
          // Michelin High-G Rubber Tires
          else if (n.includes("tire") || n.includes("tyre") || n.includes("rubber")) {
            mat.color.set("#111113");
            mat.roughness = 0.88;
            mat.metalness = 0.0;
          }
          // 20" Forged Alloy Star Wheels
          else if (n.includes("rim") || n.includes("wheel") || n.includes("spoke") || n.includes("alloy")) {
            mat.color.set("#d0d0d5");
            mat.roughness = 0.12;
            mat.metalness = 0.96;
            mat.envMapIntensity = 2.8;
          }
          // Headlights & Front LEDs
          else if (n.includes("lights") && !n.includes("red")) {
            mat.color.set("#ffffff");
            mat.emissive.set("#f0f8ff");
            mat.emissiveIntensity = headlightsOn ? 3.0 : 0.2;
            mat.roughness = 0.05;
            mat.metalness = 0.8;
            headlightMatsRef.current.push(mat);
          }
          // LEDs strip
          else if (n.includes("leds")) {
            mat.emissive.set("#a0d8ff");
            mat.emissiveIntensity = headlightsOn ? 4.0 : 0.3;
            headlightMatsRef.current.push(mat);
          }
          // Rear Circular Taillights
          else if (n.includes("lights_red") || n.includes("taillight")) {
            mat.color.set("#aa0000");
            mat.emissive.set("#ff1100");
            mat.emissiveIntensity = headlightsOn ? 4.5 : 0.5;
            mat.roughness = 0.1;
            taillightMatsRef.current.push(mat);
          }
          // Brembo Carbon-Ceramic Calipers
          else if (n.includes("brake") || n.includes("caliper")) {
            mat.color.set("#ffd000"); // Giallo Modena Calipers
            mat.roughness = 0.35;
            mat.metalness = 0.65;
          }
          // Triple Center Exhaust
          else if (n.includes("exhaust") || n.includes("pipe") || n.includes("chrome")) {
            mat.color.set("#cfbda2");
            mat.roughness = 0.15;
            mat.metalness = 0.98;
            mat.envMapIntensity = 3.2;
          }
          // Pre-preg Carbon Fiber Aerodynamics
          else if (n.includes("carbon") || n.includes("diffuser") || n.includes("splitter")) {
            mat.color.set("#0d0d0f");
            mat.roughness = 0.3;
            mat.metalness = 0.4;
          }
          // Poltrona Frau Leather Interior
          else if (n.includes("leather") || n.includes("interior") || n.includes("seat")) {
            mat.color.set("#1a1512");
            mat.roughness = 0.75;
            mat.metalness = 0.05;
          } else {
            mat.roughness = Math.min(mat.roughness, 0.5);
            mat.metalness = Math.max(mat.metalness, 0.3);
            mat.envMapIntensity = 1.3;
          }
        });

        // Store original local position inside the GLTF hierarchy
        const origPos = obj.position.clone();

        // Calculate explode vector from model center
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);

        const dir = worldPos.clone().sub(modelCenter);
        if (dir.length() < 0.01) dir.set(0, 1, 0);
        dir.normalize();
        dir.y += 0.25; // upward lift for clarity
        dir.normalize();

        const { label } = resolvePartDetail(obj.name || "part");

        parts.push({
          mesh: obj,
          label,
          originalLocalPos: origPos,
          explodeDir: dir,
          currentOffset: new THREE.Vector3(0, 0, 0),
          targetOffset: new THREE.Vector3(0, 0, 0),
        });
      });
    });

    // Raycaster for part selection
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const raycast = (e: MouseEvent): THREE.Mesh | null => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(masterGroup.children, true);
      for (const hit of hits) {
        if (hit.object instanceof THREE.Mesh) return hit.object;
      }
      return null;
    };

    // Mouse handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      dragMoved.current = false;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved.current = true;
      targetRot.current.y += dx * 0.006;
      targetRot.current.x += dy * 0.006;
      targetRot.current.x = Math.max(-0.18, Math.min(0.75, targetRot.current.x));
      lastMouse.current = { x: e.clientX, y: e.clientY };
      isRotatingRef.current = false;
      setIsRotating(false);
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current = Math.max(0.5, Math.min(3.0, zoomRef.current - e.deltaY * 0.001));
      setZoomLevel(zoomRef.current);
      if (cameraView === "orbit") {
        targetCamPos.current.set(0, 1.0, baseCamZ / zoomRef.current);
      }
    };

    // Double Click: Toggle Explode ALL Parts
    const onDblClick = () => {
      if (dragMoved.current) return;
      isExplodedRef.current = !isExplodedRef.current;
      setIsExploded(isExplodedRef.current);
      setSelectedPartLabel(null);
      setSelectedPartDetail(null);
      selectedMeshRef.current = null;
      if (pinRef.current) pinRef.current.style.display = "none";

      const magnitude = 1.85;
      parts.forEach((p) => {
        if (isExplodedRef.current) {
          p.targetOffset.copy(p.explodeDir).multiplyScalar(magnitude);
        } else {
          p.targetOffset.set(0, 0, 0);
        }
      });
    };

    // Single Click: Select Part & Show Ferrari Engineering Dossier
    const onClick = (e: MouseEvent) => {
      if (dragMoved.current) return;

      const hit = raycast(e);
      if (!hit) {
        setSelectedPartLabel(null);
        setSelectedPartDetail(null);
        selectedMeshRef.current = null;
        if (pinRef.current) pinRef.current.style.display = "none";
        return;
      }

      const entry = parts.find((p) => p.mesh === hit);
      if (entry) {
        selectedMeshRef.current = hit;
        const { label, detail } = resolvePartDetail(hit.name || "");
        setSelectedPartLabel(label);
        setSelectedPartDetail(detail);

        // Calculate screen projection immediately
        const worldPos = new THREE.Vector3();
        hit.getWorldPosition(worldPos);
        const projected = worldPos.clone().project(camera);
        const rect = renderer.domElement.getBoundingClientRect();
        if (pinRef.current) {
          pinRef.current.style.display = "flex";
          const screenX = ((projected.x + 1) / 2) * rect.width;
          const screenY = ((-projected.y + 1) / 2) * rect.height;
          pinRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
        }
      }
    };

    // Touch handlers
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging.current = true;
      dragMoved.current = false;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved.current = true;
      targetRot.current.y += dx * 0.007;
      targetRot.current.x += dy * 0.007;
      targetRot.current.x = Math.max(-0.18, Math.min(0.75, targetRot.current.x));
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isRotatingRef.current = false;
      setIsRotating(false);
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("dblclick", onDblClick);
    container.addEventListener("click", onClick);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    // Resize Observer
    const resizeObs = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObs.observe(container);

    // ── Animation Loop ────────────────────────────────────────────────────────
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto rotation
      if (isRotatingRef.current) {
        targetRot.current.y += 0.0025;
      }
      currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.08;
      currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.08;

      if (carGroupRef.current) {
        carGroupRef.current.rotation.y = currentRot.current.y;
        carGroupRef.current.rotation.x = currentRot.current.x;
      }

      // Smooth camera interpolation
      camera.position.lerp(targetCamPos.current, 0.08);
      currentCamLookAt.current.lerp(targetCamLookAt.current, 0.08);
      camera.lookAt(currentCamLookAt.current);

      // Smoothly animate exploded parts
      parts.forEach((p) => {
        p.currentOffset.lerp(p.targetOffset, 0.07);
        p.mesh.position.set(
          p.originalLocalPos.x + p.currentOffset.x,
          p.originalLocalPos.y + p.currentOffset.y,
          p.originalLocalPos.z + p.currentOffset.z
        );
      });

      // Update 3D screen position of floating pin whenever a part is selected (assembled OR exploded)
      if (pinRef.current && selectedMeshRef.current) {
        const wp = new THREE.Vector3();
        selectedMeshRef.current.getWorldPosition(wp);
        const proj = wp.clone().project(camera);
        const rect = renderer.domElement.getBoundingClientRect();
        if (proj.z < 1) {
          const screenX = ((proj.x + 1) / 2) * rect.width;
          const screenY = ((-proj.y + 1) / 2) * rect.height;
          pinRef.current.style.display = "flex";
          pinRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
        } else {
          pinRef.current.style.display = "none";
        }
      } else if (pinRef.current) {
        pinRef.current.style.display = "none";
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("dblclick", onDblClick);
      container.removeEventListener("click", onClick);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((o: THREE.Object3D) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry?.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat: THREE.Material) => mat?.dispose());
      });
      renderer.dispose();
      draco.dispose();
    };
  }, [resolvePartDetail]); // eslint-disable-line react-hooks/exhaustive-deps

  // Paint color updates
  useEffect(() => {
    paintMatsRef.current.forEach((m) => m.color.set(paintColor));
  }, [paintColor]);

  // Headlights toggle effect
  useEffect(() => {
    headlightMatsRef.current.forEach((m) => {
      m.emissiveIntensity = headlightsOn ? 3.8 : 0.15;
    });
    taillightMatsRef.current.forEach((m) => {
      m.emissiveIntensity = headlightsOn ? 4.5 : 0.4;
    });
    spotLightsRef.current.forEach((s) => {
      s.intensity = headlightsOn ? 45 : 0;
    });
  }, [headlightsOn]);

  // Hotspot external selection sync
  useEffect(() => {
    if (!activeHotspotId) return;
    const found = HOTSPOTS.find((h) => h.id === activeHotspotId);
    if (found) {
      if (activeHotspotId === "engine") setCameraPreset("engine");
      else if (activeHotspotId === "brakes") setCameraPreset("brakes");
      else if (activeHotspotId === "cockpit") setCameraPreset("cockpit");
      else if (activeHotspotId === "aero") setCameraPreset("front");
    }
  }, [activeHotspotId]);

  const toggleExplode = () => {
    isExplodedRef.current = !isExplodedRef.current;
    setIsExploded(isExplodedRef.current);
    setSelectedPartLabel(null);
    setSelectedPartDetail(null);
    selectedMeshRef.current = null;
    const mag = 1.85;
    partsRef.current.forEach((p) => {
      if (isExplodedRef.current) {
        p.targetOffset.copy(p.explodeDir).multiplyScalar(mag);
      } else {
        p.targetOffset.set(0, 0, 0);
      }
    });
  };

  const focusSelectedPart = () => {
    if (!selectedMeshRef.current || !cameraRef.current) return;
    const worldPos = new THREE.Vector3();
    selectedMeshRef.current.getWorldPosition(worldPos);

    targetCamLookAt.current.copy(worldPos);
    targetCamPos.current.set(worldPos.x + 1.2, worldPos.y + 0.8, worldPos.z + 1.8);
    setIsRotating(false);
    isRotatingRef.current = false;
  };

  // Shift LED lights calculation based on RPM (Ferrari F1 5-LED system)
  // LED 1: 5,500 RPM (Green)
  // LED 2: 6,500 RPM (Green)
  // LED 3: 7,500 RPM (Red)
  // LED 4: 8,300 RPM (Red)
  // LED 5: 8,900 RPM (Blue flashing @ 9,000 RPM redline)
  const shiftLeds = [
    { rpm: 5500, color: "bg-emerald-500", glow: "shadow-[0_0_10px_#10b981]" },
    { rpm: 6500, color: "bg-emerald-400", glow: "shadow-[0_0_10px_#34d399]" },
    { rpm: 7500, color: "bg-rose-500", glow: "shadow-[0_0_12px_#f43f5e]" },
    { rpm: 8300, color: "bg-rose-600", glow: "shadow-[0_0_14px_#e11d48]" },
    { rpm: 8850, color: "bg-sky-400 animate-ping", glow: "shadow-[0_0_16px_#38bdf8]" },
  ];

  return (
    <div
      className="relative w-full h-[760px] lg:h-[840px] border border-zinc-900 bg-black overflow-hidden select-none rounded-2xl shadow-2xl flex flex-col"
      style={{ boxShadow: "0 0 100px rgba(212,0,0,0.12), 0 0 2px rgba(212,175,55,0.3)" }}
    >
      {/* ── WebGL Canvas ── */}
      <div
        ref={containerRef}
        className="w-full flex-grow cursor-grab active:cursor-grabbing relative"
        id="webgl-container"
      >
        {/* Floating Part Label with Connector (Works in BOTH Assembled & Exploded states) */}
        {selectedPartLabel && selectedPartScreen.x > 0 && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 transition-opacity duration-200"
            style={{ left: selectedPartScreen.x, top: selectedPartScreen.y - 54 }}
          >
            <div className="w-px h-6 bg-gradient-to-b from-gold to-transparent mx-auto" />
            <div
              className="w-2.5 h-2.5 rounded-full mx-auto mb-1.5"
              style={{ background: "#ffd000", boxShadow: "0 0 12px #ffd000, 0 0 24px rgba(255,208,0,0.6)" }}
            />
            <div
              className="px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wide whitespace-nowrap text-center"
              style={{
                background: "linear-gradient(135deg, rgba(14,10,6,0.96) 0%, rgba(26,18,8,0.96) 100%)",
                border: "1px solid rgba(255,208,0,0.7)",
                color: "#ffd000",
                boxShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 20px rgba(255,208,0,0.3)",
                backdropFilter: "blur(14px)",
              }}
            >
              {selectedPartLabel}
            </div>
          </div>
        )}
      </div>

      {/* ── Top Left: Genuine Ferrari 458 Italia Diagnostics HUD ── */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none max-w-[270px]">
        <div
          className="p-4 rounded-xl flex flex-col gap-2.5"
          style={{
            background: "linear-gradient(135deg, rgba(8,8,12,0.94) 0%, rgba(18,12,12,0.94) 100%)",
            border: "1px solid rgba(212,0,0,0.3)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
          }}
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-display font-black text-xs text-white uppercase tracking-wider">
                Ferrari 458 Italia
              </span>
            </div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase">MARANELLO</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
            <div>
              <span className="text-zinc-500 block text-[9px] font-mono">POWERTRAIN</span>
              <span className="font-mono text-white font-bold">4.5L Flat-Plane V8</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px] font-mono">POWER OUTPUT</span>
              <span className="font-mono text-red-400 font-bold">570 CV @ 9k RPM</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px] font-mono">0-100 KM/H</span>
              <span className="font-mono text-gold font-bold">3.4 Seconds</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px] font-mono">TOP SPEED</span>
              <span className="font-mono text-emerald-400 font-bold">325 km/h</span>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-2 flex items-center justify-between text-[10px]">
            <span className="text-zinc-500 font-mono">ASSEMBLY STATE</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[9px] ${
              isExploded 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
              {isExploded ? "EXPLODED // CLICK PART" : "FACTORY ASSEMBLED"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Top Right: Camera Director & Interactive Lights Toolbar ── */}
      <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 items-end">
        {/* Camera Views Bar */}
        <div
          className="flex items-center gap-1 p-1.5 rounded-xl border border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md shadow-xl"
        >
          <span className="font-mono text-[9px] text-zinc-500 px-2 flex items-center gap-1">
            <Camera className="w-3 h-3 text-gold" /> VIEW:
          </span>
          {[
            { id: "orbit", label: "Orbit" },
            { id: "front", label: "Aero" },
            { id: "cockpit", label: "F1 Cockpit" },
            { id: "engine", label: "V8 Bay" },
            { id: "brakes", label: "Brembo" },
            { id: "top", label: "Top" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setCameraPreset(v.id as CameraViewMode)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                cameraView === v.id
                  ? "bg-red-700 text-white font-bold shadow-md shadow-red-900/40"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Headlight & Taillight Toggle */}
        <button
          onClick={() => setHeadlightsOn(!headlightsOn)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[11px] font-mono font-bold tracking-wide transition-all shadow-lg cursor-pointer ${
            headlightsOn
              ? "bg-zinc-900 text-gold border-gold/40 shadow-gold/20"
              : "bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300"
          }`}
        >
          <Lightbulb className={`w-3.5 h-3.5 ${headlightsOn ? "text-gold animate-pulse" : "text-zinc-600"}`} />
          <span>HEADLIGHTS & BEAMS: {headlightsOn ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* ── Interactive Part Engineering Dossier Card (Appears when a part is selected) ── */}
      {selectedPartDetail && (
        <div
          className="absolute top-24 left-5 z-20 w-[320px] p-4 rounded-xl border border-gold/30 bg-zinc-950/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-left-4 duration-200"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.9), 0 0 25px rgba(212,175,55,0.15)" }}
        >
          <div className="flex items-start justify-between border-b border-zinc-800 pb-2.5 mb-3">
            <div>
              <span className="font-mono text-[9px] text-gold uppercase tracking-widest block">
                {selectedPartDetail.category} // {selectedPartDetail.code}
              </span>
              <h4 className="font-display font-black text-sm text-white uppercase leading-snug">
                {selectedPartDetail.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedPartDetail(null)}
              className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-[11px] mb-3">
            <div>
              <span className="text-zinc-500 text-[10px] block font-mono">SPECIFICATION</span>
              <span className="text-zinc-200 font-semibold">{selectedPartDetail.specs}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block font-mono">MATERIAL</span>
              <span className="text-zinc-300">{selectedPartDetail.material}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block font-mono">COMPONENT WEIGHT</span>
              <span className="text-amber-300 font-mono font-bold">{selectedPartDetail.weight}</span>
            </div>
            <div className="bg-zinc-900/70 p-2.5 rounded-lg border border-zinc-800/60 mt-1">
              <span className="text-[10px] text-gold font-mono uppercase block mb-1">ENGINEERING NOTES</span>
              <p className="text-[10.5px] text-zinc-400 leading-relaxed font-light">
                {selectedPartDetail.engineeringNotes}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={focusSelectedPart}
              className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-gold hover:text-black text-zinc-200 font-mono text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 border border-zinc-800 hover:border-gold cursor-pointer"
            >
              <Camera className="w-3 h-3" /> Focus Part
            </button>
          </div>
        </div>
      )}

      {/* ── 3D Floating Part Marker Pin & Holographic Tag (Projected directly over mesh) ── */}
      <div
        ref={pinRef}
        className="pointer-events-none absolute top-0 left-0 z-30 flex items-center gap-2.5 transition-opacity duration-150"
        style={{ display: "none" }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-red-600/40 animate-ping absolute" />
          <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-[0_0_14px_#ef4444]" />
        </div>
        <div className="bg-black/95 border border-gold/70 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-2xl text-left pointer-events-auto flex items-center gap-2.5">
          <div>
            <span className="font-mono text-[8.5px] text-gold uppercase tracking-wider block font-bold leading-tight">
              FERRARI COMPONENT // MARKED
            </span>
            <span className="font-display font-black text-xs text-white uppercase whitespace-nowrap">
              {selectedPartLabel || selectedPartDetail?.name || "Selected Part"}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedPartLabel(null);
              setSelectedPartDetail(null);
              selectedMeshRef.current = null;
              if (pinRef.current) pinRef.current.style.display = "none";
            }}
            className="text-zinc-500 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            title="Dismiss Marker"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Center-Bottom: Interactive Tipo F136 FB V8 Engine Console & Manettino ── */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-auto">
        <div
          className="p-3.5 rounded-2xl flex flex-col gap-2.5"
          style={{
            background: "linear-gradient(180deg, rgba(16,14,14,0.96) 0%, rgba(8,8,10,0.98) 100%)",
            border: "1px solid rgba(212,0,0,0.35)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.85), 0 0 30px rgba(212,0,0,0.15)",
          }}
        >
          {/* Top Row: F1 Steering Wheel Shift LEDs & Manettino Modes */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            {/* F1 LED Shift Lights */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase mr-1">F1 SHIFT LEDs</span>
              {shiftLeds.map((led, idx) => {
                const active = engineRunning && engineRPM >= led.rpm;
                return (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-75 ${
                      active ? `${led.color} ${led.glow}` : "bg-zinc-800 border border-zinc-700/50 opacity-40"
                    }`}
                  />
                );
              })}
            </div>

            {/* Manettino Dial Selector */}
            <div className="flex items-center gap-1">
              <span className="font-mono text-[9px] text-zinc-500 uppercase mr-1">MANETTINO</span>
              {(["WET", "SPORT", "RACE", "CT_OFF", "CST_OFF"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleManettinoChange(mode)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                    manettinoMode === mode
                      ? mode === "RACE" || mode === "CT_OFF" || mode === "CST_OFF"
                        ? "bg-red-600 text-white shadow-md shadow-red-600/40"
                        : "bg-gold text-black shadow-md shadow-gold/30"
                      : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {mode.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Start Engine Button, Live Tachometer & Hold-to-Rev Pedal */}
          <div className="flex items-center justify-between gap-4">
            {/* Ferrari Red Engine Start/Stop Button */}
            <button
              onClick={handleToggleEngine}
              className={`px-4 py-2.5 rounded-xl font-display font-black text-xs tracking-wider uppercase transition-all flex items-center gap-2 border cursor-pointer select-none ${
                engineRunning
                  ? "bg-red-600 text-white border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse"
                  : "bg-gradient-to-r from-red-900 to-red-950 text-red-200 border-red-800 hover:border-red-600 shadow-md"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{engineRunning ? "STOP ENGINE" : "START V8"}</span>
            </button>

            {/* Live Tachometer & RPM Display */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-zinc-400">4.5L V8 FLAT-PLANE TACHO</span>
                <span className={`font-bold font-mono ${engineRPM >= 8500 ? "text-red-400 animate-pulse" : "text-gold"}`}>
                  {engineRunning ? `${engineRPM.toLocaleString()} RPM` : "0 RPM (OFF)"}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full transition-all duration-75 ${
                    engineRPM >= 8500
                      ? "bg-gradient-to-r from-gold via-red-500 to-rose-600"
                      : "bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, (engineRPM / 9000) * 100))}%` }}
                />
              </div>
            </div>

            {/* Hold to Rev Accelerator */}
            <button
              onMouseDown={handleThrottleStart}
              onMouseUp={handleThrottleEnd}
              onMouseLeave={handleThrottleEnd}
              onTouchStart={handleThrottleStart}
              onTouchEnd={handleThrottleEnd}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-black tracking-widest uppercase transition-all flex items-center gap-2 border select-none cursor-pointer ${
                isThrottling
                  ? "bg-gold text-black border-yellow-300 shadow-[0_0_24px_rgba(255,208,0,0.8)] scale-95"
                  : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-gold hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>REV TO 9K</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Dock: Factory Atelier Paints & Explode / Reset Controls ── */}
      <div className="relative z-20 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Ferrari Factory Paint Palette */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold hidden sm:inline">
            Atelier Paint:
          </span>
          <div className="flex items-center gap-2">
            {colorOptions.map((c) => (
              <button
                key={c.name}
                onClick={() => setPaintColor(c.hex)}
                title={`${c.name} - ${c.tag}`}
                className={`relative w-7 h-7 rounded-full transition-all cursor-pointer ${
                  paintColor === c.hex ? "scale-125 ring-2 ring-gold ring-offset-2 ring-offset-black" : "hover:scale-110 opacity-80"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-zinc-400 font-semibold ml-1 hidden md:inline">
            {colorOptions.find((c) => c.hex === paintColor)?.name}
          </span>
        </div>

        {/* View & Assembly Control Buttons */}
        <div className="flex items-center gap-2">
          {/* Parts Directory Toggle Button */}
          <button
            onClick={() => setShowPartsDirectory(!showPartsDirectory)}
            className={`px-3.5 py-2 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer border ${
              showPartsDirectory
                ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40"
                : "bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border-zinc-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-yellow-400" />
            <span>PARTS DIRECTORY</span>
          </button>

          {/* Explode / Assemble Toggle */}
          <button
            onClick={toggleExplode}
            className={`px-4 py-2 rounded-xl font-mono text-[11px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isExploded
                ? "bg-amber-500 text-black shadow-amber-500/20"
                : "bg-zinc-900 text-zinc-200 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? "ASSEMBLE CAR" : "EXPLODE ALL PARTS"}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={() => setCameraPreset("orbit")}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Slide-Over Ferrari 458 Parts Directory Drawer ── */}
      {showPartsDirectory && (
        <div 
          className="absolute top-0 right-0 h-full w-[340px] max-w-[90vw] bg-black/95 border-l border-zinc-800/80 p-5 z-40 backdrop-blur-2xl flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
          style={{ boxShadow: "-10px 0 40px rgba(0,0,0,0.9)" }}
        >
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="font-mono text-[9px] text-red-500 uppercase tracking-widest block font-bold">
                  MARANELLO CATALOG
                </span>
                <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                  Ferrari 458 Components
                </h3>
              </div>
              <button
                onClick={() => setShowPartsDirectory(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
              Click any component to locate and focus it on the 3D Ferrari with its official engineering dossier.
            </p>

            {/* Categorized Parts List */}
            <div className="flex flex-col gap-4">
              
              {/* Powertrain */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold">
                  POWERTRAIN & EXHAUST
                </span>
                {[
                  { key: "metal", label: "Tipo F136 FB 4.5L V8 Engine" },
                  { key: "chrome", label: "Triple Center Inconel Exhaust" },
                  { key: "plastic_gray", label: "Underbody Venturi Tunnels" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectPartByMeshKey(item.key)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-red-600/60 text-left text-xs text-zinc-200 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span className="font-semibold text-[11px] group-hover:text-white">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {/* Wheels & Brakes */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold">
                  WHEELS & BREMBO CCM BRAKES
                </span>
                {[
                  { key: "brake", label: "Brembo Carbon-Ceramic Caliper" },
                  { key: "rim_fl", label: "Front Left 20\" Forged Star Rim" },
                  { key: "rim_fr", label: "Front Right 20\" Forged Star Rim" },
                  { key: "rim_rl", label: "Rear Left 20\" Forged Star Rim" },
                  { key: "rim_rr", label: "Rear Right 20\" Forged Star Rim" },
                  { key: "tire", label: "Michelin Pilot Sport Cup 2 Tires" },
                  { key: "centre", label: "Yellow Cavallino Center Caps" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectPartByMeshKey(item.key)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-red-600/60 text-left text-xs text-zinc-200 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span className="font-semibold text-[11px] group-hover:text-white">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {/* Body & Aerodynamics */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold">
                  AERODYNAMICS & BODYWORK
                </span>
                {[
                  { key: "body", label: "Alcoa Aluminum Body Shell" },
                  { key: "carbon_fibre_trim", label: "Aeroelastic Front Whiskers" },
                  { key: "carbon fibre", label: "Carbon Fiber Rear Diffuser" },
                  { key: "glass", label: "Glass Cockpit & Engine Cover" },
                  { key: "grills", label: "Front Radiator Air Intakes" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectPartByMeshKey(item.key)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-red-600/60 text-left text-xs text-zinc-200 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span className="font-semibold text-[11px] group-hover:text-white">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {/* Lighting & Cockpit */}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[9px] text-gold uppercase tracking-wider font-bold">
                  COCKPIT & LIGHTING
                </span>
                {[
                  { key: "steering_wheel", label: "F1 Steering Wheel & Shift LEDs" },
                  { key: "lights", label: "Bi-Xenon Headlights" },
                  { key: "lights_red", label: "Circular Ferrari LED Taillights" },
                  { key: "leather", label: "Poltrona Frau Leather Seats" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => selectPartByMeshKey(item.key)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-red-600/60 text-left text-xs text-zinc-200 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span className="font-semibold text-[11px] group-hover:text-white">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
            <span>TIP: DOUBLE CLICK CAR TO EXPLODE</span>
            <span className="text-red-500 font-bold">360° INTERACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}
