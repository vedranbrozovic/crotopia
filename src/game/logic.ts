import { TileData } from './types';

export function getTileKey(x: number, z: number): string {
  return `${x},${z}`;
}

export function parseTileKey(key: string): { x: number; z: number } {
  const [x, z] = key.split(',').map(Number);
  return { x, z };
}

export function getManhattanDistance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.abs(x1 - x2) + Math.abs(z1 - z2);
}

export function getChebyshevDistance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.max(Math.abs(x1 - x2), Math.abs(z1 - z2));
}

/**
 * Check if the player can move to the target tile.
 * The Explorer can traverse land tiles and shallow coastal water. Deep sea is blocked.
 */
export function canMoveTo(
  fromX: number,
  fromZ: number,
  toX: number,
  toZ: number,
  maxRange: number,
  tilesMap: Map<string, TileData>
): boolean {
  if (fromX === toX && fromZ === toZ) return false;
  
  const dist = getChebyshevDistance(fromX, fromZ, toX, toZ);
  if (dist > maxRange) return false;

  const targetTile = tilesMap.get(getTileKey(toX, toZ));
  if (!targetTile) return false;

  // Deep water is impassable unless special transport
  if (targetTile.type === 'deep_water') return false;

  return true;
}

/**
 * Returns all coordinates within reachable range that are passable.
 */
export function getReachableTiles(
  playerX: number,
  playerZ: number,
  maxRange: number,
  tilesMap: Map<string, TileData>
): Array<{ x: number; z: number }> {
  const reachable: Array<{ x: number; z: number }> = [];

  for (let dx = -maxRange; dx <= maxRange; dx++) {
    for (let dz = -maxRange; dz <= maxRange; dz++) {
      if (dx === 0 && dz === 0) continue;
      const nx = playerX + dx;
      const nz = playerZ + dz;
      if (canMoveTo(playerX, playerZ, nx, nz, maxRange, tilesMap)) {
        reachable.push({ x: nx, z: nz });
      }
    }
  }

  return reachable;
}

/**
 * Calculate newly revealed tiles given the player position and radius.
 */
export function revealFogOfWar(
  playerX: number,
  playerZ: number,
  radius: number,
  currentRevealed: Set<string>,
  tilesMap: Map<string, TileData>
): { newlyRevealed: string[]; updatedRevealed: Set<string> } {
  const newlyRevealed: string[] = [];
  const updatedRevealed = new Set(currentRevealed);

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= radius + 0.5) {
        const key = getTileKey(playerX + dx, playerZ + dz);
        if (tilesMap.has(key)) {
          if (!updatedRevealed.has(key)) {
            updatedRevealed.add(key);
            newlyRevealed.push(key);
          }
        }
      }
    }
  }

  return { newlyRevealed, updatedRevealed };
}

/**
 * Calculate discovery stats across biomes and landmarks
 */
export function calculateDiscoveryStats(
  discoveredLandmarks: Set<string>,
  totalLandmarks: number,
  revealedTiles: Set<string>,
  totalLandTiles: number
): {
  landmarkPercent: number;
  explorationPercent: number;
  isGrandTourComplete: boolean;
} {
  const landmarkPercent = totalLandmarks > 0 
    ? Math.round((discoveredLandmarks.size / totalLandmarks) * 100) 
    : 0;

  const explorationPercent = totalLandTiles > 0 
    ? Math.min(100, Math.round((revealedTiles.size / totalLandTiles) * 100))
    : 0;

  const isGrandTourComplete = discoveredLandmarks.size >= totalLandmarks;

  return {
    landmarkPercent,
    explorationPercent,
    isGrandTourComplete,
  };
}
