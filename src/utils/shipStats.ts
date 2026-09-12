import { BaseShipModel, CustomShipConfig, ShipStats } from '../types/ship';
import { BASE_SHIPS, SHIP_MODEL_MAP } from '../data/shipModels';
import { COMPONENT_MAP } from '../data/components';

export function calculateShipStats(model: BaseShipModel, config: CustomShipConfig): ShipStats {
  let maxHp = model.baseHp;
  let speed = model.baseSpeed;
  let turnRate = model.baseTurnRate;
  let armorRating = model.baseArmor;
  let totalDps = 0;
  let maxRange = 0;
  let componentCount = 0;

  for (const hardpoint of model.hardpoints) {
    const compId = config.equippedComponents[hardpoint.id];
    if (!compId) continue;
    const comp = COMPONENT_MAP.get(compId);
    if (!comp) continue;

    componentCount++;

    if (comp.bonusHp) maxHp += comp.bonusHp;
    if (comp.bonusSpeed) speed += comp.bonusSpeed;
    if (comp.bonusTurnRate) turnRate += comp.bonusTurnRate;
    if (comp.damageReduction) armorRating += Math.round(comp.damageReduction * 100);

    if (comp.damage > 0 && comp.reloadTime > 0) {
      const shotsPerSec = 1 / comp.reloadTime;
      const count = comp.projectilesPerShot || 1;
      totalDps += comp.damage * count * shotsPerSec;
      if (comp.range > maxRange) {
        maxRange = comp.range;
      }
    }
  }

  return {
    maxHp: Math.round(maxHp),
    speed: Math.round(speed),
    turnRate: Number(turnRate.toFixed(2)),
    firepowerDps: Math.round(totalDps),
    effectiveRange: Math.round(maxRange),
    armorRating: Math.round(armorRating),
    componentCount,
  };
}

