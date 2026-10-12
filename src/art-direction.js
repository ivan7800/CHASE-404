/** Fase 11.5 — proportions and shared material language for fictional Barcelona 1984. */
export const ART_SCALE=Object.freeze({humanHeight:2.10,doorHeight:3.05,doorWidth:1.95,doorThreshold:.16});
export const ART_PALETTE=Object.freeze({
 iron:Object.freeze([63,68,68]),
 stone:Object.freeze([135,123,105]),
 agedStone:Object.freeze([151,134,112]),
 darkDoor:Object.freeze([48,56,56]),
 ceramic:Object.freeze([74,117,115]),
 ochre:Object.freeze([197,169,108]),
 awningGreen:Object.freeze([101,117,100]),
 carmelDoor:Object.freeze([64,78,83]),
 windowFrame:Object.freeze([118,104,86]),
 windowLedge:Object.freeze([206,195,162]),
});
export function architecturalScaleValid(height,width){return Number.isFinite(height)&&Number.isFinite(width)&&height>=ART_SCALE.humanHeight*1.25&&height<=ART_SCALE.humanHeight*1.65&&width>=ART_SCALE.humanHeight*.8&&width<=ART_SCALE.humanHeight*1.2;}
