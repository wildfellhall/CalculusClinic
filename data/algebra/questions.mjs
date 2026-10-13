import number from './questions-number.mjs';
import linear from './questions-linear.mjs';
import algebra1 from './questions-algebra1.mjs';
import algebra2 from './questions-algebra2.mjs';
import {algebraId} from './standards.mjs';
export const ALGEBRA_BANK_VERSION='1.2.0';
function parse(raw){
 let conceptId,index;
 return raw.trim().split('\n').flatMap(line=>{
  if(line.startsWith('@')){conceptId=algebraId(line.slice(1));index=0;return [];}
  const fields=line.split('|').map(s=>s.trim());
  if(!conceptId||fields.length!==5||fields.some(s=>!s))throw new Error(`Invalid Algebra item: ${line}`);
  const [prompt,correct,wrong1,wrong2,explanation]=fields,id=`${conceptId}-Q${++index}`;
  const choices=[correct,wrong1,wrong2].map((text,i)=>({id:`${id}-A${i+1}`,text}));
  const offset=[...id].reduce((sum,c)=>sum+c.charCodeAt(0),0)%3;
  return [{id,conceptId,version:ALGEBRA_BANK_VERSION,prompt,options:choices.slice(offset).concat(choices.slice(0,offset)),correctOptionId:choices[0].id,explanation,format:'single-choice',authorship:'Original Calculus Clinic Algebra item',validation:'Author-reviewed sampled practice; not a calibrated assessment'}];
 });
}
export const questions=[number,linear,algebra1,algebra2].flatMap(parse);
