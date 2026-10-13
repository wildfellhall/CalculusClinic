export const COURSE_KEY='calculus-clinic-course-v1';
export const COURSES={
  ALG1:{title:'Algebra I',shortTitle:'Algebra I',monogram:'I',entryId:'MATH_034',startingIds:['MATH_034','MATH_041','MATH_043'],description:'Linear relationships, quadratics, and exponential models, with foundations for review.'},
  ALG2:{title:'Algebra II',shortTitle:'Algebra II',monogram:'II',entryId:'MATH_061',startingIds:['MATH_061','MATH_066','MATH_077'],description:'Functions, logarithms, advanced systems, and rational expressions, with Algebra I prerequisites.'},
  AB:{title:'AP Calculus AB',shortTitle:'AB',monogram:'AB',entryId:'1.2',startingIds:['1.2','2.2','6.3'],description:'Limits, derivatives, integrals, and differential equations.'},
  BC:{title:'AP Calculus BC',shortTitle:'BC',monogram:'BC',entryId:'1.2',startingIds:['1.2','2.2','6.3'],description:'Everything in AB, plus parametric and polar calculus and infinite series.'}
};
export const courseTitle=course=>COURSES[course]?.title??course;
export function courseIncludes(course,concept){
  if(!concept||!Object.hasOwn(COURSES,course))return false;
  if(course==='ALG1'||course==='ALG2')return concept.curriculum==='algebra'&&(course==='ALG2'||concept.algebraLevel===1);
  return concept.curriculum!=='algebra'&&(course==='BC'||concept.scope!=='BC only');
}
export function readCourse(storage){
  try{const saved=JSON.parse(storage.getItem(COURSE_KEY));return saved?.version===1&&typeof saved.course==='string'&&Object.hasOwn(COURSES,saved.course)?saved.course:null;}
  catch{return null;}
}
export function saveCourse(storage,course){
  if(typeof course!=='string'||!Object.hasOwn(COURSES,course))throw new Error('Choose an available course.');
  try{storage.setItem(COURSE_KEY,JSON.stringify({version:1,course}));return true;}
  catch{return false;}
}
