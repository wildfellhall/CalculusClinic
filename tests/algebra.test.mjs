import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as catalog from '../data/catalog.mjs';
import * as algebra from '../data/algebra/curriculum.mjs';
import {questions as algebraQuestions} from '../data/algebra/questions.mjs';
import * as calculus from '../data/curriculum.mjs';
import {questions as calculusQuestions} from '../data/questions.mjs';
import source from '../data/algebra/source-ontology.json' with {type:'json'};
import {COURSES,courseIncludes,readCourse,saveCourse} from '../src/course.mjs';
import {topologicalOrder,validateBackup,validateAttempts} from '../src/core.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {reportData} from '../src/report-data.mjs';
import {graphViewProgress,graphProfile} from '../src/graph-views.mjs';
import {graphLayout,drawGraph,masteryFill} from '../src/graph.mjs';
import {compileMathText,curriculumText,mathSegments} from '../scripts/math-format.mjs';
const id=n=>`MATH_${String(n).padStart(3,'0')}`;
const items=n=>algebraQuestions.filter(q=>q.conceptId===id(n));
const answer=(q,i,correct=true)=>({id:`test-${q.id}-${i}`,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,12,12,i)).toISOString(),sessionId:'algebra-test',durationMs:40000});
const set=(n,correct=10)=>items(n).map((q,i)=>answer(q,i,i<correct));
const diagnose=(course,attempts=[])=>diagnosticState({...catalog,course,attempts});

