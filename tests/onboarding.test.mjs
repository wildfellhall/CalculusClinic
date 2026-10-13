import test from 'node:test';
import assert from 'node:assert/strict';
import {ONBOARDING_KEY,readOnboarding,saveOnboarding} from '../src/onboarding.mjs';
const store=()=>{const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};
test('First visits choose a course, and previously selected courses receive the new tour',()=>{
 const s=store();assert.equal(readOnboarding(s,null),'course');assert.equal(readOnboarding(s,'AB'),'tutorial');
 for(const step of ['course','tutorial','camera']){assert.equal(saveOnboarding(s,step),true);assert.equal(readOnboarding(s,'AB'),step);}
});
test('Completion distinguishes calibration from opting out and does not bypass course choice',()=>{
 const s=store();
 for(const outcome of ['calibrated','skipped']){saveOnboarding(s,'complete',outcome);assert.equal(readOnboarding(s,'BC'),null);assert.equal(readOnboarding(s,null),'course');assert.equal(JSON.parse(s.getItem(ONBOARDING_KEY)).cameraOutcome,outcome);}
 assert.throws(()=>saveOnboarding(s,'complete'));assert.throws(()=>saveOnboarding(s,'unknown'));
});
test('Interrupted or malformed setup resumes safely without modifying practice or camera data',()=>{
 const s=store();s.setItem('calculus-clinic-progress-v1','answers');s.setItem('calculus-clinic-camera-v1','camera off');
 for(const raw of ['invalid','null','{}','{"version":2,"step":"complete"}','{"version":1,"step":[]}']){s.setItem(ONBOARDING_KEY,raw);assert.equal(readOnboarding(s,'ALG1'),'tutorial');}
 s.setItem(ONBOARDING_KEY,'{"version":1,"step":"complete"}');assert.equal(readOnboarding(s,'ALG2'),'camera');
 saveOnboarding(s,'camera');assert.equal(readOnboarding(s,'ALG2'),'camera');
 assert.equal(s.getItem('calculus-clinic-progress-v1'),'answers');assert.equal(s.getItem('calculus-clinic-camera-v1'),'camera off');
 assert.deepEqual(Object.keys(JSON.parse(s.getItem(ONBOARDING_KEY))).sort(),['step','version']);
});
test('Blocked storage permits onboarding for the current visit without claiming persistence',()=>{
 const s={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
 assert.equal(readOnboarding(s,null),'course');assert.equal(readOnboarding(s,'AB'),'tutorial');assert.equal(saveOnboarding(s,'complete','calibrated'),false);
});
