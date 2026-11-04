import { BiomeId, LandmarkData, TileData, TileType } from './types';
export { getTileKey } from './logic';

export const BIOMES: Record<BiomeId, {
  name: string;
  subtitle: string;
  paletteName: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
    water: string;
    grass: string;
    hill: string;
    mountain: string;
  };
  description: string;
}> = {
  slavonia: {
    name: 'Pannonian Plains & Slavonia',
    subtitle: 'Golden Granary & Ancient Riverlands',
    paletteName: 'Wheat Gold, River Clay & Slavonian Oak',
    colors: {
      primary: '#e5b93b', // Golden wheat
      secondary: '#8a5229', // River-clay brown
      tertiary: '#b8432a', // Brick red
      accent: '#4d8036', // Oak green
      water: '#4ca3a9', // Drava/Danube river aqua
      grass: '#d8b245',
      hill: '#b89437',
      mountain: '#8a6b2d',
    },
    description: 'Vast fertile plains bounded by the Drava and Danube, home to centuries-old oak forests, Lipizzaner stables, and unbreakable resilience.',
  },
  zagorje: {
    name: 'Central Croatia & Zagorje Hills',
    subtitle: 'Pastel Baroque Castles & Upper Town Heritage',
    paletteName: 'Baroque Yellow, Emerald Hills & Checkerboard Red',
    colors: {
      primary: '#f5e08c', // Pastel baroque yellow
      secondary: '#419d4b', // Emerald hills
      tertiary: '#53738e', // Slate blue
      accent: '#d93829', // Checkerboard red
      water: '#5890a8',
      grass: '#4fa853',
      hill: '#3d8c43',
      mountain: '#476e59',
    },
    description: 'Rolling vineyard hills crowned by romanticist castles and the bustling medieval streets of Zagreb\'s Upper Town.',
  },
  lika: {
    name: 'Dinaric Alps, Lika & Karst Highlands',
    subtitle: 'Limestone Crags, Stepped Terraces & Mountain Springs',
    paletteName: 'Limestone White, Travertine Turquoise & Pine Green',
    colors: {
      primary: '#e6e9ed', // Chalky limestone white
      secondary: '#26593f', // Deep pine green
      tertiary: '#1ec4b5', // Electric travertine turquoise
      accent: '#8898a6', // Misty grey
      water: '#1ec4b5', // Plitvice turquoise
      grass: '#5c7a65',
      hill: '#9ba4a9',
      mountain: '#cdd3d8',
    },
    description: 'The rugged spine of Croatia where cascading travertine lakes meet silent pine forests and the birthplace of Nikola Tesla.',
  },
  dalmatia: {
    name: 'Dalmatian Coast, Istria & Adriatic Islands',
    subtitle: 'Sun-Bleached Stone, Terracotta & Deep Sea',
    paletteName: 'Brač Stone White, Terracotta Orange & Navy Sea',
    colors: {
      primary: '#f4f1e8', // Sun-bleached Brač stone
      secondary: '#d45d3a', // Terracotta orange
      tertiary: '#1a4568', // Deep navy sea
      accent: '#7a8f6e', // Olive silver-green
      water: '#1d5c8a', // Adriatic navy/azure
      grass: '#97a37e',
      hill: '#dfd7c2',
      mountain: '#ece6d8',
    },
    description: 'Kilometers of sun-kissed Adriatic coastline lined with Roman amphitheatres, dry-stone olive orchards, and musical sea organs.',
  },
};

