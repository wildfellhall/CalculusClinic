import {csv,stats,validateAttempts,validateBackup,mergeAttempts,STORAGE_KEY} from './core.mjs';
import {diagnosticState,DIAGNOSTIC_LABELS,PASS_THRESHOLD} from './diagnostic.mjs';
import {QuestionClock,formatDuration,TIMING_POLICY} from './timing.mjs';
import {graphLayout,drawGraph,masteryFill,MASTERY_SCALE,escapeHTML as esc} from './graph.mjs';
import {SCORE_POLICY,normalizeScoringPreferences,combinedExplanation} from './score-policy.mjs';
import {expressionColumns} from './expressions.mjs';
import {GRAPH_MODES,normalizeGraphMode,graphViewProgress,graphProfile,MOVEMENT_SCALE,MOVEMENT_BORDER_SCALE,movementWidth} from './graph-views.mjs';
import {formatMathText,refreshMathOverflow} from './math.mjs';
import {MovementCamera} from './camera.mjs';
import {PracticeTools} from './practice-tools.mjs';
import {CameraAccess,CAMERA_ACCESS_KEY} from './camera-access.mjs';
import {selfReport,observationStats,observationColumns} from './observations.mjs';
import {renderObservationPanel,renderNodeObservations,observationMethod,scoreText} from './observation-ui.mjs';
import {reportData} from './report-data.mjs';
import {COURSES,courseTitle,courseIncludes,relationshipInCourse,readCourse,saveCourse} from './course.mjs';
import {createProgressCheck,validateProgressChecks,mergeProgressChecks,checkReady,progressCheckRows,PROGRESS_CHECK_COLUMNS} from './progress-checks.mjs';
import {renderProgressCheck,renderCheckResponse,renderProgressCheckHistory} from './progress-check-ui.mjs';
import {readOnboarding,saveOnboarding} from './onboarding.mjs';
import {renderOnboarding as renderOnboardingScreen} from './onboarding-ui.mjs';

const {concepts,relationships,questions,archivedQuestions=[],units,sources,standards,metadata}=window.CALCULUS_DATA;
const attemptQuestions=[...questions,...archivedQuestions];
const archivedQuestionIds=new Set(archivedQuestions.map(q=>q.id));
const math=text=>formatMathText(text,window.CALCULUS_DATA.mathText);
document.fonts.ready.then(refreshMathOverflow);
document.fonts.addEventListener('loadingdone',refreshMathOverflow);
window.addEventListener('resize',refreshMathOverflow);
document.addEventListener('toggle',refreshMathOverflow,true);
const byId=new Map(concepts.map(c=>[c.id,c]));
const qs=id=>questions.filter(q=>q.conceptId===id);
const pct=value=>value===null?'—':Math.round(value*100)+'%';
const browserStorage={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value),removeItem:key=>localStorage.removeItem(key)};
const practiceTools=new PracticeTools(browserStorage,concepts.map(c=>c.id));
const savedCourse=readCourse(browserStorage);
const state={view:'atlas',tab:'browse',unit:'all',selected:savedCourse&&(savedCourse.startsWith('ALG')||COURSES[savedCourse].kind==='subset')?COURSES[savedCourse].entryId:'1.11',course:savedCourse||'BC',onboarding:readOnboarding(browserStorage,savedCourse),onboardingWarning:'',query:'',graphScope:'focus',graphMode:'accuracy',scoringPreferences:normalizeScoringPreferences(),connections:false,progressFilter:'started',quiz:null,attempts:[],progressChecks:[],progressCheckId:null,storageMessage:''};
try{
  const saved=localStorage.getItem(STORAGE_KEY);
  if(saved){const parsed=JSON.parse(saved);if(parsed.schemaVersion!==1)throw new Error('Unsupported storage version');const attempts=validateAttempts(parsed.attempts,attemptQuestions),checks=validateProgressChecks(parsed.progressChecks,attempts,concepts);state.attempts=attempts;state.progressChecks=checks;state.graphMode=normalizeGraphMode(parsed.graphMode);state.scoringPreferences=normalizeScoringPreferences(parsed.scoringPreferences);}
}catch{state.storageMessage='Saved progress could not be read. This session still works. Export any new attempts before closing; existing stored data will be kept until you restore a valid backup or delete it in Settings.';}
let readFailed=!!state.storageMessage;
let dataRevision=0;
let reportBusy=false;
let autoCameraSession=null,pageActive=true;
const questionClock=new QuestionClock();
const camera=new MovementCamera(()=>{syncQuestionClock();updateCameraUI();});
const cameraAccess=new CameraAccess({storage:browserStorage,mediaDevices:navigator.mediaDevices,permissions:navigator.permissions,secure:isSecureContext,
  onRevoke:()=>camera.stop(),onChange:()=>{autoCameraSession=null;syncQuestionClock();updateCameraUI();updateCameraSettings();}});
