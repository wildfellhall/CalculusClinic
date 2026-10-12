import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeScoringPreferences,combinedScore,SCORE_POLICY,cameraContribution,combinedExplanation} from '../src/score-policy.mjs';
import {observationStats,selfReport} from '../src/observations.mjs';
import {ExpressionSummary,EXPRESSION_LABELS} from '../src/expressions.mjs';
import {graphViewProgress,graphExportLegend} from '../src/graph-views.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {validateAttempts} from '../src/core.mjs';
import {concepts,relationships} from '../data/curriculum.mjs';
import {questions} from '../data/questions.mjs';
const enabled={includeSelfReports:true};
const items=questions.filter(q=>q.conceptId==='1.11');
const report=(intensity=5,valence='unpleasant')=>selfReport({emotion:'fear',intensity,valence});
const answer=(i,r)=>({id:'score-'+i,conceptId:'1.11',questionId:items[i].id,bankVersion:items[i].version,choiceId:items[i].correctOptionId,correct:true,answeredAt:new Date(Date.UTC(2026,9,12,12,i)).toISOString(),sessionId:'scoring',durationMs:600000,...(r?{selfReport:r}:{})});
const camera=()=>{const s=new ExpressionSummary('test');const p=Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k==='fearful'?1:0]));for(let i=0;i<4;i++)s.add(p,100,i*200);return s.finish();};

test('Self-report contribution defaults off and only an explicit boolean enables it',()=>{
  for(const value of [undefined,null,{},true,{includeSelfReports:'true'},{includeSelfReports:1}])assert.deepEqual(normalizeScoringPreferences(value),{includeSelfReports:false});
  assert.deepEqual(normalizeScoringPreferences({...enabled,weight:1}),enabled);
});
test('Default scoring is unchanged; enabled check-ins add at most two percent of earned credit',()=>{
  const x={negativeScore:100,excessMovementScore:100},reports={checkIns:1,unpleasantStrength:1};
  assert.equal(combinedScore(.8,x,reports).adjustedScore,.64);
  const s=combinedScore(.8,x,reports,enabled);
  assert.equal(s.cameraAdjustment,.2);assert.equal(s.selfReportAdjustment,.02);assert.equal(s.totalAdjustment,.22);assert.equal(s.adjustedScore,.624);
  assert.equal(s.cameraAdjustedScore,.64);assert.equal(combinedScore(0,x,reports,enabled).adjustedScore,0);
  assert.equal(combinedScore(null,x,reports,enabled).adjustedScore,null);
});
test('Contribution uses unpleasant intensity from valid check-ins and includes saved retries equally',()=>{
  const attempts=[answer(0,report(5)),answer(1,report(5,'pleasant')),answer(2,report(3,'neutral'))];
  const o=observationStats(attempts,'1.11');assert.equal(o.checkIns,3);assert.equal(o.unpleasantStrength,.3333);
  const s=combinedScore(.8,null,o,enabled);assert.ok(Math.abs(s.selfReportAdjustment-.02/3)<.000001);
  assert.equal(observationStats([answer(0,report(3))],'1.11').unpleasantStrength,.6);
  assert.equal(observationStats([answer(0,{...report(),source:'camera-expression'}),answer(1,{...report(),intensity:0})],'1.11').checkIns,0);
});
test('Skipped, missing, pleasant and neutral check-ins never add a reduction or create camera evidence',()=>{
  for(const attempts of [[],[answer(0)],[answer(0,report(5,'pleasant'))],[answer(0,report(5,'neutral'))]]){
    const s=combinedScore(.8,null,observationStats(attempts,'1.11'),enabled);assert.equal(s.adjustedScore,.8);assert.equal(s.selfReportAdjustment,0);
  }
  const s=combinedScore(.8,null,observationStats([answer(0,report())],'1.11'),enabled);assert.equal(s.adjustedScore,.784);
});
test('Imported sentiment and cached camera penalties cannot override recomputed scoring',()=>{
  const attempts=validateAttempts([{...answer(0,{...report(4),sentimentScore:100}),facialExpression:{...camera(),adjustment:0}}],questions);
  const d=diagnosticState({concepts,relationships,questions,attempts});
  const v=graphViewProgress(d.nodes,attempts,'combined',enabled).get('1.11').display;
  assert.equal(v.scoring.cameraAdjustment,.2);assert.equal(v.scoring.selfReportAdjustment,.016);assert.equal(v.score,.0784);
});
test('Enabling check-ins changes only combined fill and preserves answers, mastery and diagnostic routing',()=>{
  const attempts=items.map((_,i)=>({...answer(i,report()),facialExpression:camera()}));
  const d=diagnosticState({concepts,relationships,questions,attempts}),before=structuredClone(d),records=structuredClone(attempts);
  for(const mode of ['accuracy','movement'])assert.equal(graphViewProgress(d.nodes,attempts,mode,enabled).get('1.11').display.score,graphViewProgress(d.nodes,attempts,mode).get('1.11').display.score);
  const on=graphViewProgress(d.nodes,attempts,'combined',enabled).get('1.11'),off=graphViewProgress(d.nodes,attempts,'combined').get('1.11');
  assert.equal(on.display.score,.78);assert.equal(off.display.score,.8);assert.equal(on.status,'passed');assert.equal(on.masteryScore,.97);
  assert.deepEqual(d,before);assert.deepEqual(attempts,records);
});
test('Check-ins alone can adjust the combined view while camera-only fill remains missing',()=>{
  const attempts=[answer(0,report())],d=diagnosticState({concepts,relationships,questions,attempts});
  assert.equal(graphViewProgress(d.nodes,attempts,'combined',enabled).get('1.11').display.score,.098);
  assert.equal(graphViewProgress(d.nodes,attempts,'movement',enabled).get('1.11').display.score,null);
});
test('Camera index and explanations derive their caps from the shared scoring policy',()=>{
  assert.equal(cameraContribution(100,100).adjustment,SCORE_POLICY.cameraEmotionWeight+SCORE_POLICY.cameraMovementWeight);
  assert.equal(cameraContribution(100,100).cameraScore,0);assert.equal(cameraContribution(0,0).cameraScore,1);
  assert.ok(combinedExplanation(enabled).includes('up to 2%'));assert.ok(graphExportLegend('combined',enabled).includes('check-ins ≤2%'));
  assert.ok(graphExportLegend('combined').includes('check-ins off'));
});
