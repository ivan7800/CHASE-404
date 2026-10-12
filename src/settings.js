/** Accessibility and performance preferences: versioned, bounded, local-only. */
export const SETTINGS_KEY='chase404.settings.v7';
export const DEFAULT_BINDINGS=Object.freeze({throttle:'KeyW',brake:'KeyS',left:'KeyA',right:'KeyD',handbrake:'Space'});
// Interaction shortcuts E/I/J/X are global in Barcelona and must never be rebound.
// Older profiles using them are sanitized to the default driving layout on read.
export const BINDABLE_CODES=Object.freeze(['KeyW','KeyA','KeyS','KeyD','KeyK','KeyL','KeyQ','KeyZ','Space','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
const RESERVED=['KeyP','Escape','KeyR','KeyG','KeyM','KeyH','KeyO'];
export const DEFAULT_SETTINGS=Object.freeze({version:1,contrast:false,reducedMotion:false,hudScale:100,quality:'auto',steeringSensitivity:100,audioVolume:60,bindings:{...DEFAULT_BINDINGS}});
export function validateBindings(candidate){
 if(!candidate||typeof candidate!=='object')return false;
 const keys=Object.keys(DEFAULT_BINDINGS),values=keys.map(k=>candidate[k]);
 return values.every(x=>typeof x==='string'&&BINDABLE_CODES.includes(x)&&!RESERVED.includes(x))&&new Set(values).size===values.length;
}
export function normalizeSettings(raw){
 const s=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const quality=['auto','high','medium','eco'].includes(s.quality)?s.quality:'auto';
 const hudScale=[90,100,110,120].includes(s.hudScale)?s.hudScale:100;
 const steeringSensitivity=[75,100,125].includes(s.steeringSensitivity)?s.steeringSensitivity:100;
 const audioVolume=[0,25,50,60,75,100].includes(s.audioVolume)?s.audioVolume:60;
 return {version:1,contrast:s.contrast===true,reducedMotion:s.reducedMotion===true,hudScale,quality,steeringSensitivity,audioVolume,bindings:validateBindings(s.bindings)?{...s.bindings}:{...DEFAULT_BINDINGS}};
}
export function readSettings(storage){try{return normalizeSettings(JSON.parse(storage.getItem(SETTINGS_KEY)||'null'));}catch{return normalizeSettings(null);}}
export function saveSettings(storage,settings){try{storage.setItem(SETTINGS_KEY,JSON.stringify(normalizeSettings(settings)));return true;}catch{return false;}}
export function actionForKey(code,bindings){
 for(const [action,bound] of Object.entries(bindings))if(code===bound)return action;
 // Arrow keys are convenient fallbacks if not used for another action.
 const arrows={ArrowUp:'throttle',ArrowDown:'brake',ArrowLeft:'left',ArrowRight:'right'};
 if(!(Object.values(bindings).includes(code)))return arrows[code]||null;
 return null;
}
export function qualityScale(quality){return {high:1,medium:.78,eco:.55}[quality]??1;}
/** Delayed hysteresis so a slow second doesn't oscillate resolution. */
export class AutoQuality{
 constructor(){this.scale=1;this.low=0;this.high=0;this.cooldown=0;}
 observe(fps,dt,active=true){
  if(!active||!Number.isFinite(fps)||fps<=0||!Number.isFinite(dt)||dt<=0)return this.scale;
  dt=Math.min(.25,dt);this.cooldown=Math.max(0,this.cooldown-dt);
  this.low=fps<45?this.low+dt:Math.max(0,this.low-dt*2);
  this.high=fps>57?this.high+dt:Math.max(0,this.high-dt);
  if(this.cooldown>0)return this.scale;
  if(this.low>=3.5&&this.scale>.55){this.scale=this.scale===1?.78:.55;this.low=0;this.high=0;this.cooldown=9;}
  else if(this.high>=14&&this.scale<1){this.scale=this.scale===.55?.78:1;this.low=0;this.high=0;this.cooldown=9;}
  return this.scale;
 }
 reset(){this.low=0;this.high=0;this.cooldown=0;this.scale=1;}
}
