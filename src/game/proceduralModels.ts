import * as THREE from 'three';

// Shared materials for performance and crisp low-poly flat-shaded aesthetic
const materialsCache = new Map<string, THREE.Material>();

function getMat(color: number | string, roughness: number = 0.8, metalness: number = 0.1, emissive: number = 0x000000): THREE.MeshStandardMaterial {
  const key = `${color}_${roughness}_${metalness}_${emissive}`;
  if (!materialsCache.has(key)) {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness,
      metalness,
      emissive: new THREE.Color(emissive),
      flatShading: true,
    });
    materialsCache.set(key, mat);
  }
  return materialsCache.get(key) as THREE.MeshStandardMaterial;
}

/**
 * 1. Vukovar Water Tower
 * Cylindrical red-brick tower with battle scars, top tank, and fluttering Croatian flag
 */
export function createVukovarWaterTower(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vukovar_water_tower';

  // Base foundation
  const baseGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.25, 8);
  const base = new THREE.Mesh(baseGeo, getMat(0x444444, 0.9, 0.1));
  base.position.y = 0.125;
  group.add(base);

  // Main brick tower body
  const bodyGeo = new THREE.CylinderGeometry(0.45, 0.52, 1.4, 10);
  const body = new THREE.Mesh(bodyGeo, getMat(0xad3826, 0.85, 0.05));
  body.position.y = 0.25 + 0.7;
  group.add(body);

  // Battle scar indentations (pixelated scars)
  const scarMat = getMat(0x381e18, 0.95, 0.0);
  for (let i = 0; i < 5; i++) {
    const angle = (i * 1.3);
    const scar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.1), scarMat);
    scar.position.set(Math.cos(angle) * 0.44, 0.5 + i * 0.22, Math.sin(angle) * 0.44);
    scar.rotation.y = angle;
    group.add(scar);
  }

  // Water tank crown (wider overhang)
  const tankGeo = new THREE.CylinderGeometry(0.68, 0.48, 0.55, 10);
  const tank = new THREE.Mesh(tankGeo, getMat(0x992e1e, 0.8, 0.1));
  tank.position.y = 1.65 + 0.275;
  group.add(tank);

  // Observation dome / roof
  const roofGeo = new THREE.ConeGeometry(0.68, 0.35, 10);
  const roof = new THREE.Mesh(roofGeo, getMat(0x5a5a5a, 0.6, 0.3));
  roof.position.y = 2.2 + 0.175;
  group.add(roof);

  // Flagpole & Croatian Flag
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4), getMat(0xcccccc, 0.3, 0.8));
  pole.position.set(0, 2.55 + 0.4, 0);
  group.add(pole);

  // Low-poly Flag (Red, White, Blue stripes)
  const flagRed = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.02), getMat(0xdf2828, 0.7, 0.1));
  flagRed.position.set(0.19, 2.85, 0);
  group.add(flagRed);

  const flagWhite = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.02), getMat(0xffffff, 0.7, 0.1));
  flagWhite.position.set(0.19, 2.76, 0);
  group.add(flagWhite);

  const flagBlue = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.02), getMat(0x1a4fb5, 0.7, 0.1));
  flagBlue.position.set(0.19, 2.67, 0);
  group.add(flagBlue);

  return group;
}

/**
 * 2. Vučedol Dove Sanctuary
 * Matte-black ceramic geometric bird statue etched with white triangles on a stone altar
 */
