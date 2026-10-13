/** Fictionalized El Carmel district, Barcelona, in 1984. Terrain and streets are original meshes. */
import {Builder} from './geometry.js';
import {ART_PALETTE,ART_SCALE} from './art-direction.js';
import {DISCOVERIES} from './discoveries.js';
import {CONTACTS} from './contacts.js';

const streets=[
 [[-250,210],[-160,210],[-132,168],[-22,168],[5,132],[106,132],[132,96],[232,96]],
 [[-250,48],[-184,48],[-160,12],[-42,12],[-14,-22],[96,-22],[126,-58],[250,-58]],
 [[-232,-112],[-152,-112],[-128,-148],[-28,-148],[-4,-184],[112,-184],[142,-216],[232,-216]],
 [[-205,248],[-205,210],[-160,210],[-176,145],[-176,48],[-176,-64],[-146,-112],[-146,-246]],
 [[-22,168],[-46,88],[-24,12],[-24,-78],[-4,-148],[-4,-184],[-4,-245]],
 [[154,100],[154,8],[132,-58],[132,-118],[164,-184],[164,-215],[164,-216],[196,-150],[216,-120]],
 [[232,96],[240,-58],[216,-120],[216,-216]],
 [[-240,120],[-180,120],[-128,168]],
 [[-176,-64],[-90,-64],[-42,12]],
 [[-24,-78],[55,-78],[96,-22]],
 [[132,-118],[216,-120]],
 // Fase 4.1: corredor ficticio hacia el Guinardó, conectado a los viales del Carmel.
 [[-205,248],[-205,300],[-150,300],[-150,375],[-50,375],[45,375],[100,420]],
 [[-46,248],[-46,300],[-150,300]],
 [[-46,300],[45,300],[45,375]],
 [[154,100],[185,165],[185,300],[45,300]],
 // Fase 4.2: conexión oeste, recorrido ficticio de Gràcia por calles de pendiente menor.
 [[-250,48],[-335,48],[-410,80],[-480,80],[-535,115]],
 [[-250,210],[-335,210],[-410,165],[-480,165],[-535,115]],
 [[-410,80],[-410,165]],
 [[-335,48],[-335,210]],
 // Fase 4.3: Eixample condensado. Trama de avenidas al suroeste de Gràcia.
 [[-535,115],[-625,115],[-700,115],[-785,115],[-875,115]],
 [[-535,115],[-535,-5],[-625,-5],[-700,-5],[-785,-5],[-875,-5]],
 [[-625,115],[-625,-5],[-625,-125]],
 [[-700,115],[-700,-5],[-700,-125]],
 [[-785,115],[-785,-5],[-785,-125]],
 [[-875,115],[-875,-5],[-875,-125]],
 [[-625,-125],[-700,-125],[-785,-125],[-875,-125]],
 [[-535,-5],[-535,-125],[-625,-125]],
 // Fase 4.4: corredor hacia el puerto industrial, continuación sur del Eixample.
 [[-875,-125],[-875,-230],[-875,-340],[-875,-450],[-875,-555]],
 [[-785,-125],[-785,-230],[-785,-340],[-785,-450],[-785,-555]],
 [[-700,-125],[-700,-230],[-700,-340],[-700,-450],[-700,-555]],
 [[-875,-340],[-785,-340],[-700,-340]],
 [[-875,-450],[-785,-450],[-700,-450]],
 [[-875,-555],[-785,-555],[-700,-555]],
 [[-700,-230],[-625,-230],[-625,-125]],
 // Fase 4.5: acceso ficticio a Montjuïc desde los muelles, curvas y subida panorámica.
 [[-875,-450],[-990,-450],[-1090,-485],[-1190,-540],[-1285,-525],[-1360,-460]],
 [[-875,-555],[-975,-595],[-1075,-650],[-1200,-680],[-1300,-620],[-1285,-525]],
 [[-1360,-460],[-1425,-390],[-1390,-305],[-1305,-275],[-1220,-330],[-1190,-540]],
 [[-1090,-485],[-1075,-650]],
 [[-1300,-620],[-1420,-660],[-1510,-610]]
];
export const CITY=Object.freeze({name:'EL CARMEL',year:1984,streets:Object.freeze(streets.map(s=>Object.freeze(s.map(p=>Object.freeze(p))))),bounds:1750,roadHalf:10.2,sidewalkHalf:14.2,viewpoint:[214,-122]});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function cityElevation(x,z){
 const hill=(cx,cz,amp,spread)=>amp*Math.exp(-((x-cx)**2+(z-cz)**2)/(2*spread*spread));
 return hill(182,-138,46,195)+hill(-92,54,15,155)+hill(-1340,-420,58,245);
}
export function cityStartPose(){return {x:5,z:132,yaw:Math.PI/2};}

