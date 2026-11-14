import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignBriefing, campaignOutcome } from '../src/campaign-story.js';
import { campaignStartPose } from '../src/campaign-start.js';
import { advanceCampaign, readCampaign, writeCampaign } from '../src/campaign-progress.js';
import { newMission, missionTarget, startMission, stepMission } from '../src/mission.js';
import { storyBeat } from '../src/story-scenes.js';

for (const finalChoice of ['RESCATAR A MI HERMANO','RECUPERAR LAS PRUEBAS']) {
 test(`decision, checkpoint and final spawn agree: ${finalChoice}`, () => {
  const mission=newMission(14);
  startMission(mission);
  const contact=missionTarget(mission);
  assert.equal(stepMission(mission,{...contact,onFoot:true},contact.hold),'checkpoint');
  const option=missionTarget(mission).alternatives.find(item=>item.name===finalChoice);
  assert.equal(stepMission(mission,option,.1),'checkpoint');
  const followUp=missionTarget(mission);
  assert.deepEqual([followUp.x,followUp.z],[option.x,option.z]);
  assert.equal(stepMission(mission,{...followUp,onFoot:true},followUp.hold),'won');

  let data=null;
  const storage={setItem:(_,value)=>{data=value;},getItem:()=>data};
  const old={version:1,nextChapter:14,completed:false,routeChoice:'CALLE DE SERVICIO'};
  assert.ok(writeCampaign(storage,advanceCampaign(old,14,mission)));
  const restored=readCampaign(storage);
  assert.deepEqual(restored,{...old,nextChapter:15,finalChoice});
  const finalMission=newMission(15,restored.routeChoice,restored.finalChoice);
  startMission(finalMission);
  const target=missionTarget(finalMission);
  const spawn=campaignStartPose(15,restored.finalChoice);
  assert.ok(Math.hypot(spawn.x-target.x,spawn.z-target.z)<75);
  assert.match(campaignBriefing(15,finalChoice),/Pau/);
  assert.match(campaignOutcome(finalMission),finalChoice==='RECUPERAR LAS PRUEBAS'?/LA VERDAD/:/LA FAMILIA/);
  assert.notEqual(storyBeat(14,1,finalChoice).text,storyBeat(14,1).text);
 });
}
test('all chapters have an opening and handoff and neither route is lost when replaying a chapter',()=>{
 for(let chapter=1;chapter<=15;chapter++){
  assert.ok(campaignBriefing(chapter).length>45);
  assert.ok(campaignOutcome({chapter}).length>45);
 }
 const progress={version:1,nextChapter:15,completed:false,routeChoice:'CALLE DE SERVICIO',finalChoice:'RECUPERAR LAS PRUEBAS'};
 assert.deepEqual(advanceCampaign(progress,14,{finalChoice:'RESCATAR A MI HERMANO'}),progress);
});
