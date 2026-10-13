// Isolated browser QA for local PDF downloads; fabricated records only.
import assert from 'node:assert/strict';
import {enterCourse} from './browser-course-setup.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {questions} from '../data/questions.mjs';
const appURL=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[],requests=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);};
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(new Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params,sessionId}));});
const run=async (expression,sessionId)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true},sessionId);if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<150;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-2500)'));};
const click=s=>run(`document.querySelector(${JSON.stringify(s)}).click()`);
const change=(s,value)=>run(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const snap=async name=>{await run('await document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const fixture=questions.filter(q=>['1.11','1.2','9.1'].includes(q.conceptId)).map((q,i)=>({id:q.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:i%10<8?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct:i%10<8,answeredAt:new Date(Date.UTC(2026,9,12,0,i)).toISOString(),sessionId:'pdf-browser',durationMs:90000}));
const hookDownloads=()=>run('window.qaDownloads=[];window.qaNames=[];URL.createObjectURL=b=>{qaDownloads.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){qaNames.push(this.download)}');
const saveDownload=async(index,name)=>{
  const bytes=await run(`await qaDownloads[${index}].arrayBuffer().then(buffer=>Array.from(new Uint8Array(buffer)))`);
  assert.equal(Buffer.from(bytes).subarray(0,5).toString(),'%PDF-');
  const pdf=await PDFDocument.load(new Uint8Array(bytes));assert.ok(pdf.getPageCount()>7);
  await writeFile('test-results/pdfs/'+name+'.pdf',new Uint8Array(bytes));return pdf;
};
try{
  await mkdir('test-results/pdfs',{recursive:true});await send('Runtime.enable');await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,screenWidth:1440,screenHeight:1080,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:appURL+'/'});await enterCourse(run,waitFor);
  await run(`localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:${JSON.stringify(fixture)}}))`);
  await send('Page.reload');await waitFor('!!document.querySelector(".explore-home")');await click('[data-view="graph"]');
  const original=await stored();assert.equal(await run('typeof PDFLib'),'undefined');assert.equal(await run('typeof fontkit'),'undefined');
  await hookDownloads();
  // A missing font produces a recoverable error; retry must re-fetch resources.
  await run('window.qaFetch=fetch;window.fetch=(url,...args)=>String(url).includes("nunito.ttf")?Promise.resolve(new Response("",{status:404})):qaFetch(url,...args)');
  await click('[data-action="export-report"]');await waitFor('document.querySelector("#toast").textContent.includes("Could not create")');
  assert.equal(await run('qaDownloads.length'),0);assert.equal(await run('document.querySelector("[data-action=export-report]").disabled'),false);
  await run('fetch=qaFetch');await click('[data-action="export-report"]');await waitFor('qaDownloads.length===1');
  const pdf=await saveDownload(0,'browser-focus');assert.ok(pdf.getPages().every(p=>p.getWidth()<1000));
  assert.ok((await run('qaNames[0]')).startsWith('calculus-clinic-bc-report-'));
  assert.deepEqual(await stored(),original);assert.equal(await run('document.querySelector("[data-action=export-report]").disabled'),false);
  await run('document.querySelector(".graph-profile").scrollIntoView({block:"center"})');await snap('report-download-desktop');
  // Keep the snapshot's score preferences and course; the full course is exported from Progress.
  await click('[data-view="settings"]');await click('#include-self-reports');await change('#course','AB');
  await click('[data-view="progress"]');await click('[data-action="export-report"]');await waitFor('qaDownloads.length===2');
  const full=await saveDownload(1,'browser-ab-course');assert.ok(full.getPages().some(p=>p.getWidth()>1000));assert.ok((await run('qaNames[1]')).startsWith('calculus-clinic-ab-report-'));
  assert.deepEqual(await stored(),original);
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,screenWidth:390,screenHeight:844,deviceScaleFactor:1,mobile:true});await waitFor('innerWidth===390');
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
  await run('scrollTo(0,0)');await snap('report-download-progress-mobile');
  // Deleting data during an export cancels it, without restoring old history.
  await run('window.qaCreate=PDFLib.PDFDocument.create;PDFLib.PDFDocument.create=()=>new Promise(resolve=>{window.qaRelease=()=>resolve(qaCreate())})');
  await click('[data-action="export-report"]');await waitFor('typeof qaRelease==="function"');
  await click('[data-view="settings"]');assert.equal(await run('document.querySelector("[data-action=export-report]").disabled'),true);
  await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');await run('qaRelease();PDFLib.PDFDocument.create=qaCreate');
  await waitFor('document.querySelector("#toast").textContent.includes("Report cancelled")');
  assert.equal(await run('qaDownloads.length'),2);assert.deepEqual(await stored(),[]);
  // The Settings export remains usable after cancellation and with no history.
  await run('document.querySelector("[data-action=export-report]").closest("details").open=true');
  await click('[data-action="export-report"]');await waitFor('qaDownloads.length===3');await saveDownload(2,'browser-empty');
  assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);
  assert.deepEqual(errors,[]);assert.ok(requests.filter(url=>url.startsWith('http')).every(url=>url.startsWith(appURL+'/')));
  console.log('PASS lazy local PDF libraries, recoverable download errors, actual PDF bytes, focused and whole-course exports, AB filtering, settings snapshot, mobile bounds, deletion during export, empty reports and unchanged history.');
}finally{ws.close();}
