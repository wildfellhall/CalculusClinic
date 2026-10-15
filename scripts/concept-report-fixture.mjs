// Fabricated records for report QA. Never uses personal practice data or a camera.
import {questions,archivedQuestions} from '../data/catalog.mjs';
import {ExpressionSummary,EXPRESSION_LABELS} from '../src/expressions.mjs';
import {MovementSummary,calibrate,METRICS,selfReport} from '../src/observations.mjs';
export function conceptReportFixture(){
 const selected=questions.filter(q=>q.conceptId==='1.6'),old=archivedQuestions.find(q=>q.conceptId==='1.6');
 const vector=value=>Object.fromEntries(METRICS.map(m=>[m.id,value]));
 const movement=new MovementSummary(calibrate(Array.from({length:30},()=>vector(.1)),'qa-baseline'));
 for(let i=0;i<5;i++)movement.add(vector(.4),i*200);
 const expression=label=>{const summary=new ExpressionSummary('qa-baseline');for(let i=0;i<5;i++)summary.add(Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k===label?1:0])),28.5,i*200);return summary.finish();};
 const make=(q,n,correct,session,extra={})=>({id:'concept-report-qa-'+n,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,14,13,n)).toISOString(),sessionId:session,durationMs:90000+n*1000,...extra});
 const attempts=selected.map((q,i)=>make(q,i,i<6,'qa-set-one',i===0?{facialExpression:expression('fearful'),facialMovement:movement.finish(),selfReport:selfReport({emotion:'frustration',intensity:4,valence:'unpleasant'})}:i===1?{durationMs:0}:i===2?{durationMs:undefined}:{}));
 attempts.push(make(selected[0],20,false,'qa-set-two',{facialExpression:expression('sad'),selfReport:selfReport({emotion:'mixed',intensity:2,valence:'neutral'})}),make(selected[0],21,true,'qa-set-three',{facialExpression:expression('happy'),facialMovement:movement.finish()}),make(old,30,false,'imported',{durationMs:undefined}));
 const progressChecks=[{id:'qa-set-one',conceptId:'1.6',course:'BC',completedAt:attempts[9].answeredAt,attemptIds:attempts.slice(0,10).map(a=>a.id),status:'completed',ease:2,progress:4,feelings:['confused','frustrated','confident'],note:'Factoring helped. I need to check which factors may be cancelled.',submittedAt:'2026-10-14T13:15:00.000Z'}];
 const limits=questions.filter(q=>q.conceptId==='1.5');
 attempts.push(...limits.map((q,i)=>make(q,40+i,i<7,'qa-prerequisite-set',i===0?{facialExpression:expression('happy')}:{})),make(limits[7],50,true,'qa-prerequisite-retry'),make(archivedQuestions.find(q=>q.conceptId==='1.5'),51,false,'qa-prerequisite-archive',{facialExpression:expression('sad')}));
 attempts.push(make(questions.find(q=>q.conceptId==='F02'),52,false,'qa-factoring',{facialExpression:expression('fearful'),facialMovement:movement.finish(),selfReport:selfReport({emotion:'frustration',intensity:4,valence:'unpleasant'})}),make(questions.find(q=>q.conceptId==='F03'),53,true,'qa-foundation',{facialMovement:movement.finish(),selfReport:selfReport({emotion:'calm',intensity:3,valence:'pleasant'})}));
 attempts.push(make(questions.find(q=>q.conceptId==='MATH_057'),54,true,'qa-algebra-one',{facialExpression:expression('angry')}),make(questions.find(q=>q.conceptId==='MATH_081'),55,true,'qa-algebra-two',{facialExpression:expression('happy')}));
 const scratch={saved:true,strokes:[{tool:'pen',color:'#294637',width:6,points:[[150,200],[250,300]]},{tool:'pen',color:'#294637',width:6,points:[[250,200],[150,300]]},{tool:'pen',color:'#365fa0',width:6,points:[[400,200],[650,200],[650,300],[400,300]]},{tool:'eraser',color:'#294637',width:35,points:[[500,150],[500,250]]}]};
 return {attempts,progressChecks,scratch,notes:'Factor first. Cancel only common factors, then evaluate the limit.'};
}