export function createVucedolDove(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'vucedol_dove';

  // Altar stepped pedestal
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1.2), getMat(0x9a8f82, 0.85, 0.1));
  step1.position.y = 0.075;
  group.add(step1);

  const step2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 0.85), getMat(0xb3a89a, 0.8, 0.1));
  step2.position.y = 0.15 + 0.125;
  group.add(step2);

  // Ceramic bird vessel base (three tripod feet)
  const footMat = getMat(0x1a1a1a, 0.9, 0.05);
  for (let i = 0; i < 3; i++) {
    const fAngle = (i * Math.PI * 2) / 3;
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2, 5), footMat);
    foot.position.set(Math.cos(fAngle) * 0.2, 0.4 + 0.1, Math.sin(fAngle) * 0.2);
    group.add(foot);
  }

  // Matte-black bird body (ritual vessel)
  const bodyGeo = new THREE.DodecahedronGeometry(0.38, 0);
  const body = new THREE.Mesh(bodyGeo, getMat(0x222222, 0.92, 0.05));
  body.position.set(0, 0.7, 0);
  body.scale.set(1.1, 0.9, 1.4);
  group.add(body);

  // Bird head & beak
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 5), getMat(0x222222, 0.92, 0.05));
  head.position.set(0, 0.95, 0.32);
  head.rotation.x = Math.PI / 4;
  group.add(head);

  // Stylized fan-tail
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.08), getMat(0x1f1f1f, 0.9, 0.05));
  tail.position.set(0, 0.85, -0.38);
  tail.rotation.x = -Math.PI / 6;
  group.add(tail);

  // Crisp white etched triangles (ritual symbols)
  const whiteMat = getMat(0xffffff, 0.5, 0.1, 0x444444);
  for (let i = -1; i <= 1; i += 2) {
    const etching = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 3), whiteMat);
    etching.position.set(i * 0.38, 0.72, 0);
    etching.rotation.z = i * Math.PI / 2;
    group.add(etching);
  }

  return group;
}

/**
 * 3. Kopački Rit & Slavonian Oak
 * Shallow water reeds bordering towering golden-green oak canopy cubes
 */
export function createKopackiRit(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'kopacki_rit';

  // Water wetland puddle
  const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.7, 0.08, 7), getMat(0x3aa7a2, 0.4, 0.2));
  pool.position.set(-0.35, 0.04, 0.2);
  group.add(pool);

  // Reeds / cattails in the water
  const reedStemMat = getMat(0x567b43, 0.8, 0.0);
  const reedHeadMat = getMat(0x503322, 0.9, 0.0);
  for (let i = 0; i < 4; i++) {
    const rx = -0.5 + (i % 2) * 0.25;
    const rz = 0.1 + Math.floor(i / 2) * 0.25;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.45, 4), reedStemMat);
    stem.position.set(rx, 0.225, rz);
    group.add(stem);

    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 5), reedHeadMat);
    tip.position.set(rx, 0.45, rz);
    group.add(tip);
  }

  // Giant Slavonian Oak trunk
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.32, 1.1, 6);
  const trunk = new THREE.Mesh(trunkGeo, getMat(0x5c3b1e, 0.9, 0.05));
  trunk.position.set(0.3, 0.55, -0.15);
  group.add(trunk);

  // Towering multi-cube wide canopy
  const oakCanopyMat = getMat(0x528731, 0.75, 0.05);
  const canopy1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 1.05), oakCanopyMat);
  canopy1.position.set(0.3, 1.3, -0.15);
  group.add(canopy1);

  const canopy2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.6, 0.8), getMat(0x6b9d3e, 0.75, 0.05));
  canopy2.position.set(0.35, 1.75, -0.1);
  canopy2.rotation.y = 0.4;
  group.add(canopy2);

  const canopy3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), getMat(0x427325, 0.8, 0.05));
  canopy3.position.set(0.25, 2.1, -0.18);
  group.add(canopy3);

  return group;
}

/**
 * 4. Đakovo Lipizzaner Stables
 * Red-brick cathedral facade + stable with snow-white Lipizzaner horse
 */
