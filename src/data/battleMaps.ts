import { BattleIsland, BattleMapConfig } from '../types/ship';

function generatePolygon(
  cx: number,
  cy: number,
  radius: number,
  pointsCount: number,
  irregularity: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < pointsCount; i++) {
    const angle = (i / pointsCount) * Math.PI * 2;
    const r = radius * (1 - irregularity * 0.5 + Math.sin(angle * 3 + i * 2) * irregularity * 0.4);
    points.push({
      x: Math.round(cx + Math.cos(angle) * r),
      y: Math.round(cy + Math.sin(angle) * r),
    });
  }
  return points;
}

function generateElongatedIsland(
  cx: number,
  cy: number,
  lenX: number,
  lenY: number,
  angleRad: number,
  pointsCount: number = 14
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  for (let i = 0; i < pointsCount; i++) {
    const theta = (i / pointsCount) * Math.PI * 2;
    // Base ellipse with organic shoreline variation
    const rx = lenX * (0.88 + 0.12 * Math.sin(theta * 2 + 0.5));
    const ry = lenY * (0.88 + 0.12 * Math.cos(theta * 3));
    const rawX = Math.cos(theta) * rx;
    const rawY = Math.sin(theta) * ry;

    // Rotate and translate
    const rotX = rawX * cos - rawY * sin;
    const rotY = rawX * sin + rawY * cos;
    points.push({
      x: Math.round(cx + rotX),
      y: Math.round(cy + rotY),
    });
  }
  return points;
}

function generateBoxObstacle(x: number, y: number, w: number, h: number): { x: number; y: number }[] {
  const hw = Math.round(w / 2);
  const hh = Math.round(h / 2);
  return [
    { x: x - hw, y: y - hh },
    { x: x + hw, y: y - hh },
    { x: x + hw, y: y + hh },
    { x: x - hw, y: y + hh },
  ];
}