export function nearestStreet(x,z){
 let best=null;
 for(let r=0;r<CITY.streets.length;r++){
  const path=CITY.streets[r];
  for(let i=0;i<path.length-1;i++){
   const a=path[i],b=path[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len2=dx*dx+dz*dz;
   const t=clamp(((x-a[0])*dx+(z-a[1])*dz)/len2,0,1),px=a[0]+dx*t,pz=a[1]+dz*t;
   const distance=Math.hypot(x-px,z-pz);
   if(!best||distance<best.distance){const len=Math.sqrt(len2);best={distance,x:px,z:pz,tx:dx/len,tz:dz/len,nx:dz/len,nz:-dx/len,street:r,segment:i};}
  }
 }
 return best;
}

const palette=[
 {wall:[191,166,137],roof:[112,82,67]}, {wall:[175,181,171],roof:[93,103,101]},
 {wall:[202,188,154],roof:[151,89,65]}, {wall:[155,167,174],roof:[78,94,105]},
 {wall:[195,157,120],roof:[118,77,57]}
];
// Landmark plots shared by geometry and every facade detail pass.
const eixamplePlotX=i=>-660-i*77-(i===2?7:i===3?36:0);
const portWarehouseZ=i=>-265-Math.floor(i/2)*102+(i===4?-21:i===6?40:0);
const xyz=(x,z,y=cityElevation(x,z))=>[x,y,z];
function surfaceQuad(g,a,b,c,d,color,offset=.17){g.quad(xyz(a[0],a[1],cityElevation(a[0],a[1])+offset),xyz(b[0],b[1],cityElevation(b[0],b[1])+offset),xyz(c[0],c[1],cityElevation(c[0],c[1])+offset),xyz(d[0],d[1],cityElevation(d[0],d[1])+offset),color);}
function roadStrip(g,a,b,lo,hi,color){
 const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len,nz=-dx/len,steps=Math.ceil(len/8);
 for(let i=0;i<steps;i++){
  const t0=i/steps,t1=(i+1)/steps,c0=[a[0]+dx*t0,a[1]+dz*t0],c1=[a[0]+dx*t1,a[1]+dz*t1];
  surfaceQuad(g,[c0[0]+nx*lo,c0[1]+nz*lo],[c1[0]+nx*lo,c1[1]+nz*lo],[c1[0]+nx*hi,c1[1]+nz*hi],[c0[0]+nx*hi,c0[1]+nz*hi],color,.23);
 }
}
function boxAt(g,x,z,w,h,d,color,ground=cityElevation(x,z)){g.box(x,ground+h/2,z,w,h,d,color);}

function buildHillside(g){
 const ground=[88,104,76],stone=[127,119,100];
 // A tessellated hillside gives the winding road sections a visible elevation profile.
 g.box(-675,-34,-135,2050,68,1250,[48,59,52]);
 // Preserve the 20 m silhouette under El Carmel while coarsening distant
 // ground to 40 m cells. Both grids meet exactly at x=-400 and z=-320.
 for(const [startX,endX,stepX] of [[-1600,-400,40],[-400,280,20]])
 for(const [startZ,endZ,stepZ] of [[-840,-320,40],[-320,460,20]])
 for(let x=startX;x<endX;x+=stepX)for(let z=startZ;z<endZ;z+=stepZ){
  const p=[[x,cityElevation(x,z),z],[x+stepX,cityElevation(x+stepX,z),z],[x+stepX,cityElevation(x+stepX,z+stepZ),z+stepZ],[x,cityElevation(x,z+stepZ),z+stepZ]];
  const avg=p.reduce((s,v)=>s+v[1],0)/4,col=avg>27?stone:ground;
  g.quad([p[0][0],p[0][1]-.2,p[0][2]],[p[1][0],p[1][1]-.2,p[1][2]],[p[2][0],p[2][1]-.2,p[2][2]],[p[3][0],p[3][1]-.2,p[3][2]],col);
 }
}

function buildStreets(g){
 const asphalt=[54,57,59],sidewalk=[157,150,133],curb=[202,187,157],paint=[217,203,175];
 for(const path of CITY.streets)for(let i=0;i<path.length-1;i++){
  const a=path[i],b=path[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len,nz=-dx/len;
  roadStrip(g,a,b,-CITY.roadHalf,CITY.roadHalf,asphalt);
  for(const side of [-1,1]){
   roadStrip(g,a,b,side*CITY.roadHalf,side*CITY.sidewalkHalf,sidewalk);
   roadStrip(g,a,b,side*(CITY.roadHalf-.14),side*(CITY.roadHalf+.18),curb);
  }
  // Short worn center dashes follow each climb instead of appearing as a flat grid.
  for(let d=8;d<len-7;d+=19){
   const t=d/len,c=[a[0]+dx*t,a[1]+dz*t],half=1.9;
   surfaceQuad(g,[c[0]-dx/len*half-nx*.13,c[1]-dz/len*half-nz*.13],[c[0]+dx/len*half-nx*.13,c[1]+dz/len*half-nz*.13],[c[0]+dx/len*half+nx*.13,c[1]+dz/len*half+nz*.13],[c[0]-dx/len*half+nx*.13,c[1]-dz/len*half+nz*.13],paint,.42);
  }
  // A raised retaining edge makes steep cuts in the slope readable.
  if(len>52&&i%2===0)for(const side of [-1,1]){
   const t=.52,c=[a[0]+dx*t+nx*side*CITY.sidewalkHalf,a[1]+dz*t+nz*side*CITY.sidewalkHalf],h=2.2,y=cityElevation(c[0],c[1]);
   g.box(c[0],y+h/2,c[1],.55,h,4.2,[119,112,99]);
  }
 }
 // Junction pads close the outer corner gaps where switchbacks meet.
 const junctions=new Set();for(const path of CITY.streets)for(const p of path)junctions.add(p[0]+','+p[1]);
 for(const key of junctions){const [x,z]=key.split(',').map(Number),r=10;surfaceQuad(g,[x-r,z-r],[x+r,z-r],[x+r,z+r],[x-r,z+r],asphalt,.25);}
}


// Fase 6.2: marcas pintadas y desgaste moderado, siempre sobre las calzadas originales.
// No modifican la colisión ni la topología de la red urbana.
export const ROAD_REMASTER_CROSSINGS=Object.freeze([
 [-205,273],[-410,123],[-700,53],[-785,-393],[-1300,-620]
].map(([x,z])=>Object.freeze({x,z})));
function buildRoadFinishes(g){
 const patched=[[44,47,49],[62,63,61]],joint=[120,115,102],mark=[201,195,172];
 for(const [roadIndex,path] of CITY.streets.entries())for(let i=0;i<path.length-1;i++){
  const a=path[i],b=path[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
  if(len<17)continue;
  const tx=dx/len,tz=dz/len,nx=tz,nz=-tx;
  // Rectángulos de distinto tamaño simulan reasfaltados y juntas sin texturas externas.
  const count=Math.floor((len-9)/41);
  for(let j=0;j<count;j++){
   const mid=10+j*41+((roadIndex+i)%4)*3.2,half=3.8+(j%3)*1.3;
   const side=((roadIndex+j+i)%2?1:-1),offset=side*5.7;
   const p=(t,n)=>[a[0]+tx*t+nx*n,a[1]+tz*t+nz*n];
   surfaceQuad(g,p(mid-half,offset-2.25),p(mid+half,offset-2.25),p(mid+half,offset+2.25),p(mid-half,offset+2.25),patched[(roadIndex+j)%2],.285);
  }
  // Ligeras juntas de hormigón transversal en la acera; pequeñas para respetar la escala.
  if(len>35)for(const side of [-1,1])for(let d=21;d<len-5;d+=29){
   const p=(along,n)=>[a[0]+tx*along+nx*n,a[1]+tz*along+nz*n];
   surfaceQuad(g,p(d,side*10.65),p(d+.1,side*10.65),p(d+.1,side*13.65),p(d,side*13.65),joint,.27);
  }
 }
 // Paso de peatones: franjas cortas sucesivas cruzando la calzada, fuera de los nudos.
 for(const crossing of ROAD_REMASTER_CROSSINGS){
  const street=nearestStreet(crossing.x,crossing.z);
  if(street.distance>5)continue;
  const {x,z,tx,tz,nx,nz}=street, stripeLen=3.4;
  for(let i=-4;i<=4;i++){
   const offset=i*2.05, cx=x+nx*offset,cz=z+nz*offset;
   const p=(along,lateral)=>[cx+tx*along+nx*lateral,cz+tz*along+nz*lateral];
   surfaceQuad(g,p(-stripeLen/2,-.65),p(stripeLen/2,-.65),p(stripeLen/2,.65),p(-stripeLen/2,.65),i%3===0?[174,169,149]:mark,.48);
  }
 }
}

function parcelTouchesStreet(x,z,w,d){
 // The carriageway plus a vehicle-width margin must never cross the house.
 const margin=CITY.roadHalf+2.2,minX=x-w/2-margin,maxX=x+w/2+margin;
 const minZ=z-d/2-margin,maxZ=z+d/2+margin;
 for(const path of CITY.streets)for(let i=1;i<path.length;i++){
  const [ax,az]=path[i-1],[bx,bz]=path[i],dx=bx-ax,dz=bz-az;
  let lo=0,hi=1,miss=false;
  for(const [p,v,min,max] of [[ax,dx,minX,maxX],[az,dz,minZ,maxZ]]){
   if(Math.abs(v)<1e-9){if(p<min||p>max){miss=true;break;}continue;}
   const a=(min-p)/v,b=(max-p)/v;
   lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));
   if(lo>hi){miss=true;break;}
  }
  if(!miss)return true;
 }
 return false;
}
function safeParcel(x,z,w,d,occupied){
 const free=(px,pz)=>{
  if(Math.abs(px)>275||pz<-275||pz>300||nearestStreet(px,pz).distance>88)return false;
  if(parcelTouchesStreet(px,pz,w,d))return false;
  return !occupied.some(b=>Math.abs(px-b.x)<(w+b.w)/2+1.3&&Math.abs(pz-b.z)<(d+b.d)/2+1.3);
 };
 for(let radius=0;radius<=120;radius+=8){
  const steps=radius?24:1;
  for(let i=0;i<steps;i++){
   const a=i*Math.PI*2/steps,px=x+Math.cos(a)*radius,pz=z+Math.sin(a)*radius;
   if(free(px,pz)){occupied.push({x:px,z:pz,w,d});return [px,pz];}
  }
 }
 return null;
}

// A compact street-facing facade kit. The nearest road determines which wall
// receives a door, stone base and upper-floor rhythm, including uphill lots.
function buildCarmelHouseFront(g,x,z,w,d,h,y,index){
 const street=nearestStreet(x,z),dx=street.x-x,dz=street.z-z;
 const axis=Math.abs(dx)>Math.abs(dz)?'x':'z',sign=Math.sign(axis==='x'?dx:dz)||1;
 const width=axis==='x'?d:w,face=axis==='x'?w/2:d/2;
 const onFace=(along,height,span,tall,depth,color,out=.12)=>{
  if(axis==='x')g.box(x+sign*(face+out),y+height,z+along,depth,tall,span,color);
  else g.box(x+along,y+height,z+sign*(face+out),span,tall,depth,color);
 };
 const stone=index%3===0?[132,105,84]:[157,139,112],trim=index%2?[214,193,155]:[187,171,141];
 onFace(0,.58,width-.5,1.12,.21,stone);
 onFace(0,3.92,width-.9,.22,.28,trim);
 onFace(0,h-.61,width+.1,.42,.54,[107,89,75],.32);
 const doorX=index%2?width*.23:-width*.23;
 onFace(doorX,1.72,2.35,3.25,.27,[62,70,68],.24);
 onFace(doorX,3.48,2.9,.31,.44,trim,.42);
 for(const side of [-1,1]){
  const wx=-doorX+side*width*.13;
  onFace(wx,6.05,1.85,2.35,.23,index%4===0?[108,75,60]:[48,70,77],.23);
  onFace(wx,4.76,2.4,.19,.57,trim,.43);
 }
 if(index%5===0){
  onFace(doorX,3.83,5.5,.27,1.2,[142,79,57],.73);
  onFace(doorX,3.63,5.5,.38,.12,[212,177,123],1.33);
 }
}

function buildHousing(g){
 let seed=1984;const rnd=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
 let featured=0;
 const occupied=[
  {x:WORKSHOP_LOCATION[0],z:WORKSHOP_LOCATION[1]+19,w:19,d:12},
  {x:-22,z:192,w:23,d:13},
  ...[[-110,-225],[-84,-225],[-58,-225],[-110,229],[-83,229],[72,216],[104,216],[210,185]]
   .map(([x,z],i)=>({x,z,w:11+(i%3)*2,d:10}))
 ];
 for(let ix=0;ix<6;ix++)for(let iz=0;iz<6;iz++){
  const cx=-200+ix*80,cz=-200+iz*80,upper=cx>40&&cz<-55;
  const dense=Math.abs(cx)<90&&Math.abs(cz)<90,count=upper?(ix%2?3:2):dense?3:2;
  for(let k=0;k<count;k++){
   const cols=2,col=k%cols,row=Math.floor(k/cols);
   let x=cx+(col?17:-17)+(rnd()-.5)*4,z=cz+(count===3?(row?17:-17):0)+(rnd()-.5)*4;
   const selfBuilt=upper&&k===count-1&&iz%2===0;
   const w=selfBuilt?17:count===3?23:28,d=selfBuilt?18:count===3?25:31;
   const parcel=safeParcel(x,z,w,d,occupied);if(!parcel)continue;
   [x,z]=parcel;const ground=cityElevation(x,z);
   const h=selfBuilt?3.8:dense?13+rnd()*13:9+rnd()*18;
   const pal=palette[Math.floor(rnd()*palette.length)];
   boxAt(g,x,z,w,h-.55,d,pal.wall,ground);boxAt(g,x, z,w+.7,.45,d+.7,selfBuilt?[91,80,68]:pal.roof,ground+h-.65);
   if(!selfBuilt){
    const floors=Math.max(2,Math.floor(h/4)),colsWin=Math.max(2,Math.floor(w/9));
    for(let fy=0;fy<floors;fy++)for(let c=0;c<colsWin;c++){
     const wy=ground+1.0+fy*3.25,wx=x-w*.32+c*(w*.64/Math.max(1,colsWin-1)),glass=rnd()>.84?[207,166,92]:[47,66,75];
     g.box(wx,wy,z+d/2+.08,2.1,1.45,.12,glass);g.box(x+w/2+.08,wy,z-d*.32+c*(d*.64/Math.max(1,colsWin-1)),.12,1.45,2.1,glass);
    }
    boxAt(g,x, z-d/2-.16,w*.92,.35,.28,[218,199,166],ground+h*.62);
   }else{
    // A few remaining self-built hillside homes are shown as part of a changing neighborhood.
    boxAt(g,x,z,1.4,.3,d+.5,[125,104,83],ground+h-.7);
   }
   // Small balconies and shop awnings give the lower streets an inhabited 1980s scale.
   if(!upper&&k===0){g.box(x,ground+2.4,z+d/2+.5,w*.62,.22,.9,[113,87,62]);g.box(x,ground+3.3,z+d/2+.85,w*.62,1.4,.14,[59,78,82]);}
   if(!selfBuilt&&featured<50&&nearestStreet(x,z).distance<42)
    buildCarmelHouseFront(g,x,z,w,d,h,ground,featured++);
  }
 }
}

function buildNeighborhoodDetails(g){
 // Stair streets, stepped landings, handrails and neighborhood light poles.
 const stairs=[[-104,84,-104,126],[-78,-106,-42,-106],[48,44,48,87],[184,-5,220,-5]];
 for(const [x1,z1,x2,z2] of stairs){
  const n=14;for(let i=0;i<n;i++){const t=i/n,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t,y=cityElevation(x,z);g.box(x,y+.12+i*.035,z,4,.24,2.2,[133,127,110]);}
  const mx=(x1+x2)/2,mz=(z1+z2)/2,my=cityElevation(mx,mz);g.box(mx+2.5,my+1.7,mz,.16,3.4,Math.hypot(x2-x1,z2-z1),[83,88,84]);
 }
 for(const path of CITY.streets)for(let i=1;i<path.length;i+=2){
  const [x,z]=path[i],side=(i%2?1:-1),lx=x+side*17,lz=z+side*8,y=cityElevation(lx,lz);
  g.cylinder(lx,y,.0+lz,.18,5.1,6,[58,61,57]);g.box(lx,y+5.15,lz,1.4,.18,1.4,[224,173,98]);
 }
 // A Telefónica-era booth and corner shop signs are simple local meshes, with no brand logos.
 const booth=[-34,35],by=cityElevation(...booth);g.box(booth[0],by+1.15,booth[1],1.6,2.3,1.5,[164,73,46]);g.box(booth[0],by+1.25,booth[1]+.79,.9,1.55,.04,[61,79,76]);
 g.box(-130,cityElevation(-130,174)+5,-130+174,8,.75,.55,[187,145,79]);
}

function buildCarmelWorkshop(g){
 // Small, original roadside mechanical workshop. The entrance faces the road and
 // uses a warm ochre canopy so it is recognizable without textures or logos.
 const x=WORKSHOP_LOCATION[0],z=WORKSHOP_LOCATION[1]+19,y=cityElevation(x,z);
 g.box(x,y+3.2,z,19,6.4,12,[132,119,102]);
 g.box(x,y+6.8,z,20.4,.65,13.2,[82,81,79]);
 g.box(x,y+2.8,z-6.08,11,4.8,.18,[58,73,78]);
 for(let i=0;i<10;i++)g.box(x,y+1.0+i*.42,z-6.22,10,.055,.1,[151,151,139]);
 g.box(x,y+5.85,z-6.9,13,.55,1.45,[191,134,71]);
 g.box(x+7.3,y+3.5,z-6.1,2.2,2.9,.14,[43,80,85]);
 g.box(x-6.5,y+.75,z-6.5,2.4,1.5,.9,[100,100,94]);
}
// Fase 5.3: garaje independiente de los talleres, con persiana y señal reconocible.
function buildVerenneGarage(g){
 const x=-22,z=192,y=cityElevation(x,z),stone=[108,111,104],slate=[47,70,78],gold=[217,173,93];
 g.box(x,y+3.45,z,23,6.9,13,stone);g.box(x,y+7.2,z,24.5,.65,14.6,[56,67,70]);
 g.box(x,y+3.0,z-6.55,13.5,5.6,.2,slate);
 for(let i=0;i<10;i++)g.box(x,y+1+i*.47,z-6.7,12.9,.07,.12,[101,129,130]);
 g.box(x,y+6.1,z-7.1,15.1,.65,1.15,gold);
 for(const side of [-1,1]){g.box(x+side*9.2,y+3.6,z-6.6,2.1,3,.27,[180,185,167]);g.box(x+side*9.2,y+3.2,z-6.76,1.1,1.5,.2,[49,68,75]);}
 g.box(x,y+.2,z-9,15,.28,4,[95,95,85]);
}
const WORKSHOP_LOCATION=[106,132];
function buildViewpoint(g){
 const [x,z]=CITY.viewpoint,y=cityElevation(x,z);
 // Turó de la Rovira's former anti-aircraft battery, represented as weathered concrete remains.
 for(const [dx,dz,w,d,h] of [[0,0,38,22,1.1],[-19,-4,3,15,2.5],[19,-4,3,15,2.5],[0,10,25,2,1.7]])g.box(x+dx,y+h/2,z+dz,w,h,d,[132,127,112]);
 for(let i=0;i<3;i++)g.box(x-11+i*11,y+1.4,z-2,7,.28,1.2,[104,101,94]);
 // Open city vista beyond the hill; low Barcelona silhouettes and a pale Mediterranean horizon.
 g.box(x-350,y-1,z+410,620,2,3,[125,142,142]);
 for(let i=0;i<18;i++){const bx=x-610+i*31,bz=z+365+(i%4)*11,h=12+(i%5)*4;g.box(bx,y+h/2-2,bz,22,h,17,[[174,158,138],[145,156,153],[188,174,148]][i%3]);}
}

// Fase 2: handcrafted period street furniture; deterministic, no external textures.
function buildPeriodStreetscape(g){
 const ink=[45,50,50],iron=[83,86,80],warm=[201,177,125],terracotta=[153,81,60],leaf=[76,103,68];
 const glass=[75,91,91],concrete=[142,136,120];
 const samples=[[-198,210],[-160,172],[-68,168],[57,132],[154,96],[-176,48],[-24,12],[95,-22],[135,-58],[-155,-112],[-28,-148],[70,-184],[164,-215]];
 for(let i=0;i<samples.length;i++){
  const [x,z]=samples[i],y=cityElevation(x,z),side=i%2===0?1:-1;
  // Streetlamps with a gracefully curved arm and warm low-pressure lamp.
  const lx=x+side*13,lz=z+side*8,ly=cityElevation(lx,lz);
  g.cylinder(lx,ly,lz,.13,6.4,7,iron);
  g.box(lx+side*.55,ly+6.45,lz,1.35,.12,.13,iron);
  g.box(lx+side*1.02,ly+6.22,lz,.76,.22,.65,warm);
  // Shop fronts with a roller shutter, striped canopy and a framed doorway.
  if(i%3===0){const sx=x+side*25,sz=z+19,sy=cityElevation(sx,sz);
   g.box(sx,sy+1.65,sz,6.4,3.3,.35,[131,110,91]);
   g.box(sx,sy+1.63,sz+.22,5.6,2.3,.15,ink);
   for(let k=0;k<8;k++)g.box(sx,sy+.65+k*.26,sz+.33,5.5,.038,.07,[139,139,126]);
   g.box(sx,sy+3.25,sz+.65,7.4,.21,1.4,terracotta);
   g.box(sx,sy+3.18,sz+1.36,7.4,.36,.12,warm);
  }
  // Concrete planters and animated-looking Mediterranean silhouettes (static meshes).
  if(i%2===0){const tx=x-side*18,tz=z-22,ty=cityElevation(tx,tz);
   g.box(tx,ty+.36,tz,2,.72,2,concrete);
   g.cylinder(tx,ty+.6,tz,.18,2.6,6,[103,83,62]);
   for(const [dx,dz,r] of [[0,0,1.8],[-1,.2,1.2],[.6,-.5,1.15]]){
    g.cylinder(tx+dx,ty+2.35,tz+dz,r,1.15,7,leaf);
   }
  }
  // Parking sign: mounted on a post, readable silhouette, no modern branding.
  if(i%4===1){const px=x-15,pz=z+12,py=cityElevation(px,pz);
   g.cylinder(px,py,pz,.1,2.9,6,iron);g.box(px,py+2.7,pz,.8,.8,.08,[51,89,126]);
   g.box(px,py+2.7,pz+.06,.13,.52,.035,[227,222,199]);
  }
 }
 // Period telephone cabinets, small masonry kiosks and overhead aerials.
 for(const [x,z] of [[-136,73],[72,17],[-55,-174]]){
  const y=cityElevation(x,z);
  g.box(x,y+1.25,z,1.65,2.5,1.35,[154,63,48]);
  g.box(x,y+1.37,z+.69,1.12,1.58,.09,glass);
  g.box(x,y+2.55,z,1.95,.22,1.66,[104,51,40]);
 }
 for(const [x,z] of [[-92,207],[103,89],[-100,-63],[175,-165]]){
  const y=cityElevation(x,z)+18;
  g.cylinder(x,y,z,.065,4.4,5,iron);
  for(let k=0;k<4;k++){g.box(x,y+1+k*.61,z,2.9,.045,.045,iron);}
 }
}

// Fase 4.1 — Guinardó: edificios de transición del barrio y pequeñas industrias.
// Se mantienen las geometrías nativas y los materiales de la fase anterior.
function buildGuinardoGateway(g){
 const fronts=[[-235,325],[-232,392],[-110,331],[-91,405],[-10,342],[15,408],[115,355],[214,247]];
 const plaster=[[190,167,139],[179,184,174],[201,179,153],[157,169,172]];
 for(let i=0;i<fronts.length;i++){
  const [x,z]=fronts[i],y=cityElevation(x,z),h=16+(i%3)*4,w=16+(i%2)*6;
  g.box(x,y+h/2,z,w,h,16,plaster[i%4]);
  g.box(x,y+h+.55,z,w+1.4,1.1,17.4,[125,105,91]);
  // Recessed rhythmic windows, balcony slabs and iron railings.
  for(let floor=0;floor<3;floor++)for(const dx of [-w*.28,w*.28]){
   const wy=y+3.4+floor*4.4;
   g.box(x+dx,wy,z+8.07,2.2,2.5,.11,[67,90,97]);
   g.box(x+dx,wy-1.37,z+8.65,3.4,.2,1.5,[151,139,124]);
   g.box(x+dx,wy-.6,z+9.34,3.3,1.1,.09,[66,70,67]);
  }
  if(i%3===0){g.box(x,y+2,z+8.25,7,3.5,.2,[93,75,61]);g.box(x,y+3.8,z+8.9,8,.33,1.4,[139,75,55]);}
 }
 // A low industrial workshop and a bus stop signal a change in district character.
 const y=cityElevation(122,370);
 g.box(122,y+4,370,38,8,24,[135,133,123]);g.box(122,y+8.25,370,40,.5,26,[86,94,96]);
 for(let i=0;i<3;i++)g.box(108+i*13,y+2.8,382.15,8,4.5,.15,[67,76,76]);
 const sy=cityElevation(-47,351);
 g.cylinder(-47,sy,351,.11,3.9,7,[68,73,75]);g.box(-47,sy+3.6,351,3,.48,.12,[195,170,100]);
}

// Fase 4.2 — Gràcia: fachadas, comercios de barrio y patios interiores.
// Distrito interpretado a escala de juego; no pretende reproducir un plano histórico exacto.
function buildGraciaGateway(g){
 const facades=[[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224],[-489,210],[-560,165],[-446,118]];
 const paints=[[190,169,141],[210,195,166],[172,181,175],[199,160,136]];
 facades.forEach(([x,z],i)=>{
  const y=cityElevation(x,z),w=22+(i%3)*4,h=15+(i%4)*3,d=18;
  g.box(x,y+h/2,z,w,h,d,paints[i%paints.length]);
  g.box(x,y+h+.4,z,w+1,.8,d+1,[109,91,82]);
  for(let level=0;level<3;level++)for(const dx of [-w*.3,0,w*.3]){
   const wy=y+4+level*4;
   g.box(x+dx,wy,z+d/2+.07,1.8,2.5,.12,[56,77,83]);
   g.box(x+dx,wy-1.4,z+d/2+.67,2.8,.18,1.2,[161,148,130]);
   g.box(x+dx,wy-.68,z+d/2+1.21,2.8,.95,.1,[72,75,73]);
  }
  if(i%2===0){g.box(x,y+1.8,z+d/2+.23,6,3.3,.14,[89,89,77]);g.box(x,y+3.58,z+d/2+.9,7,.22,1.35,[153,82,62]);}
 });
 // Plaza pequeña, banco y plátanos de sombra en una esquina alejada de la calzada.
 const plaza=[-455,257],py=cityElevation(...plaza);
 g.box(plaza[0],py+.15,plaza[1],27,.3,22,[164,150,127]);
 for(const [dx,dz] of [[-9,-7],[9,7]]){
  g.cylinder(plaza[0]+dx,py+.3,plaza[1]+dz,.43,5.8,7,[110,88,66]);
  g.cylinder(plaza[0]+dx,py+6,plaza[1]+dz,3.4,2.8,8,[75,101,71]);
 }
 g.box(-455,py+.7,257,6,.4,1,[103,81,64]);
}

// Fase 4.3: manzanas de chaflanes y grandes avenidas ficticias inspiradas en el Eixample.
function buildEixampleGateway(g){
 const stone=[[198,178,155],[187,185,172],[202,188,166],[173,178,170]];
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){
  const x=eixamplePlotX(i),z=-79+j*115;
  // Edificios desplazados de los carriles y con patio central visible.
  const h=22+((i+j)%3)*5,y=cityElevation(x,z),color=stone[(i+j)%stone.length];
  g.box(x,y+h/2,z,39,h,38,color);
  g.box(x,y+h+.45,z,40,.9,39,[111,99,90]);
  for(const side of [-1,1])for(let floor=0;floor<4;floor++)for(let n=0;n<4;n++){
   const bx=x-14+n*9.1,by=y+4+floor*4.8;
   g.box(bx,by,z+side*19.09,2.8,2.7,.15,[58,75,80]);
   g.box(bx,by-1.47,z+side*19.65,3.7,.2,1.25,[158,151,135]);
   g.box(bx,by-.79,z+side*20.22,3.7,1,.12,[73,78,77]);
  }
  if((i+j)%2===0){g.box(x,y+2,z+19.22,10,3.7,.2,[90,100,91]);g.box(x,y+4,z+20,11,.35,1.7,[139,91,68]);}
  // Patios y árboles entre manzanas, fuera de las carreteras.
  if(j<2){const tx=x+27,tz=z+35,ty=cityElevation(tx,tz);g.cylinder(tx,ty+2.1,tz,.4,4,7,[103,86,60]);g.cylinder(tx,ty+5.2,tz,3.2,3.8,9,[79,112,73]);}
 }
 // Señales de acceso y pequeñas marquesinas en el distrito.
 for(const [x,z] of [[-612,140],[-764,140],[-857,140]]){
  const y=cityElevation(x,z);g.cylinder(x,y+2.1,z,.12,4.2,7,[82,83,77]);g.box(x,y+4.2,z,5,.6,.35,[173,151,107]);
 }
}