export const LANDMARKS: Record<string, LandmarkData> = {
  // Biome 1: Slavonia
  vukovar_water_tower: {
    id: 'vukovar_water_tower',
    name: 'Vukovar Water Tower',
    title: 'Monument / Unbreakable Wonder',
    biome: 'slavonia',
    category: 'wonder',
    loreNote: 'Built in 1968 and struck by over 600 artillery shells during the 1991 Battle of Vukovar, the Vukovar Water Tower refused to fall—standing today as Croatia\'s ultimate symbol of resilience and unity.',
    gameBuff: {
      title: 'Unbreakable Morale Aura',
      description: '+50% defense to all friendly units within a 3-tile radius and prevents adjacent settlements from being captured on the first siege turn.',
      stat: '+50% Def Aura (3-Tile Radius)',
    },
    gridX: 18,
    gridZ: 4,
    icon: '🏰',
    actionLabel: 'Inspire Defenses',
    modelKey: 'water_tower',
  },
  vucedol_dove: {
    id: 'vucedol_dove',
    name: 'Vučedol Dove Sanctuary',
    title: 'Tech Altar / Culture Node',
    biome: 'slavonia',
    category: 'tech',
    loreNote: 'Fashioned around 2600 BC by the Indo-European Vučedol culture near the Danube, the Vučedol Dove is a ritual vessel celebrating one of Europe\'s earliest bronze-casting civilizations.',
    gameBuff: {
      title: 'Prehistoric Metallurgy & Masonry',
      description: 'Unlocks early-game Metallurgy & Masonry tech branches and grants +2 Culture per turn to nearby territories.',
      stat: 'Tech Unlock: Bronze & Masonry',
    },
    gridX: 19,
    gridZ: 6,
    icon: '🕊️',
    actionLabel: 'Commune with Ancients',
    modelKey: 'vucedol_dove',
  },
  kopacki_rit: {
    id: 'kopacki_rit',
    name: 'Kopački Rit & Slavonian Oak',
    title: 'Nature / Resource Tile',
    biome: 'slavonia',
    category: 'nature',
    loreNote: 'Where the Drava and Danube rivers meet lies Kopački Rit, one of Europe\'s largest intact floodplains, bordered by ancient Slavonian Oak forests whose prized timber built the hulls of European ships and wine barrels for centuries.',
    gameBuff: {
      title: 'Timber Wealth & Floodplain Sanctuary',
      description: 'Harvesting Slavonian oak yields high-value timber for naval fleets; establishing a nature sanctuary yields +3 passive Stars (currency) every turn.',
      stat: '+3 Stars/turn & Naval Lumber',
    },
    gridX: 17,
    gridZ: 2,
    icon: '🌳',
    actionLabel: 'Harvest Slavonian Timber',
    modelKey: 'kopacki_rit',
  },
  djakovo_stables: {
    id: 'djakovo_stables',
    name: 'Đakovo Lipizzaner Stables',
    title: 'Cavalry Barracks',
    biome: 'slavonia',
    category: 'cavalry',
    loreNote: 'Bred in Slavonia since 1506, the snow-white Lipizzaner horses of Đakovo are renowned for their royal lineage, intelligence, and noble agility.',
    gameBuff: {
      title: 'Lipizzaner Royal Cavalry',
      description: 'Upgrades your explorer and warriors into swift, snow-white Lipizzaner Riders with a 3-tile movement range and mountain-path agility.',
      stat: '+1 Movement Range (3 Tiles)',
    },
    gridX: 15,
    gridZ: 5,
    icon: '🐎',
    actionLabel: 'Mount Lipizzaner Steed',
    modelKey: 'djakovo_stables',
  },

  // Biome 2: Central Croatia & Zagorje Hills
  st_marks_church: {
    id: 'st_marks_church',
    name: 'St. Mark’s Church Capitol',
    title: 'City Center Upgrade',
    biome: 'zagorje',
    category: 'city',
    loreNote: 'Famous for its 19th-century polychrome glazed tile roof, St. Mark\'s Church in Zagreb\'s Upper Town proudly displays the medieval coats of arms of the Triune Kingdom of Croatia, Slavonia, and Dalmatia alongside the city of Zagreb.',
    gameBuff: {
      title: 'Triune Kingdom Capitol Authority',
      description: 'Serves as the capital civic anchor, boosting province stability by +100% and generating +5 Stars each cycle.',
      stat: '+5 Stars & Capital Authority',
    },
    gridX: 10,
    gridZ: 4,
    icon: '⛪',
    actionLabel: 'Ring Capitol Bell',
    modelKey: 'st_marks',
  },
  trakoscan_castle: {
    id: 'trakoscan_castle',
    name: 'Trakošćan Hilltop Castle',
    title: 'Mountain Fortress',
    biome: 'zagorje',
    category: 'fortress',
    loreNote: 'Perched above a serene forest lake in rolling Zagorje, Trakošćan Castle originated as a 13th-century observation fortress before evolving into a fairy-tale aristocratic estate.',
    gameBuff: {
      title: 'Zagorje Sentry Defenses',
      description: 'Can only be built on a hill tile surrounded by water or forest. Fires defensive ballista projectiles at passing raiders and provides 3-tile vision.',
      stat: 'Ranged Defense & +3 Vision',
    },
    gridX: 9,
    gridZ: 1,
    icon: '🏰',
    actionLabel: 'Survey the Zagorje Hills',
    modelKey: 'trakoscan_castle',
  },
  licitar_heart: {
    id: 'licitar_heart',
    name: 'Licitar Heart Workshop',
    title: 'Economy / Diplomacy Building',
    biome: 'zagorje',
    category: 'craft',
    loreNote: 'An UNESCO-protected intangible heritage craft, Licitar hearts are vibrant, honey-dough ornaments gifted as tokens of love and hospitality across northern Croatia since the Middle Ages.',
    gameBuff: {
      title: 'Sweet Hospitality & Civic Growth',
      description: 'Increases city population growth rate by +25% and reduces the gold cost of forging alliances and peace treaties by 40%.',
      stat: '+25% Growth & -40% Treaty Cost',
    },
    gridX: 11,
    gridZ: 6,
    icon: '❤️',
    actionLabel: 'Craft Honey-Dough Heart',
    modelKey: 'licitar_workshop',
  },

  // Biome 3: Dinaric Alps, Lika & Karst Highlands
  plitvice_lakes: {
    id: 'plitvice_lakes',
    name: 'Plitvice Cascading Terraces',
    title: 'Natural Wonder Tile',
    biome: 'lika',
    category: 'nature',
    loreNote: 'Formed by natural travertine dams that continuously grow and reshape the river\'s path, Plitvice Lakes is a cascading labyrinth of 16 crystalline lakes shifting from emerald green to deep azure.',
    gameBuff: {
      title: 'Travertine Restoration Aura',
      description: 'Units resting on or adjacent to Plitvice terraces heal to full HP in a single turn and gain water-walking grace.',
      stat: 'Full HP Regeneration Aura',
    },
    gridX: 9,
    gridZ: 8,
    icon: '💧',
    actionLabel: 'Drink from Travertine Waters',
    modelKey: 'plitvice_terraces',
  },
  smiljan_tesla_coil: {
    id: 'smiljan_tesla_coil',
    name: 'Smiljan Tesla Coil Tower',
    title: 'Late-Game High-Tech Wonder',
    biome: 'lika',
    category: 'tech',
    loreNote: 'Born in the mountainous Lika village of Smiljan during a fierce lightning storm, Nikola Tesla pioneered alternating current and wireless energy—forever electrifying the modern world.',
    gameBuff: {
      title: 'Wireless Resonance Matrix',
      description: 'Reveals all Fog of War within a 5-tile radius with crackling cyan energy and overcharges adjacent settlements to double production.',
      stat: '5-Tile Fog Reveal & 2x Production',
    },
    gridX: 7,
    gridZ: 10,
    icon: '⚡',
    actionLabel: 'Activate Wireless Arc',
    modelKey: 'tesla_coil',
  },
  velebit_peaks: {
    id: 'velebit_peaks',
    name: 'Velebit Karst Peaks & Degenija',
    title: 'Mountain / Rare Flora Tile',
    biome: 'lika',
    category: 'nature',
    loreNote: 'The rugged Velebit mountain range forms Croatia\'s dramatic spine, sheltering the ultra-rare Velebitska degenija—a resilient yellow flower that survived the Ice Age in sheer limestone crevices.',
    gameBuff: {
      title: 'Limestone Summit Overwatch',
      description: 'Grants broad line-of-sight across the Adriatic archipelago and unlocks high-altitude alpine herbalism medicines.',
      stat: '+4 Elevated Sight & Alpine Flora',
    },
    gridX: 6,
    gridZ: 9,
    icon: '🌼',
    actionLabel: 'Search for Degenija Bloom',
    modelKey: 'velebit_peaks',
  },

  // Biome 4: Dalmatian Coast, Istria & Adriatic Islands
  pula_arena: {
    id: 'pula_arena',
    name: 'Pula Arena & Diocletian’s Peristyle',
    title: 'Classical Wonder / Elite Academy',
    biome: 'dalmatia',
    category: 'wonder',
    loreNote: 'Carved from prized local limestone, the Pula Arena and Split\'s Diocletian\'s Palace stand among the world\'s best-preserved ancient Roman monuments, blending imperial grandeur directly into daily Adriatic life.',
    gameBuff: {
      title: 'Roman Heritage & Imperial Grandeur',
      description: 'Allows training of elite Dalmatian Legion units and generates massive tourism prestige (+10 Stars per landmark visited).',
      stat: 'Train Elite Legions & +10 Stars',
    },
    gridX: 3,
    gridZ: 6,
    icon: '🏛️',
    actionLabel: 'Hold Imperial Games',
    modelKey: 'pula_arena',
  },
  zadar_sea_organ: {
    id: 'zadar_sea_organ',
    name: 'Zadar Sea Organ',
    title: 'Coastal Tile Upgrade',
    biome: 'dalmatia',
    category: 'coastal',
    loreNote: 'Carved into Zadar\'s promenade, the Sea Organ uses 35 underwater polyethylene tubes and resonant cavities to transform the rhythm of Adriatic waves into haunting, ever-changing musical chords.',
    gameBuff: {
      title: 'Adriatic Harmonic Resonator',
      description: 'When visited or when ocean waves touch it, emits warm harmonic chords that boost happiness (+100%) and coastal commerce score.',
      stat: 'Harmonic Chord & +100% Joy',
    },
    gridX: 7,
    gridZ: 12,
    icon: '🌊',
    actionLabel: 'Listen to the Sea Organ',
    modelKey: 'sea_organ',
  },
  suhozid_kazun: {
    id: 'suhozid_kazun',
    name: 'Dry-Stone Suhozid & Kažun',
    title: 'Farm / Terraforming Improvement',
    biome: 'dalmatia',
    category: 'nature',
    loreNote: 'Built entirely without mortar by stacking sun-baked karst stones by hand, Suhozid walls and cylindrical Kažun shelters have tamed the rocky Adriatic soil for olives and vineyards for over two millennia.',
    gameBuff: {
      title: 'Karst Terraforming & Olive Groves',
      description: 'Transforms barren karst into high-yield olive orchards and lavender terraces, doubling food output on stony coastal land.',
      stat: '+100% Coastal Agriculture',
    },
    gridX: 9,
    gridZ: 14,
    icon: '🫒',
    actionLabel: 'Tame Karst with Dry-Stone',
    modelKey: 'suhozid_kazun',
  },
  dubrovnik_walls: {
    id: 'dubrovnik_walls',
    name: 'Dubrovnik Walls & Minčeta Tower',
    title: 'Coastal City Defense',
    biome: 'dalmatia',
    category: 'fortress',
    loreNote: 'Encircling the historic Republic of Ragusa, Dubrovnik\'s medieval stone walls run nearly two kilometers around the sea and never fell to a foreign siege during the republic\'s golden age.',
    gameBuff: {
      title: 'Unbreachable Maritime Bastion',
      description: 'Blocks naval bombardment completely and grants +100% coastal trade income to the Republic of Ragusa.',
      stat: 'Blocks Bombardment & +100% Trade',
    },
    gridX: 14,
    gridZ: 18,
    icon: '🛡️',
    actionLabel: 'Patrol Minčeta Ramparts',
    modelKey: 'dubrovnik_walls',
  },
};

