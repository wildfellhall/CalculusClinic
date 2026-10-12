// Display choices for personal practice. Camera adjustments are experimental;
// answer grading, the 8/10 pass rule and diagnostic routing use answers only.
import {combinedScore,combinedExplanation,cameraScoreExplanation,normalizeScoringPreferences,SCORE_POLICY,CAMERA_MAX_ADJUSTMENT} from './score-policy.mjs';
import {observationStats} from './observations.mjs';
import {expressionStats} from './expressions.mjs';
export const GRAPH_MODES={
  accuracy:{label:'Accuracy',description:'Green fill shows latest correct answers divided by all questions in the concept. Unanswered questions have yet to contribute. Time and camera adjustments are excluded.'},
  combined:{label:'Accuracy + observations',description:combinedExplanation()},
  movement:{label:'Camera estimates only',description:cameraScoreExplanation()+' Darker fill means a higher score. This is a personal reflection index, not measured emotion or mathematical mastery. Missing or insufficient camera estimates stay blank.'}
};
export const normalizeGraphMode=mode=>Object.hasOwn(GRAPH_MODES,mode)?mode:'accuracy';
export const MOVEMENT_SCALE=['#F8F5FC','#EEE5F7','#DBCBEE','#C4ACDF','#BBA3D6'];
export const MOVEMENT_BORDER_SCALE=['#D3C2E6','#C6B0DD','#B69BD3','#A383C4','#8B68AF'];
export const movementWidth=score=>1.5+3.5*Math.max(0,Math.min(1,score??0));

export function graphViewProgress(nodes,attempts,mode='accuracy',preferences){
  mode=normalizeGraphMode(mode);
  return new Map([...nodes].map(([id,s])=>{
    const o=observationStats(attempts,id),change=o.changeScore,expression=expressionStats(attempts,id);
    const accuracy=s.correctnessScore??null,scoring=combinedScore(accuracy,expression,o,preferences),adjusted=scoring.adjustedScore;
    const score=mode==='movement'?(expression?.cameraScore??null):mode==='combined'?adjusted:accuracy;
    const accuracyText=accuracy===null?'Not tried':`${Math.round(accuracy*100)}%`;
    const label=mode==='movement'?(score===null?'No camera estimate':`Expression ${Math.round(score*100)}/100`):mode==='combined'?(score===null?'Not tried':`${Math.round(score*100)}% · ${scoring.hasEvidence?'adjusted':'no estimate'}`):accuracy===null?'Not tried':`${accuracyText} · ${s.attempted}/${s.available} tried`;
    const answerDescription=accuracy===null?'No answers recorded.':`Accuracy fill ${accuracyText}. ${s.latestCorrect} of ${s.available} latest answers correct; ${s.attempted} questions tried.`;
    const movementDescription=change===null?'No facial-movement data recorded.':`Measured facial change ${Number(change.toFixed(1))} of 100 from ${o.samples} usable samples. Movement alone does not establish an emotion.`;
    const expressionDescription=expression?` Camera expression estimate: ${expression.label}, ${Math.round(expression.confidence*100)}% mean model probability across ${expression.samples} confident samples. Experimental camera adjustment: ${Number((expression.adjustment*100).toFixed(1))}% of answer credit.`:' No usable camera expression estimates recorded.';
    const reportDescription=mode==='combined'?(scoring.includeSelfReports?` Check-ins included: ${scoring.checkIns} records, ${Number((scoring.selfReportAdjustment*100).toFixed(2))}% additional credit reduction.`:' Check-ins excluded.'):'';
    return [id,{...s,display:{mode,score,accuracy,adjusted,scoring,expression,change,samples:o.samples,records:o.movementAttempts,label,description:answerDescription+' '+movementDescription+expressionDescription+reportDescription}}];
  }));
}

export function graphExportLegend(mode,preferences){
  if(mode==='combined')return `Experimental adjusted accuracy: camera ≤${CAMERA_MAX_ADJUSTMENT*100}% of credit; ${normalizeScoringPreferences(preferences).includeSelfReports?`check-ins ≤${SCORE_POLICY.selfReportWeight*100}% more`:'check-ins off'}. Border = facial change.`;
  if(mode==='movement')return 'Camera estimates only: experimental expression score, 0–100. Not measured emotion or mastery.';
  return 'Accuracy: latest correct answers ÷ all questions. No timing or camera adjustment. Purple marks the next check.';
}
