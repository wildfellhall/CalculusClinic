// Local Chrome fallback QA. Uses an isolated profile, never the user's browser.
// Start headless Chrome with --remote-debugging-port=9224, then run this script.
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {enterCourse} from './browser-course-setup.mjs';
import {questions,BANK_VERSION} from '../data/questions.mjs';
const targets=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const target=targets.find(t=>t.type==='page');
if(!target)throw new Error('No isolated Chrome page is available.');
const ws=new WebSocket(target.webSocketDebuggerUrl),pending=new Map(),errors=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);};
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>{pending.delete(id);reject(new Error('Timed out: '+method));},15000)});ws.send(JSON.stringify({id,method,params,sessionId}));});
const run=async (expression,sessionId)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<60;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression);};
const click=selector=>run(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw new Error('Missing element: '+${JSON.stringify(selector)});el.click();return true})()`);
const change=(selector,value)=>run(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('change',{bubbles:true}));})()`);

const shot=async name=>{await run('document.fonts.ready');await run('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(`test-results/${name}.png`,Buffer.from(r.data,'base64'));};
const mobile=async width=>{
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,screenWidth:width,screenHeight:844,deviceScaleFactor:1,mobile:true});
  await send('Emulation.setPageScaleFactor',{pageScaleFactor:1});
  await waitFor(`innerWidth===${width}`);
  await run('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
};
const start=async id=>{
  await click('[data-action="view"][data-view="practice"]');
  // The active set remains available until a new concept is selected.
  if(await run('!!document.querySelector(".practice-top")'))await click('.practice-top [data-action="select"]');
  await click('[data-action="view"][data-view="practice"]');
  await change('#practice-concept',id);await click('[data-action="start-picked"]');
  await waitFor('!!document.querySelector(".question-title")');
};
const answer=async id=>{
  const q=questions.find(q=>q.id===id);
  await click(`input[value="${q.correctOptionId}"]`);await click('[data-action="submit"]');
  await waitFor('!!document.querySelector(".answer-feedback")');
  await click('[data-action="next"]');
};
const noPageOverflow=async()=>assert.ok(await run('document.documentElement.scrollWidth<=innerWidth+1'),'No horizontal page overflow');

await mkdir('test-results',{recursive:true});
try{
  await send('Runtime.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:3000'});
  await enterCourse(run,waitFor);
  await run('localStorage.removeItem("calculus-clinic-progress-v1")');
  await send('Page.reload');await waitFor('!!document.querySelector(".explore-home")');
  await start('1.6');
  assert.ok(await run('!!document.querySelector(".question-title math mfrac")'));
  assert.ok(await run('!!document.querySelector(".question-title math munder")'));
  assert.equal(await run('document.querySelectorAll(".katex-error").length'),0);
  await shot('math-limits-desktop');
  for(let i=1;i<=10;i++)await answer(`1.6-Q${i}`);
  await waitFor('!!document.querySelector(".practice-complete")');
  await click('.review-list details summary');
  assert.ok(await run('!!document.querySelector(".review-list .review-prompt math")'));
  assert.equal(await run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1")).attempts.length'),10);
  await shot('math-review-desktop');
  await click('[data-action="select"][data-id="1.6"]');
  await start('6.3');
  assert.ok(await run('document.querySelectorAll(".question-title math munder").length>=1'));
  assert.ok(await run('!!document.querySelector(".question-title math munderover")'));
  assert.ok(await run('!!document.querySelector(".answer-options math msubsup")'));
  await shot('math-integrals-desktop');

  // Render every authored math field in a narrow fixture to exercise fonts,
  // layout and the runtime renderer, without affecting practice records.
  const audit=await run(`(async()=>{
    const {formatMathText,refreshMathOverflow}=await import('/src/math.mjs');
    const {mathText}=window.CALCULUS_DATA;
    const box=document.createElement('div');box.style.cssText='position:absolute;left:0;top:0;width:270px;font-size:23px;visibility:hidden;';document.body.append(box);
    let expressions=0,scrollable=0;const failures=[];
    for(const source of Object.keys(mathText)){
      box.innerHTML=formatMathText(source,mathText);expressions+=box.querySelectorAll('math').length;
      if(box.querySelector('.katex-error'))failures.push(source);
      for(const el of box.querySelectorAll('.math-inline')){
        if(el.scrollWidth>el.clientWidth+1)scrollable++;
        if(el.getBoundingClientRect().width>272)failures.push(source);
      }
    }
    await document.fonts.ready;
    box.innerHTML=formatMathText(''+Object.keys(mathText).find(s=>s.includes('(x+4)/[(x+1)(x+2)]')),mathText);refreshMathOverflow();
    const focusable=[...box.querySelectorAll('.math-inline')].filter(e=>e.scrollWidth>e.clientWidth+1).every(e=>e.tabIndex===0);
    box.remove();return {expressions,scrollable,failures,focusable};
  })()`);
  assert.deepEqual(audit.failures,[]);assert.ok(audit.expressions>5000);assert.ok(audit.scrollable>0);assert.ok(audit.focusable);
  console.log('All-field math audit:',audit);

  await mobile(390);
  await run('document.fonts.ready');await noPageOverflow();
  await shot('math-integrals-mobile');
  await answer('6.3-Q1');
  await click('.practice-top [data-action="select"]');
  await start('6.12');
  for(let i=1;i<10;i++)await answer(`6.12-Q${i}`);
  await mobile(320);
  await noPageOverflow();await run('document.fonts.ready');
  // Long formulas scroll as a whole, keeping fraction rows from colliding.
  assert.ok(await run('[...document.querySelectorAll(".question-title .math-inline")].every(e=>e.getBoundingClientRect().right<=innerWidth&&(e.scrollWidth<=e.clientWidth+1||e.tabIndex===0))'));
  assert.ok(await run('(()=>{const e=[...document.querySelectorAll(".question-title .math-inline")].find(e=>e.scrollWidth>e.clientWidth+1);if(!e)return false;e.scrollLeft=e.scrollWidth;const moved=e.scrollLeft>0;e.scrollLeft=0;return moved&&getComputedStyle(e,"::after").content.includes("Scroll formula")})()'));
  await shot('math-long-formula-mobile');
  await mobile(390);
  await click('.practice-top [data-action="select"]');
  await click('[data-action="tab"][data-tab="notes"]');
  assert.ok(await run('!!document.querySelector(".concept-notes math")'));
  await noPageOverflow();await shot('math-notes-mobile');
  await click('[data-action="view"][data-view="progress"]');
  await click('.question-history summary');
  assert.ok(await run('!!document.querySelector(".question-history math")'));
  await click('[data-action="view"][data-view="graph"]');
  await change('#graph-concept','1.6');
  assert.ok(await run('[...document.querySelectorAll(".graph-node")].some(e=>e.dataset.mastery==="100")'));
  assert.deepEqual(errors,[]);
  console.log('Math browser checks passed: notation, all authored fields, review/history, persistence, graph, desktop/mobile, scrollable long formulas.');
}finally{ws.close();}
