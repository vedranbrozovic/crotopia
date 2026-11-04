import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  createVukovarWaterTower, 
  createVucedolDove, 
  createKopackiRit, 
  createDjakovoStables,
  createStMarksChurch, 
  createTrakoscanCastle, 
  createLicitarWorkshop,
  createPlitviceTerraces, 
  createTeslaCoil, 
  createVelebitPeaks,
  createPulaArena, 
  createSeaOrgan, 
  createSuhozidKazun, 
  createDubrovnikWalls,
  createExplorerUnit,
  createFogCloud,
  createBiomeTree
} from './proceduralModels';
import { TileData, LandmarkData } from './types';
import { GRID_WIDTH, GRID_HEIGHT, getTileKey } from './mapData';
import { sound } from './audio';

export interface WorldSceneCallbacks {
  onTileSelect: (tile: TileData, landmark?: LandmarkData) => void;
  onTileHover?: (tile: TileData | null) => void;
  onMoveComplete?: (x: number, z: number) => void;
}

export class WorldScene {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private isSoftwareGl: boolean = false;

  private frameId: number = 0;
  private lastTime: number = performance.now();

  // Grid objects
  private tileMeshes = new Map<string, THREE.Mesh>();
  private landmarkMeshes = new Map<string, THREE.Group>();
  private cloudMeshes = new Map<string, THREE.Group>();
  private tileDataMap = new Map<string, TileData>();

  // Springs & Interactive Bounce
  private springNodes: Array<{
    object: THREE.Object3D;
    scaleY: number;
    velY: number;
    targetScaleY: number;
  }> = [];

  // Particles
  private dustParticles: Array<{
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];

  // Player Unit
  private playerGroup!: THREE.Group;
  private playerX: number = 10;
  private playerZ: number = 4;
  private isMounted: boolean = false;
  private isHopping: boolean = false;
  private hopProgress: number = 0;
  private hopStartPos = new THREE.Vector3();
  private hopEndPos = new THREE.Vector3();
  private hopDuration: number = 0.32;

  // Camera Pan & Zoom with inertia
  private cameraTarget = new THREE.Vector3(10, 0, 4);
  private cameraCurrent = new THREE.Vector3(10, 0, 4);
  private zoomLevel: number = 15;
  private targetZoom: number = 15;
  private isDragging: boolean = false;
  private previousPointerPos = { x: 0, y: 0 };
  private panVelocity = new THREE.Vector2(0, 0);

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private interactiveMeshes: THREE.Mesh[] = [];

  // Highlight Selection Ring
  private selectRing!: THREE.Mesh;
  private reachableRings: THREE.Mesh[] = [];

  private callbacks: WorldSceneCallbacks;
  private isDisposed: boolean = false;

  constructor(container: HTMLDivElement, callbacks: WorldSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Detect Software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Dark Void Gradient Background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e141d); // Deep cosmic slate void
    this.scene.fog = new THREE.FogExp2(0x0e141d, 0.015);

