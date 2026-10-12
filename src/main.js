import {nearestEntityDistance} from './performance.js';
import {shortcutAllowed} from './navigation-guard.js';
import {createRuntimeGuard} from './runtime-guard.js';
import {missionReport,missionFailureTitle} from './mission-report.js';
import {objectivePresentation,objectiveTransition} from './objective-presentation.js';
import {pursuitThreat,damageFeedback} from './threat-feedback.js';
import {visibleStoryActors} from './story-actors.js';
import {storyBeat} from './story-scenes.js';
import {dialoguePresentation} from './dialogue-presentation.js';
import {DEFAULT_LIGHTING,readLighting,saveLighting,nextLighting,getLighting} from './atmosphere.js';
import {CONTACTS,nearestContactAction,acceptContact,collectContactEvidence,finishContact,contactStage,contactProgress,cleanContacts,contactOutcome} from './contacts.js';
import {DISCOVERIES,DISCOVERY_COMPLETION_BONUS,nearestDiscovery,claimDiscovery,discoveryProgress,cleanDiscoveries} from './discoveries.js';
import {DELIVERY,SIDE_ACTIVITIES,getSideActivity,newSideRun,stepSideRun,sideTarget,sideRecord,readSideStats,saveSideStats,awardSideRun} from './side-activities.js';
import {CARMEL_GARAGE,garageAvailable,parkVehicle,swapParkedVehicle,readCollection,saveCollection,GARAGE_CAPACITY} from './vehicle-collection.js';
import {WORKSHOP,UPGRADE_TYPES,canUseWorkshop,repairPrice,purchaseRepair,purchaseUpgrade,tuneWithUpgrades,upgradeLevels} from './workshop.js';
import {FINAL_CHOICE_KEY,writeFinalChoice,readFinalChoice} from './final-choice.js';
import {finalChoiceForNextMission,rememberFinalChoice} from './campaign-session.js';
import {CAMPAIGN_PROGRESS_KEY,readCampaign,writeCampaign,advanceCampaign,freshCampaign} from './campaign-progress.js';
import {activateUrbanRun} from './run-lifecycle.js';
import {ROUTE_KEY,readRoute,writeRoute} from './campaign-choice.js';
import {createSuspect,stepSuspect} from './suspect.js';
import {newMission,stepMission,missionTarget,missionDistance,MISSION_POINTS,missionChapter} from './mission.js';
import {createCar,createUrbanCar,resetCar,step,FIXED_STEP,formatTime} from './physics.js';
import {Controls} from './controls.js';
import {CITY} from './city.js';
import {createTraffic,stepTraffic} from './traffic.js';
import {SIGNALS,signalState} from './signals.js';
import {createPolice,stepPolice} from './police.js';
import {stepUrbanContacts} from './urban-collisions.js';
import {makePedestrian,exitVehicle,stepPedestrian,enterVehicle,closestVehicle,recenterPedestrianCamera} from './on-foot.js';
import {applyImpact,tickDamage,damageCondition} from './damage.js';
import {sample,LENGTH,ROAD_HALF,START_S,selectTrack,getTrack,TRACKS} from './track.js';
import {getCar,CARS} from './garage.js';
import {Renderer} from './renderer.js';
import {EngineAudio} from './audio.js';
import {soundDistrictAt,SOUND_DISTRICTS} from './soundscape.js';
import {readSettings,saveSettings,normalizeSettings,DEFAULT_BINDINGS,BINDABLE_CODES,validateBindings,actionForKey,qualityScale,AutoQuality} from './settings.js';
import {makeRace,stepRace,standings,positionDelta,slipstream} from './race.js';
import {MODES,THEMES,readProfile,writeProfile,recordStart,awardFinish,bestTotal,beginCup,cupTrack,cupTable,completeCupRound,unlockedThemes,changeTheme} from './progression.js';
const $=id=>document.getElementById(id);
let presentedObjectiveKey='';
function clearObjectivePresentation(){presentedObjectiveKey='';$('objectiveAnnouncement').hidden=true;}
function updateObjectivePresentation(){
 const panel=$('objectiveAnnouncement');
 if(!urbanMode||!started||paused||explorationMode()||(!sideMode()&&mission.phase!=='active')){panel.hidden=true;return;}
 const target=sideMode()?sideTarget(sideRun):missionTarget(mission);
 if(!target){panel.hidden=true;return;}
 const index=sideMode()?sideRun.index:mission.index;
 const key=(sideMode()?'SIDE:'+selectedSideId:'MISSION:'+selectedChapter)+':'+index+':'+target.name;
 if(key===presentedObjectiveKey)return;
 presentedObjectiveKey=key;
 const info=objectivePresentation(target,index,sideMode()?selectedActivity().points.length:missionChapter(selectedChapter).points.length);
 $('objectiveAnnouncementStep').textContent=info.step;
 $('objectiveAnnouncementTitle').textContent=info.title;
 $('objectiveAnnouncementInstruction').textContent=info.instruction;
 panel.hidden=false;
}

const ui={overlay:$('overlay'),start:$('startBtn'),introTitle:$('introTitle'),help:$('helpOverlay'),notice:$('notice'),speed:$('speed'),fill:$('speedFill'),gear:$('gear'),lap:$('lapCount'),clock:$('lapClock'),best:$('bestTime'),last:$('lastTime'),sector:$('sectorCount'),surface:$('surfaceStatus'),fps:$('fpsIndicator'),model:$('modelIndicator'),minimap:$('minimap'),position:$('racePosition'),positionTotal:$('raceTotal'),raceLap:$('raceLap'),raceLaps:$('raceLaps'),raceClock:$('raceClock'),gap:$('raceGap'),list:$('leaderboard'),finish:$('finishOverlay'),finishTitle:$('finishTitle'),finishPosition:$('finishPosition'),finishTime:$('finishTime'),finishBoard:$('finishBoard')};
let campaign=readCampaign(localStorage),campaignSaveOk=true;
let selectedChapter=campaign.nextChapter;
let sessionFinalChoice=null;
let workshopOpen=false,workshopFocus=null;
let collectionOpen=false,collectionFocus=null;
let archiveOpen=false,archiveFocus=null;
let contactOpen=false,contactFocus=null,contactView=null;
let storyOpen=false,storyFocus=null;
let vehicleCollection=readCollection({getItem:k=>{try{return localStorage.getItem(k)}catch{return null}}});
let sideSelected=false,sideRun=null,selectedSideId=DELIVERY.id;
let freeExploration=false;
const explorationMode=()=>urbanMode&&freeExploration;
const selectedActivity=()=>getSideActivity(selectedSideId);
let sideStats=readSideStats({getItem:k=>{try{return localStorage.getItem(k)}catch{return null}}});
function sideMode(){return urbanMode&&sideSelected;}
function availableDiscovery(){return urbanMode&&started&&!paused&&pedestrian.active&&!police.active&&!ambushPatrols.some(p=>p.active)?nearestDiscovery(pedestrian,sideStats.discoveries):null;}
function contactPossible(){return explorationMode()&&started&&!paused&&pedestrian.active&&!police.active&&!ambushPatrols.some(p=>p.active);}
function availableContactAction(){return contactPossible()?nearestContactAction(pedestrian,sideStats):null;}
function refreshContactHUD(){
 const nearby=availableContactAction();
 $('contactHint').hidden=!nearby;$('contactInteract').hidden=!nearby;
 if(nearby){const c=nearby.contact;$('contactHint').textContent=nearby.kind==='evidence'?'PRUEBA · '+c.location.name+' · N PARA RECOGER':'CONTACTO · '+c.name+' · N PARA HABLAR';}
 $('contactJournalBtn').hidden=!explorationMode();
 const progress=contactProgress(sideStats);$('contactJournalBtn').title='Diario de contactos · '+progress.done+'/'+progress.total+' (J)';
}
function saveContactTransaction(proposal){
 if(!proposal.ok){$('contactMessage').textContent=proposal.reason;return false;}
 if(!saveSideStats(localStorage,proposal.next)){$('contactMessage').textContent='NO SE PUDO GUARDAR · SIN CAMBIOS';return false;}
 sideStats=proposal.next;updateSideMenu();refreshContactHUD();audio.cue('record');return true;
}
function showContactPanel(view){
 if(contactOpen||archiveOpen||workshopOpen||collectionOpen||settingsOpen||helpOpen||!started||paused||!urbanMode)return;
 contactOpen=true;contactView=view;contactFocus=document.activeElement;setPaused(true);ui.overlay.hidden=true;
 $('contactOverlay').hidden=false;renderContactPanel();$('contactClose').focus();
}
function closeContactPanel(){if(!contactOpen)return;contactOpen=false;contactView=null;$('contactOverlay').hidden=true;setPaused(false);refreshContactHUD();contactFocus?.focus?.();}
function contactJournal(){if(!explorationMode()){notice('DIARIO · SE CONSULTA EN EXPLORACIÓN LIBRE');return;}showContactPanel({type:'journal'});}
function contactInteract(){
 if(contactOpen||archiveOpen||workshopOpen||collectionOpen||settingsOpen||helpOpen||!contactPossible())return;
 const action=availableContactAction();if(!action){notice('CONTACTOS · ACÉRCATE A UNA FIGURA VERDE Y BAJA DEL COCHE');return;}
 if(action.kind==='evidence'){
  const proposal=collectContactEvidence(sideStats,action.contact.id,pedestrian,{onFoot:pedestrian.active,policeActive:police.active});
  if(!proposal.ok){notice(proposal.reason.toUpperCase());return;}
  if(!saveSideStats(localStorage,proposal.next)){notice('NO SE HA GUARDADO LA PRUEBA');return;}
  sideStats=proposal.next;audio.cue('record');showContactPanel({type:'evidence',id:action.contact.id});refreshContactHUD();return;
 }
 showContactPanel({type:'person',id:action.contact.id});
}
function contactAction(proposal){
 if(!saveContactTransaction(proposal))return;
 renderContactPanel();
}
function renderContactPanel(){
 const entries=$('contactEntries'),actions=$('contactActions'),message=$('contactMessage');entries.replaceChildren();actions.replaceChildren();message.textContent='';
 const progress=contactProgress(sideStats);$('contactProgress').textContent=progress.done+' / '+progress.total;
 const person=contactView.type==='journal'?null:CONTACTS.find(c=>c.id===contactView.id);
 const cinematic=dialoguePresentation(person?.id,contactView.type,person?contactStage(sideStats,person.id):'new');
 const portrait=$('contactPortrait'),stageCaption=$('contactSceneLabel');
 portrait.dataset.character=cinematic.character;portrait.dataset.mood=cinematic.mood;portrait.setAttribute('aria-label',cinematic.portraitLabel);
 $('contactPortraitInitials').textContent=cinematic.initials;stageCaption.textContent=cinematic.scene;
 $('contactOverlay').classList.toggle('contact-cinematic',contactView.type!=='journal');
 $('contactCredits').textContent=sideStats.credits+' ₧';
 const addButton=(label,callback)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.addEventListener('click',callback);actions.append(btn);};
 if(contactView.type==='journal'){
  $('contactTitle').textContent='VOCES DE BARCELONA';$('contactSubtitle').textContent='DIARIO DE CONTACTOS · OCTUBRE DE 1984';$('contactDialogue').textContent='Las historias secundarias transcurren durante la exploración libre. Acércate a cada personaje, baja del coche y pulsa N. Sigue las pistas y vuelve a hablar con él.';
  for(const c of CONTACTS){
   const record=cleanContacts(sideStats.contacts)[c.id],stage=record?.stage||'new';
   const row=document.createElement('article'),title=document.createElement('strong'),detail=document.createElement('p');row.className='archive-entry'+(stage==='done'?' unlocked':'');title.textContent=c.name+' · '+c.district;
   detail.textContent=stage==='new'?'PENDIENTE · Habla con '+c.name+' para conocer su historia.':stage==='active'?'EN CURSO · Encuentra la prueba en '+c.location.name+'.':stage==='found'?'PRUEBA LOCALIZADA · Regresa con '+c.name+'.':`RESUELTO · ${record.choice==='entregar'?'ENTREGASTE EL ORIGINAL':'GUARDASTE UNA COPIA'}. ${contactOutcome(c.id,record.choice)}`;
   row.append(title,detail);entries.append(row);
  }
  return;
 }
 const c=CONTACTS.find(x=>x.id===contactView.id);if(!c)return;
 const stage=contactStage(sideStats,c.id);
 $('contactTitle').textContent=c.name;$('contactSubtitle').textContent=c.role+' · '+c.district;
 if(contactView.type==='evidence'){
  $('contactDialogue').textContent=c.evidence+' Regresa con '+c.name+' para decidir qué hacer con ella.';
  addButton('VER DIARIO ↗',()=>{contactView={type:'journal'};renderContactPanel();});return;
 }
 if(stage==='new'){
  $('contactDialogue').textContent=c.lead;
  addButton('ACEPTAR ENCARGO · '+c.location.name,()=>contactAction(acceptContact(sideStats,c.id,pedestrian,{onFoot:pedestrian.active,policeActive:police.active})));return;
 }
 if(stage==='active'){$('contactDialogue').textContent=c.question+' DESTINO: '+c.location.name+'.';return;}
 if(stage==='found'){
  $('contactDialogue').textContent=c.finish;
  addButton('ENTREGAR ORIGINAL · +'+c.reward+' ₧',()=>contactAction(finishContact(sideStats,c.id,'entregar',pedestrian,{onFoot:pedestrian.active,policeActive:police.active})));
  addButton('GUARDAR COPIA · +'+(c.reward-20)+' ₧',()=>contactAction(finishContact(sideStats,c.id,'copiar',pedestrian,{onFoot:pedestrian.active,policeActive:police.active})));return;
 }
 const record=cleanContacts(sideStats.contacts)[c.id];
 $('contactDialogue').textContent=contactOutcome(c.id,record.choice)+' Este encargo está resuelto.';
}
function refreshDiscoveryHUD(){
 const candidate=availableDiscovery(),hint=$('discoveryHint'),button=$('discoveryCollect');
 hint.hidden=!candidate;button.hidden=!candidate;
 if(candidate)hint.textContent='PISTA CERCANA · '+candidate.secret.title.toUpperCase()+' · X PARA EXAMINAR';
 $('archiveBtn').hidden=!urbanMode;$('contactJournalBtn').hidden=!explorationMode();$('contactHint').hidden=true;$('contactInteract').hidden=true;
 const progress=discoveryProgress(sideStats);
 $('archiveBtn').title='Archivo de Barcelona · '+progress.count+'/'+progress.total+' (I)';
}
function collectNearbyDiscovery(){
 if(contactOpen||archiveOpen||workshopOpen||collectionOpen||settingsOpen||helpOpen||!started||paused||!urbanMode)return;
 const candidate=availableDiscovery();if(!candidate){notice('EXPLORACIÓN · BAJA DEL COCHE Y BUSCA LAS PLACAS DE LATÓN');return;}
 const result=claimDiscovery(sideStats,candidate.secret.id,pedestrian,{onFoot:pedestrian.active,policeActive:police.active||ambushPatrols.some(p=>p.active)});
 if(!result.ok){notice(result.reason.toUpperCase());return;}
 if(!saveSideStats(localStorage,result.next)){notice('NO SE PUDO GUARDAR LA PISTA · SIN RECOMPENSA');return;}
 sideStats=result.next;updateSideMenu();refreshDiscoveryHUD();audio.cue('record');
 $('archiveMessage').textContent='ÚLTIMA PISTA · '+result.secret.title+' · +'+result.reward+' ₧';
 notice('DESCUBRIMIENTO · '+result.secret.title.toUpperCase()+' · +'+result.reward+' ₧');
 showArchive();
}
function showArchive(){
 if(contactOpen||archiveOpen||workshopOpen||collectionOpen||settingsOpen||helpOpen||!urbanMode||!started||paused)return;
 archiveOpen=true;archiveFocus=document.activeElement;setPaused(true);ui.overlay.hidden=true;
 $('archiveOverlay').hidden=false;renderArchive();$('archiveClose').focus();
}
function closeArchive(){if(!archiveOpen)return;archiveOpen=false;$('archiveOverlay').hidden=true;setPaused(false);refreshDiscoveryHUD();archiveFocus?.focus?.();}
function renderArchive(){
 const discovered=new Set(cleanDiscoveries(sideStats.discoveries)),progress=discoveryProgress(sideStats);
 $('archiveCount').textContent=progress.count+' / '+progress.total;
 $('archiveCredits').textContent=sideStats.credits+' ₧';
 $('archiveBonus').textContent=progress.complete?'BONIFICACIÓN OBTENIDA':(DISCOVERIES.length-progress.count)+' PISTAS PARA '+DISCOVERY_COMPLETION_BONUS+' ₧ EXTRA';
 const items=$('archiveEntries');items.replaceChildren();
 for(const [index,secret] of DISCOVERIES.entries()){
  const unlocked=discovered.has(secret.id),row=document.createElement('article');row.className='archive-entry'+(unlocked?' unlocked':'');
  const header=document.createElement('div'),title=document.createElement('strong'),district=document.createElement('small'),story=document.createElement('p');
  title.textContent=String(index+1).padStart(2,'0')+' · '+(unlocked?secret.title:'REGISTRO POR DESCUBRIR');
  district.textContent=secret.district+' · '+(unlocked?'DOCUMENTADO':'SIN IDENTIFICAR');
  story.textContent=unlocked?secret.story:secret.clue;
  header.append(title,district);row.append(header,story);items.append(row);
 }
}

