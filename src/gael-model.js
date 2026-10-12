/** Procedural, local-first hero mesh. Units match the established on-foot rig. */
import {Builder} from './geometry.js';
export const GAEL_RIG=Object.freeze({hipX:.18,hipY:.57,shoulderX:.43,shoulderY:1.43});
// Closed, faceted elliptical lofts avoid the rectangular head and tube silhouettes.
// Each section is [height, halfWidth, halfDepth, depthOffset].
export function facetedLoft(mesh,sections,sides,color){
 if(!Number.isInteger(sides)||sides<6||sections.length<2)throw Error('Invalid character loft');
 const rings=sections.map(([y,rx,rz,cz=0])=>Array.from({length:sides},(_,i)=>{
  const a=(i+.5)*2*Math.PI/sides;
  return [Math.cos(a)*rx,y,Math.sin(a)*rz+cz];
 }));
 // Faces are consistently wound so the shader receives usable normals.
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<sides;i++){
  const n=(i+1)%sides;
  mesh.quad(rings[j][i],rings[j+1][i],rings[j+1][n],rings[j][n],color);
 }
 const lower=rings[0],upper=rings.at(-1);
 for(let i=1;i<sides-1;i++){
  mesh.tri(lower[0],lower[i+1],lower[i],color);
  mesh.tri(upper[0],upper[i],upper[i+1],color);
 }
}

export function buildGaelMeshes(){
 const torso=new Builder(),detail=new Builder(),leg=new Builder(),arm=new Builder(),shin=new Builder(),forearm=new Builder();
 const coat=[49,62,77],coatDark=[31,43,57],seams=[86,96,104],denim=[42,50,65],skin=[185,142,111],hair=[36,31,29],shoe=[29,27,27];
 // Tailored, faceted coat shell, with a slimmer midsection and sloped shoulders.
 // Kept at the exact established animation pivots and overall character height.
 facetedLoft(torso,[[.71,.245,.18],[.79,.285,.205],[1.02,.265,.205],
   [1.27,.342,.235],[1.43,.375,.235],[1.54,.305,.205],[1.60,.225,.18]],12,coat);
 // Layered waistcoat and shirt remain readable from three-quarter camera angles.
 facetedLoft(torso,[[.63,.25,.172],[.75,.248,.175],[.85,.23,.17]],10,coatDark);
 torso.box(0,.65,0,.48,.12,.32,denim);
 // Eight-sided, cheek-and-jaw silhouette; the hairline has its own shaped loft.
 facetedLoft(torso,[[1.585,.135,.13,-.015],[1.66,.175,.15,-.015],[1.73,.20,.16,-.015],
   [1.84,.205,.173,-.015],[1.96,.185,.161,-.01],[2.005,.158,.142,-.01]],10,skin);
 facetedLoft(torso,[[1.96,.195,.175,-.004],[2.025,.205,.179,-.003],
   [2.10,.175,.15,.014],[2.125,.085,.10,.02]],10,hair);
 // Slim, angled panels soften the previously block-like jacket silhouette.
 for(const side of [-1,1]){
  detail.taperedBox(side*.275,1.08,-.105,[.18,.20],[.235,.235],1.40,coatDark);
  // Raised shoulder seam and narrow textured cuff rather than broad block pads.
  detail.box(side*.31,1.466,-.03,.18,.055,.21,seams);
  detail.box(side*.18,.79,-.207,.13,.035,.025,seams);
 }
 // Higher collar surrounds the neck instead of sitting as a flat rectangle.
 facetedLoft(detail,[[1.50,.18,.16],[1.57,.19,.17],[1.62,.147,.14]],10,coatDark);
 // Nape and neckline break up the silhouette at the collar.
 detail.box(0,1.585,.148,.19,.13,.085,skin);
 // Side-parted 1980s hairstyle and sideburns.
 detail.box(-.09,2.078,-.165,.17,.045,.048,hair);
 detail.box(.164,1.95,-.130,.042,.13,.054,hair);
 for(const s of [-1,1]){
  detail.box(s*.099,1.822,-.177,.070,.018,.015,hair); // brow
  detail.box(s*.099,1.791,-.186,.039,.018,.012,[66,53,45]); // eyes
  detail.box(s*.203,1.80,-.014,.047,.092,.076,skin); // ears
  detail.box(s*.20,.98,-.205,.115,.19,.045,coatDark); // pockets
  detail.box(s*.28,1.26,-.243,.13,.45,.045,coatDark); // jacket lapels
  detail.box(s*.31,1.16,-.271,.035,.08,.02,seams); // buttons
  detail.box(s*.22,.76,-.205,.15,.045,.04,seams); // hem stitching
 }
 detail.box(0,1.31,-.254,.16,.48,.03,[180,174,151]); // pale shirt
 detail.box(0,1.46,-.279,.10,.18,.028,[104,53,55]); // muted burgundy neckwear
 detail.box(0,.59,-.207,.51,.08,.035,shoe);detail.box(0,.59,-.231,.09,.085,.02,[181,148,91]);
 // Facial landmarks layered against the faceted skull, not a flat painted mask.
 detail.taperedBox(0,1.744,-.203,[.042,.045],[.07,.085],1.811,[169,119,92]); // nose bridge
 detail.box(0,1.702,-.251,.092,.045,.052,[175,124,96]); // nose tip
 detail.box(0,1.664,-.186,.105,.018,.021,[117,79,68]); // mouth
 detail.box(0,1.627,-.151,.115,.024,.028,[159,110,88]); // chin
 for(const side of [-1,1]){
  detail.box(side*.155,1.735,-.148,.052,.068,.040,[184,136,108]); // cheek planes
  detail.box(side*.111,1.775,-.195,.044,.018,.018,[48,44,42]); // dark pupils
 }

 // Hinged limbs retain the original pivot positions, with tapered fabric.
 // Two-segment limbs. The lower parts rotate about knees/elbows rather than
 // around the shoulder/hip, keeping the planted silhouette more believable.
 facetedLoft(leg,[[-.32,.135,.151,0],[-.18,.143,.16,0],[0,.145,.17,0]],8,denim);
 leg.box(.128,-.25,.013,.017,.13,.025,[66,73,87]);
 facetedLoft(shin,[[-.33,.115,.127,.005],[-.20,.128,.145,.003],[-.03,.135,.151,0],[0,.135,.151,0]],8,denim);
 shin.box(0,-.10,-.144,.17,.02,.015,[55,62,75]);
 // Separate heel, toe and sole create a readable shoe profile in side view.
 shin.box(0,-.369,.034,.245,.137,.275,shoe); // heel body
 shin.taperedBox(0,-.363,-.173,[.245,.105],[.215,.080],-.32,shoe); // tapered toe box
 shin.box(0,-.438,-.074,.268,.035,.451,[48,43,40]); // outer sole
 shin.box(0,-.331,-.226,.205,.025,.027,[94,84,75]); // toe seam

 facetedLoft(arm,[[-.31,.115,.13,0],[-.15,.138,.145,0],[.015,.151,.155,0]],8,coat);
 facetedLoft(forearm,[[-.31,.093,.107,0],[-.15,.105,.119,0],[0,.115,.13,0]],8,coat);
 forearm.box(0,-.24,-.113,.15,.055,.018,seams);
 forearm.box(0,-.30,-.01,.20,.11,.245,coatDark);
 // Faceted palm with visible knuckles and thumb, without changing the elbow pivot.
 facetedLoft(forearm,[[-.415,.080,.075],[-.366,.092,.083],[-.322,.090,.080]],8,skin);
 forearm.box(.087,-.359,-.023,.044,.105,.065,skin); // thumb
 for(let i=0;i<3;i++)forearm.box((i-1)*.047,-.441,-.048,.034,.066,.045,[175,129,99]);


 return {body:torso.finish(),detail:detail.finish(),leg:leg.finish(),arm:arm.finish(),shin:shin.finish(),forearm:forearm.finish()};
}

