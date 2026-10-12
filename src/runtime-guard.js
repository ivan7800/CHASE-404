/** Stops a failing animation loop exactly once; never hides the original error. */
export function createRuntimeGuard(onFailure){
 if(typeof onFailure!=='function')throw new TypeError('onFailure must be a function');
 let stopped=false;
 return Object.freeze({
  get stopped(){return stopped;},
  run(callback){
   if(stopped)return false;
   try{callback();return true;}catch(error){this.stop(error);return false;}
  },
  stop(error){
   if(stopped)return false;
   stopped=true;
   onFailure(error);
   return true;
  }
 });
}
