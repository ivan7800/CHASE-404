/** CHASE 404 · Fase 5.6. Contactos ficticios y microhistorias opcionales.
 * Transacciones puras: el controlador guarda `next` antes de confirmar recompensas.
 */
export const CONTACT_RADIUS=18;
const npc=(id,name,role,district,x,z,lead,location,question,evidence,finish,after,reward)=>Object.freeze({
 id,name,role,district,x,z,lead,location:Object.freeze(location),question,evidence,finish,after,reward
});
export const CONTACTS=Object.freeze([
 npc('manel','MANEL ROCA','Mecánico del barrio','EL CARMEL',106,132,
  'Me han dejado una caja a medias en el Guinardó. No quiero que caiga en manos del inspector. ¿La puedes localizar?',
  {x:-150,z:300,name:'COBERTIZO DEL GUINARDÓ'},
  'Vuelve con la caja, aunque solo encuentres la etiqueta. Si alguien pregunta, no me conoces.',
  'Dentro de la caja hay una chapa de matrícula y una factura de un taller que no existe. Alguien ha arrancado el nombre del destinatario.',
  'Esta chapa estaba en el coche de uno de mis clientes. Si entregas el original, yo podré preguntar sin hacer ruido.',
  'Manel apaga el cigarrillo y guarda el papel en un cajón de herramientas.',100),
 npc('clara','CLARA VIDAL','Confidente de Gael','GRÀCIA',-410,165,
  'He recibido una llamada desde una cabina del Eixample. Dijeron el nombre de tu hermano y colgaron. Busca el mensaje que dejaron.',
  {x:-625,z:-125,name:'CABINA DEL EIXAMPLE'},
  'La cabina está junto a la última manzana. Mira bajo el teléfono y vuelve antes de que alguien la vacíe.',
  'Detrás de la caja de monedas hay un papel húmedo: tres horarios de carga y la palabra «Salvat», escrita con distinta tinta.',
  'Si compartimos la nota, sabrán que la hemos encontrado. Guardar una copia podría protegernos si nos siguen.',
  'Clara relee la nota y te mira antes de doblarla por la mitad.',115),
 npc('nuria','NÚRIA SOLER','Periodista independiente','EIXAMPLE',-700,-5,
  'Estoy buscando un negativo tomado en los muelles. Alguien quiere hacer desaparecer las caras de aquella noche. ¿Me ayudas?',
  {x:-785,z:-450,name:'PASILLO DEL MUELLE'},
  'En el pasillo del muelle, cerca de las cajas de madera, hay una funda azul. No te fíes del vigilante.',
  'La funda contiene un negativo dañado. Todavía se distingue la silueta de un inspector junto a un vehículo de matrícula tapada.',
  'Publicarlo podría alertar a Salvat. Si guardas una copia, podré verificar antes a quién estamos señalando.',
  'Núria examina el negativo contra la luz de una farola.',130)
]);
export const CONTACT_CHOICES=Object.freeze(['entregar','copiar']);
const byId=id=>CONTACTS.find(c=>c.id===id);
export function cleanContacts(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
 const result={};for(const c of CONTACTS){const entry=raw[c.id];if(!entry||typeof entry!=='object'||Array.isArray(entry))continue;
  const stage=entry.stage;if(!['active','found','done'].includes(stage))continue;
  const choice=CONTACT_CHOICES.includes(entry.choice)?entry.choice:null;
  if(stage==='done'&&!choice)continue;
  result[c.id]={stage,choice:stage==='done'?choice:null};
 }
 return result;
}
export function contactStage(stats,id){return cleanContacts(stats?.contacts)[id]?.stage||'new';}
export function contactProgress(stats){const data=cleanContacts(stats?.contacts);return {done:Object.values(data).filter(e=>e.stage==='done').length,total:CONTACTS.length};}
export function nearestContactAction(pos,stats){
 if(!pos||!Number.isFinite(pos.x)||!Number.isFinite(pos.z))return null;
 let best=null;
 for(const c of CONTACTS){const stage=contactStage(stats,c.id);const d=Math.hypot(pos.x-c.x,pos.z-c.z);
  if(d<=CONTACT_RADIUS&&(!best||d<best.distance))best={contact:c,kind:'person',distance:d};
  if(stage==='active'){
   const e=Math.hypot(pos.x-c.location.x,pos.z-c.location.z);
   if(e<=CONTACT_RADIUS&&(!best||e<best.distance))best={contact:c,kind:'evidence',distance:e};
  }
 }
 return best;
}
const canInteract=(c,pos,onFoot,policeActive,target)=>{
 if(!onFoot)return 'Debes bajar del coche';if(policeActive)return 'No puedes hablar durante una persecución';
 if(!pos||!Number.isFinite(pos.x)||!Number.isFinite(pos.z)||Math.hypot(pos.x-target.x,pos.z-target.z)>CONTACT_RADIUS)return 'Acércate al lugar indicado';
 return null;
};
const nextRecord=(stats,c,stage,choice=null,reward=0)=>({
 ...stats,credits:stats.credits+reward,contacts:{...cleanContacts(stats.contacts),[c.id]:{stage,choice}}
});
export function acceptContact(stats,id,pos,conditions={}){
 const c=byId(id);if(!c)return {ok:false,reason:'Contacto desconocido'};
 const reason=canInteract(c,pos,conditions.onFoot,conditions.policeActive,c);if(reason)return {ok:false,reason};
 if(contactStage(stats,id)!=='new')return {ok:false,reason:'Este encargo ya se ha iniciado'};
 if(!Number.isSafeInteger(stats?.credits)||stats.credits<0||stats.credits>10000000)return {ok:false,reason:'Saldo inválido'};
 return {ok:true,contact:c,next:nextRecord(stats,c,'active')};
}
export function collectContactEvidence(stats,id,pos,conditions={}){
 const c=byId(id);if(!c)return {ok:false,reason:'Contacto desconocido'};
 const reason=canInteract(c,pos,conditions.onFoot,conditions.policeActive,c.location);if(reason)return {ok:false,reason};
 if(contactStage(stats,id)!=='active')return {ok:false,reason:'No tienes pendiente esta búsqueda'};
 return {ok:true,contact:c,next:nextRecord(stats,c,'found')};
}
export function finishContact(stats,id,choice,pos,conditions={}){
 const c=byId(id);if(!c)return {ok:false,reason:'Contacto desconocido'};
 const reason=canInteract(c,pos,conditions.onFoot,conditions.policeActive,c);if(reason)return {ok:false,reason};
 if(contactStage(stats,id)!=='found')return {ok:false,reason:'Debes encontrar la prueba primero'};
 if(!CONTACT_CHOICES.includes(choice))return {ok:false,reason:'Decisión inválida'};
 const reward=c.reward-(choice==='copiar'?20:0);
 if(!Number.isSafeInteger(stats?.credits)||stats.credits<0||stats.credits>10000000-reward)return {ok:false,reason:'Saldo inválido o al máximo'};
 return {ok:true,contact:c,reward,choice,next:nextRecord(stats,c,'done',choice,reward)};
}

const OUTCOMES=Object.freeze({
 manel:Object.freeze({entregar:'Manel guarda el original y promete investigar sin comprometerte. Su confianza en Gael aumenta.',copiar:'Manel recibe tu copia, pero sospecha que escondes una parte de la historia. Mantiene la conversación en secreto.'}),
 clara:Object.freeze({entregar:'Clara conserva la nota y acuerda compartir lo que descubra contigo. La confianza entre ambos crece.',copiar:'Clara comprende tu cautela y propone una señal de aviso. La alianza continúa, aunque evita pedirte más detalles.'}),
 nuria:Object.freeze({entregar:'Núria obtiene el negativo original y podrá contrastar la imagen para una futura investigación.',copiar:'Núria acepta la copia, pero retrasa cualquier publicación hasta confirmar la autenticidad. Salvat sigue sin saber quién conservó la prueba.'})
});
export function contactOutcome(id,choice){return OUTCOMES[id]?.[choice]||null;}
