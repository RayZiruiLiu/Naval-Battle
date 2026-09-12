/**
 * Precise 2D polygon collision and intersection utilities.
 * Ensures ship hulls, projectiles, and AI pathfinding interact with the
 * exact visible geometry of map obstacles, rather than circular approximations.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface EdgeDistanceResult {
  distance: number;
  closestX: number;
  closestY: number;
  normalX: number;
  normalY: number;
  isInside: boolean;
}

/**
 * Standard ray-casting point-in-polygon test
 */
export function isPointInPolygon(px: number, py: number, polygon: Point2D[]): boolean {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = ((yi > py) !== (yj > py)) &&
      (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Calculates the shortest distance from a point to a line segment [a, b].
 */
export function distancePointToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): { dist: number; closestX: number; closestY: number; nx: number; ny: number } {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;

  if (lenSq < 0.0001) {
    const d = Math.hypot(px - ax, py - ay);
    return {
      dist: d,
      closestX: ax,
      closestY: ay,
      nx: d > 0.001 ? (px - ax) / d : 0,
      ny: d > 0.001 ? (py - ay) / d : 1,
    };
  }

  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = ax + t * dx;
  const closestY = ay + t * dy;
  const dist = Math.hypot(px - closestX, py - closestY);

  let nx = 0;
  let ny = 0;
  if (dist > 0.001) {
    nx = (px - closestX) / dist;
    ny = (py - closestY) / dist;
  } else {
    // Normal perpendicular to segment
    const edgeLen = Math.sqrt(lenSq);
    nx = -dy / edgeLen;
    ny = dx / edgeLen;
  }

  return { dist, closestX, closestY, nx, ny };
}

/**
 * Calculates the exact distance and outward push normal from a point to a polygon.
 */
export function getPointPolygonDistance(px: number, py: number, polygon: Point2D[]): EdgeDistanceResult {
  const inside = isPointInPolygon(px, py, polygon);
  let minDist = Infinity;
  let bestClosestX = px;
  let bestClosestY = py;
  let bestNx = 0;
  let bestNy = 1;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ax = polygon[j].x;
    const ay = polygon[j].y;
    const bx = polygon[i].x;
    const by = polygon[i].y;

    const res = distancePointToSegment(px, py, ax, ay, bx, by);
    if (res.dist < minDist) {
      minDist = res.dist;
      bestClosestX = res.closestX;
      bestClosestY = res.closestY;
      bestNx = res.nx;
      bestNy = res.ny;
    }
  }

  if (inside) {
    // If inside, normal must point outward away from polygon center
    return {
      distance: -minDist,
      closestX: bestClosestX,
      closestY: bestClosestY,
      normalX: bestNx,
      normalY: bestNy,
      isInside: true,
    };
  }

  return {
    distance: minDist,
    closestX: bestClosestX,
    closestY: bestClosestY,
    normalX: bestNx,
    normalY: bestNy,
    isInside: false,
  };
}

/**
 * Tests collision between an elongated ship hull and an obstacle polygon.
 * Returns the exact push vector needed to resolve intersection.
 */
export function checkShipPolygonCollision(
  shipX: number,
  shipY: number,
  shipAngle: number,
  hullLength: number,
  hullWidth: number,
  polygon: Point2D[]
): { collided: boolean; pushX: number; pushY: number; contactX: number; contactY: number } {
  if (!polygon || polygon.length < 3) {
    return { collided: false, pushX: 0, pushY: 0, contactX: 0, contactY: 0 };
  }

  const cos = Math.cos(shipAngle);
  const sin = Math.sin(shipAngle);
  const halfLen = hullLength * 0.48;
  const hullRadius = Math.max(14, hullWidth * 0.45);

  // Sample probe points along ship keel (Bow, Mid-Bow, Center, Mid-Stern, Stern)
  const probeOffsets = [
    halfLen,            // Bow tip
    halfLen * 0.5,      // Forward deck
    0,                  // Center
    -halfLen * 0.5,     // Aft deck
    -halfLen,           // Stern
  ];

  let maxPenetration = 0;
  let bestPushX = 0;
  let bestPushY = 0;
  let contactX = shipX;
  let contactY = shipY;
  let hasCollision = false;

  for (const offset of probeOffsets) {
    const probeX = shipX + cos * offset;
    const probeY = shipY + sin * offset;

    const result = getPointPolygonDistance(probeX, probeY, polygon);

    if (result.isInside) {
      hasCollision = true;
      const pen = Math.abs(result.distance) + hullRadius;
      if (pen > maxPenetration) {
        maxPenetration = pen;
        bestPushX = result.normalX * pen;
        bestPushY = result.normalY * pen;
        contactX = result.closestX;
        contactY = result.closestY;
      }
    } else if (result.distance < hullRadius) {
      hasCollision = true;
      const pen = hullRadius - result.distance;
      if (pen > maxPenetration) {
        maxPenetration = pen;
        bestPushX = result.normalX * pen;
        bestPushY = result.normalY * pen;
        contactX = result.closestX;
        contactY = result.closestY;
      }
    }
  }

  return {
    collided: hasCollision,
    pushX: bestPushX,
    pushY: bestPushY,
    contactX,
    contactY,
  };
}

/**
 * Checks if a line segment (e.g. projectile step or LOS check) intersects a polygon.
 */
export function checkSegmentPolygonIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  polygon: Point2D[]
): { hit: boolean; hitX: number; hitY: number } | null {
  if (!polygon || polygon.length < 3) return null;

  // Check if destination is inside polygon
  if (isPointInPolygon(x2, y2, polygon)) {
    return { hit: true, hitX: x2, hitY: y2 };
  }

  // Check intersection with each polygon edge
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const x3 = polygon[j].x;
    const y3 = polygon[j].y;
    const x4 = polygon[i].x;
    const y4 = polygon[i].y;

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (Math.abs(denom) < 0.0001) continue;

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return {
        hit: true,
        hitX: x1 + ua * (x2 - x1),
        hitY: y1 + ua * (y2 - y1),
      };
    }
  }

  return null;
}