// Fase 4.4 — distrito portuario ficticio, interpretado para conducción y no como plano histórico.
function buildPortGateway(g){
 const concrete=[111,117,113],brick=[139,113,99],metal=[83,104,111],roof=[68,79,84];
 // Nave industrial con portones y cubiertas de dientes de sierra simplificados.
 for(let i=0;i<7;i++){
  const x=-950+(i%2)*325,z=portWarehouseZ(i),y=cityElevation(x,z),w=52,h=10+(i%3)*2;
  g.box(x,y+h/2,z,w,h,39,i%2?concrete:brick);
  g.box(x,y+h+.3,z,w+2,.6,41,roof);
  for(let k=0;k<3;k++){
   const gx=x-15+k*15;
   g.box(gx,y+3,z+19.7,10,5,.22,metal);
   g.box(gx,y+5.6,z+19.95,11,.25,.34,[186,155,105]);
  }
  for(let k=0;k<4;k++)g.box(x-18+k*12,y+h-2,z+19.9,3,1.8,.15,[61,80,91]);
 }
 // Contenedores, grúas y bolardos en explanadas alejadas de las vías transitables.
 const palette=[[147,69,54],[71,105,112],[144,125,77],[91,105,85]];
 for(let i=0;i<14;i++){
  const x=-940+(i%4)*71,z=-310-Math.floor(i/4)*80,y=cityElevation(x,z),color=palette[i%4];
  g.box(x,y+1.6,z,19,3.2,8,color);
  for(let k=-8;k<=8;k+=4)g.box(x+k,y+1.6,z+4.09,.16,2.8,.12,[61,66,65]);
 }
 for(const [x,z] of [[-1000,-330],[-590,-460]]){
  const y=cityElevation(x,z);
  g.box(x,y+12,z,1.5,24,1.5,[181,159,105]);
  g.box(x+12,y+24,z,26,1.2,1.5,[181,159,105]);
  g.box(x+23,y+13,z,.2,21,.2,[57,61,61]);
  g.box(x+23,y+2,z,5,.5,3,metal);
 }
 for(const [x,z] of [[-910,-595],[-748,-595],[-645,-520]]){
  const y=cityElevation(x,z);
  g.cylinder(x,y+.9,z,.45,1.8,7,[99,103,99]);
 }
}

