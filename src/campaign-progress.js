/** Campaign checkpoint. A chapter becomes resumable only after the previous one is won. */
export const CAMPAIGN_PROGRESS_KEY='chase404.campaign.progress.v1';
export const freshCampaign=()=>({version:1,nextChapter:1,completed:false});

export function normalizeCampaign(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1||
    !Number.isSafeInteger(value.nextChapter)||value.nextChapter<1||value.nextChapter>15||
    typeof value.completed!=='boolean'||(value.completed&&value.nextChapter!==15))return freshCampaign();
 return {version:1,nextChapter:value.nextChapter,completed:value.completed};
}
export function readCampaign(storage){try{return normalizeCampaign(JSON.parse(storage.getItem(CAMPAIGN_PROGRESS_KEY)));}catch{return freshCampaign();}}
export function writeCampaign(storage,progress){
 try{storage.setItem(CAMPAIGN_PROGRESS_KEY,JSON.stringify(normalizeCampaign(progress)));return true;}catch{return false;}
}
export function advanceCampaign(progress,wonChapter){
 const current=normalizeCampaign(progress);
 if(!Number.isSafeInteger(wonChapter)||wonChapter<1||wonChapter>15||wonChapter>current.nextChapter)return current;
 return {version:1,nextChapter:Math.max(current.nextChapter,Math.min(15,wonChapter+1)),completed:current.completed||wonChapter===15};
}
