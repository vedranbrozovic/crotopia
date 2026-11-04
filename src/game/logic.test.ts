import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  canMoveTo, 
  getReachableTiles, 
  revealFogOfWar, 
  calculateDiscoveryStats, 
  getTileKey 
} from './logic';
import { generateCroatiaMap, LANDMARKS } from './mapData';
import { TileData } from './types';

test('Croatia map generator generates land and all 14 landmarks', () => {
  const tiles = generateCroatiaMap();
  assert.ok(tiles.length > 0, 'Tiles array should not be empty');

  // Verify all 14 landmarks are placed on tiles
  const placedLandmarks = new Set<string>();
  tiles.forEach(t => {
    if (t.landmarkId) {
      placedLandmarks.add(t.landmarkId);
    }
  });

  const expectedLandmarkKeys = Object.keys(LANDMARKS);
  assert.equal(placedLandmarks.size, 14, `Expected 14 placed landmarks, got ${placedLandmarks.size}`);
  for (const expected of expectedLandmarkKeys) {
    assert.ok(placedLandmarks.has(expected), `Missing landmark: ${expected}`);
  }
});

test('Movement logic correctly identifies valid and invalid moves', () => {
  const tiles = generateCroatiaMap();
  const tileMap = new Map<string, TileData>();
  tiles.forEach(t => tileMap.set(getTileKey(t.x, t.z), t));

  // Player at Zagreb (10, 4)
  const playerX = 10;
  const playerZ = 4;

  // Move 1 tile away to another land tile (10, 5)
  assert.equal(canMoveTo(playerX, playerZ, 10, 5, 2, tileMap), true);

  // Moving to same tile should be false
  assert.equal(canMoveTo(playerX, playerZ, 10, 4, 2, tileMap), false);

  // Moving beyond range (e.g. 5 tiles away with range 2)
  assert.equal(canMoveTo(playerX, playerZ, 10, 9, 2, tileMap), false);

  // Reachable tiles calculation returns non-empty array
  const reachable = getReachableTiles(playerX, playerZ, 2, tileMap);
  assert.ok(reachable.length > 0, 'Reachable tiles list should not be empty');
});

test('Fog of war calculation reveals tiles within radius', () => {
  const tiles = generateCroatiaMap();
  const tileMap = new Map<string, TileData>();
  tiles.forEach(t => tileMap.set(getTileKey(t.x, t.z), t));

  const currentRevealed = new Set<string>();
  const { newlyRevealed, updatedRevealed } = revealFogOfWar(10, 4, 2, currentRevealed, tileMap);

  assert.ok(newlyRevealed.length > 0, 'Should reveal tiles');
  assert.ok(updatedRevealed.has('10,4'), 'Should reveal center tile');
  assert.equal(newlyRevealed.length, updatedRevealed.size);
});

test('Discovery stats calculate correctly', () => {
  const discovered = new Set<string>(['vukovar_water_tower', 'st_marks_church']);
  const revealed = new Set<string>(['10,4', '10,5', '11,4']);

  const stats = calculateDiscoveryStats(discovered, 14, revealed, 100);
  assert.equal(stats.landmarkPercent, 14); // 2/14 = ~14%
  assert.equal(stats.explorationPercent, 3);
  assert.equal(stats.isGrandTourComplete, false);

  // All 14 discovered
  const allDiscovered = new Set<string>(Object.keys(LANDMARKS));
  const completeStats = calculateDiscoveryStats(allDiscovered, 14, revealed, 100);
  assert.equal(completeStats.isGrandTourComplete, true);
  assert.equal(completeStats.landmarkPercent, 100);
});