// Fase 4.5: Montjuïc estilizado, arbolado y estructuras históricas simplificadas.
function buildMontjuicGateway(g){
 const stone=[150,142,121],light=[185,167,132];
 // Explanada de mirador (fuera de la calzada) y parapetos de piedra.
 const mx=-1468,mz=-336,my=cityElevation(mx,mz);
 g.box(mx,my+.18,mz,34,.35,25,[150,142,122]);
 for(const side of [-1,1])g.box(mx,my+1,mz+side*12.4,35,1.7,.7,stone);
 // Silueta de fortificación original inspirada en la arquitectura defensiva.
 const fx=-1480,fz=-245,fy=cityElevation(fx,fz);
 g.box(fx,fy+7,fz,38,14,29,stone);g.box(fx,fy+14.2,fz,41,.8,32,light);
 for(const dx of [-17,17])for(const dz of [-12,12]){
  g.box(fx+dx,fy+17,fz+dz,6,6,6,stone);
 }
 for(const [x,z] of [[-1110,-710],[-1180,-735],[-1375,-730],[-1480,-700],[-1500,-520],[-1450,-445],[-1315,-380],[-1170,-410],[-1110,-560],[-1355,-250]]){
  const y=cityElevation(x,z);g.cylinder(x,y+3.8,z,.65,7.6,8,[97,78,58]);
  g.cylinder(x,y+9,z,4.3,7,9,[64,89,65]);g.cylinder(x+1.7,y+7.5,z-1.2,3,5.4,8,[73,101,70]);
 }
 // Farolas bajas que hacen legible la carretera de montaña.
 for(const [x,z] of [[-1020,-450],[-1200,-560],[-1300,-525],[-1390,-390],[-1300,-620]]){
  const y=cityElevation(x,z);g.cylinder(x,y+3,z,.18,6,8,[89,87,78]);
  g.box(x,y+6.2,z,1.4,.42,1.1,[230,196,121]);
 }
}


// Tratamiento de relieve para fachadas ya existentes. No se generan edificios
// ni interiores nuevos: se enriquecen las caras que miran a la calle (+Z).
export const FACADE_REMASTER_COUNT=29;
function buildFacadeFinishes(g){
 const eixample=[];
 for(let i=0;i<4;i++)for(let j=0;j<3;j++)eixample.push({x:eixamplePlotX(i),z:-79+j*115,w:39,d:38,h:22+((i+j)%3)*5,kind:'eixample'});
 const gracia=[[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224],[-489,210],[-560,165],[-446,118]].map(([x,z],i)=>({x,z,w:22+(i%3)*4,d:18,h:15+(i%4)*3,kind:'gracia'}));
 const guinardo=[[-235,325],[-232,392],[-110,331],[-91,405],[-10,342],[15,408],[115,355],[214,247]].map(([x,z],i)=>({x,z,w:16+(i%2)*6,d:16,h:16+(i%3)*4,kind:'guinardo'}));
 const tiles=[[162,147,125],[184,171,146],[143,145,137]];
 for(const [index,front] of [...eixample,...gracia,...guinardo].entries()){
  const {x,z,w,d,h,kind}=front,y=cityElevation(x,z),fz=z+d/2,trim=tiles[index%tiles.length];
  // Pilastras discretas, cornisa y faja entre plantas; volumen real, no filtro 2D.
  for(const side of [-1,1])g.box(x+side*(w/2-.5),y+h*.50,fz+.12,.55,h-.5,.5,trim);
  g.box(x,y+h-.37,fz+.38,w+.8,.42,.9,[117,111,102]);
  for(let floor=1;floor<=2;floor++)g.box(x,y+floor*(h/3),fz+.15,w-.8,.14,.48,trim);
  const number=kind==='eixample'?4:kind==='gracia'?3:2;
  const span=(w-7)/number;
  for(let n=0;n<number;n++){
   const wx=x+(n-(number-1)/2)*span;
   // Dinteles de piedra y jambas verticales para leer huecos incluso desde cámara alta.
   const windowY=y+(kind==='guinardo'?7.25:8.1);
   g.box(wx,windowY+1.45,fz+.24,2.65,.17,.50,trim);
   for(const side of [-1,1])g.box(wx+side*1.24,windowY+.10,fz+.26,.19,2.45,.44,trim);
   // Persiana de lamas parcialmente bajada con variación fija según inmueble.
   if((n+index)%3!==0){
    const panel=[122,104,82];
    g.box(wx,windowY+.86,fz+.41,1.98,.36,.12,panel);
    for(let slat=0;slat<3;slat++)g.box(wx,windowY+.72+slat*.15,fz+.485,1.94,.035,.04,[153,136,109]);
   }
  }
  // Portal en planta baja, zócalo cerámico y pequeña placa de numeración ficticia.
  g.box(x,y+1.85,fz+.29,2.65,3.5,.16,[63,67,67]);
  g.box(x,y+3.7,fz+.38,3.3,.27,.55,trim);
  g.box(x+1.9,y+2.45,fz+.45,.58,.42,.11,[196,184,146]);
  for(const side of [-1,1])g.box(x+side*(w*.32),y+.68,fz+.22,w*.28,1.2,.17,[125,120,109]);
 }
}