export function createDjakovoStables(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'djakovo_stables';

  // Cathedral twin spires
  const spireMat = getMat(0xb33d2c, 0.8, 0.1);
  const stoneMat = getMat(0xdfd4c5, 0.75, 0.1);

  // Central church nave
  const nave = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.9), spireMat);
  nave.position.set(-0.35, 0.45, 0);
  group.add(nave);

  // Rose window
  const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 8), stoneMat);
  rose.position.set(-0.35, 0.65, 0.46);
  rose.rotation.x = Math.PI / 2;
  group.add(rose);

  // Left spire
  const spireL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 6), stoneMat);
  spireL.position.set(-0.65, 1.25, 0.35);
  group.add(spireL);

  // Right spire
  const spireR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.85, 6), stoneMat);
  spireR.position.set(-0.05, 1.25, 0.35);
  group.add(spireR);

  // Stable barn building
  const stable = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.5, 0.7), getMat(0x8a4526, 0.85, 0.05));
  stable.position.set(0.45, 0.25, -0.1);
  group.add(stable);

  // Stable roof
  const stableRoof = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.35, 4), getMat(0x543224, 0.9, 0.05));
  stableRoof.position.set(0.45, 0.65, -0.1);
  stableRoof.rotation.y = Math.PI / 4;
  group.add(stableRoof);

  // Snow-white Lipizzaner horse grazing in front
  const horseMat = getMat(0xffffff, 0.6, 0.1);
  const horseBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.34), horseMat);
  horseBody.position.set(0.45, 0.26, 0.4);
  group.add(horseBody);

  const horseNeck = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.12), horseMat);
  horseNeck.position.set(0.45, 0.38, 0.52);
  horseNeck.rotation.x = 0.3;
  group.add(horseNeck);

  return group;
}

/**
 * 5. St. Mark’s Church Capitol (Zagreb)
 * White church nave with polychrome checkerboard tile mosaic roof & bell tower
 */
export function createStMarksChurch(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'st_marks_church';

  // White stone nave
  const nave = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.3), getMat(0xf0eee6, 0.8, 0.05));
  nave.position.set(-0.1, 0.4, 0);
  group.add(nave);

  // Mosaic roof with red, white, blue crest representation
  // Prismatic roof
  const roofGeo = new THREE.CylinderGeometry(0.05, 0.6, 1.35, 3);
  const roof = new THREE.Mesh(roofGeo, getMat(0xd83a2a, 0.7, 0.05));
  roof.position.set(-0.1, 1.05, 0);
  roof.rotation.x = Math.PI / 2;
  roof.rotation.y = Math.PI / 6;
  group.add(roof);

  // Blue & white coat-of-arms crest tile on the roof
  const crestShield1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), getMat(0x234ca1, 0.7, 0.1));
  crestShield1.position.set(-0.35, 1.05, -0.15);
  crestShield1.rotation.y = -0.55;
  crestShield1.rotation.z = 0.6;
  group.add(crestShield1);

  const crestShield2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.05), getMat(0xdf2828, 0.7, 0.1));
  crestShield2.position.set(-0.35, 1.05, 0.25);
  crestShield2.rotation.y = -0.55;
  crestShield2.rotation.z = 0.6;
  group.add(crestShield2);

  // Bell Tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.45, 0.42), getMat(0xe8e4d8, 0.75, 0.05));
  tower.position.set(0.5, 0.725, 0.4);
  group.add(tower);

  // Copper green spire
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.65, 4), getMat(0x4a8767, 0.65, 0.2));
  spire.position.set(0.5, 1.75, 0.4);
  spire.rotation.y = Math.PI / 4;
  group.add(spire);

  // Golden cross on spire
  const cross = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.06), getMat(0xffd700, 0.3, 0.8));
  cross.position.set(0.5, 2.12, 0.4);
  group.add(cross);

  return group;
}

/**
 * 6. Trakošćan Hilltop Castle
 * Romanticist white castle on green hill with conical red turrets
 */
