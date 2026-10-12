/** Character-specific, accessible cinematic dialogue presentation. Pure and testable. */
const PROFILES=Object.freeze({
 manel:Object.freeze({name:'Manel Roca',initials:'MR',scene:'EL MECÁNICO DEL CARMEL'}),
 clara:Object.freeze({name:'Clara Vidal',initials:'CV',scene:'LA VOZ DE GRÀCIA'}),
 nuria:Object.freeze({name:'Núria Soler',initials:'NS',scene:'EL NEGATIVO DEL EIXAMPLE'})
});
export function dialoguePresentation(id,view='person',stage='new'){
 const person=Object.hasOwn(PROFILES,id)?PROFILES[id]:null;
 if(!person||view==='journal')return {character:'journal',initials:'BCN',mood:'journal',scene:'CUADERNO DE GAEL',portraitLabel:'Símbolo gráfico del archivo de contactos'};
 const mood=view==='evidence'?'evidence':stage==='done'?'resolved':stage==='found'?'decision':'conversation';
 const scene=view==='evidence'?'PISTA RECUPERADA':stage==='done'?'HISTORIA RESUELTA':stage==='found'?'UNA DECISIÓN PENDIENTE':person.scene;
 return {character:id,initials:person.initials,mood,scene,portraitLabel:`Retrato ilustrado estilizado de ${person.name}`};
}
