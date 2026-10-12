/** Deterministic, low-motion NPC idle/gesture poses; no gameplay state changes. */
export function contactPose(time=0, index=0, reducedMotion=false){
 if(reducedMotion)return {bob:0,head:0,leftArm:0,rightArm:0,yaw:0};
 const t=(Number.isFinite(time)?time:0)+index*1.73;
 const breath=Math.sin(t*1.8),gesture=Math.max(0,Math.sin(t*.73+index*.9));
 return {bob:breath*.025,head:Math.sin(t*.91)*.045,
  leftArm:Math.sin(t*1.15)*.07, rightArm:Math.sin(t*1.15+1.1)*.06+gesture*.21,
  yaw:Math.sin(t*.41)*.06};
}
