/** Keep the final choice intact while advancing directly from mission 14 to 15,
 * even if persistent storage is unavailable (private mode / quota errors).
 */
import {FINAL_CHOICES} from './final-choice.js';
export function finalChoiceForNextMission(sessionChoice,storedChoice){
 return FINAL_CHOICES.includes(sessionChoice)?sessionChoice:FINAL_CHOICES.includes(storedChoice)?storedChoice:null;
}
export function rememberFinalChoice(currentChoice,mission){
 return mission?.chapter===14&&mission.phase==='won'&&FINAL_CHOICES.includes(mission.finalChoice)?mission.finalChoice:currentChoice;
}
