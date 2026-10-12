/** CHASE 404 · Fase 6.4. Pure, deterministic audio mix for the fictionalized 1984 map.
 * Values are gain targets, not recorded historical ambience. Nothing runs on import.
 */
export const SOUND_DISTRICTS=Object.freeze({
 carmel:'EL CARMEL',guinardo:'GUINARDÓ',gracia:'GRÀCIA',eixample:'EIXAMPLE',port:'PUERTO INDUSTRIAL',montjuic:'MONTJUÏC',arcade:'CIRCUITO'
});
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,Number.isFinite(Number(v))?Number(v):0));
export function soundDistrictAt(x,z,urban=true){
 if(!urban)return 'arcade';
 x=Number(x)||0;z=Number(z)||0;
 if(x<=-975&&z<-225)return 'montjuic';
 if(x<-675&&z<-155)return 'port';
 if(x<-530)return 'eixample';
 if(x<-260)return 'gracia';
 if(z>=270)return 'guinardo';
 return 'carmel';
}
/** Converts game state into bounded envelopes. No Web Audio dependency; safe in Node. */
export function soundFrame({urban=false,x=0,z=0,speed=0,slide=0,steer=0,offroad=false,onFoot=false,policeActive=false,policeDistance=95,trafficDistance=Infinity,lighting='dusk'}={}){
 const district=soundDistrictAt(x,z,urban),night=lighting==='night',v=onFoot?0:clamp(Math.abs(Number(speed)||0)/75);
 const near=urban&&Number.isFinite(trafficDistance)?clamp(1-trafficDistance/115):0;
 const zone={carmel:[.13,.09,.36,.00],guinardo:[.20,.10,.44,.00],gracia:[.28,.34,.10,.00],eixample:[.38,.27,.04,.00],port:[.21,.035,.17,.50],montjuic:[.08,.035,.48,.05],arcade:[0,0,0,0]}[district];
 const nightTraffic=night?.7:1;
 return Object.freeze({district,engine:onFoot?0:clamp(.16+v*.84),wind:clamp(v*v*.17+zone[2]*.16),tires:clamp((Number(slide)||0)*.23+(offroad?v*.12:0)),
  traffic:clamp(zone[0]*nightTraffic+near*.22),voices:clamp(zone[1]*(night?.35:1)),hills:clamp(zone[2]*(night?.78:1)),industrial:clamp(zone[3]),
  siren:urban&&policeActive?clamp((.15+near*.03)*clamp(1-(Number(policeDistance)||0)/240)):0,
  pitch:clamp(.19+v*.78+.10*Math.abs(Number(steer)||0)),speed:v});
}
