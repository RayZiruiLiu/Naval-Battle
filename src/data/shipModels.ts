import { BaseShipModel } from '../types/ship';

export const BASE_SHIPS: BaseShipModel[] = [
  {
    id: 'destroyer-aegis',
    name: 'Aegis Guided Destroyer',
    type: 'Guided-Missile Destroyer',
    hullClass: 'DDG',
    description: 'Premier modern multi-mission surface combatant with phased-array radar, forward naval deck gun, and vertical launch missile cells.',
    hullLength: 104,
    hullWidth: 32,
    baseHp: 850,
    baseSpeed: 88,
    baseTurnRate: 1.10,
    baseArmor: 22,
    hardpoints: [
      { id: 'hp-bow', name: 'Bow Main Deck Gun', x: 0.72, y: 0, allowedArc: 'bow', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-port-missile', name: 'Port Harpoon Rack', x: 0.15, y: -0.65, allowedArc: 'broadside-left', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-starboard-missile', name: 'Starboard Harpoon Rack', x: 0.15, y: 0.65, allowedArc: 'broadside-right', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-mid-vls', name: 'Midship VLS Missile Silo', x: -0.15, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-aft-ciws', name: 'Aft Phalanx CIWS', x: -0.55, y: 0, allowedArc: 'all', defaultComponentId: 'phalanx-ciws' },
      { id: 'hp-stern-aux', name: 'Gas Turbine Aux', x: -0.80, y: 0, allowedArc: 'stern', defaultComponentId: 'gas-turbine' },
    ],
    svgHullPath: 'M 52,0 L 40,-13 L -36,-14 L -48,-11 L -52,-7 L -52,7 L -48,11 L -36,14 L 40,13 Z',
    spriteStyle: {
      deckColor: '#334155', // Modern nonskid dark slate
      hullColor: '#475569', // Naval Haze Gray
      accentColor: '#94a3b8', // Subtle tactical steel
      details: '#1e293b',
      stealthFacets: true,
      hasHelipad: true,
    }
  },
  {
    id: 'frigate-stealth',
    name: 'Ghost Trimaran Frigate',
    type: 'Littoral Stealth Frigate',
    hullClass: 'FFG',
    description: 'Advanced wave-piercing trimaran with radar-deflecting stealth geometry, extreme speed, and rapid-fire naval autocannons.',
    hullLength: 92,
    hullWidth: 42,
    baseHp: 680,
    baseSpeed: 98,
    baseTurnRate: 1.25,
    baseArmor: 16,
    hardpoints: [
      { id: 'hp-bow-gun', name: 'Bow Stealth Autocannon', x: 0.70, y: 0, allowedArc: 'bow', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-port-wing', name: 'Port Outrigger Launcher', x: 0.10, y: -0.75, allowedArc: 'broadside-left', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-starboard-wing', name: 'Starboard Outrigger Launcher', x: 0.10, y: 0.75, allowedArc: 'broadside-right', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-center-ciws', name: 'Superstructure CIWS', x: -0.10, y: 0, allowedArc: 'all', defaultComponentId: 'phalanx-ciws' },
      { id: 'hp-stern-jet', name: 'Hydro-Jet Vector Thruster', x: -0.68, y: 0, allowedArc: 'stern', defaultComponentId: 'azipod-propulsor' },
    ],
    svgHullPath: 'M 46,0 L 32,-8 L -32,-9 L -44,-6 L -44,6 L -32,9 L 32,8 Z M 20,-16 L -28,-18 L -36,-14 L -24,-13 Z M 20,16 L -28,18 L -36,14 L -24,13 Z',
    spriteStyle: {
      deckColor: '#1e293b',
      hullColor: '#334155', // Slate maritime gray
      accentColor: '#64748b', // Low-visibility gray
      details: '#0f172a',
      stealthFacets: true,
      hasHelipad: true,
    }
  },
  {
    id: 'cruiser-cgn',
    name: 'Titan Heavy Missile Cruiser',
    type: 'Nuclear Guided Cruiser',
    hullClass: 'CGN',
    description: 'Colossal naval flagship packed with heavy deck artillery, extended VLS missile banks, and thick titanium composite bulkheads.',
    hullLength: 122,
    hullWidth: 36,
    baseHp: 1350,
    baseSpeed: 70,
    baseTurnRate: 0.72,
    baseArmor: 35,
    hardpoints: [
      { id: 'hp-bow-heavy', name: 'Forward Heavy Deck Gun', x: 0.76, y: 0, allowedArc: 'bow', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-vls-forward', name: 'Forward VLS Missile Bank', x: 0.42, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-port-torp', name: 'Port Mk48 Torpedo Tube', x: 0.05, y: -0.70, allowedArc: 'broadside-left', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-starboard-torp', name: 'Starboard Mk48 Torpedo Tube', x: 0.05, y: 0.70, allowedArc: 'broadside-right', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-aft-vls', name: 'Aft VLS Missile Bank', x: -0.30, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-aft-heavy', name: 'Rear Deck Gun', x: -0.58, y: 0, allowedArc: 'all', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-stern-defense', name: 'Aft SeaRAM Interceptor', x: -0.78, y: 0, allowedArc: 'stern', defaultComponentId: 'searam-launcher' },
    ],
    svgHullPath: 'M 61,0 L 48,-14 L -44,-16 L -58,-12 L -61,-6 L -61,6 L -58,12 L -44,16 L 48,14 Z',
    spriteStyle: {
      deckColor: '#334155',
      hullColor: '#38424d', // Battleship Slate
      accentColor: '#78716c', // Weathered iron
      details: '#1e293b',
      stealthFacets: false,
      hasHelipad: true,
    }
  },
  {
    id: 'battlecruiser-hyperion',
    name: 'Hyperion Railgun Battlecruiser',
    type: 'Arsenal Battlecruiser',
    hullClass: 'BBG',
    description: 'Experimental capital vessel mounting a bow-mounted electromagnetic railgun capable of hypervelocity kinetic armor-piercing strikes.',
    hullLength: 128,
    hullWidth: 38,
    baseHp: 1400,
    baseSpeed: 72,
    baseTurnRate: 0.68,
    baseArmor: 38,
    hardpoints: [
      { id: 'hp-bow-railgun', name: 'Bow EM Railgun Turret', x: 0.78, y: 0, allowedArc: 'bow', defaultComponentId: 'em-railgun' },
      { id: 'hp-port-missiles', name: 'Port Anti-Ship Pod', x: 0.28, y: -0.72, allowedArc: 'broadside-left', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-starboard-missiles', name: 'Starboard Anti-Ship Pod', x: 0.28, y: 0.72, allowedArc: 'broadside-right', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-mid-vls', name: 'Heavy VLS Missile Grid', x: -0.10, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-aft-ciws', name: 'Dual Phalanx CIWS', x: -0.48, y: 0, allowedArc: 'all', defaultComponentId: 'phalanx-ciws' },
      { id: 'hp-armor-bay', name: 'Heavy Composite Armor Bay', x: -0.75, y: 0, allowedArc: 'stern', defaultComponentId: 'composite-armor' },
    ],
    svgHullPath: 'M 64,0 L 52,-15 L -45,-17 L -60,-13 L -64,-8 L -64,8 L -60,13 L -45,17 L 52,15 Z',
    spriteStyle: {
      deckColor: '#1e293b',
      hullColor: '#243342', // Deep Marine Navy
      accentColor: '#52525b', // Gunmetal
      details: '#0f172a',
      stealthFacets: true,
      hasHelipad: true,
    }
  },
  {
    id: 'sub-raider',
    name: 'Vanguard Surface Submersible',
    type: 'Attack Submersible',
    hullClass: 'SSN',
    description: 'Ultra-low radar cross-section surface raider equipped with acoustic heavy torpedo tubes and sea-skimming missile strikes.',
    hullLength: 96,
    hullWidth: 26,
    baseHp: 620,
    baseSpeed: 65,
    baseTurnRate: 0.85,
    baseArmor: 18,
    hardpoints: [
      { id: 'hp-port-bow-torp', name: 'Port Bow Torpedo', x: 0.72, y: -0.40, allowedArc: 'bow', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-star-bow-torp', name: 'Starboard Bow Torpedo', x: 0.72, y: 0.40, allowedArc: 'bow', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-conning-gun', name: 'Conning Tower Autocannon', x: 0.10, y: 0, allowedArc: 'all', defaultComponentId: 'phalanx-ciws' },
      { id: 'hp-missile-tube', name: 'Vertical Cruise Missile Tube', x: -0.32, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-silent-drive', name: 'Pump-Jet Silent Drive', x: -0.75, y: 0, allowedArc: 'stern', defaultComponentId: 'azipod-propulsor' },
    ],
    svgHullPath: 'M 48,0 C 44,-8 28,-11 -28,-11 C -42,-11 -48,-6 -48,0 C -48,6 -42,11 -28,11 C 28,11 44,8 48,0 Z',
    spriteStyle: {
      deckColor: '#1c1917',
      hullColor: '#292524', // Anechoic black rubber tile
      accentColor: '#57534e', // Low-vis sonar dark
      details: '#0c0a09',
      stealthFacets: false,
      hasHelipad: false,
    }
  },
  {
    id: 'corvette-fast',
    name: 'Viper Fast Attack Craft',
    type: 'Missile Patrol Corvette',
    hullClass: 'FAC',
    description: 'High-speed interceptor craft designed for hit-and-run strikes with twin torpedoes and rapid autocannon salvos.',
    hullLength: 76,
    hullWidth: 25,
    baseHp: 520,
    baseSpeed: 108,
    baseTurnRate: 1.40,
    baseArmor: 12,
    hardpoints: [
      { id: 'hp-bow-cannon', name: 'Bow 30mm Chain Gun', x: 0.68, y: 0, allowedArc: 'bow', defaultComponentId: 'phalanx-ciws' },
      { id: 'hp-port-torp', name: 'Port Light Torpedo', x: -0.05, y: -0.65, allowedArc: 'broadside-left', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-star-torp', name: 'Starboard Light Torpedo', x: -0.05, y: 0.65, allowedArc: 'broadside-right', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-aft-booster', name: 'Marine Gas Turbine', x: -0.65, y: 0, allowedArc: 'stern', defaultComponentId: 'gas-turbine' },
    ],
    svgHullPath: 'M 38,0 L 26,-10 L -24,-11 L -36,-8 L -38,-5 L -38,5 L -36,8 L -24,11 L 26,10 Z',
    spriteStyle: {
      deckColor: '#334155',
      hullColor: '#3f4a3c', // Coastal Olive Drab
      accentColor: '#52624e', // Foliage Green
      details: '#1e293b',
      stealthFacets: true,
      hasHelipad: false,
    }
  },
  {
    id: 'carrier-corvette',
    name: 'Centurion Strike Drone Corvette',
    type: 'Multi-Mission Strike Corvette',
    hullClass: 'FSG',
    description: 'Balanced modern combatant with an extended aft helipad/drone deck, VLS missile cells, and heavy point defense.',
    hullLength: 90,
    hullWidth: 32,
    baseHp: 800,
    baseSpeed: 85,
    baseTurnRate: 1.10,
    baseArmor: 20,
    hardpoints: [
      { id: 'hp-bow-gun', name: 'Bow 76mm Rapid Gun', x: 0.70, y: 0, allowedArc: 'bow', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-port-missile', name: 'Port Harpoon Tube', x: 0.15, y: -0.65, allowedArc: 'broadside-left', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-star-missile', name: 'Starboard Harpoon Tube', x: 0.15, y: 0.65, allowedArc: 'broadside-right', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-vls-cell', name: 'VLS Swarm Cell', x: -0.15, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-aft-dc', name: 'Damage Control Center', x: -0.60, y: 0, allowedArc: 'stern', defaultComponentId: 'auto-damage-control' },
    ],
    svgHullPath: 'M 45,0 L 32,-13 L -28,-14 L -42,-10 L -45,-6 L -45,6 L -42,10 L -28,14 L 32,13 Z',
    spriteStyle: {
      deckColor: '#1e293b',
      hullColor: '#525c68', // Haze Gray
      accentColor: '#78716c',
      details: '#334155',
      stealthFacets: true,
      hasHelipad: true,
    }
  },
  {
    id: 'dreadnought-battleship',
    name: 'Ironclad Dreadnought',
    type: 'Heavy Fleet Battleship',
    hullClass: 'BB',
    description: 'Immense armored dreadnought with a wide beam, reinforced armored citadel, triple 16-inch naval artillery, and unmatched durability.',
    hullLength: 136,
    hullWidth: 44,
    baseHp: 1800,
    baseSpeed: 64,
    baseTurnRate: 0.58,
    baseArmor: 42,
    hardpoints: [
      { id: 'hp-bow-triple', name: 'Turret Anton (Bow Triple 16")', x: 0.78, y: 0, allowedArc: 'bow', defaultComponentId: 'triple-naval-turret' },
      { id: 'hp-fwd-super', name: 'Turret Bruno (Superfiring 16")', x: 0.52, y: 0, allowedArc: 'bow', defaultComponentId: 'triple-naval-turret' },
      { id: 'hp-port-broadside', name: 'Port Secondary Battery', x: 0.08, y: -0.72, allowedArc: 'broadside-left', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-starboard-broadside', name: 'Starboard Secondary Battery', x: 0.08, y: 0.72, allowedArc: 'broadside-right', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-mid-aa', name: 'Superstructure Flak Battery', x: -0.15, y: 0, allowedArc: 'all', defaultComponentId: 'phalanx-ciws' },
      { id: 'hp-aft-triple', name: 'Turret Caesar (Aft Triple 16")', x: -0.56, y: 0, allowedArc: 'all', defaultComponentId: 'triple-naval-turret' },
      { id: 'hp-stern-belt', name: 'Armored Citadel Bulkhead', x: -0.80, y: 0, allowedArc: 'stern', defaultComponentId: 'composite-armor' },
    ],
    svgHullPath: 'M 68,0 C 58,-12 38,-20 -20,-22 C -52,-22 -64,-16 -68,-8 L -68,8 C -64,16 -52,22 -20,22 C 38,20 58,12 68,0 Z',
    spriteStyle: {
      deckColor: '#574635', // Weathered Teak deck
      hullColor: '#38424d', // Battleship Dark Slate
      accentColor: '#1c1917', // Black boot-topping
      details: '#292524',
      stealthFacets: false,
      hasHelipad: false,
    }
  },
  {
    id: 'catamaran-wavepiercer',
    name: 'Spearhead Fast Catamaran',
    type: 'High-Speed Wavepiercer (HSV)',
    hullClass: 'HSV',
    description: 'Wide twin-hull catamaran with exceptional open-water velocity, high lateral stability, and rapid missile firing sponsons.',
    hullLength: 88,
    hullWidth: 46,
    baseHp: 720,
    baseSpeed: 104,
    baseTurnRate: 1.35,
    baseArmor: 15,
    hardpoints: [
      { id: 'hp-bow-center', name: 'Center Rapid Autocannon', x: 0.68, y: 0, allowedArc: 'bow', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-port-hull-missile', name: 'Port Sponson Missile', x: 0.12, y: -0.75, allowedArc: 'broadside-left', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-star-hull-missile', name: 'Starboard Sponson Missile', x: 0.12, y: 0.75, allowedArc: 'broadside-right', defaultComponentId: 'harpoon-missile' },
      { id: 'hp-mid-vls', name: 'Center Cross-Deck VLS', x: -0.15, y: 0, allowedArc: 'all', defaultComponentId: 'vls-tomahawk' },
      { id: 'hp-stern-waterjet', name: 'Twin Hydrojets Booster', x: -0.70, y: 0, allowedArc: 'stern', defaultComponentId: 'azipod-propulsor' },
    ],
    svgHullPath: 'M 44,-10 L 32,-22 L -34,-23 L -44,-15 L -44,-6 L 36,-6 Z M 44,10 L 32,22 L -34,23 L -44,15 L -44,6 L 36,6 Z M 20,-6 L -28,-6 L -28,6 L 20,6 Z',
    spriteStyle: {
      deckColor: '#1e293b',
      hullColor: '#525c68', // Naval Haze Gray
      accentColor: '#334155', // Slate trim
      details: '#0f172a',
      stealthFacets: true,
      hasHelipad: true,
    }
  },
  {
    id: 'monitor-ironclad',
    name: 'Goliath Coastal Monitor',
    type: 'Armored Coastal Monitor',
    hullClass: 'BM',
    description: 'Low-freeboard armored coastal gunboat featuring an ultra-heavy center revolving turret and ram bow for brutal close-quarters dominance.',
    hullLength: 84,
    hullWidth: 36,
    baseHp: 1100,
    baseSpeed: 62,
    baseTurnRate: 0.90,
    baseArmor: 40,
    hardpoints: [
      { id: 'hp-bow-ram', name: 'Reinforced Ram Bow Gun', x: 0.74, y: 0, allowedArc: 'bow', defaultComponentId: 'mk45-naval-gun' },
      { id: 'hp-center-turret', name: 'Center Armored Turret', x: 0.10, y: 0, allowedArc: 'all', defaultComponentId: 'triple-naval-turret' },
      { id: 'hp-port-torpedo', name: 'Port Torpedo Tube', x: -0.15, y: -0.65, allowedArc: 'broadside-left', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-star-torpedo', name: 'Starboard Torpedo Tube', x: -0.15, y: 0.65, allowedArc: 'broadside-right', defaultComponentId: 'mk48-torpedo' },
      { id: 'hp-stern-armor', name: 'Aft Citadel Plating', x: -0.65, y: 0, allowedArc: 'stern', defaultComponentId: 'composite-armor' },
    ],
    svgHullPath: 'M 42,0 L 28,-18 L -32,-18 L -42,-12 L -42,12 L -32,18 L 28,18 Z',
    spriteStyle: {
      deckColor: '#383f48',
      hullColor: '#5c2d28', // Anti-Fouling Red Oxide / Rusted Iron
      accentColor: '#262626', // Iron belt
      details: '#1c1917',
      stealthFacets: false,
      hasHelipad: false,
    }
  }
];

export const SHIP_MODEL_MAP = new Map<string, BaseShipModel>(
  BASE_SHIPS.map(m => [m.id, m])
);
