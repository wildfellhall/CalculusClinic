import {courseTitle,conceptOrigin} from './course.mjs';
import {REPORT_VIEWS,reportScore} from './report-data.mjs';
import {DIAGNOSTIC_LABELS} from './diagnostic.mjs';
import {graphLayout,masteryFill,MASTERY_SCALE} from './graph.mjs';
import {MOVEMENT_SCALE,MOVEMENT_BORDER_SCALE,movementWidth} from './graph-views.mjs';
import {combinedExplanation,cameraScoreExplanation} from './score-policy.mjs';

const C={ink:'#294637',muted:'#617468',paper:'#FFFEFA',mint:'#DDFEEA',line:'#BCD8C5',lilac:'#EEE7F8',peach:'#FCE6DA'};
const plain=value=>String(value??'').replace(/[\u2010-\u2015\u2212]/g,'-').replaceAll('→','to').replace(/[\u0000-\u0008\u000b-\u001f]/g,'');
const signed=value=>value===null?'Not recorded':`${value>0?'+':''}${reportScore(value)}`;
const date=value=>new Date(value).toISOString().slice(0,10);

// The same renderer runs in a browser and in the PDF QA script. All text and
// graph geometry stay vector-based; large graph sheets retain readable type.
export async function renderReportPDF(report,units,{PDFLib,fontkit,fonts}){
  const {PDFDocument,rgb}=PDFLib,doc=await PDFDocument.create();doc.registerFontkit(fontkit);
  const [body,bold,display]=await Promise.all(fonts.map(bytes=>doc.embedFont(bytes,{subset:true})));
  doc.setTitle(`Calculus Clinic - ${courseTitle(report.course)} report`);doc.setAuthor('Calculus Clinic');doc.setCreator('Calculus Clinic');doc.setCreationDate(new Date(report.generatedAt));
  const color=hex=>rgb(...hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255));
  let page,W,H,y;const margin=38,standard=[841.89,595.28];
  const text=(value,x,top,size=11,font=body,ink=C.ink)=>page.drawText(plain(value),{x,y:H-top-size,size,font,color:color(ink)});
  const line=(x1,y1,x2,y2,ink=C.line,width=1)=>page.drawLine({start:{x:x1,y:H-y1},end:{x:x2,y:H-y2},color:color(ink),thickness:width});
  const box=(x,top,w,h,fill=C.paper,stroke=C.line,r=10,borderWidth=.8)=>{
    page.drawSvgPath(`M${r},0 H${w-r} Q${w},0 ${w},${r} V${h-r} Q${w},${h} ${w-r},${h} H${r} Q0,${h} 0,${h-r} V${r} Q0,0 ${r},0 Z`,{x,y:H-top,color:color(fill),borderColor:color(stroke),borderWidth});
  };
  const wrap=(value,width,size=11,font=body)=>{
    const lines=[];
    for(const paragraph of plain(value).split('\n')){
      let current='';
      for(const word of paragraph.split(/\s+/)){
        if(font.widthOfTextAtSize((current?current+' ':'')+word,size)<=width){current+=(current?' ':'')+word;continue;}
        if(current)lines.push(current);current='';
        for(const char of word){if(font.widthOfTextAtSize(current+char,size)>width&&current){lines.push(current);current='';}current+=char;}
      }
      lines.push(current);
    }
    return lines;
  };
  function addPage(title,subtitle='',size=standard){
    page=doc.addPage(size);[W,H]=size;
    page.drawRectangle({x:0,y:0,width:W,height:H,color:color(C.paper)});
    text('CALCULUS CLINIC',margin,22,9,bold,C.muted);
    text(`${courseTitle(report.course)}  |  ${date(report.generatedAt)}`,W-235,22,9,body,C.muted);
    text(title,margin,46,26,display);y=87;
    if(subtitle){const lines=wrap(subtitle,W-2*margin,10);for(const l of lines){text(l,margin,y,10,body,C.muted);y+=14;}y+=6;}
    line(margin,y,W-margin,y);y+=18;
  }
  function paragraph(value,{size=11,font=body,ink=C.ink,gap=10}={}){
    const lines=wrap(value,W-2*margin,size,font);
    for(const l of lines){if(y+size*1.45>H-45)addPage('Report notes - continued');text(l,margin,y,size,font,ink);y+=size*1.45;}y+=gap;
  }
  function heading(value){if(y+55>H-45)addPage('Insights - continued');text(value,margin,y,17,display);y+=29;}
  function table(headers,widths,rows,{continued='Concept details - continued',size=10}={}){
    const header=()=>{box(margin,y,W-2*margin,27,C.mint,C.line,5);let x=margin;headers.forEach((h,i)=>{text(h,x+8,y+7,9,bold);x+=widths[i];});y+=27;};
    if(y+65>H-45)addPage(continued);header();
    for(const cells of rows){
      const lines=cells.map((c,i)=>wrap(c,widths[i]-16,size)),height=Math.max(...lines.map(l=>l.length))*size*1.35+(size<=9?12:16);
      if(y+height>H-45){addPage(continued);header();}
      let x=margin;lines.forEach((ls,i)=>{ls.forEach((l,j)=>text(l,x+8,y+8+j*size*1.35,size));x+=widths[i];});y+=height;line(margin,y,W-margin,y,C.line,.5);
    }y+=16;
  }
  const name=r=>`${r.concept.id}  ${r.concept.title}`;
  const number=value=>value===null?'--':reportScore(value);
  const period=report.dateRange?`${date(report.dateRange[0])} to ${date(report.dateRange[1])}`:'No saved answers';
  addPage(`Your ${courseTitle(report.course)} report`,`Practice snapshot: ${period}  |  ${report.attemptCount} saved attempts, including retries`);
  const cardW=(W-2*margin-28)/3,top=y;
  REPORT_VIEWS.forEach(([mode,label],i)=>{
    const x=margin+i*(cardW+14),r=report.profile.rows[mode];box(x,top,cardW,108,mode==='movement'?C.lilac:C.mint);
    text(label,x+16,top+12,12,bold);text(r.score===null?'No data':`${reportScore(r.score)} / 100`,x+16,top+33,25,display);
    box(x+16,top+75,cardW-32,5,'#E6EDE4','#E6EDE4',2,0);if(r.score>0)box(x+16,top+75,(cardW-32)*r.score,5,mode==='movement'?'#BBA3D6':'#80B395',C.line,Math.min(2,(cardW-32)*r.score/2),0);
    text(`${r.count}/${report.profile.total} concepts scored`,x+16,top+87,9,body,C.muted);
  });y=top+126;
  paragraph('Course averages give each scored concept equal weight. Missing evidence is excluded and counted separately. Emotion scores use camera expression estimates; they are a different index from answer accuracy.',{size:10,ink:C.muted});
  const s=report.diagnostic.summary;
  paragraph(`${s.passed} passed  |  ${s.review} review suggested  |  ${s.partial} partially tested  |  ${s.unseen} not checked`,{font:bold});
  heading('What changes between views');
  paragraph(report.profile.combinedDelta===null?'Answer questions to begin comparing the accuracy and combined views.':`The combined course average changes by ${signed(report.profile.combinedDelta)} points from accuracy. Self-reported check-ins are ${report.preferences.includeSelfReports?'included':'excluded'} in that adjustment.`);
  const p=report.comparable;
  paragraph(p.count?`On the same ${p.count} concepts with both answers and camera estimates: accuracy ${reportScore(p.accuracy)}, emotions ${reportScore(p.emotions)}, and both ${reportScore(p.combined)} out of 100. The emotion-minus-accuracy gap is ${signed(p.emotions-p.accuracy)} points. This compares the displays; it does not establish a cause for errors.`:'No concepts have both answers and usable camera expression estimates yet. Emotion-versus-accuracy comparisons remain unscored.',{size:10});
  heading('Next check');
  const next=report.diagnostic.recommendation,target=report.rows.find(r=>r.concept.id===next.targetId);
  paragraph(target?`${name(target)}. ${next.reason}`:next.reason,{size:11});

  addPage('Strengths & skills to revisit','These groups use completed answer checks. Camera and check-in scores do not decide whether a skill passes.');
  const skillRows=list=>list.slice(0,6).map(r=>[name(r),`${r.latestCorrect}/${r.available}`,r.concept.subskills.slice(0,3).join('; ')]);
  heading(`Strong points (${report.strengths.length})`);
  if(report.strengths.length)table(['Concept','Correct','Skills checked'],[295,75,W-2*margin-370],skillRows(report.strengths),{continued:'Strong points - continued'});
  else paragraph('No completed concepts have reached the 8/10 pass threshold yet. Partial checks are listed separately.');
  heading(`Weak skills to review (${report.weak.length})`);
  if(report.weak.length){table(['Concept','Correct','Review these skills'],[295,75,W-2*margin-370],skillRows(report.weak),{continued:'Skills to review - continued'});paragraph('Each list shows up to six concepts. See the complete concept ledger for every result.',{size:9,ink:C.muted});}
  else paragraph('No completed checks are below the pass threshold. Untested skills have not been counted as strengths.');
  if(report.partial.length){heading('Finish gathering evidence');paragraph(report.partial.slice(0,5).map(r=>`${name(r)} (${r.attempted}/${r.available} tried)`).join('; '),{size:10});}

  addPage('Emotion & accuracy differences','Largest gaps on concepts that have both data sources. All scores are on a 0-100 display scale.');
  if(report.differences.length)table(['Concept','Accuracy','Emotions','Gap','Camera estimate'],[280,70,70,65,W-2*margin-485],report.differences.slice(0,8).map(r=>[name(r),number(r.accuracy),number(r.emotions),signed(r.emotionDelta),`${r.expression.label}\n${Math.round(r.expression.confidence*100)}% model probability`]),{continued:'Emotion & accuracy differences - continued'});
  else paragraph('There are no paired answer and camera records to compare. Missing camera data is not treated as a neutral or negative emotion.');
  heading('Largest combined-score reductions');
  if(report.adjustments.length)table(['Concept','Accuracy','Both','Change','Credit reduction'],[280,65,65,70,W-2*margin-480],report.adjustments.slice(0,6).map(r=>[name(r),number(r.accuracy),number(r.combined),signed(r.delta),`Camera ${reportScore(r.scoring.cameraAdjustment)}%\nCheck-ins ${reportScore(r.scoring.selfReportAdjustment)}%`]),{continued:'Combined-score reductions - continued'});
  else paragraph('No saved observations currently reduce the combined score.');

  addPage('How to read this report');
  heading('Accuracy, emotions and both');
  paragraph('Accuracy fill is latest correct answers divided by all questions in the concept. A partially tested concept has not yet earned full coverage. Passing requires all ten questions tried and at least eight latest answers correct. Strong and weak skill lists rely only on completed answer checks.',{size:10});
  paragraph(cameraScoreExplanation(),{size:10});paragraph(combinedExplanation(report.preferences),{size:10});
  paragraph('Camera labels are experimental expression estimates, not direct measurements of felt emotion or understanding. The model has no frustration class. Repeated camera observations are weighted by usable sample count within a concept; course means give each concept equal weight. Self-report and camera evidence remain separate.',{size:10});
  heading('Graph sheets & concept ledger');
  paragraph(`The following three sheets show ${report.map.label.toLowerCase()} (${report.map.concepts.length} concepts), using the same scores and connections as the app. Large graph sheets expand to keep type readable when zoomed. They are vector graphics. The final ledger includes all ${report.rows.length} concepts in ${courseTitle(report.course)}, including foundations.`,{size:10});
  paragraph(`Generated ${report.generatedAt}. Scoring policy ${report.policyVersion}. A snapshot of saved local numeric data; no camera images, video or audio are included.`,{size:9,ink:C.muted});

  for(const [mode,label] of REPORT_VIEWS){
    const progress=report.views[mode],layout=graphLayout(report.map.concepts,report.map.edges,{focus:report.map.focus,progress});
    const scale=Math.max(.8,Math.min(1,(standard[0]-2*margin)/layout.width,(standard[1]-190)/layout.height));
    const size=[Math.max(standard[0],layout.width*scale+2*margin),Math.max(standard[1],layout.height*scale+190)];
    addPage(`${label} - graph view`,`${report.map.label}  |  ${layout.nodes.length} concepts  |  Arrows: prerequisite to dependent. Dashed: other connections.`,size);
    const legendTop=y;
    [null,0,.25,.5,.75,1].forEach((v,i)=>{const x=margin+i*106;box(x,legendTop,13,13,masteryFill(v,mode==='movement'?MOVEMENT_SCALE:MASTERY_SCALE),C.line,3);text(v===null?'No data':reportScore(v),x+19,legendTop+1,9);});
    y+=24;text(mode==='combined'?'Purple border: facial movement change. Purple tag: next check.':mode==='movement'?'Camera expression index; higher scores are darker. Purple tag: next check.':'Latest correct answers divided by all questions. Purple tag: next check.',margin,y,9,body,C.muted);y+=22;
    const ox=(W-layout.width*scale)/2,oy=y,byId=new Map(layout.nodes.map(n=>[n.id,n]));
    for(const e of layout.edges){
      const a=byId.get(e.source),b=byId.get(e.target),forward=b.x>a.x;
      const x1=a.x+(forward?a.w:a.w/2),y1=a.y+(forward?a.h/2:a.h),x2=b.x+(forward?0:b.w/2),y2=b.y+(forward?b.h/2:0);
      const d=forward?`M${x1},${y1} C${x1+40},${y1} ${x2-40},${y2} ${x2-7},${y2}`:`M${x1},${y1} C${x1+48},${y1+35} ${x2+48},${y2-35} ${x2},${y2-7}`;
      const ink=e.type==='prerequisite'?'#92B9A5':'#9985BB';
      page.drawSvgPath(d,{x:ox,y:H-oy,scale,borderColor:color(ink),borderWidth:1.5,...(e.type==='prerequisite'?{}:{borderDashArray:[5,5]})});
      page.drawSvgPath(forward?`M${x2},${y2} L${x2-9},${y2-4} L${x2-9},${y2+4} Z`:`M${x2},${y2} L${x2-4},${y2-9} L${x2+4},${y2-9} Z`,{x:ox,y:H-oy,scale,color:color(ink)});
    }
    for(const n of layout.nodes){
      const s=progress.get(n.id),d=s.display,x=ox+n.x*scale,top=oy+n.y*scale,w=n.w*scale,h=n.h*scale,next=n.id===report.diagnostic.recommendation.targetId;
      const border=mode==='combined'&&d.change!==null?masteryFill(d.change/100,MOVEMENT_BORDER_SCALE):C.line;
      box(x,top,w,h,masteryFill(d.score,mode==='movement'?MOVEMENT_SCALE:MASTERY_SCALE),border,10,mode==='combined'&&d.change!==null?movementWidth(d.change/100)*scale:1);
      box(x+10*scale,top+10*scale,Math.max(44,n.id.length*6.5+12)*scale,18*scale,units.find(u=>u.id===n.unit).color,C.line,4,.5);text(n.id,x+16*scale,top+12*scale,10*scale);
      if(next){box(x+w-80*scale,top+10*scale,70*scale,18*scale,C.lilac,'#B9A7D0',4,.5);text('Next check',x+w-74*scale,top+12*scale,9*scale);}
      if(layout.showOrigins)text(conceptOrigin(n),x+13*scale,top+33*scale,9*scale,body,C.muted);
      wrap(n.title,w-26*scale,12.5*scale,bold).forEach((l,i)=>text(l,x+13*scale,top+(40+(layout.showOrigins?18:0)+i*16)*scale,12.5*scale,bold));
      const reportSpace=d.expression?24:0;
      text(d.label,x+13*scale,top+h-(42+reportSpace)*scale,10*scale);
      text(DIAGNOSTIC_LABELS[s.status],x+13*scale,top+h-(26+reportSpace)*scale,10*scale);
      if(d.expression){box(x+9*scale,top+h-26*scale,w-18*scale,19*scale,'#FFF2D9','#DFCEB0',4,.5);text(`Est. ${d.expression.label}${d.expression.label==='Mixed / uncertain'?'':` ${Math.round(d.expression.confidence*100)}%`}`,x+14*scale,top+h-23*scale,9*scale);}
    }
  }

  addPage('Complete concept ledger','All concepts in the selected course. Blank evidence stays unscored; partial checks are not classified as weak skills.');
  table(['Concept','Tried','Correct','Accuracy','Emotions','Both','Status'],[280,50,55,70,70,65,W-2*margin-590],report.rows.map(r=>[name(r),`${r.attempted}/${r.available}`,r.attempted?`${r.latestCorrect}/${r.available}`:'--',number(r.accuracy),number(r.emotions),number(r.combined),DIAGNOSTIC_LABELS[r.status]]),{continued:'Concept ledger - continued',size:9});
  const pages=doc.getPages();pages.forEach((p,i)=>{page=p;W=p.getWidth();H=p.getHeight();line(margin,H-30,W-margin,H-30);text('Calculus Clinic  |  Personal practice report',margin,H-22,8,body,C.muted);text(`${i+1} / ${pages.length}`,W-margin-40,H-22,8,body,C.muted);});
  return doc.save();
}

let resources;
export async function reportResources(){
  resources??=Promise.all([import('/vendor/pdf/pdf-lib.min.js'),import('/vendor/pdf/fontkit.umd.min.js'),...['nunito','nunito-bold','fraunces'].map(async name=>{const r=await fetch(`/fonts/${name}.ttf`);if(!r.ok)throw new Error('Report fonts could not be loaded.');return r.arrayBuffer();})]).then(([, ,...fonts])=>({PDFLib:globalThis.PDFLib,fontkit:globalThis.fontkit,fonts})).catch(error=>{resources=null;throw error;});
  return resources;
}

export async function createReportPDF(report,units){return renderReportPDF(report,units,await reportResources());}
