/** Actores contextuales de las misiones finales; no alteran objetivos ni colisiones. */
export const STORY_ACTORS = Object.freeze({
 brother: Object.freeze({id:'brother',name:'HERMANO DE GAEL',x:-875,z:-555}),
 salvat: Object.freeze({id:'salvat',name:'VÍCTOR SALVAT',x:-250,z:48})
});
/** Se muestran solo cuando están presentes en la historia. El rescate los retira del muelle. */
export function visibleStoryActors(chapter,index,phase,finalChoice){
 if(phase!=='active')return [];
 if(chapter===14){
  // Antes de tomar la decisión, el hermano permanece cautivo en el muelle;
  // en la ruta de rescate desaparece al terminar el objetivo correspondiente.
  return index<=2?[STORY_ACTORS.brother]:[];
 }
 if(chapter===15){
  // Solo aparece cautivo si Gael eligió las pruebas en la misión anterior.
  const captive=finalChoice==='RECUPERAR LAS PRUEBAS'&&index===0;
  return [...(captive?[STORY_ACTORS.brother]:[]),...(index>=2?[STORY_ACTORS.salvat]:[])];
 }
 return [];
}
export function storyActorPose(time,kind,reducedMotion=false){
 if(reducedMotion)return {bob:0,head:0,leftArm:0,rightArm:0};
 const t=Number.isFinite(time)?time:0;
 return {bob:Math.sin(t*1.5+(kind==='salvat'?1:0))*.012,
  head:Math.sin(t*.8)*.08,
  leftArm:Math.sin(t*1.1)*.075,
  rightArm:Math.sin(t*1.1+1)*.075};
}