export function createTrakoscanCastle(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'trakoscan_castle';

  // Green hill mount
  const hill = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.45, 7), getMat(0x3e8a44, 0.9, 0.0));
  hill.position.y = 0.225;
  group.add(hill);

  // White castle body
  const castleBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.65), getMat(0xf4f3ec, 0.75, 0.05));
  castleBody.position.set(0, 0.65, 0);
  group.add(castleBody);

  // Main conical tower
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.8, 8), getMat(0xf4f3ec, 0.75, 0.05));
  tower.position.set(0.22, 1.0, 0.18);
  group.add(tower);

  // Conical red turret roof
  const turret = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.48, 8), getMat(0xbd3225, 0.7, 0.1));
  turret.position.set(0.22, 1.55, 0.18);
  group.add(turret);

  // Secondary side turret
  const sideTurret = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 6), getMat(0xbd3225, 0.7, 0.1));
  sideTurret.position.set(-0.24, 1.1, -0.18);
  group.add(sideTurret);

  // Castle lake moat
  const waterMoat = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.1, 4, 12), getMat(0x3a778c, 0.4, 0.2));
  waterMoat.rotation.x = Math.PI / 2;
  waterMoat.position.y = 0.05;
  group.add(waterMoat);

  return group;
}

/**
 * 7. Licitar Heart Workshop
 * Market stall with slowly rotating icing-piped bright red heart
 */
export function createLicitarWorkshop(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'licitar_workshop';

  // Timber stall counter
  const counter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.65), getMat(0x8a5229, 0.85, 0.05));
  counter.position.set(0, 0.175, 0);
  group.add(counter);

  // Stall posts
  const postMat = getMat(0x5a3219, 0.8, 0.05);
  for (let x = -0.35; x <= 0.35; x += 0.7) {
    for (let z = -0.28; z <= 0.28; z += 0.56) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 4), postMat);
      post.position.set(x, 0.5, z);
      group.add(post);
    }
  }

  // Red & white striped awning canopy
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.25, 4), getMat(0xd83125, 0.7, 0.05));
  canopy.position.set(0, 0.95, 0);
  canopy.rotation.y = Math.PI / 4;
  group.add(canopy);

  // Spinning Heart Node (animated in render loop!)
  const heartGroup = new THREE.Group();
  heartGroup.name = 'rotating_licitar_heart';
  heartGroup.position.set(0, 1.45, 0);

  // 3D Heart geometry
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0.15);
  heartShape.bezierCurveTo(0, 0.25, -0.2, 0.35, -0.25, 0.2);
  heartShape.bezierCurveTo(-0.3, 0.05, -0.15, -0.1, 0, -0.28);
  heartShape.bezierCurveTo(0.15, -0.1, 0.3, 0.05, 0.25, 0.2);
  heartShape.bezierCurveTo(0.2, 0.35, 0, 0.25, 0, 0.15);

  const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
  const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  const heartMesh = new THREE.Mesh(heartGeo, getMat(0xe52222, 0.5, 0.1, 0x330000));
  heartMesh.position.set(0, 0, -0.04);
  heartGroup.add(heartMesh);

  // Central mirror / white icing mirror disc
  const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8), getMat(0xffffff, 0.2, 0.9));
  mirror.rotation.x = Math.PI / 2;
  mirror.position.set(0, 0.05, 0.06);
  heartGroup.add(mirror);

  group.add(heartGroup);

  return group;
}

/**
 * 8. Plitvice Cascading Terraces
 * Stepped travertine cliff with turquoise water levels & mini waterfalls
 */
