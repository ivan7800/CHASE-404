/** CHASE 404 · Fase 6.1. Three deterministic, local-only lighting looks.
 * These presets change presentation, not simulation time or mission timing.
 * Color channels and shader inputs are normalized [0,1].
 */
export const LIGHTING_KEY='chase404.lighting.v1';
export const LIGHTING_PRESETS=Object.freeze([
 Object.freeze({id:'day',label:'DÍA',sky:Object.freeze([.56,.73,.77]),sun:Object.freeze([.96,.91,.78]),direction:Object.freeze([-.44,.87,.23]),ambientLow:Object.freeze([.39,.48,.52]),ambientHigh:Object.freeze([.67,.69,.62]),sunPower:.82,exposure:1.03,fogStart:410,fogEnd:1080,fogStrength:.70,warmth:.02,lamps:0}),
 Object.freeze({id:'dusk',label:'ATARDECER',sky:Object.freeze([.70,.53,.48]),sun:Object.freeze([1.00,.68,.42]),direction:Object.freeze([-.76,.39,.35]),ambientLow:Object.freeze([.35,.36,.46]),ambientHigh:Object.freeze([.67,.55,.49]),sunPower:.93,exposure:1.07,fogStart:305,fogEnd:860,fogStrength:.86,warmth:.11,lamps:.28}),
 Object.freeze({id:'night',label:'NOCHE',sky:Object.freeze([.11,.19,.29]),sun:Object.freeze([.58,.70,.94]),direction:Object.freeze([.32,.83,-.38]),ambientLow:Object.freeze([.19,.27,.36]),ambientHigh:Object.freeze([.34,.40,.47]),sunPower:.30,exposure:.83,fogStart:190,fogEnd:680,fogStrength:.90,warmth:.03,lamps:.94})
]);
export const DEFAULT_LIGHTING='dusk';
export function normalizeLighting(value){return LIGHTING_PRESETS.some(x=>x.id===value)?value:DEFAULT_LIGHTING;}
export function getLighting(value){return LIGHTING_PRESETS.find(x=>x.id===normalizeLighting(value));}
export function nextLighting(value){const i=LIGHTING_PRESETS.findIndex(x=>x.id===normalizeLighting(value));return LIGHTING_PRESETS[(i+1)%LIGHTING_PRESETS.length].id;}
export function readLighting(storage){try{return normalizeLighting(storage.getItem(LIGHTING_KEY));}catch{return DEFAULT_LIGHTING;}}
export function saveLighting(storage,value){try{storage.setItem(LIGHTING_KEY,normalizeLighting(value));return true;}catch{return false;}}