function updateQuestionTimer(){
  const el=document.querySelector('#question-timer'),label=document.querySelector('#timer-status');
  if(!el||!state.quiz)return;
  const elapsed=state.quiz.answered?state.quiz.durationMs:questionClock.elapsed();
  el.textContent=formatDuration(elapsed);el.dataset.durationMs=elapsed;
  label.textContent=state.quiz.answered?'Answered in':questionClock.running?'Active time':'Paused';
}
function syncQuestionClock(focused=document.hasFocus()){
  if(state.onboarding){syncOnboardingCamera(focused);return;}
  const quiz=state.quiz,current=quiz?.list[quiz.index];
  const allowed=pageActive&&state.view==='practice'&&!state.progressCheckId&&!!current&&!document.hidden&&cameraAccess.canStart;
  const active=allowed&&!quiz.answered&&focused&&!state.progressCheckId;
  if(!allowed)autoCameraSession=null;
  camera.sync({key:current?quiz.sessionId+':'+current.id:null,allowed,active});
  if(active&&camera.stage==='off'&&autoCameraSession!==quiz.sessionId){
    // Try once per visible practice session. Model/device failures need an
    // explicit retry, rather than a loop of permission or camera requests.
    autoCameraSession=quiz.sessionId;
    void camera.start().then(()=>{if(camera.permissionDenied)cameraAccess.revoke('Camera permission was removed. Enable it again in Settings.');});
  }
  const z=state.quiz,q=z?.list[z.index];
  if(!q)questionClock.reset();
  else{
    questionClock.select(q.id);
    questionClock.setRunning(state.view==='practice'&&!state.progressCheckId&&!z.answered&&!document.hidden&&focused&&!camera.setup);
  }
  updateQuestionTimer();
}
function timingExplanation(){
  return `The timer counts active time on this question and pauses when you leave it or switch tabs/windows. There is no time limit. Correct answers get full credit through ${TIMING_POLICY.fullCreditMs/60000} minutes; from there to ${TIMING_POLICY.floorMs/60000} minutes, their mastery credit decreases gently to ${Math.round((1-TIMING_POLICY.weight)*100)}%. Time can change a concept’s mastery by at most ${Math.round(TIMING_POLICY.weight*100)} percentage points. Accuracy and the 8/10 pass rule do not change. Answers without recorded times keep full credit.`;
}
function saveOnboardingStep(step,outcome=null){
  const saved=saveOnboarding(browserStorage,step,outcome);
  state.onboardingWarning=saved?'':'Your setup applies to this visit only. This browser could not save it.';
  return saved;
}
function setOnboardingStep(step){
  if(!['course','tutorial','camera'].includes(step))return;
  if(cameraAccess.pending)cameraAccess.cancelPending();
  state.onboarding=step;autoCameraSession=null;saveOnboardingStep(step);render();
  document.querySelector('#onboarding-title')?.focus({preventScroll:true});window.scrollTo(0,0);
  if(step==='camera'&&!document.hidden)void cameraAccess.initialize();
}
function syncOnboardingCamera(focused){
  questionClock.reset();
  const allowed=state.onboarding==='camera'&&pageActive&&!document.hidden&&cameraAccess.canStart;
  const active=allowed&&focused;
  if(!allowed)autoCameraSession=null;
  camera.sync({key:null,allowed,active});
  if(active&&camera.stage==='off'&&autoCameraSession!=='onboarding'){
    autoCameraSession='onboarding';
    void camera.start().then(()=>{if(camera.permissionDenied)cameraAccess.revoke('Camera permission was removed. Enable it again when ready.');});
  }
}
async function enableOnboardingCamera(){
  if(state.onboarding!=='camera'||cameraAccess.pending)return;
  if(!cameraAccess.initialized)await cameraAccess.initialize();
  if(state.onboarding!=='camera')return;
  if(!cameraAccess.canStart)await cameraAccess.request();
  else{autoCameraSession=null;syncQuestionClock();updateOnboardingCameraUI();}
}
function updateOnboardingCameraUI(){
  const status=document.querySelector('#onboarding-camera-state');if(!status)return;
  const ready=camera.stage==='ready'&&!!camera.baseline,on=camera.stage!=='off';
  const labels={off:'Camera off',loading:'Starting camera…',uncalibrated:'Ready to calibrate',calibrating:'Calibrating your resting face…',ready:'Calibration complete'};
  const label=cameraAccess.pending?'Waiting for permission…':on&&!camera.active?'Camera paused':labels[camera.stage];
  if(status.textContent!==label)status.textContent=label;
  const message=ready?'You’re ready. Your camera will pause while you explore.':camera.message.replaceAll(' Timer paused.','')||cameraAccess.message||'Enable the camera to begin.';
  const detail=document.querySelector('#onboarding-camera-message');if(detail.textContent!==message)detail.textContent=message;
  document.querySelector('#onboarding-preview-host').hidden=!on;
  document.querySelector('#onboarding-preview-placeholder').hidden=on;
  const progress=document.querySelector('#onboarding-calibration-progress');progress.hidden=camera.stage!=='calibrating';progress.value=camera.progress;
  document.querySelector('#onboarding-calibration-label').hidden=progress.hidden;
  const enable=document.querySelector('#onboarding-camera-enable');enable.hidden=on;enable.disabled=cameraAccess.pending;
  enable.textContent=cameraAccess.pending?'Waiting for permission…':camera.message||cameraAccess.message?'Try camera again':'Enable camera';
  const recalibrate=document.querySelector('#onboarding-recalibrate');recalibrate.hidden=!ready&&camera.stage!=='uncalibrated';
  recalibrate.textContent=ready?'Recalibrate resting face':'Try calibration again';
  document.querySelector('#onboarding-finish').disabled=!ready||!cameraAccess.canStart;
}
function finishOnboarding(skipCamera){
  if(state.onboarding!=='camera'||(!skipCamera&&(camera.stage!=='ready'||!camera.baseline||!cameraAccess.canStart)))return;
  state.onboarding=null;state.view='atlas';state.tab='browse';state.unit='all';state.query='';
  const saved=saveOnboardingStep('complete',skipCamera?'skipped':'calibrated');
  if(skipCamera)cameraAccess.revoke();
  render();const heading=document.querySelector('.explore-home h1');heading.tabIndex=-1;heading.focus({preventScroll:true});window.scrollTo(0,0);
  if(!saved)toast(state.onboardingWarning);
  announce(skipCamera?'Setup complete. Camera is off.':'Setup complete. Your resting face is calibrated.');
}
function updateCheckInScore(){
  const el=document.querySelector('#checkin-score'),r=state.quiz?.checkIn;if(!el)return;
  const complete=r?.emotion&&r?.intensity&&r?.valence;
  el.textContent=complete?`Sentiment: ${scoreText(selfReport(r).sentimentScore)} · saved with your answer`:'';
  el.hidden=!complete;
}
function updateCameraUI(){
  updateOnboardingCameraUI();
  const el=document.querySelector('#camera-state');if(!el)return;
  const focused=document.activeElement;
  const on=camera.stage!=='off',answered=!!state.quiz?.answered,paused=on&&!camera.active;
  const labels={off:'Camera off',loading:'Starting camera',uncalibrated:'Needs calibration',calibrating:'Calibrating',ready:'Camera on'};
  el.textContent=paused?'Camera paused':labels[camera.stage];
  document.querySelector('#camera-summary').textContent=el.textContent;
  const status=paused?'':camera.message||(!on?cameraAccess.message:'');
  const statusEl=document.querySelector('#camera-status');if(statusEl.textContent!==status)statusEl.textContent=status;
  statusEl.hidden=!status;
  const enable=document.querySelector('#camera-enable');enable.hidden=on;enable.disabled=answered||cameraAccess.pending;
  enable.textContent=cameraAccess.pending?'Waiting for permission…':'Enable camera';
  if(on&&camera.stage==='loading')document.querySelector('#optional-observations').open=true;
  const calibration=document.querySelector('#camera-calibrate');calibration.hidden=!['uncalibrated','ready'].includes(camera.stage);calibration.disabled=answered;
  calibration.textContent=camera.stage==='ready'?'Recalibrate resting face':'Calibrate resting face';
  const stop=document.querySelector('#camera-stop');stop.hidden=!on;
  if(stop.hidden&&focused===stop)enable.focus();
  const progress=document.querySelector('#calibration-progress');progress.hidden=camera.stage!=='calibrating';progress.value=camera.progress;
  document.querySelector('#camera-preview-host').hidden=!on;
  const live=document.querySelector('#camera-expression');if(live){live.hidden=!on||paused||camera.stage!=='ready';const x=camera.liveExpression;live.textContent=x?`Camera estimate: ${x.label}${x.label==='Mixed / uncertain'?'':` · ${pct(x.confidence)} model probability`}`:'Waiting for a confident expression estimate…';}
}
function updateCameraSettings(){
  const status=document.querySelector('#camera-access-state');if(!status)return;
  const focused=document.activeElement;
  status.textContent=cameraAccess.pending?'Waiting for permission':cameraAccess.enabled?(cameraAccess.canStart?'On during practice':'Permission needed'):'Off';
  const message=document.querySelector('#camera-access-message');message.textContent=[cameraAccess.message,cameraAccess.storageWarning].filter(Boolean).join(' ');message.hidden=!message.textContent;
  const enable=document.querySelector('#camera-settings-enable');enable.hidden=cameraAccess.enabled;enable.disabled=cameraAccess.pending;
  const revoke=document.querySelector('#camera-revoke');revoke.hidden=!cameraAccess.enabled&&!cameraAccess.pending;
  if(revoke.hidden&&focused===revoke)enable.focus();
}
document.addEventListener('toggle',e=>{if(e.target.id==='optional-observations'&&e.target.isConnected&&state.quiz)state.quiz.observationOpen=e.target.open;},true);
const eligible=c=>courseIncludes(state.course,c);
const eligibleCheck=c=>c.course===state.course&&eligible(byId.get(c.conceptId));
const prerequisiteIds=c=>relationships.filter(e=>e.type==='prerequisite'&&e.target===c.id&&relationshipInCourse(state.course,e)&&eligible(byId.get(e.source))).map(e=>e.source);
const visibleConcepts=()=>concepts.filter(c=>eligible(c)&&(state.unit==='all'||c.unit===Number(state.unit))&&(!state.query||`${c.id} ${c.title} ${c.subskills.join(' ')} ${c.objective}`.toLowerCase().includes(state.query.toLowerCase())));
const conceptStats=c=>stats(state.attempts,qs(c.id).map(q=>q.id));
let diagnostic,graphViews;
const refreshDiagnostic=()=>{diagnostic=diagnosticState({concepts,relationships,questions,attempts:state.attempts,course:state.course});graphViews=graphViewProgress(diagnostic.nodes,state.attempts,state.graphMode,state.scoringPreferences);};
const graphProgress=()=>graphViews;
function renderRecommendation(compact=false){
  const next=diagnostic.recommendation;
  if(!next.targetId)return `<section class="next-check complete-check"><h2>Course checks complete</h2><p>${esc(next.reason)}</p></section>`;
  const c=byId.get(next.targetId),labels={start:'Start a diagnostic check',continue:'Finish this check',prerequisite:'Check a prerequisite',advance:'Try the next concept',revisit:'Recheck this concept',explore:'Explore another connection'};
  return `<section class="next-check ${compact?'compact-check':''}" aria-label="Recommended next check" data-next-concept="${c.id}" data-recommendation="${next.kind}" data-anchor="${next.anchorId||''}"><div><span class="eyebrow">${labels[next.kind]}</span><h2><span>${c.id}</span> ${esc(c.title)}</h2>${compact?`<details class="next-reason"><summary>Why this node?</summary><p>${esc(next.reason)}</p></details>`:`<p>${esc(next.reason)}</p>`}</div><div class="next-actions"><button class="button primary" data-action="diagnostic" data-id="${c.id}">${next.kind==='continue'?'Continue check':next.kind==='revisit'?'Retry check':next.kind==='start'?'Start check':'Try next'} →</button><button class="text-link" data-action="recommendation-map" data-id="${c.id}">Show on graph</button></div></section>`;
}
function renderDiagnosticSummary(){
  const s=diagnostic.summary;
  return `<div class="diagnostic-summary" aria-label="Diagnostic coverage"><span><strong>${s.passed}</strong> ${s.passed===1?'check':'checks'} passed</span><span><strong>${s.review}</strong> to review</span><span><strong>${s.partial}</strong> in progress</span><span><strong>${s.unseen}</strong> not checked</span><details><summary>How the next check is chosen</summary><p>A check passes after every question has been tried and at least ${Math.round(PASS_THRESHOLD*100)}% of latest answers are correct. A pass leads toward a dependent concept; a lower completed result prompts a prerequisite check. Partly answered concepts need more evidence. After a branch is checked, we explore a nearby unfinished one. These are practice signals; untested concepts stay unscored.</p></details></div>`;
}
function masteryLegend(){
  const mode=state.graphMode,movement=mode==='movement',scale=movement?MOVEMENT_SCALE:MASTERY_SCALE;
  return `<div class="graph-view-controls"><label class="graph-mode-picker" for="graph-mode">Graph view<select id="graph-mode">${Object.entries(GRAPH_MODES).map(([value,info])=>`<option value="${value}" ${mode===value?'selected':''}>${info.label}</option>`).join('')}</select></label><details class="mastery-help"><summary>About this view</summary><p>${mode==='combined'?combinedExplanation(state.scoringPreferences):GRAPH_MODES[mode].description} Check statuses and recommendations always use answers. Camera labels are expression estimates. Excess movement starts above 20/100 and contributes only alongside fear, sadness or anger estimates.</p></details></div><div class="mastery-legend" aria-label="${movement?'Expression score':mode==='combined'?'Adjusted score':'Accuracy'} color scale"><span>${movement?'Expression score':mode==='combined'?'Adjusted score':'Accuracy fill'}</span><div class="mastery-swatches">${[null,0,.25,.5,.75,1].map(score=>`<span><i aria-hidden="true" style="background:${masteryFill(score,scale)}"></i>${score===null?(movement?'No estimate':'Not tried'):movement?Math.round(score*100)+'/100':pct(score)}</span>`).join('')}</div>${mode==='combined'?`<div class="movement-border-legend"><span>Facial change border</span>${[null,0,.5,1].map(score=>`<span><i aria-hidden="true" style="border:${score===null?1:movementWidth(score)}px solid ${score===null?'#b3cbb9':masteryFill(score,MOVEMENT_BORDER_SCALE)}"></i>${score===null?'No data':Math.round(score*100)+'/100'}</span>`).join('')}</div>`:''}</div>`;
}
function renderGraphProfile(){
  const profile=graphProfile(graphViews),delta=profile.combinedDelta;
  const difference=delta===null?'No answers recorded yet.':Math.abs(delta)<.0005?'Both matches accuracy.':`Both is ${Number((Math.abs(delta)*100).toFixed(1))} pts ${delta<0?'below':'above'} accuracy.`;
  return `<aside class="graph-profile" aria-labelledby="graph-profile-title"><header><h2 id="graph-profile-title">Overall profile</h2><p>${courseTitle(state.course)} · ${profile.total} concepts</p></header><div class="profile-rows" role="group" aria-label="Compare graph scoring views">${[['accuracy','Accuracy'],['movement','Emotions'],['combined','Both']].map(([mode,label])=>{
    const {score,count}=profile.rows[mode],value=score===null?'—':Number((score*100).toFixed(1)),active=state.graphMode===mode;
    return `<button id="profile-${mode}" class="profile-row" data-action="graph-mode" data-mode="${mode}" data-score="${score??'unscored'}" data-count="${count}" aria-pressed="${active}" aria-label="${label}: ${score===null?'no data':value+' out of 100'}, ${count} of ${profile.total} concepts scored. Show this view."><span class="profile-row-top"><span>${label}</span><strong>${value}${score===null?'':'<small>/100</small>'}</strong></span><span class="profile-bar" aria-hidden="true"><span style="width:${score===null?0:score*100}%"></span></span><span class="profile-coverage">${count}/${profile.total} concepts scored</span></button>`;
  }).join('')}</div><p class="profile-difference">${difference}</p><details class="profile-method"><summary>How this is compared</summary><p>Mean score across scored concepts in the full selected course, including foundations. Every concept has equal weight; missing data stays unscored. Map zoom and filters do not change these averages.</p><p>Emotions uses camera expression estimates. Both starts from answer accuracy and applies your enabled adjustments. Check-ins are ${state.scoringPreferences.includeSelfReports?'included':'off'}.</p></details>${reportButton()}</aside>`;
}
function reportButton(){return `<button class="button compact report-download" data-action="export-report" ${reportBusy?'disabled aria-busy="true"':''}>${reportBusy?'Preparing PDF…':'Download report · PDF'}</button>`;}
function conceptReportButton(id){return `<button class="button compact concept-report-download" data-action="export-concept-report" data-id="${esc(id)}" ${reportBusy?'disabled aria-busy="true"':''}>${reportBusy?'Preparing PDF…':'Concept report · PDF'}</button>`;}
function updateReportButtons(){document.querySelectorAll('[data-action="export-report"],[data-action="export-concept-report"]').forEach(el=>{el.disabled=reportBusy;el.setAttribute('aria-busy',String(reportBusy));el.textContent=reportBusy?'Preparing PDF…':el.dataset.action==='export-concept-report'?'Concept report · PDF':'Download report · PDF';});}
async function exportConceptReport(id){
  if(reportBusy||!eligible(byId.get(id)))return;
  reportBusy=true;const revision=dataRevision;updateReportButtons();announce('Preparing this concept’s PDF report.');
  try{
    const input={conceptId:id,concepts,relationships,questions,archivedQuestions,attempts:structuredClone(state.attempts),progressChecks:structuredClone(state.progressChecks),course:state.course,preferences:{...state.scoringPreferences},notes:practiceTools.notes.get(id)};
    const [{conceptReportData},{createConceptReportPDF}]=await Promise.all([import('./concept-report-data.mjs'),import('./concept-report-pdf.mjs')]);
    const snapshot=conceptReportData(input),bytes=await createConceptReportPDF(snapshot,window.CALCULUS_DATA.mathText);
    if(revision!==dataRevision){toast('Report cancelled because saved data was deleted.');return;}
    download(`calculus-clinic-${snapshot.course.toLowerCase()}-concept-${id.replace(/[^a-z0-9.-]/gi,'-')}-${snapshot.generatedAt.slice(0,10)}.pdf`,bytes,'application/pdf');
    toast('Your concept PDF report is ready.');
  }catch(error){toast('Could not create the concept PDF report. Please try again.');console.error('Concept PDF report failed:',error);}
  finally{reportBusy=false;updateReportButtons();}
}
async function exportReport(){
  if(reportBusy)return;
  reportBusy=true;const revision=dataRevision;
  const update=updateReportButtons;
  update();announce('Preparing your PDF report.');
  try{
    const currentMap=!!document.querySelector('#graph-container')&&graphState;
    const snapshot=reportData({concepts,relationships,questions,attempts:structuredClone(state.attempts),course:state.course,preferences:{...state.scoringPreferences},...(currentMap?{mapIds:graphState.layout.nodes.map(n=>n.id),mapEdges:graphState.layout.edges,mapFocus:state.graphScope==='focus'?state.selected:null,mapLabel:state.graphScope==='focus'?`Connections around ${state.selected}`:state.graphScope==='unit'?`${unitLabel(byId.get(state.selected).unit)} and prerequisites`:'Whole curriculum'}:{})});
    const {createReportPDF}=await import('./report-pdf.mjs');
    const bytes=await createReportPDF(snapshot,units);
    if(revision!==dataRevision){toast('Report cancelled because saved data was deleted.');return;}
    download(`calculus-clinic-${snapshot.course.toLowerCase()}-report-${snapshot.generatedAt.slice(0,10)}.pdf`,bytes,'application/pdf');
    toast('Your PDF report is ready.');
  }catch(error){toast('Could not create the PDF report. Please try again.');console.error('PDF report failed:',error);}
  finally{reportBusy=false;update();}
}
function setGraphMode(mode){
  state.graphMode=normalizeGraphMode(mode);persist();renderStoredProgress();announce('Graph view: '+GRAPH_MODES[state.graphMode].label);
}
function masterySummary(c){
  const s=graphProgress().get(c.id),v=s.display,movement=state.graphMode==='movement';
  const accuracy=v.accuracy===null?'Not tried':`${pct(v.accuracy)} · ${s.latestCorrect}/${s.available} correct · ${s.attempted}/${s.available} tried`;
  const change=v.change===null?'No camera data':`${Number(v.change.toFixed(1))}/100`;
  const x=v.expression,estimate=x?`<p class="graph-checkin"><span>Camera estimate: <strong>${esc(x.label)}</strong>${x.label==='Mixed / uncertain'?'':` · ${pct(x.confidence)} mean model probability`}</span><span>${x.samples} confident samples · ${Number((x.adjustment*100).toFixed(1))}% experimental credit adjustment</span></p>`:'';
  const reportDetail=state.graphMode==='combined'?`<p class="small muted score-breakdown">Camera: ${Number((v.scoring.cameraAdjustment*100).toFixed(2))}% credit reduction · Check-ins: ${v.scoring.includeSelfReports?`${Number((v.scoring.selfReportAdjustment*100).toFixed(2))}% (${v.scoring.checkIns} saved)`:'off'}</p>`:'';
  const main=movement?'Expression score: '+(v.score===null?'No camera estimate':Math.round(v.score*100)+'/100'):state.graphMode==='combined'?'Adjusted fill: '+pct(v.score)+' · Accuracy: '+accuracy:'Accuracy fill: '+accuracy;
  return `<p class="mastery-summary"><span aria-hidden="true" class="mastery-dot" style="background:${masteryFill(v.score,movement?MOVEMENT_SCALE:MASTERY_SCALE)}"></span><span>${main} · ${DIAGNOSTIC_LABELS[s.status]}</span></p>${estimate}${reportDetail}${state.graphMode==='combined'?`<p class="small muted">Measured facial change: ${change}</p>`:''}`;
}

