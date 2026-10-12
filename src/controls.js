/** Unified keyboard + pointer controls. Multiple physical sources may hold one action. */
export const ACTIONS=Object.freeze(['throttle','brake','left','right','handbrake']);
export class Controls {
 constructor(resolve){this.resolve=resolve;this.keys=new Set();this.pointers=new Map();}
 keyDown(code){if(this.resolve(code))this.keys.add(code);}
 keyUp(code){this.keys.delete(code);}
 pointerDown(id,action){if(ACTIONS.includes(action))this.pointers.set(id,action);}
 pointerUp(id){this.pointers.delete(id);}
 clear(){this.keys.clear();this.pointers.clear();}
 snapshot(){const pressed=new Set(this.pointers.values());for(const code of this.keys){const action=this.resolve(code);if(action)pressed.add(action);}return Object.fromEntries(ACTIONS.map(a=>[a,pressed.has(a)]));}
}