// Fase 11.2 — A hand-authored, deterministic 1984 streetscape pass.
// These decorations attach to existing buildings and roadside sidewalks;
// they never change physics, navigation, mission triggers or collisions.
export const VISUAL_REMASTER_112=Object.freeze({carmelHouses:8,graciaFacades:9,streetCorners:6});
// Fase 11.6: depth accents are visual only, independent from navigation/colliders.
export const FACADE_DEPTH_116=Object.freeze({graciaPortals:9,carmelEntrances:8,graciaRoofEdges:9});
function buildCarmelGraciaArtPass(g){
 const iron=ART_PALETTE.iron,oldGold=[165,137,89],shade=[102,76,66],ceramic=ART_PALETTE.ceramic;
 const grace=[[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224],[-489,210],[-560,165],[-446,118]];
 grace.forEach(([x,z],i)=>{
  const w=22+(i%3)*4,d=18,h=15+(i%4)*3,y=cityElevation(x,z),front=z+d/2;
  // Continuous ground-floor ceramic plinth and differently weathered upper band.
  g.box(x,y+.46,front+.28,w-.6,.86,.24,i%3===0?ceramic:[132,118,101]);
  g.box(x,y+h-1.05,front+.2,w-.85,.16,.36,[151,134,112]);
  // Steel balcony uprights: independent vertical balusters rather than solid dark slabs.
  for(let floor=0;floor<Math.min(3,Math.floor((h-3)/4));floor++){
   const by=y+4+floor*4-1.38;
   for(const dx of [-w*.3,0,w*.3]){
    const bx=x+dx,bz=front+1.24;
    for(let k=-2;k<=2;k++)g.box(bx+k*.53,by+.46,bz,.075,.88,.075,iron);
    g.box(bx,by+.91,bz,2.8,.085,.13,iron);
    if((i+floor)%3===0){
     // A few hanging flower boxes provide non-repeating facade silhouettes.
     g.box(bx,by+.10,bz+.26,1.15,.32,.46,[137,78,59]);
     for(const v of [-.33,.28])g.cylinder(bx+v,by+.26,bz+.22,.22,.43,5,[71,102,65]);
    }
   }
  }
  // Individual ochre/green striped fabric awnings above selected shop windows.
  if(i%2===0){
   for(let k=0;k<5;k++)g.box(x-3.4+k*1.7,y+3.73,front+1.32,1.68,.14,1.65,k%2?[197,169,108]:[101,117,100]);
   g.box(x,y+3.33,front+2.13,8.5,.61,.13,shade);
  }
  // Recessed, shaded doorway and a compact threshold step.
  g.box(x,y+ART_SCALE.doorHeight/2,front+.51,ART_SCALE.doorWidth,ART_SCALE.doorHeight,.14,ART_PALETTE.darkDoor);
  g.box(x,y+ART_SCALE.doorThreshold/2,front+1.05,ART_SCALE.doorWidth+.55,ART_SCALE.doorThreshold,1.28,ART_PALETTE.stone);
  // Layered 1980s portal: recessed dark opening, frame, stone sill and lintel.
  // The silhouette reads as an entrance rather than a painted rectangle.
  g.box(x-ART_SCALE.doorWidth*.55,y+ART_SCALE.doorHeight*.5,front+.72,.17,ART_SCALE.doorHeight+.35,.42,ART_PALETTE.agedStone);
  g.box(x+ART_SCALE.doorWidth*.55,y+ART_SCALE.doorHeight*.5,front+.72,.17,ART_SCALE.doorHeight+.35,.42,ART_PALETTE.agedStone);
  g.box(x,y+ART_SCALE.doorHeight+.20,front+.72,ART_SCALE.doorWidth+.36,.32,.5,ART_PALETTE.stone);
  g.box(x,y+ART_SCALE.doorHeight*.5,front+.76,ART_SCALE.doorWidth*.66,ART_SCALE.doorHeight*.77,.055,[37,42,43]);
  g.box(x+.43,y+1.15,front+.82,.085,.16,.065,oldGold);
  // Roof cornice with a narrow underside shadow, breaking flat building silhouettes.
  g.box(x,y+h-.10,front+.48,w+.36,.20,.92,ART_PALETTE.windowLedge);
  g.box(x,y+h-.29,front+.37,w+.19,.12,.55,[102,98,87]);
 });
 // Upper Carmel: small stepped residences with individually legible openings,
 // roof terraces and water tanks; deliberately placed clear of navigation lanes.
 const carmel=[[-110,-225],[-84,-225],[-58,-225],[-110,229],[-83,229],[72,216],[104,216],[210,185]];
 carmel.forEach(([x,z],i)=>{
  const y=cityElevation(x,z),w=11+(i%3)*2,d=10,h=6+(i%3)*1.2;
  const wall=[[180,151,125],[162,170,156],[196,177,140]][i%3];
  g.box(x,y+h/2,z,w,h,d,wall);
  g.box(x,y+h+.20,z,w+.75,.35,d+.7,[115,100,88]);
  // Painted courtyard fronts face +Z, but all elements belong to the facade.
  g.box(x-2.6,y+ART_SCALE.doorHeight/2,z+d/2+.11,ART_SCALE.doorWidth,ART_SCALE.doorHeight,.16,ART_PALETTE.carmelDoor);
  // The Carmel entrances use deep jambs and a projecting rain-hood.
  for(const side of [-1,1])g.box(x-2.6+side*(ART_SCALE.doorWidth/2+.10),y+ART_SCALE.doorHeight/2,z+d/2+.36,.16,ART_SCALE.doorHeight+.2,.55,ART_PALETTE.agedStone);
  g.box(x-2.6,y+ART_SCALE.doorHeight+.12,z+d/2+.48,ART_SCALE.doorWidth+.45,.23,.82,ART_PALETTE.stone);
  g.box(x-2.6,y+ART_SCALE.doorThreshold/2,z+d/2+.71,ART_SCALE.doorWidth+.36,ART_SCALE.doorThreshold,1.05,ART_PALETTE.stone);
  for(const dx of [.0,3.15]){
   g.box(x+dx,y+3.3,z+d/2+.11,1.65,1.85,.12,[57,77,82]);
   g.box(x+dx-.92,y+3.3,z+d/2+.2,.37,2.02,.12,ART_PALETTE.windowFrame);
   g.box(x+dx+.92,y+3.3,z+d/2+.2,.37,2.02,.12,ART_PALETTE.windowFrame);
   g.box(x+dx,y+4.35,z+d/2+.18,2.1,.15,.4,[206,195,162]);
  }
  for(const dx of [-w/2+.36,w/2-.36])g.box(x+dx,y+h+.8,z,.24,1.7,d+.25,[91,92,83]);
  g.box(x,y+h+1.72,z-d/2+.28,w,.14,.15,iron);
  if(i%2===0){g.cylinder(x+w*.26,y+h+.3,z-d*.2,.8,1.5,8,[92,103,108]);}
  // Terrace planters punctuate the skyline without adding collidable bodies.
  g.box(x-w*.3,y+h+.35,z+d*.19,1.6,.65,.65,[153,90,65]);
  g.cylinder(x-w*.3,y+h+.7,z+d*.19,.43,.85,6,[76,105,67]);
 });
 // Six carefully spaced sidewalk details near the approach to Gracia and
 // hillside stairs. Their distance from the driving lane is verified in tests.
 const corners=[[-335,185],[-410,192],[-480,192],[-160,240],[-128,196],[110,167]];
 corners.forEach(([x,z],i)=>{
  const near=nearestStreet(x,z),offset=18.5;
  const bx=near.x+near.nx*offset,bz=near.z+near.nz*offset,y=cityElevation(bx,bz);
  g.cylinder(bx,y,bz,.52,1.02,8,[151,105,77]);
  g.cylinder(bx,y+.75,bz,.32,1.2,7,[74,108,70]);
  if(i%2===0){
   const tx=bx+near.tx*2.8,tz=bz+near.tz*2.8,ty=cityElevation(tx,tz);
   g.box(tx,ty+.35,tz,3.4,.26,.9,[113,92,69]);
   for(const side of [-1,1])g.box(tx+side*1.35,ty+.2,tz,.22,.54,.6,[69,73,69]);
  }
 });
}

// Fase 11.3: street-level hillside character, deliberately beyond the driving lane.
// Decorative meshes only; original collision and nav meshes remain unchanged.
export const STREET_REMASTER_113=Object.freeze({retainingWalls:10,stairFlights:4,streetSigns:8});
export const STREET_REMASTER_113_ANCHORS=Object.freeze([
 [-205,335],[-150,348],[-46,272],[45,330],[154,220],
 [-335,123],[-410,123],[-480,122],[-250,126],[-176,8]
].map(([x,z])=>Object.freeze({x,z})));
export function streetArt113Position(anchor){
 const near=nearestStreet(anchor.x,anchor.z);let best=null;
 for(const side of [-1,1])for(const offset of [18.5,22,26]){
  const x=near.x+near.nx*side*offset,z=near.z+near.nz*side*offset;
  const distance=nearestStreet(x,z).distance;
  if(!best||distance>best.clearance)best={x,z,clearance:distance,near};
 }
 return best;
}
function buildStreetArt113(g){
 const masonry=[[123,119,104],[143,132,113],[112,111,102]],metal=[74,80,79],ceramic=[184,168,135];
 const anchors=STREET_REMASTER_113_ANCHORS;
 anchors.forEach((anchor,i)=>{
  const {x,z,near}=streetArt113Position(anchor);
  // Choose the clear side of intersections, away from all nearby streets.
  const span=9.5+(i%3)*2,parts=5;
  for(let j=0;j<parts;j++){
   const along=(j-(parts-1)/2)*span/parts;
   const cx=x+near.tx*along,cz=z+near.tz*along,y=cityElevation(cx,cz);
   const horizontal= Math.abs(near.tx)>Math.abs(near.tz);
   g.box(cx,y+1.05+(j%2)*.12,cz,horizontal?span/parts+.16:.54,2.1+(j%2)*.24,horizontal?.54:span/parts+.16,masonry[(i+j)%3]);
   g.box(cx,y+2.18+(j%2)*.12,cz,horizontal?span/parts+.22:.78,.22,horizontal?.78:span/parts+.22,ceramic);
  }
  // A small, recessed warning plaque at each retaining wall.
  const px=x+near.tx*span*.38,pz=z+near.tz*span*.38,py=cityElevation(px,pz);
  g.box(px,py+1.55,pz,1.1,.55,.14,[85,101,104]);
 });
 const climbs=[[-104,84,-104,126],[-78,-106,-42,-106],[48,44,48,87],[184,-5,220,-5]];
 climbs.forEach(([ax,az,bx,bz],i)=>{
  const dx=bx-ax,dz=bz-az,length=Math.hypot(dx,dz),tx=dx/length,tz=dz/length,nx=tz,nz=-tx;
  // Narrow steps and handrails placed alongside existing neighborhood stairways.
  const stepCount=9;
  for(let k=0;k<stepCount;k++){
   const t=(k+.5)/stepCount,cx=ax+dx*t,cz=az+dz*t,y=cityElevation(cx,cz);
   g.box(cx,y+.10,cz,2.9,.18,2.9,k%3===0?[144,133,113]:[127,123,110]);
   if(k%3===0)for(const side of [-1,1]){
    const rx=cx+nx*2.15*side,rz=cz+nz*2.15*side,ry=cityElevation(rx,rz);
    g.box(rx,ry+.95,rz,.14,1.9,.14,metal);
   }
  }
  const midx=(ax+bx)/2,midz=(az+bz)/2;
  for(const side of [-1,1]){
   const rx=midx+nx*2.15*side,rz=midz+nz*2.15*side,ry=cityElevation(rx,rz);
   g.box(rx,ry+1.92,rz,Math.abs(tx)>.7?length*.85:.13,.12,Math.abs(tz)>.7?length*.85:.13,metal);
  }
 });
 // Eight modest period-correct unbranded wayfinding signs beside, not on, the streets.
 anchors.slice(0,8).forEach((anchor,i)=>{
  const pos=streetArt113Position(anchor),n=pos.near,x=pos.x,z=pos.z,y=cityElevation(x,z);
  g.box(x,y+1.85,z,.15,3.7,.15,metal);
  g.box(x,y+3.65,z,2.5,.68,.13,i%2?[66,100,115]:[95,112,104]);
  g.box(x,y+3.68,z+.09,2.08,.1,.07,[212,205,172]);
 });
}

