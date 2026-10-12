import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {questions,BANK_VERSION,COMPATIBLE_BANK_VERSIONS} from '../data/questions.mjs';
import {concepts} from '../data/curriculum.mjs';
import {stats,validateAttempts,validateBackup} from '../src/core.mjs';

const legacy=questions.filter(q=>Number(q.id.split('-Q')[1])<=5);
test('The original 635 questions remain byte-for-byte compatible with saved answers',()=>{
  const expected=readFileSync(new URL('./fixtures/questions-v1.sha256',import.meta.url),'utf8').trim();
  assert.equal(legacy.length,635);
  assert.equal(createHash('sha256').update(JSON.stringify(legacy)).digest('hex'),expected);
});
test('Every concept adds exactly Q6–Q10 with distinct prompts and valid new item versions',()=>{
  assert.equal(BANK_VERSION,'1.1.0');
  for(const c of concepts){
    const added=questions.filter(q=>q.conceptId===c.id&&!legacy.includes(q));
    assert.deepEqual(added.map(q=>q.id),[6,7,8,9,10].map(n=>`${c.id}-Q${n}`));
    assert.ok(added.every(q=>q.version==='1.1.0'));
    assert.equal(new Set(questions.filter(q=>q.conceptId===c.id).map(q=>q.prompt.toLowerCase().replace(/\s+/g,' ').trim())).size,10);
  }
});
const record=(q,index=0)=>({id:`compat-${index}`,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:q.correctOptionId,correct:true,answeredAt:'2026-10-11T12:00:00.000Z',sessionId:'compatibility'});
test('All legacy item records and version-1.0 backups validate against the expanded bank',()=>{
  const attempts=legacy.map(record);
  assert.equal(validateAttempts(attempts,questions).length,635);
  assert.equal(validateBackup({schemaVersion:1,bankVersion:'1.0.0',attempts},questions,COMPATIBLE_BANK_VERSIONS).length,635);
});
test('Expanded backups accept mixed item versions and reject unsupported banks or mismatched items',()=>{
  const added=questions.find(q=>q.id==='1.11-Q6');
  const attempts=[record(legacy[0]),record(added,1)];
  assert.equal(validateBackup({schemaVersion:1,bankVersion:BANK_VERSION,attempts},questions,COMPATIBLE_BANK_VERSIONS).length,2);
  assert.throws(()=>validateBackup({schemaVersion:1,bankVersion:'9.0.0',attempts},questions,COMPATIBLE_BANK_VERSIONS),/unsupported/);
  assert.throws(()=>validateAttempts([{...record(added),bankVersion:'1.0.0'}],questions),/version/);
});
test('Unanswered new questions expand coverage without changing earlier accuracy',()=>{
  const items=questions.filter(q=>q.conceptId==='1.11'),old=items.slice(0,5);
  const attempts=old.map(record);attempts[0].correct=false;
  const before=stats(attempts,old.map(q=>q.id)),after=stats(attempts,items.map(q=>q.id));
  assert.equal(after.available,10);assert.equal(after.attempted,5);
  assert.equal(after.firstAccuracy,before.firstAccuracy);assert.equal(after.latestAccuracy,before.latestAccuracy);
  assert.equal(after.firstAccuracy,.8);
});

