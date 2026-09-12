import { ShipComponent } from '../types/ship';

export const SHIP_COMPONENTS: ShipComponent[] = [
  {
    id: 'mk45-naval-gun',
    name: 'Mark 45 127mm Naval Gun',
    category: 'artillery',
    description: 'Rapid-firing modern naval deck gun. Fires high-velocity armor-piercing explosive shells with pinpoint ballistics.',
    iconName: 'Bomb',
    damage: 75,
    reloadTime: 3.4,
    range: 750,
    projectileSpeed: 440,
    projectileType: 'shell',
    spreadAngle: 0.04,
    projectilesPerShot: 1,
    color: '#38bdf8'
  },
  {
    id: 'phalanx-ciws',
    name: 'Phalanx 20mm CIWS',
    category: 'artillery',
    description: 'Radar-guided 6-barrel Vulcan rotary Gatling gun. Fires disciplined rapid salvos to intercept incoming threats and shred hulls.',
    iconName: 'Crosshair',
    damage: 26,
    reloadTime: 1.8,
    range: 480,
    projectileSpeed: 480,
    projectileType: 'flak',
    spreadAngle: 0.06,
    projectilesPerShot: 3,
    color: '#fbbf24'
  },
  {
    id: 'vls-tomahawk',
    name: 'VLS Cruise Missile Cell',
    category: 'missile',
    description: 'Vertical Launch System firing long-range precision cruise missiles with heavy high-explosive warheads.',
    iconName: 'Rocket',
    damage: 160,
    reloadTime: 6.2,
    range: 920,
    projectileSpeed: 310,
    projectileType: 'missile',
    splashRadius: 50,
    color: '#f97316'
  },
  {
    id: 'harpoon-missile',
    name: 'Harpoon Anti-Ship Missile',
    category: 'missile',
    description: 'High-speed sea-skimming guided missile designed for direct penetration into hostile warship waterlines.',
    iconName: 'Zap',
    damage: 105,
    reloadTime: 4.6,
    range: 780,
    projectileSpeed: 360,
    projectileType: 'missile',
    splashRadius: 35,
    color: '#06b6d4'
  },
  {
    id: 'mk48-torpedo',
    name: 'Mark 48 Heavy Torpedo',
    category: 'special-weapon',
    description: 'Acoustic-homing sub-surface torpedo. Delivers catastrophic hull-fracturing shockwaves on impact.',
    iconName: 'Target',
    damage: 185,
    reloadTime: 7.0,
    range: 680,
    projectileSpeed: 220,
    projectileType: 'torpedo',
    splashRadius: 50,
    color: '#10b981'
  },
  {
    id: 'em-railgun',
    name: 'Electromagnetic Railgun',
    category: 'artillery',
    description: 'Experimental weapon utilizing Lorentz forces to accelerate a solid metal slug with devastating armor penetration.',
    iconName: 'Zap',
    damage: 175,
    reloadTime: 5.8,
    range: 1050,
    projectileSpeed: 660,
    projectileType: 'railgun',
    spreadAngle: 0.02,
    color: '#60a5fa'
  },
  {
    id: 'searam-launcher',
    name: 'SeaRAM Defense Interceptor',
    category: 'missile',
    description: 'Rolling Airframe Missile pod that fires precision interceptors to blast approaching hostile raiders.',
    iconName: 'Crosshair',
    damage: 52,
    reloadTime: 3.6,
    range: 580,
    projectileSpeed: 380,
    projectileType: 'missile',
    spreadAngle: 0.08,
    projectilesPerShot: 1,
    color: '#a855f7'
  },
  {
    id: 'composite-armor',
    name: 'Titanium Composite Plating',
    category: 'defensive',
    description: 'Layered ceramic and titanium ballistic armor. Substantially elevates hull durability and reduces incoming damage.',
    iconName: 'Shield',
    damage: 0,
    reloadTime: 0,
    range: 0,
    projectileSpeed: 0,
    projectileType: 'none',
    bonusHp: 260,
    damageReduction: 0.16,
    color: '#64748b'
  },
  {
    id: 'gas-turbine',
    name: 'Marine Gas Turbine MT30',
    category: 'mobility',
    description: 'High-power naval turbine engine. Yields superior sustained cruising speed and quick throttle acceleration.',
    iconName: 'Gauge',
    damage: 0,
    reloadTime: 0,
    range: 0,
    projectileSpeed: 0,
    projectileType: 'none',
    bonusSpeed: 18,
    color: '#f59e0b'
  },
  {
    id: 'azipod-propulsor',
    name: 'Vectoring Azipod Propulsor',
    category: 'mobility',
    description: 'Electric podded thrusters with 360-degree vectoring capability. Grants exceptional turning rate and agile maneuvering.',
    iconName: 'Compass',
    damage: 0,
    reloadTime: 0,
    range: 0,
    projectileSpeed: 0,
    projectileType: 'none',
    bonusTurnRate: 0.22,
    color: '#06b6d4'
  },
  {
    id: 'auto-damage-control',
    name: 'Automated Damage Control',
    category: 'support',
    description: 'Computerized firefighting and automated bulkheads. Rapidly repairs hull hitpoints when disengaged from combat.',
    iconName: 'Wrench',
    damage: 0,
    reloadTime: 0,
    range: 0,
    projectileSpeed: 0,
    projectileType: 'none',
    repairRate: 14,
    color: '#10b981'
  },
  {
    id: 'aegis-radar',
    name: 'Aegis Phased Array Radar',
    category: 'support',
    description: 'Multifunction 3D active phased-array radar suite providing enhanced fleet battle awareness and target acquisition.',
    iconName: 'Crosshair',
    damage: 0,
    reloadTime: 0,
    range: 0,
    projectileSpeed: 0,
    projectileType: 'none',
    bonusHp: 120,
    bonusTurnRate: 0.12,
    color: '#38bdf8'
  },
  {
    id: 'triple-naval-turret',
    name: '16-Inch Mark 7 Triple Turret',
    category: 'artillery',
    description: 'Heavy capital-ship battleship turret firing massive armor-piercing ballistic shells capable of catastrophic broadside damage.',
    iconName: 'Bomb',
    damage: 240,
    reloadTime: 7.2,
    range: 980,
    projectileSpeed: 400,
    projectileType: 'shell',
    projectilesPerShot: 3,
    spreadAngle: 0.05,
    splashRadius: 60,
    color: '#fb923c'
  },
  {
    id: 'anti-sub-rocket',
    name: 'ASROC Rocket Torpedo',
    category: 'special-weapon',
    description: 'Rocket-boosted acoustic homing torpedo system designed to deliver sudden underwater detonation at long ranges.',
    iconName: 'Target',
    damage: 170,
    reloadTime: 6.0,
    range: 820,
    projectileSpeed: 280,
    projectileType: 'torpedo',
    splashRadius: 45,
    color: '#14b8a6'
  },
  {
    id: 'ew-countermeasures',
    name: 'Electronic Warfare Jammer & Decoys',
    category: 'defensive',
    description: 'Advanced active RF jammer suite and thermal decoy launchers that degrade hostile missile tracking and absorb shell shockwaves.',
    iconName: 'Shield',
    damage: 0,
    reloadTime: 0,
    range: 0,
    projectileSpeed: 0,
    projectileType: 'none',
    bonusHp: 190,
    damageReduction: 0.12,
    bonusTurnRate: 0.10,
    color: '#818cf8'
  }
];

