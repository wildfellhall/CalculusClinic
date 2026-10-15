import {courseIncludes,relationshipInCourse} from './course.mjs';
import {reportData} from './report-data.mjs';
import {stats} from './core.mjs';
import {validDuration} from './timing.mjs';
import {observationStats} from './observations.mjs';

const chronological=(a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id);
export function timingSummary(attempts){
  const timed=attempts.filter(a=>validDuration(a.durationMs)),values=timed.map(a=>a.durationMs).sort((a,b)=>a-b);
  const average=list=>list.length?Math.round(list.reduce((s,a)=>s+a.durationMs,0)/list.length):null;
  return {count:timed.length,missing:attempts.length-timed.length,total:timed.length?values.reduce((a,b)=>a+b,0):null,average:average(timed),median:values.length?Math.round((values[Math.floor((values.length-1)/2)]+values[Math.floor(values.length/2)])/2):null,fastest:values[0]??null,slowest:values.at(-1)??null,correctAverage:average(timed.filter(a=>a.correct)),incorrectAverage:average(timed.filter(a=>!a.correct))};
}

// Use the same scores as the graph, while keeping earlier bank versions and
// every retry in a separate, complete answer history. Never mutate live records.
export function conceptReportData({conceptId,concepts,relationships,questions,archivedQuestions=[],attempts,progressChecks=[],course='BC',preferences,scratch=null,notes='',generatedAt=new Date().toISOString()}){
  const overall=reportData({concepts,relationships,questions,attempts,course,preferences,generatedAt}),row=overall.rows.find(r=>r.concept.id===conceptId);
  if(!row)throw new Error('This concept is not part of the selected course.');
  const current=questions.filter(q=>q.conceptId===conceptId),old=archivedQuestions.filter(q=>q.conceptId===conceptId),known=new Map([...old,...current].map(q=>[q.id+'|'+q.version,q]));
  const history=attempts.filter(a=>a.conceptId===conceptId).map(a=>{
    const q=known.get(a.questionId+'|'+a.bankVersion);
    if(!q||!q.options.some(o=>o.id===a.choiceId))throw new Error('A saved attempt refers to an unavailable question version.');
    return {...a,correct:a.choiceId===q.correctOptionId};
  }).sort(chronological);
  const sessions=[];
  for(const a of history){
    const id=a.sessionId||'imported';let session=sessions.find(s=>s.id===id);
    if(!session){session={id,label:id==='imported'?'Imported / no session':`Set ${sessions.filter(s=>s.id!=='imported').length+1}`,attempts:[]};sessions.push(session);}
    session.attempts.push(a);a.setLabel=session.label;
  }
  for(const s of sessions){s.timing=timingSummary(s.attempts);s.correct=s.attempts.filter(a=>a.correct).length;s.dateRange=[s.attempts[0].answeredAt,s.attempts.at(-1).answeredAt];}
  const currentKeys=new Set(current.map(q=>q.id+'|'+q.version));
  const items=[...current,...old.filter(q=>!currentKeys.has(q.id+'|'+q.version)&&history.some(a=>a.questionId===q.id&&a.bankVersion===q.version))].map((question,i)=>{
    const records=history.filter(a=>a.questionId===question.id&&a.bankVersion===question.version).map((a,index)=>({...a,number:index+1,choiceLabel:String.fromCharCode(65+question.options.findIndex(o=>o.id===a.choiceId))}));
    return {question,label:i<current.length?`Q${i+1}`:`Earlier question ${i-current.length+1}`,archived:i>=current.length,attempts:records,stats:stats(records,[question.id]),correctLabel:String.fromCharCode(65+question.options.findIndex(o=>o.id===question.correctOptionId))};
  });
  const ids=new Map(concepts.map(c=>[c.id,c]));
  const connections=relationships.filter(e=>e.type==='prerequisite'&&relationshipInCourse(course,e)&&courseIncludes(course,ids.get(e.source))&&courseIncludes(course,ids.get(e.target))&&(e.source===conceptId||e.target===conceptId)).map(e=>({direction:e.target===conceptId?'Prerequisite':'Builds toward',concept:ids.get(e.target===conceptId?e.source:e.target)}));
  return structuredClone({version:1,generatedAt,course,preferences:overall.preferences,policyVersion:overall.policyVersion,concept:row.concept,row,items,history,sessions,timing:timingSummary(history),observations:observationStats(history,conceptId),connections,
    archivedAttemptCount:history.filter(a=>!currentKeys.has(a.questionId+'|'+a.bankVersion)).length,
    progressChecks:progressChecks.filter(c=>c.conceptId===conceptId).sort((a,b)=>a.completedAt.localeCompare(b.completedAt)),scratch,notes});
}