function updateSideMenu(){
 const button=$('sideBtn'),select=$('sideSelect'),activity=selectedActivity(),record=sideRecord(sideStats,activity.id);
 if(!button||!select)return;
 $('exploreBtn').hidden=!urbanMode; $('exploreBtn').textContent=freeExploration?'VOLVER A CAMPAÑA':'EXPLORACIÓN LIBRE · SIN RELOJ';$('exploreBtn').setAttribute('aria-pressed',String(freeExploration));
 if(urbanMode)$('clockHeading').textContent=freeExploration?'TIEMPO EXPLORANDO':'TIEMPO RESTANTE';
 button.hidden=!urbanMode;$('sideSelectWrap').hidden=!urbanMode;
 select.value=activity.id;select.disabled=!urbanMode;
 button.textContent=sideSelected?'VOLVER A CAMPAÑA':`ACTIVAR DESAFÍO · ${sideStats.credits} ₧`;
 button.setAttribute('aria-pressed',String(sideSelected));
 $('sideStats').textContent=`${activity.reward} ₧ · ${activity.limit} s · COMPLETADOS: ${record.completed} · RÉCORD: ${record.best===null?'—':record.best.toFixed(1)+' s'} · SALDO: ${sideStats.credits} ₧`;
 $('sideRules').textContent=activity.type==='fragile'?'Carga delicada: máximo 1 impacto registrado. El segundo termina el encargo.':activity.type==='sprint'?'Contrarreloj de cuatro controles. Cruza todos los puntos en coche.':'Entrega los tres pedidos conduciendo hasta cada marcador.';
}
let mission=newMission();
let streetTraffic=createTraffic();
let suspect=createSuspect();
let urbanElapsed=0;
let police=createPolice();
let ambushPatrols=[];
let pedestrian=makePedestrian();
let renderer,car=createCar(),race=makeRace(),audio=new EngineAudio(),started=false,paused=true,helpOpen=false,toastTimeout,urbanMode=false;
const settings=readSettings({getItem:k=>{try{return localStorage.getItem(k)}catch{return null}}});
audio.setVolume(settings.audioVolume/100);
const automaticQuality=new AutoQuality();let appliedScale=1, settingsOpen=false, settingsFocus=null;
let effectsEnabled=(()=>{try{return localStorage.getItem('chase404.effects.v6')!=='off'}catch{return true}})();
let lightingMode=readLighting({getItem:k=>localStorage.getItem(k)});
let profile=(()=>{try{return readProfile(localStorage);}catch{return readProfile({getItem:()=>null});}})(),mode='arcade',runId='',cupResult=null,finishResolved=false;
const qualityModes=[{name:'AUTO',id:'auto'},{name:'ALTA',id:'high'},{name:'MEDIA',id:'medium'},{name:'ECO',id:'eco'}];
const inputs={throttle:false,brake:false,left:false,right:false,handbrake:false};
const keymap=settings.bindings;
const controls=new Controls(code=>actionForKey(code,keymap));
function syncControls(){Object.assign(inputs,controls.snapshot());}
function notice(message){ui.notice.textContent=message;ui.notice.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>ui.notice.classList.remove('show'),2300);}
function recordKey(){return mode==='arcade'?`chase404.best.v4.${getTrack().id}.${$('carSelect').value}`:`chase404.bestlap.v5.${mode}.${getTrack().id}.${$('carSelect').value}`;}
function readRecord(){try{const v=Number(localStorage.getItem(recordKey()));return v>0&&v<100000?v:null;}catch{return null;}}
function saveRecord(t){try{localStorage.setItem(recordKey(),String(t));}catch{notice('EL NAVEGADOR NO PERMITE GUARDAR RÉCORDS');}}
let savedBest=readRecord();
const currentMode=()=>MODES.find(m=>m.id===mode)||MODES[0];
const cupActive=()=>mode==='championship'&&profile.cup;
const storageSave=()=>{let saved=false;try{saved=writeProfile(localStorage,profile);}catch{}if(!saved&&started)notice('NO SE PUDO GUARDAR EL PERFIL');};
function initRace(){sideRun=sideMode()?newSideRun(selectedSideId):null;pedestrian=makePedestrian();mission=newMission(selectedChapter,selectedChapter===9?readRoute(localStorage):null,selectedChapter===15?finalChoiceForNextMission(sessionFinalChoice,readFinalChoice(localStorage)):null);streetTraffic=createTraffic();suspect=createSuspect();urbanElapsed=0;police=createPolice();ambushPatrols=[];car=urbanMode?createUrbanCar():createCar();car.vehicleId=getCar($('carSelect').value).id;car.tune=urbanMode?tuneWithUpgrades(car.vehicleId,sideStats):{...getCar(car.vehicleId).tune};renderer?.changeVehicle(car.vehicleId);race=makeRace({laps:currentMode().laps,rivals:currentMode().rivals});race.order=standings(race,car);race.position=race.order.find(e=>e.id==='YOU').position;runId=Date.now()+'-'+Math.random().toString(36).slice(2);cupResult=null;finishResolved=false;}
/** Taller contextual: solo cuando Gael está junto a la entrada y no hay persecución. */
function workshopAvailable(){const pos=pedestrian.active?pedestrian:car;return canUseWorkshop({urban:urbanMode,onFoot:pedestrian.active,x:pos.x,z:pos.z,speed:car.speed,policeActive:police.active||ambushPatrols.some(p=>p.active),vehicleX:car.x,vehicleZ:car.z});}
function showWorkshop(){
 if(contactOpen||workshopOpen||collectionOpen||archiveOpen||settingsOpen||helpOpen||!started||paused)return;
 if(!workshopAvailable()){notice('TALLER · ACÉRCATE AL TALLER DEL CARMEL, DETENTE Y EVITA A LA POLICÍA');return;}
 workshopOpen=true;workshopFocus=document.activeElement;setPaused(true);ui.overlay.hidden=true;
 $('workshopOverlay').hidden=false;renderWorkshop();$('workshopClose').focus();
}
function closeWorkshop(){if(!workshopOpen)return;workshopOpen=false;$('workshopOverlay').hidden=true;setPaused(false);workshopFocus?.focus?.();}
function workshopTransaction(result,message){
 if(!result.ok){$('workshopMessage').textContent=result.reason;return;}
 // Persist first; a blocked/full storage must never debit without keeping the transaction.
 if(!saveSideStats(localStorage,result.next)){$('workshopMessage').textContent='ERROR DE GUARDADO · NO SE HA COBRADO';return;}
 sideStats=result.next;
 if(result.damage===0){car.damage=0;car.damageCooldown=0;car.damageEvents=0;}
 car.tune=tuneWithUpgrades(car.vehicleId,sideStats);updateSideMenu();renderWorkshop();renderHUD();
 $('workshopMessage').textContent=message+' · -'+result.cost+' ₧';
}
function renderWorkshop(){
 const id=car.vehicleId||'racer',levels=upgradeLevels(sideStats,id),cost=repairPrice(car),services=$('workshopServices');
 $('shopVehicle').textContent=getCar(id).name;$('shopCondition').textContent=damageCondition(car).health+'%';$('shopCredits').textContent=sideStats.credits+' ₧';
 services.replaceChildren();
 const service=(name,description,price,disabled,action)=>{
  const line=document.createElement('div');line.className='workshop-service';
  const left=document.createElement('div'),title=document.createElement('strong'),hint=document.createElement('p'),button=document.createElement('button');
  title.textContent=name;hint.textContent=description;left.append(title,hint);
  button.type='button';button.disabled=disabled;button.textContent=price===null?'MÁXIMO':price===0?'SIN DAÑOS':price+' ₧';
  button.setAttribute('aria-label',name+' · '+button.textContent);button.addEventListener('click',action);
  line.append(left,button);services.append(line);
 };
 service('REPARACIÓN GENERAL','Recupera motor, dirección y frenos tras impactos.',cost,cost===0||sideStats.credits<cost,()=>workshopTransaction(purchaseRepair(sideStats,car),'VEHÍCULO REPARADO'));
 for(const type of UPGRADE_TYPES){
  const level=levels[type.id],price=type.prices[level]??null;
  service(type.name+' · NIVEL '+level+'/2',`Puesta a punto de ${type.name.toLowerCase()} · +${Math.round(type.step*100)} % por nivel. Mejora permanente en este modelo.`,price,price===null||sideStats.credits<price,()=>workshopTransaction(purchaseUpgrade(sideStats,id,type.id),type.name+' MEJORADA'));
 }
}
/** Colección independiente: nunca cambia los datos de la campaña o saldo. */
function collectionAvailable(){return garageAvailable({urban:urbanMode,onFoot:pedestrian.active,x:car.x,z:car.z,speed:car.speed,policeActive:police.active||ambushPatrols.some(p=>p.active)});}
function showCollection(){
 if(contactOpen||collectionOpen||workshopOpen||archiveOpen||settingsOpen||helpOpen||!started||paused)return;
 if(!collectionAvailable()){notice('GARAJE · LLEVA EL COCHE AL CARMEL, DETENTE Y PIERDE A LA POLICÍA');return;}
 collectionOpen=true;collectionFocus=document.activeElement;setPaused(true);ui.overlay.hidden=true;
 $('collectionOverlay').hidden=false;renderCollection();$('collectionClose').focus();
}
function closeCollection(){if(!collectionOpen)return;collectionOpen=false;$('collectionOverlay').hidden=true;setPaused(false);collectionFocus?.focus?.();}
function parkCurrentVehicle(){
 const proposal=parkVehicle(vehicleCollection,car);
 if(!proposal.ok){$('collectionMessage').textContent=proposal.reason;return;}
 if(!saveCollection(localStorage,proposal.next)){$('collectionMessage').textContent='ERROR DE GUARDADO · NINGÚN CAMBIO';return;}
 vehicleCollection=proposal.next;renderCollection();$('collectionMessage').textContent=proposal.updated?'ESTADO DEL VEHÍCULO ACTUALIZADO':'VEHÍCULO AÑADIDO A TU COLECCIÓN';
}
function takeStoredVehicle(id){
 const proposal=swapParkedVehicle(vehicleCollection,car,id);
 if(!proposal.ok){$('collectionMessage').textContent=proposal.reason;return;}
 if(!saveCollection(localStorage,proposal.next)){$('collectionMessage').textContent='ERROR DE GUARDADO · NO SE HA CAMBIADO DE COCHE';return;}
 vehicleCollection=proposal.next;
 // Swap the active vehicle in place; the previous car's real damage is preserved.
 Object.assign(car,{vehicleId:id,damage:proposal.vehicle.damage,damageCooldown:0,damageEvents:0,speed:0,vx:0,vz:0,kmh:0,steer:0,wheel:0,wall:false,offroad:false});
 car.tune=tuneWithUpgrades(id,sideStats);renderer.changeVehicle(id);renderer.startCam=true;
 clearControls();renderCollection();renderHUD();
 $('collectionMessage').textContent='LISTO PARA SALIR · '+getCar(id).name+' · '+damageCondition(car).health+'%';
}
function renderCollection(){
 $('collectionCount').textContent=vehicleCollection.vehicles.length+' / '+GARAGE_CAPACITY;
 $('collectionCurrent').textContent=getCar(car.vehicleId).name+' · '+damageCondition(car).health+'%';
 const list=$('collectionVehicles');list.replaceChildren();
 const canPark=vehicleCollection.vehicles.length<GARAGE_CAPACITY||vehicleCollection.vehicles.some(v=>v.id===car.vehicleId);
 $('collectionPark').disabled=!canPark;$('collectionPark').textContent=vehicleCollection.vehicles.some(v=>v.id===car.vehicleId)?'ACTUALIZAR COCHE ACTUAL':'GUARDAR COCHE ACTUAL';
 for(const vehicle of vehicleCollection.vehicles){
  const row=document.createElement('div');row.className='collection-vehicle';
  const info=document.createElement('div'),name=document.createElement('strong'),hint=document.createElement('p'),button=document.createElement('button');
  name.textContent=getCar(vehicle.id).name;hint.textContent='CONDICIÓN '+(100-vehicle.damage).toFixed(0)+'% · '+['MOTOR','DIRECCIÓN','FRENOS'].map((label,i)=>{const levels=upgradeLevels(sideStats,vehicle.id);return label+' '+[levels.engine,levels.steering,levels.brakes][i]+'/2';}).join(' · ');info.append(name,hint);
  button.type='button';button.disabled=vehicle.id===car.vehicleId;button.textContent=button.disabled?'EN USO':'RECUPERAR';button.setAttribute('aria-label','Recuperar '+getCar(vehicle.id).name);
  button.addEventListener('click',()=>takeStoredVehicle(vehicle.id));row.append(info,button);list.append(row);
 }
 if(!vehicleCollection.vehicles.length){const msg=document.createElement('p');msg.className='collection-empty';msg.textContent='Todavía no tienes coches guardados. Conduce hasta este garaje y guarda el vehículo actual.';list.append(msg);}
}
function updateProfileUI(){
 $('pilotXp').textContent=profile.xp+' XP';$('pilotLevel').textContent=profile.xp>=700?'LEYENDA':profile.xp>=350?'PRO':profile.xp>=120?'PILOTO':'ROOKIE';
 $('pilotMedals').textContent=Object.values(profile.medals).length+' MEDALLAS · '+profile.cups+' COPAS';
 for(const option of $('themeSelect').options){const theme=THEMES.find(t=>t.id===option.value);option.disabled=profile.xp<theme.xp;}
 if(!unlockedThemes(profile).some(t=>t.id===profile.theme))profile.theme='classic';
 $('themeSelect').value=profile.theme;$('app').dataset.theme=profile.theme;
 const cup=cupActive();$('trackSelect').disabled=Boolean(cup);$('carSelect').disabled=Boolean(cup);
 $('cupStatus').hidden=!cup;$('newCupBtn').hidden=!cup;
 if(cup){const table=cupTable(cup);$('cupStatus').textContent=`WORLD CUP · RONDA ${table.round+1}/3 · ${table.points} PUNTOS · ${table.results.map(r=>r.track.toUpperCase()+' '+r.points+'PT').join(' · ')||'CAMPEONATO INICIADO'}`;}
 $('modeDescription').textContent=currentMode().desc;
 $('metricCars').textContent=String(race.rivals.length+1).padStart(2,'0');$('metricLaps').textContent=Number.isFinite(race.laps)?String(race.laps).padStart(2,'0'):'∞';$('metricAI').textContent=race.rivals.length?'IA':'SOLO';
 if(urbanMode){$('modeDescription').textContent=explorationMode()?'EXPLORACIÓN LIBRE · pistas, talleres y garaje':sideMode()?selectedActivity().title+' · desafío secundario':missionChapter(selectedChapter).title+' · misión '+String(selectedChapter).padStart(2,'0');$('metricCars').textContent='01';$('metricLaps').textContent='∞';$('metricAI').textContent='MISIÓN';}
 $('modeTag').textContent=mode==='free'?'▰ VUELTAS ILIMITADAS · PRACTICA LIBRE':mode==='time'?'▰ TIME ATTACK · SIN RIVALES':mode==='championship'?'▰ WORLD CUP · 3 CIRCUITOS':'▰ 8 PILOTOS · 3 VUELTAS';
 $('modeHUD').textContent=mode==='championship'?'WORLD CUP · '+(cupTable(cup)?.round+1||1)+'/3':currentMode().name+' · '+(race.rivals.length+1)+' PILOTO(S)';
 $('gapLabel').textContent=race.rivals.length?'SIGUIENTE COCHE':'OBJETIVO';
}

