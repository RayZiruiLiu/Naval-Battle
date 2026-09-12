import { BattleState } from './battleEngine';
import { BattleIsland, Particle, Projectile, ShipEntity } from '../types/ship';
import { COMPONENT_MAP } from '../data/components';

export function renderBattle(
  ctx: CanvasRenderingContext2D,
  state: BattleState,
  viewportWidth: number,
  viewportHeight: number
) {
  // Clear screen
  ctx.save();
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, viewportWidth, viewportHeight);

  // Setup Camera Transform (centered on camera x, y)
  const camX = state.camera.x;
  const camY = state.camera.y;
  const zoom = state.camera.zoom;

  ctx.translate(viewportWidth / 2, viewportHeight / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-camX, -camY);

  // 1. Draw Ocean Background according to current map theme
  drawOcean(ctx, state.arenaWidth, state.arenaHeight, state.time, state.mapConfig);

  // 1.5. Draw Area Control Objective Zones (if game mode is area-control)
  if (state.gameMode === 'area-control' && state.objectiveZones && state.captureProgress) {
    drawObjectiveZones(ctx, state);
  }

  // 2. Draw Islands / Map Obstacles
  for (const island of state.islands) {
    drawIsland(ctx, island);
  }

  // 3. Draw Water Ripples
  for (const ripple of state.ripples) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(186, 230, 253, ${ripple.alpha * 0.7})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  // 4. Draw Particles (exhaust, wake, sparks, smoke, plasma)
  drawParticles(ctx, state.particles);

  // 5. Draw Modern Warships
  for (const ship of state.ships) {
    drawModernWarship(ctx, ship, state.time);
  }

  // 6. Draw Projectiles (missiles, railgun slugs, shells, torpedoes, flak)
  for (const proj of state.projectiles) {
    drawProjectile(ctx, proj);
  }

  // 7. Draw Player Crosshair & Weapon Arc Aids
  const player = state.ships.find(s => s.id === state.playerShipId);
  if (player && !player.isSunk) {
    drawPlayerReticle(ctx, player, state.mouseWorldPos);
  }

  ctx.restore();
}

