import {mkdir,writeFile,cp} from 'node:fs/promises';
import {concepts,relationships,units,sources,standards,questions,archivedQuestions,BANK_VERSION,COMPATIBLE_BANK_VERSIONS} from '../data/catalog.mjs';
import {curriculumCoverage,COVERAGE_SCOPE} from '../data/coverage.mjs';
import {COURSES,courseIncludes} from '../src/course.mjs';
import {csv,topologicalOrder} from '../src/core.mjs';
import {graphLayout,drawGraph} from '../src/graph.mjs';
import {compileMathText} from './math-format.mjs';
topologicalOrder(concepts,relationships);
for(const c of concepts){
  const count=questions.filter(q=>q.conceptId===c.id).length;
  if(count<10||count>15)throw new Error(`Expected 10–15 questions for ${c.id}, received ${count}`);
}
await mkdir('dist/data',{recursive:true});
await mkdir('dist/src',{recursive:true});
const metadata={schemaVersion:'1.1.0',bankVersion:BANK_VERSION,compatibleBankVersions:COMPATIBLE_BANK_VERSIONS,updated:'2026-10-12',granularity:'Concept groups with explicit subskills and course membership',questionCount:questions.length,conceptCount:concepts.length,scope:'AP Calculus AB/BC and Texas TEKS Algebra I/II, including prerequisite support',edgeDirection:'prerequisite → dependent',dependencyStatus:'Author-designed teaching model, not an official standards dependency graph',assessmentStatus:'Original sampled practice; not psychometrically calibrated; coverage does not establish mastery of every standard'};
const coverage=curriculumCoverage(concepts,questions,standards);
metadata.coverageScope=COVERAGE_SCOPE;
metadata.revisedQuestionCount=archivedQuestions.length;
metadata.historyPolicy='Replaced questions have new IDs. Earlier attempts remain available in history and backups; current accuracy and diagnostic passing use current questions only. Node camera observations retain their original history.';
const bundle={metadata,courses:COURSES,units,concepts,relationships,questions,archivedQuestions,sources,standards};
await writeFile('dist/data/bundle.js','window.CALCULUS_DATA='+JSON.stringify({...bundle,mathText:compileMathText(concepts,questions)}).replaceAll('<','\\u003c')+';\n');
async function exportCurriculum(path,nodes,items,edges,course=null){
 await mkdir(path,{recursive:true});
 const ids=new Set(nodes.map(c=>c.id));
 const itemIds=new Set(items.map(q=>q.id));
 const aligned=coverage.filter(s=>s.conceptIds.some(id=>ids.has(id))).map(s=>{const questionIds=s.questionIds.filter(id=>itemIds.has(id));return {...s,conceptIds:s.conceptIds.filter(id=>ids.has(id)),questionIds,questionCount:questionIds.length};});
 const refs=aligned.filter(s=>!s.id.startsWith('AP.'));
 const info={...metadata,...(course?{course,title:COURSES[course].title}:{}),conceptCount:nodes.length,questionCount:items.length};
 await writeFile(path+'/ontology.json',JSON.stringify({metadata:info,units:units.filter(u=>nodes.some(c=>c.unit===u.id)),concepts:nodes,relationships:edges,questions:items,sources,standards:refs,coverage:aligned},null,2));
 await writeFile(path+'/archived-questions.json',JSON.stringify({bankVersion:BANK_VERSION,historyPolicy:metadata.historyPolicy,questions:archivedQuestions.filter(q=>ids.has(q.conceptId))},null,2));
 const rows=nodes.map(c=>({...c,unitTitle:units[c.unit].title,dependents:edges.filter(e=>e.type==='prerequisite'&&e.source===c.id).map(e=>e.target),sourceUrl:sources.find(s=>s.id===c.sourceIds.at(-1))?.url??'',questionIds:items.filter(q=>q.conceptId===c.id).map(q=>q.id)}));
 await writeFile(path+'/concepts.csv',csv(rows,['id','title','curriculum','unit','unitTitle','scope','cedTopic','algebraLevel','alignment','standardIds','objective','subskills','rule','prerequisites','dependents','misconception','firstStep','potentialFriction','support','representations','practices','questionIds','sourceIds','sourceUrl']));
 await writeFile(path+'/relationships.csv',csv(edges,['source','target','type','rationale','provenance','requiredFor']));
 await writeFile(path+'/questions.csv',csv(items.map(q=>({...q,standardIds:aligned.filter(s=>s.questionIds.includes(q.id)).map(s=>s.id),optionA:q.options[0].text,optionAId:q.options[0].id,optionB:q.options[1].text,optionBId:q.options[1].id,optionC:q.options[2].text,optionCId:q.options[2].id,correctAnswer:q.options.find(o=>o.id===q.correctOptionId).text})),['id','conceptId','version','replaces','standardIds','prompt','optionAId','optionA','optionBId','optionB','optionCId','optionC','correctOptionId','correctAnswer','explanation','format','authorship','validation']));
 await writeFile(path+'/concept-map.svg',drawGraph(graphLayout(nodes,edges),units,{standalone:true,title:`${course?COURSES[course].title:'Calculus Clinic'} · Concept dependencies`}));
 const courseCoverage=course?.startsWith('ALG')?aligned.filter(s=>s.course===course):aligned;
 await writeFile(path+'/coverage.csv',csv(courseCoverage,['id','reference','course','kind','summary','conceptIds','questionIds','questionCount','coverage','assessmentLimit','sourceUrl']));
 await writeFile(path+'/question-audit.csv',csv(nodes.map(c=>{const qs=items.filter(q=>q.conceptId===c.id);return {conceptId:c.id,title:c.title,subskills:c.subskills,questionCount:qs.length,revisedQuestions:qs.filter(q=>q.replaces).length,retainedQuestions:qs.filter(q=>!q.replaces).length,questionIds:qs.map(q=>q.id),scope:c.scope,reviewed:metadata.updated,reviewScope:'Calculation, modeling, and reasoning about specified mathematical cases; ten sampled items per node'};}),['conceptId','title','scope','subskills','questionCount','revisedQuestions','retainedQuestions','questionIds','reviewed','reviewScope']));
}
await exportCurriculum('dist/data',concepts,questions,relationships);
for(const course of Object.keys(COURSES)){
 const nodes=concepts.filter(c=>courseIncludes(course,c)),ids=new Set(nodes.map(c=>c.id));
 await exportCurriculum('dist/data/'+course.toLowerCase(),nodes,questions.filter(q=>ids.has(q.conceptId)),relationships.filter(e=>ids.has(e.source)&&ids.has(e.target)),course);
}
for(const file of ['app.mjs','onboarding.mjs','onboarding-ui.mjs','progress-checks.mjs','progress-check-ui.mjs','core.mjs','course.mjs','graph.mjs','graph-views.mjs','score-policy.mjs','report-data.mjs','report-pdf.mjs','diagnostic.mjs','timing.mjs','math.mjs','observations.mjs','camera.mjs','camera-access.mjs','face-worker.mjs','observation-ui.mjs'])await cp('src/'+file,'dist/src/'+file);
for(const file of ['index.html','styles.css'])await cp('src/'+file,'dist/'+file);
await cp('public','dist',{recursive:true});
await mkdir('dist/vendor/katex',{recursive:true});
for(const file of ['katex.mjs','katex.min.css','fonts'])await cp('node_modules/katex/dist/'+file,'dist/vendor/katex/'+file,{recursive:true});
await cp('node_modules/katex/LICENSE','dist/vendor/katex/LICENSE');
await mkdir('dist/vendor/mediapipe',{recursive:true});
for(const file of ['vision_bundle.mjs','wasm'])await cp('node_modules/@mediapipe/tasks-vision/'+file,'dist/vendor/mediapipe/'+file,{recursive:true});
await cp('public/models/face-landmarker/LICENSE','dist/vendor/mediapipe/LICENSE');
await cp('src/expressions.mjs','dist/src/expressions.mjs');
await mkdir('dist/vendor/face-api',{recursive:true});
await cp('node_modules/@vladmandic/face-api/dist/face-api.esm.js','dist/vendor/face-api/face-api.esm.js');
await cp('node_modules/@vladmandic/face-api/LICENSE','dist/vendor/face-api/LICENSE');
await mkdir('dist/models/face-expression',{recursive:true});
for(const file of ['face_expression_model.bin','face_expression_model-weights_manifest.json'])await cp('node_modules/@vladmandic/face-api/model/'+file,'dist/models/face-expression/'+file);
await mkdir('dist/vendor/pdf',{recursive:true});
await cp('node_modules/pdf-lib/dist/pdf-lib.min.js','dist/vendor/pdf/pdf-lib.min.js');
await cp('node_modules/pdf-lib/LICENSE.md','dist/vendor/pdf/pdf-lib-LICENSE.md');
await cp('node_modules/@pdf-lib/fontkit/dist/fontkit.umd.min.js','dist/vendor/pdf/fontkit.umd.min.js');
await cp('node_modules/@pdf-lib/fontkit/README.md','dist/vendor/pdf/fontkit-NOTICE.md');
console.log(`Built ${concepts.length} concepts, ${relationships.length} typed relationships, ${questions.length} questions. Four courses; 111 AP BC topics and 97 Algebra TEKS content expectations mapped.`);
