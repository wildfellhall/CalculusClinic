import {diagnosticState} from './diagnostic.mjs';
import {graphViewProgress,graphProfile} from './graph-views.mjs';
import {normalizeScoringPreferences,SCORE_POLICY} from './score-policy.mjs';

export const REPORT_VIEWS=[['accuracy','Accuracy'],['movement','Emotions'],['combined','Both']];
export const reportScore=value=>Number.isFinite(value)?Number((value*100).toFixed(1)).toString():'Not recorded';
const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;

// A snapshot of existing scores, never a second grading or emotion model.
export function reportData({concepts,relationships,questions,attempts,course='BC',preferences,mapIds=null,mapEdges=relationships,mapFocus=null,mapLabel='Whole curriculum',generatedAt=new Date().toISOString()}){
  preferences=normalizeScoringPreferences(preferences);
  const diagnostic=diagnosticState({concepts,relationships,questions,attempts,course});
  const eligible=concepts.filter(c=>diagnostic.nodes.has(c.id));
  const views=Object.fromEntries(REPORT_VIEWS.map(([mode])=>[mode,graphViewProgress(diagnostic.nodes,attempts,mode,preferences)]));
  const profile=graphProfile(views.combined);
  const rows=eligible.map(concept=>{
    const s=views.combined.get(concept.id),d=s.display;
    return {concept,...s,accuracy:d.accuracy,emotions:d.expression?.cameraScore??null,combined:d.adjusted,expression:d.expression,change:d.change,scoring:d.scoring,delta:d.accuracy===null?null:d.adjusted-d.accuracy,emotionDelta:d.accuracy===null||!d.expression?null:d.expression.cameraScore-d.accuracy};
  });
  const paired=rows.filter(r=>r.emotionDelta!==null);
  const byScore=(a,b)=>a.accuracy-b.accuracy||a.concept.id.localeCompare(b.concept.id,undefined,{numeric:true});
  const comparable={count:paired.length,accuracy:mean(paired.map(r=>r.accuracy)),emotions:mean(paired.map(r=>r.emotions)),combined:mean(paired.map(r=>r.combined))};
  const dates=attempts.filter(a=>diagnostic.nodes.has(a.conceptId)).map(a=>a.answeredAt).sort();
  const mapSet=new Set(mapIds??eligible.map(c=>c.id)),mapConcepts=eligible.filter(c=>mapSet.has(c.id));
  const ids=new Set(mapConcepts.map(c=>c.id));
  return {version:1,policyVersion:SCORE_POLICY.version,generatedAt,course,preferences,profile,rows,views,diagnostic,comparable,
    attemptCount:dates.length,dateRange:dates.length?[dates[0],dates.at(-1)]:null,
    strengths:rows.filter(r=>r.status==='passed').sort((a,b)=>byScore(b,a)),
    weak:rows.filter(r=>r.status==='review').sort(byScore),
    partial:rows.filter(r=>r.status==='partial').sort((a,b)=>b.attempted-a.attempted||byScore(a,b)),
    differences:paired.slice().sort((a,b)=>Math.abs(b.emotionDelta)-Math.abs(a.emotionDelta)),
    adjustments:rows.filter(r=>r.delta!==null&&r.delta<0).sort((a,b)=>a.delta-b.delta),
    map:{concepts:mapConcepts,edges:mapEdges.filter(e=>ids.has(e.source)&&ids.has(e.target)),focus:ids.has(mapFocus)?mapFocus:null,label:mapLabel}};
}