export const SHIP_PRESETS: { name: string; description: string; config: CustomShipConfig }[] = [
  {
    name: 'Aegis Destroyer (DDG)',
    description: 'Premier modern guided-missile destroyer equipped with forward 127mm naval gun, Harpoon missiles, and midship VLS Tomahawk cells.',
    config: {
      name: 'USS Aegis Vanguard',
      baseModelId: 'destroyer-aegis',
      primaryColor: '#1e293b', // Modern Navy Slate
      accentColor: '#38bdf8', // Tactical Cyan
      equippedComponents: {
        'hp-bow': 'mk45-naval-gun',
        'hp-port-missile': 'harpoon-missile',
        'hp-starboard-missile': 'harpoon-missile',
        'hp-mid-vls': 'vls-tomahawk',
        'hp-aft-ciws': 'phalanx-ciws',
        'hp-stern-aux': 'gas-turbine',
      },
    },
  },
  {
    name: 'Ghost Stealth Trimaran (FFG)',
    description: 'Wave-piercing littoral combat trimaran with radar-deflecting stealth facets, rapid autocannon, and high-speed hydro-jets.',
    config: {
      name: 'Ghost Spectre',
      baseModelId: 'frigate-stealth',
      primaryColor: '#0f172a', // Midnight Stealth
      accentColor: '#22d3ee', // Cyan Glow
      equippedComponents: {
        'hp-bow-gun': 'mk45-naval-gun',
        'hp-port-wing': 'harpoon-missile',
        'hp-starboard-wing': 'harpoon-missile',
        'hp-center-ciws': 'phalanx-ciws',
        'hp-stern-jet': 'azipod-propulsor',
      },
    },
  },
  {
    name: 'Titan Heavy Cruiser (CGN)',
    description: 'Colossal nuclear-powered missile cruiser outfitted with dual heavy deck artillery, double VLS missile banks, and titanium composite armor.',
    config: {
      name: 'Titan Colossus',
      baseModelId: 'cruiser-cgn',
      primaryColor: '#1e3a5f', // Deep Ocean Blue
      accentColor: '#f59e0b', // Amber
      equippedComponents: {
        'hp-bow-heavy': 'mk45-naval-gun',
        'hp-vls-forward': 'vls-tomahawk',
        'hp-port-torp': 'mk48-torpedo',
        'hp-starboard-torp': 'mk48-torpedo',
        'hp-aft-vls': 'vls-tomahawk',
        'hp-aft-heavy': 'mk45-naval-gun',
        'hp-stern-defense': 'searam-launcher',
      },
    },
  },
  {
    name: 'Hyperion Railgun Battlecruiser',
    description: 'Capital warship boasting an experimental electromagnetic railgun firing hypervelocity Mach 7 kinetic penetrators.',
    config: {
      name: 'Hyperion Apex',
      baseModelId: 'battlecruiser-hyperion',
      primaryColor: '#1e1b4b', // Deep Indigo
      accentColor: '#60a5fa', // Electric Blue
      equippedComponents: {
        'hp-bow-railgun': 'em-railgun',
        'hp-port-missiles': 'harpoon-missile',
        'hp-starboard-missiles': 'harpoon-missile',
        'hp-mid-vls': 'vls-tomahawk',
        'hp-aft-ciws': 'phalanx-ciws',
        'hp-armor-bay': 'composite-armor',
      },
    },
  },
  {
    name: 'Vanguard Attack Submersible (SSN)',
    description: 'Low-silhouette surface submersible with acoustic homing Mk48 torpedo tubes and conning tower autocannon.',
    config: {
      name: 'Shadow Shark',
      baseModelId: 'sub-raider',
      primaryColor: '#090d16', // Dark Submarine Hull
      accentColor: '#10b981', // Sonar Emerald
      equippedComponents: {
        'hp-port-bow-torp': 'mk48-torpedo',
        'hp-star-bow-torp': 'mk48-torpedo',
        'hp-conning-gun': 'phalanx-ciws',
        'hp-missile-tube': 'vls-tomahawk',
        'hp-silent-drive': 'azipod-propulsor',
      },
    },
  },
  {
    name: 'Viper Fast Attack Craft (FAC)',
    description: 'Ultra-fast missile patrol boat built for high-speed hit-and-run ambushes and rapid evasion.',
    config: {
      name: 'Viper Strike',
      baseModelId: 'corvette-fast',
      primaryColor: '#3f4a3c', // Coastal Olive
      accentColor: '#52624e', // Foliage Green
      equippedComponents: {
        'hp-bow-cannon': 'phalanx-ciws',
        'hp-port-torp': 'mk48-torpedo',
        'hp-star-torp': 'mk48-torpedo',
        'hp-aft-booster': 'gas-turbine',
      },
    },
  },
  {
    name: 'Ironclad Dreadnought (BB)',
    description: 'Immense armored capital ship mounting three 16-inch triple turrets, armored citadel belt, and heavy broadside secondaries.',
    config: {
      name: 'USS Dreadnought',
      baseModelId: 'dreadnought-battleship',
      primaryColor: '#38424d', // Battleship Dark Slate
      accentColor: '#574635', // Weathered Teak
      equippedComponents: {
        'hp-bow-triple': 'triple-naval-turret',
        'hp-fwd-super': 'triple-naval-turret',
        'hp-port-broadside': 'mk45-naval-gun',
        'hp-starboard-broadside': 'mk45-naval-gun',
        'hp-mid-aa': 'phalanx-ciws',
        'hp-aft-triple': 'triple-naval-turret',
        'hp-stern-belt': 'composite-armor',
      },
    },
  },
  {
    name: 'Spearhead Wavepiercer (HSV)',
    description: 'High-speed twin-hull catamaran with rapid turn rates and dual sponson Harpoon missile racks.',
    config: {
      name: 'HSV Spearhead',
      baseModelId: 'catamaran-wavepiercer',
      primaryColor: '#525c68', // Haze Gray
      accentColor: '#334155', // Slate
      equippedComponents: {
        'hp-bow-center': 'mk45-naval-gun',
        'hp-port-hull-missile': 'harpoon-missile',
        'hp-star-hull-missile': 'harpoon-missile',
        'hp-mid-vls': 'vls-tomahawk',
        'hp-stern-waterjet': 'azipod-propulsor',
      },
    },
  },
  {
    name: 'Goliath Coastal Monitor (BM)',
    description: 'Armored coastal gunboat with low freeboard, revolving heavy turret, ram bow, and twin heavy torpedoes.',
    config: {
      name: 'HMBS Goliath',
      baseModelId: 'monitor-ironclad',
      primaryColor: '#5c2d28', // Anti-Fouling Red Oxide
      accentColor: '#262626', // Iron Gray
      equippedComponents: {
        'hp-bow-ram': 'mk45-naval-gun',
        'hp-center-turret': 'triple-naval-turret',
        'hp-port-torpedo': 'mk48-torpedo',
        'hp-star-torpedo': 'mk48-torpedo',
        'hp-stern-armor': 'composite-armor',
      },
    },
  },
];

