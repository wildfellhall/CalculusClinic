import test from 'node:test';
import assert from 'node:assert/strict';
import {stats,validateBackup,mergeAttempts} from '../src/core.mjs';
import {graphLayout,drawGraph,masteryFill,UNPRACTICED_FILL} from '../src/graph.mjs';
import {questions,COMPATIBLE_BANK_VERSIONS} from '../data/questions.mjs';
import {concepts,relationships,units} from '../data/curriculum.mjs';

const items=questions.filter(q=>q.conceptId==='1.11'),ids=items.map(q=>q.id);
const record=(index,correct=true,time=index)=>{
  const q=items[index];
  return {id:`attempt-${index}-${time}`,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,11,12,time)).toISOString(),sessionId:'mastery-test'};
};
test('Mastery distinguishes unpracticed from a practiced zero, including empty banks',()=>{
  assert.equal(stats([],ids).masteryScore,null);
  assert.equal(stats([record(0,false)],ids).masteryScore,0);
  assert.equal(stats([record(0)],[]).masteryScore,null);
  assert.equal(masteryFill(null),UNPRACTICED_FILL);
  assert.notEqual(masteryFill(0),UNPRACTICED_FILL);
});
test('Mastery counts distinct latest correct answers against the whole bank',()=>{
  const one=stats([record(0)],ids);
  assert.equal(one.latestAccuracy,1);assert.equal(one.masteryScore,.1);
  assert.equal(stats([record(0),record(1),record(2,false)],ids).masteryScore,.2);
  assert.equal(stats(items.map((_,i)=>record(i)),ids).masteryScore,1);
  assert.equal(stats([record(0)],['F01-Q1']).masteryScore,null);
});
test('Retries can raise or lower mastery without duplicate credit or rewriting first accuracy',()=>{
  const attempts=[record(0,false),record(0,true,20),record(0,true,21)];
  assert.equal(stats(attempts,ids).masteryScore,.1);
  assert.equal(stats(attempts,ids).firstAccuracy,0);
  attempts.push(record(0,false,22));
  assert.equal(stats(attempts.reverse(),ids).masteryScore,0);
});
test('Saved history and old backups reconstruct the same mastery without trusting a cached score',()=>{
  const legacy=items.slice(0,5).map((_,i)=>record(i));
  const backup=JSON.parse(JSON.stringify({schemaVersion:1,bankVersion:'1.0.0',masteryScore:1,attempts:legacy}));
  const restored=validateBackup(backup,questions,COMPATIBLE_BANK_VERSIONS);
  assert.equal(stats(restored,ids).masteryScore,.5);
  assert.equal(stats(mergeAttempts(restored,restored),ids).masteryScore,.5);
  assert.equal(stats([],ids).masteryScore,null);
});
const luminance=hex=>{
  const rgb=hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
test('Higher mastery is visibly darker while text stays readable on every fill',()=>{
  let previous=1;
  for(let i=0;i<=100;i++){
    const fill=masteryFill(i/100),light=luminance(fill);
    assert.ok(light<=previous,`${i}% must be darker than the previous score`);
    assert.ok((light+.05)/(luminance('#294637')+.05)>=4.5,`${i}% text contrast`);
    previous=light;
  }
  assert.equal(masteryFill(.25),'#ddfeea');
  assert.equal(masteryFill(-1),masteryFill(0));assert.equal(masteryFill(2),masteryFill(1));
});
test('Selected nodes retain their mastery fill and expose the score without relying on color',()=>{
  const c=concepts.find(c=>c.id==='1.11'),layout=graphLayout([c],[]),progress=new Map([[c.id,stats([record(0),record(1)],ids)]]);
  const normal=drawGraph(layout,units,{progress}),selected=drawGraph(layout,units,{progress,selected:c.id});
  for(const svg of [normal,selected]){
    assert.ok(svg.includes(`fill="${masteryFill(.2)}"`));assert.ok(svg.includes('20% · 2/10 tried'));
    assert.ok(svg.includes('aria-label="Explore Continuity at a point. Practice mastery 20%.'));
    assert.ok(svg.includes('data-mastery="20"'));
  }
  assert.ok(selected.includes('aria-pressed="true"'));
});
test('Personal SVG exports include scores and a legend; the public curriculum export stays neutral',()=>{
  const c=concepts.find(c=>c.id==='1.11'),layout=graphLayout([c],[]),progress=new Map([[c.id,stats([record(0)],ids)]]);
  const personal=drawGraph(layout,units,{standalone:true,progress});
  assert.ok(personal.includes('Practice mastery = latest correct answers'));
  assert.ok(personal.includes('10% · 1/10 tried'));
  const curriculum=drawGraph(layout,units,{standalone:true});
  assert.ok(!curriculum.includes('node-mastery'));assert.ok(!curriculum.includes('Practice mastery ='));
});
test('All node titles and mastery labels fit inside non-overlapping cards on desktop and mobile',()=>{
  for(const options of [{},{focus:'1.11',compact:true}]){
    const layout=graphLayout(concepts,relationships,options);
    const svg=drawGraph(layout,units,{progress:new Map()});
    for(const group of svg.matchAll(/<g class="graph-node[\s\S]*?<\/g>/g)){
      const height=Number(group[0].match(/class="node-card"[^>]*height="([\d.]+)"/)[1]);
      const baseline=[...group[0].matchAll(/<text[^>]*y="([\d.]+)"/g)].map(m=>Number(m[1]));
      assert.ok(baseline.every(y=>y<height-5));
      assert.ok(baseline.at(-1)-baseline.at(-2)>=16);
    }
    for(let i=0;i<layout.nodes.length;i++)for(const b of layout.nodes.slice(i+1)){
      const a=layout.nodes[i];
      assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,`${a.id} overlaps ${b.id}`);
    }
  }
});
