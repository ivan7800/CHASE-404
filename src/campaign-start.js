import { cityStartPose } from './city.js';
import { newMission, missionTargets } from './mission.js';
import { roadPath } from './road-network.js';

/** Place resumed chapters on the road shortly before their opening objective. */
export function campaignStartPose(chapter, finalChoice=null) {
  const origin = cityStartPose();
  if (chapter <= 1) return origin;
  const opening = missionTargets(newMission(chapter,null,finalChoice))[0];
  const route = roadPath(origin.x, origin.z, opening.x, opening.z);
  let setback = 58;
  for (let i = route.length - 1; i > 0; i--) {
    const a = route[i - 1], b = route[i];
    const dx = b.x - a.x, dz = b.z - a.z;
    const length = Math.hypot(dx, dz);
    if (length >= setback) {
      return { x: b.x - dx * setback / length, z: b.z - dz * setback / length, yaw: Math.atan2(dx, dz) };
    }
    setback -= length;
  }
  return origin;
}
