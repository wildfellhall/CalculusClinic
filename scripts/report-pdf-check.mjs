// Deterministic fabricated records for PDF rendering QA; no user data or camera.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as PDFLib from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {concepts,relationships,units} from '../data/curriculum.mjs';
import {questions} from '../data/questions.mjs';
import {ExpressionSummary,EXPRESSION_LABELS} from '../src/expressions.mjs';
import {selfReport} from '../src/observations.mjs';
import {reportData} from '../src/report-data.mjs';
import {renderReportPDF} from '../src/report-pdf.mjs';
const fonts=await Promise.all(['nunito','nunito-bold','fraunces'].map(n=>readFile('public/fonts/'+n+'.ttf')));
const expression=key=>{const s=new ExpressionSummary('qa');for(let i=0;i<4;i++)s.add(Object.fromEntries(Object.keys(EXPRESSION_LABELS).map(k=>[k,k===key?1:0])),80,i*200);return s.finish();};
const sample=concepts.flatMap((c,ci)=>questions.filter(q=>q.conceptId===c.id).slice(0,ci%4===0?3:10).map((q,i)=>{const correct=i<(ci%3===0?9:ci%3===1?7:5);return {id:q.id,questionId:q.id,conceptId:q.conceptId,bankVersion:q.version,choiceId:correct?q.correctOptionId:q.options.find(o=>o.id!==q.correctOptionId).id,correct,answeredAt:new Date(Date.UTC(2026,9,12,ci,i)).toISOString(),sessionId:'pdf-qa',durationMs:120000,...(i===0&&ci%5!==0?{facialExpression:expression(Object.keys(EXPRESSION_LABELS)[ci%7]),selfReport:selfReport({emotion:'fear',intensity:4,valence:'unpleasant'})}:{})};}));
const focusIds=['1.11',...relationships.filter(e=>e.source==='1.11'||e.target==='1.11').flatMap(e=>[e.source,e.target])];
await mkdir('test-results/pdfs',{recursive:true});
for(const [name,options] of [
  ['focus',{attempts:sample,preferences:{includeSelfReports:true},mapIds:focusIds,mapFocus:'1.11',mapLabel:'Connections around 1.11'}],
  ['whole-course',{attempts:sample}],
  ['empty',{attempts:[],course:'AB',mapIds:focusIds,mapFocus:'1.11',mapLabel:'Connections around 1.11'}],
]){
  const report=reportData({concepts,relationships,questions,generatedAt:'2026-10-12T12:00:00.000Z',...options});
  const bytes=await renderReportPDF(report,units,{PDFLib,fontkit,fonts}),pdf=await PDFLib.PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount()>7);assert.ok(bytes.length<2_000_000);assert.ok(pdf.getPages().every(p=>p.getWidth()<14400&&p.getHeight()<14400));
  await writeFile(`test-results/pdfs/${name}.pdf`,bytes);
  console.log(`PASS ${name}: ${pdf.getPageCount()} pages, ${bytes.length} bytes`);
}