/** Phase-driven procedural skeletal pose. Radians; deterministic and neutral at rest. */
export function gaelGaitPose({moving=false,running=false,phase=0}={}){
 if(!moving||!Number.isFinite(phase))return {legs:[0,0],arms:[0,0],knees:[0,0],elbows:[0,0],bounce:0,lean:0};
 const stride=running?.66:.43;
 const wave=Math.sin(phase), counter=Math.sin(phase*2);
 const legs=[-wave*stride,wave*stride];
 const arms=[wave*stride*.69,-wave*stride*.69];
 // Bend only during the recovery phase of each leg; never hyperextend backward.
 const knees=[Math.max(0,wave)*(running?.57:.36),Math.max(0,-wave)*(running?.57:.36)];
 const elbows=[.13+Math.max(0,-wave)*(running?.30:.12),.13+Math.max(0,wave)*(running?.30:.12)];
 return {legs,arms,knees,elbows,bounce:(1-Math.cos(phase*2))*(running?.025:.012),lean:running?-.075:-.022};
}

/** Interpolate limb angles and stance without touching pedestrian movement physics. */
export function blendGaelPose(previous,target,alpha){
 const t=Math.max(0,Math.min(1,Number.isFinite(alpha)?alpha:0));
 if(!previous)return target;
 const blend=(a,b)=>a+(b-a)*t;
 return {
  legs:previous.legs.map((v,i)=>blend(v,target.legs[i])),
  arms:previous.arms.map((v,i)=>blend(v,target.arms[i])),
  knees:previous.knees.map((v,i)=>blend(v,target.knees[i])),
  elbows:previous.elbows.map((v,i)=>blend(v,target.elbows[i])),
  bounce:blend(previous.bounce,target.bounce),lean:blend(previous.lean,target.lean)
 };
}
