/** Local-only, versioned player progression. Never trusts deserialised storage. */
export const PROFILE_KEY='chase404.profile.v5';
export const MODES=Object.freeze([
 {id:'arcade',name:'ARCADE RACE',desc:'8 pilotos · 3 vueltas · puntos de experiencia',laps:3,rivals:7},
 {id:'time',name:'TIME ATTACK',desc:'Solo contra el reloj · 3 vueltas · récord total',laps:3,rivals:0},
 {id:'free',name:'FREE RUN',desc:'Pista libre · sin rivales ni límite de vueltas',laps:Infinity,rivals:0},
 {id:'championship',name:'WORLD CUP',desc:'Campeonato · 3 pistas · clasificación acumulada',laps:3,rivals:7}
]);
export const CUP_TRACKS=['sunset','pacific','ridge'];
export const CUP_POINTS=[10,8,6,5,4,3,2,1];
export const THEMES=[{id:'classic',name:'CLÁSICO',xp:0},{id:'neon',name:'NEÓN',xp:120},{id:'gold',name:'ORO',xp:350}];
const finiteInt=(x,max=1000000)=>Number.isSafeInteger(x)&&x>=0&&x<=max?x:0;
const timeVal=x=>typeof x==='number'&&Number.isFinite(x)&&x>0&&x<1e5?x:null;
export function newProfile(){return {version:5,xp:0,starts:0,finishes:0,wins:0,podiums:0,cups:0,medals:{},bestTotals:{},history:[],theme:'classic',cup:null};}
export function parseProfile(raw){
 let obj;try{obj=typeof raw==='string'?JSON.parse(raw):raw;}catch{return newProfile();}
 if(!obj||typeof obj!=='object'||obj.version!==5)return newProfile();
 const p=newProfile();
 for(const k of ['xp','starts','finishes','wins','podiums','cups'])p[k]=finiteInt(obj[k]);
 if(obj.medals&&typeof obj.medals==='object')for(const [k,v] of Object.entries(obj.medals).slice(0,100))if(/^(sunset|pacific|ridge)$/.test(k)&&['oro','plata','bronce'].includes(v))p.medals[k]=v;
 if(obj.bestTotals&&typeof obj.bestTotals==='object')for(const [k,v] of Object.entries(obj.bestTotals).slice(0,200))if(/^(arcade|time|championship)\.(sunset|pacific|ridge)\.(racer|falcon|comet|viper|nova|blaze)$/.test(k)&&timeVal(v))p.bestTotals[k]=v;
 if(Array.isArray(obj.history))p.history=obj.history.filter(x=>x&&typeof x.id==='string'&&x.id.length<85).slice(-40).map(x=>({id:x.id,mode:String(x.mode||'').slice(0,15),track:String(x.track||'').slice(0,12),position:finiteInt(x.position,8),xp:finiteInt(x.xp,500),time:timeVal(x.time)}));
 if(THEMES.some(t=>t.id===obj.theme&&p.xp>=t.xp))p.theme=obj.theme;
 if(obj.cup&&typeof obj.cup==='object'&&['racer','falcon','comet','viper','nova','blaze'].includes(obj.cup.car)&&Array.isArray(obj.cup.results)&&obj.cup.results.length<3){
  const results=obj.cup.results.map((r,i)=>({track:CUP_TRACKS[i],position:finiteInt(r?.position,8)||8,points:finiteInt(r?.points,10),time:timeVal(r?.time)}));
  if(results.every((r,i)=>r.points===CUP_POINTS[r.position-1]))p.cup={car:obj.cup.car,results};
 }
 return p;
}
export function readProfile(storage){try{return parseProfile(storage.getItem(PROFILE_KEY));}catch{return newProfile();}}
export function writeProfile(storage,p){try{storage.setItem(PROFILE_KEY,JSON.stringify(p));return true;}catch{return false;}}
export function unlockedThemes(p){return THEMES.filter(t=>p.xp>=t.xp);}
export function changeTheme(p,id){if(!unlockedThemes(p).some(x=>x.id===id))return false;p.theme=id;return true;}
export function beginCup(p,car){if(!['racer','falcon','comet','viper','nova','blaze'].includes(car))throw RangeError('Coche no válido');p.cup={car,results:[]};return p.cup;}
export function cupTrack(p){return p.cup&&p.cup.results.length<3?CUP_TRACKS[p.cup.results.length]:null;}
export function cupTable(cup){if(!cup)return null;return {round:cup.results.length,points:cup.results.reduce((s,r)=>s+r.points,0),results:cup.results.map(r=>({...r})),next:CUP_TRACKS[cup.results.length]??null};}
export function completeCupRound(p,position,time){
 if(!p.cup||p.cup.results.length>=3)throw Error('No hay ronda pendiente');
 if(!Number.isInteger(position)||position<1||position>8)throw RangeError('Posición inválida');
 const track=CUP_TRACKS[p.cup.results.length],points=CUP_POINTS[position-1];
 p.cup.results.push({track,position,points,time:timeVal(time)});
 const table=cupTable(p.cup);
 if(table.round===3){p.cups++;p.xp+=table.points>=25?150:table.points>=17?80:35;p.cup=null;}
 return table;
}
export function recordStart(p){p.starts++;}
export function awardFinish(p,{id,mode,track,car,position,time,validBest}){
 if(!MODES.some(x=>x.id===mode)||mode==='free')throw RangeError('Modo incompatible');
 if(!['sunset','pacific','ridge'].includes(track)||!['racer','falcon','comet','viper','nova','blaze'].includes(car))throw RangeError('Selección inválida');
 if(p.history.some(h=>h.id===id))return {duplicate:true,xp:0,newBest:false};
 if(!Number.isInteger(position)||position<1||position>8)throw RangeError('Posición inválida');
 if(!timeVal(time))throw RangeError('Tiempo inválido');
 const xp=mode==='time'?45:Math.max(20,110-position*10);
 p.xp+=xp;p.finishes++;
 if(mode!=='time'){
  if(position===1)p.wins++;
  if(position<=3)p.podiums++;
  const grade=position===1?'oro':position===2?'plata':position===3?'bronce':null;
  const scores={oro:3,plata:2,bronce:1};
  if(grade&&(!p.medals[track]||scores[grade]>scores[p.medals[track]]))p.medals[track]=grade;
 }
 const key=`${mode}.${track}.${car}`;const newBest=mode==='time'&&validBest===false?false:(p.bestTotals[key]===undefined||time<p.bestTotals[key]);
 if(newBest)p.bestTotals[key]=time;
 p.history.push({id,mode,track,position,xp,time});p.history=p.history.slice(-40);
 return {duplicate:false,xp,newBest};
}
export function bestTotal(p,mode,track,car){return p.bestTotals[`${mode}.${track}.${car}`]??null;}
