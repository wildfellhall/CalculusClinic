import {stats} from './core.mjs';
import {COURSES,courseIncludes} from './course.mjs';

export const PASS_THRESHOLD=.8;
export const DIAGNOSTIC_LABELS={unseen:'Not checked',partial:'In progress',passed:'Check passed',review:'Review suggested'};
const chronology=(a,b)=>a.answeredAt.localeCompare(b.answeredAt)||a.id.localeCompare(b.id);

// A transparent routing rule, not a probability of student mastery. Only
// observed answers populate nodes; passing never grants inferred credit to
// prerequisites or dependents. Rebuild from saved history instead of caching a
// separate recommendation, so imports, deletion and retries stay consistent.
export function diagnosticState({concepts,relationships,questions,attempts,course='BC',passThreshold=PASS_THRESHOLD}){
  const eligible=concepts.filter(c=>courseIncludes(course,c));
  const byId=new Map(eligible.map(c=>[c.id,c])),order=new Map(eligible.map((c,i)=>[c.id,i]));
  const itemIds=new Map(eligible.map(c=>[c.id,[]])),records=new Map(eligible.map(c=>[c.id,[]]));
  const knownQuestions=new Map(questions.filter(q=>byId.has(q.conceptId)).map(q=>[q.id,q]));
  for(const q of knownQuestions.values())itemIds.get(q.conceptId).push(q.id);
  for(const a of attempts){const q=knownQuestions.get(a.questionId);if(q&&q.conceptId===a.conceptId)records.get(a.conceptId).push(a);}
  const nodes=new Map();
  for(const c of eligible){
    const history=records.get(c.id).sort(chronology),s=stats(history,itemIds.get(c.id));
    // Keep the agreed pass rule about answers, independent of the small timing
    // adjustment retained in the exported practice-mastery score.
    const status=!s.attempted?'unseen':s.attempted<s.available?'partial':s.correctnessScore>=passThreshold?'passed':'review';
    nodes.set(c.id,{...s,status,lastAttempt:history.at(-1)??null});
  }
  const parents=new Map(eligible.map(c=>[c.id,[]])),children=new Map(eligible.map(c=>[c.id,[]]));
  for(const e of relationships){
    if(e.type!=='prerequisite'||!byId.has(e.source)||!byId.has(e.target))continue;
    parents.get(e.target).push(e.source);children.get(e.source).push(e.target);
  }
  const recent=[...nodes.keys()].filter(id=>nodes.get(id).lastAttempt).sort((a,b)=>chronology(nodes.get(b).lastAttempt,nodes.get(a).lastAttempt));
  const latestId=recent[0]??null,latestPassedId=recent.find(id=>nodes.get(id).status==='passed')??null;
  const summary={passed:0,review:0,partial:0,unseen:0};
  for(const s of nodes.values())summary[s.status]++;
  const base={nodes,summary,latestId,latestPassedId,passThreshold};
  const title=id=>byId.get(id).title;
  const evidence=id=>`${nodes.get(id).latestCorrect}/${nodes.get(id).available} latest answers correct`;
  const result=(kind,targetId,anchorId,reason,path=[])=>({...base,recommendation:{kind,targetId,anchorId,reason,path}});
  const stable=(a,b)=>order.get(a)-order.get(b);
  const passed=id=>nodes.get(id).status==='passed';
  const unresolved=id=>nodes.get(id).available>0&&!passed(id);
  const weakCount=id=>parents.get(id).filter(p=>nodes.get(p).status==='review').length;
  const distancesFrom=anchor=>{
    const distances=new Map([[anchor,0]]),queue=[anchor];
    for(let i=0;i<queue.length;i++)for(const id of [...parents.get(queue[i]),...children.get(queue[i])]){
      if(!distances.has(id)){distances.set(id,distances.get(queue[i])+1);queue.push(id);}
    }
    return distances;
  };
  // Prefer a measured gap over an unknown prerequisite. Descend through known
  // gaps, but stop at an unknown/partial node and test it rather than assuming
  // that its entire ancestry is weak.
  const probe=id=>{
    const path=[id],seen=new Set(path);
    while(true){
      const candidates=parents.get(path.at(-1)).filter(p=>unresolved(p)&&!seen.has(p));
      const priority={review:0,partial:1,unseen:2};
      candidates.sort((a,b)=>priority[nodes.get(a).status]-priority[nodes.get(b).status]||(nodes.get(a).correctnessScore??1)-(nodes.get(b).correctnessScore??1)||stable(a,b));
      if(!candidates.length)return path;
      const next=candidates[0];path.push(next);seen.add(next);
      if(nodes.get(next).status!=='review')return path;
    }
  };
  if(!eligible.some(c=>nodes.get(c.id).available))return result('complete',null,null,'There are no questions available for this course.');
  if(!latestId){
    const entry=COURSES[course]?.entryId;
    const start=byId.has(entry)&&nodes.get(entry).available?entry:eligible.find(c=>nodes.get(c.id).available).id;
    return result('start',start,null,'Start with this check to choose a direction through the graph. You can also choose any concept below.');
  }
  const latest=nodes.get(latestId);
  if(latest.status==='partial')return result('continue',latestId,latestId,`${latest.attempted}/${latest.available} questions tried in ${title(latestId)}. Finish the unanswered questions before choosing the next branch.`,[latestId]);
  if(latest.status==='review'){
    const path=probe(latestId),target=path.at(-1);
    if(target!==latestId)return result('prerequisite',target,latestId,`${title(latestId)} has ${evidence(latestId)}. Check this prerequisite${path.length>2?' further back in its chain':''} to help locate the gap.`,path);
    // Once a gap has been isolated, keep sampling instead of trapping a learner
    // in immediate repeats of the same check. The gap stays in their record.
    const distances=distancesFrom(latestId);
    const unexplored=eligible.map(c=>c.id).filter(id=>nodes.get(id).available&&['unseen','partial'].includes(nodes.get(id).status));
    unexplored.sort((a,b)=>weakCount(a)-weakCount(b)||(distances.get(a)??Infinity)-(distances.get(b)??Infinity)||stable(a,b));
    if(unexplored.length)return result('explore',unexplored[0],latestId,`${title(latestId)} is saved for review (${evidence(latestId)}). Check another concept to map more of your strengths and gaps.`,[latestId,unexplored[0]]);
    return result('revisit',latestId,latestId,`${title(latestId)} has ${evidence(latestId)}. ${parents.get(latestId).length?'Its direct prerequisites have passed their checks. ':''}Review the explanations, then retry the questions to check this gap.`,[latestId]);
  }
  const anchor=latestPassedId;
  // Search forward through passed nodes. An unpassed node is the next frontier;
  // do not skip it to recommend a more distant dependent.
  const queue=[{id:anchor,path:[anchor]}],seen=new Set([anchor]),frontier=[];
  for(let i=0;i<queue.length;i++){
    const current=queue[i];
    for(const id of children.get(current.id)){
      if(seen.has(id))continue;seen.add(id);
      const entry={id,path:[...current.path,id]};
      if(passed(id))queue.push(entry);else if(unresolved(id))frontier.push(entry);
    }
  }
  const weakParents=id=>parents.get(id).filter(p=>nodes.get(p).status==='review');
  const rank={review:0,partial:1,unseen:2};
  frontier.sort((a,b)=>a.path.length-b.path.length||weakParents(a.id).length-weakParents(b.id).length||rank[nodes.get(a.id).status]-rank[nodes.get(b.id).status]||stable(a.id,b.id));
  if(frontier.length){
    const next=frontier[0],path=nodes.get(next.id).status==='review'||weakParents(next.id).length?probe(next.id):[next.id],target=path.at(-1);
    if(target!==next.id)return result('prerequisite',target,anchor,`${title(anchor)} passed with ${evidence(anchor)}. Before checking ${title(next.id)}, check this unresolved prerequisite.`,[...next.path,...path.slice(1)]);
    const returning=nodes.get(target).status==='review';
    return result(returning?'revisit':'advance',target,anchor,`${title(anchor)} passed with ${evidence(anchor)}. ${returning?'Return to this dependent concept to see whether its gap has narrowed.':`This ${next.path.length>2?'next':'dependent'} concept builds on that result.`}`,next.path);
  }
  // At a leaf or completed branch, explore a nearby unfinished branch. Graph
  // distance uses prerequisite edges in either direction, never topic numbers
  // or the unrelated/contrast edges. Unknown nodes remain unknown.
  const distances=distancesFrom(anchor);
  const remaining=eligible.map(c=>c.id).filter(unresolved).sort((a,b)=>(distances.get(a)??Infinity)-(distances.get(b)??Infinity)||rank[nodes.get(a).status]-rank[nodes.get(b).status]||stable(a,b));
  if(!remaining.length)return result('complete',null,anchor,'Every concept in this course has passed its practice check. You can still revisit any concept.');
  const next=remaining[0],path=nodes.get(next).status==='review'||weakParents(next).length?probe(next):[next],target=path.at(-1);
  return result(target===next?'explore':'prerequisite',target,anchor,`${title(anchor)} passed with ${evidence(anchor)}. ${target!==next?'Check a prerequisite in the next unfinished branch.':distances.has(next)?'Check this nearby concept to fill in another part of the graph.':'This branch is checked; sample another part of the course.'}`,path);
}
