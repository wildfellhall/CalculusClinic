import {csv,stats,validateAttempts,validateBackup,mergeAttempts,STORAGE_KEY} from './core.mjs';
import {diagnosticState,DIAGNOSTIC_LABELS,PASS_THRESHOLD} from './diagnostic.mjs';
import {QuestionClock,formatDuration,TIMING_POLICY} from './timing.mjs';
import {graphLayout,drawGraph,masteryFill,escapeHTML as esc} from './graph.mjs';
import {formatMathText,refreshMathOverflow} from './math.mjs';

const {concepts,relationships,questions,units,sources,metadata}=window.CALCULUS_DATA;
const math=text=>formatMathText(text,window.CALCULUS_DATA.mathText);
document.fonts.ready.then(refreshMathOverflow);
document.fonts.addEventListener('loadingdone',refreshMathOverflow);
window.addEventListener('resize',refreshMathOverflow);
document.addEventListener('toggle',refreshMathOverflow,true);
const byId=new Map(concepts.map(c=>[c.id,c]));
const qs=id=>questions.filter(q=>q.conceptId===id);
const pct=value=>value===null?'—':Math.round(value*100)+'%';
const state={view:'atlas',tab:'browse',unit:'all',selected:'1.11',course:'BC',query:'',graphScope:'focus',connections:false,progressFilter:'started',quiz:null,attempts:[],storageMessage:''};
try{
  const saved=localStorage.getItem(STORAGE_KEY);
  if(saved){const parsed=JSON.parse(saved);if(parsed.schemaVersion!==1)throw new Error('Unsupported storage version');state.attempts=validateAttempts(parsed.attempts,questions);}
}catch{state.storageMessage='Saved progress could not be read. This session still works. Export any new attempts before closing; existing stored data will be kept until you restore a valid backup or delete it in Settings.';}
let readFailed=!!state.storageMessage;
let dataRevision=0;
const questionClock=new QuestionClock();
function updateQuestionTimer(){
  const el=document.querySelector('#question-timer'),label=document.querySelector('#timer-status');
  if(!el||!state.quiz)return;
  const elapsed=state.quiz.answered?state.quiz.durationMs:questionClock.elapsed();
  el.textContent=formatDuration(elapsed);el.dataset.durationMs=elapsed;
  label.textContent=state.quiz.answered?'Answered in':questionClock.running?'Active time':'Paused';
}
function syncQuestionClock(){
  const z=state.quiz,q=z?.list[z.index];
  if(!q)questionClock.reset();
  else{
    questionClock.select(q.id);
    questionClock.setRunning(state.view==='practice'&&!z.answered&&!document.hidden&&document.hasFocus());
  }
  updateQuestionTimer();
}
function timingExplanation(){
  return `The timer counts active time on this question and pauses when you leave it or switch tabs/windows. There is no time limit. Correct answers get full credit through ${TIMING_POLICY.fullCreditMs/60000} minutes; from there to ${TIMING_POLICY.floorMs/60000} minutes, their mastery credit decreases gently to ${Math.round((1-TIMING_POLICY.weight)*100)}%. Time can change a concept’s mastery by at most ${Math.round(TIMING_POLICY.weight*100)} percentage points. Accuracy and the 8/10 pass rule do not change. Answers without recorded times keep full credit.`;
}
const eligible=c=>state.course==='BC'||c.scope!=='BC only';
const visibleConcepts=()=>concepts.filter(c=>eligible(c)&&(state.unit==='all'||c.unit===Number(state.unit))&&(!state.query||`${c.id} ${c.title} ${c.subskills.join(' ')} ${c.objective}`.toLowerCase().includes(state.query.toLowerCase())));
const conceptStats=c=>stats(state.attempts,qs(c.id).map(q=>q.id));
let diagnostic;
const refreshDiagnostic=()=>diagnostic=diagnosticState({concepts,relationships,questions,attempts:state.attempts,course:state.course});
const graphProgress=()=>diagnostic.nodes;
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
  return `<div class="mastery-legend" aria-label="Practice mastery color scale"><span>Practice mastery</span><div class="mastery-swatches">${[null,0,.25,.5,.75,1].map(score=>`<span><i aria-hidden="true" style="background:${masteryFill(score)}"></i>${score===null?'Not tried':pct(score)}</span>`).join('')}</div><details class="mastery-help"><summary>How it’s counted</summary><p>Latest correct answers ÷ all questions in the concept. Three correct out of ten gives 30% before the small time adjustment. ${timingExplanation()} Retries update the score; unanswered questions have yet to contribute. Darker green means a higher score. This is a practice indicator, not a complete measure of understanding. Saved with your practice history in this browser.</p></details></div>`;
}
function masterySummary(c){
  const s=conceptStats(c),status=diagnostic?.nodes.get(c.id)?.status;
  return `<p class="mastery-summary"><span aria-hidden="true" class="mastery-dot" style="background:${masteryFill(s.masteryScore)}"></span><span>${s.masteryScore===null?'Practice mastery · Not tried':`${DIAGNOSTIC_LABELS[status]} · Practice mastery <strong>${pct(s.masteryScore)}</strong> · ${s.latestCorrect}/${s.available} latest answers correct · ${s.attempted}/${s.available} tried`}</span></p>`;
}
const badge=c=>`<span class="badge ${c.scope==='BC only'?'bc':c.scope==='Foundation'?'foundation':''}">${esc(c.scope)}</span>`;
const unitLabel=id=>id===0?'Foundations':`Unit ${id}`;
function announce(message){document.querySelector('#announcement').textContent=message;}
let toastTimer;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4500);}
function persist(){
  if(readFailed)return;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({schemaVersion:1,attempts:state.attempts}));state.storageMessage='';}
  catch{state.storageMessage='This browser could not save your latest progress. It remains available in this session; use Export backup before closing.';toast('Progress is in this session only. Please export a backup.');}
}
function download(name,content,type='text/csv;charset=utf-8'){
  const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function selectConcept(id,tab='map'){if(!byId.has(id))return;state.selected=id;state.unit=byId.get(id).unit;state.query='';state.graphScope='focus';state.tab=tab;state.view='atlas';state.quiz=null;render();}
function startPractice(id,{diagnosticCheck=false}={}){
  questionClock.reset();
  const all=qs(id),prior=new Set(state.attempts.map(a=>a.questionId));
  const unanswered=all.filter(q=>!prior.has(q.id));
  const list=diagnosticCheck&&unanswered.length?unanswered:all;
  state.selected=id;state.quiz={conceptId:id,diagnosticCheck,list:[...list.filter(q=>!prior.has(q.id)),...list.filter(q=>prior.has(q.id))],index:0,choice:null,answered:false,durationMs:null,results:[],sessionId:crypto.randomUUID()};state.view='practice';state.query='';render();
}
function exportProgress(){
  const allDiagnostic=diagnosticState({concepts,relationships,questions,attempts:state.attempts});
  const rows=concepts.map(c=>{const s=conceptStats(c);return {conceptId:c.id,concept:c.title,questionsAvailable:s.available,questionsAttempted:s.attempted,firstCorrect:s.firstCorrect,firstAttemptAccuracy:s.firstAccuracy,latestCorrect:s.latestCorrect,latestAccuracy:s.latestAccuracy,masteryScore:s.masteryScore,correctnessScore:s.correctnessScore,timingAdjustment:s.timingAdjustment,timedAttempts:s.timedAttempts,averageDurationMs:s.averageDurationMs,diagnosticStatus:allDiagnostic.nodes.get(c.id).status,totalAttempts:s.total,totalCorrect:s.correct,allAttemptAccuracy:s.allAccuracy};});
  download('concept-progress.csv',csv(rows,Object.keys(rows[0])));
}
function exportQuestionProgress(){
  const rows=questions.map(q=>{const s=stats(state.attempts,[q.id]);return {questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,attempts:s.total,correctAttempts:s.correct,accuracy:s.allAccuracy,firstCorrect:s.attempted?!!s.firstCorrect:'',latestCorrect:s.attempted?!!s.latestCorrect:'',timedAttempts:s.timedAttempts,latestDurationMs:s.latestDurationMs,averageDurationMs:s.averageDurationMs};});
  download('question-progress.csv',csv(rows,Object.keys(rows[0])));
}
function linkChips(ids){return ids.length?ids.map(id=>`<button class="link-chip" data-action="select" data-id="${esc(id)}"><span>${esc(id)}</span>${esc(byId.get(id).title)}<span aria-hidden="true">↗</span></button>`).join(''):'<p class="muted small">No direct prerequisites in this model.</p>';}
function unitPicker(){
  return `<label class="unit-picker"><span class="sr-only">Browse a unit</span><select id="unit-filter"><option value="all" ${state.unit==='all'?'selected':''}>All units</option>${units.filter(u=>state.course==='BC'||u.id<9).map(u=>`<option value="${u.id}" ${state.unit===u.id?'selected':''}>${u.id===0?'Foundations':`Unit ${u.id}`} · ${esc(u.title)}</option>`).join('')}</select></label>`;
}
function searchField(){return `<label class="search"><span class="sr-only">Search all concepts</span><input id="search" type="search" value="${esc(state.query)}" placeholder="Search concepts, skills, or topic numbers…" autocomplete="off"></label>`;}
function render(){
  refreshDiagnostic();
  const active=document.activeElement,focusId=active?.id,selection=active?.selectionStart;
  const c=byId.get(state.selected),overall=stats(state.attempts,questions.filter(q=>eligible(byId.get(q.conceptId))).map(q=>q.id));
  document.querySelector('#app').innerHTML=`
    <header class="site-header"><div class="topbar">
      <a href="#" class="brand" data-action="home"><span class="brand-mark" aria-hidden="true">∫</span><span>calculus clinic</span></a>
      <nav class="primary-nav" aria-label="Main">${[['atlas','Explore'],['graph','Graph'],['practice','Practice'],['progress','Progress'],['settings','Settings']].map(([view,label])=>`<button data-action="view" data-view="${view}" ${state.view===view?'aria-current="page"':''}>${label}</button>`).join('')}</nav>
      <label class="course-label"><span class="sr-only">Course</span><select id="course"><option value="BC" ${state.course==='BC'?'selected':''}>AP Calculus BC</option><option value="AB" ${state.course==='AB'?'selected':''}>AP Calculus AB</option></select></label>
    </div></header>
    <main id="main" tabindex="-1">
      ${state.storageMessage?`<div class="storage-warning" role="alert">${esc(state.storageMessage)} <button data-action="backup">Export backup</button></div>`:''}
      <div class="page-content ${state.view==='practice'?'practice-page':state.view==='graph'?'graph-page':''}">${state.view==='atlas'?renderAtlas(c):state.view==='graph'?renderKnowledgeGraph(c):state.view==='practice'?renderPractice(c):state.view==='settings'?renderSettings():renderProgress(overall)}</div>
    </main>
    <footer class="page-footer"><span>Calculus Clinic</span><button data-action="about">Sources & how this works</button></footer>`;
  if(focusId){const next=document.getElementById(focusId);if(next){next.focus();if(typeof selection==='number'&&next.setSelectionRange)next.setSelectionRange(selection,selection);}}
  if(state.view==='graph'||(state.view==='atlas'&&state.tab==='map'))mountGraph();
  syncQuestionClock();
  requestAnimationFrame(refreshMathOverflow);
}
function renderBrowse(){
  const browsing=state.unit!=='all'||!!state.query;
  const recent=[...new Set([...state.attempts].sort((a,b)=>b.answeredAt.localeCompare(a.answeredAt)).map(a=>a.conceptId))].map(id=>byId.get(id)).filter(eligible).slice(0,3);
  const list=browsing?visibleConcepts():recent.length?recent:['1.2','2.2','6.3'].map(id=>byId.get(id));
  return `<section class="explore-home"><div class="home-title"><h1>Explore calculus<span class="heading-dot" aria-hidden="true">.</span></h1><svg class="connection-doodle" viewBox="0 0 170 85" aria-hidden="true" focusable="false"><path d="M12 64 C35 64 40 22 65 31 S108 80 130 40 S148 16 160 19" fill="none" stroke="#83ab92" stroke-width="1.6" stroke-dasharray="3 4"/><circle cx="12" cy="64" r="5" fill="#fff0c9" stroke="#99b49b"/><circle cx="65" cy="31" r="7" fill="#e9e2fa" stroke="#99b49b"/><circle cx="130" cy="40" r="6" fill="#fff0c9" stroke="#99b49b"/><circle cx="160" cy="19" r="5" fill="#DDFEEA" stroke="#99b49b"/><text x="8" y="25" fill="#60856a" font-size="20" font-family="Fraunces,serif">f(x)</text><text x="131" y="77" fill="#60856a" font-size="22" font-family="Fraunces,serif">∞</text></svg></div><div class="browse-search">${searchField()}${unitPicker()}</div>
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
    <section class="concept-heading"><div><div class="concept-meta">${unitLabel(c.unit)} · ${c.id} ${badge(c)}</div><h1>${esc(c.title)}</h1><p>${math(c.objective)}</p></div><div class="concept-practice"><button class="button primary" data-action="practice" data-id="${c.id}">Try ${qs(c.id).length} questions →</button><span>${s.attempted?`${s.attempted}/${s.available} answered · ${pct(s.latestAccuracy)} latest`:'No time limit, with explanations'}</span></div></section>
    <nav class="tabs" aria-label="Concept views"><button data-action="tab" data-tab="map" ${state.tab==='map'?'aria-current="page"':''}>Connections</button><button data-action="tab" data-tab="notes" ${state.tab==='notes'?'aria-current="page"':''}>Concept notes</button></nav>
    ${state.tab==='notes'?renderDetail(c):`<section class="map-panel"><div class="map-toolbar"><div class="graph-help"><span>Prerequisite</span><span aria-hidden="true">→</span><span>Dependent concept</span></div><details class="map-options"><summary>Map options</summary><div><label>Show <select id="graph-scope"><option value="focus" ${state.graphScope==='focus'?'selected':''}>Around this concept</option><option value="unit" ${state.graphScope==='unit'?'selected':''}>This unit</option><option value="all" ${state.graphScope==='all'?'selected':''}>Whole curriculum</option></select></label><label class="connection-toggle"><input type="checkbox" id="connections" ${state.connections?'checked':''}> Other math connections</label><button class="text-link" data-action="export-map">Download this map · SVG</button></div></details></div>${masteryLegend()}<div id="graph-container" class="graph-container" aria-label="Interactive concept map"></div><div class="graph-bottom"><span class="map-hint">Select a concept to explore. Drag to move.</span><div class="zoom-controls"><button data-action="zoom-out" aria-label="Zoom out">−</button><span id="zoom-label">100%</span><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="fit">Fit</button></div></div></section>`}
    <details class="unit-concepts"><summary>More in ${c.unit===0?'foundations':`Unit ${c.unit}`}</summary><div class="concept-chips">${concepts.filter(n=>n.unit===c.unit&&eligible(n)).map(n=>`<button data-action="select" data-id="${n.id}" class="concept-chip ${n.id===c.id?'selected':''}"><span>${n.id}</span>${esc(n.title)}</button>`).join('')}</div></details>`;
}
function renderKnowledgeGraph(c){
  const list=concepts.filter(eligible);
  return `<section class="knowledge-graph"><div class="page-heading"><h1>Knowledge graph<span class="heading-dot" aria-hidden="true">.</span></h1></div>
    ${renderRecommendation(true)}<div class="graph-explorer-controls"><label>Find a concept<select id="graph-concept">${units.filter(u=>list.some(n=>n.unit===u.id)).map(u=>`<optgroup label="${esc(unitLabel(u.id)+' · '+u.title)}">${list.filter(n=>n.unit===u.id).map(n=>`<option value="${n.id}" ${n.id===c.id?'selected':''}>${n.id} · ${esc(n.title)}</option>`).join('')}</optgroup>`).join('')}</select></label><label>Map view<select id="graph-scope"><option value="focus" ${state.graphScope==='focus'?'selected':''}>Around this concept</option><option value="unit" ${state.graphScope==='unit'?'selected':''}>This unit + prerequisites</option><option value="all" ${state.graphScope==='all'?'selected':''}>Whole curriculum</option></select></label></div>
    <section class="map-panel"><div class="map-toolbar"><div class="graph-help"><span>Prerequisite</span><span aria-hidden="true">→</span><span>Dependent concept</span></div><details class="map-options"><summary>Map options</summary><div><label class="connection-toggle"><input type="checkbox" id="connections" ${state.connections?'checked':''}> Other math connections</label><button class="text-link" data-action="export-map">Download this map · SVG</button></div></details></div>${masteryLegend()}<div id="graph-container" class="graph-container" aria-label="Interactive knowledge graph"></div><div class="graph-bottom"><span class="map-hint">Select a concept to trace its connections. Drag to move.</span><div class="zoom-controls"><button data-action="zoom-out" aria-label="Zoom out">−</button><span id="zoom-label">100%</span><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="fit">Fit</button></div></div></section>
    <section class="graph-selection" aria-label="Selected concept"><div><span class="topic-number" style="--unit:${units[c.unit].color}">${c.id}</span><div><h2>${esc(c.title)}</h2><p>${math(c.objective)}</p>${masterySummary(c)}</div></div><div class="button-row"><button class="button" data-action="notes" data-id="${c.id}">Concept notes</button><button class="button primary" data-action="practice" data-id="${c.id}">Try ${qs(c.id).length} questions →</button></div></section>
  </section>`;
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
  const dependent=relationships.filter(e=>e.type==='prerequisite'&&e.source===c.id).map(e=>e.target).filter(id=>eligible(byId.get(id)));
  return `<section class="concept-notes"><div class="note-grid"><article class="rule-card"><h2>The key idea</h2><p>${math(c.rule)}</p></article><article class="first-step"><h2>A place to start</h2><p>${math(c.firstStep)}</p></article></div><details class="detail-section"><summary>Skills in this concept</summary><ul>${c.subskills.map(s=>`<li>${math(s)}</li>`).join('')}</ul></details><details class="detail-section"><summary>A common mix-up</summary><p>${math(c.misconception)}</p></details><details class="detail-section"><summary>Builds on · ${c.prerequisites.length}</summary>${linkChips(c.prerequisites)}</details><details class="detail-section"><summary>Leads to · ${dependent.length}</summary>${dependent.length?linkChips(dependent):'<p class="muted">No direct dependent in this model. Use the other math connections option to explore related ideas.</p>'}</details></section>`;
}
function renderTable(){
  const list=visibleConcepts();
  return `<section class="table-panel"><div class="section-line table-top"><div><h2>${state.unit==='all'?'All concepts':units[Number(state.unit)].title}</h2><span class="muted small">${list.length} results · select a title to inspect its connections</span></div><button class="button compact" data-action="all-units">Show all units</button></div><div class="table-scroll"><table><thead><tr><th scope="col">ID</th><th scope="col">Concept & learning objective</th><th scope="col">Course</th><th scope="col">Builds on</th><th scope="col">First attempts</th><th scope="col">Practice</th></tr></thead><tbody>${list.map(c=>{const s=conceptStats(c);return `<tr><td class="id-cell">${c.id}</td><td><button class="text-link concept-title" data-action="select" data-id="${c.id}">${esc(c.title)}</button><p>${math(c.objective)}</p></td><td>${badge(c)}</td><td><div class="prereq-ids">${c.prerequisites.map(p=>`<button title="${esc(byId.get(p).title)}" data-action="select" data-id="${p}">${p}</button>`).join('')||'—'}</div></td><td><strong>${pct(s.firstAccuracy)}</strong><small>${s.attempted}/${s.available} answered</small></td><td><button class="button compact" data-action="practice" data-id="${c.id}">Try ${qs(c.id).length}</button></td></tr>`;}).join('')}</tbody></table>${!list.length?'<div class="empty-state"><h3>No matching concepts</h3><p>Try a shorter search, or show all units.</p><button class="button" data-action="clear-search">Clear search</button></div>':''}</div></section>`;
}
function renderAbout(){
  return `<section class="about-panel"><div class="about-intro"><span class="eyebrow">THE MODEL BEHIND THE MAP</span><h2>A curriculum you can inspect.</h2><p>This is a topic-level ontology: 111 AP Calculus BC topic references and 16 foundational skill groups, each with explicit subskills and ten questions. Selecting AP Calculus AB removes BC-only topics. The complete exports always include the full BC ontology.</p></div><div class="about-grid"><article><h3>What an arrow means</h3><p>A solid arrow runs from a prerequisite to a concept that uses it. These are authored instructional judgments, not an official College Board dependency graph. They form an acyclic graph; course order alone does not create an arrow.</p><p>Dashed connections are labeled <em>generalizes, inverse_operation, applies, approximates, represents, contrasts, extends,</em> or <em>related</em>. Their direction describes the relationship in the export and does not impose a learning order.</p></article><article><h3>Accuracy & practice mastery</h3><p>First-attempt accuracy counts the first response to each attempted question. Latest accuracy counts the most recent response to those questions. All-attempt accuracy includes retries. Unanswered questions are not scored as incorrect in accuracy. Graph shading shows practice mastery: latest correct answers divided by all questions in a concept. It includes question coverage and a small time adjustment, capped at 3 percentage points. The timer allows two minutes of full credit; beyond five minutes a correct answer still earns 97% credit. Accuracy and diagnostic passing depend only on correctness.</p><p>Ten questions sample a concept’s skills. These original items are practice checks, not a validated mastery measure or a prediction of an AP score.</p></article><article><h3>Support without labels</h3><p>Potential stumbling points describe the task, not the student. Concrete first steps, visible prerequisites, practice without deadlines and specific feedback support review without inferring a learner’s emotions or ability from an error.</p><p>Every group covers several subskills. Ten questions do not exhaust every subskill or reproduce the AP exam’s free-response format.</p></article><article><h3>Your data</h3><p>Attempts stay in this browser’s local storage. They include question ID, concept ID, answer, correctness, answer date, active response time when recorded, and bank version. There is no account, remote database or cross-device sync.</p><p>Export a backup to keep your history. Import merges valid records by attempt ID without duplicating them. Use Settings → Delete saved data to remove local history and reset accuracy and graph shading.</p></article></div><h3>Schema & reuse</h3><p class="schema-line"><code>Concept</code> → <code>Relationship</code> → <code>Question</code> → <code>Attempt</code></p><p>Stable IDs join the CSVs and JSON. Topic membership is distinct from prerequisite dependencies. Foundations are additional review groups. Mathematical practices and representations are teaching tags, not item-level official AP skill assignments. Equivalent first-year calculus courses vary; the coverage claim is for the AP BC framework.</p><h3>Curriculum sources</h3><ul class="source-list">${sources.map(s=>`<li>${s.url?`<a href="${s.url}" target="_blank" rel="noreferrer">${esc(s.title)} ↗</a>`:`<strong>${esc(s.title)}</strong>`}<p>${esc(s.note)}</p></li>`).join('')}</ul><p class="muted small">Reviewed ${metadata.updated}. Topic names, summaries, questions and explanations are authored for this project. AP and College Board are registered trademarks; this project is not affiliated with or endorsed by College Board.</p></section>`;
}
function renderPractice(c){
  const qz=state.quiz;
  if(!qz){
    const list=concepts.filter(eligible);
    return `<section class="page-heading"><div><h1>Practice</h1><p>Choose a concept for a practice set with explanations and no time limit.</p></div></section>${renderRecommendation()}<section class="practice-picker"><label for="practice-concept">Concept</label><select id="practice-concept">${units.filter(u=>list.some(c=>c.unit===u.id)).map(u=>`<optgroup label="${esc(unitLabel(u.id)+' · '+u.title)}">${list.filter(n=>n.unit===u.id).map(n=>`<option value="${n.id}" ${n.id===c.id?'selected':''}>${n.id} · ${esc(n.title)} · ${qs(n.id).length} questions</option>`).join('')}</optgroup>`).join('')}</select><button class="button primary" data-action="start-picked">Begin practice →</button><p class="muted small">A check passes with at least 8/10 latest answers correct and all ten questions tried. Your first answers and retries are recorded separately. You can leave and continue with unanswered questions later.</p></section>`;
  }
  const concept=byId.get(qz.conceptId),s=conceptStats(concept);
  if(qz.index>=qz.list.length){
    const correct=qz.results.filter(r=>r.correct).length;
    return `<section class="practice-complete"><span class="eyebrow">SET COMPLETE</span><h1>${qz.diagnosticCheck?'Check complete.':'Practice set complete.'}</h1><h2>${esc(concept.title)}</h2><div class="result-number">${correct}<span> / ${qz.list.length}</span></div><p>correct in this set</p><div class="result-summary"><span><strong>${pct(s.firstAccuracy)}</strong> first-attempt accuracy</span><span><strong>${pct(s.latestAccuracy)}</strong> latest-answer accuracy</span></div><p class="muted">These practice checks sample this concept; accuracy is not a full measure of understanding.</p><p class="diagnostic-outcome" data-status="${diagnostic.nodes.get(concept.id).status}">${DIAGNOSTIC_LABELS[diagnostic.nodes.get(concept.id).status]} · ${s.latestCorrect}/${s.available} latest answers correct</p>${renderRecommendation()}<div class="review-list">${qz.results.map((r,i)=>{const q=qz.list[i];return `<details><summary><span class="result-mark ${r.correct?'correct':'review'}">${r.correct?'✓':'↺'}</span><span class="review-prompt">${math(q.prompt)}</span></summary><p><strong>Answer:</strong> ${math(q.options.find(o=>o.id===q.correctOptionId).text)}</p><p>${math(q.explanation)}</p><p class="answer-time">Active time: ${formatDuration(r.durationMs)}</p></details>`;}).join('')}</div><div class="button-row"><button class="button primary" data-action="select" data-id="${concept.id}">Back to its connections →</button><button class="button" data-action="practice" data-id="${concept.id}">Practice again</button><button class="button" data-action="view" data-view="progress">View progress</button></div></section>`;
  }
  const q=qz.list[qz.index],prior=state.attempts.filter(a=>a.questionId===q.id),already=prior.length>(qz.answered?1:0),correct=qz.choice===q.correctOptionId;
  return `<div class="practice-top"><button class="text-link" data-action="select" data-id="${concept.id}">← Back to ${esc(concept.title)}</button>${badge(concept)}</div><section class="question-card"><div class="question-meta"><span>${concept.id} · QUESTION ${qz.index+1} OF ${qz.list.length}${qz.diagnosticCheck?' · DIAGNOSTIC':''}</span><span>${already?'Review attempt':'First attempt'}</span></div><div class="question-timing"><div class="elapsed-time"><span id="timer-status">Active time</span><span id="question-timer" role="timer" aria-live="off" aria-label="Time on this question">0:00</span></div><details class="timing-help"><summary>About timing</summary><p>${timingExplanation()}</p></details></div><div class="question-steps" aria-label="Question ${qz.index+1} of ${qz.list.length}">${qz.list.map((_,i)=>`<span class="${i<qz.index?'done':i===qz.index?'current':''}"></span>`).join('')}</div><h1 class="question-title" id="question-title" tabindex="-1">${math(q.prompt)}</h1><fieldset class="answer-options" ${qz.answered?'disabled':''}><legend class="sr-only">Choose one answer</legend>${q.options.map((o,i)=>`<label class="answer-option ${qz.choice===o.id?'chosen':''} ${qz.answered&&o.id===q.correctOptionId?'correct-answer':''} ${qz.answered&&qz.choice===o.id&&!correct?'incorrect-answer':''}"><input type="radio" name="answer" value="${o.id}" ${qz.choice===o.id?'checked':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span class="answer-text">${math(o.text)}</span>${qz.answered&&o.id===q.correctOptionId?'<span class="answer-status">Correct answer</span>':''}</label>`).join('')}</fieldset>${qz.answered?`<div class="answer-feedback ${correct?'right':'revisit'}" role="status"><strong>${correct?'That’s correct.':'Here’s the step to revisit.'}</strong><p>${math(q.explanation)}</p>${!correct?`<p class="feedback-tip">${math(concept.firstStep)}</p>`:''}</div><button class="button primary" data-action="next">${qz.index===qz.list.length-1?'See this set':'Next question'} →</button>`:`<button class="button primary" id="check-answer" data-action="submit" ${!qz.choice?'disabled':''}>Check answer →</button><p class="small muted">Select an answer to check it. There’s no time limit.</p>`}</section><details class="practice-context"><summary>Review the prerequisites</summary><div class="context-links">${linkChips(concept.prerequisites)}</div></details>`;
}
function renderProgress(overall){
  const rows=concepts.filter(eligible).filter(c=>['passed','review','partial'].includes(state.progressFilter)?diagnostic.nodes.get(c.id).status===state.progressFilter:state.progressFilter==='all'||(state.progressFilter==='started'?conceptStats(c).attempted>0:conceptStats(c).attempted===0));
  return `<section class="page-heading"><h1>Your progress</h1><button class="text-link" data-action="view" data-view="settings">Backups & exports</button></section>${renderDiagnosticSummary()}<section class="progress-summary" aria-label="Practice summary"><div><span>First answers</span><strong>${pct(overall.firstAccuracy)}</strong><small>${overall.firstCorrect} of ${overall.attempted} correct</small></div><div><span>Latest answers</span><strong>${pct(overall.latestAccuracy)}</strong><small>${overall.latestCorrect} of ${overall.attempted} correct</small></div><div><span>Total attempts</span><strong>${overall.total}</strong><small>${overall.correct} correct, including retries</small></div></section><details class="accuracy-note"><summary>How accuracy is counted</summary><p>Unanswered questions are unscored. First-attempt accuracy keeps your first answer to each question; latest accuracy uses the most recent. All-attempt accuracy includes retries. Graph practice mastery uses latest correct answers divided by all available questions, with a timing adjustment of at most 3 percentage points. Accuracy and passing depend only on answers.</p></details><section class="table-panel"><div class="section-line table-top"><h2>By concept</h2><label>Show <select id="progress-filter"><option value="all" ${state.progressFilter==='all'?'selected':''}>All concepts</option><option value="started" ${state.progressFilter==='started'?'selected':''}>Practiced</option><option value="new" ${state.progressFilter==='new'?'selected':''}>Not yet tried</option>${['passed','review','partial'].map(status=>`<option value="${status}" ${state.progressFilter===status?'selected':''}>${DIAGNOSTIC_LABELS[status]}</option>`).join('')}</select></label></div><div class="table-scroll"><table class="progress-table"><thead><tr><th>Concept</th><th>Coverage</th><th>First accuracy</th><th>Latest accuracy</th><th>Attempts</th><th>Question history</th></tr></thead><tbody>${rows.map(c=>{const s=conceptStats(c);return `<tr><td><span class="id-cell">${c.id}</span> <button class="text-link" data-action="select" data-id="${c.id}">${esc(c.title)}</button><small class="diagnostic-status">${DIAGNOSTIC_LABELS[diagnostic.nodes.get(c.id).status]}</small></td><td>${s.attempted}/${s.available}</td><td>${pct(s.firstAccuracy)}<small>${s.firstCorrect}/${s.attempted} correct</small></td><td>${pct(s.latestAccuracy)}<small>${s.latestCorrect}/${s.attempted} correct</small></td><td>${s.total}</td><td><details class="question-history"><summary>${s.available} questions</summary>${qs(c.id).map((q,i)=>{const st=stats(state.attempts,[q.id]);return `<div><strong>Q${i+1}</strong> ${math(q.prompt)}<small>${st.attempted?`${st.correct}/${st.total} attempts correct · ${pct(st.allAccuracy)} · First: ${st.firstCorrect?'correct':'incorrect'} · Latest: ${st.latestCorrect?'correct':'incorrect'}`:'Not yet answered'}</small>${st.attempted?`<small class="question-time-history">Latest time: ${formatDuration(st.latestDurationMs)}${st.timedAttempts?` · Average: ${formatDuration(st.averageDurationMs)} (${st.timedAttempts} timed ${st.timedAttempts===1?'attempt':'attempts'})`:''}</small>`:''}</div>`;}).join('')}<button class="button compact" data-action="practice" data-id="${c.id}">Practice this concept</button></details></td></tr>`;}).join('')}</tbody></table>${!rows.length?'<div class="empty-state"><h3>No practice here yet</h3><p>Try a concept’s questions to start a record.</p><button class="button" data-action="view" data-view="practice">Choose a concept</button></div>':''}</div></section>`;
}
function renderSettings(){
  return `<section class="settings-page"><div class="page-heading"><h1>Settings</h1></div>
    <section class="settings-section"><h2>Saved practice</h2><p><strong>${state.attempts.length} ${state.attempts.length===1?'attempt':'attempts'}</strong> stored in this session. Progress is saved in this browser; it does not sync across devices.</p><div class="button-row"><button class="button" data-action="backup">Export backup</button><label class="button file-button">Import backup<input id="import-file" type="file" accept="application/json,.json"></label></div><p class="muted small">Import adds valid attempts without duplicating existing records.</p></section>
    <details class="settings-section"><summary>Accuracy exports</summary><div class="download-list"><button data-action="export-progress">Concept accuracy & mastery <span>CSV ↓</span></button><button data-action="export-question-progress">Question accuracy <span>CSV ↓</span></button><button data-action="export-attempts">Every attempt <span>CSV ↓</span></button></div></details>
    <details class="settings-section"><summary>Curriculum downloads</summary><div class="download-list">${[['concepts.csv','Concepts','CSV'],['relationships.csv','Relationships','CSV'],['questions.csv','Questions & answers','CSV'],['ontology.json','Complete ontology','JSON'],['concept-map.svg','Complete concept graph','SVG'],['coverage.csv','AP topic coverage','CSV']].map(([file,label,type])=>`<a download href="/data/${file}">${label}<span>${type} ↓</span></a>`).join('')}</div></details>
    <section class="settings-section delete-section"><h2>Delete saved data</h2><p>Remove all practice history, accuracy and mastery records, and the current practice set from this browser. Downloaded backups and data on other devices are kept.</p><button class="button danger" id="delete-data" data-action="delete-data">Delete my practice data</button></section>
    <dialog id="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Delete your practice data?</h2><p id="delete-description">All ${state.attempts.length} practice attempts and their accuracy records will be removed from this browser. Your current practice set will also end. This cannot be undone without an exported backup.</p><p id="delete-error" class="delete-error" role="alert" hidden></p><div class="button-row"><button class="button" data-action="cancel-delete" autofocus>Keep my data</button><button class="button danger" data-action="confirm-delete">Delete data</button></div></dialog>
  </section>`;
}
function deleteProgress(){
  try{localStorage.removeItem(STORAGE_KEY);}
  catch{const error=document.querySelector('#delete-error');error.hidden=false;error.textContent='This browser could not delete saved data. Your practice history is still available. Try again or manage this site’s storage in your browser settings.';return;}
  dataRevision++;state.attempts=[];state.quiz=null;state.storageMessage='';readFailed=false;
  document.querySelector('#delete-dialog').close();render();document.querySelector('#delete-data').focus();toast('Your practice data has been deleted from this browser.');
}

let graphState=null;
function mountGraph(){
  const selected=state.selected,allowed=concepts.filter(eligible);let nodes;
  const edges=relationships.filter(e=>state.connections||e.type==='prerequisite');
  if(state.graphScope==='focus'){
    const ids=new Set([selected,...edges.filter(e=>e.source===selected||e.target===selected).flatMap(e=>[e.source,e.target])]);nodes=allowed.filter(c=>ids.has(c.id));
  }else if(state.graphScope==='unit'){
    const list=allowed.filter(c=>c.unit===byId.get(selected).unit),ids=new Set(list.map(c=>c.id));
    for(const c of list)for(const id of c.prerequisites)ids.add(id);nodes=allowed.filter(c=>ids.has(c.id));
  }else nodes=allowed;
  const compact=window.innerWidth<=520&&state.graphScope==='focus';
  const layout=graphLayout(nodes,edges,{focus:state.graphScope==='focus'?selected:null,compact});
  const container=document.querySelector('#graph-container');container.innerHTML=drawGraph(layout,units,{selected,progress:graphProgress(),recommended:diagnostic.recommendation.targetId});
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
  if(action==='select')return selectConcept(id);
  if(action==='notes')return selectConcept(id,'notes');
  if(action==='practice')return startPractice(id);
  if(action==='diagnostic'){startPractice(id,{diagnosticCheck:true});document.querySelector('.question-title')?.focus();return;}
  if(action==='recommendation-map'){state.view='graph';state.selected=id;state.graphScope='focus';state.query='';render();document.querySelector('#graph-container').scrollIntoView({block:'center',behavior:'smooth'});return;}
  if(action==='submit'){
    const z=state.quiz;if(!z||z.answered||!z.choice)return;const q=z.list[z.index];
    z.durationMs=questionClock.finish();
    const attempt={id:crypto.randomUUID(),questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:z.choice,correct:z.choice===q.correctOptionId,answeredAt:new Date().toISOString(),sessionId:z.sessionId,durationMs:z.durationMs};
    z.answered=true;z.results.push(attempt);state.attempts.push(attempt);persist();render();announce(attempt.correct?'Correct. '+q.explanation:'Review this step. '+q.explanation);return;
  }
  if(action==='next'){const z=state.quiz;if(!z?.answered)return;z.index++;z.choice=null;z.answered=false;z.durationMs=null;render();document.querySelector('.question-title, .practice-complete h1')?.scrollIntoView({block:'center',behavior:'smooth'});announce(z.index>=z.list.length?'Practice set complete':`Question ${z.index+1} of ${z.list.length}`);return;}
  if(action==='start-picked')return startPractice(document.querySelector('#practice-concept').value);
  if(action==='delete-data'){document.querySelector('#delete-dialog').showModal();return;}
  if(action==='cancel-delete'){document.querySelector('#delete-dialog').close();return;}
  if(action==='confirm-delete'){deleteProgress();return;}
  if(action==='view'){state.view=el.dataset.view;state.query='';if(state.view==='atlas'){state.tab='browse';state.unit='all';}if(state.view==='graph')state.graphScope='focus';}
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
  else if(action==='export-map'){if(graphState)download('concept-map-view.svg',drawGraph(graphState.layout,units,{selected:state.selected,standalone:true,progress:graphProgress(),recommended:diagnostic.recommendation.targetId}),'image/svg+xml');return;}
  else if(action==='export-progress'){exportProgress();return;}
  else if(action==='export-question-progress'){exportQuestionProgress();return;}
  else if(action==='export-attempts'){download('practice-attempts.csv',csv(state.attempts,['id','questionId','conceptId','bankVersion','choiceId','correct','answeredAt','sessionId','durationMs']));return;}
  else if(action==='backup'){download('calculus-clinic-progress.json',JSON.stringify({schemaVersion:1,bankVersion:metadata.bankVersion,exportedAt:new Date().toISOString(),attempts:state.attempts},null,2),'application/json');return;}
  render();
});
document.addEventListener('input',e=>{
  if(e.target.id==='search'){state.query=e.target.value;state.unit='all';render();}
});
document.addEventListener('change',async e=>{
  const el=e.target;
  if(el.name==='answer'){if(!state.quiz||state.quiz.answered)return;state.quiz.choice=el.value;document.querySelectorAll('.answer-option').forEach(n=>n.classList.toggle('chosen',n.querySelector('input').checked));document.querySelector('#check-answer').disabled=false;return;}
  if(el.id==='course'){state.course=el.value;state.quiz=null;if(!eligible(byId.get(state.selected))){state.selected='1.11';state.unit=1;}if(state.unit!=='all'&&state.unit>8&&state.course==='AB')state.unit=1;render();}
  if(el.id==='unit-filter'){state.unit=el.value==='all'?'all':Number(el.value);state.query='';render();}
  if(el.id==='graph-concept'){state.selected=el.value;state.graphScope='focus';render();}
  if(el.id==='graph-scope'){state.graphScope=el.value;mountGraph();}
  if(el.id==='connections'){state.connections=el.checked;mountGraph();}
  if(el.id==='progress-filter'){state.progressFilter=el.value;render();}
  if(el.id==='import-file'){
    const file=el.files[0],revision=dataRevision;if(!file)return;
    try{if(file.size>20_000_000)throw new Error('Choose a backup smaller than 20 MB.');const data=JSON.parse(await file.text());if(revision!==dataRevision)return;const incoming=validateBackup(data,questions,metadata.compatibleBankVersions),before=state.attempts.length;state.attempts=mergeAttempts(state.attempts,incoming);readFailed=false;persist();render();toast(`Imported ${state.attempts.length-before} new attempts. Existing attempts kept.`);}catch(error){toast(`Backup not imported. ${error.message}`);el.value='';}
  }
});
function renderStoredProgress(){
  const viewport=document.querySelector('#map-svg')&&graphState?{x:graphState.x,y:graphState.y,scale:graphState.scale}:null;
  render();
  if(viewport&&document.querySelector('#map-svg')){Object.assign(graphState,viewport);transformGraph();}
}
document.addEventListener('visibilitychange',syncQuestionClock);
window.addEventListener('blur',()=>{questionClock.setRunning(false);updateQuestionTimer();});
window.addEventListener('focus',syncQuestionClock);
window.addEventListener('pagehide',()=>questionClock.setRunning(false));
window.addEventListener('pageshow',syncQuestionClock);
setInterval(updateQuestionTimer,250);
window.addEventListener('storage',e=>{
  if(e.key!==STORAGE_KEY&&e.key!==null)return;
  try{
    // Read the current value so an older queued event cannot restore deleted data.
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved===null){dataRevision++;state.attempts=[];state.quiz=null;state.storageMessage='';readFailed=false;renderStoredProgress();toast('Practice data was cleared in another tab.');return;}
    const value=JSON.parse(saved);if(value.schemaVersion!==1)return;
    state.attempts=validateAttempts(value.attempts,questions);readFailed=false;state.storageMessage='';if(state.view!=='practice'||!state.quiz)renderStoredProgress();
  }catch{/* Retain the valid session if another tab writes invalid data. */}
});
render();
