export type BiomeId = 'slavonia' | 'zagorje' | 'lika' | 'dalmatia';

export type TileType = 
  | 'plain' 
  | 'hill' 
  | 'mountain' 
  | 'wetland' 
  | 'forest' 
  | 'coast' 
  | 'deep_water' 
  | 'shallow_water'
  | 'city';

export interface LandmarkData {
  id: string;
  name: string;
  title: string;
  biome: BiomeId;
  category: 'wonder' | 'tech' | 'nature' | 'cavalry' | 'city' | 'fortress' | 'craft' | 'coastal';
  loreNote: string;
  gameBuff: {
    title: string;
    description: string;
    stat: string;
  };
  gridX: number;
  gridZ: number;
  icon: string;
  actionLabel?: string;
  modelKey: string;
}

export interface TileData {
  x: number;
  z: number;
  biome: BiomeId;
  type: TileType;
  height: number;
  isLand: boolean;
  landmarkId?: string;
  revealed: boolean;
  baseColor: string;
}

export interface PlayerState {
  x: number;
  z: number;
  targetX?: number;
  targetZ?: number;
  isMoving: boolean;
  isMounted: boolean; // Lipizzaner rider
  moveRange: number; // 2 normally, 3 if Lipizzaner
  stars: number;
  discoveredLandmarks: Set<string>;
  revealedTiles: Set<string>;
  activeBuffs: string[];
}
