import {addPeriodCarDetails} from './vehicle-detail.js';
/** CHASE 404 — Verenne V8 1984. Original silhouette, mesh designed for GLB WebGL1. */
import {Builder} from './geometry.js';
export function buildVerenneV8(){
 const b=new Builder(),paint=[118,36,38],light=[169,60,57],shade=[76,24,30],chrome=[201,198,178],dark=[20,25,31],glass=[59,105,120],windowShade=[30,62,76],amber=[250,168,58],red=[198,38,32],ivory=[242,222,169];
 // +Z nose; wheelbase and footprint align with game vehicle physics.
 b.taperedBox(0,.63,0,[3.42,7.75],[3.2,7.57],1.33,paint);
 b.box(0,.36,0,3.18,.22,7.55,dark);
 // Long hood and separate rear deck with subtle crown.
 b.taperedBox(0,1.34,2.16,[3.12,3.38],[2.94,3.2],1.48,light);
 b.taperedBox(0,1.35,-3.01,[3.12,1.67],[3.0,1.59],1.47,light);
 // Coupe greenhouse with swept windshield and tall rear sail panels.
 b.taperedBox(0,1.37,-.68,[2.86,3.72],[2.24,2.37],2.53,shade);
 b.quad([-1.10,2.54,.47],[1.10,2.54,.47],[1.39,1.48,1.24],[-1.39,1.48,1.24],glass);
 b.quad([-1.10,2.54,-1.82],[1.10,2.54,-1.82],[1.34,1.49,-2.55],[-1.34,1.49,-2.55],glass);
 for(const s of [-1,1]){
  // Two side windows and the B-pillar: darker surrounds give readability from behind.
  b.quad([s*1.17,2.48,.30],[s*1.20,2.48,-.67],[s*1.41,1.53,-.67],[s*1.42,1.53,.96],glass);
  b.quad([s*1.20,2.48,-.78],[s*1.16,2.48,-1.67],[s*1.35,1.53,-2.35],[s*1.40,1.53,-.78],windowShade);
  b.box(s*1.44,1.45,-.53,.11,.07,.55,chrome);
  b.box(s*1.55,1.43,-.25,.11,.11,.33,chrome); // handle
  b.box(s*1.65,1.77,.88,.16,.13,.27,dark); // mirrors
  b.box(s*1.75,.67,0,.13,.17,5.8,shade); // rocker trim
  b.box(s*1.7,.77,.05,.12,.065,5.8,chrome);
  b.box(s*1.34,1.38,2.52,.08,.08,2.15,chrome); // hood perimeter
  b.box(s*1.45,1.31,-3.0,.09,.07,1.19,chrome);
  b.box(s*1.52,1.01,3.75,.38,.40,.13,chrome); // corner bumper
  b.box(s*1.52,.93,-3.78,.35,.29,.16,chrome);
  b.box(s*1.24,1.03,3.87,.69,.33,.12,ivory); // quad headlamps
  b.box(s*.65,1.03,3.88,.58,.31,.11,ivory);
  b.box(s*1.15,1.04,-3.84,.82,.27,.11,red);
  b.box(s*.41,1.04,-3.85,.58,.27,.11,red);
  b.box(s*1.52,.83,3.92,.23,.12,.10,amber);
  b.box(s*1.52,1.17,-3.89,.22,.12,.11,amber);
  b.box(s*1.10,.66,3.97,.33,.1,.13,dark);
  b.box(s*1.03,1.08,2.7,.51,.04,.91,shade); // louvers
 }
 // Deep front grille, horizontal billet strips and chrome bumper.
 b.box(0,1.01,3.87,.75,.42,.14,dark);
 for(let k=0;k<5;k++)b.box(0,.85+k*.077,3.95,.68,.024,.065,chrome);
 b.box(0,.62,3.98,3.45,.16,.25,chrome);
 b.box(0,.55,-3.99,3.45,.17,.25,chrome);
 b.box(0,.93,-3.87,.18,.31,.13,chrome);
 // Sculpted hood scoop and side shaker intake.
 b.taperedBox(0,1.49,2.05,[1.04,1.38],[.85,1.14],1.67,shade);
 b.box(0,1.65,2.64,.68,.19,.12,dark);
 for(const s of [-1,1]){
  // Wheel lips read clearly, while separately-rendered rotating wheels remain intact.
  for(const z of [-2.42,2.37]){
   b.box(s*1.70,1.43,z, .12,.11,1.38,chrome);
   b.box(s*1.74,.93,z+(.82),.10,.38,.095,shade);
   b.box(s*1.74,.93,z-(.82),.10,.38,.095,shade);
  }
  // Rear ventilation and roof-side rain channels.
  for(let k=0;k<3;k++)b.box(s*1.44,1.33,-2.78+k*.17,.09,.21,.055,dark);
 }
 // Period cabin accents visible through the windows in top-down camera.
 b.box(0,1.56,-.14,2.35,.14,.30,dark); // dashboard
 b.box(0,1.72,-.42,.57,.16,.48,chrome);
 b.box(0,1.60,-1.32,2.3,.24,.32,dark);
 b.box(0,1.82,-3.80,1.30,.06,.10,chrome); // trunk badge strip
 // Period-accurate tiny forms that catch light at arcade camera distances.
 for(const side of [-1,1]){
  b.box(side*1.37,2.48,-.54,.08,.05,2.15,chrome); // polished rain gutter
  b.box(side*1.22,.92,-3.99,.35,.15,.09,red); // rear bumper reflector
  b.box(side*.84,1.52,1.5,.75,.035,1.18,light); // stamped bonnet crease
  b.box(side*1.65,.56,-2.55,.15,.12,.38,shade); // rear wheel splash detail
  b.box(side*1.61,.56,2.44,.14,.12,.38,shade);
 }
 b.box(0,1.39,3.92,1.15,.055,.07,chrome); // hood trim
 b.box(0,1.43,-3.84,1.15,.055,.06,chrome); // trunk trim
 b.box(0,1.0,-4.035,.91,.24,.04,[227,214,183]); // registration plate
 b.box(0,.95,4.08,.91,.24,.04,[227,214,183]);
 addPeriodCarDetails(b,'blaze');
 return b.finish();
}