export function createPlitviceTerraces(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'plitvice_terraces';

  const stoneMat = getMat(0xd8d4cb, 0.85, 0.05); // Travertine barrier stone
  const waterMat = getMat(0x1ec4b5, 0.3, 0.2, 0x054d45); // Glowing turquoise

  // Tier 1 (Lowest pool)
  const pool1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.6), waterMat);
  pool1.position.set(-0.25, 0.075, 0.3);
  group.add(pool1);

  const ledge1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 0.1), stoneMat);
  ledge1.position.set(-0.25, 0.1, 0.6);
  group.add(ledge1);

  // Tier 2 (Middle pool)
  const pool2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.18, 0.55), waterMat);
  pool2.position.set(0.1, 0.26, 0.0);
  group.add(pool2);

  const ledge2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.28, 0.1), stoneMat);
  ledge2.position.set(0.1, 0.25, 0.28);
  group.add(ledge2);

  // Tier 3 (Upper cliff pool)
  const pool3 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.5), waterMat);
  pool3.position.set(-0.15, 0.48, -0.35);
  group.add(pool3);

  const cliff = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.65, 0.3), stoneMat);
  cliff.position.set(-0.1, 0.325, -0.55);
  group.add(cliff);

  // Animated waterfall cascades (white cube waterfalls)
  const cascadeGroup = new THREE.Group();
  cascadeGroup.name = 'plitvice_cascades';
  const foamMat = getMat(0xffffff, 0.4, 0.1, 0x99ffff);

  const fall1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.08), foamMat);
  fall1.position.set(0.05, 0.3, 0.28);
  cascadeGroup.add(fall1);

  const fall2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.08), foamMat);
  fall2.position.set(-0.15, 0.45, -0.08);
  cascadeGroup.add(fall2);

  group.add(cascadeGroup);

  return group;
}

/**
 * 9. Smiljan Tesla Coil Tower
 * Copper & steel geometric coil tower crackling with low-poly cyan lightning bolts
 */
export function createTeslaCoil(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'smiljan_tesla_coil';

  // Base platform
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 0.85), getMat(0x444a52, 0.8, 0.3));
  base.position.y = 0.075;
  group.add(base);

  // Copper coil column
  const coilGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.2, 10);
  const coil = new THREE.Mesh(coilGeo, getMat(0xb86536, 0.45, 0.7));
  coil.position.y = 0.75;
  group.add(coil);

  // Wire windings (decorative toruses)
  const wireMat = getMat(0xd47a46, 0.35, 0.85);
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 4, 12), wireMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.35 + i * 0.18;
    group.add(ring);
  }

  // Top capacitive toroid (torus)
  const toroid = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.12, 8, 16), getMat(0xd2d7df, 0.2, 0.95));
  toroid.rotation.x = Math.PI / 2;
  toroid.position.y = 1.45;
  group.add(toroid);

  // Top conductive sphere
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), getMat(0xffffff, 0.1, 0.95, 0x336688));
  sphere.position.y = 1.5;
  group.add(sphere);

  // Low-poly cyan lightning bolts group (animated rotation & pulse)
  const sparkGroup = new THREE.Group();
  sparkGroup.name = 'tesla_sparks';
  const sparkMat = getMat(0x00ffff, 0.1, 0.1, 0x00ffff);

  for (let i = 0; i < 3; i++) {
    const spark = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.25, 0.04), sparkMat);
    const angle = (i * Math.PI * 2) / 3;
    spark.position.set(Math.cos(angle) * 0.42, 1.5, Math.sin(angle) * 0.42);
    spark.rotation.z = 0.4;
    spark.rotation.y = angle;
    sparkGroup.add(spark);
  }
  group.add(sparkGroup);

  return group;
}

/**
 * 10. Velebit Karst Peaks & Velebitska Degenija
 * Jagged limestone pyramids with tiny glowing yellow flower blocks
 */
export function createVelebitPeaks(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'velebit_peaks';

  const karstMat = getMat(0xd9dede, 0.9, 0.05);

  // Main jagged karst pyramid
  const peak1 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.5, 4), karstMat);
  peak1.position.set(-0.1, 0.75, 0.05);
  peak1.rotation.y = 0.3;
  group.add(peak1);

  // Flanking karst crags
  const peak2 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 4), getMat(0xc2c7c7, 0.9, 0.05));
  peak2.position.set(0.35, 0.55, -0.2);
  peak2.rotation.y = -0.4;
  group.add(peak2);

  const peak3 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.75, 4), karstMat);
  peak3.position.set(-0.35, 0.375, 0.3);
  group.add(peak3);

  // Tiny glowing yellow Velebitska Degenija flowers at summit
  const degenijaMat = getMat(0xffeb3b, 0.5, 0.1, 0xffbb00);
  for (let i = 0; i < 5; i++) {
    const flower = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), degenijaMat);
    const angle = i * 1.2;
    flower.position.set(-0.1 + Math.cos(angle) * 0.18, 1.25 + (i % 2) * 0.1, 0.05 + Math.sin(angle) * 0.18);
    group.add(flower);
  }

  return group;
}