function drawOcean(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  mapConfig: BattleState['mapConfig']
) {
  const colors = mapConfig?.waterColors || {
    deep: '#031934',
    mid: '#05315f',
    surface: '#0284c7',
    wave: 'rgba(56, 189, 248, 0.16)',
    boundary: 'rgba(56, 189, 248, 0.4)',
  };
  const weather = mapConfig?.ambientWeather || 'clear';

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, width, height);
  oceanGrad.addColorStop(0, colors.deep);
  oceanGrad.addColorStop(0.5, colors.mid);
  oceanGrad.addColorStop(1, colors.surface);
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Distinctive Environmental Layering & Textures based on Map Theme
  if (weather === 'magma') {
    // 1. Volcanic Fissures & Subsurface Magma Glow
    ctx.save();
    ctx.lineWidth = 4;
    const fissureCount = 8;
    for (let f = 0; f < fissureCount; f++) {
      const startX = (f * 360 + 120) % width;
      const startY = (f * 240 + 90) % height;
      const pulse = Math.sin(time * 2.5 + f) * 0.2 + 0.8;
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.28 * pulse})`;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(
        startX + 180,
        startY + 90 + Math.sin(time + f) * 20,
        startX + 300,
        startY - 40,
        startX + 480,
        startY + 120
      );
      ctx.stroke();
    }
    // Drifting volcanic embers
    for (let e = 0; e < 45; e++) {
      const emberX = (Math.sin(e * 19.3) * 10000 + time * 35 + e * 70) % width;
      const emberY = (Math.cos(e * 31.7) * 10000 - time * 65 + e * 55) % height;
      const emberAlpha = Math.sin(time * 3 + e) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(251, 146, 60, ${emberAlpha * 0.75})`;
      ctx.beginPath();
      ctx.arc(emberX < 0 ? emberX + width : emberX, emberY < 0 ? emberY + height : emberY, 2 + (e % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (weather === 'storm') {
    // 2. Heavy North Sea Storm with Rain Cascades and Whitecaps
    ctx.save();
    // Atmospheric lightning flash (subtle, occasional)
    const lightning = Math.sin(time * 0.65) > 0.985 && Math.sin(time * 4) > 0.5;
    if (lightning) {
      ctx.fillStyle = 'rgba(224, 242, 254, 0.12)';
      ctx.fillRect(0, 0, width, height);
    }
    // High-velocity slanted rain streaks
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)';
    ctx.lineWidth = 1.2;
    const rainColumns = 38;
    for (let r = 0; r < rainColumns; r++) {
      const rx = (r * 75 + time * 350) % width;
      for (let ry = 0; ry < height; ry += 120) {
        const yOff = (ry + (time * 950 + r * 30)) % height;
        ctx.beginPath();
        ctx.moveTo(rx, yOff);
        ctx.lineTo(rx + 18, yOff + 35);
        ctx.stroke();
      }
    }
    // Heavy breaking foam swells
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2.5;
    for (let sw = 0; sw < width; sw += 140) {
      const waveY = (sw * 0.7 + time * 60) % height;
      ctx.beginPath();
      ctx.arc(sw, waveY, 22, 0, Math.PI * 0.9);
      ctx.stroke();
    }
    ctx.restore();
  } else if (weather === 'snow') {
    // 3. Arctic Ice Pack with Glacial Floes & Snow Mist
    ctx.save();
    // Drifting pack ice floes on water surface
    ctx.fillStyle = 'rgba(240, 249, 255, 0.25)';
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.lineWidth = 1.5;
    for (let f = 0; f < 22; f++) {
      const floeX = (f * 130 + Math.sin(time * 0.1 + f) * 40) % width;
      const floeY = (f * 95 + Math.cos(time * 0.1 + f) * 30) % height;
      ctx.beginPath();
      ctx.moveTo(floeX, floeY);
      ctx.lineTo(floeX + 35, floeY - 12);
      ctx.lineTo(floeX + 50, floeY + 15);
      ctx.lineTo(floeX + 18, floeY + 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    // Soft snow flurries
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let s = 0; s < 60; s++) {
      const sx = (Math.sin(s * 13.7) * 9000 + time * 40) % width;
      const sy = (Math.cos(s * 27.1) * 9000 + time * 70) % height;
      ctx.beginPath();
      ctx.arc(sx < 0 ? sx + width : sx, sy < 0 ? sy + height : sy, 1.5 + (s % 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (weather === 'harbor') {
    // 4. Industrial Harbor Dredged Channels & Navigational Markings
    ctx.save();
    // Dredged navigation fairway channel markers
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width, height * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    // Mooring channel bathymetry depth lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1;
    for (let d = 150; d < height; d += 220) {
      ctx.beginPath();
      ctx.moveTo(0, d);
      ctx.lineTo(width, d);
      ctx.stroke();
    }
    ctx.restore();
  } else if (weather === 'dusk') {
    // 5. Twilight with Bioluminescent Plankton Glow
    ctx.save();
    ctx.fillStyle = 'rgba(45, 212, 191, 0.15)';
    for (let b = 0; b < 40; b++) {
      const bx = (b * 68 + Math.sin(time * 0.5 + b) * 80) % width;
      const by = (b * 54 + Math.cos(time * 0.5 + b) * 60) % height;
      const pulse = Math.sin(time * 1.5 + b) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(bx, by, 6 + pulse * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    // 6. Tropical Sun Caustics
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.8;
    for (let c = 0; c < width; c += 120) {
      ctx.beginPath();
      for (let cy = 0; cy < height; cy += 40) {
        const offset = Math.sin(c * 0.02 + cy * 0.03 + time * 1.2) * 12;
        if (cy === 0) ctx.moveTo(c + offset, cy);
        else ctx.lineTo(c + offset, cy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Tactical boundary line
  ctx.strokeStyle = colors.boundary;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Dotted boundary warning zone
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([12, 12]);
  ctx.strokeRect(80, 80, width - 160, height - 160);
  ctx.setLineDash([]);

  // Dynamic ocean wave swells
  ctx.strokeStyle = colors.wave;
  ctx.lineWidth = 1.5;
  const spacing = 90;

  for (let x = 0; x < width; x += spacing) {
    ctx.beginPath();
    for (let y = 0; y < height; y += 28) {
      const waveOffset = Math.sin(x * 0.015 + y * 0.025 + time * 1.8) * 6;
      if (y === 0) ctx.moveTo(x + waveOffset, y);
      else ctx.lineTo(x + waveOffset, y);
    }
    ctx.stroke();
  }
}

function drawIsland(ctx: CanvasRenderingContext2D, island: BattleIsland) {
  ctx.save();
  const style = island.style || 'sand';

  if (style === 'harbor') {
    // Fortified naval concrete pier / breakwater (Follows EXACT polygon)
    // Concrete foundation rim
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Main reinforced concrete slab
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // Hazard yellow/black warning stripes along perimeter
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (style === 'ice') {
    // Glacial iceberg shelf (Follows EXACT polygon outline)
    // Sub-surface turquoise shelf halo along exact polygon boundary
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.lineWidth = 28;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Jagged crystalline ice body
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = '#f0f9ff';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.fill();
    ctx.stroke();

    // Glacial fracture lines radiating from center
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < island.points.length; i += 2) {
      const pt = island.points[i];
      ctx.beginPath();
      ctx.moveTo(island.x, island.y);
      ctx.lineTo(island.x + (pt.x - island.x) * 0.85, island.y + (pt.y - island.y) * 0.85);
      ctx.stroke();
    }
  } else if (style === 'rock' || style === 'volcano') {
    // Volcanic basalt sea stack & magma crag (Follows EXACT polygon outline)
    // Outer breaking surf / heat glow along polygon boundary
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = style === 'volcano' ? 'rgba(234, 88, 12, 0.3)' : 'rgba(255, 255, 255, 0.18)';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Basalt body
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = style === 'volcano' ? '#181413' : '#1c1917';
    ctx.strokeStyle = style === 'volcano' ? '#ea580c' : '#44403c';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    if (style === 'volcano') {
      // Magma veins running through rock
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      island.points.forEach((pt, idx) => {
        const vx = island.x + (pt.x - island.x) * 0.55;
        const vy = island.y + (pt.y - island.y) * 0.55;
        if (idx === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      });
      ctx.closePath();
      ctx.stroke();

      // Glowing caldera center
      ctx.beginPath();
      ctx.arc(island.x, island.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }
  } else {
    // Tropical sand atoll (Follows EXACT polygon outline)
    // Shallow water reef halo tracing exact polygon
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.lineWidth = 26;
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.28)';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Sandy beach rim
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    // Inner lush vegetation
    ctx.beginPath();
    island.points.forEach((pt, idx) => {
      const innerX = island.x + (pt.x - island.x) * 0.72;
      const innerY = island.y + (pt.y - island.y) * 0.72;
      if (idx === 0) ctx.moveTo(innerX, innerY);
      else ctx.lineTo(innerX, innerY);
    });
    ctx.closePath();
    ctx.fillStyle = '#15803d';
    ctx.fill();
  }

  // Island tactical features (bunkers, trees, buoys, ice shards)
  for (const f of island.foliage) {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = f.color;
    ctx.fill();
    if (f.type === 'buoy') {
      // Blinking tactical buoy light
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawModernWarship(
  ctx: CanvasRenderingContext2D,
  ship: ShipEntity,
  time: number
) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  const length = ship.model.hullLength;
  const width = ship.model.hullWidth;
  const halfL = length * 0.5;
  const halfW = width * 0.5;

  // Sinking animation visual effect
  if (ship.isSunk) {
    ctx.globalAlpha = Math.max(0.15, 1 - ship.sinkProgress * 0.85);
    const sinkScale = 1 - ship.sinkProgress * 0.3;
    ctx.scale(sinkScale, sinkScale);
    ctx.rotate(ship.sinkProgress * 0.3);
  }

  // 1. Water displacement shadow
  ctx.fillStyle = 'rgba(2, 6, 23, 0.45)';
  ctx.beginPath();
  renderModernHullPath(ctx, halfL + 4, halfW + 4, ship.model.id);
  ctx.fill();

  // 2. Main Warship Hull (Stealth radar-absorbent finish)
  const hullColor = ship.config.primaryColor || ship.model.spriteStyle.hullColor;
  ctx.fillStyle = hullColor;
  ctx.beginPath();
  renderModernHullPath(ctx, halfL, halfW, ship.model.id);
  ctx.fill();

  // Stealth edge bevel / chine line
  ctx.strokeStyle = ship.config.accentColor || ship.model.spriteStyle.accentColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // 3. Nonskid Flight Deck / Weather Deck
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  renderModernHullPath(ctx, halfL * 0.86, halfW * 0.78, ship.model.id);
  ctx.fill();

  // Deck longitudinal tactical lines
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-halfL * 0.75, -halfW * 0.35);
  ctx.lineTo(halfL * 0.65, -halfW * 0.2);
  ctx.moveTo(-halfL * 0.75, halfW * 0.35);
  ctx.lineTo(halfL * 0.65, halfW * 0.2);
  ctx.stroke();

  // 4. Helipad at Aft Deck (if ship has helipad)
  if (ship.model.spriteStyle.hasHelipad) {
    const heliX = -halfL * 0.52;
    const heliRadius = Math.min(13, halfW * 0.55);

    // Yellow perimeter circle
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(heliX, 0, heliRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Bold White "H" Landing Mark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', heliX, 0);
  }

  // 5. Command Bridge / Stealth Superstructure
  const superX = length > 105 ? 4 : -2;
  const superL = length * 0.24;
  const superW = width * 0.38;

  // Faceted stealth deckhouse
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(superX + superL * 0.5, 0);
  ctx.lineTo(superX + superL * 0.35, -superW * 0.5);
  ctx.lineTo(superX - superL * 0.5, -superW * 0.45);
  ctx.lineTo(superX - superL * 0.5, superW * 0.45);
  ctx.lineTo(superX + superL * 0.35, superW * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bridge windows (tinted tactical glass)
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(superX + superL * 0.28, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Radar Mast with spinning phased antenna bar
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(superX, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  const radarAngle = time * 3.5;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(superX - Math.cos(radarAngle) * 5.5, -Math.sin(radarAngle) * 5.5);
  ctx.lineTo(superX + Math.cos(radarAngle) * 5.5, Math.sin(radarAngle) * 5.5);
  ctx.stroke();

  // 6. Hardpoint Components & Weapons on Deck
  for (const hp of ship.model.hardpoints) {
    const compId = ship.config.equippedComponents[hp.id];
    const hpX = hp.x * halfL;
    const hpY = hp.y * halfW;

    drawModernWeapon(ctx, hpX, hpY, hp.allowedArc, compId || null, ship.team);
  }

  // 7. Team IFF Light Bar at Stern
  const sternX = -halfL * 0.88;
  ctx.fillStyle = ship.team === 'player' ? '#38bdf8' : '#f43f5e';
  ctx.fillRect(sternX - 4, -halfW * 0.25, 3, halfW * 0.5);

  ctx.restore();

  // 8. Overhead Tactical HUD (Health, Shield, Name)
  if (!ship.isSunk) {
    drawShipOverheadHUD(ctx, ship);
  }
}

function renderModernHullPath(
  ctx: CanvasRenderingContext2D,
  halfL: number,
  halfW: number,
  modelId: string
) {
  if (modelId === 'frigate-stealth') {
    // Wave-piercing trimaran: main central hull + twin outriggers
    // Central hull
    ctx.moveTo(halfL, 0);
    ctx.lineTo(halfL * 0.7, -halfW * 0.35);
    ctx.lineTo(-halfL * 0.75, -halfW * 0.38);
    ctx.lineTo(-halfL, -halfW * 0.25);
    ctx.lineTo(-halfL, halfW * 0.25);
    ctx.lineTo(-halfL * 0.75, halfW * 0.38);
    ctx.lineTo(halfL * 0.7, halfW * 0.35);
    ctx.closePath();

    // Left Outrigger sponson
    ctx.rect(halfL * 0.2, -halfW, -halfL * 0.9, halfW * 0.28);
    // Right Outrigger sponson
    ctx.rect(halfL * 0.2, halfW * 0.72, -halfL * 0.9, halfW * 0.28);
  } else if (modelId === 'sub-raider') {
    // Streamlined submersible teardrop hull
    ctx.moveTo(halfL, 0);
    ctx.bezierCurveTo(halfL * 0.8, -halfW, -halfL * 0.7, -halfW, -halfL, 0);
    ctx.bezierCurveTo(-halfL * 0.7, halfW, halfL * 0.8, halfW, halfL, 0);
    ctx.closePath();
  } else if (modelId === 'corvette-fast') {
    // Wedge stealth strike hull
    ctx.moveTo(halfL, 0);
    ctx.lineTo(halfL * 0.6, -halfW);
    ctx.lineTo(-halfL * 0.9, -halfW * 0.85);
    ctx.lineTo(-halfL, 0);
    ctx.lineTo(-halfL * 0.9, halfW * 0.85);
    ctx.lineTo(halfL * 0.6, halfW);
    ctx.closePath();
  } else {
    // Modern Guided Destroyer / Cruiser stealth raked bow hull
    ctx.moveTo(halfL, 0);
    ctx.lineTo(halfL * 0.75, -halfW * 0.85);
    ctx.lineTo(-halfL * 0.7, -halfW);
    ctx.lineTo(-halfL, -halfW * 0.55);
    ctx.lineTo(-halfL, halfW * 0.55);
    ctx.lineTo(-halfL * 0.7, halfW);
    ctx.lineTo(halfL * 0.75, halfW * 0.85);
    ctx.closePath();
  }
}

function drawModernWeapon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  arc: string,
  compId: string | null,
  team: string
) {
  ctx.save();
  ctx.translate(x, y);

  if (!compId) {
    // Empty deck mount pad
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Determine facing rotation based on hardpoint arc
  let angle = 0;
  if (arc === 'broadside-left') angle = -Math.PI / 2;
  else if (arc === 'broadside-right') angle = Math.PI / 2;
  else if (arc === 'stern') angle = Math.PI;
  ctx.rotate(angle);

  if (compId === 'mk45-naval-gun' || compId === 'heavy-cannon' || compId === 'dual-chaser') {
    // Modern 127mm naval gun turret
    // Angular stealth gunhouse
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(3, -4.5);
    ctx.lineTo(-5, -4);
    ctx.lineTo(-5, 4);
    ctx.lineTo(3, 4.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gun barrel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5, -1.2, 10, 2.4);
    // Muzzle brake
    ctx.fillStyle = '#64748b';
    ctx.fillRect(14, -1.8, 2, 3.6);
  } else if (compId === 'phalanx-ciws' || compId === 'rapid-swivel' || compId === 'greek-fire') {
    // Phalanx CIWS (white radome + Gatling rotary gun)
    // Turret mount
    ctx.fillStyle = '#475569';
    ctx.fillRect(-3, -3, 6, 6);

    // White radome dome
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(-1, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 20mm rotary barrels forward
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, -1.2, 7, 2.4);
  } else if (compId === 'vls-tomahawk' || compId === 'long-mortar') {
    // VLS (Vertical Launch System) grid hatch cells
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, -4, 10, 8);
    ctx.fillRect(-5, -4, 10, 8);

    // Grid cells
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-3.5, -2.5, 3, 2);
    ctx.fillRect(0.5, -2.5, 3, 2);
    ctx.fillRect(-3.5, 0.5, 3, 2);
    ctx.fillRect(0.5, 0.5, 3, 2);
  } else if (compId === 'harpoon-missile') {
    // Quad canister angled missile launcher
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-4, -3.5, 8, 7);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(3, -3, 3, 6);
  } else if (compId === 'em-railgun') {
    // High-tech electromagnetic railgun
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(2, -5);
    ctx.lineTo(-6, -4);
    ctx.lineTo(-6, 4);
    ctx.lineTo(2, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Twin parallel acceleration rails
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(5, -2.5, 12, 1.5);
    ctx.fillRect(5, 1.0, 12, 1.5);
  } else if (compId === 'mk48-torpedo' || compId === 'torpedo-tube') {
    // Subsurface acoustic torpedo tube launcher
    ctx.fillStyle = '#065f46';
    ctx.fillRect(-5, -2.5, 10, 5);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(4, -2, 3, 4);
  } else if (compId === 'searam-launcher') {
    // SeaRAM 11-cell guided missile box
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-4, -4, 8, 8);
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(3, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (compId === 'composite-armor' || compId === 'reinforced-armor') {
    // Titanium composite armor module
    ctx.fillStyle = '#475569';
    ctx.fillRect(-4.5, -4.5, 9, 9);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-4.5, -4.5, 9, 9);
  } else if (compId === 'gas-turbine' || compId === 'steam-boiler') {
    // Gas turbine ventilation stack
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (compId === 'azipod-propulsor' || compId === 'balanced-rudder') {
    // Hydro-jet vectoring thruster
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(-4, -2.5, 8, 5);
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(3, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Support module indicator
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawShipOverheadHUD(ctx: CanvasRenderingContext2D, ship: ShipEntity) {
  const hudY = ship.y - ship.model.hullWidth - 28;
  const barWidth = 68;
  const barHeight = 6;

  ctx.save();

  // Name tag
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = ship.team === 'player' ? '#e0f2fe' : '#fee2e2';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 4;
  ctx.fillText(
    `${ship.isPlayer ? '⭐ ' : ''}${ship.name}`,
    ship.x,
    hudY - 4
  );
  ctx.shadowBlur = 0;

  // Health Bar Background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(ship.x - barWidth / 2 - 1, hudY, barWidth + 2, barHeight + 2);

  // Health Fill
  const hpRatio = Math.max(0, Math.min(1, ship.currentHp / ship.maxHp));
  let hpColor = '#22c55e';
  if (hpRatio < 0.3) hpColor = '#ef4444';
  else if (hpRatio < 0.6) hpColor = '#eab308';

  ctx.fillStyle = hpColor;
  ctx.fillRect(ship.x - barWidth / 2, hudY + 1, barWidth * hpRatio, barHeight);

  // Armor tick border
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(ship.x - barWidth / 2 - 1, hudY, barWidth + 2, barHeight + 2);

  ctx.restore();
}

function drawProjectile(ctx: CanvasRenderingContext2D, proj: Projectile) {
  ctx.save();

  if (proj.type === 'railgun') {
    // Electromagnetic Railgun Slug: Hypervelocity glowing blue kinetic rod
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    // High-energy cyan beam glow
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();

    // Solid core
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-12, -1.5, 20, 3);
  } else if (proj.type === 'missile') {
    // Guided cruise missile
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    // Missile body
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-8, -2, 14, 4);

    // Warhead tip
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(6, -2);
    ctx.lineTo(10, 0);
    ctx.lineTo(6, 2);
    ctx.closePath();
    ctx.fill();

    // Stabilizing fins
    ctx.fillStyle = '#475569';
    ctx.fillRect(-7, -3.5, 3, 7);

    // Rocket exhaust flame
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-8, -1.5);
    ctx.lineTo(-14 - Math.random() * 5, 0);
    ctx.lineTo(-8, 1.5);
    ctx.closePath();
    ctx.fill();
  } else if (proj.type === 'torpedo') {
    // Torpedo
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-7, -2.5, 14, 5);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(5, -2.5, 3, 5);
  } else if (proj.type === 'flak' || proj.type === 'swivel') {
    // CIWS Rotary Tracer round
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(4, 0);
    ctx.stroke();
  } else {
    // Modern naval artillery kinetic shell
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.x, proj.y);
    ctx.rotate(angle);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-5, -2, 10, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, -1.5, 4, 3);
  }

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;

    if (p.type === 'plasma') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 + (1 - alpha) * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawPlayerReticle(
  ctx: CanvasRenderingContext2D,
  player: ShipEntity,
  targetPos: { x: number; y: number }
) {
  ctx.save();

  // Tactical Crosshair
  ctx.translate(targetPos.x, targetPos.y);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.moveTo(-22, 0);
  ctx.lineTo(-7, 0);
  ctx.moveTo(7, 0);
  ctx.lineTo(22, 0);
  ctx.moveTo(0, -22);
  ctx.lineTo(0, -7);
  ctx.moveTo(0, 7);
  ctx.lineTo(0, 22);
  ctx.stroke();

  ctx.restore();

  // Effective radar range radius
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.stats.effectiveRange || 780, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawObjectiveZones(ctx: CanvasRenderingContext2D, state: BattleState) {
  if (!state.objectiveZones || !state.captureProgress) return;

  const { omegaZone, alphaZone } = state.objectiveZones;
  const progress = state.captureProgress;
  const time = state.time;

  // Render both objective zones:
  // 1. Sector Omega: Blue Team / Allied Base in the West (x = 480). Color: Sky Blue.
  renderSingleZone(
    ctx,
    omegaZone.x,
    omegaZone.y,
    omegaZone.radius,
    'SECTOR OMEGA',
    'ALLIED BASE (DEFEND)',
    progress.omegaCapturePercent,
    progress.omegaStatus,
    progress.enemiesInOmega,
    '#0284c7', // Sky blue primary
    '#38bdf8', // Light blue accent
    time
  );

  // 2. Sector Alpha: Red Team / Hostile Redoubt in the East (x = 2120). Color: Crimson Red.
  renderSingleZone(
    ctx,
    alphaZone.x,
    alphaZone.y,
    alphaZone.radius,
    'SECTOR ALPHA',
    'HOSTILE REDOUBT (CAPTURE)',
    progress.alphaCapturePercent,
    progress.alphaStatus,
    progress.alliesInAlpha,
    '#dc2626', // Red primary
    '#f87171', // Light red accent
    time
  );
}

function renderSingleZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  title: string,
  subtitle: string,
  score: number,
  status: 'idle' | 'capturing' | 'contested',
  shipsInZone: number,
  baseColor: string,
  accentColor: string,
  time: number
) {
  ctx.save();

  // 1. Zone water tint
  let fillColor = `${baseColor}15`;
  let ringColor = baseColor;
  let pulseRate = 1.8;

  if (status === 'capturing') {
    fillColor = `${accentColor}30`;
    ringColor = '#38bdf8';
    pulseRate = 4.0;
  } else if (status === 'contested') {
    fillColor = 'rgba(234, 179, 8, 0.25)';
    ringColor = '#facc15';
    pulseRate = 5.0;
  }

  // Base circular area
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Pulsing perimeter ring
  const pulse = Math.sin(time * pulseRate) * 0.5 + 0.5;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = ringColor;
  ctx.setLineDash([14, 10]);
  ctx.lineDashOffset = -time * 20;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Outer faint boundary pulse
  ctx.beginPath();
  ctx.arc(x, y, radius + 10 + pulse * 12, 0, Math.PI * 2);
  ctx.strokeStyle = `${ringColor}${Math.floor((1 - pulse) * 70).toString(16).padStart(2, '0')}`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Concentric radar sweep line
  ctx.save();
  ctx.translate(x, y);
  const sweepAngle = time * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(sweepAngle) * radius, Math.sin(sweepAngle) * radius);
  ctx.strokeStyle = `${accentColor}50`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Center beacon marker
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = ringColor;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = ringColor;
  ctx.fill();
  ctx.restore();

  // Circular gauge showing capture progress (0 - 100%)
  if (score > 0) {
    ctx.save();
    ctx.beginPath();
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * (score / 100));
    ctx.arc(x, y, radius - 6, startAngle, endAngle);
    ctx.strokeStyle = status === 'contested' ? '#eab308' : '#38bdf8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  // Floating Tactical HUD Banner over the Zone
  ctx.save();
  const hudY = y - radius - 24;
  const bannerWidth = 220;
  const bannerHeight = 44;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(x - bannerWidth / 2, hudY - bannerHeight / 2, bannerWidth, bannerHeight, 6);
  ctx.fill();
  ctx.stroke();

  // Header Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, x, hudY - 9);

  // Status & Progress text
  let statusText = `${Math.round(score)}% HELD`;
  let statusColor = '#94a3b8';
  if (status === 'capturing') {
    statusText = `CAPTURING (${Math.round(score)}%) • ${shipsInZone} SHIP${shipsInZone > 1 ? 'S' : ''}`;
    statusColor = '#38bdf8';
  } else if (status === 'contested') {
    statusText = `CONTESTED! [${Math.round(score)}%]`;
    statusColor = '#facc15';
  } else if (score === 0) {
    statusText = subtitle;
    statusColor = '#94a3b8';
  }

  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = statusColor;
  ctx.fillText(statusText, x, hudY + 9);

  ctx.restore();

  ctx.restore();
}
