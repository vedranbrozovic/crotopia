import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { BottomDrawer } from './components/BottomDrawer';
import { CodexModal } from './components/CodexModal';
import { PauseModal, VictoryModal } from './components/StatusModals';
import { WorldScene } from './game/worldScene';
import { generateCroatiaMap, LANDMARKS, getTileKey } from './game/mapData';
import { canMoveTo, getReachableTiles, revealFogOfWar } from './game/logic';
import { TileData, LandmarkData, PlayerState } from './game/types';
import { sound } from './game/audio';

type GameState = 'title' | 'playing' | 'paused' | 'victory';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Selected tile and landmark for the Polytopia bottom drawer
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);

  // Map and game state
  const [tiles, setTiles] = useState<TileData[]>(() => generateCroatiaMap());
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    // Start at Zagreb (St. Mark's Church: x=10, z=4)
    const initialRevealed = new Set<string>();
    return {
      x: 10,
      z: 4,
      isMoving: false,
      isMounted: false,
      moveRange: 2,
      stars: 50,
      discoveredLandmarks: new Set<string>(['st_marks_church']),
      revealedTiles: initialRevealed,
      activeBuffs: ['Triune Kingdom Civic Anchor'],
    };
  });

  const canvasMountRef = useRef<HTMLDivElement>(null);
  const worldSceneRef = useRef<WorldScene | null>(null);

  // Fast map lookup cache
  const tilesMapRef = useRef<Map<string, TileData>>(new Map());

  // Keep state refs for continuous keyboard handlers and event callbacks
  const playerStateRef = useRef(playerState);
  playerStateRef.current = playerState;

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Sync dataset.state with body
  useEffect(() => {
    document.body.dataset.state = gameState === 'title' ? 'title' : gameState === 'paused' ? 'paused' : gameState === 'victory' ? 'gameover' : 'playing';
  }, [gameState]);

  // Initial map tiles map population
  useEffect(() => {
    const map = new Map<string, TileData>();
    tiles.forEach(t => map.set(getTileKey(t.x, t.z), t));
    tilesMapRef.current = map;
  }, [tiles]);

  // Reveal fog around a position
  const revealAreaAround = useCallback((px: number, pz: number, radius: number = 2) => {
    const { newlyRevealed, updatedRevealed } = revealFogOfWar(
      px,
      pz,
      radius,
      playerStateRef.current.revealedTiles,
      tilesMapRef.current
    );

    if (newlyRevealed.length > 0) {
      // Update tiles revealed property
      setTiles(prev =>
        prev.map(t => {
          const key = getTileKey(t.x, t.z);
          if (updatedRevealed.has(key) && !t.revealed) {
            return { ...t, revealed: true };
          }
          return t;
        })
      );

      // Check if newly revealed tiles contain landmarks
      const newlyFoundLandmarks: string[] = [];
      newlyRevealed.forEach(key => {
        const tile = tilesMapRef.current.get(key);
        if (tile?.landmarkId && !playerStateRef.current.discoveredLandmarks.has(tile.landmarkId)) {
          newlyFoundLandmarks.push(tile.landmarkId);
        }
      });

      setPlayerState(prev => {
        const nextDiscovered = new Set(prev.discoveredLandmarks);
        newlyFoundLandmarks.forEach(id => nextDiscovered.add(id));
        const addedStars = newlyRevealed.length * 2 + newlyFoundLandmarks.length * 25;

        return {
          ...prev,
          stars: prev.stars + addedStars,
          revealedTiles: updatedRevealed,
          discoveredLandmarks: nextDiscovered,
        };
      });

      // Animate clouds in 3D world
      worldSceneRef.current?.revealTiles(newlyRevealed);

      // If landmarks found, play chime
      if (newlyFoundLandmarks.length > 0) {
        sound.playDiscoveryChime();
      }
    }
  }, []);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const scene = new WorldScene(canvasMountRef.current, {
      onTileSelect: (tile) => {
        setSelectedTile(tile);
        const lm = tile.landmarkId ? LANDMARKS[tile.landmarkId] || null : null;
        setSelectedLandmark(lm);

        // Update reachable rings from player position
        const currentP = playerStateRef.current;
        const reachable = getReachableTiles(currentP.x, currentP.z, currentP.moveRange, tilesMapRef.current);
        scene.updateReachableIndicators(reachable);
      },
      onMoveComplete: (x, z) => {
        setPlayerState(prev => ({
          ...prev,
          x,
          z,
          isMoving: false,
        }));

        // Reveal fog of war around new position
        revealAreaAround(x, z, playerStateRef.current.isMounted ? 3 : 2);

        // Check if current tile is a landmark
        const currentTile = tilesMapRef.current.get(getTileKey(x, z));
        if (currentTile?.landmarkId) {
          const lm = LANDMARKS[currentTile.landmarkId];
          if (lm && !playerStateRef.current.discoveredLandmarks.has(lm.id)) {
            setPlayerState(p => {
              const d = new Set(p.discoveredLandmarks);
              d.add(lm.id);
              return { ...p, discoveredLandmarks: d, stars: p.stars + 35 };
            });
            sound.playDiscoveryChime();
          }
          setSelectedTile(currentTile);
          setSelectedLandmark(lm);
        }

        // Check grand tour victory
        if (playerStateRef.current.discoveredLandmarks.size >= Object.keys(LANDMARKS).length) {
          setTimeout(() => {
            setGameState('victory');
          }, 600);
        }
      },
    });

    worldSceneRef.current = scene;
    scene.populateMap(tiles, LANDMARKS);

    // Initial reveal at spawn (Zagreb)
    revealAreaAround(10, 4, 3);

    // Check autostart query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState('playing');
      sound.startAmbient();
    }

    return () => {
      scene.dispose();
      worldSceneRef.current = null;
    };
  }, [revealAreaAround]); // eslint-disable-line react-hooks/exhaustive-deps

  // Move player to target tile
  const handleMovePlayer = useCallback((targetX: number, targetZ: number) => {
    const currentP = playerStateRef.current;
    if (currentP.isMoving) return;

    if (!canMoveTo(currentP.x, currentP.z, targetX, targetZ, currentP.moveRange, tilesMapRef.current)) {
      // Step closer if beyond single hop range
      const dx = Math.sign(targetX - currentP.x);
      const dz = Math.sign(targetZ - currentP.z);
      const nextX = currentP.x + dx;
      const nextZ = currentP.z + dz;

      if (canMoveTo(currentP.x, currentP.z, nextX, nextZ, currentP.moveRange, tilesMapRef.current)) {
        targetX = nextX;
        targetZ = nextZ;
      } else {
        return;
      }
    }

    setPlayerState(prev => ({ ...prev, isMoving: true }));
    worldSceneRef.current?.movePlayerTo(targetX, targetZ);
  }, []);

  // Keyboard navigation (WASD & Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter or Space starts game from title
      if (gameStateRef.current === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setGameState('playing');
          sound.startAmbient();
        }
        return;
      }

      // Esc / P toggles pause
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setGameState(prev => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
        return;
      }

      // M toggles audio mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(sound.toggleMute());
        return;
      }

      if (gameStateRef.current !== 'playing') return;

      const currentP = playerStateRef.current;
      if (currentP.isMoving) return;

      let dx = 0;
      let dz = 0;

      switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':
          dz = -1;
          break;
        case 's':
        case 'S':
        case 'ArrowDown':
          dz = 1;
          break;
        case 'a':
        case 'A':
        case 'ArrowLeft':
          dx = -1;
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
          dx = 1;
          break;
        default:
          return;
      }

      const nextX = currentP.x + dx;
      const nextZ = currentP.z + dz;

      if (canMoveTo(currentP.x, currentP.z, nextX, nextZ, currentP.moveRange, tilesMapRef.current)) {
        e.preventDefault();
        handleMovePlayer(nextX, nextZ);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMovePlayer]);

  // Special landmark interactions
  const handleInteractLandmark = (landmark: LandmarkData) => {
    switch (landmark.id) {
      case 'zadar_sea_organ':
        sound.playSeaOrganChord();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 15,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Adriatic Wave Harmony (+100% Joy)'])),
        }));
        break;

      case 'smiljan_tesla_coil':
        sound.playTeslaZap();
        // Reveal 5-tile radius around Tesla tower
        revealAreaAround(landmark.gridX, landmark.gridZ, 5);
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 20,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Tesla Wireless Grid'])),
        }));
        break;

      case 'djakovo_stables':
        // Mount Lipizzaner Horse!
        const nextMounted = !playerState.isMounted;
        setPlayerState(prev => ({
          ...prev,
          isMounted: nextMounted,
          moveRange: nextMounted ? 3 : 2,
          stars: prev.stars + 10,
        }));
        worldSceneRef.current?.setMountedState(nextMounted);
        sound.playHop();
        break;

      case 'st_marks_church':
        sound.playCathedralBell();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 10,
        }));
        break;

      case 'vukovar_water_tower':
        sound.playCathedralBell();
        setPlayerState(prev => ({
          ...prev,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Unbreakable Morale Defense'])),
          stars: prev.stars + 25,
        }));
        break;

      case 'plitvice_lakes':
        sound.playDiscoveryChime();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 20,
          activeBuffs: Array.from(new Set([...prev.activeBuffs, 'Travertine Restoration Aura'])),
        }));
        break;

      default:
        sound.playDiscoveryChime();
        setPlayerState(prev => ({
          ...prev,
          stars: prev.stars + 10,
        }));
        break;
    }

    // Trigger bounce on mesh
    worldSceneRef.current?.selectTile(landmark.gridX, landmark.gridZ);
  };

  const handleStartGame = () => {
    setGameState('playing');
    sound.startAmbient();
  };

  const handleRestart = () => {
    const initialRevealed = new Set<string>();
    setPlayerState({
      x: 10,
      z: 4,
      isMoving: false,
      isMounted: false,
      moveRange: 2,
      stars: 50,
      discoveredLandmarks: new Set<string>(['st_marks_church']),
      revealedTiles: initialRevealed,
      activeBuffs: ['Triune Kingdom Civic Anchor'],
    });
    setTiles(generateCroatiaMap());
    setSelectedTile(null);
    setSelectedLandmark(null);
    worldSceneRef.current?.setPlayerTilePosition(10, 4, false);
    worldSceneRef.current?.setMountedState(false);
    worldSceneRef.current?.focusCameraOn(10, 4);
    revealAreaAround(10, 4, 3);
    setGameState('playing');
  };

  const isReachable = Boolean(
    selectedTile &&
      canMoveTo(
        playerState.x,
        playerState.z,
        selectedTile.x,
        selectedTile.z,
        playerState.moveRange,
        tilesMapRef.current
      )
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Isolated Three.js WebGL Mount (No React state rebuilds) */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Title Screen */}
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} />}

      {/* In-Game World HUD */}
      {gameState !== 'title' && (
        <HUD
          playerState={playerState}
          totalLandmarks={Object.keys(LANDMARKS).length}
          tiles={tiles}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(sound.toggleMute())}
          onOpenCodex={() => setIsCodexOpen(true)}
          onRecenterPlayer={() => worldSceneRef.current?.focusCameraOn(playerState.x, playerState.z)}
          onPause={() => setGameState('paused')}
        />
      )}

      {/* Polytopia-Style Minimalist Bottom Drawer */}
      {gameState !== 'title' && selectedTile && (
        <BottomDrawer
          selectedTile={selectedTile}
          selectedLandmark={selectedLandmark}
          playerPos={{ x: playerState.x, z: playerState.z }}
          isReachable={isReachable}
          onMoveHere={handleMovePlayer}
          onInteractLandmark={handleInteractLandmark}
          onFocusCamera={(x, z) => worldSceneRef.current?.focusCameraOn(x, z)}
          onClose={() => {
            setSelectedTile(null);
            setSelectedLandmark(null);
          }}
        />
      )}

      {/* Croatian Regional Codex / Travel Encyclopedia Modal */}
      {isCodexOpen && (
        <CodexModal
          discoveredLandmarks={playerState.discoveredLandmarks}
          onClose={() => setIsCodexOpen(false)}
          onSelectLandmark={lm => {
            setSelectedLandmark(lm);
            const tile = tilesMapRef.current.get(getTileKey(lm.gridX, lm.gridZ));
            if (tile) setSelectedTile(tile);
            worldSceneRef.current?.focusCameraOn(lm.gridX, lm.gridZ);
            worldSceneRef.current?.selectTile(lm.gridX, lm.gridZ);
          }}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal onResume={() => setGameState('playing')} onRestart={handleRestart} />
      )}

      {/* Grand Tour Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          playerState={playerState}
          onContinue={() => setGameState('playing')}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
