import {addPeriodCarDetails} from './vehicle-detail.js';
import {LENGTH, ROAD_HALF, SHOULDER, RADIUS, STRAIGHT_HALF, sample, localPosition, START_S, getTrack} from './track.js';
export class Builder{
 constructor(){this.positions=[];this.normals=[];this.colors=[];}
 tri(a,b,c,color){let u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];let l=Math.hypot(...n)||1;n=n.map(x=>x/l);for(const p of [a,b,c]){this.positions.push(...p);this.normals.push(...n);this.colors.push(...color);}}
 quad(a,b,c,d,col){this.tri(a,b,c,col);this.tri(a,c,d,col);}
 box(x,y,z,w,h,d,c){let X=w/2,Y=h/2,Z=d/2,pts=[[x-X,y-Y,z-Z],[x+X,y-Y,z-Z],[x+X,y+Y,z-Z],[x-X,y+Y,z-Z],[x-X,y-Y,z+Z],[x+X,y-Y,z+Z],[x+X,y+Y,z+Z],[x-X,y+Y,z+Z]];for(const ix of [[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[1,2,6,5],[0,4,7,3]])this.quad(...ix.map(i=>pts[i]),c);}
 // roof/body volumes: tapered between two horizontal rectangles
 taperedBox(cx,y0,cz,lower,upper,y1,c){let [w0,d0]=lower,[w1,d1]=upper;const p=[[cx-w0/2,y0,cz-d0/2],[cx+w0/2,y0,cz-d0/2],[cx+w0/2,y0,cz+d0/2],[cx-w0/2,y0,cz+d0/2]],q=[[cx-w1/2,y1,cz-d1/2],[cx+w1/2,y1,cz-d1/2],[cx+w1/2,y1,cz+d1/2],[cx-w1/2,y1,cz+d1/2]];this.quad(...q,c);for(let i=0;i<4;i++)this.quad(p[i],p[(i+1)%4],q[(i+1)%4],q[i],c);}
 ring(x,y,z,radius,height,sides,c){const p=[];for(let i=0;i<sides;i++){let a=i*Math.PI*2/sides;p.push([x+Math.cos(a)*radius,y,z+Math.sin(a)*radius]);}for(let i=0;i<sides;i++)this.tri([x,y+height,z],p[i],p[(i+1)%sides],c);}
 cylinder(x,y,z,r,h,sides,c){for(let i=0;i<sides;i++){const a=i*2*Math.PI/sides,b=(i+1)*2*Math.PI/sides;const q=(t,yy)=>[x+Math.cos(t)*r,yy,z+Math.sin(t)*r];this.quad(q(a,y),q(b,y),q(b,y+h),q(a,y+h),c);this.tri([x,y+h,z],q(a,y+h),q(b,y+h),c);}}
 finish(){return {positions:new Float32Array(this.positions),normals:new Float32Array(this.normals),colors:new Uint8Array(this.colors),count:this.positions.length/3};}
}
const palette={road:[63,68,79],road2:[66,73,83],apron:[173,171,151],grass:[52,110,76],grass2:[41,91,69],curbRed:[225,70,65],curbWhite:[245,240,224],white:[246,241,217],yellow:[252,206,74],concrete:[155,166,162],post:[218,226,225],night:[40,54,75],steel:[79,94,107],tribune:[51,76,91],blue:[42,113,188],sand:[197,166,117]};
const point=(s,off,y)=>{const p=sample(s);return [p.x+p.nx*off,y,p.z+p.nz*off]};
function strip(g,a,b,ya,yb,steps,col,alternate=null){for(let i=0;i<steps;i++){const s0=LENGTH*i/steps,s1=LENGTH*(i+1)/steps,c=alternate&&i%2?alternate:col;if(a<b)g.quad(point(s0,a,ya),point(s1,a,ya),point(s1,b,yb),point(s0,b,yb),c);else g.quad(point(s0,b,yb),point(s1,b,yb),point(s1,a,ya),point(s0,a,ya),c);}}
function seeded(){let n=5404;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;}}
export function buildTrack(){
 const g=new Builder(),rnd=seeded();
 g.box(0,-2,0,1100,3.5,1100,getTrack().id==='ridge'?[60,82,87]:getTrack().id==='pacific'?[109,155,113]:palette.grass2);
 // Alternate grass across outer circuit with a clean infield.
 if(getTrack().id==='sunset')g.box(0,-.15,0,145,.1,330,palette.grass);
 const steps=480;
 strip(g,-ROAD_HALF,ROAD_HALF,.065,.065,steps,palette.road,palette.road2);
 strip(g,ROAD_HALF,ROAD_HALF+SHOULDER,.04,.015,steps,palette.apron);
 strip(g,-ROAD_HALF-SHOULDER,-ROAD_HALF,.015,.04,steps,palette.apron);
 for(const side of [-1,1]){
  strip(g,side*(ROAD_HALF-0.45),side*(ROAD_HALF-.06),.08,.08,steps,palette.white);
  strip(g,side*(ROAD_HALF+1.0),side*(ROAD_HALF+2.2),.075,.075,steps,palette.curbWhite,palette.curbRed);
  // crash barrier walls following the layout
  for(let i=0;i<steps;i++){
   const s0=LENGTH*i/steps,s1=LENGTH*(i+1)/steps,d=side*(ROAD_HALF+SHOULDER+1.2);
   g.quad(point(s0,d,.22),point(s1,d,.22),point(s1,d,1.27),point(s0,d,1.27),i%22<11?palette.concrete:palette.steel);
   if(i%8===0){const p=point(s0,d,1.5);g.box(p[0],.8,p[2],.23,1.6,.23,palette.post);}
  }
 }
 // Dashed central lane and sector marking flags.
 for(let s=0;s<LENGTH;s+=13){const a=s+2,b=Math.min(s+8,LENGTH);g.quad(point(a,-.12,.093),point(a,.12,.093),point(b,.12,.093),point(b,-.12,.093),palette.white);}
 for(let j=0;j<2;j++)for(let i=0;i<12;i++){const s=START_S+j*.5,p=i/12*2*ROAD_HALF-ROAD_HALF;g.quad(point(s,p,.105),point(s,p+ROAD_HALF/6,.105),point(s+.5,p+ROAD_HALF/6,.105),point(s+.5,p,.105),(i+j)%2?palette.white:palette.road);}
 // Fase 6: consistent trackside art direction visible on every circuit.
 // Marshals, high-contrast sector gates, distant sculpture and sculpted scenery.
 const region=getTrack().id;
 const accent=region==='ridge'?[164,138,244]:region==='pacific'?[62,210,191]:[245,165,72];
 const accentDark=region==='ridge'?[73,61,117]:region==='pacific'?[28,113,125]:[118,69,42];
 const highlights=[248,232,192];
 for(let k=0;k<20;k++){
  const s=(k+.37)*LENGTH/20,side=k%2?-1:1;
  const p=point(s,side*(ROAD_HALF+SHOULDER+10),0);
  // Landmark pylon with striped illuminated mast and solar-panel-like canopy.
  g.box(p[0],5.3,p[2],1.25,10.6,1.25,[39,53,65]);
  g.box(p[0],10.7,p[2],6.8,1.3,2.7,accentDark);
  g.box(p[0],11.53,p[2],6.1,.24,2.35,accent);
  for(let stripe=0;stripe<3;stripe++)g.box(p[0],3.4+stripe*2.1,p[2]+.7,1.45,.22,.22,highlights);
  g.box(p[0],13.0,p[2],.3,2.3,.3,[173,188,188]);
  // Safety marshal box separated from the drivable shoulder.
  if(k%2===0){const b=point(s+7,side*(ROAD_HALF+SHOULDER+17),0);
   g.box(b[0],1.55,b[2],5.6,3.1,5.8,[51,69,84]);
   g.box(b[0],3.35,b[2],7.2,.5,7.3,accent);
   g.box(b[0],2.0,b[2]+3.02,4.2,1.4,.14,[158,217,225]);
  }
 }
 // Hand-built silhouette clouds; geometry is deterministic, no downloaded textures.
 for(let n=0;n<18;n++){
  const a=n*Math.PI*2/18,rr=420+(n%4)*49;
  const x=Math.sin(a)*rr,z=Math.cos(a)*rr,y=105+(n%5)*20;
  const cloud=n%3===0?[255,209,161]:[223,230,220];
  g.box(x,y,z,42,8,15,cloud);
  g.box(x-16,y+5,z-2,23,13,12,cloud);
  g.box(x+12,y+6,z+3,27,13,17,cloud);
 }
 // Grounded checkered sponsor monuments, placed far outside collision boundaries.
 for(let k=0;k<8;k++){
  const s=(k+.15)*LENGTH/8,p=point(s,-(ROAD_HALF+SHOULDER+31),0);
  g.box(p[0],1,p[2],17,2,5,[44,60,73]);
  g.box(p[0],2.2,p[2],18,1,6,accent);
  for(let j=0;j<5;j++)g.box(p[0]-7.5+j*3.5,3.06,p[2]+2.9,1.6,.6,.3,j%2?[242,239,219]:[39,51,68]);
 }
 // Starting grid: short white rectangles on either side of center lane.
 for(let i=0;i<14;i++){const s=START_S-9-i*8;for(const side of [-1,1])g.quad(point(s,side*4.8,.105),point(s,side*5.15,.105),point(s+2.5,side*5.15,.105),point(s+2.5,side*4.8,.105),palette.white);}
 if(getTrack().id!=='sunset'){buildRegion(g,rnd,getTrack().id);return g.finish();}
 // Two large grandstands, tiered and populated by color blocks.
 for(const [x,sign] of [[124,1],[-124,-1]]){
  g.box(x,4,0,31,8,171,palette.steel);
  for(let row=0;row<9;row++){
   const rx=x+sign*(row-3)*1.6,ry=8.4+row*1.25;
   g.box(rx,ry,0,30,1.1,163,row%3===0?palette.tribune:palette.concrete);
   for(let col=0;col<47;col++){
    const z=-79+col*3.45;let c=[[239,92,70],[242,195,86],[50,157,197],[226,221,208]][Math.floor(rnd()*4)];
    g.box(rx-sign*8.5,ry+1.0,z,.85,1.1,1.45,c);
   }
  }
  for(let i=0;i<6;i++)g.box(x+sign*10,15,-77+i*30,1.1,27,1.1,palette.post);
  g.box(x+sign*11,28,0,4,2,175,palette.blue);
 }
 // Gantry at the start, across the racing surface.
 const ps=sample(START_S+9),x=ps.x,z=ps.z;
 g.box(x-17,7.5,z,1,15,1,palette.steel);g.box(x+17,7.5,z,1,15,1,palette.steel);
 g.box(x,14.7,z,36,2.7,1.8,palette.night);g.box(x,14.7,z+1.1,34,1.8,.24,palette.yellow);
 for(let i=0;i<7;i++)g.box(x-13+i*4.5,12.7,z+1,1.45,1.1,.5,i%2?palette.curbRed:palette.curbWhite);
 // Place lights, billboards and trackside cone markers.
 for(let i=0;i<42;i++){
  const s=i*LENGTH/42,p=point(s,ROAD_HALF+SHOULDER+13,0);
  g.cylinder(p[0],.15,p[2],.47,15,6,palette.steel);
  g.box(p[0],15,p[2],7,1.3,1.25,palette.white);
  const p2=point(s,ROAD_HALF+SHOULDER+14,0);
  if(i%3===0){g.box(p2[0],4.9,p2[2],8.2,5.0,1.15,i%2?palette.curbRed:palette.blue);}
 }
 // Pine trees in safe infield and distant background, avoiding the road.
 for(let i=0;i<190;i++){
  let x,z,p,tries=0;do{x=(rnd()-.5)*780;z=(rnd()-.5)*790;p=nearestSimple(x,z);tries++;}while(p<35&&tries<20);
  const h=5+rnd()*12;
  g.cylinder(x,0,z,.65,h*.45,6,[101,78,59]);
  g.ring(x,h*.28,z,h*.29,h*.90,7,i%3?[41,102,74]:[53,130,86]);
  g.ring(x,h*.5,z,h*.2,h*.69,7,[48,117,81]);
 }
 // Cliff-like mountain ranges to provide depth, with simple shaded faces.
 for(let i=0;i<75;i++){
  const a=i*2*Math.PI/75,dist=430+rnd()*120,x=Math.cos(a)*dist,z=Math.sin(a)*dist,h=70+rnd()*100;
  const w=65+rnd()*100,c=i%3?[88,119,134]:[106,137,150];
  g.tri([x-w,-.4,z],[x+w,-.4,z],[x,h,z],c);
  g.tri([x,h,z],[x+w,-.4,z],[x+w*.24,h*.2,z+26],[70,105,120]);
 }
 // Pit lane, paddock, tower and identifiable architecture in the infield.
 const concrete=[126,143,140],sandstone=[202,177,135],brick=[170,80,68],roof=[39,60,76],orange=[245,166,68],pale=[230,216,186],forest=[48,115,81];
 g.box(48,.14,-10,23,.26,175,concrete);
 g.box(48,.29,-10,14,.06,164,[83,90,94]);
 for(let z=-86;z<74;z+=15){
  g.box(48,.37,z,0.4,.04,4.4,palette.white);
  g.box(59,.4,z+3,.36,.06,4.0,palette.yellow);
 }
 for(let i=0;i<11;i++){
  const z=-78+i*15;
  g.box(20,3.0,z,27,5.8,12,i%3===0?brick:concrete);
  g.box(20,6.20,z,28,1.05,13,roof);
  g.box(33.65,2.62,z,0.16,4.2,9.5,[36,48,61]);
  for(let t=0;t<5;t++)g.box(33.76,2.42,z-3.5+t*1.75,.12,2.2,.74,orange);
  g.box(20,6.85,z,3.0,.26,8,palette.yellow);
 }
 // Pit control tower, with tiered glass and an antenna.
 g.box(-7,17,0,20,34,25,roof);
 for(let h=0;h<5;h++){
  g.box(-7,7+h*5.2,12.66,18.4,3.0,.25,[49,126,155]);
  for(let t=0;t<8;t++)g.box(-15+t*2.2,7+h*5.2,12.83,.1,3.1,.3,roof);
  g.box(-7,7+h*5.2,-12.66,18.4,3,.23,[49,126,155]);
 }
 g.box(-7,35.5,0,25,3.5,30,sandstone);g.box(-7,39.4,0,12,4.5,12,roof);
 g.cylinder(-7,42,0,.45,16,8,orange);
 // Pit crew awnings, color-coded service bays, and timing beacon strips.
 for(let i=0;i<9;i++){
  let z=-69+i*17;
  g.box(36,3.62,z,10,.35,9,i%3===0?palette.curbRed:i%3===1?palette.blue:orange);
  for(let side of [-1,1])g.box(36+side*4.7,1.84,z,0.25,3.7,.25,palette.post);
 }
 // Track access bridges with truss braces near the long straights.
 for(let z of [-143,145]){
  g.box(0,11,z,180,1.8,3.8,roof);
  for(let x=-88;x<=88;x+=12){
   g.box(x,12.75,z,1.2,2.5,1.2,palette.steel);
   g.box(x,9.5,z,1.0,2.5,.9,palette.steel);
  }
  for(let x of [-91,91])g.box(x,5.7,z,2.7,11.4,2.8,palette.concrete);
  g.box(0,14.5,z,60,2,1.6,palette.blue);
  for(let x=-27;x<25;x+=6)g.box(x,14.48,z+1,3.5,.36,.16,orange);
 }
 // Branded scoring pylon (generic fictional markings).
 g.box(-40,16,30,9,32,7,roof);
 for(let j=0;j<7;j++){
  g.box(-40,28-j*3.2,33.57,7,.28,.21,orange);
  for(let k=0;k<j%3+1;k++)g.box(-42.5+k*1.5,27-j*3.2,33.60,.9,.85,.22,palette.white);
 }
 g.box(-40,33,30,14,2.3,11,orange);
 // Small maintenance and vehicle forms infield; avoid the active road.
 for(let i=0;i<17;i++){
  const z=-75+(i%9)*17,x=-27-Math.floor(i/9)*12;
  g.box(x,.8,z,2.8,1.3,5.2,i%4===0?orange:i%4===1?palette.blue:i%4===2?palette.curbRed:pale);
  g.box(x,1.55,z-.45,2.3,.35,2.0,roof);
 }
 // Flag masts, pennant rectangles and banners along the grandstand fringe.
 for(const side of [-1,1])for(let i=0;i<13;i++){
  const x=side*154,z=-90+i*15;
  g.cylinder(x,0,z,.16,13,5,palette.post);
  const c=i%3===0?palette.curbRed:i%3===1?orange:palette.blue;
  g.quad([x,12.5,z],[x+side*3.8,12.5,z],[x+side*3.8,10.2,z],[x,10.2,z],c);
 }
 // A more layered exterior: spaced palms, shrubs and ornamental island trees.
 for(let i=0;i<120;i++){
  const theta=rnd()*Math.PI*2,dist=200+rnd()*170,x=Math.cos(theta)*dist,z=Math.sin(theta)*dist;
  if(nearestSimple(x,z)<31)continue;
  const h=9+rnd()*11;
  g.cylinder(x,0,z,.30,h,7,[101,90,66]);
  for(let c=0;c<3;c++)g.ring(x,h-2+c*.9,z,2.7+c*.5,3.8-c*.7,8,c===1?[56,132,88]:forest);
 }
 // Trackside rumble and skid textures: vertex-painted road decals, no external textures.
 for(let i=0;i<120;i++){
  const s=i*LENGTH/120+3,offset=(i%4-1.5)*1.5;
  g.quad(point(s,offset,.101),point(s+.2,offset,.101),point(s+2.7,offset+.22,.101),point(s+2.6,offset+.22,.101),[57,62,70]);
 }
 g.box(-290,-.5,-310,190,.15,100,palette.sand);
 return g.finish();
}
/** Bespoke scenery for the two new layouts. Avoids stadium coordinates and road collisions. */
function buildRegion(g,rnd,id){
 const coastal=id==='pacific',white=[236,235,219],steel=[60,83,93],navy=[36,61,83],red=[224,91,76],gold=[241,187,92];
 // Roadside reflective boards and navigation lights.
 for(let i=0;i<64;i++){
  const s=LENGTH*i/64,p=point(s,ROAD_HALF+SHOULDER+7,0);
  g.box(p[0],1.55,p[2],.65,2.9,.65,steel);
  g.box(p[0],3.20,p[2],1.4,.38,1.0,i%4===0?red:white);
 }
 // Start gantry and chequered hanging markers follow road-normal, not world axes.
 const st=sample(START_S+7),cross=localPosition(START_S+7,0);
 for(const side of [-1,1]){
  const p=localPosition(START_S+7,side*17.5);
  g.cylinder(p.x,0,p.z,.7,12,8,navy);
 }
 for(let i=-8;i<=8;i++){
  const p=localPosition(START_S+7,i*2);
  g.box(p.x,12.2,p.z,2.2,1.6,1.4,i%2?gold:navy);
 }
 if(coastal){
  // Turquoise sea on western horizon. The track never traverses the water plane.
  g.box(-400,-.63,0,320,.15,1100,[56,158,182]);
  g.box(-245,-.37,0,18,.10,1040,[216,193,139]);
  for(let i=0;i<68;i++){
   const x=-265-rnd()*230,z=(rnd()-.5)*700;
   g.box(x,-.43,z,4+rnd()*13,.035,.7,[181,236,221]);
  }
  // A lighthouse, harbor control center and cottages anchor the scene.
  g.cylinder(-217,0,-180,7.5,28,12,white);
  for(let y=4;y<28;y+=6)g.cylinder(-217,y,-180,7.7,1.1,12,red);
  g.cylinder(-217,28,-180,9.5,2,12,navy);
  g.cylinder(-217,30,-180,5,4,12,gold);
  g.ring(-217,34,-180,7,5,10,red);
  for(let i=0;i<15;i++){
   const x=220+(i%3)*18,z=-175+Math.floor(i/3)*62;
   const h=7+(i%4)*2;
   g.box(x,h/2,z,12,h,13,i%3===0?[238,215,174]:i%3===1?white:[224,170,132]);
   g.box(x,h+.8,z,13,1.6,15,i%2?red:navy);
   g.box(x,h*.55,z+6.6,5.5,2.5,.16,[63,134,171]);
  }
  for(let i=0;i<135;i++){
   const x=(rnd()-.5)*820,z=(rnd()-.5)*820;
   if(x<-210||nearestSimple(x,z)<27)continue;
   const h=8+rnd()*11;
   g.cylinder(x,0,z,.48,h,7,[145,118,89]);
   for(let j=0;j<6;j++){
    const a=j*Math.PI/3,px=x+Math.cos(a)*3.5,pz=z+Math.sin(a)*3.5;
    g.tri([x,h,z],[px,h-3,pz],[x+Math.cos(a+.6)*5,h-3,z+Math.sin(a+.6)*5],[47,150,94]);
   }
  }
  // Coastal boardwalk and beach parking separated from the asphalt.
  g.box(244,.14,-1,12,.25,220,[195,163,114]);
  for(let z=-94;z<=94;z+=14)g.box(250,.5,z,3,.7,7,[65,123,139]);
 }else{
  // High-altitude violet mountains with rocky outcrops and evergreen belts.
  for(let i=0;i<100;i++){
   const a=i*2*Math.PI/100,r=345+rnd()*145,x=Math.cos(a)*r,z=Math.sin(a)*r;
   const h=85+rnd()*155,w=50+rnd()*50;
   g.tri([x-w,-.5,z],[x+w,-.5,z],[x,h,z],i%3?[90,95,139]:[127,118,158]);
   g.tri([x,h,z],[x+w,-.5,z],[x+w*.2,h*.35,z+23],[56,75,111]);
   g.tri([x-w*.32,h*.6,z],[x,h,z],[x+w*.30,h*.6,z],[218,219,226]);
  }
  const lodge=[136,92,84];
  for(let i=0;i<6;i++){
   const x=210+(i%3)*22,z=-140+Math.floor(i/3)*33;
   g.box(x,5,z,17,10,19,lodge);
   g.ring(x,10,z,15,12,4,navy);
   g.box(x,3,z+9.7,4,5,.2,gold);
  }
  // Solar-lit observation platform and a valley bridge.
  g.box(-238,7,80,35,14,27,steel);g.box(-238,15,80,43,2,34,gold);
  g.box(-238,21,80,16,10,18,navy);g.box(-238,21,90,12,4,.3,[117,170,197]);
  for(let i=0;i<165;i++){
   const x=(rnd()-.5)*830,z=(rnd()-.5)*830;
   if(nearestSimple(x,z)<29)continue;
   const h=7+rnd()*18;
   g.cylinder(x,0,z,.55,h*.4,6,[93,77,68]);
   g.ring(x,h*.2,z,3.5,h*.75,7,i%3?[50,94,93]:[65,110,107]);
   g.ring(x,h*.48,z,2.5,h*.56,7,[47,82,86]);
  }
  for(let i=0;i<34;i++){
   const p=point(i*LENGTH/34,-ROAD_HALF-SHOULDER-23,0);
   g.box(p[0],1.1,p[2],9,2.2,6,[108,102,116]);
  }
 }
}
function nearestSimple(x,z){let best=1e8;for(let j=0;j<90;j++){const s=LENGTH*j/90,p=sample(s);best=Math.min(best,Math.hypot(x-p.x,z-p.z));}return best;}
export function buildCar(spec=null){
 const b=new Builder();const red=spec?.color||[235,63,63],redDeep=red.map(v=>Math.round(v*.66)),white=spec?.accent||[251,245,231],dark=[29,42,59],glass=[75,161,184],metal=[112,124,142],yellow=[254,209,82];
 // +Z is the nose; exaggerated stock car proportions.
 b.taperedBox(0,.52,0,[3.35,7.8],[3.05,7.28],1.37,red);
 b.box(0,.50,3.56,3.03,.27,.22,dark);
 b.box(0,.57,-3.70,3.0,.29,.29,dark);
 b.taperedBox(0,1.36,-.6,[2.8,3.76],[2.20,2.28],2.54,redDeep);
 // Windshield front, rear and side windows.
 b.quad([-1.08,2.55,.52],[1.08,2.55,.52],[1.35,1.44,1.22],[-1.35,1.44,1.22],glass);
 b.quad([-.95,2.55,-1.78],[.95,2.55,-1.78],[1.23,1.46,-2.47],[-1.23,1.46,-2.47],glass);
 for(const side of [-1,1])b.quad([side*1.12,2.47,.27],[side*1.14,2.47,-1.57],[side*1.34,1.47,-2.32],[side*1.37,1.47,.93],dark);
 // Two long stripes on hood and roof.
 for(const side of [-1,1]){
  b.quad([side*.52,1.42,1.23],[side*.83,1.42,1.23],[side*.83,1.42,3.55],[side*.52,1.42,3.55],white);
  b.quad([side*.42,2.56,.46],[side*.69,2.56,.46],[side*.69,2.56,-1.56],[side*.42,2.56,-1.56],white);
 }
 // Rear spoiler, supports, lights and front grille.
 b.box(0,1.6,-3.75,3.47,.28,.7,dark);
 for(let side of [-1,1]){b.box(side*1.15,1.40,-3.62,.17,.74,.18,metal);b.box(side*1.21,1.09,3.6,.8,.32,.09,yellow);b.box(side*1.21,.91,-3.93,.85,.22,.1,redDeep);}
 b.box(0,.94,3.91,1.40,.25,.08,dark);
 b.box(0,1.05,-3.94,1.0,.18,.08,white);
 // Six deliberately differentiated silhouette kits, rather than six colour swaps.
 switch(spec?.body){
  case 'coupe':b.box(0,.38,4.02,3.2,.18,.95,dark);b.box(0,1.5,-3.85,3.9,.23,.55,white);break;
  case 'gt':b.box(0,1.56,-3.86,4.1,.32,1.1,dark);b.box(0,1.62,2.95,1.25,.23,1.0,redDeep);break;
  case 'sport':for(const side of [-1,1]){b.box(side*1.55,.62,1.35,.35,.65,2.0,white);b.box(side*1.38,1.9,-3.7,.14,.9,.5,dark);}break;
  case 'rally':b.box(0,2.80,-.7,2.0,.22,2.1,dark);for(const x of [-1.3,1.3])b.box(x,2.66,-.7,.15,.4,3.6,white);break;
  case 'muscle':b.box(0,1.73,2.45,1.45,.58,1.7,redDeep);b.box(0,.45,4.0,3.4,.42,.45,dark);break;
 }
 // Fase 6 silhouette detailing: split front air intakes, riveted diffuser and
 // layered team-livery panels. Kept as locally generated vertex-color geometry.
 const carbon=[24,32,40],silver=[176,184,184],brakelight=[246,81,65],marker=[244,193,74];
 b.box(0,.51,3.91,2.42,.32,.12,carbon);
 for(const side of [-1,1]){
  b.box(side*1.10,.46,3.97,.64,.15,.17,silver);
  b.box(side*1.14,.98,3.87,.80,.11,.15,marker);
  b.box(side*1.19,1.00,-3.91,.76,.17,.15,brakelight);
  // Side skirt has a dark undercut and contrast strip.
  b.box(side*1.65,.54,.10,.1,.19,4.10,carbon);
  b.box(side*1.69,.68,.10,.07,.055,3.75,white);
  b.box(side*1.70,1.16,-.66,.04,.44,1.55,white);
  b.box(side*1.73,1.17,-.66,.055,.20,.86,redDeep);
  // Hood vents and aerodynamic endplates readable at chase-camera distance.
  b.box(side*.88,1.445,2.22,.60,.045,.75,carbon);
  b.box(side*1.74,1.64,-3.72,.14,.63,.7,dark);
  b.box(side*.82,.54,-3.97,.58,.26,.12,carbon);
 }
 for(let i=-2;i<=2;i++)b.box(i*.22,.66,3.98,.08,.25,.14,silver);
 b.box(0,.68,-4.0,1.56,.25,.11,carbon);
 // Five individually modelled grille fins / exposed rear cooling slots.
 for(let i=-2;i<=2;i++){
  b.box(i*.25,.54,4.065,.07,.23,.08,silver);
  b.box(i*.26,1.03,-3.995,.07,.12,.08,silver);
 }
 // Glass bumper details, hood vent, door handles.
 b.box(0,1.4,2.70,1.05,.05,.45,dark);
 for(const side of [-1,1])b.box(side*1.56,1.38,-.35,.045,.09,.45,metal);
 addPeriodCarDetails(b,spec?.id||'racer');
 return b.finish();
}
export function buildWheels(){
 const b=new Builder();const black=[26,34,42],rubber=[40,45,50],hub=[180,193,195];
 for(const x of [-1.62,1.62])for(const z of [-2.45,2.35]){
  const side=Math.sign(x),r=.65,w=.46;
  for(let i=0;i<12;i++){const a=i*Math.PI/6,c=(i+1)*Math.PI/6,y0=.76;
   const p=(xx,angle)=>[xx,y0+Math.cos(angle)*r,z+Math.sin(angle)*r];
   b.quad(p(x-w*side/2,a),p(x-w*side/2,c),p(x+w*side/2,c),p(x+w*side/2,a),rubber);
   b.tri([x+w*side/2,y0,z],p(x+w*side/2,a),p(x+w*side/2,c),black);
  }
  // Hub cap visible on both sides.
  b.box(x+side*.25,.76,z,.07,.53,.53,hub);
 }
 return b.finish();
}
export function buildCarShadow(){const b=new Builder();const col=[36,54,47];for(let i=0;i<20;i++){const a=i*Math.PI/10,c=(i+1)*Math.PI/10;b.tri([0,.06,0],[Math.cos(a)*2.23,.06,Math.sin(a)*4.25],[Math.cos(c)*2.23,.06,Math.sin(c)*4.25],col);}return b.finish();}

