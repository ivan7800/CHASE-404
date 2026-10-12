/** HUD guidance for campaign and side activities, without modifying mission rules. */
export function objectivePresentation(target,index,total){
 if(!target||!Number.isInteger(index)||index<0||!Number.isInteger(total)||total<1)throw new TypeError('Invalid objective');
 const kind=target.kind||'drive';
 const instructions={
  'precision-drive':'CONDUCCIÓN PRECISA · Mantén la velocidad indicada dentro del área',
  'stakeout':'VIGILANCIA · Detén el vehículo y permanece en la zona',
  'tail':'SEGUIMIENTO · Mantén la distancia sin perder al objetivo',
  'evade':'EVASIÓN · Aléjate de las patrullas y mantén la distancia',
  'extract':'EXTRACCIÓN · Permanece en el coche y despista a las patrullas',
  'contact':'INTERACCIÓN · Baja del coche y permanece junto al contacto',
  'rescue':'RESCATE · Baja del coche y permanece junto al objetivo',
  'investigate':'INVESTIGACIÓN · Baja del coche y examina la prueba',
  'decision':'DECISIÓN · Baja del coche para completar la operación',
  'branch':'ELIGE RUTA · Dirígete a una de las dos alternativas',
  'drive':'CONDUCCIÓN · Sigue el destino señalado en el minimapa'
 };
 return {step:`OBJETIVO ${index+1} / ${total}`,title:String(target.name||'NUEVO OBJETIVO'),instruction:instructions[kind]||instructions.drive};
}
export function objectiveTransition(next,side=false){
 if(!next)return side?'DESAFÍO COMPLETADO':'OBJETIVO COMPLETADO';
 return (side?'NUEVO CONTROL · ':'NUEVO OBJETIVO · ')+String(next.name||'SIGUE LA RUTA');
}