export const GRID_WIDTH = 21;
export const GRID_HEIGHT = 20;

/**
 * Procedural generation of Croatia's iconic crescent/horseshoe map.
 * Land coordinates mirror real Croatian geography:
 * - Slavonia in Northeast
 * - Zagorje / Zagreb in North-Center
 * - Istria peninsula in West
 * - Lika / Velebit spine through Central-South
 * - Dalmatian coast & islands stretching to the South-East
 */
export function generateCroatiaMap(): TileData[] {
  const tiles: TileData[] = [];

  // Shape test function: returns true if coordinate is inside Croatia's borders or islands
  function isCroatiaLand(x: number, z: number): { isLand: boolean; biome: BiomeId; type: TileType; height: number } {
    // 1. Slavonia arm (East: X 13-20, Z 2-7)
    if (x >= 13 && x <= 20 && z >= 2 && z <= 6) {
      if (x === 17 && z === 2) return { isLand: true, biome: 'slavonia', type: 'wetland', height: 0.2 }; // Kopački Rit
      if (x >= 18) return { isLand: true, biome: 'slavonia', type: 'plain', height: 0.3 };
      return { isLand: true, biome: 'slavonia', type: (x + z) % 3 === 0 ? 'forest' : 'plain', height: 0.35 };
    }

    // 2. Central Croatia / Zagorje (X 7-12, Z 1-6)
    if (x >= 7 && x <= 12 && z >= 1 && z <= 6) {
      if (x === 9 && z === 1) return { isLand: true, biome: 'zagorje', type: 'hill', height: 0.7 }; // Trakošćan
      if (x === 10 && z === 4) return { isLand: true, biome: 'zagorje', type: 'city', height: 0.5 }; // Zagreb
      const isHill = (x * 3 + z * 5) % 4 === 0 || z <= 2;
      return { isLand: true, biome: 'zagorje', type: isHill ? 'hill' : 'forest', height: isHill ? 0.65 : 0.45 };
    }

    // 3. Istria Peninsula (X 2-5, Z 5-8)
    if (x >= 2 && x <= 4 && z >= 5 && z <= 8) {
      if (x === 4 && z === 5) return { isLand: true, biome: 'dalmatia', type: 'coast', height: 0.4 };
      if (x === 3 && z === 6) return { isLand: true, biome: 'dalmatia', type: 'plain', height: 0.45 }; // Pula
      return { isLand: true, biome: 'dalmatia', type: 'coast', height: 0.35 };
    }

    // Kvarner Bay / Gorski Kotar connector (X 5-7, Z 5-7)
    if (x >= 5 && x <= 6 && z >= 5 && z <= 7) {
      return { isLand: true, biome: 'lika', type: 'mountain', height: 0.8 };
    }

    // 4. Lika & Dinaric Alps spine (X 6-10, Z 7-11)
    if (x >= 6 && x <= 10 && z >= 7 && z <= 11) {
      if (x === 9 && z === 8) return { isLand: true, biome: 'lika', type: 'wetland', height: 0.6 }; // Plitvice
      if (x === 6 && z === 8 || (x === 6 && z === 9)) return { isLand: true, biome: 'lika', type: 'mountain', height: 1.1 }; // Velebit peaks
      if (x === 7 && z === 10) return { isLand: true, biome: 'lika', type: 'hill', height: 0.75 }; // Smiljan
      const isMtn = (x + z) % 2 === 0;
      return { isLand: true, biome: 'lika', type: isMtn ? 'mountain' : 'forest', height: isMtn ? 0.95 : 0.65 };
    }

    // 5. Northern Dalmatia (Zadar region: X 6-9, Z 11-13)
    if (x >= 6 && x <= 9 && z >= 11 && z <= 13) {
      if (x === 7 && z === 12) return { isLand: true, biome: 'dalmatia', type: 'coast', height: 0.3 }; // Zadar
      return { isLand: true, biome: 'dalmatia', type: x === 6 ? 'coast' : 'hill', height: 0.45 };
    }

    // 6. Central Dalmatia & Split (X 9-12, Z 13-15)
    if (x >= 9 && x <= 12 && z >= 13 && z <= 15) {
      if (x === 9 && z === 14) return { isLand: true, biome: 'dalmatia', type: 'plain', height: 0.35 }; // Suhozid
      return { isLand: true, biome: 'dalmatia', type: (x + z) % 2 === 0 ? 'coast' : 'hill', height: 0.4 };
    }

    // 7. Southern Dalmatia & Dubrovnik (X 12-16, Z 16-19)
    if (x >= 12 && x <= 16 && z >= 16 && z <= 19) {
      if (x === 14 && z === 18) return { isLand: true, biome: 'dalmatia', type: 'city', height: 0.4 }; // Dubrovnik
      if (x >= 15 && z >= 18) return { isLand: true, biome: 'dalmatia', type: 'mountain', height: 0.85 };
      return { isLand: true, biome: 'dalmatia', type: 'coast', height: 0.35 };
    }

    // 8. Adriatic Islands (Krk at 5,6; Cres at 4,7; Brač at 10,15; Hvar at 9,16; Korčula at 11,17)
    const isIsland = 
      (x === 5 && z === 7) || // Krk
      (x === 4 && z === 8) || // Cres / Lošinj
      (x === 10 && z === 15) || // Brač
      (x === 9 && z === 16) || // Hvar
      (x === 11 && z === 17); // Korčula
    if (isIsland) {
      return { isLand: true, biome: 'dalmatia', type: 'coast', height: 0.4 };
    }

    // Water tile: deep water in outer Adriatic, shallow water near coast
    const isShallow = 
      (x >= 1 && x <= 16 && z >= 4 && z <= 19) && 
      (Math.abs(x - 6) <= 3 || Math.abs(z - 12) <= 4);

    return {
      isLand: false,
      biome: x > 12 ? 'slavonia' : z < 7 ? 'zagorje' : z < 11 ? 'lika' : 'dalmatia',
      type: isShallow ? 'shallow_water' : 'deep_water',
      height: 0.05,
    };
  }

  for (let z = 0; z < GRID_HEIGHT; z++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const info = isCroatiaLand(x, z);
      
      // Match landmark at this position
      let matchedLandmarkId: string | undefined;
      for (const [id, lm] of Object.entries(LANDMARKS)) {
        if (lm.gridX === x && lm.gridZ === z) {
          matchedLandmarkId = id;
          break;
        }
      }

      // Color selection based on biome and tile type
      const biomeColors = BIOMES[info.biome].colors;
      let baseColor = biomeColors.grass;
      if (!info.isLand) {
        baseColor = info.type === 'shallow_water' ? '#2c739e' : '#143c5e';
      } else if (info.type === 'hill') {
        baseColor = biomeColors.hill;
      } else if (info.type === 'mountain') {
        baseColor = biomeColors.mountain;
      } else if (info.type === 'wetland') {
        baseColor = info.biome === 'lika' ? '#1ec4b5' : '#579b88';
      } else if (info.type === 'forest') {
        baseColor = info.biome === 'slavonia' ? '#3d6c29' : info.biome === 'lika' ? '#1e4832' : '#3d8343';
      } else if (info.type === 'coast') {
        baseColor = '#d9d0ba';
      } else if (info.type === 'city') {
        baseColor = info.biome === 'zagorje' ? '#f5e08c' : '#f0ece1';
      }

      tiles.push({
        x,
        z,
        biome: info.biome,
        type: info.type,
        height: info.height,
        isLand: info.isLand,
        landmarkId: matchedLandmarkId,
        revealed: false,
        baseColor,
      });
    }
  }

  return tiles;
}