/** Individual axle-axis X wheel, centered at origin, rotated independently by the renderer. */
export function buildWheel(){
 const b=new Builder(),tire=[24,29,36],sidewall=[36,43,47],hub=[160,182,189],spoke=[223,224,211],bolt=[69,88,97];
 const r=.67,half=.32,N=20,cy=0;
 for(let i=0;i<N;i++){
  const a=i*2*Math.PI/N,z=(i+1)*2*Math.PI/N;
  const ring=(x,angle,rad)=>[x,Math.cos(angle)*rad,Math.sin(angle)*rad];
  b.quad(ring(-half,a,r),ring(-half,z,r),ring(half,z,r),ring(half,a,r),i%2?sidewall:tire);
  // Shallow tread shoulder and raised sidewall bead, visible from chase camera.
  b.quad(ring(-half,a,.655),ring(-half,z,.655),ring(half,z,.655),ring(half,a,.655),i%3===0?[46,48,49]:tire);
  for(const side of [-1,1]){
   b.quad(ring(side*half,a,.61),ring(side*half,z,.61),ring(side*(half+.012),z,.39),ring(side*(half+.012),a,.39),sidewall);
   b.quad(ring(side*(half+.015),a,.56),ring(side*(half+.015),z,.56),ring(side*(half+.024),z,.51),ring(side*(half+.024),a,.51),[77,83,79]);
   b.tri([side*(half+.016),0,0],ring(side*(half+.016),a,.36),ring(side*(half+.016),z,.36),hub);
  }
 }
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3;
  for(const side of [-1,1]){
   const p=(rad,off)=>[side*(half+.025),Math.cos(a+off)*rad,Math.sin(a+off)*rad];
   b.quad(p(.13,-.15),p(.37,-.09),p(.37,.09),p(.13,.15),spoke);
  }
 }
 for(let side of [-1,1])b.box(side*(half+.04),0,0,.036,.13,.13,bolt);
 return b.finish();
}
