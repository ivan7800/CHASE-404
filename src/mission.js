/** CHASE 404 · opening mission. Deterministic progression; independent of rendering. */
export const MISSION_POINTS=Object.freeze([
 Object.freeze({x:106,z:132,name:'TALLER DE GAEL',text:'Recoge la cinta en el taller.'}),
 Object.freeze({x:232,z:96,name:'CALLE ALTA',text:'Sube hasta el enlace de la calle Alta.'}),
 Object.freeze({x:240,z:-58,name:'CONTACTO DEL TURÓ',text:'Entrega la cinta antes de que lleguen.'})
]);
export const SECOND_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-250,z:48,name:'ENLACE DEL CARMEL',text:'Sigue el rastro del mensajero hacia Gràcia.'}),
 Object.freeze({x:-410,z:80,name:'CALLE DE GRÀCIA',text:'Encuentra la cabina junto a las fachadas antiguas.'}),
 Object.freeze({x:-535,z:115,name:'CONTACTO DE GRÀCIA',text:'Entrega el mensaje cifrado al contacto.'})
]);
export const THIRD_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-535,z:115,name:'SALIDA DE GRÀCIA',text:'Recoge el aviso del contacto y entra en la avenida.'}),
 Object.freeze({x:-700,z:115,name:'AVENIDA DEL EIXAMPLE',text:'Cruza el control discretamente: mantén entre 15 y 45 km/h durante 3 segundos cerca del objetivo, sin bajarte del coche.',kind:'precision-drive',hold:3,minKmh:15,maxKmh:45,radius:55}),
 Object.freeze({x:-875,z:-125,name:'ENTREGA EN EL EIXAMPLE',text:'Lleva las pruebas al buzón antes de que te encuentren.'})
]);
export const FOURTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-875,z:-125,name:'SALIDA DEL EIXAMPLE',text:'Sigue la pista de los almacenes hacia el puerto.'}),
 Object.freeze({x:-785,z:-340,name:'CONTROL DE ACCESO',text:'Encuentra la entrada de los muelles sin perder el paquete.'}),
 Object.freeze({x:-785,z:-555,name:'ALMACÉN 04',text:'Entrega las pruebas al contacto del almacén.'})
]);
export const FIFTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-875,z:-555,name:'MUELLES DEL PUERTO',text:'Abandona los muelles. Te esperan en la montaña.'}),
 Object.freeze({x:-1285,z:-525,name:'CURVAS DE MONTJUÏC',text:'Cruza el acceso de montaña y evita a las patrullas.'}),
 Object.freeze({x:-1390,z:-305,name:'CITA AL ANOCHECER',text:'Llega al mirador con las matrículas antes de que anochezca.'})
]);
export const SIXTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-1390,z:-305,name:'VIGILANCIA DEL MIRADOR',text:'Detén el vehículo y vigila el contacto durante 8 segundos.',kind:'stakeout',hold:8}),
 Object.freeze({x:-1285,z:-525,name:'RUTA DE ESCAPE',text:'Sal de Montjuïc sin levantar sospechas.'}),
 Object.freeze({x:-875,z:-555,name:'ENTREGA EN LOS MUELLES',text:'Regresa al puerto con la información del encuentro.'})
]);
export const SEVENTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-785,z:-555,name:'EL COCHE GRIS',text:'Localiza el sedán gris junto al almacén 04.'}),
 Object.freeze({x:-785,z:-450,name:'SEGUIMIENTO DISCRETO',text:'Mantén el sedán a la vista sin acercarte demasiado durante 14 segundos.',kind:'tail',hold:14}),
 Object.freeze({x:-875,z:-340,name:'PRUEBAS DEL CONVOY',text:'Entrega la matrícula del sospechoso junto al control.'})
]);
export const EIGHTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-785,z:-555,name:'TRAMPA EN LOS MUELLES',text:'Llega al almacén: la policía ha preparado una emboscada.'}),
 Object.freeze({x:-785,z:-230,name:'DOS RUTAS DE ESCAPE',text:'Escoge una salida: avenida oeste o calle de servicio este.',kind:'branch',alternatives:Object.freeze([{x:-875,z:-230,name:'AVENIDA OESTE'},{x:-700,z:-230,name:'CALLE DE SERVICIO'}])}),
 Object.freeze({x:-535,z:-5,name:'REFUGIO DE GRÀCIA',text:'Alcanza el refugio y mantén a las patrullas a más de 75 m durante 5 s.',kind:'evade',hold:5})
]);
// Tactical exits: the wide avenue is quick but demands losing police at longer range;
// the service street offers tighter cover, at the cost of a longer concealment period.
export const EIGHTH_WEST_ESCAPE=Object.freeze({x:-535,z:-5,name:'REFUGIO · AVENIDA OESTE',text:'Usa la velocidad de la avenida y mantén a las patrullas a más de 90 m durante 4 s.',kind:'evade',hold:4,safeDistance:90});
export const EIGHTH_EAST_ESCAPE=Object.freeze({x:-535,z:-5,name:'REFUGIO · CALLE DE SERVICIO',text:'Escóndete entre las calles: mantén a las patrullas a más de 65 m durante 7 s.',kind:'evade',hold:7,safeDistance:65});
export function eighthMissionPoints(routeChoice){return [EIGHTH_MISSION_POINTS[0],EIGHTH_MISSION_POINTS[1],routeChoice==='CALLE DE SERVICIO'?EIGHTH_EAST_ESCAPE:EIGHTH_WEST_ESCAPE];}
export const NINTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-535,z:-5,name:'REFUGIO DE GRÀCIA',text:'Contacta con la informante sin atraer a la patrulla.'}),
 Object.freeze({x:-700,z:115,name:'ENLACE DEL EIXAMPLE',text:'Cruza las avenidas y encuentra la identidad del policía corrupto.'}),
 Object.freeze({x:-875,z:-340,name:'CONTROL DEL PUERTO',text:'Entrega la documentación sobre el convoy.'})
]);
export const NINTH_WEST_POINT=Object.freeze({x:-875,z:-125,name:'ARCHIVO DE LA AVENIDA',text:'Tu huida por la avenida dejó testigos: recupera las fotos antes que la policía.'});
export const NINTH_EAST_POINT=Object.freeze({x:-785,z:-340,name:'ENLACE DE SERVICIO',text:'La calle de servicio expuso a un trabajador: recoge su declaración.'});
export function ninthMissionPoints(routeChoice){return [NINTH_MISSION_POINTS[0],routeChoice==='CALLE DE SERVICIO'?NINTH_EAST_POINT:NINTH_WEST_POINT,NINTH_MISSION_POINTS[2]];}
export const TENTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-535,z:-5,name:'REFUGIO DE LA INFORMANTE',text:'Baja del coche y habla con Clara durante 5 segundos.',kind:'contact',hold:5}),
 Object.freeze({x:-700,z:115,name:'CABINA DEL EIXAMPLE',text:'Contacta con el inspector sin dar tu nombre.'}),
 Object.freeze({x:-785,z:-340,name:'ENLACE DEL PUERTO',text:'Recoge la dirección del escondite de tu hermano.'})
]);
export const ELEVENTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-785,z:-340,name:'ACCESO AL ALMACÉN',text:'Localiza el acceso al almacén señalado por Clara.'}),
 Object.freeze({x:-785,z:-555,name:'RESCATE EN EL MUELLE',text:'Baja del coche y libera al testigo. Mantente a su lado durante 7 segundos.',kind:'rescue',hold:7}),
 Object.freeze({x:-535,z:-5,name:'REFUGIO SEGURO',text:'Conduce hasta el refugio y despista a las patrullas durante 4 segundos.',kind:'extract',hold:4})
]);
export const TWELFTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-535,z:-5,name:'TESTIGO RESCATADO',text:'Habla con el testigo en el refugio. Necesitas escuchar su relato a pie durante 6 segundos.',kind:'contact',hold:6}),
 Object.freeze({x:-875,z:-125,name:'ARCHIVO DEL EIXAMPLE',text:'Entra a pie en el archivo y examina las pruebas durante 9 segundos.',kind:'investigate',hold:9}),
 Object.freeze({x:-785,z:-340,name:'CÓDIGO DEL PUERTO',text:'Lleva el código recuperado al enlace del puerto.'})
]);
export const THIRTEENTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-785,z:-340,name:'CONTACTO DEL CONTROL',text:'Baja del coche y contrasta el código con el informante durante 6 segundos.',kind:'contact',hold:6}),
 Object.freeze({x:-1390,z:-305,name:'CITA DEL MIRADOR',text:'Vigila el intercambio desde el vehículo detenido durante 10 segundos.',kind:'stakeout',hold:10}),
 Object.freeze({x:-875,z:-125,name:'PRUEBAS DEL INSPECTOR',text:'Examina el expediente a pie durante 8 segundos para descubrir quién está al mando.',kind:'investigate',hold:8})
]);
export const FOURTEENTH_MISSION_POINTS=Object.freeze([
 Object.freeze({x:-785,z:-340,name:'EL MENSAJE DE CLARA',text:'Consulta a Clara a pie para confirmar dónde retienen a tu hermano.',kind:'contact',hold:6}),
 Object.freeze({x:-785,z:-555,name:'LA ÚLTIMA DECISIÓN',text:'Escoge: rescatar a tu hermano junto al muelle o recuperar las pruebas en el control.',kind:'branch',alternatives:Object.freeze([{x:-875,z:-555,name:'RESCATAR A MI HERMANO'},{x:-875,z:-340,name:'RECUPERAR LAS PRUEBAS'}])}),
 Object.freeze({x:-875,z:-555,name:'EL PRECIO DE ELEGIR',text:'Cumple tu decisión: rescata a tu hermano o reúne las pruebas, a pie.',kind:'decision',hold:8})
]);
export const FOURTEENTH_RESCUE=Object.freeze({x:-875,z:-555,name:'RESCATE DEL HERMANO',text:'Libera a tu hermano a pie durante 8 segundos. Salvat conservará parte de las pruebas.',kind:'decision',hold:8});
export const FOURTEENTH_EVIDENCE=Object.freeze({x:-785,z:-340,name:'PRUEBAS CONTRA SALVAT',text:'Recupera a pie las pruebas durante 8 segundos. Tu hermano seguirá esperando.',kind:'decision',hold:8});
export const FIFTEENTH_RESCUE_PATH=Object.freeze({x:-875,z:-340,name:'RECUPERAR EL DOSSIER',text:'Tu hermano está a salvo. Entra a pie en el control y recupera el dossier que conserva Salvat.',kind:'investigate',hold:7});
export const FIFTEENTH_EVIDENCE_PATH=Object.freeze({x:-875,z:-555,name:'LIBERAR AL HERMANO',text:'Conservas las pruebas, pero tu hermano sigue cautivo. Libéralo a pie antes de escapar.',kind:'rescue',hold:8});
export const FIFTEENTH_ESCAPE=Object.freeze({x:-535,z:-5,name:'CRUZAR GRÀCIA',text:'Escapa de las patrullas y mantenlas a más de 75 metros durante 5 segundos.',kind:'evade',hold:5});
export const FIFTEENTH_SALVAT=Object.freeze({x:-250,z:48,name:'ENCUENTRO CON SALVAT',text:'Deja el coche y afronta a Víctor Salvat en el punto de encuentro durante 8 segundos.',kind:'contact',hold:8});
export const FIFTEENTH_MISSION_POINTS=Object.freeze([FIFTEENTH_RESCUE_PATH,FIFTEENTH_ESCAPE,FIFTEENTH_SALVAT]);
export function fifteenthMissionPoints(choice){return [choice==='RECUPERAR LAS PRUEBAS'?FIFTEENTH_EVIDENCE_PATH:FIFTEENTH_RESCUE_PATH,FIFTEENTH_ESCAPE,FIFTEENTH_SALVAT];}
export const VALID_FINAL_CHOICES=Object.freeze(['RESCATAR A MI HERMANO','RECUPERAR LAS PRUEBAS']);
export function fourteenthMissionPoints(choice){return [FOURTEENTH_MISSION_POINTS[0],FOURTEENTH_MISSION_POINTS[1],choice==='RECUPERAR LAS PRUEBAS'?FOURTEENTH_EVIDENCE:FOURTEENTH_RESCUE];}
/** El encuentro requiere a Gael a pie: conducir hasta el punto no lo resuelve. */
export const MISSION_LIMIT=155;
export const MISSION_CHAPTERS=Object.freeze({
 1:Object.freeze({title:'LA CINTA DEL TURÓ',limit:155,points:MISSION_POINTS}),
 2:Object.freeze({title:'EL CONTACTO DE GRÀCIA',limit:215,points:SECOND_MISSION_POINTS}),
 3:Object.freeze({title:'LAS AVENIDAS NO OLVIDAN',limit:245,points:THIRD_MISSION_POINTS}),
 4:Object.freeze({title:'SOMBRAS DEL PUERTO',limit:300,points:FOURTH_MISSION_POINTS}),
 5:Object.freeze({title:'LA ÚLTIMA CURVA',limit:340,points:FIFTH_MISSION_POINTS}),
 6:Object.freeze({title:'EL HOMBRE DEL MIRADOR',limit:320,points:SIXTH_MISSION_POINTS}),
 7:Object.freeze({title:'LA SOMBRA DEL CONVOY',limit:300,points:SEVENTH_MISSION_POINTS}),
 8:Object.freeze({title:'LA EMBOSCADA',limit:360,points:EIGHTH_MISSION_POINTS}),
 9:Object.freeze({title:'LOS TESTIGOS DE LA NOCHE',limit:380,points:NINTH_MISSION_POINTS}),
 10:Object.freeze({title:'LA VOZ DE CLARA',limit:390,points:TENTH_MISSION_POINTS}),
 11:Object.freeze({title:'EL PRECIO DEL RESCATE',limit:440,points:ELEVENTH_MISSION_POINTS}),
 12:Object.freeze({title:'EL ARCHIVO DE LOS AUSENTES',limit:420,points:TWELFTH_MISSION_POINTS}),
 13:Object.freeze({title:'EL NOMBRE EN LA CINTA',limit:480,points:THIRTEENTH_MISSION_POINTS}),
 14:Object.freeze({title:'LA ÚLTIMA DECISIÓN',limit:490,points:FOURTEENTH_MISSION_POINTS}),
 15:Object.freeze({title:'BARCELONA NO PERDONA',limit:560,points:FIFTEENTH_MISSION_POINTS})
});
export const missionChapter=number=>MISSION_CHAPTERS[number]||MISSION_CHAPTERS[1];
export function newMission(chapter=1,previousRoute=null,previousFinalChoice=null){return {chapter:missionChapter(chapter)===MISSION_CHAPTERS[chapter]?chapter:1,phase:'ready',index:0,remaining:missionChapter(chapter).limit,elapsed:0,holdProgress:0,tailLost:0,routeChoice:chapter===9&&['AVENIDA OESTE','CALLE DE SERVICIO'].includes(previousRoute)?previousRoute:null,finalChoice:chapter===15&&VALID_FINAL_CHOICES.includes(previousFinalChoice)?previousFinalChoice:null,completed:false};}
export function missionTarget(m){return m.phase==='active'?(m.chapter===8?eighthMissionPoints(m.routeChoice):m.chapter===9?ninthMissionPoints(m.routeChoice):m.chapter===14?fourteenthMissionPoints(m.finalChoice):m.chapter===15?fifteenthMissionPoints(m.finalChoice):missionChapter(m.chapter).points)[m.index]||null:null;}
export function startMission(m){if(m.phase==='ready'){m.phase='active';return true;}return false;}
export function stepMission(m,position,dt){
 if(m.phase!=='active')return null;
 if(!Number.isFinite(dt)||dt<=0)return null;
 m.elapsed+=dt;m.remaining=Math.max(0,missionChapter(m.chapter).limit-m.elapsed);
 const target=missionTarget(m);
 if(target?.kind==='contact'||target?.kind==='rescue'||target?.kind==='investigate'||target?.kind==='decision'){
  const near=Math.hypot(position.x-target.x,position.z-target.z)<=16;
  m.holdProgress=near&&position.onFoot===true?Math.min(target.hold,m.holdProgress+dt):0;
  if(m.holdProgress>=target.hold){m.index++;m.holdProgress=0;if(m.index>=missionChapter(m.chapter).points.length){m.phase='won';m.completed=true;return 'won';}return 'checkpoint';}
  if(m.remaining<=0){m.phase='lost';return 'lost';}
  return null;
 }
 if(target?.kind==='precision-drive'){
  const near=Math.hypot(position.x-target.x,position.z-target.z)<=target.radius;
  const steady=!position.onFoot&&Number.isFinite(position.kmh)&&position.kmh>=target.minKmh&&position.kmh<=target.maxKmh;
  // The checkpoint demands continuous controlled driving, not merely touching a marker.
  m.holdProgress=near&&steady?Math.min(target.hold,m.holdProgress+dt):0;
  if(m.holdProgress>=target.hold){m.index++;m.holdProgress=0;if(m.index>=missionChapter(m.chapter).points.length){m.phase='won';m.completed=true;return 'won';}return 'checkpoint';}
  if(m.remaining<=0){m.phase='lost';return 'lost';}
  return null;
 }
 if(target?.kind==='extract'){
  const arrived=Math.hypot(position.x-target.x,position.z-target.z)<=26;
  const safe=Number.isFinite(position.patrolDistance)&&position.patrolDistance>=65;
  m.holdProgress=arrived&&!position.onFoot&&safe?Math.min(target.hold,m.holdProgress+dt):0;
  if(m.holdProgress>=target.hold){m.index++;m.holdProgress=0;if(m.index>=missionChapter(m.chapter).points.length){m.phase='won';m.completed=true;return 'won';}return 'checkpoint';}
  if(m.remaining<=0){m.phase='lost';return 'lost';}
  return null;
 }
 if(target?.kind==='branch'){
  const route=target.alternatives.find(p=>Math.hypot(position.x-p.x,position.z-p.z)<=20);
  if(route){if(m.chapter===14)m.finalChoice=route.name;else m.routeChoice=route.name;m.index++;return 'checkpoint';}
  if(m.remaining<=0){m.phase='lost';return 'lost';}
  return null;
 }
 if(target?.kind==='evade'){
  const arrived=Math.hypot(position.x-target.x,position.z-target.z)<=22;
  const safe=Number.isFinite(position.patrolDistance)&&position.patrolDistance>=(target.safeDistance??75);
  m.holdProgress=arrived&&(m.chapter!==8||!position.onFoot)&&safe?Math.min(target.hold,m.holdProgress+dt):0;
  if(m.holdProgress>=target.hold){m.index++;m.holdProgress=0;if(m.index>=missionChapter(m.chapter).points.length){m.phase='won';m.completed=true;return 'won';}return 'checkpoint';}
  if(m.remaining<=0){m.phase='lost';return 'lost';}
  return null;
 }
 if(target?.kind==='tail'){
  const distance=position.suspectDistance;
  const valid=!position.onFoot&&Number.isFinite(distance)&&distance>=22&&distance<=95;
  if(valid){m.holdProgress=Math.min(target.hold,m.holdProgress+dt);m.tailLost=0;}
  else {m.tailLost+=dt;if(distance<22)m.holdProgress=Math.max(0,m.holdProgress-dt*2);}
  if(m.tailLost>=9){m.phase='lost';return 'lost';}
  if(m.remaining<=0){m.phase='lost';return 'lost';}
  if(m.holdProgress<target.hold)return null;
  m.index++;m.holdProgress=0;m.tailLost=0;
  return 'checkpoint';
 }

 if(target&&Math.hypot(position.x-target.x,position.z-target.z)<=16){
  if(target.kind==='stakeout'){
   const parked=!position.onFoot&&Number.isFinite(position.kmh)&&position.kmh<=3;
   m.holdProgress=parked?Math.min(target.hold,m.holdProgress+dt):0;
   if(m.holdProgress<target.hold)return m.remaining<=0?(m.phase='lost','lost'):null;
  }
  m.index++;m.holdProgress=0;
  if(m.index>=missionChapter(m.chapter).points.length){m.phase='won';m.completed=true;return 'won';}
  return 'checkpoint';
 }
 if(target?.kind==='stakeout'&&Math.hypot(position.x-target.x,position.z-target.z)>16)m.holdProgress=0;
 if(m.remaining<=0){m.phase='lost';return 'lost';}
 return null;
}
export function missionDistance(m,pos){const t=missionTarget(m);return t?Math.round(t.kind==='branch'?Math.min(...t.alternatives.map(p=>Math.hypot(pos.x-p.x,pos.z-p.z))):Math.hypot(pos.x-t.x,pos.z-t.z)):0;}
