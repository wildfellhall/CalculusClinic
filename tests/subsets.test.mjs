import test from 'node:test';
import assert from 'node:assert/strict';
import * as catalog from '../data/catalog.mjs';
import {SUBSETS,assembleSubsets} from '../data/subsets.mjs';
import {COURSES,courseIncludes,courseConcepts,relationshipInCourse,readCourse,saveCourse} from '../src/course.mjs';
import {diagnosticState} from '../src/diagnostic.mjs';
import {topologicalOrder} from '../src/core.mjs';
import {drawGraph,graphLayout} from '../src/graph.mjs';
import {reportData} from '../src/report-data.mjs';
import {renderOnboarding} from '../src/onboarding-ui.mjs';

const course='CALC_SUBSET',target='1.6';
const nodes=courseConcepts(course,catalog.concepts,catalog.relationships),ids=new Set(nodes.map(c=>c.id));
const edges=catalog.relationships.filter(e=>relationshipInCourse(course,e)&&ids.has(e.source)&&ids.has(e.target));
const diagnose=(attempts=[],path=course)=>diagnosticState({...catalog,attempts,course:path});
const answers=(id,correct=8,day=12)=>catalog.questions.filter(q=>q.conceptId===id).map((q,i)=>({
 id:`${day}-${q.id}`,questionId:q.id,conceptId:id,bankVersion:q.version,correct:i<correct,
 choiceId:i<correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,
 answeredAt:new Date(Date.UTC(2026,9,day,12,i)).toISOString(),sessionId:`${day}-${id}`,durationMs:60000
}));

test('The subset is exactly the target prerequisite closure, including both Algebra courses',()=>{
 assert.equal(COURSES[course].targetId,SUBSETS[course].targetId);assert.equal(nodes.length,59);
 const ancestry=new Set();function visit(id){if(ancestry.has(id))return;ancestry.add(id);for(const e of edges.filter(e=>e.type==='prerequisite'&&e.target===id))visit(e.source);}
 visit(target);assert.deepEqual(ancestry,ids);assert.equal(topologicalOrder(nodes,edges).length,59);
 for(const c of nodes){
  assert.ok(c.prerequisites.every(id=>ids.has(id)),c.id);
  assert.equal(catalog.questions.filter(q=>q.conceptId===c.id).length,10,c.id);
 }
 for(const id of ['MATH_057','MATH_058','MATH_081','MATH_082','F02','1.2','1.5'])assert.ok(ids.has(id));
 for(const id of ['MATH_078','1.7','2.1','6.1','10.1'])assert.ok(!ids.has(id));
 assert.equal(edges.filter(e=>e.type==='prerequisite'&&e.source===target).length,0);
});
test('Subset definitions reject dangling dependencies, cycles, and disconnected bridges',()=>{
 const concepts=[{id:'a'},{id:'b'},{id:'c'}];
 assert.throws(()=>assembleSubsets(concepts,[],{X:{targetId:'missing',bridges:[]}}),/Unknown subset target/);
 assert.throws(()=>assembleSubsets(concepts,[],{X:{targetId:'b',bridges:[['missing','b','reason']]}}),/Unknown subset endpoint/);
 assert.throws(()=>assembleSubsets(concepts,[],{X:{targetId:'b',bridges:[['a','b','reason'],['b','a','reason']]}}),/Cyclic/);
 assert.throws(()=>assembleSubsets(concepts,[],{X:{targetId:'c',bridges:[['a','b','reason']]}}),/does not lead/);
});
test('Cross-course links appear in node prerequisites and mixed graphs, but never alter the full courses',()=>{
 for(const [source,destination] of SUBSETS[course].bridges){
  assert.ok(nodes.find(c=>c.id===destination).prerequisites.includes(source));
  for(const path of ['ALG1','ALG2','AB','BC'])assert.equal(relationshipInCourse(path,edges.find(e=>e.source===source&&e.target===destination)),false);
 }
 const layout=graphLayout(nodes,edges),positions=new Map(layout.nodes.map(c=>[c.id,c]));
 for(const e of edges.filter(e=>e.type==='prerequisite'))assert.ok(positions.get(e.source).x<positions.get(e.target).x);
 const svg=drawGraph(layout,catalog.units,{standalone:true});assert.match(svg,/Algebra I</);assert.match(svg,/Algebra II</);assert.match(svg,/Calculus foundations/);
 assert.match(svg,/data-source="MATH_057" data-target="1.6"/);assert.match(svg,/data-source="MATH_082" data-target="F02"/);
 const neighborhood=new Set([target,...nodes.find(c=>c.id===target).prerequisites]);
 const focus=graphLayout(nodes.filter(c=>neighborhood.has(c.id)),edges,{focus:target});
 for(const e of focus.edges.filter(e=>e.type==='prerequisite'))assert.ok(focus.nodes.find(c=>c.id===e.source).x<focus.nodes.find(c=>c.id===e.target).x,'Mixed focus preserves prerequisite order');
});
test('Onboarding offers the subset, counts its concepts, and persists its selection',()=>{
 const html=renderOnboarding({step:'course',course:'BC',concepts:catalog.concepts});
 assert.match(html,/Choose Calculus subset/);assert.match(html,/Experimental subset · 59 concepts/);
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.equal(saveCourse(storage,course),true);assert.equal(readCourse(storage),course);
 assert.equal(courseIncludes(course,catalog.concepts.find(c=>c.id===target)),true);
});
test('Diagnostics start at limits, retain 8/10 passing, and route through cross-course gaps',()=>{
 assert.equal(diagnose().recommendation.targetId,target);
 assert.equal(diagnose(answers(target).slice(0,9)).recommendation.kind,'continue');
 assert.equal(diagnose(answers(target)).nodes.get(target).status,'passed');
 const gap=diagnose([...answers('MATH_082',6),...answers(target,7,13)]);
 assert.equal(gap.recommendation.kind,'prerequisite');assert.ok(gap.recommendation.path.includes('MATH_082'),'A measured rational-expression gap is followed from the limit node');
 assert.equal([...gap.nodes.values()].filter(n=>n.status!=='unseen').length,2);
 for(const c of nodes){
  const d=diagnose(answers(c.id));assert.ok(ids.has(d.recommendation.targetId),c.id);
 }
 const complete=diagnose(nodes.flatMap(c=>answers(c.id)));assert.equal(complete.recommendation.kind,'complete');
});
test('Shared mastery survives course changes; outside attempts do not affect subset profiles or reports',()=>{
 const attempts=[...answers(target),...answers('MATH_057'),...answers('MATH_082',7),...answers('10.1',10,14),...answers('MATH_078',10,15)];
 const d=diagnose(attempts);assert.equal(d.nodes.size,59);assert.notEqual(d.latestId,'MATH_078');
 for(const [id,path] of [[target,'AB'],[target,'BC'],['MATH_057','ALG1'],['MATH_082','ALG2']])assert.equal(d.nodes.get(id).correctnessScore,diagnose(attempts,path).nodes.get(id).correctnessScore);
 const report=reportData({...catalog,course,attempts});assert.equal(report.profile.total,59);assert.equal(report.attemptCount,30);
 assert.equal(report.rows.length,59);assert.ok(report.weak.some(r=>r.concept.id==='MATH_082'));assert.ok(report.strengths.some(r=>r.concept.id===target));
 for(const view of Object.values(report.views))assert.equal(view.size,59);
 assert.ok(report.map.edges.some(e=>e.source==='MATH_082'&&e.target===target));
 assert.ok(report.rows.find(r=>r.concept.id===target).concept.prerequisites.includes('MATH_057'));
});
