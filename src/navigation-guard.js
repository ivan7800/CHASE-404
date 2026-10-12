/** Keyboard shortcuts must not leak through overlays, pause, or focused UI controls. */
export function shortcutAllowed(code,{paused=false,helpOpen=false,started=false,focusedControl=false}={}){
 if(helpOpen)return code==='KeyH'||code==='Escape'||code==='KeyP';
 if(focusedControl)return false;
 if(paused)return code==='Escape'||code==='KeyP'||code==='KeyO'||code==='KeyH';
 if(!started)return code==='Escape'||code==='KeyP'||code==='KeyO'||code==='KeyH';
 return true;
}
