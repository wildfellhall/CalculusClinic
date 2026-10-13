import {COURSES,courseIncludes} from './course.mjs';

export const EASE_LABELS=['Very difficult','Difficult','Mixed','Easy','Very easy'];
export const PROGRESS_LABELS=['Stuck','Little progress','Some progress','Steady progress','Strong progress'];
export const FEELINGS={confused:'Confused',frustrated:'Frustrated',worried:'Worried',discouraged:'Discouraged',bored:'Bored',focused:'Focused',curious:'Curious',confident:'Confident',satisfied:'Satisfied',neutral:'Neutral'};
export const NOTE_LIMIT=600;
export const checkReady=c=>Number.isInteger(c.ease)&&c.ease>=1&&c.ease<=5&&Number.isInteger(c.progress)&&c.progress>=1&&c.progress<=5&&c.feelings.length>0;

// A resumed diagnostic may finish fewer than ten questions in this session.
// Link its responses and the earlier answers to the complete ten-question set.
export function createProgressCheck(quiz,attempts,questions,course){
 if(!quiz?.results.length||quiz.results.length!==quiz.list.length)return null;
 const items=questions.filter(q=>q.conceptId===quiz.conceptId);
 if(items.length!==10)return null;
 const latest=new Map();
 for(const a of [...attempts].sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id)))latest.set(a.questionId,a);
 for(const a of quiz.results)latest.set(a.questionId,a);
 if(items.some(q=>!latest.has(q.id)))return null;
 return {id:quiz.sessionId,conceptId:quiz.conceptId,course,completedAt:quiz.results.at(-1).answeredAt,attemptIds:items.map(q=>latest.get(q.id).id),status:'pending',ease:null,progress:null,feelings:[],note:'',submittedAt:null};
}

export function validateProgressChecks(value,attempts,concepts){
 if(value===undefined)return []; // Backups from before progress checks.
 if(!Array.isArray(value)||value.length>10000)throw new Error('Progress checks must be an array of at most 10,000 records.');
 const byAttempt=new Map(attempts.map(a=>[a.id,a])),byConcept=new Map(concepts.map(c=>[c.id,c])),seen=new Set();
 const date=(v,label)=>{if(typeof v!=='string'||!Number.isFinite(Date.parse(v)))throw new Error(`A progress check has an invalid ${label}.`);return new Date(v).toISOString();};
 return value.map(c=>{
  if(!c||typeof c!=='object'||typeof c.id!=='string'||!c.id.length||c.id.length>100||seen.has(c.id))throw new Error('A progress check has an invalid or duplicate ID.');
  seen.add(c.id);
  const concept=byConcept.get(c.conceptId);
  // A subset can shrink after a survey is saved. Its recorded course describes
  // where the check happened, not current membership. Keep that history valid;
  // active practice and course views still enforce current concept membership.
  if(!concept||!Object.hasOwn(COURSES,c.course)||(COURSES[c.course].kind!=='subset'&&!courseIncludes(c.course,concept)))throw new Error('A progress check has an unknown concept or course.');
  if(!Array.isArray(c.attemptIds)||c.attemptIds.length!==10||new Set(c.attemptIds).size!==10)throw new Error('A progress check must link ten distinct answers.');
  const linked=c.attemptIds.map(id=>byAttempt.get(id));
  if(linked.some(a=>!a||a.conceptId!==c.conceptId)||new Set(linked.map(a=>a.questionId)).size!==10)throw new Error('A progress check has missing or mismatched answers.');
  if(!['pending','completed','skipped'].includes(c.status))throw new Error('A progress check has an invalid status.');
  for(const key of ['ease','progress'])if(c[key]!==null&&(!Number.isInteger(c[key])||c[key]<1||c[key]>5))throw new Error('Progress check ratings must be from 1 to 5.');
  if(!Array.isArray(c.feelings)||c.feelings.length>Object.keys(FEELINGS).length||new Set(c.feelings).size!==c.feelings.length||c.feelings.some(f=>!Object.hasOwn(FEELINGS,f)))throw new Error('A progress check has invalid feelings.');
  if(typeof c.note!=='string'||c.note.length>NOTE_LIMIT)throw new Error(`Progress check notes must be at most ${NOTE_LIMIT} characters.`);
  if(c.status==='completed'&&!checkReady(c))throw new Error('A completed progress check needs both ratings and at least one feeling.');
  if(c.status!=='completed'&&c.submittedAt!==null)throw new Error('An unfinished progress check cannot have a submission date.');
  return {id:c.id,conceptId:concept.id,course:c.course,completedAt:date(c.completedAt,'completion date'),attemptIds:[...c.attemptIds],status:c.status,ease:c.ease,progress:c.progress,feelings:[...c.feelings],note:c.note,submittedAt:c.status==='completed'?date(c.submittedAt,'submission date'):null};
 });
}

export function mergeProgressChecks(current,incoming){
 const result=new Map(current.map(c=>[c.id,c]));
 const rank={pending:0,skipped:1,completed:2};
 for(const c of incoming){
  const old=result.get(c.id);
  if(old&&(old.conceptId!==c.conceptId||old.course!==c.course||old.completedAt!==c.completedAt||old.attemptIds.join('|')!==c.attemptIds.join('|')))throw new Error('A progress check ID refers to a different practice set.');
  if(!old||rank[c.status]>rank[old.status])result.set(c.id,c);
 }
 return [...result.values()].sort((a,b)=>a.completedAt.localeCompare(b.completedAt)||a.id.localeCompare(b.id));
}

export const PROGRESS_CHECK_COLUMNS=['id','conceptId','course','completedAt','status','ease','easeLabel','progress','progressLabel','feelings','note','submittedAt','attemptIds'];
export function progressCheckRows(checks){return checks.map(c=>({...c,easeLabel:EASE_LABELS[c.ease-1]??'',progressLabel:PROGRESS_LABELS[c.progress-1]??'',feelings:c.feelings.map(f=>FEELINGS[f])}));}