// Independently compute representative numeric answers from the new questions.
const integrate=(f,a,b,n=12000)=>{let sum=f(a)+f(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(a+(b-a)*i/n);return sum*(b-a)/(3*n);};
const euler=(f,x,y,h,n)=>{for(let i=0;i<n;i++){y+=h*f(x,y);x+=h;}return y;};
const checks=[
  ['4.5-Q8',()=>-5*3/Math.sqrt(13**2-5**2),{'−5/4 ft/s':-5/4,'5/4 ft/s':5/4,'−36/5 ft/s':-36/5}],
  ['4.5-Q9',()=>(3*2+4*1)/Math.hypot(3,4),{'2 km/h':2,'3 km/h':3,'14/5 km/h':14/5}],
  ['6.2-Q7',()=>2*1+3*3,{'11':11,'12':12,'10':10}],
  ['6.9-Q7',()=>integrate(x=>6*x*(1+x*x)**2,0,1),{'7':7,'21':21,'3':3}],
  ['6.11-Q7',()=>integrate(x=>x*Math.exp(2*x),0,1),{'(e²+1)/4':(Math.exp(2)+1)/4,'(e²−1)/4':(Math.exp(2)-1)/4,'e²/2':Math.exp(2)/2}],
  ['6.11-Q10',()=>integrate(x=>x*Math.cos(x),0,Math.PI/2),{'π/2−1':Math.PI/2-1,'π/2+1':Math.PI/2+1,'1':1}],
  ['6.12-Q9',()=>integrate(x=>1/(x*(x+1)),1,2),{'ln(4/3)':Math.log(4/3),'ln(3/4)':Math.log(3/4),'ln 2':Math.log(2)}],
  ['6.13-Q6',()=>integrate(t=>t,0,.5),{'1/8':1/8,'1/4':1/4,'Diverges':Infinity}],
  ['7.5-Q6',()=>euler((x,y)=>x+y,0,1,.5,2),{'2.5':2.5,'2':2,'2.25':2.25}],
  ['7.5-Q7',()=>euler((x,y)=>2*x-y,1,3,-.2,1),{'3.2':3.2,'2.8':2.8,'2.6':2.6}],
  ['7.5-Q8',()=>euler((x,y)=>-2*y,0,4,.25,2),{'1':1,'2':2,'0':0}],
  ['8.2-Q6',()=>integrate(t=>2*t-2,0,3),{'3':3,'5':5,'6':6}],
  ['8.2-Q7',()=>integrate(t=>Math.abs(2*t-2),0,3),{'5':5,'3':3,'1':1}],
  ['8.4-Q6',()=>integrate(x=>2*x-x*x,0,2),{'4/3':4/3,'8/3':8/3,'2/3':2/3}],
  ['8.6-Q6',()=>integrate(x=>Math.abs(x*x-1),-2,2),{'4':4,'8/3':8/3,'4/3':4/3}],
  ['8.7-Q6',()=>integrate(x=>(2-x)**2,0,2),{'8/3':8/3,'2':2,'4':4}],
  ['8.8-Q6',()=>integrate(x=>Math.PI*x*x/2,0,2),{'4π/3':4*Math.PI/3,'16π/3':16*Math.PI/3,'8π/3':8*Math.PI/3}],
  ['8.11-Q6',()=>integrate(x=>Math.PI*(x-1),1,4),{'9π/2':9*Math.PI/2,'15π/2':15*Math.PI/2,'3π':3*Math.PI}],
  ['8.11-Q7',()=>integrate(x=>Math.PI*(x*x-x**4),0,1),{'2π/15':2*Math.PI/15,'π/30':Math.PI/30,'π/6':Math.PI/6}],
  ['8.12-Q9',()=>integrate(x=>Math.PI*(4-(2-x)**2),0,1),{'5π/3':5*Math.PI/3,'π/3':Math.PI/3,'4π':4*Math.PI}],
  ['8.13-Q8',()=>integrate(x=>Math.sqrt(1+x),0,3),{'14/3':14/3,'8/3':8/3,'7':7}],
  ['9.3-Q7',()=>integrate(t=>Math.abs(2*t),-1,1),{'2':2,'0':0,'1':1}],
  ['9.8-Q8',()=>integrate(t=>.5*(2*Math.cos(2*t))**2,-Math.PI/4,Math.PI/4),{'π/2':Math.PI/2,'π':Math.PI,'π/4':Math.PI/4}],
  ['9.9-Q10',()=>integrate(t=>.5*(4-Math.cos(t)**2),-Math.PI/2,Math.PI/2),{'7π/4':7*Math.PI/4,'3π/2':3*Math.PI/2,'2π':2*Math.PI}],
  ['10.11-Q8',()=>[1,.1,.1**2/2].reduce((a,b)=>a+b),{'1.105':1.105,'1.11':1.11,'1.005':1.005}],
  ['10.12-Q6',()=>24*.2**4/(4*3*2*1),{'0.0016':.0016,'0.0064':.0064,'0.0004':.0004}],
];
for(const [id,calculate,values] of checks)test(`Independent check of added answer ${id}`,()=>{
  const q=questions.find(q=>q.id===id),answer=q.options.find(o=>o.id===q.correctOptionId).text;
  const result=calculate();
  assert.ok(Number.isFinite(values[answer]),`Missing numeric mapping for ${id}: ${answer}`);
  assert.ok(Math.abs(result-values[answer])<1e-7,`${id}: calculation ${result}, key ${answer}`);
  assert.equal(q.options.filter(o=>Math.abs(result-values[o.text])<1e-7).length,1);
});
test('The new telescoping-series sum matches partial sums with a vanishing tail',()=>{
  const q=questions.find(q=>q.id==='10.1-Q8'),answer=q.options.find(o=>o.id===q.correctOptionId).text;
  const sum=Array.from({length:100000},(_,i)=>1/((i+1)*(i+3))).reduce((a,b)=>a+b,0);
  const values={'3/4':.75,'1/2':.5,'1':1};
  assert.ok(Math.abs(sum-values[answer])<.000011);
});