const MODERN_NPC_NAMES = [
  'Arleigh', 'Dauntless', 'Visakhapatnam', 'Kongo',
  'Seawolf', 'Trident', 'Poseidon', 'Defender',
  'Sentinel', 'Falcon', 'Hydra', 'Vanguard',
  'Phantom', 'Valiant', 'Invincible', 'Stormbringer',
  'Apex', 'Gorgon', 'Manticore', 'Kraken'
];

// Realistic naval paint schemes (Haze Gray, Ocean Blue, Slate, Olive Littoral, Lead Oxide, Charcoal, Arctic Gray)
const MODERN_PALETTES = [
  { primary: '#475569', accent: '#64748b' }, // US Navy Haze Gray & Medium Slate
  { primary: '#334155', accent: '#475569' }, // Royal Navy Dark Slate & Steel
  { primary: '#243342', accent: '#3b4e61' }, // Ocean Maritime Deep Blue & Navy Gray
  { primary: '#3f4a3c', accent: '#52624e' }, // Littoral Camouflage Olive Drab & Foliage
  { primary: '#38424d', accent: '#60584f' }, // Battleship Gray & Teak Buff
  { primary: '#5c2d28', accent: '#262626' }, // Hull Red Oxide & Iron Charcoal
  { primary: '#292524', accent: '#44403c' }, // Anechoic Submarine Black & Dark Gray
  { primary: '#64748b', accent: '#94a3b8' }, // Light Arctic Gray & Weathered Silver
];

// Generates varied modern NPC warships that are diverse and balanced
export function generateNpcShipConfig(index: number, team: 'player' | 'enemy'): { model: BaseShipModel; config: CustomShipConfig } {
  // Cycle across modern warship models
  const modelIdx = (index + (team === 'enemy' ? 1 : 0)) % BASE_SHIPS.length;
  const model = BASE_SHIPS[modelIdx];

  const palette = MODERN_PALETTES[(index * 2 + (team === 'enemy' ? 3 : 0)) % MODERN_PALETTES.length];
  const name = `${team === 'player' ? 'Allied' : 'Hostile'} ${MODERN_NPC_NAMES[(index + (team === 'enemy' ? 7 : 0)) % MODERN_NPC_NAMES.length]}`;

  const equippedComponents: Record<string, string> = {};

  // Equip modern combat components based on hardpoint arcs
  model.hardpoints.forEach((hp, hpIdx) => {
    if (hp.allowedArc === 'bow') {
      const options = ['mk45-naval-gun', 'phalanx-ciws', 'mk48-torpedo', 'em-railgun'];
      equippedComponents[hp.id] = options[(index + hpIdx) % options.length];
    } else if (hp.allowedArc.startsWith('broadside')) {
      const options = ['harpoon-missile', 'mk48-torpedo', 'phalanx-ciws', 'composite-armor'];
      equippedComponents[hp.id] = options[(index + hpIdx) % options.length];
    } else if (hp.allowedArc === 'stern') {
      const options = ['gas-turbine', 'azipod-propulsor', 'searam-launcher', 'auto-damage-control'];
      equippedComponents[hp.id] = options[(index + hpIdx) % options.length];
    } else {
      // all arc (turret / VLS)
      const options = ['vls-tomahawk', 'phalanx-ciws', 'mk45-naval-gun', 'searam-launcher'];
      equippedComponents[hp.id] = options[(index + hpIdx) % options.length];
    }
  });

  return {
    model,
    config: {
      name,
      baseModelId: model.id,
      primaryColor: palette.primary,
      accentColor: palette.accent,
      equippedComponents,
    },
  };
}