/**
 * 11. Pula Arena & Diocletian’s Peristyle
 * Circular white-stone colosseum with open rectangular arches
 */
export function createPulaArena(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'pula_arena';

  const stoneMat = getMat(0xf2ece1, 0.85, 0.05);
  const sandMat = getMat(0xd8c29d, 0.9, 0.0);

  // Arena sand floor
  const arenaFloor = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 12), sandMat);
  arenaFloor.position.y = 0.05;
  group.add(arenaFloor);

  // Circular outer wall ring of pillars and arches
  const segments = 12;
  const radius = 0.62;
  for (let i = 0; i < segments; i++) {
    const angle = (i * Math.PI * 2) / segments;
    // Outer arch pillar
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), stoneMat);
    pillar.position.set(Math.cos(angle) * radius, 0.325, Math.sin(angle) * radius);
    pillar.rotation.y = -angle;
    group.add(pillar);

    // Arch lintel connecting to next pillar
    const nextAngle = ((i + 1) * Math.PI * 2) / segments;
    const midX = (Math.cos(angle) + Math.cos(nextAngle)) * 0.5 * radius;
    const midZ = (Math.sin(angle) + Math.sin(nextAngle)) * 0.5 * radius;
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.12), stoneMat);
    lintel.position.set(midX, 0.65, midZ);
    lintel.rotation.y = -angle - Math.PI / segments;
    group.add(lintel);
  }

  // Classical Peristyle temple pediment accent in center
  const pediment = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.2, 3), stoneMat);
  pediment.position.set(0, 0.55, -0.2);
  group.add(pediment);

  return group;
}

/**
 * 12. Zadar Sea Organ
 * White marble steps descending into shallow water with wave animations
 */
export function createSeaOrgan(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'zadar_sea_organ';

  const marbleMat = getMat(0xfaf8f2, 0.6, 0.1);
  const waterMat = getMat(0x24749f, 0.4, 0.3, 0x0c3349);

  // 4 descending marble steps
  for (let i = 0; i < 4; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.28), marbleMat);
    step.position.set(0, 0.07 + (3 - i) * 0.12, -0.4 + i * 0.26);
    group.add(step);

    // Acoustic organ vent holes along step risers
    for (let h = -0.4; h <= 0.4; h += 0.2) {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 5), getMat(0x222222, 0.9, 0.1));
      hole.rotation.x = Math.PI / 2;
      hole.position.set(h, 0.07 + (3 - i) * 0.12, -0.27 + i * 0.26);
      group.add(hole);
    }
  }

  // Sea water lapping front step
  const water = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 0.5), waterMat);
  water.position.set(0, 0.04, 0.55);
  group.add(water);

  return group;
}

/**
 * 13. Dry-Stone Suhozid & Kažun
 * Criss-crossing low-poly stone walls dividing lavender & olive groves with round Kažun hut
 */