const badge=c=>`<span class="badge ${c.scope==='BC only'?'bc':c.scope==='Foundation'?'foundation':''}">${esc(c.scope)}</span>`;
const unitLabel=id=>id===0?'Foundations':`Unit ${units[id].number??id}`;
function announce(message){document.querySelector('#announcement').textContent=message;}
let toastTimer;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4500);}
function persist(){
  if(readFailed)return;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({schemaVersion:1,graphMode:state.graphMode,scoringPreferences:state.scoringPreferences,attempts:state.attempts,progressChecks:state.progressChecks}));state.storageMessage='';}
  catch{state.storageMessage='This browser could not save your latest progress. It remains available in this session; use Export backup before closing.';toast('Progress is in this session only. Please export a backup.');}
}
function download(name,content,type='text/csv;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function selectConcept(id,tab='map'){if(!eligible(byId.get(id)))return;state.progressCheckId=null;state.selected=id;state.unit=byId.get(id).unit;state.query='';state.graphScope='focus';state.tab=tab;state.view='atlas';state.quiz=null;render();}
function startPractice(id,{diagnosticCheck=false}={}){
  if(!eligible(byId.get(id)))return;
  questionClock.reset();state.progressCheckId=null;
  const all=qs(id),prior=new Set(state.attempts.map(a=>a.questionId));
  const unanswered=all.filter(q=>!prior.has(q.id));
  const list=diagnosticCheck&&unanswered.length?unanswered:all;
  state.selected=id;state.quiz={conceptId:id,diagnosticCheck,list:[...list.filter(q=>!prior.has(q.id)),...list.filter(q=>prior.has(q.id))],index:0,choice:null,answered:false,durationMs:null,results:[],sessionId:crypto.randomUUID()};state.view='practice';state.query='';render();
}
function finishProgressCheck(status){
  const check=state.progressChecks.find(c=>c.id===state.progressCheckId);
  if(!check||check.status==='completed')return;
  if(status==='completed'&&!checkReady(check)){
    const error=document.querySelector('#progress-check-error');error.hidden=false;error.textContent='Choose an ease rating, a progress rating, and at least one feeling.';
    document.querySelector(!check.ease?'[name="ease"]':!check.progress?'[name="progress"]':'[name="feelings"]')?.focus();return;
  }
  check.status=status;check.submittedAt=status==='completed'?new Date().toISOString():null;
  state.progressCheckId=null;persist();
  if(!state.quiz||state.quiz.sessionId!==check.id||state.quiz.index<state.quiz.list.length){state.quiz=null;state.view='progress';}
  render();document.querySelector('.practice-complete h1, .page-heading h1')?.focus();
  announce(status==='completed'?'Progress check saved.':'Progress check skipped. You can finish it in Progress.');
}
function exportProgress(){
  const allDiagnostic=diagnosticState({concepts,relationships,questions,attempts:state.attempts,course:state.course});
  const allViews=graphViewProgress(allDiagnostic.nodes,state.attempts,'combined',state.scoringPreferences);
  const rows=concepts.filter(eligible).map(c=>{const s=allDiagnostic.nodes.get(c.id),v=allViews.get(c.id).display;return {conceptId:c.id,concept:c.title,questionsAvailable:s.available,questionsAttempted:s.attempted,firstCorrect:s.firstCorrect,firstAttemptAccuracy:s.firstAccuracy,latestCorrect:s.latestCorrect,latestAccuracy:s.latestAccuracy,masteryScore:s.masteryScore,correctnessScore:s.correctnessScore,timingAdjustment:s.timingAdjustment,timedAttempts:s.timedAttempts,averageDurationMs:s.averageDurationMs,diagnosticStatus:allDiagnostic.nodes.get(c.id).status,totalAttempts:s.total,totalCorrect:s.correct,allAttemptAccuracy:s.allAccuracy,...(()=>{const o=observationStats(state.attempts,c.id),x=v.expression;return {cameraExpression:x?.label,cameraExpressionProbability:x?.confidence,cameraExpressionSamples:x?.samples,cameraSentimentScore:x?.sentimentScore,cameraNegativeScore:x?.negativeScore,cameraAdjustment:x?.adjustment,cameraExpressionScore:x?.cameraScore,cameraAdjustedAccuracy:v.scoring.cameraAdjustedScore,scoringPolicyVersion:SCORE_POLICY.version,selfReportContributionEnabled:v.scoring.includeSelfReports,selfReportAdjustment:v.scoring.selfReportAdjustment,totalAdjustment:v.scoring.totalAdjustment,adjustedScore:v.scoring.adjustedScore,checkIns:o.checkIns,selfReportedSentiment:o.sentimentScore,movementAttempts:o.movementAttempts,movementChangeScore:o.changeScore,movementSamples:o.samples,observedMovementMs:o.observedMs};})()};});
  download('concept-progress.csv',csv(rows,Object.keys(rows[0])));
}
function exportQuestionProgress(){
  const rows=questions.filter(q=>eligible(byId.get(q.conceptId))).map(q=>{const s=stats(state.attempts,[q.id]);return {questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,attempts:s.total,correctAttempts:s.correct,accuracy:s.allAccuracy,firstCorrect:s.attempted?!!s.firstCorrect:'',latestCorrect:s.attempted?!!s.latestCorrect:'',timedAttempts:s.timedAttempts,latestDurationMs:s.latestDurationMs,averageDurationMs:s.averageDurationMs};});
  download('question-progress.csv',csv(rows,Object.keys(rows[0])));
}
function linkChips(ids){return ids.length?ids.map(id=>`<button class="link-chip" data-action="select" data-id="${esc(id)}"><span>${esc(id)}</span>${esc(byId.get(id).title)}<span aria-hidden="true">↗</span></button>`).join(''):'<p class="muted small">No direct prerequisites in this model.</p>';}
function unitPicker(){
  return `<label class="unit-picker"><span class="sr-only">Browse a unit</span><select id="unit-filter"><option value="all" ${state.unit==='all'?'selected':''}>All units</option>${units.filter(u=>concepts.some(c=>eligible(c)&&c.unit===u.id)).map(u=>`<option value="${u.id}" ${state.unit===u.id?'selected':''}>${unitLabel(u.id)} · ${esc(u.title)}</option>`).join('')}</select></label>`;
}
function searchField(){return `<label class="search"><span class="sr-only">Search all concepts</span><input id="search" type="search" value="${esc(state.query)}" placeholder="Search concepts, skills, or topic numbers…" autocomplete="off"></label>`;}
function chooseCourse(course){
  if(!Object.hasOwn(COURSES,course))return;
  const firstChoice=state.onboarding;
  state.course=course;state.quiz=null;state.progressCheckId=null;
  if(firstChoice){state.onboarding='tutorial';saveOnboardingStep('tutorial');}
  if(COURSES[course].kind==='subset'||!eligible(byId.get(state.selected)))state.selected=COURSES[course].entryId;
  if(COURSES[course].kind==='subset')state.graphScope='focus';
  state.unit='all';state.query='';
  const saved=saveCourse(browserStorage,course);
  render();
  if(firstChoice)document.querySelector('#onboarding-title')?.focus({preventScroll:true});
  if(!saved){state.onboardingWarning='Your course and setup apply to this visit only. This browser could not save the choice.';if(firstChoice)render();else toast(state.onboardingWarning);}
  announce(`${COURSES[course].title} selected.`);
  if(!document.hidden&&(!state.onboarding||state.onboarding==='camera'))void cameraAccess.initialize();
}
function render(){
  if(state.onboarding){document.querySelector('#app').innerHTML=renderOnboardingScreen({step:state.onboarding,course:state.course,concepts,warning:state.onboardingWarning});practiceTools.mount();camera.mount(document.querySelector('#onboarding-preview-host'));syncQuestionClock();updateOnboardingCameraUI();return;}
  refreshDiagnostic();
  const active=document.activeElement,focusId=active?.id,selection=active?.selectionStart;
  const c=byId.get(state.selected),overall=stats(state.attempts,questions.filter(q=>eligible(byId.get(q.conceptId))).map(q=>q.id));
  document.querySelector('#app').innerHTML=`
    <header class="site-header"><div class="topbar">
      <a href="#" class="brand" data-action="home"><span class="brand-mark" aria-hidden="true">∫</span><span>calculus clinic</span></a>
      <nav class="primary-nav" aria-label="Main">${[['atlas','Explore'],['graph','Graph'],['practice','Practice'],['progress','Progress'],['settings','Settings']].map(([view,label])=>`<button data-action="view" data-view="${view}" ${state.view===view?'aria-current="page"':''}>${label}</button>`).join('')}</nav>
      <label class="course-label"><span class="sr-only">Course</span><select id="course">${Object.entries(COURSES).map(([id,c])=>`<option value="${id}" ${state.course===id?'selected':''}>${c.title}</option>`).join('')}</select></label>
    </div></header>
    <main id="main" tabindex="-1">
      ${state.storageMessage?`<div class="storage-warning" role="alert">${esc(state.storageMessage)} <button data-action="backup">Export backup</button></div>`:''}
      <div class="page-content ${state.view==='practice'?'practice-page':state.view==='graph'?'graph-page':''}">${state.view==='atlas'?renderAtlas(c):state.view==='graph'?renderKnowledgeGraph(c):state.view==='practice'?renderPractice(c):state.view==='settings'?renderSettings():renderProgress(overall)}</div>
    </main>
    <footer class="page-footer"><span>Calculus Clinic</span><button data-action="about">Sources & how this works</button></footer>`;
  if(focusId){const next=document.getElementById(focusId);if(next){next.focus();if(typeof selection==='number'&&next.setSelectionRange)next.setSelectionRange(selection,selection);}}
  if(state.view==='graph'||(state.view==='atlas'&&state.tab==='map'))mountGraph();
  practiceTools.mount();
  camera.mount(document.querySelector('#camera-preview-host'));
  syncQuestionClock();updateCameraUI();updateCameraSettings();updateCheckInScore();
  requestAnimationFrame(refreshMathOverflow);
}
function renderBrowse(){
  const browsing=state.unit!=='all'||!!state.query;
  const recent=[...new Set([...state.attempts].sort((a,b)=>b.answeredAt.localeCompare(a.answeredAt)).map(a=>a.conceptId))].map(id=>byId.get(id)).filter(eligible).slice(0,3);
  const list=browsing?visibleConcepts():recent.length?recent:COURSES[state.course].startingIds.map(id=>byId.get(id));
  return `<section class="explore-home"><div class="home-title"><h1>${COURSES[state.course].kind==='subset'?'Calculus subset':`Explore ${state.course.startsWith('ALG')?'algebra':'calculus'}`}<span class="heading-dot" aria-hidden="true">.</span></h1><svg class="connection-doodle" viewBox="0 0 170 85" aria-hidden="true" focusable="false"><path d="M12 64 C35 64 40 22 65 31 S108 80 130 40 S148 16 160 19" fill="none" stroke="#83ab92" stroke-width="1.6" stroke-dasharray="3 4"/><circle cx="12" cy="64" r="5" fill="#fff0c9" stroke="#99b49b"/><circle cx="65" cy="31" r="7" fill="#e9e2fa" stroke="#99b49b"/><circle cx="130" cy="40" r="6" fill="#fff0c9" stroke="#99b49b"/><circle cx="160" cy="19" r="5" fill="#DDFEEA" stroke="#99b49b"/><text x="8" y="25" fill="#60856a" font-size="20" font-family="Fraunces,serif">f(x)</text><text x="131" y="77" fill="#60856a" font-size="22" font-family="Fraunces,serif">∞</text></svg></div>${COURSES[state.course].kind==='subset'?'<p class="subset-intro">Work toward algebraic limits using factoring, conjugates, and simplification. Start with the limit check, or explore its algebra prerequisites.</p>':''}<div class="browse-search">${searchField()}${unitPicker()}</div>
    ${!browsing&&state.attempts.length?renderRecommendation(true):''}<div class="section-line"><h2>${state.query?'Search results':state.unit!=='all'?esc(units[state.unit].title):recent.length?'Recently practiced':'Places to begin'}</h2>${browsing?`<span>${list.length} concepts</span>`:''}</div>
    <div class="concept-list">${list.slice(0,12).map(c=>`<button class="concept-row" data-action="select" data-id="${c.id}"><span class="topic-number" style="--unit:${units[c.unit].color}">${c.id}</span><span>${esc(c.title)}</span><span class="row-arrow" aria-hidden="true">→</span></button>`).join('')||'<div class="empty-state"><p>No matching concepts in this course.</p><button class="text-link" data-action="clear-search">Clear search</button></div>'}</div>
    <div class="browse-links"><button class="text-link" data-action="table">${list.length>12?`View all ${list.length} results`:browsing?'View concept table':'All concepts'}</button><button class="text-link" data-action="full-map">Full curriculum map</button></div>
  </section>`;
}
function renderAtlas(c){
  if(state.tab==='browse')return renderBrowse();
  if(state.tab==='about')return `<button class="back-link" data-action="home">← Explore</button>${renderAbout()}`;
  if(state.tab==='table')return `<button class="back-link" data-action="home">← Explore</button><section class="page-heading"><h1>Concept table</h1></section><div class="table-filters">${searchField()}${unitPicker()}</div>${renderTable()}`;
  const s=conceptStats(c);
  return `<button class="back-link" data-action="home">← Explore</button>
    <section class="concept-heading"><div><div class="concept-meta">${unitLabel(c.unit)} · ${c.id} ${badge(c)}</div><h1>${esc(c.title)}</h1><p>${math(c.objective)}</p></div><div class="concept-practice"><button class="button primary" data-action="practice" data-id="${c.id}">Try ${qs(c.id).length} questions →</button><span>${s.attempted?`${s.attempted}/${s.available} answered · ${pct(s.latestAccuracy)} latest`:'No time limit, with explanations'}</span>${conceptReportButton(c.id)}</div></section>
    <nav class="tabs" aria-label="Concept views"><button data-action="tab" data-tab="map" ${state.tab==='map'?'aria-current="page"':''}>Connections</button><button data-action="tab" data-tab="notes" ${state.tab==='notes'?'aria-current="page"':''}>Concept notes</button></nav>
    ${state.tab==='notes'?renderDetail(c):`<div class="graph-workspace"><section class="map-panel"><div class="map-toolbar"><div class="graph-help"><span>Prerequisite</span><span aria-hidden="true">→</span><span>Dependent concept</span></div><details class="map-options"><summary>Map options</summary><div><label>Show <select id="graph-scope"><option value="focus" ${state.graphScope==='focus'?'selected':''}>Around this concept</option><option value="unit" ${state.graphScope==='unit'?'selected':''}>This unit</option><option value="all" ${state.graphScope==='all'?'selected':''}>Whole curriculum</option></select></label><label class="connection-toggle"><input type="checkbox" id="connections" ${state.connections?'checked':''}> Other math connections</label><button class="text-link" data-action="export-map">Download this map · SVG</button></div></details></div>${masteryLegend()}<div id="graph-container" class="graph-container" aria-label="Interactive concept map"></div><div class="graph-bottom"><span class="map-hint">Select a concept to explore. Drag to move.</span><div class="zoom-controls"><button data-action="zoom-out" aria-label="Zoom out">−</button><span id="zoom-label">100%</span><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="fit">Fit</button></div></div></section>${renderGraphProfile()}</div>`}
    ${renderNodeObservations(state.attempts,c.id,state.scoringPreferences)}<details class="unit-concepts"><summary>More in ${c.unit===0?'foundations':unitLabel(c.unit)}</summary><div class="concept-chips">${concepts.filter(n=>n.unit===c.unit&&eligible(n)).map(n=>`<button data-action="select" data-id="${n.id}" class="concept-chip ${n.id===c.id?'selected':''}"><span>${n.id}</span>${esc(n.title)}</button>`).join('')}</div></details>`;
}
function renderKnowledgeGraph(c){
  const list=concepts.filter(eligible);
  return `<section class="knowledge-graph"><div class="page-heading"><h1>Knowledge graph<span class="heading-dot" aria-hidden="true">.</span></h1></div>
    ${renderRecommendation(true)}<div class="graph-explorer-controls"><label>Find a concept<select id="graph-concept">${units.filter(u=>list.some(n=>n.unit===u.id)).map(u=>`<optgroup label="${esc(unitLabel(u.id)+' · '+u.title)}">${list.filter(n=>n.unit===u.id).map(n=>`<option value="${n.id}" ${n.id===c.id?'selected':''}>${n.id} · ${esc(n.title)}</option>`).join('')}</optgroup>`).join('')}</select></label><label>Map view<select id="graph-scope"><option value="focus" ${state.graphScope==='focus'?'selected':''}>Around this concept</option><option value="unit" ${state.graphScope==='unit'?'selected':''}>This unit + prerequisites</option><option value="all" ${state.graphScope==='all'?'selected':''}>Whole curriculum</option></select></label></div>
    <div class="graph-workspace"><section class="map-panel"><div class="map-toolbar"><div class="graph-help"><span>Prerequisite</span><span aria-hidden="true">→</span><span>Dependent concept</span></div><details class="map-options"><summary>Map options</summary><div><label class="connection-toggle"><input type="checkbox" id="connections" ${state.connections?'checked':''}> Other math connections</label><button class="text-link" data-action="export-map">Download this map · SVG</button></div></details></div>${masteryLegend()}<div id="graph-container" class="graph-container" aria-label="Interactive knowledge graph"></div><div class="graph-bottom"><span class="map-hint">Select a concept to trace its connections. Drag to move.</span><div class="zoom-controls"><button data-action="zoom-out" aria-label="Zoom out">−</button><span id="zoom-label">100%</span><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="fit">Fit</button></div></div></section>${renderGraphProfile()}</div>
    <section class="graph-selection" aria-label="Selected concept"><div><span class="topic-number" style="--unit:${units[c.unit].color}">${c.id}</span><div><h2>${esc(c.title)}</h2><p>${math(c.objective)}</p>${masterySummary(c)}</div></div><div class="button-row">${conceptReportButton(c.id)}<button class="button" data-action="notes" data-id="${c.id}">Concept notes</button><button class="button primary" data-action="practice" data-id="${c.id}">Try ${qs(c.id).length} questions →</button></div></section>
  ${renderNodeObservations(state.attempts,c.id,state.scoringPreferences)}</section>`;
}
function selectGraphConcept(id){
  if(state.view!=='graph')return selectConcept(id);
  const priorUnit=byId.get(state.selected).unit;
  const viewport=graphState?{x:graphState.x,y:graphState.y,scale:graphState.scale}:null;
  state.selected=id;render();
  if(viewport&&(state.graphScope==='all'||(state.graphScope==='unit'&&byId.get(id).unit===priorUnit))){Object.assign(graphState,viewport);transformGraph();}
  const selected=[...document.querySelectorAll('.graph-node')].find(n=>n.dataset.concept===id);
  selected?.focus({preventScroll:true});announce(`Selected ${byId.get(id).title}. Concept notes and practice are below the graph.`);
}
function renderDetail(c){
  const dependent=relationships.filter(e=>e.type==='prerequisite'&&relationshipInCourse(state.course,e)&&e.source===c.id).map(e=>e.target).filter(id=>eligible(byId.get(id)));
  return `<section class="concept-notes"><div class="note-grid"><article class="rule-card"><h2>The key idea</h2><p>${math(c.rule)}</p></article><article class="first-step"><h2>A place to start</h2><p>${math(c.firstStep)}</p></article></div><details class="detail-section"><summary>Skills in this concept</summary><ul>${c.subskills.map(s=>`<li>${math(s)}</li>`).join('')}</ul></details>${c.curriculum==='algebra'?renderStandards(c):''}<details class="detail-section"><summary>A common mix-up</summary><p>${math(c.misconception)}</p></details><details class="detail-section"><summary>Builds on · ${prerequisiteIds(c).length}</summary>${linkChips(prerequisiteIds(c))}</details><details class="detail-section"><summary>Leads to · ${dependent.length}</summary>${dependent.length?linkChips(dependent):'<p class="muted">No direct dependent in this model. Use the other math connections option to explore related ideas.</p>'}</details></section>`;
}
function renderStandards(c){
  const aligned=standards.filter(s=>c.standardIds.includes(s.id));
  return `<details class="detail-section"><summary>${aligned.length?'TEKS references':'Prerequisite support'}</summary>${aligned.length?`<ul class="standard-list">${aligned.map(s=>`<li><a href="${esc(s.sourceUrl)}" target="_blank" rel="noreferrer">${esc(s.id)} · ${esc(s.reference)}</a> — ${esc(s.summary)}${s.kind==='process'?' (supporting practice)':''}</li>`).join('')}</ul><p class="small muted">Coverage references with sampled practice. These checks do not assess every part of a standard.</p>`:'<p>This foundational skill supports the Algebra courses; it is not an additional high-school TEKS requirement.</p>'}</details>`;
}
function renderTable(){
  const list=visibleConcepts();
  return `<section class="table-panel"><div class="section-line table-top"><div><h2>${state.unit==='all'?'All concepts':units[Number(state.unit)].title}</h2><span class="muted small">${list.length} results · select a title to inspect its connections</span></div><button class="button compact" data-action="all-units">Show all units</button></div><div class="table-scroll"><table><thead><tr><th scope="col">ID</th><th scope="col">Concept & learning objective</th><th scope="col">Course</th><th scope="col">Builds on</th><th scope="col">First attempts</th><th scope="col">Practice</th></tr></thead><tbody>${list.map(c=>{const s=conceptStats(c);return `<tr><td class="id-cell">${c.id}</td><td><button class="text-link concept-title" data-action="select" data-id="${c.id}">${esc(c.title)}</button><p>${math(c.objective)}</p></td><td>${badge(c)}</td><td><div class="prereq-ids">${prerequisiteIds(c).map(p=>`<button title="${esc(byId.get(p).title)}" data-action="select" data-id="${p}">${p}</button>`).join('')||'—'}</div></td><td><strong>${pct(s.firstAccuracy)}</strong><small>${s.attempted}/${s.available} answered</small></td><td><button class="button compact" data-action="practice" data-id="${c.id}">Try ${qs(c.id).length}</button></td></tr>`;}).join('')}</tbody></table>${!list.length?'<div class="empty-state"><h3>No matching concepts</h3><p>Try a shorter search, or show all units.</p><button class="button" data-action="clear-search">Clear search</button></div>':''}</div></section>`;
}
function renderAbout(){
  return `<section class="about-panel"><div class="about-intro"><span class="eyebrow">THE MODEL BEHIND THE MAP</span><h2>A curriculum you can inspect.</h2><p>Choose Algebra I, Algebra II, AP Calculus AB, AP Calculus BC, or Calculus subset. The subset follows a focused route to Algebraic limit techniques (1.6), including Algebra I and II connections. It shares question IDs and saved progress with the full courses. Every concept has ten questions and explicit prerequisites. Algebra I contains 65 concepts; Algebra II includes those prerequisites plus 21 advanced concepts. The Calculus ontology covers 111 AP BC topics and 16 foundation groups. Downloads follow the selected course.</p></div><div class="about-grid"><article><h3>What an arrow means</h3><p>A solid arrow runs from a prerequisite to a concept that uses it. These are authored instructional judgments, not an official College Board or TEKS dependency graph. They form an acyclic graph; course order alone does not create an arrow.</p><p>Dashed connections are labeled <em>generalizes, inverse_operation, applies, approximates, represents, contrasts, extends,</em> or <em>related</em>. Their direction describes the relationship in the export and does not impose a learning order.</p></article><article><h3>Accuracy & practice mastery</h3><p>First-attempt accuracy counts the first response to each attempted question. Latest accuracy counts the most recent response to those questions. All-attempt accuracy includes retries. Unanswered questions are not scored as incorrect in accuracy. Graph views show accuracy, an experimental combined score, or a camera expression score. Camera labels are estimates; they do not measure felt emotions. Settings can include a small check-in contribution in the combined score. Accuracy fill uses latest correct answers divided by all questions, without a timing adjustment. The exported practice-mastery score retains question coverage and a small time adjustment, capped at 3 percentage points. The timer allows two minutes of full credit; beyond five minutes a correct answer still earns 97% credit. Accuracy and diagnostic passing depend only on correctness.</p><p>Ten questions sample a concept’s skills. These original items are practice checks, not a validated mastery measure or a prediction of an AP score.</p></article><article><h3>Support without labels</h3><p>Potential stumbling points describe the task, not the student. Concrete first steps, visible prerequisites, practice without deadlines and specific feedback support review without inferring a learner’s emotions or ability from an error.</p><p>Every group covers several subskills. Ten questions do not exhaust every subskill or reproduce the AP exam’s free-response format.</p></article><article><h3>Your data</h3><p>Attempts stay in this browser’s local storage. They include question ID, concept ID, answer, correctness, answer date, active response time when recorded, and bank version. Optional self-reported emotion check-ins and numeric facial-movement and expression-probability summaries may also be attached to an answer. No images, video, audio or resting-face references are saved. There is no account, remote database or cross-device sync.</p><p>Export a backup to keep your history. Import merges valid records by attempt ID without duplicating them. Use Settings → Delete saved data to remove local history and reset accuracy and graph shading.</p></article></div><h3>Schema & reuse</h3><p class="schema-line"><code>Concept</code> → <code>Relationship</code> → <code>Question</code> → <code>Attempt</code></p><p>Stable IDs join the CSVs and JSON. Topic membership is distinct from prerequisite dependencies. Foundations are additional review groups. Mathematical practices and representations are teaching tags, not item-level official AP skill assignments. The Algebra crosswalk maps all content expectations in Texas TEKS §111.39 and §111.40, with separate supporting process references. The questions sample those skills; extended reasoning, hands-on graphing, and independent technology use require additional practice. Calculus topic references follow the AP BC framework.</p><h3>Curriculum sources</h3><ul class="source-list">${sources.map(s=>`<li>${s.url?`<a href="${s.url}" target="_blank" rel="noreferrer">${esc(s.title)} ↗</a>`:`<strong>${esc(s.title)}</strong>`}<p>${esc(s.note)}</p></li>`).join('')}</ul><p class="muted small">Reviewed ${metadata.updated}. Topic names, summaries, questions and explanations are authored for this project. AP and College Board are registered trademarks; this project is not affiliated with or endorsed by College Board.</p></section>`;
}
function renderPractice(c){
  const check=state.progressChecks.find(s=>s.id===state.progressCheckId&&eligibleCheck(s));
  if(check&&check.status!=='completed')return renderProgressCheck(check,byId.get(check.conceptId));
  const qz=state.quiz;
  if(!qz){
    const list=concepts.filter(eligible);
    return `<section class="page-heading"><div><h1>Practice</h1><p>Choose a concept for a practice set with explanations and no time limit.</p></div></section>${renderRecommendation()}<section class="practice-picker"><label for="practice-concept">Concept</label><select id="practice-concept">${units.filter(u=>list.some(c=>c.unit===u.id)).map(u=>`<optgroup label="${esc(unitLabel(u.id)+' · '+u.title)}">${list.filter(n=>n.unit===u.id).map(n=>`<option value="${n.id}" ${n.id===c.id?'selected':''}>${n.id} · ${esc(n.title)} · ${qs(n.id).length} questions</option>`).join('')}</optgroup>`).join('')}</select><button class="button primary" data-action="start-picked">Begin practice →</button><p class="muted small">A check passes with at least 8/10 latest answers correct and all ten questions tried. Your first answers and retries are recorded separately. You can leave and continue with unanswered questions later.</p></section>`;
  }
  const concept=byId.get(qz.conceptId),s=conceptStats(concept);
  if(qz.index>=qz.list.length){
    const correct=qz.results.filter(r=>r.correct).length;
    return `<section class="practice-complete"><span class="eyebrow">SET COMPLETE</span><h1 tabindex="-1">${qz.diagnosticCheck?'Check complete.':'Practice set complete.'}</h1><h2>${esc(concept.title)}</h2><div class="result-number">${correct}<span> / ${qz.list.length}</span></div><p>correct in this set</p><div class="result-summary"><span><strong>${pct(s.firstAccuracy)}</strong> first-attempt accuracy</span><span><strong>${pct(s.latestAccuracy)}</strong> latest-answer accuracy</span></div><p class="muted">These practice checks sample this concept; accuracy is not a full measure of understanding.</p><p class="diagnostic-outcome" data-status="${diagnostic.nodes.get(concept.id).status}">${DIAGNOSTIC_LABELS[diagnostic.nodes.get(concept.id).status]} · ${s.latestCorrect}/${s.available} latest answers correct</p>${(()=>{const check=state.progressChecks.find(c=>c.id===qz.sessionId);return check?.status==='completed'?`<details class="completed-reflection"><summary>Progress check saved</summary>${renderCheckResponse(check)}</details>`:'';})()}${renderRecommendation()}<div class="review-list">${qz.results.map((r,i)=>{const q=qz.list[i];return `<details><summary><span class="result-mark ${r.correct?'correct':'review'}">${r.correct?'✓':'↺'}</span><span class="review-prompt">${math(q.prompt)}</span></summary><p><strong>Answer:</strong> ${math(q.options.find(o=>o.id===q.correctOptionId).text)}</p><p>${math(q.explanation)}</p><p class="answer-time">Active time: ${formatDuration(r.durationMs)}</p></details>`;}).join('')}</div><div class="button-row"><button class="button primary" data-action="select" data-id="${concept.id}">Back to its connections →</button><button class="button" data-action="practice" data-id="${concept.id}">Practice again</button><button class="button" data-action="view" data-view="progress">View progress</button>${conceptReportButton(concept.id)}</div></section>`;
  }
  const q=qz.list[qz.index],prior=state.attempts.filter(a=>a.questionId===q.id),already=prior.length>(qz.answered?1:0),correct=qz.choice===q.correctOptionId;
  return `<div class="practice-top"><button class="text-link" data-action="select" data-id="${concept.id}">← Back to ${esc(concept.title)}</button>${badge(concept)}</div>${practiceTools.toolbar()}<div class="practice-workspace"><div class="practice-primary"><section class="question-card"><div class="question-meta"><span>${concept.id} · QUESTION ${qz.index+1} OF ${qz.list.length}${qz.diagnosticCheck?' · DIAGNOSTIC':''}</span><span>${already?'Review attempt':'First attempt'}</span></div><div class="question-timing"><div class="elapsed-time"><span id="timer-status">Active time</span><span id="question-timer" role="timer" aria-live="off" aria-label="Time on this question">0:00</span></div><details class="timing-help"><summary>About timing</summary><p>${timingExplanation()}</p></details></div><div class="question-steps" aria-label="Question ${qz.index+1} of ${qz.list.length}">${qz.list.map((_,i)=>`<span class="${i<qz.index?'done':i===qz.index?'current':''}"></span>`).join('')}</div><h1 class="question-title" id="question-title" tabindex="-1">${math(q.prompt)}</h1><fieldset class="answer-options" ${qz.answered?'disabled':''}><legend class="sr-only">Choose one answer</legend>${q.options.map((o,i)=>`<label class="answer-option ${qz.choice===o.id?'chosen':''} ${qz.answered&&o.id===q.correctOptionId?'correct-answer':''} ${qz.answered&&qz.choice===o.id&&!correct?'incorrect-answer':''}"><input type="radio" name="answer" value="${o.id}" ${qz.choice===o.id?'checked':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span class="answer-text">${math(o.text)}</span>${qz.answered&&o.id===q.correctOptionId?'<span class="answer-status">Correct answer</span>':''}</label>`).join('')}</fieldset>${qz.answered?`<div class="answer-feedback ${correct?'right':'revisit'}" role="status"><strong>${correct?'That’s correct.':'Here’s the step to revisit.'}</strong><p>${math(q.explanation)}</p>${!correct?`<p class="feedback-tip">${math(concept.firstStep)}</p>`:''}</div><button class="button primary" data-action="next">${qz.index===qz.list.length-1?'Progress check':'Next question'} →</button>`:`<button class="button primary" id="check-answer" data-action="submit" ${!qz.choice?'disabled':''}>Check answer →</button><p class="small muted">Select an answer to check it. There’s no time limit.</p>`}</section>${renderObservationPanel(qz,camera)}<details class="practice-context"><summary>Review the prerequisites</summary><div class="context-links">${linkChips(prerequisiteIds(concept))}</div></details></div>${practiceTools.markup(concept.id)}</div>`;
}
function renderProgress(overall){
  const rows=concepts.filter(eligible).filter(c=>['passed','review','partial'].includes(state.progressFilter)?diagnostic.nodes.get(c.id).status===state.progressFilter:state.progressFilter==='all'||(state.progressFilter==='started'?conceptStats(c).attempted>0:conceptStats(c).attempted===0));
  return `<section class="page-heading"><h1 tabindex="-1">Your progress</h1><div class="button-row">${reportButton()}<button class="text-link" data-action="view" data-view="settings">Backups & exports</button></div></section>${renderDiagnosticSummary()}<section class="progress-summary" aria-label="Practice summary"><div><span>First answers</span><strong>${pct(overall.firstAccuracy)}</strong><small>${overall.firstCorrect} of ${overall.attempted} correct</small></div><div><span>Latest answers</span><strong>${pct(overall.latestAccuracy)}</strong><small>${overall.latestCorrect} of ${overall.attempted} correct</small></div><div><span>Total attempts</span><strong>${overall.total}</strong><small>${overall.correct} correct, including retries</small></div></section><details class="accuracy-note"><summary>How accuracy is counted</summary><p>Unanswered questions are unscored. First-attempt accuracy keeps your first answer to each question; latest accuracy uses the most recent. All-attempt accuracy includes retries. Accuracy graph fill uses latest correct answers divided by all available questions. Other graph views show an experimental combined score or a camera expression score. The combined score can optionally include check-ins. The exported practice-mastery score keeps a timing adjustment of at most 3 percentage points. Accuracy and passing depend only on answers.</p></details>${renderProgressCheckHistory(state.progressChecks,concepts,state.course)}<section class="table-panel"><div class="section-line table-top"><h2>By concept</h2><label>Show <select id="progress-filter"><option value="all" ${state.progressFilter==='all'?'selected':''}>All concepts</option><option value="started" ${state.progressFilter==='started'?'selected':''}>Practiced</option><option value="new" ${state.progressFilter==='new'?'selected':''}>Not yet tried</option>${['passed','review','partial'].map(status=>`<option value="${status}" ${state.progressFilter===status?'selected':''}>${DIAGNOSTIC_LABELS[status]}</option>`).join('')}</select></label></div><div class="table-scroll"><table class="progress-table"><thead><tr><th>Concept</th><th>Coverage</th><th>First accuracy</th><th>Latest accuracy</th><th>Attempts</th><th>Question history</th></tr></thead><tbody>${rows.map(c=>{const s=conceptStats(c);return `<tr><td><span class="id-cell">${c.id}</span> <button class="text-link" data-action="select" data-id="${c.id}">${esc(c.title)}</button><small class="diagnostic-status">${DIAGNOSTIC_LABELS[diagnostic.nodes.get(c.id).status]}</small></td><td>${s.attempted}/${s.available}</td><td>${pct(s.firstAccuracy)}<small>${s.firstCorrect}/${s.attempted} correct</small></td><td>${pct(s.latestAccuracy)}<small>${s.latestCorrect}/${s.attempted} correct</small></td><td>${s.total}</td><td><details class="question-history"><summary>${s.available} questions</summary>${qs(c.id).map((q,i)=>{const st=stats(state.attempts,[q.id]);return `<div><strong>Q${i+1}</strong> ${math(q.prompt)}<small>${st.attempted?`${st.correct}/${st.total} attempts correct · ${pct(st.allAccuracy)} · First: ${st.firstCorrect?'correct':'incorrect'} · Latest: ${st.latestCorrect?'correct':'incorrect'}`:'Not yet answered'}</small>${st.attempted?`<small class="question-time-history">Latest time: ${formatDuration(st.latestDurationMs)}${st.timedAttempts?` · Average: ${formatDuration(st.averageDurationMs)} (${st.timedAttempts} timed ${st.timedAttempts===1?'attempt':'attempts'})`:''}</small>`:''}</div>`;}).join('')}<div class="button-row"><button class="button compact" data-action="practice" data-id="${c.id}">Practice this concept</button>${conceptReportButton(c.id)}</div></details>${renderNodeObservations(state.attempts,c.id,state.scoringPreferences)}</td></tr>`;}).join('')}</tbody></table>${!rows.length?'<div class="empty-state"><h3>No practice here yet</h3><p>Try a concept’s questions to start a record.</p><button class="button" data-action="view" data-view="practice">Choose a concept</button></div>':''}</div></section>`;
}
function renderSettings(){
  const archivedAttempts=state.attempts.filter(a=>archivedQuestionIds.has(a.questionId)).length;
  return `<section class="settings-page"><div class="page-heading"><h1>Settings</h1></div>
    <section class="settings-section camera-settings"><div class="camera-heading"><h2>Camera use</h2><span id="camera-access-state" class="camera-state">${cameraAccess.enabled?'On during practice':'Off'}</span></div><p>Starts automatically during practice after permission is granted. Resting-face calibration begins automatically and takes about six seconds.</p><div class="button-row"><button class="button" id="camera-settings-enable" data-action="camera-enable" ${cameraAccess.enabled?'hidden':''}>Enable camera</button><button class="button" id="camera-revoke" data-action="camera-revoke" ${cameraAccess.enabled?'':'hidden'}>Revoke camera access</button></div><p id="camera-access-message" class="small muted" role="status" hidden></p><details class="score-method"><summary>Browser permission</summary><p>Revoking access here stops capture immediately and keeps camera use off in this app. To remove the browser’s stored permission too, open the camera or site-controls icon beside the address bar and reset this site’s camera permission.</p></details></section>
    <section class="settings-section scoring-settings" aria-labelledby="scoring-title"><h2 id="scoring-title">Score preferences</h2><label class="scoring-toggle"><input type="checkbox" id="include-self-reports" ${state.scoringPreferences.includeSelfReports?'checked':''} aria-describedby="self-report-setting-help"><span>Include self-reported check-ins</span></label><p id="self-report-setting-help" class="small muted">Unpleasant check-ins can reduce the combined score by up to ${SCORE_POLICY.selfReportWeight*100}% of answer credit. Accuracy and the camera-only view stay separate.</p><details class="score-method"><summary>How contributions are counted</summary><p>${combinedExplanation(state.scoringPreferences)}</p></details></section>
    <section class="settings-section"><h2>Saved practice</h2><p><strong>${state.attempts.length} ${state.attempts.length===1?'attempt':'attempts'}</strong> stored in this session. Progress is saved in this browser; it does not sync across devices.</p><div class="button-row"><button class="button" data-action="backup">Export backup</button><label class="button file-button">Import backup<input id="import-file" type="file" accept="application/json,.json"></label></div><p class="muted small">Backups include answer snapshots of the scratch pad, progress checks, saved check-ins, camera summaries and score preferences. Import merges attempts and restores any included score preference.</p>${archivedAttempts?`<p class="small muted" id="archived-attempt-note">${archivedAttempts} earlier ${archivedAttempts===1?'answer is':'answers are'} preserved for replaced questions. Revised problems need fresh answers for accuracy and diagnostic passing. Your earlier camera observations remain part of each concept’s history.</p>`:''}</section>
    <details class="settings-section"><summary>Check-ins & camera data</summary><p>Camera permission is requested on your first visit. Once allowed, camera use starts automatically in practice. You can revoke access above. Measurements run locally. Camera images, video, audio and the resting reference are never stored or uploaded. Only numeric summaries and voluntary emotion check-ins are saved with answers.</p><p>The camera stops when you leave practice or hide this tab. Your resting-face calibration is kept in memory during this visit and reused when you return to practice. Brief interruptions pause calibration progress. Reloading the page or revoking camera access clears the reference. The question timer pauses during calibration; you can recalibrate at any time. Camera preferences belong to this browser and are not restored from practice backups. Check-ins work without a camera. Graph views can show an experimental camera-adjusted score, with facial movement as a separate border. Raw answer accuracy, passing and diagnostic recommendations do not change. Check-ins contribute to the combined view only when enabled above.</p>${observationMethod(state.scoringPreferences)}</details>
    <details class="settings-section"><summary>Progress & observation exports</summary><div class="download-list">${reportButton()}<button data-action="export-progress">Selected course · accuracy, mastery & observations <span>CSV ↓</span></button><button data-action="export-question-progress">Selected course · question accuracy <span>CSV ↓</span></button><button data-action="export-attempts">Every attempt <span>CSV ↓</span></button><button data-action="export-progress-checks">Selected course · progress checks <span>CSV ↓</span></button></div></details>
    <details class="settings-section"><summary>Curriculum downloads</summary><div class="download-list">${[['concepts.csv','Concepts','CSV'],['relationships.csv','Relationships','CSV'],['questions.csv','Questions & answers','CSV'],['ontology.json','Complete ontology','JSON'],['concept-map.svg','Complete concept graph','SVG'],['coverage.csv',COURSES[state.course].kind==='subset'?'AP & TEKS references':state.course.startsWith('ALG')?'TEKS crosswalk & question evidence':'AP topic & question coverage','CSV'],['question-audit.csv','Question review by concept','CSV'],['archived-questions.json','Earlier question versions','JSON']].map(([file,label,type])=>`<a download href="/data/${state.course.toLowerCase()}/${file}">${label}<span>${type} ↓</span></a>`).join('')}</div></details>
    <details class="settings-section"><summary>Getting started</summary><button class="button compact setup-replay" data-action="review-setup">Review the tour & camera setup</button></details>
    <section class="settings-section delete-section"><h2>Delete saved data</h2><p>Remove all practice history, scratch pad drawings and typed notes, progress checks, accuracy and mastery records, emotion check-ins, camera summaries, score preferences and the current practice set from this browser. Camera use will be turned off. Downloaded backups and data on other devices are kept.</p><button class="button danger" id="delete-data" data-action="delete-data">Delete my practice data</button></section>
    <dialog id="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Delete your practice data?</h2><p id="delete-description">All ${state.attempts.length} practice attempts, scratch pad drawings and typed notes, progress checks, accuracy records, emotion check-ins and camera summaries will be removed from this browser. Your current practice set will also end. This cannot be undone. Backups include saved answer snapshots, but not current scratch-pad edits or typed notes.</p><p id="delete-error" class="delete-error" role="alert" hidden></p><div class="button-row"><button class="button" data-action="cancel-delete" autofocus>Keep my data</button><button class="button danger" data-action="confirm-delete">Delete data</button></div></dialog>
  </section>`;
}
function deleteProgress(){
  try{practiceTools.clear();localStorage.removeItem(STORAGE_KEY);}
  catch{const error=document.querySelector('#delete-error');error.hidden=false;error.textContent='This browser could not delete all saved data. Try again or manage this site’s storage in your browser settings.';return;}
  dataRevision++;state.attempts=[];state.progressChecks=[];state.progressCheckId=null;state.quiz=null;state.graphMode='accuracy';state.scoringPreferences=normalizeScoringPreferences();state.storageMessage='';readFailed=false;cameraAccess.revoke();
  document.querySelector('#delete-dialog').close();render();document.querySelector('#delete-data').focus();toast('Your practice data has been deleted from this browser.');
}

let graphState=null;
function mountGraph(){
  const selected=state.selected,allowed=concepts.filter(eligible);let nodes;
  const edges=relationships.filter(e=>relationshipInCourse(state.course,e)&&(state.connections||e.type==='prerequisite'));
  if(state.graphScope==='focus'){
    const ids=new Set([selected,...edges.filter(e=>e.source===selected||e.target===selected).flatMap(e=>[e.source,e.target])]);nodes=allowed.filter(c=>ids.has(c.id));
  }else if(state.graphScope==='unit'){
    const list=allowed.filter(c=>c.unit===byId.get(selected).unit),ids=new Set(list.map(c=>c.id));
    for(const c of list)for(const id of prerequisiteIds(c))ids.add(id);nodes=allowed.filter(c=>ids.has(c.id));
  }else nodes=allowed;
  const compact=window.innerWidth<=520&&state.graphScope==='focus';
  const layout=graphLayout(nodes,edges,{focus:state.graphScope==='focus'?selected:null,compact,progress:graphProgress()});
  const container=document.querySelector('#graph-container');container.innerHTML=drawGraph(layout,units,{selected,progress:graphProgress(),fillMode:state.graphMode,scoringPreferences:state.scoringPreferences,recommended:diagnostic.recommendation.targetId});
  if(compact){container.style.height=Math.min(900,layout.height)+'px';container.style.minHeight=container.style.height;}else {container.style.height='';container.style.minHeight='';}
  document.querySelector('.graph-help>span:nth-child(2)').textContent=compact?'↓':'→';
  const svg=container.querySelector('svg'),world=container.querySelector('#graph-world');
  graphState={layout,container,svg,world,scale:1,x:0,y:0};fitGraph();
  let drag=null,moved=false;
  svg.addEventListener('pointerdown',e=>{if(e.target.closest('.graph-node'))return;drag={x:e.clientX,y:e.clientY,ox:graphState.x,oy:graphState.y};moved=false;svg.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(!drag)return;moved=true;graphState.x=drag.ox+e.clientX-drag.x;graphState.y=drag.oy+e.clientY-drag.y;transformGraph();});
  svg.addEventListener('pointerup',()=>{drag=null;});svg.addEventListener('pointercancel',()=>{drag=null;});
  svg.addEventListener('keydown',e=>{const n=e.target.closest('[data-concept]');if(n&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectGraphConcept(n.dataset.concept);}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();graphState.x+=e.key==='ArrowLeft'?40:e.key==='ArrowRight'?-40:0;graphState.y+=e.key==='ArrowUp'?40:e.key==='ArrowDown'?-40:0;transformGraph();}});
  svg.addEventListener('click',e=>{const n=e.target.closest('[data-concept]');if(n&&!moved)selectGraphConcept(n.dataset.concept);moved=false;});
  svg.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();zoom(e.deltaY<0?1.15:1/1.15);}},{passive:false});
  svg.setAttribute('tabindex','0');
}
function transformGraph(){if(!graphState)return;graphState.world.setAttribute('transform',`translate(${graphState.x},${graphState.y}) scale(${graphState.scale})`);const label=document.querySelector('#zoom-label');if(label)label.textContent=Math.round(graphState.scale*100)+'%';}
function fitGraph(){if(!graphState)return;const g=graphState,w=g.container.clientWidth,h=g.container.clientHeight;g.scale=Math.min((w-24)/g.layout.width,(h-24)/g.layout.height,1.1);g.x=(w-g.layout.width*g.scale)/2;g.y=(h-g.layout.height*g.scale)/2;transformGraph();}
function zoom(factor){if(!graphState)return;const g=graphState,n=Math.max(0.025,Math.min(2.5,g.scale*factor)),cx=g.container.clientWidth/2,cy=g.container.clientHeight/2;g.x=cx-(cx-g.x)*n/g.scale;g.y=cy-(cy-g.y)*n/g.scale;g.scale=n;transformGraph();}
window.addEventListener('resize',()=>{if(state.view==='graph'||(state.view==='atlas'&&state.tab==='map'))mountGraph();});

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]');if(!el)return;const {action,id}=el.dataset;
  if(el.tagName==='A')e.preventDefault();
  if(action==='choose-course'){chooseCourse(el.dataset.course);return;}
  if(action==='onboarding-back'){setOnboardingStep(el.dataset.step);return;}
  if(action==='onboarding-camera'){setOnboardingStep('camera');return;}
  if(action==='onboarding-enable-camera'){void enableOnboardingCamera();return;}
  if(action==='onboarding-finish'){finishOnboarding(false);return;}
  if(action==='onboarding-skip-camera'){finishOnboarding(true);return;}
  if(action==='review-setup'){state.quiz=null;state.progressCheckId=null;camera.stop();setOnboardingStep('tutorial');return;}
  if(action==='select')return selectConcept(id);
  if(action==='export-report'){void exportReport();return;}
  if(action==='export-concept-report'){void exportConceptReport(id);return;}
  if(action==='graph-mode'){setGraphMode(el.dataset.mode);return;}
  if(action==='notes')return selectConcept(id,'notes');
  if(action==='practice')return startPractice(id);
  if(action==='diagnostic'){startPractice(id,{diagnosticCheck:true});document.querySelector('.question-title')?.focus();return;}
  if(action==='recommendation-map'){state.view='graph';state.selected=id;state.graphScope='focus';state.query='';render();document.querySelector('#graph-container').scrollIntoView({block:'center',behavior:'smooth'});return;}
  if(action==='camera-enable'){void cameraAccess.request();return;}
  if(action==='camera-stop'||action==='camera-revoke'){cameraAccess.revoke();announce('Camera access is off in this app.');return;}
  if(action==='camera-calibrate'){camera.beginCalibration();return;}
  if(action==='submit'){
    const z=state.quiz;if(!z||z.answered||!z.choice)return;const q=z.list[z.index];
    z.durationMs=questionClock.finish();
    const attempt={id:crypto.randomUUID(),questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:z.choice,correct:z.choice===q.correctOptionId,answeredAt:new Date().toISOString(),sessionId:z.sessionId,durationMs:z.durationMs};
    const scratchSnapshot=practiceTools.scratch.snapshot(q.conceptId);if(scratchSnapshot)attempt.scratchSnapshot=scratchSnapshot;
    const expression=camera.finishExpression();if(expression)attempt.facialExpression=expression;
    const movement=camera.finish();if(movement)attempt.facialMovement=movement;
    if(z.checkIn?.emotion&&z.checkIn?.intensity&&z.checkIn?.valence)attempt.selfReport=selfReport(z.checkIn);
    z.answered=true;z.results.push(attempt);state.attempts.push(attempt);const check=createProgressCheck(z,state.attempts,questions,state.course);if(check&&!state.progressChecks.some(c=>c.id===check.id))state.progressChecks.push(check);persist();render();announce(attempt.correct?'Correct. '+q.explanation:'Review this step. '+q.explanation);return;
  }
  if(action==='next'){
    const z=state.quiz;if(!z?.answered)return;z.index++;z.choice=null;z.answered=false;z.durationMs=null;z.checkIn=null;
    const check=state.progressChecks.find(c=>c.id===z.sessionId);if(z.index>=z.list.length&&check?.status==='pending')state.progressCheckId=check.id;
    render();const heading=document.querySelector('#progress-check-title, .question-title, .practice-complete h1');heading?.focus({preventScroll:true});heading?.scrollIntoView({block:'start',behavior:'smooth'});
    announce(state.progressCheckId?'Set complete. Progress check.':z.index>=z.list.length?'Practice set complete':`Question ${z.index+1} of ${z.list.length}`);return;
  }
  if(action==='skip-progress-check'){finishProgressCheck('skipped');return;}
  if(action==='resume-progress-check'){
    const check=state.progressChecks.find(c=>c.id===id&&eligibleCheck(c));if(!check||check.status==='completed')return;
    check.status='pending';state.progressCheckId=check.id;state.quiz=null;state.view='practice';persist();render();document.querySelector('#progress-check-title')?.focus();return;
  }
  if(action==='start-picked')return startPractice(document.querySelector('#practice-concept').value);
  if(action==='delete-data'){document.querySelector('#delete-dialog').showModal();return;}
  if(action==='cancel-delete'){document.querySelector('#delete-dialog').close();return;}
  if(action==='confirm-delete'){deleteProgress();return;}
  if(action==='view'){state.view=el.dataset.view;state.query='';if(state.view==='practice'&&!state.quiz&&!state.progressCheckId)state.progressCheckId=state.progressChecks.findLast(c=>eligibleCheck(c)&&c.status==='pending')?.id??null;if(state.view==='atlas'){state.tab='browse';state.unit='all';}if(state.view==='graph')state.graphScope='focus';}
  else if(action==='home'){state.view='atlas';state.tab='browse';state.query='';state.unit='all';}
  else if(action==='table'){state.tab='table';}
  else if(action==='full-map'){state.view='graph';state.graphScope='all';state.query='';}
  else if(action==='tab'){state.tab=el.dataset.tab;}
  else if(action==='about'){state.view='atlas';state.tab='about';}
  else if(action==='all-units'){state.unit='all';}
  else if(action==='clear-search'){state.query='';state.unit='all';}
  else if(action==='zoom-in')return zoom(1.25);
  else if(action==='zoom-out')return zoom(0.8);
  else if(action==='fit')return fitGraph();
  else if(action==='export-map'){if(graphState)download('concept-map-view.svg',drawGraph(graphState.layout,units,{selected:state.selected,standalone:true,title:courseTitle(state.course)+' · Concept dependencies',progress:graphProgress(),fillMode:state.graphMode,scoringPreferences:state.scoringPreferences,recommended:diagnostic.recommendation.targetId}),'image/svg+xml');return;}
  else if(action==='export-progress'){exportProgress();return;}
  else if(action==='export-question-progress'){exportQuestionProgress();return;}
  else if(action==='export-progress-checks'){download('progress-checks.csv',csv(progressCheckRows(state.progressChecks.filter(eligibleCheck)),PROGRESS_CHECK_COLUMNS));return;}
  else if(action==='export-attempts'){download('practice-attempts.csv',csv(state.attempts.map(a=>({...a,...observationColumns(a),...expressionColumns(a)})),['id','questionId','conceptId','bankVersion','choiceId','correct','answeredAt','sessionId','durationMs',...Object.keys(observationColumns({})),...Object.keys(expressionColumns({}))]));return;}
  else if(action==='backup'){download('calculus-clinic-progress.json',JSON.stringify({schemaVersion:1,bankVersion:metadata.bankVersion,exportedAt:new Date().toISOString(),scoringPreferences:state.scoringPreferences,attempts:state.attempts,progressChecks:state.progressChecks},null,2),'application/json');return;}
  render();
});
document.addEventListener('submit',e=>{if(e.target.id==='progress-check-form'){e.preventDefault();finishProgressCheck('completed');}});
document.addEventListener('input',e=>{
  const form=e.target.closest('#progress-check-form');
  if(form){
    const check=state.progressChecks.find(c=>c.id===form.dataset.checkId);if(!check||check.status!=='pending')return;
    const data=new FormData(form);check.ease=Number(data.get('ease'))||null;check.progress=Number(data.get('progress'))||null;check.feelings=data.getAll('feelings');check.note=String(data.get('note')??'');
    document.querySelector('#progress-check-error').hidden=true;persist();return;
  }
  if(e.target.id==='search'){state.query=e.target.value;state.unit='all';render();}
});
document.addEventListener('change',async e=>{
  const el=e.target;
  if(el.id.startsWith('checkin-')&&state.quiz&&!state.quiz.answered){state.quiz.checkIn??={};state.quiz.checkIn[el.id.slice(8)]=el.id==='checkin-intensity'?Number(el.value)||null:el.value;updateCheckInScore();return;}
  if(el.name==='answer'){if(!state.quiz||state.quiz.answered)return;state.quiz.choice=el.value;document.querySelectorAll('.answer-option').forEach(n=>n.classList.toggle('chosen',n.querySelector('input').checked));document.querySelector('#check-answer').disabled=false;return;}
  if(el.id==='course'){chooseCourse(el.value);return;}
  if(el.id==='unit-filter'){state.unit=el.value==='all'?'all':Number(el.value);state.query='';render();}
  if(el.id==='graph-concept'){state.selected=el.value;state.graphScope='focus';render();}
  if(el.id==='include-self-reports'){state.scoringPreferences=normalizeScoringPreferences({includeSelfReports:el.checked});persist();renderStoredProgress();announce('Check-in contribution '+(state.scoringPreferences.includeSelfReports?'enabled':'disabled'));return;}
  if(el.id==='graph-mode'){setGraphMode(el.value);return;}
  if(el.id==='graph-scope'){state.graphScope=el.value;mountGraph();}
  if(el.id==='connections'){state.connections=el.checked;mountGraph();}
  if(el.id==='progress-filter'){state.progressFilter=el.value;render();}
  if(el.id==='import-file'){
    const file=el.files[0],revision=dataRevision;if(!file)return;
    try{if(file.size>20_000_000)throw new Error('Choose a backup smaller than 20 MB.');const data=JSON.parse(await file.text());if(revision!==dataRevision)return;const incoming=validateBackup(data,attemptQuestions,metadata.compatibleBankVersions),incomingChecks=validateProgressChecks(data.progressChecks,incoming,concepts),before=state.attempts.length,merged=mergeAttempts(state.attempts,incoming),checks=validateProgressChecks(mergeProgressChecks(state.progressChecks,incomingChecks),merged,concepts);state.attempts=merged;state.progressChecks=checks;if(state.progressChecks.find(c=>c.id===state.progressCheckId)?.status==='completed')state.progressCheckId=null;if(Object.hasOwn(data,'scoringPreferences'))state.scoringPreferences=normalizeScoringPreferences(data.scoringPreferences);readFailed=false;persist();render();toast(`Imported ${state.attempts.length-before} new attempts. Existing attempts kept.`);}catch(error){toast(`Backup not imported. ${error.message}`);el.value='';}
  }
});
function renderStoredProgress(){
  const viewport=document.querySelector('#map-svg')&&graphState?{x:graphState.x,y:graphState.y,scale:graphState.scale}:null;
  render();
  if(viewport&&document.querySelector('#map-svg')){Object.assign(graphState,viewport);transformGraph();}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&(!state.onboarding||state.onboarding==='camera'))void cameraAccess.initialize();syncQuestionClock();updateCameraUI();});
