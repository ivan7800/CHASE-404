import {startMission} from './mission.js';
import {startSideRun} from './side-activities.js';

/** Activate a freshly created run, including one created by R while playing. */
export function activateUrbanRun({urbanMode,sideMode,explorationMode,mission,sideRun,damageEvents=0}){
 if(!urbanMode||explorationMode)return false;
 return sideMode?startSideRun(sideRun,damageEvents):startMission(mission);
}
