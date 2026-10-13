export const COURSE_KEY='calculus-clinic-course-v1';
export const COURSES={
  ALG1:{title:'Algebra I',shortTitle:'Algebra I',monogram:'I',entryId:'MATH_034',startingIds:['MATH_034','MATH_041','MATH_043'],description:'Linear relationships, quadratics, and exponential models, with foundations for review.'},
  ALG2:{title:'Algebra II',shortTitle:'Algebra II',monogram:'II',entryId:'MATH_061',startingIds:['MATH_061','MATH_066','MATH_077'],description:'Functions, logarithms, advanced systems, and rational expressions, with Algebra I prerequisites.'},
  AB:{title:'AP Calculus AB',shortTitle:'AB',monogram:'AB',entryId:'1.2',startingIds:['1.2','2.2','6.3'],description:'Limits, derivatives, integrals, and differential equations.'},
  BC:{title:'AP Calculus BC',shortTitle:'BC',monogram:'BC',entryId:'1.2',startingIds:['1.2','2.2','6.3'],description:'Everything in AB, plus parametric and polar calculus and infinite series.'},
  CALC_SUBSET:{title:'Calculus subset',shortTitle:'subset',monogram:'lim',kind:'subset',targetId:'1.6',entryId:'1.6',startingIds:['1.6','MATH_057','MATH_082'],description:'Factoring-based limits, with connected Algebra I, Algebra II, and earlier prerequisites.'}
};
export const courseTitle=course=>COURSES[course]?.title??course;
export function courseIncludes(course,concept){
  if(!concept||!Object.hasOwn(COURSES,course))return false;
  if(COURSES[course].kind==='subset')return concept.subsets?.includes(course)??false;
  if(course==='ALG1'||course==='ALG2')return concept.curriculum==='algebra'&&(course==='ALG2'||concept.algebraLevel===1);
  return concept.curriculum!=='algebra'&&(course==='BC'||concept.scope!=='BC only');
}
export const relationshipInCourse=(course,edge)=>!edge.courses||edge.courses.includes(course);
// Project prerequisite lists from the same scoped edges used by the graph and
// diagnostic. Base courses retain their original dependency model.
export function courseConcepts(course,concepts,relationships){
  const nodes=concepts.filter(c=>courseIncludes(course,c)),parents=new Map(nodes.map(c=>[c.id,[]]));
  for(const e of relationships)if(e.type==='prerequisite'&&relationshipInCourse(course,e)&&parents.has(e.source)&&parents.has(e.target))parents.get(e.target).push(e.source);
  return nodes.map(c=>({...c,prerequisites:parents.get(c.id)}));
}
export const conceptOrigin=c=>c.curriculum==='algebra'?(c.foundation?'Algebra foundations':c.algebraLevel===1?'Algebra I':'Algebra II'):(c.unit===0?'Calculus foundations':'Calculus');
export function readCourse(storage){
  try{const saved=JSON.parse(storage.getItem(COURSE_KEY));return saved?.version===1&&typeof saved.course==='string'&&Object.hasOwn(COURSES,saved.course)?saved.course:null;}
  catch{return null;}
}
export function saveCourse(storage,course){
  if(typeof course!=='string'||!Object.hasOwn(COURSES,course))throw new Error('Choose an available course.');
  try{storage.setItem(COURSE_KEY,JSON.stringify({version:1,course}));return true;}
  catch{return false;}
}
