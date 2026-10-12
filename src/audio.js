/** CHASE 404 · Procedural, opt-in Web Audio. No samples, downloads, timers or autoplay.
 * Oscillators are created once after a gesture; all ambience fades via bounded gains.
 */
import {soundFrame} from './soundscape.js';
import {shouldUpdateAudio} from './performance.js';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number.isFinite(Number(v))?Number(v):0));
export class EngineAudio {
 constructor(){this.on=false;this.ctx=null;this.master=null;this.engine=[];this.wind=null;this.tires=null;this.ambience={};this.siren=[];this.lastCollision=-Infinity;this.muted=true;this.volume=.55;this.pending=false;this.pendingPromise=null;this.lastFrame=null;this.lastUpdateAt=-Infinity;this.updateCount=0;}
 async toggle(){
  // A second click while AudioContext.resume() is pending must observe the
  // *same* result. Returning the previous this.on=false desynchronised the HUD.
  if(this.pendingPromise)return this.pendingPromise;
  if(this.on){this.on=false;this.pause(true);return false;}
  const Ctor=globalThis.window?.AudioContext||globalThis.window?.webkitAudioContext;
  if(!Ctor)throw Error('Web Audio no disponible');
  this.pending=true;
  const activation=(async()=>{
   if(!this.ctx){this.ctx=new Ctor();this.setup();}
   await this.ctx.resume();this.lastUpdateAt=-Infinity;this.on=true;this.pause(this.muted);return true;
  })();
  this.pendingPromise=activation;
  try{return await activation;}
  finally{this.pending=false;this.pendingPromise=null;}
 }
 setup(){
  const ctx=this.ctx;this.master=ctx.createGain();this.master.gain.value=0;
  const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-18;compressor.ratio.value=3;
  this.master.connect(compressor).connect(ctx.destination);
  for(const [wave,base,level] of [['sawtooth',39,.19],['triangle',78,.13],['square',19.5,.035]]){
   const osc=ctx.createOscillator(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
   osc.type=wave;osc.frequency.value=base;filter.type='lowpass';filter.frequency.value=540;gain.gain.value=level;
   osc.connect(filter).connect(gain).connect(this.master);osc.start();this.engine.push({osc,filter,gain,base,level});
  }
  // One seeded noise buffer, shared among seven sounds. Deterministic; no assets or streams.
  const rate=ctx.sampleRate,buf=ctx.createBuffer(1,rate,rate),data=buf.getChannelData(0);
  let seed=404;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*.7;}
  const noise=(type,frequency,q=0.7)=>{
   const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
   source.buffer=buf;source.loop=true;filter.type=type;filter.frequency.value=frequency;filter.Q.value=q;gain.gain.value=0;
   source.connect(filter).connect(gain).connect(this.master);source.start();return {source,filter,gain};
  };
  this.wind=noise('highpass',700);this.tires=noise('bandpass',540);
  this.ambience={traffic:noise('lowpass',300),voices:noise('bandpass',950,.45),hills:noise('bandpass',310,.25),industrial:noise('bandpass',110,.8)};
  // Siren: two very quiet alternating oscillators, audible only in an active pursuit.
  for(const base of [630,795]){
   const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
   osc.type='triangle';osc.frequency.value=base;filter.type='lowpass';filter.frequency.value=980;gain.gain.value=0;
   osc.connect(filter).connect(gain).connect(this.master);osc.start();this.siren.push({osc,gain,base});
  }
 }
 pause(muted){this.muted=Boolean(muted);if(!this.ctx||!this.master)return;
  this.master.gain.setTargetAtTime(this.on&&!this.muted?this.volume:0,this.ctx.currentTime,.06);
 }
 setVolume(value){this.volume=clamp(value);this.pause(this.muted);}
 needsFrame(){return Boolean(this.on&&this.ctx&&!this.muted&&shouldUpdateAudio(this.lastUpdateAt,this.ctx.currentTime));}
 update(speed,car={},world={}){
  if(!this.needsFrame())return;
  const t=this.ctx.currentTime;this.lastUpdateAt=t;this.updateCount++;
  const f=soundFrame({...world,speed,slide:car.slide,steer:car.steer,offroad:car.offroad});
  this.lastFrame=f;
  for(const o of this.engine){o.osc.frequency.setTargetAtTime(o.base*(.9+f.pitch*4),t,.065);o.filter.frequency.setTargetAtTime(320+f.speed*1700,t,.1);o.gain.gain.setTargetAtTime(o.level*f.engine,t,.09);}
  this.wind.gain.gain.setTargetAtTime(f.wind,t,.16);
  this.tires.gain.gain.setTargetAtTime(f.tires,t,.08);
  this.tires.filter.frequency.setTargetAtTime(450+f.speed*800,t,.09);
  for(const [key,node] of Object.entries(this.ambience))node.gain.gain.setTargetAtTime(f[key],t,.35);
  const sweep=Math.sin(t*Math.PI*1.5);
  for(const [i,s] of this.siren.entries()){
   s.osc.frequency.setTargetAtTime(s.base+(i===0?1:-1)*sweep*90,t,.07);
   s.gain.gain.setTargetAtTime(f.siren*(i===0?.58:.42),t,.19);
  }
 }
 /** Short event envelopes only while playing; collision rate limited. */
 cue(kind){if(!this.on||this.muted||!this.ctx)return;
  const now=this.ctx.currentTime;if(kind==='collision'&&now-this.lastCollision<.35)return;
  if(kind==='collision')this.lastCollision=now;
  const patterns={start:[440,660,.19,.11],lap:[660,880,.22,.09],finish:[550,990,.48,.14],collision:[95,55,.15,.1],record:[790,1100,.32,.11],pursuit:[610,840,.25,.08],escape:[870,540,.25,.07]};
  const [from,to,duration,level]=patterns[kind]||patterns.lap;
  const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=kind==='collision'?'sawtooth':'triangle';o.frequency.setValueAtTime(from,now);o.frequency.exponentialRampToValueAtTime(to,now+duration);
  g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(level,now+.014);g.gain.exponentialRampToValueAtTime(.001,now+duration);
  o.connect(g).connect(this.master);o.start(now);o.stop(now+duration+.02);
 }
}