test('Algebra preserves every source node, prerequisite, and rationale',()=>{
 assert.equal(source.nodes.length,48);assert.equal(source.edges.length,80);
 for(const n of source.nodes){const c=algebra.concepts.find(c=>c.id===n.id);assert.equal(c.title,n.name);assert.equal(c.objective,n.definition);assert.deepEqual(c.prerequisites,n.prerequisites);}
 for(const edge of source.edges){const e=algebra.relationships.find(e=>e.source===edge.source&&e.target===edge.target);assert.equal(e.rationale,edge.rationale);assert.equal(e.type,'prerequisite');}
 assert.equal(topologicalOrder(algebra.concepts,algebra.relationships).length,86);
});
test('Each of four courses is closed under prerequisite dependencies and contains only its curriculum',()=>{
 for(const [course,count] of [['ALG1',65],['ALG2',86],['AB',97],['BC',127]]){
  const nodes=catalog.concepts.filter(c=>courseIncludes(course,c)),ids=new Set(nodes.map(c=>c.id));assert.equal(nodes.length,count);
  for(const c of nodes)for(const p of c.prerequisites)assert.ok(ids.has(p),`${course}: ${c.id} needs ${p}`);
  assert.ok(ids.has(COURSES[course].entryId));
  for(const start of COURSES[course].startingIds)assert.ok(ids.has(start));
 }
 assert.equal(courseIncludes('BC',algebra.concepts[0]),false);assert.equal(courseIncludes('ALG1',calculus.concepts[0]),false);
 assert.deepEqual(catalog.concepts.filter(c=>c.curriculum!=='algebra'),calculus.concepts);assert.deepEqual(catalog.questions.filter(q=>!q.conceptId.startsWith('MATH_')),calculusQuestions);
});
test('The TEKS crosswalk covers every content and process expectation with valid course nodes',()=>{
 const groups={ALG1:[7,9,8,3,3,3,3,2,5,6,2,5],ALG2:[7,4,7,8,5,12,9,3]};
 for(const [course,counts] of Object.entries(groups)){
  const expected=counts.flatMap((count,i)=>Array.from({length:count},(_,j)=>`${course==='ALG1'?'A':'A2'}.${i+1}${String.fromCharCode(65+j)}`));
  const refs=algebra.standards.filter(s=>s.course===course);assert.deepEqual(refs.map(s=>s.id),expected);
  assert.equal(refs.filter(s=>s.kind==='content').length,course==='ALG1'?49:48);
  for(const s of refs){assert.ok(s.summary.length>10);assert.match(s.sourceUrl,/tea\.texas\.gov/);assert.ok(s.conceptIds.length);for(const n of s.conceptIds){const c=algebra.concepts.find(c=>c.id===n);assert.ok(courseIncludes(course,c));assert.ok(c.standardIds.includes(s.id));}}
 }
 for(const c of algebra.concepts.filter(c=>!c.foundation))assert.ok(c.standardIds.some(s=>!/^A2?\.1[A-G]$/.test(s)),c.id);
});
test('Every Algebra node has ten unique, complete, stable questions and three distinct choices',()=>{
 assert.equal(algebraQuestions.length,860);assert.equal(new Set(catalog.questions.map(q=>q.id)).size,2130);
 for(const c of algebra.concepts){const qs=algebraQuestions.filter(q=>q.conceptId===c.id);assert.equal(qs.length,10,c.id);assert.equal(new Set(qs.map(q=>q.prompt)).size,10,c.id);
  for(const [i,q] of qs.entries()){assert.equal(q.id,`${c.id}-Q${i+1}`);assert.equal(q.options.length,3);assert.equal(new Set(q.options.map(o=>o.text.trim().toLowerCase())).size,3,q.id);assert.equal(q.options.filter(o=>o.id===q.correctOptionId).length,1);assert.ok(q.explanation.trim().length>0,q.id);assert.equal(q.version,'1.2.0');}
 }
});
test('Algebra math compiles, preserves source text, and leaves no raw formula shorthand',()=>{
 compileMathText(algebra.concepts,algebraQuestions);
 for(const text of curriculumText(algebra.concepts,algebraQuestions)){
  const parts=mathSegments(text);assert.equal(parts.map(s=>s.text).join(''),text);
  for(const s of parts)if(!s.tex)assert.doesNotMatch(s.text,/[√∛^_²³⁻₀-₉ₙₓ]/,text);
 }
});
test('New diagnostics begin at course entry skills, keep partial checks, advance after 8/10, and probe gaps',()=>{
 for(const [course,n] of [['ALG1',34],['ALG2',61]]){
  assert.equal(diagnose(course).recommendation.targetId,id(n));
  let d=diagnose(course,set(n).slice(0,9));assert.equal(d.nodes.get(id(n)).status,'partial');assert.equal(d.recommendation.targetId,id(n));
  d=diagnose(course,set(n,8));assert.equal(d.nodes.get(id(n)).status,'passed');assert.notEqual(d.recommendation.targetId,id(n));assert.ok(d.nodes.has(d.recommendation.targetId));
  d=diagnose(course,set(n,7));assert.equal(d.nodes.get(id(n)).status,'review');assert.equal(d.recommendation.kind,'prerequisite');assert.ok(algebra.concepts.find(c=>c.id===id(n)).prerequisites.includes(d.recommendation.targetId));
  assert.equal([...d.nodes.values()].filter(s=>s.status!=='unseen').length,1,'Answers must not grant inferred progress to ancestors');
 }
});
test('Saved Algebra mastery follows shared nodes across courses and stays out of Calculus',()=>{
 const attempts=[...set(34,8),...set(78,9).map((a,i)=>({...a,answeredAt:new Date(Date.UTC(2026,9,12,13,i)).toISOString()}))];
 const one=diagnose('ALG1',attempts),two=diagnose('ALG2',attempts),bc=diagnose('BC',attempts);
 assert.equal(one.nodes.get(id(34)).status,'passed');assert.equal(two.nodes.get(id(34)).correctnessScore,.8);assert.equal(one.nodes.has(id(78)),false);assert.equal(two.latestPassedId,id(78));assert.equal(bc.summary.unseen,127);
 for(const mode of ['accuracy','combined','movement']){
  const view=graphViewProgress(one.nodes,attempts,mode),profile=graphProfile(view);assert.equal(profile.total,65);
  assert.equal(view.get(id(34)).display.score,mode==='movement'?null:.8);
 }
 const svg=drawGraph(graphLayout(algebra.concepts.filter(c=>c.id===id(34)),[]),catalog.units,{progress:graphViewProgress(one.nodes,attempts,'accuracy')});assert.ok(svg.includes(masteryFill(.8)));
});
test('Backups preserve old Calculus item versions together with Algebra records',()=>{
 const old=calculusQuestions.filter(q=>['1.0.0','1.1.0'].includes(q.version)).filter((q,i)=>i===0||i===635).map((q,i)=>answer(q,i)),records=[...old,...set(34)];
 assert.equal(validateAttempts(records,catalog.questions).length,12);
 for(const version of catalog.COMPATIBLE_BANK_VERSIONS)assert.deepEqual(validateBackup({schemaVersion:1,bankVersion:version,attempts:records},catalog.questions,catalog.COMPATIBLE_BANK_VERSIONS),records);
 const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
 for(const course of Object.keys(COURSES)){assert.equal(saveCourse(storage,course),true);assert.equal(readCourse(storage),course);}
});
test('Reports and generated course downloads exclude unrelated courses and retain standards',async()=>{
 // This integration test builds its own artifacts, so npm test also works from a fresh checkout.
 await import('../scripts/build.mjs');
 const attempts=[...set(34,8),...set(78,6)];
 for(const [course,count] of [['ALG1',65],['ALG2',86],['AB',97],['BC',127]]){
  const report=reportData({...catalog,course,attempts});assert.equal(report.rows.length,count);assert.equal(report.profile.total,count);
  const exported=JSON.parse(await readFile(`dist/data/${course.toLowerCase()}/ontology.json`,'utf8'));
  assert.equal(exported.concepts.length,count);assert.equal(exported.questions.length,count*10);assert.equal(exported.metadata.title,COURSES[course].title);
  for(const c of exported.concepts){assert.ok(courseIncludes(course,c));for(const ref of c.standardIds??[])assert.ok(exported.standards.some(s=>s.id===ref),c.id+' '+ref);}
  for(const s of exported.standards)for(const id of s.conceptIds)assert.ok(exported.concepts.some(c=>c.id===id));
  const svg=await readFile(`dist/data/${course.toLowerCase()}/concept-map.svg`,'utf8');assert.equal((svg.match(/class="graph-node/g)||[]).length,count);assert.ok(svg.includes(COURSES[course].title));
  if(course.startsWith('ALG'))assert.equal(exported.standards.filter(s=>s.course===course&&s.kind==='content').length,course==='ALG1'?49:48);
 }
});