export const BATTLE_MAPS: BattleMapConfig[] = [
  {
    id: 'solomon-atoll',
    name: 'Solomon Archipelago',
    theme: 'Tropical Coral Reefs & Sand Spits',
    description: 'A winding diagonal barrier chain of tropical sand atolls, shallow coral reefs, and palm islets dividing the theater into North Strait and South Bay.',
    waterColors: {
      deep: '#042f2e',
      mid: '#0f766e',
      surface: '#0d9488',
      wave: 'rgba(94, 234, 212, 0.24)',
      boundary: 'rgba(45, 212, 191, 0.5)',
    },
    islandStyle: 'sand',
    ambientWeather: 'clear',
    obstacles: [
      // Diagonal central archipelago chain
      {
        x: 1050,
        y: 700,
        radius: 110,
        points: generateElongatedIsland(1050, 700, 140, 75, -0.45),
        style: 'sand',
        foliage: [
          { x: 1030, y: 690, radius: 20, color: '#16a34a', type: 'tree' },
          { x: 1070, y: 710, radius: 18, color: '#15803d', type: 'tree' },
          { x: 1000, y: 720, radius: 15, color: '#22c55e', type: 'tree' },
        ]
      },
      {
        x: 1300,
        y: 1000,
        radius: 105,
        points: generatePolygon(1300, 1000, 105, 12, 0.35),
        style: 'sand',
        foliage: [
          { x: 1280, y: 980, radius: 22, color: '#15803d', type: 'tree' },
          { x: 1320, y: 1010, radius: 20, color: '#16a34a', type: 'tree' },
          { x: 1300, y: 1030, radius: 16, color: '#14532d', type: 'tree' },
        ]
      },
      {
        x: 1550,
        y: 1300,
        radius: 115,
        points: generateElongatedIsland(1550, 1300, 145, 80, -0.4),
        style: 'sand',
        foliage: [
          { x: 1530, y: 1290, radius: 22, color: '#16a34a', type: 'tree' },
          { x: 1570, y: 1315, radius: 19, color: '#15803d', type: 'tree' },
        ]
      },
      // Flanking reef islets
      {
        x: 820,
        y: 1550,
        radius: 70,
        points: generatePolygon(820, 1550, 70, 9, 0.3),
        style: 'sand',
        foliage: [
          { x: 820, y: 1550, radius: 16, color: '#22c55e', type: 'tree' }
        ]
      },
      {
        x: 1780,
        y: 450,
        radius: 70,
        points: generatePolygon(1780, 450, 70, 9, 0.3),
        style: 'sand',
        foliage: [
          { x: 1780, y: 450, radius: 16, color: '#15803d', type: 'tree' }
        ]
      }
    ]
  },
  {
    id: 'gibraltar-base',
    name: 'Gibraltar Bastion Harbor',
    theme: 'Fortified Sea Walls & Concrete Jetties',
    description: 'Heavily fortified naval stronghold with precision concrete breakwaters, navigation buoys, defensive bunkers, and narrow fortified ship lanes.',
    waterColors: {
      deep: '#082f49',
      mid: '#0c4a6e',
      surface: '#0284c7',
      wave: 'rgba(125, 211, 252, 0.20)',
      boundary: 'rgba(56, 189, 248, 0.50)',
    },
    islandStyle: 'harbor',
    ambientWeather: 'harbor',
    obstacles: [
      // North Pier Breakwater
      {
        x: 1300,
        y: 420,
        radius: 120,
        points: generateBoxObstacle(1300, 420, 440, 90),
        style: 'harbor',
        foliage: [
          { x: 1100, y: 420, radius: 14, color: '#eab308', type: 'buoy' },
          { x: 1300, y: 420, radius: 24, color: '#475569', type: 'bunker' },
          { x: 1500, y: 420, radius: 14, color: '#38bdf8', type: 'buoy' },
        ]
      },
      // South Pier Breakwater
      {
        x: 1300,
        y: 1580,
        radius: 120,
        points: generateBoxObstacle(1300, 1580, 440, 90),
        style: 'harbor',
        foliage: [
          { x: 1100, y: 1580, radius: 14, color: '#eab308', type: 'buoy' },
          { x: 1300, y: 1580, radius: 24, color: '#475569', type: 'bunker' },
          { x: 1500, y: 1580, radius: 14, color: '#f43f5e', type: 'buoy' },
        ]
      },
      // Center Fortress Island Bastion
      {
        x: 1300,
        y: 1000,
        radius: 95,
        points: [
          { x: 1220, y: 920 },
          { x: 1380, y: 920 },
          { x: 1410, y: 1000 },
          { x: 1380, y: 1080 },
          { x: 1220, y: 1080 },
          { x: 1190, y: 1000 },
        ],
        style: 'harbor',
        foliage: [
          { x: 1300, y: 1000, radius: 28, color: '#334155', type: 'bunker' },
          { x: 1230, y: 940, radius: 12, color: '#38bdf8', type: 'buoy' },
          { x: 1370, y: 1060, radius: 12, color: '#f43f5e', type: 'buoy' },
        ]
      },
      // West channel marker jetty
      {
        x: 820,
        y: 1000,
        radius: 60,
        points: generateBoxObstacle(820, 1000, 75, 150),
        style: 'harbor',
        foliage: [
          { x: 820, y: 940, radius: 10, color: '#38bdf8', type: 'buoy' },
          { x: 820, y: 1060, radius: 10, color: '#38bdf8', type: 'buoy' },
        ]
      },
      // East channel marker jetty
      {
        x: 1780,
        y: 1000,
        radius: 60,
        points: generateBoxObstacle(1780, 1000, 75, 150),
        style: 'harbor',
        foliage: [
          { x: 1780, y: 940, radius: 10, color: '#f43f5e', type: 'buoy' },
          { x: 1780, y: 1060, radius: 10, color: '#f43f5e', type: 'buoy' },
        ]
      }
    ]
  },
  {
    id: 'arctic-shelf',
    name: 'Barents Frozen Fjord',
    theme: 'Glacial Ice Shelves & Drifting Pack Ice',
    description: 'Towering jagged glacial shelves extending from northern and southern fjords, funneling warships into a freezing strait filled with drifting ice floes.',
    waterColors: {
      deep: '#092131',
      mid: '#0c354d',
      surface: '#0369a1',
      wave: 'rgba(224, 242, 254, 0.28)',
      boundary: 'rgba(186, 230, 253, 0.60)',
    },
    islandStyle: 'ice',
    ambientWeather: 'snow',
    obstacles: [
      // Northern Ice Peninsula
      {
        x: 1300,
        y: 280,
        radius: 180,
        points: [
          { x: 1020, y: 40 },
          { x: 1200, y: 220 },
          { x: 1300, y: 450 },
          { x: 1400, y: 240 },
          { x: 1580, y: 60 },
          { x: 1580, y: 0 },
          { x: 1020, y: 0 },
        ],
        style: 'ice',
        foliage: [
          { x: 1300, y: 380, radius: 24, color: '#f0f9ff', type: 'ice' },
          { x: 1230, y: 250, radius: 28, color: '#e0f2fe', type: 'ice' },
          { x: 1380, y: 260, radius: 26, color: '#bae6fd', type: 'ice' },
        ]
      },
      // Southern Ice Peninsula
      {
        x: 1300,
        y: 1720,
        radius: 180,
        points: [
          { x: 1020, y: 1960 },
          { x: 1190, y: 1770 },
          { x: 1300, y: 1550 },
          { x: 1410, y: 1760 },
          { x: 1580, y: 1940 },
          { x: 1580, y: 2000 },
          { x: 1020, y: 2000 },
        ],
        style: 'ice',
        foliage: [
          { x: 1300, y: 1620, radius: 24, color: '#f0f9ff', type: 'ice' },
          { x: 1240, y: 1750, radius: 28, color: '#e0f2fe', type: 'ice' },
          { x: 1370, y: 1740, radius: 26, color: '#bae6fd', type: 'ice' },
        ]
      },
      // Drifting iceberg cluster in the sound
      {
        x: 1020,
        y: 1000,
        radius: 75,
        points: generatePolygon(1020, 1000, 75, 8, 0.45),
        style: 'ice',
        foliage: [
          { x: 1020, y: 1000, radius: 22, color: '#f0f9ff', type: 'ice' }
        ]
      },
      {
        x: 1580,
        y: 1000,
        radius: 75,
        points: generatePolygon(1580, 1000, 75, 8, 0.45),
        style: 'ice',
        foliage: [
          { x: 1580, y: 1000, radius: 22, color: '#f0f9ff', type: 'ice' }
        ]
      },
      {
        x: 1300,
        y: 1000,
        radius: 55,
        points: generatePolygon(1300, 1000, 55, 7, 0.35),
        style: 'ice',
        foliage: [
          { x: 1300, y: 1000, radius: 18, color: '#bae6fd', type: 'ice' }
        ]
      }
    ]
  },
  {
    id: 'bermuda-rift',
    name: 'Bermuda Volcanic Rift',
    theme: 'Basalt Caldera & Glowing Magma Fissures',
    description: 'An active submerged caldera with glowing incandescent magma cracks, steaming fissure vents, and sharp obsidian sea-stacks framing a sunken crater.',
    waterColors: {
      deep: '#140c11',
      mid: '#23151f',
      surface: '#3b1d28',
      wave: 'rgba(249, 115, 22, 0.26)',
      boundary: 'rgba(239, 68, 68, 0.60)',
    },
    islandStyle: 'volcano',
    ambientWeather: 'magma',
    obstacles: [
      // Ring of 6 Basalt Sea Stacks forming the caldera
      {
        x: 1300,
        y: 560,
        radius: 85,
        points: generatePolygon(1300, 560, 85, 9, 0.45),
        style: 'volcano',
        foliage: [
          { x: 1300, y: 560, radius: 22, color: '#ea580c', type: 'vent' }
        ]
      },
      {
        x: 1690,
        y: 780,
        radius: 80,
        points: generatePolygon(1690, 780, 80, 9, 0.4),
        style: 'volcano',
        foliage: [
          { x: 1690, y: 780, radius: 20, color: '#f97316', type: 'vent' }
        ]
      },
      {
        x: 1690,
        y: 1220,
        radius: 80,
        points: generatePolygon(1690, 1220, 80, 9, 0.4),
        style: 'volcano',
        foliage: [
          { x: 1690, y: 1220, radius: 20, color: '#f97316', type: 'vent' }
        ]
      },
      {
        x: 1300,
        y: 1440,
        radius: 85,
        points: generatePolygon(1300, 1440, 85, 9, 0.45),
        style: 'volcano',
        foliage: [
          { x: 1300, y: 1440, radius: 22, color: '#ea580c', type: 'vent' }
        ]
      },
      {
        x: 910,
        y: 1220,
        radius: 80,
        points: generatePolygon(910, 1220, 80, 9, 0.4),
        style: 'volcano',
        foliage: [
          { x: 910, y: 1220, radius: 20, color: '#f97316', type: 'vent' }
        ]
      },
      {
        x: 910,
        y: 780,
        radius: 80,
        points: generatePolygon(910, 780, 80, 9, 0.4),
        style: 'volcano',
        foliage: [
          { x: 910, y: 780, radius: 20, color: '#f97316', type: 'vent' }
        ]
      },
      // Central dormant caldera spire
      {
        x: 1300,
        y: 1000,
        radius: 65,
        points: generatePolygon(1300, 1000, 65, 8, 0.35),
        style: 'volcano',
        foliage: [
          { x: 1300, y: 1000, radius: 24, color: '#dc2626', type: 'vent' }
        ]
      }
    ]
  },
  {
    id: 'cyclone-tempest',
    name: 'Typhoon Tempest Strait',
    theme: 'Hurricane Squall & Turbulent Swells',
    description: 'A violent storm-tossed sound with driving slanted rain, sudden lightning flashes illuminating black cresting waves, and jagged windward breakwater reefs.',
    waterColors: {
      deep: '#061320',
      mid: '#0f2742',
      surface: '#1e3a5f',
      wave: 'rgba(255, 255, 255, 0.38)',
      boundary: 'rgba(96, 165, 250, 0.65)',
    },
    islandStyle: 'rock',
    ambientWeather: 'storm',
    obstacles: [
      // Jagged storm reefs
      {
        x: 1100,
        y: 650,
        radius: 110,
        points: generatePolygon(1100, 650, 110, 10, 0.5),
        style: 'rock',
        foliage: [
          { x: 1100, y: 650, radius: 22, color: '#334155', type: 'bunker' }
        ]
      },
      {
        x: 1500,
        y: 1350,
        radius: 110,
        points: generatePolygon(1500, 1350, 110, 10, 0.5),
        style: 'rock',
        foliage: [
          { x: 1500, y: 1350, radius: 22, color: '#334155', type: 'bunker' }
        ]
      },
      {
        x: 1300,
        y: 1000,
        radius: 80,
        points: generatePolygon(1300, 1000, 80, 8, 0.4),
        style: 'rock',
        foliage: [
          { x: 1300, y: 1000, radius: 18, color: '#475569', type: 'bunker' }
        ]
      },
      {
        x: 750,
        y: 1250,
        radius: 65,
        points: generatePolygon(750, 1250, 65, 7, 0.4),
        style: 'rock',
        foliage: [
          { x: 750, y: 1250, radius: 14, color: '#38bdf8', type: 'buoy' }
        ]
      },
      {
        x: 1850,
        y: 750,
        radius: 65,
        points: generatePolygon(1850, 750, 65, 7, 0.4),
        style: 'rock',
        foliage: [
          { x: 1850, y: 750, radius: 14, color: '#f43f5e', type: 'buoy' }
        ]
      }
    ]
  },
  {
    id: 'suez-passage',
    name: 'Suez Barrier Canal',
    theme: 'Engineered Canal & Rip-Rap Embankments',
    description: 'Twin engineered stone embankments divide the strait into three high-velocity corridors: North Channel, Main Dredged Trench, and South Narrows.',
    waterColors: {
      deep: '#064e3b',
      mid: '#047857',
      surface: '#10b981',
      wave: 'rgba(167, 243, 208, 0.22)',
      boundary: 'rgba(52, 211, 153, 0.50)',
    },
    islandStyle: 'sand',
    ambientWeather: 'clear',
    obstacles: [
      // Upper Sandbar Spit
      {
        x: 1300,
        y: 650,
        radius: 125,
        points: generateElongatedIsland(1300, 650, 480, 60, 0),
        style: 'sand',
        foliage: [
          { x: 1100, y: 650, radius: 16, color: '#15803d', type: 'tree' },
          { x: 1300, y: 650, radius: 18, color: '#16a34a', type: 'tree' },
          { x: 1500, y: 650, radius: 16, color: '#15803d', type: 'tree' },
        ]
      },
      // Lower Sandbar Spit
      {
        x: 1300,
        y: 1350,
        radius: 125,
        points: generateElongatedIsland(1300, 1350, 480, 60, 0),
        style: 'sand',
        foliage: [
          { x: 1100, y: 1350, radius: 16, color: '#15803d', type: 'tree' },
          { x: 1300, y: 1350, radius: 18, color: '#16a34a', type: 'tree' },
          { x: 1500, y: 1350, radius: 16, color: '#15803d', type: 'tree' },
        ]
      },
      // Entrance channel markers
      {
        x: 650,
        y: 1000,
        radius: 40,
        points: generatePolygon(650, 1000, 40, 6, 0.2),
        style: 'sand',
        foliage: [
          { x: 650, y: 1000, radius: 12, color: '#38bdf8', type: 'buoy' }
        ]
      },
      {
        x: 1950,
        y: 1000,
        radius: 40,
        points: generatePolygon(1950, 1000, 40, 6, 0.2),
        style: 'sand',
        foliage: [
          { x: 1950, y: 1000, radius: 12, color: '#f43f5e', type: 'buoy' }
        ]
      }
    ]
  },
  {
    id: 'malacca-dusk',
    name: 'Malacca Twilight Strait',
    theme: 'Nocturnal Stealth Waters & Lighthouses',
    description: 'A deep-indigo night theater illuminated by rhythmic rotating coastal lighthouses, glowing bioluminescent plankton wakes, and central navigation shoals.',
    waterColors: {
      deep: '#030712',
      mid: '#0f172a',
      surface: '#1e293b',
      wave: 'rgba(56, 189, 248, 0.24)',
      boundary: 'rgba(99, 102, 241, 0.55)',
    },
    islandStyle: 'rock',
    ambientWeather: 'dusk',
    obstacles: [
      // Central Shoal Reef
      {
        x: 1300,
        y: 1000,
        radius: 95,
        points: generatePolygon(1300, 1000, 95, 10, 0.35),
        style: 'rock',
        foliage: [
          { x: 1300, y: 1000, radius: 24, color: '#38bdf8', type: 'bunker' },
          { x: 1300, y: 1000, radius: 14, color: '#fbbf24', type: 'buoy' },
        ]
      },
      // Northern Watchtower Islet
      {
        x: 1300,
        y: 400,
        radius: 80,
        points: generatePolygon(1300, 400, 80, 8, 0.3),
        style: 'rock',
        foliage: [
          { x: 1300, y: 400, radius: 20, color: '#6366f1', type: 'bunker' },
          { x: 1300, y: 400, radius: 12, color: '#38bdf8', type: 'buoy' }
        ]
      },
      // Southern Watchtower Islet
      {
        x: 1300,
        y: 1600,
        radius: 80,
        points: generatePolygon(1300, 1600, 80, 8, 0.3),
        style: 'rock',
        foliage: [
          { x: 1300, y: 1600, radius: 20, color: '#6366f1', type: 'bunker' },
          { x: 1300, y: 1600, radius: 12, color: '#f43f5e', type: 'buoy' }
        ]
      },
      // Flanking coastal beacons
      {
        x: 750,
        y: 800,
        radius: 50,
        points: generatePolygon(750, 800, 50, 7, 0.25),
        style: 'rock',
        foliage: [
          { x: 750, y: 800, radius: 12, color: '#38bdf8', type: 'buoy' }
        ]
      },
      {
        x: 1850,
        y: 1200,
        radius: 50,
        points: generatePolygon(1850, 1200, 50, 7, 0.25),
        style: 'rock',
        foliage: [
          { x: 1850, y: 1200, radius: 12, color: '#f43f5e', type: 'buoy' }
        ]
      }
    ]
  }
];

export const BATTLE_MAP_MAP = new Map<string, BattleMapConfig>(
  BATTLE_MAPS.map(m => [m.id, m])
);
