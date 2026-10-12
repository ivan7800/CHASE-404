/** Validated, versioned decision for the last mission. */
export const FINAL_CHOICE_KEY='chase404.campaign.final-choice.v1';
export const FINAL_CHOICES=Object.freeze(['RESCATAR A MI HERMANO','RECUPERAR LAS PRUEBAS']);
export function readFinalChoice(storage){try{const item=JSON.parse(storage.getItem(FINAL_CHOICE_KEY));return item?.version===1&&FINAL_CHOICES.includes(item.choice)?item.choice:null;}catch{return null;}}
export function writeFinalChoice(storage,choice){if(!FINAL_CHOICES.includes(choice))return false;try{storage.setItem(FINAL_CHOICE_KEY,JSON.stringify({version:1,choice}));return true;}catch{return false;}}