// Focusing the embedded calculator blurs the parent window but keeps the page
// focused. Wait for focus to settle before deciding whether practice is paused.
window.addEventListener('blur',()=>{setTimeout(()=>{syncQuestionClock();updateCameraUI();},0);});
window.addEventListener('focus',()=>{syncQuestionClock();updateCameraUI();});
window.addEventListener('pagehide',()=>{pageActive=false;cameraAccess.cancelPending();camera.stop();questionClock.setRunning(false);});
window.addEventListener('pageshow',()=>{pageActive=true;syncQuestionClock();});
setInterval(updateQuestionTimer,250);
window.addEventListener('storage',e=>{
  if(e.key===CAMERA_ACCESS_KEY||e.key===null)cameraAccess.syncFromStorage();
  if(e.key!==STORAGE_KEY&&e.key!==null)return;
  try{
    // Read the current value so an older queued event cannot restore deleted data.
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved===null){dataRevision++;state.attempts=[];state.progressChecks=[];state.progressCheckId=null;state.quiz=null;state.graphMode='accuracy';state.scoringPreferences=normalizeScoringPreferences();state.storageMessage='';readFailed=false;cameraAccess.revoke();renderStoredProgress();toast('Practice data was cleared in another tab.');return;}
    const value=JSON.parse(saved);if(value.schemaVersion!==1)return;
    const attempts=validateAttempts(value.attempts,attemptQuestions),checks=validateProgressChecks(value.progressChecks,attempts,concepts);const wasChecking=!!state.progressCheckId;state.attempts=attempts;state.progressChecks=checks;if(state.progressChecks.find(c=>c.id===state.progressCheckId)?.status!=='pending')state.progressCheckId=null;state.graphMode=normalizeGraphMode(value.graphMode);state.scoringPreferences=normalizeScoringPreferences(value.scoringPreferences);readFailed=false;state.storageMessage='';if(state.view!=='practice'||!state.quiz||wasChecking)renderStoredProgress();
  }catch{/* Retain the valid session if another tab writes invalid data. */}
});
render();
if(!document.hidden&&(!state.onboarding||state.onboarding==='camera'))void cameraAccess.initialize();