export function createSuhozidKazun(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'suhozid_kazun';

  const stoneMat = getMat(0xe5e1d5, 0.9, 0.05);

  // Kažun circular stone shelter
  const kazunBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.35, 8), stoneMat);
  kazunBase.position.set(-0.3, 0.175, -0.25);
  group.add(kazunBase);

  // Conical slate roof
  const kazunRoof = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.35, 8), getMat(0xc5bfb2, 0.9, 0.05));
  kazunRoof.position.set(-0.3, 0.525, -0.25);
  group.add(kazunRoof);

  // Kažun low doorway
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.08), getMat(0x28231e, 0.9, 0.0));
  door.position.set(-0.3, 0.1, 0.08);
  group.add(door);

  // Dry-stone walls (Suhozid)
  const wall1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.08), stoneMat);
  wall1.position.set(0, 0.075, 0.15);
  group.add(wall1);

  const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 1.1), stoneMat);
  wall2.position.set(0.2, 0.075, 0);
  group.add(wall2);

  // Purple lavender bush
  const lavenderMat = getMat(0x9b6fc7, 0.75, 0.05);
  for (let i = 0; i < 3; i++) {
    const lav = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), lavenderMat);
    lav.position.set(0.45 + (i % 2) * 0.15, 0.12, -0.2 + i * 0.18);
    group.add(lav);
  }

  // Silver olive tree
  const oliveTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.45, 5), getMat(0x69543e, 0.9, 0.05));
  oliveTrunk.position.set(0.45, 0.225, 0.35);
  group.add(oliveTrunk);

  const oliveCanopy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), getMat(0x7e8f73, 0.8, 0.05));
  oliveCanopy.position.set(0.45, 0.55, 0.35);
  group.add(oliveCanopy);

  return group;
}

/**
 * 14. Dubrovnik Fortified Walls & Minčeta Tower
 * Thick bevel-edged limestone ramparts and round crenelated corner tower
 */
export function createDubrovnikWalls(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'dubrovnik_walls';

  const stoneMat = getMat(0xf6f3ea, 0.8, 0.05);
  const roofMat = getMat(0xd85834, 0.85, 0.05); // Terracotta Ragusa roof

  // Thick limestone rampart
  const rampart = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 1.25), stoneMat);
  rampart.position.set(-0.25, 0.3, 0);
  group.add(rampart);

  // Rampart walkway crenellations
  for (let z = -0.55; z <= 0.55; z += 0.22) {
    const battlement = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.12), stoneMat);
    battlement.position.set(-0.4, 0.675, z);
    group.add(battlement);
  }

  // Minčeta Tower (tall round corner fortress tower)
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 1.1, 10), stoneMat);
  tower.position.set(0.25, 0.55, -0.3);
  group.add(tower);

  // Minčeta top gallery crown
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.38, 0.28, 10), stoneMat);
  crown.position.set(0.25, 1.15, -0.3);
  group.add(crown);

  // Old town red terracotta house behind the rampart
  const house = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), stoneMat);
  house.position.set(0.18, 0.2, 0.3);
  group.add(house);

  const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.22, 4), roofMat);
  houseRoof.position.set(0.18, 0.51, 0.3);
  houseRoof.rotation.y = Math.PI / 4;
  group.add(houseRoof);

  return group;
}

/**
 * Low-poly Explorer Character
 */
