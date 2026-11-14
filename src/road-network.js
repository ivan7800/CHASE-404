/** Routes follow street segments, including junctions in the middle of a segment. */
import { CITY, nearestStreet } from './city.js';

const nodes = [];
const ids = new Map();
const segments = CITY.streets.map(line => line.slice(1).map((b, i) => {
  const a = line[i];
  return { a, dx: b[0] - a[0], dz: b[1] - a[1], splits: [0, 1], stops: [] };
}));
const allSegments = segments.flat();
const cross = (ax, az, bx, bz) => ax * bz - az * bx;
const tolerance = 1e-7;

function add(x, z) {
  const key = [x, z].map(n => Math.round(n * 1e5)).join(',');
  if (!ids.has(key)) {
    ids.set(key, nodes.length);
    nodes.push({ x, z, edges: [] });
  }
  return ids.get(key);
}

function connect(a, b) {
  if (a === b || nodes[a].edges.some(edge => edge.id === b)) return;
  const cost = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].z - nodes[b].z);
  nodes[a].edges.push({ id: b, cost });
  nodes[b].edges.push({ id: a, cost });
}

function splitAtJunction(a, b) {
  const x = b.a[0] - a.a[0], z = b.a[1] - a.a[1];
  const divisor = cross(a.dx, a.dz, b.dx, b.dz);
  if (Math.abs(divisor) < tolerance) {
    if (Math.abs(cross(x, z, a.dx, a.dz)) >= tolerance) return;
    for (const [first, second] of [[a, b], [b, a]]) {
      const len2 = first.dx ** 2 + first.dz ** 2;
      for (const t of [0, 1]) {
        const px = second.a[0] + second.dx * t - first.a[0];
        const pz = second.a[1] + second.dz * t - first.a[1];
        const u = (px * first.dx + pz * first.dz) / len2;
        if (u > tolerance && u < 1 - tolerance) first.splits.push(u);
      }
    }
    return;
  }
  const t = cross(x, z, b.dx, b.dz) / divisor;
  const u = cross(x, z, a.dx, a.dz) / divisor;
  if (t < -tolerance || t > 1 + tolerance || u < -tolerance || u > 1 + tolerance) return;
  a.splits.push(Math.max(0, Math.min(1, t)));
  b.splits.push(Math.max(0, Math.min(1, u)));
}

for (const [index, segment] of allSegments.entries()) {
  for (let j = index + 1; j < allSegments.length; j++) splitAtJunction(segment, allSegments[j]);
  for (const t of segment.splits.sort((a, b) => a - b)) {
    const id = add(segment.a[0] + segment.dx * t, segment.a[1] + segment.dz * t);
    if (segment.stops.at(-1)?.id === id) continue;
    if (segment.stops.length) connect(segment.stops.at(-1).id, id);
    segment.stops.push({ id, t });
  }
}

// Existing streets also join where their paved ends overlap.
for (let a = 0; a < nodes.length; a++) {
  for (let b = a + 1; b < nodes.length; b++) {
    const { x, z } = nodes[a], dx = nodes[b].x - x, dz = nodes[b].z - z;
    if (Math.hypot(dx, dz) > 15) continue;
    const probes = [.25, .5, .75].map(t => nearestStreet(x + dx * t, z + dz * t));
    if (probes.every(road => road.distance <= road.roadHalf)) connect(a, b);
  }
}

function endpoints(road) {
  const segment = segments[road.street][road.segment];
  const t = ((road.x - segment.a[0]) * segment.dx + (road.z - segment.a[1]) * segment.dz) /
    (segment.dx ** 2 + segment.dz ** 2);
  const right = segment.stops.findIndex(stop => stop.t >= t - tolerance);
  if (right <= 0) return [segment.stops[right < 0 ? segment.stops.length - 1 : 0].id];
  return [segment.stops[right - 1].id, segment.stops[right].id];
}

export function roadPath(fromX, fromZ, toX, toZ) {
  if (![fromX, fromZ, toX, toZ].every(Number.isFinite)) return [];
  const from = nearestStreet(fromX, fromZ), to = nearestStreet(toX, toZ);
  const point = ({ x, z }) => ({ x, z });
  if (from.street === to.street && from.segment === to.segment) return [point(from), point(to)];

  const distanceTo = (id, p) => Math.hypot(nodes[id].x - p.x, nodes[id].z - p.z);
  const costs = Array(nodes.length).fill(Infinity);
  const prev = Array(nodes.length).fill(-1);
  const pending = new Set(endpoints(from));
  const ends = endpoints(to);
  for (const id of pending) costs[id] = distanceTo(id, from);
  while (pending.size) {
    let current = -1;
    for (const id of pending) if (current < 0 || costs[id] < costs[current]) current = id;
    pending.delete(current);
    for (const edge of nodes[current].edges) {
      const next = costs[current] + edge.cost;
      if (next >= costs[edge.id]) continue;
      costs[edge.id] = next;
      prev[edge.id] = current;
      pending.add(edge.id);
    }
  }
  const end = ends.reduce((a, b) => costs[a] + distanceTo(a, to) <= costs[b] + distanceTo(b, to) ? a : b);
  if (!Number.isFinite(costs[end])) return [];
  const path = [point(to)];
  for (let id = end; id !== -1; id = prev[id]) path.push(point(nodes[id]));
  path.push(point(from));
  return path.reverse().filter((p, i, list) => !i || Math.hypot(p.x - list[i - 1].x, p.z - list[i - 1].z) > tolerance);
}

export function roadDistance(x, z) { return nearestStreet(x, z).distance; }
export function graphStats() {
  return { nodes: nodes.length, edges: nodes.reduce((sum, node) => sum + node.edges.length, 0) / 2 };
}
