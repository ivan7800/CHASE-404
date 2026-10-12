/** Original 1970s/1980s-inspired exterior trim. Local vertex-colour geometry;
 * +Z is the front; cosmetic only, no vehicle physics or collision changes.
 */
export function addPeriodCarDetails(b, id) {
 const chrome=[205,199,176],chromeBright=[232,224,195],rubber=[25,29,34],grille=[43,51,57],
       glass=[104,156,168],amber=[241,162,54],cream=[244,227,177],red=[194,48,48],
       paintDark=[71,77,86];
 const box=(...args)=>b.box(...args);
 // Bumpers, side mirrors and windscreen surround make the silhouette readable
 // from the actual third-person chase camera.
 for(const side of [-1,1]){
  box(side*1.45,.73,4.045,.43,.20,.14,chrome);
  box(side*1.45,.73,-4.045,.43,.20,.14,chrome);
  box(side*1.72,1.50,.91,.23,.14,.38,chrome);
  box(side*1.72,1.53,.98,.18,.09,.28,glass);
  box(side*1.61,1.37,-.34,.09,.10,.43,chrome);
  box(side*1.70,.82,.15,.08,.10,4.85,rubber);
  box(side*1.65,.94,3.43,.14,.13,.18,amber);
  box(side*1.65,1.06,-3.40,.14,.13,.19,red);
 }
 // Five different original fascia and trim treatments, plus the bespoke Blaze.
 switch(id){
  case 'racer': // late-70s American stock coupe: wide rectangular fascia
   box(0,1.07,4.105,2.35,.45,.10,grille);
   for(let i=-5;i<=5;i++)box(i*.19,1.08,4.17,.055,.34,.055,chrome);
   for(const side of [-1,1]){
    box(side*1.28,1.17,4.13,.74,.29,.09,cream);
    box(side*1.28,1.02,-4.14,.81,.23,.09,red);
    box(side*1.50,.54,2.65,.12,.17,.97,chrome);
   }
   box(0,1.52,2.4,1.22,.06,2.05,chromeBright);
   break;
  case 'falcon': // blue fastback with recessed twin lights and raised deck
   box(0,1.04,4.13,2.1,.42,.13,rubber);
   for(const side of [-1,1]){
    for(const x of [0.94,1.34])box(side*x,1.12,4.21,.31,.30,.08,cream);
    box(side*1.64,1.12,-3.95,.10,.45,.27,chrome);
    box(side*1.46,1.45,-2.50,.12,.15,1.65,chrome);
   }
   for(let i=-4;i<=4;i++)box(i*.21,.99,4.23,.09,.30,.05,chrome);
   box(0,1.59,-3.79,3.0,.12,.72,chromeBright);
   break;
  case 'comet': // long-distance GT with horizontal divided taillights
   box(0,1.1,4.13,2.9,.31,.10,grille);
   for(let i=0;i<3;i++)box(0,1.0+i*.11,4.2,2.75,.028,.06,chrome);
   for(const side of [-1,1]){
    box(side*1.25,1.24,4.2,.78,.25,.065,cream);
    box(side*.92,1.0,-4.15,1.16,.22,.075,red);
    box(side*.92,1.12,-4.20,1.16,.045,.06,chrome);
    box(side*1.52,1.37,1.8,.05,.065,2.1,chrome);
   }
   break;
  case 'viper': // compact sports wedge, blacked-out grille and twin vents
   box(0,.88,4.14,2.82,.23,.13,rubber);
   for(const side of [-1,1]){
    box(side*1.15,1.19,4.17,.96,.16,.11,cream);
    box(side*1.17,1.48,2.23,.45,.05,1.24,grille);
    box(side*1.32,.66,-3.89,.73,.12,.20,chrome);
   }
   box(0,.45,4.12,3.3,.14,.27,paintDark);
   break;
  case 'nova': // 1980s rally coupe, light pods and protective rub strips
   box(0,1.06,4.13,2.36,.40,.10,grille);
   for(const x of [-.83,-.28,.28,.83])box(x,1.31,4.17,.37,.34,.16,cream);
   for(const side of [-1,1]){
    box(side*1.55,.70,2.05,.22,.25,1.12,rubber);
    box(side*1.65,.92,-2.4,.21,.34,.73,rubber);
    box(side*1.52,1.16,-3.98,.42,.21,.11,red);
   }
   box(0,2.86,-.69,1.53,.10,1.8,chromeBright);
   break;
  case 'blaze': // Verenne V8: era-correct four headlights and heavy bumpers
   for(const side of [-1,1]){
    box(side*.64,1.055,4.13,.50,.28,.09,cream);
    box(side*1.26,1.055,4.13,.50,.28,.09,cream);
    box(side*1.58,1.55,1.19,.12,.11,.47,chrome);
    box(side*1.54,1.14,-4.14,.80,.23,.06,red);
   }
   box(0,.57,4.13,3.24,.12,.19,chromeBright);
   box(0,.57,-4.13,3.24,.12,.19,chromeBright);
   break;
  default:throw new Error('Modelo de carrocería desconocido: '+id);
 }
}
