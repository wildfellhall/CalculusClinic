import {reportResources} from './report-pdf.mjs';
import {reportScore} from './report-data.mjs';
import {courseTitle} from './course.mjs';
import {formatDuration,validDuration} from './timing.mjs';
import {DIAGNOSTIC_LABELS} from './diagnostic.mjs';
import {EXPRESSION_LABELS,expressionLabel} from './expressions.mjs';
import {METRICS} from './observations.mjs';
import {EASE_LABELS,PROGRESS_LABELS,FEELINGS} from './progress-checks.mjs';

const C={ink:'#294637',muted:'#617468',paper:'#FFFEFA',mint:'#DDFEEA',line:'#BCD8C5',lilac:'#EEE7F8',rose:'#FCE6DA'};
const number=value=>Number.isFinite(value)?Number(value.toFixed(2)).toString():'Not recorded';
const score=value=>Number.isFinite(value)?`${reportScore(value)} / 100`:'Not recorded';
const stamp=value=>new Date(value).toISOString().replace('T',' ').replace('Z',' UTC');
const duration=ms=>formatDuration(ms)+(validDuration(ms)&&ms%1000?'.'+String(ms%1000).padStart(3,'0').replace(/0+$/,''):'');
const plain=value=>String(value??'').replace(/[\u2010-\u2015\u2212]/g,'-').replaceAll('→','to').replace(/[\u0000-\u0008\u000b-\u001f]/g,'');

