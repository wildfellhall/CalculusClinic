import {questionAlignment} from './algebra/question-alignment.mjs';

// Course boundaries verified against TEKS §§111.39–40 and AP CED Units 1–10.
// Keeping this inventory separate from the ontology detects silent omissions.
export const AP_TOPIC_COUNTS=[16,10,6,7,12,14,9,13,9,15];
export const TEKS_SECTION_COUNTS={ALG1:[7,9,8,3,3,3,3,2,5,6,2,5],ALG2:[7,4,7,8,5,12,9,3]};
export const COVERAGE_SCOPE={
 algebra:'All content expectations in Texas TEKS Algebra I §111.39 and Algebra II §111.40, plus preserved arithmetic/pre-algebra prerequisites.',
 calculus:'All 111 AP Calculus BC CED topics, with the AB subset identified separately, plus 16 prerequisite groups.',
 assessment:'Ten original selected-response problems per node sample calculation, modeling, and application. Independent graph construction, extended written arguments, and technology operation are not fully assessed by selected responses.',
};
export function validateCoverageInventory(concepts,standards){
 const check=(actual,expected,label)=>{
  const got=new Set(actual),wanted=new Set(expected);
  if(got.size!==actual.length||got.size!==wanted.size||expected.some(id=>!got.has(id)))throw new Error(`Incomplete or duplicate ${label} inventory`);
 };
 check(concepts.filter(c=>c.cedTopic).map(c=>c.cedTopic),AP_TOPIC_COUNTS.flatMap((count,i)=>Array.from({length:count},(_,j)=>`${i+1}.${j+1}`)),'AP topic');
 for(const [course,counts] of Object.entries(TEKS_SECTION_COUNTS)){
  check(standards.filter(s=>s.course===course).map(s=>s.id),counts.flatMap((count,i)=>Array.from({length:count},(_,j)=>`${course==='ALG1'?'A':'A2'}.${i+1}${String.fromCharCode(65+j)}`)),course+' TEKS');
 }
 for(const s of standards){
  if(!s.conceptIds.length||s.conceptIds.some(id=>!concepts.some(c=>c.id===id)))throw new Error(`Unrepresented standard ${s.id}`);
 }
}
export function curriculumCoverage(concepts,questions,standards){
 validateCoverageInventory(concepts,standards);
 const evidence=questionAlignment(questions);
 const byQuestion=new Map(questions.map(q=>[q.id,q]));
 const rows=standards.map(s=>{
  const questionIds=s.kind==='content'?evidence.get(s.id):questions.filter(q=>s.conceptIds.includes(q.conceptId)).map(q=>q.id);
  if(!questionIds?.length)throw new Error(`No question evidence for ${s.id}`);
  for(const id of questionIds)if(!s.conceptIds.includes(byQuestion.get(id)?.conceptId))throw new Error(`Question ${id} not in mapped nodes for ${s.id}`);
  return {...s,questionIds,questionCount:questionIds.length,coverage:s.kind==='content'?'Represented in ontology; specific sampled problem evidence':'Integrated supporting practice; not a full assessment of the process standard',assessmentLimit:COVERAGE_SCOPE.assessment};
 });
 for(const c of concepts.filter(c=>c.cedTopic)){
  const questionIds=questions.filter(q=>q.conceptId===c.id).map(q=>q.id);
  rows.push({id:`AP.${c.cedTopic}`,reference:`AP CED Topic ${c.cedTopic}`,course:c.scope==='BC only'?'BC':'AB & BC',kind:'content',summary:c.objective,conceptIds:[c.id],questionIds,questionCount:questionIds.length,coverage:'Represented in ontology; sampled problems',assessmentLimit:COVERAGE_SCOPE.assessment,sourceUrl:'https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf'});
 }
 return rows;
}