// Fase 11.4: district-specific ambient street life. These are deliberately
// non-interactive details outside the carriageways, not new NPCs or colliders.
export const ATMOSPHERE_114=Object.freeze({carmelCorners:6,graciaShops:6,litWindows:18});
export const ATMOSPHERE_114_ANCHORS=Object.freeze([
 [-205,340],[-150,350],[-46,270],[45,328],[154,230],[-176,15],
 [-335,122],[-410,123],[-480,120],[-410,195],[-335,175],[-480,190]
].map(([x,z])=>Object.freeze({x,z})));
export function ambient114Placement(anchor){
 const road=nearestStreet(anchor.x,anchor.z);
 let best=null;
 for(const side of [-1,1])for(const offset of [20,24,28,32]){
  const x=road.x+road.nx*side*offset,z=road.z+road.nz*side*offset;
  const clearance=nearestStreet(x,z).distance;
  if(!best||clearance>best.clearance)best={x,z,clearance};
 }
 return best;
}
function buildAmbient114(g){
 const dark=[64,69,69],iron=[83,88,82],terracotta=[153,103,72],leaf=[69,103,73],gold=[207,166,92];
 ATMOSPHERE_114_ANCHORS.forEach((anchor,i)=>{
  const {x,z}=ambient114Placement(anchor),y=cityElevation(x,z);
  if(i<ATMOSPHERE_114.carmelCorners){
   // Hilltop corner: masonry bench, weathered planter and a community notice board.
   g.box(x,y+.43,z,3.8,.86,1.0,[133,121,103]);
   g.box(x,y+1.08,z-.4,3.8,.9,.2,[115,104,90]);
   g.box(x+3,y+.52,z,1.28,1.05,1.18,terracotta);
   g.cylinder(x+3,y+1.39,z,.58,1.05,6,leaf);
   g.box(x-3.2,y+1.58,z,.18,3.1,.18,iron);
   g.box(x-3.2,y+2.71,z,2.25,1.13,.20,[111,107,89]);
   g.box(x-3.2,y+2.73,z+.12,1.66,.45,.06,[197,186,149]);
  }else{
   // Gràcia: shuttered shopfront, period pavement cafe table and warm lantern.
   g.box(x,y+1.2,z,3.5,2.4,.38,[119,106,86]);
   for(let slat=0;slat<5;slat++)g.box(x,y+.38+slat*.34,z+.23,3.0,.08,.08,[76,88,87]);
   g.cylinder(x+3.15,y+.88,z,.65,.10,8,[132,107,81]);
   g.cylinder(x+3.15,y+.43,z,.10,.86,7,dark);
   g.box(x-2.6,y+1.52,z,.13,3.04,.13,iron);
   g.box(x-2.6,y+3.1,z,.95,.55,.78,gold);
   g.box(x-2.6,y+3.41,z,1.10,.13,.95,dark);
  }
 });
 // Warm window accents are built directly onto the established Gràcia facades.
 // Their calibrated color is recognized by the existing night shader.
 const grace=[[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224]];
 for(const [i,[x,z]] of grace.entries()){
  const w=22+(i%3)*4,d=18,h=15+(i%4)*3,y=cityElevation(x,z);
  for(let j=0;j<3;j++){
   const wx=x+(j-1)*w*.25,wy=y+7.1+(j%2)*3.3;
   g.box(wx,wy,z+d/2+.44,1.45,1.5,.10,gold);
   g.box(wx,wy+.78,z+d/2+.54,1.72,.12,.15,[97,83,65]);
  }
 }
}

// Fase 11.7 — architecture silhouettes, not extra roadside clutter. All features
// attach to established facade footprints; physics and road bounds are untouched.
export const ARCHITECTURAL_PASS_117=Object.freeze({graciaGalleries:9,carmelRooflines:8});
function buildArchitecturalPass117(g){
 const gracia=[[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224],[-489,210],[-560,165],[-446,118]];
 for(const [i,[x,z]] of gracia.entries()){
  const w=22+(i%3)*4,d=18,h=15+(i%4)*3,y=cityElevation(x,z),face=z+d/2;
  // Continuous projecting upper gallery instead of a flat front painted with windows.
  g.box(x,y+8.4,face+1.02,w*.73,.31,2.15,[157,143,120]);
  g.box(x,y+9.83,face+2.06,w*.73,.15,.18,[91,86,78]);
  for(const side of [-1,1])g.box(x+side*w*.365,y+9.08,face+1.97,.14,1.52,.18,[91,86,78]);
  // Layered roof profile breaks the repetitive rectangular skyline.
  g.taperedBox(x,y+h-.11,z,[w+.54,d+.64],[w-.92,d-.85],y+h+.84,[128,101,83]);
 }
 const carmel=[[-110,-225],[-84,-225],[-58,-225],[-110,229],[-83,229],[72,216],[104,216],[210,185]];
 for(const [i,[x,z]] of carmel.entries()){
  const w=11+(i%3)*2,d=10,h=6+(i%3)*1.2,y=cityElevation(x,z);
  // Sloping small roof cap and rain gutter give each hillside house a distinct profile.
  g.taperedBox(x,y+h+.39,z,[w+.85,d+.8],[w-1.5,d-1.2],y+h+1.65,i%2?[134,90,74]:[114,104,91]);
  g.box(x,y+h+.42,z+d/2+.48,w+.8,.17,.28,[82,86,81]);
 }
}


// Fase 11.8 — a material and window rhythm pass attached to existing footprints.
// No roadway objects, no external textures, no changes to physics or collisions.
export const FACADE_MATERIAL_PASS_118=Object.freeze({gracia:9,carmel:8,nightWindows:18});
export const FACADE_MATERIALS_118=Object.freeze({
  plaster:Object.freeze([[173,150,124],[197,171,140],[170,175,164]]),
  base:Object.freeze([109,104,94]),
  frame:Object.freeze([89,79,68]),
  shutter:Object.freeze([94,110,99]),
  darkGlass:Object.freeze([46,69,80]),
  litGlass:Object.freeze([207,166,92]),
  tile:Object.freeze([126,148,139])
});
function buildFacadeMaterials118(g){
 const gracia=[[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224],[-489,210],[-560,165],[-446,118]];
 for(const [i,[x,z]] of gracia.entries()){
  const w=22+(i%3)*4,d=18,h=15+(i%4)*3,y=cityElevation(x,z),front=z+d/2;
  const plaster=FACADE_MATERIALS_118.plaster[i%3];
  // A narrow band of raised plaster and a ceramic shopfront base adds surface rhythm.
  g.box(x,y+4.98,front+.19,w-.9,.14,.22,plaster);
  g.box(x,y+1.17,front+.28,w-.95,.56,.20,FACADE_MATERIALS_118.tile);
  for(let j=-1;j<=1;j++){
   const xx=x+j*w*.245,lit=(i+j+9)%3===0;
   // Recessed dark glazing, iron surrounds, and shutter slats have separate depth.
   g.box(xx,y+6.85,front+.26,2.12,2.30,.13,FACADE_MATERIALS_118.frame);
   g.box(xx,y+6.85,front+.35,1.72,1.88,.08,lit?FACADE_MATERIALS_118.litGlass:FACADE_MATERIALS_118.darkGlass);
   for(const side of [-1,1])g.box(xx+side*1.20,y+6.84,front+.35,.28,2.21,.10,FACADE_MATERIALS_118.shutter);
   g.box(xx,y+5.59,front+.46,2.54,.15,.34,ART_PALETTE.windowLedge);
  }
 }
 const carmel=[[-110,-225],[-84,-225],[-58,-225],[-110,229],[-83,229],[72,216],[104,216],[210,185]];
 for(const [i,[x,z]] of carmel.entries()){
  const w=11+(i%3)*2,d=10,h=6+(i%3)*1.2,y=cityElevation(x,z),front=z+d/2;
  const plaster=FACADE_MATERIALS_118.plaster[(i+1)%3];
  g.box(x,y+2.16,front+.22,w-.48,.13,.27,plaster);
  g.box(x,y+.61,front+.29,w-.56,.35,.16,FACADE_MATERIALS_118.base);
  for(const side of [-1,1]){
   const xx=x+side*w*.27;
   g.box(xx,y+3.74,front+.33,1.6,1.72,.10,FACADE_MATERIALS_118.frame);
   g.box(xx,y+3.74,front+.40,1.35,1.43,.07,(i+side+5)%3===0?FACADE_MATERIALS_118.litGlass:FACADE_MATERIALS_118.darkGlass);
   g.box(xx,y+2.85,front+.47,1.94,.12,.24,ART_PALETTE.windowLedge);
  }
 }
}

function buildSecretMarkers(g){
 // Eight permanent brass micro-plaques, left visible after discovery: clues, not pickups.
 // Short pillars at street level; the archive distinguishes discovered vs undiscovered.
 for(const secret of DISCOVERIES){
  const near=nearestStreet(secret.x,secret.z);
  const x=secret.x+near.nx*11,z=secret.z+near.nz*11,y=cityElevation(x,z);
  g.box(x,y+.18,z,3.2,.36,3.2,[89,100,98]);
  g.box(x,y+.86,z,1.6,1.2,1.2,[94,108,103]);
  g.box(x,y+1.55,z,2.2,.22,1.6,[205,166,96]);
  g.box(x,y+1.67,z,1.35,.04,.65,[60,78,78]);
 }
}

// Secondary characters have distinct 1984 silhouettes, clothing and props.
// Characters are separate dynamic meshes. City geometry retains only ground plaques and evidence.
export const CONTACT_VISUAL_PROFILES=Object.freeze([
 Object.freeze({id:'manel',coat:[65,112,102],trousers:[46,54,51],hair:[66,59,48],accessory:'toolbox'}),
 Object.freeze({id:'clara',coat:[117,87,121],trousers:[54,48,65],hair:[64,40,30],accessory:'satchel'}),
 Object.freeze({id:'nuria',coat:[151,118,79],trousers:[46,52,66],hair:[43,36,32],accessory:'camera'})
]);
function buildContactFigures(g){
 for(const [i,c] of CONTACTS.entries()){
  const near=nearestStreet(c.x,c.z),x=c.x+near.nx*12,z=c.z+near.nz*12,y=cityElevation(x,z),v=CONTACT_VISUAL_PROFILES[i];
  g.cylinder(x,y+.12,z,2.5,.24,10,[78,116,103]);
  // Adjacent distinct conversation signage and an evidence marker.
  g.box(x+2.5,y+1,z,1.2,2,1.2,[77,125,105]);
  g.box(x+2.5,y+2.17,z,2.4,.23,1.5,[189,212,166]);
  const item=nearestStreet(c.location.x,c.location.z),px=c.location.x+item.nx*12,pz=c.location.z+item.nz*12,py=cityElevation(px,pz);
  g.box(px,py+.32,pz,2.8,.65,2.4,[102,111,111]);
  g.box(px,py+.72,pz,1.5,.15,1.1,[225,160,89]);
  g.box(px,py+.81,pz,.8,.05,.45,[249,220,155]);
 }
}