function showStoryBeat(beat){
 if(!beat||storyOpen||!started||paused)return false;
 storyOpen=true;storyFocus=document.activeElement;clearControls();audio.pause(true);
 $('storySpeaker').textContent=beat.speaker;$('storyPlace').textContent=beat.place;
 $('storyTitle').textContent=beat.title;$('storyText').textContent=beat.text;
 $('storyOverlay').hidden=false;$('storyContinue').focus();return true;
}
function closeStoryBeat(){
 if(!storyOpen)return;storyOpen=false;$('storyOverlay').hidden=true;acc=0;
 audio.pause(paused);if(storyFocus?.isConnected)storyFocus.focus();else $('pauseBtn').focus();storyFocus=null;
}
function clearControls(){controls.clear();syncControls();}
function setPaused(value){paused=value;audio.pause(paused);ui.overlay.hidden=!paused;if(paused){clearControls();if(started){ui.introTitle.innerHTML='RACE<br><em>PAUSED.</em>';ui.start.innerHTML='CONTINUAR <span>↗</span>';}}$('pauseBtn').innerHTML=paused?'▶ <span>SEGUIR</span>':'Ⅱ <span>PAUSA</span>';}
function unpause(){
 if(mode==='championship'&&!profile.cup){beginCup(profile,$('carSelect').value);syncCupSelection();reset();updateProfileUI();savedBest=readRecord();}
 if(!started){recordStart(profile);storageSave();}
 started=true;hideHelp();setPaused(false);clearObjectivePresentation();activateUrbanRun({urbanMode,sideMode:sideMode(),explorationMode:explorationMode(),mission,sideRun,damageEvents:car.damageEvents});updateCampaignUI();audio.cue('start');notice(explorationMode()?'EXPLORACIÓN LIBRE · BUSCA LAS PLACAS DORADAS':sideMode()?('DESAFÍO · '+selectedActivity().title):urbanMode?('GAEL VERENNE · '+missionChapter(selectedChapter).title):mode==='free'?'FREE RUN · SIN LÍMITE':'GREEN LIGHT · GO!');
}
function showHelp(){if(helpOpen||storyOpen||contactOpen||archiveOpen||workshopOpen||collectionOpen||settingsOpen)return;helpOpen=true;clearControls();ui.help.hidden=false;audio.pause(true);}
function hideHelp(){ui.help.hidden=true;helpOpen=false;audio.pause(paused);}
function togglePause(){if(storyOpen){closeStoryBeat();return;}if(contactOpen){closeContactPanel();return;}if(archiveOpen){closeArchive();return;}if(collectionOpen){closeCollection();return;}if(workshopOpen){closeWorkshop();return;}if(settingsOpen){closeSettings();return;}if(helpOpen){hideHelp();return;}if(!started){unpause();return;}setPaused(!paused);}
function reset(){
 closeStoryBeat();clearObjectivePresentation();initRace();renderer.startCam=true;renderer.effects?.clear();ui.finish.hidden=true;
 if(started&&!paused)activateUrbanRun({urbanMode,sideMode:sideMode(),explorationMode:explorationMode(),mission,sideRun,damageEvents:car.damageEvents});
 if(paused&&started)ui.overlay.hidden=false;
 notice(explorationMode()?'EXPLORACIÓN REINICIADA':sideMode()?'DESAFÍO REINICIADO · '+selectedActivity().title:urbanMode?'MISIÓN REINICIADA · '+missionChapter(selectedChapter).title:'CARRERA REINICIADA · NUEVA PARRILLA');
}
function restartRace(){if(mode==='championship'&&!profile.cup)beginCup(profile,$('carSelect').value);if(cupActive()){syncCupSelection();}reset();updateProfileUI();storageSave();unpause();}
function backToGarage(){
 selectedChapter=campaign.nextChapter;sessionFinalChoice=null;sideSelected=false;freeExploration=false;updateSideMenu();
 if(cupActive())syncCupSelection();reset();updateProfileUI();started=false;paused=true;audio.pause(true);ui.finish.hidden=true;ui.overlay.hidden=false;
 ui.introTitle.innerHTML='CHOOSE<br>YOUR <em>RIDE.</em>';
 ui.start.innerHTML='INICIAR MOTOR <span>↗</span>';
 updateCampaignUI();
 clearControls();$('trackSelect').focus();
}
function updateCampaignUI(){
 const available=urbanMode&&(campaign.nextChapter>1||campaign.completed);
 $('newCampaignBtn').hidden=!available||started||sideMode()||explorationMode();
 $('campaignStatus').hidden=!urbanMode;
 $('campaignStatus').textContent=sideMode()?'DESAFÍO URBANO · NO ALTERA LA CAMPAÑA':explorationMode()?'EXPLORACIÓN LIBRE · SIN RELOJ':campaign.completed?'CAMPAÑA COMPLETADA · REPITE LA MISIÓN FINAL O INICIA UNA NUEVA':available?(campaignSaveOk?'PROGRESO GUARDADO':'SOLO EN ESTA SESIÓN')+' · CONTINUAR MISIÓN '+String(selectedChapter).padStart(2,'0'):'CAMPAÑA · MISIÓN 01';
 if(urbanMode){
  document.querySelector('.intro-index b').textContent=sideMode()?'DESAFÍO':explorationMode()?'LIBRE':'MISIÓN '+String(selectedChapter).padStart(2,'0');
  document.querySelector('.topline span:last-child').textContent=sideMode()?selectedActivity().title:explorationMode()?'EXPLORACIÓN LIBRE':'MISIÓN '+String(selectedChapter).padStart(2,'0')+' · '+missionChapter(selectedChapter).title;
  $('introStory').textContent=sideMode()?'Recorre Barcelona para completar el encargo. No altera el capítulo desbloqueado.':explorationMode()?'Explora los barrios del Carmel y conversa con sus habitantes a tu ritmo.':selectedChapter===1?'Barcelona, octubre de 1984. Gael Verenne debe recoger una cinta comprometida y llevarla a un contacto antes de que sea demasiado tarde.':'Barcelona, octubre de 1984. Continúa la historia de Gael Verenne: '+missionChapter(selectedChapter).title+'. Sigue los objetivos que aparecerán al iniciar la misión.';
 }
 if(urbanMode&&!started)ui.start.innerHTML=sideMode()?'INICIAR DESAFÍO <span>↗</span>':explorationMode()?'EXPLORAR BARCELONA <span>↗</span>':available?'CONTINUAR MISIÓN '+String(selectedChapter).padStart(2,'0')+' <span>↗</span>':'INICIAR MOTOR <span>↗</span>';
}
function newCampaign(){
 if(started||!urbanMode)return;
 try{
  localStorage.setItem(CAMPAIGN_PROGRESS_KEY,JSON.stringify(freshCampaign()));
  localStorage.removeItem(ROUTE_KEY);localStorage.removeItem(FINAL_CHOICE_KEY);
 }catch{notice('NO SE PUDO REINICIAR LA CAMPAÑA · ALMACENAMIENTO BLOQUEADO');return;}
 campaign=freshCampaign();campaignSaveOk=true;selectedChapter=1;sessionFinalChoice=null;sideSelected=false;freeExploration=false;
 reset();updateSideMenu();updateCampaignUI();renderHUD();notice('NUEVA CAMPAÑA · MISIÓN 01');
}
function finishRace(){
 if(finishResolved)return;finishResolved=true;
 audio.cue('finish');paused=true;started=false;audio.pause(true);clearControls();ui.overlay.hidden=true;
 ui.finish.hidden=false;
 const isCup=mode==='championship',isTime=mode==='time';
 ui.finishTitle.textContent=isTime?'CRONO FINAL':race.position===1?'¡VICTORIA!':'BANDERA A CUADROS';
 ui.finishPosition.textContent=isTime?'TIME ATTACK':String(race.position).padStart(2,'0')+' / '+String(race.rivals.length+1).padStart(2,'0');
 ui.finishTime.textContent=formatTime(race.playerFinish);
 $('finishSelection').textContent=`${currentMode().name} · ${getTrack().name} · ${getCar($('carSelect').value).name}`;
 ui.finishBoard.replaceChildren();
 for(const racer of race.finalResults){
  const line=document.createElement('div');line.className='finish-row'+(racer.id==='YOU'?' you':'');
  const label=document.createElement('span');label.textContent=String(racer.position).padStart(2,'0')+'  '+racer.name;
  const data=document.createElement('b');data.textContent=racer.finishTime===null?'EN PISTA':formatTime(racer.finishTime);
  line.append(label,data);ui.finishBoard.append(line);
 }
 const award=awardFinish(profile,{id:runId,mode,track:getTrack().id,car:$('carSelect').value,position:race.position,time:race.playerFinish,validBest:car.invalidLaps===0});
 let message=`+${award.xp} XP · ${award.newBest?'NUEVO MEJOR TIEMPO TOTAL':'TIEMPO REGISTRADO'}`;
 $('nextCupBtn').hidden=true;$('restartRaceBtn').hidden=false;$('restartRaceBtn').textContent='REPETIR CARRERA ↗';$('backToGarageBtn').textContent='CAMBIAR COCHE O PISTA ↗';
 if(isTime&&car.invalidLaps)message+=' · '+car.invalidLaps+' VUELTA(S) NO VÁLIDA(S)';
 if(isCup){
  cupResult=completeCupRound(profile,race.position,race.playerFinish);
  message+=` · COPA +${cupResult.results.at(-1).points} PUNTOS · ACUMULADO ${cupResult.points}`;
  if(cupResult.round<3){$('nextCupBtn').hidden=false;$('restartRaceBtn').hidden=true;}
  else{$('finishTitle').textContent='COPA FINALIZADA';$('restartRaceBtn').textContent='NUEVA COPA ↗';message+=` · ${cupResult.points} PUNTOS FINALES · ${cupResult.points>=25?'TROFEO DE ORO':cupResult.points>=17?'TROFEO DE PLATA':'TROFEO DE BRONCE'}`;}
 }
 $('rewardReport').textContent=message;
 storageSave();updateProfileUI();
}
function sideEnd(state,reason=''){
 clearObjectivePresentation();
 const activity=selectedActivity(),won=state==='won',next={...sideStats};
 // Reward claims are transactional: a failed storage write must not mutate the active run.
 const proposedRun={...sideRun};
 let stored=false;
 if(won&&awardSideRun(next,proposedRun)){
  stored=saveSideStats(localStorage,next);
  if(stored){sideStats=next;sideRun.claimed=true;}
 }
 paused=true;started=false;finishResolved=true;clearControls();audio.pause(true);ui.overlay.hidden=true;ui.finish.hidden=false;
 ui.finishTitle.textContent=won?'¡DESAFÍO COMPLETADO!':'ENCARGO FALLIDO';
 ui.finishPosition.textContent=won?'FINALIZADO / OK':'SIN RECOMPENSA';
 ui.finishTime.textContent=formatTime(sideRun.elapsed);
 $('finishSelection').textContent='BARCELONA 1984 · '+activity.title;
 ui.finishBoard.replaceChildren();
 const row=document.createElement('div');row.className='finish-row you';
 const label=document.createElement('span');label.textContent='CONTROLES SUPERADOS';
 const count=document.createElement('b');count.textContent=sideRun.index+' / '+activity.points.length;
 row.append(label,count);ui.finishBoard.append(row);
 $('rewardReport').textContent=won?(stored?`+${activity.reward} ₧ · SALDO: ${sideStats.credits} ₧ · RÉCORD: ${sideRecord(sideStats,activity.id).best?.toFixed(1)||'—'} s`:'DESAFÍO TERMINADO · NO SE PUDO GUARDAR LA RECOMPENSA'):(reason|| (activity.type==='fragile'&&sideRun.impacts>activity.maxImpacts?'DEMASIADOS IMPACTOS · CARGA DAÑADA':'TIEMPO AGOTADO · SIN RECOMPENSA'));
 $('restartRaceBtn').hidden=false;$('restartRaceBtn').textContent='REPETIR DESAFÍO ↗';
 $('nextCupBtn').hidden=true;$('backToGarageBtn').textContent='CAMBIAR DESAFÍO ↗';
 updateSideMenu();
}
function syncCupSelection(){
 const cup=cupActive();if(!cup)return;
 $('trackSelect').value=cupTrack(profile);$('carSelect').value=cup.car;
 selectTrack($('trackSelect').value);renderer.changeTrack();renderer.changeVehicle(cup.car);
}
function nextCupRound(){if(urbanMode&&selectedChapter<15&&mission.phase==='won'){sessionFinalChoice=rememberFinalChoice(sessionFinalChoice,mission);selectedChapter++;reset();updateProfileUI();unpause();return;}if(!cupActive())return;syncCupSelection();reset();savedBest=readRecord();updateSelectionUI();updateProfileUI();storageSave();unpause();}
function selectMode(){
 mode=MODES.some(x=>x.id===$('modeSelect').value)?$('modeSelect').value:'arcade';
 if(mode==='championship'){
  if(!profile.cup)beginCup(profile,$('carSelect').value);
  syncCupSelection();
 }
 changeSelection();updateProfileUI();storageSave();
}
function resetCup(){
 if(mode!=='championship')return;
 if(!confirm('¿Reiniciar la copa actual y perder sus rondas guardadas?'))return;
 beginCup(profile,profile.cup?.car||$('carSelect').value);syncCupSelection();changeSelection();storageSave();notice('WORLD CUP REINICIADA');
}

