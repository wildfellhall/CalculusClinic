import algebraFoundations from './algebra-foundations.mjs';
import algebraFunctions from './algebra-functions.mjs';
import calculusFoundations from './calculus-foundations.mjs';
import limits from './calculus-limits.mjs';
import derivatives from './calculus-derivatives.mjs';
import integrals from './calculus-integrals.mjs';
import geometry from './calculus-geometry.mjs';
import series from './calculus-series.mjs';

export const REVISION_VERSION='1.3.0';
// A replacement has a new identity. Never re-grade a saved response to an old
// wording/key as though it were an answer to its replacement.
export function reviseQuestions(originals){
 const originalById=new Map(originals.map(q=>[q.id,q]));
 const replacements=new Map();
 for(const raw of [algebraFoundations,algebraFunctions,calculusFoundations,limits,derivatives,integrals,geometry,series]){
  let conceptId;
  for(const line of raw.trim().split('\n')){
   if(line.startsWith('@')){conceptId=line.slice(1);continue;}
   const fields=line.split('|').map(s=>s.trim());
   if(fields.length!==6||fields.some(s=>!s))throw new Error(`Invalid revision: ${conceptId}: ${line}`);
   const [slot,prompt,correct,wrong1,wrong2,explanation]=fields;
   const replaces=`${conceptId}-Q${slot}`,original=originalById.get(replaces);
   if(!original||replacements.has(replaces))throw new Error(`Unknown or repeated replacement: ${replaces}`);
   const id=`${conceptId}-R2-Q${slot}`;
   const choices=[correct,wrong1,wrong2].map((text,i)=>({id:`${id}-A${i+1}`,text}));
   const offset=[...id].reduce((sum,c)=>sum+c.charCodeAt(0),0)%3;
   replacements.set(replaces,{...original,id,version:REVISION_VERSION,replaces,prompt,explanation,options:choices.slice(offset).concat(choices.slice(0,offset)),correctOptionId:choices[0].id,assessmentStyle:'Calculation, modeling, or application to a specified mathematical case'});
  }
 }
 const questions=originals.map(q=>replacements.get(q.id)??q);
 const archivedQuestions=originals.filter(q=>replacements.has(q.id));
 return {questions,archivedQuestions,attemptQuestions:[...questions,...archivedQuestions],replacements};
}