export function contactPlacement(contact){
 const near=nearestStreet(contact.x,contact.z);
 const x=contact.x+near.nx*12,z=contact.z+near.nz*12;
 return {x,y:cityElevation(x,z),z};
}

// Fase 11.9: compact street-level assets. Only decorative geometry;
// the nearest-road test keeps all objects beyond the drivable surface.
export const STREET_DETAIL_119=Object.freeze([
 {x:-205,z:325,kind:'stop'}, {x:-150,z:344,kind:'planter'},
 {x:-410,z:124,kind:'stop'}, {x:-480,z:132,kind:'planter'},
 {x:-335,z:142,kind:'utility'}, {x:-46,z:333,kind:'utility'},
 {x:-700,z:45,kind:'stop'}, {x:-785,z:-400,kind:'utility'},
 {x:-875,z:-480,kind:'stop'}, {x:154,z:44,kind:'planter'}
].map(o=>Object.freeze(o)));
export function streetDetailPlacement(entry){
 const q=nearestStreet(entry.x,entry.z);
 const side=((entry.x-q.x)*q.nx+(entry.z-q.z)*q.nz)>=0?1:-1;
 // Search both sides and a short distance along the street to avoid junctions.
 let chosen=null;
 for(const along of [0,9,-9,18,-18,28,-28])for(const sign of [side,-side]){
  const x=q.x+q.nx*sign*(CITY.sidewalkHalf+5)+q.tx*along;
  const z=q.z+q.nz*sign*(CITY.sidewalkHalf+5)+q.tz*along;
  if(nearestStreet(x,z).distance>=CITY.sidewalkHalf+3){chosen={x,z};break;}
  if(chosen)break;
 }
 if(!chosen)throw Error('No safe street detail placement: '+entry.x+','+entry.z);
 return {...chosen,y:cityElevation(chosen.x,chosen.z),kind:entry.kind};
}
function buildStreetDetails119(g){
 for(const entry of STREET_DETAIL_119){
  const p=streetDetailPlacement(entry),y=p.y,{x,z}=p;
  if(nearestStreet(x,z).distance<CITY.roadHalf+2)continue;
  if(p.kind==='stop'){
   // Two-post 1980s-style neighbourhood bus-stop shelter, without advertising.
   const metal=[71,85,88],roof=[92,101,98],glass=[103,136,144];
   for(const ox of [-1.7,1.7])g.box(x+ox,y+1.55,z,.16,3.1,.16,metal);
   g.box(x,y+3.16,z,4.3,.22,2.2,roof);
   g.box(x,y+1.65,z+.92,3.7,2.55,.11,glass);
   g.box(x,y+.61,z-.45,3.1,.17,.9,[106,92,72]);
   for(const ox of [-1.2,1.2])g.box(x+ox,y+.34,z-.45,.17,.55,.78,metal);
  }else if(p.kind==='utility'){
   g.box(x,y+.94,z,1.08,1.88,.83,[100,116,115]);
   g.box(x,y+1.68,z-.43,.75,.22,.055,[64,76,75]);
   g.box(x,y+.75,z-.43,.74,.08,.06,[191,186,159]);
   g.box(x,y+.24,z-.43,.68,.07,.06,[191,186,159]);
  }else{
   g.box(x,y+.3,z,1.65,.6,1.48,[153,124,95]);
   g.box(x,y+.66,z,1.38,.13,1.24,[83,103,71]);
   for(const ox of [-.36,.29]){
    g.box(x+ox,y+1.12,z,.10,.88,.10,[72,91,62]);
    g.box(x+ox,y+1.48,z,.60,.34,.57,[63,111,71]);
   }
  }
 }
}


// Fase 11.19 — rooftop silhouettes, visible from uphill roads and chase camera.
// Everything is above existing roofs: no collision, street width or waypoint changes.
export const ROOFTOP_SILHOUETTES_1119=Object.freeze({gracia:9,carmel:8});
export const ROOFTOP_SILHOUETTE_SITES_1119=Object.freeze({
 gracia:Object.freeze([[-346,8],[-394,24],[-473,36],[-500,58],[-352,250],[-423,224],[-489,210],[-560,165],[-446,118]]),
 carmel:Object.freeze([[-110,-225],[-84,-225],[-58,-225],[-110,229],[-83,229],[72,216],[104,216],[210,185]])
});
function buildRooftopSilhouettes1119(g){
 const {gracia,carmel}=ROOFTOP_SILHOUETTE_SITES_1119;
 for(const [i,[x,z]] of gracia.entries()){
  const h=15+(i%4)*3,y=cityElevation(x,z)+h+.86;
  const dx=(i%2?4:-4),dz=(i%3-1)*2;
  // Small chimney stacks and copper caps break repeated flat rooflines.
  g.box(x+dx,y+.95,z+dz,1.6,1.9,1.45,[136,117,99]);
  g.box(x+dx,y+1.96,z+dz,1.96,.22,1.78,[98,92,86]);
  if(i%3===0){
   // Radio aerial: period detail, narrow and above the roofline.
   g.box(x-dx,y+2.0,z-dz,.14,3.9,.14,[73,78,80]);
   g.box(x-dx,y+3.63,z-dz,2.6,.10,.12,[73,78,80]);
  }
 }
 for(const [i,[x,z]] of carmel.entries()){
  const h=6+(i%3)*1.2,y=cityElevation(x,z)+h+1.7;
  // Roof tank, vent and shade: hillside house profile in near and medium distance.
  g.box(x+1.8,y+.65,z-.7,2.15,1.2,1.8,[92,103,100]);
  g.box(x+1.8,y+1.32,z-.7,2.35,.15,2,[72,79,75]);
  g.box(x-2.1,y+.59,z+1.2,.75,1.1,.75,[160,135,110]);
 }
}

// Fase 11.20 — curated hillside panorama, an original fictionalized terrace.
// All meshes are decorative: existing streets, collision logic and objective sites stay unchanged.
export const CARMEL_PANORAMA_1120=Object.freeze({x:270,z:-163,terraces:3,arches:4,lamps:3});
function buildCarmelPanorama1120(g){
 const {x,z}=CARMEL_PANORAMA_1120;
 const y=cityElevation(x,z),stone=[153,137,110],pale=[193,173,140],iron=[73,79,78],tile=[126,80,65];
 // Layered viewing terrace on the outside of the road bend; weathered masonry makes the hill legible.
 for(let level=0;level<3;level++){
  const dz=level*7,dy=level*.58;
  g.box(x,y+.32+dy,z+dz,31-level*3,.65,9,level===1?pale:stone);
  g.box(x,y+1.2+dy,z+dz+4.35,30-level*3,1.3,.65,stone);
 }
 for(let i=0;i<7;i++){
  const sx=x-10+i*3.1,sy=cityElevation(sx,z-5);
  g.box(sx,sy+.15+i*.075,z-4.8,2.8,.3,3.2,[159,149,129]);
 }
 // Four arched alcoves on a restrained neighborhood pavilion (not an interior).
 const px=x+4,pz=z+17,py=cityElevation(px,pz);
 g.box(px,py+4,pz,23,8,5,[181,160,128]);
 g.box(px,py+8.4,pz,25,1.15,6.2,tile);
 for(let i=0;i<4;i++){
  const ax=px-8.1+i*5.4;
  g.box(ax,py+2.6,pz-2.57,3.6,4.6,.20,[75,84,85]);
  g.box(ax,py+5.03,pz-2.67,4.15,.57,.24,pale);
  g.box(ax-1.9,py+2.55,pz-2.72,.35,4.5,.35,pale);
  g.box(ax+1.9,py+2.55,pz-2.72,.35,4.5,.35,pale);
 }
 // Framed skyline and period streetlight silhouettes visible in the approach.
 for(const [lx,lz] of [[x-12,z-1],[x+12,z+1],[x+10,z+14]]){
  const ly=cityElevation(lx,lz);
  g.cylinder(lx,ly+2.8,lz,.14,5.6,7,iron);
  g.box(lx,ly+5.6,lz,1.25,.35,1.25,[217,181,111]);
 }
 for(const [dx,dz] of [[-15,15],[14,15]]){
  const ax=x+dx,az=z+dz,ay=cityElevation(ax,az);
  g.box(ax,ay+.55,az,2.5,1.1,2.2,tile);
  g.cylinder(ax,ay+1.7,az,.18,2.4,7,[88,92,69]);
  g.cylinder(ax,ay+3.1,az,1.3,2.2,9,[75,101,65]);
 }
}

// Fase 11.21 — identidad de los distritos menos remasterizados.
// Ornamentos sobre cubiertas existentes: sin nuevos obstáculos ni cambios de colisión.
export const DISTRICT_IDENTITY_1121=Object.freeze({eixample:12,port:7,montjuic:8});
function buildDistrictIdentity1121(g){
 // Eixample: coronaciones, patios de luces y pequeños torreones sobre edificios existentes.
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){
  const x=eixamplePlotX(i),z=-79+j*115,h=22+((i+j)%3)*5,y=cityElevation(x,z);
  const stone=(i+j)%2?[153,140,121]:[176,163,144];
  g.box(x,y+h+1.2,z-11,18,1.45,1.1,stone);
  for(const dx of [-7,7])g.box(x+dx,y+h+2.1,z-11,1.1,2.2,1.4,[109,106,100]);
  g.box(x+10,y+h+1.6,z+9,5,2.4,5,[105,112,107]);
  g.box(x+10,y+h+2.95,z+9,6,.36,6,[76,85,82]);
 }
 // Puerto: luminarias altas y conductos sobre siete cubiertas industriales existentes.
 for(let i=0;i<7;i++){
  const x=-950+(i%2)*325,z=portWarehouseZ(i),y=cityElevation(x,z),h=10+(i%3)*2;
  for(const dx of [-13,13]){
   g.box(x+dx,y+h+2.15,z,2.5,3.4,3.2,[92,104,105]);
   g.box(x+dx,y+h+4,z,3.2,.35,3.7,[174,158,118]);
  }
  g.cylinder(x,y+h+3.5,z-12,.22,6.2,7,[107,111,105]);
  g.box(x,y+h+6.7,z-12,2,.55,1,[228,191,124]);
 }
 // Montjuïc: almenas y una atalaya sobre la fortificación ya existente.
 const fx=-1480,fz=-245,fy=cityElevation(fx,fz);
 for(let i=0;i<8;i++){
  const bx=fx-17.5+i*5;
  g.box(bx,fy+15.5,fz-14.5,2.5,2.6,2.5,[156,146,124]);
 }
 g.cylinder(fx,fy+18.5,fz,3.8,7.5,9,[160,151,131]);
 g.cylinder(fx,fy+22.65,fz,4.6,.8,9,[190,169,137]);
}