function camera(){if(pedestrian.active){if(recenterPedestrianCamera(pedestrian)){renderer.startCam=true;notice('CÁMARA A PIE · CENTRADA DETRÁS DE GAEL');}return;}const name=renderer.nextCamera();notice('CÁMARA · '+name);}
function applyLighting(){
 const look=getLighting(lightingMode);
 renderer?.setLighting(lightingMode);
 $('app').dataset.lighting=lightingMode;
 const button=$('lightingBtn');button.innerHTML='☼ <span>'+look.label+'</span>';
 button.title='Cambiar iluminación de Barcelona: '+look.label+' (B)';
 button.setAttribute('aria-label','Iluminación de Barcelona: '+look.label+'. Cambiar con B');
 button.hidden=!urbanMode;
 $('lightingLabel').textContent=urbanMode?look.label+' · BARCELONA 1984':'';
 $('lightingLabel').hidden=!urbanMode;
}
function cycleLighting(){
 if(helpOpen||settingsOpen||contactOpen||archiveOpen||collectionOpen||workshopOpen)return;
 if(!urbanMode){notice('ILUMINACIÓN · DISPONIBLE EN BARCELONA');return;}
 lightingMode=nextLighting(lightingMode);applyLighting();
 if(!saveLighting({setItem:(k,v)=>localStorage.setItem(k,v)},lightingMode))notice('ILUMINACIÓN '+getLighting(lightingMode).label+' · NO SE PUDO GUARDAR');
 else notice('ILUMINACIÓN · '+getLighting(lightingMode).label);
}
function effectiveReducedMotion(){return settings.reducedMotion||Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);}
function persistSettings(){let ok=false;try{ok=saveSettings(localStorage,settings);}catch{}if(!ok)notice('AJUSTES NO GUARDADOS: ALMACENAMIENTO BLOQUEADO');}
function quality(){const i=qualityModes.findIndex(x=>x.id===settings.quality);settings.quality=qualityModes[(i+1)%qualityModes.length].id;applyQuality();persistSettings();notice('GRÁFICOS · '+settings.quality.toUpperCase());}
function applyQuality(){
 if(settings.quality==='auto')automaticQuality.reset();
 const scale=settings.quality==='auto'?automaticQuality.scale:qualityScale(settings.quality);
 if(renderer&&scale!==appliedScale){renderer.setQuality(scale);appliedScale=scale;}
 const label=qualityModes.find(x=>x.id===settings.quality)?.name||'AUTO';
 $('graphicsBtn').innerHTML='◇ <span>'+label+'</span>'; $('graphicsBtn').setAttribute('aria-label','Calidad gráfica: '+label);
}
const BIND_LABELS={throttle:'Acelerar',brake:'Frenar',left:'Girar izquierda',right:'Girar derecha',handbrake:'Derrapar'};
const codeName=code=>code==='Space'?'ESPACIO':code.startsWith('Key')?code.slice(3):code==='ShiftLeft'?'SHIFT IZQ':code==='ShiftRight'?'SHIFT DER':code.replace('Arrow','FLECHA ');
function showSettings(){
 if(settingsOpen)return;
 settingsFocus=document.activeElement;settingsOpen=true;clearControls();audio.pause(true);
 $('settingQuality').value=settings.quality;$('settingVolume').value=String(settings.audioVolume);$('settingSteering').value=String(settings.steeringSensitivity);$('settingScale').value=String(settings.hudScale);$('settingContrast').checked=settings.contrast;$('settingMotion').checked=settings.reducedMotion;
 $('bindingGrid').replaceChildren();$('settingsError').textContent='';
 for(const [action,label] of Object.entries(BIND_LABELS)){
  const lab=document.createElement('label');lab.htmlFor='bind-'+action;lab.textContent=label;
  const select=document.createElement('select');select.id='bind-'+action;select.dataset.action=action;select.setAttribute('aria-label','Tecla para '+label.toLowerCase());
  for(const code of BINDABLE_CODES){const o=document.createElement('option');o.value=code;o.textContent=codeName(code);select.append(o);}
  select.value=keymap[action];$('bindingGrid').append(lab,select);
 }
 $('settingsOverlay').hidden=false;$('settingsOverlay').querySelector('.settings-card').focus();
}
function closeSettings(){if(!settingsOpen)return;settingsOpen=false;$('settingsOverlay').hidden=true;audio.pause(paused||helpOpen);settingsFocus?.focus?.();}
function resetSettingsForm(){const defaults=normalizeSettings(null);$('settingQuality').value=defaults.quality;$('settingVolume').value=String(defaults.audioVolume);$('settingSteering').value=String(defaults.steeringSensitivity);$('settingScale').value=String(defaults.hudScale);$('settingContrast').checked=false;$('settingMotion').checked=false;for(const action of Object.keys(BIND_LABELS))$('bind-'+action).value=defaults.bindings[action];$('settingsError').textContent='';}
function commitSettings(){
 const next={version:1,quality:$('settingQuality').value,audioVolume:Number($('settingVolume').value),steeringSensitivity:Number($('settingSteering').value),hudScale:Number($('settingScale').value),contrast:$('settingContrast').checked,reducedMotion:$('settingMotion').checked,bindings:{}};
 for(const action of Object.keys(BIND_LABELS))next.bindings[action]=$('bind-'+action).value;
 if(!validateBindings(next.bindings)){$('settingsError').textContent='Cada función necesita una tecla propia y no reservada para interactuar.';return;}
 Object.assign(settings,normalizeSettings(next));Object.assign(keymap,settings.bindings);audio.setVolume(settings.audioVolume/100);clearControls();
 $('app').dataset.contrast=String(settings.contrast);$('app').dataset.hudScale=String(settings.hudScale);$('app').dataset.reducedMotion=String(settings.reducedMotion);renderer.setEffectsEnabled(effectsEnabled&&!effectiveReducedMotion());
 $('scene').setAttribute('aria-label','Carrera 3D. Controles personalizados configurables desde Ajustes.');
 automaticQuality.reset();appliedScale=-1;applyQuality();persistSettings();closeSettings();notice('AJUSTES DE ACCESIBILIDAD APLICADOS');
}

