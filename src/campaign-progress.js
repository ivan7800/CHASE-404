import { VALID_ROUTES } from './campaign-choice.js';
import { FINAL_CHOICES } from './final-choice.js';
/** Campaign checkpoint. A chapter becomes resumable only after the previous one is won. */
export const CAMPAIGN_PROGRESS_KEY='chase404.campaign.progress.v1';
export const freshCampaign=()=>({version:1,nextChapter:1,completed:false});

export function normalizeCampaign(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1||
    !Number.isSafeInteger(value.nextChapter)||value.nextChapter<1||value.nextChapter>15||
    typeof value.completed!=='boolean'||(value.completed&&value.nextChapter!==15))return freshCampaign();
 const progress={version:1,nextChapter:value.nextChapter,completed:value.completed};
 if(Object.hasOwn(value,'routeChoice'))progress.routeChoice=VALID_ROUTES.includes(value.routeChoice)?value.routeChoice:null;
 if(Object.hasOwn(value,'finalChoice'))progress.finalChoice=FINAL_CHOICES.includes(value.finalChoice)?value.finalChoice:null;
 return progress;
}
export function readCampaign(storage){try{return normalizeCampaign(JSON.parse(storage.getItem(CAMPAIGN_PROGRESS_KEY)));}catch{return freshCampaign();}}
export function writeCampaign(storage,progress){
 try{storage.setItem(CAMPAIGN_PROGRESS_KEY,JSON.stringify(normalizeCampaign(progress)));return true;}catch{return false;}
}
export function advanceCampaign(progress,wonChapter,choices={}){
 const current=normalizeCampaign(progress);
 if(!Number.isSafeInteger(wonChapter)||wonChapter<1||wonChapter>15||wonChapter>current.nextChapter)return current;
 const next={...current,nextChapter:Math.max(current.nextChapter,Math.min(15,wonChapter+1)),completed:current.completed||wonChapter===15};
 if(wonChapter===8&&current.nextChapter===8&&VALID_ROUTES.includes(choices.routeChoice))next.routeChoice=choices.routeChoice;
 if(wonChapter===14&&current.nextChapter===14&&FINAL_CHOICES.includes(choices.finalChoice))next.finalChoice=choices.finalChoice;
 return next;
}