// Legacy ID migration map for backwards compatibility with previous save states
const LEGACY_COMPONENT_ALIASES: Record<string, string> = {
  'heavy-cannon': 'mk45-naval-gun',
  'rapid-swivel': 'phalanx-ciws',
  'long-mortar': 'vls-tomahawk',
  'dual-chaser': 'mk45-naval-gun',
  'torpedo-tube': 'mk48-torpedo',
  'greek-fire': 'phalanx-ciws',
  'reinforced-armor': 'composite-armor',
  'steam-boiler': 'gas-turbine',
  'balanced-rudder': 'azipod-propulsor',
  'repair-crew': 'auto-damage-control',
};

const BASE_COMPONENT_MAP = new Map<string, ShipComponent>(
  SHIP_COMPONENTS.map(c => [c.id, c])
);

export const COMPONENT_MAP = {
  get: (id: string): ShipComponent | undefined => {
    if (BASE_COMPONENT_MAP.has(id)) {
      return BASE_COMPONENT_MAP.get(id);
    }
    const aliasId = LEGACY_COMPONENT_ALIASES[id];
    if (aliasId && BASE_COMPONENT_MAP.has(aliasId)) {
      return BASE_COMPONENT_MAP.get(aliasId);
    }
    return undefined;
  },
  has: (id: string): boolean => {
    return BASE_COMPONENT_MAP.has(id) || Boolean(LEGACY_COMPONENT_ALIASES[id]);
  },
  values: () => BASE_COMPONENT_MAP.values(),
  entries: () => BASE_COMPONENT_MAP.entries(),
  forEach: (cb: (value: ShipComponent, key: string) => void) => BASE_COMPONENT_MAP.forEach(cb),
};
