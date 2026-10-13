import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSE_KEY,readCourse,saveCourse} from '../src/course.mjs';

function storage(){const values=new Map();return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};}
test('A first visit requires an explicit course choice; either course survives reload',()=>{
  const s=storage();assert.equal(readCourse(s),null);
  for(const course of ['AB','BC','AB']){assert.equal(saveCourse(s,course),true);assert.equal(readCourse(s),course);}
});
test('Invalid or unsupported saved course choices return to onboarding',()=>{
  const s=storage();
  for(const raw of ['invalid','null','{}',...['ab','A','toString',['AB'],null].map(course=>JSON.stringify({version:1,course})),JSON.stringify({version:2,course:'BC'})]){
    s.setItem(COURSE_KEY,raw);assert.equal(readCourse(s),null);assert.equal(s.getItem(COURSE_KEY),raw,'Reading an invalid choice must not silently overwrite storage');
  }
  for(const course of ['A','toString',['AB'],null])assert.throws(()=>saveCourse(s,course));
});
test('Course changes preserve practice history and camera preferences',()=>{
  const s=storage();s.setItem('calculus-clinic-progress-v1','saved answers');s.setItem('calculus-clinic-camera-v1','camera off');
  assert.equal(readCourse(s),null);saveCourse(s,'AB');saveCourse(s,'BC');
  assert.equal(s.getItem('calculus-clinic-progress-v1'),'saved answers');assert.equal(s.getItem('calculus-clinic-camera-v1'),'camera off');
});
test('Unavailable storage does not prevent selecting a course for the current visit',()=>{
  const s={getItem(){throw new Error('Blocked');},setItem(){throw new Error('Full');}};
  assert.equal(readCourse(s),null);assert.equal(saveCourse(s,'AB'),false);
});