export async function renderConceptReportPDF(report,{PDFLib,fontkit,fonts,images=new Map(),scratchPNG=null}){
  const {PDFDocument,rgb}=PDFLib,doc=await PDFDocument.create();doc.registerFontkit(fontkit);
  const [body,bold,display]=await Promise.all(fonts.map(bytes=>doc.embedFont(bytes,{subset:true})));
  const W=595.28,H=841.89,M=38,CW=W-2*M,bottom=H-44;
  const color=hex=>rgb(...hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255));
  let page,y,section='Concept report';
  doc.setTitle(`${report.concept.id} - ${report.concept.title} - Concept report`);doc.setAuthor('Calculus Clinic');doc.setCreationDate(new Date(report.generatedAt));
  const text=(value,x,top,size=10,font=body,ink=C.ink)=>page.drawText(plain(value),{x,y:H-top-size,size,font,color:color(ink)});
  const line=(top)=>page.drawLine({start:{x:M,y:H-top},end:{x:W-M,y:H-top},color:color(C.line),thickness:.6});
  const box=(x,top,w,h,fill)=>page.drawSvgPath(`M8,0 H${w-8} Q${w},0 ${w},8 V${h-8} Q${w},${h} ${w-8},${h} H8 Q0,${h} 0,${h-8} V8 Q0,0 8,0 Z`,{x,y:H-top,color:color(fill),borderColor:color(C.line),borderWidth:.6});
  function wrap(value,width=CW,size=10,font=body){
    const result=[];for(const p of plain(value).split('\n')){let current='';for(const word of p.split(/\s+/)){
      if(font.widthOfTextAtSize((current?current+' ':'')+word,size)<=width){current+=(current?' ':'')+word;continue;}
      if(current)result.push(current);current='';for(const ch of word){if(current&&font.widthOfTextAtSize(current+ch,size)>width){result.push(current);current='';}current+=ch;}
    }result.push(current);}return result;
  }
  function addPage(title=section,continued=false){
    section=title;page=doc.addPage([W,H]);page.drawRectangle({x:0,y:0,width:W,height:H,color:color(C.paper)});
    text('CALCULUS CLINIC',M,20,8,bold,C.muted);text(report.concept.id+'  |  '+report.generatedAt.slice(0,10),W-M-135,20,8,body,C.muted);
    y=42;for(const l of wrap(title+(continued?' - continued':''),CW,21,display)){text(l,M,y,21,display);y+=27;}line(y+7);y+=22;
  }
  function ensure(height){if(y+height>bottom)addPage(section,true);}
  function paragraph(value,{size=10,font=body,ink=C.ink,gap=9}={}){
    for(const l of wrap(value,CW,size,font)){ensure(size*1.45);text(l,M,y,size,font,ink);y+=size*1.45;}y+=gap;
  }
  function heading(value,reserve=60){ensure(30+reserve);paragraph(value,{size:14,font:display,gap:7});}
  function table(headers,widths,rows,size=9,{keepRows=false}={}){
    const padding=keepRows?10:12;
    const header=()=>{ensure(42);box(M,y,CW,25,C.mint);let x=M;headers.forEach((h,i)=>{text(h,x+6,y+7,8,bold);x+=widths[i];});y+=25;};header();
    for(const cells of rows){
      const all=cells.map((c,i)=>wrap(c,widths[i]-12,size));let offset=0,total=Math.max(...all.map(ls=>ls.length));
      const height=total*size*1.4+padding;
      if(keepRows&&y+height>bottom&&height<bottom-120){addPage(section,true);header();}
      while(offset<total){
        if(y+size*1.4+padding>bottom){addPage(section,true);header();}
        const count=Math.min(total-offset,Math.floor((bottom-y-padding)/(size*1.4)));let x=M;
        all.forEach((ls,i)=>{ls.slice(offset,offset+count).forEach((l,j)=>text(l,x+6,y+padding/2+j*size*1.4,size));x+=widths[i];});
        y+=count*size*1.4+padding;line(y);offset+=count;
      }
    }y+=12;
  }
  async function picture(value,maxHeight=600){
    if(!value)return;const img=await doc.embedPng(value.png||value),scale=Math.min(CW/img.width,maxHeight/img.height),height=img.height*scale,width=img.width*scale;
    ensure(height+8);page.drawImage(img,{x:M,y:H-y-height,width,height});y+=height+8;
  }
  function movementTable(metrics){
    const rows=[];for(let i=0;i<METRICS.length;i+=2){const pair=METRICS.slice(i,i+2).flatMap(m=>[m.label,metrics?.[m.id]?`${number(metrics[m.id].meanDelta*100)} / ${number(metrics[m.id].changeScore)}`:'Not recorded']);rows.push(pair.length===2?[...pair,'','']:pair);}
    table(['Movement metric','Delta / change','Movement metric','Delta / change'],[170,CW/2-170,170,CW/2-170],rows,8);
  }
  const r=report.row,t=report.timing,o=report.observations,x=r.expression;
  addPage();paragraph(`${report.concept.id}  ${report.concept.title}`,{size:24,font:display});paragraph(courseTitle(report.course),{ink:C.muted});paragraph(report.concept.objective);
  const top=y,w=(CW-20)/3;
  for(const [i,label,value] of [[0,'Accuracy',r.accuracy],[1,'Camera estimates',r.emotions],[2,'Combined',r.combined]]){box(M+i*(w+10),top,w,73,i===1?C.lilac:C.mint);text(label,M+i*(w+10)+12,top+11,10,bold);text(score(value),M+i*(w+10)+12,top+34,17,display);}y+=89;
  paragraph(`${DIAGNOSTIC_LABELS[r.status]}  |  ${r.attempted}/${r.available} current questions tried  |  ${r.latestCorrect}/${r.available} latest correct`,{font:bold});
  table(['Answer history','Result'],[CW*.55,CW*.45],[['First-answer accuracy (tried questions)',score(r.firstAccuracy)],['Latest-answer accuracy (tried questions)',score(r.latestAccuracy)],['Timing-adjusted practice mastery',score(r.masteryScore)],['Saved attempts, including retries and earlier versions',String(report.history.length)],['Attempts on earlier question versions',String(report.archivedAttemptCount)]]);
  heading('Time spent on this concept');
  paragraph(`${t.count} timed attempts; ${t.missing} without recorded time. All timing below includes saved retries and earlier question versions.`,{size:9,ink:C.muted});
  table(['Total active time','Average','Median'],[CW/3,CW/3,CW/3],[[duration(t.total),duration(t.average),duration(t.median)]]);
  paragraph(`Correct-answer average: ${duration(t.correctAverage)}. Incorrect-answer average: ${duration(t.incorrectAverage)}. Fastest: ${duration(t.fastest)}. Slowest: ${duration(t.slowest)}.`,{size:9});
  paragraph(`Accuracy and passing use current questions only. Graph accuracy includes unanswered questions in its denominator. Timing can reduce practice mastery by at most 3 percentage points; it does not alter answer correctness. Combined scores use your saved preference: check-ins ${report.preferences.includeSelfReports?'included':'excluded'}.`,{size:9,ink:C.muted});

  if(report.prerequisites.length){
    addPage('Prerequisite overview');
    paragraph(`${report.prerequisites.length} prerequisite skills in ${courseTitle(report.course)}, including earlier foundations. Closest skills come first; shared prerequisites appear once. Scores match each skill's graph display and do not change this concept's score.`,{size:9,ink:C.muted});
    paragraph('Accuracy uses latest correct answers out of all current questions. Camera scores and expression labels are experimental estimates; percentages beside labels are mean model probabilities. Movement change is measured against the resting baseline. Camera and self-reported sentiment range from -100 to +100 and are shown separately.',{size:9,ink:C.muted});
    table(['Prerequisite skill','Accuracy','Emotion overview'],[185,115,CW-300],report.prerequisites.map(p=>{
      const e=p.expression,o=p.observations;
      const emotion=e?`Camera score: ${score(p.emotions)}\n${e.label} (${number(e.confidence*100)}%)\nCamera sentiment: ${number(e.sentimentScore)}\n${e.records} ${e.records===1?'attempt':'attempts'}; ${e.samples} samples`:'Camera: not recorded';
      const movement=p.change===null?'Movement: not recorded':`Movement change: ${number(p.change)} / 100`;
      const checkIn=o.checkIns?`Self-report sentiment: ${number(o.sentimentScore)} (${o.checkIns} ${o.checkIns===1?'check-in':'check-ins'})`:'Self-report: not recorded';
      return [`${p.concept.id}  ${p.concept.title}\n${p.depth===1?'Direct prerequisite':p.depth+' steps before this skill'}`,`${score(p.accuracy)}\n${p.latestCorrect}/${p.available} correct; ${p.attempted} tried\n${DIAGNOSTIC_LABELS[p.status]}`,`${emotion}\n${movement}\n${checkIn}`];
    }),8.5,{keepRows:true});
  }

  addPage('Emotions & facial movement');
  paragraph('Camera labels are experimental expression estimates, not direct measurements of felt emotion or understanding. They are recorded separately from self-reports. Missing evidence stays unrecorded.',{size:9,ink:C.muted});
  heading('Camera expression profile');
  if(x){
    paragraph(`${x.label} (${number(x.confidence*100)}% mean model probability). ${x.records} attempts, ${x.samples} usable samples. Camera sentiment: ${number(x.sentimentScore)} on -100 to +100. Fear/sadness/anger score: ${number(x.negativeScore)}/100. Coinciding excess movement: ${number(x.excessMovementScore)}/100.`,{size:10});
    const probabilities=Object.entries(EXPRESSION_LABELS),rows=[];for(let i=0;i<probabilities.length;i+=2){const cells=probabilities.slice(i,i+2).flatMap(([k,label])=>[label,number(x.probabilities[k]*100)+'%']);rows.push(cells.length===2?[...cells,'','']:cells);}
    table(['Camera expression','Probability','Camera expression','Probability'],[170,CW/2-170,170,CW/2-170],rows);
  }else paragraph('No usable camera expression estimates were recorded.');
  paragraph(`Combined credit reduction: camera ${number(r.scoring.cameraAdjustment*100)}%; enabled check-ins ${number(r.scoring.selfReportAdjustment*100)}%. The camera estimate uses fear, sadness and anger probabilities and coinciding excess movement. Self-reports do not enter the camera-only score.`,{size:9});
  heading('Movement compared with the resting baseline');
  if(o.movementAttempts){paragraph(`${o.movementAttempts} attempts; ${o.samples} samples; ${duration(o.observedMs)} observed. Mean change: ${number(o.changeScore)}/100. Signed delta is the facial coefficient's change from baseline in percentage points; change is its noise-adjusted magnitude on 0-100. Averages are weighted by sample count.`,{size:9});movementTable(o.metrics);}
  else paragraph('No usable facial-movement measurements were recorded.');
  heading('Self-reported feelings');paragraph(o.checkIns?`${o.checkIns} saved check-ins. Mean reported sentiment: ${number(o.sentimentScore)} on -100 to +100. Individual emotion, intensity and valence are listed with each attempt.`:'No question-level emotion check-ins were saved.');

  addPage('Practice sets & progress checks');
  if(report.sessions.length)table(['Practice group','Saved answers','Correct','Active time'],[CW-255,95,65,95],report.sessions.map(s=>[`${s.label}\n${stamp(s.dateRange[0])}`,String(s.attempts.length),`${s.correct}/${s.attempts.length}`,duration(s.timing.total)]));
  else paragraph('No question attempts have been saved for this concept yet.');
  paragraph('Groups use the session identifier recorded with each answer. A group can be partial or contain retries. Imported answers without an original session are grouped separately. All timestamps in this report use UTC.',{size:9,ink:C.muted});
  heading('After-set progress checks');
  if(!report.progressChecks.length)paragraph('No progress-check surveys have been saved for this concept.');
  for(const check of report.progressChecks){
    ensure(100);paragraph(`${stamp(check.completedAt)}  |  ${check.status}  |  ${courseTitle(check.course)}`,{font:bold});
    if(check.status==='completed'){
      paragraph(`Ease: ${check.ease}/5 (${EASE_LABELS[check.ease-1]}). Progress: ${check.progress}/5 (${PROGRESS_LABELS[check.progress-1]}). Feelings: ${check.feelings.map(f=>FEELINGS[f]).join(', ')}.`);
      if(check.note)paragraph('Reflection: '+check.note);
    }else paragraph('This survey was '+check.status+'; no completed response is reported.',{size:9});
    const linked=report.history.filter(a=>check.attemptIds.includes(a.id));paragraph('Linked answers: '+linked.map(a=>`${a.questionId} (${a.correct?'correct':'incorrect'})`).join('; '),{size:8,ink:C.muted});
  }

  for(const item of report.items){
    const q=item.question,art=images.get(q.id+'|'+q.version);
    addPage('Questions & attempts - '+item.label);
    paragraph(`${q.id}  |  Bank ${q.version}${item.archived?'  |  Earlier version - excluded from current accuracy':''}`,{size:9,ink:C.muted});
    if(art)await picture(art.prompt);else paragraph(q.prompt,{size:12,font:bold});
    if(art)await picture(art.options);else for(const [i,option] of q.options.entries())paragraph(`${String.fromCharCode(65+i)}. ${option.text}${option.id===q.correctOptionId?' (correct)':''}`);
    heading('Solution',art?Math.min(600,art.explanation.height*CW/art.explanation.width)+8:60);if(art)await picture(art.explanation);else paragraph(q.explanation);
    if(!item.attempts.length){paragraph('Not attempted. No answer, timing, or emotion record exists for this question.',{ink:C.muted});continue;}
    heading('Every saved attempt');
    table(['Try / group','Answered (UTC)','Choice','Result','Time'],[85,150,48,82,CW-365],item.attempts.map(a=>[`${a.number} / ${a.setLabel}`,stamp(a.answeredAt).replace(' UTC',''),a.choiceLabel,a.correct?'Correct':'Incorrect',duration(a.durationMs)]),8.5);
    paragraph(`Correct answer: ${item.correctLabel}. First attempt: ${item.attempts[0].correct?'correct':'incorrect'}. Latest attempt: ${item.attempts.at(-1).correct?'correct':'incorrect'}. Choice letters refer to the options above.`,{size:9});
    for(const a of item.attempts){
      ensure(100);heading(`Attempt ${a.number} observations`);paragraph(`${a.setLabel} | ${stamp(a.answeredAt)} | Answer ${a.choiceLabel}: ${a.correct?'correct':'incorrect'} | Active time ${duration(a.durationMs)}`,{size:9,font:bold});
      const e=a.facialExpression,m=a.facialMovement,s=a.selfReport;
      if(e){const label=expressionLabel(e.probabilities);paragraph(`Camera estimate: ${label.label}, ${number(label.confidence*100)}% model probability. Sentiment ${number(e.sentimentScore)}; negative-expression score ${number(e.negativeScore)}/100; coinciding excess movement ${number(e.excessMovementScore)}/100. ${e.samples} samples over ${duration(e.observedMs)}.`,{size:9});paragraph(Object.entries(EXPRESSION_LABELS).map(([k,v])=>`${v} ${number(e.probabilities[k]*100)}%`).join(' | '),{size:8});paragraph(`Expression baseline: ${e.baselineId}. Model: ${e.model}.`,{size:8,ink:C.muted});}
      else paragraph('Camera expression: not recorded.',{size:9,ink:C.muted});
      if(m){paragraph(`Facial movement: mean change ${number(m.changeScore)}/100; peak ${number(m.peakChangeScore)}/100. ${m.samples} samples over ${duration(m.observedMs)}. Baseline: ${m.baselineId}.`,{size:9});movementTable(m.metrics);}
      else paragraph('Facial movement: not recorded.',{size:9,ink:C.muted});
      paragraph(s?`Self-report: ${s.emotion}; intensity ${s.intensity}/5; ${s.valence}; sentiment ${number(s.sentimentScore)}.`:'Self-report: not recorded.',{size:9,ink:s?C.ink:C.muted});
      paragraph(`Attempt ID: ${a.id} | Session: ${a.sessionId||'not recorded'}`,{size:7.5,ink:C.muted});
    }
  }

  if(scratchPNG||report.notes){
    addPage('Scratch pad & notes');
    paragraph('Current work for this concept, captured when the report was generated. This drawing is not a historical snapshot of any individual question or attempt.',{size:9,ink:C.muted});
    if(scratchPNG){await picture(scratchPNG,440);if(report.scratch?.saved===false)paragraph('Includes work held in this visit that the browser could not save.',{size:9});}
    else paragraph('No scratch-pad drawing is available.');
    if(report.notes){heading('Current typed notes');paragraph(report.notes);}
  }
  addPage('Concept connections & report scope');
  heading('Skills covered');for(const skill of report.concept.subskills)paragraph(skill,{size:10,gap:6});
  heading('Prerequisites & dependent concepts');
  if(report.connections.length)table(['Connection','Concept'],[110,CW-110],report.connections.map(e=>[e.direction,`${e.concept.id}  ${e.concept.title}`]));
  else paragraph('No direct prerequisite relationships are listed for this concept.');
  paragraph(`Generated ${stamp(report.generatedAt)}. Scoring policy ${report.policyVersion}. This report includes every saved attempt available for this concept, including earlier question versions. Unsubmitted answers and live camera samples are not included.`,{size:9,ink:C.muted});
  paragraph(`Scratch pad: ${scratchPNG?'current drawing included':report.scratch?.saved===false?'could not read saved drawing':'no drawing available'}. Notes and drawings are shared across this concept's practice sessions. Camera images, video and audio are not stored or included.`,{size:9,ink:C.muted});
  doc.getPages().forEach((p,i)=>{page=p;line(H-30);text(`${report.concept.id} | Concept practice report`,M,H-22,8,body,C.muted);text(`${i+1} / ${doc.getPageCount()}`,W-M-45,H-22,8,body,C.muted);});
  return doc.save();
}

export async function createConceptReportPDF(report,mathText){
  const [{reportMathImages},{renderScratch},resources]=await Promise.all([import('./report-math-images.mjs'),import('./scratch-render.mjs'),reportResources()]);
  const images=await reportMathImages(report.items,mathText);let scratchPNG=null;
  if(report.scratch?.strokes?.length){const canvas=document.createElement('canvas');renderScratch(canvas,report.scratch.strokes,2000,1400);scratchPNG=canvas.toDataURL('image/png');}
  return renderConceptReportPDF(report,{...resources,images,scratchPNG});
}
