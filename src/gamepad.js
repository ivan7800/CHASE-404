const deadZone=.24;

export function readGamepad(pads) {
  const pad=Array.from(pads??[]).find(item=>item?.connected&&item.mapping==='standard');
  if(!pad)return null;
  const pressed=index=>Boolean(pad.buttons[index]?.pressed||pad.buttons[index]?.value>.35);
  const x=pad.axes[0]??0, y=pad.axes[1]??0;
  return {
    driving:{throttle:pressed(7),brake:pressed(6),left:x < -deadZone||pressed(14),right:x > deadZone||pressed(15),handbrake:pressed(0)},
    walking:{throttle:y < -deadZone||pressed(12),brake:y > deadZone||pressed(13),left:x < -deadZone||pressed(14),right:x > deadZone||pressed(15),handbrake:pressed(0)},
    actions:{vehicle:pressed(2),camera:pressed(3),pause:pressed(9),confirm:pressed(0)}
  };
}