    // 4. Studio Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Orthographic Isometric Camera
    const aspect = width / height;
    const d = this.zoomLevel;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      -100,
      200
    );
    this.updateCameraTransform();

    // 6. Lighting Rig: Warm Key Sunlight + Cool Fill
    const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
    sunLight.position.set(24, 45, 18);
    if (!this.isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.left = -25;
      sunLight.shadow.camera.right = 25;
      sunLight.shadow.camera.top = 25;
      sunLight.shadow.camera.bottom = -25;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x7397b8, 0x243342, 1.2);
    this.scene.add(hemiLight);

    // 7. Floating Island Underside (Subterranean low-poly tapered rock crust)
    this.buildFloatingIslandCrust();

    // 8. Selection Rings
    this.buildSelectionIndicator();

    // 9. Player Character
    this.playerGroup = createExplorerUnit(this.isMounted);
    this.setPlayerTilePosition(this.playerX, this.playerZ, false);
    this.scene.add(this.playerGroup);

    // 10. Event Listeners
    this.bindEvents();

    // 11. Start Loop
    this.tick = this.tick.bind(this);
    this.tick();
  }

  private buildFloatingIslandCrust() {
    // Floating island rock bedrock underneath the map
    const width = GRID_WIDTH;
    const depth = GRID_HEIGHT;
    const crustGeo = new THREE.CylinderGeometry(
      Math.max(width, depth) * 0.72,
      Math.max(width, depth) * 0.35,
      6.0,
      14,
      1
    );
    const crustMat = new THREE.MeshStandardMaterial({
      color: 0x1f262d,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    crust.position.set(width * 0.5 - 0.5, -3.05, depth * 0.5 - 0.5);
    crust.receiveShadow = !this.isSoftwareGl;
    this.scene.add(crust);
  }

  private buildSelectionIndicator() {
    const ringGeo = new THREE.RingGeometry(0.55, 0.65, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    this.selectRing = new THREE.Mesh(ringGeo, ringMat);
    this.selectRing.rotation.x = -Math.PI / 2;
    this.selectRing.position.set(10, 0.52, 4);
    this.selectRing.visible = false;
    this.scene.add(this.selectRing);
  }

  public populateMap(tiles: TileData[], landmarks: Record<string, LandmarkData>) {
    // Clear old meshes
    this.tileMeshes.forEach(m => this.scene.remove(m));
    this.tileMeshes.clear();
    this.landmarkMeshes.forEach(m => this.scene.remove(m));
    this.landmarkMeshes.clear();
    this.cloudMeshes.forEach(m => this.scene.remove(m));
    this.cloudMeshes.clear();
    this.interactiveMeshes = [];
    this.tileDataMap.clear();

    const tileGeo = new THREE.BoxGeometry(0.96, 0.4, 0.96);

    tiles.forEach(tile => {
      const key = getTileKey(tile.x, tile.z);
      this.tileDataMap.set(key, tile);

      // Base tile mesh
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(tile.baseColor),
        roughness: tile.isLand ? 0.82 : 0.3,
        metalness: tile.isLand ? 0.05 : 0.25,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(tileGeo, mat);
      const elevation = tile.height;
      mesh.position.set(tile.x, elevation * 0.5, tile.z);
      mesh.scale.set(1, 1 + elevation, 1);
      mesh.receiveShadow = !this.isSoftwareGl;
      mesh.castShadow = !this.isSoftwareGl && tile.isLand;
      mesh.userData = { tileKey: key };

      this.scene.add(mesh);
      this.tileMeshes.set(key, mesh);
      this.interactiveMeshes.push(mesh);

      // Add Landmark if present
      if (tile.landmarkId && landmarks[tile.landmarkId]) {
        const lm = landmarks[tile.landmarkId];
        const lmGroup = this.createLandmarkMesh(lm.modelKey);
        if (lmGroup) {
          lmGroup.position.set(tile.x, elevation + 0.2, tile.z);
          lmGroup.userData = { landmarkId: lm.id, tileKey: key };
          
          // Initial spring scale
          lmGroup.scale.set(1, 1, 1);
          this.scene.add(lmGroup);
          this.landmarkMeshes.set(lm.id, lmGroup);

          // Register spring for bounce
          this.springNodes.push({
            object: lmGroup,
            scaleY: 1,
            velY: 0,
            targetScaleY: 1,
          });
        }
      } else if (tile.isLand && (tile.type === 'forest' || tile.type === 'hill')) {
        // Nature tree
        const tree = createBiomeTree(tile.biome);
        tree.position.set(tile.x, elevation + 0.2, tile.z);
        this.scene.add(tree);
      }

      // Fog of War Cloud Cluster (if not revealed)
      if (!tile.revealed) {
        const cloud = createFogCloud();
        cloud.position.set(tile.x, elevation + 0.3, tile.z);
        this.scene.add(cloud);
        this.cloudMeshes.set(key, cloud);
      }
    });
  }

  private createLandmarkMesh(modelKey: string): THREE.Group | null {
    switch (modelKey) {
      case 'water_tower': return createVukovarWaterTower();
      case 'vucedol_dove': return createVucedolDove();
      case 'kopacki_rit': return createKopackiRit();
      case 'djakovo_stables': return createDjakovoStables();
      case 'st_marks': return createStMarksChurch();
      case 'trakoscan_castle': return createTrakoscanCastle();
      case 'licitar_workshop': return createLicitarWorkshop();
      case 'plitvice_terraces': return createPlitviceTerraces();
      case 'tesla_coil': return createTeslaCoil();
      case 'velebit_peaks': return createVelebitPeaks();
      case 'pula_arena': return createPulaArena();
      case 'sea_organ': return createSeaOrgan();
      case 'suhozid_kazun': return createSuhozidKazun();
      case 'dubrovnik_walls': return createDubrovnikWalls();
      default: return null;
    }
  }

  public revealTiles(newlyRevealedKeys: string[]) {
    newlyRevealedKeys.forEach(key => {
      const cloud = this.cloudMeshes.get(key);
      if (cloud) {
        // Spawn puff particles
        this.spawnCloudPuff(cloud.position.x, cloud.position.y, cloud.position.z);

        // Animate scaling down to 0 and remove
        let scale = 1.0;
        const fadeInterval = window.setInterval(() => {
          scale -= 0.15;
          if (scale <= 0) {
            window.clearInterval(fadeInterval);
            this.scene.remove(cloud);
            this.cloudMeshes.delete(key);
          } else {
            cloud.scale.set(scale, scale, scale);
          }
        }, 16);
      }

      // If there's a landmark on this newly revealed tile, trigger overshoot scale bounce
      const tile = this.tileDataMap.get(key);
      if (tile?.landmarkId) {
        const lmGroup = this.landmarkMeshes.get(tile.landmarkId);
        if (lmGroup) {
          this.triggerBounce(lmGroup, 1.4);
        }
      }
    });
  }

  public updateReachableIndicators(reachableCoords: Array<{ x: number; z: number }>) {
    // Clear old reachable rings
    this.reachableRings.forEach(r => this.scene.remove(r));
    this.reachableRings = [];

    const ringGeo = new THREE.RingGeometry(0.38, 0.46, 6);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4df0a0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });

    reachableCoords.forEach(coord => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      const tile = this.tileDataMap.get(getTileKey(coord.x, coord.z));
      const y = (tile?.height || 0.3) + 0.22;
      ring.position.set(coord.x, y, coord.z);
      this.scene.add(ring);
      this.reachableRings.push(ring);
    });
  }

  public triggerBounce(object: THREE.Object3D, intensity: number = 1.3) {
    const node = this.springNodes.find(n => n.object === object);
    if (node) {
      node.scaleY = 0.65;
      node.velY = intensity * 4.5;
    } else {
      this.springNodes.push({
        object,
        scaleY: 0.7,
        velY: intensity * 4.5,
        targetScaleY: 1,
      });
    }
  }

  public selectTile(x: number, z: number) {
    const tile = this.tileDataMap.get(getTileKey(x, z));
    if (!tile) return;

    this.selectRing.position.set(x, tile.height + 0.22, z);
    this.selectRing.visible = true;

    // Bounce landmark if present
    if (tile.landmarkId) {
      const lm = this.landmarkMeshes.get(tile.landmarkId);
      if (lm) {
        this.triggerBounce(lm, 1.35);
      }
    } else {
      const tileMesh = this.tileMeshes.get(getTileKey(x, z));
      if (tileMesh) {
        this.triggerBounce(tileMesh, 1.15);
      }
    }
  }

  public movePlayerTo(targetX: number, targetZ: number) {
    if (this.isHopping) return;

    const currentTile = this.tileDataMap.get(getTileKey(this.playerX, this.playerZ));
    const targetTile = this.tileDataMap.get(getTileKey(targetX, targetZ));

    const startY = (currentTile?.height || 0.3) + 0.2;
    const endY = (targetTile?.height || 0.3) + 0.2;

    this.hopStartPos.set(this.playerX, startY, this.playerZ);
    this.hopEndPos.set(targetX, endY, targetZ);
    this.hopProgress = 0;
    this.isHopping = true;

    // Orient player in hop direction
    const dx = targetX - this.playerX;
    const dz = targetZ - this.playerZ;
    const angle = Math.atan2(dx, dz);
    this.playerGroup.rotation.y = angle;

    sound.playHop();

    // Spawn takeoff dust particles
    this.spawnDust(this.playerX, startY, this.playerZ, 5);
  }

  public setMountedState(mounted: boolean) {
    this.isMounted = mounted;
    const oldRot = this.playerGroup.rotation.y;
    this.scene.remove(this.playerGroup);
    this.playerGroup = createExplorerUnit(this.isMounted);
    this.playerGroup.rotation.y = oldRot;
    this.scene.add(this.playerGroup);
    this.setPlayerTilePosition(this.playerX, this.playerZ, false);
    this.triggerBounce(this.playerGroup, 1.4);
  }

  public setPlayerTilePosition(x: number, z: number, animate: boolean = true) {
    this.playerX = x;
    this.playerZ = z;
    const tile = this.tileDataMap.get(getTileKey(x, z));
    const y = (tile?.height || 0.3) + 0.2;
    if (animate) {
      this.movePlayerTo(x, z);
    } else {
      this.playerGroup.position.set(x, y, z);
    }
  }

  public focusCameraOn(x: number, z: number) {
    // Gentle isometric offset so focused tile is positioned higher up in viewport, clear of bottom drawer
    this.cameraTarget.set(x - 1.2, 0, z + 1.2);
  }

  private spawnDust(x: number, y: number, z: number, count: number = 6) {
    const geo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const mat = new THREE.MeshBasicMaterial({ color: 0xdfd3b8, transparent: true, opacity: 0.8 });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x + (Math.random() - 0.5) * 0.3, y, z + (Math.random() - 0.5) * 0.3);
      this.scene.add(mesh);
      this.dustParticles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 1.8 + 0.5, (Math.random() - 0.5) * 1.5),
        life: 0,
        maxLife: 0.35 + Math.random() * 0.2,
      });
    }
  }

  private spawnCloudPuff(x: number, y: number, z: number) {
    const geo = new THREE.DodecahedronGeometry(0.18, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });

    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.dustParticles.push({
        mesh,
        vel: new THREE.Vector3((Math.random() - 0.5) * 2.5, Math.random() * 2.0 + 0.8, (Math.random() - 0.5) * 2.5),
        life: 0,
        maxLife: 0.45 + Math.random() * 0.2,
      });
    }
  }

  private updateCameraTransform() {
    // True isometric angle: 45 deg yaw, ~35.26 deg pitch
    const isoDist = 32;
    this.camera.position.set(
      this.cameraCurrent.x + isoDist,
      this.cameraCurrent.y + isoDist * 1.25,
      this.cameraCurrent.z + isoDist
    );
    this.camera.lookAt(this.cameraCurrent);

    // Update zoom frustum
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;
    const d = this.zoomLevel;

    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
  }

  private bindEvents() {
    const el = this.renderer.domElement;

    // Pointer down (start pan / click)
    el.addEventListener('pointerdown', (e: PointerEvent) => {
      this.isDragging = true;
      this.previousPointerPos = { x: e.clientX, y: e.clientY };
      this.panVelocity.set(0, 0);
    });

    // Pointer move
    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (this.isDragging) {
        const dx = e.clientX - this.previousPointerPos.x;
        const dy = e.clientY - this.previousPointerPos.y;
        this.previousPointerPos = { x: e.clientX, y: e.clientY };

        // Convert 2D screen pan into isometric world ground vector
        const scale = (this.zoomLevel / (el.clientHeight || 800)) * 2.2;
        const worldDx = (-dx + dy) * scale * 0.5;
        const worldDz = (dx + dy) * scale * 0.5;

        this.cameraTarget.x += worldDx;
        this.cameraTarget.z += worldDz;
        this.panVelocity.set(worldDx, worldDz);
      }
    });

    // Pointer up (detect click if minimal drag)
    window.addEventListener('pointerup', (e: PointerEvent) => {
      if (this.isDragging) {
        this.isDragging = false;
        const dragDist = Math.hypot(e.clientX - this.previousPointerPos.x, e.clientY - this.previousPointerPos.y);
        if (dragDist < 6) {
          this.handlePointerClick(e);
        }
      }
    });

    // Wheel zoom
    el.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.04;
      this.targetZoom = THREE.MathUtils.clamp(this.targetZoom + zoomDelta, 14, 55);
    }, { passive: false });

    // Window resize
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.renderer.setSize(w, h);
      this.updateCameraTransform();
    });
  }

  private handlePointerClick(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const tileKey = hit.object.userData.tileKey;
      if (tileKey) {
        const tile = this.tileDataMap.get(tileKey);
        if (tile) {
          sound.playTileClick();
          this.selectTile(tile.x, tile.z);
          this.callbacks.onTileSelect(tile);
        }
      }
    }
  }

  private startTime: number = performance.now();

  private tick() {
    if (this.isDisposed) return;

    const now = performance.now();
    const rawDt = (now - this.lastTime) * 0.001;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05);
    const time = (now - this.startTime) * 0.001;

    // 1. Smooth Camera Inertia & Damping
    this.cameraCurrent.x += (this.cameraTarget.x - this.cameraCurrent.x) * (1 - Math.exp(-8 * dt));
    this.cameraCurrent.z += (this.cameraTarget.z - this.cameraCurrent.z) * (1 - Math.exp(-8 * dt));
    this.zoomLevel += (this.targetZoom - this.zoomLevel) * (1 - Math.exp(-10 * dt));
    this.updateCameraTransform();

    // 2. Player Hop Animation (Parabolic arc with squash-and-stretch)
    if (this.isHopping) {
      this.hopProgress += dt / this.hopDuration;
      if (this.hopProgress >= 1) {
        this.hopProgress = 1;
        this.isHopping = false;
        this.playerX = this.hopEndPos.x;
        this.playerZ = this.hopEndPos.z;
        this.playerGroup.position.copy(this.hopEndPos);

        // Landing squash & sound
        this.playerGroup.scale.set(1.28, 0.72, 1.28);
        sound.playLand();
        this.spawnDust(this.playerX, this.hopEndPos.y, this.playerZ, 6);

        if (this.callbacks.onMoveComplete) {
          this.callbacks.onMoveComplete(this.playerX, this.playerZ);
        }
      } else {
        // Parabolic arc Y = 4 * H * p * (1 - p)
        const p = this.hopProgress;
        const currentX = THREE.MathUtils.lerp(this.hopStartPos.x, this.hopEndPos.x, p);
        const currentZ = THREE.MathUtils.lerp(this.hopStartPos.z, this.hopEndPos.z, p);
        const baseY = THREE.MathUtils.lerp(this.hopStartPos.y, this.hopEndPos.y, p);
        const arcY = 4 * 0.85 * p * (1 - p); // 0.85 hop height

        this.playerGroup.position.set(currentX, baseY + arcY, currentZ);

        // Dynamic squash-and-stretch during jump
        const stretchY = 1.0 + Math.sin(p * Math.PI) * 0.35;
        const squashXZ = 1.0 / Math.sqrt(stretchY);
        this.playerGroup.scale.set(squashXZ, stretchY, squashXZ);
      }
    } else {
      // Return player scale to 1
      this.playerGroup.scale.x += (1.0 - this.playerGroup.scale.x) * (1 - Math.exp(-12 * dt));
      this.playerGroup.scale.y += (1.0 - this.playerGroup.scale.y) * (1 - Math.exp(-12 * dt));
      this.playerGroup.scale.z += (1.0 - this.playerGroup.scale.z) * (1 - Math.exp(-12 * dt));
    }

    // 3. Spring Physics for Bouncing Meshes
    for (let i = this.springNodes.length - 1; i >= 0; i--) {
      const node = this.springNodes[i];
      const displacement = node.scaleY - node.targetScaleY;
      const springForce = -160 * displacement; // stiffness
      const dampingForce = -14 * node.velY; // damping
      node.velY += (springForce + dampingForce) * dt;
      node.scaleY += node.velY * dt;

      node.object.scale.set(
        1.0 + (1.0 - node.scaleY) * 0.5,
        Math.max(0.1, node.scaleY),
        1.0 + (1.0 - node.scaleY) * 0.5
      );

      if (Math.abs(displacement) < 0.005 && Math.abs(node.velY) < 0.05) {
        node.object.scale.set(1, 1, 1);
        this.springNodes.splice(i, 1);
      }
    }

    // 4. Update Particle Pool
    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.life += dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= 4.2 * dt; // gravity

      const progress = p.life / p.maxLife;
      const scale = (1 - progress);
      p.mesh.scale.set(scale, scale, scale);

      if (p.life >= p.maxLife) {
        this.scene.remove(p.mesh);
        this.dustParticles.splice(i, 1);
      }
    }

    // 5. Ambient Landmarks Motion (e.g. rotating Licitar heart, Tesla lightning, water ripples)
    const licitarHeart = this.scene.getObjectByName('rotating_licitar_heart');
    if (licitarHeart) {
      licitarHeart.rotation.y += dt * 1.5;
    }

    const teslaSparks = this.scene.getObjectByName('tesla_sparks');
    if (teslaSparks) {
      teslaSparks.rotation.y -= dt * 4.0;
      teslaSparks.scale.setScalar(0.9 + Math.sin(time * 25) * 0.2);
    }

    const cascades = this.scene.getObjectByName('plitvice_cascades');
    if (cascades) {
      cascades.children.forEach((c, idx) => {
        c.scale.y = 0.8 + Math.sin(time * 6 + idx * 2) * 0.25;
      });
    }

    // Gentle floating clouds bob
    this.cloudMeshes.forEach((cloud, key) => {
      const [cx, cz] = key.split(',').map(Number);
      cloud.position.y = 0.6 + Math.sin(time * 1.8 + cx * 0.5 + cz * 0.7) * 0.08;
    });

    // 6. Render
    this.renderer.render(this.scene, this.camera);

    this.frameId = requestAnimationFrame(this.tick);
  }

  public dispose() {
    this.isDisposed = true;
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
