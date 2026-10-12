/** CHASE 404 · Fase 6.5. Pure rendering/audio budgets, no timing side effects.
 * LOD only removes distant cosmetics; physics and collisions remain untouched.
 */
export const AUDIO_UPDATE_INTERVAL=1/30;
export function shouldUpdateAudio(last,current,interval=AUDIO_UPDATE_INTERVAL){
 if(!Number.isFinite(current))return false;
 return !Number.isFinite(last)||current<last||current-last>=interval-1e-6;
}
export function rivalDrawPlan(distanceSquared,quality=1){
 if(!Number.isFinite(distanceSquared)||distanceSquared<0)return 'hidden';
 if(distanceSquared>1100*1100)return 'hidden';
 const q=Math.min(1,Math.max(.5,Number.isFinite(quality)?quality:1));
 // HIGH retains complete wheel/shadow fidelity for all visible opponents.
 const detailRadius=q>=.95?Infinity:q>=.7?210:110;
 return distanceSquared>detailRadius*detailRadius?'body':'full';
}
export function renderResolution(cssWidth,cssHeight,devicePixelRatio=1,quality=1){
 const width=Math.max(1,Number(cssWidth)||1),height=Math.max(1,Number(cssHeight)||1);
 const scale=Math.min(1,Math.max(.5,Number.isFinite(quality)?quality:1));
 let dpr=Math.min(1.6,Math.max(1,Number(devicePixelRatio)||1))*scale;
 // High-DPI screens should not allocate unbounded renderbuffers.
 const budget=scale>=.95?2500000:scale>=.7?1200000:750000;
 const pixels=width*height*dpr*dpr;
 if(pixels>budget)dpr*=Math.sqrt(budget/pixels);
 return {width:Math.max(1,Math.floor(width*dpr)),height:Math.max(1,Math.floor(height*dpr))};
}

/** Find the closest entity without constructing temporary arrays or square roots per entity.
 * Only active police units count; plain vehicle arrays can be scanned without filtering.
 */
export function nearestEntityDistance(entities,x,z,{police=false}={}){
 let best=Infinity;
 if(!entities)return best;
 for(const item of entities){
  if(police&&(!item?.active||!item.agent))continue;
  const target=police?item.agent:item;
  if(!Number.isFinite(target?.x)||!Number.isFinite(target?.z))continue;
  const dx=target.x-x,dz=target.z-z,squared=dx*dx+dz*dz;
  if(squared<best)best=squared;
 }
 return Math.sqrt(best);
}