// Fase 11.22 — lectura de material a la altura de la cámara, sin tocar calzadas.
// Las molduras se apoyan en fachadas existentes (z +/- 19) y nunca generan colisiones.
export const STREET_LEVEL_ART_1122=Object.freeze({eixampleEntrances:12,portBays:7});
function buildStreetLevelArt1122(g){
 // Portales del Eixample: zócalos de piedra, jambas, dinteles y marcos con sombras.
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){
  const x=eixamplePlotX(i),z=-79+j*115,y=cityElevation(x,z),front=z+19.15;
  const stone=(i+j)%2?[138,127,113]:[167,149,125];
  g.box(x,y+2.05,front+.16,8,4.1,.28,[59,68,68]);
  for(const side of [-1,1]){
   g.box(x+side*4.1,y+2.45,front+.32,.62,4.9,.7,stone);
   g.box(x+side*3.28,y+1.15,front+.38,.18,2.2,.18,[188,169,138]);
  }
  g.box(x,y+4.92,front+.38,9,.62,.85,stone);
  g.box(x,y+.25,front+.53,9,.5,1.1,[114,103,93]);
  g.box(x,y+2.25,front+.36,.14,3.15,.2,[173,152,113]);
 }
 // Puerto: portones segmentados y nervaduras de metal; anclados al frente de cada nave.
 for(let i=0;i<7;i++){
  const x=-950+(i%2)*325,z=portWarehouseZ(i),y=cityElevation(x,z),front=z+19.88;
  for(let bay=0;bay<3;bay++){
   const bx=x-15+bay*15;
   for(let line=0;line<4;line++)g.box(bx,y+1.15+line*1.05,front+.09,9.7,.1,.2,[137,147,141]);
   g.box(bx-5.12,y+3,front+.2,.32,6.1,.42,[66,77,81]);
   g.box(bx+5.12,y+3,front+.2,.32,6.1,.42,[66,77,81]);
   g.box(bx,y+6.18,front+.22,11,.28,.45,[174,143,96]);
  }
 }
}

// Fase 11.23 — ocho fachadas piloto de El Carmel, con identidad de barrio.
// El conjunto es geometría estática de bajo coste; no toca calzada ni colisiones.
export const CARMEL_VISUAL_PASS_1123=Object.freeze({houses:8,shopSigns:3,street:'El Carmel · 1984'});
const SHOP_GLYPHS_1123=Object.freeze({
 A:['010','101','111','101','101'],B:['110','101','110','101','110'],E:['111','100','110','100','111'],
 I:['111','010','010','010','111'],L:['100','100','100','100','111'],Q:['010','101','101','111','011'],
 R:['110','101','110','101','101'],S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111']
});
function pixelShopName1123(g,label,x,y,z,pixel,color){
 let cursor=x;
 for(const letter of label){
  const glyph=SHOP_GLYPHS_1123[letter];if(!glyph){cursor+=pixel*4;continue;}
  for(let row=0;row<glyph.length;row++)for(let col=0;col<glyph[row].length;col++)if(glyph[row][col]==='1')
   g.box(cursor+col*pixel,y+(glyph.length-1-row)*pixel,z,pixel*.76,pixel*.76,.10,color);
  cursor+=pixel*4;
 }
}
function buildCarmelVisualPass1123(g){
 const homes=[[-110,-225,11,10,6],[-84,-225,13,10,7.2],[-58,-225,15,10,8.4],[-110,229,11,10,6],[-83,229,13,10,7.2],[72,216,15,10,8.4],[104,216,11,10,6],[210,185,15,10,8.4]];
 const plaster=[[189,160,128],[163,174,158],[198,180,145],[176,157,139]],stone=[119,106,91],iron=[61,69,67];
 homes.forEach(([x,z,w,d,h],i)=>{
  const y=cityElevation(x,z),front=z+d/2+.14,wall=plaster[i%plaster.length];
  // A distinct two-tone street-facing elevation breaks the repeated plain cube.
  g.box(x,y+.62,front+.05,w-.34,1.12,.16,i%3===0?[133,81,62]:stone);
  g.box(x,y+h*.48,front+.02,w-.7,.16,.20,[211,196,164]);
  for(const side of [-1,1]){
   g.box(x+side*(w/2-.32),y+h*.49,front+.08,.40,h-.65,.24,wall.map(v=>Math.max(0,v-24)));
   g.box(x+side*(w/2-.48),y+h+.08,z,.22,.55,d+.34,iron);
  }
  // Deep window reveals, stone sills and shutter leaves sized for a hillside home.
  for(const [windowIndex,dx] of [-1,1].entries()){
   const wx=x+dx*w*.23,wy=y+3.22,ww=1.74;
   g.box(wx,wy,front+.12,ww,1.72,.12,[49,70,76]);
   g.box(wx,wy,front+.22,.12,1.84,.20,[205,190,157]);
   for(const side of [-1,1]){
    g.box(wx+side*(ww/2+.16),wy,front+.30,.28,1.62,.28,[112,91,68]);
   }
   g.box(wx,wy-.96,front+.29,ww+.72,.18,.48,[213,197,165]);
   // Half-height flower railings alternate with a compact projecting balcony.
   if((i+windowIndex)%2===0){
    const by=wy-1.02;
    g.box(wx,by+.53,front+.82,ww+1.0,.10,.10,iron);
    for(let post=0;post<6;post++)g.box(wx-(ww+.72)/2+post*(ww+.72)/5,by+.27,front+.82,.055,.52,.055,iron);
    g.box(wx,by+.08,front+.87,1.18,.27,.42,[143,86,61]);
    g.cylinder(wx-.30,by+.22,front+.88,.19,.36,5,[75,105,67]);
    g.cylinder(wx+.25,by+.22,front+.88,.19,.36,5,[83,116,72]);
   }
  }
  // Simple panelled entrance and meter cabinet, both attached to the facade.
  const doorX=x+(i%2?-.23:.23)*w,doorY=y+1.65;
  g.box(doorX,doorY,front+.15,1.30,3.30,.18,[61,75,73]);
  g.box(doorX,doorY,front+.27,1.02,2.98,.08,i%2?[115,78,53]:[91,102,83]);
  g.box(doorX+.31,doorY,front+.33,.055,2.62,.06,[194,168,123]);
  g.box(x+w*.39,y+1.12,front+.23,.48,.86,.32,[104,116,108]);
  // Low parapet and roof service pieces define the silhouette from the road below.
  g.box(x,y+h+.39,z,w+.38,.25,d+.36,[123,108,90]);
  g.box(x+w*.28,y+h+1.12,z-d*.15,1.24,1.18,1.05,[104,112,105]);
  if(i%2===0){
   g.box(x-w*.25,y+h+1.46,z-d*.19,.12,3.1,.12,iron);
   g.box(x-w*.25,y+h+2.72,z-d*.19,2.1,.10,.12,iron);
   g.box(x-w*.25,y+h+1.95,z-d*.19,1.25,.10,.12,iron);
  }
  // Three small storefronts establish a readable human scale and 1984 street life.
  if(i===0||i===4||i===7){
   const name=i===0?'BAR':i===4?'TALLER':'QUEVIURES';
   const signW=name.length*4*.17+.55,signX=x-signW/2,signY=y+4.63;
   g.box(x,signY,front+.35,signW,.94,.20,[56,63,61]);
   g.box(x,signY,front+.48,signW-.16,.72,.08,i===4?[145,91,58]:[113,82,59]);
   pixelShopName1123(g,name,signX+.30,signY-.27,front+.55,.17,[238,215,168]);
   for(let stripe=0;stripe<6;stripe++)g.box(x-signW*.42+stripe*signW*.168,y+3.85,front+.86,signW*.164,.14,1.03,stripe%2?[198,177,135]:[104,122,101]);
   g.box(x,y+3.48,front+1.34,signW*.84,.35,.12,[88,76,62]);
  }
  // Narrow downpipe and two clothesline panels; a little irregularity humanizes the block.
  g.box(x-w*.41,y+h*.45,front+.12,.11,h*.76,.12,[93,103,94]);
  if(i===2||i===6){
   g.box(x+.1,y+5.1,front+1.68,2.8,.055,.055,[90,89,79]);
   g.box(x-.55,y+4.58,front+1.73,.82,1.02,.08,[190,177,147]);
   g.box(x+.52,y+4.72,front+1.73,.86,.76,.08,[119,145,151]);
  }
 });
}

export function buildCity(){
 const g=new Builder();buildHillside(g);buildStreets(g);buildRoadFinishes(g);buildHousing(g);buildNeighborhoodDetails(g);buildCarmelWorkshop(g);buildVerenneGarage(g);buildPeriodStreetscape(g);buildViewpoint(g);buildGuinardoGateway(g);buildGraciaGateway(g);buildEixampleGateway(g);buildPortGateway(g);buildMontjuicGateway(g);buildFacadeFinishes(g);buildCarmelGraciaArtPass(g);buildStreetArt113(g);buildAmbient114(g);buildArchitecturalPass117(g);buildFacadeMaterials118(g);buildRooftopSilhouettes1119(g);buildCarmelPanorama1120(g);buildDistrictIdentity1121(g);buildStreetLevelArt1122(g);buildCarmelVisualPass1123(g);buildStreetDetails119(g);buildSecretMarkers(g);buildContactFigures(g);return g.finish();
}

// Capture the structural boxes through the same authored builders that draw
// them. Decorative doors, windows and roof trim never become invisible walls.
// This keeps building footprints in step with future changes to the city mesh.
function collectBuildingColliders(){
 const boxes=[];
 const collector={
  box(x,y,z,w,h,d){
   if(w<9||d<9||h<3.5)return;
   boxes.push(Object.freeze({
    id:`building-${boxes.length}`,x,z,
    minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2
   }));
  },
  quad(){},tri(){},cylinder(){},ring(){},taperedBox(){}
 };
 for(const draw of [
  buildHousing,buildCarmelWorkshop,buildVerenneGarage,
  buildGuinardoGateway,buildGraciaGateway,buildEixampleGateway,
  buildPortGateway,buildMontjuicGateway,buildCarmelGraciaArtPass
 ])draw(collector);
 return Object.freeze(boxes);
}
export const CITY_BUILDING_COLLIDERS=collectBuildingColliders();
