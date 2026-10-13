import {escapeHTML as esc} from './graph.mjs';
import {EASE_LABELS,PROGRESS_LABELS,FEELINGS,NOTE_LIMIT} from './progress-checks.mjs';

const rating=(c,name,title,labels)=>`<fieldset class="reflection-field"><legend>${title}</legend><div class="reflection-scale">${labels.map((label,i)=>`<label><input type="radio" name="${name}" value="${i+1}" ${c[name]===i+1?'checked':''} required><span><strong>${i+1}</strong><span>${label}</span></span></label>`).join('')}</div></fieldset>`;
export function renderProgressCheck(check,concept){
 return `<section class="progress-check" aria-labelledby="progress-check-title"><header><span class="eyebrow">SET COMPLETE</span><h1 id="progress-check-title" tabindex="-1">Progress check</h1><p>${esc(concept.title)}</p></header><form id="progress-check-form" data-check-id="${esc(check.id)}">
 ${rating(check,'ease','How easy did this concept feel?',EASE_LABELS)}
 ${rating(check,'progress','How well do you feel you’re progressing?',PROGRESS_LABELS)}
 <fieldset class="reflection-field"><legend>How did you feel while solving the problems?</legend><p id="feelings-hint" class="small muted">Choose any that fit.</p><div class="reflection-feelings" aria-describedby="feelings-hint">${Object.entries(FEELINGS).map(([value,label])=>`<label><input type="checkbox" name="feelings" value="${value}" ${check.feelings.includes(value)?'checked':''}><span>${label}</span></label>`).join('')}</div></fieldset>
 <details class="reflection-note" ${check.note?'open':''}><summary>Add a note <span class="muted">(optional)</span></summary><label for="progress-check-note">What helped, or what still feels unclear?</label><textarea id="progress-check-note" name="note" maxlength="${NOTE_LIMIT}" rows="3">${esc(check.note)}</textarea></details>
 <p id="progress-check-error" class="reflection-error" role="alert" hidden></p><div class="button-row"><button class="button primary" type="submit">Save progress check →</button><button class="text-link" type="button" data-action="skip-progress-check">Skip for now</button></div></form></section>`;
}
export function renderCheckResponse(c){
 return `<dl class="reflection-response"><div><dt>Ease</dt><dd>${c.ease?`${c.ease}/5 · ${EASE_LABELS[c.ease-1]}`:'—'}</dd></div><div><dt>Progress</dt><dd>${c.progress?`${c.progress}/5 · ${PROGRESS_LABELS[c.progress-1]}`:'—'}</dd></div><div><dt>Feelings</dt><dd>${c.feelings.length?c.feelings.map(f=>FEELINGS[f]).join(', '):'—'}</dd></div></dl>${c.note?`<p class="reflection-saved-note">${esc(c.note)}</p>`:''}`;
}
export function renderProgressCheckHistory(checks,concepts,course){
 const list=checks.filter(c=>c.course===course).sort((a,b)=>b.completedAt.localeCompare(a.completedAt));
 if(!list.length)return '';
 const byId=new Map(concepts.map(c=>[c.id,c]));
 return `<details class="progress-check-history"><summary>Progress checks <span>${list.filter(c=>c.status==='completed').length} saved${list.some(c=>c.status==='pending')?' · unfinished checks':''}</span></summary><div class="reflection-history-list">${list.map(c=>`<details data-progress-check="${esc(c.id)}"><summary><span>${esc(byId.get(c.conceptId).title)}</span><time datetime="${c.completedAt}">${new Date(c.completedAt).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</time><span class="reflection-status">${c.status==='completed'?'Saved':c.status==='pending'?'Unfinished':'Skipped'}</span></summary>${renderCheckResponse(c)}${c.status!=='completed'?`<button class="button compact" data-action="resume-progress-check" data-id="${esc(c.id)}">Finish progress check</button>`:''}</details>`).join('')}</div><button class="text-link" data-action="export-progress-checks">Download progress checks · CSV</button></details>`;
}
