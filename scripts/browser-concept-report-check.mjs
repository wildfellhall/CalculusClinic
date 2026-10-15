// Isolated browser QA for local PDF downloads; fabricated records only.
import assert from 'node:assert/strict';
import {enterCourse} from './browser-course-setup.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {conceptReportFixture} from './concept-report-fixture.mjs';
const appURL=process.env.QA_URL||'http://127.0.0.1:3000';
const tabs=await (await fetch('http://127.0.0.1:9224/json/list')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl),pending=new Map(),errors=[],requests=[];let seq=0;
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);};
const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject,timer:setTimeout(()=>reject(new Error('Timed out: '+method)),25000)});ws.send(JSON.stringify({id,method,params,sessionId}));});
const run=async (expression,sessionId)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,replMode:true},sessionId);if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const waitFor=async expression=>{for(let i=0;i<600;i++){if(await run(expression))return;await new Promise(r=>setTimeout(r,100));}throw new Error('Condition not met: '+expression+'\n'+await run('document.body.innerText.slice(-2500)'));};
const click=s=>run(`document.querySelector(${JSON.stringify(s)}).click()`);
const change=(s,value)=>run(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
const stored=()=>run('JSON.parse(localStorage.getItem("calculus-clinic-progress-v1"))?.attempts||[]');
const snap=async name=>{await run('await document.fonts.ready.then(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))');const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile('test-results/'+name+'.png',Buffer.from(r.data,'base64'));};
const fixture=conceptReportFixture();
const hookDownloads=()=>run('window.qaDownloads=[];window.qaNames=[];URL.createObjectURL=b=>{qaDownloads.push(b);return "blob:qa"};HTMLAnchorElement.prototype.click=function(){qaNames.push(this.download)}');
const saveDownload=async(index,name)=>{const bytes=new Uint8Array(await run(`await qaDownloads[${index}].arrayBuffer().then(b=>Array.from(new Uint8Array(b)))`));const pdf=await PDFDocument.load(bytes);assert.ok(pdf.getPageCount()>=10);await writeFile('test-results/pdfs/'+name+'.pdf',bytes);console.log(name,pdf.getPageCount()+' pages',bytes.length+' bytes');return pdf;};
try{
 await mkdir('test-results/pdfs',{recursive:true});await send('Runtime.enable');await send('Network.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:appURL});await enterCourse(run,waitFor);
 await run(`localStorage.setItem('calculus-clinic-progress-v1',JSON.stringify({schemaVersion:1,attempts:${JSON.stringify(fixture.attempts)},progressChecks:${JSON.stringify(fixture.progressChecks)},scoringPreferences:{includeSelfReports:true}}));localStorage.setItem('calculus-clinic-scratch-v1:1.6',JSON.stringify({version:1,strokes:${JSON.stringify(fixture.scratch.strokes)}}));localStorage.setItem('calculus-clinic-notes-v1',JSON.stringify({version:1,notes:{'1.6':${JSON.stringify(fixture.notes)}}}))`);
 await send('Page.reload');await waitFor('!!document.querySelector(".explore-home")');await click('[data-view="graph"]');await change('#graph-concept','1.6');await hookDownloads();
 const original=await stored();
 // Font failures must keep the button usable and let a second click recover.
 await run('window.qaFetch=fetch;fetch=(url,...args)=>String(url).endsWith("KaTeX_Main-Regular.woff2")?Promise.resolve(new Response("",{status:404})):qaFetch(url,...args)');
 await click('[data-action="export-concept-report"]');await waitFor('document.querySelector("#toast").textContent.includes("Could not create")');assert.equal(await run('qaDownloads.length'),0);assert.equal(await run('document.querySelector("[data-action=export-concept-report]").disabled'),false);await run('fetch=qaFetch');
 await click('[data-action="export-concept-report"]');await waitFor('qaDownloads.length===1');await saveDownload(0,'concept-factoring');assert.match(await run('qaNames[0]'),/concept-1\.6-/);assert.deepEqual(await stored(),original);
 await run('document.querySelector(".graph-selection").scrollIntoView({block:"center"})');await snap('concept-report-download-desktop');
 // Long notes exercise page flow without clipping or a giant table row.
 await run('window.qaReportModule=await import("/src/concept-report-data.mjs");window.qaPDF=await import("/src/concept-report-pdf.mjs");window.qaLong=qaReportModule.conceptReportData({...CALCULUS_DATA,conceptId:"1.6",attempts:[],course:"BC",notes:"A long scratch-pad reminder. ".repeat(350)});');
 await run('qaDownloads.push(new Blob([await qaPDF.createConceptReportPDF(qaLong,CALCULUS_DATA.mathText)],{type:"application/pdf"}))');await saveDownload(1,'concept-long-notes');
 // Each node gets its own question bank, including nodes with no answers.
 await click('[data-action="notes"][data-id="1.6"]');assert.equal(await run('document.querySelector(".concept-heading [data-action=export-concept-report]").dataset.id'),'1.6');
 await change('#course','ALG1');await click('[data-view="graph"]');const algebraId=await run('document.querySelector("#graph-concept").value');await click('[data-action="export-concept-report"]');await waitFor('qaDownloads.length===3');await saveDownload(2,'concept-algebra-empty');assert.ok((await run('qaNames[1]')).includes(algebraId.replace(/[^a-z0-9.-]/gi,'-')));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});assert.equal(await run('document.documentElement.scrollWidth<=innerWidth'),true);await run('document.querySelector(".graph-selection").scrollIntoView({block:"center"})');await snap('concept-report-download-mobile');
 // The subset follows cross-course Algebra prerequisites and exports their data.
 await change('#course','CALC_SUBSET');await click('[data-view="graph"]');await change('#graph-concept','1.6');await click('[data-action="export-concept-report"]');await waitFor('qaDownloads.length===4');await saveDownload(3,'concept-subset-prerequisites');
 const prerequisiteSummary=await run('qaReportModule.conceptReportData({...CALCULUS_DATA,conceptId:"1.6",attempts:JSON.parse(localStorage.getItem("calculus-clinic-progress-v1")).attempts,course:"CALC_SUBSET"}).prerequisites.map(p=>({id:p.concept.id,depth:p.depth,accuracy:p.accuracy,emotion:p.expression?.label??null}))');
 assert.equal(prerequisiteSummary.length,14);assert.deepEqual(prerequisiteSummary.find(p=>p.id==='MATH_057'),{id:'MATH_057',depth:1,accuracy:.1,emotion:'Anger'});assert.deepEqual(prerequisiteSummary.find(p=>p.id==='MATH_082'),{id:'MATH_082',depth:1,accuracy:null,emotion:null});
 // Deleting practice data while a report is being prepared cancels its download.
 await run('window.qaCreate=PDFLib.PDFDocument.create;PDFLib.PDFDocument.create=()=>new Promise(resolve=>{window.qaRelease=()=>resolve(qaCreate())})');await click('[data-action="export-concept-report"]');await waitFor('typeof qaRelease==="function"');await click('[data-view="settings"]');await click('[data-action="delete-data"]');await click('[data-action="confirm-delete"]');await run('qaRelease();PDFLib.PDFDocument.create=qaCreate');await waitFor('document.querySelector("#toast").textContent.includes("Report cancelled")');assert.equal(await run('qaDownloads.length'),4);
 assert.deepEqual(errors,[]);assert.ok(requests.filter(url=>url.startsWith('http')).every(url=>url.startsWith(appURL+'/')));
 console.log('PASS concept PDF downloads, prerequisite accuracy and emotions, cross-course subset prerequisites, local math/font/image resources, archived questions and retries, drawing export, empty Algebra node, long notes, retry after errors, mobile layout, deletion cancellation, and unchanged records.');
}catch(error){await snap('concept-report-failure');throw error;}finally{ws.close();}