export function createExplorerUnit(isMounted: boolean = false): THREE.Group {
  const group = new THREE.Group();
  group.name = 'explorer_unit';

  if (isMounted) {
    // Snow-white Lipizzaner Horse Mount
    const horseMat = getMat(0xffffff, 0.6, 0.1);
    const saddleMat = getMat(0x8a3826, 0.85, 0.1);

    // Horse body
    const horseBody = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.32, 0.6), horseMat);
    horseBody.position.y = 0.45;
    group.add(horseBody);

    // Horse neck & head
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.32, 0.2), horseMat);
    neck.position.set(0, 0.68, 0.28);
    neck.rotation.x = 0.35;
    group.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.24), horseMat);
    head.position.set(0, 0.82, 0.38);
    group.add(head);

    // 4 Horse legs
    for (let x = -0.1; x <= 0.1; x += 0.2) {
      for (let z = -0.22; z <= 0.22; z += 0.44) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.36, 4), horseMat);
        leg.position.set(x, 0.18, z);
        group.add(leg);
      }
    }

    // Saddle
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.26), saddleMat);
    saddle.position.set(0, 0.62, 0);
    group.add(saddle);

    // Explorer Rider on top
    const riderTorso = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.16), getMat(0x23497d, 0.8, 0.1));
    riderTorso.position.set(0, 0.8, 0);
    group.add(riderTorso);

    const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), getMat(0xffd5b8, 0.7, 0.05));
    riderHead.position.set(0, 1.02, 0);
    group.add(riderHead);

    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 8), getMat(0x6b4a2d, 0.85, 0.05));
    hat.position.set(0, 1.1, 0);
    group.add(hat);
  } else {
    // Ground Explorer on foot
    // Legs
    const pantsMat = getMat(0x3e4d59, 0.85, 0.05);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.28, 0.1), pantsMat);
    legL.position.set(-0.07, 0.14, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.28, 0.1), pantsMat);
    legR.position.set(0.07, 0.14, 0);
    group.add(legR);

    // Torso (Cozy jacket with red scarf)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.18), getMat(0x325b84, 0.8, 0.1));
    torso.position.set(0, 0.44, 0);
    group.add(torso);

    // Red scarf
    const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.2), getMat(0xd4382c, 0.7, 0.1));
    scarf.position.set(0, 0.6, 0);
    group.add(scarf);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 7), getMat(0xffd8be, 0.7, 0.05));
    head.position.set(0, 0.72, 0);
    group.add(head);

    // Explorer Fedora Hat
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 8), getMat(0x8a5d3b, 0.85, 0.05));
    hatBrim.position.set(0, 0.8, 0);
    group.add(hatBrim);

    const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.12, 7), getMat(0x8a5d3b, 0.85, 0.05));
    hatCrown.position.set(0, 0.87, 0);
    group.add(hatCrown);

    // Backpack
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.12), getMat(0x73512b, 0.9, 0.05));
    pack.position.set(0, 0.44, -0.13);
    group.add(pack);

    // Wooden Walking Staff
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.8, 4), getMat(0x8c6239, 0.9, 0.05));
    staff.position.set(0.18, 0.4, 0.1);
    group.add(staff);
  }

  // Soft contact shadow disc underneath
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * Low-poly Fog of War Cloud Cluster
 */
export function createFogCloud(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'fog_cloud';

  const cloudMat = getMat(0xffffff, 0.85, 0.02);

  const puff1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), cloudMat);
  puff1.position.set(0, 0.45, 0);
  group.add(puff1);

  const puff2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 0), cloudMat);
  puff2.position.set(0.22, 0.42, 0.15);
  group.add(puff2);

  const puff3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), cloudMat);
  puff3.position.set(-0.2, 0.4, -0.15);
  group.add(puff3);

  return group;
}

/**
 * Procedural Tree helper for nature tiles
 */
export function createBiomeTree(biome: string): THREE.Group {
  const group = new THREE.Group();
  const trunkMat = getMat(0x5a3e26, 0.9, 0.05);

  if (biome === 'lika') {
    // Alpine Pine
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.6, 5), trunkMat);
    trunk.position.y = 0.3;
    group.add(trunk);

    const foliageMat = getMat(0x234a31, 0.8, 0.05);
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.35 - i * 0.08, 0.45, 5), foliageMat);
      cone.position.y = 0.55 + i * 0.28;
      group.add(cone);
    }
  } else if (biome === 'dalmatia') {
    // Mediterranean Cypress or Olive
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.5, 5), trunkMat);
    trunk.position.y = 0.25;
    group.add(trunk);

    const foliage = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.8, 6), getMat(0x566d53, 0.8, 0.05));
    foliage.position.y = 0.65;
    group.add(foliage);
  } else {
    // Broadleaf Oak / Linden (Slavonia & Zagorje)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.5, 5), trunkMat);
    trunk.position.y = 0.25;
    group.add(trunk);

    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.34, 0), getMat(0x488338, 0.8, 0.05));
    foliage.position.y = 0.65;
    group.add(foliage);
  }

  return group;
}