function effects(){effectsEnabled=!effectsEnabled;renderer.setEffectsEnabled(effectsEnabled&&!effectiveReducedMotion());$('fxBtn').setAttribute('aria-pressed',String(effectsEnabled));$('fxBtn').innerHTML=effectsEnabled?'✦ <span>FX ON</span>':'✧ <span>FX OFF</span>';try{localStorage.setItem('chase404.effects.v6',effectsEnabled?'on':'off')}catch{}notice(effectsEnabled?'EFECTOS VISUALES ACTIVADOS':'EFECTOS VISUALES DESACTIVADOS');}
async function sound(){try{const on=await audio.toggle();$('soundBtn').setAttribute('aria-pressed',String(on));$('soundBtn').innerHTML=on?'♫ <span>AUDIO ON</span>':'♫ <span>AUDIO OFF</span>';audio.pause(paused||helpOpen||settingsOpen||archiveOpen||contactOpen||collectionOpen||workshopOpen);}catch(e){notice(e.message.toUpperCase());}}
const ctx=ui.minimap.getContext('2d');
function drawMap(){
 const c=ui.minimap,w=c.width,h=c.height,pad=20;
 if(urbanMode){ctx.clearRect(0,0,w,h);ctx.fillStyle='#243c3a';ctx.fillRect(0,0,w,h);const pts=CITY.streets.flat(),xs=pts.map(p=>p[0]),zs=pts.map(p=>p[1]),minX=Math.min(...xs)-28,maxX=Math.max(...xs)+28,minZ=Math.min(...zs)-28,maxZ=Math.max(...zs)+28,scale=Math.min((w-pad*2)/(maxX-minX),(h-pad*2)/(maxZ-minZ)),loc=p=>[w/2+(p[0]-(minX+maxX)/2)*scale,h/2+(p[1]-(minZ+maxZ)/2)*scale];ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#d5c3a2';ctx.lineWidth=6;for(const road of CITY.streets){ctx.beginPath();road.forEach((p,i)=>i?ctx.lineTo(...loc(p)):ctx.moveTo(...loc(p)));ctx.stroke();}ctx.fillStyle='#e6d19c';ctx.font='bold 10px monospace';ctx.fillText('BARCELONA · 1984',7,13);ctx.fillStyle='#84ebd1';ctx.fillRect(...loc([WORKSHOP.x,WORKSHOP.z]).map(n=>n-3),6,6);ctx.fillStyle='#e9b97b';ctx.fillRect(...loc([CARMEL_GARAGE.x,CARMEL_GARAGE.z]).map(n=>n-4),8,8);
 // Personajes fijos (verde) y pruebas activas (ámbar): puntos geográficos ficticios.
 if(explorationMode())for(const npc of CONTACTS){const stage=contactStage(sideStats,npc.id),[cx,cy]=loc([npc.x,npc.z]);ctx.fillStyle=stage==='done'?'#799e91':'#7decc0';ctx.strokeStyle='#18372e';ctx.lineWidth=2;ctx.fillRect(cx-4,cy-4,8,8);ctx.strokeRect(cx-4,cy-4,8,8);
  if(stage==='active'){const [ex,ey]=loc([npc.location.x,npc.location.z]);ctx.fillStyle='#ffb86f';ctx.beginPath();ctx.arc(ex,ey,5,0,Math.PI*2);ctx.fill();ctx.stroke();}
 }
 const found=new Set(cleanDiscoveries(sideStats.discoveries));
 for(const spot of DISCOVERIES){const [sx,sy]=loc([spot.x,spot.z]);ctx.fillStyle=found.has(spot.id)?'#608a80':'#f4cd73';ctx.strokeStyle='#17282f';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sx,sy,found.has(spot.id)?2.5:4.1,0,Math.PI*2);ctx.fill();ctx.stroke();}const target=explorationMode()?null:sideMode()?sideTarget(sideRun):missionTarget(mission);if(target?.kind==='branch'){for(const option of target.alternatives){ctx.fillStyle='#ff8060';ctx.strokeStyle='#fff0c5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(...loc([option.x,option.z]),6,0,Math.PI*2);ctx.fill();ctx.stroke();}}else if(target){ctx.fillStyle='#ff8060';ctx.strokeStyle='#fff0c5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(...loc([target.x,target.z]),6,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.fillStyle='#ffd47a';ctx.beginPath();ctx.arc(...loc([pedestrian.active?pedestrian.x:car.x,pedestrian.active?pedestrian.z:car.z]),5,0,Math.PI*2);ctx.fill();return;}
 const ps=Array.from({length:200},(_,i)=>sample(LENGTH*i/200));
 const minX=Math.min(...ps.map(p=>p.x)),maxX=Math.max(...ps.map(p=>p.x));
 const minZ=Math.min(...ps.map(p=>p.z)),maxZ=Math.max(...ps.map(p=>p.z));
 const scale=Math.min((w-pad*2)/(maxX-minX+28),(h-pad*2)/(maxZ-minZ+28));
 const loc=p=>[w/2+(p.x-(minX+maxX)/2)*scale,h/2+(p.z-(minZ+maxZ)/2)*scale];
 ctx.clearRect(0,0,w,h);ctx.lineJoin='round';ctx.lineCap='round';
 for(const [size,color] of [[16,'#466c6e'],[9,'#c9d9d9'],[5,'#1e374a']]){
  ctx.strokeStyle=color;ctx.lineWidth=size;ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(...loc(p)):ctx.moveTo(...loc(p)));ctx.closePath();ctx.stroke();
 }
 for(const rival of race.rivals){ctx.fillStyle='#9ad4ee';ctx.beginPath();ctx.arc(...loc(rival),3.2,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#ffd47a';ctx.shadowColor='#ffe2ad';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(...loc(car),5.6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle='#cbd6df';ctx.font='bold 11px monospace';ctx.fillText('START / FINISH',6,17);
}
function updateSelectionUI(){
 const track=getTrack(),spec=getCar($('carSelect').value),index=TRACKS.findIndex(t=>t.id===track.id)+1;$('app').dataset.world=urbanMode?'urban':'track';applyLighting();updateSideMenu();$('vehicleHealthRow').hidden=!urbanMode;$('workshopBtn').hidden=!urbanMode;$('workshopHint').hidden=true;$('collectionBtn').hidden=!urbanMode;$('collectionHint').hidden=true;$('archiveBtn').hidden=!urbanMode;$('touchVehicle').hidden=!urbanMode;document.querySelector('.touch-actions').hidden=!urbanMode;$('discoveryHint').hidden=true;$('discoveryCollect').hidden=true;
 $('carType').textContent=spec.type;$('carDescription').textContent=spec.tag;
 const stats=[['POTENCIA','power'],['PUNTA','topSpeed'],['AGARRE','grip'],['DIRECCIÓN','steer']];$('carStats').replaceChildren();
 for(const [label,key] of stats){const row=document.createElement('label');row.className='garage-stat';const span=document.createElement('span');span.textContent=label;const meter=document.createElement('meter');meter.min=.75;meter.max=1.3;meter.value=spec.tune[key];meter.setAttribute('aria-label',label);row.append(span,meter);$('carStats').append(row);}
 if(urbanMode){$('headerTrack').textContent='EL CARMEL · BARCELONA';$('trackIndex').innerHTML='1984<span>/BCN</span>';$('trackName').textContent='EL CARMEL';$('trackKind').textContent='LADERA · TURÓ DE LA ROVIRA';$('trackDescription').textContent='EL CARMEL · BARCELONA · 1984';$('modeDescription').textContent='Recorre las calles de ladera del Carmel';$('modeTag').textContent='▰ EL CARMEL · BARCELONA · 1984';$('modeHUD').textContent='GAEL VERENNE · LA CINTA DEL TURÓ';$('metricCars').textContent='01';$('metricLaps').textContent='∞';$('metricAI').textContent='MISIÓN';$('modeSelect').value='free';$('modeSelect').disabled=true;$('clockHeading').textContent=freeExploration?'TIEMPO EXPLORANDO':'TIEMPO RESTANTE';$('recordLines').hidden=true;$('raceScore').hidden=true;$('raceTimerPanel').hidden=true;$('raceGapPanel').hidden=true;$('leaderboard').hidden=true;$('lapDataRow').hidden=true;$('sectorDataRow').hidden=true;$('minimap').setAttribute('aria-label','Minimapa del Carmel, Barcelona, 1984');$('cupStatus').hidden=true;$('newCupBtn').hidden=true;$('trackSelect').disabled=false;$('carSelect').disabled=false;$('scene').setAttribute('aria-label','Conducción 3D por El Carmel, Barcelona, 1984');updateCampaignUI();return;}
 $('modeSelect').disabled=false;$('clockHeading').textContent='TIEMPO DE VUELTA';$('recordLines').hidden=false;$('raceScore').hidden=false;$('raceTimerPanel').hidden=false;$('raceGapPanel').hidden=false;$('leaderboard').hidden=false;$('lapDataRow').hidden=false;$('sectorDataRow').hidden=false;$('minimap').setAttribute('aria-label','Minimapa del circuito');
 $('headerTrack').textContent=track.name;
 $('trackIndex').innerHTML=String(index).padStart(2,'0')+'<span>/03</span>';
 $('trackName').textContent=track.name;
 $('trackKind').textContent=track.subtitle.toUpperCase()+' · '+track.difficulty;
 $('trackDescription').textContent=`${track.subtitle} · ${Math.round(LENGTH)} m · ${track.difficulty}`;
 $('scene').setAttribute('aria-label',`Carrera 3D en ${track.name} con ${spec.name}`);
 updateCampaignUI();
}
function changeSelection(){
 if(started&&!paused)setPaused(true);
 if(cupActive()){ $('trackSelect').value=cupTrack(profile);$('carSelect').value=profile.cup.car; }
 const chosen=$('trackSelect').value;urbanMode=chosen==='barcelona';if(!urbanMode)selectTrack(chosen);else mode='free';
 const selected=getCar($('carSelect').value);
 renderer.setUrbanMode(urbanMode);if(!urbanMode)renderer.changeTrack();renderer.changeVehicle(selected.id);
 initRace();
 savedBest=readRecord();started=false;paused=true;clearControls();ui.finish.hidden=true;ui.overlay.hidden=false;
 ui.introTitle.innerHTML='CHOOSE<br>YOUR <em>RIDE.</em>';
 ui.start.innerHTML='INICIAR MOTOR <span>↗</span>';
 $('pauseBtn').innerHTML='▶ <span>SEGUIR</span>';
 updateSelectionUI();updateProfileUI();renderHUD();
 try{localStorage.setItem('chase404.track.v4',chosen);localStorage.setItem('chase404.car.v4',selected.id);}catch{}
 notice(urbanMode?`EL CARMEL · ${selected.name}`:`PARRILLA · ${getTrack().name} · ${selected.name}`);
}
function renderMissionReport(won){
 const chapter=missionChapter(selectedChapter);
 const report=missionReport({won,chapter:selectedChapter,elapsed:mission.elapsed,limit:chapter.limit,damage:car.damage||0,impacts:car.damageEvents||0,routeChoice:mission.routeChoice,finalChoice:mission.finalChoice,failure:ui.finishTitle.textContent});
 const entries=[['EVALUACIÓN',report.grade],['TIEMPO DISPONIBLE',formatTime(report.remaining)],['ESTADO DEL VEHÍCULO',Math.round(100-report.damage)+' %'],['IMPACTOS',String(report.impacts)]];
 if(report.consequence)entries.push(['DECISIÓN',report.consequence]);
 for(const [name,value] of entries){const row=document.createElement('div');row.className='finish-row';const label=document.createElement('span');label.textContent=name;const strong=document.createElement('b');strong.textContent=value;row.append(label,strong);ui.finishBoard.append(row);}
 const message=document.createElement('p');message.className='mission-report-summary';message.textContent=report.summary;ui.finishBoard.append(message);
}
function missionEnd(won,{captured=false}={}){clearObjectivePresentation();if(won&&selectedChapter===14&&mission.finalChoice&&!writeFinalChoice(localStorage,mission.finalChoice))notice('NO SE PUDO GUARDAR LA DECISIÓN FINAL');if(won&&selectedChapter===8&&mission.routeChoice&&!writeRoute(localStorage,mission.routeChoice))notice('NO SE PUDO GUARDAR LA DECISIÓN DE RUTA');if(won){campaign=advanceCampaign(campaign,selectedChapter);campaignSaveOk=writeCampaign(localStorage,campaign);if(!campaignSaveOk)notice('NO SE PUDO GUARDAR EL AVANCE · CONTINÚA EN ESTA SESIÓN');}paused=true;started=false;clearControls();audio.pause(true);ui.overlay.hidden=true;ui.finish.hidden=false;ui.finishTitle.textContent=missionFailureTitle({won,captured,chapter:selectedChapter,tailLost:mission.tailLost});ui.finishPosition.textContent=won?'MISIÓN '+String(selectedChapter).padStart(2,'0')+' / OK':'MISIÓN '+String(selectedChapter).padStart(2,'0')+' / FALLO';ui.finishTime.textContent=formatTime(mission.elapsed);$('finishSelection').textContent='GAEL VERENNE · EL CARMEL · OCTUBRE 1984';ui.finishBoard.replaceChildren();renderMissionReport(won);$('rewardReport').textContent=won?(selectedChapter===15?(mission.finalChoice==='RECUPERAR LAS PRUEBAS'?'Gael salva a su hermano y presenta las pruebas contra Salvat. Clara confirma su detención. Barcelona conserva cicatrices, pero los dos hermanos salen juntos. FIN · LA VERDAD.':'Gael recupera las pruebas que faltaban y encara a Salvat. Su hermano está a salvo, aunque parte de la red consigue escapar. FIN · LA FAMILIA.') :selectedChapter===14?(mission.finalChoice==='RESCATAR A MI HERMANO'?'Gael rescata a su hermano, pero Salvat todavía conserva pruebas comprometedoras. La persecución final será más peligrosa.':'Gael reúne pruebas decisivas contra Salvat, pero su hermano sigue retenido. El rescate quedará para la última noche.') :selectedChapter===13?'El expediente y la grabación identifican a Víctor Salvat, inspector corrupto que dirige los traslados clandestinos. El hermano de Gael sigue retenido y el próximo movimiento será decisivo.':selectedChapter===12?'El testigo ha identificado un registro oculto en el Eixample. Gael recupera un código que apunta a un traslado nocturno de su hermano desde el puerto.':selectedChapter===11?'Gael saca con vida al testigo del almacén. El rescate confirma que la red criminal conoce su siguiente movimiento.':selectedChapter===10?'Clara revela que el inspector utiliza el almacén 04 como tapadera. El hermano de Gael fue trasladado, pero sigue vivo.':selectedChapter===9?'La declaración vincula a un inspector con el convoy. Gael sabe ahora a quién buscar.':selectedChapter===8?'Gael escapó por '+(mission.routeChoice||'una calle secundaria')+'. La emboscada confirma que hay policías comprados.':selectedChapter===7?'Gael ha memorizado la matrícula del sedán gris. El convoy cambia sus rutas cada noche.':selectedChapter===6?'Gael escucha la conversación y descubre que la organización prepara un traslado clandestino. Su hermano podría seguir vivo.':selectedChapter===5?'En el mirador, Gael identifica al hombre que ordenó la desaparición de su hermano. La cinta era solo el principio.':selectedChapter===4?'En el almacén, Gael descubre una lista de matrículas y una cita al anochecer en Montjuïc.':selectedChapter===3?'La entrega revela la conexión entre las avenidas y los almacenes del puerto.':selectedChapter===2?'El contacto de Gràcia confirma que la cinta señala una operación en el puerto.':'Gael ha entregado la cinta. Una voz al otro lado del teléfono conoce su nombre.'):'El contacto se ha marchado. Gael tendrá que intentarlo de nuevo.';$('restartRaceBtn').hidden=false;$('nextCupBtn').hidden=!(won&&selectedChapter<15);$('nextCupBtn').textContent=selectedChapter===1?'MISIÓN 02 · GRÀCIA ↗':selectedChapter===2?'MISIÓN 03 · EIXAMPLE ↗':selectedChapter===3?'MISIÓN 04 · PUERTO ↗':selectedChapter===4?'MISIÓN 05 · MONTJUÏC ↗':selectedChapter===5?'MISIÓN 06 · VIGILANCIA ↗':selectedChapter===6?'MISIÓN 07 · SEGUIMIENTO ↗':selectedChapter===7?'MISIÓN 08 · EMBOSCADA ↗':selectedChapter===8?'MISIÓN 09 · TESTIGOS ↗':selectedChapter===9?'MISIÓN 10 · CLARA ↗':selectedChapter===10?'MISIÓN 11 · RESCATE ↗':selectedChapter===11?'MISIÓN 12 · ARCHIVO ↗':selectedChapter===12?'MISIÓN 13 · LA CINTA ↗':selectedChapter===13?'MISIÓN 14 · DECISIÓN ↗':'MISIÓN 15 · FINAL ↗';$('restartRaceBtn').textContent='REPETIR MISIÓN ↗';$('backToGarageBtn').textContent='VOLVER AL GARAJE ↗';}
function renderHUD(){refreshDiscoveryHUD();refreshContactHUD();
 const listener=pedestrian.active?pedestrian:car;const district=soundDistrictAt(listener.x,listener.z,urbanMode);$('districtLabel').textContent=urbanMode?SOUND_DISTRICTS[district]+' · 1984':'ARCADE · 1984';ui.speed.textContent=pedestrian.active?'PIE':String(car.kmh).padStart(3,'0');ui.fill.style.width=(Math.min(100,car.kmh/((car.urban?35:73)*car.tune.topSpeed*3.6)*100)).toFixed(1)+'%';ui.gear.textContent=car.speed<-.3?'R':car.kmh<2?'N':Math.min(5,Math.floor(car.kmh/50)+1);ui.clock.textContent=urbanMode?formatTime(explorationMode()?urbanElapsed:sideMode()?sideRun.remaining:mission.remaining):formatTime(car.lapTime);ui.lap.textContent=String(car.lap).padStart(2,'0');ui.best.textContent=formatTime(savedBest??car.best);ui.last.textContent=formatTime(car.lastLap);ui.sector.textContent=String(car.gate+1).padStart(2,'0')+' / 04';ui.surface.textContent=car.wall?'BARRERA':car.offroad?'GRAVA':slipstream(race,car)>.4?'REBUFO':'ASFALTO';ui.surface.style.color=car.offroad||car.wall?'#ffc181':'#fff';ui.fps.textContent=renderer.fps?renderer.fps+' FPS':'-- FPS';ui.model.textContent=(renderer.modelSource==='GLB'?'GLB · ':'3D · ')+getCar(urbanMode?car.vehicleId:$('carSelect').value).name;ui.model.title=renderer.modelError||'Modelo local sin dependencias de red';
 updateObjectivePresentation();if(urbanMode){$('workshopHint').hidden=!workshopAvailable();$('collectionHint').hidden=!collectionAvailable();const condition=damageCondition(car);$('vehicleHealth').textContent=condition.health+'%';$('vehicleHealth').style.color=condition.health<35?'#ff897e':condition.health<70?'#ffd18a':'#b6efc5';const damageCue=damageFeedback(car);const threatCue=pursuitThreat([police,...ambushPatrols],pedestrian.active?pedestrian:car);const warning=$('dangerIndicator');warning.hidden=damageCue.level==='good'&&threatCue.level==='none';warning.dataset.level=threatCue.level==='critical'||damageCue.level==='critical'?'critical':threatCue.level==='high'||damageCue.level==='high'?'high':'info';warning.textContent=threatCue.level!=='none'?threatCue.label+(damageCue.level!=='good'?' · '+damageCue.health+'% MOTOR':''):damageCue.label;const target=explorationMode()?null:sideMode()?sideTarget(sideRun):missionTarget(mission);$('missionHUD').hidden=false;$('missionObjective').title=pedestrian.active?'A PIE · E para subir al coche más cercano':'E para salir del coche cuando esté detenido';$('missionHUD').querySelector('strong').textContent=explorationMode()?'EXPLORACIÓN · BARCELONA 1984':sideMode()?selectedActivity().title:missionChapter(selectedChapter).title;$('missionObjective').textContent=explorationMode()?'EXPLORA PISTAS (X) Y HABLA CON MANEL, CLARA O NÚRIA (N) · DIARIO: J':target?`${sideMode()?sideRun.index+1:mission.index+1}/${sideMode()?selectedActivity().points.length:missionChapter(selectedChapter).points.length} · ${sideMode()?'Control: '+target.name:target.text}${['stakeout','tail','evade','contact','rescue','investigate','extract','decision','precision-drive'].includes(target.kind)?' ('+Math.floor(mission.holdProgress)+'/'+target.hold+' s)':''}`:(sideMode()?sideRun.phase:mission.phase)==='won'?'OBJETIVO COMPLETADO':(sideMode()?sideRun.phase:mission.phase)==='lost'?'OBJETIVO FALLIDO':'Preparando misión';$('missionDistance').textContent=explorationMode()?discoveryProgress(sideStats).count+' / '+DISCOVERIES.length+' PISTAS':target?(target.kind==='tail'?Math.round(Math.hypot((pedestrian.active?pedestrian:car).x-suspect.x,(pedestrian.active?pedestrian:car).z-suspect.z)):sideMode()?Math.round(Math.hypot((pedestrian.active?pedestrian:car).x-target.x,(pedestrian.active?pedestrian:car).z-target.z)):missionDistance(mission,pedestrian.active?pedestrian:car))+' m'+(police.active?' · POLICÍA EN PERSECUCIÓN':police.heat>0?' · ALERTA':''):'--';}else $('missionHUD').hidden=true;
 ui.position.textContent=String(race.position).padStart(2,'0');ui.positionTotal.textContent=String(race.rivals.length+1).padStart(2,'0');
 ui.raceLap.textContent=String(Math.min(Number.isFinite(race.laps)?race.laps:99,car.lap)).padStart(2,'0');ui.raceLaps.textContent=Number.isFinite(race.laps)?String(race.laps).padStart(2,'0'):'∞';
 ui.raceClock.textContent=formatTime(race.elapsed);
 const gap=positionDelta(race,car);ui.gap.textContent=!race.rivals.length?(mode==='free'?'LIBRE':'MEJOR TIEMPO'):gap===null?'LÍDER':Math.round(gap)+' m';
 ui.list.replaceChildren();
 for(const item of race.order.slice(0,8)){
  const row=document.createElement('div');row.className='leader-row'+(item.id==='YOU'?' is-you':'');
  const pos=document.createElement('span');pos.textContent=String(item.position).padStart(2,'0');
  const name=document.createElement('b');name.textContent=item.name;
  const state=document.createElement('small');state.textContent=item.finishTime!==null?'META':item.id==='YOU'?String(car.kmh)+' km/h':Math.round(race.rivals.find(r=>r.id===item.id).kmh)+' km/h';
  row.append(pos,name,state);ui.list.append(row);
 }
 drawMap();}
function toggleVehicle(){
 if(!urbanMode||!started||paused||helpOpen||contactOpen||archiveOpen||workshopOpen||collectionOpen||settingsOpen)return;
 if(pedestrian.active){const v=enterVehicle(pedestrian,car,streetTraffic);
  if(v){car.tune=tuneWithUpgrades(car.vehicleId,sideStats);renderer.changeVehicle(car.vehicleId);}
  notice(v?'GAEL · '+getCar(car.vehicleId).name+' · VEHÍCULO RECUPERADO':'ACÉRCATE A UN VEHÍCULO DETENIDO');
 }else{
  notice(exitVehicle(pedestrian,car,[...streetTraffic,...(police.active?[police.agent]:[]),...ambushPatrols.filter(p=>p.active).map(p=>p.agent)])?'GAEL · A PIE · WASD SEGÚN CÁMARA · ESPACIO CORRER · C RECENTRAR · E SUBIR':'DETÉN EL COCHE ANTES DE BAJAR');
 }
 renderer.startCam=true;clearControls();renderHUD();
}
function attachTouch(id,key){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();try{el.setPointerCapture(e.pointerId);}catch{}controls.pointerDown(e.pointerId,key);syncControls();});for(const ev of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(ev,e=>{controls.pointerUp(e.pointerId);syncControls();});}
function bindEvents(){
 $('newCampaignBtn').addEventListener('click',newCampaign);
 $('storyContinue').addEventListener('click',closeStoryBeat);
 $('contactJournalBtn').addEventListener('click',contactJournal);$('contactInteract').addEventListener('click',contactInteract);$('contactClose').addEventListener('click',closeContactPanel);$('contactContinue').addEventListener('click',closeContactPanel);
 $('touchVehicle').addEventListener('click',toggleVehicle);$('touchInteract').addEventListener('click',contactInteract);$('touchCollect').addEventListener('click',collectNearbyDiscovery);$('touchJournal').addEventListener('click',contactJournal);$('archiveBtn').addEventListener('click',showArchive);$('archiveClose').addEventListener('click',closeArchive);$('archiveContinue').addEventListener('click',closeArchive);$('discoveryCollect').addEventListener('click',collectNearbyDiscovery);
 $('collectionBtn').addEventListener('click',showCollection);$('collectionClose').addEventListener('click',closeCollection);$('collectionContinue').addEventListener('click',closeCollection);$('collectionPark').addEventListener('click',parkCurrentVehicle);
 $('workshopBtn').addEventListener('click',showWorkshop);$('workshopClose').addEventListener('click',closeWorkshop);$('workshopContinue').addEventListener('click',closeWorkshop);
 $('exploreBtn').addEventListener('click',()=>{
  if(started&&!paused)return;
  freeExploration=!freeExploration;sideSelected=false;reset();updateProfileUI();updateSideMenu();updateCampaignUI();renderHUD();
  notice(freeExploration?'EXPLORACIÓN LIBRE SELECCIONADA · SIN LÍMITE':'CAMPAÑA PRINCIPAL');
 });
 $('sideBtn').addEventListener('click',()=>{
  if(started&&!paused)return;
  sideSelected=!sideSelected;freeExploration=false;reset();updateProfileUI();updateSideMenu();updateCampaignUI();
  notice(sideSelected?'DESAFÍO ACTIVO · NO ALTERA LA CAMPAÑA':'CAMPAÑA PRINCIPAL');
 });
 $('sideSelect').addEventListener('change',()=>{
  if(started&&!paused){$('sideSelect').value=selectedSideId;return;}
  selectedSideId=getSideActivity($('sideSelect').value).id;
  reset();updateProfileUI();updateSideMenu();updateCampaignUI();notice('DESAFÍO SELECCIONADO · '+selectedActivity().title);
 });
 $('settingsBtn').addEventListener('click',showSettings);$('closeSettings').addEventListener('click',closeSettings);$('saveSettings').addEventListener('click',commitSettings);$('resetSettings').addEventListener('click',resetSettingsForm);
 $('settingsOverlay').addEventListener('click',e=>{if(e.target===$('settingsOverlay'))closeSettings();});
 ui.start.addEventListener('click',unpause);$('trackSelect').addEventListener('change',changeSelection);$('carSelect').addEventListener('change',changeSelection);$('pauseBtn').addEventListener('click',togglePause);$('resetBtn').addEventListener('click',reset);$('cameraBtn').addEventListener('click',camera);$('graphicsBtn').addEventListener('click',quality);$('soundBtn').addEventListener('click',sound);$('fxBtn').addEventListener('click',effects);$('lightingBtn').addEventListener('click',cycleLighting);
 $('modeSelect').addEventListener('change',selectMode);$('themeSelect').addEventListener('change',()=>{if(changeTheme(profile,$('themeSelect').value)){storageSave();updateProfileUI();notice('ESTILO DESBLOQUEADO · '+profile.theme.toUpperCase());}});$('newCupBtn').addEventListener('click',resetCup);$('nextCupBtn').addEventListener('click',nextCupRound);
 $('restartRaceBtn').addEventListener('click',restartRace);$('backToGarageBtn').addEventListener('click',backToGarage);$('helpBtn').addEventListener('click',showHelp);$('closeHelp').addEventListener('click',hideHelp);$('closeHelpBottom').addEventListener('click',hideHelp);
 ui.help.addEventListener('click',e=>{if(e.target===ui.help)hideHelp();});
 document.addEventListener('keydown',e=>{
  if(storyOpen){if(['Escape','Enter','Space'].includes(e.code)){e.preventDefault();closeStoryBeat();}else if(e.code==='Tab'){e.preventDefault();$('storyContinue').focus();}return;}
  if(contactOpen){if(e.code==='Escape'||e.code==='KeyN'||e.code==='KeyJ'){e.preventDefault();closeContactPanel();return;}
   if(e.code==='Tab'){const focusables=[...$('contactOverlay').querySelectorAll('button:not(:disabled)')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
   return;}
  if(archiveOpen){if(e.code==='Escape'||e.code==='KeyI'){e.preventDefault();closeArchive();return;}
   if(e.code==='Tab'){const focusables=[...$('archiveOverlay').querySelectorAll('button:not(:disabled)')],first=focusables[0],last=focusables.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
   return;
  }
  if(collectionOpen){if(e.code==='Escape'||e.code==='KeyY'){e.preventDefault();closeCollection();return;}if(e.code==='Tab'){const focusables=[...$('collectionOverlay').querySelectorAll('button:not(:disabled)')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
  if(workshopOpen){if(e.code==='Escape'||e.code==='KeyT'){e.preventDefault();closeWorkshop();return;}if(e.code==='Tab'){const focusables=[...$('workshopOverlay').querySelectorAll('button:not(:disabled)')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
  if(settingsOpen){
   if(e.code==='Escape'){e.preventDefault();closeSettings();return;}
   if(e.code==='Tab'){
    const focusables=[...$('settingsOverlay').querySelectorAll('button,select,input:not([disabled])')].filter(x=>!x.disabled);
    const first=focusables[0],last=focusables.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
   return;
  }
  if(e.target?.matches('select,input,textarea'))return;
  const code=e.code;
  if(!shortcutAllowed(code,{paused,helpOpen,started,focusedControl:Boolean(e.target?.closest?.('button,[role=button]'))}))return;
  const action=actionForKey(code,keymap);
  if(action||['KeyC','KeyR','KeyP','Escape','KeyM','KeyH','KeyG','KeyF','KeyO','KeyE','KeyT','KeyY','KeyI','KeyX','KeyN','KeyJ','KeyB'].includes(code))e.preventDefault();
  if(action){if(!paused&&!helpOpen){controls.keyDown(code);syncControls();}return;}
  if(e.repeat)return;
  if(code==='KeyN')contactInteract();else if(code==='KeyJ')contactJournal();else if(code==='KeyE')toggleVehicle();else if(code==='KeyX')collectNearbyDiscovery();else if(code==='KeyI')showArchive();else if(code==='KeyT')showWorkshop();else if(code==='KeyY')showCollection();else if(code==='KeyO')showSettings();else if(code==='Escape'||code==='KeyP')togglePause();else if(code==='KeyR')reset();else if(code==='KeyC')camera();else if(code==='KeyG')quality();else if(code==='KeyM')sound();else if(code==='KeyF')effects();else if(code==='KeyB')cycleLighting();else if(code==='KeyH')helpOpen?hideHelp():showHelp();
 });
 document.addEventListener('keyup',e=>{const action=actionForKey(e.code,keymap);controls.keyUp(e.code);syncControls();if(action)e.preventDefault();});
 window.addEventListener('blur',()=>{if(started&&!paused)setPaused(true);clearControls();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(started&&!paused)setPaused(true);clearControls();}});
 for(const [id,key] of [['touchLeft','left'],['touchRight','right'],['touchBrake','brake'],['touchGas','throttle']])attachTouch(id,key);
 window.addEventListener('chase-context-lost',()=>frameGuard.stop(Error('Se ha perdido el contexto WebGL. Recarga la página para reactivar el motor.')));
}
const screenFX=$('speedFx');const impactFX=$('impactFx');let impactIntensity=0;
function cinematicImpact(strength){renderer.notifyImpact?.(strength);impactIntensity=Math.max(impactIntensity,Math.min(.72,strength*.68));}
function updateScreenEffects(vehicle,delta){
 const reduced=effectiveReducedMotion();
 const intensity=effectsEnabled&&!paused&&!reduced?Math.min(1,Math.max(0,(Math.abs(vehicle.speed)-25)/48)):0;
 screenFX.style.opacity=String((intensity*.67).toFixed(3));
 screenFX.style.setProperty('--speed-pace',`${Math.max(.24,1.4-intensity)}s`);
 impactIntensity=Math.max(0,Math.min(1,impactIntensity-delta*3));
 impactFX.style.opacity=reduced||!effectsEnabled?'0':String(impactIntensity.toFixed(2));
}
let last=0,acc=0,frames=0;
const frameGuard=createRuntimeGuard(fatal);
function frame(now){frameGuard.run(()=>frameTick(now));}
function frameTick(now){requestAnimationFrame(frame);if(!last)last=now;const delta=Math.max(0,Math.min((now-last)/1000,.05));last=now;
 if(!paused&&!helpOpen&&!settingsOpen&&!archiveOpen&&!contactOpen&&!storyOpen){acc+=delta;let ticks=0;while(acc>=FIXED_STEP&&ticks<12){const previous=car.completed;const previousRaceContact=race.lastCollision;const speedBefore=Math.abs(car.speed);const draft=slipstream(race,car);if(pedestrian.active)stepPedestrian(pedestrian,inputs,FIXED_STEP,[car,...streetTraffic,...(police.active?[police.agent]:[]),...ambushPatrols.filter(p=>p.active).map(p=>p.agent)]);else step(car,{...inputs,slipstream:draft,steeringSensitivity:settings.steeringSensitivity/100},FIXED_STEP);const result=urbanMode?{contact:false,finished:false}:stepRace(race,car,FIXED_STEP);if(urbanMode){urbanElapsed+=FIXED_STEP;stepTraffic(streetTraffic,FIXED_STEP,pedestrian.active?null:car,urbanElapsed);suspect.active=selectedChapter===7&&mission.phase==='active'&&mission.index===1;stepSuspect(suspect,FIXED_STEP);const prevPursuit=police.active;stepPolice(police,FIXED_STEP,pedestrian.active?{x:pedestrian.x,z:pedestrian.z,kmh:0}:car);
 if(!sideMode()&&((selectedChapter===8&&mission.index>=1)||(selectedChapter===11&&mission.index>=2)||(selectedChapter===15&&mission.index>=1))&&mission.phase==='active'&&!ambushPatrols.length){
  ambushPatrols=[createPolice(),createPolice()];
  for(let i=0;i<ambushPatrols.length;i++){
   const p=ambushPatrols[i];p.active=true;p.heat=4;
   const spawn=i===0?[-875,-450]:[-700,-450];p.agent.x=spawn[0];p.agent.z=spawn[1];p.agent.index=5;
  }
  notice(selectedChapter===15?'¡SALVAT HA DADO LA ORDEN! · ESCAPA DE LAS PATRULLAS':selectedChapter===11?'¡ALERTA! · LA POLICÍA BLOQUEA LA SALIDA DEL MUELLE':'¡EMBOSCADA! · DOS PATRULLAS · ELIGE TU RUTA');
 }
 const targetPose=pedestrian.active?{x:pedestrian.x,z:pedestrian.z,kmh:0}:car;
 for(const p of ambushPatrols)stepPolice(p,FIXED_STEP,targetPose);
 const contact=pedestrian.active?{contacts:0,impact:0}:stepUrbanContacts(car,police.active?[...streetTraffic,police.agent,...ambushPatrols.filter(p=>p.active).map(p=>p.agent)]:[...streetTraffic,...ambushPatrols.filter(p=>p.active).map(p=>p.agent)],FIXED_STEP);if(contact.contacts){audio.cue('collision');const severity=applyImpact(car,contact.impact,'vehicle');if(severity>0)cinematicImpact(Math.min(1,.24+severity/24));if(severity>0&&car.damageEvents%2===1)notice('IMPACTO · ESTADO DEL VEHÍCULO '+damageCondition(car).health+'%');}else if(car.wall&&speedBefore>8){const severity=applyImpact(car,speedBefore,'barrier');if(severity>0)cinematicImpact(Math.min(1,.2+severity/24));if(severity>0&&car.damageEvents%2===1)notice('GOLPE EN BARRERA · REVISAR VEHÍCULO');}tickDamage(car,FIXED_STEP);if(!prevPursuit&&police.active){notice('POLICÍA · PATRULLA EN PERSECUCIÓN');audio.cue('pursuit');}if(police.escaped){police.escaped=false;audio.cue('escape');notice('HAS DESPISTADO A LA PATRULLA');}if(police.captured||ambushPatrols.some(p=>p.captured)){if(explorationMode()){reset();notice('LA POLICÍA TE HA DEVUELTO AL CARMEL · PUEDES SEGUIR EXPLORANDO');break;}if(sideMode()){sideRun.phase='lost';sideEnd('lost','DETENIDO POR LA POLICÍA');break;}missionEnd(false,{captured:true});break;}const missionPos=pedestrian.active?{...car,x:pedestrian.x,z:pedestrian.z,kmh:0,onFoot:true}:car;missionPos.suspectDistance=suspect.active?Math.hypot(missionPos.x-suspect.x,missionPos.z-suspect.z):Infinity;missionPos.patrolDistance=Math.min(...ambushPatrols.filter(p=>p.active).map(p=>Math.hypot(missionPos.x-p.agent.x,missionPos.z-p.agent.z)),Infinity);const completedBefore=mission.index;const state=explorationMode()?'active':sideMode()?stepSideRun(sideRun,missionPos,FIXED_STEP):stepMission(mission,missionPos,FIXED_STEP);if(sideMode()&&(state==='won'||state==='lost')){sideEnd(state);break;}if(state==='checkpoint'){{const next=sideMode()?sideTarget(sideRun):missionTarget(mission);notice(objectiveTransition(next,sideMode()));updateObjectivePresentation();}if(!sideMode()&&!explorationMode()&&showStoryBeat(storyBeat(selectedChapter,completedBefore))){acc=0;break;}}if(state==='won'||state==='lost'){missionEnd(state==='won');break;}}if(!urbanMode&&result.contact&&!previousRaceContact)cinematicImpact(.42);if(result.contact&&race.collisions>0&&car.hitCooldown>.4&&frames%120===0)notice('¡CONTACTO CON OTRO COCHE!');if(car.wall&&frames%90===0)audio.cue('collision');if(!pedestrian.active)renderer.emitDrivingEffects?.(car,FIXED_STEP,inputs.handbrake);if(car.completed!==previous){audio.cue('lap');if(car.best!==null&&(savedBest===null||car.best<savedBest)){savedBest=car.best;saveRecord(savedBest);audio.cue('record');notice('¡NUEVO RÉCORD! '+formatTime(savedBest));}else notice('VUELTA COMPLETADA '+formatTime(car.lastLap));}acc-=FIXED_STEP;ticks++;if(result.finished){finishRace();break;}}if(ticks===12)acc=Math.min(acc,FIXED_STEP*3);}else acc=0;
 if(settings.quality==='auto'&&renderer.fps&&frames%30===0){
  const scale=automaticQuality.observe(renderer.fps,Math.max(.01,(now-(frame.lastAutoAt||now))/1000),!paused&&!settingsOpen&&!helpOpen);
  frame.lastAutoAt=now;
  if(scale!==appliedScale){appliedScale=scale;renderer.setQuality(scale);$('graphicsBtn').title='Calidad automática · escala '+Math.round(scale*100)+'%';}
 }
 renderer.storyActors=urbanMode&&!sideMode()&&!explorationMode()?visibleStoryActors(selectedChapter,mission.index,mission.phase,mission.finalChoice):[];
 renderer.urbanTime=urbanElapsed;renderer.render(car,delta,urbanMode?[...streetTraffic,...(suspect.active?[suspect]:[]),...(police.active?[police.agent]:[]),...ambushPatrols.filter(p=>p.active).map(p=>p.agent)]:race.rivals,urbanMode?pedestrian:null);
 // Update audio at most 30 Hz; avoid world-distance scans on skipped frames.
 if(audio.needsFrame()){
  const listener=pedestrian.active?pedestrian:car;
  const trafficDistance=urbanMode?nearestEntityDistance(streetTraffic,listener.x,listener.z):Infinity;
  const patrolDistance=urbanMode?Math.min(nearestEntityDistance([police],listener.x,listener.z,{police:true}),nearestEntityDistance(ambushPatrols,listener.x,listener.z,{police:true})):Infinity;
  audio.update(settingsOpen?0:car.speed,car,{urban:urbanMode,x:listener.x,z:listener.z,onFoot:pedestrian.active,policeActive:police.active||ambushPatrols.some(p=>p.active),policeDistance:patrolDistance,trafficDistance,lighting:lightingMode});
 }
 updateScreenEffects(car,delta);if(++frames%4===0)renderHUD();
}
function fatal(error){
 console.error('[CHASE 404]',error);
 try{audio?.pause(true);}catch{}
 try{clearControls();}catch{}
 paused=true;started=false;
 $('errorMessage').textContent=error?.message||String(error);
 $('errorOverlay').hidden=false;ui.overlay.hidden=true;
}
try{
 try{
  const id=localStorage.getItem('chase404.track.v4');
  if(id==='barcelona'||TRACKS.some(t=>t.id===id))$('trackSelect').value=id;
  const carId=localStorage.getItem('chase404.car.v4');
  if(CARS.some(c=>c.id===carId))$('carSelect').value=carId;
 }catch{}
 if(!$('trackSelect').value)$('trackSelect').value='barcelona';urbanMode=$('trackSelect').value==='barcelona';if(!urbanMode)selectTrack($('trackSelect').value);else mode='free';initRace();savedBest=readRecord();
 renderer=new Renderer($('scene'));renderer.setUrbanMode(urbanMode);$('app').dataset.contrast=String(settings.contrast);$('app').dataset.hudScale=String(settings.hudScale);$('app').dataset.reducedMotion=String(settings.reducedMotion);renderer.setEffectsEnabled(effectsEnabled&&!effectiveReducedMotion());$('fxBtn').setAttribute('aria-pressed',String(effectsEnabled));$('fxBtn').innerHTML=effectsEnabled?'✦ <span>FX ON</span>':'✧ <span>FX OFF</span>';renderer.changeVehicle($('carSelect').value);
 updateSelectionUI();updateProfileUI();applyLighting();applyQuality();bindEvents();updateSideMenu();race.order=standings(race,car);race.position=race.order.find(e=>e.id==='YOU').position;renderHUD();requestAnimationFrame(frame);}catch(error){frameGuard.stop(error);}

$('objectiveAnnouncementDismiss').addEventListener('click',()=>{$('objectiveAnnouncement').hidden=true;});
