import {timedCredit,validDuration} from './timing.mjs';
import {validateSelfReport,validateMovement} from './observations.mjs';
import {validateExpression} from './expressions.mjs';
import {validateScratchSnapshot} from './scratch-data.mjs';
export const STORAGE_KEY='calculus-clinic-progress-v1';
export function csv(rows,columns){
  const escape=value=>{
    let s=Array.isArray(value)?value.join('; '):String(value??'');
    // Keep spreadsheet applications from interpreting imported text as formulas.
    if(!(typeof value==='number'&&Number.isFinite(value))&&/^[=+@\-\t\r]/.test(s)) s="'"+s;
    return '"'+s.replaceAll('"','""')+'"';
  };
  return '\uFEFF'+[columns.map(escape).join(','),...rows.map(row=>columns.map(k=>escape(row[k])).join(','))].join('\r\n');
}
export function stats(attempts,questionIds){
  const ids=new Set(questionIds), grouped=new Map();
  for(const a of attempts){if(!ids.has(a.questionId))continue; if(!grouped.has(a.questionId))grouped.set(a.questionId,[]);grouped.get(a.questionId).push(a);}
  const groups=[...grouped.values()].map(xs=>xs.sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id)));
  const attempted=groups.length, firstCorrect=groups.filter(xs=>xs[0].correct).length, latestCorrect=groups.filter(xs=>xs.at(-1).correct).length;
  const total=groups.reduce((s,xs)=>s+xs.length,0), correct=groups.reduce((s,xs)=>s+xs.filter(a=>a.correct).length,0);
  // Practice mastery includes coverage: a single correct answer cannot fill an
  // entire concept. Persist attempts as the source of truth, then derive this
  // score on every read so retries, imports and bank additions stay consistent.
  const latest=groups.map(xs=>xs.at(-1));
  const correctnessScore=attempted&&ids.size?latestCorrect/ids.size:null;
  const masteryScore=attempted&&ids.size?Number((latest.reduce((sum,a)=>sum+timedCredit(a),0)/ids.size).toFixed(12)):null;
  const timed=groups.flat().filter(a=>validDuration(a.durationMs));
  const averageDurationMs=timed.length?Math.round(timed.reduce((sum,a)=>sum+a.durationMs,0)/timed.length):null;
  const latestDurationMs=ids.size===1&&validDuration(latest[0]?.durationMs)?latest[0].durationMs:null;
  return {available:ids.size,attempted,firstCorrect,latestCorrect,total,correct,masteryScore,correctnessScore,timingAdjustment:attempted?Math.max(0,correctnessScore-masteryScore):null,timedAttempts:timed.length,averageDurationMs,latestDurationMs,firstAccuracy:attempted?firstCorrect/attempted:null,latestAccuracy:attempted?latestCorrect/attempted:null,allAccuracy:total?correct/total:null};
}
export function validateAttempts(value,questions){
  if(!Array.isArray(value)||value.length>100000)throw new Error('The backup must contain an attempts array with at most 100,000 records.');
  const known=new Map(questions.map(q=>[q.id,q])), seen=new Set();
  return value.map(a=>{
    if(!a||typeof a!=='object'||typeof a.id!=='string'||a.id.length>100||seen.has(a.id))throw new Error('An attempt has an invalid or duplicate ID.');
    seen.add(a.id);
    const q=known.get(a.questionId);
    if(!q||q.conceptId!==a.conceptId||a.bankVersion!==q.version||!q.options.some(o=>o.id===a.choiceId))throw new Error('The backup contains an unknown question, answer, or question-bank version.');
    if(typeof a.answeredAt!=='string'||!Number.isFinite(Date.parse(a.answeredAt)))throw new Error('An attempt has an invalid date.');
    if(a.durationMs!=null&&!validDuration(a.durationMs))throw new Error('An attempt has an invalid response time. Use nonnegative whole milliseconds.');
    return {id:a.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:a.choiceId,correct:a.choiceId===q.correctOptionId,answeredAt:new Date(a.answeredAt).toISOString(),sessionId:typeof a.sessionId==='string'?a.sessionId.slice(0,100):'imported',...(a.durationMs!=null?{durationMs:a.durationMs}:{}),...(a.selfReport!=null?{selfReport:validateSelfReport(a.selfReport)}:{}),...(a.facialMovement!=null?{facialMovement:validateMovement(a.facialMovement,a.durationMs)}:{}),...(a.facialExpression!=null?{facialExpression:validateExpression(a.facialExpression,a.durationMs)}:{}),...(a.scratchSnapshot!=null?{scratchSnapshot:validateScratchSnapshot(a.scratchSnapshot)}:{})};
  });
}
export function validateBackup(value,questions,compatibleBankVersions){
  if(!value||value.schemaVersion!==1||!compatibleBankVersions.includes(value.bankVersion))throw new Error('This backup has a different schema or unsupported question-bank version.');
  return validateAttempts(value.attempts,questions);
}
export function mergeAttempts(current,incoming){
  const result=new Map(current.map(a=>[a.id,a]));
  for(const a of incoming)if(!result.has(a.id))result.set(a.id,a);
  return [...result.values()].sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id));
}
export function topologicalOrder(concepts,edges){
  const ids=new Set(concepts.map(c=>c.id)), counts=new Map(concepts.map(c=>[c.id,0])), children=new Map(concepts.map(c=>[c.id,[]]));
  for(const e of edges.filter(e=>e.type==='prerequisite')){
    if(!ids.has(e.source)||!ids.has(e.target))throw new Error(`Dangling edge ${e.source} → ${e.target}`);
    counts.set(e.target,counts.get(e.target)+1);children.get(e.source).push(e.target);
  }
  const queue=[...ids].filter(id=>counts.get(id)===0), result=[];
  for(let i=0;i<queue.length;i++){const id=queue[i];result.push(id);for(const target of children.get(id)){counts.set(target,counts.get(target)-1);if(counts.get(target)===0)queue.push(target);}}
  if(result.length!==concepts.length)throw new Error('Prerequisites must form an acyclic directed graph.');
  return result;
}
