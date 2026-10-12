/** CHASE 404 · Fase 5.5: hallazgos ficticios de Barcelona 1984. */
export const DISCOVERY_REWARD=45;
export const DISCOVERY_COMPLETION_BONUS=180;
export const DISCOVERY_RADIUS=15;
const record=(id,district,x,z,title,clue,story)=>Object.freeze({id,district,x,z,title,clue,story,reward:DISCOVERY_REWARD});
export const DISCOVERIES=Object.freeze([
 record('carmel-notebook','EL CARMEL',-160,210,'El cuaderno del sereno','Una nota quedó junto a la antigua parada de la ladera.','El sereno había apuntado tres matrículas que subían la cuesta de madrugada. La última tenía una anotación a lápiz: «No volver a preguntar».'),
 record('rovires-radio','TURÓ DE LA ROVIRA',216,-120,'La radio sin frecuencia','En el mirador se hablaba de una señal que nadie reconocía.','Una pequeña radio conserva una escala marcada a mano. Durante varias noches de 1984 alguien transmitió un indicativo desde la colina. Gael reconoce dos números de la cinta.'),
 record('guinardo-letter','GUINARDÓ',-150,375,'Carta sin destinatario','Busca donde termina la calle que sube al barrio.','El sobre nunca llegó a correos. Describe un sedán oscuro aparcado junto al taller y termina con una línea tachada: «El inspector vino de paisano».') ,
 record('gracia-photo','GRÀCIA',-410,165,'Fotografía de la plaza','Un negativo olvidado al borde de una calle de Gràcia.','La fotografía muestra una reunión desde lejos. En el reverso aparece un número de teléfono incompleto y una fecha de octubre. Clara insiste en conservarla.'),
 record('eixample-receipt','EIXAMPLE',-700,115,'El recibo doble','Dos facturas iguales, emitidas con horas diferentes.','Un comerciante guardó la copia de una entrega que jamás apareció. El sello pertenece a una empresa de transporte que, sobre el papel, llevaba años cerrada.'),
 record('eixample-key','EIXAMPLE',-535,-5,'La llave de latón','Un antiguo buzón pudo servir de punto de intercambio.','La llave abre una pequeña caja sin nombre. Dentro solo hay una nota con dos palabras: «Almacén cuatro». No demuestra nada por sí sola, pero encaja con el relato del testigo.'),
 record('port-manifest','PUERTO',-785,-340,'Manifiesto de carga','Los contenedores esconden un registro de entrada incompleto.','En la copia de un manifiesto faltan nombres, no mercancías. Hay una inicial que Gael cree reconocer. El papel está doblado de forma deliberada, como si alguien quisiera que lo encontraran.'),
 record('montjuic-ticket','MONTJUÏC',-1300,-620,'Billete del último tranvía','Una pequeña pista en el acceso a la colina.','El billete está perforado dos veces. Un aviso manuscrito en el reverso señala una reunión cancelada. Gael no sabe si es una advertencia o una trampa.')
]);
const VALID_IDS=new Set(DISCOVERIES.map(d=>d.id));
export function cleanDiscoveries(raw){
 if(!Array.isArray(raw))return [];
 const seen=new Set();for(const id of raw){if(typeof id==='string'&&VALID_IDS.has(id))seen.add(id);}
 return DISCOVERIES.filter(d=>seen.has(d.id)).map(d=>d.id);
}
export function nearestDiscovery(position,discovered=[]){
 if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.z))return null;
 const completed=new Set(cleanDiscoveries(discovered));let nearest=null;
 for(const secret of DISCOVERIES){if(completed.has(secret.id))continue;const distance=Math.hypot(position.x-secret.x,position.z-secret.z);
  if(distance<=DISCOVERY_RADIUS&&(!nearest||distance<nearest.distance))nearest={secret,distance};
 }
 return nearest;
}
/** Returns an immutable transaction proposal; the caller must persist first. */
export function claimDiscovery(stats,id,position,{onFoot=false,policeActive=false}={}){
 const secret=DISCOVERIES.find(s=>s.id===id);
 if(!secret)return {ok:false,reason:'Hallazgo desconocido'};
 if(!onFoot)return {ok:false,reason:'Baja del coche para investigar'};
 if(policeActive)return {ok:false,reason:'No puedes investigar durante una persecución'};
 if(!position||!Number.isFinite(position.x)||!Number.isFinite(position.z)||Math.hypot(position.x-secret.x,position.z-secret.z)>DISCOVERY_RADIUS)return {ok:false,reason:'Acércate a la placa para investigar'};
 const already=cleanDiscoveries(stats?.discoveries);
 if(already.includes(id))return {ok:false,reason:'Ya has registrado esta pista'};
 if(!Number.isSafeInteger(stats?.credits)||stats.credits<0||stats.credits>10000000)return {ok:false,reason:'Saldo inválido'};
 const discoveries=[...already,id];const bonus=discoveries.length===DISCOVERIES.length?DISCOVERY_COMPLETION_BONUS:0;
 const reward=secret.reward+bonus;
 if(stats.credits>10000000-reward)return {ok:false,reason:'Saldo al máximo'};
 return {ok:true,secret,reward,bonus,next:{...stats,credits:stats.credits+reward,discoveries}};
}
export function discoveryProgress(stats){const count=cleanDiscoveries(stats?.discoveries).length;return {count,total:DISCOVERIES.length,complete:count===DISCOVERIES.length};}
