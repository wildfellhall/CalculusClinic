import foundations from './questions-foundations.mjs';
import limits from './questions-limits-derivatives.mjs';
import applications from './questions-applications.mjs';
import integration from './questions-integration.mjs';
import geometry from './questions-geometry.mjs';
import series from './questions-series.mjs';
import extraFoundations from './questions-foundations-extra.mjs';
import extraLimits from './questions-limits-derivatives-extra.mjs';
import extraApplications from './questions-applications-extra.mjs';
import extraIntegration from './questions-integration-extra.mjs';
import extraGeometry from './questions-geometry-extra.mjs';
import extraSeries from './questions-series-extra.mjs';

export const BANK_VERSION = '1.1.0';
export const COMPATIBLE_BANK_VERSIONS = ['1.0.0', BANK_VERSION];

// Each concept has ten independently authored items. Original Q1–Q5 records
// retain their exact IDs, option order, answers and item version for saved work.
// New Q6–Q10 records are appended with item version 1.1.0. The correct answer is
// first in each editable row; display positions rotate reproducibly by ID.
function parseQuestions(raw,version,startIndex=0){
  let conceptId='',index=startIndex;
  return raw.trim().split('\n').flatMap(line=>{
    if(line.startsWith('@')){conceptId=line.slice(1);index=startIndex;return [];}
    const fields=line.split('|').map(s=>s.trim());
    if(!conceptId||fields.length!==5||fields.some(s=>!s))throw new Error(`Invalid question fields: ${conceptId}: ${line}`);
    const [prompt,correct,wrong1,wrong2,explanation]=fields;
    const id=`${conceptId}-Q${++index}`;
    const seed=[...id].reduce((n,c)=>n+c.charCodeAt(0),0);
    const choices=[correct,wrong1,wrong2].map((text,i)=>({id:`${id}-A${i+1}`,text}));
    const offset=seed%3;
    const options=choices.slice(offset).concat(choices.slice(0,offset));
    return [{id,conceptId,version,prompt,options,correctOptionId:choices[0].id,explanation,format:'single-choice',authorship:'Original Calculus Clinic item',validation:'Author-reviewed; not a calibrated assessment'}];
  });
}
export const questions = [
  ...[foundations,limits,applications,integration,geometry,series].flatMap(raw=>parseQuestions(raw,'1.0.0')),
  ...[extraFoundations,extraLimits,extraApplications,extraIntegration,extraGeometry,extraSeries].flatMap(raw=>parseQuestions(raw,BANK_VERSION,5)),
];
